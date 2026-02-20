/**
 * River assemblage factory.
 *
 * Creates river segments for maps with waterways — straight runs, gentle bends,
 * and forks where tributaries split. The Brightwater River cuts through Millbrook
 * as a 3-wide channel with sandy banks and shallow water at the edges. Upstream
 * Falls and smaller streams use narrower variants.
 *
 * Rivers are impassable (collision) except at bridge points, which are defined
 * as gaps in the collision and left open for bridge assemblages to overlay.
 */
import type { Anchor, AssemblageDefinition, AssemblageObject, VisualObject } from '../../types.ts';

type RiverVariant = 'straight' | 'bend' | 'fork' | 'waterfall';
type Orientation = 'north-south' | 'east-west';
type BendDirection = 'ne' | 'nw' | 'se' | 'sw';
type ForkDirection = 'left' | 'right';

interface RiverOptions {
  /** Unique assemblage ID */
  id: string;
  /** River segment type */
  variant: RiverVariant;
  /** Length of the segment in tiles (along primary axis) */
  length: number;
  /** Width of the river channel in tiles (default: 3) */
  channelWidth?: number;
  /** Primary flow direction — straight and fork only (default: 'north-south') */
  orientation?: Orientation;
  /** Which way the river bends — bend variant only */
  bendDirection?: BendDirection;
  /** Which side the tributary splits — fork variant only */
  forkDirection?: ForkDirection;
  /** Width of the shore/bank in tiles on each side (default: 2) */
  bankWidth?: number;
  /** Bridge crossing point — gap in collision at this tile offset from start */
  bridgeGap?: { offset: number; width: number };
  /** Waterfall height in tiles — waterfall variant only (default: 4) */
  waterfallHeight?: number;
  /** Trigger or transition objects along the river */
  events?: Array<{
    id: string;
    type: 'trigger' | 'transition';
    offset: number;
    description?: string;
  }>;
}

export function createRiver(opts: RiverOptions): AssemblageDefinition {
  const cw = opts.channelWidth ?? 3;
  const bw = opts.bankWidth ?? 2;
  const orientation = opts.orientation ?? 'north-south';

  switch (opts.variant) {
    case 'straight':
      return buildStraightRiver(opts, cw, bw, orientation);
    case 'bend':
      return buildBendRiver(opts, cw, bw);
    case 'fork':
      return buildForkRiver(opts, cw, bw, orientation);
    case 'waterfall':
      return buildWaterfallRiver(opts, cw, bw);
  }
}

function buildStraightRiver(
  opts: RiverOptions,
  cw: number,
  bw: number,
  orientation: Orientation,
): AssemblageDefinition {
  const isVertical = orientation === 'north-south';
  const totalWidth = isVertical ? cw + bw * 2 : opts.length;
  const totalHeight = isVertical ? opts.length : cw + bw * 2;

  const groundTiles: (string | 0)[] = [];
  const waterTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  for (let y = 0; y < totalHeight; y++) {
    for (let x = 0; x < totalWidth; x++) {
      const crossAxis = isVertical ? x : y;
      const alongAxis = isVertical ? y : x;
      const channelStart = bw;
      const channelEnd = bw + cw;

      if (crossAxis >= channelStart && crossAxis < channelEnd) {
        // River channel
        const edgeDist = Math.min(crossAxis - channelStart, channelEnd - 1 - crossAxis);
        if (edgeDist === 0) {
          // Shallow water at edges
          groundTiles.push('terrain:ground.sand');
          waterTiles.push('terrain:water.shallow');
        } else {
          // Deep water in center
          groundTiles.push(0);
          waterTiles.push('terrain:water.deep');
        }

        // Check for bridge gap
        let blocked = true;
        if (opts.bridgeGap) {
          const gapStart = opts.bridgeGap.offset;
          const gapEnd = gapStart + opts.bridgeGap.width;
          if (alongAxis >= gapStart && alongAxis < gapEnd) {
            blocked = false;
          }
        }
        collisionData.push(blocked ? 1 : 0);
      } else if (crossAxis >= channelStart - 1 && crossAxis < channelEnd + 1) {
        // Sandy bank immediately adjacent
        groundTiles.push('terrain:ground.sand');
        waterTiles.push(0);
        collisionData.push(0);
      } else {
        // Grassy bank further out
        groundTiles.push('terrain:ground.grass');
        waterTiles.push(0);
        collisionData.push(0);
      }
    }
  }

  const objects: AssemblageObject[] = [];
  if (opts.events) {
    for (const evt of opts.events) {
      objects.push({
        name: evt.id,
        type: evt.type,
        x: isVertical ? Math.floor(totalWidth / 2) : evt.offset,
        y: isVertical ? evt.offset : Math.floor(totalHeight / 2),
        properties: {
          ...(evt.description ? { description: evt.description } : {}),
        },
      });
    }
  }

  const anchors: Anchor[] = isVertical
    ? [
        { name: 'upstream', x: Math.floor(totalWidth / 2), y: 0 },
        { name: 'downstream', x: Math.floor(totalWidth / 2), y: totalHeight - 1 },
        { name: 'west-bank', x: 0, y: Math.floor(totalHeight / 2) },
        { name: 'east-bank', x: totalWidth - 1, y: Math.floor(totalHeight / 2) },
      ]
    : [
        { name: 'upstream', x: 0, y: Math.floor(totalHeight / 2) },
        { name: 'downstream', x: totalWidth - 1, y: Math.floor(totalHeight / 2) },
        { name: 'north-bank', x: Math.floor(totalWidth / 2), y: 0 },
        { name: 'south-bank', x: Math.floor(totalWidth / 2), y: totalHeight - 1 },
      ];

  return {
    id: opts.id,
    description: `River straight segment (${opts.length} tiles, ${orientation})`,
    width: totalWidth,
    height: totalHeight,
    layers: {
      ground: { width: totalWidth, height: totalHeight, tiles: groundTiles },
      water: { width: totalWidth, height: totalHeight, tiles: waterTiles },
    },
    collision: { width: totalWidth, height: totalHeight, data: collisionData },
    objects: objects.length > 0 ? objects : undefined,
    anchors,
  };
}

