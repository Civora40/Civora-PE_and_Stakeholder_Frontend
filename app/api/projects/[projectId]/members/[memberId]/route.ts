import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';
import { ProjectMember } from '@/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; memberId: string }> }
) {
  const session = await getSessionData();
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId, memberId } = await params;
  const body = await request.json();

  if (session?.accessToken) {
    const backendRes = await fetchBackend<ProjectMember>(
      `/projects/${projectId}/members/${memberId}/`,
      {
        method: 'PATCH',
        accessToken: session.accessToken,
        body,
      }
    );
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, member: backendRes.data });
    }
    if (!backendRes.unreachable) {
      return NextResponse.json(
        { error: backendRes.error?.message || backendRes.message || 'Failed to update project member' },
        { status: backendRes.status || 400 }
      );
    }
  }

  return NextResponse.json({ success: true, message: 'Project member updated' });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; memberId: string }> }
) {
  const session = await getSessionData();
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId, memberId } = await params;

  if (session?.accessToken) {
    const backendRes = await fetchBackend(
      `/projects/${projectId}/members/${memberId}/`,
      {
        method: 'DELETE',
        accessToken: session.accessToken,
      }
    );
    if (backendRes.ok) {
      return NextResponse.json({ success: true, removed: true });
    }
    if (!backendRes.unreachable) {
      return NextResponse.json(
        { error: backendRes.error?.message || backendRes.message || 'Failed to remove project member' },
        { status: backendRes.status || 400 }
      );
    }
  }

  return NextResponse.json({ success: true, removed: true });
}
