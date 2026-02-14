import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateDamage,
  getElementMultiplier,
  Element,
  type Attacker,
  type Defender,
  type SkillInfo,
} from '../../main/server/systems/damage';

// ---------------------------------------------------------------------------
// Element Multiplier
// ---------------------------------------------------------------------------

describe('getElementMultiplier', () => {
  it('returns 1.5 for strong matchups', () => {
    expect(getElementMultiplier(Element.Resonance, Element.Kinesis)).toBe(1.5);
    expect(getElementMultiplier(Element.Verdance, Element.Resonance)).toBe(1.5);
    expect(getElementMultiplier(Element.Kinesis, Element.Verdance)).toBe(1.5);
    expect(getElementMultiplier(Element.Luminos, Element.Dark)).toBe(1.5);
    expect(getElementMultiplier(Element.Dark, Element.Luminos)).toBe(1.5);
  });

  it('returns 0.5 for weak matchups', () => {
    expect(getElementMultiplier(Element.Resonance, Element.Verdance)).toBe(0.5);
    expect(getElementMultiplier(Element.Verdance, Element.Kinesis)).toBe(0.5);
    expect(getElementMultiplier(Element.Kinesis, Element.Resonance)).toBe(0.5);
  });

  it('returns 1.0 for neutral matchups', () => {
    expect(getElementMultiplier(Element.Neutral, Element.Neutral)).toBe(1.0);
    expect(getElementMultiplier(Element.Resonance, Element.Resonance)).toBe(1.0);
    expect(getElementMultiplier(Element.Neutral, Element.Dark)).toBe(1.0);
  });
});

// ---------------------------------------------------------------------------
// calculateDamage
// ---------------------------------------------------------------------------

describe('calculateDamage', () => {
  let randomSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Pin Math.random: first call = variance (0.5 -> mid-range), second = crit roll
    randomSpy = vi.spyOn(Math, 'random');
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  const attacker: Attacker = { atk: 20, int: 15, agi: 10 };
  const defender: Defender = { def: 10, sdef: 8 };

  it('computes basic physical damage (no skill, no element)', () => {
    // variance = 0.85 + 0.5 * 0.30 = 1.0, crit = 0.99 (no crit)
    randomSpy.mockReturnValueOnce(0.5).mockReturnValueOnce(0.99);

    const result = calculateDamage(attacker, defender);

    // physical base: 20 * (1 + 0/100) - 10 * 0.5 = 20 - 5 = 15
    // variance = 1.0, element = 1.0, no crit = 1.0
    // raw = 15 * 1.0 * 1.0 * 1.0 = 15
    expect(result.damage).toBe(15);
    expect(result.critical).toBe(false);
    expect(result.elementMultiplier).toBe(1.0);
  });

  it('computes physical damage with weapon bonus', () => {
    randomSpy.mockReturnValueOnce(0.5).mockReturnValueOnce(0.99);

    const skill: SkillInfo = { type: 'physical', power: 50 };
    const result = calculateDamage(attacker, defender, skill);

    // base: 20 * (1 + 50/100) - 10 * 0.5 = 30 - 5 = 25
    expect(result.damage).toBe(25);
  });

  it('computes magical damage using INT and SDEF', () => {
    randomSpy.mockReturnValueOnce(0.5).mockReturnValueOnce(0.99);

    const skill: SkillInfo = { type: 'magical', power: 100 };
    const result = calculateDamage(attacker, defender, skill);

    // base: 15 * (1 + 100/100) - 8 * 0.5 = 30 - 4 = 26
    expect(result.damage).toBe(26);
  });

  it('falls back to def when sdef is absent for magical', () => {
    randomSpy.mockReturnValueOnce(0.5).mockReturnValueOnce(0.99);

    const defenderNoSdef: Defender = { def: 10 };
    const skill: SkillInfo = { type: 'magical', power: 100 };
    const result = calculateDamage(attacker, defenderNoSdef, skill);

    // base: 15 * 2 - 10 * 0.5 = 30 - 5 = 25
    expect(result.damage).toBe(25);
  });

  it('applies element multiplier for strong matchup', () => {
    randomSpy.mockReturnValueOnce(0.5).mockReturnValueOnce(0.99);

    const result = calculateDamage(
      attacker,
      defender,
      undefined,
      Element.Luminos,
      Element.Dark,
    );

    // base = 15, element = 1.5 -> 15 * 1.0 * 1.5 * 1.0 = 22.5 -> floor = 22
    expect(result.damage).toBe(22);
    expect(result.elementMultiplier).toBe(1.5);
  });

  it('applies element multiplier for weak matchup', () => {
    randomSpy.mockReturnValueOnce(0.5).mockReturnValueOnce(0.99);

    const result = calculateDamage(
      attacker,
      defender,
      undefined,
      Element.Resonance,
      Element.Verdance,
    );

    // base = 15, element = 0.5 -> 15 * 0.5 = 7.5 -> floor = 7
    expect(result.damage).toBe(7);
    expect(result.elementMultiplier).toBe(0.5);
  });

  it('applies critical hit multiplier', () => {
    // variance mid, then crit roll = 0.0 (always crits since critChance > 0)
    randomSpy.mockReturnValueOnce(0.5).mockReturnValueOnce(0.0);

    const result = calculateDamage(attacker, defender);

    // base = 15, crit = 1.5 -> 15 * 1.5 = 22.5 -> floor = 22
    expect(result.damage).toBe(22);
    expect(result.critical).toBe(true);
  });

  it('applies variance correctly at min range', () => {
    // random = 0.0 -> variance = 0.85
    randomSpy.mockReturnValueOnce(0.0).mockReturnValueOnce(0.99);

    const result = calculateDamage(attacker, defender);

    // base = 15, variance = 0.85 -> 15 * 0.85 = 12.75 -> floor = 12
    expect(result.damage).toBe(12);
  });

  it('applies variance correctly at max range', () => {
    // random = 1.0 -> variance = 1.15
    randomSpy.mockReturnValueOnce(1.0).mockReturnValueOnce(0.99);

    const result = calculateDamage(attacker, defender);

    // base = 15, variance = 1.15 -> 15 * 1.15 = 17.25 -> floor = 17
    expect(result.damage).toBe(17);
  });

  it('floors damage to at least 1 when base is very low', () => {
    randomSpy.mockReturnValueOnce(0.5).mockReturnValueOnce(0.99);

    const weakAttacker: Attacker = { atk: 1, int: 1, agi: 1 };
    const strongDefender: Defender = { def: 100 };
    const result = calculateDamage(weakAttacker, strongDefender);

    // base: 1 * 1 - 100 * 0.5 = -49. Raw is negative -> max(1, floor(-49)) = 1
    expect(result.damage).toBe(1);
  });

  it('combines all modifiers: skill + element + crit + variance', () => {
    // variance = 0.85 + 0.5 * 0.30 = 1.0, crit hits
    randomSpy.mockReturnValueOnce(0.5).mockReturnValueOnce(0.0);

    const skill: SkillInfo = { type: 'physical', power: 50 };
    const result = calculateDamage(
      attacker,
      defender,
      skill,
      Element.Resonance,
      Element.Kinesis,
    );

    // base: 20 * 1.5 - 10 * 0.5 = 25
    // element: 1.5, crit: 1.5, variance: 1.0
    // raw: 25 * 1.0 * 1.5 * 1.5 = 56.25 -> floor = 56
    expect(result.damage).toBe(56);
    expect(result.critical).toBe(true);
    expect(result.elementMultiplier).toBe(1.5);
  });
});
