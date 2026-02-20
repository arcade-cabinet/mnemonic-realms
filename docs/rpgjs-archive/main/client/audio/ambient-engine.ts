/**
 * Ambient Engine — looping background soundscapes per biome.
 *
 * Uses a simple HTMLAudioElement with looping. Each biome has a
 * default volume from the spec. Crossfades between biomes on zone change.
 */

const CROSSFADE_MS = 1500;

interface AmbientState {
  audio: HTMLAudioElement;
  biome: string;
  targetVolume: number;
  fadeInterval: number | null;
}

let current: AmbientState | null = null;
let ambientScale = 1;

function fadeVolume(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  durationMs: number,
  onDone?: () => void,
): number {
  const steps = 30;
  const stepMs = durationMs / steps;
  const delta = (to - from) / steps;
  let step = 0;
  return window.setInterval(() => {
    step++;
    audio.volume = Math.max(0, Math.min(1, from + delta * step));
    if (step >= steps) {
      audio.volume = Math.max(0, Math.min(1, to));
      onDone?.();
    }
  }, stepMs);
}

export function playAmbient(biome: string, url: string, volume: number): void {
  if (current?.biome === biome) return;

  const defaultVol = volume * ambientScale;

  // Fade out current
  if (current) {
    const old = current;
    if (old.fadeInterval) clearInterval(old.fadeInterval);
    old.fadeInterval = fadeVolume(old.audio, old.audio.volume, 0, CROSSFADE_MS, () => {
      old.audio.pause();
      old.audio.src = '';
      if (old.fadeInterval) clearInterval(old.fadeInterval);
    });
  }

  // Start new
  const audio = new Audio(url);
  audio.loop = true;
  audio.volume = 0;
  audio.play().catch(() => {});

  const fadeInterval = fadeVolume(audio, 0, defaultVol, CROSSFADE_MS);

  current = { audio, biome, targetVolume: defaultVol, fadeInterval };
}

export function stopAmbient(): void {
  if (!current) return;
  if (current.fadeInterval) clearInterval(current.fadeInterval);
  current.audio.pause();
  current.audio.src = '';
  current = null;
}

export function setAmbientScale(scale: number): void {
  ambientScale = Math.max(0, Math.min(1, scale));
  if (current) {
    const newVol = current.targetVolume * ambientScale;
    current.audio.volume = Math.max(0, Math.min(1, newVol));
  }
}

export function setStagnationAmbient(url: string): void {
  playAmbient('stagnation', url, 0.2);
}
