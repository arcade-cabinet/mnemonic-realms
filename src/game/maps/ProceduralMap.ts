/**
 * Dynamic Procedural Map Factory for RPG-JS
 * Generates complete Tiled JSON maps from seeds on-demand
 */

import { RpgMap, MapData, RpgPlayer } from '@rpgjs/server';
import { ProceduralMapGenerator } from '../../../module/tiledModule';
import { ProceduralWorld } from '../../../ecs/world';

/**
 * Create a dynamic map from seed - generates Tiled JSON on-the-fly
 */
export function createMapFromSeed(seed: string, width: number = 30, height: number = 30): any {
  console.log(`🗺️  Generating map from seed: "${seed}"`);
  
  const mapGen = new ProceduralMapGenerator(seed);
  const tiledMap = mapGen.generateTiledMap(width, height);
  
  // Return the complete Tiled JSON (RPG-JS will load it)
  return tiledMap;
}

/**
 * Dynamic Procedural Map Class
 * Loaded with JSON generated from seed
 */
@MapData({
  id: 'dynamic',
  file: {}, // Will be populated dynamically
  name: 'Procedural Realm',
})
export class DynamicProceduralMap extends RpgMap {
  private worldSeed: string = '';
  
  onLoad() {
    console.log('🌍 Dynamic procedural map loaded');
  }
  
  onJoin(player: RpgPlayer) {
    // Welcome message with seed info
    const seed = this.worldSeed || 'default seed';
    player.showText(`Welcome to the realm of "${seed}"! Your world awaits.`);
    
    // Generate NPCs from seed
    this.spawnProceduralNPCs(seed);
  }
  
  /**
   * Spawn NPCs based on world seed
   */
  private spawnProceduralNPCs(seed: string) {
    const world = new ProceduralWorld();
    
    // Generate 5-10 NPCs from seed
    const npcCount = Math.abs(this.hashSeed(seed)) % 6 + 5;
    
    for (let i = 0; i < npcCount; i++) {
      const npcSeed = `${seed}-npc-${i}`;
      const npcId = world.createCharacter(npcSeed);
      world.update();
      
      const npcData = world.exportEntity(npcId);
      
      if (npcData && npcData.Name) {
        // Spawn NPC in random location
        const x = (Math.abs(this.hashSeed(npcSeed + 'x')) % 25 + 2) * 32;
        const y = (Math.abs(this.hashSeed(npcSeed + 'y')) % 25 + 2) * 32;
        
        this.createDynamicEvent({
          x, y,
          name: npcData.Name.value,
          hitbox: { width: 32, height: 32 },
        });
      }
    }
  }
  
  /**
   * Simple hash for positioning
   */
  private hashSeed(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  
  /**
   * Set the world seed for this map instance
   */
  setWorldSeed(seed: string) {
    this.worldSeed = seed;
  }
}

/**
 * Map registry - dynamically created maps by seed
 */
export const mapRegistry = new Map<string, any>();

/**
 * Get or create a map for a given seed
 */
export function getMapForSeed(seed: string, width?: number, height?: number): any {
  const mapId = `map-${seed.replace(/\s+/g, '-')}`;
  
  if (!mapRegistry.has(mapId)) {
    const tiledJson = createMapFromSeed(seed, width, height);
    mapRegistry.set(mapId, {
      id: mapId,
      name: `World of ${seed}`,
      data: tiledJson,
      seed: seed,
    });
  }
  
  return mapRegistry.get(mapId);
}
