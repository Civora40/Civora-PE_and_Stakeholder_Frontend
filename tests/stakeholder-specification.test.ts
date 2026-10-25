import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  STAKEHOLDER_NAVIGATION_SECTIONS,
  getWorkspaceNavigation,
} from '../lib/navigation/workspace-navigation';
import { DEMO_USERS } from '../lib/mock-data/fixtures';

test('Stakeholder Navigation Specification Assertions', async (t) => {
  await t.test('1. Architecture: Exactly 5 expandable groups for read_only_stakeholder', () => {
    const sections = getWorkspaceNavigation(DEMO_USERS.read_only_stakeholder);
    assert.equal(sections.length, 5, 'Must have exactly 5 expandable groups');

    const expectedGroupNames = [
      'Projects',
      'Reports & Documents',
      'Progress & Delivery',
      'Communications',
      'Account & Support',
    ];

    sections.forEach((sec, idx) => {
      assert.equal(sec.name, expectedGroupNames[idx]);
    });
  });

  await t.test('2. Sub-link Requirement: Every expandable group contains AT LEAST 4 sub-links', () => {
    const sections = getWorkspaceNavigation(DEMO_USERS.read_only_stakeholder);
    sections.forEach((sec) => {
      assert.ok(
        sec.items.length >= 4,
        `Group "${sec.name}" has ${sec.items.length} items, which is fewer than the required 4 items.`
      );
    });
  });

  await t.test('3. No Empty or Dummy Routes: No href is empty, "#", or placeholder', () => {
    const sections = getWorkspaceNavigation(DEMO_USERS.read_only_stakeholder);
    const seenHrefs = new Set<string>();

    sections.forEach((sec) => {
      sec.items.forEach((item) => {
        assert.ok(item.href, `Item "${item.name}" has empty href`);
        assert.notEqual(item.href, '#', `Item "${item.name}" points to "#"`);
        assert.notEqual(item.href, '', `Item "${item.name}" points to empty string`);
        assert.ok(
          item.href.startsWith('/stakeholder'),
          `Item "${item.name}" must target /stakeholder route, got "${item.href}"`
        );

        assert.ok(
          !seenHrefs.has(item.href),
          `Duplicate href detected across sidebar items: "${item.href}"`
        );
        seenHrefs.add(item.href);
      });
    });

    assert.equal(seenHrefs.size, 20, 'Should have exactly 20 unique sub-links across 5 groups');
  });

  await t.test('4. Filesystem Route Verification: Every sidebar link and contextual detail route maps to an existing page.tsx', () => {
    const appDir = path.resolve(__dirname, '../app/(stakeholder)/stakeholder/(dashboard)');

    // 1. Overview
    const overviewPage = path.join(appDir, 'page.tsx');
    assert.ok(fs.existsSync(overviewPage), `Overview page missing at ${overviewPage}`);

    // 2. Settings (persistent account action)
    const settingsPage = path.join(appDir, 'account/settings/page.tsx');
    assert.ok(fs.existsSync(settingsPage), `Settings page missing at ${settingsPage}`);

    // 3. All 20 sidebar sub-routes
    const sections = getWorkspaceNavigation(DEMO_USERS.read_only_stakeholder);
    sections.forEach((sec) => {
      sec.items.forEach((item) => {
        // Strip leading /stakeholder/
        const relativeSubPath = item.href.replace(/^\/stakeholder\/?/, '');
        const targetPage = path.join(appDir, relativeSubPath, 'page.tsx');
        assert.ok(
          fs.existsSync(targetPage),
          `Page file missing for sidebar link "${item.name}" (${item.href}) -> expected at ${targetPage}`
        );
      });
    });

    // 4. Contextual detail routes specified in Section 5
    const requiredDetailPages = [
      'projects/[projectId]/page.tsx',
      'reports/[reportId]/page.tsx',
      'documents/[documentId]/page.tsx',
      'progress/updates/[updateId]/page.tsx',
      'progress/risks/[riskId]/page.tsx',
      'communications/announcements/[announcementId]/page.tsx',
      'communications/meetings/[meetingId]/page.tsx',
      'account/support/[ticketId]/page.tsx',
    ];

    requiredDetailPages.forEach((detailRelPath) => {
      const detailPage = path.join(appDir, detailRelPath);
      assert.ok(
        fs.existsSync(detailPage),
        `Contextual detail page missing at ${detailPage}`
      );
    });
  });

  await t.test('5. Role Isolation: Engineer tools are not exposed in Stakeholder Navigation', () => {
    const sections = getWorkspaceNavigation(DEMO_USERS.read_only_stakeholder);
    const allHrefs = sections.flatMap((sec) => sec.items.map((i) => i.href));

    const forbiddenSegments = [
      '/dashboard/submissions',
      '/dashboard/reviews',
      '/dashboard/projects/new',
      '/admin',
      '/payroll',
      '/management',
    ];

    forbiddenSegments.forEach((segment) => {
      allHrefs.forEach((href) => {
        assert.ok(
          !href.includes(segment),
          `Stakeholder navigation exposed engineer-only route "${href}" containing "${segment}"`
        );
      });
    });
  });
});
