import { afterEach, describe, expect, it } from 'vitest';
import { universe } from 'koota';
import { createGameWorld } from '../../../../../engine/ecs/world.js';
import {
  Chest,
  Collidable,
  Dialogue,
  Interactable,
  Npc,
  Position,
  ResonanceStone,
  Sprite,
  Transition,
} from '../../../../../engine/ecs/traits.js';
import {
  findInteractable,
  triggerInteraction,
} from '../../../../../engine/ecs/systems/interaction.js';
import { TILE_SIZE } from '../../../../../engine/renderer/types.js';

afterEach(() => {
  universe.reset();
});

describe('findInteractable', () => {
  it('finds entity in facing direction (down)', () => {
    const world = createGameWorld();
    world.spawn(
      Position({ x: 2 * TILE_SIZE, y: 3 * TILE_SIZE }),
      Interactable,
      Npc,
    );

    const result = findInteractable(world, 2 * TILE_SIZE, 2 * TILE_SIZE, 'down');
    expect(result).not.toBeNull();
  });

  it('finds entity in facing direction (up)', () => {
    const world = createGameWorld();
    world.spawn(
      Position({ x: 2 * TILE_SIZE, y: 1 * TILE_SIZE }),
      Interactable,
      Npc,
    );

    const result = findInteractable(world, 2 * TILE_SIZE, 2 * TILE_SIZE, 'up');
    expect(result).not.toBeNull();
  });

  it('finds entity in facing direction (left)', () => {
    const world = createGameWorld();
    world.spawn(
      Position({ x: 1 * TILE_SIZE, y: 2 * TILE_SIZE }),
      Interactable,
      Npc,
    );

    const result = findInteractable(world, 2 * TILE_SIZE, 2 * TILE_SIZE, 'left');
    expect(result).not.toBeNull();
  });

  it('finds entity in facing direction (right)', () => {
    const world = createGameWorld();
    world.spawn(
      Position({ x: 3 * TILE_SIZE, y: 2 * TILE_SIZE }),
      Interactable,
      Npc,
    );

    const result = findInteractable(world, 2 * TILE_SIZE, 2 * TILE_SIZE, 'right');
    expect(result).not.toBeNull();
  });

  it('returns null when no entity in facing direction', () => {
    const world = createGameWorld();
    world.spawn(
      Position({ x: 5 * TILE_SIZE, y: 5 * TILE_SIZE }),
      Interactable,
      Npc,
    );

    const result = findInteractable(world, 2 * TILE_SIZE, 2 * TILE_SIZE, 'down');
    expect(result).toBeNull();
  });

  it('returns null for invalid facing direction', () => {
    const world = createGameWorld();
    const result = findInteractable(world, 0, 0, 'invalid');
    expect(result).toBeNull();
  });

  it('ignores non-interactable entities', () => {
    const world = createGameWorld();
    // Entity at target position but without Interactable trait
    world.spawn(Position({ x: 2 * TILE_SIZE, y: 3 * TILE_SIZE }), Npc);

    const result = findInteractable(world, 2 * TILE_SIZE, 2 * TILE_SIZE, 'down');
    expect(result).toBeNull();
  });
});

describe('triggerInteraction', () => {
  it('returns dialogue interaction for NPC with Dialogue', () => {
    const world = createGameWorld();
    const entity = world.spawn(
      Position({ x: 0, y: 0 }),
      Interactable,
      Npc,
      Dialogue({ id: 'test-dlg', lines: ['Hello!', 'Goodbye!'], portrait: 'npc.png' }),
    );

    const result = triggerInteraction(entity);
    expect(result).toEqual({
      type: 'dialogue',
      data: { id: 'test-dlg', lines: ['Hello!', 'Goodbye!'], portrait: 'npc.png' },
    });
  });

  it('returns chest interaction for Chest entity', () => {
    const world = createGameWorld();
    const entity = world.spawn(
      Position({ x: 0, y: 0 }),
      Interactable,
      Collidable,
      Sprite({ sheet: 'chest', frame: 0, width: 16, height: 16 }),
      Chest({ contents: ['potion'], opened: false }),
    );

    const result = triggerInteraction(entity);
    expect(result).toEqual({
      type: 'chest',
      data: { contents: ['potion'], opened: false },
    });
  });

  it('returns transition interaction for Transition entity', () => {
    const world = createGameWorld();
    const entity = world.spawn(
      Position({ x: 0, y: 0 }),
      Transition({ targetMap: 'tavern', targetX: 5, targetY: 10 }),
    );

    const result = triggerInteraction(entity);
    expect(result).toEqual({
      type: 'transition',
      data: { targetMap: 'tavern', targetX: 5, targetY: 10 },
    });
  });

  it('returns resonance-stone interaction for ResonanceStone entity', () => {
    const world = createGameWorld();
    const entity = world.spawn(
      Position({ x: 0, y: 0 }),
      Interactable,
      Collidable,
      ResonanceStone({ stoneId: 'stone-1', discovered: false, message: 'A memory echoes...' }),
    );

    const result = triggerInteraction(entity);
    expect(result).toEqual({
      type: 'resonance-stone',
      data: { stoneId: 'stone-1', discovered: false, message: 'A memory echoes...' },
    });
  });

  it('returns null for entity with no recognized interaction traits', () => {
    const world = createGameWorld();
    const entity = world.spawn(
      Position({ x: 0, y: 0 }),
      Interactable,
    );

    const result = triggerInteraction(entity);
    expect(result).toBeNull();
  });

  it('prioritizes dialogue over other traits', () => {
    const world = createGameWorld();
    // Entity with both Dialogue and Chest (dialogue should win)
    const entity = world.spawn(
      Position({ x: 0, y: 0 }),
      Interactable,
      Dialogue({ id: 'shopkeeper', lines: ['Welcome!'], portrait: 'shop.png' }),
      Chest({ contents: ['gold'], opened: false }),
    );

    const result = triggerInteraction(entity);
    expect(result?.type).toBe('dialogue');
  });
});

