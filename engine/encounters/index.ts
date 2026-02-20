/**
 * Mnemonic Realms — Encounters Module
 *
 * Barrel exports for the combat engine and chain executor.
 */

export type { ChainPhase, ChainState, ChainStep, ChainStepType } from './chain.js';
export {
  advanceChain,
  createChainFromEncounter,
  createRandomEncounterCheck,
  getCurrentStep,
  isChainComplete,
} from './chain.js';
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
