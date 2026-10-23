import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export const metadata: Metadata = {
  title: 'Workspace Onboarding | Civora Construction Control Plane',
  description: 'Complete your initial Civora engineering profile and workspace configuration.',
};

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  // If unauthenticated, redirect to login with safe return path
  if (!user) {
    redirect('/login?redirect=/onboarding');
  }

  return <OnboardingFlow initialUser={user} />;
}
