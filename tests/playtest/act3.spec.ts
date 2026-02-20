/**
 * Act 3 Playtest — MQ-08→MQ-10, SQ-14, Endgame Bloom
 *
 * Tests AI player traversal through Act 3 quest chains.
 * Verifies the Forgotten Core, convergence, final bloom,
 * and endgame quest completion.
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
  ACT1_MAIN_QUESTS,
  ACT2_MAIN_QUESTS,
  ACT3_ALL,
  ACT3_MAIN_QUESTS,
  ACT3_SIDE_QUESTS,
  MQ08,
  MQ09,
  MQ10,
  SQ14,
  ALL_QUESTS,
} from './helpers/quest-chains.js';
import { createCollector, collectTelemetry } from './helpers/diagnostics.js';

registerCleanup();

/** Complete all Act 1 + Act 2 main quests as prerequisites. */
function completeActs1And2(
  tracker: Record<string, import('../../engine/save/types.js').QuestState>,
) {
  let t = tracker;
  for (const quest of [...ACT1_MAIN_QUESTS, ...ACT2_MAIN_QUESTS]) {
    t = startQuest(t, quest.questId, quest.objectives.length);
    for (const obj of quest.objectives) {
      t = advanceObjective(t, quest.questId, obj.index);
    }
    t = completeQuest(t, quest.questId);
  }
  return t;
}

describe('Act 3 — The Forgotten Core', () => {
  describe('Main Quest Chain (MQ-08 → MQ-10)', () => {
    it('MQ-08 requires MQ-07 completion', () => {
      expect(MQ08.dependencies).toContain('MQ-07');
    });

    it('MQ-10 is the final quest', () => {
      expect(MQ10.questId).toBe('MQ-10');
      expect(MQ10.name).toBe('The Final Bloom');
      expect(MQ10.objectives[0].actionType).toBe('broadcast');
    });

    it('full Act 3 main quest chain completes after Acts 1+2', () => {
      let tracker = completeActs1And2(createQuestTracker());

      for (const quest of ACT3_MAIN_QUESTS) {
        tracker = startQuest(tracker, quest.questId, quest.objectives.length);
        for (const obj of quest.objectives) {
          tracker = advanceObjective(tracker, quest.questId, obj.index);
        }
        tracker = completeQuest(tracker, quest.questId);
        expect(tracker[quest.questId].status).toBe('completed');
      }

      expect(tracker['MQ-10'].status).toBe('completed');
    });

    it('AI player pursues MQ-08 with quest chains loaded', () => {
      const map = loadDefaultMap();
      const world = createTestWorld(2, 2);
      const config = buildConfig(world, map, completionistStrategy, ALL_QUESTS);
      const ai = new AIPlayer(config);

      let tracker = completeActs1And2(createQuestTracker());
      tracker = startQuest(tracker, 'MQ-08', MQ08.objectives.length);
      ai.setQuestTracker(tracker);

      runTicks(ai, 200);

      const log = ai.getTelemetryLog();
      const questActions = log.filter((t) => t.action.includes('quest'));
      expect(questActions.length).toBeGreaterThan(0);
    });
  });

  describe('Side Quest (SQ-14)', () => {
    it('SQ-14 depends on MQ-08', () => {
      expect(SQ14.dependencies).toContain('MQ-08');
    });

    it('SQ-14 completes after MQ-08', () => {
      let tracker = completeActs1And2(createQuestTracker());
      tracker = startQuest(tracker, 'MQ-08', MQ08.objectives.length);
      for (const obj of MQ08.objectives) {
        tracker = advanceObjective(tracker, 'MQ-08', obj.index);
      }
      tracker = completeQuest(tracker, 'MQ-08');

      tracker = startQuest(tracker, 'SQ-14', SQ14.objectives.length);
      for (const obj of SQ14.objectives) {
        tracker = advanceObjective(tracker, 'SQ-14', obj.index);
      }
      tracker = completeQuest(tracker, 'SQ-14');
      expect(tracker['SQ-14'].status).toBe('completed');
    });
  });

  describe('Endgame Bloom', () => {
    it('all 10 main quests complete in sequence', () => {
      let tracker = createQuestTracker();

      for (const quest of [...ACT1_MAIN_QUESTS, ...ACT2_MAIN_QUESTS, ...ACT3_MAIN_QUESTS]) {
        tracker = startQuest(tracker, quest.questId, quest.objectives.length);
        for (const obj of quest.objectives) {
          tracker = advanceObjective(tracker, quest.questId, obj.index);
        }
        tracker = completeQuest(tracker, quest.questId);
      }

      // Verify all 10 main quests completed
      for (let i = 1; i <= 10; i++) {
        const id = `MQ-${String(i).padStart(2, '0')}`;
        expect(tracker[id].status).toBe('completed');
      }
    });

    it('diagnostics show no critical issues during Act 3 AI run', () => {
      const map = loadDefaultMap();
      const world = createTestWorld(2, 2);
      const config = buildConfig(world, map, completionistStrategy, ACT3_ALL);
      const ai = new AIPlayer(config);

      let tracker = completeActs1And2(createQuestTracker());
      tracker = startQuest(tracker, 'MQ-08', MQ08.objectives.length);
      ai.setQuestTracker(tracker);

      const collector = createCollector();
      collectTelemetry(ai, collector, 300, 'forgotten-core');
      collector.analyzeStream();

      const events = collector.getEvents();
      const criticals = events.filter((e) => e.severity === 'critical');
      expect(criticals).toEqual([]);
    });
  });
});

