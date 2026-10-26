import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { STAKEHOLDER_RELEASED_REPORTS, StakeholderReleasedReport } from '@/lib/mock-data/stakeholder';
import { getStudioReportById } from '@/lib/services/reporting-studio-service';
import { ReportDetailView } from '@/app/(stakeholder)/components/StakeholderReportDetailView';

interface StakeholderReportDetailPageProps {
  params: Promise<{ reportId: string }>;
}

export const metadata = {
  title: 'Report Studio & Preview | Civora Stakeholder Workspace',
  description: 'Preview, comment, review, and approve released reports on the platform.',
};

export default async function StakeholderReportDetailPage({ params }: StakeholderReportDetailPageProps) {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;
  if (!user) {
    redirect('/login');
  }

  const { reportId } = await params;

  // Find report in released reports dataset or fallback to studio reports
  let report: StakeholderReleasedReport | undefined = STAKEHOLDER_RELEASED_REPORTS.find(
    (r) => r.id === reportId || r.reportNumber.toLowerCase() === reportId.toLowerCase()
  );

  if (!report) {
    const studioRep = getStudioReportById(reportId);
    if (studioRep) {
      report = {
        id: studioRep.id,
        reportNumber: studioRep.reportNumber,
        title: studioRep.title,
        projectId: studioRep.projectId,
        projectName: studioRep.projectName,
        period: studioRep.periodFormatted,
        releaseDate: studioRep.releasedAt || 'October 2026',
        version: studioRep.currentVersion,
        executiveSummary: studioRep.executiveSummary,
        fileSize: '4.5 MB PDF',
        status: 'released',
      };
    }
  }

  if (!report) {
    notFound();
  }

  // Authorization Check: Scoped strictly to assigned projects (Section 3.2, 3.3 & 9)
  if (user.role === 'read_only_stakeholder') {
    const isAssigned =
      user.assignedProjects?.includes('*') || user.assignedProjects?.includes(report.projectId);

    if (!isAssigned) {
      redirect('/unauthorized');
    }
  }

  return <ReportDetailView user={user} report={report} initialMode="editor" />;
}
