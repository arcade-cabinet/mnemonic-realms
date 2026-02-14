import type { RpgPlayer } from '@rpgjs/server';

import ambergroveEnemies from '../../../gen/ddl/enemies/ambergrove.json';
import heartfieldEnemies from '../../../gen/ddl/enemies/heartfield.json';
import millbrookEnemies from '../../../gen/ddl/enemies/millbrook.json';
import sunridgeEnemies from '../../../gen/ddl/enemies/sunridge.json';
import { getEquipBonuses } from './inventory';

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

export interface CombatState {
  phase: CombatPhase;
  enemies: EnemyInstance[];
  turnOrder: TurnEntry[];
  turnIndex: number;
  round: number;
  defending: boolean;
  lastResult: TurnResult | null;
}

export interface TurnResult {
  actor: string;
  action: ActionType;
  targetName?: string;
  damage?: number;
  fled?: boolean;
  message: string;
}

// ---------------------------------------------------------------------------
// Player variable keys
// ---------------------------------------------------------------------------

const VAR_COMBAT = 'COMBAT_STATE';

// ---------------------------------------------------------------------------
// Enemy data loader (reads from DDL JSON at import time)
// ---------------------------------------------------------------------------

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
  };
}

/**
 * Simple damage formula: max(1, attackerAtk - defenderDef / 2).
 * Placeholder — real formulas come in subsequent user stories.
 */
function calcDamage(attackerAtk: number, defenderDef: number): number {
  return Math.max(1, Math.floor(attackerAtk - defenderDef / 2));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Start a combat encounter. Creates enemy instances from DDL IDs,
 * builds turn order, and stores the initial combat state.
 * Returns null if any enemy ID is unknown or combat is already active.
 */
export function startCombat(player: RpgPlayer, enemyIds: string[]): CombatState | null {
  if (getCombatState(player)) return null;

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
  };

  // Advance to the first turn (might be enemy if they have higher AGI)
  advanceToNextAlive(state);
  saveCombatState(player, state);
  return state;
}

/**
 * Process one turn of combat. The player provides an action when it's their turn.
 * Enemy turns are resolved automatically after the player acts.
 * Returns the updated combat state, or null if no combat is active.
 */
export function processTurn(player: RpgPlayer, action: CombatAction): CombatState | null {
  const state = getCombatState(player);
  if (!state) return null;

  const current = state.turnOrder[state.turnIndex];

  if (current.kind === 'player') {
    resolvePlayerAction(player, state, action);
  }

  // After the player acts, advance through enemy turns automatically
  advanceTurn(state);
  while (state.phase === CombatPhase.EnemyTurn) {
    resolveEnemyTurn(player, state);
    advanceTurn(state);
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
    case ActionType.Skill:
      // Skill resolution is a stub — detailed in subsequent stories
      state.lastResult = {
        actor: 'Player',
        action: ActionType.Skill,
        message: 'Player uses a skill. (Not yet implemented)',
      };
      break;
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
  const damage = calcDamage(getPlayerAtk(player), target.def);
  target.hp = Math.max(0, target.hp - damage);

  state.lastResult = {
    actor: 'Player',
    action: ActionType.Attack,
    targetName: target.name,
    damage,
    message: `Player attacks ${target.name} for ${damage} damage.`,
  };
}

function resolvePlayerFlee(state: CombatState): void {
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

  // Simple AI: basic attack against the player
  const defMultiplier = state.defending ? 2 : 1;
  const damage = calcDamage(enemy.atk, getPlayerDef(player) * defMultiplier);
  player.hp = Math.max(0, player.hp - damage);

  state.lastResult = {
    actor: enemy.name,
    action: ActionType.Attack,
    targetName: 'Player',
    damage,
    message: `${enemy.name} attacks Player for ${damage} damage.`,
  };
}

// ---------------------------------------------------------------------------
// Turn management
// ---------------------------------------------------------------------------

function advanceTurn(state: CombatState): void {
  if (
    state.phase === CombatPhase.Victory ||
    state.phase === CombatPhase.Defeat ||
    state.phase === CombatPhase.Fled
  ) {
    return;
  }

  // Check end conditions
  if (allEnemiesDead(state.enemies)) {
    state.phase = CombatPhase.Victory;
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
 * Skip dead enemies in the turn order.
 */
function advanceToNextAlive(state: CombatState): void {
  while (state.turnIndex < state.turnOrder.length) {
    const entry = state.turnOrder[state.turnIndex];
    if (entry.kind === 'player') break;
    if (entry.enemyIndex !== undefined && state.enemies[entry.enemyIndex].hp > 0) break;
    state.turnIndex++;
  }

  if (state.turnIndex >= state.turnOrder.length) {
    // Wrap to new round
    state.round++;
    state.turnOrder = rebuildTurnOrder(state);
    state.turnIndex = 0;
    advanceToNextAlive(state);
  }
}

function rebuildTurnOrder(state: CombatState): TurnEntry[] {
  // Player AGI is stored in the existing player turn entry
  const playerEntry = state.turnOrder.find((e) => e.kind === 'player');
  const playerAgi = playerEntry?.agi ?? 10;
  return buildTurnOrder(playerAgi, state.enemies);
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
