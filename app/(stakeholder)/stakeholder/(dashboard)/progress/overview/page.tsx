import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderProgressOverview } from '@/app/(stakeholder)/components/StakeholderProgressOverview';

export const metadata = {
  title: 'Progress Overview | Civora Stakeholder Workspace',
  description: 'Verified physical completion indicators, stage breakdown, and authoritative milestones.',
};

export default async function StakeholderProgressOverviewPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/performance');
  }

  return <StakeholderProgressOverview user={user} projects={DEMO_PROJECTS} />;
}
