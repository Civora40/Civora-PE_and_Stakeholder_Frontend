import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderSettings } from '@/app/(stakeholder)/components/StakeholderSettings';

export const metadata = {
  title: 'Workspace Settings | Civora Stakeholder Workspace',
  description: 'Manage regional date and time standards, display contrast, and session security.',
};

export default async function StakeholderSettingsPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/settings');
  }

  return <StakeholderSettings user={user} />;
}
