import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS, DEMO_PERFORMANCE_ASSESSMENTS, DEMO_REPORTING_POLICY } from '@/lib/mock-data/fixtures';
import { PerformanceDashboard } from '@/app/(engineer)/components/PerformanceDashboard';

export const metadata = {
  title: 'Reporting Compliance | Civora Control Plane',
};

export default async function CompliancePage() {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl bg-[#001237] text-white flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4FAAA7]" />
          <span className="font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
            Reporting Compliance & Statutory Exception Logging
          </span>
        </div>
        <span className="text-slate-400 text-[11px]">
          Approved adjustments subtracted from required reporting denominator.
        </span>
      </div>
      <PerformanceDashboard
        user={user}
        initialAssessments={DEMO_PERFORMANCE_ASSESSMENTS}
        initialPolicy={DEMO_REPORTING_POLICY}
      />
    </div>
  );
}
