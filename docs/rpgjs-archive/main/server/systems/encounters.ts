import type { RpgPlayer } from '@rpgjs/server';

import { isInCombat, startCombat } from './combat';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EncounterGroup {
  /** Probability weight (sums to 1.0 across groups in a zone) */
  weight: number;
  /** Enemy DDL IDs comprising this encounter group */
  enemyIds: string[];
}

export interface EncounterZone {
  /** Unique name for this zone */
  name: string;
  /** Bounding box: top-left tile (x, y) */
  x1: number;
  y1: number;
  /** Bounding box: bottom-right tile (x, y) */
  x2: number;
  y2: number;
  /** Encounter rate: probability per step (e.g. 0.03 = 3%) */
  rate: number;
  /** Possible encounter groups, weighted */
  groups: EncounterGroup[];
  /** Optional condition variable — zone is active only when this variable is truthy */
  condition?: string;
}

// ---------------------------------------------------------------------------
// Settled Lands Encounter Tables
// ---------------------------------------------------------------------------

export const HEARTFIELD_ZONES: EncounterZone[] = [
  {
    name: 'Wheat Fields West',
    x1: 2,
    y1: 5,
    x2: 14,
    y2: 20,
    rate: 0.03,
    groups: [
      { weight: 0.6, enemyIds: ['E-SL-01'] },
      { weight: 0.3, enemyIds: ['E-SL-01', 'E-SL-02'] },
      { weight: 0.1, enemyIds: ['E-SL-01', 'E-SL-01', 'E-SL-02'] },
    ],
  },
  {
    name: 'Wheat Fields East',
    x1: 22,
    y1: 5,
    x2: 32,
    y2: 17,
    rate: 0.04,
    groups: [
      { weight: 0.6, enemyIds: ['E-SL-02'] },
      { weight: 0.3, enemyIds: ['E-SL-02', 'E-SL-01'] },
      { weight: 0.1, enemyIds: ['E-SL-02', 'E-SL-02'] },
    ],
  },
];

export const AMBERGROVE_ZONES: EncounterZone[] = [
  {
    name: 'Dense Forest',
    x1: 5,
    y1: 2,
    x2: 35,
    y2: 15,
    rate: 0.08,
    groups: [
      { weight: 0.6, enemyIds: ['E-SL-03'] },
      { weight: 0.3, enemyIds: ['E-SL-03', 'E-SL-04'] },
      { weight: 0.1, enemyIds: ['E-SL-03', 'E-SL-04', 'E-SL-03'] },
    ],
  },
  {
    name: 'Lake Shore',
    x1: 24,
    y1: 20,
    x2: 35,
    y2: 30,
    rate: 0.03,
    groups: [
      { weight: 0.7, enemyIds: ['E-SL-03'] },
      { weight: 0.3, enemyIds: ['E-SL-03', 'E-SL-03'] },
    ],
  },
  {
    name: 'Canopy Path',
    x1: 36,
    y1: 15,
    x2: 39,
    y2: 28,
    rate: 0.06,
    groups: [
      { weight: 0.6, enemyIds: ['E-SL-04'] },
      { weight: 0.3, enemyIds: ['E-SL-04', 'E-SL-04'] },
      { weight: 0.1, enemyIds: ['E-SL-04', 'E-SL-03', 'E-SL-04'] },
    ],
  },
];

export const MILLBROOK_ZONES: EncounterZone[] = [
  {
    name: 'West Riverbank',
    x1: 2,
    y1: 10,
    x2: 16,
    y2: 30,
    rate: 0.05,
    groups: [
      { weight: 0.6, enemyIds: ['E-SL-05'] },
      { weight: 0.3, enemyIds: ['E-SL-05', 'E-SL-06'] },
      { weight: 0.1, enemyIds: ['E-SL-05', 'E-SL-06', 'E-SL-05'] },
    ],
  },
  {
    name: 'East Riverbank',
    x1: 22,
    y1: 8,
    x2: 38,
    y2: 30,
    rate: 0.05,
    groups: [
      { weight: 0.6, enemyIds: ['E-SL-06'] },
      { weight: 0.3, enemyIds: ['E-SL-06', 'E-SL-05'] },
      { weight: 0.1, enemyIds: ['E-SL-06', 'E-SL-06'] },
    ],
  },
  {
    name: 'Falls Approach',
    x1: 2,
    y1: 2,
    x2: 12,
    y2: 8,
    rate: 0.03,
    groups: [
      { weight: 0.7, enemyIds: ['E-SL-05'] },
      { weight: 0.3, enemyIds: ['E-SL-05', 'E-SL-05'] },
    ],
  },
];

