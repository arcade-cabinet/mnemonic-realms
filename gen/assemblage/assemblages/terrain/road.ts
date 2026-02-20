/**
 * Road assemblage factory.
 *
 * Creates paths and roads connecting locations — cobblestone village roads,
 * packed-dirt cart tracks, gravel footpaths, and the fading trails that
 * dissolve at the world's unfinished edges. Roads are always walkable and
 * define the connective tissue between buildings, landmarks, and map edges.
 *
 * Everwick uses cobblestone roads radiating from the central square like
 * wheel spokes. Heartfield has packed-dirt cart tracks between farmsteads.
 * The Frontier uses gravel trails that thin and fade. The Sketch has
 * luminous line-paths that must be solidified by broadcasting.
 *
 * Variants:
 * - 'cobblestone': polished stone roads for villages and towns
 * - 'dirt': packed earth tracks for rural areas and farmland
 * - 'gravel': loose stone paths for wilderness and highlands
 * - 'fade': trails that dissolve from solid to sketch at one end
 */
import type { AssemblageDefinition, Anchor, AssemblageObject } from '../../types.ts';

type RoadVariant = 'cobblestone' | 'dirt' | 'gravel' | 'fade';
type RoadDirection = 'north-south' | 'east-west';

interface RoadOptions {
  /** Unique assemblage ID */
  id: string;
  /** Road surface type */
  variant: RoadVariant;
  /** Length of the road in tiles */
  length: number;
  /** Width of the road in tiles (default: 3) */
  width?: number;
  /** Primary direction (default: 'north-south') */
  direction?: RoadDirection;
  /** Shoulder width on each side — transition to surrounding terrain (default: 1) */
  shoulderWidth?: number;
  /** Crossroads intersection at this offset (creates a perpendicular branch) */
  crossroads?: {
    offset: number;
    branchLength: number;
    /** Which side the branch extends ('left' or 'right' relative to travel direction) */
    side: 'left' | 'right' | 'both';
  };
  /** Signpost or milestone along the road */
  signpost?: {
    id: string;
    offset: number;
    description: string;
  };
  /** Transition at each end */
  transitions?: {
    start?: { id: string; targetMap: string; description?: string };
    end?: { id: string; targetMap: string; description?: string };
  };
}

function terrainForVariant(variant: RoadVariant, position: 'center' | 'shoulder'): string {
  if (position === 'shoulder') {
    switch (variant) {
      case 'cobblestone':
        return 'terrain:ground.light-grass';
      case 'dirt':
        return 'terrain:ground.grass';
      case 'gravel':
        return 'terrain:ground.highland-grass';
      case 'fade':
        return 'terrain:ground.light-grass';
    }
  }

  switch (variant) {
    case 'cobblestone':
      return 'terrain:road.cobblestone';
    case 'dirt':
      return 'terrain:road.dirt';
    case 'gravel':
      return 'terrain:road.gravel';
    case 'fade':
      return 'terrain:road.dirt';
  }
}

