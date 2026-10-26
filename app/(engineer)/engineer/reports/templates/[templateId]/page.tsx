import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_USERS } from '@/lib/mock-data/fixtures';
import { getStudioTemplateById } from '@/lib/services/reporting-studio-service';
import { ReportingStudioTemplateDetail } from '@/app/(engineer)/components/reporting/ReportingStudioTemplateDetail';

interface ReportingStudioTemplateDetailPageProps {
  params: Promise<{ templateId: string }>;
}

export const metadata = {
  title: 'Report Template Specifications | Civora Reporting Studio',
  description: 'Inspect approved institutional report schemas, required sections, and statutory delivery gates.',
};

export default async function ReportingStudioTemplateDetailPage({
  params,
}: ReportingStudioTemplateDetailPageProps) {
  const user = (await getCurrentUser()) || DEMO_USERS.project_engineer;
  if (!user) {
    redirect('/login');
  }

  if (user.role === 'read_only_stakeholder') {
    redirect('/stakeholder/reports');
  }

  const { templateId } = await params;
  const template = getStudioTemplateById(templateId);

  if (!template) {
    notFound();
  }

  return <ReportingStudioTemplateDetail user={user} template={template} />;
}
