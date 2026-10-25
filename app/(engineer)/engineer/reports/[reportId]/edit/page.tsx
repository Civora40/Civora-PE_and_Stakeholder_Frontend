import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { getStudioReportById } from '@/lib/services/reporting-studio-service';
import { ReportingStudioCMSReportEditor } from '@/app/(engineer)/components/reporting/ReportingStudioCMSReportEditor';

interface ReportingStudioEditorPageProps {
  params: Promise<{ reportId: string }>;
}

export const metadata = {
  title: 'Edit Report | Civora CMS Reporting Studio',
};

export default async function ReportingStudioEditorPage({
  params,
}: ReportingStudioEditorPageProps) {
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

  // Released reports cannot be edited in place (Section 4.2: editing released report must create a new draft)
  if (report.workflowStatus === 'released') {
    redirect(`/engineer/reports/${report.id}`);
  }

  // Verify project assignment authorization
  if (user.assignedProjects && !user.assignedProjects.includes('*') && !user.assignedProjects.includes(report.projectId)) {
    redirect('/unauthorized');
  }

  return <ReportingStudioCMSReportEditor user={user} initialReport={report} />;
}
