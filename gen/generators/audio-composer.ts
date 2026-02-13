/**
 * Audio Composer — Generates musical patterns from manifest specifications.
 *
 * Translates manifest metadata (tempo, key, mood, instruments, description)
 * into sequences of NoteEvents that can be rendered by the synthesis engine.
 */

import type { AmbientAsset } from '../schemas/audio-ambient';
import type { BgmAsset, BgmStem } from '../schemas/audio-bgm';
import {
  type ADSRParams,
  applyFades,
  applyReverb,
  encodeWav,
  INSTRUMENT_PRESETS,
  type InstrumentConfig,
  LowPassFilter,
  midiToFreq,
  mixInto,
  type NoteEvent,
  normalize,
  parseKey,
  renderNote,
  renderNoteInto,
  SAMPLE_RATE,
  scaleNote,
  softLimit,
  type WaveformType,
} from './audio-synth';

// ---------- Instrument Resolution ----------

/** Map manifest instrument descriptions to synthesis presets. */
function resolveInstrument(description: string): InstrumentConfig {
  const d = description.toLowerCase();

  // Exact match attempts
  for (const [name, preset] of Object.entries(INSTRUMENT_PRESETS)) {
    if (d.includes(name.replace(/-/g, ' '))) return { ...preset };
  }

  // Fuzzy matching
  if (d.includes('violin') || d.includes('solo violin')) return { ...INSTRUMENT_PRESETS['violin'] };
  if (d.includes('fiddle')) return { ...INSTRUMENT_PRESETS['fiddle'] };
  if (d.includes('viola')) return { ...INSTRUMENT_PRESETS['viola'] };
  if (d.includes('cello')) return { ...INSTRUMENT_PRESETS['cello'] };
  if (d.includes('contrabass') || d.includes('double bass'))
    return { ...INSTRUMENT_PRESETS['contrabass'] };
  if (d.includes('pizzicato') || d.includes('pizz'))
    return { ...INSTRUMENT_PRESETS['strings-pizzicato'] };
  if (d.includes('string')) return { ...INSTRUMENT_PRESETS['strings'] };
  if (d.includes('flute') || d.includes('recorder')) return { ...INSTRUMENT_PRESETS['flute'] };
  if (d.includes('clarinet')) return { ...INSTRUMENT_PRESETS['clarinet'] };
  if (d.includes('oboe')) return { ...INSTRUMENT_PRESETS['oboe'] };
  if (d.includes('bassoon')) return { ...INSTRUMENT_PRESETS['bassoon'] };
  if (d.includes('pan pipe')) return { ...INSTRUMENT_PRESETS['pan-pipes'] };
  if (d.includes('duduk')) return { ...INSTRUMENT_PRESETS['duduk'] };
  if (d.includes('tin whistle') || d.includes('whistle'))
    return { ...INSTRUMENT_PRESETS['tin-whistle'] };
  if (d.includes('french horn') || d.includes('horn')) return { ...INSTRUMENT_PRESETS['horn'] };
  if (d.includes('trumpet')) return { ...INSTRUMENT_PRESETS['trumpet'] };
  if (d.includes('trombone')) return { ...INSTRUMENT_PRESETS['trombone'] };
  if (d.includes('low brass')) return { ...INSTRUMENT_PRESETS['low-brass'] };
  if (d.includes('brass')) return { ...INSTRUMENT_PRESETS['brass'] };
  if (d.includes('piano')) return { ...INSTRUMENT_PRESETS['piano'] };
  if (d.includes('harp')) return { ...INSTRUMENT_PRESETS['harp'] };
  if (d.includes('celesta') || d.includes('celestia')) return { ...INSTRUMENT_PRESETS['celesta'] };
  if (d.includes('music box')) return { ...INSTRUMENT_PRESETS['music-box'] };
  if (d.includes('glockenspiel')) return { ...INSTRUMENT_PRESETS['glockenspiel'] };
  if (d.includes('vibraphone')) return { ...INSTRUMENT_PRESETS['vibraphone'] };
  if (d.includes('guitar') || d.includes('nylon')) return { ...INSTRUMENT_PRESETS['guitar'] };
  if (d.includes('accordion')) return { ...INSTRUMENT_PRESETS['accordion'] };
  if (d.includes('timpani')) return { ...INSTRUMENT_PRESETS['timpani'] };
  if (d.includes('bass drum')) return { ...INSTRUMENT_PRESETS['bass-drum'] };
  if (d.includes('snare')) return { ...INSTRUMENT_PRESETS['snare'] };
  if (d.includes('cymbal')) return { ...INSTRUMENT_PRESETS['cymbal'] };
  if (d.includes('tam-tam') || d.includes('tamtam')) return { ...INSTRUMENT_PRESETS['tam-tam'] };
  if (d.includes('triangle') && !d.includes('waveform'))
    return { ...INSTRUMENT_PRESETS['triangle-perc'] };
  if (d.includes('wind chime')) return { ...INSTRUMENT_PRESETS['wind-chime'] };
  if (d.includes('hand drum') || d.includes('bodhran'))
    return { ...INSTRUMENT_PRESETS['hand-drum'] };
  if (d.includes('shaker')) return { ...INSTRUMENT_PRESETS['shaker'] };
  if (d.includes('bell')) return { ...INSTRUMENT_PRESETS['bell'] };
  if (d.includes('choir') || d.includes('voices') || d.includes('vocal'))
    return { ...INSTRUMENT_PRESETS['choir'] };
  if (d.includes('soprano')) return { ...INSTRUMENT_PRESETS['soprano'] };
  if (d.includes('humming')) return { ...INSTRUMENT_PRESETS['humming'] };
  if (d.includes('glass harmonica') || d.includes('glass armonica'))
    return { ...INSTRUMENT_PRESETS['glass-harmonica'] };
  if (d.includes('singing bowl')) return { ...INSTRUMENT_PRESETS['singing-bowl'] };
  if (d.includes('drone')) return { ...INSTRUMENT_PRESETS['drone'] };
  if (d.includes('pad') || d.includes('synth')) return { ...INSTRUMENT_PRESETS['pad'] };
  if (d.includes('electric bass') || d.includes('bass guitar'))
    return { ...INSTRUMENT_PRESETS['electric-bass'] };

  // Default
  return { ...INSTRUMENT_PRESETS['pad'] };
}

