import { NextRequest, NextResponse } from 'next/server';
import { ProceduralWorld } from '@/lib/ecs/world';
import { NameGenerator } from '@/lib/generators/nameGenerator';
import { DialogueGenerator } from '@/lib/generators/dialogueGenerator';
import { MicrostoryGenerator } from '@/lib/generators/microstoryGenerator';
import { LootGenerator } from '@/lib/generators/lootGenerator';
import { TerrainGenerator } from '@/lib/generators/terrainGenerator';

export async function POST(request: NextRequest) {
  try {
    const { seed } = await request.json();
    
    if (!seed || typeof seed !== 'string') {
      return NextResponse.json(
        { error: 'Seed is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate seed format (3 words)
    const words = seed.trim().split(/\s+/);
    if (words.length !== 3) {
      return NextResponse.json(
        { error: 'Seed must contain exactly three words: "adjective adjective noun"' },
        { status: 400 }
      );
    }

    // Generate character using ECS
    const world = new ProceduralWorld();
    const charId = world.createCharacter(seed);
    world.update();
    const character = world.exportEntity(charId);

    // Generate location
    const locationId = world.createLocation(seed);
    world.update();
    const location = world.exportEntity(locationId);

    // Generate using standalone generators
    const nameGen = new NameGenerator(seed);
    const dialogueGen = new DialogueGenerator(seed);
    const microstoryGen = new MicrostoryGenerator(seed);
    const lootGen = new LootGenerator(seed);
    const terrainGen = new TerrainGenerator(seed);

    // Generate terrain map (10x10)
    const terrainMap: string[][] = [];
    for (let y = 0; y < 10; y++) {
      const row: string[] = [];
      for (let x = 0; x < 10; x++) {
        const terrain = terrainGen.generateTerrain();
        row.push(terrain.type);
      }
      terrainMap.push(row);
    }

    // Build response
    const response = {
      seed,
      character: {
        name: (character.Name as any)?.value || 'Unknown',
        class: (character.CharacterClass as any)?.name || 'Wanderer',
        alignment: (character.Alignment as any)?.type || 'neutral',
      },
      location: {
        place: (location.Name as any)?.value || 'Unknown Place',
        terrain: (location.Terrain as any)?.type || 'plains',
        difficulty: (location.Location as any)?.difficulty || 1,
      },
      dialogue: {
        text: dialogueGen.generateDialogue(),
        personality: (character.Personality as any)?.traits?.[0] || 'neutral',
      },
      microstory: {
        text: microstoryGen.generateMicrostory(),
      },
      loot: {
        gold: lootGen.generateGold(),
        items: [
          lootGen.generateItem(),
          lootGen.generateItem(),
          lootGen.generateItem(),
        ],
      },
      terrainMap,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
