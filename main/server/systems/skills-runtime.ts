import type { RpgPlayer } from '@rpgjs/server';

import statusEffectsData from '../../../gen/ddl/status-effects/all.json';
import type { SkillInfo } from './damage';
import { calculateDamage, Element } from './damage';
import { getEquipBonuses } from './inventory';
import type { SkillDef } from './skills';
import { getSkillDef, hasSkill } from './skills';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ActiveEffect {
  effectId: string;
  turnsRemaining: number;
}

export interface SkillExecutionResult {
  success: boolean;
  skillName: string;
  targetName?: string;
  message: string;
  damage?: number;
  healing?: number;
}

export interface TickResult {
  messages: string[];
  stunned: boolean;
}

/** Minimal enemy interface for skill targeting (compatible with EnemyInstance). */
export interface CombatEnemy {
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
// Status Effect DDL
// ---------------------------------------------------------------------------

interface StatusEffectDef {
  id: string;
  name: string;
  effect: string;
  duration: number;
  stackable: boolean;
}

const STATUS_EFFECTS = statusEffectsData as StatusEffectDef[];
const effectById = new Map<string, StatusEffectDef>(STATUS_EFFECTS.map((e) => [e.id, e]));

// ---------------------------------------------------------------------------
// Effect Helpers
// ---------------------------------------------------------------------------

export function applyEffect(effects: ActiveEffect[], effectId: string, duration: number): void {
  const def = effectById.get(effectId);
  if (def && !def.stackable) {
    const idx = effects.findIndex((e) => e.effectId === effectId);
    if (idx >= 0) {
      effects[idx].turnsRemaining = duration;
      return;
    }
  }
  effects.push({ effectId, turnsRemaining: duration });
}

export function hasEffect(effects: ActiveEffect[], effectId: string): boolean {
  return effects.some((e) => e.effectId === effectId);
}

export function getEffectName(effectId: string): string {
  return effectById.get(effectId)?.name ?? effectId;
}

// ---------------------------------------------------------------------------
// Status Effect Ticking
// ---------------------------------------------------------------------------

export function tickPlayerEffects(player: RpgPlayer, effects: ActiveEffect[]): TickResult {
  const messages: string[] = [];
  let stunned = false;

  for (let i = effects.length - 1; i >= 0; i--) {
    const effect = effects[i];
    const def = effectById.get(effect.effectId);
    if (!def) continue;

    switch (effect.effectId) {
      case 'ST-POISON': {
        const damage = Math.max(1, Math.floor(player.param.maxHp * 0.05));
        player.hp = Math.max(0, player.hp - damage);
        messages.push(`Poison deals ${damage} damage to Player.`);
        break;
      }
      case 'ST-REGEN': {
        const before = player.hp;
        const heal = Math.max(1, Math.floor(player.param.maxHp * 0.05));
        player.hp = Math.min(player.hp + heal, player.param.maxHp);
        messages.push(`Regen heals Player for ${player.hp - before} HP.`);
        break;
      }
      case 'ST-STUN': {
        stunned = true;
        messages.push('Player is stunned and cannot act!');
        break;
      }
    }

    effect.turnsRemaining--;
    if (effect.turnsRemaining <= 0) {
      messages.push(`${def.name} wore off.`);
      effects.splice(i, 1);
    }
  }

  return { messages, stunned };
}

export function tickEnemyEffects(enemy: CombatEnemy): TickResult {
  const messages: string[] = [];
  let stunned = false;

  for (let i = enemy.effects.length - 1; i >= 0; i--) {
    const effect = enemy.effects[i];
    const def = effectById.get(effect.effectId);
    if (!def) continue;

    switch (effect.effectId) {
      case 'ST-POISON': {
        const damage = Math.max(1, Math.floor(enemy.maxHp * 0.05));
        enemy.hp = Math.max(0, enemy.hp - damage);
        messages.push(`Poison deals ${damage} damage to ${enemy.name}.`);
        break;
      }
      case 'ST-REGEN': {
        const heal = Math.max(1, Math.floor(enemy.maxHp * 0.05));
        enemy.hp = Math.min(enemy.hp + heal, enemy.maxHp);
        messages.push(`Regen heals ${enemy.name} for ${heal} HP.`);
        break;
      }
      case 'ST-STUN': {
        stunned = true;
        messages.push(`${enemy.name} is stunned and cannot act!`);
        break;
      }
    }

    effect.turnsRemaining--;
    if (effect.turnsRemaining <= 0) {
      messages.push(`${def.name} wore off from ${enemy.name}.`);
      enemy.effects.splice(i, 1);
    }
  }

  return { messages, stunned };
}

// ---------------------------------------------------------------------------
// Stat Modifiers from Active Effects
// ---------------------------------------------------------------------------

export function getEffectStatModifier(
  effects: ActiveEffect[],
  stat: 'atk' | 'def' | 'int' | 'agi',
): number {
  let modifier = 0;
  for (const effect of effects) {
    switch (effect.effectId) {
      case 'ST-WEAKNESS':
        if (stat === 'def') modifier -= 0.3;
        break;
      case 'ST-SLOW':
        if (stat === 'agi') modifier -= 0.5;
        break;
      case 'ST-INSPIRED':
        modifier += 0.2;
        break;
      case 'ST-VOW-STEEL':
        if (stat === 'def') modifier += 0.4;
        break;
    }
  }
  return modifier;
}

// ---------------------------------------------------------------------------
// Skill Classification Helpers
// ---------------------------------------------------------------------------

/** Map of skill IDs → self-buff status effects */
const SKILL_SELF_BUFF: Record<string, string> = {
  'SK-KN-03': 'ST-VOW-STEEL',
  'SK-KN-06': 'ST-STEADFAST',
  'SK-RG-06': 'ST-INVISIBLE',
};

/** Map of skill IDs → ally-buff status effects */
const SKILL_ALLY_BUFF: Record<string, string> = {
  'SK-KN-02': 'ST-GUARDIAN',
  'SK-CL-07': 'ST-INSPIRED',
};

/** Map of skill IDs → debuffs applied to enemies on hit */
const SKILL_DEBUFF: Record<string, string> = {
  'SK-RG-05': 'ST-WEAKNESS',
};

function parseMultiplier(formula: string): { stat: 'atk' | 'int'; multiplier: number } {
  const match = formula.match(/(ATK|INT)\s*\*\s*(\d+\.?\d*)/i);
  if (match) {
    return {
      stat: match[1].toLowerCase() as 'atk' | 'int',
      multiplier: parseFloat(match[2]),
    };
  }
  return { stat: 'atk', multiplier: 1.0 };
}

function resolveElement(element: string): Element {
  const specialElements = ['player-chosen', 'random', 'last-collected', 'adaptive', 'dual-chosen'];
  if (specialElements.includes(element)) return Element.Neutral;

  const map: Record<string, Element> = {
    resonance: Element.Resonance,
    verdance: Element.Verdance,
    luminos: Element.Luminos,
    kinesis: Element.Kinesis,
    dark: Element.Dark,
    neutral: Element.Neutral,
  };
  return map[element.toLowerCase()] ?? Element.Neutral;
}

function isHealingSkill(skill: SkillDef): boolean {
  const f = skill.formula.toLowerCase();
  const n = skill.name.toLowerCase();
  return (
    (skill.target === 'SA' || skill.target === 'AA') &&
    (f.includes('heal') || f.includes('hp to') || f.includes('hp.') || n.includes('mending'))
  );
}

// ---------------------------------------------------------------------------
// Skill Execution
// ---------------------------------------------------------------------------

export function executeSkill(
  player: RpgPlayer,
  enemies: CombatEnemy[],
  playerEffects: ActiveEffect[],
  skillId: string,
  targetIndex?: number,
): SkillExecutionResult {
  const skill = getSkillDef(skillId);
  if (!skill) {
    return { success: false, skillName: 'Unknown', message: 'Unknown skill!' };
  }

  if (!hasSkill(player, skillId)) {
    return {
      success: false,
      skillName: skill.name,
      message: `Player has not learned ${skill.name}!`,
    };
  }

  if (skill.isPassive) {
    return {
      success: false,
      skillName: skill.name,
      message: `${skill.name} is a passive skill.`,
    };
  }

  // SP cost check
  if (player.sp < skill.spCost) {
    return {
      success: false,
      skillName: skill.name,
      message: `Not enough SP for ${skill.name}! (Need ${skill.spCost}, have ${Math.floor(player.sp)})`,
    };
  }

  // Deduct SP
  player.sp -= skill.spCost;

  // Route by target type
  if (skill.target === 'SE' || skill.target === 'AE') {
    return executeDamageSkill(player, enemies, playerEffects, skill, targetIndex);
  }

  if (isHealingSkill(skill)) {
    return executeHealSkill(player, playerEffects, skill);
  }

  // Buff/self/ally target
  return executeBuffSkill(player, playerEffects, skill);
}

// ---------------------------------------------------------------------------
// Damage Skill Execution
// ---------------------------------------------------------------------------

interface DamageContext {
  attacker: { atk: number; int: number; agi: number };
  skillInfo: SkillInfo;
  element: Element;
}

function buildDamageContext(
  player: RpgPlayer,
  playerEffects: ActiveEffect[],
  skill: SkillDef,
): DamageContext {
  const { stat, multiplier } = parseMultiplier(skill.formula);
  const power = Math.round((multiplier - 1) * 100);
  const element = resolveElement(skill.element);
  const equipBonuses = getEquipBonuses(player);

  const baseAtk = ((player.getVariable('PLAYER_ATK') as number) || 10) + equipBonuses.atk;
  const baseInt = ((player.getVariable('PLAYER_INT') as number) || 5) + equipBonuses.int;
  const baseAgi = (player.getVariable('PLAYER_AGI') as number) || 10;

  return {
    attacker: {
      atk: Math.floor(baseAtk * (1 + getEffectStatModifier(playerEffects, 'atk'))),
      int: Math.floor(baseInt * (1 + getEffectStatModifier(playerEffects, 'int'))),
      agi: Math.floor(baseAgi * (1 + getEffectStatModifier(playerEffects, 'agi'))),
    },
    skillInfo: { type: stat === 'int' ? 'magical' : 'physical', power },
    element,
  };
}

function executeAoeDamage(
  ctx: DamageContext,
  enemies: CombatEnemy[],
  skill: SkillDef,
): SkillExecutionResult {
  let totalDamage = 0;
  const hitMessages: string[] = [];

  for (const enemy of enemies) {
    if (enemy.hp <= 0) continue;
    const defValue = Math.floor(enemy.def * (1 + getEffectStatModifier(enemy.effects, 'def')));
    const result = calculateDamage(ctx.attacker, { def: defValue }, ctx.skillInfo, ctx.element);
    enemy.hp = Math.max(0, enemy.hp - result.damage);
    totalDamage += result.damage;
    hitMessages.push(`${enemy.name}: ${result.damage}`);
  }

  applyDebuffsFromSkill(skill, enemies);

  return {
    success: true,
    skillName: skill.name,
    targetName: 'all enemies',
    damage: totalDamage,
    message: `Player uses ${skill.name}! ${hitMessages.join(', ')}.`,
  };
}

function executeDamageSkill(
  player: RpgPlayer,
  enemies: CombatEnemy[],
  playerEffects: ActiveEffect[],
  skill: SkillDef,
  targetIndex?: number,
): SkillExecutionResult {
  const ctx = buildDamageContext(player, playerEffects, skill);

  if (skill.target === 'AE') {
    return executeAoeDamage(ctx, enemies, skill);
  }

  // Single enemy (SE)
  const idx = targetIndex ?? findFirstAlive(enemies);
  if (idx === -1) {
    return { success: true, skillName: skill.name, message: `${skill.name} has no valid target!` };
  }

  const target = enemies[idx];
  const defValue = Math.floor(target.def * (1 + getEffectStatModifier(target.effects, 'def')));
  const result = calculateDamage(ctx.attacker, { def: defValue }, ctx.skillInfo, ctx.element);
  target.hp = Math.max(0, target.hp - result.damage);

  // Apply debuff on hit
  const debuffId = SKILL_DEBUFF[skill.id];
  if (debuffId) {
    const eDef = effectById.get(debuffId);
    if (eDef) applyEffect(target.effects, debuffId, eDef.duration);
  }

  const critMsg = result.critical ? ' Critical!' : '';
  return {
    success: true,
    skillName: skill.name,
    targetName: target.name,
    damage: result.damage,
    message: `Player uses ${skill.name} on ${target.name} for ${result.damage} damage.${critMsg}`,
  };
}

function applyDebuffsFromSkill(skill: SkillDef, enemies: CombatEnemy[]): void {
  const debuffId = SKILL_DEBUFF[skill.id];
  if (!debuffId) return;
  const eDef = effectById.get(debuffId);
  if (!eDef) return;
  for (const enemy of enemies) {
    if (enemy.hp > 0) applyEffect(enemy.effects, debuffId, eDef.duration);
  }
}

// ---------------------------------------------------------------------------
// Heal Skill Execution
// ---------------------------------------------------------------------------

function executeHealSkill(
  player: RpgPlayer,
  playerEffects: ActiveEffect[],
  skill: SkillDef,
): SkillExecutionResult {
  const { multiplier } = parseMultiplier(skill.formula);
  const equipBonuses = getEquipBonuses(player);
  const playerInt = ((player.getVariable('PLAYER_INT') as number) || 5) + equipBonuses.int;
  const variance = 0.85 + Math.random() * 0.3;
  const healAmount = Math.floor(playerInt * multiplier * variance);

  const before = player.hp;
  player.hp = Math.min(player.hp + healAmount, player.param.maxHp);
  const healed = player.hp - before;

  // Some heal skills also apply buffs (e.g., Emotional Resonance → Inspired)
  const buffId = SKILL_ALLY_BUFF[skill.id];
  let buffMsg = '';
  if (buffId) {
    const eDef = effectById.get(buffId);
    if (eDef) {
      applyEffect(playerEffects, buffId, eDef.duration);
      buffMsg = ` ${eDef.name} applied!`;
    }
  }

  return {
    success: true,
    skillName: skill.name,
    healing: healed,
    message: `Player uses ${skill.name}! Healed ${healed} HP.${buffMsg}`,
  };
}

// ---------------------------------------------------------------------------
// Buff Skill Execution
// ---------------------------------------------------------------------------

function executeBuffSkill(
  _player: RpgPlayer,
  playerEffects: ActiveEffect[],
  skill: SkillDef,
): SkillExecutionResult {
  // Check self-buff
  const selfBuffId = SKILL_SELF_BUFF[skill.id];
  if (selfBuffId) {
    const eDef = effectById.get(selfBuffId);
    if (eDef) {
      applyEffect(playerEffects, selfBuffId, eDef.duration);
      return {
        success: true,
        skillName: skill.name,
        message: `Player uses ${skill.name}! ${eDef.name} for ${eDef.duration} turns.`,
      };
    }
  }

  // Check ally-buff
  const allyBuffId = SKILL_ALLY_BUFF[skill.id];
  if (allyBuffId) {
    const eDef = effectById.get(allyBuffId);
    if (eDef) {
      applyEffect(playerEffects, allyBuffId, eDef.duration);
      return {
        success: true,
        skillName: skill.name,
        message: `Player uses ${skill.name}! ${eDef.name} for ${eDef.duration} turns.`,
      };
    }
  }

  // Generic buff without a mapped status effect
  return {
    success: true,
    skillName: skill.name,
    message: `Player uses ${skill.name}!`,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findFirstAlive(enemies: CombatEnemy[]): number {
  return enemies.findIndex((e) => e.hp > 0);
}
