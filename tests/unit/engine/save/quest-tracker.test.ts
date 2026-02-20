import { describe, expect, it } from 'vitest';
import {
  advanceObjective,
  checkQuestAvailability,
  completeQuest,
  createQuestTracker,
  failQuest,
  getActiveQuests,
  getCompletedQuests,
  getQuestStatus,
  startQuest,
} from '../../../../engine/save/quest-tracker.js';

// ── createQuestTracker ──────────────────────────────────────────────────────

describe('createQuestTracker', () => {
  it('starts empty', () => {
    const tracker = createQuestTracker();
    expect(tracker).toEqual({});
    expect(Object.keys(tracker)).toHaveLength(0);
  });
});

// ── startQuest ──────────────────────────────────────────────────────────────

describe('startQuest', () => {
  it('adds a quest with correct objectives', () => {
    const tracker = startQuest(createQuestTracker(), 'MQ-01', 4);
    expect(tracker['MQ-01']).toBeDefined();
    expect(tracker['MQ-01'].questId).toBe('MQ-01');
    expect(tracker['MQ-01'].status).toBe('active');
    expect(tracker['MQ-01'].objectives).toHaveLength(4);
    expect(tracker['MQ-01'].objectives[0]).toEqual({ index: 0, completed: false });
    expect(tracker['MQ-01'].objectives[3]).toEqual({ index: 3, completed: false });
  });

  it('preserves existing quests', () => {
    let tracker = startQuest(createQuestTracker(), 'MQ-01', 3);
    tracker = startQuest(tracker, 'MQ-02', 2);
    expect(Object.keys(tracker)).toHaveLength(2);
    expect(tracker['MQ-01'].status).toBe('active');
    expect(tracker['MQ-02'].status).toBe('active');
  });

  it('returns new object (immutable)', () => {
    const original = createQuestTracker();
    const updated = startQuest(original, 'MQ-01', 2);
    expect(updated).not.toBe(original);
    expect(original).toEqual({});
  });
});

// ── advanceObjective ────────────────────────────────────────────────────────

describe('advanceObjective', () => {
  it('marks objective as completed', () => {
    let tracker = startQuest(createQuestTracker(), 'MQ-01', 3);
    tracker = advanceObjective(tracker, 'MQ-01', 0);
    expect(tracker['MQ-01'].objectives[0].completed).toBe(true);
    expect(tracker['MQ-01'].objectives[1].completed).toBe(false);
    expect(tracker['MQ-01'].objectives[2].completed).toBe(false);
  });

  it('does nothing for non-existent quest', () => {
    const tracker = createQuestTracker();
    const result = advanceObjective(tracker, 'MQ-99', 0);
    expect(result).toBe(tracker);
  });

  it('does nothing for completed quest', () => {
    let tracker = startQuest(createQuestTracker(), 'MQ-01', 2);
    tracker = completeQuest(tracker, 'MQ-01');
    const result = advanceObjective(tracker, 'MQ-01', 0);
    expect(result).toBe(tracker);
  });
});

// ── completeQuest ───────────────────────────────────────────────────────────

describe('completeQuest', () => {
  it('sets status to completed', () => {
    let tracker = startQuest(createQuestTracker(), 'MQ-01', 2);
    tracker = completeQuest(tracker, 'MQ-01');
    expect(tracker['MQ-01'].status).toBe('completed');
  });

  it('returns same tracker for non-existent quest', () => {
    const tracker = createQuestTracker();
    expect(completeQuest(tracker, 'MQ-99')).toBe(tracker);
  });
});

// ── failQuest ───────────────────────────────────────────────────────────────

describe('failQuest', () => {
  it('sets status to failed', () => {
    let tracker = startQuest(createQuestTracker(), 'MQ-01', 2);
    tracker = failQuest(tracker, 'MQ-01');
    expect(tracker['MQ-01'].status).toBe('failed');
  });
});

// ── getQuestStatus ──────────────────────────────────────────────────────────

describe('getQuestStatus', () => {
  it('returns not-started for unknown quest', () => {
    expect(getQuestStatus(createQuestTracker(), 'MQ-99')).toBe('not-started');
  });

  it('returns correct status for tracked quest', () => {
    let tracker = startQuest(createQuestTracker(), 'MQ-01', 2);
    expect(getQuestStatus(tracker, 'MQ-01')).toBe('active');
    tracker = completeQuest(tracker, 'MQ-01');
    expect(getQuestStatus(tracker, 'MQ-01')).toBe('completed');
  });
});

// ── getActiveQuests / getCompletedQuests ─────────────────────────────────────

describe('getActiveQuests', () => {
  it('returns only active quests', () => {
    let tracker = startQuest(createQuestTracker(), 'MQ-01', 2);
    tracker = startQuest(tracker, 'MQ-02', 3);
    tracker = completeQuest(tracker, 'MQ-01');
    const active = getActiveQuests(tracker);
    expect(active).toHaveLength(1);
    expect(active[0].questId).toBe('MQ-02');
  });
});

describe('getCompletedQuests', () => {
  it('returns only completed quests', () => {
    let tracker = startQuest(createQuestTracker(), 'MQ-01', 2);
    tracker = startQuest(tracker, 'MQ-02', 3);
    tracker = completeQuest(tracker, 'MQ-01');
    const completed = getCompletedQuests(tracker);
    expect(completed).toHaveLength(1);
    expect(completed[0].questId).toBe('MQ-01');
  });
});

// ── checkQuestAvailability ──────────────────────────────────────────────────

describe('checkQuestAvailability', () => {
  it('returns true when no dependencies', () => {
    expect(checkQuestAvailability(createQuestTracker(), { dependencies: [] })).toBe(true);
  });

  it('returns true when all dependencies are completed', () => {
    let tracker = startQuest(createQuestTracker(), 'MQ-01', 2);
    tracker = completeQuest(tracker, 'MQ-01');
    expect(checkQuestAvailability(tracker, { dependencies: ['MQ-01'] })).toBe(true);
  });

  it('returns false when dependencies are not completed', () => {
    const tracker = startQuest(createQuestTracker(), 'MQ-01', 2);
    expect(checkQuestAvailability(tracker, { dependencies: ['MQ-01'] })).toBe(false);
  });

  it('returns false when some dependencies are missing', () => {
    let tracker = startQuest(createQuestTracker(), 'MQ-01', 2);
    tracker = completeQuest(tracker, 'MQ-01');
    expect(checkQuestAvailability(tracker, { dependencies: ['MQ-01', 'MQ-02'] })).toBe(false);
  });
});

