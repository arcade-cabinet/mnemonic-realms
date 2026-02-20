/**
 * Mnemonic Realms — Audio System Barrel Exports
 *
 * Pure state management and computations for BGM, SFX, and vibrancy filter.
 * No Web Audio API — the caller handles actual playback.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export type { AudioPhase, MusicState, SfxConfig, VibrancyFilterState } from './types.js';

// ── Music (BGM) ──────────────────────────────────────────────────────────────

export {
  beginCrossfade,
  completeCrossfade,
  createMusicState,
  pause,
  resume,
  startTrack,
  updateCrossfade,
} from './music.js';

// ── SFX ──────────────────────────────────────────────────────────────────────

export {
  createSfxRegistry,
  getSfxConfig,
  SFX_CHEST_OPEN,
  SFX_COMBAT_HIT,
  SFX_COMBAT_MISS,
  SFX_DIALOGUE_ADVANCE,
  SFX_ITEM_PICKUP,
  SFX_LEVEL_UP,
  SFX_MENU_CANCEL,
  SFX_MENU_SELECT,
  SFX_QUEST_COMPLETE,
  SFX_TRANSITION,
  STANDARD_SFX_IDS,
} from './sfx.js';

// ── Vibrancy Filter ──────────────────────────────────────────────────────────

export {
  FREQUENCY_FORGOTTEN,
  FREQUENCY_PARTIAL,
  FREQUENCY_REMEMBERED,
  getFilterFrequency,
  lerpFrequency,
} from './vibrancy-filter.js';
