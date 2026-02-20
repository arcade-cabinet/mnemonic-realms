/**
 * Mountain path assemblage factory.
 *
 * Creates winding mountain trails through elevated terrain — rocky switchbacks
 * climbing ridgelines, narrow passes between crags, and exposed ridgetop trails
 * where wind-scoured stone replaces soft earth. Used for Sunridge's highland
 * approaches, Hollow Ridge's steep ascents, and the mountain trails connecting
 * Settled Lands to the Frontier.
 *
 * The path is walkable with rocky terrain on either side that blocks movement.
 * Higher-elevation paths use cliff terrain, while lower foothills use a mix of
 * stone and sparse grass.
 */
import type { Anchor, AssemblageDefinition, AssemblageObject, VisualObject } from '../../types.ts';

type PathStyle = 'switchback' | 'pass' | 'ridge' | 'ascent';

interface MountainPathOptions {
  /** Unique assemblage ID */
  id: string;
  /** Path style determines terrain composition and shape */
  style: PathStyle;
  /** Total length of the path in tiles */
  length: number;
  /** Width of the walkable trail in tiles (default: 2) */
  pathWidth?: number;
  /** Elevation tier affects terrain appearance: 'low' = grass/stone mix, 'high' = bare rock/cliff */
  elevation?: 'low' | 'high';
  /** Scatter boulders along the path (default: true) */
  boulders?: boolean;
  /** Wind shrine or rest point along the path */
  landmark?: {
    id: string;
    type: 'shrine' | 'rest' | 'overlook';
    offset: number;
    description?: string;
  };
  /** Resonance stone placement */
  resonanceStone?: {
    id: string;
    fragments: string;
    offset: number;
  };
}

const BOULDER_REFS = ['prop.rock-large-1', 'prop.rock-medium-1', 'prop.rock-small-1'];

export function createMountainPath(opts: MountainPathOptions): AssemblageDefinition {
  const pw = opts.pathWidth ?? 2;
  const elevation = opts.elevation ?? 'low';

  switch (opts.style) {
    case 'switchback':
      return buildSwitchbackPath(opts, pw, elevation);
    case 'pass':
      return buildMountainPass(opts, pw, elevation);
    case 'ridge':
      return buildRidgePath(opts, pw, elevation);
    case 'ascent':
      return buildAscentPath(opts, pw, elevation);
  }
}

function terrainForElevation(elevation: 'low' | 'high', variant: 'path' | 'wall' | 'edge'): string {
  if (variant === 'path') {
    return elevation === 'high' ? 'terrain:ground.stone' : 'terrain:ground.dirt';
  }
  if (variant === 'wall') {
    return elevation === 'high' ? 'terrain:cliff.rock' : 'terrain:ground.dark-grass';
  }
  // Edge — transitional
  return elevation === 'high' ? 'terrain:ground.stone' : 'terrain:ground.light-grass';
}

/**
 * Switchback: a zigzag trail climbing a slope. The path alternates direction
 * on each tier, connected by short vertical segments.
 */
function buildSwitchbackPath(
  opts: MountainPathOptions,
  pw: number,
  elevation: 'low' | 'high',
): AssemblageDefinition {
  const tiers = Math.max(2, Math.floor(opts.length / 12));
  const tierWidth = opts.length;
  const tierHeight = pw + 2;
  const width = tierWidth;
  const height = tiers * tierHeight;

  const groundTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tier = Math.floor(y / tierHeight);
      const localY = y - tier * tierHeight;
      const isOnPath = localY >= 1 && localY < 1 + pw;

      // Connecting vertical segments at alternating ends
      const connectLeft = tier % 2 === 1;
      const isVerticalConnect =
        localY >= tierHeight - 1 &&
        tier < tiers - 1 &&
        (connectLeft ? x < pw + 1 : x >= width - pw - 1);

      if (isOnPath || isVerticalConnect) {
        groundTiles.push(terrainForElevation(elevation, 'path'));
        collisionData.push(0);
      } else if (localY === 0 || localY === 1 + pw) {
        groundTiles.push(terrainForElevation(elevation, 'edge'));
        collisionData.push(1);
      } else {
        groundTiles.push(terrainForElevation(elevation, 'wall'));
        collisionData.push(1);
      }
    }
  }

  const visuals: VisualObject[] = [];
  if (opts.boulders !== false) {
    let rng = opts.length * 37 + tiers * 13;
    const nextRng = () => {
      rng = (rng * 1103515245 + 12345) & 0x7fffffff;
      return rng;
    };

    const count = Math.floor(width / 10) + 1;
    for (let i = 0; i < count; i++) {
      const bx = 2 + (nextRng() % Math.max(1, width - 4));
      const by = nextRng() % height;
      const tier = Math.floor(by / tierHeight);
      const localY = by - tier * tierHeight;
      // Place boulders only in wall areas
      if (localY === 0 || localY >= 1 + pw) {
        const ref = BOULDER_REFS[nextRng() % BOULDER_REFS.length];
        visuals.push({ objectRef: ref, x: bx, y: by });
      }
    }
  }

  const objects: AssemblageObject[] = [];
  if (opts.landmark) {
    objects.push({
      name: opts.landmark.id,
      type: 'trigger',
      x: Math.floor(width / 2),
      y: Math.min(opts.landmark.offset, height - 1),
      properties: {
        eventType: 'action',
        landmarkType: opts.landmark.type,
        description: opts.landmark.description ?? `Mountain ${opts.landmark.type}`,
      },
    });
  }

  if (opts.resonanceStone) {
    objects.push({
      name: opts.resonanceStone.id,
      type: 'trigger',
      x: Math.floor(width / 2),
      y: Math.min(opts.resonanceStone.offset, height - 1),
      properties: {
        eventType: 'action',
        fragments: opts.resonanceStone.fragments,
        description: `Windswept Resonance Stone`,
      },
    });
  }

  return {
    id: opts.id,
    description: `Mountain switchback (${tiers} tiers, ${elevation} elevation)`,
    width,
    height,
    layers: {
      ground: { width, height, tiles: groundTiles },
    },
    collision: { width, height, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    anchors: [
      { name: 'bottom', x: Math.floor(width / 2), y: height - 1 },
      { name: 'top', x: Math.floor(width / 2), y: 0 },
    ],
  };
}

