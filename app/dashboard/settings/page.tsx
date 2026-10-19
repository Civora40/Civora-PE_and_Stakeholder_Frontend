import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { SettingsView } from '@/components/settings/SettingsView';

export const metadata = {
  title: 'Settings & RBAC Matrix | Civora Control Plane',
};

export default async function DashboardSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return <SettingsView user={user} />;
}
