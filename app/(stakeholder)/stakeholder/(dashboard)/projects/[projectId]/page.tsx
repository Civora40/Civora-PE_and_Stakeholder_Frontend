import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { ProjectDetailView } from '@/app/(stakeholder)/components/StakeholderProjectDetailView';

interface StakeholderProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export const metadata = {
  title: 'Project Overview | Civora Stakeholder Workspace',
};

export default async function StakeholderProjectDetailPage({
  params,
  searchParams,
}: StakeholderProjectDetailPageProps) {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;
  if (!user) {
    redirect('/login');
  }

  const { projectId } = await params;
  const { tab } = await searchParams;

  const project = DEMO_PROJECTS.find((p) => p.id === projectId);
  if (!project) {
    notFound();
  }

  // Authorization Check: Scoped strictly to assigned projects
  if (user.role === 'read_only_stakeholder') {
    const isAssigned =
      user.assignedProjects?.includes('*') || user.assignedProjects?.includes(projectId);

    if (!isAssigned) {
      redirect('/unauthorized');
    }
  }

  const validTabs = ['overview', 'milestones', 'reports', 'updates'] as const;
  const initialTab = validTabs.includes(tab as any) ? (tab as any) : 'overview';

  return <ProjectDetailView user={user} project={project} initialTab={initialTab} />;
}
