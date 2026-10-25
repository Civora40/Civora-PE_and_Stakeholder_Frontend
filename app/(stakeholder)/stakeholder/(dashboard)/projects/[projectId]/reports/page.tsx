import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { ProjectDetailView } from '@/app/(stakeholder)/components/StakeholderProjectDetailView';

interface StakeholderProjectReportsPageProps {
  params: Promise<{ projectId: string }>;
}

export const metadata = {
  title: 'Project Released Reports | Civora Stakeholder Workspace',
};

export default async function StakeholderProjectReportsPage({ params }: StakeholderProjectReportsPageProps) {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;
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
