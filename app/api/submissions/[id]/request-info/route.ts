import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getCurrentUser, getSessionData } from '@/lib/auth/session';
import { can } from '@/lib/permissions/rbac';
import { requestMissingInformation } from '@/lib/services/ingestion';
import { Submission } from '@/types';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionData();
  const user = session?.user ?? (await getCurrentUser());
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!can(user, 'submissions:review')) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient permissions to request information' },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await req.json();
  const { queryText, channel = 'whatsapp', dueDate } = body;

  if (!queryText) {
    return NextResponse.json({ error: 'queryText is required' }, { status: 400 });
  }

  if (session?.accessToken) {
    const backendRes = await fetchBackend<Submission>(`/submissions/${id}/`, {
      method: 'PATCH',
      accessToken: session.accessToken,
      body: { queryText, channel, dueDate },
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json(
        { success: true, submission: backendRes.data },
        { status: 200 }
      );
    }
  }

  const result = requestMissingInformation(id, queryText, channel, user, dueDate);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result, { status: 200 });
}
