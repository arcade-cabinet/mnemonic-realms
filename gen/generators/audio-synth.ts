/**
 * Audio Synthesis Engine — Pure Node.js PCM Generation
 *
 * Generates WAV audio buffers using mathematical synthesis (no Web Audio API).
 * Supports multiple waveforms, ADSR envelopes, filters, reverb, and
 * musically-accurate note generation from key/scale specifications.
 *
 * Output: Float32 PCM buffers at 44100 Hz, converted to WAV format.
 */

const SAMPLE_RATE = 44100;
const TWO_PI = 2 * Math.PI;

// ---------- Music Theory ----------

/** Semitone offsets from C for each note name. */
const NOTE_OFFSETS: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  'E#': 5,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
  Cb: 11,
  'B#': 0,
};

/** Scale intervals (semitones from root). */
const SCALE_INTERVALS: Record<string, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

/** Parse a key string like "E minor", "C Lydian", "Db major" into root MIDI note + scale. */
export function parseKey(keyStr: string): { rootMidi: number; scale: number[] } {
  const parts = keyStr.trim().split(/\s+/);
  let rootNote = parts[0];
  let mode = parts.length > 1 ? parts.slice(1).join(' ').toLowerCase() : 'major';

  // Handle special cases
  if (keyStr === 'varies' || keyStr.includes('to')) {
    rootNote = 'C';
    mode = 'major';
  }
  if (keyStr === 'free') {
    rootNote = 'A';
    mode = 'aeolian';
  }

  const offset = NOTE_OFFSETS[rootNote] ?? 0;
  // Root at octave 4 (middle C = MIDI 60)
  const rootMidi = 60 + offset;
  const scale = SCALE_INTERVALS[mode] || SCALE_INTERVALS.major;
  return { rootMidi, scale };
}

/** Get MIDI note from scale degree (0-indexed). Supports octave wrapping. */
export function scaleNote(
  rootMidi: number,
  scale: number[],
  degree: number,
  octaveShift = 0,
): number {
  const len = scale.length;
  const octave = Math.floor(degree / len);
  const idx = ((degree % len) + len) % len;
  return rootMidi + scale[idx] + (octave + octaveShift) * 12;
}

