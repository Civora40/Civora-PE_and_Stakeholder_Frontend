import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { NotificationsCenter } from '@/components/notifications/NotificationsCenter';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';

export const metadata = {
  title: 'Notifications & Alerts Command Center | Civora Control Plane',
  description:
    'Real-time submittal turnaround SLAs, statutory compliance signals, field ingestion events, and executive capital milestones.',
};

export default async function NotificationsPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/notifications');
  }

  return <NotificationsCenter user={user} />;
}
