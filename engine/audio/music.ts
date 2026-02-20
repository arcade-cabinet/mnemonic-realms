/**
 * Mnemonic Realms — BGM State Machine (Pure Functions)
 *
 * Manages music playback state: track selection, crossfading between zones,
 * pause/resume. All functions are pure — no Web Audio API, no side effects.
 * The caller is responsible for actual audio playback.
 */

import type { MusicState } from './types.js';

// ── Factory ──────────────────────────────────────────────────────────────────

/** Create the initial idle music state. */
export function createMusicState(): MusicState {
  return {
    phase: 'idle',
    currentTrack: null,
    nextTrack: null,
    crossfadeProgress: 0,
    volume: 1,
  };
}

// ── Transitions ──────────────────────────────────────────────────────────────

/** Start playing a track from idle or replace current track immediately. */
export function startTrack(state: MusicState, trackId: string): MusicState {
  return {
    ...state,
    phase: 'playing',
    currentTrack: trackId,
    nextTrack: null,
    crossfadeProgress: 0,
  };
}

/**
 * Begin crossfading from the current track to a new track.
 * Only valid when currently playing. Returns unchanged state otherwise.
 */
export function beginCrossfade(state: MusicState, nextTrackId: string): MusicState {
  if (state.phase !== 'playing' || state.currentTrack === null) {
    return state;
  }
  return {
    ...state,
    phase: 'crossfading',
    nextTrack: nextTrackId,
    crossfadeProgress: 0,
  };
}

/**
 * Advance crossfade progress by deltaProgress (0→1 range).
 * Clamps to [0, 1]. Only valid during crossfading phase.
 */
export function updateCrossfade(state: MusicState, deltaProgress: number): MusicState {
  if (state.phase !== 'crossfading') {
    return state;
  }
  const progress = Math.min(1, Math.max(0, state.crossfadeProgress + deltaProgress));
  return {
    ...state,
    crossfadeProgress: progress,
  };
}

/**
 * Complete the crossfade: swap nextTrack → currentTrack, return to playing.
 * Only valid during crossfading phase.
 */
export function completeCrossfade(state: MusicState): MusicState {
  if (state.phase !== 'crossfading') {
    return state;
  }
  return {
    ...state,
    phase: 'playing',
    currentTrack: state.nextTrack,
    nextTrack: null,
    crossfadeProgress: 0,
  };
}

/** Pause music playback. Only valid when playing or crossfading. */
export function pause(state: MusicState): MusicState {
  if (state.phase !== 'playing' && state.phase !== 'crossfading') {
    return state;
  }
  return {
    ...state,
    phase: 'paused',
  };
}

/** Resume music playback from paused state. Returns to playing. */
export function resume(state: MusicState): MusicState {
  if (state.phase !== 'paused') {
    return state;
  }
  return {
    ...state,
    phase: 'playing',
  };
}
