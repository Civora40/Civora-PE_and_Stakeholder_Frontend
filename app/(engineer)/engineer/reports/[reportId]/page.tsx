import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { getStudioReportById } from '@/lib/services/reporting-studio-service';
import { ReportingStudioDetailView } from '@/app/(engineer)/components/reporting/ReportingStudioDetailView';

interface ReportingStudioDetailPageProps {
  params: Promise<{ reportId: string }>;
}

export const metadata = {
  title: 'Report Details | Civora Reporting Studio',
};

export default async function ReportingStudioDetailPage({
  params,
}: ReportingStudioDetailPageProps) {
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
  if (user.assignedProjects && !user.assignedProjects.includes('*') && !user.assignedProjects.includes(report.projectId)) {
    redirect('/unauthorized');
  }

  return <ReportingStudioDetailView user={user} report={report} />;
}