// ---------- Pattern Generators ----------

type MoodType = string;

/** Seeded pseudo-random for deterministic composition. */
class SeededRng {
  private seed: number;
  constructor(seed: string) {
    this.seed = 0;
    for (let i = 0; i < seed.length; i++) {
      this.seed = (this.seed * 31 + seed.charCodeAt(i)) & 0x7fffffff;
    }
    if (this.seed === 0) this.seed = 1;
  }
  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return (this.seed >>> 16) / 32768;
  }
  nextInt(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

/** Parse time signature to beats per measure and beat value. */
function parseTimeSig(ts: string): { beatsPerMeasure: number; beatValue: number } {
  if (ts === 'free') return { beatsPerMeasure: 4, beatValue: 4 };
  const parts = ts.split('/');
  return {
    beatsPerMeasure: Number(parts[0]) || 4,
    beatValue: Number(parts[1]) || 4,
  };
}

/** Get note duration in seconds for a given beat division at tempo. */
function beatDuration(tempo: number, division = 1): number {
  return (60 / tempo) * division;
}

/** Generate a melody line based on mood and scale. */
function generateMelody(
  rng: SeededRng,
  rootMidi: number,
  scale: number[],
  tempo: number,
  timeSig: { beatsPerMeasure: number; beatValue: number },
  durationSec: number,
  mood: MoodType,
  octaveShift: number,
): NoteEvent[] {
  const events: NoteEvent[] = [];
  const beat = beatDuration(tempo);
  const measureLen = timeSig.beatsPerMeasure * beat;
  const numMeasures = Math.ceil(durationSec / measureLen);

  // Mood-based parameters
  let stepRange = 3; // Max scale steps per jump
  let restProb = 0.15; // Probability of rest
  let holdProb = 0.2; // Probability of holding a note
  let dynamics = 0.7; // Base velocity

  switch (mood) {
    case 'gentle':
    case 'tender':
    case 'pastoral':
      stepRange = 2;
      restProb = 0.2;
      holdProb = 0.3;
      dynamics = 0.5;
      break;
    case 'lively':
    case 'energetic':
    case 'triumphant':
      stepRange = 4;
      restProb = 0.1;
      holdProb = 0.1;
      dynamics = 0.85;
      break;
    case 'mysterious':
    case 'ethereal':
    case 'reflective':
      stepRange = 3;
      restProb = 0.25;
      holdProb = 0.35;
      dynamics = 0.55;
      break;
    case 'epic':
    case 'determined':
      stepRange = 5;
      restProb = 0.1;
      holdProb = 0.15;
      dynamics = 0.9;
      break;
    case 'ancient':
    case 'sacred':
    case 'primordial':
      stepRange = 2;
      restProb = 0.3;
      holdProb = 0.4;
      dynamics = 0.5;
      break;
    case 'cold':
    case 'stark':
    case 'austere':
    case 'tense':
      stepRange = 3;
      restProb = 0.2;
      holdProb = 0.25;
      dynamics = 0.6;
      break;
    case 'warm':
    case 'nostalgic':
    case 'joyful':
      stepRange = 3;
      restProb = 0.15;
      holdProb = 0.25;
      dynamics = 0.7;
      break;
    case 'melancholic':
      stepRange = 2;
      restProb = 0.2;
      holdProb = 0.35;
      dynamics = 0.5;
      break;
    case 'expansive':
      stepRange = 4;
      restProb = 0.2;
      holdProb = 0.3;
      dynamics = 0.65;
      break;
    case 'transcendent':
      stepRange = 4;
      restProb = 0.15;
      holdProb = 0.3;
      dynamics = 0.75;
      break;
  }

  let currentDegree = 0; // Start on root
  let time = 0;

  for (let m = 0; m < numMeasures && time < durationSec; m++) {
    const beatsInMeasure = timeSig.beatsPerMeasure;

    for (let b = 0; b < beatsInMeasure && time < durationSec; b++) {
      // Decide subdivisions
      const subdivisions = rng.next() < 0.3 ? 2 : 1;

      for (let s = 0; s < subdivisions && time < durationSec; s++) {
        const noteDur = beat / subdivisions;

        // Rest?
        if (rng.next() < restProb) {
          time += noteDur;
          continue;
        }

        // Hold previous note?
        if (rng.next() < holdProb && events.length > 0) {
          events[events.length - 1].duration += noteDur;
          time += noteDur;
          continue;
        }

        // Move to new scale degree
        const step = rng.nextInt(-stepRange, stepRange);
        currentDegree += step;
        // Keep in reasonable range
        currentDegree = Math.max(-7, Math.min(14, currentDegree));

        const midi = scaleNote(rootMidi, scale, currentDegree, octaveShift);
        const freq = midiToFreq(midi);
        const vel = dynamics + rng.next() * 0.15 - 0.075;

        events.push({
          time,
          duration: noteDur * 0.9, // Slight gap between notes
          frequency: freq,
          velocity: Math.max(0.1, Math.min(1, vel)),
        });

        time += noteDur;
      }
    }
  }

  return events;
}

/** Generate an arpeggio pattern. */
function generateArpeggio(
  rng: SeededRng,
  rootMidi: number,
  scale: number[],
  tempo: number,
  timeSig: { beatsPerMeasure: number; beatValue: number },
  durationSec: number,
  octaveShift: number,
  velocity: number,
): NoteEvent[] {
  const events: NoteEvent[] = [];
  const beat = beatDuration(tempo);
  const arpDiv = beat / 2; // Eighth notes
  let time = 0;

  // Chord degrees for arpeggio
  const chordPatterns = [
    [0, 2, 4, 2], // I
    [3, 5, 7, 5], // IV
    [4, 6, 8, 6], // V
    [0, 2, 4, 7], // I add
  ];

  let patIdx = 0;
  while (time < durationSec) {
    const pattern = chordPatterns[patIdx % chordPatterns.length];
    const measDur = timeSig.beatsPerMeasure * beat;

    for (let i = 0; i < Math.floor(measDur / arpDiv) && time < durationSec; i++) {
      const degree = pattern[i % pattern.length];
      const midi = scaleNote(rootMidi, scale, degree, octaveShift);
      events.push({
        time,
        duration: arpDiv * 0.8,
        frequency: midiToFreq(midi),
        velocity: velocity + rng.next() * 0.1 - 0.05,
      });
      time += arpDiv;
    }
    patIdx++;
  }

  return events;
}

/** Generate sustained chord pads. */
function generateChordPad(
  rng: SeededRng,
  rootMidi: number,
  scale: number[],
  tempo: number,
  timeSig: { beatsPerMeasure: number; beatValue: number },
  durationSec: number,
  octaveShift: number,
  velocity: number,
): NoteEvent[] {
  const events: NoteEvent[] = [];
  const beat = beatDuration(tempo);
  const chordDur = timeSig.beatsPerMeasure * beat * 2; // 2 measures per chord

  // Chord progressions
  const progressions = [
    [
      [0, 2, 4],
      [5, 7, 9],
      [3, 5, 7],
      [4, 6, 8],
    ], // I-vi-IV-V
    [
      [0, 2, 4],
      [3, 5, 7],
      [4, 6, 8],
      [0, 2, 4],
    ], // I-IV-V-I
    [
      [0, 2, 4],
      [4, 6, 8],
      [5, 7, 9],
      [3, 5, 7],
    ], // I-V-vi-IV
  ];
  const prog = rng.pick(progressions);

  let time = 0;
  let chordIdx = 0;
  while (time < durationSec) {
    const chord = prog[chordIdx % prog.length];
    const dur = Math.min(chordDur, durationSec - time);

    if (dur < 0.1) break; // Avoid infinite loop on trailing fraction

    for (const degree of chord) {
      const midi = scaleNote(rootMidi, scale, degree, octaveShift);
      events.push({
        time,
        duration: dur * 0.95,
        frequency: midiToFreq(midi),
        velocity: velocity * (0.8 + rng.next() * 0.2),
      });
    }

    time += dur;
    chordIdx++;
  }

  return events;
}

/** Generate a bass line. */
function generateBassLine(
  rng: SeededRng,
  rootMidi: number,
  scale: number[],
  tempo: number,
  timeSig: { beatsPerMeasure: number; beatValue: number },
  durationSec: number,
  velocity: number,
): NoteEvent[] {
  const events: NoteEvent[] = [];
  const beat = beatDuration(tempo);
  const bassOctave = -2;

  const rootDegrees = [0, 3, 4, 0]; // I-IV-V-I in scale degrees
  let time = 0;
  let chordIdx = 0;
  const chordDur = timeSig.beatsPerMeasure * beat * 2;

  while (time < durationSec) {
    const root = rootDegrees[chordIdx % rootDegrees.length];
    const dur = Math.min(chordDur, durationSec - time);
    const beatsInChord = Math.floor(dur / beat);

    if (beatsInChord === 0) break; // Avoid infinite loop on trailing partial beat

    for (let b = 0; b < beatsInChord && time < durationSec; b++) {
      // Bass plays root on beat 1, fifth on beat 3
      const degree = b % 2 === 0 ? root : root + 4;
      const midi = scaleNote(rootMidi, scale, degree, bassOctave);

      events.push({
        time,
        duration: beat * 0.8,
        frequency: midiToFreq(midi),
        velocity: velocity * (b === 0 ? 1 : 0.7),
      });

      time += beat;
    }
    chordIdx++;
  }

  return events;
}

/** Generate a rhythmic percussion pattern. */
function generatePercussionPattern(
  rng: SeededRng,
  tempo: number,
  timeSig: { beatsPerMeasure: number; beatValue: number },
  durationSec: number,
  instrument: InstrumentConfig,
  baseFreq: number,
  velocity: number,
  density: number,
): NoteEvent[] {
  const events: NoteEvent[] = [];
  const beat = beatDuration(tempo);
  const div = beat / 2;
  let time = 0;

  while (time < durationSec) {
    for (let b = 0; b < timeSig.beatsPerMeasure * 2 && time < durationSec; b++) {
      const isDownbeat = b % 2 === 0;
      const prob = isDownbeat ? density : density * 0.5;

      if (rng.next() < prob) {
        events.push({
          time,
          duration: div * 0.4,
          frequency: baseFreq * (1 + rng.next() * 0.1),
          velocity: velocity * (isDownbeat ? 1 : 0.6),
        });
      }
      time += div;
    }
  }

  return events;
}

/** Generate a drone/sustain note. */
function generateDrone(
  rootMidi: number,
  scale: number[],
  durationSec: number,
  octaveShift: number,
  velocity: number,
): NoteEvent[] {
  const midi = scaleNote(rootMidi, scale, 0, octaveShift);
  return [
    {
      time: 0,
      duration: durationSec,
      frequency: midiToFreq(midi),
      velocity,
    },
  ];
}

// ---------- Stem Composition ----------

/** Determine what kind of musical pattern to generate for a stem. */
function categorizeRole(stemDesc: string, instruments: string): string {
  const combined = (stemDesc + ' ' + instruments).toLowerCase();

  if (
    combined.includes('rhythm') ||
    combined.includes('percussion') ||
    combined.includes('drum') ||
    combined.includes('snare') ||
    combined.includes('timpani')
  )
    return 'rhythm';
  if (combined.includes('bass') && !combined.includes('clarinet')) return 'bass';
  if (combined.includes('melody') || combined.includes('solo') || combined.includes('theme'))
    return 'melody';
  if (
    combined.includes('arpeggi') ||
    combined.includes('broken chord') ||
    combined.includes('fingerpick')
  )
    return 'arpeggio';
  if (
    combined.includes('drone') ||
    combined.includes('sustain') ||
    combined.includes('pad') ||
    combined.includes('harmonic')
  )
    return 'drone';
  if (
    combined.includes('choir') ||
    combined.includes('voice') ||
    combined.includes('vocal') ||
    combined.includes('singing') ||
    combined.includes('humming')
  )
    return 'choir';
  if (
    combined.includes('chord') ||
    combined.includes('support') ||
    combined.includes('harmoni') ||
    combined.includes('foundation') ||
    combined.includes('bed')
  )
    return 'chords';
  if (
    combined.includes('sparkle') ||
    combined.includes('chime') ||
    combined.includes('bell') ||
    combined.includes('drip')
  )
    return 'accent';

  // Default based on layer
  return 'melody';
}

/** Compose a single BGM stem to a WAV buffer. */
export function composeBgmStem(bgm: BgmAsset, stem: BgmStem): Buffer {
  const { rootMidi, scale } = parseKey(bgm.key);
  const timeSig = parseTimeSig(bgm.timeSignature);
  const rng = new SeededRng(`${bgm.id}-${stem.layer}`);
  const instrument = resolveInstrument(stem.instruments);
  const role = categorizeRole(stem.description, stem.instruments);
  const durationSec = bgm.durationSec;

  // Adjust instrument based on mood
  if (bgm.mood === 'cold' || bgm.mood === 'austere') {
    if (instrument.vibratoDepth) instrument.vibratoDepth *= 0.5;
    if (instrument.reverbWet) instrument.reverbWet *= 0.7;
  }
  if (bgm.mood === 'ethereal' || bgm.mood === 'transcendent') {
    instrument.reverbWet = Math.min(0.7, (instrument.reverbWet ?? 0.3) * 1.5);
  }

  console.log(`      Layer ${stem.layer}: ${role} [${stem.instruments.substring(0, 40)}]`);

  // Generate note events based on role
  let notes: NoteEvent[];
  const octaveForLayer = stem.layer <= 2 ? 0 : stem.layer === 3 ? -1 : 0;

  switch (role) {
    case 'melody':
      notes = generateMelody(
        rng,
        rootMidi,
        scale,
        bgm.tempo,
        timeSig,
        durationSec,
        bgm.mood,
        octaveForLayer,
      );
      break;
    case 'arpeggio':
      notes = generateArpeggio(
        rng,
        rootMidi,
        scale,
        bgm.tempo,
        timeSig,
        durationSec,
        octaveForLayer,
        0.5,
      );
      break;
    case 'chords':
      notes = generateChordPad(
        rng,
        rootMidi,
        scale,
        bgm.tempo,
        timeSig,
        durationSec,
        octaveForLayer,
        0.4,
      );
      break;
    case 'bass':
      notes = generateBassLine(rng, rootMidi, scale, bgm.tempo, timeSig, durationSec, 0.6);
      break;
    case 'rhythm':
      notes = generatePercussionPattern(
        rng,
        bgm.tempo,
        timeSig,
        durationSec,
        instrument,
        100,
        0.5,
        0.7,
      );
      break;
    case 'drone':
      notes = generateDrone(rootMidi, scale, durationSec, -1, 0.4);
      break;
    case 'choir':
      notes = generateChordPad(rng, rootMidi, scale, bgm.tempo, timeSig, durationSec, 0, 0.35);
      break;
    case 'accent': {
      // Sparse accent notes at irregular intervals
      notes = [];
      let t = rng.next() * 2;
      while (t < durationSec) {
        const degree = rng.nextInt(0, scale.length - 1);
        const midi = scaleNote(rootMidi, scale, degree, 1);
        notes.push({
          time: t,
          duration: 0.5 + rng.next() * 1.5,
          frequency: midiToFreq(midi),
          velocity: 0.2 + rng.next() * 0.2,
        });
        t += 1.5 + rng.next() * 4;
      }
      break;
    }
    default:
      notes = generateMelody(
        rng,
        rootMidi,
        scale,
        bgm.tempo,
        timeSig,
        durationSec,
        bgm.mood,
        octaveForLayer,
      );
  }

  // Render to audio buffer — directly into destination (zero-allocation per note)
  const totalSamples = Math.ceil((durationSec + 3) * SAMPLE_RATE); // extra 3s for release tails
  const buffer = new Float32Array(totalSamples);

  for (const note of notes) {
    const offset = Math.floor(note.time * SAMPLE_RATE);
    renderNoteInto(buffer, offset, note, instrument);
  }

  // Trim to actual duration + 1s tail
  const trimmedLen = Math.ceil((durationSec + 1) * SAMPLE_RATE);
  const trimmed = buffer.subarray(0, Math.min(trimmedLen, buffer.length));

  // Post-processing
  let processed = softLimit(trimmed);
  if (instrument.reverbWet && instrument.reverbWet > 0) {
    processed = applyReverb(processed, instrument.reverbSize ?? 0.5, instrument.reverbWet);
  }
  processed = normalize(processed, 0.8);
  applyFades(processed, 0.5, 1.0);

  return encodeWav(processed);
}

// ---------- Ambient Composition ----------

/** Compose an ambient loop from biome description. */
export function composeAmbientLoop(asset: AmbientAsset): Buffer {
  const rng = new SeededRng(asset.id);
  const durationSec = 30; // 30-second loop
  const totalSamples = Math.ceil(durationSec * SAMPLE_RATE);
  const buffer = new Float32Array(totalSamples);
  const biome = asset.biome;

  console.log(`    Composing ambient: ${asset.name} (${biome})`);

  // Each biome gets a unique combination of synthesized textures
  switch (biome) {
    case 'village': {
      // Birdsong + distant chatter texture
      addBirdSounds(buffer, rng, durationSec, 0.3);
      addWindTexture(buffer, rng, durationSec, 0.1, 2000);
      addRandomChimes(buffer, rng, durationSec, 0.08, 1500, 4000);
      break;
    }
    case 'grassland': {
      // Wind + insects + occasional bird
      addWindTexture(buffer, rng, durationSec, 0.25, 1500);
      addInsectBuzz(buffer, rng, durationSec, 0.15);
      addBirdSounds(buffer, rng, durationSec, 0.1);
      break;
    }
    case 'forest': {
      // Rustling leaves + birds + woodpecker
      addWindTexture(buffer, rng, durationSec, 0.2, 2500);
      addBirdSounds(buffer, rng, durationSec, 0.2);
      addWoodpecker(buffer, rng, durationSec, 0.15);
      break;
    }
    case 'mountain': {
      // Wind howl + distant rumble
      addWindTexture(buffer, rng, durationSec, 0.35, 800);
      addLowRumble(buffer, rng, durationSec, 0.15);
      addBirdSounds(buffer, rng, durationSec, 0.05);
      break;
    }
    case 'riverside': {
      // Flowing water + splashing
      addWaterFlow(buffer, rng, durationSec, 0.35);
      addWaterSplash(buffer, rng, durationSec, 0.15);
      addBirdSounds(buffer, rng, durationSec, 0.08);
      break;
    }
    case 'wetland': {
      // Frogs + dripping + insects
      addFrogChorus(buffer, rng, durationSec, 0.25);
      addWaterDrips(buffer, rng, durationSec, 0.2);
      addInsectBuzz(buffer, rng, durationSec, 0.15);
      break;
    }
    case 'plains': {
      // Open wind + grass
      addWindTexture(buffer, rng, durationSec, 0.3, 1200);
      addLowRumble(buffer, rng, durationSec, 0.05);
      break;
    }
    case 'dungeon': {
      // Dripping + rumble + echo
      addWaterDrips(buffer, rng, durationSec, 0.25);
      addLowRumble(buffer, rng, durationSec, 0.2);
      addCaveEcho(buffer, rng, durationSec, 0.15);
      break;
    }
    case 'sketch': {
      // Near silence, faint scratching
      addScratchTexture(buffer, rng, durationSec, 0.08);
      break;
    }
    case 'stagnation': {
      // Crystal tinkle + frozen wind
      addCrystalTinkle(buffer, rng, durationSec, 0.2);
      addWindTexture(buffer, rng, durationSec, 0.15, 600);
      break;
    }
  }

  let processed = softLimit(buffer);
  processed = normalize(processed, 0.7);
  // Crossfade for seamless looping
  const crossfadeSamples = Math.floor(SAMPLE_RATE * 2);
  for (let i = 0; i < crossfadeSamples; i++) {
    const fade = i / crossfadeSamples;
    const endIdx = processed.length - crossfadeSamples + i;
    processed[i] = processed[i] * fade + processed[endIdx] * (1 - fade);
  }
  applyFades(processed, 0.3, 0.3);

  return encodeWav(processed);
}

// ---------- Ambient Sound Elements ----------

function addWindTexture(
  buffer: Float32Array,
  rng: SeededRng,
  dur: number,
  volume: number,
  cutoffHz: number,
): void {
  const filter = new LowPassFilter(cutoffHz);
  for (let i = 0; i < buffer.length; i++) {
    const t = i / SAMPLE_RATE;
    const windMod = 0.5 + 0.5 * Math.sin(0.2 * Math.PI * t + rng.next() * 0.01);
    let sample = (Math.random() * 2 - 1) * windMod * volume;
    sample = filter.process(sample);
    buffer[i] += sample;
  }
}

function addBirdSounds(buffer: Float32Array, rng: SeededRng, dur: number, volume: number): void {
  // Bird chirps as short FM-synthesis bursts
  let t = rng.next() * 2;
  while (t < dur) {
    const chirpDur = 0.05 + rng.next() * 0.15;
    const baseFreq = 2000 + rng.next() * 3000;
    const modFreq = 10 + rng.next() * 30;
    const startSample = Math.floor(t * SAMPLE_RATE);
    const numSamples = Math.floor(chirpDur * SAMPLE_RATE);

    for (let i = 0; i < numSamples && startSample + i < buffer.length; i++) {
      const st = i / SAMPLE_RATE;
      const env = Math.sin((Math.PI * st) / chirpDur);
      const freq = baseFreq + Math.sin(2 * Math.PI * modFreq * st) * baseFreq * 0.3;
      buffer[startSample + i] += Math.sin(2 * Math.PI * freq * st) * env * volume * 0.3;
    }

    // Repeat chirp pattern 1-3 times
    const repeats = rng.nextInt(1, 3);
    for (let r = 1; r < repeats; r++) {
      const repeatStart = startSample + Math.floor((chirpDur + 0.05) * r * SAMPLE_RATE);
      for (let i = 0; i < numSamples && repeatStart + i < buffer.length; i++) {
        const st = i / SAMPLE_RATE;
        const env = Math.sin((Math.PI * st) / chirpDur);
        const freq = baseFreq * 1.1 + Math.sin(2 * Math.PI * modFreq * st) * baseFreq * 0.3;
        buffer[repeatStart + i] += Math.sin(2 * Math.PI * freq * st) * env * volume * 0.25;
      }
    }

    t += 1.5 + rng.next() * 5;
  }
}

function addInsectBuzz(buffer: Float32Array, rng: SeededRng, dur: number, volume: number): void {
  // Continuous buzz with amplitude modulation
  const buzzFreq = 120 + rng.next() * 80;
  for (let i = 0; i < buffer.length; i++) {
    const t = i / SAMPLE_RATE;
    const ampMod = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(0.5 * Math.PI * t));
    const sample =
      Math.sin(2 * Math.PI * buzzFreq * t) * 0.3 +
      Math.sin(2 * Math.PI * buzzFreq * 1.01 * t) * 0.2;
    buffer[i] += sample * ampMod * volume * 0.15;
  }
}

