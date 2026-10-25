import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderAnnouncements } from '@/app/(stakeholder)/components/StakeholderAnnouncements';

export const metadata = {
  title: 'Official Announcements | Civora Stakeholder Workspace',
  description: 'Formal corporate disclosures, regulatory notices, and project bulletins released for stakeholder visibility.',
};

export default async function StakeholderAnnouncementsPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/activity');
  }

  return <StakeholderAnnouncements user={user} projects={DEMO_PROJECTS} />;
}
