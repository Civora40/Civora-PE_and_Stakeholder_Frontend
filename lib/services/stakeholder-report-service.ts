import { StudioReport, ReportSection, CoverPreset } from '@/lib/types/reporting-studio';
import { getStudioReportById, DEFAULT_REPORT_LAYOUT_SETTINGS } from './reporting-studio-service';
import { STAKEHOLDER_RELEASED_REPORTS, StakeholderReleasedReport } from '../mock-data/stakeholder';

export type StakeholderFeedbackType = 'comment' | 'clarification' | 'revision_request' | 'endorsement';

export interface StakeholderFeedbackComment {
  id: string;
  reportId: string;
  sectionId?: string; // 'cover_page' | 'executive_summary' | section id | 'general'
  sectionTitle?: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  content: string;
  feedbackType: StakeholderFeedbackType;
  createdAt: string;
  status: 'open' | 'addressed' | 'resolved';
  selectedTextSnippet?: string;
  suggestedRevision?: string;
  replies?: {
    id: string;
    authorName: string;
    authorRole: string;
    content: string;
    createdAt: string;
  }[];
}

export interface StakeholderApprovalRecord {
  id: string;
  reportId: string;
  approverName: string;
  approverRole: string;
  organization: string;
  status: 'approved' | 'approved_with_comments' | 'revision_requested';
  signOffDate: string;
  digitalSignatureHash: string;
  declarationAgreed: boolean;
  notes?: string;
}

export interface StakeholderShareLink {
  id: string;
  reportId: string;
  token: string;
  shareUrl: string;
  permission: 'view' | 'comment' | 'approve';
  expiresAt: string;
  sharedWithEmails: string[];
  createdAt: string;
  createdByName: string;
  accessCount: number;
}

// Initial mock comments for realistic testing
const INITIAL_STAKEHOLDER_FEEDBACKS: StakeholderFeedbackComment[] = [
  {
    id: 'stk_comm_01',
    reportId: 'rep_02',
    sectionId: 'sec_bathymetric',
    sectionTitle: '2. Bathymetric Hydrographic Survey & 16.5m Draft Clearance',
    authorName: 'Adeola Adeleke',
    authorRole: 'Technical Director (Port Authority Representative)',
    authorAvatar: 'AA',
    content: 'Confirming if the multi-beam bathymetry scan accounts for spring tide silt accumulation along Berth 1 apron.',
    feedbackType: 'clarification',
    createdAt: '11 Oct 2026, 14:22',
    status: 'resolved',
    selectedTextSnippet: 'hydrographic survey verified 16.5m draft clearance for primary container berth',
    replies: [
      {
        id: 'rep_comm_01_1',
        authorName: 'Marcus Vance, PE',
        authorRole: 'Lead Supervising Engineer',
        content: 'Verified. Dual acoustic calibration was conducted at low water slack with certified NPA hydrographic surveyor on board.',
        createdAt: '11 Oct 2026, 16:05',
      },
    ],
  },
  {
    id: 'stk_comm_02',
    reportId: 'rep_02',
    sectionId: 'sec_breakwater_armor',
    sectionTitle: '4. Secondary Breakwater X-bloc Armor Dissipation Telemetry',
    authorName: 'Dr. K. Bello',
    authorRole: 'Infrastructure Investor Representative',
    authorAvatar: 'KB',
    content: 'Wave energy dissipation telemetry of 94.2% matches the third-party numerical wave tank model. Fully endorse milestone completion.',
    feedbackType: 'endorsement',
    createdAt: '12 Oct 2026, 09:40',
    status: 'open',
    selectedTextSnippet: 'X-bloc positioning acoustic sonar verified along primary breakwater',
  },
  {
    id: 'stk_comm_03',
    reportId: 'rep_04',
    sectionId: 'sec_structural_deck',
    sectionTitle: '1. Marina Elevated Concourse Structural Deck Slab Sign-off',
    authorName: 'Engr. T. Salami',
    authorRole: 'Statutory Board Technical Assessor',
    authorAvatar: 'TS',
    content: 'LASBCA Stage 2 endorsement reference #2026-LB-948 confirmed. Deck propping removal may commence in accordance with section 4.2 protocol.',
    feedbackType: 'endorsement',
    createdAt: '16 Oct 2026, 11:15',
    status: 'open',
  },
  {
    id: 'stk_comm_04',
    reportId: 'rep_04',
    sectionId: 'sec_cube_break_logs',
    sectionTitle: '2. Concrete Compressive Strength Cube Crush Logs',
    authorName: 'Folake Davies',
    authorRole: 'Financial & Compliance Auditor',
    authorAvatar: 'FD',
    content: 'Please ensure lab calibration certificates for the Denison compression machine are cross-indexed in appendix B.',
    feedbackType: 'revision_request',
    createdAt: '17 Oct 2026, 15:30',
    status: 'open',
    suggestedRevision: 'Cross-reference accredited Denison test press calibration certificate #CAL-2026-088 in Annexure B.',
  },
  {
    id: 'stk_comm_05',
    reportId: 'rep_05',
    sectionId: 'sec_armor_density',
    sectionTitle: '3. X-bloc Concrete Armor Interlocking Density & Stability',
    authorName: 'Adeola Adeleke',
    authorRole: 'Client Representative',
    authorAvatar: 'AA',
    content: 'The 3.2km defense perimeter telemetry looks solid. Great Wall revetment armor placement is progressing within schedule tolerances.',
    feedbackType: 'comment',
    createdAt: '23 Oct 2026, 10:10',
    status: 'open',
  },
];

