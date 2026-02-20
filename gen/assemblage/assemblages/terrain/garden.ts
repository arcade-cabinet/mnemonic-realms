/**
 * Garden assemblage factory.
 *
 * Creates cultivated green spaces — memorial gardens with resonance stones,
 * flower patches that bloom with vibrancy, herb plots, and ornamental
 * arrangements. Everwick's Memorial Garden is the first place the player
 * collects memory fragments, and its three resonance stones must feel
 * deliberately placed among lovingly tended flowers.
 *
 * Gardens are walkable spaces (no collision except on stone borders and
 * objects). They use the detail layer extensively for flower and plant
 * overlays that respond to the vibrancy system.
 *
 * Variants:
 * - 'memorial': formal arrangement with resonance stones and paths — Everwick
 * - 'flower-patch': informal wildflower cluster — scattered across settlements
 * - 'herb': utilitarian herb garden with rows — near workshops and shops
 * - 'shrine': sacred garden around a central object — Wind Shrine, clearings
 */
import type { Anchor, AssemblageDefinition, AssemblageObject, VisualObject } from '../../types.ts';

type GardenVariant = 'memorial' | 'flower-patch' | 'herb' | 'shrine';

interface GardenOptions {
  /** Unique assemblage ID */
  id: string;
  /** Garden variant */
  variant: GardenVariant;
  /** Width in tiles */
  width: number;
  /** Height in tiles */
  height: number;
  /** Stone border around the garden (default: true for memorial/shrine, false otherwise) */
  border?: boolean;
  /** Resonance stones placed in the garden */
  resonanceStones?: Array<{
    id: string;
    fragments: string;
    x: number;
    y: number;
    notes?: string;
  }>;
  /** Central feature (fountain, statue, tree, etc.) */
  centerFeature?: {
    objectRef: string;
    description?: string;
  };
  /** Flower density: 0.0 to 1.0 (default: 0.4) */
  flowerDensity?: number;
  /** NPC gardener or caretaker */
  caretaker?: {
    id: string;
    sprite: string;
    dialogue: string;
  };
}

export function createGarden(opts: GardenOptions): AssemblageDefinition {
  switch (opts.variant) {
    case 'memorial':
      return buildMemorialGarden(opts);
    case 'flower-patch':
      return buildFlowerPatch(opts);
    case 'herb':
      return buildHerbGarden(opts);
    case 'shrine':
      return buildShrineGarden(opts);
  }
}

