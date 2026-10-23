import { CivoraUser, UserRole } from '../../types';
import { DEMO_USERS } from '../mock-data/fixtures';

/**
 * Isolated Development-Only Mock Auth Adapter
 *
 * SAFETY GUARD: Prevent accidental use in production environments.
 */
export function assertDevAuthAllowed(): void {
  const isProd = process.env.NODE_ENV === 'production';
  const devAuthExplicitlyAllowed = process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH === 'true';

  if (isProd && !devAuthExplicitlyAllowed) {
    throw new Error(
      'CRITICAL: Development mock authentication adapter is disabled in production. Configure a verified identity provider (e.g. OAuth/OIDC/SAML) before deployment.'
    );
  }
}

export interface AuthResult {
  success: boolean;
  user?: CivoraUser;
  error?: string;
}

/**
 * Authenticate credentials against development fixtures.
 * Password requirement for demo users is 'Civora2026!' or any password for rapid evaluation.
 */
export async function authenticateWithMock(
  email: string
): Promise<AuthResult> {
  assertDevAuthAllowed();

  const normalizedEmail = email.trim().toLowerCase();

  // Find user by email
  const user = Object.values(DEMO_USERS).find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (!user) {
    return {
      success: false,
      error: 'Invalid email or password. Please verify your credentials.',
    };
  }

  return {
    success: true,
    user,
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
