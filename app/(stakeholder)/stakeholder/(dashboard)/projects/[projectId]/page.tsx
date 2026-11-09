import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser, getSessionData, getServerProjects } from '@/lib/auth/session';
import { fetchBackend } from '@/lib/api/backend-client';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { ProjectDetailView } from '@/app/(stakeholder)/components/StakeholderProjectDetailView';
import { Project } from '@/types';

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

  const projects = await getServerProjects();
  let project = projects.find((p) => p.id === projectId || p.code === projectId);

  if (!project) {
    const session = await getSessionData();
    if (session?.accessToken) {
      const backendRes = await fetchBackend<Project>(`/projects/${projectId}/`, {
        accessToken: session.accessToken,
      });
      if (backendRes.ok && backendRes.data) {
        project = backendRes.data;
      }
    }
  }

  if (!project) {
    notFound();
  }

  // Authorization Check: Scoped strictly to assigned projects
  if (user.role === 'read_only_stakeholder') {
    const isAssigned =
      user.assignedProjects?.includes('*') ||
      user.assignedProjects?.includes(project.id) ||
      user.assignedProjects?.includes(project.code);

    if (!isAssigned) {
      redirect('/unauthorized');
    }
  }

  const validTabs = ['overview', 'milestones', 'reports', 'updates'] as const;
  const initialTab = validTabs.includes(tab as any) ? (tab as any) : 'overview';

  return <ProjectDetailView user={user} project={project} initialTab={initialTab} />;
}
