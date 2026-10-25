import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderUpdatesFeed } from '@/app/(stakeholder)/components/StakeholderUpdatesFeed';

export const metadata = {
  title: 'Project Updates | Civora Stakeholder Workspace',
  description: 'Published narrative updates and official communications from authorized engineering leads.',
};

export default async function StakeholderUpdatesPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/activity');
  }

  return <StakeholderUpdatesFeed user={user} projects={DEMO_PROJECTS} />;
}
