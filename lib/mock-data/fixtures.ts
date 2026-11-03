import {
  CivoraUser,
  Project,
  Submission,
  Report,
  Personnel,
  ProjectTask,
  ActivityRecord,
  ReportingPolicy,
  PerformanceAssessment,
  PerformanceException,
  ChannelIntegrationConfig,
  IntegrationEvent,
} from '@/types';

/**
 * Production Clean State Stores
 *
 * All mock/seed records have been cleared to zero for production deployment.
 * Live records are fetched from the backend database.
 */
export const IS_DEMO_DATA = false;

export const DEMO_USERS: Record<string, CivoraUser> = {
  platform_admin: {
    id: 'usr_admin_01',
    name: 'Civora Platform Administrator',
    firstName: 'Civora',
    lastName: 'Administrator',
    displayName: 'Civora Platform Administrator',
    email: 'Civora40@gmail.com',
    role: 'platform_admin',
    title: 'Lead Platform Administrator & Chief Compliance Officer',
    organization: 'Civora Core Infrastructure',
    jobTitle: 'Lead Platform Administrator',
    department: 'Platform Governance & Engineering',
    primaryResponsibility: 'Project Management',
    assignedProjects: ['*'],
    onboardingCompletedAt: 1770000000000,
    onboardingStep: 10,
    accountStatus: 'active',
  },
  project_engineer: {
    id: 'usr_eng_02',
    name: 'Project Engineer',
    firstName: 'Project',
    lastName: 'Engineer',
    displayName: 'Project Engineer',
    email: 'engineer@civora.internal',
    role: 'project_engineer',
    title: 'Project Engineer',
    organization: '',
    jobTitle: 'Project Engineer',
    department: 'Civil & Structural Engineering',
    primaryResponsibility: 'Project Engineering',
    assignedProjects: [],
    onboardingCompletedAt: 1770000000000,
    onboardingStep: 10,
    accountStatus: 'active',
  },
  read_only_stakeholder: {
    id: 'usr_stake_03',
    name: 'Stakeholder Representative',
    firstName: 'Stakeholder',
    lastName: 'Representative',
    displayName: 'Stakeholder Representative',
    email: 'stakeholder@civora.internal',
    role: 'read_only_stakeholder',
    title: 'Capital Programs Oversight Director',
    organization: '',
    jobTitle: 'Oversight Director',
    department: 'Executive Advisory',
    primaryResponsibility: 'Client/Stakeholder',
    assignedProjects: [],
    onboardingCompletedAt: 1770000000000,
    onboardingStep: 10,
    accountStatus: 'active',
  },
};

export const DEMO_PROJECTS: Project[] = [];

export const DEMO_PERSONNEL: Personnel[] = [];

export const DEMO_TASKS: ProjectTask[] = [];

export const DEMO_ACTIVITIES: ActivityRecord[] = [];

export const DEMO_SUBMISSIONS: Submission[] = [];

export const DEMO_REPORTING_POLICY: ReportingPolicy = {
  id: 'pol_civora_gov_01',
  name: 'Standard Field Reporting & Submittal Governance Policy',
  effectiveDate: '2026-01-01',
  version: '2.4',
  complianceThresholdPercent: 75,
  cadenceByRole: {
    'Senior Structural QA Engineer': 'daily',
    'Lead Geotechnical Monitoring Specialist': 'daily',
    'Resident Site Engineer': 'daily',
    'Materials Testing Lab Analyst': 'twice_weekly',
    'HSE & Environmental Compliance Officer': 'weekly',
  },
  approvedExceptionTypes: [
    'approved_leave',
    'site_closure',
    'reassigned_duty',
    'weather_delay',
    'data_correction',
    'other_approved_reason',
  ],
  isClientProposedGuideline: true,
  payrollDecoupledNotice:
    'Governance Notice: This compliance metric is an operational engineering advisory indicator and does NOT automate salary deduction or payroll actions.',
};

export const DEMO_PERFORMANCE_EXCEPTIONS: PerformanceException[] = [];

export const DEMO_PERFORMANCE_ASSESSMENTS: PerformanceAssessment[] = [];

export const DEMO_INTEGRATION_CONFIG: ChannelIntegrationConfig = {
  whatsapp: {
    enabled: true,
    displayPhoneNumber: '+234 1 888 0420',
    phoneNumberId: 'wa_ph_99482018472',
    webhookVerifyToken: 'civora_wa_verify_token_2026',
    webhookSecretMasked: '••••••••••••••••••••••••8f9a',
    status: 'connected',
    groupIngestionSupported: false,
    groupNotice: 'Direct verified 1:1 engineer numbers only',
    lastEventTime: 'No events yet',
    totalIngested: 0,
    duplicatesBlocked: 0,
  },
  telegram: {
    enabled: true,
    botUsername: '@CivoraControlBot',
    botTokenMasked: '719482••••:•••••••••••••••••••••••••x92K',
    webhookUrl: 'https://api.civora.app/api/webhooks/telegram',
    allowedChatIds: [],
    status: 'connected',
    lastEventTime: 'No events yet',
    totalIngested: 0,
    duplicatesBlocked: 0,
  },
};

export const DEMO_INTEGRATION_EVENTS: IntegrationEvent[] = [];

export const DEMO_REPORTS: Report[] = [];
