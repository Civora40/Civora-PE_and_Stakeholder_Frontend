import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { createSession, getSessionData, updateSessionUser } from '@/lib/auth/session';
import { CivoraUser } from '@/types';

export async function GET() {
  const session = await getSessionData();

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. No active session.' },
      { status: 401 }
    );
  }

  if (session.accessToken) {
    const backendRes = await fetchBackend<CivoraUser>('/users/me/', {
      method: 'GET',
      accessToken: session.accessToken,
    });
    if (backendRes.ok && backendRes.data) {
      await createSession(backendRes.data, {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      return NextResponse.json({
        success: true,
        user: backendRes.data,
        source: 'civora_backend',
      });
    }
  }

  return NextResponse.json({
    success: true,
    user: session.user,
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getSessionData();

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. No active session.' },
      { status: 401 }
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON request payload.' },
      { status: 400 }
    );
  }

  if (session.accessToken) {
    const backendRes = await fetchBackend<CivoraUser>('/users/me/', {
      method: 'PATCH',
      body,
      accessToken: session.accessToken,
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: backendRes.error || 'Failed to update profile.',
        },
        { status: backendRes.status || 400 }
      );
    }

    if (backendRes.data) {
      await createSession(backendRes.data, {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      return NextResponse.json({
        success: true,
        user: backendRes.data,
        message: backendRes.message || 'Profile updated successfully.',
        source: 'civora_backend',
      });
    }
  }

  const updatedUser = await updateSessionUser(body as Partial<CivoraUser>);
  return NextResponse.json({
    success: true,
    user: updatedUser || session.user,
    message: 'Profile updated in session.',
  });
}

export async function POST(request: NextRequest) {
  return PATCH(request);
}
