import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { StakeholderHelpSupport } from '@/app/(stakeholder)/components/StakeholderHelpSupport';

export const metadata = {
  title: 'Help & Support | Civora Stakeholder Workspace',
  description: 'Self-service help documentation, FAQs, and institutional support request tracking.',
};

export default async function StakeholderSupportPage() {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'read_only_stakeholder') {
    redirect('/dashboard');
  }

  return <StakeholderHelpSupport user={user} />;
}
