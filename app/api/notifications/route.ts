import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';

export async function GET() {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.accessToken) {
    const backendRes = await fetchBackend<{
      notifications: unknown[];
      unreadCount: number;
      preferences: Record<string, unknown>;
    }>('/notifications/', {
      method: 'GET',
      accessToken: session.accessToken,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json(backendRes.data);
    }
  }

  return NextResponse.json({ notifications: [], unreadCount: 0, preferences: {} });
}

export async function POST(req: NextRequest) {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  if (session.accessToken) {
    const backendRes = await fetchBackend('/notifications/', {
      method: 'POST',
      accessToken: session.accessToken,
      body,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, data: backendRes.data });
    }
  }

  return NextResponse.json({ success: true });
}

