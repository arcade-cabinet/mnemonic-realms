import { describe, expect, it } from 'vitest';
import { DiagnosticCollector } from '../../../../../engine/testing/diagnostics/collector';
import { DiagnosticReporter } from '../../../../../engine/testing/diagnostics/reporter';
import type { PlaytestTelemetry } from '../../../../../engine/testing/diagnostics/types';

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeTelemetry(overrides: Partial<PlaytestTelemetry> = {}): PlaytestTelemetry {
  return {
    tick: 0,
    position: { x: 10, y: 20 },
    mapId: 'everwick',
    currentGoal: 'test',
    action: 'move',
    questState: {},
    hp: 80,
    maxHp: 100,
    inventory: [],
    errors: [],
    ...overrides,
  };
}

function buildCollectorWithData(): DiagnosticCollector {
  const c = new DiagnosticCollector();
  for (let tick = 0; tick < 100; tick++) {
    c.recordTelemetry(makeTelemetry({
      tick,
      mapId: tick < 50 ? 'everwick' : 'heartfield',
      position: { x: tick, y: tick },
      questState: { 'MQ-01': tick < 60 ? 'active' : 'completed' },
    }));
  }
  c.startCombat('ENC-01', 20);
  c.endCombat('ENC-01', 35, 'victory');
  c.startCombat('ENC-02', 70);
  c.endCombat('ENC-02', 90, 'defeat');
  return c;
}

// ── generateReport ──────────────────────────────────────────────────────────

describe('DiagnosticReporter', () => {
  describe('generateReport', () => {
    it('produces a complete report structure', () => {
      const collector = buildCollectorWithData();
      const reporter = new DiagnosticReporter();
      const report = reporter.generateReport(collector, 'completionist');

      expect(report.strategyUsed).toBe('completionist');
      expect(report.generatedAt).toBeTruthy();
      expect(report.totalEvents).toBeGreaterThan(0);
      expect(report.events.length).toBe(report.totalEvents);
      expect(report.pacing).toBeDefined();
      expect(report.questCompletion).toBeDefined();
      expect(report.worldsVisited).toBeDefined();
      expect(report.summary).toBeTruthy();
    });

    it('counts severity levels correctly', () => {
      const collector = buildCollectorWithData();
      const reporter = new DiagnosticReporter();
      const report = reporter.generateReport(collector, 'test');

      expect(report.criticalCount + report.warningCount + report.infoCount)
        .toBe(report.totalEvents);
    });

    it('computes pacing metrics', () => {
      const collector = buildCollectorWithData();
      const reporter = new DiagnosticReporter();
      const report = reporter.generateReport(collector, 'test');

      expect(report.pacing.totalTicks).toBe(99); // tick 99 - tick 0
      expect(report.pacing.combatCount).toBe(2);
      expect(report.pacing.ticksPerMap).toHaveProperty('everwick');
      expect(report.pacing.ticksPerMap).toHaveProperty('heartfield');
    });

    it('tracks quest completion', () => {
      const collector = buildCollectorWithData();
      const reporter = new DiagnosticReporter();
      const report = reporter.generateReport(collector, 'test');

      expect(report.questCompletion['MQ-01']).toBeDefined();
      expect(report.questCompletion['MQ-01'].status).toBe('completed');
      expect(report.questCompletion['MQ-01'].timeSpent).toBeGreaterThan(0);
    });

    it('lists visited worlds', () => {
      const collector = buildCollectorWithData();
      const reporter = new DiagnosticReporter();
      const report = reporter.generateReport(collector, 'test');

      expect(report.worldsVisited).toContain('everwick');
      expect(report.worldsVisited).toContain('heartfield');
    });

    it('lists completed encounters', () => {
      const collector = buildCollectorWithData();
      const reporter = new DiagnosticReporter();
      const report = reporter.generateReport(collector, 'test');

      expect(report.encountersCompleted).toContain('ENC-01');
      expect(report.encountersCompleted).toContain('ENC-02');
    });
  });

  // ── formatMarkdown ──────────────────────────────────────────────────────

  describe('formatMarkdown', () => {
    it('produces valid Markdown with expected sections', () => {
      const collector = buildCollectorWithData();
      const reporter = new DiagnosticReporter();
      const report = reporter.generateReport(collector, 'completionist');
      const md = reporter.formatMarkdown(report);

      expect(md).toContain('# Mnemonic Realms — Playtest Diagnostic Report');
      expect(md).toContain('## Summary');
      expect(md).toContain('## Pacing Analysis');
      expect(md).toContain('**Strategy**: completionist');
    });

    it('includes severity table', () => {
      const collector = buildCollectorWithData();
      const reporter = new DiagnosticReporter();
      const report = reporter.generateReport(collector, 'test');
      const md = reporter.formatMarkdown(report);

      expect(md).toContain('| Severity | Count |');
      expect(md).toContain('Critical');
      expect(md).toContain('Warning');
    });
  });

  // ── formatJSON ────────────────────────────────────────────────────────

  describe('formatJSON', () => {
    it('produces valid JSON', () => {
      const collector = buildCollectorWithData();
      const reporter = new DiagnosticReporter();
      const report = reporter.generateReport(collector, 'test');
      const json = reporter.formatJSON(report);

      const parsed = JSON.parse(json);
      expect(parsed.strategyUsed).toBe('test');
      expect(parsed.totalEvents).toBe(report.totalEvents);
    });
  });
});

