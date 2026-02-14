import type { RpgPlayer } from '@rpgjs/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VibrancyTier = 'muted' | 'normal' | 'vivid';

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
 */
export function setVibrancy(player: RpgPlayer, zoneId: VibrancyZone, value: number): void {
  player.setVariable(varKey(zoneId), clamp(value));
}

/**
 * Increase vibrancy for a zone by the given amount, capped at 100.
 * Returns the new vibrancy value after the increase.
 */
export function increaseVibrancy(player: RpgPlayer, zoneId: VibrancyZone, amount: number): number {
  const current = getVibrancy(player, zoneId);
  const next = clamp(current + amount);
  player.setVariable(varKey(zoneId), next);
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
