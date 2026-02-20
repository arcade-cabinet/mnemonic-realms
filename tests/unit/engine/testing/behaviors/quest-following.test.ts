import { describe, expect, it } from 'vitest';
import {
  getNextQuestObjective,
  getAvailableQuests,
} from '../../../../../engine/testing/behaviors/quest-following.js';
import type { QuestChain } from '../../../../../engine/testing/behaviors/quest-following.js';
import { createQuestTracker, startQuest, advanceObjective, completeQuest } from '../../../../../engine/save/quest-tracker.js';

const MQ01: QuestChain = {
  questId: 'MQ-01',
  name: 'The First Memory',
  dependencies: [],
  isMainQuest: true,
  objectives: [
    { index: 0, description: 'Talk to Artun', targetX: 5, targetY: 5, targetMap: 'everwick', actionType: 'interact' },
    { index: 1, description: 'Visit Memorial Garden', targetX: 10, targetY: 10, targetMap: 'everwick', actionType: 'reach' },
  ],
};

const SQ01: QuestChain = {
  questId: 'SQ-01',
  name: 'Lost Trinket',
  dependencies: ['MQ-01'],
  isMainQuest: false,
  objectives: [
    { index: 0, description: 'Find the trinket', targetX: 3, targetY: 7, targetMap: 'heartfield', actionType: 'collect' },
  ],
};

const MQ02: QuestChain = {
  questId: 'MQ-02',
  name: 'Memory Operations',
  dependencies: ['MQ-01'],
  isMainQuest: true,
  objectives: [
    { index: 0, description: 'Learn collect', targetX: 8, targetY: 8, targetMap: 'everwick', actionType: 'interact' },
  ],
};

const chains = [MQ01, SQ01, MQ02];

describe('getNextQuestObjective', () => {
  it('returns first objective of first available quest when none started', () => {
    const tracker = createQuestTracker();
    const result = getNextQuestObjective(tracker, chains, true);
    expect(result).not.toBeNull();
    expect(result!.questId).toBe('MQ-01');
    expect(result!.objectiveIndex).toBe(0);
  });

  it('returns next incomplete objective for active quest', () => {
    let tracker = createQuestTracker();
    tracker = startQuest(tracker, 'MQ-01', 2);
    tracker = advanceObjective(tracker, 'MQ-01', 0);

    const result = getNextQuestObjective(tracker, chains, true);
    expect(result).not.toBeNull();
    expect(result!.questId).toBe('MQ-01');
    expect(result!.objectiveIndex).toBe(1);
  });

  it('returns available quest after completing dependency', () => {
    let tracker = createQuestTracker();
    tracker = startQuest(tracker, 'MQ-01', 2);
    tracker = completeQuest(tracker, 'MQ-01');

    const result = getNextQuestObjective(tracker, chains, true);
    expect(result).not.toBeNull();
    // MQ-02 should be preferred over SQ-01 when preferMainQuest=true
    expect(result!.questId).toBe('MQ-02');
  });

  it('returns side quest when preferMainQuest is false and main quest done', () => {
    let tracker = createQuestTracker();
    tracker = startQuest(tracker, 'MQ-01', 2);
    tracker = completeQuest(tracker, 'MQ-01');

    const result = getNextQuestObjective(tracker, chains, false);
    expect(result).not.toBeNull();
    // Without preference, order depends on array order — SQ-01 comes before MQ-02
    expect(['SQ-01', 'MQ-02']).toContain(result!.questId);
  });

  it('returns null when all quests completed', () => {
    let tracker = createQuestTracker();
    tracker = startQuest(tracker, 'MQ-01', 2);
    tracker = completeQuest(tracker, 'MQ-01');
    tracker = startQuest(tracker, 'MQ-02', 1);
    tracker = completeQuest(tracker, 'MQ-02');
    tracker = startQuest(tracker, 'SQ-01', 1);
    tracker = completeQuest(tracker, 'SQ-01');

    const result = getNextQuestObjective(tracker, chains, true);
    expect(result).toBeNull();
  });

  it('returns null when no quests available (dependencies not met)', () => {
    const tracker = createQuestTracker();
    // Only SQ-01 and MQ-02 which depend on MQ-01
    const result = getNextQuestObjective(tracker, [SQ01, MQ02], true);
    expect(result).toBeNull();
  });
});

describe('getAvailableQuests', () => {
  it('returns quests with no dependencies', () => {
    const tracker = createQuestTracker();
    const available = getAvailableQuests(tracker, chains);
    expect(available).toHaveLength(1);
    expect(available[0].questId).toBe('MQ-01');
  });

  it('returns quests whose dependencies are completed', () => {
    let tracker = createQuestTracker();
    tracker = startQuest(tracker, 'MQ-01', 2);
    tracker = completeQuest(tracker, 'MQ-01');

    const available = getAvailableQuests(tracker, chains);
    expect(available).toHaveLength(2); // SQ-01 and MQ-02
  });

  it('excludes already started quests', () => {
    let tracker = createQuestTracker();
    tracker = startQuest(tracker, 'MQ-01', 2);

    const available = getAvailableQuests(tracker, chains);
    expect(available).toHaveLength(0);
  });
});

