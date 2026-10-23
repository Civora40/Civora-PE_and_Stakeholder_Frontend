import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { CivoraDashboardView } from '@/components/dashboard/CivoraDashboardView';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';

export const metadata = {
  title: 'Dashboard Overview | Civora Control Plane',
};

export default async function DashboardPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.platform_admin;

  return <CivoraDashboardView user={user} />;
}
