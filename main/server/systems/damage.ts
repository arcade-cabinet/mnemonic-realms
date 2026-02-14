// ---------------------------------------------------------------------------
// Damage Formula & Element System
// US-004: Implements physical/magical damage, 7 elements, crits, variance.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Elements
// ---------------------------------------------------------------------------

export enum Element {
  Fire = 'fire',
  Water = 'water',
  Wind = 'wind',
  Earth = 'earth',
  Light = 'light',
  Dark = 'dark',
  Neutral = 'neutral',
}

const STRONG = 1.5;
const WEAK = 0.5;
const EVEN = 1.0;

/**
 * Element effectiveness: attackElement -> defenderElement -> multiplier.
 * Cycle: Fire > Wind > Earth > Water > Fire.
 * Dual opposition: Light <> Dark.
 * Neutral has no strengths or weaknesses.
 */
const EFFECTIVENESS: Record<Element, Record<Element, number>> = {
  [Element.Fire]: {
    [Element.Fire]: EVEN,
    [Element.Water]: WEAK,
    [Element.Wind]: STRONG,
    [Element.Earth]: EVEN,
    [Element.Light]: EVEN,
    [Element.Dark]: EVEN,
    [Element.Neutral]: EVEN,
  },
  [Element.Water]: {
    [Element.Fire]: STRONG,
    [Element.Water]: EVEN,
    [Element.Wind]: EVEN,
    [Element.Earth]: WEAK,
    [Element.Light]: EVEN,
    [Element.Dark]: EVEN,
    [Element.Neutral]: EVEN,
  },
  [Element.Wind]: {
    [Element.Fire]: WEAK,
    [Element.Water]: EVEN,
    [Element.Wind]: EVEN,
    [Element.Earth]: STRONG,
    [Element.Light]: EVEN,
    [Element.Dark]: EVEN,
    [Element.Neutral]: EVEN,
  },
  [Element.Earth]: {
    [Element.Fire]: EVEN,
    [Element.Water]: STRONG,
    [Element.Wind]: WEAK,
    [Element.Earth]: EVEN,
    [Element.Light]: EVEN,
    [Element.Dark]: EVEN,
    [Element.Neutral]: EVEN,
  },
  [Element.Light]: {
    [Element.Fire]: EVEN,
    [Element.Water]: EVEN,
    [Element.Wind]: EVEN,
    [Element.Earth]: EVEN,
    [Element.Light]: EVEN,
    [Element.Dark]: STRONG,
    [Element.Neutral]: EVEN,
  },
  [Element.Dark]: {
    [Element.Fire]: EVEN,
    [Element.Water]: EVEN,
    [Element.Wind]: EVEN,
    [Element.Earth]: EVEN,
    [Element.Light]: STRONG,
    [Element.Dark]: EVEN,
    [Element.Neutral]: EVEN,
  },
  [Element.Neutral]: {
    [Element.Fire]: EVEN,
    [Element.Water]: EVEN,
    [Element.Wind]: EVEN,
    [Element.Earth]: EVEN,
    [Element.Light]: EVEN,
    [Element.Dark]: EVEN,
    [Element.Neutral]: EVEN,
  },
};

export function getElementMultiplier(attack: Element, defender: Element): number {
  return EFFECTIVENESS[attack]?.[defender] ?? EVEN;
}

// ---------------------------------------------------------------------------
// Attacker / Defender interfaces
// ---------------------------------------------------------------------------

export interface Attacker {
  atk: number;
  int: number;
  agi: number;
}

export interface Defender {
  def: number;
  sdef?: number; // magical defense — defaults to def when absent
}

export interface SkillInfo {
  type: 'physical' | 'magical';
  power: number; // weapon_bonus (physical) or skill_power (magical), as percentage
}

// ---------------------------------------------------------------------------
// Core formulas
// ---------------------------------------------------------------------------

const VARIANCE_MIN = 0.85;
const VARIANCE_MAX = 1.15;
const CRIT_BASE = 0.05;
const CRIT_AGI_DIVISOR = 200;
const CRIT_MULTIPLIER = 1.5;
const DAMAGE_FLOOR = 1;

function rollVariance(): number {
  return VARIANCE_MIN + Math.random() * (VARIANCE_MAX - VARIANCE_MIN);
}

function rollCritical(agi: number): boolean {
  const critChance = CRIT_BASE + agi / CRIT_AGI_DIVISOR;
  return Math.random() < critChance;
}

/**
 * Physical: ATK * (1 + weapon_bonus/100) - DEF * 0.5
 */
function physicalBase(atk: number, def: number, weaponBonus: number): number {
  return atk * (1 + weaponBonus / 100) - def * 0.5;
}

/**
 * Magical: INT * (1 + skill_power/100) - SDEF * 0.5
 */
function magicalBase(int: number, sdef: number, skillPower: number): number {
  return int * (1 + skillPower / 100) - sdef * 0.5;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface DamageResult {
  damage: number;
  critical: boolean;
  elementMultiplier: number;
}

/**
 * Calculate damage from an attacker to a defender.
 *
 * @param attacker  - Source combatant stats (atk, int, agi)
 * @param defender  - Target combatant stats (def, sdef?)
 * @param skill     - Optional skill info. When absent, defaults to a basic physical attack
 *                    with 0 weapon bonus.
 * @param element   - Optional attack element (defaults to Neutral)
 * @param defenderElement - Optional defender element (defaults to Neutral)
 */
export function calculateDamage(
  attacker: Attacker,
  defender: Defender,
  skill?: SkillInfo,
  element?: Element,
  defenderElement?: Element,
): DamageResult {
  const type = skill?.type ?? 'physical';
  const power = skill?.power ?? 0;
  const atkElement = element ?? Element.Neutral;
  const defElement = defenderElement ?? Element.Neutral;

  // Base damage by type
  const base =
    type === 'physical'
      ? physicalBase(attacker.atk, defender.def, power)
      : magicalBase(attacker.int, defender.sdef ?? defender.def, power);

  // Variance
  const variance = rollVariance();

  // Element
  const elementMult = getElementMultiplier(atkElement, defElement);

  // Critical hit
  const isCrit = rollCritical(attacker.agi);
  const critMult = isCrit ? CRIT_MULTIPLIER : 1;

  // Final damage — floor of 1 ensures damage is never zero
  const raw = base * variance * elementMult * critMult;
  const damage = Math.max(DAMAGE_FLOOR, Math.floor(raw));

  return { damage, critical: isCrit, elementMultiplier: elementMult };
}
