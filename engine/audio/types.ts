/**
 * Mnemonic Realms — Audio System Types
 *
 * Pure type definitions for BGM state machine, SFX config,
 * and vibrancy-driven BiquadFilterNode frequency mapping.
 */

// ── BGM State Machine ────────────────────────────────────────────────────────

/** Current phase of the music playback state machine. */
export type AudioPhase = 'idle' | 'playing' | 'crossfading' | 'paused';

/** Immutable state for the BGM music system. */
export interface MusicState {
  /** Current phase of the music state machine. */
  phase: AudioPhase;
  /** Currently playing track ID (null when idle). */
  currentTrack: string | null;
  /** Track being crossfaded to (null when not crossfading). */
  nextTrack: string | null;
  /** Crossfade progress 0→1 (0 = all current, 1 = all next). */
  crossfadeProgress: number;
  /** Master volume 0→1. */
  volume: number;
}

// ── SFX ──────────────────────────────────────────────────────────────────────

/** Configuration for a single sound effect. */
export interface SfxConfig {
  /** Unique SFX identifier (e.g., 'chest-open'). */
  id: string;
  /** Asset file path relative to assets/audio/sfx/. */
  file: string;
  /** Playback volume 0→1. */
  volume: number;
}

// ── Vibrancy Filter ──────────────────────────────────────────────────────────

/** State for the BiquadFilterNode lowpass frequency driven by vibrancy. */
export interface VibrancyFilterState {
  /** Current lowpass frequency in Hz (2000 muffled → 20000 vivid). */
  frequency: number;
}