function buildBendRiver(opts: RiverOptions, cw: number, bw: number): AssemblageDefinition {
  const bendDir = opts.bendDirection ?? 'se';
  const size = opts.length + bw * 2;

  const groundTiles: (string | 0)[] = [];
  const waterTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  // The bend center determines where the 90-degree turn happens
  const bendCx = bendDir.includes('e')
    ? size - bw - Math.floor(cw / 2) - 1
    : bw + Math.floor(cw / 2);
  const bendCy = bendDir.includes('s')
    ? size - bw - Math.floor(cw / 2) - 1
    : bw + Math.floor(cw / 2);
  const halfCw = Math.floor(cw / 2);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Distance from the bend corner — river follows an L-shape
      let inChannel = false;
      let isEdge = false;
      let isBank = false;

      // Vertical arm
      const verticalX = bendCx;
      const verticalTop = bendDir.includes('n') ? 0 : bendCy;
      const verticalBottom = bendDir.includes('n') ? bendCy : size;
      if (
        x >= verticalX - halfCw &&
        x <= verticalX + halfCw &&
        y >= verticalTop &&
        y <= verticalBottom
      ) {
        const edgeDist = Math.min(x - (verticalX - halfCw), verticalX + halfCw - x);
        inChannel = true;
        isEdge = edgeDist === 0;
      }

      // Horizontal arm
      const horizontalY = bendCy;
      const horizontalLeft = bendDir.includes('w') ? 0 : bendCx;
      const horizontalRight = bendDir.includes('w') ? bendCx : size;
      if (
        y >= horizontalY - halfCw &&
        y <= horizontalY + halfCw &&
        x >= horizontalLeft &&
        x <= horizontalRight
      ) {
        const edgeDist = Math.min(y - (horizontalY - halfCw), horizontalY + halfCw - y);
        inChannel = true;
        if (edgeDist === 0) isEdge = true;
      }

      // Bank detection — within 1 tile of channel
      if (!inChannel) {
        const dx = Math.min(Math.abs(x - (verticalX - halfCw)), Math.abs(x - (verticalX + halfCw)));
        const dy = Math.min(
          Math.abs(y - (horizontalY - halfCw)),
          Math.abs(y - (horizontalY + halfCw)),
        );
        if (
          (dx <= 1 && y >= verticalTop && y <= verticalBottom) ||
          (dy <= 1 && x >= horizontalLeft && x <= horizontalRight)
        ) {
          isBank = true;
        }
      }

      if (inChannel) {
        if (isEdge) {
          groundTiles.push('terrain:ground.sand');
          waterTiles.push('terrain:water.shallow');
        } else {
          groundTiles.push(0);
          waterTiles.push('terrain:water.deep');
        }
        collisionData.push(1);
      } else if (isBank) {
        groundTiles.push('terrain:ground.sand');
        waterTiles.push(0);
        collisionData.push(0);
      } else {
        groundTiles.push('terrain:ground.grass');
        waterTiles.push(0);
        collisionData.push(0);
      }
    }
  }

  // Anchors at the open ends of the L-shape
  const anchors: Anchor[] = [];
  if (bendDir.includes('n')) {
    anchors.push({ name: 'north', x: bendCx, y: 0 });
  } else {
    anchors.push({ name: 'south', x: bendCx, y: size - 1 });
  }
  if (bendDir.includes('e')) {
    anchors.push({ name: 'east', x: size - 1, y: bendCy });
  } else {
    anchors.push({ name: 'west', x: 0, y: bendCy });
  }

  return {
    id: opts.id,
    description: `River bend (${bendDir}, ${opts.length} tiles)`,
    width: size,
    height: size,
    layers: {
      ground: { width: size, height: size, tiles: groundTiles },
      water: { width: size, height: size, tiles: waterTiles },
    },
    collision: { width: size, height: size, data: collisionData },
    anchors,
  };
}

