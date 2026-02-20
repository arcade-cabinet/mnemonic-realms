import { describe, expect, it } from 'vitest';
import { MapCanvas } from '../../../gen/assemblage/pipeline/canvas.ts';
import { serializeToRuntime } from '../../../gen/assemblage/pipeline/runtime-serializer.ts';
import type { RuntimeMapData } from '../../../gen/assemblage/pipeline/runtime-types.ts';

// --- Helper: create a small test canvas ---

function makeTestCanvas(opts?: {
  width?: number;
  height?: number;
  layers?: string[];
}): MapCanvas {
  const width = opts?.width ?? 4;
  const height = opts?.height ?? 4;
  const layers = opts?.layers ?? ['ground', 'objects'];
  return new MapCanvas({ width, height, tileWidth: 16, tileHeight: 16, layers });
}

// --- Serializer tests ---

describe('serializeToRuntime', () => {
  it('serializes a minimal empty canvas', () => {
    const canvas = makeTestCanvas({ width: 2, height: 2, layers: ['ground'] });
    const result = serializeToRuntime(canvas);

    expect(result.width).toBe(2);
    expect(result.height).toBe(2);
    expect(result.tileWidth).toBe(16);
    expect(result.tileHeight).toBe(16);
    expect(result.layerOrder).toEqual(['ground']);
    expect(result.layers.ground).toHaveLength(4); // 2x2
    expect(result.collision).toHaveLength(4);
    expect(result.visuals).toEqual([]);
    expect(result.objects).toEqual([]);
    expect(result.hooks).toEqual([]);
    expect(result.spawnPoints).toEqual([]);
    expect(result.transitions).toEqual([]);
    expect(result.vibrancyAreas).toEqual([]);
  });

  it('preserves semantic tile references', () => {
    const canvas = makeTestCanvas({ width: 2, height: 2, layers: ['ground'] });
    canvas.fillLayer('ground', 'grass');
    const result = serializeToRuntime(canvas);

    expect(result.layers.ground).toEqual([
      'terrain:grass',
      'terrain:grass',
      'terrain:grass',
      'terrain:grass',
    ]);
  });

  it('includes map ID when provided', () => {
    const canvas = makeTestCanvas({ width: 2, height: 2, layers: ['ground'] });
    const result = serializeToRuntime(canvas, 'settled-lands');
    expect(result.id).toBe('settled-lands');
  });

  it('omits map ID when not provided', () => {
    const canvas = makeTestCanvas({ width: 2, height: 2, layers: ['ground'] });
    const result = serializeToRuntime(canvas);
    expect(result.id).toBeUndefined();
  });

  it('preserves collision grid', () => {
    const canvas = makeTestCanvas({ width: 3, height: 1, layers: ['ground'] });
    canvas.setCollision(0, 0, true);
    canvas.setCollision(2, 0, true);
    const result = serializeToRuntime(canvas);

    expect(result.collision).toEqual([1, 0, 1]);
  });

  it('serializes visual objects', () => {
    const canvas = makeTestCanvas();
    canvas.addVisual({ objectRef: 'house.red-large-1', x: 5, y: 10 });
    canvas.addVisual({ objectRef: 'tree.emerald-3', x: 2, y: 3 });
    const result = serializeToRuntime(canvas);

    expect(result.visuals).toHaveLength(2);
    expect(result.visuals[0]).toEqual({ objectRef: 'house.red-large-1', x: 5, y: 10 });
    expect(result.visuals[1]).toEqual({ objectRef: 'tree.emerald-3', x: 2, y: 3 });
  });

  it('serializes event objects', () => {
    const canvas = makeTestCanvas();
    canvas.addObject({
      name: 'keeper-npc',
      type: 'npc',
      x: 3,
      y: 4,
      properties: { sprite: 'npc_keeper', dialogue: 'keeper' },
    });
    const result = serializeToRuntime(canvas);

    expect(result.objects).toHaveLength(1);
    expect(result.objects[0].name).toBe('keeper-npc');
    expect(result.objects[0].type).toBe('npc');
    expect(result.objects[0].properties?.sprite).toBe('npc_keeper');
  });

  it('serializes event hooks', () => {
    const canvas = makeTestCanvas();
    canvas.addHook({
      objectName: 'keeper-npc',
      eventClass: 'KeeperEvent',
      importPath: './events/keeper',
    });
    const result = serializeToRuntime(canvas);

    expect(result.hooks).toHaveLength(1);
    expect(result.hooks[0].objectName).toBe('keeper-npc');
    expect(result.hooks[0].eventClass).toBe('KeeperEvent');
  });

  it('extracts spawn points from objects', () => {
    const canvas = makeTestCanvas();
    canvas.addObject({ name: 'player-spawn', type: 'spawn', x: 10, y: 20 });
    canvas.addObject({ name: 'from-tavern', type: 'spawn', x: 5, y: 8 });
    const result = serializeToRuntime(canvas);

    expect(result.spawnPoints).toHaveLength(2);
    expect(result.spawnPoints[0]).toEqual({ id: 'player-spawn', x: 10, y: 20 });
    expect(result.spawnPoints[1]).toEqual({ id: 'from-tavern', x: 5, y: 8 });
  });

  it('extracts transitions from objects', () => {
    const canvas = makeTestCanvas();
    canvas.addObject({
      name: 'door-tavern',
      type: 'transition',
      x: 12,
      y: 15,
      width: 1,
      height: 1,
      properties: { targetWorld: 'tavern-interior', transitionType: 'door' },
    });
    const result = serializeToRuntime(canvas);

    expect(result.transitions).toHaveLength(1);
    expect(result.transitions[0].id).toBe('door-tavern');
    expect(result.transitions[0].target).toBe('tavern-interior');
    expect(result.transitions[0].type).toBe('door');
  });

  it('extracts region transitions with targetRegion', () => {
    const canvas = makeTestCanvas();
    canvas.addObject({
      name: 'exit-frontier',
      type: 'transition',
      x: 0,
      y: 30,
      width: 3,
      height: 3,
      properties: { targetRegion: 'frontier', direction: 'north', transitionType: 'region' },
    });
    const result = serializeToRuntime(canvas);

    expect(result.transitions).toHaveLength(1);
    expect(result.transitions[0].target).toBe('frontier');
    expect(result.transitions[0].type).toBe('region');
  });

  it('preserves multiple layers in order', () => {
    const canvas = makeTestCanvas({ layers: ['ground', 'road', 'objects'] });
    canvas.fillLayer('ground', 'grass');
    canvas.setTile('road', 1, 1, 'terrain:road.brick');
    const result = serializeToRuntime(canvas);

    expect(result.layerOrder).toEqual(['ground', 'road', 'objects']);
    expect(Object.keys(result.layers)).toHaveLength(3);
    expect(result.layers.road[1 * 4 + 1]).toBe('terrain:road.brick');
  });
});

