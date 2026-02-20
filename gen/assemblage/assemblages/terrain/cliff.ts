/**
 * Cliff assemblage factory.
 *
 * Creates cliff and rock formations — sheer faces, jagged outcrops, and
 * stepped ledges. Cliffs are the primary elevation markers in a 2D top-down
 * world, communicating height through visual layering and shadow. Used
 * across Sunridge (cliff edges overlooking Everwick), Hollow Ridge (steep
 * mountain walls), the Undrawn Peaks (wireframe precipices), and anywhere
 * terrain drops sharply.
 *
 * Variants:
 * - 'wall': vertical cliff face along an edge — impassable barrier
 * - 'ledge': stepped terrain with walkable shelves between cliff faces
 * - 'formation': isolated rocky spire/mesa surrounded by open ground
 * - 'canyon': two parallel cliff walls with a narrow floor between them
 */
import type { AssemblageDefinition, Anchor, AssemblageObject, VisualObject } from '../../types.ts';

type CliffVariant = 'wall' | 'ledge' | 'formation' | 'canyon';
type CliffEdge = 'north' | 'south' | 'east' | 'west';

interface CliffOptions {
  /** Unique assemblage ID */
  id: string;
  /** Cliff variant */
  variant: CliffVariant;
  /** Primary dimension in tiles (length for wall/canyon, diameter for formation) */
  length: number;
  /** Height/depth of the cliff in tiles (default: 4) */
  depth?: number;
  /** Which edge the cliff faces — wall and ledge only */
  edge?: CliffEdge;
  /** Number of ledge steps — ledge variant only (default: 2) */
  steps?: number;
  /** Canyon floor width — canyon variant only (default: 3) */
  floorWidth?: number;
  /** Cave or passage hidden in the cliff */
  hiddenPassage?: {
    id: string;
    offset: number;
    targetMap?: string;
    description?: string;
  };
  /** Treasure or object perched on a ledge */
  ledgeObject?: {
    id: string;
    type: 'chest' | 'trigger';
    contents?: string;
    description?: string;
  };
}

export function createCliff(opts: CliffOptions): AssemblageDefinition {
  switch (opts.variant) {
    case 'wall':
      return buildCliffWall(opts);
    case 'ledge':
      return buildCliffLedge(opts);
    case 'formation':
      return buildCliffFormation(opts);
    case 'canyon':
      return buildCanyon(opts);
  }
}

function buildCliffWall(opts: CliffOptions): AssemblageDefinition {
  const edge = opts.edge ?? 'north';
  const depth = opts.depth ?? 4;
  const isHorizontal = edge === 'north' || edge === 'south';
  const width = isHorizontal ? opts.length : depth;
  const height = isHorizontal ? depth : opts.length;

  const groundTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Distance from the cliff face
      let distFromFace: number;
      if (edge === 'north') distFromFace = y;
      else if (edge === 'south') distFromFace = height - 1 - y;
      else if (edge === 'west') distFromFace = x;
      else distFromFace = width - 1 - x;

      if (distFromFace === 0) {
        // Cliff edge
        groundTiles.push('terrain:cliff.edge');
        detailTiles.push(0);
        collisionData.push(1);
      } else if (distFromFace < depth - 1) {
        // Cliff face
        groundTiles.push('terrain:cliff.rock');
        detailTiles.push('terrain:shadow.deep');
        collisionData.push(1);
      } else {
        // Cliff base shadow
        groundTiles.push('terrain:cliff.rock');
        detailTiles.push('terrain:shadow.light');
        collisionData.push(1);
      }
    }
  }

  const objects: AssemblageObject[] = [];
  if (opts.hiddenPassage) {
    const passX = isHorizontal
      ? opts.hiddenPassage.offset
      : edge === 'west' ? 0 : width - 1;
    const passY = isHorizontal
      ? (edge === 'north' ? 0 : height - 1)
      : opts.hiddenPassage.offset;

    objects.push({
      name: opts.hiddenPassage.id,
      type: 'transition',
      x: passX,
      y: passY,
      properties: {
        description: opts.hiddenPassage.description ?? 'A narrow fissure in the rock face',
        ...(opts.hiddenPassage.targetMap ? { targetMap: opts.hiddenPassage.targetMap } : {}),
      },
    });

    // Clear collision at the passage
    const idx = passY * width + passX;
    if (idx >= 0 && idx < collisionData.length) {
      collisionData[idx] = 0;
    }
  }

  const anchors: Anchor[] = [];
  if (isHorizontal) {
    anchors.push(
      { name: 'left', x: 0, y: Math.floor(height / 2) },
      { name: 'right', x: width - 1, y: Math.floor(height / 2) },
    );
  } else {
    anchors.push(
      { name: 'top', x: Math.floor(width / 2), y: 0 },
      { name: 'bottom', x: Math.floor(width / 2), y: height - 1 },
    );
  }

  return {
    id: opts.id,
    description: `Cliff wall (${edge} edge, ${opts.length} tiles)`,
    width,
    height,
    layers: {
      ground: { width, height, tiles: groundTiles },
      ground2: { width, height, tiles: detailTiles },
    },
    collision: { width, height, data: collisionData },
    objects: objects.length > 0 ? objects : undefined,
    anchors,
  };
}

