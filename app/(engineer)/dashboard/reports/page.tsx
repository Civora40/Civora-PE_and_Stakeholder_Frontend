import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_REPORTS } from '@/lib/mock-data/fixtures';
import { ReportsManagement } from '@/app/(engineer)/components/ReportsManagement';

export const metadata = {
  title: 'Reports Management | Civora Control Plane',
};

export default async function DashboardReportsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/reports');
  }

  return <ReportsManagement user={user} reports={DEMO_REPORTS} />;
}
