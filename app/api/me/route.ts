import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { createSession, getSessionData } from '@/lib/auth/session';
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
