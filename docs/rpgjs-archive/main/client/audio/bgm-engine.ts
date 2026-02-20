/** BGM Engine — Web Audio API 4-layer playback with vibrancy gain and stagnation effects. */

const LAYER_THRESHOLDS = [0, 34, 67, 85];
const FADE_IN = 4,
  FADE_OUT = 6;

interface Layer {
  source: AudioBufferSourceNode;
  gain: GainNode;
  buffer: AudioBuffer;
}

let ctx: AudioContext | null = null;
let layers: Layer[] = [];
let currentZone = '';
let masterGain: GainNode | null = null;
let filter: BiquadFilterNode | null = null;
let stagnant = false;
let bgmVolume = 0.7;

function ensureContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  return ctx;
}

function ensureMaster(): GainNode {
  if (!masterGain) {
    const ac = ensureContext();
    filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 20000;
    masterGain = ac.createGain();
    masterGain.gain.value = bgmVolume;
    filter.connect(masterGain);
    masterGain.connect(ac.destination);
  }
  return masterGain;
}

export async function loadZone(zoneId: string, stemUrls: string[]): Promise<void> {
  if (zoneId === currentZone) return;
  stopBgm();
  currentZone = zoneId;
  const ac = ensureContext();
  ensureMaster();

  const loaded: Layer[] = [];
  for (const url of stemUrls) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const arrayBuf = await resp.arrayBuffer();
      const buffer = await ac.decodeAudioData(arrayBuf);
      const source = ac.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const gain = ac.createGain();
      gain.gain.value = 0;
      source.connect(gain);
      if (filter) gain.connect(filter);
      loaded.push({ source, gain, buffer });
    } catch {
      // Stem not available yet — skip
    }
  }

  layers = loaded;
}

export function startBgm(): void {
  const ac = ensureContext();
  for (const layer of layers) {
    try {
      layer.source.start(0);
    } catch {
      // Already started — recreate source
      const source = ac.createBufferSource();
      source.buffer = layer.buffer;
      source.loop = true;
      source.connect(layer.gain);
      layer.source = source;
      source.start(0);
    }
  }
  if (layers.length > 0) {
    const ac2 = ensureContext();
    layers[0].gain.gain.linearRampToValueAtTime(1, ac2.currentTime + 0.5);
  }
}

export function stopBgm(): void {
  for (const layer of layers) {
    try {
      layer.source.stop();
    } catch {
      /* already stopped */
    }
    layer.source.disconnect();
    layer.gain.disconnect();
  }
  layers = [];
  currentZone = '';
}

export function updateVibrancy(vibrancy: number): void {
  if (!ctx) return;
  for (let i = 0; i < layers.length; i++) {
    const threshold = LAYER_THRESHOLDS[i] ?? 100;
    const target = vibrancy >= threshold ? 1 : 0;
    const current = layers[i].gain.gain.value;
    if (Math.abs(current - target) > 0.01) {
      const dur = target > 0 ? FADE_IN : FADE_OUT;
      layers[i].gain.gain.linearRampToValueAtTime(target, ctx.currentTime + dur);
    }
  }
}

export function enterStagnation(): void {
  if (stagnant || !ctx) return;
  stagnant = true;
  for (let i = 1; i < layers.length; i++) {
    layers[i].gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
  }
  if (filter) {
    filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 2);
  }
  for (const layer of layers) {
    layer.source.playbackRate.linearRampToValueAtTime(0.7, ctx.currentTime + 2);
  }
}

export function exitStagnation(): void {
  if (!stagnant || !ctx) return;
  stagnant = false;
  if (filter) {
    filter.frequency.linearRampToValueAtTime(20000, ctx.currentTime + 0.5);
  }
  for (const layer of layers) {
    layer.source.playbackRate.linearRampToValueAtTime(1, ctx.currentTime + 0.5);
  }
  for (let i = 1; i < layers.length; i++) {
    layers[i].gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);
  }
}

export function setBgmVolume(v: number): void {
  bgmVolume = Math.max(0, Math.min(1, v));
  if (masterGain && ctx) {
    masterGain.gain.linearRampToValueAtTime(bgmVolume, ctx.currentTime + 0.3);
  }
}

export function getCurrentZone(): string {
  return currentZone;
}

/** Expose AudioContext for shared use (e.g. audio-manager init). */
export function getAudioContext(): AudioContext {
  return ensureContext();
}
