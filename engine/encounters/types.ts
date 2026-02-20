/**
 * Mnemonic Realms — Combat Types
 *
 * Pure data types for the encounter combat engine.
 * No React, no Skia, no side effects — just shapes.
 */

// ── Combatant ────────────────────────────────────────────────────────────────

export type CombatantType = 'player' | 'enemy';

export interface Skill {
  id: string;
  name: string;
  /** SP/MP cost */
  cost: number;
  /** Damage multiplier (e.g. 1.5 = 150% of base stat) */
  multiplier: number;
  /** Element type (fire, water, wind, etc.) */
  element?: string;
  /** Status effect applied on hit */
  effect?: string;
}

export interface StatusEffect {
  id: string;
  name: string;
  turnsLeft: number;
  /** Stat modifier (e.g. { agi: -0.5 } halves AGI) */
  modifier: Record<string, number>;
}

export interface Combatant {
  id: string;
  name: string;
  type: CombatantType;
  hp: number;
  maxHp: number;
  atk: number;
  int: number;
  def: number;
  agi: number;
  skills: Skill[];
  statusEffects: StatusEffect[];
}

// ── Actions ──────────────────────────────────────────────────────────────────

export type ActionType = 'attack' | 'skill' | 'item' | 'defend' | 'flee' | 'broadcast';

export interface CombatAction {
  type: ActionType;
  actorId: string;
  targetId?: string;
  skillId?: string;
  itemId?: string;
}

// ── Turn Results ─────────────────────────────────────────────────────────────

export interface TurnResult {
  actorId: string;
  action: CombatAction;
  damage?: number;
  healed?: number;
  statusApplied?: string;
  messages: string[];
}

// ── Combat State ─────────────────────────────────────────────────────────────

export type CombatPhase =
  | 'setup'
  | 'player-turn'
  | 'enemy-turn'
  | 'resolving'
  | 'victory'
  | 'defeat'
  | 'fled';

export interface CombatState {
  phase: CombatPhase;
  combatants: Combatant[];
  turnOrder: string[];
  currentTurnIndex: number;
  turnResults: TurnResult[];
  round: number;
}

// ── Rewards ──────────────────────────────────────────────────────────────────

export interface CombatRewards {
  xp: number;
  gold: number;
}
