import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const session = await getSessionData();
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const code = body.invitation_code || body.invitationCode || body.code;
  if (!code?.trim()) {
    return NextResponse.json({ error: 'Invitation code is required' }, { status: 400 });
  }

  if (session?.accessToken) {
    const backendRes = await fetchBackend('/organizations/invitations/accept/', {
      method: 'POST',
      accessToken: session.accessToken,
      body: {
        invitation_code: code.trim().toUpperCase(),
      },
    });

    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, data: backendRes.data, message: backendRes.message });
    }

    if (!backendRes.unreachable) {
      return NextResponse.json(
        { error: backendRes.error?.message || backendRes.message || 'Failed to accept invitation' },
        { status: backendRes.status || 400 }
      );
    }
  }

  return NextResponse.json(
    { success: true, message: 'Invitation accepted successfully.' },
    { status: 200 }
  );
}

