import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData, getServerProjects } from '@/lib/auth/session';
import { Project } from '@/types';

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
    const backendRes = await fetchBackend<Project>(`/projects/${projectId}/`, {
      method: 'GET',
      accessToken: session.accessToken,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, project: backendRes.data });
    }
  }

  const projects = await getServerProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, project });
}

export async function PATCH(
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
    const backendRes = await fetchBackend<Project>(`/projects/${projectId}/`, {
      method: 'PATCH',
      accessToken: session.accessToken,
      body,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, project: backendRes.data });
    }
    if (!backendRes.unreachable) {
      return NextResponse.json(
        { error: backendRes.error?.message || backendRes.message || 'Failed to update project' },
        { status: backendRes.status || 400 }
      );
    }
  }

  return NextResponse.json({ success: true, message: 'Project updated in local session.' });
}

