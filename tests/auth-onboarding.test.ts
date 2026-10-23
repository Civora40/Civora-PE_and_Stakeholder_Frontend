import test from 'node:test';
import assert from 'node:assert';
import {
  registerSchema,
  onboardingStep1Schema,
  onboardingStep2Schema,
} from '../lib/validation/auth';
import { can } from '../lib/permissions/rbac';
import { getWorkspaceNavigation } from '../lib/navigation/workspace-navigation';
import { CivoraUser } from '../types';

test('1. Registration Validation: strictly enforces required fields and specific error messages', () => {
  const result = registerSchema.safeParse({
    firstName: '',
    lastName: '',
    email: 'not-an-email',
    organization: '',
    password: '123',
    confirmPassword: '456',
    agreeTerms: false,
  });

  assert.strictEqual(result.success, false);
  if (!result.success) {
    const errorMap = result.error.issues.reduce<Record<string, string>>((acc, issue) => {
      const key = String(issue.path[0]);
      acc[key] = issue.message;
      return acc;
    }, {});

    assert.strictEqual(errorMap['firstName'], 'Enter your first name.');
    assert.strictEqual(errorMap['lastName'], 'Enter your last name.');
    assert.strictEqual(errorMap['email'], 'Enter a valid work email address.');
    assert.strictEqual(errorMap['organization'], 'Enter your organization or company name.');
    assert.strictEqual(errorMap['password'], 'Password must be at least 6 characters long.');
    assert.strictEqual(errorMap['confirmPassword'], 'The passwords do not match.');
    assert.strictEqual(errorMap['agreeTerms'], 'Please accept the required terms to continue.');
  }
});

test('2. Registration Validation: accepts valid registration data', () => {
  const validPayload = {
    firstName: 'Sarah',
    lastName: 'Lin',
    email: 'sarah.lin@apexengineering.com',
    organization: 'Apex Engineering Ltd',
    jobTitle: 'Project Engineer',
    password: 'SecurePassword2026!',
    confirmPassword: 'SecurePassword2026!',
    agreeTerms: true,
  };

  const result = registerSchema.safeParse(validPayload);
  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.strictEqual(result.data.firstName, 'Sarah');
    assert.strictEqual(result.data.lastName, 'Lin');
    assert.strictEqual(result.data.email, 'sarah.lin@apexengineering.com');
  }
});

test('3. Security: Public registration form cannot self-assign privileged roles', () => {
  // Attempting to inject platform_admin or any elevated role via registration payload
  const maliciousPayload = {
    firstName: 'Attacker',
    lastName: 'User',
    email: 'attacker@evil.com',
    organization: 'Malicious Corp',
    jobTitle: 'Platform Administrator',
    role: 'platform_admin', // Injected role
    password: 'Password123!',
    confirmPassword: 'Password123!',
    agreeTerms: true,
  };

  const result = registerSchema.safeParse(maliciousPayload);
  assert.strictEqual(result.success, true);
  if (result.success) {
    // The role field is stripped / not present on the validated data
    assert.strictEqual('role' in result.data, false);
  }
});

test('4. Onboarding Step 1 Validation: requires first & last name and accepts optional details', () => {
  // Empty names rejected
  const invalidResult = onboardingStep1Schema.safeParse({
    firstName: '',
    lastName: '',
  });
  assert.strictEqual(invalidResult.success, false);

  // Valid step 1 data
  const validResult = onboardingStep1Schema.safeParse({
    firstName: 'Marcus',
    lastName: 'Vance',
    displayName: 'M. Vance (Lead Structural)',
    jobTitle: 'Senior Project Engineer',
    phone: '+1 555 019 2831',
    timeZone: 'America/New_York',
  });
  assert.strictEqual(validResult.success, true);
});

test('5. Onboarding Step 2 Validation: validates work context and responsibility fields', () => {
  const validResult = onboardingStep2Schema.safeParse({
    organization: 'Civora Infrastructure Ltd',
    department: 'Structural Engineering',
    primaryResponsibility: 'Project Engineering',
    defaultProject: 'prj_metro_01',
    reportingPreferences: ['Weekly progress digest', 'Immediate submittal discrepancy alerts'],
  });

  assert.strictEqual(validResult.success, true);
});

