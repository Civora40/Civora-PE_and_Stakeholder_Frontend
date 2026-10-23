import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getSubmissionsStore } from '@/lib/services/ingestion';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const channel = searchParams.get('channel');
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const verificationStatus = searchParams.get('verificationStatus');

  let submissions = getSubmissionsStore();

  // Enforce project authorization scope
  if (user.role !== 'platform_admin' && !user.assignedProjects.includes('*')) {
    submissions = submissions.filter((s) => user.assignedProjects.includes(s.projectId));
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
    submissions = submissions.filter((s) => s.primaryCategory === category || s.reportingGroup === category);
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
