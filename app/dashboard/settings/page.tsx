import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { UserSettings } from '@/features/settings/components/UserSettings';

export const metadata = {
  title: 'Account Settings | Civora Control Plane',
};

export default async function DashboardSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return <UserSettings user={user} />;
}
