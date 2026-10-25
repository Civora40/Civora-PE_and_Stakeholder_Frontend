import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderReportsManagement } from '@/app/(stakeholder)/components/StakeholderReportsManagement';

export const metadata = {
  title: 'Released Reports | Civora Stakeholder Workspace',
  description: 'Access reports that have been approved and released for your projects.',
};

export default async function StakeholderReportsPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/reports');
  }

  return <StakeholderReportsManagement user={user} />;
}
