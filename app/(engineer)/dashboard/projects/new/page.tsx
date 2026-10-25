import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { can } from '@/lib/permissions/rbac';
import { ProjectSetupForm } from '@/app/(engineer)/components/ProjectSetupForm';

export const metadata = {
  title: 'New Project | Civora Control Plane',
};

export default async function NewProjectPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // RBAC Guard: Read-only stakeholders are restricted from creating or provisioning new projects
  if (!can(user, 'projects:manage')) {
    redirect('/unauthorized');
  }

  return <ProjectSetupForm user={user} />;
}
