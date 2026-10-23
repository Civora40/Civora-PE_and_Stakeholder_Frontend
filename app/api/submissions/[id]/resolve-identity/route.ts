import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { can } from '@/lib/permissions/rbac';
import { resolveSenderIdentity } from '@/lib/services/ingestion';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Permission check: requires submissions:review or personnel:manage
  if (!can(user, 'submissions:review') && !can(user, 'personnel:manage')) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient permissions to resolve field submitter identity' },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await req.json();
  const { personnelId, note } = body;

  if (!personnelId) {
    return NextResponse.json({ error: 'personnelId is required' }, { status: 400 });
  }

  const result = resolveSenderIdentity(id, personnelId, user, note);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result, { status: 200 });
}
