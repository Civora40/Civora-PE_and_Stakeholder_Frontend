import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderProjectTeam } from '@/app/(stakeholder)/components/StakeholderProjectTeam';

export const metadata = {
  title: 'Project Team & Directory | Civora Stakeholder Workspace',
  description: 'Verified engineering personnel, leads, and stakeholder liaison contacts.',
};

export default async function StakeholderProjectTeamPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/personnel');
  }

  return <StakeholderProjectTeam user={user} projects={DEMO_PROJECTS} />;
}
