import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { STAKEHOLDER_UPDATES } from '@/lib/mock-data/stakeholder';
import { StakeholderUpdatesFeed } from '@/app/(stakeholder)/components/StakeholderUpdatesFeed';

interface StakeholderUpdateDetailPageProps {
  params: Promise<{ updateId: string }>;
}

export const metadata = {
  title: 'Project Update Detail | Civora Stakeholder Workspace',
};

export default async function StakeholderUpdateDetailPage({
  params,
}: StakeholderUpdateDetailPageProps) {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;
  if (!user) {
    redirect('/login');
  }

  const { updateId } = await params;

  const update = STAKEHOLDER_UPDATES.find((u) => u.id === updateId);
  if (!update) {
    notFound();
  }

  // Authorization check
  if (user.role === 'read_only_stakeholder') {
    const isAssigned =
      user.assignedProjects?.includes('*') || user.assignedProjects?.includes(update.projectId);
    if (!isAssigned) {
      redirect('/unauthorized');
    }
  }

  return (
    <StakeholderUpdatesFeed
      user={user}
      projects={DEMO_PROJECTS}
      activeUpdateId={updateId}
    />
  );
}
