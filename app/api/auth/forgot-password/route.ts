import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action === 'confirm' ? 'confirm' : 'request';

    if (action === 'confirm') {
      const token = String(body.token || '').trim();
      const newPassword = String(body.newPassword || '');

      if (!token) {
        return NextResponse.json(
          { success: false, error: 'A valid password reset token is required.' },
          { status: 400 }
        );
      }

      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json(
          { success: false, error: 'New password must be at least 8 characters long.' },
          { status: 400 }
        );
      }

      const backendRes = await fetchBackend<{ email: string }>('/auth/password-reset/confirm/', {
        method: 'POST',
        body: {
          token,
          new_password: newPassword,
        },
      });

      if (!backendRes.ok) {
        return NextResponse.json(
          {
            success: false,
            error:
              backendRes.error?.message ||
              'Invalid or expired password reset token. Please request a new reset link.',
          },
          { status: backendRes.status || 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Your password has been updated. Please sign in with your new credentials.',
      });
    }

    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid work email address.' },
        { status: 400 }
      );
    }

    const backendRes = await fetchBackend<{ email: string }>('/auth/password-reset/', {
      method: 'POST',
      body: { email },
    });

    if (!backendRes.ok && !backendRes.unreachable) {
      return NextResponse.json(
        {
          success: false,
          error: backendRes.error?.message || 'Unable to process password reset request.',
        },
        { status: backendRes.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        'If an account exists for that email, password reset instructions have been dispatched.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while processing your password reset request.',
      },
      { status: 500 }
    );
  }
}

