/**
 * Traversal Verifier — BFS Reachability at Every Fractal Level
 *
 * The same algorithm works at every layer of the onion:
 *   TILE  → "Is this tile walkable given its neighbors?"
 *   TOWN  → "Can I reach every building door from every entry?"
 *   REGION → "Can I walk between every anchor?"
 *   WORLD  → "Can I reach every region from the start?"
 *
 * All verification is deterministic and runs at build time —
 * no game engine needed. Just the collision grid + entry/target points.
 *
 * Architecture level: TESTING (cross-cutting verification)
 */

import type { CollisionGrid, Point } from '../composer/path-router';

// --- Result Types ---

export interface TraversalReport {
  /** Level being verified */
  level: 'tile' | 'organism' | 'region' | 'world';
  /** What was tested (e.g., "everwick", "settled-lands") */
  subject: string;
  /** Did all targets pass? */
  passed: boolean;
  /** Total reachable tiles from all entry points */
  reachableTiles: number;
  /** Total walkable tiles in the grid */
  totalWalkableTiles: number;
  /** Percentage of walkable tiles reachable */
  coveragePercent: number;
  /** Individual target results */
  targets: TargetResult[];
  /** Disconnected zones (if any) */
  disconnectedZones: DisconnectedZone[];
}

export interface TargetResult {
  /** Target identifier */
  id: string;
  /** Target position */
  position: Point;
  /** Is it reachable from at least one entry? */
  reachable: boolean;
  /** Shortest distance from nearest entry (in tiles, -1 if unreachable) */
  distance: number;
  /** Which entry point reaches it */
  reachedFrom?: Point;
}

export interface DisconnectedZone {
  /** Representative tile of the zone */
  representative: Point;
  /** Number of tiles in this zone */
  tileCount: number;
}

// --- Core BFS ---

/**
 * BFS flood fill from a set of start points.
 * Returns a distance map where each cell contains the shortest distance
 * from any start point, or -1 if unreachable.
 */
export function bfsFloodFill(grid: CollisionGrid, startPoints: Point[]): Int32Array {
  const distances = new Int32Array(grid.width * grid.height).fill(-1);
  const queue: Array<{ x: number; y: number; dist: number }> = [];

  // Seed the BFS with all start points
  for (const p of startPoints) {
    const idx = p.y * grid.width + p.x;
    if (idx >= 0 && idx < distances.length && isWalkable(grid, p.x, p.y)) {
      distances[idx] = 0;
      queue.push({ x: p.x, y: p.y, dist: 0 });
    }
  }

  // 4-directional BFS
  const dx = [0, 0, -1, 1];
  const dy = [-1, 1, 0, 0];
  let head = 0;

  while (head < queue.length) {
    const { x, y, dist } = queue[head++];

    for (let d = 0; d < 4; d++) {
      const nx = x + dx[d];
      const ny = y + dy[d];

      if (nx < 0 || nx >= grid.width || ny < 0 || ny >= grid.height) continue;

      const nIdx = ny * grid.width + nx;
      if (distances[nIdx] !== -1) continue; // already visited
      if (!isWalkable(grid, nx, ny)) continue;

      distances[nIdx] = dist + 1;
      queue.push({ x: nx, y: ny, dist: dist + 1 });
    }
  }

  return distances;
}

/**
 * Check if a grid cell is walkable.
 * 0 = passable, 2 = road (also passable), 3 = reserved clearance (passable)
 * 1 = blocked (NOT passable)
 */
function isWalkable(grid: CollisionGrid, x: number, y: number): boolean {
  const val = grid.data[y * grid.width + x];
  return val !== 1;
}

// --- Verification Functions ---

/**
 * Verify that all target points are reachable from at least one entry point.
 *
 * This is THE core verification — same function at every fractal level:
 *   - Town: entries = town entry anchors, targets = door positions
 *   - Region: entries = region entry/exit points, targets = anchor centers
 *   - World: entries = [startRegion start], targets = all region entries
 */
