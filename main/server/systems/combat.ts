import type { RpgPlayer } from '@rpgjs/server';

import ambergroveEnemies from '../../../gen/ddl/enemies/ambergrove.json';
import heartfieldEnemies from '../../../gen/ddl/enemies/heartfield.json';
import millbrookEnemies from '../../../gen/ddl/enemies/millbrook.json';
import sunridgeEnemies from '../../../gen/ddl/enemies/sunridge.json';
import type { Attacker } from './damage';
import { calculateDamage } from './damage';
import { resolveAIDamage, selectEnemyAction } from './enemy-ai';
import { getEquipBonuses } from './inventory';
import type { ActiveEffect } from './skills-runtime';
import {
  executeSkill,
  getEffectStatModifier,
  hasEffect,
  tickEnemyEffects,
  tickPlayerEffects,
} from './skills-runtime';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export enum ActionType {
  Attack = 'attack',
  Skill = 'skill',
  Item = 'item',
  Defend = 'defend',
  Flee = 'flee',
}

export enum CombatPhase {
  Start = 'start',
  PlayerTurn = 'player_turn',
  EnemyTurn = 'enemy_turn',
  CheckEnd = 'check_end',
  Victory = 'victory',
  Defeat = 'defeat',
  Fled = 'fled',
}

export interface EnemyInstance {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  atk: number;
  int: number;
  def: number;
  agi: number;
  xp: number;
  gold: number;
  effects: ActiveEffect[];
  drops: EnemyDropDDL[];
}

export interface CombatAction {
  type: ActionType;
  targetIndex?: number;
  skillId?: string;
  itemId?: string;
}

export interface TurnEntry {
  kind: 'player' | 'enemy';
  enemyIndex?: number;
  agi: number;
}

export interface ItemDrop {
  itemId: string;
  quantity: number;
}

export interface CombatState {
  phase: CombatPhase;
  enemies: EnemyInstance[];
  turnOrder: TurnEntry[];
  turnIndex: number;
  round: number;
  defending: boolean;
  lastResult: TurnResult | null;
  playerEffects: ActiveEffect[];
  itemDrops: ItemDrop[];
}

export interface TurnResult {
  actor: string;
  action: ActionType;
  targetName?: string;
  damage?: number;
  healing?: number;
  fled?: boolean;
  skillName?: string;
  message: string;
  critical?: boolean;
  element?: string;
  statusApplied?: string[];
}

// ---------------------------------------------------------------------------
// Player variable keys
// ---------------------------------------------------------------------------

const VAR_COMBAT = 'COMBAT_STATE';

// ---------------------------------------------------------------------------
// Enemy data loader (reads from DDL JSON at import time)
// ---------------------------------------------------------------------------

interface EnemyDropDDL {
  itemId: string;
  chance: number;
}

interface EnemyDDL {
  id: string;
  name: string;
  hp: number;
  atk: number;
  int: number;
  def: number;
  agi: number;
  xp: number;
  gold: number;
  drops?: EnemyDropDDL[];
}

const ALL_ENEMIES: EnemyDDL[] = [
  ...(heartfieldEnemies as EnemyDDL[]),
  ...(ambergroveEnemies as EnemyDDL[]),
  ...(millbrookEnemies as EnemyDDL[]),
  ...(sunridgeEnemies as EnemyDDL[]),
];

const enemyById = new Map<string, EnemyDDL>(ALL_ENEMIES.map((e) => [e.id, e]));

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getCombatState(player: RpgPlayer): CombatState | null {
  return (player.getVariable(VAR_COMBAT) as CombatState | undefined) ?? null;
}

function saveCombatState(player: RpgPlayer, state: CombatState): void {
  player.setVariable(VAR_COMBAT, state);
}

function getPlayerAgi(player: RpgPlayer): number {
  return (player.getVariable('PLAYER_AGI') as number) || 10;
}

function getPlayerAtk(player: RpgPlayer): number {
  const base = (player.getVariable('PLAYER_ATK') as number) || 10;
  return base + getEquipBonuses(player).atk;
}

