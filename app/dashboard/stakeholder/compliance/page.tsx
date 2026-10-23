import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { StakeholderOversight } from '@/features/stakeholder/components/StakeholderOversight';

export const metadata = {
  title: 'Statutory Compliance Register | Civora Control Plane',
};

export default async function StakeholderCompliancePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Server-side role isolation: only read_only_stakeholder can access
  if (user.role !== 'read_only_stakeholder') {
    redirect('/unauthorized');
  }

  return <StakeholderOversight user={user} initialTab="compliance" />;
}
