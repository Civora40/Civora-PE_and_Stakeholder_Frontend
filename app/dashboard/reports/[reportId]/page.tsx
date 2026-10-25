import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { STAKEHOLDER_RELEASED_REPORTS } from '@/lib/mock-data/stakeholder';
import { ReportDetailView } from '@/features/reports/components/ReportDetailView';

interface ReportDetailPageProps {
  params: Promise<{ reportId: string }>;
}

export const metadata = {
  title: 'Report Details | Civora Control Plane',
};

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const { reportId } = await params;

  // Find report in released reports dataset
  const report = STAKEHOLDER_RELEASED_REPORTS.find(
    (r) => r.id === reportId || r.reportNumber.toLowerCase() === reportId.toLowerCase()
  );

  if (!report) {
    notFound();
  }

  // Authorization Check: Scoped strictly to assigned projects (Section 3.2, 3.3 & 9)
  if (user.role === 'read_only_stakeholder') {
    const isAssigned =
      user.assignedProjects?.includes('*') || user.assignedProjects?.includes(report.projectId);

    if (!isAssigned) {
      redirect('/unauthorized');
    }
  }

  return <ReportDetailView user={user} report={report} />;
}
