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
/* PRODUCTION CLEAN STATE (ZERO SEED DATA)                                   */
/* ========================================================================= */

export const STAKEHOLDER_MILESTONES: StakeholderProjectMilestone[] = [];

export const STAKEHOLDER_UPDATES: StakeholderUpdateItem[] = [];

export const STAKEHOLDER_RELEASED_REPORTS: StakeholderReleasedReport[] = [];

export const STAKEHOLDER_DOCUMENTS: StakeholderSharedDocument[] = [];

export const STAKEHOLDER_TEAM: StakeholderTeamMember[] = [];

export const STAKEHOLDER_RISKS: StakeholderRisk[] = [];

export const STAKEHOLDER_ANNOUNCEMENTS: StakeholderAnnouncement[] = [];

export const STAKEHOLDER_MEETINGS: StakeholderMeeting[] = [];

export const STAKEHOLDER_SUPPORT_TICKETS: StakeholderSupportTicket[] = [];

export const STAKEHOLDER_FAQS: StakeholderFAQ[] = [
  {
    id: 'faq_01',
    category: 'Data Governance',
    question: 'How frequently are released reports published to the Stakeholder Workspace?',
    answer:
      'Reports are released in accordance with each project reporting cadence—typically bi-weekly or monthly. Every report must pass two-step technical sign-off by the superintending Project Engineer before being published to stakeholders.',
  },
  {
    id: 'faq_02',
    category: 'Permissions & Security',
    question: 'Why are some project documents marked as superseded?',
    answer:
      'When a design revision, regulatory certificate, or report is formally updated, the previous version is immutably archived as superseded. This guarantees full auditability without overwriting past engineering records.',
  },
  {
    id: 'faq_03',
    category: 'Field Evidence',
    question: 'Are concrete test results verified by independent testing laboratories?',
    answer:
      'Yes. All concrete cube crushing tests and ultrasonic weld inspections must be stamped by accredited third-party laboratories (e.g. Standard Organisation of Nigeria NIS standards) before being linked to released dossiers.',
  },
  {
    id: 'faq_04',
    category: 'Meetings & Collaboration',
    question: 'How do I add agenda items to upcoming stakeholder milestone reviews?',
    answer:
      'You can submit requests directly through the Contact Project Team page or reply to the specific meeting invitation at least 48 hours prior to the scheduled session.',
  },
];
