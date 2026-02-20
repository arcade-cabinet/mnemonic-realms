/**
 * Mnemonic Realms — SFX Registry (Pure Functions)
 *
 * Manages a registry of sound effect configurations.
 * All functions are pure — no audio playback, no side effects.
 * The caller is responsible for loading and playing audio files.
 */

import type { SfxConfig } from './types.js';

// ── Standard SFX IDs ─────────────────────────────────────────────────────────

/** Standard SFX identifiers used throughout the game. */
export const SFX_DIALOGUE_ADVANCE = 'dialogue-advance';
export const SFX_CHEST_OPEN = 'chest-open';
export const SFX_MENU_SELECT = 'menu-select';
export const SFX_MENU_CANCEL = 'menu-cancel';
export const SFX_COMBAT_HIT = 'combat-hit';
export const SFX_COMBAT_MISS = 'combat-miss';
export const SFX_LEVEL_UP = 'level-up';
export const SFX_QUEST_COMPLETE = 'quest-complete';
export const SFX_ITEM_PICKUP = 'item-pickup';
export const SFX_TRANSITION = 'transition';

/** All standard SFX IDs as an array. */
export const STANDARD_SFX_IDS = [
  SFX_DIALOGUE_ADVANCE,
  SFX_CHEST_OPEN,
  SFX_MENU_SELECT,
  SFX_MENU_CANCEL,
  SFX_COMBAT_HIT,
  SFX_COMBAT_MISS,
  SFX_LEVEL_UP,
  SFX_QUEST_COMPLETE,
  SFX_ITEM_PICKUP,
  SFX_TRANSITION,
] as const;

// ── Registry Functions ───────────────────────────────────────────────────────

/** Create an SFX registry from an array of configs. */
export function createSfxRegistry(configs: SfxConfig[]): Map<string, SfxConfig> {
  const registry = new Map<string, SfxConfig>();
  for (const config of configs) {
    registry.set(config.id, config);
  }
  return registry;
}

/** Look up an SFX config by ID. Returns null if not found. */
export function getSfxConfig(registry: Map<string, SfxConfig>, sfxId: string): SfxConfig | null {
  return registry.get(sfxId) ?? null;
}
