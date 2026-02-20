import { describe, expect, it } from 'vitest';
import { DiagnosticCollector } from '../../../../../engine/testing/diagnostics/collector';
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

function makeStuckTelemetry(count: number, startTick = 0): PlaytestTelemetry[] {
  return Array.from({ length: count }, (_, i) =>
    makeTelemetry({ tick: startTick + i, position: { x: 5, y: 5 } }),
  );
}

// ── recordTelemetry ─────────────────────────────────────────────────────────

describe('DiagnosticCollector', () => {
  describe('recordTelemetry', () => {
    it('stores telemetry snapshots', () => {
      const c = new DiagnosticCollector();
      c.recordTelemetry(makeTelemetry({ tick: 1 }));
      c.recordTelemetry(makeTelemetry({ tick: 2 }));
      expect(c.getTelemetry()).toHaveLength(2);
    });

    it('returns copies from getTelemetry', () => {
      const c = new DiagnosticCollector();
      c.recordTelemetry(makeTelemetry());
      const t1 = c.getTelemetry();
      const t2 = c.getTelemetry();
      expect(t1).not.toBe(t2);
      expect(t1).toEqual(t2);
    });
  });

  // ── recordEvent ─────────────────────────────────────────────────────────

  describe('recordEvent', () => {
    it('adds timestamp automatically', () => {
      const c = new DiagnosticCollector();
      c.recordEvent({
        tick: 10,
        category: 'navigation',
        severity: 'warning',
        message: 'test',
        details: {},
      });
      const events = c.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].timestamp).toBeGreaterThan(0);
    });
  });

  // ── Combat tracking ───────────────────────────────────────────────────

  describe('combat tracking', () => {
    it('records combat duration', () => {
      const c = new DiagnosticCollector();
      c.recordTelemetry(makeTelemetry({ tick: 100 }));
      c.startCombat('ENC-01', 100);
      c.endCombat('ENC-01', 120, 'victory');
      expect(c.getCombatLengths()).toEqual([20]);
    });

    it('tracks defeat locations', () => {
      const c = new DiagnosticCollector();
      c.recordTelemetry(makeTelemetry({ tick: 50, mapId: 'forest' }));
      c.startCombat('ENC-01', 50);
      c.endCombat('ENC-01', 60, 'defeat');
      expect(c.getDeathLocations().size).toBe(1);
    });

    it('records combat end events', () => {
      const c = new DiagnosticCollector();
      c.startCombat('ENC-01', 10);
      c.endCombat('ENC-01', 25, 'victory');
      const events = c.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].category).toBe('combat-balance');
      expect(events[0].severity).toBe('info');
    });

    it('marks defeat as warning severity', () => {
      const c = new DiagnosticCollector();
      c.recordTelemetry(makeTelemetry());
      c.startCombat('ENC-01', 10);
      c.endCombat('ENC-01', 25, 'defeat');
      expect(c.getEvents()[0].severity).toBe('warning');
    });
  });

  // ── Stuck detection ───────────────────────────────────────────────────

  describe('analyzeStream — stuck detection', () => {
    it('detects player stuck for 100+ ticks', () => {
      const c = new DiagnosticCollector();
      // 5 ticks moving, then 100 ticks stuck
      c.recordTelemetry(makeTelemetry({ tick: 0, position: { x: 1, y: 1 } }));
      for (const snap of makeStuckTelemetry(100, 1)) {
        c.recordTelemetry(snap);
      }
      c.analyzeStream();
      const navEvents = c.getEvents().filter((e) => e.category === 'navigation');
      expect(navEvents.length).toBeGreaterThanOrEqual(1);
      expect(navEvents[0].severity).toBe('warning');
    });

    it('does not flag short pauses', () => {
      const c = new DiagnosticCollector();
      for (const snap of makeStuckTelemetry(50)) {
        c.recordTelemetry(snap);
      }
      c.analyzeStream();
      const navEvents = c.getEvents().filter((e) => e.category === 'navigation');
      expect(navEvents).toHaveLength(0);
    });
  });

  // ── Death loop detection ──────────────────────────────────────────────

  describe('analyzeStream — death loop detection', () => {
    it('detects 3+ deaths in same area', () => {
      const c = new DiagnosticCollector();
      c.recordTelemetry(makeTelemetry({ tick: 10, mapId: 'cave', position: { x: 5, y: 5 } }));
      for (let i = 0; i < 3; i++) {
        c.startCombat(`ENC-${i}`, 10 + i * 20);
        c.endCombat(`ENC-${i}`, 20 + i * 20, 'defeat');
      }
      c.analyzeStream();
      const deathEvents = c.getEvents().filter(
        (e) => e.category === 'combat-balance' && e.severity === 'critical',
      );
      expect(deathEvents.length).toBeGreaterThanOrEqual(1);
      expect(deathEvents[0].message).toContain('Death loop');
    });
  });

  // ── Quest softlock detection ──────────────────────────────────────────

  describe('analyzeStream — quest softlock detection', () => {
    it('detects quest stuck in active for 500+ ticks', () => {
      const c = new DiagnosticCollector();
      for (let tick = 0; tick < 600; tick++) {
        c.recordTelemetry(makeTelemetry({
          tick,
          position: { x: tick % 50, y: tick % 30 },
          questState: { 'MQ-01': 'active' },
        }));
      }
      c.analyzeStream();
      const questEvents = c.getEvents().filter((e) => e.category === 'quest-logic');
      expect(questEvents.length).toBeGreaterThanOrEqual(1);
      expect(questEvents[0].severity).toBe('critical');
    });

    it('does not flag quest that changes status', () => {
      const c = new DiagnosticCollector();
      for (let tick = 0; tick < 600; tick++) {
        const status = tick < 300 ? 'active' : 'completed';
        c.recordTelemetry(makeTelemetry({
          tick,
          position: { x: tick % 50, y: tick % 30 },
          questState: { 'MQ-01': status },
        }));
      }
      c.analyzeStream();
      const questEvents = c.getEvents().filter((e) => e.category === 'quest-logic');
      expect(questEvents).toHaveLength(0);
    });
  });

  // ── Transition stall detection ────────────────────────────────────────

  describe('analyzeStream — transition stall detection', () => {
    it('detects transition stuck in loading for 50+ ticks', () => {
      const c = new DiagnosticCollector();
      for (let tick = 0; tick < 60; tick++) {
        c.recordTelemetry(makeTelemetry({
          tick,
          action: 'loading',
          position: { x: tick, y: 0 },
        }));
      }
      c.analyzeStream();
      const transEvents = c.getEvents().filter((e) => e.category === 'world-transition');
      expect(transEvents.length).toBeGreaterThanOrEqual(1);
      expect(transEvents[0].severity).toBe('critical');
    });
  });

  // ── Vibrancy mismatch detection ───────────────────────────────────────

  describe('analyzeStream — vibrancy mismatch detection', () => {
    it('detects player in forgotten area without damage', () => {
      const c = new DiagnosticCollector();
      for (let tick = 0; tick < 25; tick++) {
        c.recordTelemetry(makeTelemetry({
          tick,
          action: 'move-forgotten',
          hp: 80,
          errors: ['vibrancy-warning'],
          position: { x: tick, y: 0 },
        }));
      }
      c.analyzeStream();
      const vibEvents = c.getEvents().filter((e) => e.category === 'vibrancy');
      expect(vibEvents.length).toBeGreaterThanOrEqual(1);
      expect(vibEvents[0].severity).toBe('warning');
    });
  });

  // ── Reset ─────────────────────────────────────────────────────────────

  describe('reset', () => {
    it('clears all collected data', () => {
      const c = new DiagnosticCollector();
      c.recordTelemetry(makeTelemetry());
      c.recordEvent({
        tick: 1,
        category: 'navigation',
        severity: 'info',
        message: 'test',
        details: {},
      });
      c.startCombat('ENC-01', 0);
      c.endCombat('ENC-01', 10, 'victory');
      c.reset();
      expect(c.getEvents()).toHaveLength(0);
      expect(c.getTelemetry()).toHaveLength(0);
      expect(c.getCombatLengths()).toHaveLength(0);
      expect(c.getDeathLocations().size).toBe(0);
    });
  });
});

