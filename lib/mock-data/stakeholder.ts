export interface StakeholderProjectMilestone {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  phase?: string;
  targetDate: string;
  completionDate?: string;
  status: 'completed' | 'on_schedule' | 'past_target_date' | 'upcoming';
  progressPercent?: number;
  evidenceSummary?: string;
}

export interface StakeholderUpdateItem {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  summary: string;
  timestamp: string;
  type: 'report_released' | 'milestone_updated' | 'announcement' | 'summary_updated';
  author?: string;
  category?: string;
  content?: string;
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
  status: 'released' | 'superseded';
  releasedBy?: string;
  isArchived?: boolean;
}

export interface StakeholderSharedDocument {
  id: string;
  code: string;
  title: string;
  projectId: string;
  projectName: string;
  category: 'Geotechnical' | 'Environmental' | 'Structural' | 'Quality Assurance' | 'Statutory';
  version: string;
  status: 'approved' | 'superseded' | 'released';
  releaseDate: string;
  fileSize: string;
  fileType: string;
  summary: string;
  uploadedBy: string;
  securityHash: string;
}

export interface StakeholderTeamMember {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  role: string;
  title: string;
  department: string;
  responsibility: string;
  permittedContact: string;
  isLead: boolean;
  avatarUrl?: string;
}

export interface StakeholderRisk {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  category: 'Supply Chain' | 'Environmental' | 'Structural' | 'Schedule';
  severity: 'Low' | 'Medium' | 'High';
  status: 'Monitoring' | 'Mitigated' | 'Resolved';
  summary: string;
  mitigation: string;
  lastUpdated: string;
  nextAction: string;
}

export interface StakeholderAnnouncement {
  id: string;
  title: string;
  projectId?: string;
  projectName?: string;
  date: string;
  category: 'Regulatory' | 'Executive' | 'Site Notice' | 'Security';
  author: string;
  summary: string;
  content: string;
  isPinned?: boolean;
}

export interface StakeholderMeeting {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  date: string;
  time: string;
  timezone: string;
  location: string;
  type: 'virtual' | 'on_site' | 'hybrid';
  status: 'upcoming' | 'completed' | 'rescheduled';
  agenda: string[];
  attendees: string[];
}

export interface StakeholderSupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  projectId?: string;
  category: 'Data Access' | 'Report Clarification' | 'Technical' | 'General';
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  lastUpdated: string;
  messages: { sender: string; timestamp: string; text: string; isStaff: boolean }[];
}

export interface StakeholderFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

/* ========================================================================= */
/* FIXTURES & MOCK DATA                                                      */
/* ========================================================================= */

