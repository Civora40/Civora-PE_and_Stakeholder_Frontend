import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { CivoraDashboard } from '@/features/dashboard/components/CivoraDashboard';
import { StakeholderOversight } from '@/features/stakeholder/components/StakeholderOversight';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';

export const metadata = {
  title: 'Dashboard Overview | Civora Control Plane',
};

export default async function DashboardPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  if (user.role === 'read_only_stakeholder') {
    return <StakeholderOversight user={user} initialTab="executive" />;
  }

  return <CivoraDashboard user={user} />;
}
