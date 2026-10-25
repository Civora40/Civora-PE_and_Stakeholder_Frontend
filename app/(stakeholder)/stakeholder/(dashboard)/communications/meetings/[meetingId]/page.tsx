import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { STAKEHOLDER_MEETINGS } from '@/lib/mock-data/stakeholder';
import { StakeholderMeetingSchedule } from '@/app/(stakeholder)/components/StakeholderMeetingSchedule';

interface StakeholderMeetingDetailPageProps {
  params: Promise<{ meetingId: string }>;
}

export const metadata = {
  title: 'Meeting Details | Civora Stakeholder Workspace',
};

export default async function StakeholderMeetingDetailPage({
  params,
}: StakeholderMeetingDetailPageProps) {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;
  if (!user) {
    redirect('/login');
  }

  const { meetingId } = await params;

  const mtg = STAKEHOLDER_MEETINGS.find((m) => m.id === meetingId);
  if (!mtg) {
    notFound();
  }

  // Check authorization
  if (user.role === 'read_only_stakeholder') {
    const isAssigned =
      user.assignedProjects?.includes('*') || user.assignedProjects?.includes(mtg.projectId);
    if (!isAssigned) {
      redirect('/unauthorized');
    }
  }

  return (
    <StakeholderMeetingSchedule
      user={user}
      projects={DEMO_PROJECTS}
      activeMeetingId={meetingId}
    />
  );
}
