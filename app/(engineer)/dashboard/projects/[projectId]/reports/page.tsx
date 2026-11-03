import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser, getServerProjects } from '@/lib/auth/session';
import { ProjectDetailView } from '@/app/(engineer)/components/ProjectDetailView';

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
  const projects = await getServerProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) notFound();

  if (user.role === 'read_only_stakeholder') {
    redirect(`/stakeholder/projects/${projectId}/reports`);
  }

  return <ProjectDetailView user={user} project={project} initialTab="reports" />;
}
