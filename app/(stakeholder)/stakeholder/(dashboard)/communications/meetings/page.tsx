import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderMeetingSchedule } from '@/app/(stakeholder)/components/StakeholderMeetingSchedule';

export const metadata = {
  title: 'Meeting Schedule | Civora Stakeholder Workspace',
  description: 'Authorized milestone review sessions, site inspection gates, and quarterly stakeholder briefings.',
};

export default async function StakeholderMeetingsPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/projects');
  }

  return <StakeholderMeetingSchedule user={user} projects={DEMO_PROJECTS} />;
}
