/**
 * Organism-Level Tests — Town & Hamlet Traversal + Layout Verification
 *
 * Every organism is verified from both directions:
 *   Outside-in: Can I reach every building from every entry anchor?
 *   Inside-out: Does every door position sit on a walkable tile?
 *
 * All tests are deterministic (seeded RNG). Same seed = same layout = same result.
 */

import { describe, expect, it } from 'vitest';
import { SeededRNG } from '../composer/fill-engine';
import {
  type CollisionGrid,
  createCollisionGrid,
  markArea,
} from '../composer/path-router';
import type { TownDefinition, TownService } from '../composer/world-ddl';
import { layoutHamlet, type HamletConfig } from '../composer/organisms/hamlet';
import { layoutTown } from '../composer/organisms/town';
import { bfsFloodFill, verifyTraversal } from './traversal-verifier';
import { renderASCII, saveSnapshot } from './visual-renderer';

// --- Test Fixtures ---

const EVERWICK_TOWN: TownDefinition = {
  size: 'village',
  centralFeature: 'well',
  houses: 3,
  services: [
    { type: 'weapon-shop', keeperNpc: 'khali' },
    { type: 'armor-shop', keeperNpc: 'hark' },
    { type: 'inn', keeperNpc: 'innkeeper-bria' },
    { type: 'elder-house', keeperNpc: 'artun' },
  ] as TownService[],
};

const SMALL_HAMLET: HamletConfig = {
  houses: 3,
  well: true,
  houseStyle: 'mixed',
};

const LARGE_HAMLET: HamletConfig = {
  houses: 6,
  well: true,
  houseStyle: 'small',
};

const SEED = 42;

// --- Helpers ---

function stampTownOnGrid(
  town: ReturnType<typeof layoutTown>,
  gridWidth: number,
  gridHeight: number,
): CollisionGrid {
  const grid = createCollisionGrid(gridWidth, gridHeight);

  for (const building of town.buildings) {
    markArea(
      grid,
      building.position.x,
      building.position.y,
      building.footprint.width,
      building.footprint.height,
      1, // blocked
    );
  }

  return grid;
}

function stampHamletOnGrid(
  hamlet: ReturnType<typeof layoutHamlet>,
  gridWidth: number,
  gridHeight: number,
): CollisionGrid {
  const grid = createCollisionGrid(gridWidth, gridHeight);

  for (const house of hamlet.housePlacements) {
    const size = house.archetype === 'house-medium'
      ? { width: 8, height: 7 }
      : { width: 6, height: 6 };
    markArea(grid, house.position.x, house.position.y, size.width, size.height, 1);
  }

  return grid;
}

// --- Town Organism Tests ---

