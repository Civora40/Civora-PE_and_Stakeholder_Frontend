import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { StakeholderOnboarding } from '@/features/stakeholder/components/StakeholderOnboarding';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';

export const metadata: Metadata = {
  title: 'Stakeholder Onboarding | Civora Control Plane',
  description: 'First-time setup for authorized project stakeholders, clients, and funders.',
};

export default async function StakeholderOnboardingPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login?redirect=/stakeholder/onboarding');
  }

  return <StakeholderOnboarding user={user} initialStep={1} />;
}
