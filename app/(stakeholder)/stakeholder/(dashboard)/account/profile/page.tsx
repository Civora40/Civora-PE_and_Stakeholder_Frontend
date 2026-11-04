import React from 'react';
import { redirect } from 'next/navigation';
import { getFreshCurrentUser } from '@/lib/auth/session';
import { StakeholderProfile } from '@/app/(stakeholder)/components/StakeholderProfile';

export const metadata = {
  title: 'My Profile | Civora Stakeholder Workspace',
  description: 'View and update your permitted stakeholder profile and contact details.',
};

export default async function StakeholderProfilePage() {
  const user = await getFreshCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/profile');
  }

  return <StakeholderProfile user={user} />;
}
