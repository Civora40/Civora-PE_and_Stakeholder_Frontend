import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser, getServerProjects } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderProjectPortfolio } from '@/app/(stakeholder)/components/StakeholderProjectPortfolio';

export const metadata = {
  title: 'Project Portfolio | Civora Stakeholder Workspace',
  description: 'Portfolio-level health, budget summary, and cross-project comparison.',
};

export default async function StakeholderProjectPortfolioPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard/projects');
  }

  const projects = await getServerProjects();

  return <StakeholderProjectPortfolio user={user} projects={projects} />;
}
