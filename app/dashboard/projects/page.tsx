import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS } from '@/lib/mock-data/fixtures';
import { ProjectsDirectory } from '@/components/projects/ProjectsDirectory';

export const metadata = {
  title: 'Projects Directory | Civora Control Plane',
};

export default async function DashboardProjectsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return <ProjectsDirectory user={user} projects={DEMO_PROJECTS} />;
}
