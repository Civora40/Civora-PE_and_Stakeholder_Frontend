import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { can } from '@/lib/permissions/rbac';
import { DEMO_REPORTS } from '@/lib/mock-data/fixtures';
import { ReportsManagement } from '@/features/reports/components/ReportsManagement';

export const metadata = {
  title: 'Report Approvals & Release | Civora Control Plane',
};

export default async function ReportApprovalsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Server-side release authority & role check: only Project Engineer can access
  if (user.role !== 'project_engineer' || !can(user, 'reports:release')) {
    redirect('/unauthorized');
  }

  // Filter to reports awaiting final engineer sign-off or release
  const awaitingApproval = DEMO_REPORTS.filter(
    (r) => r.status === 'review' || r.status === 'draft'
  );

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#001237] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
            Report Release Sign-Off Workspace ({awaitingApproval.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Two-Step Release Protocol: Authorize distribution to registered project stakeholders.
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#4FAAA7] px-2.5 py-1 rounded bg-white/5 border border-white/10 shrink-0">
          COREN Sign-Off Authority Verified
        </span>
      </div>

      <ReportsManagement user={user} reports={awaitingApproval} />
    </div>
  );
}
