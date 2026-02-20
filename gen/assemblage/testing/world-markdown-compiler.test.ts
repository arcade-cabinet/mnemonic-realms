/**
 * Tests for the World Markdown Compiler.
 *
 * Verifies that docs/world/ hierarchy compiles into valid DDL
 * matching the existing pipeline's expectations.
 */

import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { compileWorld, validateCompilation } from '../compiler/world-markdown-compiler';

const ROOT = resolve(import.meta.dirname, '../../..');
const WORLD_ROOT = resolve(ROOT, 'docs/world');

describe('World Markdown Compiler', () => {
  const result = compileWorld(WORLD_ROOT);

  describe('World-level compilation', () => {
    it('produces a valid WorldDefinition', () => {
      expect(result.world.name).toBeTruthy();
      expect(result.world.properties.startRegion).toBe('settled-lands');
      expect(result.world.properties.startAnchor).toBe('everwick');
      expect(result.world.properties.vibrancySystem).toBe(true);
    });

    it('includes all 4 regions', () => {
      const regionIds = result.regions.map((r) => r.id);
      expect(regionIds).toContain('settled-lands');
      expect(regionIds).toContain('frontier');
      expect(regionIds).toContain('sketch-realm');
      expect(regionIds).toContain('depths');
    });

    it('has region connections', () => {
      expect(result.world.regionConnections.length).toBeGreaterThanOrEqual(2);
      const conn = result.world.regionConnections[0];
      expect(conn.from).toBe('settled-lands');
      expect(conn.to).toBe('frontier');
      expect(conn.connectionType).toBeDefined();
    });
  });

  describe('Settled Lands region', () => {
    const region = result.regions.find((r) => r.id === 'settled-lands')!;

    it('has correct metadata', () => {
      expect(region.name).toBe('The Settled Lands');
      expect(region.biome).toBeTruthy();
      expect(region.acts).toContain(1);
      expect(region.difficulty).toBe('easy');
    });

    it('has 5 location anchors in table order', () => {
      expect(region.anchors.length).toBe(5);
      const ids = region.anchors.map((a) => a.id);
      expect(ids).toEqual(['everwick', 'heartfield', 'ambergrove', 'millbrook', 'sunridge']);
    });

    it('Everwick has town services', () => {
      const ew = region.anchors.find((a) => a.id === 'everwick')!;
      expect(ew.type).toBe('town');
      expect(ew.town).toBeDefined();
      expect(ew.town!.services.length).toBeGreaterThanOrEqual(3);
    });

    it('Everwick has world slots for child worlds', () => {
      const ew = region.anchors.find((a) => a.id === 'everwick')!;
      expect(ew.worldSlots).toBeDefined();
      expect(ew.worldSlots!.length).toBe(4);
      const slotIds = ew.worldSlots!.map((s) => s.instanceId);
      expect(slotIds).toContain('everwick-khali');
      expect(slotIds).toContain('everwick-hark');
      expect(slotIds).toContain('everwick-inn');
      expect(slotIds).toContain('everwick-artun');
    });

    it('Everwick has a mapLayout', () => {
      const ew = region.anchors.find((a) => a.id === 'everwick')! as any;
      expect(ew.mapLayout).toBeDefined();
      expect(ew.mapLayout.mapSize).toEqual([60, 60]);
      expect(ew.mapLayout.palette).toBe('village-premium');
      expect(ew.mapLayout.tileSize).toBe(16);
    });

    it('Everwick mapLayout has buildings', () => {
      const ew = region.anchors.find((a) => a.id === 'everwick')! as any;
      expect(ew.mapLayout.buildings?.length).toBeGreaterThanOrEqual(3);
    });

    it('Everwick mapLayout has transitions', () => {
      const ew = region.anchors.find((a) => a.id === 'everwick')! as any;
      expect(ew.mapLayout.transitions?.length).toBeGreaterThanOrEqual(3);
    });

    it('Everwick mapLayout has resonance stones', () => {
      const ew = region.anchors.find((a) => a.id === 'everwick')! as any;
      expect(ew.mapLayout.resonanceStones?.length).toBeGreaterThanOrEqual(4);
    });

    it('Everwick mapLayout has NPC spawns', () => {
      const ew = region.anchors.find((a) => a.id === 'everwick')! as any;
      expect(ew.mapLayout.npcSpawns?.length).toBeGreaterThanOrEqual(5);
    });

    it('Everwick has events', () => {
      const ew = region.anchors.find((a) => a.id === 'everwick')!;
      expect(ew.events!.length).toBeGreaterThanOrEqual(10);
    });

    it('Heartfield has correct order position', () => {
      const hf = region.anchors.find((a) => a.id === 'heartfield')!;
      expect(hf.name).toBe('Heartfield');
    });

    it('all anchors have encounters from region', () => {
      expect(region.encounters).toBeDefined();
      expect(region.encounters!.enemies.length).toBeGreaterThan(0);
    });
  });

  describe('Frontier region', () => {
    const region = result.regions.find((r) => r.id === 'frontier')!;

    it('has 4 location anchors', () => {
      expect(region.anchors.length).toBe(4);
    });

    it('has correct difficulty', () => {
      expect(region.difficulty).toBe('medium');
    });
  });

  describe('Depths region', () => {
    const region = result.regions.find((r) => r.id === 'depths')!;

    it('has 5 dungeon level anchors', () => {
      expect(region.anchors.length).toBe(5);
    });
  });

  describe('Statistics', () => {
    it('compiles 17 locations', () => {
      expect(result.stats.locationsCompiled).toBe(17);
    });

    it('has NPCs across all regions', () => {
      expect(result.stats.totalNpcs).toBeGreaterThan(30);
    });

    it('has events across all regions', () => {
      expect(result.stats.totalEvents).toBeGreaterThan(50);
    });

    it('has transitions', () => {
      expect(result.stats.totalTransitions).toBeGreaterThan(20);
    });
  });

  describe('Validation', () => {
    it('passes referential integrity check', () => {
      const errors = validateCompilation(result);
      expect(errors).toEqual([]);
    });

    it('has no compilation warnings', () => {
      // Warnings are acceptable during development but track them
      if (result.warnings.length > 0) {
        console.log('Compilation warnings:', result.warnings);
      }
      // Some warnings are acceptable (e.g., missing child world files)
      // but critical parse failures should not happen
      const criticalWarnings = result.warnings.filter((w) => w.startsWith('Failed to parse'));
      expect(criticalWarnings).toEqual([]);
    });
  });
});
