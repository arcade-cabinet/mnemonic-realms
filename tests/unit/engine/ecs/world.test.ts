import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { universe } from 'koota';
import { createGameWorld } from '../../../../engine/ecs/world.js';
import {
  Position,
  Player,
  Npc,
  Velocity,
  Sprite,
  Facing,
  Collidable,
  Interactable,
  Dialogue,
  AiState,
  PatrolPath,
  Health,
  Inventory,
  QuestFlags,
  AreaVibrancy,
  Chest,
  ResonanceStone,
  Transition,
  Trigger,
} from '../../../../engine/ecs/traits.js';
import {
  playerQuery,
  movableQuery,
  renderableQuery,
  interactableQuery,
  npcDialogueQuery,
  collidableQuery,
  chestQuery,
  resonanceStoneQuery,
  transitionQuery,
  triggerQuery,
  npcAiQuery,
  patrollingQuery,
  healthQuery,
  staticNpcQuery,
  renderableFacingQuery,
} from '../../../../engine/ecs/queries.js';

describe('ECS World', () => {
  afterEach(() => {
    universe.reset();
  });

  it('creates a world via createGameWorld()', () => {
    const world = createGameWorld();
    expect(world).toBeDefined();
    expect(world.spawn).toBeTypeOf('function');
    expect(world.query).toBeTypeOf('function');
    // Koota creates a world entity (id 0) automatically for world-level traits
    const baseCount = world.entities.length;
    expect(baseCount).toBeGreaterThanOrEqual(1);
    world.destroy();
  });

  it('spawns an entity with traits', () => {
    const world = createGameWorld();
    const baseCount = world.entities.length;
    const entity = world.spawn(Position({ x: 10, y: 10 }), Player);
    expect(entity).toBeDefined();
    expect(world.entities).toHaveLength(baseCount + 1);

    const pos = entity.get(Position);
    expect(pos.x).toBe(10);
    expect(pos.y).toBe(10);
    expect(entity.has(Player)).toBe(true);
    world.destroy();
  });

  it('removes entities from the world', () => {
    const world = createGameWorld();
    const baseCount = world.entities.length;
    const entity = world.spawn(Position, Player);
    expect(world.entities).toHaveLength(baseCount + 1);

    entity.destroy();
    expect(world.entities).toHaveLength(baseCount);
  });

  it('adds and removes traits from entities', () => {
    const world = createGameWorld();
    const entity = world.spawn(Position({ x: 5, y: 5 }));

    expect(entity.has(Velocity)).toBe(false);
    entity.add(Velocity({ x: 1, y: 0 }));
    expect(entity.has(Velocity)).toBe(true);

    const vel = entity.get(Velocity);
    expect(vel.x).toBe(1);
    expect(vel.y).toBe(0);

    entity.remove(Velocity);
    expect(entity.has(Velocity)).toBe(false);
  });

  it('updates trait values with set()', () => {
    const world = createGameWorld();
    const entity = world.spawn(Position({ x: 0, y: 0 }));

    entity.set(Position, { x: 42, y: 99 });
    const pos = entity.get(Position);
    expect(pos.x).toBe(42);
    expect(pos.y).toBe(99);
  });

  it('supports functional set() updates', () => {
    const world = createGameWorld();
    const entity = world.spawn(Health({ current: 100, max: 100 }));

    entity.set(Health, (prev) => ({ ...prev, current: prev.current - 25 }));
    expect(entity.get(Health).current).toBe(75);
    expect(entity.get(Health).max).toBe(100);
  });
});

