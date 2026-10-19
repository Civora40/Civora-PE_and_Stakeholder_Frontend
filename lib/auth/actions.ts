'use server';

import { redirect } from 'next/navigation';
import { UserRole } from '@/types';
import { authenticateWithMock } from './mock-adapter';
import { createSession, destroySession, switchDemoRole } from './session';
import { loginSchema } from '../validation/auth';

export interface ActionResponse {
  success: boolean;
  error?: string;
}

export async function loginAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const rawEmail = formData.get('email') as string;
  const rawPassword = formData.get('password') as string;

  const validation = loginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input credentials.',
    };
  }

  const authResult = await authenticateWithMock(validation.data.email);

  if (!authResult.success || !authResult.user) {
    return {
      success: false,
      error: authResult.error || 'Authentication failed. Please verify your credentials.',
    };
  }

  await createSession(authResult.user);
  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/login');
}

export async function switchRoleAction(role: UserRole): Promise<void> {
  await switchDemoRole(role);
}