function buildMemorialGarden(opts: GardenOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const hasBorder = opts.border !== false;
  const flowerDensity = opts.flowerDensity ?? 0.5;

  let rng = w * 43 + h * 17;
  const nextRng = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng;
  };
  const nextFloat = () => nextRng() / 0x7fffffff;

  const groundTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];
  const visuals: VisualObject[] = [];

  // Memorial gardens have a central path with flower beds on either side
  const cx = Math.floor(w / 2);
  const pathWidth = 2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isBorder = hasBorder && (x === 0 || x === w - 1 || y === 0 || y === h - 1);
      const isPath = x >= cx - Math.floor(pathWidth / 2) && x < cx + Math.ceil(pathWidth / 2);

      if (isBorder) {
        groundTiles.push('terrain:road.cobblestone');
        detailTiles.push(0);
        collisionData.push(1);
      } else if (isPath) {
        groundTiles.push('terrain:road.cobblestone');
        detailTiles.push(0);
        collisionData.push(0);
      } else {
        // Flower bed
        groundTiles.push('terrain:ground.grass');
        detailTiles.push(
          nextFloat() < flowerDensity ? 'terrain:flowers.mixed' : 'terrain:ground.light-grass',
        );
        collisionData.push(0);
      }
    }
  }

  // Center feature
  if (opts.centerFeature) {
    visuals.push({
      objectRef: opts.centerFeature.objectRef,
      x: cx,
      y: Math.floor(h / 2),
    });
  }

  const objects: AssemblageObject[] = [];

  // Resonance stones
  if (opts.resonanceStones) {
    for (const stone of opts.resonanceStones) {
      objects.push({
        name: stone.id,
        type: 'trigger',
        x: stone.x,
        y: stone.y,
        properties: {
          eventType: 'action',
          fragments: stone.fragments,
          description:
            stone.notes ??
            'A memorial Resonance Stone, worn smooth by generations of hands pressed against its surface',
        },
      });
    }
  }

  if (opts.caretaker) {
    objects.push({
      name: opts.caretaker.id,
      type: 'npc',
      x: cx + 1,
      y: h - 2,
      properties: {
        sprite: opts.caretaker.sprite,
        dialogue: opts.caretaker.dialogue,
      },
    });
  }

  return {
    id: opts.id,
    description: `Memorial garden (${w}x${h})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
      ground2: { width: w, height: h, tiles: detailTiles },
    },
    collision: { width: w, height: h, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    anchors: [
      { name: 'entrance', x: cx, y: h - 1 },
      { name: 'north', x: cx, y: 0 },
    ],
  };
}

function buildFlowerPatch(opts: GardenOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const flowerDensity = opts.flowerDensity ?? 0.6;

  let rng = w * 61 + h * 19;
  const nextFloat = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng / 0x7fffffff;
  };

  const groundTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  const cx = Math.floor(w / 2);
  const cy = Math.floor(h / 2);
  const rx = Math.floor(w / 2);
  const ry = Math.floor(h / 2);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Organic elliptical shape with randomized edges
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const dist = dx * dx + dy * dy;
      const jitter = nextFloat() * 0.3;

      if (dist + jitter <= 1.0) {
        groundTiles.push('terrain:ground.grass');
        detailTiles.push(nextFloat() < flowerDensity ? 'terrain:flowers.wild' : 0);
        collisionData.push(0);
      } else {
        groundTiles.push(0); // Transparent — blends with map ground
        detailTiles.push(0);
        collisionData.push(0);
      }
    }
  }

  const objects: AssemblageObject[] = [];
  if (opts.resonanceStones) {
    for (const stone of opts.resonanceStones) {
      objects.push({
        name: stone.id,
        type: 'trigger',
        x: stone.x,
        y: stone.y,
        properties: {
          eventType: 'action',
          fragments: stone.fragments,
          description: stone.notes ?? 'A Resonance Stone nestled among wildflowers, humming softly',
        },
      });
    }
  }

  return {
    id: opts.id,
    description: `Flower patch (${w}x${h})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
      ground2: { width: w, height: h, tiles: detailTiles },
    },
    collision: { width: w, height: h, data: collisionData },
    objects: objects.length > 0 ? objects : undefined,
    anchors: [{ name: 'center', x: cx, y: cy }],
  };
}