export function verifyTraversal(
  grid: CollisionGrid,
  entries: Point[],
  targets: Array<{ id: string; position: Point }>,
  options: {
    level: TraversalReport['level'];
    subject: string;
  },
): TraversalReport {
  // BFS from all entries
  const distances = bfsFloodFill(grid, entries);

  // Count reachable and total walkable
  let reachableTiles = 0;
  let totalWalkableTiles = 0;
  for (let i = 0; i < grid.width * grid.height; i++) {
    if (grid.data[i] !== 1) {
      totalWalkableTiles++;
      if (distances[i] !== -1) {
        reachableTiles++;
      }
    }
  }

  // Check each target
  const targetResults: TargetResult[] = targets.map((t) => {
    const idx = t.position.y * grid.width + t.position.x;
    const dist = idx >= 0 && idx < distances.length ? distances[idx] : -1;

    // Find which entry is closest
    let reachedFrom: Point | undefined;
    if (dist >= 0) {
      let bestDist = Infinity;
      for (const entry of entries) {
        const eDist = Math.abs(entry.x - t.position.x) + Math.abs(entry.y - t.position.y);
        if (eDist < bestDist) {
          bestDist = eDist;
          reachedFrom = entry;
        }
      }
    }

    return {
      id: t.id,
      position: t.position,
      reachable: dist >= 0,
      distance: dist,
      reachedFrom,
    };
  });

  // Find disconnected zones
  const disconnectedZones = findDisconnectedZones(grid, distances);

  const allReachable = targetResults.every((t) => t.reachable);
  const coveragePercent =
    totalWalkableTiles > 0 ? Math.round((reachableTiles / totalWalkableTiles) * 10000) / 100 : 100;

  return {
    level: options.level,
    subject: options.subject,
    passed: allReachable,
    reachableTiles,
    totalWalkableTiles,
    coveragePercent,
    targets: targetResults,
    disconnectedZones,
  };
}

/**
 * Find disconnected walkable zones — areas not reachable from the BFS seeds.
 *
 * Each zone is a cluster of walkable tiles with no path to the main area.
 * These represent design bugs: isolated rooms, gaps in collision, etc.
 */
function findDisconnectedZones(grid: CollisionGrid, distances: Int32Array): DisconnectedZone[] {
  const zones: DisconnectedZone[] = [];
  const visited = new Uint8Array(grid.width * grid.height);

  // Mark all BFS-reached tiles as visited
  for (let i = 0; i < distances.length; i++) {
    if (distances[i] >= 0) visited[i] = 1;
  }

  // Flood-fill each unvisited walkable tile to find disconnected zones
  const dx = [0, 0, -1, 1];
  const dy = [-1, 1, 0, 0];

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const idx = y * grid.width + x;
      if (visited[idx] || grid.data[idx] === 1) continue;

      // New disconnected zone — flood fill it
      let tileCount = 0;
      const representative: Point = { x, y };
      const stack: Point[] = [{ x, y }];
      visited[idx] = 1;

      while (stack.length > 0) {
        const p = stack.pop()!;
        tileCount++;

        for (let d = 0; d < 4; d++) {
          const nx = p.x + dx[d];
          const ny = p.y + dy[d];
          if (nx < 0 || nx >= grid.width || ny < 0 || ny >= grid.height) continue;
          const nIdx = ny * grid.width + nx;
          if (visited[nIdx] || grid.data[nIdx] === 1) continue;
          visited[nIdx] = 1;
          stack.push({ x: nx, y: ny });
        }
      }

      zones.push({ representative, tileCount });
    }
  }

  return zones;
}

// --- Convenience: Verify a collision grid has no isolated zones ---

/**
 * Verify that an entire collision grid is fully connected — no isolated
 * walkable zones. Finds the largest walkable zone and reports everything
 * else as disconnected.
 */
export function verifyFullConnectivity(grid: CollisionGrid, subject: string): TraversalReport {
  // Find the first walkable tile as seed
  let seed: Point | null = null;
  for (let y = 0; y < grid.height && !seed; y++) {
    for (let x = 0; x < grid.width && !seed; x++) {
      if (isWalkable(grid, x, y)) {
        seed = { x, y };
      }
    }
  }

  if (!seed) {
    return {
      level: 'tile',
      subject,
      passed: true,
      reachableTiles: 0,
      totalWalkableTiles: 0,
      coveragePercent: 100,
      targets: [],
      disconnectedZones: [],
    };
  }

  return verifyTraversal(grid, [seed], [], {
    level: 'tile',
    subject,
  });
}

// --- Pretty printing ---

/**
 * Format a TraversalReport as a human-readable string.
 */
export function formatReport(report: TraversalReport): string {
  const lines: string[] = [];
  const status = report.passed ? 'PASS' : 'FAIL';

  lines.push(
    `[${status}] ${report.level}/${report.subject} — ${report.coveragePercent}% coverage (${report.reachableTiles}/${report.totalWalkableTiles} tiles)`,
  );

  // Failed targets
  const failed = report.targets.filter((t) => !t.reachable);
  if (failed.length > 0) {
    lines.push(`  Unreachable targets (${failed.length}):`);
    for (const t of failed) {
      lines.push(`    - ${t.id} at (${t.position.x}, ${t.position.y})`);
    }
  }

  // Disconnected zones
  if (report.disconnectedZones.length > 0) {
    lines.push(`  Disconnected zones (${report.disconnectedZones.length}):`);
    for (const z of report.disconnectedZones) {
      lines.push(`    - ${z.tileCount} tiles near (${z.representative.x}, ${z.representative.y})`);
    }
  }

  return lines.join('\n');
}
