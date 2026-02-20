/**
 * Entity Spawner — EntityDescriptor[] → Koota entities
 *
 * Creates Koota ECS entities with appropriate trait compositions
 * based on entity descriptors produced by the map loader.
 *
 * Trait compositions per entity type:
 * - NPC: Position, Sprite, Facing, Npc, Collidable, Interactable, Dialogue, AiState (+PatrolPath)
 * - Chest: Position, Sprite, Chest, Interactable, Collidable
 * - Transition: Position, Transition, Trigger
 * - Trigger: Position, Trigger
 * - Resonance Stone: Position, Sprite, ResonanceStone, Interactable, Collidable
 */

import type { Entity, World } from 'koota';
import {
  AiState,
  Chest,
  Collidable,
  Dialogue,
  Facing,
  Interactable,
  Npc,
  PatrolPath,
  Position,
  ResonanceStone,
  Sprite,
  Transition,
  Trigger,
} from '../ecs/index.js';
import type { EntityDescriptor } from './loader.js';

/**
 * Spawn entities into the Koota ECS world from entity descriptors.
 *
 * Each descriptor's type determines which traits are attached.
 * Returns the created Entity handles for further manipulation.
 */
export function spawnEntities(world: World, descriptors: EntityDescriptor[]): Entity[] {
  const entities: Entity[] = [];

  for (const desc of descriptors) {
    const entity = spawnEntity(world, desc);
    if (entity) {
      entities.push(entity);
    }
  }

  return entities;
}

/** Spawn a single entity based on its descriptor type. */
function spawnEntity(world: World, desc: EntityDescriptor): Entity | null {
  switch (desc.type) {
    case 'npc':
      return spawnNpc(world, desc);
    case 'chest':
      return spawnChest(world, desc);
    case 'transition':
      return spawnTransition(world, desc);
    case 'trigger':
      return spawnTrigger(world, desc);
    case 'resonance-stone':
      return spawnResonanceStone(world, desc);
    default:
      return null;
  }
}

/** Spawn an NPC entity with full trait composition. */
function spawnNpc(world: World, desc: EntityDescriptor): Entity {
  const props = desc.properties;
  const traits = [
    Position({ x: desc.x, y: desc.y }),
    Sprite({
      sheet: (props.sprite as string) || '',
      frame: 0,
      width: 16,
      height: 16,
    }),
    Facing({ direction: (props.facing as 'up' | 'down' | 'left' | 'right') || 'down' }),
    Npc,
    Collidable,
    Interactable,
    Dialogue({
      id: (props.dialogueId as string) || desc.name,
      lines: props.lines ? JSON.parse(props.lines as string) : null,
      portrait: (props.portrait as string) || '',
    }),
    AiState({
      state: (props.aiState as 'idle' | 'patrol' | 'follow') || 'idle',
    }),
  ];

  const entity = world.spawn(...traits);

  // Add patrol path if specified
  if (props.patrolPath) {
    const points = JSON.parse(props.patrolPath as string) as { x: number; y: number }[];
    entity.add(PatrolPath({ points, currentIndex: 0 }));
  }

  return entity;
}

/** Spawn a chest entity. */
function spawnChest(world: World, desc: EntityDescriptor): Entity {
  const props = desc.properties;
  return world.spawn(
    Position({ x: desc.x, y: desc.y }),
    Sprite({
      sheet: (props.sprite as string) || 'chest',
      frame: 0,
      width: 16,
      height: 16,
    }),
    Chest({
      contents: props.contents ? JSON.parse(props.contents as string) : null,
      opened: false,
    }),
    Interactable,
    Collidable,
  );
}

/** Spawn a transition zone entity. */
function spawnTransition(world: World, desc: EntityDescriptor): Entity {
  const props = desc.properties;
  return world.spawn(
    Position({ x: desc.x, y: desc.y }),
    Transition({
      targetMap: (props.target as string) || '',
      targetX: (props.targetX as number) || 0,
      targetY: (props.targetY as number) || 0,
    }),
    Trigger({
      eventId: desc.name,
      condition: (props.condition as string) || '',
    }),
  );
}

/** Spawn a trigger entity. */
function spawnTrigger(world: World, desc: EntityDescriptor): Entity {
  return world.spawn(
    Position({ x: desc.x, y: desc.y }),
    Trigger({
      eventId: (desc.properties.eventId as string) || desc.name,
      condition: (desc.properties.condition as string) || '',
    }),
  );
}

/** Spawn a resonance stone entity. */
function spawnResonanceStone(world: World, desc: EntityDescriptor): Entity {
  const props = desc.properties;
  return world.spawn(
    Position({ x: desc.x, y: desc.y }),
    Sprite({
      sheet: (props.sprite as string) || 'resonance-stone',
      frame: 0,
      width: 16,
      height: 16,
    }),
    ResonanceStone({
      stoneId: (props.stoneId as string) || desc.name,
      discovered: false,
      message: (props.message as string) || '',
    }),
    Interactable,
    Collidable,
  );
}