export const STAKEHOLDER_MILESTONES: StakeholderProjectMilestone[] = [
  {
    id: 'mst_01',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    name: 'Marina Station Concourse Deck Slab Concrete Sign-Off',
    phase: 'Phase 2A — Elevated Concourse',
    targetDate: '12 Oct 2026',
    completionDate: '14 Oct 2026',
    status: 'completed',
    progressPercent: 100,
    evidenceSummary: 'LASBCA Stage 2 Inspection cert #2026-LB-948 verified by Marcus Vance, PE.',
  },
  {
    id: 'mst_02',
    projectId: 'prj_pier_03',
    projectName: 'Lekki Deep Sea Port',
    name: 'Quay Wall Berth 1 Bathymetric 16.5m Draft Clearance',
    phase: 'Marine Terminal Infrastructure',
    targetDate: '20 Oct 2026',
    completionDate: '20 Oct 2026',
    status: 'completed',
    progressPercent: 100,
    evidenceSummary: 'Nigerian Ports Authority hydrographic survey clearance NPA-ENG-165.',
  },
  {
    id: 'mst_03',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    name: 'Station Concourse West Platform Glazing & Facade',
    phase: 'Phase 2B — Station Architecture',
    targetDate: '15 Nov 2026',
    status: 'on_schedule',
    progressPercent: 78,
    evidenceSummary: 'Structural steel mullion torque test complete. Curtain wall glass delivery on site.',
  },
  {
    id: 'mst_04',
    projectId: 'prj_civic_02',
    projectName: 'Eko Atlantic Coastal Revetment',
    name: 'Coastal Armor Unit Placement (Chainage 3+200)',
    phase: 'Marine Defense Revetment',
    targetDate: '28 Nov 2026',
    status: 'on_schedule',
    progressPercent: 65,
    evidenceSummary: 'X-bloc positioning acoustic sonar verified along primary breakwater.',
  },
  {
    id: 'mst_05',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    name: 'Drainage Outfall Environmental Water Sample Validation',
    phase: 'Environmental Compliance',
    targetDate: '18 Oct 2026',
    status: 'past_target_date',
    progressPercent: 45,
    evidenceSummary: 'Turbidity test re-sampling ordered following heavy tidal sediment intrusion.',
  },
  {
    id: 'mst_06',
    projectId: 'prj_datacenter_04',
    projectName: 'Abuja CBD Interchange',
    name: 'Right-of-Way Geodetic Baseline Survey Sign-off',
    phase: 'Civil Works Civil Alignment',
    targetDate: '10 Dec 2026',
    status: 'upcoming',
    progressPercent: 30,
    evidenceSummary: 'FCDA Highways survey crew deployed with RTK GPS geodetic markers.',
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
    author: 'Marcus Vance, PE',
    category: 'Report Release',
    content: 'The October monthly compliance dossier for Eko Atlantic Coastal Revetment has been signed off. Sonar tracking shows all placed armor units meeting hydrodynamic dissipation criteria.',
    linkUrl: '/stakeholder/reports/rep_05',
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
    author: 'Amara Okafor',
    category: 'Milestone Achievement',
    content: 'Formal clearance NPA-ENG-165 received today. Berth 1 is officially graded for neo-Panamax vessels up to 16.5m draft clearance.',
    linkUrl: '/stakeholder/progress/milestones',
    linkLabel: 'View Milestone',
  },
  {
    id: 'upd_03',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    title: 'Project Summary Updated: Q4 Infrastructure Target Cadence',
    summary: 'Approved project summary updated following LASBCA Stage 2 structural notice acknowledgment.',
    timestamp: 'Yesterday at 15:40',
    type: 'summary_updated',
    author: 'Marcus Vance, PE',
    category: 'Progress Cadence',
    content: 'Track work between Mile 2 and Marina reaches 94% structural completion. Third-rail electrification testing scheduled for late November.',
    linkUrl: '/stakeholder/progress/overview',
    linkLabel: 'View Overview',
  },
  {
    id: 'upd_04',
    projectId: 'prj_datacenter_04',
    projectName: 'Abuja CBD Interchange',
    title: 'Statutory Announcement: FCDA Right-of-Way Permit Verified',
    summary: 'Federal Capital Development Authority issued formal right-of-way statutory authorization FCDA-ENG-CBD-04.',
    timestamp: '2 days ago',
    type: 'announcement',
    author: 'Folake Davies',
    category: 'Statutory Permit',
    content: 'All corridor legal demarcations have been authorized. Contractor mobilization for utility relocations commences next Monday.',
    linkUrl: '/stakeholder/communications/announcements',
    linkLabel: 'Read Announcement',
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
    releasedBy: 'Marcus Vance, PE (Lead Engineer)',
    isArchived: false,
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
    releasedBy: 'Marcus Vance, PE (Lead Engineer)',
    isArchived: false,
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
    releasedBy: 'Amara Okafor (Resident QA/QC)',
    isArchived: false,
  },
  {
    id: 'rep_01',
    reportNumber: 'REP-2026-Q2-01',
    title: 'Q2 Civil Geotechnical & Substructure Baseline Audit',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    period: 'Q2 2026 (Apr - Jun)',
    releaseDate: '12 Jul 2026',
    version: 'v1.0 (Superseded by v2.0)',
    executiveSummary: 'Historical baseline audit covering piling integrity across piers 1 to 24. Superseded by Q3 integrated compliance package.',
    fileSize: '5.1 MB PDF',
    status: 'superseded',
    releasedBy: 'Marcus Vance, PE',
    isArchived: true,
  },
  {
    id: 'rep_03',
    reportNumber: 'REP-2026-M08-01',
    title: 'Monthly Environmental Turbidity & Siltation Assessment',
    projectId: 'prj_pier_03',
    projectName: 'Lekki Deep Sea Port',
    period: 'August 2026',
    releaseDate: '05 Sep 2026',
    version: 'v1.0 Released',
    executiveSummary: 'Historical environmental water testing and dredging plume dispersion analysis.',
    fileSize: '3.9 MB PDF',
    status: 'superseded',
    releasedBy: 'Amara Okafor',
    isArchived: true,
  },
];

