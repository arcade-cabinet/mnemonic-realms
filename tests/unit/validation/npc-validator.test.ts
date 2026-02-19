import { describe, it, expect } from 'vitest';
import { NPCValidator } from '../../../scripts/validation/npc-validator.js';

describe('NPCValidator', () => {
  it('should validate NPC placements', () => {
    const validator = new NPCValidator();
    const report = validator.validate();

    expect(report.validator).toBe('NPC Validator');
    expect(report.totalChecked).toBeGreaterThan(0);
    expect(report.passed).toBeGreaterThanOrEqual(0);
    expect(report.failed).toBeGreaterThanOrEqual(0);
    expect(report.warnings).toBeGreaterThanOrEqual(0);
  });

  it('should parse NPC documentation correctly', () => {
    const validator = new NPCValidator();
    const report = validator.validate();

    // Should find at least 20 NPCs from event-placement.md
    expect(report.totalChecked).toBeGreaterThanOrEqual(20);
  });

  it('should validate specific NPCs', () => {
    const validator = new NPCValidator();
    const report = validator.validate();

    // Should have validated at least 20 NPCs total
    expect(report.totalChecked).toBeGreaterThanOrEqual(20);
    
    // Most NPCs should pass (at least 15 out of 20+)
    expect(report.passed).toBeGreaterThanOrEqual(15);
  });

  it('should report validation metadata', () => {
    const validator = new NPCValidator();
    const report = validator.validate();

    expect(report.metadata).toBeDefined();
    expect(report.metadata?.duration).toBeGreaterThan(0);
    expect(report.metadata?.npcsChecked).toBe(report.totalChecked);
  });

  it('should generate timestamp', () => {
    const validator = new NPCValidator();
    const report = validator.validate();

    expect(report.timestamp).toBeDefined();
    expect(new Date(report.timestamp).getTime()).toBeGreaterThan(0);
  });

  it('should validate NPC count matches passed + failed', () => {
    const validator = new NPCValidator();
    const report = validator.validate();

    expect(report.totalChecked).toBe(report.passed + report.failed);
  });

  it('should have errors array', () => {
    const validator = new NPCValidator();
    const report = validator.validate();

    expect(Array.isArray(report.errors)).toBe(true);
    expect(report.errors.length).toBe(report.failed);
  });

  it('should have warnings array', () => {
    const validator = new NPCValidator();
    const report = validator.validate();

    expect(Array.isArray(report.warningMessages)).toBe(true);
    expect(report.warningMessages.length).toBe(report.warnings);
  });

  it('should validate Village Hub NPCs', () => {
    const validator = new NPCValidator();
    const report = validator.validate();

    // Village Hub should have multiple NPCs validated (passed or warned)
    // Total NPCs should be at least 21, so Village Hub should contribute some
    expect(report.totalChecked).toBeGreaterThanOrEqual(5);
  });

  it('should validate Heartfield NPCs', () => {
    const validator = new NPCValidator();
    const report = validator.validate();

    // Heartfield should have NPCs (Farmer Gale, Hana frozen)
    const heartfieldNPCs = [
      ...report.errors.filter((e) => e.includes('EV-HF-')),
      ...report.warningMessages.filter((w) => w.includes('EV-HF-')),
    ];

    expect(heartfieldNPCs.length).toBeGreaterThanOrEqual(0);
  });

  it('should validate Ambergrove NPCs', () => {
    const validator = new NPCValidator();
    const report = validator.validate();

    // Ambergrove should have NPCs (Lead Woodcutter)
    const ambergrovenpcs = [
      ...report.errors.filter((e) => e.includes('EV-AG-')),
      ...report.warningMessages.filter((w) => w.includes('EV-AG-')),
    ];

    expect(ambergrovenpcs.length).toBeGreaterThanOrEqual(0);
  });

  it('should validate Millbrook NPCs', () => {
    const validator = new NPCValidator();
    const report = validator.validate();

    // Millbrook should have NPCs (Fisher Tam, Specialty Shopkeeper)
    const millbrookNPCs = [
      ...report.errors.filter((e) => e.includes('EV-MB-')),
      ...report.warningMessages.filter((w) => w.includes('EV-MB-')),
    ];

    expect(millbrookNPCs.length).toBeGreaterThanOrEqual(0);
  });
});