/** MIDI note to frequency. */
export function midiToFreq(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

// ---------- Waveform Generators ----------

export type WaveformType = 'sine' | 'triangle' | 'sawtooth' | 'square' | 'noise' | 'pulse';

export function oscillator(phase: number, type: WaveformType, pulseWidth = 0.5): number {
  const p = phase % 1;
  switch (type) {
    case 'sine':
      return Math.sin(p * TWO_PI);
    case 'triangle':
      return 4 * Math.abs(p - 0.5) - 1;
    case 'sawtooth':
      return 2 * p - 1;
    case 'square':
      return p < 0.5 ? 1 : -1;
    case 'pulse':
      return p < pulseWidth ? 1 : -1;
    case 'noise':
      return Math.random() * 2 - 1;
  }
}

// ---------- ADSR Envelope ----------

export interface ADSRParams {
  attack: number; // seconds
  decay: number; // seconds
  sustain: number; // level (0-1)
  release: number; // seconds
}

export function adsrAt(t: number, duration: number, adsr: ADSRParams): number {
  const { attack, decay, sustain, release } = adsr;
  const releaseStart = duration - release;

  if (t < 0) return 0;
  if (t < attack) return t / attack;
  if (t < attack + decay) {
    const decayProgress = (t - attack) / decay;
    return 1 - (1 - sustain) * decayProgress;
  }
  if (t < releaseStart) return sustain;
  if (t < duration) {
    const releaseProgress = (t - releaseStart) / release;
    return sustain * (1 - releaseProgress);
  }
  return 0;
}

// ---------- Simple Low-Pass Filter (1-pole) ----------

export class LowPassFilter {
  private prev = 0;
  private alpha: number;

  constructor(cutoff: number, sampleRate = SAMPLE_RATE) {
    const dt = 1 / sampleRate;
    const rc = 1 / (TWO_PI * cutoff);
    this.alpha = dt / (rc + dt);
  }

  process(sample: number): number {
    this.prev += this.alpha * (sample - this.prev);
    return this.prev;
  }

  reset(): void {
    this.prev = 0;
  }
}

// ---------- Reverb (Schroeder) ----------

class CombFilter {
  private buffer: Float32Array;
  private idx = 0;

  constructor(
    delaySamples: number,
    private feedback: number,
  ) {
    this.buffer = new Float32Array(delaySamples);
  }

  process(input: number): number {
    const out = this.buffer[this.idx];
    this.buffer[this.idx] = input + out * this.feedback;
    this.idx = (this.idx + 1) % this.buffer.length;
    return out;
  }
}

class AllPassFilter {
  private buffer: Float32Array;
  private idx = 0;

  constructor(
    delaySamples: number,
    private feedback: number,
  ) {
    this.buffer = new Float32Array(delaySamples);
  }

  process(input: number): number {
    const buffered = this.buffer[this.idx];
    const out = -input + buffered;
    this.buffer[this.idx] = input + buffered * this.feedback;
    this.idx = (this.idx + 1) % this.buffer.length;
    return out;
  }
}

export class ReverbEffect {
  private combs: CombFilter[];
  private allpasses: AllPassFilter[];
  private wet: number;

  constructor(roomSize = 0.5, wet = 0.3) {
    const baseDelays = [1557, 1617, 1491, 1422];
    const apDelays = [225, 556];
    const feedback = 0.6 + roomSize * 0.29;

    this.combs = baseDelays.map((d) => new CombFilter(d, feedback));
    this.allpasses = apDelays.map((d) => new AllPassFilter(d, 0.5));
    this.wet = wet;
  }

  process(input: number): number {
    let sum = 0;
    for (const c of this.combs) {
      sum += c.process(input);
    }
    sum /= this.combs.length;
    for (const ap of this.allpasses) {
      sum = ap.process(sum);
    }
    return input * (1 - this.wet) + sum * this.wet;
  }
}

// ---------- Note & Pattern Types ----------

export interface NoteEvent {
  time: number; // seconds from start
  duration: number; // seconds
  frequency: number; // Hz
  velocity: number; // 0-1
}

export interface InstrumentConfig {
  waveform: WaveformType;
  adsr: ADSRParams;
  filterCutoff?: number; // Hz, undefined = no filter
  detuneAmount?: number; // cents of detune for chorus effect
  harmonics?: number[]; // array of amplitude multipliers for overtones
  vibratoRate?: number; // Hz
  vibratoDepth?: number; // cents
  tremoloRate?: number; // Hz
  tremoloDepth?: number; // 0-1
  gain?: number; // overall volume multiplier
  reverbWet?: number; // 0-1
  reverbSize?: number; // 0-1
  pulseWidth?: number; // for pulse wave
}

// ---------- Instrument Presets ----------

export const INSTRUMENT_PRESETS: Record<string, InstrumentConfig> = {
  // Strings
  violin: {
    waveform: 'sawtooth',
    adsr: { attack: 0.08, decay: 0.2, sustain: 0.7, release: 0.4 },
    filterCutoff: 4000,
    vibratoRate: 5,
    vibratoDepth: 15,
    harmonics: [1, 0.5, 0.3, 0.2],
    gain: 0.4,
    reverbWet: 0.3,
  },
  viola: {
    waveform: 'sawtooth',
    adsr: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.4 },
    filterCutoff: 3000,
    vibratoRate: 4.5,
    vibratoDepth: 12,
    harmonics: [1, 0.6, 0.3],
    gain: 0.35,
    reverbWet: 0.3,
  },
  cello: {
    waveform: 'sawtooth',
    adsr: { attack: 0.15, decay: 0.3, sustain: 0.75, release: 0.5 },
    filterCutoff: 2500,
    vibratoRate: 4,
    vibratoDepth: 10,
    harmonics: [1, 0.7, 0.4, 0.2],
    gain: 0.45,
    reverbWet: 0.35,
  },
  contrabass: {
    waveform: 'sawtooth',
    adsr: { attack: 0.2, decay: 0.3, sustain: 0.7, release: 0.6 },
    filterCutoff: 1500,
    vibratoRate: 3,
    vibratoDepth: 8,
    harmonics: [1, 0.8, 0.5, 0.3],
    gain: 0.5,
    reverbWet: 0.4,
  },
  strings: {
    waveform: 'sawtooth',
    adsr: { attack: 0.3, decay: 0.4, sustain: 0.65, release: 0.8 },
    filterCutoff: 3500,
    detuneAmount: 8,
    harmonics: [1, 0.6, 0.3, 0.15],
    gain: 0.35,
    reverbWet: 0.4,
  },
  'strings-pizzicato': {
    waveform: 'triangle',
    adsr: { attack: 0.005, decay: 0.15, sustain: 0.0, release: 0.1 },
    filterCutoff: 5000,
    gain: 0.4,
    reverbWet: 0.25,
  },

  // Woodwinds
  flute: {
    waveform: 'sine',
    adsr: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.2 },
    filterCutoff: 6000,
    vibratoRate: 5,
    vibratoDepth: 10,
    harmonics: [1, 0.1, 0.05],
    gain: 0.4,
    reverbWet: 0.3,
  },
  clarinet: {
    waveform: 'square',
    adsr: { attack: 0.04, decay: 0.15, sustain: 0.75, release: 0.25 },
    filterCutoff: 3000,
    vibratoRate: 4,
    vibratoDepth: 8,
    gain: 0.3,
    reverbWet: 0.25,
  },
  oboe: {
    waveform: 'sawtooth',
    adsr: { attack: 0.03, decay: 0.1, sustain: 0.8, release: 0.15 },
    filterCutoff: 4000,
    vibratoRate: 5.5,
    vibratoDepth: 12,
    harmonics: [1, 0.8, 0.6, 0.4],
    gain: 0.3,
    reverbWet: 0.25,
  },
  bassoon: {
    waveform: 'sawtooth',
    adsr: { attack: 0.06, decay: 0.2, sustain: 0.7, release: 0.3 },
    filterCutoff: 2000,
    vibratoRate: 4,
    vibratoDepth: 8,
    harmonics: [1, 0.9, 0.7, 0.4],
    gain: 0.35,
    reverbWet: 0.3,
  },
  'pan-pipes': {
    waveform: 'sine',
    adsr: { attack: 0.1, decay: 0.15, sustain: 0.6, release: 0.5 },
    filterCutoff: 3000,
    harmonics: [1, 0.3, 0.1],
    gain: 0.35,
    reverbWet: 0.45,
  },
  duduk: {
    waveform: 'sawtooth',
    adsr: { attack: 0.15, decay: 0.3, sustain: 0.7, release: 0.5 },
    filterCutoff: 2500,
    vibratoRate: 3.5,
    vibratoDepth: 20,
    harmonics: [1, 0.9, 0.7, 0.5, 0.3],
    gain: 0.35,
    reverbWet: 0.4,
  },

  // Brass
  horn: {
    waveform: 'sawtooth',
    adsr: { attack: 0.08, decay: 0.2, sustain: 0.7, release: 0.3 },
    filterCutoff: 3000,
    vibratoRate: 4,
    vibratoDepth: 8,
    harmonics: [1, 0.7, 0.5, 0.3],
    gain: 0.4,
    reverbWet: 0.35,
  },
  trumpet: {
    waveform: 'square',
    adsr: { attack: 0.04, decay: 0.1, sustain: 0.8, release: 0.2 },
    filterCutoff: 5000,
    vibratoRate: 5,
    vibratoDepth: 10,
    harmonics: [1, 0.6, 0.4, 0.3],
    gain: 0.4,
    reverbWet: 0.3,
  },
  trombone: {
    waveform: 'sawtooth',
    adsr: { attack: 0.06, decay: 0.15, sustain: 0.75, release: 0.3 },
    filterCutoff: 2500,
    vibratoRate: 3.5,
    vibratoDepth: 8,
    harmonics: [1, 0.7, 0.5],
    gain: 0.4,
    reverbWet: 0.3,
  },
  brass: {
    waveform: 'sawtooth',
    adsr: { attack: 0.06, decay: 0.15, sustain: 0.75, release: 0.3 },
    filterCutoff: 3500,
    harmonics: [1, 0.6, 0.4, 0.2],
    gain: 0.4,
    reverbWet: 0.35,
  },
  'low-brass': {
    waveform: 'sawtooth',
    adsr: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.4 },
    filterCutoff: 2000,
    harmonics: [1, 0.8, 0.5, 0.3],
    gain: 0.4,
    reverbWet: 0.4,
  },

  // Keys & Mallet
  piano: {
    waveform: 'triangle',
    adsr: { attack: 0.005, decay: 0.8, sustain: 0.2, release: 1.0 },
    filterCutoff: 5000,
    harmonics: [1, 0.5, 0.25, 0.12],
    gain: 0.4,
    reverbWet: 0.3,
  },
  harp: {
    waveform: 'triangle',
    adsr: { attack: 0.005, decay: 1.2, sustain: 0.1, release: 0.8 },
    filterCutoff: 5000,
    harmonics: [1, 0.3, 0.1],
    gain: 0.35,
    reverbWet: 0.35,
  },
  celesta: {
    waveform: 'sine',
    adsr: { attack: 0.003, decay: 0.8, sustain: 0.1, release: 0.5 },
    filterCutoff: 8000,
    harmonics: [1, 0.3, 0.5],
    gain: 0.3,
    reverbWet: 0.4,
  },
  'music-box': {
    waveform: 'sine',
    adsr: { attack: 0.002, decay: 1.5, sustain: 0.05, release: 0.5 },
    filterCutoff: 8000,
    harmonics: [1, 0.1, 0.4],
    gain: 0.3,
    reverbWet: 0.3,
  },
  glockenspiel: {
    waveform: 'sine',
    adsr: { attack: 0.002, decay: 1.0, sustain: 0.05, release: 0.3 },
    filterCutoff: 10000,
    harmonics: [1, 0.05, 0.3],
    gain: 0.25,
    reverbWet: 0.35,
  },
  vibraphone: {
    waveform: 'sine',
    adsr: { attack: 0.005, decay: 2.0, sustain: 0.15, release: 1.0 },
    filterCutoff: 5000,
    tremoloRate: 5,
    tremoloDepth: 0.15,
    harmonics: [1, 0.1, 0.2],
    gain: 0.3,
    reverbWet: 0.4,
  },

  // Plucked
  guitar: {
    waveform: 'triangle',
    adsr: { attack: 0.003, decay: 0.6, sustain: 0.15, release: 0.4 },
    filterCutoff: 4000,
    harmonics: [1, 0.5, 0.3, 0.15],
    gain: 0.4,
    reverbWet: 0.2,
  },
  fiddle: {
    waveform: 'sawtooth',
    adsr: { attack: 0.03, decay: 0.15, sustain: 0.7, release: 0.2 },
    filterCutoff: 5000,
    vibratoRate: 5.5,
    vibratoDepth: 18,
    harmonics: [1, 0.6, 0.3],
    gain: 0.4,
    reverbWet: 0.2,
  },
  accordion: {
    waveform: 'square',
    adsr: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.2 },
    filterCutoff: 3000,
    detuneAmount: 6,
    harmonics: [1, 0.4, 0.2],
    gain: 0.3,
    reverbWet: 0.2,
  },

  // Percussion
  timpani: {
    waveform: 'sine',
    adsr: { attack: 0.005, decay: 1.0, sustain: 0.1, release: 0.5 },
    filterCutoff: 800,
    harmonics: [1, 0.6, 0.3],
    gain: 0.5,
    reverbWet: 0.4,
  },
  'bass-drum': {
    waveform: 'sine',
    adsr: { attack: 0.003, decay: 0.3, sustain: 0.0, release: 0.2 },
    filterCutoff: 400,
    gain: 0.5,
    reverbWet: 0.3,
  },
  snare: {
    waveform: 'noise',
    adsr: { attack: 0.002, decay: 0.15, sustain: 0.0, release: 0.1 },
    filterCutoff: 6000,
    gain: 0.35,
    reverbWet: 0.2,
  },
  cymbal: {
    waveform: 'noise',
    adsr: { attack: 0.005, decay: 1.5, sustain: 0.0, release: 0.5 },
    filterCutoff: 10000,
    gain: 0.2,
    reverbWet: 0.3,
  },
  'hand-drum': {
    waveform: 'noise',
    adsr: { attack: 0.003, decay: 0.2, sustain: 0.0, release: 0.1 },
    filterCutoff: 3000,
    gain: 0.3,
    reverbWet: 0.15,
  },
  'triangle-perc': {
    waveform: 'sine',
    adsr: { attack: 0.001, decay: 1.5, sustain: 0.0, release: 0.5 },
    filterCutoff: 12000,
    harmonics: [1, 0, 0.3, 0, 0.15],
    gain: 0.2,
    reverbWet: 0.35,
  },
  'tam-tam': {
    waveform: 'noise',
    adsr: { attack: 0.3, decay: 3.0, sustain: 0.2, release: 2.0 },
    filterCutoff: 2000,
    gain: 0.25,
    reverbWet: 0.5,
  },
  bell: {
    waveform: 'sine',
    adsr: { attack: 0.002, decay: 2.0, sustain: 0.05, release: 1.0 },
    filterCutoff: 8000,
    harmonics: [1, 0.3, 0.6, 0.2, 0.4],
    gain: 0.25,
    reverbWet: 0.45,
  },
  'wind-chime': {
    waveform: 'sine',
    adsr: { attack: 0.001, decay: 1.2, sustain: 0.0, release: 0.8 },
    filterCutoff: 10000,
    harmonics: [1, 0.1, 0.5, 0.05, 0.25],
    gain: 0.15,
    reverbWet: 0.5,
  },
  shaker: {
    waveform: 'noise',
    adsr: { attack: 0.002, decay: 0.1, sustain: 0.0, release: 0.05 },
    filterCutoff: 8000,
    gain: 0.2,
    reverbWet: 0.1,
  },

  // Voices
  choir: {
    waveform: 'sine',
    adsr: { attack: 0.5, decay: 0.5, sustain: 0.7, release: 1.0 },
    filterCutoff: 3000,
    detuneAmount: 12,
    vibratoRate: 4,
    vibratoDepth: 12,
    harmonics: [1, 0.6, 0.3, 0.15],
    gain: 0.35,
    reverbWet: 0.5,
  },
  soprano: {
    waveform: 'sine',
    adsr: { attack: 0.3, decay: 0.4, sustain: 0.75, release: 0.8 },
    filterCutoff: 5000,
    vibratoRate: 5,
    vibratoDepth: 15,
    harmonics: [1, 0.3, 0.15],
    gain: 0.35,
    reverbWet: 0.45,
  },
  humming: {
    waveform: 'sine',
    adsr: { attack: 0.4, decay: 0.3, sustain: 0.6, release: 0.6 },
    filterCutoff: 1500,
    vibratoRate: 3,
    vibratoDepth: 8,
    harmonics: [1, 0.5, 0.2],
    gain: 0.25,
    reverbWet: 0.4,
  },

  // Synth/Special
  pad: {
    waveform: 'sawtooth',
    adsr: { attack: 1.0, decay: 0.5, sustain: 0.6, release: 2.0 },
    filterCutoff: 2000,
    detuneAmount: 10,
    gain: 0.25,
    reverbWet: 0.5,
  },
  'glass-harmonica': {
    waveform: 'sine',
    adsr: { attack: 0.3, decay: 1.0, sustain: 0.5, release: 1.5 },
    filterCutoff: 6000,
    harmonics: [1, 0.05, 0.3, 0.02, 0.15],
    gain: 0.25,
    reverbWet: 0.55,
  },
  'singing-bowl': {
    waveform: 'sine',
    adsr: { attack: 0.5, decay: 3.0, sustain: 0.4, release: 3.0 },
    filterCutoff: 4000,
    harmonics: [1, 0.2, 0.5, 0.1, 0.3],
    gain: 0.3,
    reverbWet: 0.6,
  },
  drone: {
    waveform: 'sawtooth',
    adsr: { attack: 2.0, decay: 1.0, sustain: 0.8, release: 3.0 },
    filterCutoff: 1000,
    detuneAmount: 5,
    gain: 0.3,
    reverbWet: 0.5,
  },
  'tin-whistle': {
    waveform: 'sine',
    adsr: { attack: 0.02, decay: 0.08, sustain: 0.85, release: 0.12 },
    filterCutoff: 8000,
    vibratoRate: 6,
    vibratoDepth: 12,
    harmonics: [1, 0.15, 0.05],
    gain: 0.35,
    reverbWet: 0.2,
  },
  'electric-bass': {
    waveform: 'sawtooth',
    adsr: { attack: 0.005, decay: 0.3, sustain: 0.5, release: 0.2 },
    filterCutoff: 2000,
    gain: 0.45,
    reverbWet: 0.1,
  },
};

