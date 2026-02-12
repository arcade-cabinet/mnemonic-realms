import { World } from 'ecsy';
import { parseSeed } from '../utils/seededRandom';
import {
  Alignment,
  Backstory,
  CharacterClass,
  Description,
  Dialogue,
  DialogueArchetype,
  Location,
  Name,
  NameArchetype,
  Personality,
  Room,
  RoomArchetype,
  Seed,
  SkillMastery,
  Terrain,
  TerrainArchetype,
} from './components';
import { BIOME_CONFIGS, ROOM_LAYOUT_TYPES } from './dataPools';
import {
  BackstoryGenerationSystem,
  ClassGenerationSystem,
  DescriptionGenerationSystem,
  DialogueGenerationSystem,
  NameGenerationSystem,
} from './systems';
import { applyCharacterTrait, applyRoomTrait, applySeededTrait, applyTerrainTrait } from './traits';

/**
 * ECS World Factory for procedural generation
 */
export class ProceduralWorld {
  private world: World;

  constructor() {
    this.world = new World();
    this.registerComponents();
    this.registerSystems();
  }

  private registerComponents(): void {
    this.world
      .registerComponent(Name)
      .registerComponent(Description)
      .registerComponent(Seed)
      .registerComponent(Alignment)
      .registerComponent(Personality)
      .registerComponent(Dialogue)
      .registerComponent(Backstory)
      .registerComponent(CharacterClass)
      .registerComponent(SkillMastery)
      .registerComponent(Location)
      .registerComponent(Terrain)
      .registerComponent(Room)
      .registerComponent(NameArchetype)
      .registerComponent(DialogueArchetype)
      .registerComponent(TerrainArchetype)
      .registerComponent(RoomArchetype);
  }

  private registerSystems(): void {
    this.world
      .registerSystem(NameGenerationSystem)
      .registerSystem(DialogueGenerationSystem)
      .registerSystem(BackstoryGenerationSystem)
      .registerSystem(ClassGenerationSystem)
      .registerSystem(DescriptionGenerationSystem);
  }

  /**
   * Create a character entity from a seed
   */
  createCharacter(seedString: string): number {
    const entity = this.world.createEntity();
    const { adjectives, noun } = parseSeed(seedString);

    // Apply traits
    applyCharacterTrait(entity);
    applySeededTrait(entity);

    // Set seed component
    const seed = entity.getMutableComponent(Seed);
    if (seed) {
      seed.value = seedString;
      seed.adjectives = adjectives;
      seed.noun = noun;
    }

    // Set alignment based on adjectives
    const alignment = entity.getMutableComponent(Alignment);
    if (alignment) {
      alignment.type = this.determineAlignment(adjectives);
      alignment.value = alignment.type === 'light' ? 50 : alignment.type === 'dark' ? -50 : 0;
    }

    // Set personality traits
    const personality = entity.getMutableComponent(Personality);
    if (personality) {
      personality.traits = [this.determinePersonality(adjectives)];
    }

    // Set name archetype based on first adjective hash
    const nameArchetype = entity.getMutableComponent(NameArchetype);
    if (nameArchetype) {
      nameArchetype.syllableSet = this.hashString(adjectives[0]) % 4;
      nameArchetype.titleCategory = this.hashString(adjectives[1]) % 4;
    }

    // Set dialogue archetype based on noun and adjectives
    const dialogueArchetype = entity.getMutableComponent(DialogueArchetype);
    if (dialogueArchetype) {
      dialogueArchetype.greetingStyle = this.hashString(noun) % 4;
      dialogueArchetype.questHookType = this.hashString(adjectives.join('')) % 4;
    }

    return entity.id;
  }

  /**
   * Create a terrain entity from a seed
   */
  createTerrain(seedString: string, x: number, y: number): number {
    const entity = this.world.createEntity();
    const { adjectives, noun } = parseSeed(seedString);

    applyTerrainTrait(entity);
    applySeededTrait(entity);

    const seed = entity.getMutableComponent(Seed);
    if (seed) {
      seed.value = seedString;
      seed.adjectives = adjectives;
      seed.noun = noun;
    }

    // Set terrain archetype based on seed
    const terrainArchetype = entity.getMutableComponent(TerrainArchetype);
    if (terrainArchetype) {
      terrainArchetype.biomeId = this.hashString(noun) % BIOME_CONFIGS.length;
      terrainArchetype.resourceTier = this.hashString(adjectives[0]) % 3;
    }

    const terrain = entity.getMutableComponent(Terrain);
    if (terrain && terrainArchetype) {
      const biome = BIOME_CONFIGS[terrainArchetype.biomeId];
      terrain.type = biome.type;
      terrain.difficulty = terrainArchetype.resourceTier + 1;
      terrain.resources = biome.resources;
      terrain.hazards = biome.hazards;
    }

    const location = entity.getMutableComponent(Location);
    if (location) {
      location.coordinates = { x, y };
      location.type = 'terrain';
    }

    return entity.id;
  }

