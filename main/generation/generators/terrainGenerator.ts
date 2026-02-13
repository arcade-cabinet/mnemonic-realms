import { SeededRandom } from '../seededRandom';

export type TerrainType =
  | 'plains'
  | 'forest'
  | 'mountain'
  | 'desert'
  | 'swamp'
  | 'tundra'
  | 'volcano'
  | 'ocean';

export interface Terrain {
  type: TerrainType;
  difficulty: number;
  resources: string[];
  hazards: string[];
  description: string;
}

const TERRAIN_CONFIGS: Record<TerrainType, Partial<Terrain>> = {
  plains: {
    resources: ['Wheat', 'Grass', 'Wild Herbs'],
    hazards: ['Bandits', 'Wild Beasts'],
    description: 'Rolling grasslands stretch as far as the eye can see.',
  },
  forest: {
    resources: ['Timber', 'Berries', 'Mushrooms', 'Game'],
    hazards: ['Wolves', 'Bears', 'Poison Ivy'],
    description: 'Dense woods filled with ancient trees and mysterious shadows.',
  },
  mountain: {
    resources: ['Iron Ore', 'Precious Gems', 'Rare Minerals'],
    hazards: ['Avalanches', 'Rock Slides', 'Harsh Weather'],
    description: 'Towering peaks pierce the clouds above.',
  },
  desert: {
    resources: ['Cactus Water', 'Sand Glass', 'Rare Spices'],
    hazards: ['Sandstorms', 'Scorpions', 'Extreme Heat'],
    description: 'Endless dunes of scorching sand under a merciless sun.',
  },
  swamp: {
    resources: ['Medicinal Herbs', 'Rare Amphibians', 'Bog Iron'],
    hazards: ['Disease', 'Quicksand', 'Venomous Creatures'],
    description: 'Murky wetlands teeming with danger and decay.',
  },
  tundra: {
    resources: ['Furs', 'Ice Crystals', 'Arctic Fish'],
    hazards: ['Frostbite', 'Blizzards', 'Ice Bears'],
    description: 'Frozen wasteland where few dare to tread.',
  },
  volcano: {
    resources: ['Obsidian', 'Sulfur', 'Magma Crystals'],
    hazards: ['Lava Flows', 'Toxic Fumes', 'Eruptions'],
    description: 'A fiery hellscape of molten rock and ash.',
  },
  ocean: {
    resources: ['Fish', 'Pearls', 'Coral', 'Seaweed'],
    hazards: ['Storms', 'Sea Monsters', 'Drowning'],
    description: 'Vast waters hiding mysteries in their depths.',
  },
};

/**
 * Deterministic terrain generator
 */
export class TerrainGenerator {
  private rng: SeededRandom;

  constructor(seed: string) {
    this.rng = new SeededRandom(seed);
  }

  /**
   * Generate a terrain based on seed
   */
  generateTerrain(): Terrain {
    const types: TerrainType[] = [
      'plains',
      'forest',
      'mountain',
      'desert',
      'swamp',
      'tundra',
      'volcano',
      'ocean',
    ];
    const type = this.rng.pick(types);
    const config = TERRAIN_CONFIGS[type];
    const difficulty = this.rng.randomInt(1, 10);

    return {
      type,
      difficulty,
      resources: config.resources || [],
      hazards: config.hazards || [],
      description: config.description || '',
    };
  }

  /**
   * Generate a region with multiple terrain types
   */
  generateRegion(size: number = 5): Terrain[][] {
    const region: Terrain[][] = [];

    for (let y = 0; y < size; y++) {
      const row: Terrain[] = [];
      for (let x = 0; x < size; x++) {
        const cellSeed = `${this.rng.seed}-${x}-${y}`;
        const cellRng = new SeededRandom(cellSeed);
        const types: TerrainType[] = [
          'plains',
          'forest',
          'mountain',
          'desert',
          'swamp',
          'tundra',
          'volcano',
          'ocean',
        ];
        const type = cellRng.pick(types);
        const config = TERRAIN_CONFIGS[type];

        row.push({
          type,
          difficulty: cellRng.randomInt(1, 10),
          resources: config.resources || [],
          hazards: config.hazards || [],
          description: config.description || '',
        });
      }
      region.push(row);
    }

    return region;
  }
}
