import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getCurrentUser, getSessionData, updateSessionUser } from '@/lib/auth/session';
import { onboardingStep1Schema, onboardingStep2Schema } from '@/lib/validation/auth';
import { CivoraUser } from '@/types';

export async function GET() {
  const session = await getSessionData();
  const user = session?.user;

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Please sign in.' },
      { status: 401 }
    );
  }

  if (session?.accessToken) {
    const backendRes = await fetchBackend<{
      user: CivoraUser;
      completed: boolean;
      currentStep: number;
    }>('/users/onboarding/', {
      method: 'GET',
      accessToken: session.accessToken,
    });

    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({
        success: true,
        ...backendRes.data,
        source: 'civora_backend',
      });
    }
  }

  const completed = Boolean(user.onboardingCompletedAt);
  const currentStep = completed ? 10 : user.onboardingStep || 1;

  return NextResponse.json({
    success: true,
    user,
    completed,
    currentStep,
  });
}

export async function POST(request: NextRequest) {
  const session = await getSessionData();
  const user = session?.user;

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Your session has expired. Sign in to continue.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { step, action, data } = body;

    if (step === 1) {
      const validation = onboardingStep1Schema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: validation.error.issues[0]?.message || 'Invalid profile information.',
          },
          { status: 400 }
        );
      }
    }

    if (step === 2) {
      const validation = onboardingStep2Schema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: validation.error.issues[0]?.message || 'Invalid work context details.',
          },
          { status: 400 }
        );
      }
    }

    // Sync with live Django Backend (`/api/v1/users/onboarding/`) when authenticated with JWT
    if (session?.accessToken) {
      const backendRes = await fetchBackend<{
        user: CivoraUser;
        completed?: boolean;
        nextStep?: number;
        redirectUrl?: string;
      }>('/users/onboarding/', {
        method: 'POST',
        accessToken: session.accessToken,
        body: { step, action, data },
      });

      if (backendRes.ok && backendRes.data?.user) {
        await updateSessionUser(backendRes.data.user);
        return NextResponse.json({
          success: true,
          ...backendRes.data,
          source: 'civora_backend',
        });
      }
    }

    // Finalize / Complete 10-step Onboarding (local session fallback)
    if (action === 'complete' || step === 10) {
      const updatedUser = await updateSessionUser({
        ...(data || {}),
        onboardingCompletedAt: Date.now(),
        onboardingStep: 10,
        accountStatus: 'active',
      });

      if (!updatedUser) {
        return NextResponse.json(
          { success: false, error: 'Failed to update session.' },
          { status: 401 }
        );
      }

      const targetDashboard =
        updatedUser.role === 'read_only_stakeholder' ? '/dashboard/stakeholder' : '/dashboard';

      return NextResponse.json({
        success: true,
        user: updatedUser,
        completed: true,
        redirectUrl: targetDashboard,
      });
    }

    // Step 1: Professional Identity & COREN Registration
    if (step === 1) {
      const { firstName, lastName, displayName, jobTitle, phone, timeZone } = data;
      const fullName = `${firstName} ${lastName}`.trim();

      const updatedUser = await updateSessionUser({
        firstName,
        lastName,
        name: fullName,
        displayName: displayName || fullName,
        jobTitle: jobTitle || user.jobTitle,
        title: jobTitle || user.title,
        phone: phone || user.phone,
        timeZone: timeZone || user.timeZone || 'Africa/Lagos',
        corenNumber: data.corenNumber || user.corenNumber,
        corenStatus: data.corenStatus || user.corenStatus,
        onboardingStep: 2,
      });

      return NextResponse.json({
        success: true,
        user: updatedUser,
        nextStep: 2,
      });
    }

    // Step 2: Organization & CAC Registration Context
    if (step === 2) {
      const updatedUser = await updateSessionUser({
        organization: data.organization || user.organization,
        cacNumber: data.cacNumber || user.cacNumber,
        officeState: data.officeState || user.officeState || 'Lagos',
        department: data.department || user.department,
        onboardingStep: 3,
      });

      return NextResponse.json({
        success: true,
        user: updatedUser,
        nextStep: 3,
      });
    }

    // Steps 3 through 9: Nigerian Construction Questionnaire Progression
    if (step >= 3 && step <= 9) {
      const nextStep = step + 1;
      const updatedUser = await updateSessionUser({
        ...(data || {}),
        onboardingStep: nextStep,
      });

      return NextResponse.json({
        success: true,
        user: updatedUser,
        nextStep,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid onboarding step requested.' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update onboarding state.',
      },
      { status: 500 }
    );
  }
}
