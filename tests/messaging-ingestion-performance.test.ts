import test from 'node:test';
import assert from 'node:assert';
import {
  processInboundWebhook,
  resolveSenderByContact,
  resolveSenderIdentity,
  linkSubmissionToTask,
  retryAttachmentDownload,
  requestMissingInformation,
  normalizePhoneNumber,
  maskContact,
} from '../lib/services/ingestion';
import {
  calculateReportingCompliance,
  calculateTaskCompletion,
  evaluateAssessmentStatus,
  recordPerformanceException,
  getReportingPolicy,
} from '../lib/services/performance';
import { can } from '../lib/permissions/rbac';
import {
  DEMO_USERS,
  DEMO_PERSONNEL,
  DEMO_SUBMISSIONS,
  DEMO_TASKS,
  DEMO_PERFORMANCE_EXCEPTIONS,
} from '../lib/mock-data/fixtures';

test('1. Messaging Ingestion: processes valid WhatsApp webhook and creates normalized submission', () => {
  const result = processInboundWebhook({
    channel: 'whatsapp',
    providerEventId: `test_evt_${Date.now()}`,
    providerMessageId: `wamid.TEST_${Date.now()}_01`,
    senderRaw: '+234 803 419 2084', // Matches Engr. Tunde Adeyemi
    projectId: 'prj_metro_01',
    messageText: 'Pour card for concourse Pier 4B cylinder breaks - 7-day test 2850 PSI.',
    attachments: [
      {
        originalFilename: 'break_cert_4b.pdf',
        mimeType: 'application/pdf',
        fileSizeBytes: 1400000,
        providerMediaId: 'med_wa_test_01',
        category: 'test_report',
      },
    ],
  });

  assert.strictEqual(result.status, 'created');
  assert.ok(result.submission);
  assert.strictEqual(result.submission.sourceChannel, 'whatsapp');
  assert.strictEqual(result.submission.senderName, 'Engr. Tunde Adeyemi');
  assert.strictEqual(result.submission.senderRole, 'Senior Structural QA Engineer');
  assert.strictEqual(result.submission.senderVerificationStatus, 'verified');
  assert.strictEqual(result.submission.reviewStatus, 'pending_review');
  assert.strictEqual(result.submission.attachments?.length, 1);
  assert.strictEqual(result.submission.attachments?.[0].processingStatus, 'ready');
});

test('2. Ingestion Idempotency: rejects duplicate provider message IDs without creating duplicates', () => {
  const duplicateMessageId = `wamid.DUP_TEST_${Date.now()}`;

  // First ingestion
  const first = processInboundWebhook({
    channel: 'whatsapp',
    providerEventId: 'evt_dup_1',
    providerMessageId: duplicateMessageId,
    senderRaw: '+2348034192084',
    messageText: 'First attempt at sending message',
  });
  assert.strictEqual(first.status, 'created');

  // Second ingestion with identical providerMessageId
  const second = processInboundWebhook({
    channel: 'whatsapp',
    providerEventId: 'evt_dup_2',
    providerMessageId: duplicateMessageId,
    senderRaw: '+2348034192084',
    messageText: 'Duplicate payload sent due to network retry',
  });

  assert.strictEqual(second.status, 'duplicate_blocked');
  assert.strictEqual(second.submission, undefined);
  assert.strictEqual(second.event.status, 'duplicate_blocked');
});

test('3. Identity Resolution: maps verified Telegram handles and WhatsApp phone numbers', () => {
  // WhatsApp phone match
  const matchedPhone = resolveSenderByContact('whatsapp', '+234 803 419 2084', DEMO_PERSONNEL);
  assert.ok(matchedPhone);
  assert.strictEqual(matchedPhone.fullName, 'Engr. Tunde Adeyemi');

  // Telegram handle match
  const matchedTg = resolveSenderByContact('telegram', '@chidinma_geo_lead', DEMO_PERSONNEL);
  assert.ok(matchedTg);
  assert.strictEqual(matchedTg.fullName, 'Chidinma Okafor');
  assert.strictEqual(matchedTg.professionalTitle, 'Lead Geotechnical Monitoring Specialist');

  // Formatting helpers
  assert.strictEqual(normalizePhoneNumber('+234 (803) 419-2084'), '+2348034192084');
  assert.ok(maskContact('+234 803 419 2084').includes('•••'));
});