// Initial mock approvals
const INITIAL_STAKEHOLDER_APPROVALS: StakeholderApprovalRecord[] = [
  {
    id: 'appr_rep_02',
    reportId: 'rep_02',
    approverName: 'Adeola Adeleke',
    approverRole: 'Executive Director, Marine & Port Infrastructure',
    organization: 'Nigerian Ports Authority / Investor Board',
    status: 'approved',
    signOffDate: '10 Oct 2026, 17:45',
    digitalSignatureHash: 'SHA256:8f92b4c102a71d88924f70e932b1308a04df9876a',
    declarationAgreed: true,
    notes: 'Approved following verification of bathymetric sonar scans and NPA draft certification.',
  },
];

// Initial mock share links
const INITIAL_STAKEHOLDER_SHARE_LINKS: StakeholderShareLink[] = [
  {
    id: 'sh_link_01',
    reportId: 'rep_02',
    token: 'stk_share_lekki_9021',
    shareUrl: 'https://civora.app/stakeholder/reports/rep_02?shareToken=stk_share_lekki_9021',
    permission: 'comment',
    expiresAt: '09 Nov 2026 (14 days left)',
    sharedWithEmails: ['commissioner.transport@lagosstate.gov.ng', 'investor.rep@africainfra.com'],
    createdAt: '10 Oct 2026, 16:30',
    createdByName: 'Marcus Vance, PE',
    accessCount: 14,
  },
  {
    id: 'sh_link_02',
    reportId: 'rep_04',
    token: 'stk_share_rail_4412',
    shareUrl: 'https://civora.app/stakeholder/reports/rep_04?shareToken=stk_share_rail_4412',
    permission: 'approve',
    expiresAt: '15 Nov 2026 (20 days left)',
    sharedWithEmails: ['auditor.general@lagosstate.gov.ng'],
    createdAt: '16 Oct 2026, 10:00',
    createdByName: 'Marcus Vance, PE',
    accessCount: 8,
  },
];

// In-memory state
let stakeholderFeedbacksStore: StakeholderFeedbackComment[] = [...INITIAL_STAKEHOLDER_FEEDBACKS];
let stakeholderApprovalsStore: StakeholderApprovalRecord[] = [...INITIAL_STAKEHOLDER_APPROVALS];
let stakeholderShareLinksStore: StakeholderShareLink[] = [...INITIAL_STAKEHOLDER_SHARE_LINKS];

