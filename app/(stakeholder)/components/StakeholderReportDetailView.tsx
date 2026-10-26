'use client';

import React, { useMemo } from 'react';
import { CivoraUser } from '@/types';
import { StakeholderReleasedReport } from '@/lib/mock-data/stakeholder';
import { StudioReport } from '@/lib/types/reporting-studio';
import { getStakeholderReport } from '@/lib/services/stakeholder-report-service';
import { StakeholderReportStudio } from './StakeholderReportStudio';

interface ReportDetailViewProps {
  user: CivoraUser;
  report: StakeholderReleasedReport | StudioReport;
  initialMode?: 'editor' | 'preview' | 'dossier';
}

export function ReportDetailView({ user, report, initialMode = 'editor' }: ReportDetailViewProps) {
  // Hydrate full studio report with rich compliance sections, cover page, and layout
  const fullReport = useMemo(() => {
    return getStakeholderReport(report.id);
  }, [report.id]);

  return <StakeholderReportStudio user={user} report={fullReport} initialMode={initialMode} />;
}

// Backward compatibility export
export { ReportDetailView as StakeholderReportDetailView };
