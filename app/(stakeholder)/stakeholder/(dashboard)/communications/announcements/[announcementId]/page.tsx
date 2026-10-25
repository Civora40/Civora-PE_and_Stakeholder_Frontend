import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { STAKEHOLDER_ANNOUNCEMENTS } from '@/lib/mock-data/stakeholder';
import { StakeholderAnnouncements } from '@/app/(stakeholder)/components/StakeholderAnnouncements';

interface StakeholderAnnouncementDetailPageProps {
  params: Promise<{ announcementId: string }>;
}

export const metadata = {
  title: 'Announcement Detail | Civora Stakeholder Workspace',
};

export default async function StakeholderAnnouncementDetailPage({
  params,
}: StakeholderAnnouncementDetailPageProps) {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;
  if (!user) {
    redirect('/login');
  }

  const { announcementId } = await params;

  const anc = STAKEHOLDER_ANNOUNCEMENTS.find((a) => a.id === announcementId);
  if (!anc) {
    notFound();
  }

  // Check authorization if project-specific
  if (anc.projectId && user.role === 'read_only_stakeholder') {
    const isAssigned =
      user.assignedProjects?.includes('*') || user.assignedProjects?.includes(anc.projectId);
    if (!isAssigned) {
      redirect('/unauthorized');
    }
  }

  return (
    <StakeholderAnnouncements
      user={user}
      projects={DEMO_PROJECTS}
      activeAnnouncementId={announcementId}
    />
  );
}
