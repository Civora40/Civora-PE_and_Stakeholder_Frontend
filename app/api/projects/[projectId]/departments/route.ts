import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';
import { ProjectDepartment } from '@/types';

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
    const backendRes = await fetchBackend<ProjectDepartment[]>(`/projects/${projectId}/departments/`, {
      method: 'GET',
      accessToken: session.accessToken,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, departments: backendRes.data });
    }
  }

  return NextResponse.json({ success: true, departments: [] });
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

  if (!body.name?.trim() || !body.code?.trim()) {
    return NextResponse.json({ error: 'Department name and code are required' }, { status: 400 });
  }

  if (session?.accessToken) {
    const backendRes = await fetchBackend<ProjectDepartment>(`/projects/${projectId}/departments/`, {
      method: 'POST',
      accessToken: session.accessToken,
      body: {
        name: body.name.trim(),
        code: body.code.trim().toUpperCase(),
        description: body.description || '',
      },
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, department: backendRes.data }, { status: 201 });
    }
    if (!backendRes.unreachable) {
      return NextResponse.json(
        { error: backendRes.error?.message || backendRes.message || 'Failed to create department' },
        { status: backendRes.status || 400 }
      );
    }
  }

  const mockDept: ProjectDepartment = {
    id: `dept_${Date.now()}`,
    projectId,
    name: body.name.trim(),
    code: body.code.trim().toUpperCase(),
    description: body.description || '',
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, department: mockDept }, { status: 201 });
}
