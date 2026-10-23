import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_REPORTS } from '@/lib/mock-data/fixtures';
import { ReportsManagement } from '@/features/reports/components/ReportsManagement';

export const metadata = {
  title: 'Reports Approval Queue | Civora Control Plane',
};

export default async function ReportsApprovalQueuePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Filter to reports awaiting review or pending release
  const approvalReports = DEMO_REPORTS.filter(
    (r) => r.status === 'review' || r.status === 'draft'
  );

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl bg-[#001237] text-white flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4FAAA7] animate-pulse" />
          <span className="font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
            Reports Awaiting Review & Release Authorization ({approvalReports.length})
          </span>
        </div>
        <span className="text-slate-400 text-[11px]">
          Two-step sign-off: Submission verification is decoupled from client distribution.
        </span>
      </div>
      <ReportsManagement user={user} reports={approvalReports} />
    </div>
  );
}
