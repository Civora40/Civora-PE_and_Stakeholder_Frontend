import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS, DEMO_PROJECTS } from '@/lib/mock-data/fixtures';
import { ReportingStudioOverview } from '@/app/(engineer)/components/reporting/ReportingStudioOverview';

export const metadata = {
  title: 'Reporting Studio | Civora Engineer Dashboard',
  description: 'Create, analyze, and manage project reports from verified project information.',
};

export default async function ReportingStudioOverviewPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/reports');
  }

  return <ReportingStudioOverview user={user} projects={DEMO_PROJECTS} />;
}
