import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { fetchBackend } from '@/lib/api/backend-client';
import { getCurrentUser, getSessionData } from '@/lib/auth/session';
import { OnboardingFlow } from '@/app/(auth)/components/OnboardingFlow';
import { CivoraUser } from '@/types';

export const metadata: Metadata = {
  title: 'Workspace Onboarding | Civora Construction Control Plane',
  description: 'Complete your initial Civora engineering profile and workspace configuration.',
};

export default async function OnboardingPage() {
  const session = await getSessionData();
  let user = session?.user || (await getCurrentUser());

  // If unauthenticated, redirect to login with safe return path
  if (!user) {
    redirect('/login?redirect=/onboarding');
  }

  // Hydrate fresh user state from backend if authenticated with JWT
  if (session?.accessToken) {
    const backendRes = await fetchBackend<{
      user: CivoraUser;
      completed: boolean;
      currentStep: number;
    }>('/users/onboarding/', {
      method: 'GET',
      accessToken: session.accessToken,
    });
    if (backendRes.ok && backendRes.data?.user) {
      user = backendRes.data.user;
    }
  }

  return <OnboardingFlow initialUser={user} />;
}
