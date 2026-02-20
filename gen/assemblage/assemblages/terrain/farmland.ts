/**
 * Farmland assemblage factory.
 *
 * Creates tilled agricultural terrain — plowed furrows, crop rows, irrigation
 * ditches, and fallow fields. Heartfield's rolling farmland is the primary
 * consumer: golden wheat, vegetable patches, and irrigation channels fed by
 * a western stream. The existing wheat-field factory handles pure wheat; this
 * factory covers the broader range of farmland types.
 *
 * Unlike wheat fields, farmland assemblages support mixed crop types, irrigation
 * channels (narrow water features), fallow/resting soil, and scarecrow/prop
 * placement. Enemy encounters (Meadow Sprites, Grass Serpents) spawn in
 * farmland zones.
 *
 * Variants:
 * - 'tilled': bare plowed rows ready for planting — early vibrancy
 * - 'crops': mixed vegetable/crop rows with variety
 * - 'orchard': fruit trees in a grid pattern
 * - 'irrigated': crop rows with irrigation ditches running between them
 */
import type { AssemblageDefinition, Anchor, AssemblageObject, VisualObject } from '../../types.ts';

type FarmVariant = 'tilled' | 'crops' | 'orchard' | 'irrigated';

interface FarmlandOptions {
  /** Unique assemblage ID */
  id: string;
  /** Farm variant */
  variant: FarmVariant;
  /** Width in tiles */
  width: number;
  /** Height in tiles */
  height: number;
  /** Fence border around the field (default: false) */
  fence?: boolean;
  /** Crop types to rotate through rows */
  cropTypes?: string[];
  /** Scarecrow or prop placement */
  scarecrow?: boolean;
  /** Irrigation stream direction — irrigated variant only */
  irrigationDirection?: 'north-south' | 'east-west';
  /** Fallow percentage: 0.0 to 1.0 — how much of the field is bare dirt (default: 0) */
  fallowPercent?: number;
  /** NPC farmers working the field */
  farmers?: Array<{
    id: string;
    sprite: string;
    dialogue: string;
    x: number;
    y: number;
  }>;
  /** Resonance stone hidden in the field */
  resonanceStone?: {
    id: string;
    fragments: string;
    x: number;
    y: number;
    notes?: string;
  };
}

const CROP_TERRAINS = [
  'terrain:crop.wheat',
  'terrain:crop.corn',
  'terrain:crop.vegetables',
  'terrain:crop.pumpkin',
  'terrain:crop.turnip',
];

const FRUIT_TREE_REFS = [
  'tree.fruit-apple',
  'tree.fruit-pear',
  'tree.fruit-cherry',
];

export function createFarmland(opts: FarmlandOptions): AssemblageDefinition {
  switch (opts.variant) {
    case 'tilled':
      return buildTilledField(opts);
    case 'crops':
      return buildCropField(opts);
    case 'orchard':
      return buildOrchard(opts);
    case 'irrigated':
      return buildIrrigatedField(opts);
  }
}

