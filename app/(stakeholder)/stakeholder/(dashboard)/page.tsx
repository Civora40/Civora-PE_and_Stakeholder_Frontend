import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { StakeholderOversight } from '@/app/(stakeholder)/components/StakeholderOversight';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';

export const metadata = {
  title: 'Stakeholder Overview | Civora Control Plane',
  description: 'Approved capital project summaries, milestones, and released reports.',
};

export default async function StakeholderOverviewPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard');
  }

  return <StakeholderOversight user={user} />;
}
