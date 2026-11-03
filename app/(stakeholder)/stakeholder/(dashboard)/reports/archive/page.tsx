import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser, getServerProjects } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderReportArchive } from '@/app/(stakeholder)/components/StakeholderReportArchive';

export const metadata = {
  title: 'Report Archive | Civora Stakeholder Workspace',
  description: 'Auditable archive of historical and superseded project compliance reports.',
};

export default async function StakeholderReportArchivePage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/reports');
  }

  const projects = await getServerProjects();

  return <StakeholderReportArchive user={user} projects={projects} />;
}
