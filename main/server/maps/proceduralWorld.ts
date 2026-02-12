/**
 * Procedural World Map
 * Generates Tiled-compatible map from seed
 */

import { RpgMap, MapData } from '@rpgjs/server';
import { ProceduralWorld } from '../../../lib/ecs/world';
import { Terrain } from '../../../lib/ecs/components';

@MapData({
  id: 'proceduralWorld',
  name: 'Procedural World',
  file: require('./tmx/procedural.tmx'),
})
export class ProceduralWorldMap extends RpgMap {
  /**
   * Called when map is loaded
   * Generate procedural terrain
   */
  onLoad() {
    console.log('Procedural World Map loaded');
    this.generateProceduralTerrain();
  }

  /**
   * Generate procedural terrain from seed
   * Creates a 20x20 tile map with varied biomes
   */
  private generateProceduralTerrain() {
    const seed = 'brave ancient warrior'; // TODO: Get from player
    const world = new ProceduralWorld();
    
    const width = 20;
    const height = 20;
    
    // First pass: create all terrain entities
    const terrainIds: number[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cellSeed = `${seed}-${x}-${y}`;
        const terrainId = world.createTerrain(cellSeed, x, y);
        terrainIds.push(terrainId);
      }
    }
    
    // Batch update
    world.update();
    
    // Second pass: read terrain and apply to map
    for (let i = 0; i < terrainIds.length; i++) {
      const entity = world.getEntity(terrainIds[i]);
      if (!entity) continue;
      
      const terrainComp = entity.getComponent(Terrain as any);
      if (!terrainComp) continue;
      
      const x = i % width;
      const y = Math.floor(i / width);
      
      // Map terrain type to tile ID
      // This would normally reference your tileset
      const tileId = this.getTerrainTileId(terrainComp.type);
      
      // TODO: Use RPG-JS tile API to set tile
      // this.setTile(x, y, tileId);
      
      console.log(`Tile (${x},${y}): ${terrainComp.type}`);
    }
  }

  /**
   * Map terrain type to tile ID
   * This should reference your actual tileset
   */
  private getTerrainTileId(terrainType: string): number {
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
    return tileMap[terrainType] || 1;
  }
}
