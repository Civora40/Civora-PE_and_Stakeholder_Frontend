import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  getStakeholderReport,
  getStakeholderFeedbacks,
  addStakeholderFeedback,
  replyToStakeholderFeedback,
  toggleStakeholderFeedbackResolved,
  getStakeholderApproval,
  submitStakeholderApproval,
  getStakeholderShareLinks,
  createStakeholderShareLink,
  revokeStakeholderShareLink,
} from '../lib/services/stakeholder-report-service';

test('Stakeholder Report Platform Studio Specification & Capabilities', async (t) => {
  await t.test('1. Report Hydration: Returns rich structured sections, cover layout, and metadata', () => {
    const report = getStakeholderReport('rep_02');

    assert.ok(report, 'Report rep_02 must load successfully');
    assert.equal(report.id, 'rep_02');
    assert.equal(report.reportNumber, 'REP-2026-Q3-02');
    assert.ok(report.sections.length >= 3, `Expected at least 3 sections, found ${report.sections.length}`);
    assert.ok(report.executiveSummary.length > 20, 'Executive summary must be populated');
    assert.ok(report.layoutSettings?.coverPage?.enabled, 'Cover page must be configured');
  });

  await t.test('2. Multi-Section Verification: All verified compliance sections have titles and content', () => {
    const report = getStakeholderReport('rep_04');

    assert.ok(report, 'rep_04 must load');
    assert.ok(report.sections.length >= 4, 'rep_04 must have comprehensive sections');

    report.sections.forEach((sec) => {
      assert.ok(sec.title.length > 5, `Section title too short: ${sec.title}`);
      assert.ok(sec.content.length > 20, `Section content too short for section: ${sec.title}`);
      assert.equal(sec.isCompleted, true, 'Section must be verified complete');
    });
  });

  await t.test('3. Feedback & Comments: Can retrieve, add, reply to, and resolve comments on document sections', () => {
    const initialComments = getStakeholderFeedbacks('rep_02');
    assert.ok(initialComments.length >= 1, 'Should have initial feedback comments');

    // Add new feedback
    const newComment = addStakeholderFeedback('rep_02', {
      sectionId: 'sec_bathymetric',
      sectionTitle: '2. Bathymetric Hydrographic Survey & 16.5m Draft Clearance',
      authorName: 'Adeola Adeleke',
      authorRole: 'Technical Director',
      content: 'Bathymetric clearance meets vessel draft requirements.',
      feedbackType: 'endorsement',
      selectedTextSnippet: '16.5m draft clearance',
    });

    assert.ok(newComment.id.startsWith('stk_comm_'));
    assert.equal(newComment.feedbackType, 'endorsement');
    assert.equal(newComment.status, 'open');

    // Reply to feedback
    const withReply = replyToStakeholderFeedback(newComment.id, {
      authorName: 'Marcus Vance, PE',
      authorRole: 'Lead Engineer',
      content: 'Acknowledged and noted in the statutory dossier.',
    });

    assert.ok(withReply);
    assert.equal(withReply?.replies?.length, 1);
    assert.equal(withReply?.replies?.[0].content, 'Acknowledged and noted in the statutory dossier.');

    // Toggle resolved
    const resolved = toggleStakeholderFeedbackResolved(newComment.id);
    assert.equal(resolved?.status, 'resolved');
  });

  await t.test('4. Document Approval: Stakeholder can execute formal sign-off with cryptographic hash', () => {
    const existing = getStakeholderApproval('rep_02');
    assert.ok(existing, 'rep_02 should have an approval record');
    assert.equal(existing.status, 'approved');
    assert.ok(existing.digitalSignatureHash.startsWith('SHA256:'));

    // Execute approval on rep_04
    const newApproval = submitStakeholderApproval('rep_04', {
      approverName: 'Hon. Babatunde Gbadamosi',
      approverRole: 'Managing Director',
      organization: 'Lagos State Transit Monitoring Agency',
      notes: 'Formally endorsed for municipal transit commission.',
    });

    assert.ok(newApproval);
    assert.equal(newApproval.reportId, 'rep_04');
    assert.equal(newApproval.approverName, 'Hon. Babatunde Gbadamosi');
    assert.equal(newApproval.status, 'approved');
    assert.ok(newApproval.digitalSignatureHash.startsWith('SHA256:'));

    const fetched = getStakeholderApproval('rep_04');
    assert.equal(fetched?.id, newApproval.id);
  });

  await t.test('5. Share via Links: Generates secure shareable URL, manages permissions, and supports revocation', () => {
    const initialLinks = getStakeholderShareLinks('rep_02');
    assert.ok(initialLinks.length >= 1, 'Should have initial share links');

    // Create a new share link
    const newLink = createStakeholderShareLink('rep_02', {
      permission: 'approve',
      expiryDays: 30,
      invitedEmails: ['auditor@infrastructure.gov.ng'],
      createdByName: 'Adeola Adeleke',
    });

    assert.ok(newLink.token.startsWith('stk_share_'));
    assert.ok(newLink.shareUrl.includes(newLink.token));
    assert.equal(newLink.permission, 'approve');
    assert.deepEqual(newLink.sharedWithEmails, ['auditor@infrastructure.gov.ng']);

    // Revoke share link
    const revoked = revokeStakeholderShareLink(newLink.id);
    assert.equal(revoked, true, 'Share link should be revoked');

    const updatedLinks = getStakeholderShareLinks('rep_02');
    assert.ok(!updatedLinks.some((l) => l.id === newLink.id), 'Revoked link should not exist in active links');
  });

  await t.test('6. Filesystem Route Verification: Platform Editor & Direct Preview routes exist', () => {
    const workspaceRoot = path.resolve(__dirname, '..');
    const detailPageRoute = path.join(
      workspaceRoot,
      'app/(stakeholder)/stakeholder/(dashboard)/reports/[reportId]/page.tsx'
    );
    const previewPageRoute = path.join(
      workspaceRoot,
      'app/(stakeholder)/stakeholder/(dashboard)/reports/[reportId]/preview/page.tsx'
    );

    assert.ok(fs.existsSync(detailPageRoute), `Expected detail page at: ${detailPageRoute}`);
    assert.ok(fs.existsSync(previewPageRoute), `Expected preview page at: ${previewPageRoute}`);
  });
});
