import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser, getServerProjects } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { ReportingStudioDrafts } from '@/app/(engineer)/components/reporting/ReportingStudioDrafts';

export const metadata = {
  title: 'Drafts & In Progress | Civora Reporting Studio',
  description: 'Resume saved report drafts, review author notes, and prepare technical submissions.',
};

export default async function ReportingStudioDraftsPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/reports');
  }

  const projects = await getServerProjects();

  return <ReportingStudioDrafts user={user} projects={projects} />;
}