function addWaterFlow(buffer: Float32Array, rng: SeededRng, dur: number, volume: number): void {
  // Filtered noise with slow modulation
  let prev1 = 0;
  let prev2 = 0;
  for (let i = 0; i < buffer.length; i++) {
    const t = i / SAMPLE_RATE;
    const mod = 0.6 + 0.4 * Math.sin(0.15 * Math.PI * t);
    const noise = Math.random() * 2 - 1;
    // Two-pole low-pass
    prev1 += 0.01 * (noise - prev1);
    prev2 += 0.02 * (prev1 - prev2);
    buffer[i] += prev2 * mod * volume * 3;
  }
}

function addWaterSplash(buffer: Float32Array, rng: SeededRng, dur: number, volume: number): void {
  let t = rng.next() * 3;
  while (t < dur) {
    const splashDur = 0.1 + rng.next() * 0.2;
    const startSample = Math.floor(t * SAMPLE_RATE);
    const numSamples = Math.floor(splashDur * SAMPLE_RATE);
    for (let i = 0; i < numSamples && startSample + i < buffer.length; i++) {
      const st = i / SAMPLE_RATE;
      const env = Math.exp(-st / (splashDur * 0.3));
      buffer[startSample + i] += (Math.random() * 2 - 1) * env * volume * 0.2;
    }
    t += 2 + rng.next() * 6;
  }
}

