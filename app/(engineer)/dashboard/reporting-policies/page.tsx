import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS, DEMO_REPORTING_POLICY } from '@/lib/mock-data/fixtures';
import { ReportingPolicies } from '@/app/(engineer)/components/ReportingPolicies';

export const metadata = {
  title: 'Reporting Policies | Civora Control Plane',
};

export default async function ReportingPoliciesPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  return (
    <ReportingPolicies
      user={user}
      initialPolicy={DEMO_REPORTING_POLICY}
    />
  );
}