function buildForkRiver(
  opts: RiverOptions,
  cw: number,
  bw: number,
  orientation: Orientation,
): AssemblageDefinition {
  const forkDir = opts.forkDirection ?? 'right';
  const isVertical = orientation === 'north-south';
  const mainWidth = isVertical ? cw + bw * 2 + cw + bw : opts.length;
  const mainHeight = isVertical ? opts.length : cw + bw * 2 + cw + bw;
  const width = mainWidth;
  const height = mainHeight;
  const mainChannelCenter = bw + Math.floor(cw / 2);
  const halfCw = Math.floor(cw / 2);
  const forkY = Math.floor(opts.length / 2);

  const groundTiles: (string | 0)[] = [];
  const waterTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let inChannel = false;
      let isEdge = false;

      if (isVertical) {
        // Main channel
        if (x >= mainChannelCenter - halfCw && x <= mainChannelCenter + halfCw) {
          inChannel = true;
          const edgeDist = Math.min(
            x - (mainChannelCenter - halfCw),
            mainChannelCenter + halfCw - x,
          );
          isEdge = edgeDist === 0;
        }

        // Fork tributary branches off after the fork point
        if (y >= forkY) {
          const tributaryCenter =
            forkDir === 'right' ? mainChannelCenter + cw + bw : mainChannelCenter - cw - bw;
          const tributaryHalf = Math.floor((cw - 1) / 2);

          // Diagonal transition from main to tributary
          const progress = Math.min(1, (y - forkY) / (cw + bw));
          const currentCenter = Math.round(
            mainChannelCenter + (tributaryCenter - mainChannelCenter) * progress,
          );

          if (
            y >= forkY &&
            y < forkY + cw + bw &&
            x >= currentCenter - tributaryHalf &&
            x <= currentCenter + tributaryHalf
          ) {
            inChannel = true;
            const edgeDist = Math.min(
              x - (currentCenter - tributaryHalf),
              currentCenter + tributaryHalf - x,
            );
            isEdge = edgeDist === 0;
          }

          // Straight tributary after transition
          if (
            y >= forkY + cw + bw &&
            x >= tributaryCenter - tributaryHalf &&
            x <= tributaryCenter + tributaryHalf
          ) {
            inChannel = true;
            const edgeDist = Math.min(
              x - (tributaryCenter - tributaryHalf),
              tributaryCenter + tributaryHalf - x,
            );
            isEdge = edgeDist === 0;
          }
        }
      }

      if (inChannel) {
        if (isEdge) {
          groundTiles.push('terrain:ground.sand');
          waterTiles.push('terrain:water.shallow');
        } else {
          groundTiles.push(0);
          waterTiles.push('terrain:water.deep');
        }
        collisionData.push(1);
      } else {
        // Check proximity for sandy bank
        const nearChannel = checkNearChannel(x, y, mainChannelCenter, halfCw, width, height);
        if (nearChannel) {
          groundTiles.push('terrain:ground.sand');
        } else {
          groundTiles.push('terrain:ground.grass');
        }
        waterTiles.push(0);
        collisionData.push(0);
      }
    }
  }

  const anchors: Anchor[] = [
    { name: 'upstream', x: mainChannelCenter, y: 0 },
    { name: 'downstream-main', x: mainChannelCenter, y: height - 1 },
  ];

  if (isVertical) {
    const tributaryCenter =
      forkDir === 'right' ? mainChannelCenter + cw + bw : mainChannelCenter - cw - bw;
    anchors.push({
      name: 'downstream-tributary',
      x: tributaryCenter,
      y: height - 1,
    });
  }

  return {
    id: opts.id,
    description: `River fork (${forkDir}, ${opts.length} tiles)`,
    width,
    height,
    layers: {
      ground: { width, height, tiles: groundTiles },
      water: { width, height, tiles: waterTiles },
    },
    collision: { width, height, data: collisionData },
    anchors,
  };
}

