import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_SUBMISSIONS } from '@/lib/mock-data/fixtures';
import { SubmissionsInbox } from '@/components/submissions/SubmissionsInbox';

export const metadata = {
  title: 'Submissions Inbox | Civora Control Plane',
};

export default async function DashboardSubmissionsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return <SubmissionsInbox user={user} submissions={DEMO_SUBMISSIONS} />;
}
