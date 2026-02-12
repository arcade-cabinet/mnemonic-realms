import { World } from 'ecsy';
import { parseSeed } from '../utils/seededRandom';
import {
  Alignment,
  Backstory,
  CharacterClass,
  Description,
  Dialogue,
  Location,
  Name,
  Personality,
  Room,
  Seed,
  SkillMastery,
  Terrain,
} from './components';
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
      .registerComponent(Room);
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

    const terrain = entity.getMutableComponent(Terrain);
    if (terrain) {
      terrain.type = this.determineTerrainType(noun);
      terrain.difficulty = adjectives.length + 1;
      terrain.resources = this.getTerrainResources(terrain.type);
      terrain.hazards = this.getTerrainHazards(terrain.type);
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

    const room = entity.getMutableComponent(Room);
    if (room) {
      room.type = this.determineRoomType(noun);
      room.difficulty = adjectives.length;
      room.connections = Math.min(4, adjectives.length + 1);
      room.contents = this.getRoomContents(room.type);
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
   * Get an entity by ID
   */
  getEntity(id: number) {
    // Using direct world entities access
    const entities = (this.world as any).entities;
    return entities ? entities.get(id) : null;
  }

  /**
   * Export entity as JSON
   */
  exportEntity(id: number): Record<string, unknown> | null {
    const entity = this.getEntity(id);
    if (!entity) return null;

    const data: Record<string, unknown> = { id: entity.id };
    const components = entity.getComponents();

    for (const component of components) {
      const name = component.constructor.name;
      data[name] = { ...component };
    }

    return data;
  }

  // Helper methods
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

  private determineTerrainType(noun: string): string {
    const nounLower = noun.toLowerCase();
    if (nounLower.includes('forest') || nounLower.includes('wood')) return 'forest';
    if (nounLower.includes('mountain') || nounLower.includes('peak')) return 'mountain';
    if (nounLower.includes('desert') || nounLower.includes('sand')) return 'desert';
    if (nounLower.includes('swamp') || nounLower.includes('marsh')) return 'swamp';
    if (nounLower.includes('tundra') || nounLower.includes('ice')) return 'tundra';
    if (nounLower.includes('volcano') || nounLower.includes('lava')) return 'volcano';
    if (nounLower.includes('ocean') || nounLower.includes('sea')) return 'ocean';
    return 'plains';
  }

  private determineRoomType(noun: string): string {
    const nounLower = noun.toLowerCase();
    if (nounLower.includes('treasure') || nounLower.includes('vault')) return 'treasure';
    if (nounLower.includes('battle') || nounLower.includes('arena')) return 'combat';
    if (nounLower.includes('puzzle') || nounLower.includes('riddle')) return 'puzzle';
    if (nounLower.includes('trap') || nounLower.includes('danger')) return 'trap';
    if (nounLower.includes('shop') || nounLower.includes('merchant')) return 'shop';
    if (nounLower.includes('rest') || nounLower.includes('safe')) return 'rest';
    if (nounLower.includes('boss') || nounLower.includes('throne')) return 'boss';
    return 'secret';
  }

  private getTerrainResources(type: string): string[] {
    const resources: Record<string, string[]> = {
      plains: ['Wheat', 'Grass'],
      forest: ['Timber', 'Berries'],
      mountain: ['Iron Ore', 'Gems'],
      desert: ['Cactus Water', 'Sand Glass'],
      swamp: ['Herbs', 'Bog Iron'],
      tundra: ['Furs', 'Ice Crystals'],
      volcano: ['Obsidian', 'Sulfur'],
      ocean: ['Fish', 'Pearls'],
    };
    return resources[type] || [];
  }

  private getTerrainHazards(type: string): string[] {
    const hazards: Record<string, string[]> = {
      plains: ['Bandits'],
      forest: ['Wolves', 'Bears'],
      mountain: ['Avalanches'],
      desert: ['Sandstorms'],
      swamp: ['Disease'],
      tundra: ['Blizzards'],
      volcano: ['Lava Flows'],
      ocean: ['Storms'],
    };
    return hazards[type] || [];
  }

  private getRoomContents(type: string): string[] {
    const contents: Record<string, string[]> = {
      treasure: ['Gold', 'Jewels'],
      combat: ['Enemies', 'Weapons'],
      puzzle: ['Runes', 'Mechanisms'],
      trap: ['Spike Pits', 'Poison Darts'],
      shop: ['Merchant', 'Goods'],
      rest: ['Beds', 'Food'],
      boss: ['Powerful Enemy'],
      secret: ['Hidden Treasure'],
    };
    return contents[type] || [];
  }
}
