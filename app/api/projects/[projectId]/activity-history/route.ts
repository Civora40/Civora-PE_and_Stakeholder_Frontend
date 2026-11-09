import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getSessionData();
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId } = await params;

  if (session?.accessToken) {
    const backendRes = await fetchBackend<unknown[]>(
      `/projects/${projectId}/activity-history/`,
      {
        method: 'GET',
        accessToken: session.accessToken,
      }
    );
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, history: backendRes.data });
    }
  }

  return NextResponse.json({ success: true, history: [] });
}
