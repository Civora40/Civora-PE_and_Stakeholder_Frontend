import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { getStudioReportById } from '@/lib/services/reporting-studio-service';
import { ReportingStudioPageSettings } from '@/app/(engineer)/components/reporting/ReportingStudioPageSettings';

interface ReportingStudioSettingsPageProps {
  params: Promise<{ reportId: string }>;
}

export const metadata = {
  title: 'Page Setup & Document Settings | Civora Reporting Studio',
  description: 'Configure paper sizes, margins, branded cover pages, table of contents, and running headers.',
};

export default async function ReportingStudioSettingsPage({
  params,
}: ReportingStudioSettingsPageProps) {
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

  return <ReportingStudioPageSettings user={user} report={report} />;
}
