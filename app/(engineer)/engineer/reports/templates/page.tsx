import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { ReportingStudioTemplates } from '@/app/(engineer)/components/reporting/ReportingStudioTemplates';

export const metadata = {
  title: 'Report Templates | Civora Reporting Studio',
  description: 'Standardized institutional report templates for daily, weekly, monthly, and statutory compliance.',
};

export default async function ReportingStudioTemplatesPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/reports');
  }

  return <ReportingStudioTemplates user={user} />;
}
