import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
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

  return <StakeholderRisksIssues user={user} projects={DEMO_PROJECTS} />;
}