export const STAKEHOLDER_DOCUMENTS: StakeholderSharedDocument[] = [
  {
    id: 'doc_01',
    code: 'DOC-GEO-2026-01',
    title: 'Subsurface Geotechnical Borehole Investigation & Soil Mechanics',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    category: 'Geotechnical',
    version: 'Rev C (Approved)',
    status: 'approved',
    releaseDate: '18 Aug 2026',
    fileSize: '12.4 MB PDF',
    fileType: 'Technical Report',
    summary: 'CPT and SPT borehole data across 32 test pits along the marina elevated viaduct alignment.',
    uploadedBy: 'Babatunde Adeleke (Geotechnical Specialist)',
    securityHash: 'sha256-8a7e3b91c4d2',
  },
  {
    id: 'doc_02',
    code: 'DOC-ENV-2026-04',
    title: 'Environmental Impact Assessment (EIA) Federal Approval Certificate',
    projectId: 'prj_civic_02',
    projectName: 'Eko Atlantic Coastal Revetment',
    category: 'Environmental',
    version: 'Final Authorized',
    status: 'released',
    releaseDate: '02 Sep 2026',
    fileSize: '8.1 MB PDF',
    fileType: 'Statutory Certification',
    summary: 'Federal Ministry of Environment signed statutory EIA certificate with compliance mitigation commitments.',
    uploadedBy: 'Folake Davies (Statutory Affairs)',
    securityHash: 'sha256-4f901a88bb3e',
  },
  {
    id: 'doc_03',
    code: 'DOC-STR-2026-12',
    title: 'Marina Station Structural General Arrangement & Rebar Schedules',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    category: 'Structural',
    version: 'Rev D (Released for Construction)',
    status: 'approved',
    releaseDate: '25 Sep 2026',
    fileSize: '24.6 MB PDF',
    fileType: 'CAD Drawing Package',
    summary: 'Full structural drawings including post-tensioned beam details and slab reinforcement callouts.',
    uploadedBy: 'Marcus Vance, PE (Lead Engineer)',
    securityHash: 'sha256-11f87aa9cd02',
  },
  {
    id: 'doc_04',
    code: 'DOC-QAP-2026-02',
    title: 'Quality Assurance & Quality Control Project Manual (QAPM)',
    projectId: 'prj_pier_03',
    projectName: 'Lekki Deep Sea Port',
    category: 'Quality Assurance',
    version: 'Issue 2.0',
    status: 'approved',
    releaseDate: '14 Oct 2026',
    fileSize: '6.7 MB PDF',
    fileType: 'Governance Manual',
    summary: 'Sampling frequency, standard test methods (BS EN 12390), and non-conformance remediation procedures.',
    uploadedBy: 'Amara Okafor (QA/QC Lead)',
    securityHash: 'sha256-9e32fc84ba10',
  },
  {
    id: 'doc_05',
    code: 'DOC-BAT-2026-05',
    title: 'Bathymetric Multi-Beam Sonar Sea Bed Topography Chart',
    projectId: 'prj_pier_03',
    projectName: 'Lekki Deep Sea Port',
    category: 'Geotechnical',
    version: 'Final Survey 1.1',
    status: 'released',
    releaseDate: '21 Oct 2026',
    fileSize: '15.2 MB PDF',
    fileType: 'Survey Map',
    summary: 'Certified depth contour charts for main channel and turning basin following maintenance dredging.',
    uploadedBy: 'Babatunde Adeleke',
    securityHash: 'sha256-cc5509a277e1',
  },
  {
    id: 'doc_06',
    code: 'DOC-REG-2026-01',
    title: 'LASBCA Stage 2 Structural Notice Authorization Permit',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    category: 'Statutory',
    version: 'Official Grant',
    status: 'approved',
    releaseDate: '28 Sep 2026',
    fileSize: '2.1 MB PDF',
    fileType: 'Statutory Permit',
    summary: 'Lagos State Building Control Agency formal stage gate sign-off permitting superstructure erection.',
    uploadedBy: 'Folake Davies',
    securityHash: 'sha256-55aa7109ff88',
  },
];