// ---------- Rendering ----------

/** Render a single note with the given instrument config. */
export function renderNote(
  note: NoteEvent,
  config: InstrumentConfig,
  sampleRate = SAMPLE_RATE,
): Float32Array {
  const totalSamples = Math.ceil((note.duration + (config.adsr.release || 0)) * sampleRate);
  const output = new Float32Array(totalSamples);
  renderNoteInto(output, 0, note, config, sampleRate);
  return output;
}

/**
 * Render a note directly into a destination buffer at the given sample offset.
 * This avoids per-note allocation when rendering many notes.
 */
export function renderNoteInto(
  dest: Float32Array,
  offsetSamples: number,
  note: NoteEvent,
  config: InstrumentConfig,
  sampleRate = SAMPLE_RATE,
): void {
  const releaseSec = config.adsr.release || 0;
  const totalSamples = Math.ceil((note.duration + releaseSec) * sampleRate);
  const gain = (config.gain ?? 0.5) * note.velocity;
  const harmonicList = config.harmonics ?? [1];
  const hasVibrato = !!(config.vibratoRate && config.vibratoDepth);
  const hasDetune = !!config.detuneAmount;
  const hasTremolo = !!(config.tremoloRate && config.tremoloDepth);
  const filter = config.filterCutoff ? new LowPassFilter(config.filterCutoff, sampleRate) : null;

  // Pre-compute detune frequency ratio
  const detunedFreq = hasDetune ? note.frequency * 2 ** (config.detuneAmount! / 1200) : 0;

  const invSampleRate = 1 / sampleRate;

  for (let i = 0; i < totalSamples; i++) {
    const destIdx = offsetSamples + i;
    if (destIdx < 0 || destIdx >= dest.length) continue;

    const t = i * invSampleRate;
    const env = adsrAt(t, note.duration, config.adsr);
    if (env < 0.001) continue; // Skip inaudible samples

    // Vibrato
    let freq = note.frequency;
    if (hasVibrato) {
      const freqMod = Math.sin(TWO_PI * config.vibratoRate! * t) * config.vibratoDepth!;
      freq = note.frequency * 2 ** (freqMod / 1200);
    }

    // Generate sample with harmonics
    let sample = 0;
    for (let h = 0; h < harmonicList.length; h++) {
      const harmAmp = harmonicList[h];
      if (harmAmp === 0) continue;
      const phase = (freq * (h + 1) * t) % 1;
      sample += oscillator(phase, config.waveform, config.pulseWidth) * harmAmp;
    }

    // Detune (chorus)
    if (hasDetune) {
      const phaseD = (detunedFreq * t) % 1;
      sample = (sample + oscillator(phaseD, config.waveform, config.pulseWidth)) * 0.5;
    }

    // Tremolo
    if (hasTremolo) {
      const trem =
        1 - config.tremoloDepth! * (0.5 + 0.5 * Math.sin(TWO_PI * config.tremoloRate! * t));
      sample *= trem;
    }

    // Filter
    if (filter) {
      sample = filter.process(sample);
    }

    dest[destIdx] += sample * env * gain;
  }
}