// --- JSON round-trip tests ---

describe('RuntimeMapData JSON round-trip', () => {
  it('survives JSON.stringify → JSON.parse', () => {
    const canvas = makeTestCanvas({ width: 3, height: 3, layers: ['ground'] });
    canvas.fillLayer('ground', 'grass');
    canvas.setCollision(1, 1, true);
    canvas.addVisual({ objectRef: 'tree.emerald-1', x: 0, y: 0 });
    canvas.addObject({ name: 'player-spawn', type: 'spawn', x: 2, y: 2 });
    canvas.addObject({
      name: 'door-shop',
      type: 'transition',
      x: 1,
      y: 0,
      width: 1,
      height: 1,
      properties: { targetWorld: 'shop-interior', transitionType: 'door' },
    });
    canvas.addHook({
      objectName: 'door-shop',
      eventClass: 'DoorEvent',
    });

    const original = serializeToRuntime(canvas, 'test-map');
    const json = JSON.stringify(original);
    const parsed = JSON.parse(json) as RuntimeMapData;

    expect(parsed.id).toBe('test-map');
    expect(parsed.width).toBe(3);
    expect(parsed.height).toBe(3);
    expect(parsed.tileWidth).toBe(16);
    expect(parsed.tileHeight).toBe(16);
    expect(parsed.layerOrder).toEqual(['ground']);
    expect(parsed.layers.ground).toHaveLength(9);
    expect(parsed.layers.ground[0]).toBe('terrain:grass');
    expect(parsed.collision[4]).toBe(1); // center tile
    expect(parsed.visuals).toHaveLength(1);
    expect(parsed.objects).toHaveLength(2);
    expect(parsed.hooks).toHaveLength(1);
    expect(parsed.spawnPoints).toHaveLength(1);
    expect(parsed.transitions).toHaveLength(1);
  });

  it('produces valid JSON with no circular references', () => {
    const canvas = makeTestCanvas();
    canvas.fillLayer('ground', 'grass');
    const result = serializeToRuntime(canvas);

    // Should not throw
    const json = JSON.stringify(result);
    expect(typeof json).toBe('string');
    expect(json.length).toBeGreaterThan(0);

    // Should parse back cleanly
    const parsed = JSON.parse(json);
    expect(parsed.width).toBe(canvas.width);
    expect(parsed.height).toBe(canvas.height);
  });

  it('does not share references with the original canvas', () => {
    const canvas = makeTestCanvas();
    canvas.addObject({ name: 'test-npc', type: 'npc', x: 1, y: 1 });
    const result = serializeToRuntime(canvas);

    // Mutating the result should not affect the canvas
    result.objects[0].name = 'mutated';
    expect(canvas.objects[0].name).toBe('test-npc');

    // Mutating the canvas should not affect the result
    canvas.objects[0].x = 99;
    expect(result.objects[0].x).toBe(1);
  });
});

