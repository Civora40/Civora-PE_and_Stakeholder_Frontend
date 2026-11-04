import { cookies } from 'next/headers';
import { ActivityRecord, CivoraUser, Project, ProjectTask, SessionData, Submission, UserRole } from '@/types';
import { getMockUserByRole, registerMockUser } from './mock-adapter';
import { fetchBackend } from '@/lib/api/backend-client';
import { DEMO_ACTIVITIES, DEMO_PROJECTS, DEMO_SUBMISSIONS, DEMO_TASKS } from '@/lib/mock-data/fixtures';

const SESSION_COOKIE_NAME = 'civora_session';
const REFRESH_COOKIE_NAME = 'civora_refresh';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

/**
 * Strips duplicate backend snake_case fields and bulky questionnaire arrays
 * so the base64-encoded `civora_session` cookie stays ~1.4 KB (well below
 * the 4,096-byte RFC 6265 browser cookie limit).
 */
function compactUserForCookie(user: CivoraUser): CivoraUser {
  const u = user as CivoraUser & Record<string, unknown>;
  const onboardingCompletedAt =
    u.onboardingCompletedAt ??
    (typeof u.onboarding_completed_at === 'string' && u.onboarding_completed_at
      ? new Date(u.onboarding_completed_at).getTime()
      : null);

  return {
    id: u.id,
    name: u.name || (typeof u.full_name === 'string' ? u.full_name : '') || '',
    firstName: u.firstName || (typeof u.first_name === 'string' ? u.first_name : '') || '',
    lastName: u.lastName || (typeof u.last_name === 'string' ? u.last_name : '') || '',
    displayName: u.displayName || (typeof u.display_name === 'string' ? u.display_name : '') || '',
    email: u.email,
    role: u.role,
    title: u.title || u.jobTitle || '',
    jobTitle: u.jobTitle || u.title || '',
    department: u.department || '',
    organization: u.organization || (typeof u.organization_name === 'string' ? u.organization_name : '') || '',
    phone: u.phone || (typeof u.phone_number === 'string' ? u.phone_number : '') || '',
    timeZone: u.timeZone || (typeof u.time_zone === 'string' ? u.time_zone : '') || '',
    corenNumber: u.corenNumber || (typeof u.professional_registration === 'string' ? u.professional_registration : '') || '',
    corenStatus: u.corenStatus || (u.coren_status as CivoraUser['corenStatus']) || 'unregistered',
    corenCategory: u.corenCategory || '',
    nseNumber: u.nseNumber || (typeof u.nse_number === 'string' ? u.nse_number : '') || '',
    cacNumber: u.cacNumber || '',
    officeState: u.officeState || '',
    reviewSla: u.reviewSla || '24h',
    defaultSpec: u.defaultSpec || 'Eurocode 2 / FMWH Civil Standards',
    requireLabBreakCert: typeof u.requireLabBreakCert === 'boolean' ? u.requireLabBreakCert : true,
    requireGeotaggedPhotos: typeof u.requireGeotaggedPhotos === 'boolean' ? u.requireGeotaggedPhotos : true,
    autoFlagLowStrength: typeof u.autoFlagLowStrength === 'boolean' ? u.autoFlagLowStrength : true,
    inboundSubmissionsAlert: typeof u.inboundSubmissionsAlert === 'boolean' ? u.inboundSubmissionsAlert : true,
    whatsappPushAlerts: typeof u.whatsappPushAlerts === 'boolean' ? u.whatsappPushAlerts : true,
    telegramBotAlerts: typeof u.telegramBotAlerts === 'boolean' ? u.telegramBotAlerts : true,
    criticalDiscrepancyAlerts: typeof u.criticalDiscrepancyAlerts === 'boolean' ? u.criticalDiscrepancyAlerts : true,
    weeklyComplianceDigest: typeof u.weeklyComplianceDigest === 'boolean' ? u.weeklyComplianceDigest : true,
    sessionTimeout: u.sessionTimeout || '1h',
    twoFactorEnabled: typeof u.twoFactorEnabled === 'boolean' ? u.twoFactorEnabled : true,
    notifyReleasedReports: typeof u.notifyReleasedReports === 'boolean' ? u.notifyReleasedReports : true,
    notifyMilestones: typeof u.notifyMilestones === 'boolean' ? u.notifyMilestones : true,
    notifyAnnouncements: typeof u.notifyAnnouncements === 'boolean' ? u.notifyAnnouncements : true,
    channelEmail: typeof u.channelEmail === 'boolean' ? u.channelEmail : true,
    channelInApp: typeof u.channelInApp === 'boolean' ? u.channelInApp : true,
    dateFormat: u.dateFormat || 'DD MMM YYYY',
    highContrast: typeof u.highContrast === 'boolean' ? u.highContrast : false,
    accountStatus: u.accountStatus || (u.account_status as CivoraUser['accountStatus']) || 'active',
    assignedProjects: Array.isArray(u.assignedProjects) ? u.assignedProjects.slice(0, 10) : [],
    onboardingStep: typeof u.onboardingStep === 'number' ? u.onboardingStep : (typeof u.onboarding_step === 'number' ? u.onboarding_step : 1),
    onboardingCompletedAt: onboardingCompletedAt || null,
  };
}

/**
 * Encode session data into cookie-safe base64 string
 */
function serializeSession(session: SessionData): string {
  return Buffer.from(JSON.stringify(session)).toString('base64');
}

/**
 * Decode session data from base64 string with validation
 */