function addWaterDrips(buffer: Float32Array, rng: SeededRng, dur: number, volume: number): void {
  let t = rng.next() * 1;
  while (t < dur) {
    const freq = 800 + rng.next() * 2000;
    const dripDur = 0.03 + rng.next() * 0.06;
    const startSample = Math.floor(t * SAMPLE_RATE);
    const numSamples = Math.floor(dripDur * SAMPLE_RATE);
    for (let i = 0; i < numSamples && startSample + i < buffer.length; i++) {
      const st = i / SAMPLE_RATE;
      const env = Math.exp(-st / (dripDur * 0.2));
      buffer[startSample + i] += Math.sin(2 * Math.PI * freq * st) * env * volume * 0.3;
    }
    t += 0.5 + rng.next() * 3;
  }
}

function addFrogChorus(buffer: Float32Array, rng: SeededRng, dur: number, volume: number): void {
  // Multiple frog voices at different frequencies
  const numFrogs = 3 + Math.floor(rng.next() * 4);
  for (let f = 0; f < numFrogs; f++) {
    const baseFreq = 200 + rng.next() * 400;
    let t = rng.next() * 2;
    while (t < dur) {
      const croakDur = 0.1 + rng.next() * 0.15;
      const startSample = Math.floor(t * SAMPLE_RATE);
      const numSamples = Math.floor(croakDur * SAMPLE_RATE);
      for (let i = 0; i < numSamples && startSample + i < buffer.length; i++) {
        const st = i / SAMPLE_RATE;
        const env = Math.sin((Math.PI * st) / croakDur);
        const freqMod = baseFreq * (1 + 0.1 * Math.sin(2 * Math.PI * 30 * st));
        buffer[startSample + i] +=
          (Math.sin(2 * Math.PI * freqMod * st) > 0 ? 1 : -1) * env * volume * 0.1;
      }
      // Repeat croak
      if (rng.next() < 0.6) {
        const gap = 0.1 + rng.next() * 0.1;
        t += croakDur + gap;
        // Second croak
        const s2 = Math.floor(t * SAMPLE_RATE);
        for (let i = 0; i < numSamples && s2 + i < buffer.length; i++) {
          const st = i / SAMPLE_RATE;
          const env = Math.sin((Math.PI * st) / croakDur);
          buffer[s2 + i] +=
            (Math.sin(2 * Math.PI * baseFreq * 1.2 * st) > 0 ? 1 : -1) * env * volume * 0.08;
        }
      }
      t += 0.5 + rng.next() * 4;
    }
  }
}

