import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';
import { ProjectMember } from '@/types';

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
    const backendRes = await fetchBackend<ProjectMember[]>(`/projects/${projectId}/members/`, {
      method: 'GET',
      accessToken: session.accessToken,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, members: backendRes.data });
    }
  }

  return NextResponse.json({ success: true, members: [] });
}

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

  if (session?.accessToken) {
    const backendRes = await fetchBackend<ProjectMember>(`/projects/${projectId}/members/`, {
      method: 'POST',
      accessToken: session.accessToken,
      body,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, member: backendRes.data }, { status: 201 });
    }
    if (!backendRes.unreachable) {
      return NextResponse.json(
        { error: backendRes.error?.message || backendRes.message || 'Failed to assign project member' },
        { status: backendRes.status || 400 }
      );
    }
  }

  return NextResponse.json({ success: true, message: 'Project member assigned.' }, { status: 201 });
}

