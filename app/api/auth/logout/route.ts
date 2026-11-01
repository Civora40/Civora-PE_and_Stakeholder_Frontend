import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { destroySession, getSessionData } from '@/lib/auth/session';

export async function POST() {
  const session = await getSessionData();
  if (session?.accessToken) {
    await fetchBackend('/auth/logout/', {
      method: 'POST',
      accessToken: session.accessToken,
    });
  }
  await destroySession();
  return NextResponse.json({ success: true });
}
