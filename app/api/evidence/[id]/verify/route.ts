import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (session.accessToken) {
    const backendRes = await fetchBackend(`/evidence/${id}/verify/`, {
      method: 'POST',
      accessToken: session.accessToken,
      body: {
        is_verified: body.is_verified ?? true,
        notes: body.notes || '',
      },
    });

    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, evidence: backendRes.data });
    }

    return NextResponse.json(
      { error: backendRes.error?.message || 'Evidence verification failed.' },
      { status: backendRes.status || 400 }
    );
  }

  return NextResponse.json({ success: true, is_verified: body.is_verified ?? true });
}
