import { describe, expect, it } from 'vitest';
import {
  beginCrossfade,
  completeCrossfade,
  createMusicState,
  pause,
  resume,
  startTrack,
  updateCrossfade,
} from '../../../../engine/audio/music';

// ── createMusicState ─────────────────────────────────────────────────────────

describe('createMusicState', () => {
  it('starts in idle phase with no tracks', () => {
    const state = createMusicState();
    expect(state.phase).toBe('idle');
    expect(state.currentTrack).toBeNull();
    expect(state.nextTrack).toBeNull();
    expect(state.crossfadeProgress).toBe(0);
    expect(state.volume).toBe(1);
  });
});

// ── startTrack ───────────────────────────────────────────────────────────────

describe('startTrack', () => {
  it('transitions from idle to playing with the given track', () => {
    const state = startTrack(createMusicState(), 'everwick-theme');
    expect(state.phase).toBe('playing');
    expect(state.currentTrack).toBe('everwick-theme');
    expect(state.nextTrack).toBeNull();
    expect(state.crossfadeProgress).toBe(0);
  });

  it('replaces current track when already playing', () => {
    const playing = startTrack(createMusicState(), 'everwick-theme');
    const replaced = startTrack(playing, 'heartfield-theme');
    expect(replaced.phase).toBe('playing');
    expect(replaced.currentTrack).toBe('heartfield-theme');
  });

  it('preserves volume', () => {
    const state = createMusicState();
    const started = startTrack({ ...state, volume: 0.5 }, 'track-a');
    expect(started.volume).toBe(0.5);
  });
});

// ── beginCrossfade ───────────────────────────────────────────────────────────

describe('beginCrossfade', () => {
  it('sets up crossfade from playing state', () => {
    const playing = startTrack(createMusicState(), 'track-a');
    const fading = beginCrossfade(playing, 'track-b');
    expect(fading.phase).toBe('crossfading');
    expect(fading.currentTrack).toBe('track-a');
    expect(fading.nextTrack).toBe('track-b');
    expect(fading.crossfadeProgress).toBe(0);
  });

  it('returns unchanged state when idle', () => {
    const idle = createMusicState();
    const result = beginCrossfade(idle, 'track-b');
    expect(result).toBe(idle);
  });

  it('returns unchanged state when paused', () => {
    const playing = startTrack(createMusicState(), 'track-a');
    const paused = pause(playing);
    const result = beginCrossfade(paused, 'track-b');
    expect(result).toBe(paused);
  });
});

// ── updateCrossfade ──────────────────────────────────────────────────────────

describe('updateCrossfade', () => {
  it('advances crossfade progress', () => {
    const playing = startTrack(createMusicState(), 'track-a');
    const fading = beginCrossfade(playing, 'track-b');
    const updated = updateCrossfade(fading, 0.3);
    expect(updated.crossfadeProgress).toBeCloseTo(0.3);
  });

  it('clamps progress to 1', () => {
    const playing = startTrack(createMusicState(), 'track-a');
    const fading = beginCrossfade(playing, 'track-b');
    const updated = updateCrossfade(fading, 1.5);
    expect(updated.crossfadeProgress).toBe(1);
  });

  it('accumulates progress across multiple updates', () => {
    const playing = startTrack(createMusicState(), 'track-a');
    let state = beginCrossfade(playing, 'track-b');
    state = updateCrossfade(state, 0.25);
    state = updateCrossfade(state, 0.25);
    expect(state.crossfadeProgress).toBeCloseTo(0.5);
  });

  it('returns unchanged state when not crossfading', () => {
    const playing = startTrack(createMusicState(), 'track-a');
    const result = updateCrossfade(playing, 0.5);
    expect(result).toBe(playing);
  });
});

// ── completeCrossfade ────────────────────────────────────────────────────────

describe('completeCrossfade', () => {
  it('swaps nextTrack to currentTrack and returns to playing', () => {
    const playing = startTrack(createMusicState(), 'track-a');
    const fading = beginCrossfade(playing, 'track-b');
    const completed = completeCrossfade(updateCrossfade(fading, 1));
    expect(completed.phase).toBe('playing');
    expect(completed.currentTrack).toBe('track-b');
    expect(completed.nextTrack).toBeNull();
    expect(completed.crossfadeProgress).toBe(0);
  });

  it('returns unchanged state when not crossfading', () => {
    const playing = startTrack(createMusicState(), 'track-a');
    const result = completeCrossfade(playing);
    expect(result).toBe(playing);
  });
});

// ── pause / resume ───────────────────────────────────────────────────────────

describe('pause', () => {
  it('pauses from playing state', () => {
    const playing = startTrack(createMusicState(), 'track-a');
    const paused = pause(playing);
    expect(paused.phase).toBe('paused');
    expect(paused.currentTrack).toBe('track-a');
  });

  it('pauses from crossfading state', () => {
    const playing = startTrack(createMusicState(), 'track-a');
    const fading = beginCrossfade(playing, 'track-b');
    const paused = pause(fading);
    expect(paused.phase).toBe('paused');
  });

  it('returns unchanged state when idle', () => {
    const idle = createMusicState();
    expect(pause(idle)).toBe(idle);
  });
});

describe('resume', () => {
  it('resumes from paused to playing', () => {
    const playing = startTrack(createMusicState(), 'track-a');
    const paused = pause(playing);
    const resumed = resume(paused);
    expect(resumed.phase).toBe('playing');
    expect(resumed.currentTrack).toBe('track-a');
  });

  it('returns unchanged state when not paused', () => {
    const playing = startTrack(createMusicState(), 'track-a');
    expect(resume(playing)).toBe(playing);
  });
});