function getPlayerInt(player: RpgPlayer): number {
  const base = (player.getVariable('PLAYER_INT') as number) || 5;
  return base + getEquipBonuses(player).int;
}

function getPlayerDef(player: RpgPlayer): number {
  const base = (player.getVariable('PLAYER_DEF') as number) || 5;
  return base + getEquipBonuses(player).def;
}

/**
 * Build turn order sorted by AGI descending.
 * Higher AGI = acts first (classic JRPG convention).
 */
function buildTurnOrder(playerAgi: number, enemies: EnemyInstance[]): TurnEntry[] {
  const entries: TurnEntry[] = [{ kind: 'player', agi: playerAgi }];

  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].hp > 0) {
      entries.push({ kind: 'enemy', enemyIndex: i, agi: enemies[i].agi });
    }
  }

  entries.sort((a, b) => b.agi - a.agi);
  return entries;
}

function instantiateEnemy(ddl: EnemyDDL): EnemyInstance {
  return {
    id: ddl.id,
    name: ddl.name,
    hp: ddl.hp,
    maxHp: ddl.hp,
    atk: ddl.atk,
    int: ddl.int,
    def: ddl.def,
    agi: ddl.agi,
    xp: ddl.xp,
    gold: ddl.gold,
    effects: [],
    drops: ddl.drops ?? [],
  };
}

function playerAsAttacker(player: RpgPlayer): Attacker {
  return { atk: getPlayerAtk(player), int: getPlayerInt(player), agi: getPlayerAgi(player) };
}

function enemyAsAttacker(enemy: EnemyInstance): Attacker {
  return {
    atk: Math.floor(enemy.atk * (1 + getEffectStatModifier(enemy.effects, 'atk'))),
    int: Math.floor(enemy.int * (1 + getEffectStatModifier(enemy.effects, 'int'))),
    agi: Math.floor(enemy.agi * (1 + getEffectStatModifier(enemy.effects, 'agi'))),
  };
}

