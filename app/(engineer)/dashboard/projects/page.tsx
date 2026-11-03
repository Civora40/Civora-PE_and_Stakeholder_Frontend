import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser, getServerProjects } from '@/lib/auth/session';
import { ProjectsDirectory } from '@/app/(engineer)/components/ProjectsDirectory';

export const metadata = {
  title: 'Projects Directory | Civora Control Plane',
};

export default async function DashboardProjectsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/projects');
  }

  const projects = await getServerProjects();

  return <ProjectsDirectory user={user} projects={projects} />;
}
