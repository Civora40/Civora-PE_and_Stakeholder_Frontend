import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { STAKEHOLDER_DOCUMENTS } from '@/lib/mock-data/stakeholder';
import { StakeholderDocumentDetail } from '@/app/(stakeholder)/components/StakeholderDocumentDetail';

interface StakeholderDocumentDetailPageProps {
  params: Promise<{ documentId: string }>;
}

export const metadata = {
  title: 'Shared Document Details | Civora Stakeholder Workspace',
};

export default async function StakeholderDocumentDetailPage({
  params,
}: StakeholderDocumentDetailPageProps) {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;
  if (!user) {
    redirect('/login');
  }

  const { documentId } = await params;

  const doc = STAKEHOLDER_DOCUMENTS.find(
    (d) => d.id === documentId || d.code.toLowerCase() === documentId.toLowerCase()
  );

  if (!doc) {
    notFound();
  }

  // Authorization Check: Scoped strictly to assigned projects
  if (user.role === 'read_only_stakeholder') {
    const isAssigned =
      user.assignedProjects?.includes('*') || user.assignedProjects?.includes(doc.projectId);

    if (!isAssigned) {
      redirect('/unauthorized');
    }
  }

  return <StakeholderDocumentDetail user={user} document={doc} />;
}