// Standard detailed sections generator for reports that need deep narrative
function getDefaultSectionsForReport(reportId: string, projectName: string): ReportSection[] {
  if (reportId === 'rep_02') {
    return [
      {
        id: 'sec_berth_alignment',
        title: '1. Berth Alignment & Navigation Geometry',
        content: `Physical progress for the Quay Wall Berth 1 and secondary breakwater extension at ${projectName} proceeded in strict conformance with Eurocode 7 and NPA marine guidelines. Alignment pins confirm neo-Panamax vessel berthing pocket tolerance of ±10mm across the entire 680-meter quay front.`,
        guidance: 'Verify navigation markers, fender line deflection limits, and geometric coordinates against Port Authority datum.',
        isRequired: true,
        isCompleted: true,
        sourceReferences: [
          { recordId: 'sub_marine_01', type: 'submission', label: 'Quay Wall Berth 1 Geodetic Verification Sheet', date: '28 Sep 2026' },
        ],
      },
      {
        id: 'sec_bathymetric',
        title: '2. Bathymetric Hydrographic Survey & 16.5m Draft Clearance',
        content: `Nigerian Ports Authority hydrographic survey NPA-ENG-165 verified guaranteed 16.5m draft clearance along the primary container berth basin. Multi-beam acoustic sonar sounding confirmed zero underwater obstructions or dredge mound anomalies in the approach channel.`,
        guidance: 'Cross-reference statutory hydrographic survey clearance NPA-ENG-165 with acoustic multi-beam sounding.',
        isRequired: true,
        isCompleted: true,
        sourceReferences: [
          { recordId: 'sub_hydro_04', type: 'inspection', label: 'NPA Hydrographic Survey Clearance NPA-ENG-165', date: '02 Oct 2026' },
          { recordId: 'sub_sonar_12', type: 'lab_result', label: 'Multi-beam Acoustic Sonar Bathymetry Matrix', date: '04 Oct 2026' },
        ],
      },
      {
        id: 'sec_sheet_piling',
        title: '3. Quay Wall Sheet Piling & Cathodic Protection Audit',
        content: `Ultrasonic non-destructive testing (NDT) completed on 420 linear meters of interlocking tubular combi-wall sheet piles. Cathodic sacrificial aluminum anode potential measured at -1,040 mV vs Ag/AgCl reference electrode, well exceeding the NACE SP0169 minimum threshold of -850 mV.`,
        guidance: 'Audit sacrificial anode potential and ultrasonic thickness gauges against corrosive splash zone specifications.',
        isRequired: true,
        isCompleted: true,
        sourceReferences: [
          { recordId: 'sub_ndt_08', type: 'lab_result', label: 'Ultrasonic Combi-Wall Thickness Test Certificate', date: '06 Oct 2026' },
        ],
      },
      {
        id: 'sec_breakwater_armor',
        title: '4. Secondary Breakwater X-bloc Armor Dissipation Telemetry',
        content: `Acoustic sonar positioning confirmed stable placement of 1,240 X-bloc concrete armor units (16-ton category) along the seaward face. Wave dissipation coefficient measured at 94.2% under design 1-in-100-year significant wave height simulation (Hs = 4.8m).`,
        guidance: 'Confirm interlock packing density and acoustic sonar coordinates for submerged armor units.',
        isRequired: true,
        isCompleted: true,
      },
      {
        id: 'sec_statutory_clearances',
        title: '5. Statutory NPA & NIMASA Environmental Clearances',
        content: `Environmental turbidity and suspended solids dispersion logs verified compliant with Federal Ministry of Environment EIA conditions. Official navigational hazard clearance received from Nigerian Maritime Administration and Safety Agency (NIMASA).`,
        guidance: 'Attach NIMASA navigational safety endorsement and water sample laboratory reports.',
        isRequired: true,
        isCompleted: true,
      },
    ];
  }

  if (reportId === 'rep_04') {
    return [
      {
        id: 'sec_structural_deck',
        title: '1. Marina Elevated Concourse Structural Deck Slab Sign-off',
        content: `Elevated concourse deck slab (Gridlines C1-C8) successfully poured with 420m³ of C30/37 characteristic strength concrete. Pre-pour inspection verified top and bottom high-tensile reinforcement cover of 40mm achieved with approved polymer spacer blocks.`,
        guidance: 'Detail reinforcement bar spacing, construction joint preparation, and formwork propping verification.',
        isRequired: true,
        isCompleted: true,
        sourceReferences: [
          { recordId: 'sub_pour_42', type: 'submission', label: 'Concourse Level 2 Deck Pour Ticket #RT-9041', date: '12 Oct 2026' },
        ],
      },
      {
        id: 'sec_cube_break_logs',
        title: '2. Concrete Compressive Strength Cube Crush Logs',
        content: `14 concrete test cubes crushed at 7 and 28 days by accredited civil engineering laboratory. Average 7-day compressive strength achieved 28.4 MPa (81% of characteristic 28-day target of 35.0 MPa), with zero individual cube failures. All results conform strictly to BS EN 12390-3.`,
        guidance: 'Tabulate crushing break logs, batch plant delivery tickets, and laboratory press certificates.',
        isRequired: true,
        isCompleted: true,
        sourceReferences: [
          { recordId: 'sub_lab_77', type: 'lab_result', label: 'Accredited Lab Compression Test Certificate #LAB-2026-901', date: '14 Oct 2026' },
        ],
      },
      {
        id: 'sec_geotechnical_settlement',
        title: '3. Foundation Settlement & Optical Piezometer Telemetry',
        content: `Optical survey monitoring of piers P-01 through P-24 indicates negligible differential settlement of 0.2mm, safely within the structural tolerance envelope of 5.0mm. Subsurface groundwater piezometers confirm hydrostatic equilibrium along the coastal lagoon embankment.`,
        guidance: 'Cite geodetic settlement pins and piezometric water table readings.',
        isRequired: true,
        isCompleted: true,
      },
      {
        id: 'sec_statutory_lasbca',
        title: '4. Statutory Municipal LASBCA Stage 2 Endorsements',
        content: `Lagos State Building Control Agency (LASBCA) Stage 2 official structural clearance certificate #2026-LB-948 formally issued following on-site audit by statutory district engineers. Permitted to advance to station canopy steel erection.`,
        guidance: 'Ensure statutory municipal permit number and signing officer details are cited.',
        isRequired: true,
        isCompleted: true,
        sourceReferences: [
          { recordId: 'sub_lasbca_948', type: 'inspection', label: 'LASBCA Stage 2 Structural Clearance Certificate', date: '14 Oct 2026' },
        ],
      },
      {
        id: 'sec_third_rail',
        title: '5. Third-Rail Electrification Clearance & Track Geometry',
        content: `Permanent way track alignment between Mile 2 and Marina verified with laser track gauge. Third-rail 750V DC conductor rail brackets torque-tested to 120 N·m. Electrical insulation clearance verified at 450mm from nearest structural steel member.`,
        guidance: 'Verify contact rail clearances, return circuit bonding, and mechanical torque sign-offs.',
        isRequired: true,
        isCompleted: true,
      },
    ];
  }

  if (reportId === 'rep_05') {
    return [
      {
        id: 'sec_revetment_alignment',
        title: '1. Great Wall Chainage 3+200 Primary Revetment Alignment',
        content: `Physical placement of marine armor units along Chainage 3+200 of the Great Wall of Lagos coastal protection zone completed on schedule. Alignment survey confirms continuous breakwater crest level at +8.5m Chart Datum (CD).`,
        guidance: 'Confirm crest elevation, toe berm stabilization, and geotextile filter underlay integrity.',
        isRequired: true,
        isCompleted: true,
      },
      {
        id: 'sec_sonar_bathymetry',
        title: '2. Acoustic Sonar Bathymetry & Seabed Scour Monitoring',
        content: `Autonomous surface vessel (ASV) sonar survey verified stable toe geometry with zero seabed scour depression along the Atlantic facing embankment. Sand compaction densification meets 95% Modified Proctor density.`,
        guidance: 'Tabulate sonar survey transects and sediment transport telemetry.',
        isRequired: true,
        isCompleted: true,
      },
      {
        id: 'sec_armor_density',
        title: '3. X-bloc Concrete Armor Interlocking Density & Stability',
        content: `Underwater camera telemetry confirmed interlocking density of 0.58 units/m² for the 12-ton unreinforced high-density marine concrete units. Tolerance placement index exceeds technical specifications.`,
        guidance: 'Record unit count per chainage segment and verify underwater camera inspection sign-offs.',
        isRequired: true,
        isCompleted: true,
      },
      {
        id: 'sec_wave_dissipation',
        title: '4. Wave Energy Hydrodynamic Dissipation Field Measurements',
        content: `Offshore wave buoy telemetry recorded incident significant wave heights up to 3.2m during spring tidal surge. Attenuated wave transmission behind the revetment crest was recorded at zero overtopping, protecting planned development parcels.`,
        guidance: 'Cross-reference wave buoy telemetry with hydrodynamic pressure transducers.',
        isRequired: true,
        isCompleted: true,
      },
      {
        id: 'sec_eia_compliance',
        title: '5. Federal Ministry of Environment EIA Compliance Matrix',
        content: `Monthly marine ecological water testing confirmed lagoon salinity and dissolved oxygen levels within baseline environmental impact assessment thresholds. No hydrocarbon or cement wash contamination detected.`,
        guidance: 'Attach Federal Ministry of Environment certified lab test results.',
        isRequired: true,
        isCompleted: true,
      },
    ];
  }

  // Fallback generic 3-section structured narrative
  return [
    {
      id: 'sec_gen_01',
      title: '1. Structural Works & Physical Progress',
      content: `Field operations in ${projectName} proceeded according to statutory engineering specifications. All structural elements inspected met Eurocode and Nigerian Industrial Standards (NIS) tolerances.`,
      guidance: 'Provide comprehensive summary of physical delivery.',
      isRequired: true,
      isCompleted: true,
    },
    {
      id: 'sec_gen_02',
      title: '2. Quality Assurance & Laboratory Test Verification',
      content: 'All verified material batch tickets, compressive cube crushing certificates, and non-destructive testing reports confirm full contractual compliance.',
      guidance: 'List accredited testing lab records and batch certifications.',
      isRequired: true,
      isCompleted: true,
    },
    {
      id: 'sec_gen_03',
      title: '3. Statutory Clearances & Environmental Governance',
      content: 'Site inspections conducted with municipal building control representatives and environmental officers confirmed valid statutory operation.',
      guidance: 'Document statutory permits and compliance matrices.',
      isRequired: true,
      isCompleted: true,
    },
  ];
}

