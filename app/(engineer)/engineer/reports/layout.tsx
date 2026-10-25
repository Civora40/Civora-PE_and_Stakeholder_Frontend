import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';

export default async function ReportingStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;

  if (!user) {
    redirect('/login');
  }

  // Role gate: Stakeholders cannot access the Engineer Reporting Studio
  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/reports');
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
