import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { authenticateWithMock } from '@/lib/auth/mock-adapter';
import { createSession } from '@/lib/auth/session';
import { loginSchema } from '@/lib/validation/auth';
import { CivoraUser } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || 'Invalid input credentials.',
        },
        { status: 400 }
      );
    }

    // 1. Attempt authentication against the live Django Backend (`/api/v1/auth/login/`)
    const backendRes = await fetchBackend<{
      access: string;
      refresh: string;
      user: CivoraUser;
      redirectUrl?: string;
    }>('/auth/login/', {
      method: 'POST',
      body: {
        email: validation.data.email,
        password: validation.data.password,
      },
    });

    if (backendRes.ok && backendRes.data?.user) {
      const user = backendRes.data.user;
      await createSession(user, {
        accessToken: backendRes.data.access,
        refreshToken: backendRes.data.refresh,
      });

      const redirectUrl =
        backendRes.data.redirectUrl ||
        (user.onboardingCompletedAt
          ? user.role === 'read_only_stakeholder'
            ? '/stakeholder'
            : '/dashboard'
          : user.role === 'read_only_stakeholder'
          ? '/stakeholder/onboarding'
          : '/onboarding');

      return NextResponse.json({
        success: true,
        user,
        redirectUrl,
        source: 'civora_backend',
      });
    }

    // If backend was reachable and explicitly rejected credentials (401/403), return error immediately
    if (!backendRes.unreachable && (backendRes.status === 401 || backendRes.status === 403)) {
      return NextResponse.json(
        {
          success: false,
          error: backendRes.error?.message || 'Invalid email or password.',
        },
        { status: backendRes.status }
      );
    }

    // 2. Fallback to local development fixtures only if backend is unreachable
    const result = await authenticateWithMock(validation.data.email);

    if (!result.success || !result.user) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Invalid credentials provided.',
        },
        { status: 401 }
      );
    }

    await createSession(result.user);

    const redirectUrl = result.user.onboardingCompletedAt
      ? result.user.role === 'read_only_stakeholder'
        ? '/stakeholder'
        : '/dashboard'
      : result.user.role === 'read_only_stakeholder'
      ? '/stakeholder/onboarding'
      : '/onboarding';

    return NextResponse.json({
      success: true,
      user: result.user,
      redirectUrl,
      source: 'mock_fallback',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Server error occurred during sign-in.',
      },
      { status: 500 }
    );
  }
}
