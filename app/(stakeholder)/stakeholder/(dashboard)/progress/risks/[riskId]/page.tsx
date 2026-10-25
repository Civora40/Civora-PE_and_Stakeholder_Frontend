import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_USERS } from '@/lib/mock-data/fixtures';
import { STAKEHOLDER_RISKS } from '@/lib/mock-data/stakeholder';
import { StakeholderRisksIssues } from '@/app/(stakeholder)/components/StakeholderRisksIssues';

interface StakeholderRiskDetailPageProps {
  params: Promise<{ riskId: string }>;
}

export const metadata = {
  title: 'Risk Detail | Civora Stakeholder Workspace',
};

export default async function StakeholderRiskDetailPage({
  params,
}: StakeholderRiskDetailPageProps) {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;
  if (!user) {
    redirect('/login');
  }

  const { riskId } = await params;

  const risk = STAKEHOLDER_RISKS.find((r) => r.id === riskId);
  if (!risk) {
    notFound();
  }

  // Authorization check
  if (user.role === 'read_only_stakeholder') {
    const isAssigned =
      user.assignedProjects?.includes('*') || user.assignedProjects?.includes(risk.projectId);
    if (!isAssigned) {
      redirect('/unauthorized');
    }
  }

  return (
    <StakeholderRisksIssues
      user={user}
      projects={DEMO_PROJECTS}
      activeRiskId={riskId}
    />
  );
}
