import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { CivoraDashboard } from '@/app/(engineer)/components/CivoraDashboard';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';

export const metadata = {
  title: 'Dashboard Overview | Civora Control Plane',
};

export default async function DashboardPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder');
  }

  return <CivoraDashboard user={user} />;
}
