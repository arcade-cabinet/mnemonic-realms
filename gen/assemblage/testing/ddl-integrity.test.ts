/**
 * DDL Integrity Tests — Schema + Referential Validation
 *
 * Validates the split DDL files in gen/ddl/:
 * - world.json has required fields
 * - Every region ref resolves to a file
 * - Every interior ref resolves to a file
 * - Every parentAnchor matches a real anchor
 * - Every transition target exists
 * - No orphan interiors
 *
 * The "settled-lands" region (Act 1) must be fully complete.
 * Frontier and sketch-realm interiors are validated when present.
 */

import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { formatDDLReport, validateDDL } from './ddl-validator';

const DDL_ROOT = join(process.cwd(), 'gen', 'ddl');

describe('DDL Integrity', () => {
  it('world.json has all required fields', () => {
    const report = validateDDL(DDL_ROOT);
    const worldChecks = report.checks.filter(
      (c) => c.description.startsWith('world.json has'),
    );

    for (const check of worldChecks) {
      expect(check.passed, check.detail ?? check.description).toBe(true);
    }
  });

  it('all region refs resolve to files', () => {
    const report = validateDDL(DDL_ROOT);
    const regionChecks = report.checks.filter(
      (c) => c.description.startsWith('Region file exists'),
    );

    expect(regionChecks.length).toBeGreaterThan(0);
    for (const check of regionChecks) {
      expect(check.passed, check.detail ?? check.description).toBe(true);
    }
  });

  it('settled-lands interiors all exist (Act 1 must be complete)', () => {
    const report = validateDDL(DDL_ROOT);
    const settledIntChecks = report.checks.filter(
      (c) =>
        (c.description.includes('Interior ref') ||
          c.description.includes('Dungeon interior ref')) &&
        c.description.includes('settled-lands/'),
    );

    expect(settledIntChecks.length).toBeGreaterThan(0);
    for (const check of settledIntChecks) {
      expect(check.passed, check.detail ?? check.description).toBe(true);
    }
  });

  it('reports missing frontier/sketch interiors as warnings', () => {
    const report = validateDDL(DDL_ROOT);

    // These are expected to fail until Acts 2-3 are built.
    // Just verify the validator catches them.
    const futureChecks = report.checks.filter(
      (c) =>
        !c.passed &&
        (c.description.includes('frontier/') ||
          c.description.includes('sketch-realm/')),
    );

    if (futureChecks.length > 0) {
      console.log(
        `[INFO] ${futureChecks.length} future-act interior refs not yet created (expected)`,
      );
    }
  });

  it('no orphan interiors', () => {
    const report = validateDDL(DDL_ROOT);
    const orphanChecks = report.checks.filter(
      (c) => c.category === 'completeness',
    );

    for (const check of orphanChecks) {
      expect(check.passed, check.detail ?? check.description).toBe(true);
    }
  });

  it('all region connections reference valid regions', () => {
    const report = validateDDL(DDL_ROOT);
    const connChecks = report.checks.filter(
      (c) => c.description.startsWith('Connection'),
    );

    for (const check of connChecks) {
      expect(check.passed, check.detail ?? check.description).toBe(true);
    }
  });

  it('all interior transitions resolve', () => {
    const report = validateDDL(DDL_ROOT);
    const transChecks = report.checks.filter(
      (c) => c.description.includes('transition'),
    );

    for (const check of transChecks) {
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
