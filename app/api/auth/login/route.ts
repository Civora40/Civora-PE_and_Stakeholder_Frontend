import { NextRequest, NextResponse } from 'next/server';
import { authenticateWithMock } from '@/lib/auth/mock-adapter';
import { createSession } from '@/lib/auth/session';
import { loginSchema } from '@/lib/validation/auth';

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

    return NextResponse.json({
      success: true,
      user: result.user,
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