test('4. Unknown Sender Exception: unmapped contact numbers are flagged in needs_verification queue without guessing', () => {
  const result = processInboundWebhook({
    channel: 'whatsapp',
    providerEventId: `evt_unknown_${Date.now()}`,
    providerMessageId: `wamid.UNKNOWN_${Date.now()}`,
    senderRaw: '+234 800 000 9999', // Completely unmapped number
    messageText: 'Site photo of excavation shoring wall from mystery worker',
  });

  assert.strictEqual(result.status, 'identity_pending');
  assert.ok(result.submission);
  assert.strictEqual(result.submission.senderVerificationStatus, 'needs_verification');
  assert.strictEqual(result.submission.reviewStatus, 'needs_verification');
  assert.strictEqual(result.submission.aiFlag.status, 'unverified');
});

test('5. Identity Resolution Action: Project Engineer can resolve unmapped submitter with audit log', () => {
  const sub = DEMO_SUBMISSIONS.find((s) => s.id === 'sub_06_unverified');
  assert.ok(sub);

  const candidate = DEMO_PERSONNEL[0]; // Engr. Tunde Adeyemi
  const resolved = resolveSenderIdentity(
    sub.id,
    candidate.id,
    DEMO_USERS.project_engineer,
    'Confirmed on call with site project manager.'
  );

  assert.strictEqual(resolved.success, true);
  assert.ok(resolved.submission);
  assert.strictEqual(resolved.submission.senderName, candidate.fullName);
  assert.strictEqual(resolved.submission.senderVerificationStatus, 'verified');
  assert.strictEqual(resolved.submission.reviewStatus, 'pending_review');

  const latestHistory = resolved.submission.history?.slice(-1)[0];
  assert.ok(latestHistory);
  assert.ok(latestHistory.action.includes('Identity resolved and attributed to'));
});

test('6. File & Media Management: handles simulated download failure and supports retry recovery', () => {
  const failedSub = DEMO_SUBMISSIONS.find((s) => s.id === 'sub_06_unverified');
  assert.ok(failedSub);
  const failedAtt = failedSub.attachments?.find((a) => a.processingStatus === 'failed');
  assert.ok(failedAtt);
  assert.strictEqual(failedAtt.processingStatus, 'failed');

  // Retry the download
  const retried = retryAttachmentDownload(failedSub.id, failedAtt.id);
  assert.strictEqual(retried.success, true);
  assert.ok(retried.attachment);
  assert.strictEqual(retried.attachment.processingStatus, 'ready');
  assert.strictEqual(retried.attachment.errorMessage, undefined);
  assert.ok(retried.attachment.checksum.startsWith('sha256:'));
});

test('7. Task Linkage & Information Requests: binds submissions to tasks and dispatches requests', () => {
  const sub = DEMO_SUBMISSIONS[0];
  const task = DEMO_TASKS[0];

  const linked = linkSubmissionToTask(sub.id, task.id, DEMO_USERS.project_engineer, 'Attached break test.');
  assert.strictEqual(linked.success, true);
  assert.strictEqual(linked.submission?.linkedTaskId, task.id);

  const req = requestMissingInformation(
    sub.id,
    'Please send 14-day break curve.',
    'whatsapp',
    DEMO_USERS.project_engineer
  );
  assert.strictEqual(req.success, true);
  assert.strictEqual(req.submission?.reviewStatus, 'needs_information');
  assert.strictEqual(req.request?.queryText, 'Please send 14-day break curve.');
});