function buildTilledField(opts: FarmlandOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const hasFence = opts.fence ?? false;
  const fallowPct = opts.fallowPercent ?? 0;

  let rng = w * 29 + h * 41;
  const nextFloat = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng / 0x7fffffff;
  };

  const groundTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isFence =
        hasFence && (x === 0 || x === w - 1 || y === 0 || y === h - 1);

      if (isFence) {
        groundTiles.push('terrain:ground.dirt');
        collisionData.push(1);
      } else {
        // Alternating tilled rows
        const isRow = y % 2 === 0;
        if (isRow && nextFloat() >= fallowPct) {
          groundTiles.push('terrain:farm.tilled');
        } else {
          groundTiles.push('terrain:ground.dirt');
        }
        collisionData.push(0);
      }
    }
  }

  const visuals: VisualObject[] = [];
  if (hasFence) {
    // Fence posts at corners and intervals
    visuals.push(
      { objectRef: 'prop.fence-post', x: 0, y: 0 },
      { objectRef: 'prop.fence-post', x: w - 1, y: 0 },
      { objectRef: 'prop.fence-post', x: 0, y: h - 1 },
      { objectRef: 'prop.fence-post', x: w - 1, y: h - 1 },
    );
  }

  const objects = buildFarmObjects(opts, w, h);

  return {
    id: opts.id,
    description: `Tilled field (${w}x${h})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
    },
    collision: { width: w, height: h, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    anchors: buildFarmAnchors(w, h),
  };
}

function buildCropField(opts: FarmlandOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const hasFence = opts.fence ?? false;
  const crops = opts.cropTypes?.map((c) => `terrain:crop.${c}`) ?? CROP_TERRAINS;
  const fallowPct = opts.fallowPercent ?? 0;

  let rng = w * 37 + h * 53;
  const nextRng = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng;
  };
  const nextFloat = () => nextRng() / 0x7fffffff;

  const groundTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];
  const visuals: VisualObject[] = [];

  // Each horizontal strip of 3 rows gets a crop type
  const stripHeight = 3;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isFence =
        hasFence && (x === 0 || x === w - 1 || y === 0 || y === h - 1);
      const stripIdx = Math.floor(y / stripHeight);
      const posInStrip = y % stripHeight;

      if (isFence) {
        groundTiles.push('terrain:ground.dirt');
        detailTiles.push(0);
        collisionData.push(1);
      } else if (posInStrip === stripHeight - 1) {
        // Path between crop strips
        groundTiles.push('terrain:ground.dirt');
        detailTiles.push(0);
        collisionData.push(0);
      } else if (nextFloat() < fallowPct) {
        // Fallow tile
        groundTiles.push('terrain:farm.tilled');
        detailTiles.push(0);
        collisionData.push(0);
      } else {
        // Crop row
        const cropTerrain = crops[stripIdx % crops.length];
        groundTiles.push('terrain:farm.tilled');
        detailTiles.push(cropTerrain);
        collisionData.push(0);
      }
    }
  }

  // Scarecrow
  if (opts.scarecrow) {
    const sx = 2 + (nextRng() % Math.max(1, w - 4));
    const sy = 2 + (nextRng() % Math.max(1, h - 4));
    visuals.push({ objectRef: 'prop.scarecrow', x: sx, y: sy });
  }

  if (hasFence) {
    visuals.push(
      { objectRef: 'prop.fence-post', x: 0, y: 0 },
      { objectRef: 'prop.fence-post', x: w - 1, y: 0 },
      { objectRef: 'prop.fence-post', x: 0, y: h - 1 },
      { objectRef: 'prop.fence-post', x: w - 1, y: h - 1 },
    );
  }

  const objects = buildFarmObjects(opts, w, h);

  return {
    id: opts.id,
    description: `Crop field (${w}x${h})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
      ground2: { width: w, height: h, tiles: detailTiles },
    },
    collision: { width: w, height: h, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    anchors: buildFarmAnchors(w, h),
  };
}

