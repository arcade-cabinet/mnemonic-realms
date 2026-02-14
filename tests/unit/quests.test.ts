import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  startQuest,
  advanceObjective,
  completeQuest,
  failQuest,
  getQuestStatus,
  getObjectiveProgress,
  isQuestActive,
  isQuestComplete,
  isQuestFailed,
  getActiveQuests,
  getCompletedQuests,
  getQuestsByCategory,
  getQuestDef,
} from '../../main/server/systems/quests';

// ---------------------------------------------------------------------------
// Mock dependent modules
// ---------------------------------------------------------------------------

vi.mock('../../main/server/systems/inventory', () => ({
  addGold: vi.fn(),
  addItem: vi.fn(),
}));

vi.mock('../../main/server/systems/progression', () => ({
  addXP: vi.fn(),
}));

import { addGold, addItem } from '../../main/server/systems/inventory';
import { addXP } from '../../main/server/systems/progression';

// ---------------------------------------------------------------------------
// Mock RpgPlayer
// ---------------------------------------------------------------------------

function createMockPlayer(vars: Record<string, unknown> = {}) {
  const store = new Map<string, unknown>(Object.entries(vars));
  return {
    getVariable: vi.fn((key: string) => store.get(key)),
    setVariable: vi.fn((key: string, value: unknown) => store.set(key, value)),
    emit: vi.fn(),
    hp: 100,
    sp: 50,
    param: { maxHp: 100, maxSp: 50 },
    position: { x: 0, y: 0 },
  } as unknown as import('@rpgjs/server').RpgPlayer;
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Quest state machine: inactive -> active -> completed
// ---------------------------------------------------------------------------

describe('quest state machine', () => {
  it('transitions from inactive to active to completed', () => {
    const player = createMockPlayer();

    // Starts inactive
    expect(getQuestStatus(player, 'MQ-01')).toBe('inactive');
    expect(isQuestActive(player, 'MQ-01')).toBe(false);
    expect(isQuestComplete(player, 'MQ-01')).toBe(false);

    // Start quest
    const started = startQuest(player, 'MQ-01');
    expect(started).toBe(true);
    expect(getQuestStatus(player, 'MQ-01')).toBe('active');
    expect(isQuestActive(player, 'MQ-01')).toBe(true);

    // Complete quest
    const completed = completeQuest(player, 'MQ-01');
    expect(completed).toBe(true);
    expect(getQuestStatus(player, 'MQ-01')).toBe('completed');
    expect(isQuestComplete(player, 'MQ-01')).toBe(true);
    expect(isQuestActive(player, 'MQ-01')).toBe(false);
  });

  it('transitions from inactive to active to failed', () => {
    const player = createMockPlayer();

    expect(getQuestStatus(player, 'SQ-01')).toBe('inactive');

    startQuest(player, 'SQ-01');
    expect(getQuestStatus(player, 'SQ-01')).toBe('active');

    const failed = failQuest(player, 'SQ-01');
    expect(failed).toBe(true);
    expect(getQuestStatus(player, 'SQ-01')).toBe('failed');
    expect(isQuestFailed(player, 'SQ-01')).toBe(true);
    expect(isQuestActive(player, 'SQ-01')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Cannot start already-active quest
// ---------------------------------------------------------------------------

describe('startQuest guards', () => {
  it('cannot start an already-active quest', () => {
    const player = createMockPlayer();
    startQuest(player, 'MQ-01');
    const second = startQuest(player, 'MQ-01');
    expect(second).toBe(false);
  });

  it('cannot start a completed quest', () => {
    const player = createMockPlayer();
    startQuest(player, 'MQ-01');
    completeQuest(player, 'MQ-01');
    const restart = startQuest(player, 'MQ-01');
    expect(restart).toBe(false);
  });

  it('cannot start a failed quest', () => {
    const player = createMockPlayer();
    startQuest(player, 'SQ-01');
    failQuest(player, 'SQ-01');
    const restart = startQuest(player, 'SQ-01');
    expect(restart).toBe(false);
  });

  it('returns false for unknown quest ID', () => {
    const player = createMockPlayer();
    const result = startQuest(player, 'NONEXISTENT');
    expect(result).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Cannot complete inactive quest
// ---------------------------------------------------------------------------

describe('completeQuest guards', () => {
  it('cannot complete an inactive quest', () => {
    const player = createMockPlayer();
    const result = completeQuest(player, 'MQ-01');
    expect(result).toBe(false);
  });

  it('cannot complete a failed quest', () => {
    const player = createMockPlayer();
    startQuest(player, 'SQ-01');
    failQuest(player, 'SQ-01');
    const result = completeQuest(player, 'SQ-01');
    expect(result).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// failQuest guards
// ---------------------------------------------------------------------------

describe('failQuest guards', () => {
  it('cannot fail an inactive quest', () => {
    const player = createMockPlayer();
    const result = failQuest(player, 'MQ-01');
    expect(result).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// advanceObjective
// ---------------------------------------------------------------------------

describe('advanceObjective', () => {
  it('increments objective progress correctly', () => {
    const player = createMockPlayer();
    startQuest(player, 'MQ-01'); // objectiveCount: 4

    expect(getObjectiveProgress(player, 'MQ-01')).toBe(0);

    const first = advanceObjective(player, 'MQ-01');
    expect(first).toBe(1);
    expect(getObjectiveProgress(player, 'MQ-01')).toBe(1);

    const second = advanceObjective(player, 'MQ-01');
    expect(second).toBe(2);
    expect(getObjectiveProgress(player, 'MQ-01')).toBe(2);
  });

  it('caps at objectiveCount', () => {
    const player = createMockPlayer();
    startQuest(player, 'SQ-09'); // objectiveCount: 3

    // Advance to the max
    advanceObjective(player, 'SQ-09'); // 1
    advanceObjective(player, 'SQ-09'); // 2
    advanceObjective(player, 'SQ-09'); // 3

    expect(getObjectiveProgress(player, 'SQ-09')).toBe(3);

    // Try to advance past the cap
    const capped = advanceObjective(player, 'SQ-09');
    expect(capped).toBe(3); // Returns current value, does not increment
    expect(getObjectiveProgress(player, 'SQ-09')).toBe(3);
  });

  it('returns -1 for inactive quest', () => {
    const player = createMockPlayer();
    const result = advanceObjective(player, 'MQ-01');
    expect(result).toBe(-1);
  });

  it('returns -1 for unknown quest ID', () => {
    const player = createMockPlayer();
    const result = advanceObjective(player, 'NONEXISTENT');
    expect(result).toBe(-1);
  });
});

// ---------------------------------------------------------------------------
// completeQuest distributes rewards
// ---------------------------------------------------------------------------

describe('completeQuest rewards', () => {
  it('distributes gold reward', () => {
    const player = createMockPlayer();
    startQuest(player, 'MQ-01'); // rewards: { gold: 50 }
    completeQuest(player, 'MQ-01');

    expect(addGold).toHaveBeenCalledWith(player, 50);
  });

  it('distributes item rewards', () => {
    const player = createMockPlayer();
    // SQ-01: rewards: { gold: 120, items: [{ id: 'C-HP-01', qty: 5 }, { id: 'C-SP-01', qty: 3 }] }
    startQuest(player, 'SQ-01');
    completeQuest(player, 'SQ-01');

    expect(addGold).toHaveBeenCalledWith(player, 120);
    expect(addItem).toHaveBeenCalledWith(player, 'C-HP-01', 5);
    expect(addItem).toHaveBeenCalledWith(player, 'C-SP-01', 3);
  });

  it('does not distribute rewards for quests with empty rewards', () => {
    const player = createMockPlayer();
    // MQ-10: rewards: {} (empty)
    startQuest(player, 'MQ-10');
    completeQuest(player, 'MQ-10');

    expect(addGold).not.toHaveBeenCalled();
    expect(addItem).not.toHaveBeenCalled();
    expect(addXP).not.toHaveBeenCalled();
  });

  it('increments QUEST_COMPLETE_COUNT on completion', () => {
    const player = createMockPlayer();
    startQuest(player, 'MQ-01');
    completeQuest(player, 'MQ-01');

    // Check that QUEST_COMPLETE_COUNT was incremented
    const store = new Map<string, unknown>();
    for (const call of (player.setVariable as ReturnType<typeof vi.fn>).mock.calls) {
      store.set(call[0] as string, call[1]);
    }
    // It reads current count (0) and sets to 1
    expect(store.get('QUEST_COMPLETE_COUNT')).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// getActiveQuests / getCompletedQuests
// ---------------------------------------------------------------------------

describe('getActiveQuests', () => {
  it('returns only active quests', () => {
    const player = createMockPlayer();
    startQuest(player, 'MQ-01');
    startQuest(player, 'SQ-01');

    const active = getActiveQuests(player);
    expect(active).toHaveLength(2);
    expect(active.map((q) => q.id)).toContain('MQ-01');
    expect(active.map((q) => q.id)).toContain('SQ-01');
  });

  it('does not include completed or failed quests', () => {
    const player = createMockPlayer();
    startQuest(player, 'MQ-01');
    startQuest(player, 'SQ-01');
    startQuest(player, 'SQ-02');

    completeQuest(player, 'MQ-01');
    failQuest(player, 'SQ-02');

    const active = getActiveQuests(player);
    expect(active).toHaveLength(1);
    expect(active[0].id).toBe('SQ-01');
  });

  it('returns empty array when no quests are active', () => {
    const player = createMockPlayer();
    const active = getActiveQuests(player);
    expect(active).toEqual([]);
  });
});

describe('getCompletedQuests', () => {
  it('returns only completed quests', () => {
    const player = createMockPlayer();
    startQuest(player, 'MQ-01');
    startQuest(player, 'SQ-01');
    completeQuest(player, 'MQ-01');

    const completed = getCompletedQuests(player);
    expect(completed).toHaveLength(1);
    expect(completed[0].id).toBe('MQ-01');
  });
});

// ---------------------------------------------------------------------------
// getQuestsByCategory
// ---------------------------------------------------------------------------

describe('getQuestsByCategory', () => {
  it('filters main quests correctly', () => {
    const mainQuests = getQuestsByCategory('main');
    expect(mainQuests.length).toBe(10);
    expect(mainQuests.every((q) => q.category === 'main')).toBe(true);
  });

  it('filters god-recall quests correctly', () => {
    const godRecall = getQuestsByCategory('god-recall');
    expect(godRecall.length).toBe(4);
    expect(godRecall.every((q) => q.category === 'god-recall')).toBe(true);
    expect(godRecall.map((q) => q.id)).toEqual(['GQ-01', 'GQ-02', 'GQ-03', 'GQ-04']);
  });

  it('filters side quests correctly', () => {
    const sideQuests = getQuestsByCategory('side');
    expect(sideQuests.length).toBe(14);
    expect(sideQuests.every((q) => q.category === 'side')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// HUD sync — ACTIVE_QUEST_NAME and ACTIVE_QUEST_OBJ
// ---------------------------------------------------------------------------

describe('HUD sync', () => {
  it('updates ACTIVE_QUEST_NAME and ACTIVE_QUEST_OBJ on quest start', () => {
    const player = createMockPlayer();
    startQuest(player, 'MQ-01');

    // Check the setVariable calls for HUD variables
    const setCalls = (player.setVariable as ReturnType<typeof vi.fn>).mock.calls;
    const hudNameCall = setCalls.find((c) => c[0] === 'ACTIVE_QUEST_NAME');
    const hudObjCall = setCalls.find((c) => c[0] === 'ACTIVE_QUEST_OBJ');

    expect(hudNameCall).toBeDefined();
    expect(hudNameCall![1]).toBe("The Architect's Awakening");
    expect(hudObjCall).toBeDefined();
    expect(hudObjCall![1]).toBe('0/4');
  });

  it('updates HUD objective after advanceObjective', () => {
    const player = createMockPlayer();
    startQuest(player, 'MQ-01');
    advanceObjective(player, 'MQ-01');

    // Find the most recent ACTIVE_QUEST_OBJ call
    const setCalls = (player.setVariable as ReturnType<typeof vi.fn>).mock.calls;
    const hudObjCalls = setCalls.filter((c) => c[0] === 'ACTIVE_QUEST_OBJ');
    const lastObjCall = hudObjCalls[hudObjCalls.length - 1];

    expect(lastObjCall![1]).toBe('1/4');
  });

  it('prioritizes main quest over side quest in HUD', () => {
    const player = createMockPlayer();
    startQuest(player, 'SQ-01'); // side quest first
    startQuest(player, 'MQ-02'); // main quest second

    // HUD should show the main quest (higher priority)
    const setCalls = (player.setVariable as ReturnType<typeof vi.fn>).mock.calls;
    const hudNameCalls = setCalls.filter((c) => c[0] === 'ACTIVE_QUEST_NAME');
    const lastNameCall = hudNameCalls[hudNameCalls.length - 1];

    expect(lastNameCall![1]).toBe('First Broadcast'); // MQ-02's name
  });

  it('clears HUD when all quests are completed', () => {
    const player = createMockPlayer();
    startQuest(player, 'MQ-01');
    completeQuest(player, 'MQ-01');

    const setCalls = (player.setVariable as ReturnType<typeof vi.fn>).mock.calls;
    const hudNameCalls = setCalls.filter((c) => c[0] === 'ACTIVE_QUEST_NAME');
    const lastNameCall = hudNameCalls[hudNameCalls.length - 1];

    expect(lastNameCall![1]).toBe('');
  });
});

// ---------------------------------------------------------------------------
// Quest definition lookups
// ---------------------------------------------------------------------------

describe('getQuestDef', () => {
  it('returns quest definition for valid ID', () => {
    const def = getQuestDef('MQ-01');
    expect(def).toBeDefined();
    expect(def!.name).toBe("The Architect's Awakening");
    expect(def!.category).toBe('main');
    expect(def!.objectiveCount).toBe(4);
  });

  it('returns undefined for unknown ID', () => {
    expect(getQuestDef('NONEXISTENT')).toBeUndefined();
  });
});
