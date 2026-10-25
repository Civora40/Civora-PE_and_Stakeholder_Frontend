import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS, DEMO_PROJECTS } from '@/lib/mock-data/fixtures';
import { ReportingStudioReviewSubmissions } from '@/app/(engineer)/components/reporting/ReportingStudioReviewSubmissions';

export const metadata = {
  title: 'Review & Submissions | Civora Reporting Studio',
  description: 'Track submitted reports, evaluate peer reviews, and authorize stakeholder releases.',
};

export default async function ReportingStudioReviewSubmissionsPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/reports');
  }

  return <ReportingStudioReviewSubmissions user={user} projects={DEMO_PROJECTS} />;
}
