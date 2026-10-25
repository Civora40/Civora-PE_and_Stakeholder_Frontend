import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { STAKEHOLDER_RELEASED_REPORTS } from '@/lib/mock-data/stakeholder';
import { ReportDetailView } from '@/app/(engineer)/components/ReportDetailView';

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

  // Authorization Check: Stakeholders redirected to stakeholder workspace
  if (user.role === 'read_only_stakeholder') {
    redirect(`/stakeholder/reports/${reportId}`);
  }

  return <ReportDetailView user={user} report={report} />;
}
