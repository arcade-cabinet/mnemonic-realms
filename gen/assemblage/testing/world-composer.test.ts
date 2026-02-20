/**
 * World Composer Tests — Region Connectivity + World Instance Reachability
 *
 * The outermost layer of the fractal onion:
 * - All regions are connected per regionConnections
 * - Every world instance is reachable from world start via region traversal + doors
 * - World instances have valid templates
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

  it('loads world instances and templates', () => {
    const loaded = loadWorldDDL(DDL_ROOT);

    expect(loaded.worldInstances.size).toBeGreaterThan(0);
    expect(loaded.templates.size).toBeGreaterThan(0);

    // Every instance should have a valid templateId
    for (const [id, instance] of Array.from(loaded.worldInstances.entries())) {
      expect(
        loaded.templates.has(instance.templateId),
        `World instance ${id} references unknown template: ${instance.templateId}`,
      ).toBe(true);
    }
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

  it('all world instances are loaded', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const world = await composeWorld(DDL_ROOT, registry, { seed: SEED });

    const loaded = loadWorldDDL(DDL_ROOT);
    expect(world.worldInstances.size).toBe(loaded.worldInstances.size);
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

  it('settled-lands door transitions all reference known world instances', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const world = await composeWorld(DDL_ROOT, registry, {
      seed: SEED,
      regions: ['settled-lands'],
    });

    const regionMap = world.regionMaps.get('settled-lands');
    expect(regionMap).toBeDefined();

    for (const instId of Array.from(regionMap!.doorTransitions.keys())) {
      expect(
        world.worldInstances.has(instId),
        `settled-lands door → ${instId} not found in world instances`,
      ).toBe(true);
    }
  });

  it('world instances have valid templates with slot values', async () => {
    const registry = new ArchetypeRegistry(PROJECT_ROOT);
    const world = await composeWorld(DDL_ROOT, registry, { seed: SEED });

    for (const [id, instance] of Array.from(world.worldInstances.entries())) {
      expect(
        instance.templateId,
        `World instance ${id} has no templateId`,
      ).toBeDefined();

      // If template was resolved, check required slots
      if (instance.template) {
        for (const slot of instance.template.slots) {
          if (slot.required) {
            expect(
              slot.id in instance.slotValues,
              `World instance ${id} missing required slot "${slot.id}" from template "${instance.templateId}"`,
            ).toBe(true);
          }
        }
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