function buildCliffLedge(opts: CliffOptions): AssemblageDefinition {
  const edge = opts.edge ?? 'north';
  const depth = opts.depth ?? 6;
  const steps = opts.steps ?? 2;
  const stepDepth = Math.floor(depth / steps);
  const isHorizontal = edge === 'north' || edge === 'south';
  const width = isHorizontal ? opts.length : depth;
  const height = isHorizontal ? depth : opts.length;

  const groundTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let distFromFace: number;
      if (edge === 'north') distFromFace = y;
      else if (edge === 'south') distFromFace = height - 1 - y;
      else if (edge === 'west') distFromFace = x;
      else distFromFace = width - 1 - x;

      const step = Math.floor(distFromFace / stepDepth);
      const posInStep = distFromFace % stepDepth;

      if (posInStep === 0) {
        // Cliff edge at each step
        groundTiles.push('terrain:cliff.edge');
        detailTiles.push(0);
        collisionData.push(1);
      } else if (posInStep < stepDepth - 1) {
        // Walkable ledge surface
        groundTiles.push(step % 2 === 0 ? 'terrain:ground.stone' : 'terrain:ground.highland-grass');
        detailTiles.push(0);
        collisionData.push(0);
      } else {
        // Shadow at base of next step
        groundTiles.push('terrain:ground.stone');
        detailTiles.push('terrain:shadow.light');
        collisionData.push(0);
      }
    }
  }

  const objects: AssemblageObject[] = [];
  if (opts.ledgeObject) {
    // Place object on the highest ledge
    const objX = isHorizontal ? Math.floor(opts.length / 2) : 1;
    const objY = isHorizontal ? 1 : Math.floor(opts.length / 2);
    objects.push({
      name: opts.ledgeObject.id,
      type: opts.ledgeObject.type,
      x: objX,
      y: objY,
      properties: {
        ...(opts.ledgeObject.contents ? { contents: opts.ledgeObject.contents } : {}),
        description: opts.ledgeObject.description ?? 'An object perched on a high ledge',
      },
    });
  }

  if (opts.hiddenPassage) {
    const passX = isHorizontal ? opts.hiddenPassage.offset : Math.floor(width / 2);
    const passY = isHorizontal ? Math.floor(height / 2) : opts.hiddenPassage.offset;
    objects.push({
      name: opts.hiddenPassage.id,
      type: 'transition',
      x: passX,
      y: passY,
      properties: {
        description: opts.hiddenPassage.description ?? 'A hidden crevice between the ledges',
        ...(opts.hiddenPassage.targetMap ? { targetMap: opts.hiddenPassage.targetMap } : {}),
      },
    });
  }

  return {
    id: opts.id,
    description: `Cliff ledge (${steps} steps, ${opts.length} tiles)`,
    width,
    height,
    layers: {
      ground: { width, height, tiles: groundTiles },
      ground2: { width, height, tiles: detailTiles },
    },
    collision: { width, height, data: collisionData },
    objects: objects.length > 0 ? objects : undefined,
    anchors: [
      { name: 'top-ledge', x: Math.floor(width / 2), y: isHorizontal ? 1 : 1 },
      {
        name: 'base',
        x: Math.floor(width / 2),
        y: isHorizontal ? height - 1 : height - 1,
      },
    ],
  };
}

