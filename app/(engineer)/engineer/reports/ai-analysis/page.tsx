import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS, DEMO_PROJECTS } from '@/lib/mock-data/fixtures';
import { ReportingStudioAIAnalysis } from '@/app/(engineer)/components/reporting/ReportingStudioAIAnalysis';

export const metadata = {
  title: 'AI Analysis Engine | Civora Reporting Studio',
  description: 'Analyze authorized field evidence, synthesize observations, and prepare grounded report findings.',
};

export default async function ReportingStudioAIAnalysisPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/reports');
  }

  return <ReportingStudioAIAnalysis user={user} projects={DEMO_PROJECTS} />;
}