/**
 * Loads a rich report for stakeholder review & preview.
 * Synthesizes data between StudioReport and StakeholderReleasedReport.
 */
export function getStakeholderReport(reportId: string): StudioReport {
  // 1. Try finding in Studio reports store
  const studioReport = getStudioReportById(reportId);

  // 2. Try finding in released reports
  const released = STAKEHOLDER_RELEASED_REPORTS.find(
    (r) => r.id === reportId || r.reportNumber.toLowerCase() === reportId.toLowerCase()
  );

  const baseReportId = studioReport ? studioReport.id : released ? released.id : reportId;
  const projectName = studioReport?.projectName || released?.projectName || 'Strategic Infrastructure Project';
  const reportNumber = studioReport?.reportNumber || released?.reportNumber || 'REP-2026-RELEASE';
  const title = studioReport?.title || released?.title || 'Certified Infrastructure Compliance Dossier';
  const executiveSummary =
    studioReport?.executiveSummary ||
    released?.executiveSummary ||
    'Official compliance dossier released for stakeholder oversight and verification.';

  // If studioReport has multiple sections, use them; otherwise populate detailed sections
  let sections: ReportSection[] = studioReport?.sections && studioReport.sections.length >= 3
    ? studioReport.sections
    : getDefaultSectionsForReport(baseReportId, projectName);

  // Check layout settings or provide rich default layout
  const layout = studioReport?.layoutSettings || {
    ...DEFAULT_REPORT_LAYOUT_SETTINGS,
    coverPage: {
      ...DEFAULT_REPORT_LAYOUT_SETTINGS.coverPage,
      preset: (baseReportId === 'rep_02'
        ? 'architectural_dark'
        : baseReportId === 'rep_04'
        ? 'civora_standard'
        : 'project_image') as CoverPreset,
      headlinePrimary: 'CERTIFIED COMPLIANCE\nDOSSIER',
      headlineSecondary: `${projectName} • Statutory Audit`,
      periodYearDisplay: '2026',
    },
  };

  const finalReport: StudioReport = {
    id: baseReportId,
    reportNumber,
    projectId: studioReport?.projectId || released?.projectId || 'prj_metro_01',
    projectName,
    projectCode: studioReport?.projectCode || 'CIV-STAT-01',
    title,
    reportType: studioReport?.reportType || 'Certified Statutory Compliance Dossier',
    templateId: studioReport?.templateId || 'tmpl_monthly_status',
    templateVersion: studioReport?.templateVersion || '3.2',
    workflowStatus: 'released',
    reportingPeriodStart: studioReport?.reportingPeriodStart || '2026-09-01',
    reportingPeriodEnd: studioReport?.reportingPeriodEnd || '2026-09-30',
    periodFormatted: studioReport?.periodFormatted || released?.period || 'September / October 2026',
    createdById: studioReport?.createdById || 'usr_eng_02',
    createdByName: studioReport?.createdByName || released?.releasedBy || 'Marcus Vance, PE',
    authorTitle: studioReport?.authorTitle || 'Senior Structural Project Engineer (COREN Reg. R.48201)',
    currentVersion: studioReport?.currentVersion || released?.version || 'v2.0 (Released)',
    executiveSummary,
    sections,
    versions: studioReport?.versions || [],
    reviewComments: studioReport?.reviewComments || [],
    auditTrail: studioReport?.auditTrail || [
      {
        id: 'aud_release_01',
        action: 'Formally Released to Stakeholders',
        actor: studioReport?.createdByName || 'Marcus Vance, PE',
        actorRole: 'Superintending Engineer',
        timestamp: released?.releaseDate || '15 Oct 2026',
        note: 'Published with immutable cryptographic signature seal in Stakeholder Workspace.',
      },
    ],
    sourceSubmissionsCount: studioReport?.sourceSubmissionsCount || 28,
    linkedEvidenceCount: studioReport?.linkedEvidenceCount || 8,
    lastSavedAt: studioReport?.lastSavedAt || '15 Oct 2026',
    layoutSettings: layout,
    releasedAt: studioReport?.releasedAt || released?.releaseDate || '15 Oct 2026',
    releasedByName: studioReport?.releasedByName || released?.releasedBy || 'Marcus Vance, PE',
    complianceScore: studioReport?.complianceScore || 96.5,
  };

  return finalReport;
}

