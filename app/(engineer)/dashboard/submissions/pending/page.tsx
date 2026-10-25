import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_SUBMISSIONS } from '@/lib/mock-data/fixtures';
import { SubmissionsInbox } from '@/app/(engineer)/components/SubmissionsInbox';

export const metadata = {
  title: 'Pending Review Submissions | Civora Control Plane',
};

export default async function PendingSubmissionsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Filter to pending review or verification needed
  const pendingSubmissions = DEMO_SUBMISSIONS.filter(
    (s) => s.reviewStatus === 'pending_review' || s.reviewStatus === 'needs_verification'
  );

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl bg-[#001237] text-white flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4FAAA7] animate-pulse" />
          <span className="font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
            Filtered Queue: Submissions Awaiting Engineer Review ({pendingSubmissions.length})
          </span>
        </div>
        <span className="text-slate-400 text-[11px]">
          Priority queue for submittal sign-offs and identity verifications
        </span>
      </div>
      <SubmissionsInbox user={user} submissions={pendingSubmissions} />
    </div>
  );
}
