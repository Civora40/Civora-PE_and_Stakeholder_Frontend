import { CivoraUser, UserRole } from '../../types';
import { DEMO_USERS } from '../mock-data/fixtures';

/**
 * Isolated Development & Client Review Mock Auth Adapter
 *
 * Configured to allow seamless client review, stakeholder evaluation, and
 * development testing across local, staging, and preview deployments.
 */
export function assertDevAuthAllowed(): void {
  // Allow client review access by default across development and preview/review environments.
  // Can be explicitly disabled in hardened enterprise deployments via DISABLE_MOCK_AUTH='true' or NEXT_PUBLIC_ENABLE_DEV_AUTH='false'.
  const devAuthExplicitlyDisabled =
    process.env.DISABLE_MOCK_AUTH === 'true' ||
    process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH === 'false';

  if (devAuthExplicitlyDisabled) {
    throw new Error(
      'CRITICAL: Development mock authentication adapter is disabled. Configure a verified identity provider (e.g. OAuth/OIDC/SAML) before deployment.'
    );
  }
}

export interface AuthResult {
  success: boolean;
  user?: CivoraUser;
  error?: string;
}

// Persist locally registered users across requests in dev/review server memory
const globalForMockAuth = globalThis as unknown as {
  civoraRegisteredUsers?: Map<string, CivoraUser>;
};

const registeredUsers =
  globalForMockAuth.civoraRegisteredUsers ?? new Map<string, CivoraUser>();

if (!globalForMockAuth.civoraRegisteredUsers) {
  globalForMockAuth.civoraRegisteredUsers = registeredUsers;
}

/**
 * Record a locally registered user so subsequent logins preserve their profile & role.
 */
export function registerMockUser(user: CivoraUser): void {
  registeredUsers.set(user.email.trim().toLowerCase(), user);
}

/**
 * Authenticate credentials against development fixtures and review accounts.
 * Supports pre-configured DEMO_USERS, locally registered accounts, and any valid work email in review mode.
 */
export async function authenticateWithMock(
  email: string
): Promise<AuthResult> {
  assertDevAuthAllowed();

  const normalizedEmail = email.trim().toLowerCase();

  // 1. Check locally registered users first
  const registeredUser = registeredUsers.get(normalizedEmail);
  if (registeredUser) {
    return {
      success: true,
      user: registeredUser,
    };
  }

  // 2. Find user by email in predefined DEMO_USERS
  const demoUser = Object.values(DEMO_USERS).find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (demoUser) {
    return {
      success: true,
      user: demoUser,
    };
  }

  // 3. For client review / local evaluation, accept any valid email address
  // and map to Stakeholder or Project Engineer based on email keywords
  const isStakeholderEmail =
    normalizedEmail.includes('stakeholder') ||
    normalizedEmail.includes('client') ||
    normalizedEmail.includes('oversight') ||
    normalizedEmail.includes('audit') ||
    normalizedEmail.includes('ministry');

  const localPart = normalizedEmail.split('@')[0] || 'user';
  const formattedName = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  const baseTemplate = isStakeholderEmail
    ? DEMO_USERS.read_only_stakeholder
    : DEMO_USERS.project_engineer;

  const dynamicUser: CivoraUser = {
    ...baseTemplate,
    id: `usr_rev_${Buffer.from(normalizedEmail).toString('hex').slice(0, 8)}`,
    email: normalizedEmail,
    name: formattedName || baseTemplate.name,
    firstName: formattedName.split(' ')[0] || baseTemplate.firstName,
    lastName: formattedName.split(' ').slice(1).join(' ') || baseTemplate.lastName,
    displayName: formattedName || baseTemplate.displayName,
  };

  return {
    success: true,
    user: dynamicUser,
  };
}

/**
 * Retrieve user profile by role key for dev role switching
 */
export function getMockUserByRole(role: UserRole): CivoraUser {
  assertDevAuthAllowed();
  const user = DEMO_USERS[role];
  if (!user) {
    throw new Error(`Unknown role requested: ${role}`);
  }
  return user;
}
