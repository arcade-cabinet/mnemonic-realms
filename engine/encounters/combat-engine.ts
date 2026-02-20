/**
 * Mnemonic Realms — Combat Engine
 *
 * PURE FUNCTIONS only. No React, no Skia, no side effects.
 * CombatState is immutable — each function returns a new state.
 */

import type {
  CombatAction,
  Combatant,
  CombatRewards,
  CombatState,
  Skill,
  TurnResult,
} from './types.js';

// ── Initialization ───────────────────────────────────────────────────────────

/** Create initial combat state from player party and enemy group. */
export function initCombat(playerParty: Combatant[], enemies: Combatant[]): CombatState {
  const combatants = [...playerParty, ...enemies];
  const turnOrder = determineTurnOrder(combatants);
  const firstId = turnOrder[0];
  const firstCombatant = combatants.find((c) => c.id === firstId);
  const phase = firstCombatant?.type === 'player' ? 'player-turn' : 'enemy-turn';

  return {
    phase,
    combatants,
    turnOrder,
    currentTurnIndex: 0,
    turnResults: [],
    round: 1,
  };
}

// ── Turn Order ───────────────────────────────────────────────────────────────

/** Sort combatants by AGI descending. Returns array of combatant IDs. */
export function determineTurnOrder(combatants: Combatant[]): string[] {
  return [...combatants]
    .filter((c) => c.hp > 0)
    .sort((a, b) => b.agi - a.agi)
    .map((c) => c.id);
}

// ── Damage Calculation ───────────────────────────────────────────────────────

/**
 * Calculate damage dealt by attacker to defender.
 * Formula: Math.max(1, Math.floor(attacker.atk * multiplier - defender.def * 0.5))
 * Skills use their multiplier; basic attacks use 1.0.
 * INT-based skills use attacker.int instead of atk.
 */
export function calculateDamage(attacker: Combatant, defender: Combatant, skill?: Skill): number {
  const multiplier = skill?.multiplier ?? 1.0;
  // Use INT for skills with magic element, ATK otherwise
  const baseStat = skill?.element ? attacker.int : attacker.atk;
  const raw = baseStat * multiplier - defender.def * 0.5;
  return Math.max(1, Math.floor(raw));
}

// ── Action Execution ─────────────────────────────────────────────────────────

/** Execute a single combat action. Returns new CombatState. */
export function executeAction(state: CombatState, action: CombatAction): CombatState {
  const actor = state.combatants.find((c) => c.id === action.actorId);
  if (!actor || actor.hp <= 0) return advanceTurn(state, []);

  switch (action.type) {
    case 'attack':
      return executeAttack(state, action, actor);
    case 'skill':
      return executeSkill(state, action, actor);
    case 'defend':
      return executeDefend(state, action, actor);
    case 'flee':
      return executeFlee(state, action, actor);
    default:
      return advanceTurn(state, []);
  }
}

function executeAttack(state: CombatState, action: CombatAction, actor: Combatant): CombatState {
  const target = state.combatants.find((c) => c.id === action.targetId);
  if (!target || target.hp <= 0) {
    return advanceTurn(state, [
      { actorId: actor.id, action, messages: [`${actor.name} attacks but the target is gone!`] },
    ]);
  }

  const damage = calculateDamage(actor, target);
  const newHp = Math.max(0, target.hp - damage);
  const result: TurnResult = {
    actorId: actor.id,
    action,
    damage,
    messages: [`${actor.name} attacks ${target.name} for ${damage} damage!`],
  };

  if (newHp <= 0) {
    result.messages.push(`${target.name} is defeated!`);
  }

  const updatedCombatants = state.combatants.map((c) =>
    c.id === target.id ? { ...c, hp: newHp } : c,
  );

  return advanceTurn({ ...state, combatants: updatedCombatants }, [result]);
}

function executeSkill(state: CombatState, action: CombatAction, actor: Combatant): CombatState {
  const skill = actor.skills.find((s) => s.id === action.skillId);
  if (!skill) {
    return advanceTurn(state, [
      { actorId: actor.id, action, messages: [`${actor.name} tries to use an unknown skill!`] },
    ]);
  }

  const target = state.combatants.find((c) => c.id === action.targetId);
  if (!target || target.hp <= 0) {
    return advanceTurn(state, [
      { actorId: actor.id, action, messages: [`${actor.name} uses ${skill.name} but misses!`] },
    ]);
  }

  const damage = calculateDamage(actor, target, skill);
  const newHp = Math.max(0, target.hp - damage);
  const result: TurnResult = {
    actorId: actor.id,
    action,
    damage,
    messages: [`${actor.name} uses ${skill.name} on ${target.name} for ${damage} damage!`],
  };

  if (skill.effect) {
    result.statusApplied = skill.effect;
    result.messages.push(`${target.name} is affected by ${skill.effect}!`);
  }
  if (newHp <= 0) {
    result.messages.push(`${target.name} is defeated!`);
  }

  const updatedCombatants = state.combatants.map((c) =>
    c.id === target.id ? { ...c, hp: newHp } : c,
  );

  return advanceTurn({ ...state, combatants: updatedCombatants }, [result]);
}

function executeDefend(state: CombatState, action: CombatAction, actor: Combatant): CombatState {
  // Defending doubles effective DEF for this round (tracked via status effect)
  const defendEffect = {
    id: 'defend',
    name: 'Defending',
    turnsLeft: 1,
    modifier: { def: actor.def },
  };

  const updatedCombatants = state.combatants.map((c) =>
    c.id === actor.id
      ? { ...c, statusEffects: [...c.statusEffects, defendEffect], def: actor.def * 2 }
      : c,
  );

  const result: TurnResult = {
    actorId: actor.id,
    action,
    messages: [`${actor.name} takes a defensive stance!`],
  };

  return advanceTurn({ ...state, combatants: updatedCombatants }, [result]);
}