function enemyAsDefender(enemy: EnemyInstance): { def: number } {
  return { def: Math.floor(enemy.def * (1 + getEffectStatModifier(enemy.effects, 'def'))) };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Start a combat encounter. Creates enemy instances from DDL IDs,
 * builds turn order, and stores the initial combat state.
 * Returns null if any enemy ID is unknown, combat is already active,
 * or the enemy list is empty.
 */
export function startCombat(player: RpgPlayer, enemyIds: string[]): CombatState | null {
  if (getCombatState(player)) return null;
  if (enemyIds.length === 0) return null;

  const enemies: EnemyInstance[] = [];
  for (const id of enemyIds) {
    const ddl = enemyById.get(id);
    if (!ddl) return null;
    enemies.push(instantiateEnemy(ddl));
  }

  const turnOrder = buildTurnOrder(getPlayerAgi(player), enemies);

  const state: CombatState = {
    phase: CombatPhase.PlayerTurn,
    enemies,
    turnOrder,
    turnIndex: 0,
    round: 1,
    defending: false,
    lastResult: null,
    playerEffects: [],
    itemDrops: [],
  };

  // Advance to the first turn (might be enemy if they have higher AGI)
  advanceToNextAlive(state);

  // Set initial phase based on who actually goes first
  const first = state.turnOrder[state.turnIndex];
  state.phase = first.kind === 'player' ? CombatPhase.PlayerTurn : CombatPhase.EnemyTurn;

  saveCombatState(player, state);
  return state;
}

/**
 * Resolve the player's turn: tick effects, then act (or skip if stunned).
 * Returns true if the player died from status effects.
 */
function resolvePlayerTurnWithEffects(
  player: RpgPlayer,
  state: CombatState,
  action: CombatAction,
): boolean {
  const { messages: tickMsgs, stunned } = tickPlayerEffects(player, state.playerEffects);

  if (player.hp <= 0) {
    state.phase = CombatPhase.Defeat;
    state.lastResult = { actor: 'Player', action: ActionType.Defend, message: tickMsgs.join(' ') };
    return true;
  }

  if (stunned) {
    state.lastResult = { actor: 'Player', action: ActionType.Defend, message: tickMsgs.join(' ') };
  } else {
    resolvePlayerAction(player, state, action);
    if (tickMsgs.length > 0 && state.lastResult) {
      state.lastResult.message = `${tickMsgs.join(' ')} ${state.lastResult.message}`;
    }
  }
  return false;
}

/**
 * Tick an enemy's effects and determine if they should skip their turn.
 * Returns 'skip' if the enemy died or is stunned, 'act' otherwise.
 */
function tickAndCheckEnemy(state: CombatState, enemy: EnemyInstance): 'skip' | 'act' {
  const { messages: msgs, stunned } = tickEnemyEffects(enemy);

  if (enemy.hp <= 0) {
    state.lastResult = {
      actor: enemy.name,
      action: ActionType.Attack,
      message: `${msgs.join(' ')} ${enemy.name} was defeated!`,
    };
    return 'skip';
  }

  if (stunned) {
    state.lastResult = { actor: enemy.name, action: ActionType.Attack, message: msgs.join(' ') };
    return 'skip';
  }

  return 'act';
}

/**
 * Process all enemy turns until it's the player's turn again or combat ends.
 */
function processEnemyTurns(player: RpgPlayer, state: CombatState): void {
  advanceTurn(player, state);
  while (state.phase === CombatPhase.EnemyTurn) {
    const entry = state.turnOrder[state.turnIndex];
    if (entry.kind === 'enemy' && entry.enemyIndex !== undefined) {
      const enemy = state.enemies[entry.enemyIndex];
      if (enemy.hp > 0 && tickAndCheckEnemy(state, enemy) === 'skip') {
        if (allEnemiesDead(state.enemies)) {
          state.phase = CombatPhase.Victory;
          return;
        }
        advanceTurn(player, state);
        continue;
      }
    }

    resolveEnemyTurn(player, state);
    if (player.hp <= 0) {
      state.phase = CombatPhase.Defeat;
      return;
    }
    advanceTurn(player, state);
  }
}

/**
 * Process one turn of combat. The player provides an action when it's their turn.
 * Enemy turns are resolved automatically after the player acts.
 * Status effects tick at the start of each combatant's turn.
 * Returns the updated combat state, or null if no combat is active.
 */
export function processTurn(player: RpgPlayer, action: CombatAction): CombatState | null {
  const state = getCombatState(player);
  if (!state || isCombatOver(state)) {
    if (state) saveCombatState(player, state);
    return state;
  }

  const current = state.turnOrder[state.turnIndex];
  if (current.kind === 'player') {
    if (resolvePlayerTurnWithEffects(player, state, action)) {
      saveCombatState(player, state);
      return state;
    }
  }

  processEnemyTurns(player, state);

  // Roll item drops when combat reaches victory
  if (state.phase === CombatPhase.Victory && state.itemDrops.length === 0) {
    state.itemDrops = rollItemDrops(state);
  }

  saveCombatState(player, state);
  return state;
}

/**
 * Get the current combat state, or null if not in combat.
 */
export function getCombat(player: RpgPlayer): CombatState | null {
  return getCombatState(player);
}

/**
 * End combat and clear the stored state. Called after victory/defeat/flee.
 */
export function endCombat(player: RpgPlayer): void {
  player.setVariable(VAR_COMBAT, undefined);
}

/**
 * Check whether the player is currently in combat.
 */
export function isInCombat(player: RpgPlayer): boolean {
  return getCombatState(player) !== null;
}

// ---------------------------------------------------------------------------
// Action resolution
// ---------------------------------------------------------------------------

function resolvePlayerAction(player: RpgPlayer, state: CombatState, action: CombatAction): void {
  state.defending = false;

  switch (action.type) {
    case ActionType.Attack:
      resolvePlayerAttack(player, state, action);
      break;
    case ActionType.Defend:
      state.defending = true;
      state.lastResult = {
        actor: 'Player',
        action: ActionType.Defend,
        message: 'Player takes a defensive stance.',
      };
      break;
    case ActionType.Flee:
      resolvePlayerFlee(state);
      break;
    case ActionType.Skill: {
      const skillResult = executeSkill(
        player,
        state.enemies,
        state.playerEffects,
        action.skillId ?? '',
        action.targetIndex,
      );
      state.lastResult = {
        actor: 'Player',
        action: ActionType.Skill,
        targetName: skillResult.targetName,
        damage: skillResult.damage,
        healing: skillResult.healing,
        skillName: skillResult.skillName,
        message: skillResult.message,
        critical: skillResult.critical,
        element: skillResult.element,
        statusApplied: skillResult.statusApplied,
      };
      break;
    }
    case ActionType.Item:
      // Item-in-combat resolution is a stub — detailed in subsequent stories
      state.lastResult = {
        actor: 'Player',
        action: ActionType.Item,
        message: 'Player uses an item. (Not yet implemented)',
      };
      break;
  }
}

function resolvePlayerAttack(player: RpgPlayer, state: CombatState, action: CombatAction): void {
  const targetIdx = action.targetIndex ?? findFirstAliveEnemy(state.enemies);
  if (targetIdx === -1) return;

  const target = state.enemies[targetIdx];
  const result = calculateDamage(playerAsAttacker(player), enemyAsDefender(target));
  target.hp = Math.max(0, target.hp - result.damage);

  const critMsg = result.critical ? ' Critical hit!' : '';
  state.lastResult = {
    actor: 'Player',
    action: ActionType.Attack,
    targetName: target.name,
    damage: result.damage,
    critical: result.critical,
    element: 'neutral',
    message: `Player attacks ${target.name} for ${result.damage} damage.${critMsg}`,
  };
}

function resolvePlayerFlee(state: CombatState): void {
  // Vow of Steel prevents fleeing
  if (hasEffect(state.playerEffects, 'ST-VOW-STEEL')) {
    state.lastResult = {
      actor: 'Player',
      action: ActionType.Flee,
      fled: false,
      message: 'Cannot flee while Vow of Steel is active!',
    };
    return;
  }

  // Simple flee: 50% base chance. Could be refined with AGI comparison later.
  const success = Math.random() < 0.5;
  if (success) {
    state.phase = CombatPhase.Fled;
    state.lastResult = {
      actor: 'Player',
      action: ActionType.Flee,
      fled: true,
      message: 'Player fled from battle!',
    };
  } else {
    state.lastResult = {
      actor: 'Player',
      action: ActionType.Flee,
      fled: false,
      message: 'Failed to flee!',
    };
  }
}

function resolveEnemyTurn(player: RpgPlayer, state: CombatState): void {
  const entry = state.turnOrder[state.turnIndex];
  if (entry.kind !== 'enemy' || entry.enemyIndex === undefined) return;

  const enemy = state.enemies[entry.enemyIndex];
  if (enemy.hp <= 0) return;

  // AI selects action based on behavior pattern, HP, and round
  const aiAction = selectEnemyAction(enemy, state.round);

  const baseDef = getPlayerDef(player) * (state.defending ? 2 : 1);
  const defVal = Math.floor(baseDef * (1 + getEffectStatModifier(state.playerEffects, 'def')));

  switch (aiAction.type) {
    case 'defend': {
      // Defensive action: enemy takes a defensive stance (no damage dealt)
      state.lastResult = {
        actor: enemy.name,
        action: ActionType.Defend,
        message: aiAction.message,
      };
      break;
    }

    case 'skill': {
      // Skill-based attack: use ability formula for damage
      const skillResult = resolveAIDamage(enemy, aiAction, defVal);
      player.hp = Math.max(0, player.hp - skillResult.damage);
      const critMsg = skillResult.critical ? ' Critical hit!' : '';
      state.lastResult = {
        actor: enemy.name,
        action: ActionType.Skill,
        targetName: 'Player',
        damage: skillResult.damage,
        critical: skillResult.critical,
        element: 'neutral',
        message: `${aiAction.message} ${skillResult.damage} damage to Player.${critMsg}`,
      };
      break;
    }

    default: {
      // Basic attack
      const result = calculateDamage(enemyAsAttacker(enemy), { def: defVal });
      player.hp = Math.max(0, player.hp - result.damage);
      const critMsg = result.critical ? ' Critical hit!' : '';
      state.lastResult = {
        actor: enemy.name,
        action: ActionType.Attack,
        targetName: 'Player',
        damage: result.damage,
        critical: result.critical,
        element: 'neutral',
        message: `${enemy.name} attacks Player for ${result.damage} damage.${critMsg}`,
      };
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// Turn management
// ---------------------------------------------------------------------------

function advanceTurn(player: RpgPlayer, state: CombatState): void {
  if (isCombatOver(state)) {
    return;
  }

  // Check end conditions
  if (allEnemiesDead(state.enemies)) {
    state.phase = CombatPhase.Victory;
    return;
  }
  if (player.hp <= 0) {
    state.phase = CombatPhase.Defeat;
    return;
  }

  state.turnIndex++;

  // If we've gone past the end of turn order, start a new round
  if (state.turnIndex >= state.turnOrder.length) {
    state.round++;
    state.turnOrder = rebuildTurnOrder(state);
    state.turnIndex = 0;
  }

  advanceToNextAlive(state);

  const current = state.turnOrder[state.turnIndex];
  state.phase = current.kind === 'player' ? CombatPhase.PlayerTurn : CombatPhase.EnemyTurn;
}

/**
 * Skip dead enemies in the turn order. Uses iterative wrapping with a
 * safety limit to prevent infinite loops if all combatants are dead.
 */
function advanceToNextAlive(state: CombatState): void {
  // Safety limit: at most 2 round wraps (if we wrap twice, something is wrong)
  let wraps = 0;
  const maxWraps = 2;

  while (wraps < maxWraps) {
    while (state.turnIndex < state.turnOrder.length) {
      const entry = state.turnOrder[state.turnIndex];
      if (entry.kind === 'player') return;
      if (entry.enemyIndex !== undefined && state.enemies[entry.enemyIndex].hp > 0) return;
      state.turnIndex++;
    }

    // Wrap to new round
    state.round++;
    state.turnOrder = rebuildTurnOrder(state);
    state.turnIndex = 0;
    wraps++;
  }
}

function rebuildTurnOrder(state: CombatState): TurnEntry[] {
  // Player AGI is stored in the existing player turn entry
  const playerEntry = state.turnOrder.find((e) => e.kind === 'player');
  const playerAgi = playerEntry?.agi ?? 10;
  return buildTurnOrder(playerAgi, state.enemies);
}

function isCombatOver(state: CombatState): boolean {
  return (
    state.phase === CombatPhase.Victory ||
    state.phase === CombatPhase.Defeat ||
    state.phase === CombatPhase.Fled
  );
}

function allEnemiesDead(enemies: EnemyInstance[]): boolean {
  return enemies.every((e) => e.hp <= 0);
}

function findFirstAliveEnemy(enemies: EnemyInstance[]): number {
  return enemies.findIndex((e) => e.hp > 0);
}

/**
 * Calculate total XP reward from defeated enemies.
 */
export function getCombatXpReward(state: CombatState): number {
  return state.enemies.filter((e) => e.hp <= 0).reduce((sum, e) => sum + e.xp, 0);
}

/**
 * Calculate total gold reward from defeated enemies.
 */
export function getCombatGoldReward(state: CombatState): number {
  return state.enemies.filter((e) => e.hp <= 0).reduce((sum, e) => sum + e.gold, 0);
}

/**
 * Roll item drops from defeated enemies' drop tables.
 * Each drop entry is rolled independently per defeated enemy.
 * Duplicate item IDs are consolidated by summing quantities.
 */
export function rollItemDrops(state: CombatState): ItemDrop[] {
  const dropMap = new Map<string, number>();

  for (const enemy of state.enemies) {
    if (enemy.hp > 0) continue;
    for (const drop of enemy.drops) {
      if (Math.random() < drop.chance) {
        dropMap.set(drop.itemId, (dropMap.get(drop.itemId) ?? 0) + 1);
      }
    }
  }

  const drops: ItemDrop[] = [];
  for (const [itemId, quantity] of dropMap) {
    drops.push({ itemId, quantity });
  }
  return drops;
}