/**
 * Mountain pass: a narrow corridor between two rock walls.
 * The Shattered Pass in Hollow Ridge uses this shape.
 */
function buildMountainPass(
  opts: MountainPathOptions,
  pw: number,
  elevation: 'low' | 'high',
): AssemblageDefinition {
  const wallThickness = 3;
  const width = pw + wallThickness * 2;
  const height = opts.length;
  const pathStart = wallThickness;
  const pathEnd = wallThickness + pw;

  const groundTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x >= pathStart && x < pathEnd) {
        groundTiles.push(terrainForElevation(elevation, 'path'));
        collisionData.push(0);
      } else if (x === pathStart - 1 || x === pathEnd) {
        groundTiles.push(terrainForElevation(elevation, 'edge'));
        collisionData.push(1);
      } else {
        groundTiles.push(terrainForElevation(elevation, 'wall'));
        collisionData.push(1);
      }
    }
  }

  const visuals: VisualObject[] = [];
  if (opts.boulders !== false) {
    let rng = opts.length * 41;
    const nextRng = () => {
      rng = (rng * 1103515245 + 12345) & 0x7fffffff;
      return rng;
    };
    for (let i = 0; i < 3; i++) {
      const bx = nextRng() % wallThickness;
      const by = 2 + (nextRng() % Math.max(1, height - 4));
      const side = nextRng() % 2 === 0 ? bx : width - 1 - bx;
      const ref = BOULDER_REFS[nextRng() % BOULDER_REFS.length];
      visuals.push({ objectRef: ref, x: side, y: by });
    }
  }

  const objects: AssemblageObject[] = [];
  if (opts.landmark) {
    objects.push({
      name: opts.landmark.id,
      type: 'trigger',
      x: pathStart + Math.floor(pw / 2),
      y: Math.min(opts.landmark.offset, height - 1),
      properties: {
        eventType: 'action',
        landmarkType: opts.landmark.type,
        description: opts.landmark.description ?? `Mountain ${opts.landmark.type}`,
      },
    });
  }

  if (opts.resonanceStone) {
    objects.push({
      name: opts.resonanceStone.id,
      type: 'trigger',
      x: pathStart + Math.floor(pw / 2),
      y: Math.min(opts.resonanceStone.offset, height - 1),
      properties: {
        eventType: 'action',
        fragments: opts.resonanceStone.fragments,
        description: 'Pass Resonance Stone lodged in the rock wall',
      },
    });
  }

  return {
    id: opts.id,
    description: `Mountain pass (${opts.length} tiles, ${pw} wide)`,
    width,
    height,
    layers: {
      ground: { width, height, tiles: groundTiles },
    },
    collision: { width, height, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    anchors: [
      { name: 'north', x: pathStart + Math.floor(pw / 2), y: 0 },
      { name: 'south', x: pathStart + Math.floor(pw / 2), y: height - 1 },
    ],
  };
}

/**
 * Ridge: an exposed ridgetop trail with drop-offs on both sides.
 * Used for Sunridge overlooks and Hollow Ridge elevated areas.
 */