test('6. Onboarding Lifecycle & Progression: incomplete onboarding vs completed state', () => {
  // Newly registered user has null onboardingCompletedAt
  const newlyRegisteredUser: CivoraUser = {
    id: 'usr_new_101',
    name: 'Sarah Lin',
    firstName: 'Sarah',
    lastName: 'Lin',
    displayName: 'Sarah Lin',
    email: 'sarah@firm.com',
    role: 'project_engineer',
    title: 'Project Engineer',
    assignedProjects: ['prj_metro_01'],
    organization: 'Apex Engineering',
    onboardingCompletedAt: null,
    onboardingStep: 1,
    accountStatus: 'active',
  };

  const isOnboardingComplete = (u: CivoraUser) => Boolean(u.onboardingCompletedAt);

  assert.strictEqual(isOnboardingComplete(newlyRegisteredUser), false);

  // Progressive steps 1 through 9
  let currentProgressUser = newlyRegisteredUser;
  for (let step = 1; step <= 9; step++) {
    currentProgressUser = {
      ...currentProgressUser,
      onboardingStep: step + 1,
    };
    assert.strictEqual(currentProgressUser.onboardingStep, step + 1);
    assert.strictEqual(isOnboardingComplete(currentProgressUser), false);
  }

  // Upon completing step 10
  const completedUser: CivoraUser = {
    ...currentProgressUser,
    corenNumber: 'COREN/R.52941',
    cacNumber: 'RC 1849204',
    geopoliticalZone: 'South West',
    onboardingCompletedAt: Date.now(),
    onboardingStep: 10,
  };
  assert.strictEqual(isOnboardingComplete(completedUser), true);
  assert.strictEqual(completedUser.onboardingStep, 10);
  assert.strictEqual(completedUser.corenNumber, 'COREN/R.52941');
});

test('7. RBAC Boundaries: read_only_stakeholder CANNOT perform write or review mutations', () => {
  const stakeholder: CivoraUser = {
    id: 'usr_stakeholder_01',
    name: 'Elena Rostova',
    email: 'stakeholder@civora.internal',
    role: 'read_only_stakeholder',
    title: 'Oversight Director',
    assignedProjects: ['prj_metro_01'],
  };

  // Must not have mutation permissions
  assert.strictEqual(can(stakeholder, 'projects:manage'), false);
  assert.strictEqual(can(stakeholder, 'submissions:review'), false);
  assert.strictEqual(can(stakeholder, 'reports:manage'), false);
  assert.strictEqual(can(stakeholder, 'reports:release'), false);
  assert.strictEqual(can(stakeholder, 'users:manage'), false);
  assert.strictEqual(can(stakeholder, 'settings:manage'), false);

  // Must have read permissions
  assert.strictEqual(can(stakeholder, 'dashboard:read'), true);
  assert.strictEqual(can(stakeholder, 'projects:read'), true);
  assert.strictEqual(can(stakeholder, 'submissions:read'), true);
  assert.strictEqual(can(stakeholder, 'reports:read'), true);
});

test('8. RBAC Boundaries: project_engineer can review submissions but cannot manage platform users', () => {
  const engineer: CivoraUser = {
    id: 'usr_engineer_02',
    name: 'Marcus Vance, PE',
    email: 'engineer@civora.internal',
    role: 'project_engineer',
    title: 'Lead Project Engineer',
    assignedProjects: ['prj_metro_01'],
  };

  // Review permissions allowed in assigned scope
  assert.strictEqual(can(engineer, 'submissions:review', { projectId: 'prj_metro_01' }), true);
  assert.strictEqual(can(engineer, 'reports:manage'), true);

  // Scoped project verification: cannot review in unassigned project
  assert.strictEqual(can(engineer, 'submissions:review', { projectId: 'prj_unauthorized_99' }), false);

  // Platform admin tasks must be denied
  assert.strictEqual(can(engineer, 'users:manage'), false);
  assert.strictEqual(can(engineer, 'settings:manage'), false);
});

test('9. RBAC Boundaries: platform_admin has administrative authority', () => {
  const admin: CivoraUser = {
    id: 'usr_admin_01',
    name: 'Sarah Chen',
    email: 'admin@civora.internal',
    role: 'platform_admin',
    title: 'Systems Administrator',
    assignedProjects: ['*'],
  };

  assert.strictEqual(can(admin, 'users:manage'), true);
  assert.strictEqual(can(admin, 'settings:manage'), true);
  assert.strictEqual(can(admin, 'projects:manage'), true);
  assert.strictEqual(can(admin, 'dashboard:read'), true);
});

