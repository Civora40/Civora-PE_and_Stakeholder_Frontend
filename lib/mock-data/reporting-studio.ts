import {
  ReportTemplate,
  StudioReport,
  AIAnalysisRun,
} from '@/lib/types/reporting-studio';

export const STARTER_REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'tmpl_daily_site',
    name: 'Daily Site Report',
    description:
      'Mandatory daily record of on-site weather, workforce muster, active work packages, material deliveries, and plant utilization.',
    reportType: 'Daily Site Summary',
    frequency: 'Daily',
    version: '2.1',
    isActive: true,
    sections: [
      {
        id: 'sec_weather_site_cond',
        title: 'Weather & Site Conditions',
        placeholder:
          'Record ambient temperature, precipitation, tidal/ground conditions, and working hour constraints...',
        guidance:
          'Crucial for delay claims and concrete placement temperature limits (BS 8110 / FMWH).',
        required: true,
        defaultContent: '',
      },
      {
        id: 'sec_workforce_muster',
        title: 'Labor & Subcontractor Muster',
        placeholder:
          'Breakdown of site supervisory staff, skilled trades, and general operatives present on site...',
        guidance:
          'Record headcounts across each sub-trade and verify safety toolbox attendance.',
        required: true,
        defaultContent: '',
      },
      {
        id: 'sec_daily_progress',
        title: 'Work Executed Today by Gridline / Chainage',
        placeholder:
          'Detail physical progress accomplished during the shift by specific grid or chainage...',
        guidance: 'Cite exact locations and referenced drawing revisions.',
        required: true,
        defaultContent: '',
      },
      {
        id: 'sec_plant_equipment',
        title: 'Plant, Machinery & Material Receipts',
        placeholder:
          'Log active mobile plant, cranes, batching trucks, and verified delivery consignments...',
        guidance: 'Attach delivery waybills and fuel/breakdown notes.',
        required: false,
        defaultContent: '',
      },
    ],
  },
  {
    id: 'tmpl_weekly_progress',
    name: 'Weekly Construction Progress Report',
    description:
      'Weekly delivery synthesis tracking milestone progress against approved look-ahead schedules, field submittals, and material consumption.',
    reportType: 'Weekly Progress Review',
    frequency: 'Weekly',
    version: '3.0',
    isActive: true,
    sections: [
      {
        id: 'sec_exec_summary',
        title: 'Executive Summary & Look-Ahead',
        placeholder:
          'Synthesize critical achievements, schedule variances, and primary focuses for the upcoming week...',
        guidance:
          'Keep executive summary concise and focused on commercial milestones.',
        required: true,
        defaultContent: '',
      },
      {
        id: 'sec_physical_progress',
        title: 'Work Package Breakdown & Milestones',
        placeholder:
          'Itemize progress across structural, MEP, earthworks, and architectural packages...',
        guidance:
          'Cross-reference verified milestone completion dates and field measurements.',
        required: true,
        defaultContent: '',
      },
      {
        id: 'sec_quality_assurance',
        title: 'Quality Control & Inspection Sign-Offs',
        placeholder:
          'Summarize test laboratory results, cube crushing certificates, and non-conformance reports (NCRs)...',
        guidance:
          'Ensure all cube crushes meet Eurocode 2 / NIS design characteristic strength (fck).',
        required: true,
        defaultContent: '',
      },
      {
        id: 'sec_hse_highlights',
        title: 'Health, Safety & Environmental Performance',
        placeholder:
          'Summarize safe man-hours, near-misses, environmental compliance, and toolbox topics...',
        guidance:
          'Report any lost-time incidents (LTIs) immediately in accordance with statutory guidelines.',
        required: true,
        defaultContent: '',
      },
    ],
  },
  {
    id: 'tmpl_monthly_status',
    name: 'Monthly Project Status Report',
    description:
      'Comprehensive institutional monthly compliance dossier prepared for project sponsors, lenders, and statutory monitoring authorities.',
    reportType: 'Monthly Compliance Dossier',
    frequency: 'Monthly',
    version: '4.0',
    isActive: true,
    sections: [
      {
        id: 'sec_project_overview',
        title: 'Project Identification & Contract Status',
        placeholder:
          'Contractual baseline, client details, FIDIC contract references, and critical date baselines...',
        guidance:
          'Must align with official project charter and latest approved baseline revision.',
        required: true,
        defaultContent: '',
      },
      {
        id: 'sec_commercial_financial',
        title: 'Commercial, Valuations & Change Orders',
        placeholder:
          'Interim payment certificate (IPC) status, approved variations, and claims register...',
        guidance:
          'Exclude internal subcontractor margins; report only approved client valuations.',
        required: true,
        defaultContent: '',
      },
      {
        id: 'sec_engineering_progress',
        title: 'Engineering & Construction Physical Delivery',
        placeholder:
          'Detailed narrative on civil, structural, geotechnical, and systems engineering achievements...',
        guidance:
          'Cite certified laboratory test results and independent consultant verifications.',
        required: true,
        defaultContent: '',
      },
      {
        id: 'sec_statutory_compliance',
        title: 'Statutory Inspections & Government Clearances',
        placeholder:
          'Permit updates from LASBCA, Federal Ministry of Environment, NIMASA, and NPA...',
        guidance:
          'Attach official verification seals and stage inspection numbers.',
        required: true,
        defaultContent: '',
      },
      {
        id: 'sec_risks_mitigations',
        title: 'Key Project Risks & Mitigation Strategy',
        placeholder:
          'Active critical risks, supply chain bottlenecks, and contingency measures...',
        guidance:
          'Highlight schedule-critical path items and port customs bottlenecks.',
        required: true,
        defaultContent: '',
      },
    ],
  },
  {
    id: 'tmpl_site_inspection',
    name: 'Site Inspection Report',
    description:
      'Technical inspection record documenting pre-pour inspections, reinforcement verification, structural member sign-offs, and punch-list items.',
    reportType: 'Site Inspection Record',
    frequency: 'Event-Driven',
    version: '1.4',
    isActive: true,
    sections: [
      {
        id: 'sec_inspection_details',
        title: 'Inspection Scope & Regulatory Standards',
        placeholder:
          'Specify element inspected, drawing numbers, testing standards, and inspecting officers...',
        guidance: 'Include COREN registration numbers for signing engineers.',
        required: true,
        defaultContent: '',
      },
      {
        id: 'sec_check_results',
        title: 'Checklist Verification & Tolerances',
        placeholder:
          'Dimensions, bar spacing, cover block thickness, dowel bar alignment, and cleanliness...',
        guidance:
          'Highlight any deviations beyond allowable standard tolerances (±5mm).',
        required: true,
        defaultContent: '',
      },
      {
        id: 'sec_punch_list',
        title: 'Discrepancies & Corrective Actions Required',
        placeholder:
          'List items that must be rectified prior to pour authorization...',
        guidance:
          'If clean sign-off with no punch list, state "Approved with no reservations".',
        required: true,
        defaultContent: '',
      },
    ],
  },
  {
    id: 'tmpl_hse_report',
    name: 'Health, Safety & Environment (HSE) Report',
    description:
      'Auditable safety and environmental stewardship dossier tracking incidents, permit-to-work compliance, and hazardous materials governance.',
    reportType: 'HSE Audit Dossier',
    frequency: 'Weekly',
    version: '2.0',
    isActive: true,
    sections: [
      {
        id: 'sec_hse_metrics',
        title: 'Safety Metrics & Key Performance Indicators',
        placeholder:
          'Record LTIs, First Aid Cases, Near Misses, and Safe Work Hours...',
        guidance: 'Zero tolerance for unrecorded minor incidents.',
        required: true,
      },
      {
        id: 'sec_permits_work',
        title: 'Permit to Work (PTW) Compliance',
        placeholder:
          'Log hot work, confined space, lifting, and working at height permits issued...',
        guidance: 'Verify gas test logs and isolation lock-outs.',
        required: true,
      },
      {
        id: 'sec_environmental_monitoring',
        title: 'Environmental Stewardship & Waste Management',
        placeholder:
          'Erosion control, runoff containment, diesel storage bund checks, and waste disposals...',
        guidance:
          'Comply with Federal Ministry of Environment EIA monitoring matrix.',
        required: true,
      },
    ],
  },
  {
    id: 'tmpl_qaqc_report',
    name: 'Quality Assurance / Quality Control (QA/QC) Report',
    description:
      'Laboratory testing consolidation documenting concrete compressive breaks, compaction density tests, and welding ultrasonic examinations.',
    reportType: 'QA/QC Materials Verification',
    frequency: 'Weekly',
    version: '2.2',
    isActive: true,
    sections: [
      {
        id: 'sec_materials_compliance',
        title: 'Materials Approval & Mill Test Certificates',
        placeholder:
          'Batch certifications for cement, high-tensile steel, aggregates, and admixtures...',
        guidance:
          'All steel batches must include heat numbers and yield stress certificates.',
        required: true,
      },
      {
        id: 'sec_concrete_break_log',
        title: 'Compressive Strength Test Log (7, 14 & 28 Days)',
        placeholder:
          'Tabulate sample IDs, pour locations, density, failure load, and calculated compressive strength...',
        guidance: 'Must be stamped by accredited materials laboratory.',
        required: true,
      },
      {
        id: 'sec_ncr_register',
        title: 'Non-Conformance Reports (NCR) Tracking',
        placeholder:
          'Open NCRs, root cause analyses, corrective actions, and close-out dates...',
        guidance: 'Include photos of rectified work before formal sign-off.',
        required: true,
      },
    ],
  },
  {
    id: 'tmpl_risk_issue',
    name: 'Risk & Issue Report',
    description:
      'Structured risk assessment focusing on critical path schedule vulnerabilities, contractual disputes, and geotechnical unforeseen conditions.',
    reportType: 'Risk & Issue Dossier',
    frequency: 'Event-Driven',
    version: '1.2',
    isActive: true,
    sections: [
      {
        id: 'sec_risk_summary',
        title: 'Risk Identification & Severity Matrix',
        placeholder:
          'Identify newly emerged risks, likelihood, impact ratings, and risk owner...',
        guidance: 'Score risks on 1-5 likelihood and impact scale.',
        required: true,
      },
      {
        id: 'sec_mitigation_action',
        title: 'Mitigation Plan & Contingency Allocation',
        placeholder:
          'Detail proactive controls, commercial notices served, and engineering re-designs...',
        guidance: 'Specify target resolution dates and accountable lead.',
        required: true,
      },
    ],
  },
  {
    id: 'tmpl_milestone_completion',
    name: 'Milestone Completion Report',
    description:
      'Formal sign-off dossier certifying completion of a contractual phase gate, supported by testing evidence and statutory approvals.',
    reportType: 'Milestone Handover Gate',
    frequency: 'Milestone-Gate',
    version: '3.1',
    isActive: true,
    sections: [
      {
        id: 'sec_milestone_scope',
        title: 'Contractual Milestone Specification',
        placeholder:
          'Define scope, baseline target date, and contractual acceptance criteria...',
        guidance:
          'Must match FIDIC Particular Conditions / Contract Specification schedule.',
        required: true,
      },
      {
        id: 'sec_completion_evidence',
        title: 'Verification Evidence & Test Results',
        placeholder:
          'Attach independent engineer sign-offs, lab test summaries, and survey drawings...',
        guidance:
          'Reference authorized documents stored in Civora Shared Documents.',
        required: true,
      },
      {
        id: 'sec_formal_signoff',
        title: 'Superintending Engineer Formal Endorsement',
        placeholder:
          'Certifying statement confirming element is fit for purpose and ready for subsequent stage...',
        guidance: 'Requires lead engineer sign-off and official COREN seal.',
        required: true,
      },
    ],
  },
  {
    id: 'tmpl_incident_report',
    name: 'Incident Report',
    description:
      'Critical investigation record for safety incidents, structural defects, weather damages, or environmental spills on site.',
    reportType: 'Incident Investigation',
    frequency: 'Event-Driven',
    version: '1.0',
    isActive: true,
    sections: [
      {
        id: 'sec_incident_chronology',
        title: 'Incident Description & Chronology',
        placeholder:
          'Exact date, time, weather, equipment involved, and chronological narrative...',
        guidance:
          'Factual, objective observations only. Avoid speculative assumptions.',
        required: true,
      },
      {
        id: 'sec_root_cause',
        title: 'Root Cause Analysis & Immediate Actions',
        placeholder:
          'Analyze direct cause, contributing safety barriers, and immediate containment...',
        guidance: 'Use 5-Whys methodology to identify systemic failures.',
        required: true,
      },
      {
        id: 'sec_preventative_measures',
        title: 'Corrective & Preventative Action Plan (CAPA)',
        placeholder:
          'Mandatory procedure updates, retrainings, and engineering equipment modifications...',
        guidance:
          'Assign individual responsibility and target implementation dates.',
        required: true,
      },
    ],
  },
  {
    id: 'tmpl_exec_summary',
    name: 'Executive Project Summary',
    description:
      'High-level synthesis for C-suite infrastructure developers, institutional funds, and board investment committees.',
    reportType: 'Executive Summary Briefing',
    frequency: 'Monthly',
    version: '2.5',
    isActive: true,
    sections: [
      {
        id: 'sec_portfolio_pulse',
        title: 'Strategic Delivery Pulse & Schedule Status',
        placeholder:
          'High-level summary of delivery velocity, key gates reached, and milestone outlook...',
        guidance:
          'Limit technical jargon; emphasize schedule and delivery confidence.',
        required: true,
      },
      {
        id: 'sec_key_decisions',
        title: 'Decisions Required from Steering Committee',
        placeholder:
          'Highlight commercial approvals, right-of-way authorisations, or budget escalations needed...',
        guidance: 'Clearly state decision deadline and impact of delay.',
        required: true,
      },
    ],
  },
];

export const INITIAL_STUDIO_REPORTS: StudioReport[] = [];

export const INITIAL_AI_ANALYSIS_RUNS: AIAnalysisRun[] = [];
