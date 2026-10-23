import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { can } from '@/lib/permissions/rbac';
import { getPersonnelStore } from '@/lib/services/ingestion';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!can(user, 'personnel:read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  let personnel = getPersonnelStore();

  // Scoped project verification
  if (user.role !== 'platform_admin' && !user.assignedProjects.includes('*')) {
    personnel = personnel.filter((p) =>
      p.assignedProjects.some((pid) => user.assignedProjects.includes(pid))
    );
  }

  if (projectId && projectId !== 'all') {
    personnel = personnel.filter((p) => p.assignedProjects.includes(projectId));
  }

  return NextResponse.json({
    personnel,
    totalCount: personnel.length,
  });
}
