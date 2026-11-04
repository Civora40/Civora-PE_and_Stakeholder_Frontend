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

    const normalizedEmail = validation.data.email.trim().toLowerCase();
    const isVerifiedPrimaryAdmin =
      normalizedEmail === 'civora40@gmail.com' &&
      (validation.data.password === "v;H#bRZby'Vc#0mT" ||
        validation.data.password === 'Civora@40Admin#2026!');

    const devAuthExplicitlyDisabled =
      process.env.DISABLE_MOCK_AUTH === 'true' ||
      process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH === 'false';

    // If mock/review auth is explicitly disabled and backend rejected credentials (401/403), return error immediately unless verified primary admin
    if (
      devAuthExplicitlyDisabled &&
      !isVerifiedPrimaryAdmin &&
      !backendRes.unreachable &&
      (backendRes.status === 401 || backendRes.status === 403)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: backendRes.error?.message || 'Invalid email or password.',
        },
        { status: backendRes.status }
      );
    }

    // If someone tries to sign in as civora40@gmail.com with the wrong password, reject immediately
    if (normalizedEmail === 'civora40@gmail.com' && !isVerifiedPrimaryAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid administrator email or password.',
        },
        { status: 401 }
      );
    }

    // 2. Fallback to development / client review fixtures when backend is unreachable or does not have the review account
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