export const STAKEHOLDER_TEAM: StakeholderTeamMember[] = [
  {
    id: 'tm_01',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    name: 'Marcus Vance, PE',
    role: 'Lead Project Engineer',
    title: 'Senior Structural Project Engineer (COREN Reg. R.48201)',
    department: 'Civil & Structural Engineering',
    responsibility: 'Superintending engineer; structural sign-offs and regulatory milestone authorizations.',
    permittedContact: 'engineer@civora.internal',
    isLead: true,
  },
  {
    id: 'tm_02',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    name: 'Amara Okafor',
    role: 'Quality Assurance Lead',
    title: 'Resident QA/QC Materials Engineer',
    department: 'Quality Engineering & Testing',
    responsibility: 'On-site concrete testing verification, lab cube crush validation, and supplier compliance.',
    permittedContact: 'qa.blue-line@civora.internal',
    isLead: false,
  },
  {
    id: 'tm_03',
    projectId: 'prj_pier_03',
    projectName: 'Lekki Deep Sea Port',
    name: 'Babatunde Adeleke',
    role: 'Geotechnical Specialist',
    title: 'Senior Marine Geotechnical Consultant',
    department: 'Marine Engineering',
    responsibility: 'Breakwater armor stability, seabed sounding analysis, and dredging volumetric audits.',
    permittedContact: 'geotech.lekki@civora.internal',
    isLead: true,
  },
  {
    id: 'tm_04',
    projectId: 'prj_civic_02',
    projectName: 'Eko Atlantic Coastal Revetment',
    name: 'Folake Davies',
    role: 'Statutory Affairs & Client Liaison',
    title: 'Regulatory Director & Stakeholder Liaison',
    department: 'Corporate & Regulatory Advisory',
    responsibility: 'Inter-governmental agency interface (LASBCA, FMWH) and formal client communication desk.',
    permittedContact: 'liaison@civora.internal',
    isLead: true,
  },
];

export const STAKEHOLDER_RISKS: StakeholderRisk[] = [
  {
    id: 'rsk_01',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    title: 'Material Supply Chain Latency for High-Tensile Grade 60 Rebar',
    category: 'Supply Chain',
    severity: 'Medium',
    status: 'Monitoring',
    summary: 'Port customs clearance inspection backlog has created a 10-day buffer reduction for rebar batches.',
    mitigation: 'Alternate bonded warehouse consignment pre-cleared with certified local stock reserves.',
    lastUpdated: '22 Oct 2026',
    nextAction: 'Weekly customs clearance tracking report review on Thursday.',
  },
  {
    id: 'rsk_02',
    projectId: 'prj_civic_02',
    projectName: 'Eko Atlantic Coastal Revetment',
    title: 'High-Tidal Surcharge Effect on Breakwater Armour Placement',
    category: 'Environmental',
    severity: 'Low',
    status: 'Mitigated',
    summary: 'Bimonthly spring tides caused minor barge repositioning downtime during X-bloc crane lowering.',
    mitigation: 'Adjusted installation shifts to low-tide windows with dual-crane simultaneous placement.',
    lastUpdated: '19 Oct 2026',
    nextAction: 'Tide telemetry forecast verification prior to weekend shifts.',
  },
  {
    id: 'rsk_03',
    projectId: 'prj_pier_03',
    projectName: 'Lekki Deep Sea Port',
    title: 'Dredging Siltation Backfill in Channel Turn Pocket',
    category: 'Structural',
    severity: 'Medium',
    status: 'Resolved',
    summary: 'Post-dredge sonar indicated 0.3m localized silt deposition near turning pocket marker 4.',
    mitigation: 'Trailer suction hopper dredger completed cleanup sweep with hydrographic clearance certified.',
    lastUpdated: '20 Oct 2026',
    nextAction: 'Quarterly bathymetric monitoring as mandated by port authority.',
  },
];

