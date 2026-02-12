# Mnemonic Realms

RPG-JS Procedural Generator with deterministic seeded content generation using Entity Component System (ECS) architecture.

## Features

- 🎲 **Deterministic Procedural Generation** - Uses seedrandom for consistent, reproducible content from seed strings
- 🏗️ **ECS Architecture** - Built with ecsy for modular, component-based entity management
- 🎭 **AI Tooling** - Generates names, dialogue, and microstories procedurally
- ⚔️ **Class System** - Light/dark alignment with skill mastery system
- 🗺️ **Tiled Integration** - Exports RPG-JS compatible Tiled JSON maps with TSX/PNG tilesets
- 🌍 **Multiple Generators** - Terrain, rooms, NPCs, loot, and more
- 📦 **TypeScript** - Fully typed for excellent IDE support
- 🎨 **Biome** - Fast linting and formatting with Biome 2.3

## Installation

```bash
pnpm install
```

## Usage

### Quick Start

```typescript
import {
  ProceduralWorld,
  NameGenerator,
  DialogueGenerator,
  ProceduralMapGenerator
} from 'mnemonic-realms';

// Create a procedural world with ECS
const world = new ProceduralWorld();

// Generate a character from a seed (adjective adjective noun format)
const characterId = world.createCharacter('brave ancient warrior');
world.update();

// Export the character
const character = world.exportEntity(characterId);
console.log(character);

// Generate names
const nameGen = new NameGenerator('dark shadowy forest');
console.log(nameGen.generateCharacterWithTitle());

// Generate dialogue
const dialogueGen = new DialogueGenerator('wise old sage');
const dialogue = dialogueGen.generateRandomDialogue();
console.log(dialogue);

// Generate a Tiled map
const mapGen = new ProceduralMapGenerator('mystical enchanted realm');
const tiledMap = mapGen.generateTiledMap(20, 20);
```

### Seed Format

Seeds follow the pattern: **"adjective adjective noun"**

Examples:
- `"dark ancient forest"`
- `"bright holy temple"`
- `"frozen eternal mountain"`
- `"cursed forgotten ruins"`

### Available Generators

#### Name Generator
```typescript
const gen = new NameGenerator(seed);
gen.generateCharacterName();
gen.generateCharacterWithTitle();
gen.generatePlaceName();
gen.generateItemName('weapon');
```

#### Dialogue Generator
```typescript
const gen = new DialogueGenerator(seed);
gen.generateGreeting();
gen.generateQuestHook();
gen.generateDialogue('friendly');
```

#### Microstory Generator
```typescript
const gen = new MicrostoryGenerator(seed);
gen.generateSimpleStory();
gen.generateLocationStory();
gen.generateQuestBackstory();
gen.generateNPCBackstory();
```

#### Class Generator
```typescript
const gen = new ClassGenerator(seed);
const characterClass = gen.generateClass('light');
const classSystem = gen.generateClassSystem(9);
```

#### Terrain Generator
```typescript
const gen = new TerrainGenerator(seed);
const terrain = gen.generateTerrain();
const region = gen.generateRegion(5);
```

#### Room Generator
```typescript
const gen = new RoomGenerator(seed);
const room = gen.generateRoom();
const dungeon = gen.generateDungeon(10);
```

#### NPC Generator
```typescript
const gen = new NPCGenerator(seed);
const npc = gen.generateNPC();
```

#### Loot Generator
```typescript
const gen = new LootGenerator(seed);
const loot = gen.generateLoot(5);
const treasure = gen.generateTreasureChest();
```

## ECS Architecture

The project uses an Entity Component System with:

### Components
- Name, Description, Seed
- Alignment, Personality, Dialogue, Backstory
- CharacterClass, Skill, SkillMastery
- Terrain, Location, Room
- Item, Loot

### Systems
- NameGenerationSystem
- DialogueGenerationSystem
- BackstoryGenerationSystem
- ClassGenerationSystem
- DescriptionGenerationSystem

### Traits
Reusable component combinations:
- NPC Trait
- Character Trait
- Terrain Trait
- Room Trait
- Item Trait
- Loot Trait

## Development

### Build
```bash
pnpm build
```

### Lint
```bash
pnpm lint
pnpm lint:fix
```

### Format
```bash
pnpm format
```

### Run Examples
```bash
pnpm example
```

## CI/CD

GitHub Actions workflow automatically:
- Lints and builds the project
- Runs examples
- Deploys documentation to GitHub Pages

## License

ISC

## Contributing

Contributions are welcome! Please ensure your code passes linting and builds successfully.
