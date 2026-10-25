import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderDocumentRegister } from '@/app/(stakeholder)/components/StakeholderDocumentRegister';

export const metadata = {
  title: 'Document Register | Civora Stakeholder Workspace',
  description: 'Auditable transmittal log of all formally shared project engineering records.',
};

export default async function StakeholderDocumentRegisterPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/submissions/attachments');
  }

  return <StakeholderDocumentRegister user={user} projects={DEMO_PROJECTS} />;
}
