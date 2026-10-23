import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { can } from '@/lib/permissions/rbac';
import { linkSubmissionToTask } from '@/lib/services/ingestion';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!can(user, 'submissions:review')) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient permissions to link submission to task' },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await req.json();
  const { taskId, note } = body;

  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  const result = linkSubmissionToTask(id, taskId, user, note);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result, { status: 200 });
}
