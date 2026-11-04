import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getCurrentUser, getSessionData } from '@/lib/auth/session';
import { DEMO_REPORTS } from '@/lib/mock-data/fixtures';
import { Report } from '@/types';

export async function GET(req: NextRequest) {
  const session = await getSessionData();
  const user = session?.user ?? (await getCurrentUser());
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (session?.accessToken) {
    const query = projectId && projectId !== 'all' ? `?projectId=${encodeURIComponent(projectId)}` : '';
    const backendRes = await fetchBackend<{ reports: Report[] }>(`/reports/${query}`, {
      method: 'GET',
      accessToken: session.accessToken,
    });
    if (backendRes.ok && backendRes.data && Array.isArray(backendRes.data.reports)) {
      return NextResponse.json({
        reports: backendRes.data.reports,
      });
    }
  }

  return NextResponse.json({
    reports: DEMO_REPORTS,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  if (session.accessToken) {
    const backendRes = await fetchBackend<Report>('/reports/', {
      method: 'POST',
      accessToken: session.accessToken,
      body,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json(
        { success: true, report: backendRes.data },
        { status: 201 }
      );
    }
  }

  return NextResponse.json({ error: 'Failed to create report.' }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const reportId = body.reportId || body.id;
  if (!reportId) {
    return NextResponse.json({ error: 'reportId is required' }, { status: 400 });
  }

  if (session.accessToken) {
    const backendRes = await fetchBackend<Report>(`/reports/${reportId}/`, {
      method: 'PATCH',
      accessToken: session.accessToken,
      body,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, report: backendRes.data });
    }
  }

  return NextResponse.json({ error: 'Failed to update report.' }, { status: 400 });
}