function buildHerbGarden(opts: GardenOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const hasBorder = opts.border ?? false;

  const groundTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];

  // Herb gardens are organized in rows with dirt paths between them
  const rowHeight = 3;
  const pathRow = 1; // 1-tile path between every 2 rows of herbs

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isBorder = hasBorder && (x === 0 || x === w - 1 || y === 0 || y === h - 1);
      const rowPos = y % (rowHeight + pathRow);
      const isPathRow = rowPos >= rowHeight;

      if (isBorder) {
        groundTiles.push('terrain:road.cobblestone');
        detailTiles.push(0);
        collisionData.push(1);
      } else if (isPathRow) {
        groundTiles.push('terrain:ground.dirt');
        detailTiles.push(0);
        collisionData.push(0);
      } else {
        // Herb rows — alternate between different herb types
        const herbType = Math.floor(y / (rowHeight + pathRow)) % 3;
        groundTiles.push('terrain:ground.dark-grass');
        const herbs = ['terrain:herbs.green', 'terrain:herbs.purple', 'terrain:herbs.golden'];
        detailTiles.push(herbs[herbType]);
        collisionData.push(0);
      }
    }
  }

  const objects: AssemblageObject[] = [];
  if (opts.caretaker) {
    objects.push({
      name: opts.caretaker.id,
      type: 'npc',
      x: Math.floor(w / 2),
      y: h - 2,
      properties: {
        sprite: opts.caretaker.sprite,
        dialogue: opts.caretaker.dialogue,
      },
    });
  }

  return {
    id: opts.id,
    description: `Herb garden (${w}x${h})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
      ground2: { width: w, height: h, tiles: detailTiles },
    },
    collision: { width: w, height: h, data: collisionData },
    objects: objects.length > 0 ? objects : undefined,
    anchors: [{ name: 'entrance', x: Math.floor(w / 2), y: h - 1 }],
  };
}

function buildShrineGarden(opts: GardenOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const hasBorder = opts.border !== false;
  const flowerDensity = opts.flowerDensity ?? 0.4;

  let rng = w * 37 + h * 53;
  const nextFloat = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng / 0x7fffffff;
  };

  const cx = Math.floor(w / 2);
  const cy = Math.floor(h / 2);

  const groundTiles: (string | 0)[] = [];
  const detailTiles: (string | 0)[] = [];
  const collisionData: (0 | 1)[] = [];
  const visuals: VisualObject[] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isBorder = hasBorder && (x === 0 || x === w - 1 || y === 0 || y === h - 1);
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const maxR = Math.min(cx, cy);

      // Circular path around the shrine center
      const isCirclePath = Math.abs(dist - maxR * 0.6) < 0.8;
      // Radial paths at cardinal directions
      const isRadialPath = (Math.abs(x - cx) <= 1 || Math.abs(y - cy) <= 1) && dist < maxR * 0.6;

      if (isBorder) {
        groundTiles.push('terrain:road.cobblestone');
        detailTiles.push(0);
        collisionData.push(1);
      } else if (isCirclePath || isRadialPath) {
        groundTiles.push('terrain:road.cobblestone');
        detailTiles.push(0);
        collisionData.push(0);
      } else if (dist <= 1.5) {
        // Central shrine platform
        groundTiles.push('terrain:ground.stone');
        detailTiles.push(0);
        collisionData.push(0);
      } else {
        // Garden bed between paths
        groundTiles.push('terrain:ground.grass');
        detailTiles.push(
          nextFloat() < flowerDensity ? 'terrain:flowers.sacred' : 'terrain:ground.light-grass',
        );
        collisionData.push(0);
      }
    }
  }

  // Central feature
  if (opts.centerFeature) {
    visuals.push({
      objectRef: opts.centerFeature.objectRef,
      x: cx,
      y: cy,
    });
  }

  const objects: AssemblageObject[] = [];

  if (opts.resonanceStones) {
    for (const stone of opts.resonanceStones) {
      objects.push({
        name: stone.id,
        type: 'trigger',
        x: stone.x,
        y: stone.y,
        properties: {
          eventType: 'action',
          fragments: stone.fragments,
          description:
            stone.notes ??
            'A sacred Resonance Stone standing at the heart of the shrine garden, wreathed in light',
        },
      });
    }
  }

  if (opts.caretaker) {
    objects.push({
      name: opts.caretaker.id,
      type: 'npc',
      x: cx + 2,
      y: cy + 2,
      properties: {
        sprite: opts.caretaker.sprite,
        dialogue: opts.caretaker.dialogue,
      },
    });
  }

  return {
    id: opts.id,
    description: `Shrine garden (${w}x${h})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
      ground2: { width: w, height: h, tiles: detailTiles },
    },
    collision: { width: w, height: h, data: collisionData },
    visuals: visuals.length > 0 ? visuals : undefined,
    objects: objects.length > 0 ? objects : undefined,
    anchors: [
      { name: 'south', x: cx, y: h - 1 },
      { name: 'north', x: cx, y: 0 },
      { name: 'east', x: w - 1, y: cy },
      { name: 'west', x: 0, y: cy },
    ],
  };
}