describe('ECS Traits — SoA storage', () => {
  beforeEach(() => {
    universe.reset();
  });

  afterEach(() => {
    universe.reset();
  });

  it('defines all 19 required traits', () => {
    // Verify all traits are importable and are valid Koota traits
    const allTraits = [
      Position, Sprite, Facing, Velocity,
      Player, Npc, Collidable, Interactable,
      Dialogue, AiState, PatrolPath,
      Health, Inventory, QuestFlags, AreaVibrancy,
      Chest, ResonanceStone, Transition, Trigger,
    ];
    expect(allTraits).toHaveLength(19);
    // Each trait should be usable with world.spawn
    const world = createGameWorld();
    for (const t of allTraits) {
      const entity = world.spawn(t);
      expect(entity.has(t)).toBe(true);
      entity.destroy();
    }
  });

  it('stores Position as SoA (x[], y[] arrays)', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 1, y: 2 }));
    world.spawn(Position({ x: 3, y: 4 }));
    world.spawn(Position({ x: 5, y: 6 }));

    const results = world.query(Position);
    expect(results).toHaveLength(3);

    // Verify each entity has correct position values
    const positions = results.map((e) => {
      const p = e.get(Position);
      return { x: p.x, y: p.y };
    });
    expect(positions).toContainEqual({ x: 1, y: 2 });
    expect(positions).toContainEqual({ x: 3, y: 4 });
    expect(positions).toContainEqual({ x: 5, y: 6 });
  });

  it('stores tag traits (Player, Npc) with no data', () => {
    const world = createGameWorld();
    const player = world.spawn(Player);
    const npc = world.spawn(Npc);

    expect(player.has(Player)).toBe(true);
    expect(player.has(Npc)).toBe(false);
    expect(npc.has(Npc)).toBe(true);
    expect(npc.has(Player)).toBe(false);
  });

  it('stores complex trait data (Dialogue, Chest, etc.)', () => {
    const world = createGameWorld();
    const npc = world.spawn(
      Dialogue({ id: 'artun-1', lines: ['Hello traveler', 'Welcome'], portrait: 'artun.png' }),
    );
    const d = npc.get(Dialogue);
    expect(d.id).toBe('artun-1');
    expect(d.lines).toEqual(['Hello traveler', 'Welcome']);
    expect(d.portrait).toBe('artun.png');

    const chest = world.spawn(
      Chest({ contents: ['potion', 'gold'], opened: false }),
    );
    const c = chest.get(Chest);
    expect(c.contents).toEqual(['potion', 'gold']);
    expect(c.opened).toBe(false);
  });
});

