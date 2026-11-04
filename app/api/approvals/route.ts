import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const reportId = searchParams.get('reportId');

  if (session.accessToken) {
    const query = reportId ? `?reportId=${encodeURIComponent(reportId)}` : '';
    const backendRes = await fetchBackend<{
      comments: unknown[];
      approvals: unknown[];
    }>(`/approvals/${query}`, {
      method: 'GET',
      accessToken: session.accessToken,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json(backendRes.data);
    }
  }

  return NextResponse.json({ comments: [], approvals: [] });
}

export async function POST(req: NextRequest) {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  if (session.accessToken) {
    const backendRes = await fetchBackend('/approvals/', {
      method: 'POST',
      accessToken: session.accessToken,
      body,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, data: backendRes.data }, { status: 201 });
    }
  }

  return NextResponse.json({ error: 'Failed to submit review or approval.' }, { status: 400 });
}
