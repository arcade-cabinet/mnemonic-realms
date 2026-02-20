/**
 * Full Report Playtest — Completionist Run with Diagnostics
 *
 * Runs a full completionist AI playthrough, generates a DiagnosticReport,
 * and verifies the report structure, markdown output, and JSON output.
 */

import { describe, expect, it } from 'vitest';
import { AIPlayer } from '../../engine/testing/ai-player.js';
import { completionistStrategy } from '../../engine/testing/strategies/completionist.js';
import { speedrunStrategy } from '../../engine/testing/strategies/speedrun.js';
import {
  createQuestTracker,
  startQuest,
  advanceObjective,
  completeQuest,
} from '../../engine/save/quest-tracker.js';
import {
  createTestWorld,
  buildConfig,
  loadDefaultMap,
  registerCleanup,
} from './helpers/setup.js';
import {
  createCollector,
  createReporter,
  collectTelemetry,
} from './helpers/diagnostics.js';
import { ALL_QUESTS, MQ01 } from './helpers/quest-chains.js';

registerCleanup();

describe('Full Diagnostic Report', () => {
  it('generates a complete DiagnosticReport from completionist run', () => {
    const map = loadDefaultMap();
    const world = createTestWorld(2, 2);
    const config = buildConfig(world, map, completionistStrategy, ALL_QUESTS);
    const ai = new AIPlayer(config);

    let tracker = createQuestTracker();
    tracker = startQuest(tracker, 'MQ-01', MQ01.objectives.length);
    ai.setQuestTracker(tracker);

    const collector = createCollector();
    collectTelemetry(ai, collector, 500, 'settled-lands-everwick');
    collector.analyzeStream();

    const reporter = createReporter();
    const report = reporter.generateReport(collector, 'completionist');

    // Report structure
    expect(report).toBeDefined();
    expect(report.strategyUsed).toBe('completionist');
    expect(report.pacing.totalTicks).toBeGreaterThanOrEqual(0);
    expect(report.events).toBeDefined();
    expect(Array.isArray(report.events)).toBe(true);
  });

  it('report contains pacing metrics', () => {
    const map = loadDefaultMap();
    const world = createTestWorld(2, 2);
    const config = buildConfig(world, map, completionistStrategy, ALL_QUESTS);
    const ai = new AIPlayer(config);

    const collector = createCollector();
    collectTelemetry(ai, collector, 300, 'settled-lands-everwick');
    collector.analyzeStream();

    const reporter = createReporter();
    const report = reporter.generateReport(collector, 'completionist');

    expect(report.pacing).toBeDefined();
    expect(typeof report.pacing.averageCombatLength).toBe('number');
    expect(typeof report.pacing.totalTicks).toBe('number');
  });

  it('report formats to markdown', () => {
    const map = loadDefaultMap();
    const world = createTestWorld(2, 2);
    const config = buildConfig(world, map, completionistStrategy);
    const ai = new AIPlayer(config);

    const collector = createCollector();
    collectTelemetry(ai, collector, 100, 'test-map');
    collector.analyzeStream();

    const reporter = createReporter();
    const report = reporter.generateReport(collector, 'completionist');
    const markdown = reporter.formatMarkdown(report);

    expect(typeof markdown).toBe('string');
    expect(markdown.length).toBeGreaterThan(0);
    expect(markdown).toContain('completionist');
  });

  it('report formats to JSON', () => {
    const map = loadDefaultMap();
    const world = createTestWorld(2, 2);
    const config = buildConfig(world, map, speedrunStrategy);
    const ai = new AIPlayer(config);

    const collector = createCollector();
    collectTelemetry(ai, collector, 100, 'test-map');
    collector.analyzeStream();

    const reporter = createReporter();
    const report = reporter.generateReport(collector, 'speedrun');
    const json = reporter.formatJSON(report);

    expect(typeof json).toBe('string');
    const parsed = JSON.parse(json);
    expect(parsed.strategyUsed).toBe('speedrun');
    expect(parsed.pacing.totalTicks).toBeGreaterThanOrEqual(0);
  });

  it('collector tracks combat events', () => {
    const collector = createCollector();

    collector.startCombat('ENC-01', 10);
    collector.endCombat('ENC-01', 25, 'victory');

    const combatLengths = collector.getCombatLengths();
    expect(combatLengths).toBeDefined();
    expect(combatLengths).toHaveLength(1);
    expect(combatLengths[0]).toBe(15);
  });

  it('collector tracks death locations', () => {
    const collector = createCollector();

    collector.recordEvent({
      tick: 42,
      category: 'combat-balance',
      severity: 'warning',
      message: 'Player died at wolf den',
      details: { mapId: 'settled-lands-everwick', x: 5, y: 3 },
      location: { mapId: 'settled-lands-everwick', x: 5, y: 3 },
    });

    const deaths = collector.getDeathLocations();
    expect(deaths).toBeDefined();
  });

  it('no critical issues in 500-tick completionist run', () => {
    const map = loadDefaultMap();
    const world = createTestWorld(2, 2);
    const config = buildConfig(world, map, completionistStrategy, ALL_QUESTS);
    const ai = new AIPlayer(config);

    let tracker = createQuestTracker();
    tracker = startQuest(tracker, 'MQ-01', MQ01.objectives.length);
    ai.setQuestTracker(tracker);

    const collector = createCollector();
    collectTelemetry(ai, collector, 500, 'settled-lands-everwick');
    collector.analyzeStream();

    const events = collector.getEvents();
    const criticals = events.filter((e) => e.severity === 'critical');
    expect(criticals).toEqual([]);
  });
});

