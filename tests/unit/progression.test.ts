import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the skills module so progression.ts doesn't pull in real DDL skill JSON
vi.mock('../../main/server/systems/skills', () => ({
  checkSkillUnlocks: vi.fn(() => []),
}));

import { xpForLevel, addXP, initProgression, getProgression, xpToNextLevel } from '../../main/server/systems/progression';
import { checkSkillUnlocks } from '../../main/server/systems/skills';

// ---------------------------------------------------------------------------
// Mock RpgPlayer
// ---------------------------------------------------------------------------

function createMockPlayer(vars: Record<string, unknown> = {}) {
  const store = new Map<string, unknown>(Object.entries(vars));
  return {
    getVariable: vi.fn((key: string) => store.get(key)),
    setVariable: vi.fn((key: string, value: unknown) => store.set(key, value)),
    emit: vi.fn(),
  } as unknown as import('@rpgjs/server').RpgPlayer;
}

// ---------------------------------------------------------------------------
// xpForLevel (pure function)
// ---------------------------------------------------------------------------

describe('xpForLevel', () => {
  it('returns 0 for level 1', () => {
    expect(xpForLevel(1)).toBe(0);
  });

  it('returns 0 for level <= 0', () => {
    expect(xpForLevel(0)).toBe(0);
    expect(xpForLevel(-1)).toBe(0);
  });

  it('follows quadratic curve: floor(50 * (level-1) * level)', () => {
    expect(xpForLevel(2)).toBe(100); // 50 * 1 * 2
    expect(xpForLevel(3)).toBe(300); // 50 * 2 * 3
    expect(xpForLevel(5)).toBe(1000); // 50 * 4 * 5
    expect(xpForLevel(10)).toBe(4500); // 50 * 9 * 10
  });

  it('calculates max level XP', () => {
    expect(xpForLevel(35)).toBe(59500); // 50 * 34 * 35
  });
});

// ---------------------------------------------------------------------------
// initProgression
// ---------------------------------------------------------------------------

describe('initProgression', () => {
  beforeEach(() => {
    vi.mocked(checkSkillUnlocks).mockClear();
  });

  it('sets level 1 and 0 XP when class is set', () => {
    const player = createMockPlayer({ PLAYER_CLASS_ID: 'knight' });
    initProgression(player);

    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_LEVEL', 1);
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_XP', 0);
  });

  it('applies stat growth for knight at level 1', () => {
    const player = createMockPlayer({ PLAYER_CLASS_ID: 'knight' });
    initProgression(player);

    // Knight level 1 stats: floor(base + growthRate * 0) = base
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_HP', 45);
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_ATK', 12);
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_DEF', 10);
  });

  it('calls checkSkillUnlocks after init', () => {
    const player = createMockPlayer({ PLAYER_CLASS_ID: 'knight' });
    initProgression(player);
    expect(checkSkillUnlocks).toHaveBeenCalledWith(player);
  });

  it('does nothing when class is not set', () => {
    const player = createMockPlayer();
    initProgression(player);
    expect(player.setVariable).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// addXP / level-up
// ---------------------------------------------------------------------------

describe('addXP', () => {
  beforeEach(() => {
    vi.mocked(checkSkillUnlocks).mockClear();
  });

  it('returns 0 when no class is set', () => {
    const player = createMockPlayer({ PLAYER_LEVEL: 1, PLAYER_XP: 0 });
    expect(addXP(player, 100)).toBe(0);
  });

  it('adds XP without leveling up', () => {
    const player = createMockPlayer({
      PLAYER_CLASS_ID: 'knight',
      PLAYER_LEVEL: 1,
      PLAYER_XP: 0,
    });
    // Need 100 XP for level 2; add only 50
    const levelsGained = addXP(player, 50);
    expect(levelsGained).toBe(0);
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_XP', 50);
  });

  it('levels up when XP threshold is met', () => {
    const player = createMockPlayer({
      PLAYER_CLASS_ID: 'knight',
      PLAYER_LEVEL: 1,
      PLAYER_XP: 0,
    });
    // xpForLevel(2) = 100
    const levelsGained = addXP(player, 100);
    expect(levelsGained).toBe(1);
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_LEVEL', 2);
  });

  it('handles multi-level-up', () => {
    const player = createMockPlayer({
      PLAYER_CLASS_ID: 'knight',
      PLAYER_LEVEL: 1,
      PLAYER_XP: 0,
    });
    // xpForLevel(2) = 100, xpForLevel(3) = 300, xpForLevel(4) = 600
    // Adding 500 -> should reach level 3 (need 300) but not 4 (need 600)
    const levelsGained = addXP(player, 500);
    expect(levelsGained).toBe(2);
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_LEVEL', 3);
  });

  it('applies stat growth on level-up', () => {
    const player = createMockPlayer({
      PLAYER_CLASS_ID: 'knight',
      PLAYER_LEVEL: 1,
      PLAYER_XP: 0,
    });
    addXP(player, 100); // -> level 2

    // Knight level 2 HP: floor(45 + 14.5 * 1) = 59
    expect(player.setVariable).toHaveBeenCalledWith('PLAYER_HP', 59);
  });

  it('calls checkSkillUnlocks on level-up', () => {
    const player = createMockPlayer({
      PLAYER_CLASS_ID: 'knight',
      PLAYER_LEVEL: 1,
      PLAYER_XP: 0,
    });
    addXP(player, 100);
    expect(checkSkillUnlocks).toHaveBeenCalled();
  });

  it('does not exceed max level (35)', () => {
    const player = createMockPlayer({
      PLAYER_CLASS_ID: 'knight',
      PLAYER_LEVEL: 35,
      PLAYER_XP: 99999,
    });
    const levelsGained = addXP(player, 10000);
    expect(levelsGained).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getProgression
// ---------------------------------------------------------------------------

describe('getProgression', () => {
  it('returns current stats from player variables', () => {
    const player = createMockPlayer({
      PLAYER_LEVEL: 5,
      PLAYER_XP: 800,
      PLAYER_HP: 100,
      PLAYER_SP: 30,
      PLAYER_ATK: 25,
      PLAYER_INT: 10,
      PLAYER_DEF: 20,
      PLAYER_AGI: 15,
    });
    const prog = getProgression(player);
    expect(prog).toEqual({
      level: 5,
      xp: 800,
      hp: 100,
      sp: 30,
      atk: 25,
      int: 10,
      def: 20,
      agi: 15,
    });
  });

  it('defaults to zero/1 for missing variables', () => {
    const player = createMockPlayer();
    const prog = getProgression(player);
    expect(prog.level).toBe(1);
    expect(prog.xp).toBe(0);
    expect(prog.hp).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// xpToNextLevel
// ---------------------------------------------------------------------------

describe('xpToNextLevel', () => {
  it('returns XP remaining to next level', () => {
    const player = createMockPlayer({ PLAYER_LEVEL: 1, PLAYER_XP: 30 });
    // Next level (2) needs 100, have 30 -> 70 remaining
    expect(xpToNextLevel(player)).toBe(70);
  });

  it('returns 0 at max level', () => {
    const player = createMockPlayer({ PLAYER_LEVEL: 35, PLAYER_XP: 99999 });
    expect(xpToNextLevel(player)).toBe(0);
  });
});
