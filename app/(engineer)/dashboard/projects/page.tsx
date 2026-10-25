import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS } from '@/lib/mock-data/fixtures';
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

  return <ProjectsDirectory user={user} projects={DEMO_PROJECTS} />;
}