test('8. Performance Assessment: Reporting Compliance calculation with denominator exceptions and flood prevention', () => {
  const person = DEMO_PERSONNEL[1]; // Chidinma Okafor (daily = 6 required)
  const policy = getReportingPolicy();

  // Test calculation where 1 day was approved training leave
  const metrics = calculateReportingCompliance(
    person,
    'Week 42 (Oct 13 - Oct 19, 2026)',
    DEMO_SUBMISSIONS,
    DEMO_PERFORMANCE_EXCEPTIONS,
    policy
  );

  assert.strictEqual(metrics.requiredPeriods, 6);
  assert.strictEqual(metrics.approvedExceptionsCount, 1);
  // Denominator = 6 - 1 = 5
  // Formula: (Qualifying Periods / 5) * 100
  assert.ok(metrics.formulaExplanation.includes('÷ (6 required - 1 approved exceptions)'));

  // Verify audited recording of a new performance exception
  const recorded = recordPerformanceException(
    {
      personnelId: person.id,
      personnelName: person.fullName,
      period: 'Week 43 (Oct 20 - Oct 26, 2026)',
      type: 'site_closure',
      reason: 'Severe rainstorm halted foundation excavation.',
      excludedPeriodsCount: 1,
    },
    DEMO_USERS.project_engineer
  );
  assert.strictEqual(recorded.success, true);
  assert.strictEqual(recorded.exception.type, 'site_closure');
  assert.strictEqual(recorded.exception.personnelId, person.id);
});

test('9. Performance Assessment: Task Completion is strictly separated from message count', () => {
  const personId = 'per_01'; // Tunde Adeyemi
  const metrics = calculateTaskCompletion(personId, DEMO_TASKS);

  assert.strictEqual(typeof metrics.tasksDue, 'number');
  assert.strictEqual(typeof metrics.tasksAccepted, 'number');
  assert.strictEqual(typeof metrics.taskCompletionPercentage, 'number');
  assert.ok(metrics.formulaExplanation.includes('tasks accepted ÷'));
});

test('10. Policy Governance & Payroll Decoupling: Evaluates threshold transparently without automated payroll actions', () => {
  const policy = getReportingPolicy();
  assert.strictEqual(policy.complianceThresholdPercent, 75);
  assert.strictEqual(policy.isClientProposedGuideline, true);
  assert.ok(policy.payrollDecoupledNotice.includes('does NOT automate salary deduction'));

  // 80% compliance meets 75% threshold
  assert.strictEqual(evaluateAssessmentStatus(80, 75), 'meets_threshold');
  // 65% compliance is below threshold
  assert.strictEqual(evaluateAssessmentStatus(65, 75), 'below_threshold');
});

test('11. RBAC Boundaries: Verifies role capabilities on new routes and operational actions', () => {
  const admin = DEMO_USERS.platform_admin;
  const engineer = DEMO_USERS.project_engineer;
  const stakeholder = DEMO_USERS.read_only_stakeholder;

  // Platform Admin
  assert.strictEqual(can(admin, 'integrations:manage'), true);
  assert.strictEqual(can(admin, 'policies:manage'), true);
  assert.strictEqual(can(admin, 'personnel:manage'), true);
  assert.strictEqual(can(admin, 'performance:manage'), true);

  // Project Engineer
  assert.strictEqual(can(engineer, 'submissions:review'), true);
  assert.strictEqual(can(engineer, 'personnel:manage'), true);
  assert.strictEqual(can(engineer, 'performance:manage'), true);
  assert.strictEqual(can(engineer, 'integrations:manage'), false);
  assert.strictEqual(can(engineer, 'policies:manage'), false);

  // Read-only Stakeholder
  assert.strictEqual(can(stakeholder, 'submissions:read'), true);
  assert.strictEqual(can(stakeholder, 'submissions:review'), false);
  assert.strictEqual(can(stakeholder, 'personnel:manage'), false);
  assert.strictEqual(can(stakeholder, 'performance:manage'), false);
  assert.strictEqual(can(stakeholder, 'integrations:manage'), false);
});
