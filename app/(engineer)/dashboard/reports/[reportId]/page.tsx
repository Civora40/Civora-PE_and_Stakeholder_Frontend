import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';

interface ReportDetailPageProps {
  params: Promise<{ reportId: string }>;
}

export default async function DashboardReportDetailRedirect({ params }: ReportDetailPageProps) {
  const user = await getCurrentUser();
  const { reportId } = await params;

  if (user?.role === 'read_only_stakeholder') {
    redirect(`/stakeholder/reports/${reportId}`);
  }

  redirect(`/engineer/reports/${reportId}`);
}

