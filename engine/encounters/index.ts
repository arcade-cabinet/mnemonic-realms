/**
 * Mnemonic Realms — Encounters Module
 *
 * Barrel exports for the combat engine.
 */

export {
  calculateDamage,
  calculateRewards,
  checkCombatEnd,
  determineTurnOrder,
  executeAction,
  getEnemyAiAction,
  initCombat,
} from './combat-engine.js';
export type {
  ActionType,
  CombatAction,
  Combatant,
  CombatantType,
  CombatPhase,
  CombatRewards,
  CombatState,
  Skill,
  StatusEffect,
  TurnResult,
} from './types.js';
