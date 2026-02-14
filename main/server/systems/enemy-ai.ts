import type { Attacker } from './damage';
import { calculateDamage } from './damage';
import type { ActiveEffect } from './skills-runtime';
import { getEffectStatModifier } from './skills-runtime';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AIBehavior = 'aggressive' | 'defensive' | 'magical' | 'random';

export interface EnemyAbility {
  name: string;
  formula: string;
  effect: string;
}

export interface EnemyAIProfile {
  id: string;
  behavior: AIBehavior;
  abilities: EnemyAbility[];
}

export interface AIAction {
  type: 'attack' | 'defend' | 'skill';
  abilityIndex?: number;
  message: string;
}

export interface EnemyCombatant {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  atk: number;
  int: number;
  def: number;
  agi: number;
  effects: ActiveEffect[];
}

// ---------------------------------------------------------------------------
// Enemy AI Profile Registry
// ---------------------------------------------------------------------------

const AI_PROFILES: Record<string, EnemyAIProfile> = {
  // Heartfield
  'E-SL-01': {
    id: 'E-SL-01',
    behavior: 'random',
    abilities: [{ name: 'Pollen Puff', formula: 'ATK * 1.0', effect: 'basic_attack' }],
  },
  'E-SL-02': {
    id: 'E-SL-02',
    behavior: 'aggressive',
    abilities: [
      { name: 'Lunge', formula: 'ATK * 1.2', effect: 'first_turn_bonus' },
      { name: 'Coil', formula: 'DEF +30%', effect: 'self_def_buff' },
    ],
  },
  // Ambergrove
  'E-SL-03': {
    id: 'E-SL-03',
    behavior: 'magical',
    abilities: [
      { name: 'Wisp Bolt', formula: 'INT * 1.5', effect: 'magic_attack' },
      { name: 'Flicker', formula: 'dodge 30%', effect: 'evasion_buff' },
    ],
  },
  'E-SL-04': {
    id: 'E-SL-04',
    behavior: 'defensive',
    abilities: [
      { name: 'Mandible Crush', formula: 'ATK * 1.3', effect: 'basic_attack' },
      { name: 'Thorn Shell', formula: 'recoil 15%', effect: 'passive_recoil' },
    ],
  },
  // Millbrook
  'E-SL-05': {
    id: 'E-SL-05',
    behavior: 'magical',
    abilities: [
      { name: 'Water Jet', formula: 'INT * 1.6', effect: 'magic_attack' },
      { name: 'Splash Guard', formula: 'fire resist 50%', effect: 'party_shield' },
    ],
  },
  'E-SL-06': {
    id: 'E-SL-06',
    behavior: 'defensive',
    abilities: [
      { name: 'Pincer Snap', formula: 'ATK * 1.4', effect: 'basic_attack' },
      { name: 'Shell Hunker', formula: 'DEF +50%', effect: 'self_def_buff' },
    ],
  },
  // Sunridge
  'E-SL-07': {
    id: 'E-SL-07',
    behavior: 'aggressive',
    abilities: [
      { name: 'Dive Strike', formula: 'ATK * 1.5', effect: 'first_turn_bonus' },
      { name: 'Evasive Climb', formula: 'untargetable 1 turn', effect: 'evasion_buff' },
    ],
  },
  'E-SL-08': {
    id: 'E-SL-08',
    behavior: 'aggressive',
    abilities: [
      { name: 'Stone Fist', formula: 'ATK * 1.5', effect: 'basic_attack' },
      { name: 'Quake Stomp', formula: 'ATK * 0.8 AE', effect: 'aoe_attack' },
    ],
  },
};

export function getAIProfile(enemyId: string): EnemyAIProfile | undefined {
  return AI_PROFILES[enemyId];
}

// ---------------------------------------------------------------------------
// AI Decision Logic
// ---------------------------------------------------------------------------

/**
 * Select an AI action for an enemy based on its behavior pattern,
 * current HP, available abilities, and combat round.
 *
 * Decision tree per behavior:
 *
 * - **aggressive**: Uses strongest attack. If HP < 30% and has a defensive
 *   buff, use it once. On first turn, uses first-turn-bonus ability if available.
 *
 * - **defensive**: Attacks normally. Below 50% HP, uses defensive buff if
 *   available. Prefers basic_attack abilities.
 *
 * - **magical**: Uses magic_attack ability. Falls back to basic attack if
 *   magic isn't available.
 *
 * - **random**: Picks a random non-passive ability each turn.
 */
export function selectEnemyAction(enemy: EnemyCombatant, round: number): AIAction {
  const profile = AI_PROFILES[enemy.id];
  if (!profile) {
    return { type: 'attack', message: `${enemy.name} attacks!` };
  }

  const hpRatio = enemy.hp / enemy.maxHp;
  const abilities = profile.abilities.filter((a) => a.effect !== 'passive_recoil');

  switch (profile.behavior) {
    case 'aggressive':
      return selectAggressive(enemy, abilities, hpRatio, round);
    case 'defensive':
      return selectDefensive(enemy, abilities, hpRatio);
    case 'magical':
      return selectMagical(enemy, abilities);
    case 'random':
      return selectRandom(enemy, abilities);
  }
}

// ---------------------------------------------------------------------------
// Per-behavior selection
// ---------------------------------------------------------------------------

