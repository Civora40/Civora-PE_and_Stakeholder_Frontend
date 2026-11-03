import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser, getServerProjects } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { ReportingStudioAllReports } from '@/app/(engineer)/components/reporting/ReportingStudioAllReports';

export const metadata = {
  title: 'All Reports | Civora Reporting Studio',
  description: 'Searchable and filterable report register across assigned assets.',
};

export default async function ReportingStudioAllReportsPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/reports');
  }

  const projects = await getServerProjects();

  return <ReportingStudioAllReports user={user} projects={projects} />;
}
