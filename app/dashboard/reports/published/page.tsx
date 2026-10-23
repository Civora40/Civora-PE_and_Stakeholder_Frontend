import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_REPORTS } from '@/lib/mock-data/fixtures';
import { ReportsManagement } from '@/features/reports/components/ReportsManagement';

export const metadata = {
  title: 'Published Reports | Civora Control Plane',
};

export default async function PublishedReportsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Filter to released / approved reports
  const publishedReports = DEMO_REPORTS.filter(
    (r) => r.status === 'released' || r.status === 'approved'
  );

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl bg-[#001237] text-white flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
            Released & Immutable Client Reports ({publishedReports.length})
          </span>
        </div>
        <span className="text-slate-400 text-[11px]">
          Distributed to authorized clients and institutional stakeholders.
        </span>
      </div>
      <ReportsManagement user={user} reports={publishedReports} />
    </div>
  );
}
