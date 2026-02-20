/**
 * Combat Behavior — AI combat action selection.
 *
 * Pure functions. Selects CombatActions based on the current CombatState
 * and the active PlaythroughStrategy's combat style.
 */

import type { CombatAction, Combatant, CombatState } from '../../encounters/types.js';
import type { CombatStyle } from '../strategies/types.js';

/**
 * Select a combat action for the current player combatant.
 *
 * Priority logic per style:
 * - **aggressive**: Attack the enemy with lowest HP. Use strongest skill if available.
 * - **defensive**: Heal when HP < 40%, defend when HP < 25%, otherwise balanced attack.
 * - **balanced**: Heal when HP < 30%, use skills when available, attack otherwise.
 *
 * @param state - Current combat state
 * @param actorId - The player combatant choosing an action
 * @param style - Combat style from the active strategy
 * @returns A CombatAction to execute
 */
export function selectCombatAction(
  state: CombatState,
  actorId: string,
  style: CombatStyle,
): CombatAction {
  const actor = state.combatants.find((c) => c.id === actorId);
  if (!actor) {
    return { type: 'defend', actorId };
  }

  const enemies = state.combatants.filter((c) => c.type === 'enemy' && c.hp > 0);
  const hpRatio = actor.hp / actor.maxHp;

  switch (style) {
    case 'aggressive':
      return selectAggressive(actor, enemies);
    case 'defensive':
      return selectDefensive(actor, enemies, hpRatio);
    case 'balanced':
      return selectBalanced(actor, enemies, hpRatio);
    default:
      return selectBalanced(actor, enemies, hpRatio);
  }
}

/** Pick the enemy with the lowest HP. */
function pickWeakestEnemy(enemies: Combatant[]): Combatant | undefined {
  if (enemies.length === 0) return undefined;
  return enemies.reduce((weakest, e) => (e.hp < weakest.hp ? e : weakest));
}

/** Find the highest-multiplier skill the actor has. */
function getBestSkill(actor: Combatant) {
  if (actor.skills.length === 0) return undefined;
  return actor.skills.reduce((best, s) => (s.multiplier > best.multiplier ? s : best));
}

/** Aggressive: use strongest skill on weakest enemy to finish them fast. */
function selectAggressive(actor: Combatant, enemies: Combatant[]): CombatAction {
  const target = pickWeakestEnemy(enemies);
  if (!target) return { type: 'defend', actorId: actor.id };

  const skill = getBestSkill(actor);
  if (skill) {
    return {
      type: 'skill',
      actorId: actor.id,
      targetId: target.id,
      skillId: skill.id,
    };
  }

  return { type: 'attack', actorId: actor.id, targetId: target.id };
}

/** Defensive: defend when critical, otherwise cautious attacks. */
function selectDefensive(actor: Combatant, enemies: Combatant[], hpRatio: number): CombatAction {
  // Critical HP — defend to buy time
  if (hpRatio < 0.25) {
    return { type: 'defend', actorId: actor.id };
  }

  // Low HP — flee if possible
  if (hpRatio < 0.15) {
    return { type: 'flee', actorId: actor.id };
  }

  const target = pickWeakestEnemy(enemies);
  if (!target) return { type: 'defend', actorId: actor.id };

  return { type: 'attack', actorId: actor.id, targetId: target.id };
}

/** Balanced: use skills when available, attack weakest enemy. */
function selectBalanced(actor: Combatant, enemies: Combatant[], hpRatio: number): CombatAction {
  // Low HP — defend
  if (hpRatio < 0.3) {
    return { type: 'defend', actorId: actor.id };
  }

  const target = pickWeakestEnemy(enemies);
  if (!target) return { type: 'defend', actorId: actor.id };

  const skill = getBestSkill(actor);
  if (skill) {
    return {
      type: 'skill',
      actorId: actor.id,
      targetId: target.id,
      skillId: skill.id,
    };
  }

  return { type: 'attack', actorId: actor.id, targetId: target.id };
}
