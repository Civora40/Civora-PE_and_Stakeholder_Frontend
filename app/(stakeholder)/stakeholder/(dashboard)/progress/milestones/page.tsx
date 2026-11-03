import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser, getServerProjects } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
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

  const projects = await getServerProjects();

  return <StakeholderMilestones user={user} projects={projects} />;
}