function addLowRumble(buffer: Float32Array, rng: SeededRng, dur: number, volume: number): void {
  for (let i = 0; i < buffer.length; i++) {
    const t = i / SAMPLE_RATE;
    const mod = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(0.05 * Math.PI * t));
    const sample =
      Math.sin(2 * Math.PI * 30 * t) * 0.5 +
      Math.sin(2 * Math.PI * 45 * t) * 0.3 +
      Math.sin(2 * Math.PI * 60 * t) * 0.2;
    buffer[i] += sample * mod * volume * 0.3;
  }
}

function addCaveEcho(buffer: Float32Array, rng: SeededRng, dur: number, volume: number): void {
  // Occasional tonal echoes
  let t = rng.next() * 3;
  while (t < dur) {
    const freq = 200 + rng.next() * 300;
    const echoDur = 0.5 + rng.next() * 1.5;
    const startSample = Math.floor(t * SAMPLE_RATE);
    const numSamples = Math.floor(echoDur * SAMPLE_RATE);
    for (let i = 0; i < numSamples && startSample + i < buffer.length; i++) {
      const st = i / SAMPLE_RATE;
      const env = Math.exp(-st / (echoDur * 0.4));
      buffer[startSample + i] += Math.sin(2 * Math.PI * freq * st) * env * volume * 0.15;
    }
    t += 3 + rng.next() * 8;
  }
}