export function createRoad(opts: RoadOptions): AssemblageDefinition {
  const roadW = opts.width ?? 3;
  const shoulderW = opts.shoulderWidth ?? 1;
  const direction = opts.direction ?? 'north-south';
  const isVertical = direction === 'north-south';
  const isFade = opts.variant === 'fade';

  // Calculate total dimensions
  let totalWidth: number;
  let totalHeight: number;

  if (opts.crossroads) {
    const branchExtent =
      opts.crossroads.side === 'both'
        ? opts.crossroads.branchLength * 2 + roadW + shoulderW * 2
        : opts.crossroads.branchLength + roadW + shoulderW * 2;

    if (isVertical) {
      totalWidth = Math.max(roadW + shoulderW * 2, branchExtent);
      totalHeight = opts.length;
    } else {
      totalWidth = opts.length;
      totalHeight = Math.max(roadW + shoulderW * 2, branchExtent);
    }
  } else {
    totalWidth = isVertical ? roadW + shoulderW * 2 : opts.length;
    totalHeight = isVertical ? opts.length : roadW + shoulderW * 2;
  }

  const groundTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  // Road center line
  const mainCenterCross = isVertical
    ? Math.floor(totalWidth / 2)
    : Math.floor(totalHeight / 2);
  const halfRoad = Math.floor(roadW / 2);

  for (let y = 0; y < totalHeight; y++) {
    for (let x = 0; x < totalWidth; x++) {
      const crossAxis = isVertical ? x : y;
      const alongAxis = isVertical ? y : x;

      // Check if this tile is on the main road
      const onMainRoad =
        crossAxis >= mainCenterCross - halfRoad &&
        crossAxis <= mainCenterCross + halfRoad;

      // Check if this tile is on the shoulder
      const onShoulder =
        !onMainRoad &&
        crossAxis >= mainCenterCross - halfRoad - shoulderW &&
        crossAxis <= mainCenterCross + halfRoad + shoulderW;

      // Check crossroads branch
      let onBranch = false;
      let onBranchShoulder = false;
      if (opts.crossroads) {
        const branchStart = opts.crossroads.offset;
        const branchEnd = branchStart + roadW;
        const isAtBranchAlong =
          (isVertical ? y : x) >= branchStart && (isVertical ? y : x) < branchEnd;

        if (isAtBranchAlong) {
          const side = opts.crossroads.side;
          const branchCenter = mainCenterCross;

          if (side === 'left' || side === 'both') {
            const leftExtent = branchCenter - halfRoad - opts.crossroads.branchLength;
            if (crossAxis >= leftExtent && crossAxis < branchCenter - halfRoad) {
              onBranch = true;
            }
            if (crossAxis >= leftExtent - shoulderW && crossAxis < leftExtent) {
              onBranchShoulder = true;
            }
          }
          if (side === 'right' || side === 'both') {
            const rightExtent = branchCenter + halfRoad + opts.crossroads.branchLength;
            if (crossAxis > branchCenter + halfRoad && crossAxis <= rightExtent) {
              onBranch = true;
            }
            if (crossAxis > rightExtent && crossAxis <= rightExtent + shoulderW) {
              onBranchShoulder = true;
            }
          }
        }
      }

      if (onMainRoad || onBranch) {
        // Fade variant: road dissolves toward the end
        if (isFade) {
          const progress = alongAxis / (isVertical ? totalHeight : totalWidth);
          if (progress > 0.85) {
            // Fully dissolved — transparent/empty
            groundTiles.push(0);
          } else if (progress > 0.6) {
            // Partial — sketch line-art road
            groundTiles.push('terrain:road.sketch');
          } else {
            groundTiles.push(terrainForVariant(opts.variant, 'center'));
          }
        } else {
          groundTiles.push(terrainForVariant(opts.variant, 'center'));
        }
        collisionData.push(0);
      } else if (onShoulder || onBranchShoulder) {
        groundTiles.push(terrainForVariant(opts.variant, 'shoulder'));
        collisionData.push(0);
      } else {
        groundTiles.push(0); // Transparent — blends with underlying map terrain
        collisionData.push(0);
      }
    }
  }

  const objects: AssemblageObject[] = [];

  if (opts.signpost) {
    const sx = isVertical ? mainCenterCross + halfRoad + 1 : opts.signpost.offset;
    const sy = isVertical ? opts.signpost.offset : mainCenterCross + halfRoad + 1;
    objects.push({
      name: opts.signpost.id,
      type: 'trigger',
      x: Math.min(sx, totalWidth - 1),
      y: Math.min(sy, totalHeight - 1),
      properties: {
        eventType: 'action',
        description: opts.signpost.description,
      },
    });
  }

  if (opts.transitions?.start) {
    const t = opts.transitions.start;
    objects.push({
      name: t.id,
      type: 'transition',
      x: isVertical ? mainCenterCross : 0,
      y: isVertical ? 0 : mainCenterCross,
      width: isVertical ? roadW : 1,
      height: isVertical ? 1 : roadW,
      properties: {
        targetMap: t.targetMap,
        description: t.description ?? `Road to ${t.targetMap}`,
      },
    });
  }

  if (opts.transitions?.end) {
    const t = opts.transitions.end;
    objects.push({
      name: t.id,
      type: 'transition',
      x: isVertical ? mainCenterCross : totalWidth - 1,
      y: isVertical ? totalHeight - 1 : mainCenterCross,
      width: isVertical ? roadW : 1,
      height: isVertical ? 1 : roadW,
      properties: {
        targetMap: t.targetMap,
        description: t.description ?? `Road to ${t.targetMap}`,
      },
    });
  }

  const anchors: Anchor[] = isVertical
    ? [
        { name: 'north', x: mainCenterCross, y: 0 },
        { name: 'south', x: mainCenterCross, y: totalHeight - 1 },
      ]
    : [
        { name: 'west', x: 0, y: mainCenterCross },
        { name: 'east', x: totalWidth - 1, y: mainCenterCross },
      ];

  // Add crossroads branch anchors
  if (opts.crossroads) {
    const side = opts.crossroads.side;
    if (isVertical) {
      if (side === 'left' || side === 'both') {
        anchors.push({ name: 'branch-west', x: 0, y: opts.crossroads.offset + Math.floor(roadW / 2) });
      }
      if (side === 'right' || side === 'both') {
        anchors.push({ name: 'branch-east', x: totalWidth - 1, y: opts.crossroads.offset + Math.floor(roadW / 2) });
      }
    } else {
      if (side === 'left' || side === 'both') {
        anchors.push({ name: 'branch-north', x: opts.crossroads.offset + Math.floor(roadW / 2), y: 0 });
      }
      if (side === 'right' || side === 'both') {
        anchors.push({ name: 'branch-south', x: opts.crossroads.offset + Math.floor(roadW / 2), y: totalHeight - 1 });
      }
    }
  }

  return {
    id: opts.id,
    description: `${opts.variant} road (${opts.length} tiles, ${direction})`,
    width: totalWidth,
    height: totalHeight,
    layers: {
      ground: { width: totalWidth, height: totalHeight, tiles: groundTiles },
    },
    collision: { width: totalWidth, height: totalHeight, data: collisionData },
    objects: objects.length > 0 ? objects : undefined,
    anchors,
  };
}