/** Mix a rendered note into a buffer at a given time offset. */
export function mixInto(dest: Float32Array, source: Float32Array, offsetSamples: number): void {
  const end = Math.min(source.length, dest.length - offsetSamples);
  for (let i = 0; i < end; i++) {
    const destIdx = offsetSamples + i;
    if (destIdx >= 0 && destIdx < dest.length) {
      dest[destIdx] += source[i];
    }
  }
}

/** Apply reverb to an entire buffer. Uses lightweight delay for long buffers. */
export function applyReverb(buffer: Float32Array, roomSize = 0.5, wet = 0.3): Float32Array {
  const len = buffer.length;

  // For buffers > 30 seconds, use a lightweight stereo delay instead of full reverb
  // This keeps processing time reasonable for long tracks
  if (len > SAMPLE_RATE * 30) {
    return applySimpleDelay(buffer, roomSize, wet);
  }

  const reverb = new ReverbEffect(roomSize, wet);
  const output = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    output[i] = reverb.process(buffer[i]);
  }
  return output;
}

/** Lightweight delay effect for long audio buffers. */
function applySimpleDelay(buffer: Float32Array, roomSize: number, wet: number): Float32Array {
  const len = buffer.length;
  const output = new Float32Array(len);

  // Two delay taps for simple ambience
  const delay1 = Math.floor(0.03 * SAMPLE_RATE * (1 + roomSize));
  const delay2 = Math.floor(0.07 * SAMPLE_RATE * (1 + roomSize));
  const feedback = 0.3 + roomSize * 0.2;

  const delayBuf1 = new Float32Array(delay1);
  const delayBuf2 = new Float32Array(delay2);
  let idx1 = 0;
  let idx2 = 0;

  for (let i = 0; i < len; i++) {
    const d1 = delayBuf1[idx1];
    const d2 = delayBuf2[idx2];
    const wetSig = (d1 + d2) * 0.5;

    output[i] = buffer[i] * (1 - wet) + wetSig * wet;

    delayBuf1[idx1] = buffer[i] + d1 * feedback;
    delayBuf2[idx2] = buffer[i] + d2 * feedback;

    idx1 = (idx1 + 1) % delay1;
    idx2 = (idx2 + 1) % delay2;
  }

  return output;
}

