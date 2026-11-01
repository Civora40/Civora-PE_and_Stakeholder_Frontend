import { cookies } from 'next/headers';
import { CivoraUser, SessionData, UserRole } from '@/types';
import { getMockUserByRole } from './mock-adapter';

const SESSION_COOKIE_NAME = 'civora_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

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
    user,
    accessToken: tokens?.accessToken,
    refreshToken: tokens?.refreshToken,
    createdAt: Date.now(),
    expiresAt,
  };

  cookieStore.set(SESSION_COOKIE_NAME, serializeSession(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
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
}

/**
 * Switch active role in development/demo mode
 */
export async function switchDemoRole(role: UserRole): Promise<CivoraUser> {
  const user = getMockUserByRole(role);
  await createSession(user);
  return user;
}