function deserializeSession(raw: string): SessionData | null {
  try {
    const json = Buffer.from(raw, 'base64').toString('utf-8');
    const data = JSON.parse(json) as SessionData;

    if (!data.user || !data.expiresAt) {
      return null;
    }

    if (Date.now() > data.expiresAt) {
      return null; // Expired
    }

    return data;
  } catch {
    return null;
  }
}

export interface SessionTokens {
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Server-side helper to create and store session cookie
 */
export async function createSession(user: CivoraUser, tokens?: SessionTokens): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + SESSION_DURATION_MS;

  const sessionData: SessionData = {
    user: compactUserForCookie(user),
    accessToken: tokens?.accessToken,
    createdAt: Date.now(),
    expiresAt,
  };

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };

  cookieStore.set(SESSION_COOKIE_NAME, serializeSession(sessionData), cookieOptions);

  if (tokens?.refreshToken) {
    cookieStore.set(REFRESH_COOKIE_NAME, tokens.refreshToken, cookieOptions);
  }
}

/**
 * Server-side helper to retrieve full session (user + JWT tokens)
 */
export async function getSessionData(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!cookie?.value) {
      return null;
    }

    return deserializeSession(cookie.value);
  } catch {
    return null;
  }
}

/**
 * Server-side helper to retrieve current authenticated user
 */
export async function getCurrentUser(): Promise<CivoraUser | null> {
  const session = await getSessionData();
  return session ? session.user : null;
}

/**
 * Server-side helper that fetches the freshest profile from `/users/me/` on the
 * backend when an access token is present, falling back to the session user.
 */
export async function getFreshCurrentUser(): Promise<CivoraUser | null> {
  const session = await getSessionData();
  if (!session?.user) {
    return null;
  }

  if (session.accessToken) {
    try {
      const backendRes = await fetchBackend<CivoraUser>('/users/me/', {
        method: 'GET',
        accessToken: session.accessToken,
      });
      if (backendRes.ok && backendRes.data) {
        return {
          ...session.user,
          ...backendRes.data,
        };
      }
    } catch {
      // Fall back to session user
    }
  }

  return session.user;
}

/**
 * Update current authenticated user profile / onboarding fields in session
 */
export async function updateSessionUser(updates: Partial<CivoraUser>): Promise<CivoraUser | null> {
  const session = await getSessionData();
  if (!session) {
    return null;
  }

  const updatedUser: CivoraUser = {
    ...session.user,
    ...updates,
  };

  registerMockUser(updatedUser);

  await createSession(updatedUser, {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  });
  return updatedUser;
}

/**
 * Clear session cookie (sign-out)
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
}

/**
 * Switch active role in development/demo mode
 */
export async function switchDemoRole(role: UserRole): Promise<CivoraUser> {
  const user = getMockUserByRole(role);
  await createSession(user);
  return user;
}

/**
 * Normalize backend project records and merge with any in-session projects.
 */
export async function getServerProjects(): Promise<Project[]> {
  const session = await getSessionData();
  if (session?.accessToken) {
    try {
      const backendRes = await fetchBackend<
        Project[] | { results?: Project[]; projects?: Project[] }
      >('/projects/', {
        method: 'GET',
        accessToken: session.accessToken,
      });

      if (backendRes.ok && backendRes.data) {
        const rawList = Array.isArray(backendRes.data)
          ? backendRes.data
          : Array.isArray(backendRes.data.results)
            ? backendRes.data.results
            : Array.isArray(backendRes.data.projects)
              ? backendRes.data.projects
              : null;

        if (rawList) {
          const backendIds = new Set(rawList.map((p) => p.id));
          const localExtras = DEMO_PROJECTS.filter((p) => !backendIds.has(p.id));
          return [...rawList, ...localExtras];
        }
      }
    } catch {
      // Fall back to in-memory store
    }
  }
  return DEMO_PROJECTS;
}

/**
 * Fetch live field submissions from the Django Backend for server-rendered Engineer pages.
 */
export async function getServerSubmissions(): Promise<Submission[]> {
  const session = await getSessionData();
  if (session?.accessToken) {
    try {
      const backendRes = await fetchBackend<{ submissions?: Submission[] }>('/submissions/', {
        method: 'GET',
        accessToken: session.accessToken,
      });
      if (backendRes.ok && backendRes.data && Array.isArray(backendRes.data.submissions)) {
        const backendIds = new Set(backendRes.data.submissions.map((s) => s.id));
        const localExtras = DEMO_SUBMISSIONS.filter((s) => !backendIds.has(s.id));
        return [...backendRes.data.submissions, ...localExtras];
      }
    } catch {
      // Fall back to in-memory store
    }
  }
  return DEMO_SUBMISSIONS;
}

/**
 * Fetch live tasks and WBS activities from the Django Backend for server-rendered Engineer pages.
 */
export async function getServerTasksAndActivities(): Promise<{
  tasks: ProjectTask[];
  activities: ActivityRecord[];
}> {
  const session = await getSessionData();
  if (session?.accessToken) {
    try {
      const backendRes = await fetchBackend<{
        tasks?: ProjectTask[];
        activities?: ActivityRecord[];
      }>('/tasks/', {
        method: 'GET',
        accessToken: session.accessToken,
      });
      if (backendRes.ok && backendRes.data) {
        return {
          tasks: Array.isArray(backendRes.data.tasks) ? backendRes.data.tasks : DEMO_TASKS,
          activities: Array.isArray(backendRes.data.activities)
            ? backendRes.data.activities
            : DEMO_ACTIVITIES,
        };
      }
    } catch {
      // Fall back to in-memory store
    }
  }
  return { tasks: DEMO_TASKS, activities: DEMO_ACTIVITIES };
}
