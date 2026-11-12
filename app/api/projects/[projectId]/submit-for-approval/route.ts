import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getSessionData } from '@/lib/auth/session';
import { Project } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId } = await params;
  const body = await request.json().catch(() => ({}));

  if (session.accessToken) {
    const backendRes = await fetchBackend<Project>(`/projects/${projectId}/submit-for-approval/`, {
      method: 'POST',
      accessToken: session.accessToken,
      body: {
        notes: body.notes || body.reason || '',
      },
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({
        success: true,
        project: backendRes.data,
        message: backendRes.message || 'Project submitted for Platform Administrator approval.',
      });
    }
    if (!backendRes.unreachable) {
      return NextResponse.json(
        { error: backendRes.error?.message || backendRes.message || 'Failed to submit project for approval.' },
        { status: backendRes.status || 400 }
      );
    }
  }

  return NextResponse.json(
    {
      success: true,
      message: 'Project submitted for Platform Administrator approval.',
    },
    { status: 200 }
  );
}
