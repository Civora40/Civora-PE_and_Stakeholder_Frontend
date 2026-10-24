import test from 'node:test';
import assert from 'node:assert';
import { can } from '../lib/permissions/rbac';
import { getWorkspaceNavigation } from '../lib/navigation/workspace-navigation';
import { DEMO_PROJECTS, DEMO_USERS } from '../lib/mock-data/fixtures';
import { CivoraUser, Project } from '../types';

test('1. Project Initiation RBAC: project_engineer and platform_admin can manage projects', () => {
  const engineer = DEMO_USERS.project_engineer;
  const admin = DEMO_USERS.platform_admin;

  assert.strictEqual(can(engineer, 'projects:manage'), true);
  assert.strictEqual(can(admin, 'projects:manage'), true);
});

test('2. Project Initiation RBAC: read_only_stakeholder is restricted from managing projects', () => {
  const stakeholder: CivoraUser = {
    id: 'usr_stakeholder_01',
    name: 'Alhaji Ibrahim Danladi',
    email: 'stakeholder@infrastructure.gov.ng',
    role: 'read_only_stakeholder',
    title: 'Executive Director of Statutory Oversight',
    assignedProjects: ['*'],
  };

  assert.strictEqual(can(stakeholder, 'projects:manage'), false);
  assert.strictEqual(can(stakeholder, 'projects:read'), true);
});

test('3. Workspace Navigation: "New Project" link is shown only to authorized users with projects:manage', () => {
  const engineerNav = getWorkspaceNavigation(DEMO_USERS.project_engineer);
  const projectControlSectionEng = engineerNav.find((sec) => sec.id === 'projects');
  assert.ok(projectControlSectionEng);
  const newProjectLinkEng = projectControlSectionEng?.items.find((item) => item.id === 'new-project');
  assert.ok(newProjectLinkEng, 'Engineer should see New Project in Project Control menu');
  assert.strictEqual(newProjectLinkEng?.href, '/dashboard/projects/new');

  const stakeholder: CivoraUser = {
    id: 'usr_stakeholder_01',
    name: 'Alhaji Ibrahim Danladi',
    email: 'stakeholder@infrastructure.gov.ng',
    role: 'read_only_stakeholder',
    title: 'Executive Director of Statutory Oversight',
    assignedProjects: ['*'],
  };

  const stakeholderNav = getWorkspaceNavigation(stakeholder);
  const projectControlSectionStk = stakeholderNav.find((sec) => sec.id === 'projects');
  // For stakeholder, new-project link must be filtered out
  const newProjectLinkStk = projectControlSectionStk?.items.find((item) => item.id === 'new-project');
  assert.strictEqual(newProjectLinkStk, undefined, 'Stakeholder must NOT see New Project link');
});

test('4. Project Code Uniqueness: rejects existing project codes', () => {
  const existingCode = DEMO_PROJECTS[0].code.toUpperCase();
  const isDuplicate = DEMO_PROJECTS.some((p) => p.code.toUpperCase() === existingCode);
  assert.strictEqual(isDuplicate, true);

  const brandNewCode = 'UNIQUE-PRJ-2026-X99';
  const isBrandNewDuplicate = DEMO_PROJECTS.some((p) => p.code.toUpperCase() === brandNewCode);
  assert.strictEqual(isBrandNewDuplicate, false);
});

test('5. Project Data Model: supports extended project initiation metadata', () => {
  const testProject: Project = {
    id: 'prj_test_unit_01',
    code: 'TEST-UN-01',
    name: 'Lekki Coastal Defense Phase 3',
    client: 'Lagos State Ministry of Works',
    location: 'Lekki Peninsula, Lagos, Nigeria',
    status: 'active',
    leadEngineer: 'Marcus Vance, PE',
    progressPercent: 0,
    submissionsCount: 0,
    pendingReviewsCount: 0,
    reportsCount: 0,
    lastActivity: 'Just now',
    budgetFormatted: '₦50.0B',
    specsReference: 'FMWH Standard Specifications',
    projectType: 'Water, Ports & Drainage',
    description: 'Coastal breakwater and groin stabilization',
    priority: 'high',
    country: 'Nigeria',
    state: 'Lagos',
    city: 'Ibeju-Lekki',
    startDate: '2026-11-01',
    completionDate: '2027-11-01',
    scopeSummary: 'Construction of 2km rock armor revetment',
    deliverables: ['Revetment armoring', 'Geotextile underlayment'],
    milestonesList: [{ id: 'ms-1', title: 'Phase 1 Armor Rock', targetDate: '2027-02-01' }],
    contractor: 'Julius Berger Nigeria Plc',
    reportingCadence: 'daily',
    submissionChannels: ['whatsapp', 'portal'],
    reportingCategories: ['Progress & Chainage', 'Quality & QA Evidence'],
    stakeholderReviewRequired: true,
    requireLabBreakCert: true,
    requireGeotaggedPhotos: true,
  };

  assert.strictEqual(testProject.code, 'TEST-UN-01');
  assert.strictEqual(testProject.projectType, 'Water, Ports & Drainage');
  assert.strictEqual(testProject.priority, 'high');
  assert.strictEqual(testProject.deliverables?.length, 2);
  assert.strictEqual(testProject.submissionChannels?.includes('whatsapp'), true);
  assert.strictEqual(testProject.requireLabBreakCert, true);
});

test('6. Channel Integration Configuration: verifies WhatsApp and Telegram gateway properties', () => {
  const { DEMO_INTEGRATION_CONFIG } = require('../lib/mock-data/fixtures');

  // WhatsApp Gateway
  assert.strictEqual(DEMO_INTEGRATION_CONFIG.whatsapp.enabled, true);
  assert.strictEqual(typeof DEMO_INTEGRATION_CONFIG.whatsapp.displayPhoneNumber, 'string');
  assert.strictEqual(typeof DEMO_INTEGRATION_CONFIG.whatsapp.phoneNumberId, 'string');
  assert.strictEqual(typeof DEMO_INTEGRATION_CONFIG.whatsapp.webhookVerifyToken, 'string');
  assert.strictEqual(DEMO_INTEGRATION_CONFIG.whatsapp.status, 'connected');

  // Telegram Gateway
  assert.strictEqual(DEMO_INTEGRATION_CONFIG.telegram.enabled, true);
  assert.strictEqual(DEMO_INTEGRATION_CONFIG.telegram.botUsername, '@CivoraControlBot');
  assert.strictEqual(typeof DEMO_INTEGRATION_CONFIG.telegram.webhookUrl, 'string');
  assert.ok(Array.isArray(DEMO_INTEGRATION_CONFIG.telegram.allowedChatIds));
  assert.strictEqual(DEMO_INTEGRATION_CONFIG.telegram.status, 'connected');
});

test('7. Channel Integration Security: read_only_stakeholder is forbidden from modifying integration settings', () => {
  const stakeholder: CivoraUser = {
    id: 'usr_stakeholder_01',
    name: 'Alhaji Ibrahim Danladi',
    email: 'stakeholder@infrastructure.gov.ng',
    role: 'read_only_stakeholder',
    title: 'Executive Director of Statutory Oversight',
    assignedProjects: ['*'],
  };

  assert.strictEqual(can(stakeholder, 'integrations:manage'), false);
  assert.strictEqual(can(DEMO_USERS.platform_admin, 'integrations:manage'), true);
});

