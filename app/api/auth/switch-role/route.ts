import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types';
import { switchDemoRole } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const { role } = (await request.json()) as { role: UserRole };

    if (!role || !['platform_admin', 'project_engineer', 'read_only_stakeholder'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Invalid role specified.' }, { status: 400 });
    }

    const updatedUser = await switchDemoRole(role);

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to switch demo role.',
      },
      { status: 500 }
    );
  }
}
