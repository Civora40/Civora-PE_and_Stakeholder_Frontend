import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser, getServerProjects } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderRisksIssues } from '@/app/(stakeholder)/components/StakeholderRisksIssues';

export const metadata = {
  title: 'Risks & Issues | Civora Stakeholder Workspace',
  description: 'Authorized risks, mitigations, and schedule impacts released for stakeholder oversight.',
};

export default async function StakeholderRisksPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/performance');
  }

  const projects = await getServerProjects();

  return <StakeholderRisksIssues user={user} projects={projects} />;
}
