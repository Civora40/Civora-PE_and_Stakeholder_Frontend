import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS, DEMO_PERFORMANCE_ASSESSMENTS, DEMO_REPORTING_POLICY } from '@/lib/mock-data/fixtures';
import { PerformanceDashboard } from '@/app/(engineer)/components/PerformanceDashboard';

export const metadata = {
  title: 'Key Metrics & Performance Assessment | Civora Control Plane',
};

export default async function PerformancePage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  return (
    <PerformanceDashboard
      user={user}
      initialAssessments={DEMO_PERFORMANCE_ASSESSMENTS}
      initialPolicy={DEMO_REPORTING_POLICY}
    />
  );
}
