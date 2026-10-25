import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderProjectTimeline } from '@/app/(stakeholder)/components/StakeholderProjectTimeline';

export const metadata = {
  title: 'Project Timeline | Civora Stakeholder Workspace',
  description: 'Cross-project delivery schedule, milestone progression, and completion gates.',
};

export default async function StakeholderProjectTimelinePage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/projects/milestones');
  }

  return <StakeholderProjectTimeline user={user} projects={DEMO_PROJECTS} />;
}
