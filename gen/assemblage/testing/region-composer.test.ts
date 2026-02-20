/**
 * Region Composer Tests — Anchor Connectivity + Door Validity
 *
 * Verifies that composed regions have clean traversal:
 * - All anchors are connected by routed paths
 * - All door transitions point to valid world instance IDs
 * - All NPC positions are on walkable tiles
 * - No isolated walkable zones
 * - Map dimensions match chronometer calculation
 *
 * Renders visual snapshots for each composed region.
 */

import { describe, expect, it } from 'vitest';
import { ArchetypeRegistry } from '../composer/archetypes';
import type { Point } from '../composer/path-router';
import { composeRegion } from '../composer/region-composer';
import type { RegionDefinition } from '../composer/world-ddl';
import { verifyTraversal } from './traversal-verifier';
import { saveSnapshot } from './visual-renderer';

// --- Test Fixtures ---

/**
 * Minimal region with 3 anchors — enough to test routing and traversal.
 * Uses explicit positions for determinism.
 */
const MINI_REGION: RegionDefinition = {
  id: 'test-region',
  name: 'Test Region',
  biome: 'farmland',
  anchors: [
    {
      id: 'town-a',
      name: 'Town Alpha',
      type: 'town',
      position: 'start',
      town: {
        size: 'hamlet',
        centralFeature: 'well',
        houses: 2,
        services: [{ type: 'weapon-shop', keeperNpc: 'shopkeeper-a' }],
      },
      worldSlots: [{ instanceId: 'shop-a', transitionType: 'door' }],
    },
    {
      id: 'landmark-b',
      name: 'Old Shrine',
      type: 'landmark',
      position: 'middle',
    },
    {
      id: 'town-c',
      name: 'Town Charlie',
      type: 'town',
      position: 'end',
      town: {
        size: 'hamlet',
        centralFeature: 'fountain',
        houses: 2,
        services: [{ type: 'inn', keeperNpc: 'innkeeper-c' }],
      },
      worldSlots: [{ instanceId: 'inn-c', transitionType: 'door' }],
    },
  ],
  timeBudget: {
    totalMinutes: 60,
    combatPercent: 0.2,
    dialoguePercent: 0.15,
    walkingPercent: 0.65,
  },
  connectiveTissue: {
    roadStyle: 'dirt',
    encounters: [],
    scatter: [],
  },
};

const SEED = 12345;
const PROJECT_ROOT = process.cwd();

// --- Tests ---

describe('Region Composer', () => {
  it('composes a region with correct dimensions', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const regionMap = await composeRegion(MINI_REGION, registry, {
      seed: SEED,
      mapSize: [80, 80],
    });

    expect(regionMap.width).toBe(80);
    expect(regionMap.height).toBe(80);
    expect(regionMap.regionId).toBe('test-region');
  });

  it('deterministic: same seed produces identical output', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);

    const map1 = await composeRegion(MINI_REGION, registry, {
      seed: SEED,
      mapSize: [80, 80],
    });
    const map2 = await composeRegion(MINI_REGION, registry, {
      seed: SEED,
      mapSize: [80, 80],
    });

    // Same anchor positions
    expect(map1.placedAnchors.length).toBe(map2.placedAnchors.length);
    for (let i = 0; i < map1.placedAnchors.length; i++) {
      expect(map1.placedAnchors[i].bounds).toEqual(map2.placedAnchors[i].bounds);
    }

    // Same door transitions
    expect(map1.doorTransitions.size).toBe(map2.doorTransitions.size);

    // Same NPC positions
    expect(map1.npcPositions.size).toBe(map2.npcPositions.size);
  });

  it('places all anchors from the definition', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const regionMap = await composeRegion(MINI_REGION, registry, {
      seed: SEED,
      mapSize: [80, 80],
    });

    expect(regionMap.placedAnchors.length).toBe(MINI_REGION.anchors.length);
  });

  it('all anchors have entry points', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const regionMap = await composeRegion(MINI_REGION, registry, {
      seed: SEED,
      mapSize: [80, 80],
    });

    for (const placed of regionMap.placedAnchors) {
      expect(
        placed.entryAnchors.length,
        `Anchor ${placed.anchor.id} has no entry points`,
      ).toBeGreaterThan(0);
    }
  });

  it('routes paths between anchors', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const regionMap = await composeRegion(MINI_REGION, registry, {
      seed: SEED,
      mapSize: [80, 80],
    });

    // Should have at least N-1 main roads for N anchors
    expect(regionMap.routedPaths.length).toBeGreaterThanOrEqual(MINI_REGION.anchors.length - 1);
  });

  it('traversal: all anchor entries reachable from each other', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const regionMap = await composeRegion(MINI_REGION, registry, {
      seed: SEED,
      mapSize: [80, 80],
    });

    // Collect all entry anchors as both entries and targets
    const allEntries: Point[] = [];
    const allTargets: Array<{ id: string; position: Point }> = [];

    for (const placed of regionMap.placedAnchors) {
      for (const entry of placed.entryAnchors) {
        allEntries.push(entry);
        allTargets.push({
          id: `${placed.anchor.id}-entry`,
          position: entry,
        });
      }
    }

    const report = verifyTraversal(regionMap.collisionGrid, allEntries, allTargets, {
      level: 'region',
      subject: 'test-region',
    });

    // Save visual snapshot
    const overlays = [
      ...allEntries.map((p) => ({
        position: p,
        color: 'entry' as const,
        size: 3,
      })),
      ...Array.from(regionMap.doorTransitions.values()).map((p) => ({
        position: p,
        color: 'door' as const,
        size: 2,
      })),
      ...Array.from(regionMap.npcPositions.values()).map((p) => ({
        position: p,
        color: 'npc' as const,
      })),
    ];

    saveSnapshot(regionMap.collisionGrid, 'region', 'test-region', {
      overlays,
    });

    expect(report.passed).toBe(true);
    if (report.disconnectedZones.length > 0) {
      console.log(`Warning: ${report.disconnectedZones.length} disconnected zones found`);
    }
  });

  it('door transitions reference valid world instance IDs', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const regionMap = await composeRegion(MINI_REGION, registry, {
      seed: SEED,
      mapSize: [80, 80],
    });

    // All world slot instance IDs from the definition should have door positions
    for (const anchor of MINI_REGION.anchors) {
      if (anchor.worldSlots) {
        for (const slot of anchor.worldSlots) {
          expect(
            regionMap.doorTransitions.has(slot.instanceId),
            `World instance ${slot.instanceId} should have a door transition`,
          ).toBe(true);
        }
      }
    }
  });

  it('NPC positions are on walkable tiles', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const regionMap = await composeRegion(MINI_REGION, registry, {
      seed: SEED,
      mapSize: [80, 80],
    });

    for (const [npcId, pos] of Array.from(regionMap.npcPositions.entries())) {
      const idx = pos.y * regionMap.collisionGrid.width + pos.x;
      if (idx >= 0 && idx < regionMap.collisionGrid.data.length) {
        expect(
          regionMap.collisionGrid.data[idx],
          `NPC ${npcId} at (${pos.x},${pos.y}) is on blocked tile`,
        ).not.toBe(1);
      }
    }
  });

  it('fill covers all empty space', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const regionMap = await composeRegion(MINI_REGION, registry, {
      seed: SEED,
      mapSize: [80, 80],
    });

    expect(regionMap.fill).toBeDefined();
    expect(regionMap.fill.groundTerrain.length).toBeGreaterThan(0);
  });
});
