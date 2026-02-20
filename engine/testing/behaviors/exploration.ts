/**
 * Exploration Behavior — Map exploration with visited tile tracking.
 *
 * Pure functions. Tracks which tiles have been visited and selects
 * exploration targets from unvisited passable tiles.
 */

import type { Tile } from './navigation.js';

/**
 * Get all unvisited passable tiles on the map.
 *
 * @param visitedSet - Set of visited tile indices (y * mapWidth + x)
 * @param collisionGrid - Uint8Array (1=blocked, 0=passable)
 * @param mapWidth - Map width in tiles
 * @param mapHeight - Map height in tiles
 * @returns Array of unvisited passable tile coordinates.
 */
export function getUnexploredTiles(
  visitedSet: Set<number>,
  collisionGrid: Uint8Array,
  mapWidth: number,
  mapHeight: number,
): Tile[] {
  const unexplored: Tile[] = [];

  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const idx = y * mapWidth + x;
      if (collisionGrid[idx] === 1) continue; // blocked
      if (visitedSet.has(idx)) continue;       // already visited
      unexplored.push({ x, y });
    }
  }

  return unexplored;
}

/**
 * Pick the best exploration target from a list of unexplored tiles.
 *
 * Selects the closest unexplored tile to the current position
 * using Manhattan distance.
 *
 * @param unexplored - Array of unexplored tile coordinates
 * @param currentPos - Current player tile position
 * @returns The closest unexplored tile, or null if none available.
 */
export function pickExplorationTarget(
  unexplored: Tile[],
  currentPos: Tile,
): Tile | null {
  if (unexplored.length === 0) return null;

  let closest = unexplored[0];
  let closestDist = manhattanDistance(currentPos, closest);

  for (let i = 1; i < unexplored.length; i++) {
    const dist = manhattanDistance(currentPos, unexplored[i]);
    if (dist < closestDist) {
      closest = unexplored[i];
      closestDist = dist;
    }
  }

  return closest;
}

/**
 * Mark a tile as visited.
 *
 * @param visitedSet - Mutable set of visited tile indices
 * @param x - Tile X coordinate
 * @param y - Tile Y coordinate
 * @param mapWidth - Map width in tiles
 */
export function markVisited(
  visitedSet: Set<number>,
  x: number,
  y: number,
  mapWidth: number,
): void {
  visitedSet.add(y * mapWidth + x);
}

/**
 * Calculate the exploration coverage percentage.
 *
 * @param visitedSet - Set of visited tile indices
 * @param collisionGrid - Uint8Array (1=blocked, 0=passable)
 * @param mapWidth - Map width in tiles
 * @param mapHeight - Map height in tiles
 * @returns Coverage as a number between 0.0 and 1.0.
 */
export function getExplorationCoverage(
  visitedSet: Set<number>,
  collisionGrid: Uint8Array,
  mapWidth: number,
  mapHeight: number,
): number {
  let passableCount = 0;
  let visitedPassable = 0;

  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const idx = y * mapWidth + x;
      if (collisionGrid[idx] === 0) {
        passableCount++;
        if (visitedSet.has(idx)) {
          visitedPassable++;
        }
      }
    }
  }

  if (passableCount === 0) return 1.0;
  return visitedPassable / passableCount;
}

/** Manhattan distance between two tiles. */
function manhattanDistance(a: Tile, b: Tile): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

