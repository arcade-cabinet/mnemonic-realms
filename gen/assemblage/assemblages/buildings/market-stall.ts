/**
 * Market stall assemblage factory.
 *
 * Creates a small open-air market stand -- a canopy, table, and wares.
 * Market stalls are smaller than full shop buildings and don't have
 * child world transitions. The merchant stands behind the stall counter.
 *
 * Used across the world:
 * - Millbrook: Lissa's Fish Market stall at the waterfront
 * - Millbrook: Specialty riverside shop stand
 * - Hollow Ridge: Ridgewalker Camp merchant stall
 * - Flickerveil: Flickering Village market area
 * - Sunridge: Traveling Merchant's rotating stall at the Ridgetop Waystation
 * - Everwick: Quest Board area (market day stalls, vibrancy-gated)
 *
 * Features:
 * - Small footprint (typically 3x2 or 4x3)
 * - Canopy/awning visual object
 * - Counter collision blocking player from walking behind the stall
 * - Merchant NPC behind the counter
 * - Optional wares visual (crates, barrels, displayed items)
 * - No door/child world -- all interaction happens at the counter
 */
import type {
  AssemblageDefinition,
  AssemblageObject,
  EventHook,
  VisualObject,
} from '../../types.ts';

interface MarketStallOptions {
  /** Unique assemblage ID (e.g., 'stall-fish-market') */
  id: string;
  /** Human-readable name (e.g., "Lissa's Fish Market") */
  name: string;
  /** Object ref for the stall canopy/structure (e.g., 'prop.market-stall-1') */
  objectRef: string;
  /** Stall footprint in tiles */
  width: number;
  height: number;
  /** Ground terrain under the stall (default: 'terrain:ground.dirt') */
  groundTerrain?: string;
  /** Which side the merchant stands on: 'north' (behind, player approaches from south) */
  merchantSide?: 'north' | 'south' | 'east' | 'west';
  /** Optional wares/display visual (crates, barrels, fish rack, etc.) */
  waresDisplay?: {
    objectRef: string;
    x: number;
    y: number;
  };
  /** Merchant NPC behind the counter */
  merchant?: {
    name: string;
    sprite?: string;
    dialogue?: string;
    shopType?: string;
    properties?: Record<string, string | number | boolean>;
  };
}

export function createMarketStall(opts: MarketStallOptions): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;
  const side = opts.merchantSide ?? 'north';

  const layers: Record<string, { width: number; height: number; tiles: (string | 0)[] }> = {};

  // Ground layer: dirt or stone patch
  const terrain = opts.groundTerrain ?? 'terrain:ground.dirt';
  const groundTiles = new Array(w * h).fill(terrain);
  layers.ground = { width: w, height: h, tiles: groundTiles };

  // Collision: counter blocks the merchant side, customer side is open
  const collisionData = new Array(w * h).fill(0) as (0 | 1)[];

  if (side === 'north') {
    // Block top row(s) where the merchant stands
    for (let x = 0; x < w; x++) {
      collisionData[0 * w + x] = 1;
    }
  } else if (side === 'south') {
    for (let x = 0; x < w; x++) {
      collisionData[(h - 1) * w + x] = 1;
    }
  } else if (side === 'west') {
    for (let y = 0; y < h; y++) {
      collisionData[y * w + 0] = 1;
    }
  } else {
    for (let y = 0; y < h; y++) {
      collisionData[y * w + (w - 1)] = 1;
    }
  }

  // Visuals: stall canopy + optional wares
  const visuals: VisualObject[] = [{ objectRef: opts.objectRef, x: 0, y: 0 }];

  if (opts.waresDisplay) {
    visuals.push({
      objectRef: opts.waresDisplay.objectRef,
      x: opts.waresDisplay.x,
      y: opts.waresDisplay.y,
    });
  }

  // Objects
  const objects: AssemblageObject[] = [];
  const hooks: EventHook[] = [];

  // Merchant NPC behind the counter
  if (opts.merchant) {
    let mx: number;
    let my: number;

    if (side === 'north') {
      mx = Math.floor(w / 2);
      my = 0;
    } else if (side === 'south') {
      mx = Math.floor(w / 2);
      my = h - 1;
    } else if (side === 'west') {
      mx = 0;
      my = Math.floor(h / 2);
    } else {
      mx = w - 1;
      my = Math.floor(h / 2);
    }

    const npcProps: Record<string, string | number | boolean> = {
      ...(opts.merchant.sprite ? { sprite: opts.merchant.sprite } : {}),
      ...(opts.merchant.dialogue ? { dialogue: opts.merchant.dialogue } : {}),
      ...(opts.merchant.shopType ? { shopType: opts.merchant.shopType } : {}),
      ...opts.merchant.properties,
    };

    objects.push({
      name: opts.merchant.name,
      type: 'npc',
      x: mx,
      y: my,
      properties: npcProps,
    });
  }

  // Anchor: customer approach side (opposite merchant)
  let anchorX: number;
  let anchorY: number;

  if (side === 'north') {
    anchorX = Math.floor(w / 2);
    anchorY = h - 1;
  } else if (side === 'south') {
    anchorX = Math.floor(w / 2);
    anchorY = 0;
  } else if (side === 'west') {
    anchorX = w - 1;
    anchorY = Math.floor(h / 2);
  } else {
    anchorX = 0;
    anchorY = Math.floor(h / 2);
  }

  return {
    id: opts.id,
    description: opts.name,
    width: w,
    height: h,
    layers,
    collision: { width: w, height: h, data: collisionData },
    visuals,
    objects: objects.length > 0 ? objects : undefined,
    hooks: hooks.length > 0 ? hooks : undefined,
    anchors: [{ name: 'customer', x: anchorX, y: anchorY }],
  };
}
