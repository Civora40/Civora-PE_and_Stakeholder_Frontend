import React from 'react';
import { getCurrentUser, getServerSubmissions } from '@/lib/auth/session';
import { SubmissionsInbox } from '@/app/(engineer)/components/SubmissionsInbox';

export const metadata = {
  title: 'Submissions Inbox | Civora Control Plane',
};

export default async function DashboardSubmissionsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const submissions = await getServerSubmissions();

  return <SubmissionsInbox user={user} submissions={submissions} />;
}
