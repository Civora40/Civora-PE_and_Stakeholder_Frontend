import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { CivoraDashboard } from '@/features/dashboard/components/CivoraDashboard';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';

export const metadata = {
  title: 'Dashboard Overview | Civora Control Plane',
};

export default async function DashboardPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  return <CivoraDashboard user={user} />;
}
