/**
 * RPG-JS Module for Mnemonic Realms
 * Registers tilesets and exports procedurally generated Tiled maps
 */

import { Name, Terrain } from '../ecs/components';
import { ProceduralWorld } from '../ecs/world';
import { SeededRandom } from '../utils/seededRandom';

export interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: TiledLayer[];
  tilesets: TiledTileset[];
  properties?: Record<string, string | number | boolean>;
}

export interface TiledLayer {
  name: string;
  type: 'tilelayer' | 'objectgroup';
  width: number;
  height: number;
  data?: number[];
  objects?: TiledObject[];
  visible: boolean;
  opacity: number;
}

export interface TiledObject {
  id: number;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties?: Record<string, string | number | boolean>;
}

export interface TiledTileset {
  firstgid: number;
  source: string;
  name: string;
}

/**
 * Procedural Map Generator for RPG-JS
 */
export class ProceduralMapGenerator {
  private world: ProceduralWorld;
  private rng: SeededRandom;

  constructor(seed: string) {
    this.world = new ProceduralWorld();
    this.rng = new SeededRandom(seed);
  }

  /**
   * Generate a Tiled-format map
   */
  generateTiledMap(width: number = 20, height: number = 20): TiledMap {
    const terrainLayer = this.generateTerrainLayer(width, height);
    const objectLayer = this.generateObjectLayer(width, height);

    return {
      width,
      height,
      tilewidth: 32,
      tileheight: 32,
      layers: [terrainLayer, objectLayer],
      tilesets: this.getDefaultTilesets(),
      properties: {
        seed: this.rng.seed,
        generated: true,
      },
    };
  }

  /**
   * Generate terrain layer
   */
  private generateTerrainLayer(width: number, height: number): TiledLayer {
    const data: number[] = [];
    const terrainEntityIds: number[] = [];

    // First pass: create all terrain entities and record their IDs
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cellSeed = `${this.rng.seed}-${x}-${y}`;
        const terrainId = this.world.createTerrain(cellSeed, x, y);
        const index = y * width + x;
        terrainEntityIds[index] = terrainId;
      }
    }

    // Batch update: process all created entities at once
    this.world.update();

    // Second pass: read terrain components and build tile data
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const terrainId = terrainEntityIds[index];
        const entity = this.world.getEntity(terrainId);
        const terrain = entity?.getComponent(Terrain);

        // Map terrain types to tile IDs (these would correspond to your tileset)
        const tileId = this.getTileIdForTerrain(terrain?.type || 'plains');
        data.push(tileId);
      }
    }

    return {
      name: 'Terrain',
      type: 'tilelayer',
      width,
      height,
      data,
      visible: true,
      opacity: 1,
    };
  }

  /**
   * Generate object layer with NPCs, items, etc.
   */
  private generateObjectLayer(width: number, height: number): TiledLayer {
    const objects: TiledObject[] = [];
    const objectCount = this.rng.randomInt(5, 15);

    // Create all character entities first
    const characterIds: number[] = [];
    for (let i = 0; i < objectCount; i++) {
      const objSeed = `${this.rng.seed}-obj-${i}`;
      const characterId = this.world.createCharacter(objSeed);
      characterIds.push(characterId);
    }

    // Batch update: process all created entities at once
    this.world.update();

    // Build object list with positions
    for (let i = 0; i < objectCount; i++) {
      const x = this.rng.randomInt(0, width - 1) * 32;
      const y = this.rng.randomInt(0, height - 1) * 32;
      const characterId = characterIds[i];
      const objSeed = `${this.rng.seed}-obj-${i}`;

      const entity = this.world.getEntity(characterId);
      const name = entity?.getComponent(Name);

      objects.push({
        id: i + 1,
        name: name?.value || `NPC ${i}`,
        type: 'npc',
        x,
        y,
        width: 32,
        height: 32,
        properties: {
          characterId,
          seed: objSeed,
        },
      });
    }

    return {
      name: 'Objects',
      type: 'objectgroup',
      width,
      height,
      objects,
      visible: true,
      opacity: 1,
    };
  }

  /**
   * Get tile ID for terrain type
   */
  private getTileIdForTerrain(type: string): number {
    const tileMap: Record<string, number> = {
      plains: 1,
      forest: 2,
      mountain: 3,
      desert: 4,
      swamp: 5,
      tundra: 6,
      volcano: 7,
      ocean: 8,
    };
    return tileMap[type] || 1;
  }

  /**
   * Get default tilesets
   */
  private getDefaultTilesets(): TiledTileset[] {
    return [
      {
        firstgid: 1,
        source: 'tilesets/terrain.tsx',
        name: 'terrain',
      },
    ];
  }

  /**
   * Export map as JSON
   */
  exportMapJSON(width: number = 20, height: number = 20): string {
    const map = this.generateTiledMap(width, height);
    return JSON.stringify(map, null, 2);
  }
}

/**
 * RPG-JS Module Configuration
 */
export const MnemonicRealmsModule = {
  // Module will be populated with generated content
};
