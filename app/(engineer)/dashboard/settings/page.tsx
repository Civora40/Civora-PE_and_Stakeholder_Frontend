import React from 'react';
import { redirect } from 'next/navigation';
import { getFreshCurrentUser } from '@/lib/auth/session';
import { UserSettings } from '@/app/(engineer)/components/UserSettings';

export const metadata = {
  title: 'Settings & Profile | Civora Control Plane',
};

export default async function DashboardSettingsPage() {
  const user = await getFreshCurrentUser();
  if (!user) redirect('/login');

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/account/profile');
  }

  return <UserSettings user={user} />;
}
