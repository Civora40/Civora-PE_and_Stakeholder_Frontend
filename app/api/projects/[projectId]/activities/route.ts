import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';
import { ProjectActivity } from '@/types';

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
  const searchParams = request.nextUrl.searchParams;
  const statusParam = searchParams.get('status');
  const deptParam = searchParams.get('department_id') || searchParams.get('department');

  let endpoint = `/projects/${projectId}/activities/`;
  const queryParts = [];
  if (statusParam) queryParts.push(`status=${encodeURIComponent(statusParam)}`);
  if (deptParam) queryParts.push(`department_id=${encodeURIComponent(deptParam)}`);
  if (queryParts.length > 0) {
    endpoint += `?${queryParts.join('&')}`;
  }

  if (session?.accessToken) {
    const backendRes = await fetchBackend<ProjectActivity[]>(endpoint, {
      method: 'GET',
      accessToken: session.accessToken,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, activities: backendRes.data });
    }
  }

  return NextResponse.json({ success: true, activities: [] });
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

  if (!body.code?.trim() || !body.name?.trim()) {
    return NextResponse.json({ error: 'Activity code and name are required' }, { status: 400 });
  }

  if (session?.accessToken) {
    const backendRes = await fetchBackend<ProjectActivity>(`/projects/${projectId}/activities/`, {
      method: 'POST',
      accessToken: session.accessToken,
      body,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, activity: backendRes.data }, { status: 201 });
    }
    if (!backendRes.unreachable) {
      return NextResponse.json(
        { error: backendRes.error?.message || backendRes.message || 'Failed to create activity' },
        { status: backendRes.status || 400 }
      );
    }
  }

  const mockActivity: ProjectActivity = {
    id: `act_${Date.now()}`,
    projectId,
    code: body.code.trim().toUpperCase(),
    name: body.name.trim(),
    description: body.description || '',
    wbsReference: body.wbsReference || body.wbs_reference || '',
    locationZone: body.locationZone || body.location_zone || '',
    status: body.status || 'planned',
    progressPercent: Number(body.progressPercent || body.progress_percent || 0),
    departmentId: body.departmentId || body.department_id,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, activity: mockActivity }, { status: 201 });
}

