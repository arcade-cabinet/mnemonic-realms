/**
 * Navigation Behavior — BFS pathfinding on the collision grid.
 *
 * Pure functions. No React, no Skia, no side effects.
 * Operates on tile coordinates (not pixels).
 */

import type { World } from 'koota';
import { playerQuery } from '../../ecs/queries.js';
import { Position, Velocity } from '../../ecs/traits.js';
import { TILE_SIZE } from '../../renderer/types.js';

/** A tile coordinate. */
export interface Tile {
  x: number;
  y: number;
}

/** Cardinal directions for BFS neighbor expansion. */
const DIRECTIONS: Tile[] = [
  { x: 0, y: -1 }, // up
  { x: 0, y: 1 }, // down
  { x: -1, y: 0 }, // left
  { x: 1, y: 0 }, // right
];

/** Check if a tile coordinate is within grid bounds. */
function isInBounds(x: number, y: number, w: number, h: number): boolean {
  return x >= 0 && y >= 0 && x < w && y < h;
}

/** Run BFS loop to find the goal index. Returns true if goal was reached. */
function bfsSearch(
  collisionGrid: Uint8Array,
  mapWidth: number,
  mapHeight: number,
  visited: Uint8Array,
  cameFrom: Int32Array,
  queue: number[],
  goalIdx: number,
): boolean {
  while (queue.length > 0) {
    const currentIdx = queue.shift();
    if (currentIdx === undefined) break;

    const cx = currentIdx % mapWidth;
    const cy = Math.floor(currentIdx / mapWidth);

    for (const dir of DIRECTIONS) {
      const nx = cx + dir.x;
      const ny = cy + dir.y;
      if (!isInBounds(nx, ny, mapWidth, mapHeight)) continue;

      const nIdx = ny * mapWidth + nx;
      if (visited[nIdx] === 1 || collisionGrid[nIdx] === 1) continue;

      visited[nIdx] = 1;
      cameFrom[nIdx] = currentIdx;
      queue.push(nIdx);

      if (nIdx === goalIdx) return true;
    }
  }
  return false;
}

/** Reconstruct a path from cameFrom map. */
function reconstructPath(cameFrom: Int32Array, goalIdx: number, mapWidth: number): Tile[] {
  const path: Tile[] = [];
  let idx = goalIdx;
  while (idx !== -1) {
    path.push({ x: idx % mapWidth, y: Math.floor(idx / mapWidth) });
    idx = cameFrom[idx];
  }
  path.reverse();
  return path;
}

/**
 * BFS pathfinding on a collision grid.
 *
 * @param collisionGrid - Uint8Array (1=blocked, 0=passable)
 * @param mapWidth - Map width in tiles
 * @param start - Start tile coordinate
 * @param goal - Goal tile coordinate
 * @returns Array of tiles from start to goal (inclusive), or empty if unreachable.
 */
export function findPath(
  collisionGrid: Uint8Array,
  mapWidth: number,
  start: Tile,
  goal: Tile,
): Tile[] {
  const mapHeight = collisionGrid.length / mapWidth;

  if (!isInBounds(start.x, start.y, mapWidth, mapHeight)) return [];
  if (!isInBounds(goal.x, goal.y, mapWidth, mapHeight)) return [];
  if (collisionGrid[goal.y * mapWidth + goal.x] === 1) return [];

  if (start.x === goal.x && start.y === goal.y) {
    return [{ x: start.x, y: start.y }];
  }

  const visited = new Uint8Array(collisionGrid.length);
  const cameFrom = new Int32Array(collisionGrid.length).fill(-1);
  const queue: number[] = [];

  const startIdx = start.y * mapWidth + start.x;
  const goalIdx = goal.y * mapWidth + goal.x;

  visited[startIdx] = 1;
  queue.push(startIdx);

  const found = bfsSearch(collisionGrid, mapWidth, mapHeight, visited, cameFrom, queue, goalIdx);

  if (!found) return [];
  return reconstructPath(cameFrom, goalIdx, mapWidth);
}

/**
 * Set the player entity's Velocity to move one step along a path.
 *
 * @param world - Koota ECS world
 * @param path - Tile path from findPath
 * @param currentIndex - Current index in the path (0-based)
 * @returns The next path index, or -1 if path is complete.
 */
export function moveAlongPath(world: World, path: Tile[], currentIndex: number): number {
  if (currentIndex >= path.length - 1) return -1;

  const players = world.query(playerQuery);
  if (players.length === 0) return -1;

  const player = players[0];
  const pos = player.get(Position);
  const currentTileX = Math.round(pos.x / TILE_SIZE);
  const currentTileY = Math.round(pos.y / TILE_SIZE);

  const nextTile = path[currentIndex + 1];
  const dx = nextTile.x - currentTileX;
  const dy = nextTile.y - currentTileY;

  // Clamp to single-tile steps
  const vx = Math.max(-1, Math.min(1, dx));
  const vy = Math.max(-1, Math.min(1, dy));

  player.set(Velocity, { x: vx, y: vy });

  return currentIndex + 1;
}
