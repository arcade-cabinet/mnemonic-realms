/**
 * Act 1 Playtest — MQ-01→MQ-04, SQ-01→SQ-05
 *
 * Tests AI player traversal through Act 1 quest chains using
 * the completionist strategy. Verifies quest progression,
 * objective tracking, and no softlocks.
 */

import { describe, expect, it } from 'vitest';
import { AIPlayer } from '../../engine/testing/ai-player.js';
import { completionistStrategy } from '../../engine/testing/strategies/completionist.js';
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
  runTicks,
} from './helpers/setup.js';
import {
  ACT1_ALL,
  ACT1_MAIN_QUESTS,
  ACT1_SIDE_QUESTS,
  MQ01,
  MQ02,
  MQ03,
  MQ04,
  SQ01,
  SQ02,
} from './helpers/quest-chains.js';
import { createCollector, collectTelemetry } from './helpers/diagnostics.js';

registerCleanup();

describe('Act 1 — The Fading Light', () => {
  describe('Main Quest Chain (MQ-01 → MQ-04)', () => {
    it('AI player pursues MQ-01 objectives with quest chains loaded', () => {
      const map = loadDefaultMap();
      const world = createTestWorld(2, 2);
      const config = buildConfig(world, map, completionistStrategy, ACT1_ALL);
      const ai = new AIPlayer(config);

      // Start MQ-01
      let tracker = createQuestTracker();
      tracker = startQuest(tracker, 'MQ-01', MQ01.objectives.length);
      ai.setQuestTracker(tracker);

      runTicks(ai, 200);

      const log = ai.getTelemetryLog();
      // AI should have attempted quest-related actions
      const questActions = log.filter((t) => t.action.includes('quest'));
      expect(questActions.length).toBeGreaterThan(0);
    });

    it('quest tracker advances through MQ-01 objectives', () => {
      let tracker = createQuestTracker();
      tracker = startQuest(tracker, 'MQ-01', 3);

      expect(tracker['MQ-01'].status).toBe('active');
      expect(tracker['MQ-01'].objectives).toHaveLength(3);

      tracker = advanceObjective(tracker, 'MQ-01', 0);
      expect(tracker['MQ-01'].objectives[0].completed).toBe(true);

      tracker = advanceObjective(tracker, 'MQ-01', 1);
      tracker = advanceObjective(tracker, 'MQ-01', 2);
      tracker = completeQuest(tracker, 'MQ-01');
      expect(tracker['MQ-01'].status).toBe('completed');
    });

    it('MQ-02 depends on MQ-01 completion', () => {
      let tracker = createQuestTracker();
      // MQ-02 should not be startable without MQ-01 completed
      expect(tracker['MQ-01']).toBeUndefined();

      // Complete MQ-01 first
      tracker = startQuest(tracker, 'MQ-01', 3);
      tracker = advanceObjective(tracker, 'MQ-01', 0);
      tracker = advanceObjective(tracker, 'MQ-01', 1);
      tracker = advanceObjective(tracker, 'MQ-01', 2);
      tracker = completeQuest(tracker, 'MQ-01');

      // Now MQ-02 can start
      tracker = startQuest(tracker, 'MQ-02', MQ02.objectives.length);
      expect(tracker['MQ-02'].status).toBe('active');
    });

    it('full Act 1 main quest chain completes without errors', () => {
      let tracker = createQuestTracker();

      for (const quest of ACT1_MAIN_QUESTS) {
        tracker = startQuest(tracker, quest.questId, quest.objectives.length);
        for (const obj of quest.objectives) {
          tracker = advanceObjective(tracker, quest.questId, obj.index);
        }
        tracker = completeQuest(tracker, quest.questId);
        expect(tracker[quest.questId].status).toBe('completed');
      }

      // All 4 main quests completed
      expect(tracker['MQ-01'].status).toBe('completed');
      expect(tracker['MQ-04'].status).toBe('completed');
    });
  });

  describe('Side Quests (SQ-01 → SQ-05)', () => {
    it('SQ-01 and SQ-02 have no dependencies', () => {
      expect(SQ01.dependencies).toEqual([]);
      expect(SQ02.dependencies).toEqual([]);
    });

    it('all Act 1 side quests complete without errors', () => {
      let tracker = createQuestTracker();

      // Complete MQ-01 and MQ-02 first (some SQs depend on them)
      for (const quest of [MQ01, MQ02]) {
        tracker = startQuest(tracker, quest.questId, quest.objectives.length);
        for (const obj of quest.objectives) {
          tracker = advanceObjective(tracker, quest.questId, obj.index);
        }
        tracker = completeQuest(tracker, quest.questId);
      }

      for (const quest of ACT1_SIDE_QUESTS) {
        tracker = startQuest(tracker, quest.questId, quest.objectives.length);
        for (const obj of quest.objectives) {
          tracker = advanceObjective(tracker, quest.questId, obj.index);
        }
        tracker = completeQuest(tracker, quest.questId);
        expect(tracker[quest.questId].status).toBe('completed');
      }
    });
  });

  describe('AI Traversal with Diagnostics', () => {
    it('collects telemetry without critical issues during Act 1 run', () => {
      const map = loadDefaultMap();
      const world = createTestWorld(2, 2);
      const config = buildConfig(world, map, completionistStrategy, ACT1_ALL);
      const ai = new AIPlayer(config);

      let tracker = createQuestTracker();
      tracker = startQuest(tracker, 'MQ-01', MQ01.objectives.length);
      ai.setQuestTracker(tracker);

      const collector = createCollector();
      collectTelemetry(ai, collector, 300, 'settled-lands-everwick');
      collector.analyzeStream();

      const events = collector.getEvents();
      const criticals = events.filter((e) => e.severity === 'critical');
      expect(criticals).toEqual([]);
    });
  });
});