/**
 * Get all stakeholder feedback comments for a report
 */
export function getStakeholderFeedbacks(reportId: string): StakeholderFeedbackComment[] {
  return stakeholderFeedbacksStore.filter((c) => c.reportId === reportId);
}

/**
 * Add a new feedback comment on a document / section
 */
export function addStakeholderFeedback(
  reportId: string,
  params: {
    sectionId?: string;
    sectionTitle?: string;
    authorName: string;
    authorRole: string;
    content: string;
    feedbackType: StakeholderFeedbackType;
    selectedTextSnippet?: string;
    suggestedRevision?: string;
  }
): StakeholderFeedbackComment {
  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const initials = params.authorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const newComment: StakeholderFeedbackComment = {
    id: `stk_comm_${Date.now()}`,
    reportId,
    sectionId: params.sectionId || 'general',
    sectionTitle: params.sectionTitle || 'General Document Observation',
    authorName: params.authorName,
    authorRole: params.authorRole,
    authorAvatar: initials,
    content: params.content,
    feedbackType: params.feedbackType,
    createdAt: now,
    status: 'open',
    selectedTextSnippet: params.selectedTextSnippet,
    suggestedRevision: params.suggestedRevision,
    replies: [],
  };

  stakeholderFeedbacksStore = [newComment, ...stakeholderFeedbacksStore];
  return newComment;
}

