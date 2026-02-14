import type { RpgPlayer } from '@rpgjs/server';

// Extend RpgPlayer with synced vibrancy props (declared in player.ts props)
declare module '@rpgjs/server' {
  interface RpgPlayer {
    zoneVibrancy: number;
    zoneBiome: string;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VibrancyTier = 'muted' | 'normal' | 'vivid';

export type Biome =
  | 'village'
  | 'grassland'
  | 'forest'
  | 'mountain'
  | 'riverside'
  | 'wetland'
  | 'plains'
  | 'dungeon'
  | 'sketch'
  | 'fortress';

interface ZoneInfo {
  zone: VibrancyZone;
  biome: Biome;
}

/**
 * Zone IDs for vibrancy tracking. More granular than the memory system's Zone
 * type because each depth level tracks vibrancy independently (per docs).
 */
export type VibrancyZone =
  | 'village-hub'
  | 'heartfield'
  | 'millbrook'
  | 'ambergrove'
  | 'sunridge'
  | 'shimmer-marsh'
  | 'flickerveil'
  | 'hollow-ridge'
  | 'resonance-fields'
  | 'luminous-wastes'
  | 'half-drawn-forest'
  | 'undrawn-peaks'
  | 'depths-1'
  | 'depths-2'
  | 'depths-3'
  | 'depths-4'
  | 'depths-5'
  | 'fortress';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VIBRANCY_MIN = 0;
const VIBRANCY_MAX = 100;

const MUTED_UPPER = 33;
const VIVID_LOWER = 67;

/** Player variable prefix — each zone stored as VIBRANCY_<ZONE_ID> */
const VAR_PREFIX = 'VIBRANCY_';

/**
 * Starting vibrancy values per zone (from docs/world/vibrancy-system.md).
 * These represent how "remembered" each zone already is at game start.
 */
export const DEFAULT_VIBRANCY: Readonly<Record<VibrancyZone, number>> = {
  'village-hub': 60,
  heartfield: 55,
  millbrook: 50,
  ambergrove: 45,
  sunridge: 40,
  'shimmer-marsh': 30,
  flickerveil: 25,
  'hollow-ridge': 20,
  'resonance-fields': 15,
  'luminous-wastes': 5,
  'half-drawn-forest': 8,
  'undrawn-peaks': 10,
  'depths-1': 35,
  'depths-2': 40,
  'depths-3': 30,
  'depths-4': 25,
  'depths-5': 45,
  fortress: 0,
};

/** All valid zone IDs, derived from the defaults map. */
export const VIBRANCY_ZONES = Object.keys(DEFAULT_VIBRANCY) as VibrancyZone[];

/** Maps RPG-JS map IDs to their vibrancy zone and biome type. */
const MAP_TO_ZONE: Readonly<Record<string, ZoneInfo>> = {
  'village-hub': { zone: 'village-hub', biome: 'village' },
  heartfield: { zone: 'heartfield', biome: 'grassland' },
  millbrook: { zone: 'millbrook', biome: 'riverside' },
  ambergrove: { zone: 'ambergrove', biome: 'forest' },
  sunridge: { zone: 'sunridge', biome: 'grassland' },
  'shimmer-marsh': { zone: 'shimmer-marsh', biome: 'wetland' },
  flickerveil: { zone: 'flickerveil', biome: 'forest' },
  'hollow-ridge': { zone: 'hollow-ridge', biome: 'mountain' },
  'resonance-fields': { zone: 'resonance-fields', biome: 'plains' },
  'luminous-wastes': { zone: 'luminous-wastes', biome: 'sketch' },
  'half-drawn-forest': { zone: 'half-drawn-forest', biome: 'forest' },
  'undrawn-peaks': { zone: 'undrawn-peaks', biome: 'mountain' },
  'depths-l1': { zone: 'depths-1', biome: 'dungeon' },
  'depths-l2': { zone: 'depths-2', biome: 'dungeon' },
  'depths-l3': { zone: 'depths-3', biome: 'dungeon' },
  'depths-l4': { zone: 'depths-4', biome: 'dungeon' },
  'depths-l5': { zone: 'depths-5', biome: 'dungeon' },
  'fortress-f1': { zone: 'fortress', biome: 'fortress' },
  'fortress-f2': { zone: 'fortress', biome: 'fortress' },
  'fortress-f3': { zone: 'fortress', biome: 'fortress' },
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function varKey(zoneId: VibrancyZone): string {
  return `${VAR_PREFIX}${zoneId}`;
}

function clamp(value: number): number {
  return Math.max(VIBRANCY_MIN, Math.min(VIBRANCY_MAX, Math.round(value)));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Initialize all zone vibrancy values to their defaults.
 * Call once when a new game starts (before the player enters a map).
 */
export function initVibrancy(player: RpgPlayer): void {
  for (const zone of VIBRANCY_ZONES) {
    player.setVariable(varKey(zone), DEFAULT_VIBRANCY[zone]);
  }
}

/**
 * Get the current vibrancy value (0-100) for a zone.
 * Returns the zone's default if not yet initialized.
 */
export function getVibrancy(player: RpgPlayer, zoneId: VibrancyZone): number {
  const stored = player.getVariable(varKey(zoneId)) as number | undefined;
  return stored ?? DEFAULT_VIBRANCY[zoneId];
}

/**
 * Set the vibrancy value for a zone. Clamped to 0-100.
 * Also syncs to client if the player is currently in this zone.
 */
export function setVibrancy(player: RpgPlayer, zoneId: VibrancyZone, value: number): void {
  const v = clamp(value);
  player.setVariable(varKey(zoneId), v);
  autoSync(player, zoneId, v);
}

/**
 * Increase vibrancy for a zone by the given amount, capped at 100.
 * Returns the new vibrancy value after the increase.
 * Also syncs to client if the player is currently in this zone.
 */
export function increaseVibrancy(player: RpgPlayer, zoneId: VibrancyZone, amount: number): number {
  const current = getVibrancy(player, zoneId);
  const next = clamp(current + amount);
  player.setVariable(varKey(zoneId), next);
  autoSync(player, zoneId, next);
  return next;
}

/**
 * Determine the visual tier for a zone based on its current vibrancy.
 *   muted:  0-33
 *   normal: 34-66
 *   vivid:  67-100
 */
export function getVibrancyTier(player: RpgPlayer, zoneId: VibrancyZone): VibrancyTier {
  const v = getVibrancy(player, zoneId);
  if (v <= MUTED_UPPER) return 'muted';
  if (v >= VIVID_LOWER) return 'vivid';
  return 'normal';
}

// ---------------------------------------------------------------------------
// Client Sync — synced props (zoneVibrancy, zoneBiome) declared in player.ts
// ---------------------------------------------------------------------------

/**
 * Resolve a map ID to its zone info, or undefined if unknown.
 */
export function resolveMapZone(mapId: string): ZoneInfo | undefined {
  return MAP_TO_ZONE[mapId];
}

/**
 * Push current zone vibrancy + biome to synced player props.
 * Call from onJoinMap so the client receives the values.
 */
export function syncZoneVibrancy(player: RpgPlayer): void {
  const mapId = (player.map as { id?: string } | undefined)?.id;
  if (!mapId) return;
  const info = MAP_TO_ZONE[mapId];
  if (!info) return;
  const v = getVibrancy(player, info.zone);
  player.zoneVibrancy = v;
  player.zoneBiome = info.biome;
}

/** If the player is currently in the given zone, sync the new value. */
function autoSync(player: RpgPlayer, zoneId: VibrancyZone, value: number): void {
  const mapId = (player.map as { id?: string } | undefined)?.id;
  if (!mapId) return;
  const info = MAP_TO_ZONE[mapId];
  if (info?.zone === zoneId) {
    player.zoneVibrancy = value;
  }
}