describe('ECS Queries', () => {
  beforeEach(() => {
    universe.reset();
  });

  afterEach(() => {
    universe.reset();
  });

  it('queries player entities', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 10, y: 10 }), Player);
    world.spawn(Position({ x: 5, y: 5 }), Npc);

    const players = world.query(playerQuery);
    expect(players).toHaveLength(1);
    expect(players[0].has(Player)).toBe(true);
  });

  it('queries movable entities (Position + Velocity)', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 0, y: 0 }), Velocity({ x: 1, y: 0 }), Player);
    world.spawn(Position({ x: 5, y: 5 }), Npc); // no velocity
    world.spawn(Position({ x: 3, y: 3 }), Velocity({ x: 0, y: 1 }), Npc);

    const movable = world.query(movableQuery);
    expect(movable).toHaveLength(2);
  });

  it('queries renderable entities (Position + Sprite)', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 0, y: 0 }), Sprite({ sheet: 'player', frame: 0, width: 16, height: 16 }));
    world.spawn(Position({ x: 5, y: 5 }), Sprite({ sheet: 'npc', frame: 1, width: 16, height: 16 }));
    world.spawn(Position({ x: 10, y: 10 })); // no sprite

    const renderable = world.query(renderableQuery);
    expect(renderable).toHaveLength(2);
  });

  it('queries interactable entities', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 5, y: 5 }), Interactable, Npc, Dialogue({ id: 'test', lines: ['Hi'], portrait: '' }));
    world.spawn(Position({ x: 10, y: 10 }), Npc); // not interactable
    world.spawn(Position({ x: 3, y: 3 }), Interactable, Chest({ contents: ['key'], opened: false }));

    const interactables = world.query(interactableQuery);
    expect(interactables).toHaveLength(2);
  });

  it('queries NPC dialogue entities', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 5, y: 5 }), Npc, Dialogue({ id: 'artun-1', lines: ['Hello'], portrait: '' }));
    world.spawn(Position({ x: 10, y: 10 }), Npc); // no dialogue
    world.spawn(Position({ x: 3, y: 3 }), Player);

    const npcsWithDialogue = world.query(npcDialogueQuery);
    expect(npcsWithDialogue).toHaveLength(1);
  });

  it('queries collidable entities', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 5, y: 5 }), Collidable);
    world.spawn(Position({ x: 10, y: 10 }), Collidable);
    world.spawn(Position({ x: 3, y: 3 })); // not collidable

    const collidables = world.query(collidableQuery);
    expect(collidables).toHaveLength(2);
  });

  it('queries chests and resonance stones', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 5, y: 5 }), Chest({ contents: ['potion'], opened: false }));
    world.spawn(Position({ x: 10, y: 10 }), ResonanceStone({ stoneId: 'stone-1', discovered: false, message: 'A memory...' }));

    expect(world.query(chestQuery)).toHaveLength(1);
    expect(world.query(resonanceStoneQuery)).toHaveLength(1);
  });

  it('queries transitions and triggers', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 0, y: 0 }), Transition({ targetMap: 'ambergrove', targetX: 5, targetY: 10 }));
    world.spawn(Position({ x: 30, y: 30 }), Trigger({ eventId: 'act1-scene2', condition: 'quest.artun-intro' }));

    expect(world.query(transitionQuery)).toHaveLength(1);
    expect(world.query(triggerQuery)).toHaveLength(1);
  });

  it('queries NPC AI and patrol entities', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 5, y: 5 }), Npc, AiState({ state: 'patrol' }), PatrolPath({ points: [{ x: 5, y: 5 }, { x: 10, y: 5 }], currentIndex: 0 }));
    world.spawn(Position({ x: 10, y: 10 }), Npc, AiState({ state: 'idle' })); // AI but no patrol

    expect(world.query(npcAiQuery)).toHaveLength(2);
    expect(world.query(patrollingQuery)).toHaveLength(1);
  });

  it('queries health entities', () => {
    const world = createGameWorld();
    world.spawn(Health({ current: 100, max: 100 }), Player, Position({ x: 0, y: 0 }));
    world.spawn(Health({ current: 50, max: 50 }), Npc, Position({ x: 5, y: 5 }));

    expect(world.query(healthQuery)).toHaveLength(2);
  });

  it('queries static NPCs (Npc without AiState)', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 5, y: 5 }), Npc); // static
    world.spawn(Position({ x: 10, y: 10 }), Npc, AiState({ state: 'idle' })); // has AI

    const statics = world.query(staticNpcQuery);
    expect(statics).toHaveLength(1);
    expect(statics[0].has(AiState)).toBe(false);
  });

  it('queries renderable entities with facing', () => {
    const world = createGameWorld();
    world.spawn(Position({ x: 0, y: 0 }), Sprite({ sheet: 'player', frame: 0, width: 16, height: 16 }), Facing({ direction: 'down' }));
    world.spawn(Position({ x: 5, y: 5 }), Sprite({ sheet: 'tree', frame: 0, width: 16, height: 16 })); // no facing

    expect(world.query(renderableFacingQuery)).toHaveLength(1);
  });
});

describe('ECS Deterministic Iteration', () => {
  beforeEach(() => {
    universe.reset();
  });

  afterEach(() => {
    universe.reset();
  });

  it('maintains insertion order for queries', () => {
    const world = createGameWorld();

    // Spawn entities in a specific order
    world.spawn(Position({ x: 1, y: 0 }), Sprite({ sheet: 'a', frame: 0, width: 16, height: 16 }));
    world.spawn(Position({ x: 2, y: 0 }), Sprite({ sheet: 'b', frame: 0, width: 16, height: 16 }));
    world.spawn(Position({ x: 3, y: 0 }), Sprite({ sheet: 'c', frame: 0, width: 16, height: 16 }));

    const results = world.query(renderableQuery);
    const xValues = results.map((e) => e.get(Position).x);

    // Koota guarantees insertion-order iteration
    expect(xValues).toEqual([1, 2, 3]);
  });

  it('maintains consistent order across multiple query calls', () => {
    const world = createGameWorld();

    world.spawn(Position({ x: 10, y: 0 }), Player);
    world.spawn(Position({ x: 20, y: 0 }), Npc);
    world.spawn(Position({ x: 30, y: 0 }), Npc);

    const first = world.query(Position).map((e) => e.get(Position).x);
    const second = world.query(Position).map((e) => e.get(Position).x);

    expect(first).toEqual(second);
    expect(first).toEqual([10, 20, 30]);
  });
});