/**
 * Reply to a stakeholder comment
 */
export function replyToStakeholderFeedback(
  commentId: string,
  params: {
    authorName: string;
    authorRole: string;
    content: string;
  }
): StakeholderFeedbackComment | null {
  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const target = stakeholderFeedbacksStore.find((c) => c.id === commentId);
  if (!target) return null;

  const reply = {
    id: `rep_${Date.now()}`,
    authorName: params.authorName,
    authorRole: params.authorRole,
    content: params.content,
    createdAt: now,
  };

  target.replies = [...(target.replies || []), reply];
  return target;
}

/**
 * Resolve/Unresolve a feedback comment
 */
export function toggleStakeholderFeedbackResolved(commentId: string): StakeholderFeedbackComment | null {
  const target = stakeholderFeedbacksStore.find((c) => c.id === commentId);
  if (!target) return null;

  target.status = target.status === 'resolved' ? 'open' : 'resolved';
  return target;
}

/**
 * Get stakeholder approval for a report
 */
export function getStakeholderApproval(reportId: string): StakeholderApprovalRecord | null {
  return stakeholderApprovalsStore.find((a) => a.reportId === reportId) || null;
}

/**
 * Submit formal stakeholder document approval
 */
export function submitStakeholderApproval(
  reportId: string,
  params: {
    approverName: string;
    approverRole: string;
    organization: string;
    notes?: string;
  }
): StakeholderApprovalRecord {
  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const hash = `SHA256:${Math.random().toString(36).substring(2, 10)}${Date.now().toString(16)}0a1f`.toUpperCase();

  const newApproval: StakeholderApprovalRecord = {
    id: `appr_${Date.now()}`,
    reportId,
    approverName: params.approverName,
    approverRole: params.approverRole,
    organization: params.organization,
    status: 'approved',
    signOffDate: now,
    digitalSignatureHash: hash,
    declarationAgreed: true,
    notes: params.notes || 'Document verified and approved on behalf of the Stakeholder Board.',
  };

  stakeholderApprovalsStore = [
    newApproval,
    ...stakeholderApprovalsStore.filter((a) => a.reportId !== reportId),
  ];

  return newApproval;
}