function buildCliffFormation(opts: CliffOptions): AssemblageDefinition {
  const diameter = opts.length;
  const width = diameter + 4;
  const height = diameter + 4;
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const r = Math.floor(diameter / 2);

  const groundTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];
  const visuals: VisualObject[] = [];

  let rng = diameter * 59;
  const nextRng = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng;
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

      if (dist <= r * 0.4) {
        // Core — solid rock
        groundTiles.push('terrain:cliff.rock');
        detailTiles.push('terrain:shadow.deep');
        collisionData.push(1);

        if (nextRng() % 5 === 0) {
          visuals.push({ objectRef: 'prop.rock-medium-1', x, y });
        }
      } else if (dist <= r * 0.7) {
        // Rocky slope
        groundTiles.push('terrain:cliff.rock');
        detailTiles.push('terrain:shadow.light');
        collisionData.push(1);
      } else if (dist <= r) {
        // Rubble/scree ring — partially passable
        groundTiles.push('terrain:ground.stone');
        detailTiles.push(0);
        collisionData.push(nextRng() % 3 === 0 ? 1 : 0);
      } else if (dist <= r + 1) {
        // Shadow at base
        groundTiles.push('terrain:ground.highland-grass');
        detailTiles.push('terrain:shadow.light');
        collisionData.push(0);
      } else {
        groundTiles.push('terrain:ground.grass');
        detailTiles.push(0);
        collisionData.push(0);
      }
    }
  }

  const objects: AssemblageObject[] = [];
  if (opts.ledgeObject) {
    // Place on the formation's outer edge
    objects.push({
      name: opts.ledgeObject.id,
      type: opts.ledgeObject.type,
      x: cx + r - 1,
      y: cy,
      properties: {
        ...(opts.ledgeObject.contents ? { contents: opts.ledgeObject.contents } : {}),
        description:
          opts.ledgeObject.description ?? 'Tucked into a crevice in the rock formation',
      },
    });
  }

  if (opts.hiddenPassage) {
    objects.push({
      name: opts.hiddenPassage.id,
      type: 'transition',
      x: cx,
      y: cy + r,
      properties: {
        description:
          opts.hiddenPassage.description ?? 'A dark opening at the base of the rock spire',
        ...(opts.hiddenPassage.targetMap ? { targetMap: opts.hiddenPassage.targetMap } : {}),
      },
    });
  }

  return {
    id: opts.id,
    description: `Cliff formation (${diameter} tile diameter)`,
    width,
    height,
    layers: {
      ground: { width, height, tiles: groundTiles },
      ground2: { width, height, tiles: detailTiles },
    },
    collision: { width, height, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    anchors: [
      { name: 'north', x: cx, y: 0 },
      { name: 'south', x: cx, y: height - 1 },
      { name: 'east', x: width - 1, y: cy },
      { name: 'west', x: 0, y: cy },
    ],
  };
}

function buildCanyon(opts: CliffOptions): AssemblageDefinition {
  const floorWidth = opts.floorWidth ?? 3;
  const wallDepth = opts.depth ?? 4;
  const width = floorWidth + wallDepth * 2;
  const height = opts.length;

  const groundTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  const floorStart = wallDepth;
  const floorEnd = wallDepth + floorWidth;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x >= floorStart && x < floorEnd) {
        // Canyon floor — walkable
        groundTiles.push('terrain:ground.stone');
        detailTiles.push('terrain:shadow.light');
        collisionData.push(0);
      } else if (x === floorStart - 1 || x === floorEnd) {
        // Wall base — cliff edge
        groundTiles.push('terrain:cliff.edge');
        detailTiles.push('terrain:shadow.deep');
        collisionData.push(1);
      } else {
        // Canyon wall — solid rock
        groundTiles.push('terrain:cliff.rock');
        detailTiles.push('terrain:shadow.deep');
        collisionData.push(1);
      }
    }
  }

  const objects: AssemblageObject[] = [];
  if (opts.hiddenPassage) {
    const passX = floorStart + Math.floor(floorWidth / 2);
    objects.push({
      name: opts.hiddenPassage.id,
      type: 'transition',
      x: passX,
      y: opts.hiddenPassage.offset,
      properties: {
        description:
          opts.hiddenPassage.description ?? 'A crack in the canyon wall, just wide enough to squeeze through',
        ...(opts.hiddenPassage.targetMap ? { targetMap: opts.hiddenPassage.targetMap } : {}),
      },
    });
  }

  return {
    id: opts.id,
    description: `Canyon (${floorWidth} wide floor, ${opts.length} tiles long)`,
    width,
    height,
    layers: {
      ground: { width, height, tiles: groundTiles },
      ground2: { width, height, tiles: detailTiles },
    },
    collision: { width, height, data: collisionData },
    objects: objects.length > 0 ? objects : undefined,
    anchors: [
      { name: 'north', x: floorStart + Math.floor(floorWidth / 2), y: 0 },
      { name: 'south', x: floorStart + Math.floor(floorWidth / 2), y: height - 1 },
    ],
  };
}