function addWoodpecker(buffer: Float32Array, rng: SeededRng, dur: number, volume: number): void {
  let t = rng.next() * 5;
  while (t < dur) {
    const numTaps = 3 + Math.floor(rng.next() * 5);
    for (let tap = 0; tap < numTaps; tap++) {
      const tapTime = t + tap * 0.08;
      const startSample = Math.floor(tapTime * SAMPLE_RATE);
      const tapDur = 0.015;
      const numSamples = Math.floor(tapDur * SAMPLE_RATE);
      for (let i = 0; i < numSamples && startSample + i < buffer.length; i++) {
        const st = i / SAMPLE_RATE;
        const env = Math.exp(-st / 0.003);
        buffer[startSample + i] += (Math.random() * 2 - 1) * env * volume * 0.3;
      }
    }
    t += 4 + rng.next() * 10;
  }
}

function addScratchTexture(
  buffer: Float32Array,
  rng: SeededRng,
  dur: number,
  volume: number,
): void {
  let t = rng.next() * 2;
  while (t < dur) {
    const scratchDur = 0.3 + rng.next() * 0.5;
    const startSample = Math.floor(t * SAMPLE_RATE);
    const numSamples = Math.floor(scratchDur * SAMPLE_RATE);
    for (let i = 0; i < numSamples && startSample + i < buffer.length; i++) {
      const st = i / SAMPLE_RATE;
      const env = Math.sin((Math.PI * st) / scratchDur) * 0.5;
      const noise = Math.random() * 2 - 1;
      // Very filtered noise
      buffer[startSample + i] += noise * env * volume * 0.05;
    }
    t += 1.5 + rng.next() * 4;
  }
}

