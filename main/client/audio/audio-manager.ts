/**
 * MnemonicAudioManager — coordinates SFX, BGM, and ambient audio.
 *
 * Bridges RPG-JS game events to the three audio engines:
 * - SFX: pre-recorded .ogg one-shots from Freesound
 * - BGM: Web Audio API 4-layer vibrancy system
 * - Ambient: looping biome soundscapes
 *
 * Usage: import { audioManager } from './audio-manager';
 *        audioManager.init();  // call once on first user interaction
 */

import { playAmbient, setAmbientScale, setStagnationAmbient, stopAmbient } from './ambient-engine';
import {
  enterStagnation,
  exitStagnation,
  getAudioContext,
  loadZone,
  setBgmVolume,
  startBgm,
  stopBgm,
  updateVibrancy,
} from './bgm-engine';
import { playSfx, preloadAllSfx, setMuffled, setSfxVolume, setUiVolume } from './sfx-engine';
import type { SfxId } from './sfx-presets';
import { getAmbientUrl, getStemUrls, ZONE_AUDIO } from './zone-audio-map';

let initialized = false;

export const audioManager = {
  async init(): Promise<void> {
    if (initialized) return;
    // Resume AudioContext (browsers require user gesture)
    const ac = getAudioContext();
    if (ac.state === 'suspended') {
      await ac.resume();
    }
    preloadAllSfx();
    initialized = true;
  },

  isReady(): boolean {
    return initialized;
  },

  // -- SFX --
  playSfx(id: SfxId): void {
    if (!initialized) return;
    playSfx(id);
  },

  // -- Zone changes --
  async changeZone(zoneId: string, vibrancy?: number): Promise<void> {
    if (!initialized) return;
    const zone = ZONE_AUDIO[zoneId];
    if (!zone) return;

    const stemUrls = getStemUrls(zone.bgmId, zone.stemCount);
    const ambientUrl = getAmbientUrl(zone.ambientBiome);

    await loadZone(zoneId, stemUrls);
    startBgm();
    playAmbient(zone.ambientBiome, ambientUrl, zone.ambientVolume);

    if (vibrancy !== undefined) {
      updateVibrancy(vibrancy);
    }
  },

  // -- Vibrancy --
  setVibrancy(vibrancy: number): void {
    updateVibrancy(vibrancy);
  },

  // -- Stagnation --
  enterStagnation(): void {
    enterStagnation();
    setMuffled(true);
    setStagnationAmbient(getAmbientUrl('stagnation'));
  },

  exitStagnation(zoneId: string): void {
    exitStagnation();
    setMuffled(false);
    const zone = ZONE_AUDIO[zoneId];
    if (zone) {
      playAmbient(zone.ambientBiome, getAmbientUrl(zone.ambientBiome), zone.ambientVolume);
    }
  },

  // -- Combat --
  async startCombat(boss = false): Promise<void> {
    if (!initialized) return;
    const bgmId = boss ? 'bgm-boss' : 'bgm-btl';
    const stemUrls = getStemUrls(bgmId, 4);
    await loadZone(`combat-${bgmId}`, stemUrls);
    startBgm();
    updateVibrancy(100); // combat always full layers
  },

  async endCombat(zoneId: string, vibrancy: number): Promise<void> {
    await this.changeZone(zoneId, vibrancy);
  },

  // -- Volume --
  setBgmVolume(v: number): void {
    setBgmVolume(v);
  },
  setSfxVolume(v: number): void {
    setSfxVolume(v);
  },
  setUiVolume(v: number): void {
    setUiVolume(v);
  },
  setAmbientScale(v: number): void {
    setAmbientScale(v);
  },

  // -- Cleanup --
  stop(): void {
    stopBgm();
    stopAmbient();
  },
};
