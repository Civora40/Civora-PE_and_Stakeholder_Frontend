import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';
import { ProjectDepartment } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; departmentId: string }> }
) {
  const session = await getSessionData();
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId, departmentId } = await params;

  if (session?.accessToken) {
    const backendRes = await fetchBackend<ProjectDepartment>(
      `/projects/${projectId}/departments/${departmentId}/`,
      {
        method: 'GET',
        accessToken: session.accessToken,
      }
    );
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, department: backendRes.data });
    }
  }

  return NextResponse.json({ error: 'Department not found' }, { status: 404 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; departmentId: string }> }
) {
  const session = await getSessionData();
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId, departmentId } = await params;
  const body = await request.json();

  if (session?.accessToken) {
    const backendRes = await fetchBackend<ProjectDepartment>(
      `/projects/${projectId}/departments/${departmentId}/`,
      {
        method: 'PATCH',
        accessToken: session.accessToken,
        body,
      }
    );
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, department: backendRes.data });
    }
    if (!backendRes.unreachable) {
      return NextResponse.json(
        { error: backendRes.error?.message || backendRes.message || 'Failed to update department' },
        { status: backendRes.status || 400 }
      );
    }
  }

  return NextResponse.json({ success: true, message: 'Department updated' });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; departmentId: string }> }
) {
  const session = await getSessionData();
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId, departmentId } = await params;

  if (session?.accessToken) {
    const backendRes = await fetchBackend(
      `/projects/${projectId}/departments/${departmentId}/`,
      {
        method: 'DELETE',
        accessToken: session.accessToken,
      }
    );
    if (backendRes.ok) {
      return NextResponse.json({ success: true, deleted: true });
    }
    if (!backendRes.unreachable) {
      return NextResponse.json(
        { error: backendRes.error?.message || backendRes.message || 'Failed to delete department' },
        { status: backendRes.status || 400 }
      );
    }
  }

  return NextResponse.json({ success: true, deleted: true });
}

