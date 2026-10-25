import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderAccessProjects } from '@/app/(stakeholder)/components/StakeholderAccessProjects';

export const metadata = {
  title: 'Access & Projects | Civora Stakeholder Workspace',
  description: 'View assigned project memberships, stakeholder role permissions, and access status.',
};

export default async function StakeholderAccessPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/projects');
  }

  return <StakeholderAccessProjects user={user} projects={DEMO_PROJECTS} />;
}