function buildWaterfallRiver(opts: RiverOptions, cw: number, bw: number): AssemblageDefinition {
  const fallHeight = opts.waterfallHeight ?? 4;
  const width = cw + bw * 2 + 4; // Extra space for pool
  const height = opts.length + fallHeight + 4; // Extra for plunge pool

  const groundTiles: (string | 0)[] = [];
  const waterTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  const channelCenter = Math.floor(width / 2);
  const halfCw = Math.floor(cw / 2);
  const fallStart = Math.floor(opts.length * 0.4);
  const fallEnd = fallStart + fallHeight;
  const poolCy = fallEnd + 2;
  const poolR = Math.floor(cw / 2) + 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const inMainChannel =
        x >= channelCenter - halfCw && x <= channelCenter + halfCw && y < fallStart;

      const inFallzone =
        x >= channelCenter - halfCw && x <= channelCenter + halfCw && y >= fallStart && y < fallEnd;

      // Plunge pool — circular
      const poolDist = Math.sqrt((x - channelCenter) ** 2 + (y - poolCy) ** 2);
      const inPool = poolDist <= poolR && y >= fallEnd;

      // Outflow below pool
      const inOutflow =
        x >= channelCenter - halfCw &&
        x <= channelCenter + halfCw &&
        y > poolCy + poolR &&
        y < height;

      if (inMainChannel || inOutflow) {
        const edgeDist = Math.min(x - (channelCenter - halfCw), channelCenter + halfCw - x);
        if (edgeDist === 0) {
          groundTiles.push('terrain:ground.sand');
          waterTiles.push('terrain:water.shallow');
        } else {
          groundTiles.push(0);
          waterTiles.push('terrain:water.deep');
        }
        collisionData.push(1);
      } else if (inFallzone) {
        // Cliff face — rocky terrain with cascading water
        groundTiles.push('terrain:cliff.rock');
        waterTiles.push('terrain:water.shallow');
        collisionData.push(1);
      } else if (inPool) {
        if (poolDist <= poolR - 1) {
          groundTiles.push(0);
          waterTiles.push('terrain:water.deep');
        } else {
          groundTiles.push('terrain:ground.sand');
          waterTiles.push('terrain:water.shallow');
        }
        collisionData.push(1);
      } else {
        // Check for rocky bank near waterfall
        const nearFall = y >= fallStart - 1 && y <= fallEnd + 1;
        const nearChannel = Math.abs(x - channelCenter) <= halfCw + 1 && y < fallStart;
        if (nearFall && Math.abs(x - channelCenter) <= halfCw + 2) {
          groundTiles.push('terrain:cliff.rock');
          collisionData.push(1);
        } else if (nearChannel) {
          groundTiles.push('terrain:ground.sand');
          collisionData.push(0);
        } else {
          groundTiles.push('terrain:ground.grass');
          collisionData.push(0);
        }
        waterTiles.push(0);
      }
    }
  }

  const objects: AssemblageObject[] = [];
  if (opts.events) {
    for (const evt of opts.events) {
      objects.push({
        name: evt.id,
        type: evt.type,
        x: channelCenter,
        y: fallEnd + 1,
        properties: {
          ...(evt.description ? { description: evt.description } : {}),
        },
      });
    }
  }

  return {
    id: opts.id,
    description: `Waterfall (${fallHeight} tile drop, ${opts.length} tiles)`,
    width,
    height,
    layers: {
      ground: { width, height, tiles: groundTiles },
      water: { width, height, tiles: waterTiles },
    },
    collision: { width, height, data: collisionData },
    objects: objects.length > 0 ? objects : undefined,
    anchors: [
      { name: 'upstream', x: channelCenter, y: 0 },
      { name: 'downstream', x: channelCenter, y: height - 1 },
      { name: 'pool-east', x: channelCenter + poolR, y: poolCy },
      { name: 'pool-west', x: channelCenter - poolR, y: poolCy },
    ],
  };
}

/** Check if a tile is within 1 tile of the main channel for sandy bank rendering. */
function checkNearChannel(
  x: number,
  _y: number,
  channelCenter: number,
  halfCw: number,
  _width: number,
  _height: number,
): boolean {
  return Math.abs(x - (channelCenter - halfCw)) <= 1 || Math.abs(x - (channelCenter + halfCw)) <= 1;
}