function selectAggressive(
  enemy: EnemyCombatant,
  abilities: EnemyAbility[],
  hpRatio: number,
  round: number,
): AIAction {
  // If HP < 30% and has a defensive buff, use it (one-time panic reaction)
  if (hpRatio < 0.3) {
    const defBuff = abilities.find((a) => a.effect === 'self_def_buff');
    if (defBuff) {
      return {
        type: 'defend',
        abilityIndex: abilities.indexOf(defBuff),
        message: `${enemy.name} uses ${defBuff.name}!`,
      };
    }
  }

  // First round: use first-turn-bonus ability if available
  if (round === 1) {
    const firstTurn = abilities.find((a) => a.effect === 'first_turn_bonus');
    if (firstTurn) {
      return {
        type: 'skill',
        abilityIndex: abilities.indexOf(firstTurn),
        message: `${enemy.name} uses ${firstTurn.name}!`,
      };
    }
  }

  // Every 3rd round: use AoE attack if available
  if (round % 3 === 0) {
    const aoe = abilities.find((a) => a.effect === 'aoe_attack');
    if (aoe) {
      return {
        type: 'skill',
        abilityIndex: abilities.indexOf(aoe),
        message: `${enemy.name} uses ${aoe.name}!`,
      };
    }
  }

  // Every 3rd round: use evasion buff if available
  if (round % 3 === 0) {
    const evasion = abilities.find((a) => a.effect === 'evasion_buff');
    if (evasion) {
      return {
        type: 'defend',
        abilityIndex: abilities.indexOf(evasion),
        message: `${enemy.name} uses ${evasion.name}!`,
      };
    }
  }

  // Default: strongest attack (highest ATK multiplier)
  return { type: 'attack', message: `${enemy.name} attacks!` };
}

function selectDefensive(
  enemy: EnemyCombatant,
  abilities: EnemyAbility[],
  hpRatio: number,
): AIAction {
  // Below 50% HP: use defensive buff if available
  if (hpRatio < 0.5) {
    const defBuff = abilities.find((a) => a.effect === 'self_def_buff');
    if (defBuff) {
      return {
        type: 'defend',
        abilityIndex: abilities.indexOf(defBuff),
        message: `${enemy.name} uses ${defBuff.name}!`,
      };
    }
  }

  // Default: basic attack
  return { type: 'attack', message: `${enemy.name} attacks!` };
}

function selectMagical(enemy: EnemyCombatant, abilities: EnemyAbility[]): AIAction {
  // Prefer magic attack
  const magic = abilities.find((a) => a.effect === 'magic_attack');
  if (magic) {
    return {
      type: 'skill',
      abilityIndex: abilities.indexOf(magic),
      message: `${enemy.name} uses ${magic.name}!`,
    };
  }

  // Fallback to basic attack
  return { type: 'attack', message: `${enemy.name} attacks!` };
}

function selectRandom(enemy: EnemyCombatant, abilities: EnemyAbility[]): AIAction {
  if (abilities.length === 0) {
    return { type: 'attack', message: `${enemy.name} attacks!` };
  }
  const idx = Math.floor(Math.random() * abilities.length);
  const ability = abilities[idx];

  if (ability.effect === 'self_def_buff' || ability.effect === 'evasion_buff') {
    return { type: 'defend', abilityIndex: idx, message: `${enemy.name} uses ${ability.name}!` };
  }
  return { type: 'attack', abilityIndex: idx, message: `${enemy.name} uses ${ability.name}!` };
}

// ---------------------------------------------------------------------------
// AI Damage Resolution
// ---------------------------------------------------------------------------

/**
 * Calculate damage for an AI-selected ability. Parses the ability's formula
 * to determine the multiplier and stat used.
 */
export function resolveAIDamage(
  enemy: EnemyCombatant,
  action: AIAction,
  playerDef: number,
): { damage: number; critical: boolean } {
  const profile = AI_PROFILES[enemy.id];
  const ability =
    profile && action.abilityIndex !== undefined
      ? profile.abilities.filter((a) => a.effect !== 'passive_recoil')[action.abilityIndex]
      : undefined;

  // Parse multiplier from ability formula (e.g., "ATK * 1.5" or "INT * 1.6")
  let multiplier = 1.0;
  let useMagic = false;

  if (ability) {
    const match = ability.formula.match(/(ATK|INT)\s*\*\s*(\d+\.?\d*)/i);
    if (match) {
      useMagic = match[1].toUpperCase() === 'INT';
      multiplier = Number.parseFloat(match[2]);
    }
  }

  const atkMod = 1 + getEffectStatModifier(enemy.effects, 'atk');
  const intMod = 1 + getEffectStatModifier(enemy.effects, 'int');

  const effectiveAtk = Math.floor(enemy.atk * atkMod * multiplier);
  const effectiveInt = Math.floor(enemy.int * intMod * multiplier);

  const attacker: Attacker = {
    atk: useMagic ? enemy.atk : effectiveAtk,
    int: useMagic ? effectiveInt : enemy.int,
    agi: Math.floor(enemy.agi * (1 + getEffectStatModifier(enemy.effects, 'agi'))),
  };

  const result = calculateDamage(attacker, { def: playerDef });
  return { damage: result.damage, critical: result.critical };
}