/** Normalize audio buffer to prevent clipping. */
export function normalize(buffer: Float32Array, targetPeak = 0.85): Float32Array {
  let peak = 0;
  for (let i = 0; i < buffer.length; i++) {
    const abs = Math.abs(buffer[i]);
    if (abs > peak) peak = abs;
  }
  if (peak === 0) return buffer;
  const scale = targetPeak / peak;
  const output = new Float32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    output[i] = buffer[i] * scale;
  }
  return output;
}

/** Soft limiter to tame transients. */
export function softLimit(buffer: Float32Array): Float32Array {
  const output = new Float32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    output[i] = Math.tanh(buffer[i] * 1.5) / 1.5;
  }
  return output;
}

/** Apply a fade-in and fade-out to a buffer. */
export function applyFades(
  buffer: Float32Array,
  fadeInSec: number,
  fadeOutSec: number,
  sampleRate = SAMPLE_RATE,
): void {
  const fadeInSamples = Math.min(Math.floor(fadeInSec * sampleRate), buffer.length);
  const fadeOutSamples = Math.min(Math.floor(fadeOutSec * sampleRate), buffer.length);
  for (let i = 0; i < fadeInSamples; i++) {
    buffer[i] *= i / fadeInSamples;
  }
  for (let i = 0; i < fadeOutSamples; i++) {
    buffer[buffer.length - 1 - i] *= i / fadeOutSamples;
  }
}

// ---------- WAV Encoding ----------

/** Encode Float32 PCM samples to a 16-bit WAV buffer. */
export function encodeWav(samples: Float32Array, sampleRate = SAMPLE_RATE): Buffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const headerSize = 44;
  const buffer = Buffer.alloc(headerSize + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // Audio format: PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    const int16 = clamped < 0 ? clamped * 32768 : clamped * 32767;
    buffer.writeInt16LE(Math.round(int16), headerSize + i * 2);
  }

  return buffer;
}

export { SAMPLE_RATE };
