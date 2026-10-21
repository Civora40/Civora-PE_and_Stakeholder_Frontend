import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (!user.onboardingCompletedAt) {
    redirect('/onboarding');
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
