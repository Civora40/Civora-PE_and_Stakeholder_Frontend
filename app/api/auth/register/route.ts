import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth/session';
import { registerSchema } from '@/lib/validation/auth';
import { CivoraUser } from '@/types';

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

    const { name, email, role } = validation.data;

    const titleMap: Record<string, string> = {
      project_engineer: 'Lead Project Engineer',
      platform_admin: 'Platform Administrator',
      read_only_stakeholder: 'Capital Owner Representative',
    };

    const newUser: CivoraUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
      title: titleMap[role] || 'Engineering Professional',
      assignedProjects: role === 'platform_admin' ? ['*'] : ['prj_metro_l4', 'prj_harbor_terminal'],
    };

    await createSession(newUser);

    return NextResponse.json({
      success: true,
      user: newUser,
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
