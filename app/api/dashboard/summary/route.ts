import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_SUBMISSIONS, DEMO_REPORTS } from '@/lib/mock-data/fixtures';
import { DashboardSummaryResponse } from '@/lib/api/services';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const summary: DashboardSummaryResponse = {
    activeProjectsCount: DEMO_PROJECTS.filter((p) => p.status === 'active').length,
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
    activeIntegrationsCount: 2,
    overallComplianceAvg: 88.4,
  };

  return NextResponse.json(summary);
}
