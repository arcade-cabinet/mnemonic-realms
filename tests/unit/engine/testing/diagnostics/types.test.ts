import { describe, expect, it } from 'vitest';
import type {
  DiagnosticCategory,
  DiagnosticEvent,
  DiagnosticReport,
  DiagnosticSeverity,
  PacingMetrics,
  PlaytestTelemetry,
} from '../../../../../engine/testing/diagnostics/types';

// ── Type Validation Tests ───────────────────────────────────────────────────

describe('Diagnostic types', () => {
  describe('DiagnosticEvent', () => {
    it('has all required fields', () => {
      const event: DiagnosticEvent = {
        timestamp: Date.now(),
        tick: 42,
        category: 'quest-logic',
        severity: 'critical',
        message: 'Quest softlock detected',
        details: { questId: 'MQ-01' },
      };

      expect(event.timestamp).toBeGreaterThan(0);
      expect(event.tick).toBe(42);
      expect(event.category).toBe('quest-logic');
      expect(event.severity).toBe('critical');
      expect(event.message).toBeTruthy();
      expect(event.details).toBeDefined();
    });

    it('supports optional location', () => {
      const event: DiagnosticEvent = {
        timestamp: Date.now(),
        tick: 10,
        category: 'navigation',
        severity: 'warning',
        message: 'Stuck',
        details: {},
        location: { mapId: 'everwick', x: 5, y: 10 },
      };

      expect(event.location).toBeDefined();
      expect(event.location!.mapId).toBe('everwick');
    });

    it('supports optional questId and encounterId', () => {
      const event: DiagnosticEvent = {
        timestamp: Date.now(),
        tick: 10,
        category: 'combat-balance',
        severity: 'info',
        message: 'Combat ended',
        details: {},
        questId: 'MQ-01',
        encounterId: 'ENC-01',
      };

      expect(event.questId).toBe('MQ-01');
      expect(event.encounterId).toBe('ENC-01');
    });
  });

  describe('PlaytestTelemetry', () => {
    it('has all required fields', () => {
      const telemetry: PlaytestTelemetry = {
        tick: 100,
        position: { x: 10, y: 20 },
        mapId: 'everwick',
        currentGoal: 'Find the elder',
        action: 'move',
        questState: { 'MQ-01': 'active' },
        hp: 80,
        maxHp: 100,
        inventory: ['potion'],
        errors: [],
      };

      expect(telemetry.tick).toBe(100);
      expect(telemetry.position.x).toBe(10);
      expect(telemetry.mapId).toBe('everwick');
      expect(telemetry.hp).toBeLessThanOrEqual(telemetry.maxHp);
    });
  });

  describe('DiagnosticSeverity', () => {
    it('covers all severity levels', () => {
      const severities: DiagnosticSeverity[] = ['critical', 'warning', 'info'];
      expect(severities).toHaveLength(3);
    });
  });

  describe('DiagnosticCategory', () => {
    it('covers all categories', () => {
      const categories: DiagnosticCategory[] = [
        'quest-logic',
        'navigation',
        'combat-balance',
        'dialogue',
        'world-transition',
        'vibrancy',
        'item-access',
        'pacing',
      ];
      expect(categories).toHaveLength(8);
    });
  });

  describe('PacingMetrics', () => {
    it('has all required fields', () => {
      const pacing: PacingMetrics = {
        totalTicks: 1000,
        ticksPerAct: { act1: 500, act2: 500 },
        ticksPerQuest: { 'MQ-01': 300 },
        ticksPerMap: { everwick: 600 },
        combatCount: 5,
        deathCount: 1,
        averageCombatLength: 20,
        longestCombatLength: 35,
      };

      expect(pacing.totalTicks).toBe(1000);
      expect(pacing.combatCount).toBe(5);
      expect(pacing.averageCombatLength).toBeLessThanOrEqual(pacing.longestCombatLength);
    });
  });

  describe('DiagnosticReport', () => {
    it('has all required fields', () => {
      const report: DiagnosticReport = {
        generatedAt: new Date().toISOString(),
        strategyUsed: 'completionist',
        totalEvents: 10,
        criticalCount: 2,
        warningCount: 3,
        infoCount: 5,
        events: [],
        pacing: {
          totalTicks: 500,
          ticksPerAct: {},
          ticksPerQuest: {},
          ticksPerMap: {},
          combatCount: 0,
          deathCount: 0,
          averageCombatLength: 0,
          longestCombatLength: 0,
        },
        questCompletion: {},
        worldsVisited: ['everwick'],
        encountersCompleted: [],
        summary: 'Clean run',
      };

      expect(report.criticalCount + report.warningCount + report.infoCount)
        .toBe(report.totalEvents);
      expect(report.generatedAt).toBeTruthy();
    });
  });
});

