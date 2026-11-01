import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { createSession } from '@/lib/auth/session';
import { registerSchema } from '@/lib/validation/auth';
import { CivoraUser, UserRole } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || 'Invalid registration details.',
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password, organization, jobTitle, invitationCode, role, accountType } =
      validation.data;

    // 1. Attempt registration against the live Django Backend (`/api/v1/auth/register/`)
    const backendRes = await fetchBackend<{
      access: string;
      refresh: string;
      user: CivoraUser;
      nextUrl?: string;
    }>('/auth/register/', {
      method: 'POST',
      body: {
        firstName,
        lastName,
        email,
        password,
        organization,
        jobTitle,
        invitationCode,
        role,
        accountType,
      },
    });

    if (backendRes.ok && backendRes.data?.user) {
      await createSession(backendRes.data.user, {
        accessToken: backendRes.data.access,
        refreshToken: backendRes.data.refresh,
      });

      return NextResponse.json({
        success: true,
        user: backendRes.data.user,
        nextUrl: backendRes.data.nextUrl || '/onboarding',
        source: 'civora_backend',
      });
    }

    if (!backendRes.unreachable && backendRes.status === 400) {
      return NextResponse.json(
        {
          success: false,
          error: backendRes.error?.message || 'Registration validation failed.',
        },
        { status: 400 }
      );
    }

    // 2. Offline fallback if backend is unreachable
    let assignedRole: UserRole = 'project_engineer';
    let assignedProjects: string[] = ['prj_metro_01'];

    if (
      role === 'read_only_stakeholder' ||
      accountType === 'stakeholder' ||
      jobTitle?.toLowerCase().includes('stakeholder') ||
      jobTitle?.toLowerCase().includes('oversight')
    ) {
      assignedRole = 'read_only_stakeholder';
      assignedProjects = ['prj_metro_01', 'prj_civic_02', 'prj_datacenter_04'];
    }

    if (invitationCode && invitationCode.trim()) {
      const code = invitationCode.trim().toUpperCase();

      if (code.includes('EXPIRED') || code.includes('REVOKED') || code.includes('INVALID') || code.length < 4) {
        return NextResponse.json(
          {
            success: false,
            error: 'This invitation is invalid or has expired. Request a new invitation.',
          },
          { status: 400 }
        );
      }

      if (code.includes('STAKE') || code.includes('AUDIT')) {
        assignedRole = 'read_only_stakeholder';
        assignedProjects = ['prj_metro_01', 'prj_civic_02', 'prj_datacenter_04'];
      } else {
        assignedRole = 'project_engineer';
        assignedProjects = ['prj_metro_01'];
      }
    }

    const fullName = `${firstName} ${lastName}`.trim();

    const newUser: CivoraUser = {
      id: `usr_${Date.now()}`,
      name: fullName,
      firstName,
      lastName,
      displayName: fullName,
      email,
      role: assignedRole,
      title: jobTitle || (assignedRole === 'project_engineer' ? 'Project Engineer' : 'Stakeholder Representative'),
      jobTitle: jobTitle || '',
      organization,
      assignedProjects,
      onboardingCompletedAt: null,
      onboardingStep: 1,
      accountStatus: 'active',
      invitationCode: invitationCode || undefined,
    };

    await createSession(newUser);

    return NextResponse.json({
      success: true,
      user: newUser,
      nextUrl: '/onboarding',
      source: 'mock_fallback',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Server error occurred during registration.',
      },
      { status: 500 }
    );
  }
}
