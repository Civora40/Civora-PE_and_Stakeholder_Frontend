import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { UserSettings } from '@/features/settings/components/UserSettings';
import { StakeholderProfile } from '@/features/stakeholder/components/StakeholderProfile';

export const metadata = {
  title: 'My Profile & Preferences | Civora Control Plane',
};

export default async function StakeholderProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  if (user.role === 'read_only_stakeholder') {
    return <StakeholderProfile user={user} defaultTab="profile" />;
  }

  return <UserSettings user={user} />;
}
