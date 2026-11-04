import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getCurrentUser, getSessionData } from '@/lib/auth/session';
import { DEMO_TASKS, DEMO_ACTIVITIES } from '@/lib/mock-data/fixtures';
import { ActivityRecord, ProjectTask } from '@/types';

export async function GET(req: NextRequest) {
  const session = await getSessionData();
  const user = session?.user ?? (await getCurrentUser());
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  let tasks: ProjectTask[] = [...DEMO_TASKS];
  let activities: ActivityRecord[] = [...DEMO_ACTIVITIES];

  if (session?.accessToken) {
    const query = projectId && projectId !== 'all' ? `?projectId=${encodeURIComponent(projectId)}` : '';
    const backendRes = await fetchBackend<{
      tasks: ProjectTask[];
      activities: ActivityRecord[];
    }>(`/tasks/${query}`, {
      method: 'GET',
      accessToken: session.accessToken,
    });
    if (backendRes.ok && backendRes.data) {
      if (Array.isArray(backendRes.data.tasks)) {
        tasks = backendRes.data.tasks;
      }
      if (Array.isArray(backendRes.data.activities)) {
        activities = backendRes.data.activities;
      }
    }
  }

  if (user.role !== 'platform_admin' && !user.assignedProjects.includes('*')) {
    tasks = tasks.filter(
      (t) => user.assignedProjects.length === 0 || user.assignedProjects.includes(t.projectId)
    );
    activities = activities.filter(
      (a) => user.assignedProjects.length === 0 || user.assignedProjects.includes(a.projectId)
    );
  }

  if (projectId && projectId !== 'all') {
    tasks = tasks.filter((t) => t.projectId === projectId);
    activities = activities.filter((a) => a.projectId === projectId);
  }

  return NextResponse.json({
    tasks,
    activities,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  if (session.accessToken) {
    const backendRes = await fetchBackend<ProjectTask | ActivityRecord>('/tasks/', {
      method: 'POST',
      accessToken: session.accessToken,
      body,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, data: backendRes.data }, { status: 201 });
    }
  }

  return NextResponse.json({ error: 'Failed to create task or activity.' }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const taskId = body.taskId || body.id;
  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  if (session.accessToken) {
    const backendRes = await fetchBackend<ProjectTask>(`/tasks/${taskId}/`, {
      method: 'PATCH',
      accessToken: session.accessToken,
      body,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, task: backendRes.data });
    }
  }

  return NextResponse.json({ error: 'Task update failed.' }, { status: 400 });
}