export const STAKEHOLDER_ANNOUNCEMENTS: StakeholderAnnouncement[] = [
  {
    id: 'anc_01',
    title: 'LASBCA Stage 2 Structural Notice Formally Acknowledged',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    date: '23 Oct 2026',
    category: 'Regulatory',
    author: 'Folake Davies (Regulatory Affairs)',
    summary: 'Lagos State Building Control Agency issued official clearance for Marina Station concourse structural framing.',
    content: 'We are pleased to inform all project sponsors and institutional stakeholders that LASBCA has completed inspection of the Marina Station concourse deck. Certificate of structural verification LASBCA-ENG-2026-948 has been formally lodged.',
    isPinned: true,
  },
  {
    id: 'anc_02',
    title: 'Q4 Capital Oversight & Institutional Stakeholder Briefing',
    date: '20 Oct 2026',
    category: 'Executive',
    author: 'Executive Advisory Desk',
    summary: 'Quarterly virtual briefing for project financiers, pension fund managers, and sovereign infrastructure trustees.',
    content: 'The executive committee will host the Q4 capital briefing on 12 November 2026 at 14:00 UTC+1. The briefing will cover released capital phase achievements across the Lagos Rail and Lekki Port projects.',
    isPinned: true,
  },
  {
    id: 'anc_03',
    title: 'Monsoon Transition & Construction Site Safety Protocols',
    projectId: 'prj_civic_02',
    projectName: 'Eko Atlantic Coastal Revetment',
    date: '15 Oct 2026',
    category: 'Site Notice',
    author: 'Marcus Vance, PE',
    summary: 'Enhanced site safety and sea wall marine exclusion zones established for the late October high-swell period.',
    content: 'Maritime safety protocols have been updated in coordination with the Nigerian Maritime Administration and Safety Agency (NIMASA) to secure floating equipment during high-energy wave conditions.',
    isPinned: false,
  },
];

export const STAKEHOLDER_MEETINGS: StakeholderMeeting[] = [
  {
    id: 'mtg_01',
    title: 'Bi-Weekly Executive Infrastructure Milestone Review',
    projectId: 'prj_metro_01',
    projectName: 'Lagos Rail Mass Transit (Blue Line)',
    date: '28 Oct 2026',
    time: '14:00 - 15:30',
    timezone: 'WAT (UTC+1)',
    location: 'Civora Virtual Conference Room 1',
    type: 'virtual',
    status: 'upcoming',
    agenda: [
      'Marina Station concourse superstructure progress review',
      'Third-rail electrical power substation delivery schedule',
      'LASBCA statutory stage 3 inspection preparation',
      'Stakeholder Q&A session',
    ],
    attendees: ['Marcus Vance, PE', 'Elena Rostova', 'Amara Okafor', 'Folake Davies'],
  },
  {
    id: 'mtg_02',
    title: 'Lekki Port Berth 1 Bathymetric Technical Handover Gate',
    projectId: 'prj_pier_03',
    projectName: 'Lekki Deep Sea Port',
    date: '04 Nov 2026',
    time: '10:00 - 12:00',
    timezone: 'WAT (UTC+1)',
    location: 'Port Administration Building, Lekki Free Trade Zone',
    type: 'hybrid',
    status: 'upcoming',
    agenda: [
      'Presentation of 16.5m hydrographic sonar survey results',
      'Fender and mooring bollard pull-test sign-offs',
      'Commercial container vessel trial berthing program',
    ],
    attendees: ['Babatunde Adeleke', 'Elena Rostova', 'Port Harbour Master', 'NPA Delegation'],
  },
  {
    id: 'mtg_03',
    title: 'Q3 Financial & Engineering Audit Debrief',
    projectId: 'prj_civic_02',
    projectName: 'Eko Atlantic Coastal Revetment',
    date: '12 Oct 2026',
    time: '11:00 - 12:30',
    timezone: 'WAT (UTC+1)',
    location: 'Civora Virtual Conference Room 2',
    type: 'virtual',
    status: 'completed',
    agenda: [
      'Review of Q3 released report REP-2026-Q3-01',
      'Verification of independent testing laboratory certifications',
      'Review of X-bloc placement drone photogrammetry',
    ],
    attendees: ['Marcus Vance, PE', 'Elena Rostova', 'External Audit Partners'],
  },
];