function buildRidgePath(
  opts: MountainPathOptions,
  pw: number,
  elevation: 'low' | 'high',
): AssemblageDefinition {
  const dropWidth = 4; // Visual abyss tiles on each side
  const width = pw + dropWidth * 2;
  const height = opts.length;

  const groundTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pathStart = dropWidth;
      const pathEnd = dropWidth + pw;

      if (x >= pathStart && x < pathEnd) {
        // Walkable ridge
        groundTiles.push(terrainForElevation(elevation, 'path'));
        detailTiles.push(0);
        collisionData.push(0);
      } else if (x === pathStart - 1 || x === pathEnd) {
        // Cliff edge — the visual border between walkable and void
        groundTiles.push('terrain:cliff.edge');
        detailTiles.push(0);
        collisionData.push(1);
      } else {
        // Drop-off — deep shadow or void
        groundTiles.push('terrain:cliff.abyss');
        detailTiles.push(elevation === 'high' ? 'terrain:shadow.deep' : 'terrain:shadow.light');
        collisionData.push(1);
      }
    }
  }

  const objects: AssemblageObject[] = [];
  if (opts.landmark) {
    objects.push({
      name: opts.landmark.id,
      type: 'trigger',
      x: dropWidth + Math.floor(pw / 2),
      y: Math.min(opts.landmark.offset, height - 1),
      properties: {
        eventType: 'action',
        landmarkType: opts.landmark.type,
        description: opts.landmark.description ?? 'Windswept ridgetop overlook',
      },
    });
  }

  if (opts.resonanceStone) {
    objects.push({
      name: opts.resonanceStone.id,
      type: 'trigger',
      x: dropWidth + Math.floor(pw / 2),
      y: Math.min(opts.resonanceStone.offset, height - 1),
      properties: {
        eventType: 'action',
        fragments: opts.resonanceStone.fragments,
        description: 'Resonance Stone balanced on the ridge crest',
      },
    });
  }

  return {
    id: opts.id,
    description: `Ridge path (${opts.length} tiles, ${elevation} elevation)`,
    width,
    height,
    layers: {
      ground: { width, height, tiles: groundTiles },
      ground2: { width, height, tiles: detailTiles },
    },
    collision: { width, height, data: collisionData },
    objects: objects.length > 0 ? objects : undefined,
    anchors: [
      { name: 'north', x: dropWidth + Math.floor(pw / 2), y: 0 },
      { name: 'south', x: dropWidth + Math.floor(pw / 2), y: height - 1 },
    ],
  };
}

/**
 * Ascent: a wide, gradually sloping trail — the approach from lowlands up
 * into highland terrain. Terrain transitions from grass to stone as y decreases.
 */
function buildAscentPath(
  opts: MountainPathOptions,
  pw: number,
  elevation: 'low' | 'high',
): AssemblageDefinition {
  const margin = 3;
  const width = pw + margin * 2;
  const height = opts.length;

  const groundTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  for (let y = 0; y < height; y++) {
    // Elevation gradient: bottom = low, top = high
    const progress = 1 - y / height;
    const currentElevation: 'low' | 'high' =
      elevation === 'high' ? (progress > 0.3 ? 'high' : 'low') : progress > 0.7 ? 'high' : 'low';

    for (let x = 0; x < width; x++) {
      if (x >= margin && x < margin + pw) {
        groundTiles.push(terrainForElevation(currentElevation, 'path'));
        collisionData.push(0);
      } else if (x === margin - 1 || x === margin + pw) {
        groundTiles.push(terrainForElevation(currentElevation, 'edge'));
        collisionData.push(0);
      } else {
        groundTiles.push(terrainForElevation(currentElevation, 'wall'));
        collisionData.push(1);
      }
    }
  }

  const visuals: VisualObject[] = [];
  if (opts.boulders !== false) {
    let rng = opts.length * 29 + width * 7;
    const nextRng = () => {
      rng = (rng * 1103515245 + 12345) & 0x7fffffff;
      return rng;
    };

    const count = Math.floor(opts.length / 15) + 1;
    for (let i = 0; i < count; i++) {
      const by = 2 + (nextRng() % Math.max(1, height - 4));
      const side = nextRng() % 2 === 0 ? nextRng() % margin : width - 1 - (nextRng() % margin);
      const ref = BOULDER_REFS[nextRng() % BOULDER_REFS.length];
      visuals.push({ objectRef: ref, x: side, y: by });
    }
  }

  const objects: AssemblageObject[] = [];
  if (opts.landmark) {
    objects.push({
      name: opts.landmark.id,
      type: 'trigger',
      x: margin + Math.floor(pw / 2),
      y: Math.min(opts.landmark.offset, height - 1),
      properties: {
        eventType: 'action',
        landmarkType: opts.landmark.type,
        description: opts.landmark.description ?? 'Mountain trail marker',
      },
    });
  }

  if (opts.resonanceStone) {
    objects.push({
      name: opts.resonanceStone.id,
      type: 'trigger',
      x: margin + Math.floor(pw / 2),
      y: Math.min(opts.resonanceStone.offset, height - 1),
      properties: {
        eventType: 'action',
        fragments: opts.resonanceStone.fragments,
        description: 'Resonance Stone at the mountain trail waypoint',
      },
    });
  }

  return {
    id: opts.id,
    description: `Mountain ascent (${opts.length} tiles, ${elevation})`,
    width,
    height,
    layers: {
      ground: { width, height, tiles: groundTiles },
    },
    collision: { width, height, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    anchors: [
      { name: 'summit', x: margin + Math.floor(pw / 2), y: 0 },
      { name: 'base', x: margin + Math.floor(pw / 2), y: height - 1 },
    ],
  };
}
