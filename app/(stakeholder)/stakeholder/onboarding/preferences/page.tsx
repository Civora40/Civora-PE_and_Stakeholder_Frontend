import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { StakeholderOnboarding } from '@/app/(stakeholder)/components/StakeholderOnboarding';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';

export const metadata: Metadata = {
  title: 'Notification Preferences | Stakeholder Onboarding | Civora',
};

export default async function StakeholderPreferencesOnboardingPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;
  if (!user) redirect('/login');
  return <StakeholderOnboarding user={user} initialStep={4} />;
}
