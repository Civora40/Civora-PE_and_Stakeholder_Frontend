import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_REPORTS } from '@/lib/mock-data/fixtures';
import { ReportsManagement } from '@/features/reports/components/ReportsManagement';

export const metadata = {
  title: 'Reports Management | Civora Control Plane',
};

export default async function DashboardReportsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return <ReportsManagement user={user} reports={DEMO_REPORTS} />;
}