test('10. RBAC Boundaries: Unauthenticated or null user is denied all access', () => {
  assert.strictEqual(can(null, 'dashboard:read'), false);
  assert.strictEqual(can(null, 'projects:read'), false);
  assert.strictEqual(can(undefined, 'projects:manage'), false);
});

test('11. Workspace Navigation Role Isolation: project_engineer vs read_only_stakeholder', () => {
  const engineer: CivoraUser = {
    id: 'usr_eng_01',
    name: 'Marcus Vance, PE',
    email: 'engineer@civora.internal',
    role: 'project_engineer',
    title: 'Lead Project Engineer',
    assignedProjects: ['prj_metro_01'],
  };

  const stakeholder: CivoraUser = {
    id: 'usr_stakeholder_01',
    name: 'Elena Rostova',
    email: 'stakeholder@civora.internal',
    role: 'read_only_stakeholder',
    title: 'Oversight Director',
    assignedProjects: ['*'],
  };

  const engineerNav = getWorkspaceNavigation(engineer);
  const stakeholderNav = getWorkspaceNavigation(stakeholder);

  // Engineer can see Reviews & Approvals, but CANNOT see Stakeholder Oversight
  assert.strictEqual(engineerNav.some((s) => s.id === 'reviews'), true);
  assert.strictEqual(engineerNav.some((s) => s.id === 'stakeholder'), false);

  // Stakeholder can see Stakeholder Oversight, but CANNOT see Reviews & Approvals
  assert.strictEqual(stakeholderNav.some((s) => s.id === 'stakeholder'), true);
  assert.strictEqual(stakeholderNav.some((s) => s.id === 'reviews'), false);

  // Both can see Overview with "All Projects"
  const engineerOverview = engineerNav.find((s) => s.id === 'overview');
  assert.ok(engineerOverview);
  assert.strictEqual(engineerOverview.items.some((it) => it.id === 'all-projects' && it.href === '/dashboard/overview/projects'), true);

  const stakeholderOverview = stakeholderNav.find((s) => s.id === 'overview');
  assert.ok(stakeholderOverview);
  assert.strictEqual(stakeholderOverview.items.some((it) => it.id === 'all-projects' && it.href === '/dashboard/overview/projects'), true);
});

test('12. Active Link Match Logic: prevents sibling prefix matching false-positives', () => {
  const mockNavHrefs = [
    '/dashboard/submissions',
    '/dashboard/submissions/pending',
    '/dashboard/submissions/profession',
    '/dashboard/submissions/attachments',
  ];

  const computeIsActive = (currentPathname: string, targetHref: string) => {
    const hasExactMatch = mockNavHrefs.some((h) => h === currentPathname);
    if (hasExactMatch) {
      return currentPathname === targetHref;
    }
    if (targetHref === '/dashboard') {
      return currentPathname === '/dashboard';
    }
    return currentPathname.startsWith(targetHref + '/');
  };

  // Case A: User is on "/dashboard/submissions/attachments"
  // ONLY attachments should be active; "/dashboard/submissions" must NOT be active
  assert.strictEqual(computeIsActive('/dashboard/submissions/attachments', '/dashboard/submissions/attachments'), true);
  assert.strictEqual(computeIsActive('/dashboard/submissions/attachments', '/dashboard/submissions'), false);
  assert.strictEqual(computeIsActive('/dashboard/submissions/attachments', '/dashboard/submissions/pending'), false);

  // Case B: User is on "/dashboard/submissions"
  assert.strictEqual(computeIsActive('/dashboard/submissions', '/dashboard/submissions'), true);
  assert.strictEqual(computeIsActive('/dashboard/submissions', '/dashboard/submissions/attachments'), false);

  // Case C: User is on a nested detail route like "/dashboard/submissions/sub_999" (not explicitly in nav)
  // Base parent "/dashboard/submissions" should activate
  assert.strictEqual(computeIsActive('/dashboard/submissions/sub_999', '/dashboard/submissions'), true);
  assert.strictEqual(computeIsActive('/dashboard/submissions/sub_999', '/dashboard/submissions/attachments'), false);
});

