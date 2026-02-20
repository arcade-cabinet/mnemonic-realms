/**
 * World Composer Tests — Region Connectivity + Interior Reachability
 *
 * The outermost layer of the fractal onion:
 * - All regions are connected per regionConnections
 * - Every interior is reachable from world start via region traversal + doors
 * - Dungeon floors are sequential
 * - Start region/anchor exists and is walkable
 *
 * Uses the real DDL files (gen/ddl/) for full integration verification.
 */

import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ArchetypeRegistry } from '../composer/archetypes';
import { composeWorld } from '../composer/world-composer';
import { loadWorldDDL } from '../composer/world-loader';
import { verifyTraversal } from './traversal-verifier';
import { saveSnapshot } from './visual-renderer';

const DDL_ROOT = join(process.cwd(), 'gen', 'ddl');
const PROJECT_ROOT = process.cwd();
const SEED = 99999;

describe('World Composer', { timeout: 30000 }, () => {
  it('loads world DDL without errors', () => {
    const loaded = loadWorldDDL(DDL_ROOT);

    expect(loaded.world.name).toBeDefined();
    expect(loaded.world.regions.length).toBeGreaterThan(0);
    expect(loaded.world.properties.startRegion).toBeDefined();
    expect(loaded.world.properties.startAnchor).toBeDefined();
  });

  it('composes all regions', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const world = await composeWorld(DDL_ROOT, registry, { seed: SEED });

    const loaded = loadWorldDDL(DDL_ROOT);
    expect(world.regionMaps.size).toBe(loaded.world.regions.length);

    // Every region ID is present
    for (const region of loaded.world.regions) {
      expect(
        world.regionMaps.has(region.id),
        `Region ${region.id} should be composed`,
      ).toBe(true);
    }
  });

  it('start region exists and has the start anchor', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const world = await composeWorld(DDL_ROOT, registry, { seed: SEED });

    const startMap = world.regionMaps.get(world.startRegion);
    expect(startMap, `Start region ${world.startRegion} not found`).toBeDefined();

    // Start anchor should be one of the placed anchors
    const startAnchor = startMap!.placedAnchors.find(
      (a) => a.anchor.id === world.startAnchor,
    );
    expect(
      startAnchor,
      `Start anchor ${world.startAnchor} not found in ${world.startRegion}`,
    ).toBeDefined();
  });

  it('all interiors are loaded', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const world = await composeWorld(DDL_ROOT, registry, { seed: SEED });

    const loaded = loadWorldDDL(DDL_ROOT);
    expect(world.interiorMaps.size).toBe(loaded.interiors.size);
  });

  it('region connections are resolved', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const world = await composeWorld(DDL_ROOT, registry, { seed: SEED });

    const loaded = loadWorldDDL(DDL_ROOT);
    expect(world.connections.length).toBe(
      loaded.world.regionConnections.length,
    );

    for (const conn of world.connections) {
      expect(
        world.regionMaps.has(conn.fromRegion),
        `Connection from ${conn.fromRegion} references non-existent region`,
      ).toBe(true);
    }
  });

  it('settled-lands has full traversal within its map', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const world = await composeWorld(DDL_ROOT, registry, {
      seed: SEED,
      regions: ['settled-lands'],
    });

    for (const [regionId, regionMap] of Array.from(
      world.regionMaps.entries(),
    )) {
      // All entry anchors should be reachable from each other
      const allEntries = regionMap.placedAnchors.flatMap(
        (a) => a.entryAnchors,
      );
      const allTargets = regionMap.placedAnchors.flatMap((a) =>
        a.entryAnchors.map((e, i) => ({
          id: `${a.anchor.id}-entry-${i}`,
          position: e,
        })),
      );

      const report = verifyTraversal(
        regionMap.collisionGrid,
        allEntries,
        allTargets,
        { level: 'region', subject: regionId },
      );

      // Save snapshot
      saveSnapshot(regionMap.collisionGrid, 'region', regionId, {
        overlays: [
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
        ],
      });

      expect(
        report.passed,
        `Region ${regionId} has unreachable anchors`,
      ).toBe(true);
    }
  });

  it('settled-lands door transitions all reference known interiors', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const world = await composeWorld(DDL_ROOT, registry, {
      seed: SEED,
      regions: ['settled-lands'],
    });

    const regionMap = world.regionMaps.get('settled-lands');
    expect(regionMap).toBeDefined();

    for (const intId of Array.from(regionMap!.doorTransitions.keys())) {
      expect(
        world.interiorMaps.has(intId),
        `settled-lands door → ${intId} not found in interiors`,
      ).toBe(true);
    }
  });

  it('dungeon floor interiors have sequential transitions', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const world = await composeWorld(DDL_ROOT, registry, { seed: SEED });

    // Find all dungeon interiors (they have floor numbers)
    const dungeonInteriors = Array.from(world.interiorMaps.values()).filter(
      (int) => int.floor !== undefined,
    );

    for (const interior of dungeonInteriors) {
      // If it has a "stairs-down" transition, the target should exist
      if (interior.transitions['stairs-down']) {
        const targetId = interior.transitions['stairs-down'].to;
        expect(
          world.interiorMaps.has(targetId),
          `Dungeon ${interior.id} stairs-down → ${targetId} not found`,
        ).toBe(true);
      }

      // If it has a "stairs-up" transition, the target should exist
      if (interior.transitions['stairs-up']) {
        const targetId = interior.transitions['stairs-up'].to;
        // stairs-up might go to an exterior (not interior), so check both
        const existsInInteriors = world.interiorMaps.has(targetId);
        const existsAsAnchor = Array.from(world.regionMaps.values()).some(
          (rm) => rm.placedAnchors.some((a) => a.anchor.id === targetId),
        );

        expect(
          existsInInteriors || existsAsAnchor,
          `Dungeon ${interior.id} stairs-up → ${targetId} not found anywhere`,
        ).toBe(true);
      }
    }
  });

  it('world graph is connected (all regions reachable from start)', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const world = await composeWorld(DDL_ROOT, registry, { seed: SEED });

    // BFS through region graph
    const visited = new Set<string>();
    const queue = [world.startRegion];
    visited.add(world.startRegion);

    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const conn of world.connections) {
        if (conn.fromRegion === current && !visited.has(conn.toRegion)) {
          visited.add(conn.toRegion);
          queue.push(conn.toRegion);
        }
        // Bidirectional — connections go both ways
        if (conn.toRegion === current && !visited.has(conn.fromRegion)) {
          visited.add(conn.fromRegion);
          queue.push(conn.fromRegion);
        }
      }
    }

    // All regions should be reachable
    for (const regionId of Array.from(world.regionMaps.keys())) {
      expect(
        visited.has(regionId),
        `Region ${regionId} is not reachable from start region ${world.startRegion}`,
      ).toBe(true);
    }
  });
});
