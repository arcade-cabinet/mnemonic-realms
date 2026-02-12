/**
 * World cache service using Drizzle ORM
 * Caches procedurally generated content for fast retrieval
 */

import { eq } from 'drizzle-orm';
import { getDatabase, saveDatabase } from './index';
import { worlds, type NewWorld } from './schema';
import { ProceduralWorld } from '../ecs/world';

export interface GeneratedWorldData {
  seed: string;
  character: any;
  location: any;
  dialogue: any;
  loot: any;
  terrain: any[][];
  npcs: any[];
  timestamp: number;
}

/**
 * Get cached world data by seed
 * Returns null if not cached
 */
export async function getCachedWorld(seed: string): Promise<GeneratedWorldData | null> {
  const db = await getDatabase();
  
  const result = await db
    .select()
    .from(worlds)
    .where(eq(worlds.seed, seed))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  // Update last accessed timestamp
  await db
    .update(worlds)
    .set({ lastAccessedAt: new Date() })
    .where(eq(worlds.seed, seed));

  saveDatabase();

  return JSON.parse(result[0].generatedData);
}

/**
 * Cache generated world data
 */
export async function cacheWorld(worldData: GeneratedWorldData): Promise<void> {
  const db = await getDatabase();

  const newWorld: NewWorld = {
    seed: worldData.seed,
    generatedData: JSON.stringify(worldData),
  };

  try {
    // Try to insert new world
    await db.insert(worlds).values(newWorld);
  } catch (error) {
    // If seed already exists, update it
    await db
      .update(worlds)
      .set({
        generatedData: newWorld.generatedData,
        lastAccessedAt: new Date(),
      })
      .where(eq(worlds.seed, worldData.seed));
  }

  saveDatabase();
}

/**
 * Generate or retrieve cached world from seed
 * This is the main entry point for world generation with caching
 */
export async function getOrGenerateWorld(seed: string): Promise<GeneratedWorldData> {
  // Check cache first
  const cached = await getCachedWorld(seed);
  if (cached) {
    console.log(`✅ World "${seed}" loaded from cache`);
    return cached;
  }

  console.log(`🔄 Generating new world "${seed}"...`);

  // Generate new world using procedural generators
  const world = new ProceduralWorld();
  
  // Create character
  const charId = world.createCharacter(seed);
  world.update();
  const character = world.exportEntity(charId);

  // Create location
  const locId = world.createLocation(seed);
  world.update();
  const location = world.exportEntity(locId);

  // Generate terrain map (10x10 for performance)
  const terrain: any[][] = [];
  for (let y = 0; y < 10; y++) {
    const row = [];
    for (let x = 0; x < 10; x++) {
      const cellSeed = `${seed}-${x}-${y}`;
      const terrainId = world.createTerrain(cellSeed, x, y);
      world.update();
      const cell = world.exportEntity(terrainId);
      row.push(cell);
    }
    terrain.push(row);
  }

  // Generate NPCs (3 for demo)
  const npcs = [];
  for (let i = 0; i < 3; i++) {
    const npcSeed = `${seed}-npc-${i}`;
    const npcId = world.createCharacter(npcSeed);
    world.update();
    const npc = world.exportEntity(npcId);
    npcs.push(npc);
  }

  // Create composite world data
  const worldData: GeneratedWorldData = {
    seed,
    character,
    location,
    dialogue: character.Dialogue || {},
    loot: character.Item || {},
    terrain,
    npcs,
    timestamp: Date.now(),
  };

  // Cache for future use
  await cacheWorld(worldData);
  console.log(`✅ World "${seed}" generated and cached`);

  return worldData;
}

/**
 * List all cached worlds
 */
export async function listCachedWorlds(): Promise<Array<{ seed: string; createdAt: Date }>> {
  const db = await getDatabase();
  
  const result = await db
    .select({
      seed: worlds.seed,
      createdAt: worlds.createdAt,
    })
    .from(worlds)
    .orderBy(worlds.lastAccessedAt);

  return result;
}

/**
 * Delete cached world by seed
 */
export async function deleteCachedWorld(seed: string): Promise<void> {
  const db = await getDatabase();
  
  await db.delete(worlds).where(eq(worlds.seed, seed));
  saveDatabase();
}

/**
 * Clear all cached worlds
 */
export async function clearAllWorlds(): Promise<void> {
  const db = await getDatabase();
  
  await db.delete(worlds);
  saveDatabase();
}
