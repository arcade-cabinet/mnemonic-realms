/**
 * Stagnation clearing assemblage factory.
 *
 * Creates a patch of crystallized terrain representing Preserver-frozen land.
 * Uses sand terrain (crystallized ground) with shadow overlay to convey the
 * eerie, preserved quality. Contains a frozen resonance stone at the center.
 *
 * The clearing is walkable but visually distinct — the player can enter and
 * observe, but cannot interact with the stone until the stagnation-breaking
 * mechanic is unlocked.
 */
import type {
  AssemblageDefinition,
  AssemblageObject,
  VisualObject,
} from '../../types.ts';

interface StagnationClearingOptions {
  /** Unique assemblage ID */
  id: string;
  /** Width in tiles */
  width: number;
  /** Height in tiles */
  height: number;
  /** Frozen resonance stone at center */
  frozenStone?: {
    id: string;
    fragments: string;
    notes?: string;
  };
  /** Event trigger for stagnation-breaking cutscene */
  cutsceneTrigger?: {
    id: string;
    linkedQuest?: string;
  };
}

export function createStagnationClearing(
  opts: StagnationClearingOptions,
): AssemblageDefinition {
  const w = opts.width;
  const h = opts.height;

  // Ground: sand (crystallized) interior with light-grass transition border
  const groundTiles: (string | 0)[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const distFromEdge = Math.min(x, y, w - 1 - x, h - 1 - y);
      if (distFromEdge === 0) {
        groundTiles.push('terrain:ground.light-grass');
      } else if (distFromEdge === 1) {
        groundTiles.push('terrain:sand');
      } else {
        groundTiles.push('terrain:sand');
      }
    }
  }

  // Shadow overlay on ground2 for the frozen effect
  const ground2Tiles: (string | 0)[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const distFromEdge = Math.min(x, y, w - 1 - x, h - 1 - y);
      ground2Tiles.push(distFromEdge >= 2 ? 'terrain:shadow.light' : 0);
    }
  }

  // Walkable — player can enter to observe
  const collisionData = new Array(w * h).fill(0) as (0 | 1)[];

  // Frozen stone visual at center
  const cx = Math.floor(w / 2);
  const cy = Math.floor(h / 2);
  const visuals: VisualObject[] = [{ objectRef: 'prop.barrel-water', x: cx, y: cy }];

  const objects: AssemblageObject[] = [];

  if (opts.frozenStone) {
    objects.push({
      name: opts.frozenStone.id,
      type: 'trigger',
      x: cx,
      y: cy,
      properties: {
        eventType: 'action',
        fragments: opts.frozenStone.fragments,
        description: `Frozen Resonance Stone: ${opts.frozenStone.fragments}`,
        frozen: true,
        ...(opts.frozenStone.notes ? { notes: opts.frozenStone.notes } : {}),
      },
    });
  }

  if (opts.cutsceneTrigger) {
    objects.push({
      name: opts.cutsceneTrigger.id,
      type: 'trigger',
      x: 0,
      y: 0,
      width: w,
      height: h,
      properties: {
        eventType: 'auto',
        repeat: 'once',
        description: 'Stagnation Clearing discovery cutscene',
        ...(opts.cutsceneTrigger.linkedQuest
          ? { linkedQuest: opts.cutsceneTrigger.linkedQuest }
          : {}),
      },
    });
  }

  return {
    id: opts.id,
    description: `Stagnation clearing (${w}x${h})`,
    width: w,
    height: h,
    layers: {
      ground: { width: w, height: h, tiles: groundTiles },
      ground2: { width: w, height: h, tiles: ground2Tiles },
    },
    collision: { width: w, height: h, data: collisionData },
    visuals,
    objects: objects.length > 0 ? objects : undefined,
  };
}
