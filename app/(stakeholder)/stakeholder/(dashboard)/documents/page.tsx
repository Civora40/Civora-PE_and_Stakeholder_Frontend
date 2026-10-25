import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderSharedDocuments } from '@/app/(stakeholder)/components/StakeholderSharedDocuments';

export const metadata = {
  title: 'Shared Documents | Civora Stakeholder Workspace',
  description: 'Approved structural drawings, geotechnical surveys, and environmental permits.',
};

export default async function StakeholderDocumentsPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/submissions/attachments');
  }

  return <StakeholderSharedDocuments user={user} projects={DEMO_PROJECTS} />;
}