function executeFlee(state: CombatState, action: CombatAction, actor: Combatant): CombatState {
  // Flee always succeeds (can be refined later with AGI check)
  const result: TurnResult = {
    actorId: actor.id,
    action,
    messages: [`${actor.name} flees from battle!`],
  };

  return {
    ...state,
    phase: 'fled',
    turnResults: [...state.turnResults, result],
  };
}

// ── Turn Advancement ─────────────────────────────────────────────────────────

function advanceTurn(state: CombatState, newResults: TurnResult[]): CombatState {
  const allResults = [...state.turnResults, ...newResults];

  // Check for combat end
  const endStatus = checkCombatEnd({ ...state, turnResults: allResults });
  if (endStatus === 'victory') {
    return { ...state, phase: 'victory', turnResults: allResults };
  }
  if (endStatus === 'defeat') {
    return { ...state, phase: 'defeat', turnResults: allResults };
  }

  // Advance to next living combatant
  let nextIndex = state.currentTurnIndex + 1;
  let nextRound = state.round;

  // If we've gone through all turns, start a new round
  if (nextIndex >= state.turnOrder.length) {
    nextIndex = 0;
    nextRound = state.round + 1;
    // Recalculate turn order for new round, tick down status effects
    const tickedCombatants = tickStatusEffects(state.combatants);
    const newTurnOrder = determineTurnOrder(tickedCombatants);

    if (newTurnOrder.length === 0) {
      return { ...state, phase: 'defeat', turnResults: allResults };
    }

    const nextCombatant = tickedCombatants.find((c) => c.id === newTurnOrder[0]);
    const nextPhase = nextCombatant?.type === 'player' ? 'player-turn' : 'enemy-turn';

    return {
      ...state,
      phase: nextPhase,
      combatants: tickedCombatants,
      turnOrder: newTurnOrder,
      currentTurnIndex: 0,
      turnResults: allResults,
      round: nextRound,
    };
  }

  // Skip dead combatants
  const nextId = state.turnOrder[nextIndex];
  const nextCombatant = state.combatants.find((c) => c.id === nextId);
  if (!nextCombatant || nextCombatant.hp <= 0) {
    return advanceTurn({ ...state, currentTurnIndex: nextIndex, turnResults: allResults }, []);
  }

  const nextPhase = nextCombatant.type === 'player' ? 'player-turn' : 'enemy-turn';

  return {
    ...state,
    phase: nextPhase,
    currentTurnIndex: nextIndex,
    turnResults: allResults,
    round: nextRound,
  };
}

/** Tick down status effects and remove expired ones. Restore modified stats. */
function tickStatusEffects(combatants: Combatant[]): Combatant[] {
  return combatants.map((c) => {
    if (c.statusEffects.length === 0) return c;

    let updatedDef = c.def;
    const remaining: typeof c.statusEffects = [];

    for (const effect of c.statusEffects) {
      const newTurns = effect.turnsLeft - 1;
      if (newTurns <= 0) {
        // Restore defend bonus when it expires
        if (effect.id === 'defend' && effect.modifier.def) {
          updatedDef = updatedDef - effect.modifier.def;
        }
      } else {
        remaining.push({ ...effect, turnsLeft: newTurns });
      }
    }

    return { ...c, def: updatedDef, statusEffects: remaining };
  });
}

// ── Combat End Check ─────────────────────────────────────────────────────────

/** Check if combat has ended. */
export function checkCombatEnd(state: CombatState): 'ongoing' | 'victory' | 'defeat' {
  const allEnemiesDead = state.combatants.filter((c) => c.type === 'enemy').every((c) => c.hp <= 0);

  const allPlayersDead = state.combatants
    .filter((c) => c.type === 'player')
    .every((c) => c.hp <= 0);

  if (allEnemiesDead) return 'victory';
  if (allPlayersDead) return 'defeat';
  return 'ongoing';
}

// ── Enemy AI ─────────────────────────────────────────────────────────────────

/** Basic enemy AI: attack a random living player, or use a skill if available. */
export function getEnemyAiAction(state: CombatState, enemyId: string): CombatAction {
  const enemy = state.combatants.find((c) => c.id === enemyId);
  const livingPlayers = state.combatants.filter((c) => c.type === 'player' && c.hp > 0);

  if (!enemy || livingPlayers.length === 0) {
    return { type: 'defend', actorId: enemyId };
  }

  // Pick a random living player as target
  const targetIndex = Math.floor(Math.random() * livingPlayers.length);
  const target = livingPlayers[targetIndex];

  // 30% chance to use a skill if the enemy has one
  if (enemy.skills.length > 0 && Math.random() < 0.3) {
    const skillIndex = Math.floor(Math.random() * enemy.skills.length);
    const skill = enemy.skills[skillIndex];
    return {
      type: 'skill',
      actorId: enemyId,
      targetId: target.id,
      skillId: skill.id,
    };
  }

  return {
    type: 'attack',
    actorId: enemyId,
    targetId: target.id,
  };
}

// ── Rewards ──────────────────────────────────────────────────────────────────

/** Calculate XP and gold rewards from defeated enemies. */
export function calculateRewards(enemies: Combatant[]): CombatRewards {
  let xp = 0;
  let gold = 0;

  for (const enemy of enemies) {
    // Use baseLevel * 10 as XP proxy, and baseLevel * 5 as gold proxy
    // In production, these would come from DDL enemy data
    xp += Math.max(1, Math.floor(enemy.maxHp * 0.6));
    gold += Math.max(1, Math.floor(enemy.maxHp * 0.3));
  }

  return { xp, gold };
}
