import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser, getSessionData, getServerProjects } from '@/lib/auth/session';
import { fetchBackend } from '@/lib/api/backend-client';
import { ProjectDetailView } from '@/app/(engineer)/components/ProjectDetailView';
import { Project } from '@/types';

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

  // Role check: Stakeholder redirected to dedicated stakeholder project view
  if (user.role === 'read_only_stakeholder') {
    redirect(`/stakeholder/projects/${projectId}`);
  }

  const validTabs = [
    'overview',
    'disciplines',
    'wbs',
    'history',
    'milestones',
    'reports',
    'updates',
  ] as const;
  const initialTab = validTabs.includes(tab as any) ? (tab as any) : 'overview';

  return <ProjectDetailView user={user} project={project} initialTab={initialTab} />;
}