describe('Town Organism', () => {
  const bounds = { x: 10, y: 10, width: 45, height: 45 };
  const worldSlotIds = ['everwick-khali', 'everwick-hark', 'everwick-inn', 'everwick-artun'];

  it('deterministic: same seed produces identical layout', () => {
    const layout1 = layoutTown(bounds, EVERWICK_TOWN, worldSlotIds, SEED);
    const layout2 = layoutTown(bounds, EVERWICK_TOWN, worldSlotIds, SEED);

    expect(layout1.buildings.length).toBe(layout2.buildings.length);
    for (let i = 0; i < layout1.buildings.length; i++) {
      expect(layout1.buildings[i].position).toEqual(layout2.buildings[i].position);
      expect(layout1.buildings[i].doorAnchor).toEqual(layout2.buildings[i].doorAnchor);
    }
    expect(layout1.entryAnchors).toEqual(layout2.entryAnchors);
  });

  it('places all service buildings + residential houses', () => {
    const layout = layoutTown(bounds, EVERWICK_TOWN, worldSlotIds, SEED);

    // 4 services + 3 houses = 7 buildings
    expect(layout.buildings.length).toBe(
      EVERWICK_TOWN.services.length + EVERWICK_TOWN.houses,
    );

    // Service buildings have service info
    const serviceBuildings = layout.buildings.filter((b) => b.service);
    expect(serviceBuildings.length).toBe(EVERWICK_TOWN.services.length);
  });

  it('every door is assigned a world slot ID', () => {
    const layout = layoutTown(bounds, EVERWICK_TOWN, worldSlotIds, SEED);

    // All provided world slot IDs should be mapped to doors
    for (const intId of worldSlotIds) {
      expect(layout.doorPositions.has(intId)).toBe(true);
    }
  });

  it('central feature is placed at town center', () => {
    const layout = layoutTown(bounds, EVERWICK_TOWN, worldSlotIds, SEED);

    expect(layout.centralFeature).toBeDefined();
    expect(layout.centralFeature!.type).toBe('well');

    const cx = bounds.x + Math.floor(bounds.width / 2);
    const cy = bounds.y + Math.floor(bounds.height / 2);
    expect(layout.centralFeature!.position).toEqual({ x: cx, y: cy });
  });

  it('has 4 entry anchors (N, S, E, W)', () => {
    const layout = layoutTown(bounds, EVERWICK_TOWN, worldSlotIds, SEED);
    expect(layout.entryAnchors.length).toBe(4);
  });

  it('every door position is NOT inside a building footprint', () => {
    const layout = layoutTown(bounds, EVERWICK_TOWN, worldSlotIds, SEED);

    for (const building of layout.buildings) {
      // Door should be at bottom-center, outside the footprint
      const doorY = building.doorAnchor.y;
      const footprintBottom = building.position.y + building.footprint.height;

      // Door y should be AT the bottom edge (exactly at footprint bottom)
      expect(doorY).toBe(footprintBottom);
    }
  });

  it('no two buildings overlap', () => {
    const layout = layoutTown(bounds, EVERWICK_TOWN, worldSlotIds, SEED);

    for (let i = 0; i < layout.buildings.length; i++) {
      for (let j = i + 1; j < layout.buildings.length; j++) {
        const a = layout.buildings[i];
        const b = layout.buildings[j];

        const overlapX =
          a.position.x < b.position.x + b.footprint.width &&
          a.position.x + a.footprint.width > b.position.x;
        const overlapY =
          a.position.y < b.position.y + b.footprint.height &&
          a.position.y + a.footprint.height > b.position.y;

        expect(
          overlapX && overlapY,
          `Buildings ${i} and ${j} overlap`,
        ).toBe(false);
      }
    }
  });

  it('every entry anchor can reach at least one door (traversal)', () => {
    const layout = layoutTown(bounds, EVERWICK_TOWN, worldSlotIds, SEED);
    const grid = stampTownOnGrid(layout, 120, 120);

    const doorTargets = Array.from(layout.doorPositions.entries()).map(
      ([id, pos]) => ({ id, position: pos }),
    );

    const report = verifyTraversal(grid, layout.entryAnchors, doorTargets, {
      level: 'organism',
      subject: 'everwick-town',
    });

    // Save visual snapshot for inspection
    saveSnapshot(grid, 'organism', 'everwick-town', {
      overlays: [
        ...layout.entryAnchors.map((p) => ({
          position: p,
          color: 'entry' as const,
          size: 2,
        })),
        ...doorTargets.map((t) => ({
          position: t.position,
          color: 'door' as const,
          size: 2,
        })),
      ],
    });

    expect(report.passed).toBe(true);
    expect(report.disconnectedZones.length).toBe(0);
  });

  it('NPC positions are on walkable tiles', () => {
    const layout = layoutTown(bounds, EVERWICK_TOWN, worldSlotIds, SEED);
    const grid = stampTownOnGrid(layout, 120, 120);

    for (const [npcId, pos] of Array.from(layout.npcPositions.entries())) {
      const idx = pos.y * grid.width + pos.x;
      const val = grid.data[idx];
      expect(val, `NPC ${npcId} at (${pos.x},${pos.y}) on blocked tile`).not.toBe(1);
    }
  });

  it('produces readable ASCII representation', () => {
    const layout = layoutTown(bounds, EVERWICK_TOWN, worldSlotIds, SEED);
    const grid = stampTownOnGrid(layout, 120, 120);

    const ascii = renderASCII(grid, {
      doors: Array.from(layout.doorPositions.values()),
      entries: layout.entryAnchors,
      npcs: Array.from(layout.npcPositions.values()),
    });

    // Should contain the expected characters
    expect(ascii).toContain('#'); // blocked (buildings)
    expect(ascii).toContain('.'); // walkable
    expect(ascii).toContain('D'); // doors
    expect(ascii).toContain('>'); // entries
  });
});

