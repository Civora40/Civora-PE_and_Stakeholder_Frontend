import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { getStudioReportById } from '@/lib/services/reporting-studio-service';
import { ReportingStudioVersionHistory } from '@/app/(engineer)/components/reporting/ReportingStudioVersionHistory';

interface ReportingStudioVersionsPageProps {
  params: Promise<{ reportId: string }>;
}

export const metadata = {
  title: 'Version History & Snapshots | Civora Reporting Studio',
  description: 'Inspect immutable version snapshots, change summaries, and layout settings across the reporting lifecycle.',
};

export default async function ReportingStudioVersionsPage({
  params,
}: ReportingStudioVersionsPageProps) {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;
  if (!user) {
    redirect('/login');
  }

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/reports');
  }

  const { reportId } = await params;
  const report = getStudioReportById(reportId);

  if (!report) {
    notFound();
  }

  // Verify project assignment authorization
  if (
    user.assignedProjects &&
    !user.assignedProjects.includes('*') &&
    !user.assignedProjects.includes(report.projectId)
  ) {
    redirect('/unauthorized');
  }

  return <ReportingStudioVersionHistory user={user} report={report} />;
}
