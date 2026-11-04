import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/api/backend-client';
import { getCurrentUser, getServerProjects, getSessionData } from '@/lib/auth/session';
import { DEMO_SUBMISSIONS, DEMO_REPORTS } from '@/lib/mock-data/fixtures';
import { DashboardSummaryResponse } from '@/lib/api/services';
import { Report, Submission } from '@/types';

export async function GET() {
  const session = await getSessionData();
  const user = session?.user ?? (await getCurrentUser());
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projects = await getServerProjects();
  let submissions: Submission[] = [...DEMO_SUBMISSIONS];
  let reports: Report[] = [...DEMO_REPORTS];

  if (session?.accessToken) {
    const [subsRes, rptsRes] = await Promise.all([
      fetchBackend<{ submissions: Submission[] }>('/submissions/', {
        method: 'GET',
        accessToken: session.accessToken,
      }),
      fetchBackend<{ reports: Report[] }>('/reports/', {
        method: 'GET',
        accessToken: session.accessToken,
      }),
    ]);
    if (subsRes.ok && subsRes.data && Array.isArray(subsRes.data.submissions)) {
      submissions = subsRes.data.submissions;
    }
    if (rptsRes.ok && rptsRes.data && Array.isArray(rptsRes.data.reports)) {
      reports = rptsRes.data.reports;
    }
  }

  const summary: DashboardSummaryResponse = {
    activeProjectsCount: projects.filter((p) => p.status === 'active').length,
    pendingSubmissionsCount: submissions.filter(
      (s) => s.reviewStatus === 'pending_review' || s.reviewStatus === 'received'
    ).length,
    flaggedDiscrepanciesCount: submissions.filter(
      (s) => s.aiFlag?.status === 'advisory_discrepancy'
    ).length,
    reportsAwaitingRelease: reports.filter((r) => r.status === 'approved').length,
    unverifiedSendersCount: submissions.filter(
      (s) => s.senderVerificationStatus === 'needs_verification'
    ).length,
    activeIntegrationsCount: projects.length > 0 ? 2 : 0,
    overallComplianceAvg: projects.length > 0 ? 100 : 0,
  };

  return NextResponse.json(summary);
}