function buildOrchard(opts: FarmlandOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const hasFence = opts.fence ?? false;

  let rng = w * 67 + h * 11;
  const nextRng = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng;
  };

  const groundTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];
  const visuals: VisualObject[] = [];

  // Grid spacing for fruit trees
  const treeSpacing = 4;
  const treePositions = new Set<string>();

  for (let ty = 2; ty < h - 2; ty += treeSpacing) {
    for (let tx = 2; tx < w - 2; tx += treeSpacing) {
      treePositions.add(`${tx},${ty}`);
      const treeRef = FRUIT_TREE_REFS[nextRng() % FRUIT_TREE_REFS.length];
      visuals.push({ objectRef: treeRef, x: tx, y: ty });
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isFence =
        hasFence && (x === 0 || x === w - 1 || y === 0 || y === h - 1);

      if (isFence) {
        groundTiles.push('terrain:ground.dirt');
        collisionData.push(1);
      } else if (treePositions.has(`${x},${y}`)) {
        // Tree trunk
        groundTiles.push('terrain:ground.dark-grass');
        collisionData.push(1);
      } else {
        // Grass between trees
        groundTiles.push('terrain:ground.grass');
        collisionData.push(0);
      }
    }
  }

  const objects = buildFarmObjects(opts, w, h);

  return {
    id: opts.id,
    description: `Orchard (${w}x${h})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
    },
    collision: { width: w, height: h, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    anchors: buildFarmAnchors(w, h),
  };
}

function buildIrrigatedField(opts: FarmlandOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const hasFence = opts.fence ?? false;
  const direction = opts.irrigationDirection ?? 'north-south';
  const crops = opts.cropTypes?.map((c) => `terrain:crop.${c}`) ?? CROP_TERRAINS;
  const fallowPct = opts.fallowPercent ?? 0;

  let rng = w * 43 + h * 29;
  const nextRng = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng;
  };
  const nextFloat = () => nextRng() / 0x7fffffff;

  const isVertical = direction === 'north-south';
  // Irrigation ditches every N tiles
  const ditchInterval = 6;
  const ditchWidth = 1;

  const groundTiles: (string | 0)[] = [];
  const waterTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];
  const visuals: VisualObject[] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isFence =
        hasFence && (x === 0 || x === w - 1 || y === 0 || y === h - 1);
      const ditchAxis = isVertical ? x : y;
      const isDitch = ditchAxis % ditchInterval < ditchWidth && !isFence;

      if (isFence) {
        groundTiles.push('terrain:ground.dirt');
        waterTiles.push(0);
        detailTiles.push(0);
        collisionData.push(1);
      } else if (isDitch) {
        // Irrigation ditch
        groundTiles.push('terrain:ground.mud');
        waterTiles.push('terrain:water.shallow');
        detailTiles.push(0);
        collisionData.push(1);
      } else {
        // Crop area between ditches
        const stripIdx = Math.floor(ditchAxis / ditchInterval);
        if (nextFloat() < fallowPct) {
          groundTiles.push('terrain:farm.tilled');
          waterTiles.push(0);
          detailTiles.push(0);
        } else {
          const cropTerrain = crops[stripIdx % crops.length];
          groundTiles.push('terrain:farm.tilled');
          waterTiles.push(0);
          detailTiles.push(cropTerrain);
        }
        collisionData.push(0);
      }
    }
  }

  // Scarecrow
  if (opts.scarecrow) {
    const sx = 2 + (nextRng() % Math.max(1, w - 4));
    const sy = 2 + (nextRng() % Math.max(1, h - 4));
    visuals.push({ objectRef: 'prop.scarecrow', x: sx, y: sy });
  }

  const objects = buildFarmObjects(opts, w, h);

  return {
    id: opts.id,
    description: `Irrigated field (${w}x${h}, ${direction})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
      water: { width: w, height: h, tiles: waterTiles },
      ground2: { width: w, height: h, tiles: detailTiles },
    },
    collision: { width: w, height: h, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    anchors: buildFarmAnchors(w, h),
  };
}

/** Shared helper: build NPC farmer objects and resonance stones. */
function buildFarmObjects(
  opts: FarmlandOptions,
  w: number,
  h: number,
): AssemblageObject[] {
  const objects: AssemblageObject[] = [];

  if (opts.farmers) {
    for (const farmer of opts.farmers) {
      objects.push({
        name: farmer.id,
        type: 'npc',
        x: farmer.x,
        y: farmer.y,
        properties: {
          sprite: farmer.sprite,
          dialogue: farmer.dialogue,
        },
      });
    }
  }

  if (opts.resonanceStone) {
    objects.push({
      name: opts.resonanceStone.id,
      type: 'trigger',
      x: opts.resonanceStone.x,
      y: opts.resonanceStone.y,
      properties: {
        eventType: 'action',
        fragments: opts.resonanceStone.fragments,
        description:
          opts.resonanceStone.notes ??
          'A Resonance Stone half-buried in the rich soil, warmed by seasons of sun and rain',
      },
    });
  }

  return objects;
}

/** Shared helper: standard farm anchors at cardinal edges. */
function buildFarmAnchors(w: number, h: number): Anchor[] {
  return [
    { name: 'north', x: Math.floor(w / 2), y: 0 },
    { name: 'south', x: Math.floor(w / 2), y: h - 1 },
    { name: 'east', x: w - 1, y: Math.floor(h / 2) },
    { name: 'west', x: 0, y: Math.floor(h / 2) },
  ];
}
