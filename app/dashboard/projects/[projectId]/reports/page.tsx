import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS } from '@/lib/mock-data/fixtures';
import { ProjectDetailView } from '@/features/projects/components/ProjectDetailView';

interface ProjectReportsPageProps {
  params: Promise<{ projectId: string }>;
}

export const metadata = {
  title: 'Project Released Reports | Civora Control Plane',
};

export default async function ProjectReportsPage({ params }: ProjectReportsPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { projectId } = await params;
  const project = DEMO_PROJECTS.find((p) => p.id === projectId);
  if (!project) notFound();

  if (user.role === 'read_only_stakeholder') {
    const isAssigned =
      user.assignedProjects?.includes('*') || user.assignedProjects?.includes(projectId);
    if (!isAssigned) redirect('/unauthorized');
  }

  return <ProjectDetailView user={user} project={project} initialTab="reports" />;
}
