import { describe, expect, it } from 'vitest';
import { loadMapData } from '../../../../engine/world/loader.js';
import { FIXTURE_MAP } from './fixture.js';

describe('Map Loader — loadMapData', () => {
  it('returns correct map dimensions and metadata', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    expect(loaded.id).toBe('test-map');
    expect(loaded.width).toBe(4);
    expect(loaded.height).toBe(4);
    expect(loaded.tileWidth).toBe(16);
    expect(loaded.tileHeight).toBe(16);
  });

  it('preserves layer order', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    expect(loaded.layerOrder).toEqual(['ground', 'objects']);
  });

  it('converts tile layers to Uint16Array', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    expect(loaded.layers.size).toBe(2);

    const ground = loaded.layers.get('ground')!;
    expect(ground).toBeInstanceOf(Uint16Array);
    expect(ground.length).toBe(16); // 4×4

    const objects = loaded.layers.get('objects')!;
    expect(objects).toBeInstanceOf(Uint16Array);
    expect(objects.length).toBe(16);
  });

  it('builds a string table mapping indices to semantic tiles', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    // Index 0 is always empty
    expect(loaded.tileStringTable[0]).toBe('');
    // Should contain all unique tile strings
    expect(loaded.tileStringTable).toContain('terrain:grass');
    expect(loaded.tileStringTable).toContain('terrain:path');
    expect(loaded.tileStringTable).toContain('object:well');
  });

  it('maps tile indices correctly via string table', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    const ground = loaded.layers.get('ground')!;
    const grassIdx = loaded.tileStringTable.indexOf('terrain:grass');
    const pathIdx = loaded.tileStringTable.indexOf('terrain:path');

    // First tile is grass
    expect(ground[0]).toBe(grassIdx);
    // Tile at (1,1) is path (index = 1*4 + 1 = 5)
    expect(ground[5]).toBe(pathIdx);

    // Objects layer: tile at (2,2) is 'object:well' (index = 2*4 + 2 = 10)
    const objects = loaded.layers.get('objects')!;
    const wellIdx = loaded.tileStringTable.indexOf('object:well');
    expect(objects[10]).toBe(wellIdx);
    // Empty tiles should be 0
    expect(objects[0]).toBe(0);
  });

  it('converts collision to Uint8Array', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    expect(loaded.collision).toBeInstanceOf(Uint8Array);
    expect(loaded.collision.length).toBe(16);
    // Tile at (2,2) is blocked (index 10)
    expect(loaded.collision[10]).toBe(1);
    // Tile at (0,0) is passable
    expect(loaded.collision[0]).toBe(0);
    // Bottom-left tiles are blocked (indices 12, 13)
    expect(loaded.collision[12]).toBe(1);
    expect(loaded.collision[13]).toBe(1);
  });

  it('extracts entity descriptors (excluding spawn points)', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    // 6 objects total, minus 1 spawn = 5 entities
    expect(loaded.entities).toHaveLength(5);
    // No spawn entities
    const types = loaded.entities.map((e) => e.type);
    expect(types).not.toContain('spawn');
  });

  it('creates NPC entity descriptor with correct properties', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    const npc = loaded.entities.find((e) => e.name === 'artun-npc')!;
    expect(npc).toBeDefined();
    expect(npc.type).toBe('npc');
    expect(npc.x).toBe(1);
    expect(npc.y).toBe(1);
    expect(npc.properties.sprite).toBe('artun');
    expect(npc.properties.dialogueId).toBe('artun-greeting');
  });

  it('attaches event hooks to entity descriptors', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    const npc = loaded.entities.find((e) => e.name === 'artun-npc')!;
    expect(npc.hook).toBeDefined();
    expect(npc.hook!.eventClass).toBe('ArtunEvent');
    expect(npc.hook!.importPath).toBe('./events/artun.ts');
  });

  it('creates resonance stone descriptor from npc with subtype', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    const stone = loaded.entities.find((e) => e.name === 'stone-memory-1')!;
    expect(stone).toBeDefined();
    expect(stone.type).toBe('resonance-stone');
  });

  it('creates chest entity descriptor', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    const chest = loaded.entities.find((e) => e.name === 'treasure-1')!;
    expect(chest.type).toBe('chest');
    expect(chest.x).toBe(3);
    expect(chest.y).toBe(2);
  });

  it('creates transition entity descriptor', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    const trans = loaded.entities.find((e) => e.name === 'door-tavern')!;
    expect(trans.type).toBe('transition');
    expect(trans.properties.target).toBe('tavern-interior');
  });

  it('creates trigger entity descriptor', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    const trigger = loaded.entities.find((e) => e.name === 'quest-trigger-1')!;
    expect(trigger.type).toBe('trigger');
    expect(trigger.properties.eventId).toBe('mq01-start');
  });

  it('preserves spawn points as data', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    expect(loaded.spawnPoints).toHaveLength(1);
    expect(loaded.spawnPoints[0].id).toBe('player-spawn');
    expect(loaded.spawnPoints[0].x).toBe(2);
    expect(loaded.spawnPoints[0].y).toBe(2);
  });

  it('preserves vibrancy areas', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    expect(loaded.vibrancyAreas).toHaveLength(1);
    expect(loaded.vibrancyAreas[0].id).toBe('town-center');
    expect(loaded.vibrancyAreas[0].initialState).toBe('remembered');
  });

  it('preserves transitions for quick lookup', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    expect(loaded.transitions).toHaveLength(1);
    expect(loaded.transitions[0].target).toBe('tavern-interior');
  });

  it('handles map with no id gracefully', () => {
    const noIdMap = { ...FIXTURE_MAP, id: undefined };
    const loaded = loadMapData(noIdMap);
    expect(loaded.id).toBe('');
  });
});

