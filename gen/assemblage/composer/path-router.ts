/**
 * Path Router — A* Pathfinding for Map Composition
 *
 * Connects feature anchors with roads. After the composer places all
 * organisms/atoms, the path router runs A* on the collision grid to
 * find walkable routes between anchors, then "dresses" the paths with
 * biome-appropriate road tiles and decorations.
 *
 * Architecture level: MOLECULES → ORGANISMS (connecting tissue)
 */

// --- Types ---

export interface Point {
  x: number;
  y: number;
}

export interface PathRequest {
  /** Start point (feature anchor) */
  from: Point;
  /** End point (feature anchor) */
  to: Point;
  /** Road width in tiles */
  width: number;
  /** Road terrain type (e.g., 'road.dirt', 'road.brick') */
  terrain: string;
  /** Priority: main roads route first, branches adapt */
  priority: 'main' | 'branch' | 'internal';
}

export interface RoutedPath {
  /** The request that produced this path */
  request: PathRequest;
  /** Waypoints from A* (in tile coordinates) */
  waypoints: Point[];
  /** Total path length in tiles */
  length: number;
}

export interface CollisionGrid {
  width: number;
  height: number;
  /** 0 = passable, 1 = blocked, 2 = road (prefer), 3 = reserved (feature clearance) */
  data: Uint8Array;
}

// --- A* Implementation ---

interface AStarNode {
  x: number;
  y: number;
  g: number; // Cost from start
  h: number; // Heuristic to goal
  f: number; // g + h
  parent: AStarNode | null;
}

/**
 * A* pathfinding on a collision grid.
 *
 * Biases toward straight lines and gentle curves for visual clarity.
 * Prefers grid-aligned paths (horizontal/vertical) over diagonals.
 */
export function findPath(
  grid: CollisionGrid,
  from: Point,
  to: Point,
  roadWidth: number = 1,
): Point[] | null {
  const { width, height, data } = grid;

  // Clamp endpoints to grid
  const sx = clamp(Math.round(from.x), 0, width - 1);
  const sy = clamp(Math.round(from.y), 0, height - 1);
  const ex = clamp(Math.round(to.x), 0, width - 1);
  const ey = clamp(Math.round(to.y), 0, height - 1);

  // Check if a position is passable for the road width
  const isPassable = (x: number, y: number): boolean => {
    const halfW = Math.floor(roadWidth / 2);
    for (let dy = -halfW; dy <= halfW; dy++) {
      for (let dx = -halfW; dx <= halfW; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) return false;
        const cell = data[ny * width + nx];
        if (cell === 1) return false; // Blocked
      }
    }
    return true;
  };

  // Cost function: prefer existing roads (2), penalize reserved areas (3)
  const moveCost = (x: number, y: number): number => {
    const cell = data[y * width + x];
    if (cell === 2) return 0.5; // Existing road — cheap
    if (cell === 3) return 3; // Reserved — expensive but possible
    return 1; // Normal ground
  };

  // Manhattan distance with straight-line bias
  const heuristic = (x: number, y: number): number => {
    const dx = Math.abs(x - ex);
    const dy = Math.abs(y - ey);
    // Slight bias toward straight lines
    return dx + dy + Math.min(dx, dy) * 0.001;
  };

  // Open set as a simple priority queue (binary heap would be better for large maps)
  const open: AStarNode[] = [];
  const closed = new Set<number>();
  const key = (x: number, y: number) => y * width + x;

  const startNode: AStarNode = {
    x: sx,
    y: sy,
    g: 0,
    h: heuristic(sx, sy),
    f: heuristic(sx, sy),
    parent: null,
  };
  open.push(startNode);

  // Track best g for each cell
  const bestG = new Float32Array(width * height).fill(Infinity);
  bestG[key(sx, sy)] = 0;

  // 4-directional movement (grid-aligned preference)
  const dirs = [
    { dx: 0, dy: -1 }, // North
    { dx: 1, dy: 0 }, // East
    { dx: 0, dy: 1 }, // South
    { dx: -1, dy: 0 }, // West
  ];

  let iterations = 0;
  const maxIterations = width * height * 2; // Safety limit

  while (open.length > 0 && iterations < maxIterations) {
    iterations++;

    // Find node with lowest f
    let bestIdx = 0;
    for (let i = 1; i < open.length; i++) {
      if (open[i].f < open[bestIdx].f) bestIdx = i;
    }
    const current = open[bestIdx];
    open.splice(bestIdx, 1);

    // Goal reached?
    if (current.x === ex && current.y === ey) {
      return reconstructPath(current);
    }

    const ck = key(current.x, current.y);
    if (closed.has(ck)) continue;
    closed.add(ck);

    // Expand neighbors
    for (const dir of dirs) {
      const nx = current.x + dir.dx;
      const ny = current.y + dir.dy;

      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      if (closed.has(key(nx, ny))) continue;
      if (!isPassable(nx, ny)) continue;

      const cost = moveCost(nx, ny);
      const newG = current.g + cost;
      const nk = key(nx, ny);

      if (newG < bestG[nk]) {
        bestG[nk] = newG;
        const h = heuristic(nx, ny);
        open.push({
          x: nx,
          y: ny,
          g: newG,
          h,
          f: newG + h,
          parent: current,
        });
      }
    }
  }

  return null; // No path found
}

