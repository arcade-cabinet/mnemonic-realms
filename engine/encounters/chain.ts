/**
 * Mnemonic Realms — Encounter Chain Executor
 *
 * Orchestrates multi-step encounter sequences (combat → dialogue → surprise → combat)
 * and random encounter triggering.
 *
 * PURE FUNCTIONS only. No React, no Skia, no side effects.
 * ChainState is immutable — each function returns a new state.
 * The chain executor TELLS the caller what to do but doesn't DO it.
 */

import type { RuntimeEncounter } from '../../gen/assemblage/pipeline/runtime-types.ts';
import type { CombatState } from './types.js';

// ── Chain Types ─────────────────────────────────────────────────────────────

export type ChainStepType = 'combat' | 'dialogue' | 'surprise' | 'reward';

export interface ChainStep {
  type: ChainStepType;
  encounterId?: string;
  dialogueId?: string;
}

export type ChainPhase = 'idle' | 'executing' | 'awaiting-input' | 'complete';

export interface ChainState {
  phase: ChainPhase;
  steps: ChainStep[];
  currentStepIndex: number;
  /** Active combat state when current step is 'combat'. */
  combatState?: CombatState;
  /** Active dialogue ID when current step is 'dialogue'. */
  dialogueId?: string;
}

// ── Chain Resolution ────────────────────────────────────────────────────────

/**
 * Resolve an encounter chain by following chainNext links on RuntimeEncounters.
 * Handles missing encounters and cycles gracefully.
 */
function resolveRuntimeChain(
  encounterId: string,
  encounters: Map<string, RuntimeEncounter>,
): string[] {
  const chain: string[] = [];
  const visited = new Set<string>();
  let currentId: string | undefined = encounterId;

  while (currentId) {
    if (visited.has(currentId)) break;

    const encounter = encounters.get(currentId);
    if (!encounter) break;

    chain.push(currentId);
    visited.add(currentId);
    currentId = encounter.chainNext;
  }

  return chain;
}

// ── Chain Construction ──────────────────────────────────────────────────────

/**
 * Create a chain state from an encounter ID and a map of all encounters.
 * Follows chainNext links to build the full sequence.
 * Inserts 'reward' steps between consecutive combat encounters.
 */
export function createChainFromEncounter(
  encounterId: string,
  encounters: Map<string, RuntimeEncounter>,
): ChainState {
  const encounterIds = resolveRuntimeChain(encounterId, encounters);

  if (encounterIds.length === 0) {
    return { phase: 'complete', steps: [], currentStepIndex: 0 };
  }

  const steps: ChainStep[] = [];
  for (let i = 0; i < encounterIds.length; i++) {
    // Insert reward step between consecutive combat encounters
    if (i > 0) {
      steps.push({ type: 'reward' });
    }
    steps.push({ type: 'combat', encounterId: encounterIds[i] });
  }

  return {
    phase: 'executing',
    steps,
    currentStepIndex: 0,
  };
}

// ── Chain Navigation ────────────────────────────────────────────────────────

/** Advance to the next step in the chain. Returns new state. */
export function advanceChain(state: ChainState): ChainState {
  const nextIndex = state.currentStepIndex + 1;

  if (nextIndex >= state.steps.length) {
    return {
      ...state,
      phase: 'complete',
      currentStepIndex: nextIndex,
      combatState: undefined,
      dialogueId: undefined,
    };
  }

  const nextStep = state.steps[nextIndex];
  return {
    ...state,
    phase:
      nextStep.type === 'dialogue' || nextStep.type === 'reward' ? 'awaiting-input' : 'executing',
    currentStepIndex: nextIndex,
    combatState: undefined,
    dialogueId: nextStep.type === 'dialogue' ? nextStep.dialogueId : undefined,
  };
}

/** Get the current active step, or null if chain is complete. */
export function getCurrentStep(state: ChainState): ChainStep | null {
  if (state.currentStepIndex >= state.steps.length) return null;
  return state.steps[state.currentStepIndex];
}

/** Check whether the chain has completed all steps. */
export function isChainComplete(state: ChainState): boolean {
  return state.phase === 'complete';
}

// ── Random Encounter Triggering ─────────────────────────────────────────────

/**
 * Create a random encounter checker based on steps-between config.
 * Probability increases linearly the more steps since last encounter,
 * reaching 100% at 2× stepsBetween.
 */
export function createRandomEncounterCheck(stepsBetween: number): {
  shouldTrigger: (currentSteps: number) => boolean;
} {
  return {
    shouldTrigger(currentSteps: number): boolean {
      if (currentSteps < 1) return false;
      // Linear ramp: 0% at step 0, 50% at stepsBetween, 100% at 2×stepsBetween
      const probability = Math.min(1, currentSteps / (stepsBetween * 2));
      return Math.random() < probability;
    },
  };
}
