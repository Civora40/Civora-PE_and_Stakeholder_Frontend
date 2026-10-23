import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_TASKS, DEMO_ACTIVITIES } from '@/lib/mock-data/fixtures';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  let tasks = [...DEMO_TASKS];
  let activities = [...DEMO_ACTIVITIES];

  if (user.role !== 'platform_admin' && !user.assignedProjects.includes('*')) {
    tasks = tasks.filter((t) => user.assignedProjects.includes(t.projectId));
    activities = activities.filter((a) => user.assignedProjects.includes(a.projectId));
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