/**
 * Route all path requests, respecting priority order.
 * Main roads route first, then branches adapt around them.
 */
export function routeAll(grid: CollisionGrid, requests: PathRequest[]): RoutedPath[] {
  // Sort by priority: main first, then branch, then internal
  const priorityOrder = { main: 0, branch: 1, internal: 2 };
  const sorted = [...requests].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );

  const results: RoutedPath[] = [];

  for (const request of sorted) {
    const waypoints = findPath(grid, request.from, request.to, request.width);

    if (waypoints) {
      results.push({
        request,
        waypoints,
        length: waypoints.length,
      });

      // Stamp the routed path onto the grid as "road" (value 2)
      // so subsequent paths prefer to share roads
      stampPathOnGrid(grid, waypoints, request.width);
    }
  }

  return results;
}

/**
 * Stamp a path onto the collision grid, marking tiles as road (2).
 */
function stampPathOnGrid(grid: CollisionGrid, waypoints: Point[], width: number): void {
  const halfW = Math.floor(width / 2);
  for (const point of waypoints) {
    for (let dy = -halfW; dy <= halfW; dy++) {
      for (let dx = -halfW; dx <= halfW; dx++) {
        const x = point.x + dx;
        const y = point.y + dy;
        if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
          const idx = y * grid.width + x;
          if (grid.data[idx] === 0) {
            grid.data[idx] = 2; // Mark as road
          }
        }
      }
    }
  }
}

/**
 * Create a collision grid from map dimensions.
 * Initially all passable (0).
 */
export function createCollisionGrid(width: number, height: number): CollisionGrid {
  return {
    width,
    height,
    data: new Uint8Array(width * height),
  };
}

/**
 * Mark a rectangular area on the collision grid.
 */
export function markArea(
  grid: CollisionGrid,
  x: number,
  y: number,
  w: number,
  h: number,
  value: number,
): void {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const gx = x + dx;
      const gy = y + dy;
      if (gx >= 0 && gx < grid.width && gy >= 0 && gy < grid.height) {
        grid.data[gy * grid.width + gx] = value;
      }
    }
  }
}

/**
 * Mark clearance zone around a placed feature.
 * Sets surrounding tiles to "reserved" (3) so paths avoid hugging features.
 */
export function markClearance(
  grid: CollisionGrid,
  x: number,
  y: number,
  w: number,
  h: number,
  clearance: number,
): void {
  for (let dy = -clearance; dy < h + clearance; dy++) {
    for (let dx = -clearance; dx < w + clearance; dx++) {
      const gx = x + dx;
      const gy = y + dy;
      if (gx >= 0 && gx < grid.width && gy >= 0 && gy < grid.height) {
        const idx = gy * grid.width + gx;
        // Only mark empty tiles as reserved, don't overwrite blocked or road
        if (grid.data[idx] === 0) {
          // Skip the feature footprint itself
          if (dx >= 0 && dx < w && dy >= 0 && dy < h) continue;
          grid.data[idx] = 3;
        }
      }
    }
  }
}

/**
 * Simplify a path by removing redundant waypoints on straight segments.
 */
export function simplifyPath(points: Point[]): Point[] {
  if (points.length <= 2) return points;

  const result: Point[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    // Keep point if direction changes
    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;
    if (dx1 !== dx2 || dy1 !== dy2) {
      result.push(curr);
    }
  }
  result.push(points[points.length - 1]);
  return result;
}

// --- Helpers ---

function reconstructPath(node: AStarNode): Point[] {
  const path: Point[] = [];
  let current: AStarNode | null = node;
  while (current) {
    path.unshift({ x: current.x, y: current.y });
    current = current.parent;
  }
  return path;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
