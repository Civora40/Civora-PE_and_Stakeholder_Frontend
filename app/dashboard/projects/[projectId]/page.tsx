import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS } from '@/lib/mock-data/fixtures';
import { ProjectDetailView } from '@/features/projects/components/ProjectDetailView';

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export const metadata = {
  title: 'Project Overview | Civora Control Plane',
};

export default async function ProjectDetailPage({
  params,
  searchParams,
}: ProjectDetailPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const { projectId } = await params;
  const { tab } = await searchParams;

  const project = DEMO_PROJECTS.find((p) => p.id === projectId);
  if (!project) {
    notFound();
  }

  // Authorization Check: Scoped strictly to assigned projects (Section 3.2 & 3.3)
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
