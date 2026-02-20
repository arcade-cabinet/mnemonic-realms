/**
 * Collision System — Pure functions for grid-based collision detection.
 *
 * The collision grid is a Uint8Array where:
 * - 0 = passable
 * - 1 = blocked
 * Index formula: y * mapWidth + x
 *
 * All coordinates are in TILE space (not pixels).
 */

/**
 * Check if a tile position is blocked in the collision grid.
 *
 * @param collisionGrid - Uint8Array collision grid (1=blocked, 0=passable)
 * @param mapWidth - Map width in tiles
 * @param tileX - Tile X coordinate
 * @param tileY - Tile Y coordinate
 * @returns true if the tile is blocked or out of bounds
 */
export function checkCollision(
  collisionGrid: Uint8Array,
  mapWidth: number,
  tileX: number,
  tileY: number,
): boolean {
  const mapHeight = collisionGrid.length / mapWidth;

  // Out of bounds = blocked
  if (tileX < 0 || tileY < 0 || tileX >= mapWidth || tileY >= mapHeight) {
    return true;
  }

  const index = tileY * mapWidth + tileX;
  return collisionGrid[index] === 1;
}

/**
 * Resolve a movement attempt against the collision grid.
 *
 * Returns the valid destination position:
 * - If the target tile is passable, returns the target position.
 * - If the target tile is blocked (or out of bounds), returns the original position.
 *
 * @param collisionGrid - Uint8Array collision grid (1=blocked, 0=passable)
 * @param mapWidth - Map width in tiles
 * @param fromX - Current tile X
 * @param fromY - Current tile Y
 * @param toX - Target tile X
 * @param toY - Target tile Y
 * @returns The valid position { x, y } in tile coordinates
 */
export function resolveMovement(
  collisionGrid: Uint8Array,
  mapWidth: number,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): { x: number; y: number } {
  if (checkCollision(collisionGrid, mapWidth, toX, toY)) {
    return { x: fromX, y: fromY };
  }
  return { x: toX, y: toY };
}
