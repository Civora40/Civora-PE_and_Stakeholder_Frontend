import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';

export default async function StakeholderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login?redirect=/stakeholder');
  }

  // Role defense in depth: Engineers redirected to engineer dashboard
  if (user.role === 'project_engineer') {
    redirect('/dashboard');
  }

  // Onboarding defense in depth: Incomplete onboarding redirected to onboarding
  if (!user.onboardingCompletedAt) {
    redirect('/stakeholder/onboarding');
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
