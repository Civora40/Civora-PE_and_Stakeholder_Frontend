import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS, DEMO_PROJECTS } from '@/lib/mock-data/fixtures';
import { ReportingStudioCreateReport } from '@/app/(engineer)/components/reporting/ReportingStudioCreateReport';

export const metadata = {
  title: 'Create Report | Civora Reporting Studio',
  description: 'Start a new engineering report from an institutional template or blank structure.',
};

export default async function ReportingStudioCreateReportPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/reports');
  }

  return <ReportingStudioCreateReport user={user} projects={DEMO_PROJECTS} />;
}
