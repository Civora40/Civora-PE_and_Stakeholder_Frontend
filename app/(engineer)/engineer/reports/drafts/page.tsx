import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS, DEMO_PROJECTS } from '@/lib/mock-data/fixtures';
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

  return <ReportingStudioDrafts user={user} projects={DEMO_PROJECTS} />;
}
