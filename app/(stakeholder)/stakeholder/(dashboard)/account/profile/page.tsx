import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderProfile } from '@/app/(stakeholder)/components/StakeholderProfile';

export const metadata = {
  title: 'My Profile | Civora Stakeholder Workspace',
  description: 'View and update your permitted stakeholder profile and contact details.',
};

export default async function StakeholderProfilePage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/settings');
  }

  return <StakeholderProfile user={user} />;
}

