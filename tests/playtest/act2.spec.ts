/**
 * Act 2 Playtest — MQ-05→MQ-07, SQ-06→SQ-13, GQ-01→GQ-04
 *
 * Tests AI player traversal through Act 2 quest chains.
 * Verifies frontier expansion, archive exploration, guild quests,
 * and quest dependency resolution.
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
  ACT2_ALL,
  ACT2_MAIN_QUESTS,
  ACT2_SIDE_QUESTS,
  ACT2_GUILD_QUESTS,
  MQ05,
  MQ06,
  MQ07,
  GQ01,
  GQ02,
  GQ03,
  GQ04,
  ALL_QUESTS,
} from './helpers/quest-chains.js';
import { createCollector, collectTelemetry } from './helpers/diagnostics.js';

registerCleanup();

/** Complete all Act 1 main quests as a prerequisite. */
function completeAct1(tracker: Record<string, import('../../engine/save/types.js').QuestState>) {
  let t = tracker;
  for (const quest of ACT1_MAIN_QUESTS) {
    t = startQuest(t, quest.questId, quest.objectives.length);
    for (const obj of quest.objectives) {
      t = advanceObjective(t, quest.questId, obj.index);
    }
    t = completeQuest(t, quest.questId);
  }
  return t;
}

describe('Act 2 — Beyond the Frontier', () => {
  describe('Main Quest Chain (MQ-05 → MQ-07)', () => {
    it('MQ-05 requires MQ-04 completion', () => {
      expect(MQ05.dependencies).toContain('MQ-04');
    });

    it('full Act 2 main quest chain completes after Act 1', () => {
      let tracker = completeAct1(createQuestTracker());

      for (const quest of ACT2_MAIN_QUESTS) {
        tracker = startQuest(tracker, quest.questId, quest.objectives.length);
        for (const obj of quest.objectives) {
          tracker = advanceObjective(tracker, quest.questId, obj.index);
        }
        tracker = completeQuest(tracker, quest.questId);
        expect(tracker[quest.questId].status).toBe('completed');
      }

      expect(tracker['MQ-05'].status).toBe('completed');
      expect(tracker['MQ-07'].status).toBe('completed');
    });

    it('AI player pursues MQ-05 with quest chains loaded', () => {
      const map = loadDefaultMap();
      const world = createTestWorld(2, 2);
      const config = buildConfig(world, map, completionistStrategy, ALL_QUESTS);
      const ai = new AIPlayer(config);

      let tracker = completeAct1(createQuestTracker());
      tracker = startQuest(tracker, 'MQ-05', MQ05.objectives.length);
      ai.setQuestTracker(tracker);

      runTicks(ai, 200);

      const log = ai.getTelemetryLog();
      const questActions = log.filter((t) => t.action.includes('quest'));
      expect(questActions.length).toBeGreaterThan(0);
    });
  });

  describe('Side Quests (SQ-06 → SQ-13)', () => {
    it('all Act 2 side quests depend on Act 2 main quests', () => {
      for (const sq of ACT2_SIDE_QUESTS) {
        expect(sq.dependencies.length).toBeGreaterThan(0);
        const depsMet = sq.dependencies.every(
          (d) => d.startsWith('MQ-05') || d.startsWith('MQ-06') || d.startsWith('MQ-07'),
        );
        expect(depsMet).toBe(true);
      }
    });

    it('all Act 2 side quests complete after prerequisites', () => {
      let tracker = completeAct1(createQuestTracker());
      // Complete MQ-05 and MQ-06 for side quest deps
      for (const quest of [MQ05, MQ06]) {
        tracker = startQuest(tracker, quest.questId, quest.objectives.length);
        for (const obj of quest.objectives) {
          tracker = advanceObjective(tracker, quest.questId, obj.index);
        }
        tracker = completeQuest(tracker, quest.questId);
      }

      for (const quest of ACT2_SIDE_QUESTS) {
        tracker = startQuest(tracker, quest.questId, quest.objectives.length);
        for (const obj of quest.objectives) {
          tracker = advanceObjective(tracker, quest.questId, obj.index);
        }
        tracker = completeQuest(tracker, quest.questId);
        expect(tracker[quest.questId].status).toBe('completed');
      }
    });
  });

  describe('Guild Quests (GQ-01 → GQ-04)', () => {
    it('GQ-01 depends on MQ-04', () => {
      expect(GQ01.dependencies).toContain('MQ-04');
    });

    it('GQ-04 depends on GQ-02 and GQ-03', () => {
      expect(GQ04.dependencies).toContain('GQ-02');
      expect(GQ04.dependencies).toContain('GQ-03');
    });

    it('full guild quest chain completes in order', () => {
      let tracker = completeAct1(createQuestTracker());

      for (const quest of ACT2_GUILD_QUESTS) {
        tracker = startQuest(tracker, quest.questId, quest.objectives.length);
        for (const obj of quest.objectives) {
          tracker = advanceObjective(tracker, quest.questId, obj.index);
        }
        tracker = completeQuest(tracker, quest.questId);
        expect(tracker[quest.questId].status).toBe('completed');
      }
    });
  });
});