  /**
   * Create a room entity from a seed
   */
  createRoom(seedString: string): number {
    const entity = this.world.createEntity();
    const { adjectives, noun } = parseSeed(seedString);

    applyRoomTrait(entity);
    applySeededTrait(entity);

    const seed = entity.getMutableComponent(Seed);
    if (seed) {
      seed.value = seedString;
      seed.adjectives = adjectives;
      seed.noun = noun;
    }

    // Set room archetype based on seed
    const roomArchetype = entity.getMutableComponent(RoomArchetype);
    if (roomArchetype) {
      roomArchetype.layoutType = this.hashString(noun) % ROOM_LAYOUT_TYPES.length;
      roomArchetype.dangerLevel = this.hashString(adjectives[1]) % 3;
    }

    const room = entity.getMutableComponent(Room);
    if (room && roomArchetype) {
      const layout = ROOM_LAYOUT_TYPES[roomArchetype.layoutType];
      room.type = layout.type;
      room.difficulty = roomArchetype.dangerLevel + 1;
      room.connections = Math.min(4, roomArchetype.dangerLevel + 2);
      room.contents = layout.contents;
    }

    return entity.id;
  }

  /**
   * Execute all systems (process entities)
   */
  update(delta: number = 0.016): void {
    this.world.execute(delta, 0);
  }

  /**
   * Get an entity by ID using ecsy's entity manager
   */
  getEntity(id: number) {
    const entityManager = (this.world as any).entityManager;
    if (entityManager && typeof entityManager.getEntityById === 'function') {
      return entityManager.getEntityById(id);
    }
    // Fallback: search through entities array
    const entities = entityManager?._entities;
    return entities ? entities.find((e: any) => e.id === id) : null;
  }

  /**
   * Export entity as JSON
   */
  exportEntity(id: number): Record<string, unknown> | null {
    const entity = this.getEntity(id);
    if (!entity) return null;

    const data: Record<string, unknown> = { id: entity.id };

    // Get all component types from the entity
    const componentTypes = entity._ComponentTypes || [];

    for (const ComponentType of componentTypes) {
      const component = entity.getComponent(ComponentType);
      if (component) {
        const name = ComponentType.name;
        data[name] = { ...component };
      }
    }

    return data;
  }

  // Helper methods
  /**
   * Simple string hash for deterministic archetype selection
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private determineAlignment(adjectives: string[]): 'light' | 'dark' | 'neutral' {
    const lightWords = ['bright', 'holy', 'pure', 'divine', 'radiant', 'blessed'];
    const darkWords = ['dark', 'shadow', 'cursed', 'evil', 'black', 'void'];

    const adjectivesLower = adjectives.map((a) => a.toLowerCase());

    if (adjectivesLower.some((a) => lightWords.some((w) => a.includes(w)))) return 'light';
    if (adjectivesLower.some((a) => darkWords.some((w) => a.includes(w)))) return 'dark';
    return 'neutral';
  }

  private determinePersonality(adjectives: string[]): string {
    const friendlyWords = ['kind', 'gentle', 'warm', 'friendly'];
    const suspiciousWords = ['dark', 'suspicious', 'wary', 'cautious'];
    const wiseWords = ['ancient', 'wise', 'old', 'sage'];

    const adjectivesLower = adjectives.map((a) => a.toLowerCase());

    if (adjectivesLower.some((a) => friendlyWords.some((w) => a.includes(w)))) return 'friendly';
    if (adjectivesLower.some((a) => suspiciousWords.some((w) => a.includes(w))))
      return 'suspicious';
    if (adjectivesLower.some((a) => wiseWords.some((w) => a.includes(w)))) return 'wise';

    return 'jovial';
  }
}