// --- Hamlet Organism Tests ---

describe('Hamlet Organism', () => {
  const bounds = { x: 5, y: 5, width: 30, height: 30 };

  it('deterministic: same seed produces identical layout', () => {
    const layout1 = layoutHamlet(bounds, SMALL_HAMLET, SEED);
    const layout2 = layoutHamlet(bounds, SMALL_HAMLET, SEED);

    expect(layout1.housePlacements.length).toBe(layout2.housePlacements.length);
    for (let i = 0; i < layout1.housePlacements.length; i++) {
      expect(layout1.housePlacements[i].position).toEqual(
        layout2.housePlacements[i].position,
      );
    }
  });

  it('places requested number of houses', () => {
    const layout = layoutHamlet(bounds, SMALL_HAMLET, SEED);
    expect(layout.housePlacements.length).toBe(SMALL_HAMLET.houses);
  });

  it('places well at center when requested', () => {
    const layout = layoutHamlet(bounds, SMALL_HAMLET, SEED);

    expect(layout.wellPosition).toBeDefined();
    const cx = bounds.x + Math.floor(bounds.width / 2);
    const cy = bounds.y + Math.floor(bounds.height / 2);
    expect(layout.wellPosition).toEqual({ x: cx, y: cy });
  });

  it('has at least one external anchor', () => {
    const layout = layoutHamlet(bounds, SMALL_HAMLET, SEED);
    expect(layout.externalAnchors.length).toBeGreaterThan(0);
  });

  it('every door is reachable from external anchor (traversal)', () => {
    const layout = layoutHamlet(bounds, SMALL_HAMLET, SEED);
    const grid = stampHamletOnGrid(layout, 40, 40);

    const doorTargets = layout.housePlacements.map((h, i) => ({
      id: `house-${i}`,
      position: h.doorAnchor,
    }));

    const report = verifyTraversal(grid, layout.externalAnchors, doorTargets, {
      level: 'organism',
      subject: 'small-hamlet',
    });

    saveSnapshot(grid, 'organism', 'small-hamlet', {
      overlays: [
        ...layout.externalAnchors.map((p) => ({
          position: p,
          color: 'entry' as const,
          size: 2,
        })),
        ...doorTargets.map((t) => ({
          position: t.position,
          color: 'door' as const,
        })),
      ],
    });

    expect(report.passed).toBe(true);
  });

  it('scales up to 6 houses without overlap', () => {
    const largeBounds = { x: 5, y: 5, width: 40, height: 40 };
    const layout = layoutHamlet(largeBounds, LARGE_HAMLET, SEED);

    expect(layout.housePlacements.length).toBe(6);

    // No house overlaps
    for (let i = 0; i < layout.housePlacements.length; i++) {
      for (let j = i + 1; j < layout.housePlacements.length; j++) {
        const a = layout.housePlacements[i];
        const b = layout.housePlacements[j];
        const sizeA = a.archetype === 'house-medium'
          ? { width: 8, height: 7 }
          : { width: 6, height: 6 };
        const sizeB = b.archetype === 'house-medium'
          ? { width: 8, height: 7 }
          : { width: 6, height: 6 };

        const overlapX =
          a.position.x < b.position.x + sizeB.width &&
          a.position.x + sizeA.width > b.position.x;
        const overlapY =
          a.position.y < b.position.y + sizeB.height &&
          a.position.y + sizeA.height > b.position.y;

        expect(overlapX && overlapY, `Houses ${i} and ${j} overlap`).toBe(false);
      }
    }
  });

  it('has internal paths connecting every house to center', () => {
    const layout = layoutHamlet(bounds, SMALL_HAMLET, SEED);

    // One internal path per house
    expect(layout.internalPaths.length).toBe(SMALL_HAMLET.houses);

    // All paths lead to center
    const cx = bounds.x + Math.floor(bounds.width / 2);
    const cy = bounds.y + Math.floor(bounds.height / 2);
    for (const path of layout.internalPaths) {
      expect(path.to).toEqual({ x: cx, y: cy });
    }
  });
});
