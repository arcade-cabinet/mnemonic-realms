/**
 * Vibrancy Area State System — Pure logic for memory fog-of-war.
 *
 * Manages per-area vibrancy state (forgotten / partial / remembered).
 * Quest progression drives state transitions. No rendering — that's US-012.
 *
 * Position is in PIXELS, area bounds are in TILES.
 * Convert: tileX = Math.floor(pixelX / TILE_SIZE)
 */

import type { RuntimeVibrancyArea } from '../../../gen/assemblage/pipeline/runtime-types.js';
import { TILE_SIZE } from '../../renderer/types.js';

// ── Types ───────────────────────────────────────────────────────────────────

/** Vibrancy state for a map area. */
export type VibrancyState = 'forgotten' | 'partial' | 'remembered';

/** A vibrancy area with its current state. */
export interface VibrancyArea {
  /** Area ID */
  id: string;
  /** Bounding rectangle in tiles */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Current vibrancy state */
  state: VibrancyState;
  /** Quest that unlocks this area (if any) */
  unlockQuest?: string;
}

/** Collection of vibrancy areas for a map. */
export interface VibrancyMap {
  areas: VibrancyArea[];
}

/** Result of checking forgotten-area damage. */
export interface ForgottenDamageResult {
  shouldDamage: boolean;
  damageAmount: number;
  shouldWarn: boolean;
}

// ── Pure Functions ──────────────────────────────────────────────────────────

/**
 * Initialize a VibrancyMap from runtime area data.
 * Each area starts at its declared initialState.
 */
export function createVibrancyMap(runtimeAreas: RuntimeVibrancyArea[]): VibrancyMap {
  return {
    areas: runtimeAreas.map((ra) => ({
      id: ra.id,
      x: ra.x,
      y: ra.y,
      width: ra.width,
      height: ra.height,
      state: ra.initialState,
      ...(ra.unlockQuest ? { unlockQuest: ra.unlockQuest } : {}),
    })),
  };
}

/**
 * Find which vibrancy area contains the given pixel position.
 * Converts pixel coords to tile coords, then checks area bounds.
 * Returns null if position is outside all defined areas.
 */
export function getAreaAtPosition(
  map: VibrancyMap,
  pixelX: number,
  pixelY: number,
): VibrancyArea | null {
  const tileX = Math.floor(pixelX / TILE_SIZE);
  const tileY = Math.floor(pixelY / TILE_SIZE);

  for (const area of map.areas) {
    if (
      tileX >= area.x &&
      tileX < area.x + area.width &&
      tileY >= area.y &&
      tileY < area.y + area.height
    ) {
      return area;
    }
  }
  return null;
}

/**
 * Update vibrancy states based on completed quests.
 * If an area's unlockQuest is flagged true: forgotten → partial, partial → remembered.
 * Returns a new VibrancyMap (immutable update).
 */
export function updateVibrancyFromQuests(
  map: VibrancyMap,
  questFlags: Record<string, boolean>,
): VibrancyMap {
  return {
    areas: map.areas.map((area) => {
      if (!area.unlockQuest) return area;
      if (!questFlags[area.unlockQuest]) return area;

      // Quest is complete — advance state one tier
      if (area.state === 'forgotten') {
        return { ...area, state: 'partial' as VibrancyState };
      }
      if (area.state === 'partial') {
        return { ...area, state: 'remembered' as VibrancyState };
      }
      // Already remembered — no change
      return area;
    }),
  };
}

/**
 * Check if the player should take damage from being in a forgotten area.
 *
 * - stepsInArea === 2: warn the player (shouldWarn = true)
 * - stepsInArea > 3: damage scales with steps beyond 3
 * - Not forgotten or null area: no damage, no warning
 */
export function checkForgottenDamage(
  area: VibrancyArea | null,
  stepsInArea: number,
): ForgottenDamageResult {
  const noDamage: ForgottenDamageResult = {
    shouldDamage: false,
    damageAmount: 0,
    shouldWarn: false,
  };

  if (!area || area.state !== 'forgotten') return noDamage;

  if (stepsInArea === 2) {
    return { shouldDamage: false, damageAmount: 0, shouldWarn: true };
  }

  if (stepsInArea > 3) {
    // Damage scales: 5 base + 3 per step beyond 3
    const damageAmount = 5 + (stepsInArea - 3) * 3;
    return { shouldDamage: true, damageAmount, shouldWarn: false };
  }

  return noDamage;
}

/**
 * Serialize vibrancy state for save/load.
 * Returns a map of { areaId: state }.
 */
export function serializeVibrancyState(map: VibrancyMap): Record<string, VibrancyState> {
  const result: Record<string, VibrancyState> = {};
  for (const area of map.areas) {
    result[area.id] = area.state;
  }
  return result;
}

/**
 * Restore saved vibrancy state into a vibrancy map.
 * Areas not present in saved data keep their current state.
 */
export function deserializeVibrancyState(
  map: VibrancyMap,
  saved: Record<string, VibrancyState>,
): VibrancyMap {
  return {
    areas: map.areas.map((area) => {
      const savedState = saved[area.id];
      if (savedState) {
        return { ...area, state: savedState };
      }
      return area;
    }),
  };
}
