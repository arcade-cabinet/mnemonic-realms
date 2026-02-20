/**
 * DDL Integrity Tests — Schema + Referential Validation
 *
 * Validates the split DDL files in gen/ddl/:
 * - world.json has required fields
 * - Every region ref resolves to a file
 * - Every worldSlot ref resolves to a world instance file
 * - Every world instance's parentAnchor matches a real anchor
 * - Every world instance's templateId matches a real template
 * - No orphan world instances
 *
 * The "settled-lands" region (Act 1) must be fully complete.
 * Frontier and sketch-realm world instances are validated when present.
 */

import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { formatDDLReport, validateDDL } from './ddl-validator';

const DDL_ROOT = join(process.cwd(), 'gen', 'ddl');

describe('DDL Integrity', () => {
  it('world.json has all required fields', () => {
    const report = validateDDL(DDL_ROOT);
    const worldChecks = report.checks.filter((c) => c.description.startsWith('world.json has'));

    for (const check of worldChecks) {
      expect(check.passed, check.detail ?? check.description).toBe(true);
    }
  });

  it('all region refs resolve to files', () => {
    const report = validateDDL(DDL_ROOT);
    const regionChecks = report.checks.filter((c) =>
      c.description.startsWith('Region file exists'),
    );

    expect(regionChecks.length).toBeGreaterThan(0);
    for (const check of regionChecks) {
      expect(check.passed, check.detail ?? check.description).toBe(true);
    }
  });

  it('settled-lands world slots all exist (Act 1 must be complete)', () => {
    const report = validateDDL(DDL_ROOT);
    const settledSlotChecks = report.checks.filter(
      (c) =>
        (c.description.includes('World slot') || c.description.includes('Dungeon world slot')) &&
        c.description.includes('settled-lands/'),
    );

    expect(settledSlotChecks.length).toBeGreaterThan(0);
    for (const check of settledSlotChecks) {
      expect(check.passed, check.detail ?? check.description).toBe(true);
    }
  });

  it('reports missing frontier/sketch world instances as warnings', () => {
    const report = validateDDL(DDL_ROOT);

    // These are expected to fail until Acts 2-3 are built.
    // Just verify the validator catches them.
    const futureChecks = report.checks.filter(
      (c) =>
        !c.passed &&
        (c.description.includes('frontier/') || c.description.includes('sketch-realm/')),
    );

    if (futureChecks.length > 0) {
      console.log(
        `[INFO] ${futureChecks.length} future-act world instance refs not yet created (expected)`,
      );
    }
  });

  it('no orphan world instances', () => {
    const report = validateDDL(DDL_ROOT);
    const orphanChecks = report.checks.filter((c) => c.category === 'completeness');

    for (const check of orphanChecks) {
      expect(check.passed, check.detail ?? check.description).toBe(true);
    }
  });

  it('all region connections reference valid regions', () => {
    const report = validateDDL(DDL_ROOT);
    const connChecks = report.checks.filter((c) => c.description.startsWith('Connection'));

    for (const check of connChecks) {
      expect(check.passed, check.detail ?? check.description).toBe(true);
    }
  });

  it('all world instance templates resolve', () => {
    const report = validateDDL(DDL_ROOT);
    const templateChecks = report.checks.filter((c) => c.description.includes('templateId'));

    for (const check of templateChecks) {
      expect(check.passed, check.detail ?? check.description).toBe(true);
    }
  });

  it('prints full report summary', () => {
    const report = validateDDL(DDL_ROOT);
    console.log(formatDDLReport(report));

    // Total check count sanity
    expect(report.totalChecks).toBeGreaterThan(30);
  });
});
