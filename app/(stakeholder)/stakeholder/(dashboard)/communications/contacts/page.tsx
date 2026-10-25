import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderContactTeam } from '@/app/(stakeholder)/components/StakeholderContactTeam';

export const metadata = {
  title: 'Contact Project Team | Civora Stakeholder Workspace',
  description: 'Submit official stakeholder inquiries and reach designated engineering leads and regulatory liaison officers.',
};

export default async function StakeholderContactPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/personnel');
  }

  return <StakeholderContactTeam user={user} projects={DEMO_PROJECTS} />;
}
