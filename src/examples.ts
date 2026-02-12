/**
 * Example usage of Mnemonic Realms procedural generators
 */

import {
  ClassGenerator,
  DialogueGenerator,
  LootGenerator,
  MicrostoryGenerator,
  NameGenerator,
  NPCGenerator,
  ProceduralMapGenerator,
  ProceduralWorld,
  RoomGenerator,
  TerrainGenerator,
} from './index';

// Example seed: "adjective adjective noun" format
const exampleSeeds = [
  'dark ancient forest',
  'bright holy temple',
  'mysterious shadowy castle',
  'frozen eternal mountain',
  'cursed forgotten ruins',
];

function demonstrateGenerators() {
  console.log('=== Mnemonic Realms Procedural Generator Demo ===\n');

  for (const seed of exampleSeeds) {
    console.log(`\n--- Seed: "${seed}" ---\n`);

    // Name Generation
    const nameGen = new NameGenerator(seed);
    console.log('Character Name:', nameGen.generateCharacterWithTitle());
    console.log('Place Name:', nameGen.generatePlaceName());

    // Dialogue Generation
    const dialogueGen = new DialogueGenerator(seed);
    const dialogue = dialogueGen.generateRandomDialogue();
    console.log('\nDialogue (', dialogue.personality, '):');
    dialogue.lines.forEach((line) => {
      console.log('  ', line);
    });

    // Microstory Generation
    const storyGen = new MicrostoryGenerator(seed);
    console.log('\nMicrostory:', storyGen.generateSimpleStory());

    // Class Generation
    const classGen = new ClassGenerator(seed);
    const classes = classGen.generateClassSystem(3);
    console.log('\nGenerated Classes:');
    classes.forEach((cls) => {
      console.log(`  - ${cls.name} (${cls.alignment}): ${cls.description}`);
    });

    // Terrain Generation
    const terrainGen = new TerrainGenerator(seed);
    const terrain = terrainGen.generateTerrain();
    console.log('\nTerrain:', terrain.type, `(Difficulty: ${terrain.difficulty})`);
    console.log('  Resources:', terrain.resources.join(', '));

    // Room Generation
    const roomGen = new RoomGenerator(seed);
    const room = roomGen.generateRoom();
    console.log('\nRoom:', room.name, `(${room.type})`);
    console.log('  ', room.description);

    // NPC Generation
    const npcGen = new NPCGenerator(seed);
    const npc = npcGen.generateNPC();
    console.log('\nNPC:', npc.name, `(${npc.class})`);
    console.log('  Alignment:', npc.alignment);
    console.log('  ', npc.backstory);

    // Loot Generation
    const lootGen = new LootGenerator(seed);
    const loot = lootGen.generateLoot(5);
    console.log('\nLoot:');
    console.log('  Gold:', loot.gold);
    console.log('  Items:', loot.items.join(', '));

    console.log('\n' + '='.repeat(60));
  }
}

function demonstrateECS() {
  console.log('\n\n=== ECS World Demo ===\n');

  const world = new ProceduralWorld();
  const seed = 'brave ancient warrior';

  console.log(`Creating character with seed: "${seed}"`);
  const characterId = world.createCharacter(seed);
  world.update();

  const character = world.exportEntity(characterId);
  console.log('\nGenerated Character (ECS):');
  console.log(JSON.stringify(character, null, 2));
}

function demonstrateMapGeneration() {
  console.log('\n\n=== Tiled Map Generation Demo ===\n');

  const seed = 'mystical enchanted realm';
  const mapGen = new ProceduralMapGenerator(seed);

  console.log(`Generating map with seed: "${seed}"`);
  const mapJSON = mapGen.exportMapJSON(10, 10);

  console.log('\nGenerated Tiled Map (sample):');
  const map = JSON.parse(mapJSON);
  console.log(`  Size: ${map.width}x${map.height}`);
  console.log(`  Layers: ${map.layers.length}`);
  console.log(`  Tilesets: ${map.tilesets.length}`);
  console.log(
    `  Objects: ${map.layers.find((l: any) => l.type === 'objectgroup')?.objects?.length || 0}`,
  );
}

// Run demos
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateGenerators();
  demonstrateECS();
  demonstrateMapGeneration();
}

export { demonstrateECS, demonstrateGenerators, demonstrateMapGeneration };