export const SUNRIDGE_ZONES: EncounterZone[] = [
  {
    name: 'Highland Grass',
    x1: 5,
    y1: 10,
    x2: 25,
    y2: 35,
    rate: 0.05,
    groups: [
      { weight: 0.6, enemyIds: ['E-SL-07'] },
      { weight: 0.3, enemyIds: ['E-SL-07', 'E-SL-07'] },
      { weight: 0.1, enemyIds: ['E-SL-07', 'E-SL-08'] },
    ],
  },
  {
    name: 'Rocky Outcrops',
    x1: 25,
    y1: 5,
    x2: 38,
    y2: 25,
    rate: 0.06,
    groups: [
      { weight: 0.6, enemyIds: ['E-SL-08'] },
      { weight: 0.3, enemyIds: ['E-SL-08', 'E-SL-07'] },
      { weight: 0.1, enemyIds: ['E-SL-08', 'E-SL-08', 'E-SL-07'] },
    ],
  },
];

// ---------------------------------------------------------------------------
// Map → Zones registry
// ---------------------------------------------------------------------------

const MAP_ZONES: Record<string, EncounterZone[]> = {
  heartfield: HEARTFIELD_ZONES,
  ambergrove: AMBERGROVE_ZONES,
  millbrook: MILLBROOK_ZONES,
  sunridge: SUNRIDGE_ZONES,
};

/**
 * Register custom encounter zones for a map ID.
 * Used by maps outside the Settled Lands.
 */
export function registerEncounterZones(mapId: string, zones: EncounterZone[]): void {
  MAP_ZONES[mapId] = zones;
}

/**
 * Get all encounter zones for a map.
 */
export function getEncounterZones(mapId: string): EncounterZone[] {
  return MAP_ZONES[mapId] ?? [];
}

// ---------------------------------------------------------------------------
// Encounter Check Logic
// ---------------------------------------------------------------------------

const TILE_SIZE = 16;
const VAR_STEP_COUNT = 'ENCOUNTER_STEP_COUNT';
const MIN_STEPS_BETWEEN_ENCOUNTERS = 3;

/**
 * Find the first active encounter zone the player is standing in.
 */
function findActiveZone(
  player: RpgPlayer,
  zones: EncounterZone[],
  tileX: number,
  tileY: number,
): EncounterZone | null {
  for (const zone of zones) {
    if (zone.condition && !player.getVariable(zone.condition)) continue;
    if (tileX >= zone.x1 && tileX <= zone.x2 && tileY >= zone.y1 && tileY <= zone.y2) {
      return zone;
    }
  }
  return null;
}

/**
 * Try to trigger a combat encounter for a zone.
 * Returns true if combat started.
 */
function tryTriggerEncounter(player: RpgPlayer, zone: EncounterZone): boolean {
  if (Math.random() >= zone.rate) return false;

  const group = selectEncounterGroup(zone.groups);
  if (!group) return false;

  const combat = startCombat(player, group.enemyIds);
  if (!combat) return false;

  player.setVariable(VAR_STEP_COUNT, 0);
  player.emit('encounter-start', {
    zoneName: zone.name,
    enemies: combat.enemies.map((e) => e.name),
  });
  return true;
}

/**
 * Check for a random encounter when the player moves.
 * Call this from a player movement hook (e.g., onInput).
 *
 * @param player   The moving player
 * @param mapId    Current map ID
 * @returns true if an encounter was triggered
 */
export function checkEncounter(player: RpgPlayer, mapId: string): boolean {
  if (isInCombat(player)) return false;

  const zones = MAP_ZONES[mapId];
  if (!zones) return false;

  const steps = ((player.getVariable(VAR_STEP_COUNT) as number) || 0) + 1;
  player.setVariable(VAR_STEP_COUNT, steps);

  if (steps < MIN_STEPS_BETWEEN_ENCOUNTERS) return false;

  const tileX = Math.floor(player.position.x / TILE_SIZE);
  const tileY = Math.floor(player.position.y / TILE_SIZE);
  const zone = findActiveZone(player, zones, tileX, tileY);

  return zone ? tryTriggerEncounter(player, zone) : false;
}

/**
 * Select an encounter group from a weighted list.
 */
function selectEncounterGroup(groups: EncounterGroup[]): EncounterGroup | null {
  if (groups.length === 0) return null;

  const roll = Math.random();
  let cumulative = 0;
  for (const group of groups) {
    cumulative += group.weight;
    if (roll < cumulative) return group;
  }

  // Fallback to last group (handles floating-point edge cases)
  return groups[groups.length - 1];
}

/**
 * Reset the encounter step counter (e.g., after a map transition).
 */
export function resetEncounterSteps(player: RpgPlayer): void {
  player.setVariable(VAR_STEP_COUNT, 0);
}
