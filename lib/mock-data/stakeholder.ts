export interface StakeholderProjectMilestone {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  targetDate: string;
  completionDate?: string;
  status: 'completed' | 'on_schedule' | 'past_target_date' | 'upcoming';
}

export interface StakeholderUpdateItem {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  summary: string;
  timestamp: string;
  type: 'report_released' | 'milestone_updated' | 'announcement' | 'summary_updated';
  linkUrl: string;
  linkLabel: string;
}

export interface StakeholderReleasedReport {
  id: string;
  reportNumber: string;
  title: string;
  projectId: string;
  projectName: string;
  period: string;
  releaseDate: string;
  version: string;
  executiveSummary: string;
  fileSize: string;
  status: 'released';
}

export const STAKEHOLDER_MILESTONES: StakeholderProjectMilestone[] = [
  {
    id: 'mst_01',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    name: 'Marina Station Concourse Deck Slab Concrete Sign-Off',
    targetDate: '12 Oct 2026',
    completionDate: '14 Oct 2026',
    status: 'completed',
  },
  {
    id: 'mst_02',
    projectId: 'prj_pier_03',
    projectName: 'Lekki Deep Sea Port',
    name: 'Quay Wall Berth 1 Bathymetric 16.5m Draft Clearance',
    targetDate: '20 Oct 2026',
    completionDate: '20 Oct 2026',
    status: 'completed',
  },
  {
    id: 'mst_03',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    name: 'Station Concourse West Platform Glazing & Facade',
    targetDate: '15 Nov 2026',
    status: 'on_schedule',
  },
  {
    id: 'mst_04',
    projectId: 'prj_civic_02',
    projectName: 'Eko Atlantic Coastal Revetment',
    name: 'Coastal Armor Unit Placement (Chainage 3+200)',
    targetDate: '28 Nov 2026',
    status: 'on_schedule',
  },
  {
    id: 'mst_05',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    name: 'Drainage Outfall Environmental Water Sample Validation',
    targetDate: '18 Oct 2026',
    status: 'past_target_date',
  },
  {
    id: 'mst_06',
    projectId: 'prj_datacenter_04',
    projectName: 'Abuja CBD Interchange',
    name: 'Right-of-Way Geodetic Baseline Survey Sign-off',
    targetDate: '10 Dec 2026',
    status: 'upcoming',
  },
];

export const STAKEHOLDER_UPDATES: StakeholderUpdateItem[] = [
  {
    id: 'upd_01',
    projectId: 'prj_civic_02',
    projectName: 'Eko Atlantic Coastal Revetment',
    title: 'Report Released: Coastal Wave Energy Defense & Revetment Stability',
    summary: 'October monthly compliance dossier REP-2026-M10-01 has completed technical approvals and is released for stakeholder access.',
    timestamp: '18 mins ago',
    type: 'report_released',
    linkUrl: '/dashboard/reports',
    linkLabel: 'Open Report',
  },
  {
    id: 'upd_02',
    projectId: 'prj_pier_03',
    projectName: 'Lekki Deep Sea Port',
    title: 'Milestone Achieved: Quay Wall Berth Bathymetric Clearance',
    summary: 'Nigerian Ports Authority hydrographic survey verified 16.5m draft clearance for primary container berth.',
    timestamp: '2 hours ago',
    type: 'milestone_updated',
    linkUrl: '/dashboard/projects',
    linkLabel: 'View Project',
  },
  {
    id: 'upd_03',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    title: 'Project Summary Updated: Q4 Infrastructure Target Cadence',
    summary: 'Approved project summary updated following LASBCA Stage 2 structural notice acknowledgment.',
    timestamp: 'Yesterday at 15:40',
    type: 'summary_updated',
    linkUrl: '/dashboard/projects',
    linkLabel: 'View Project',
  },
  {
    id: 'upd_04',
    projectId: 'prj_datacenter_04',
    projectName: 'Abuja CBD Interchange',
    title: 'Statutory Announcement: FCDA Right-of-Way Permit Verified',
    summary: 'Federal Capital Development Authority issued formal right-of-way statutory authorization FCDA-ENG-CBD-04.',
    timestamp: '2 days ago',
    type: 'announcement',
    linkUrl: '/dashboard/projects',
    linkLabel: 'View Project',
  },
];

export const STAKEHOLDER_RELEASED_REPORTS: StakeholderReleasedReport[] = [
  {
    id: 'rep_02',
    reportNumber: 'REP-2026-Q3-02',
    title: 'Marine Geotechnical Integrity & Environmental Sign-Off',
    projectId: 'prj_pier_03',
    projectName: 'Lekki Deep Sea Port — Quay Wall & Breakwater Extension',
    period: 'September 2026',
    releaseDate: '10 Oct 2026',
    version: 'v1.2 Released',
    executiveSummary: 'Official released compliance package for Port Authority commissioners. Document package links verified ultrasonic sheet pile data with environmental turbidity logs.',
    fileSize: '4.8 MB PDF',
    status: 'released',
  },
  {
    id: 'rep_04',
    reportNumber: 'REP-2026-Q3-01',
    title: 'Civil Infrastructure Quality Assurance & Statutory Compliance Dossier',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line) — Viaduct & Station',
    period: 'Q3 2026 (Jul - Sep)',
    releaseDate: '15 Oct 2026',
    version: 'v2.0 Released',
    executiveSummary: 'Comprehensive release containing 100% verified cube crushing records, LASBCA Stage 2 structural notice confirmations, and viaduct concourse deck sign-offs.',
    fileSize: '6.2 MB PDF',
    status: 'released',
  },
  {
    id: 'rep_05',
    reportNumber: 'REP-2026-M10-01',
    title: 'Coastal Wave Energy Defense & Revetment Stability Report',
    projectId: 'prj_civic_02',
    projectName: 'Eko Atlantic Coastal Revetment & Great Wall Defense',
    period: 'October 2026 (Monthly)',
    releaseDate: '22 Oct 2026',
    version: 'v1.0 Released',
    executiveSummary: 'Executive summary of bathymetric sonar tracking and X-bloc placement telemetry along the 3.2km Great Wall of Lagos defense zone.',
    fileSize: '3.5 MB PDF',
    status: 'released',
  },
];
