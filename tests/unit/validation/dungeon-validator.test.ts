import { describe, it, expect } from 'vitest';
import { DungeonValidator } from '../../../scripts/validation/dungeon-validator.js';

describe('DungeonValidator', () => {
  it('should validate all Depths floors', () => {
    const validator = new DungeonValidator();
    const report = validator.validate();

    expect(report.totalChecked).toBeGreaterThan(0);
    expect(report.passed).toBeGreaterThan(0);
  });

  it('should validate Depths Level 1 has entrance', () => {
    const validator = new DungeonValidator();
    const report = validator.validate();

    const entranceError = report.errors.find(
      (e) =>
        e.type === 'missing_entrance' &&
        e.location.includes('Depths Level 1'),
    );
    expect(entranceError).toBeUndefined();
  });

  it('should validate Depths Level 1 has no boss (tutorial floor)', () => {
    const validator = new DungeonValidator();
    const report = validator.validate();

    const bossError = report.errors.find(
      (e) =>
        e.type === 'missing_boss' && e.location.includes('Depths Level 1'),
    );
    expect(bossError).toBeUndefined();
  });

  it('should validate Depths Level 2-5 have bosses', () => {
    const validator = new DungeonValidator();
    const report = validator.validate();

    const bossErrors = report.errors.filter(
      (e) =>
        e.type === 'missing_boss' &&
        (e.location.includes('Level 2') ||
          e.location.includes('Level 3') ||
          e.location.includes('Level 4') ||
          e.location.includes('Level 5')),
    );
    expect(bossErrors).toHaveLength(0);
  });

  it('should validate all Depths floors have stairways', () => {
    const validator = new DungeonValidator();
    const report = validator.validate();

    const stairwayErrors = report.errors.filter(
      (e) => e.type === 'missing_stairway' && e.location.includes('Depths'),
    );
    expect(stairwayErrors).toHaveLength(0);
  });

  it('should validate all Depths floors have memory lifts', () => {
    const validator = new DungeonValidator();
    const report = validator.validate();

    const liftErrors = report.errors.filter(
      (e) =>
        e.type === 'missing_memory_lift' && e.location.includes('Depths'),
    );
    expect(liftErrors).toHaveLength(0);
  });

  it('should validate all Fortress floors', () => {
    const validator = new DungeonValidator();
    const report = validator.validate();

    const fortressErrors = report.errors.filter((e) =>
      e.location.includes('Fortress'),
    );
    expect(fortressErrors).toHaveLength(0);
  });

  it('should validate Fortress Floor 1 has entrance from Undrawn Peaks', () => {
    const validator = new DungeonValidator();
    const report = validator.validate();

    const entranceError = report.errors.find(
      (e) =>
        e.type === 'missing_entrance' &&
        e.location.includes('Fortress Floor 1'),
    );
    expect(entranceError).toBeUndefined();
  });

  it('should validate all Fortress floors have bosses', () => {
    const validator = new DungeonValidator();
    const report = validator.validate();

    const bossErrors = report.errors.filter(
      (e) => e.type === 'missing_boss' && e.location.includes('Fortress'),
    );
    expect(bossErrors).toHaveLength(0);
  });

  it('should validate Fortress Floor 1-2 have stairways', () => {
    const validator = new DungeonValidator();
    const report = validator.validate();

    const stairwayErrors = report.errors.filter(
      (e) =>
        e.type === 'missing_stairway' &&
        (e.location.includes('Floor 1') || e.location.includes('Floor 2')),
    );
    expect(stairwayErrors).toHaveLength(0);
  });

  it('should validate Fortress Floor 3 has no stairway (final floor)', () => {
    const validator = new DungeonValidator();
    const report = validator.validate();

    const stairwayError = report.errors.find(
      (e) =>
        e.type === 'missing_stairway' &&
        e.location.includes('Fortress Floor 3'),
    );
    expect(stairwayError).toBeUndefined();
  });

  it('should validate dungeon accessibility conditions', () => {
    const validator = new DungeonValidator();
    const report = validator.validate();

    // All Depths floors should have entrance conditions
    const accessibilityErrors = report.errors.filter(
      (e) => e.type === 'missing_entrance_condition',
    );
    expect(accessibilityErrors).toHaveLength(0);
  });
});
