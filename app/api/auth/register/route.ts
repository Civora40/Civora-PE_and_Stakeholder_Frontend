import { NextRequest, NextResponse } from 'next/server';
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

    const { firstName, lastName, email, organization, jobTitle, invitationCode, role, accountType } =
      validation.data;

    // Invitation validation & Role assignment
    // Principle: Users must not be able to self-assign privileged roles (e.g. platform_admin).
    let assignedRole: UserRole = 'project_engineer';
    let assignedProjects: string[] = ['prj_metro_01'];

    // Check requested role / accountType
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
      
      // Check for simulated expired or revoked invitations
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
      role: assignedRole, // Trusted server-assigned role; never self-assigned platform_admin
      title: jobTitle || (assignedRole === 'project_engineer' ? 'Project Engineer' : 'Stakeholder Representative'),
      jobTitle: jobTitle || '',
      organization,
      assignedProjects,
      onboardingCompletedAt: null, // Incomplete onboarding by default
      onboardingStep: 1, // Start at step 1
      accountStatus: 'active',
      invitationCode: invitationCode || undefined,
    };

    await createSession(newUser);

    return NextResponse.json({
      success: true,
      user: newUser,
      nextUrl: '/onboarding',
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
