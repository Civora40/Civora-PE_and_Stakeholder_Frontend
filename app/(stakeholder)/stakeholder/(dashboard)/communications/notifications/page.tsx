import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { NotificationsCenter } from '@/components/notifications/NotificationsCenter';

export const metadata = {
  title: 'Notifications & Alerts | Civora Stakeholder Workspace',
  description: 'In-app notification feed for report releases, milestone gates, and corporate announcements.',
};

export default async function StakeholderCommunicationsNotificationsPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/notifications');
  }

  return <NotificationsCenter user={user} />;
}
