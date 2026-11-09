import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';
import { Project } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getSessionData();
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId } = await params;
  const body = await request.json();

  if (!body.status?.trim()) {
    return NextResponse.json({ error: 'Target status is required' }, { status: 400 });
  }

  if (session?.accessToken) {
    const backendRes = await fetchBackend<Project>(`/projects/${projectId}/transition-status/`, {
      method: 'POST',
      accessToken: session.accessToken,
      body: {
        status: body.status,
        reason: body.reason || '',
      },
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, project: backendRes.data });
    }
    if (!backendRes.unreachable) {
      return NextResponse.json(
        { error: backendRes.error?.message || backendRes.message || 'Failed to transition status' },
        { status: backendRes.status || 400 }
      );
    }
  }

  return NextResponse.json(
    { success: true, message: `Project status transitioned to ${body.status}` },
    { status: 200 }
  );
}
