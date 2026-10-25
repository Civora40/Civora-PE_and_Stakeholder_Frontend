import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { can } from '@/lib/permissions/rbac';
import { ProjectMonitoringFolders } from '@/app/(engineer)/components/ProjectMonitoringFolders';

export const metadata = {
  title: 'All Projects (Monitoring Folders) | Civora Control Plane',
};

interface AllProjectsPageProps {
  searchParams?: Promise<{ folder?: string; project?: string }>;
}

export default async function AllProjectsPage(props: AllProjectsPageProps) {
  const user = await getCurrentUser();
  if (!user) return null;

  if (!can(user, 'projects:read')) {
    redirect('/unauthorized');
  }

  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const folder = searchParams?.folder;
  const project = searchParams?.project;

  return (
    <ProjectMonitoringFolders
      user={user}
      initialFolderId={folder}
      initialProjectId={project}
    />
  );
}
