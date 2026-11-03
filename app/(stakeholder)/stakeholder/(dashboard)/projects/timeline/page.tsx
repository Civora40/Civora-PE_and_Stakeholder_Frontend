import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser, getServerProjects } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
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

  const projects = await getServerProjects();

  return <StakeholderProjectTimeline user={user} projects={projects} />;
}
