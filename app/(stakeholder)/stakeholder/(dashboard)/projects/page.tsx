import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderProjectsDirectory } from '@/app/(stakeholder)/components/StakeholderProjectsDirectory';

export const metadata = {
  title: 'My Projects | Civora Stakeholder Workspace',
  description: 'View the construction projects currently shared with your account.',
};

export default async function StakeholderProjectsPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/projects');
  }

  return <StakeholderProjectsDirectory user={user} projects={DEMO_PROJECTS} />;
}