export const STAKEHOLDER_SUPPORT_TICKETS: StakeholderSupportTicket[] = [
  {
    id: 'tkt_01',
    ticketNumber: 'TKT-2026-084',
    subject: 'Request for high-resolution aerial photogrammetry for Marina Station',
    projectId: 'prj_metro_01',
    category: 'Report Clarification',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '22 Oct 2026',
    lastUpdated: '23 Oct 2026',
    messages: [
      {
        sender: 'Elena Rostova',
        timestamp: '22 Oct 2026 14:15',
        text: 'Could the project team provide the high-resolution orthomosaic drone survey referenced in Report REP-2026-Q3-01 for our board presentation?',
        isStaff: false,
      },
      {
        sender: 'Folake Davies (Civora Advisory Desk)',
        timestamp: '23 Oct 2026 09:30',
        text: 'Good morning Elena. We have processed the export. The authorized 4K GeoTIFF package has been placed in Shared Documents under code DOC-STR-2026-12.',
        isStaff: true,
      },
    ],
  },
  {
    id: 'tkt_02',
    ticketNumber: 'TKT-2026-071',
    subject: 'Additional stakeholder seat request for Capital Risk Committee',
    category: 'Data Access',
    status: 'Resolved',
    priority: 'Low',
    createdAt: '15 Oct 2026',
    lastUpdated: '16 Oct 2026',
    messages: [
      {
        sender: 'Elena Rostova',
        timestamp: '15 Oct 2026 11:00',
        text: 'Please provision read-only oversight access for our incoming risk officer David Sterling.',
        isStaff: false,
      },
      {
        sender: 'Civora Access Administrator',
        timestamp: '16 Oct 2026 08:45',
        text: 'Access invitation dispatched to d.sterling@aegis-capital.com with project memberships matching Aegis Capital portfolio.',
        isStaff: true,
      },
    ],
  },
];

export const STAKEHOLDER_FAQS: StakeholderFAQ[] = [
  {
    id: 'faq_01',
    category: 'Data Governance',
    question: 'How frequently are released reports published to the Stakeholder Workspace?',
    answer: 'Reports are released in accordance with each project reporting cadence—typically bi-weekly or monthly. Every report must pass two-step technical sign-off by the superintending Project Engineer before being published to stakeholders.',
  },
  {
    id: 'faq_02',
    category: 'Permissions & Security',
    question: 'Why are some project documents marked as superseded?',
    answer: 'When a design revision, regulatory certificate, or report is formally updated, the previous version is immutably archived as superseded. This guarantees full auditability without overwriting past engineering records.',
  },
  {
    id: 'faq_03',
    category: 'Field Evidence',
    question: 'Are concrete test results verified by independent testing laboratories?',
    answer: 'Yes. All concrete cube crushing tests and ultrasonic weld inspections must be stamped by accredited third-party laboratories (e.g. Standard Organisation of Nigeria NIS standards) before being linked to released dossiers.',
  },
  {
    id: 'faq_04',
    category: 'Meetings & Collaboration',
    question: 'How do I add agenda items to upcoming stakeholder milestone reviews?',
    answer: 'You can submit requests directly through the Contact Project Team page or reply to the specific meeting invitation at least 48 hours prior to the scheduled session.',
  },
];
