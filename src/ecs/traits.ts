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
 * Apply NPC trait to an entity
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
 * Apply Character trait to an entity (NPC + class/skills)
 */
export function applyCharacterTrait(entity: Entity): Entity {
  applyNPCTrait(entity);
  entity.addComponent(CharacterClass);
  entity.addComponent(SkillMastery);
  return entity;
}

/**
 * Apply Terrain trait to an entity
 */
export function applyTerrainTrait(entity: Entity): Entity {
  entity.addComponent(Terrain);
  entity.addComponent(Location);
  entity.addComponent(Description);
  return entity;
}

/**
 * Apply Room trait to an entity
 */
export function applyRoomTrait(entity: Entity): Entity {
  entity.addComponent(Room);
  entity.addComponent(Name);
  entity.addComponent(Description);
  entity.addComponent(Location);
  return entity;
}

/**
 * Apply Item trait to an entity
 */
export function applyItemTrait(entity: Entity): Entity {
  entity.addComponent(Item);
  entity.addComponent(Name);
  entity.addComponent(Description);
  return entity;
}

/**
 * Apply Loot Container trait to an entity
 */
export function applyLootTrait(entity: Entity): Entity {
  entity.addComponent(Loot);
  entity.addComponent(Location);
  return entity;
}

/**
 * Apply Seeded Entity trait - for any entity generated from a seed
 */
export function applySeededTrait(entity: Entity): Entity {
  entity.addComponent(Seed);
  return entity;
}

/**
 * Skill trait for character abilities
 */
export function applySkillTrait(entity: Entity): Entity {
  entity.addComponent(Skill);
  entity.addComponent(Description);
  return entity;
}
