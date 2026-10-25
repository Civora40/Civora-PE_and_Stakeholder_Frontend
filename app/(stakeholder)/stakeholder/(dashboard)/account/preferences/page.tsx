import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderNotificationPreferences } from '@/app/(stakeholder)/components/StakeholderNotificationPreferences';

export const metadata = {
  title: 'Notification Preferences | Civora Stakeholder Workspace',
  description: 'Manage in-app alerts and email dispatches for reports, milestones, and announcements.',
};

export default async function StakeholderPreferencesPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/settings');
  }

  return <StakeholderNotificationPreferences user={user} />;
}