/**
 * Get active share links for a report
 */
export function getStakeholderShareLinks(reportId: string): StakeholderShareLink[] {
  return stakeholderShareLinksStore.filter((l) => l.reportId === reportId);
}

/**
 * Create a new shareable link to other stakeholders
 */
export function createStakeholderShareLink(
  reportId: string,
  params: {
    permission: 'view' | 'comment' | 'approve';
    expiryDays: number; // 7, 30, 90, 0 (0 = never)
    invitedEmails?: string[];
    createdByName: string;
  }
): StakeholderShareLink {
  const token = `stk_share_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const expiryText =
    params.expiryDays === 0
      ? 'Never expires'
      : `${params.expiryDays} days from now`;

  // Host URL simulation
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://civora.app';
  const shareUrl = `${origin}/stakeholder/reports/${reportId}?shareToken=${token}`;

  const newLink: StakeholderShareLink = {
    id: `sh_link_${Date.now()}`,
    reportId,
    token,
    shareUrl,
    permission: params.permission,
    expiresAt: expiryText,
    sharedWithEmails: params.invitedEmails || [],
    createdAt: now,
    createdByName: params.createdByName,
    accessCount: 0,
  };

  stakeholderShareLinksStore = [newLink, ...stakeholderShareLinksStore];
  return newLink;
}

/**
 * Revoke a share link
 */
export function revokeStakeholderShareLink(linkId: string): boolean {
  const initialLen = stakeholderShareLinksStore.length;
  stakeholderShareLinksStore = stakeholderShareLinksStore.filter((l) => l.id !== linkId);
  return stakeholderShareLinksStore.length < initialLen;
}
