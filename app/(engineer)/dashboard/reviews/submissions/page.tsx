import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { can } from '@/lib/permissions/rbac';
import { DEMO_SUBMISSIONS } from '@/lib/mock-data/fixtures';
import { SubmissionsInbox } from '@/app/(engineer)/components/SubmissionsInbox';

export const metadata = {
  title: 'Submission Reviews | Civora Control Plane',
};

export default async function SubmissionReviewsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Server-side permission & role check: only Project Engineer can access
  if (user.role !== 'project_engineer' || !can(user, 'submissions:review')) {
    redirect('/unauthorized');
  }

  // Filter to submissions awaiting review or needs information
  const reviewsQueue = DEMO_SUBMISSIONS.filter(
    (s) => s.reviewStatus === 'pending_review' || s.reviewStatus === 'needs_information' || s.reviewStatus === 'needs_verification'
  );

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#001237] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4FAAA7] animate-pulse" />
            Engineering Submission Review Queue ({reviewsQueue.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate concrete compression curves, slump records, and rebar verification logs.
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#4FAAA7] px-2.5 py-1 rounded bg-white/5 border border-white/10 shrink-0">
          COREN Technical Inspection Active
        </span>
      </div>

      <SubmissionsInbox user={user} submissions={reviewsQueue} />
    </div>
  );
}
