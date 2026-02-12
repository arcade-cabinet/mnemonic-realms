/**
 * Traits - Predefined component combinations for common entity patterns
 */

import type { Entity } from 'ecsy';
import {
  Alignment,
  Backstory,
  CharacterClass,
  Description,
  Dialogue,
  Item,
  Location,
  Loot,
  Name,
  Personality,
  Room,
  Seed,
  Skill,
  SkillMastery,
  Terrain,
} from './components';

/**
 * Add NPC-related components to an entity.
 *
 * Adds Name, Description, Personality, Dialogue, Backstory, and Alignment components to the provided entity.
 *
 * @param entity - The entity to augment; it is mutated in place.
 * @returns The same entity with NPC components added.
 */
export function applyNPCTrait(entity: Entity): Entity {
  entity.addComponent(Name);
  entity.addComponent(Description);
  entity.addComponent(Personality);
  entity.addComponent(Dialogue);
  entity.addComponent(Backstory);
  entity.addComponent(Alignment);
  return entity;
}

/**
 * Apply character-related components to an entity.
 *
 * Adds NPC-related components plus class and skill components so the entity represents a playable or non-playable character.
 *
 * @param entity - The entity to augment; it is mutated in place.
 * @returns The same entity with NPC, CharacterClass, and SkillMastery components added.
 */
export function applyCharacterTrait(entity: Entity): Entity {
  applyNPCTrait(entity);
  entity.addComponent(CharacterClass);
  entity.addComponent(SkillMastery);
  return entity;
}

/**
 * Apply terrain-related components to an entity.
 *
 * @returns The same entity with `Terrain`, `Location`, and `Description` components added
 */
export function applyTerrainTrait(entity: Entity): Entity {
  entity.addComponent(Terrain);
  entity.addComponent(Location);
  entity.addComponent(Description);
  return entity;
}

/**
 * Apply the Room trait to an entity by adding room-related components.
 *
 * @param entity - The entity to augment; mutated in place.
 * @returns The same `entity` with Room, Name, Description, and Location components added.
 */
export function applyRoomTrait(entity: Entity): Entity {
  entity.addComponent(Room);
  entity.addComponent(Name);
  entity.addComponent(Description);
  entity.addComponent(Location);
  return entity;
}

/**
 * Add item-related components to an entity.
 *
 * @param entity - The ECSY entity to augment.
 * @returns The same `entity` with `Item`, `Name`, and `Description` components added.
 */
export function applyItemTrait(entity: Entity): Entity {
  entity.addComponent(Item);
  entity.addComponent(Name);
  entity.addComponent(Description);
  return entity;
}

/**
 * Apply the Loot Container trait to an entity.
 *
 * @returns The same entity with `Loot` and `Location` components added
 */
export function applyLootTrait(entity: Entity): Entity {
  entity.addComponent(Loot);
  entity.addComponent(Location);
  return entity;
}

/**
 * Apply the seeded trait to an entity.
 *
 * @returns The same `entity` with the `Seed` component added
 */
export function applySeededTrait(entity: Entity): Entity {
  entity.addComponent(Seed);
  return entity;
}

/**
 * Apply the Skill trait to an entity.
 *
 * @param entity - The entity to augment with skill-related components
 * @returns The same entity with `Skill` and `Description` components added
 */
export function applySkillTrait(entity: Entity): Entity {
  entity.addComponent(Skill);
  entity.addComponent(Description);
  return entity;
}