import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { getStudioReportById } from '@/lib/services/reporting-studio-service';
import { ReportingStudioReportReview } from '@/app/(engineer)/components/reporting/ReportingStudioReportReview';

interface ReportingStudioReviewPageProps {
  params: Promise<{ reportId: string }>;
}

export const metadata = {
  title: 'Report Technical Review & Governance | Civora Reporting Studio',
  description: 'Manage peer review comments, revision requests, approval sign-offs, and stakeholder publishing.',
};

export default async function ReportingStudioReviewPage({
  params,
}: ReportingStudioReviewPageProps) {
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

  return <ReportingStudioReportReview user={user} report={report} />;
}
