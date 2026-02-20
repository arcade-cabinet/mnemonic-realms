/**
 * Zone Audio Map — maps zone IDs to BGM stems and ambient biome.
 *
 * BGM stem files are OGG, loaded from assets/audio/bgm/.
 * Ambient loop files are OGG, loaded from assets/audio/ambient/.
 * Paths follow the convention: assets/audio/bgm/{bgmId}-layer{N}.ogg
 */

export interface ZoneAudio {
  bgmId: string;
  stemCount: number;
  ambientBiome: string;
  ambientVolume: number;
}

const BGM_BASE = 'audio/bgm';
const AMB_BASE = 'audio/ambient';

export const ZONE_AUDIO: Record<string, ZoneAudio> = {
  everwick: { bgmId: 'bgm-vh', stemCount: 4, ambientBiome: 'village', ambientVolume: 0.3 },
  heartfield: { bgmId: 'bgm-hf', stemCount: 4, ambientBiome: 'grassland', ambientVolume: 0.25 },
  ambergrove: { bgmId: 'bgm-ag', stemCount: 4, ambientBiome: 'forest', ambientVolume: 0.3 },
  millbrook: { bgmId: 'bgm-mb', stemCount: 4, ambientBiome: 'riverside', ambientVolume: 0.35 },
  sunridge: { bgmId: 'bgm-sr', stemCount: 4, ambientBiome: 'mountain', ambientVolume: 0.25 },
  'shimmer-marsh': { bgmId: 'bgm-sm', stemCount: 4, ambientBiome: 'wetland', ambientVolume: 0.3 },
  'hollow-ridge': { bgmId: 'bgm-hr', stemCount: 4, ambientBiome: 'mountain', ambientVolume: 0.25 },
  flickerveil: { bgmId: 'bgm-fv', stemCount: 4, ambientBiome: 'plains', ambientVolume: 0.2 },
  'resonance-fields': { bgmId: 'bgm-rf', stemCount: 4, ambientBiome: 'plains', ambientVolume: 0.2 },
  'luminous-wastes': { bgmId: 'bgm-lw', stemCount: 4, ambientBiome: 'plains', ambientVolume: 0.2 },
  'undrawn-peaks': { bgmId: 'bgm-up', stemCount: 4, ambientBiome: 'mountain', ambientVolume: 0.25 },
  'half-drawn-forest': {
    bgmId: 'bgm-hdf',
    stemCount: 4,
    ambientBiome: 'sketch',
    ambientVolume: 0.1,
  },
  'depths-general': {
    bgmId: 'bgm-dep',
    stemCount: 4,
    ambientBiome: 'dungeon',
    ambientVolume: 0.25,
  },
  'songline-l4': { bgmId: 'bgm-sl4', stemCount: 4, ambientBiome: 'dungeon', ambientVolume: 0.25 },
  'deepest-memory': {
    bgmId: 'bgm-dm5',
    stemCount: 4,
    ambientBiome: 'dungeon',
    ambientVolume: 0.25,
  },
  'preserver-fortress': {
    bgmId: 'bgm-pf',
    stemCount: 4,
    ambientBiome: 'stagnation',
    ambientVolume: 0.2,
  },
};

export function getStemUrls(bgmId: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${BGM_BASE}/${bgmId}-layer${i + 1}.ogg`);
}

export function getAmbientUrl(biome: string): string {
  return `${AMB_BASE}/amb-${biome}.ogg`;
}