function addRandomChimes(
  buffer: Float32Array,
  rng: SeededRng,
  dur: number,
  volume: number,
  minHz: number,
  maxHz: number,
): void {
  // Randomly placed chime tones with inharmonic overtones (like metal wind chimes)
  let t = rng.next() * 1.5;
  while (t < dur) {
    const freq = minHz + rng.next() * (maxHz - minHz);
    const chimeDur = 0.4 + rng.next() * 0.8;
    const startSample = Math.floor(t * SAMPLE_RATE);
    const numSamples = Math.floor(chimeDur * SAMPLE_RATE);
    for (let i = 0; i < numSamples && startSample + i < buffer.length; i++) {
      const st = i / SAMPLE_RATE;
      const env = Math.exp(-st / (chimeDur * 0.25));
      // Chimes have slightly inharmonic partials (metal resonance)
      const sample =
        Math.sin(2 * Math.PI * freq * st) * 0.5 +
        Math.sin(2 * Math.PI * freq * 2.32 * st) * 0.25 +
        Math.sin(2 * Math.PI * freq * 4.17 * st) * 0.15 +
        Math.sin(2 * Math.PI * freq * 6.85 * st) * 0.1;
      buffer[startSample + i] += sample * env * volume * 0.2;
    }
    t += 1 + rng.next() * 4;
  }
}

function addCrystalTinkle(buffer: Float32Array, rng: SeededRng, dur: number, volume: number): void {
  let t = rng.next() * 1;
  while (t < dur) {
    const freq = 3000 + rng.next() * 5000;
    const tinkleDur = 0.3 + rng.next() * 1.0;
    const startSample = Math.floor(t * SAMPLE_RATE);
    const numSamples = Math.floor(tinkleDur * SAMPLE_RATE);
    for (let i = 0; i < numSamples && startSample + i < buffer.length; i++) {
      const st = i / SAMPLE_RATE;
      const env = Math.exp(-st / (tinkleDur * 0.3));
      const sample =
        Math.sin(2 * Math.PI * freq * st) * 0.5 +
        Math.sin(2 * Math.PI * freq * 2.756 * st) * 0.3 +
        Math.sin(2 * Math.PI * freq * 5.404 * st) * 0.2;
      buffer[startSample + i] += sample * env * volume * 0.15;
    }
    t += 1 + rng.next() * 3;
  }
}
