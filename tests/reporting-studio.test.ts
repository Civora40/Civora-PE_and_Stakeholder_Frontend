import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  WORKSPACE_NAVIGATION_SECTIONS,
  getWorkspaceNavigation,
} from '../lib/navigation/workspace-navigation';
import { DEMO_USERS } from '../lib/mock-data/fixtures';
import {
  STARTER_REPORT_TEMPLATES,
  INITIAL_STUDIO_REPORTS,
} from '../lib/mock-data/reporting-studio';
import {
  getStudioReports,
  getStudioDrafts,
  getStudioTemplates,
  createStudioReportDraft,
  submitReportForReview,
  requestChangesOnReport,
  approveReport,
  releaseReportToStakeholders,
  triggerAIAnalysisRun,
} from '../lib/services/reporting-studio-service';

test('Reporting Studio & AI Analysis Engine Specification Assertions', async (t) => {
  await t.test('1. Sidebar Navigation: Reporting Studio group exists in Engineer Dashboard with at least 4 items', () => {
    const engineerNav = getWorkspaceNavigation(DEMO_USERS.project_engineer);
    const studioSection = engineerNav.find((s) => s.id === 'reporting-studio');

    assert.ok(studioSection, 'Reporting Studio section must exist in Engineer navigation');
    assert.equal(studioSection.name, 'Reporting Studio');
    assert.ok(
      studioSection.items.length >= 4,
      `Expected at least 4 items in Reporting Studio, found ${studioSection.items.length}`
    );
    assert.equal(studioSection.items.length, 7, 'Expected all 7 specification sub-links');
  });

  await t.test('2. Navigation Architecture: All 7 required sub-link hrefs are defined and unique', () => {
    const engineerNav = getWorkspaceNavigation(DEMO_USERS.project_engineer);
    const studioSection = engineerNav.find((s) => s.id === 'reporting-studio')!;

    const expectedRoutes = [
      '/engineer/reports',
      '/engineer/reports/all',
      '/engineer/reports/new',
      '/engineer/reports/drafts',
      '/engineer/reports/templates',
      '/engineer/reports/ai-analysis',
      '/engineer/reports/review',
    ];

    expectedRoutes.forEach((expectedHref) => {
      const found = studioSection.items.some((i) => i.href === expectedHref);
      assert.ok(found, `Expected sidebar item targeting "${expectedHref}" was not found`);
    });

    const hrefs = studioSection.items.map((i) => i.href);
    const uniqueHrefs = new Set(hrefs);
    assert.equal(hrefs.length, uniqueHrefs.size, 'No duplicate hrefs allowed');
  });

  await t.test('3. Filesystem Route Verification: Every Reporting Studio route has a dedicated page.tsx implementation', () => {
    const appDir = path.resolve(__dirname, '../app/(engineer)/engineer/reports');

    const expectedFiles = [
      'page.tsx', // /engineer/reports
      'all/page.tsx', // /engineer/reports/all
      'new/page.tsx', // /engineer/reports/new
      'drafts/page.tsx', // /engineer/reports/drafts
      'templates/page.tsx', // /engineer/reports/templates
      'ai-analysis/page.tsx', // /engineer/reports/ai-analysis
      'review/page.tsx', // /engineer/reports/review
      '[reportId]/page.tsx', // /engineer/reports/[reportId]
      '[reportId]/edit/page.tsx', // /engineer/reports/[reportId]/edit
      '[reportId]/preview/page.tsx', // /engineer/reports/[reportId]/preview
    ];

    expectedFiles.forEach((relFile) => {
      const fullPath = path.join(appDir, relFile);
      assert.ok(fs.existsSync(fullPath), `Missing implemented page file at: ${fullPath}`);
    });
  });

  await t.test('4. Template Library: 10 starter templates with versioning and structured sections', () => {
    const templates = getStudioTemplates();
    assert.ok(templates.length >= 10, `Expected at least 10 starter templates, found ${templates.length}`);

    templates.forEach((tmpl) => {
      assert.ok(tmpl.id, 'Template must have an id');
      assert.ok(tmpl.name, 'Template must have a name');
      assert.ok(tmpl.version, 'Template must be versioned');
      assert.ok(tmpl.sections.length > 0, `Template "${tmpl.name}" must have structured sections`);
      tmpl.sections.forEach((sec) => {
        assert.ok(sec.title, 'Section must have title');
        assert.ok(sec.guidance, 'Section must include technical guidance');
      });
    });
  });

  await t.test('5. Lifecycle Workflow: Draft -> Ready for Review -> Changes Requested -> Approved -> Released', () => {
    // Create draft
    const draft = createStudioReportDraft({
      projectId: 'prj_metro_01',
      title: 'Automated Lifecycle Verification Dossier',
      reportingPeriodStart: '2026-10-01',
      reportingPeriodEnd: '2026-10-15',
      authorId: 'usr_eng_02',
      authorName: 'Marcus Vance, PE',
      authorTitle: 'Senior Structural Project Engineer',
    });

    assert.equal(draft.workflowStatus, 'draft');

    // Submit for review
    const submitted = submitReportForReview(draft.id, {
      actorName: 'Marcus Vance, PE',
      authorNotes: 'Ready for structural peer sign-off.',
    });
    assert.ok(submitted);
    assert.equal(submitted.workflowStatus, 'ready_for_review');
    assert.ok(submitted.versions.length > 0, 'Submitted version snapshot must be created');

    // Request changes
    const changesRequested = requestChangesOnReport(draft.id, {
      reviewerName: 'Chief Lead Reviewer',
      reviewerRole: 'Principal Engineer',
      comments: 'Please attach 28-day break log sheet.',
    });
    assert.ok(changesRequested);
    assert.equal(changesRequested.workflowStatus, 'changes_requested');
    assert.equal(changesRequested.reviewComments.length, 1);

    // Approve
    const approved = approveReport(draft.id, {
      approverName: 'Chief Lead Reviewer',
      approverRole: 'Principal Engineer',
    });
    assert.ok(approved);
    assert.equal(approved.workflowStatus, 'approved');

    // Release to stakeholders
    const released = releaseReportToStakeholders(draft.id, {
      publisherName: 'Superintending Authority',
      publisherRole: 'Director of Works',
    });
    assert.ok(released);
    assert.equal(released.workflowStatus, 'released');
    assert.ok(released.releasedAt, 'Released date must be recorded');
  });

  await t.test('6. AI Analysis Engine: Returns grounded findings with traceable source references', () => {
    const run = triggerAIAnalysisRun({
      projectId: 'prj_metro_01',
      reportType: 'Weekly Progress Review',
      period: 'October 2026 (W42)',
      selectedSourcesCount: 12,
    });

    assert.ok(run);
    assert.equal(run.status, 'completed');
    assert.ok(run.findings.length > 0, 'AI run must produce findings');

    const groundedFinding = run.findings.find((f) => f.isGrounded);
    assert.ok(groundedFinding, 'AI findings must be flagged as grounded in Civora records');
    assert.ok(groundedFinding.title, 'Finding must have a title');
    assert.ok(groundedFinding.content, 'Finding must contain synthesized narrative');
  });

  await t.test('7. Role Isolation: Stakeholder cannot see Reporting Studio authoring tools', () => {
    const stakeholderNav = getWorkspaceNavigation(DEMO_USERS.read_only_stakeholder);
    const studioSection = stakeholderNav.find((s) => s.id === 'reporting-studio');
    assert.strictEqual(studioSection, undefined, 'Stakeholders must NOT have access to Reporting Studio');

    // Verify no engineer routes leaked into stakeholder nav
    const allStakeholderHrefs = stakeholderNav.flatMap((s) => s.items.map((i) => i.href));
    assert.ok(
      !allStakeholderHrefs.some((h) => h.startsWith('/engineer')),
      'Stakeholder nav must not contain any /engineer routes'
    );
  });
});
