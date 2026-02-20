import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { World } from 'koota';
import { universe } from 'koota';
import { createGameWorld } from '../../../../engine/ecs/world.js';
import {
  AiState,
  Chest,
  Collidable,
  Dialogue,
  Facing,
  Interactable,
  Npc,
  Position,
  ResonanceStone,
  Sprite,
  Transition,
  Trigger,
} from '../../../../engine/ecs/traits.js';
import {
  chestQuery,
  interactableQuery,
  npcAiQuery,
  resonanceStoneQuery,
  transitionQuery,
  triggerQuery,
} from '../../../../engine/ecs/queries.js';
import { loadMapData } from '../../../../engine/world/loader.js';
import { spawnEntities } from '../../../../engine/world/spawner.js';
import { FIXTURE_MAP } from './fixture.js';

describe('Entity Spawner — spawnEntities', () => {
  let world: World;

  beforeEach(() => {
    universe.reset();
    world = createGameWorld();
  });

  afterEach(() => {
    world.destroy();
    universe.reset();
  });

  it('spawns the correct number of entities', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    const entities = spawnEntities(world, loaded.entities);
    // 5 entity descriptors: npc, chest, transition, trigger, resonance-stone
    expect(entities).toHaveLength(5);
  });

  it('spawns NPC with correct trait composition', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    spawnEntities(world, loaded.entities);

    const npcs = world.query(npcAiQuery);
    expect(npcs.length).toBeGreaterThanOrEqual(1);

    const npc = npcs[0];
    expect(npc.has(Position)).toBe(true);
    expect(npc.has(Sprite)).toBe(true);
    expect(npc.has(Facing)).toBe(true);
    expect(npc.has(Npc)).toBe(true);
    expect(npc.has(Collidable)).toBe(true);
    expect(npc.has(Interactable)).toBe(true);
    expect(npc.has(Dialogue)).toBe(true);
    expect(npc.has(AiState)).toBe(true);
  });

  it('sets NPC position and dialogue correctly', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    spawnEntities(world, loaded.entities);

    const npcs = world.query(npcAiQuery);
    const npc = npcs[0];
    const pos = npc.get(Position);
    expect(pos.x).toBe(1);
    expect(pos.y).toBe(1);

    const dlg = npc.get(Dialogue);
    expect(dlg.id).toBe('artun-greeting');
    expect(dlg.portrait).toBe('artun.png');
  });

  it('spawns chest with correct traits', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    spawnEntities(world, loaded.entities);

    const chests = world.query(chestQuery);
    expect(chests).toHaveLength(1);

    const chest = chests[0];
    expect(chest.has(Position)).toBe(true);
    expect(chest.has(Sprite)).toBe(true);
    expect(chest.has(Chest)).toBe(true);
    expect(chest.has(Interactable)).toBe(true);
    expect(chest.has(Collidable)).toBe(true);

    const pos = chest.get(Position);
    expect(pos.x).toBe(3);
    expect(pos.y).toBe(2);

    const c = chest.get(Chest);
    expect(c.contents).toEqual(['potion', 'gold']);
    expect(c.opened).toBe(false);
  });

  it('spawns transition with correct traits', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    spawnEntities(world, loaded.entities);

    const transitions = world.query(transitionQuery);
    expect(transitions).toHaveLength(1);

    const trans = transitions[0];
    expect(trans.has(Position)).toBe(true);
    expect(trans.has(Transition)).toBe(true);
    expect(trans.has(Trigger)).toBe(true);

    const t = trans.get(Transition);
    expect(t.targetMap).toBe('tavern-interior');
    expect(t.targetX).toBe(5);
    expect(t.targetY).toBe(10);
  });

  it('spawns trigger with correct traits', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    spawnEntities(world, loaded.entities);

    // triggerQuery matches Position + Trigger; transitions also have Trigger
    const triggers = world.query(triggerQuery);
    // 1 transition + 1 trigger = 2 entities with Trigger trait
    expect(triggers.length).toBeGreaterThanOrEqual(2);

    const questTrigger = triggers.find((e) => {
      const t = e.get(Trigger);
      return t.eventId === 'mq01-start';
    });
    expect(questTrigger).toBeDefined();
    expect(questTrigger!.get(Trigger).condition).toBe('quest.mq01 == false');
  });

  it('spawns resonance stone with correct traits', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    spawnEntities(world, loaded.entities);

    const stones = world.query(resonanceStoneQuery);
    expect(stones).toHaveLength(1);

    const stone = stones[0];
    expect(stone.has(ResonanceStone)).toBe(true);
    expect(stone.has(Interactable)).toBe(true);
    expect(stone.has(Collidable)).toBe(true);

    const rs = stone.get(ResonanceStone);
    expect(rs.stoneId).toBe('stone-1');
    expect(rs.message).toBe('A faint memory echoes...');
    expect(rs.discovered).toBe(false);
  });

  it('all spawned entities are queryable via interactableQuery', () => {
    const loaded = loadMapData(FIXTURE_MAP);
    spawnEntities(world, loaded.entities);

    // NPC, chest, resonance stone = 3 interactable entities
    const interactables = world.query(interactableQuery);
    expect(interactables).toHaveLength(3);
  });
});

