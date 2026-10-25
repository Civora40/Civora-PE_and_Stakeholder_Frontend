import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { UserSettings } from '@/app/(engineer)/components/UserSettings';

export const metadata = {
  title: 'My Profile & Preferences | Civora Control Plane',
};

export default async function EngineerProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/profile');
  }

  return <UserSettings user={user} />;
}
