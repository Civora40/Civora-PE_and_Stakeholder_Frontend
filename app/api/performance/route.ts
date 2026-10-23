import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { can } from '@/lib/permissions/rbac';
import {
  getPerformanceAssessments,
  getPerformanceExceptions,
  getReportingPolicy,
  recordPerformanceException,
  updateReportingPolicy,
} from '@/lib/services/performance';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!can(user, 'performance:read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  let assessments = getPerformanceAssessments();
  const exceptions = getPerformanceExceptions();
  const policy = getReportingPolicy();

  // If user is read_only_stakeholder, do not expose individual disciplinary notes by default
  const isStakeholder = user.role === 'read_only_stakeholder';

  if (user.role !== 'platform_admin' && !user.assignedProjects.includes('*')) {
    assessments = assessments.filter((a) => user.assignedProjects.includes(a.projectId));
  }

  if (projectId && projectId !== 'all') {
    assessments = assessments.filter((a) => a.projectId === projectId);
  }

  const sanitizedAssessments = isStakeholder
    ? assessments.map((a) => ({
        ...a,
        reviewerNotes: undefined, // Hide private engineering notes from external read-only stakeholders
      }))
    : assessments;

  return NextResponse.json({
    assessments: sanitizedAssessments,
    exceptions,
    policy,
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!can(user, 'performance:manage')) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient permissions to record performance adjustment' },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { personnelId, personnelName, period, type, reason, excludedPeriodsCount, supportingEvidenceRef } = body;

  if (!personnelId || !period || !type || !reason) {
    return NextResponse.json(
      { error: 'personnelId, period, type, and reason are required' },
      { status: 400 }
    );
  }

  const result = recordPerformanceException(
    {
      personnelId,
      personnelName: personnelName || 'Field Personnel',
      period,
      type,
      reason,
      excludedPeriodsCount: Number(excludedPeriodsCount) || 1,
      supportingEvidenceRef,
    },
    user
  );

  return NextResponse.json(result, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!can(user, 'policies:manage')) {
    return NextResponse.json(
      { error: 'Forbidden: Only Platform Administrators can modify reporting policies' },
      { status: 403 }
    );
  }

  const body = await req.json();
  const updatedPolicy = updateReportingPolicy(body, user);

  return NextResponse.json({ policy: updatedPolicy }, { status: 200 });
}
