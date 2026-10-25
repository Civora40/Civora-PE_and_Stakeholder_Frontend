import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderMilestones } from '@/app/(stakeholder)/components/StakeholderMilestones';

export const metadata = {
  title: 'Project Milestones | Civora Stakeholder Workspace',
  description: 'Verified milestone status, completion evidence, and statutory stage inspections.',
};

export default async function StakeholderMilestonesPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/projects/milestones');
  }

  return <StakeholderMilestones user={user} projects={DEMO_PROJECTS} />;
}
