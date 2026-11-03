import { NextResponse } from 'next/server';
import { getCurrentUser, getServerProjects } from '@/lib/auth/session';
import { DEMO_SUBMISSIONS, DEMO_REPORTS } from '@/lib/mock-data/fixtures';
import { DashboardSummaryResponse } from '@/lib/api/services';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projects = await getServerProjects();

  const summary: DashboardSummaryResponse = {
    activeProjectsCount: projects.filter((p) => p.status === 'active').length,
    pendingSubmissionsCount: DEMO_SUBMISSIONS.filter(
      (s) => s.reviewStatus === 'pending_review' || s.reviewStatus === 'received'
    ).length,
    flaggedDiscrepanciesCount: DEMO_SUBMISSIONS.filter(
      (s) => s.aiFlag.status === 'advisory_discrepancy'
    ).length,
    reportsAwaitingRelease: DEMO_REPORTS.filter((r) => r.status === 'approved').length,
    unverifiedSendersCount: DEMO_SUBMISSIONS.filter(
      (s) => s.senderVerificationStatus === 'needs_verification'
    ).length,
    activeIntegrationsCount: 0,
    overallComplianceAvg: 0,
  };

  return NextResponse.json(summary);
}
