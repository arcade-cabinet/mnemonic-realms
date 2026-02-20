import { describe, expect, it } from 'vitest';
import { validateStrategy } from '../../../../../engine/testing/strategies/types.js';
import { completionistStrategy } from '../../../../../engine/testing/strategies/completionist.js';
import { speedrunStrategy } from '../../../../../engine/testing/strategies/speedrun.js';
import { sideQuestFocusStrategy } from '../../../../../engine/testing/strategies/side-quest-focus.js';
import type { PlaythroughStrategy } from '../../../../../engine/testing/strategies/types.js';

describe('validateStrategy', () => {
  it('validates completionist strategy', () => {
    const errors = validateStrategy(completionistStrategy);
    expect(errors).toEqual([]);
  });

  it('validates speedrun strategy', () => {
    const errors = validateStrategy(speedrunStrategy);
    expect(errors).toEqual([]);
  });

  it('validates side-quest-focus strategy', () => {
    const errors = validateStrategy(sideQuestFocusStrategy);
    expect(errors).toEqual([]);
  });

  it('rejects empty id', () => {
    const bad: PlaythroughStrategy = {
      ...completionistStrategy,
      id: '',
    };
    const errors = validateStrategy(bad);
    expect(errors).toContain('Strategy id must be a non-empty string');
  });

  it('rejects empty name', () => {
    const bad: PlaythroughStrategy = {
      ...completionistStrategy,
      name: '  ',
    };
    const errors = validateStrategy(bad);
    expect(errors).toContain('Strategy name must be a non-empty string');
  });

  it('rejects invalid combat style', () => {
    const bad: PlaythroughStrategy = {
      ...completionistStrategy,
      combatStyle: 'berserker' as any,
    };
    const errors = validateStrategy(bad);
    expect(errors.some((e) => e.includes('combatStyle'))).toBe(true);
  });

  it('rejects non-positive maxTicksPerArea', () => {
    const bad: PlaythroughStrategy = {
      ...completionistStrategy,
      maxTicksPerArea: 0,
    };
    const errors = validateStrategy(bad);
    expect(errors).toContain('maxTicksPerArea must be a positive number');
  });

  it('rejects negative maxTicksPerArea', () => {
    const bad: PlaythroughStrategy = {
      ...completionistStrategy,
      maxTicksPerArea: -10,
    };
    const errors = validateStrategy(bad);
    expect(errors).toContain('maxTicksPerArea must be a positive number');
  });
});

describe('strategy properties', () => {
  it('completionist explores all areas and does side quests', () => {
    expect(completionistStrategy.exploreAllAreas).toBe(true);
    expect(completionistStrategy.completeSideQuests).toBe(true);
    expect(completionistStrategy.prioritizeMainQuest).toBe(false);
  });

  it('speedrun prioritizes main quest and skips side content', () => {
    expect(speedrunStrategy.prioritizeMainQuest).toBe(true);
    expect(speedrunStrategy.completeSideQuests).toBe(false);
    expect(speedrunStrategy.exploreAllAreas).toBe(false);
    expect(speedrunStrategy.combatStyle).toBe('aggressive');
  });

  it('side-quest-focus does side quests with defensive combat', () => {
    expect(sideQuestFocusStrategy.completeSideQuests).toBe(true);
    expect(sideQuestFocusStrategy.combatStyle).toBe('defensive');
    expect(sideQuestFocusStrategy.prioritizeMainQuest).toBe(false);
  });
});

