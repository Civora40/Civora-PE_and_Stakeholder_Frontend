import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { STAKEHOLDER_SUPPORT_TICKETS } from '@/lib/mock-data/stakeholder';
import { StakeholderHelpSupport } from '@/app/(stakeholder)/components/StakeholderHelpSupport';

interface StakeholderSupportDetailPageProps {
  params: Promise<{ ticketId: string }>;
}

export const metadata = {
  title: 'Support Request Detail | Civora Stakeholder Workspace',
};

export default async function StakeholderSupportDetailPage({
  params,
}: StakeholderSupportDetailPageProps) {
  const user = (await getCurrentUser()) || DEMO_USERS.read_only_stakeholder;
  if (!user) {
    redirect('/login');
  }

  const { ticketId } = await params;

  const ticket = STAKEHOLDER_SUPPORT_TICKETS.find(
    (t) => t.id === ticketId || t.ticketNumber.toLowerCase() === ticketId.toLowerCase()
  );

  if (!ticket) {
    notFound();
  }

  return <StakeholderHelpSupport user={user} activeTicketId={ticket.id} />;
}
