/**
 * SFX Engine — plays pre-recorded .ogg sound effects from assets/audio/sfx/.
 *
 * Each SFX ID maps to an .ogg filename. On first play, the file is loaded
 * into an HTMLAudioElement and cached. Subsequent plays reuse the cached
 * Audio via cloneNode for overlapping sounds.
 */

import { SFX_FILES, type SfxId } from './sfx-presets';

const SFX_BASE = 'audio/sfx';

const cache = new Map<SfxId, HTMLAudioElement>();
const failedIds = new Set<SfxId>();

let sfxVolume = 0.85;
let uiVolume = 0.8;
let muffled = false;

function getOrCreate(id: SfxId): HTMLAudioElement | null {
  if (failedIds.has(id)) return null;
  let audio = cache.get(id);
  if (!audio) {
    const filename = SFX_FILES[id];
    if (!filename) return null;
    audio = new Audio(`${SFX_BASE}/${filename}`);
    audio.preload = 'auto';
    // Mark as failed if the file can't load (not yet generated)
    audio.addEventListener(
      'error',
      () => {
        failedIds.add(id);
        cache.delete(id);
      },
      { once: true },
    );
    cache.set(id, audio);
  }
  return audio;
}

export function playSfx(id: SfxId): void {
  const base = getOrCreate(id);
  if (!base) return;
  const clone = base.cloneNode() as HTMLAudioElement;
  const isUi = id.startsWith('SFX-UI');
  clone.volume = isUi ? uiVolume : sfxVolume;
  if (muffled && !isUi) {
    clone.volume *= 0.4;
  }
  clone.play().catch(() => {});
}

export function setSfxVolume(v: number): void {
  sfxVolume = Math.max(0, Math.min(1, v));
}

export function setUiVolume(v: number): void {
  uiVolume = Math.max(0, Math.min(1, v));
}

export function setMuffled(on: boolean): void {
  muffled = on;
}

export function preloadAllSfx(): void {
  for (const id of Object.keys(SFX_FILES) as SfxId[]) {
    getOrCreate(id);
  }
}
