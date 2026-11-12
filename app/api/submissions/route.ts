import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getCurrentUser, getSessionData, getServerProjects } from '@/lib/auth/session';
import {
  canProjectAcceptFieldSubmissions,
  getProjectSubmissionBlockReason,
} from '@/lib/projects/governance';
import { getSubmissionsStore } from '@/lib/services/ingestion';
import { Submission } from '@/types';

export async function GET(req: NextRequest) {
  const session = await getSessionData();
  const user = session?.user ?? (await getCurrentUser());
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const channel = searchParams.get('channel');
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const verificationStatus = searchParams.get('verificationStatus');

  let submissions: Submission[] = [...getSubmissionsStore()];

  if (session?.accessToken) {
    const query = projectId && projectId !== 'all' ? `?projectId=${encodeURIComponent(projectId)}` : '';
    const backendRes = await fetchBackend<{
      submissions: Submission[];
      totalCount: number;
      unverifiedCount: number;
    }>(`/submissions/${query}`, {
      method: 'GET',
      accessToken: session.accessToken,
    });
    if (backendRes.ok && backendRes.data && Array.isArray(backendRes.data.submissions)) {
      const backendIds = new Set(backendRes.data.submissions.map((s) => s.id));
      submissions = [
        ...backendRes.data.submissions,
        ...submissions.filter((s) => !backendIds.has(s.id)),
      ];
    }
  }

  // Enforce project authorization scope
  if (user.role !== 'platform_admin' && !user.assignedProjects.includes('*')) {
    submissions = submissions.filter(
      (s) => user.assignedProjects.length === 0 || user.assignedProjects.includes(s.projectId)
    );
  }

  // Filter params
  if (projectId && projectId !== 'all') {
    submissions = submissions.filter((s) => s.projectId === projectId);
  }
  if (channel && channel !== 'all') {
    submissions = submissions.filter((s) => s.sourceChannel === channel);
  }
  if (status && status !== 'all') {
    submissions = submissions.filter((s) => s.reviewStatus === status);
  }
  if (category && category !== 'all') {
    submissions = submissions.filter(
      (s) => s.primaryCategory === category || s.reportingGroup === category
    );
  }
  if (verificationStatus && verificationStatus !== 'all') {
    submissions = submissions.filter((s) => s.senderVerificationStatus === verificationStatus);
  }

  return NextResponse.json({
    submissions,
    totalCount: submissions.length,
    unverifiedCount: submissions.filter((s) => s.senderVerificationStatus === 'needs_verification').length,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const targetProjectId = body.projectId || body.project;

  if (targetProjectId) {
    const knownProjects = await getServerProjects();
    const matchedProject = knownProjects.find((p) => p.id === targetProjectId);
    if (matchedProject && !canProjectAcceptFieldSubmissions(matchedProject)) {
      return NextResponse.json(
        {
          error:
            getProjectSubmissionBlockReason(matchedProject) ||
            'Project must be approved by a Platform Administrator before field submissions can begin.',
          code: 'project_approval_required',
        },
        { status: 403 }
      );
    }
  }

  if (session.accessToken) {
    const backendRes = await fetchBackend<Submission>('/submissions/', {
      method: 'POST',
      accessToken: session.accessToken,
      body,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json(
        { success: true, submission: backendRes.data },
        { status: 201 }
      );
    }
    if (!backendRes.unreachable) {
      return NextResponse.json(
        {
          error: backendRes.error?.message || backendRes.message || 'Unable to record field submission.',
          code: backendRes.error?.code,
        },
        { status: backendRes.status || 400 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Unable to record submission against backend.' },
    { status: 400 }
  );
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionData();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const submissionId = body.submissionId || body.id;
  if (!submissionId) {
    return NextResponse.json({ error: 'submissionId is required' }, { status: 400 });
  }

  if (session.accessToken) {
    const backendRes = await fetchBackend<Submission>(`/submissions/${submissionId}/`, {
      method: 'PATCH',
      accessToken: session.accessToken,
      body,
    });
    if (backendRes.ok && backendRes.data) {
      return NextResponse.json({ success: true, submission: backendRes.data });
    }
  }

  return NextResponse.json({ error: 'Submission update failed.' }, { status: 400 });
}
