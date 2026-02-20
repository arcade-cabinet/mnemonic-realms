/**
 * Hamlet Organism — Self-Arranging Village Cluster
 *
 * A hamlet is a small settlement: N houses arranged in a rough ring
 * around a central well or gathering point. Internal dirt paths radiate
 * from the center to each house door.
 *
 * Config:
 *   houses: number (3-8)
 *   well: boolean
 *   fences: boolean
 *   houseStyle: 'small' | 'medium' | 'mixed'
 *
 * Architecture level: ORGANISM
 */

import { SeededRNG } from '../fill-engine';
import type { Point } from '../path-router';

// --- Types ---

export interface HamletConfig {
  houses: number;
  well?: boolean;
  fences?: boolean;
  houseStyle?: 'small' | 'medium' | 'mixed';
}

export interface HamletLayout {
  /** Bounding box used */
  bounds: { x: number; y: number; width: number; height: number };
  /** Where each house is placed (top-left corner in tiles) */
  housePlacements: Array<{
    archetype: string;
    position: Point;
    doorAnchor: Point;
  }>;
  /** Well position (if enabled) */
  wellPosition?: Point;
  /** Internal path segments connecting houses to center */
  internalPaths: Array<{ from: Point; to: Point }>;
  /** External anchor — where roads from outside connect */
  externalAnchors: Point[];
}

// Approximate building sizes (tiles) — will be refined by actual archetype data
const HOUSE_SIZES: Record<string, { width: number; height: number }> = {
  'house-small': { width: 6, height: 6 },
  'house-medium': { width: 8, height: 7 },
};

/**
 * Layout a hamlet within the given bounds.
 *
 * Algorithm:
 * 1. Place well at center
 * 2. Place houses in a ring around center, spaced by footprint + gap
 * 3. Connect each house door to center with internal path
 * 4. Expose main anchor on the side nearest the map center
 */
export function layoutHamlet(
  bounds: { x: number; y: number; width: number; height: number },
  config: HamletConfig,
  seed: number,
): HamletLayout {
  const rng = new SeededRNG(seed);
  const cx = bounds.x + Math.floor(bounds.width / 2);
  const cy = bounds.y + Math.floor(bounds.height / 2);
  const n = Math.min(config.houses, 8);

  // Determine ring radius based on bounds and house count
  const maxRadius = Math.floor(Math.min(bounds.width, bounds.height) / 2) - 4;
  const radius = Math.max(8, Math.min(maxRadius, 8 + n * 2));

  const housePlacements: HamletLayout['housePlacements'] = [];
  const internalPaths: HamletLayout['internalPaths'] = [];

  // Place houses in a ring
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + rng.next() * 0.3;
    const r = radius + rng.nextInt(-2, 2);

    // Determine house archetype
    let archetype: string;
    if (config.houseStyle === 'medium') {
      archetype = 'house-medium';
    } else if (config.houseStyle === 'mixed') {
      archetype = rng.chance(0.4) ? 'house-medium' : 'house-small';
    } else {
      archetype = 'house-small';
    }

    const size = HOUSE_SIZES[archetype] || HOUSE_SIZES['house-small'];
    const hx = cx + Math.round(Math.cos(angle) * r) - Math.floor(size.width / 2);
    const hy = cy + Math.round(Math.sin(angle) * r) - Math.floor(size.height / 2);

    // Door anchor: bottom-center of house
    const doorX = hx + Math.floor(size.width / 2);
    const doorY = hy + size.height;

    housePlacements.push({
      archetype,
      position: { x: hx, y: hy },
      doorAnchor: { x: doorX, y: doorY },
    });

    // Internal path from door to center
    internalPaths.push({
      from: { x: doorX, y: doorY },
      to: { x: cx, y: cy },
    });
  }

  // Well at center
  const wellPosition = config.well ? { x: cx, y: cy } : undefined;

  // External anchor: south of the hamlet (toward map center by default)
  const externalAnchors: Point[] = [{ x: cx, y: cy + radius + 4 }];

  return {
    bounds,
    housePlacements,
    wellPosition,
    internalPaths,
    externalAnchors,
  };
}
