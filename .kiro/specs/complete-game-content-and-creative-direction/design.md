# Design Document: Complete Game Content and Creative Direction

## Overview

This design addresses the comprehensive validation, completion, and polish of all game content in Mnemonic Realms. The game has extensive existing implementation (25/42 enemies, all 20 maps, all 28 quests, 60+ dialogue files, complete equipment catalog) but requires systematic validation to ensure visual consistency, content completeness, and functional correctness across all systems.

The design focuses on four primary objectives:

1. **Visual Consistency Validation**: Automated tools to assess every map for visual alignment, sprite consistency, and tier correctness
2. **Content Completion**: Implementation of 17 missing enemies and verification of all 252 documented events
3. **Systematic Validation**: Tools to verify that documented content matches implementation across all categories
4. **Quality Assurance**: Comprehensive reporting on content completeness, visual issues, and functional gaps

This is NOT a from-scratch implementation. The design leverages existing systems (combat, quests, vibrancy, encounters) and focuses on validation tooling and gap-filling.

## Architecture

### System Components

The architecture consists of five primary validation systems and one implementation system:

```
┌─────────────────────────────────────────────────────────────┐
│                    Validation Orchestrator                   │
│                  (coordinates all validators)                │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Visual     │    │     Map      │    │   Content    │
│  Validator   │    │  Validator   │    │  Validator   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Sprite     │    │    Event     │    │    Enemy     │
│  Analyzer    │    │  Verifier    │    │ Implementer  │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Validation Flow


1. **Discovery Phase**: Scan project structure to identify all maps, sprites, enemies, events, and content files
2. **Parsing Phase**: Parse TMX files, sprite sheets, TypeScript implementations, and documentation
3. **Validation Phase**: Run validators to compare implementation against documentation
4. **Reporting Phase**: Generate structured reports with specific file paths, line numbers, and issue descriptions
5. **Implementation Phase**: Use reports to guide missing content implementation

### Technology Stack

- **TMX Parsing**: Use `tmx-parser` or `fast-xml-parser` to read Tiled map files
- **Image Analysis**: Use `sharp` or `jimp` for sprite sheet dimension validation
- **AST Parsing**: Use TypeScript compiler API to parse enemy/event implementations
- **Markdown Parsing**: Use `remark` to parse documentation files
- **Reporting**: Generate JSON, Markdown, and HTML reports

## Components and Interfaces

### 1. Visual Validator

**Purpose**: Analyze all maps for visual consistency, sprite alignment, and tier correctness.

**Input**:
- TMX map files from `main/server/maps/*.tmx`
- Sprite sheets from `assets/sprites/**/*.png`
- Visual tier documentation from `docs/design/visual-direction.md`
- Spritesheet specification from `docs/design/spritesheet-spec.md`

**Output**:
- Visual assessment report per map (JSON + Markdown)
- List of misaligned tiles with coordinates
- List of sprite tier mismatches
- Layer ordering issues

**Core Functions**:

```typescript
interface VisualValidator {
  // Analyze a single map for visual consistency
  analyzeMap(mapPath: string): MapVisualReport;
  
  // Check if sprite matches documented visual tier
  validateSpriteTier(sprite: SpriteReference, expectedTier: VisualTier): TierValidation;
  
  // Detect misaligned tiles
  detectMisalignedTiles(map: TMXMap): TileIssue[];
  
  // Verify layer ordering
  validateLayerOrder(map: TMXMap): LayerOrderIssue[];
  
  // Generate comprehensive visual report for all maps
  generateVisualReport(maps: string[]): VisualReport;
}

interface MapVisualReport {
  mapName: string;
  mapPath: string;
  issues: VisualIssue[];
  layerOrder: LayerInfo[];
  spriteReferences: SpriteReference[];
  tileAlignment: TileAlignmentStatus;
}

interface VisualIssue {
  type: 'misaligned_tile' | 'tier_mismatch' | 'layer_order' | 'missing_sprite';
  severity: 'error' | 'warning' | 'info';
  location: { x: number; y: number; layer?: string };
  description: string;
  expectedValue?: string;
  actualValue?: string;
}
```

**Algorithm**:


1. Parse TMX file to extract all layers (background, midground, foreground, collision)
2. For each tile layer:
   - Verify tiles are aligned to 16x16 grid
   - Check for visual inconsistencies (e.g., water tiles next to mountain tiles without transition)
   - Validate that collision layer matches visual obstacles
3. For each sprite reference in the map:
   - Extract sprite ID and position
   - Look up expected visual tier from map metadata
   - Verify sprite variant matches tier (muted/normal/vivid)
4. Verify layer z-order: background < midground < foreground < collision
5. Generate report with all issues found

### 2. Sprite Analyzer

**Purpose**: Document and validate all sprite sheets, including frame counts, dimensions, directions, and usage.

**Input**:
- Sprite PNG files from `assets/sprites/**/*.png`
- Sprite registration code from `main/client/characters/generated.ts`
- Spritesheet specification from `docs/design/spritesheet-spec.md`

**Output**:
- Comprehensive sprite documentation (JSON + Markdown)
- List of sprites missing required frames
- List of sprites with incorrect dimensions
- Map of sprite usage across all maps

**Core Functions**:

```typescript
interface SpriteAnalyzer {
  // Analyze a single sprite sheet
  analyzeSprite(spritePath: string): SpriteAnalysis;
  
  // Verify sprite has complete 4-direction walk cycle
  validateWalkCycle(sprite: SpriteAnalysis): WalkCycleValidation;
  
  // Document which maps use this sprite
  findSpriteUsage(spriteId: string, maps: TMXMap[]): SpriteUsage[];
  
  // Verify sprite directions match specification
  validateDirections(sprite: SpriteAnalysis, spec: SpriteSpec): DirectionValidation;
  
  // Generate comprehensive sprite documentation
  generateSpriteDocumentation(sprites: string[]): SpriteDocumentation;
  
  // Round-trip test: parse → generate → parse
  roundTripTest(sprite: SpriteAnalysis): boolean;
}

interface SpriteAnalysis {
  spriteId: string;
  filePath: string;
  dimensions: { width: number; height: number };
  frameSize: { width: number; height: number };
  gridLayout: { columns: number; rows: number };
  directions: DirectionInfo[];
  animations: AnimationInfo[];
  category: 'character' | 'npc' | 'enemy' | 'boss' | 'effect';
}

interface DirectionInfo {
  direction: 'down' | 'left' | 'right' | 'up';
  rowOffset: number;
  frameCount: number;
  complete: boolean;
}
```

**Algorithm**:

1. Load sprite PNG and extract dimensions
2. Calculate grid layout based on category (character: 4x31, small enemy: 4x8, etc.)
3. Verify frame size matches specification (16x16 for most, 96x96 for dragon boss)
4. For each direction:
   - Calculate expected row offset (down=0, left=N, right=2N, up=3N)
   - Verify 4 frames exist per direction
   - Check for missing or corrupted frames
5. Scan all TMX files to find sprite references
6. Generate documentation with all findings
7. Test round-trip: serialize analysis → parse → verify equivalence


### 3. Map Validator

**Purpose**: Verify map walkability, boundaries, collision layers, and transitions.

**Input**:
- TMX map files from `main/server/maps/*.tmx`
- Map transition documentation from `docs/maps/event-placement.md`
- Map layout documentation from `docs/maps/overworld-layout.md`

**Output**:
- Walkability report per map
- List of collision layer issues
- List of boundary problems
- Map transition validation results

**Core Functions**:

```typescript
interface MapValidator {
  // Verify collision layer prevents walking through obstacles
  validateCollisionLayer(map: TMXMap): CollisionIssue[];
  
  // Check for walkable tiles that visually appear as obstacles
  detectCollisionMismatches(map: TMXMap): CollisionMismatch[];
  
  // Verify map boundaries prevent walking off map
  validateBoundaries(map: TMXMap): BoundaryIssue[];
  
  // Confirm tile snapping works at boundaries
  validateTileSnapping(map: TMXMap): SnappingIssue[];
  
  // Verify all transitions are bidirectional where appropriate
  validateTransitions(transitions: TransitionDoc[]): TransitionIssue[];
  
  // Verify no maps are unreachable
  validateMapReachability(maps: TMXMap[], transitions: TransitionDoc[]): ReachabilityReport;
  
  // Generate walkability report
  generateWalkabilityReport(map: TMXMap): WalkabilityReport;
}

interface CollisionIssue {
  type: 'missing_collision' | 'incorrect_collision' | 'collision_mismatch';
  location: { x: number; y: number };
  description: string;
  visualTile: string;
  collisionValue: boolean;
}

interface TransitionIssue {
  transitionId: string;
  type: 'missing_reverse' | 'wrong_destination' | 'missing_prerequisite';
  sourceMap: string;
  destinationMap: string;
  description: string;
}
```

**Algorithm**:

1. Parse TMX collision layer
2. For each tile in visual layers:
   - Determine if tile visually appears as obstacle (wall, water, mountain)
   - Check if collision layer matches visual appearance
   - Report mismatches
3. Verify map boundaries:
   - Check that edge tiles have collision enabled
   - Verify no walkable tiles at map edges
4. For each documented transition:
   - Verify source event exists at documented coordinates
   - Verify destination map and coordinates are correct
   - If bidirectional, verify reverse transition exists
5. Build transition graph and verify all maps are reachable from Village Hub


### 4. Event Verifier

**Purpose**: Verify all 252 documented events are correctly placed and wired.

**Input**:
- Event placement documentation from `docs/maps/event-placement.md`
- TMX map files with event layers
- Event implementation files from `main/server/maps/events/*.ts`

**Output**:
- Event placement report per map
- List of missing events
- List of undocumented events
- Event wiring validation results

**Core Functions**:

```typescript
interface EventVerifier {
  // Verify NPC dialogue events are at documented coordinates
  verifyNPCEvents(map: TMXMap, docs: EventDoc[]): EventIssue[];
  
  // Verify treasure chests are at documented coordinates
  verifyTreasureChests(map: TMXMap, docs: EventDoc[]): EventIssue[];
  
  // Verify Resonance Stones are at documented coordinates
  verifyResonanceStones(map: TMXMap, docs: EventDoc[]): EventIssue[];
  
  // Verify map transitions are wired correctly
  verifyTransitions(map: TMXMap, docs: TransitionDoc[]): TransitionIssue[];
  
  // Verify cutscene events trigger at documented locations
  verifyCutscenes(map: TMXMap, docs: EventDoc[]): EventIssue[];
  
  // Report missing events
  findMissingEvents(map: TMXMap, docs: EventDoc[]): MissingEvent[];
  
  // Report undocumented events
  findUndocumentedEvents(map: TMXMap, docs: EventDoc[]): UndocumentedEvent[];
  
  // Generate comprehensive event report
  generateEventReport(maps: TMXMap[], docs: EventDoc[]): EventReport;
}

interface EventIssue {
  eventId: string;
  type: 'missing' | 'wrong_position' | 'wrong_trigger' | 'missing_dialogue' | 'wrong_reward';
  mapName: string;
  expectedPosition?: { x: number; y: number };
  actualPosition?: { x: number; y: number };
  description: string;
}

interface EventDoc {
  eventId: string;
  mapName: string;
  position: { x: number; y: number };
  trigger: 'touch' | 'action' | 'auto' | 'parallel';
  repeat: 'once' | 'repeat' | 'quest' | 'conditional';
  linkedQuest?: string;
  npc?: string;
  graphic?: string;
  description: string;
}
```

**Algorithm**:

1. Parse event placement documentation to build expected event list
2. For each map:
   - Parse TMX event layer to extract all events
   - Parse event implementation TypeScript files
3. For each documented event:
   - Search for event at documented coordinates
   - Verify event type matches (NPC, chest, stone, transition, cutscene)
   - Verify trigger type matches documentation
   - Verify event properties (dialogue file, reward, destination, etc.)
4. For each implemented event:
   - Check if event is documented
   - Report undocumented events
5. Generate report with all findings


### 5. Content Validator

**Purpose**: Verify all content (enemies, equipment, quests, dialogue, shops) matches documentation.

**Input**:
- Enemy catalog from `docs/design/enemies-catalog.md`
- Items catalog from `docs/design/items-catalog.md`
- Quest documentation from `docs/story/quest-chains.md`
- Dialogue files from `main/server/dialogue/**/*.ts`
- Shop configurations from `main/server/shops/*.ts`
- Enemy implementations from `main/database/enemies/*.ts`

**Output**:
- Content completeness report
- List of missing content
- List of stat mismatches
- List of orphaned files
- Overall completeness percentage

**Core Functions**:

```typescript
interface ContentValidator {
  // Verify enemy stats match catalog
  validateEnemyStats(enemy: EnemyImpl, catalog: EnemyCatalog): StatValidation;
  
  // Verify all enemies are implemented
  validateEnemyCompleteness(catalog: EnemyCatalog): CompletenessReport;
  
  // Verify equipment is obtainable
  validateEquipmentObtainability(equipment: EquipmentCatalog): ObtainabilityReport;
  
  // Verify quest chain accessibility
  validateQuestChain(quests: QuestDoc[]): QuestChainValidation;
  
  // Verify dialogue files are referenced
  validateDialogueReferences(dialogueFiles: string[], events: EventDoc[]): DialogueValidation;
  
  // Verify shop inventories match documentation
  validateShopInventories(shops: ShopImpl[], docs: ShopDoc[]): ShopValidation;
  
  // Verify boss encounters are reachable
  validateBossReachability(bosses: BossCatalog, quests: QuestDoc[]): ReachabilityReport;
  
  // Generate content completeness report
  generateCompletenessReport(): CompletenessReport;
}

interface CompletenessReport {
  totalItems: number;
  implementedItems: number;
  missingItems: string[];
  completenessPercentage: number;
  categories: {
    enemies: CategoryReport;
    equipment: CategoryReport;
    quests: CategoryReport;
    dialogue: CategoryReport;
    events: CategoryReport;
  };
}

interface StatValidation {
  enemyId: string;
  matches: boolean;
  mismatches: StatMismatch[];
}

interface StatMismatch {
  stat: string;
  expected: number | string;
  actual: number | string;
  filePath: string;
  lineNumber?: number;
}
```

**Algorithm**:

1. Parse all catalog documentation files
2. Parse all implementation files
3. For each catalog entry:
   - Find corresponding implementation
   - Compare all properties (stats, abilities, drops, etc.)
   - Report mismatches with file paths and line numbers
4. For each implementation:
   - Check if documented
   - Report undocumented implementations
5. Calculate completeness percentage per category
6. Generate comprehensive report


### 6. Enemy Implementer

**Purpose**: Implement the 17 missing enemies using catalog specifications.

**Input**:
- Enemy catalog from `docs/design/enemies-catalog.md`
- Existing enemy implementations as templates
- Sprite specifications from `docs/design/spritesheet-spec.md`

**Output**:
- TypeScript enemy implementation files
- Enemy registration in database
- Spawn zone configuration

**Core Functions**:

```typescript
interface EnemyImplementer {
  // Generate enemy implementation from catalog entry
  generateEnemyImplementation(catalogEntry: EnemyCatalogEntry): EnemyImplementation;
  
  // Create enemy TypeScript file
  createEnemyFile(enemy: EnemyImplementation, outputPath: string): void;
  
  // Register enemy in database
  registerEnemy(enemy: EnemyImplementation): void;
  
  // Configure spawn zones
  configureSpawnZones(enemy: EnemyImplementation, zones: string[]): void;
  
  // Validate generated implementation
  validateImplementation(enemy: EnemyImplementation, catalog: EnemyCatalogEntry): ValidationResult;
}

interface EnemyImplementation {
  id: string;
  name: string;
  stats: {
    hp: number;
    atk: number;
    int: number;
    def: number;
    agi: number;
    baseLevel: number;
  };
  abilities: Ability[];
  drops: {
    xp: number;
    gold: number;
    items: ItemDrop[];
  };
  fragmentAffinity: {
    emotion: string;
    element: string;
  };
  spawnZones: string[];
  spriteId: string;
}

interface Ability {
  name: string;
  type: 'physical' | 'magical' | 'buff' | 'debuff' | 'special';
  description: string;
  implementation: string; // TypeScript code
}
```

**Implementation Template**:

```typescript
// Template for generating enemy files
const enemyTemplate = `
import { Enemy } from '@rpgjs/database';

@Enemy({
  id: '{{id}}',
  name: '{{name}}',
  graphic: '{{spriteId}}',
  hp: {{hp}},
  atk: {{atk}},
  int: {{int}},
  def: {{def}},
  agi: {{agi}},
  level: {{baseLevel}},
  exp: {{xp}},
  gold: {{gold}},
  drop: [
    {{#each drops}}
    { item: '{{item}}', chance: {{chance}} },
    {{/each}}
  ],
  skills: [
    {{#each abilities}}
    '{{skillId}}',
    {{/each}}
  ]
})
export class {{className}} {}
`;
```

**Algorithm**:

1. Parse enemy catalog to extract missing enemy entries
2. For each missing enemy:
   - Extract all stats, abilities, drops from catalog
   - Generate TypeScript class using template
   - Create skill implementations for abilities
   - Write file to `main/database/enemies/`
3. Update enemy database index to register new enemies
4. Update spawn zone configurations in encounter system
5. Run Content Validator to verify implementation matches catalog


## Data Models

### Validation Report Schema

All validators produce reports following this schema:

```typescript
interface ValidationReport {
  reportType: 'visual' | 'map' | 'event' | 'content' | 'sprite';
  timestamp: string;
  summary: {
    totalChecks: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  issues: Issue[];
  metadata: {
    validator: string;
    version: string;
    duration: number; // milliseconds
  };
}

interface Issue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: string;
  description: string;
  location: {
    file: string;
    line?: number;
    column?: number;
    coordinates?: { x: number; y: number };
  };
  expected?: any;
  actual?: any;
  suggestion?: string;
}
```

### Enemy Catalog Entry Schema

```typescript
interface EnemyCatalogEntry {
  id: string; // e.g., "E-FR-08"
  name: string;
  spawnZone: string;
  flavor: string;
  stats: {
    hp: number;
    atk: number;
    int: number;
    def: number;
    agi: number;
    baseLevel: number;
  };
  abilities: AbilitySpec[];
  rewards: {
    xp: number;
    gold: number;
  };
  dropTable: ItemDrop[];
  fragmentAffinity: {
    emotion: string;
    element: string;
  };
}

interface AbilitySpec {
  name: string;
  description: string;
  type: 'physical' | 'magical' | 'buff' | 'debuff' | 'passive';
  formula?: string;
  effects?: string[];
  cooldown?: number;
  condition?: string;
}
```

### Event Documentation Schema

```typescript
interface EventDocumentation {
  eventId: string;
  mapName: string;
  position: { x: number; y: number };
  trigger: 'touch' | 'action' | 'auto' | 'parallel';
  repeat: 'once' | 'repeat' | 'quest' | 'conditional';
  category: 'npc' | 'chest' | 'stone' | 'transition' | 'cutscene' | 'puzzle' | 'boss' | 'ambient';
  properties: {
    npc?: string;
    graphic?: string;
    dialogue?: string;
    reward?: string;
    destination?: { map: string; x: number; y: number };
    linkedQuest?: string;
    condition?: string;
  };
  description: string;
}
```

### Sprite Analysis Schema

```typescript
interface SpriteDocumentation {
  spriteId: string;
  filePath: string;
  category: 'character' | 'npc' | 'enemy' | 'boss' | 'effect';
  dimensions: {
    width: number;
    height: number;
    frameWidth: number;
    frameHeight: number;
  };
  grid: {
    columns: number;
    rows: number;
    rowsPerDirection: number;
  };
  directions: {
    down: DirectionFrames;
    left: DirectionFrames;
    right: DirectionFrames;
    up: DirectionFrames;
  };
  animations: AnimationSpec[];
  usedInMaps: string[];
  variants: {
    muted?: string;
    normal?: string;
    vivid?: string;
  };
}

interface DirectionFrames {
  rowOffset: number;
  frameCount: number;
  complete: boolean;
  missingFrames?: number[];
}

interface AnimationSpec {
  name: string;
  frames: number[];
  timing: number[];
  loop: boolean;
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Map Visual Consistency

For any map in the game, running the Visual Validator should produce a report that identifies all visual inconsistencies, including sprite tier mismatches, misaligned tiles, and incorrect layer ordering.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

### Property 2: Sprite Documentation Round-Trip

For any sprite sheet, parsing the sprite data to generate documentation, then parsing that documentation again, should produce equivalent sprite metadata (frame counts, dimensions, directions).

**Validates: Requirements 2.6**

### Property 3: Sprite Completeness Validation

For any character or NPC sprite, the Sprite Analyzer should verify that all four directions (down, left, right, up) have complete 4-frame walk cycles, and report any missing frames.

**Validates: Requirements 2.1, 2.2, 2.3, 2.5**

### Property 4: Sprite Usage Documentation

For any sprite ID, the Sprite Analyzer should be able to determine which maps reference that sprite by scanning all TMX files.

**Validates: Requirements 2.4**

### Property 5: Collision Layer Consistency

For any map, the Map Validator should verify that tiles marked as non-walkable in the collision layer correspond to visual obstacles (walls, water, mountains), and report any mismatches.

**Validates: Requirements 3.1, 3.2**

### Property 6: Map Boundary Integrity

For any map, the Map Validator should verify that all edge tiles have collision enabled to prevent the player from walking off the map, and that tile snapping works correctly at all boundaries.

**Validates: Requirements 3.3, 3.4, 3.5**

### Property 7: Event Position Validation

For any documented event (NPC, chest, Resonance Stone, cutscene), the Event Verifier should verify that an event exists at the documented coordinates with the correct type and properties.

**Validates: Requirements 5.1, 5.2, 5.3, 5.5**

### Property 8: Map Transition Correctness

For any map transition, the Map Validator should verify that the transition places the player at the correct destination coordinates, and that bidirectional transitions have both directions properly wired.

**Validates: Requirements 5.4, 11.1, 11.2, 11.3**

### Property 9: Event Documentation Completeness

For any event found in a map's TMX file, the Event Verifier should either find corresponding documentation or report it as undocumented. Conversely, for any documented event, the verifier should either find it in the map or report it as missing.

**Validates: Requirements 5.6, 5.7**

### Property 10: Enemy Implementation Completeness

For any enemy in the enemies catalog, the Content Validator should verify that an implementation exists with stats, abilities, and drop tables matching the catalog documentation.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**

### Property 11: Encounter Zone Validation

For any spawn zone, the Content Validator should verify that the enemy groups configured for that zone match the documented enemy types and level ranges.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

### Property 12: Shop Content Validation

For any shop location, the Visual Validator should verify that the building has shop-specific visual indicators, the shop NPC is positioned inside, and the Content Validator should verify that the shop inventory matches documentation.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

### Property 13: Quest Chain Accessibility

For any quest in the quest chain, the Content Validator should verify that the quest becomes accessible when its prerequisites are met, and that all quests are reachable through normal gameplay progression.

**Validates: Requirements 9.1, 9.2, 9.3, 9.4**

### Property 14: Dialogue Reference Integrity

For any dialogue file, the Content Validator should verify that at least one event references it. For any event that references a dialogue file, the validator should verify that the file exists.

**Validates: Requirements 10.1, 10.2, 10.3**

### Property 15: Dialogue Tree Completeness

For any NPC with multiple dialogue states, the Content Validator should verify that all dialogue branches have proper endings and no dead ends exist.

**Validates: Requirements 10.4**

### Property 16: Boss Encounter Validation

For any boss in the boss catalog, the Content Validator should verify that the boss is implemented with correct stats and abilities, is reachable through quest progression, and has dialogue that triggers before and after combat.

**Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5**

### Property 17: Equipment Obtainability

For any equipment item (armor, weapon, consumable) in the items catalog, the Content Validator should verify that the item is obtainable through at least one source (shop, quest reward, or treasure chest).

**Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

### Property 18: Visual Tier Consistency

For any sprite that requires visual tier variants, the Visual Validator should verify that muted, normal, and vivid variants exist, and that sprites update correctly when the Vibrancy System changes tiers.

**Validates: Requirements 13.1, 13.2, 13.4**

### Property 19: Puzzle Mechanic Validation

For any puzzle in the puzzle catalog, the Content Validator should verify that the puzzle is implemented on the documented map, triggers the correct reward when solved, and checks prerequisites correctly.

**Validates: Requirements 15.1, 15.2, 15.3, 15.4**

### Property 20: NPC Placement and Behavior

For any named NPC, the Content Validator should verify that the NPC is placed on the documented map with the correct sprite, has all documented dialogue states accessible, and has interaction triggers that work at appropriate distances.

**Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5**

### Property 21: Treasure Distribution Validation

For any treasure chest, the Content Validator should verify that the chest contains the documented reward, follows the progression curve, and properly persists its opened state unless documented as respawning.

**Validates: Requirements 17.1, 17.2, 17.3, 17.4**

### Property 22: Resonance Stone Collection

For any Resonance Stone, the Content Validator should verify that the stone is placed at documented coordinates, grants the correct memory fragment when collected, updates quest progress where applicable, and persists collection state in save data.

**Validates: Requirements 18.1, 18.2, 18.3, 18.4**

### Property 23: Dungeon Progression Connectivity

For any dungeon (Depths or Fortress), the Map Validator should verify that all floors are connected in sequence, encounters match difficulty progression, and boss encounters are placed on correct floors.

**Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5**

### Property 24: Map Reachability

For any map in the game, the Map Validator should verify that the map is reachable from the starting location (Village Hub) through a chain of valid transitions.

**Validates: Requirements 11.5**

### Property 25: Validation Report Completeness

For any validation run, the Content Validator should generate reports that include specific file paths and line numbers for all identified issues, categorize content by type, list missing and incomplete content, and calculate an overall completeness percentage.

**Validates: Requirements 20.1, 20.2, 20.3, 20.4, 20.5, 20.6**


## Error Handling

### Validation Error Categories

1. **Parse Errors**: TMX files, TypeScript files, or documentation files that cannot be parsed
   - Strategy: Log error with file path, skip file, continue validation
   - Report: Include parse errors in final report with suggestions

2. **Missing Files**: Referenced files that don't exist (sprites, dialogue, maps)
   - Strategy: Report as critical error, continue validation
   - Report: List all missing files with references

3. **Schema Violations**: Data that doesn't match expected schema
   - Strategy: Report as error, attempt to continue with partial data
   - Report: Include schema violations with expected vs actual

4. **Validation Failures**: Content that doesn't match documentation
   - Strategy: Report as warning or error based on severity
   - Report: Include all mismatches with file paths and line numbers

### Error Recovery

```typescript
interface ErrorHandler {
  // Handle parse errors gracefully
  handleParseError(file: string, error: Error): ParseErrorReport;
  
  // Handle missing file references
  handleMissingFile(file: string, referencedBy: string[]): MissingFileReport;
  
  // Handle schema violations
  handleSchemaViolation(data: any, schema: Schema, file: string): SchemaViolationReport;
  
  // Aggregate all errors for final report
  aggregateErrors(): ErrorSummary;
}
```

### Validation Modes

1. **Strict Mode**: Fail fast on first critical error
   - Use for CI/CD pipelines
   - Exit code 1 if any errors found

2. **Permissive Mode**: Continue validation, report all issues
   - Use for development
   - Generate comprehensive report regardless of errors

3. **Fix Mode**: Attempt to auto-fix certain issues
   - Auto-align misaligned tiles
   - Auto-generate missing collision layers
   - Require confirmation before applying fixes

### Logging Strategy

```typescript
interface Logger {
  debug(message: string, context?: any): void;
  info(message: string, context?: any): void;
  warn(message: string, context?: any): void;
  error(message: string, context?: any): void;
  
  // Progress tracking for long-running validations
  progress(current: number, total: number, message: string): void;
}
```

All validators log to:
- Console (with color coding)
- Log file (`validation-{timestamp}.log`)
- Structured JSON log for parsing


## Testing Strategy

### Dual Testing Approach

This project requires both unit tests and property-based tests:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both are complementary and necessary for comprehensive coverage. Unit tests focus on specific scenarios and integration points, while property tests handle comprehensive input coverage through randomization.

### Unit Testing Focus

Unit tests should focus on:

1. **Specific Examples**:
   - Parsing a known-good TMX file produces expected structure
   - Validating a specific enemy implementation matches catalog
   - Verifying a specific event is at the correct coordinates

2. **Edge Cases**:
   - Empty maps
   - Maps with no events
   - Sprites with missing frames
   - Enemies with no abilities
   - Circular transition chains

3. **Error Conditions**:
   - Malformed TMX files
   - Missing sprite files
   - Invalid enemy stats (negative HP, etc.)
   - Broken dialogue references

4. **Integration Points**:
   - Visual Validator calling Sprite Analyzer
   - Event Verifier calling Map Validator
   - Content Validator aggregating all reports

### Property-Based Testing Focus

Property tests should focus on:

1. **Round-Trip Properties**:
   - Parse sprite → Generate doc → Parse doc = original metadata
   - Parse TMX → Modify → Serialize → Parse = equivalent structure

2. **Invariants**:
   - For all maps, collision layer dimensions match visual layer dimensions
   - For all sprites, frame count = columns × rows
   - For all enemies, HP > 0 and all stats >= 0

3. **Metamorphic Properties**:
   - For all maps, number of documented events >= number of implemented events
   - For all enemies, implemented abilities ⊆ documented abilities

4. **Validation Completeness**:
   - For all content categories, completeness percentage = (implemented / documented) × 100
   - For all validation reports, issues.length >= 0

### Property Test Configuration

Each property test must:
- Run minimum 100 iterations (due to randomization)
- Reference its design document property in a comment
- Use tag format: `// Feature: complete-game-content-and-creative-direction, Property {number}: {property_text}`

Example:

```typescript
// Feature: complete-game-content-and-creative-direction, Property 2: Sprite Documentation Round-Trip
test.prop([spriteArbitrary])('sprite documentation round-trip', (sprite) => {
  const doc = generateSpriteDocumentation(sprite);
  const parsed = parseSpriteDocumentation(doc);
  expect(parsed).toEqual(sprite);
});
```

### Test Organization

```
tests/
├── unit/
│   ├── visual-validator.test.ts
│   ├── sprite-analyzer.test.ts
│   ├── map-validator.test.ts
│   ├── event-verifier.test.ts
│   ├── content-validator.test.ts
│   └── enemy-implementer.test.ts
├── property/
│   ├── visual-properties.test.ts
│   ├── sprite-properties.test.ts
│   ├── map-properties.test.ts
│   ├── event-properties.test.ts
│   └── content-properties.test.ts
├── integration/
│   ├── full-validation.test.ts
│   └── enemy-implementation.test.ts
└── fixtures/
    ├── maps/
    ├── sprites/
    ├── enemies/
    └── documentation/
```

### Property-Based Testing Library

Use **fast-check** for TypeScript property-based testing:

```typescript
import fc from 'fast-check';

// Arbitrary for generating test sprites
const spriteArbitrary = fc.record({
  spriteId: fc.string(),
  dimensions: fc.record({
    width: fc.integer({ min: 64, max: 2304 }),
    height: fc.integer({ min: 64, max: 496 })
  }),
  frameSize: fc.record({
    width: fc.constant(16),
    height: fc.constant(16)
  }),
  directions: fc.array(fc.record({
    direction: fc.constantFrom('down', 'left', 'right', 'up'),
    frameCount: fc.constant(4),
    complete: fc.boolean()
  }), { minLength: 4, maxLength: 4 })
});

// Arbitrary for generating test maps
const mapArbitrary = fc.record({
  name: fc.string(),
  width: fc.integer({ min: 20, max: 100 }),
  height: fc.integer({ min: 20, max: 100 }),
  layers: fc.array(fc.record({
    name: fc.string(),
    type: fc.constantFrom('tilelayer', 'objectgroup'),
    data: fc.array(fc.integer({ min: 0, max: 1000 }))
  }), { minLength: 1, maxLength: 10 })
});
```

### Test Coverage Goals

- Unit test coverage: 80%+ for all validator modules
- Property test coverage: All 25 correctness properties implemented
- Integration test coverage: Full validation pipeline end-to-end
- Edge case coverage: All error conditions tested

### Continuous Integration

Validation tests run in CI:

```yaml
# .github/workflows/validation.yml
name: Content Validation
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm test:unit
      - run: pnpm test:property
      - run: pnpm validate:content --strict
```

Validation failures block merges to main branch.


## Implementation Approach

### Phase 1: Validation Infrastructure (Priority 1)

Build the core validation systems to assess current state:

1. **Visual Validator** (3-4 days)
   - TMX parser integration
   - Sprite tier detection
   - Tile alignment checker
   - Layer order validator
   - Report generator

2. **Sprite Analyzer** (2-3 days)
   - PNG dimension reader
   - Frame count validator
   - Direction completeness checker
   - Usage tracker across maps
   - Documentation generator

3. **Map Validator** (2-3 days)
   - Collision layer parser
   - Boundary checker
   - Transition validator
   - Reachability analyzer
   - Walkability reporter

4. **Event Verifier** (3-4 days)
   - Event documentation parser
   - TMX event layer parser
   - Position validator
   - Missing/undocumented detector
   - Comprehensive event reporter

5. **Content Validator** (4-5 days)
   - Catalog parsers (enemies, items, quests)
   - Implementation parsers (TypeScript AST)
   - Stat comparator
   - Completeness calculator
   - Master report generator

**Deliverable**: Complete validation suite that can assess all 20 maps, all sprites, all 252 events, and all content categories.

### Phase 2: Initial Validation Run (Priority 1)

Run all validators to generate baseline reports:

1. Execute full validation suite
2. Generate comprehensive reports (JSON + Markdown + HTML)
3. Review reports with user to prioritize fixes
4. Identify critical vs non-critical issues

**Deliverable**: Baseline validation reports showing current state of all content.

### Phase 3: Missing Enemy Implementation (Priority 2)

Implement the 17 missing enemies:

1. **Enemy Implementer Tool** (2 days)
   - Template generator
   - Catalog parser
   - File writer
   - Registration updater

2. **Enemy Implementation** (3-4 days)
   - Generate all 17 enemy files
   - Implement abilities as skills
   - Configure drop tables
   - Set up spawn zones
   - Validate against catalog

**Missing Enemies**:
- E-FR-08: Flicker Wisp
- E-FR-09: Sound Echo
- E-FR-10: Stone Guardian
- E-FR-11: Harmony Wraith
- E-SK-02: Void Wisp
- E-SK-03: Wireframe Drake
- E-SK-04: Sketch Wolf
- E-SK-05: Unfinished Treant
- E-SK-06: Memory Echo
- E-DP-03: Resonant Crystal
- E-DP-04: Songline Phantom
- E-PV-03: Preserver Captain
- E-PV-04: Preserver Archivist
- BO-02: Shrine Guardians (4 variants)
- BO-03a: The Archivist
- BO-03b: The Resonant King
- BO-03c: The Conductor
- BO-03d: The First Dreamer
- BO-04b: The Archive Keeper
- BO-05: Grym (dialogue only, no combat)

**Deliverable**: All 42 enemies implemented and validated.

### Phase 4: Visual Consistency Fixes (Priority 1)

Address visual issues identified in validation reports:

1. Review Visual Validator reports
2. Fix misaligned tiles
3. Correct sprite tier mismatches
4. Fix layer ordering issues
5. Add missing shop visual indicators
6. Re-run Visual Validator to confirm fixes

**Deliverable**: All maps pass visual consistency validation.

### Phase 5: Event Placement Verification (Priority 2)

Verify and fix all 252 events:

1. Review Event Verifier reports
2. Add missing events
3. Fix incorrectly positioned events
4. Remove undocumented events (or document them)
5. Verify all transitions work correctly
6. Re-run Event Verifier to confirm fixes

**Deliverable**: All 252 documented events correctly placed and functional.

### Phase 6: Content Completeness (Priority 3)

Address remaining content gaps:

1. Review Content Validator reports
2. Fix stat mismatches
3. Add missing dialogue references
4. Fix shop inventories
5. Verify quest chains
6. Ensure all equipment is obtainable
7. Re-run Content Validator to confirm fixes

**Deliverable**: 100% content completeness across all categories.

### Phase 7: Final Validation and Polish (Priority 3)

Final validation pass and polish:

1. Run full validation suite
2. Generate final reports
3. Address any remaining issues
4. Verify all 25 correctness properties pass
5. Generate content completeness certificate

**Deliverable**: Complete, validated, and polished game content.

### Development Tools

Create npm scripts for easy validation:

```json
{
  "scripts": {
    "validate:all": "node scripts/validate-all.js",
    "validate:visual": "node scripts/validate-visual.js",
    "validate:maps": "node scripts/validate-maps.js",
    "validate:events": "node scripts/validate-events.js",
    "validate:content": "node scripts/validate-content.js",
    "validate:sprites": "node scripts/validate-sprites.js",
    "implement:enemies": "node scripts/implement-enemies.js",
    "report:html": "node scripts/generate-html-report.js",
    "report:summary": "node scripts/generate-summary.js"
  }
}
```

### Validation CLI

Create a CLI tool for interactive validation:

```bash
# Run full validation
pnpm validate:all

# Run specific validator
pnpm validate:visual --map=village-hub

# Generate reports
pnpm report:html --output=reports/

# Implement missing enemies
pnpm implement:enemies --dry-run

# Fix mode (auto-fix certain issues)
pnpm validate:all --fix --confirm
```

### Report Formats

Generate reports in multiple formats:

1. **JSON**: Machine-readable, for CI/CD integration
2. **Markdown**: Human-readable, for documentation
3. **HTML**: Interactive, with filtering and search
4. **Summary**: Console output with color coding

Example HTML report structure:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Content Validation Report</title>
</head>
<body>
  <h1>Content Validation Report</h1>
  <div class="summary">
    <h2>Summary</h2>
    <p>Completeness: 95%</p>
    <p>Total Issues: 23</p>
    <p>Errors: 5 | Warnings: 18</p>
  </div>
  <div class="categories">
    <h2>By Category</h2>
    <ul>
      <li>Visual: 8 issues</li>
      <li>Maps: 3 issues</li>
      <li>Events: 7 issues</li>
      <li>Content: 5 issues</li>
    </ul>
  </div>
  <div class="issues">
    <h2>Issues</h2>
    <!-- Filterable, sortable table of issues -->
  </div>
</body>
</html>
```


## Technical Considerations

### Performance Optimization

Validation can be slow for large projects. Optimizations:

1. **Parallel Processing**: Run validators in parallel using worker threads
2. **Caching**: Cache parsed files to avoid re-parsing unchanged files
3. **Incremental Validation**: Only validate changed files in development
4. **Progress Reporting**: Show progress for long-running validations

```typescript
interface ValidationCache {
  // Cache parsed TMX files
  getCachedMap(path: string, mtime: number): TMXMap | null;
  setCachedMap(path: string, mtime: number, map: TMXMap): void;
  
  // Cache sprite analysis
  getCachedSprite(path: string, mtime: number): SpriteAnalysis | null;
  setCachedSprite(path: string, mtime: number, analysis: SpriteAnalysis): void;
  
  // Clear cache
  clear(): void;
}
```

### File System Organization

Validation outputs organized by timestamp:

```
validation-reports/
├── 2024-02-19-14-30-00/
│   ├── summary.json
│   ├── visual-report.json
│   ├── map-report.json
│   ├── event-report.json
│   ├── content-report.json
│   ├── sprite-report.json
│   ├── index.html
│   └── logs/
│       └── validation.log
├── 2024-02-19-15-45-00/
│   └── ...
└── latest -> 2024-02-19-15-45-00/
```

### Documentation Integration

Validators reference documentation files:

- `docs/design/enemies-catalog.md` → Enemy stats
- `docs/design/items-catalog.md` → Equipment stats
- `docs/design/spritesheet-spec.md` → Sprite specifications
- `docs/maps/event-placement.md` → Event positions
- `docs/story/quest-chains.md` → Quest prerequisites

Documentation format must be consistent and parseable. Use structured markdown with consistent headers and tables.

### Enemy Implementation Strategy

For the 17 missing enemies, use a template-based approach:

1. **Parse Catalog**: Extract enemy data from `enemies-catalog.md`
2. **Generate TypeScript**: Use template to create enemy class
3. **Generate Skills**: Create skill implementations for abilities
4. **Register**: Add to database index
5. **Configure Spawns**: Update encounter system

Example generated enemy file:

```typescript
// Generated from enemies-catalog.md: E-FR-08
import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-FR-08',
  name: 'Flicker Wisp',
  graphic: 'sprite-enemy-flicker-wisp',
  hp: 75,
  atk: 5,
  int: 24,
  def: 12,
  agi: 20,
  level: 13,
  exp: 70,
  gold: 30,
  drop: [
    { item: 'C-SP-02', chance: 0.20 }
  ],
  skills: ['flicker-wisp-prismatic-bolt', 'flicker-wisp-dazzle-flash'],
  fragmentAffinity: {
    emotion: 'awe',
    element: 'light'
  }
})
export class FlickerWisp {}
```

### Visual Tier System Integration

The Visual Validator must understand the vibrancy system:

- **Muted**: Desaturated, low contrast
- **Normal**: Standard colors
- **Vivid**: Saturated, high contrast

Sprites may have tier-specific variants:
- `sprite-player-knight-muted.png`
- `sprite-player-knight-normal.png`
- `sprite-player-knight-vivid.png`

Or use shader-based tier switching (check implementation).

### Map Transition Graph

Build a directed graph of map transitions to verify reachability:

```typescript
interface TransitionGraph {
  nodes: Map<string, MapNode>;
  edges: TransitionEdge[];
  
  // Add map to graph
  addMap(mapName: string): void;
  
  // Add transition between maps
  addTransition(from: string, to: string, bidirectional: boolean): void;
  
  // Check if map is reachable from start
  isReachable(mapName: string, startMap: string): boolean;
  
  // Find shortest path between maps
  findPath(from: string, to: string): string[];
  
  // Find unreachable maps
  findUnreachable(startMap: string): string[];
}
```

Use breadth-first search to verify all maps are reachable from Village Hub.

### Sprite Frame Validation

Validate sprite frames by:

1. Load PNG with image library
2. Calculate expected grid based on category
3. Extract each frame as sub-image
4. Check if frame is blank (all transparent pixels)
5. Report missing frames

```typescript
function validateSpriteFrames(spritePath: string, category: SpriteCategory): FrameValidation {
  const image = loadImage(spritePath);
  const { columns, rows, frameWidth, frameHeight } = getGridLayout(category);
  
  const missingFrames: number[] = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const frame = extractFrame(image, col, row, frameWidth, frameHeight);
      if (isBlank(frame)) {
        missingFrames.push(row * columns + col);
      }
    }
  }
  
  return {
    totalFrames: rows * columns,
    validFrames: rows * columns - missingFrames.length,
    missingFrames
  };
}
```

### Event Position Tolerance

When validating event positions, allow small tolerance (±1 tile) to account for documentation rounding:

```typescript
function positionsMatch(
  actual: { x: number; y: number },
  expected: { x: number; y: number },
  tolerance: number = 1
): boolean {
  return (
    Math.abs(actual.x - expected.x) <= tolerance &&
    Math.abs(actual.y - expected.y) <= tolerance
  );
}
```

### Collision Detection Algorithm

Validate collision by checking visual tile type:

```typescript
const OBSTACLE_TILES = [
  'wall', 'mountain', 'water', 'tree', 'rock', 'building'
];

function shouldHaveCollision(tileType: string): boolean {
  return OBSTACLE_TILES.some(obstacle => 
    tileType.toLowerCase().includes(obstacle)
  );
}

function validateCollision(map: TMXMap): CollisionIssue[] {
  const issues: CollisionIssue[] = [];
  
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const visualTile = getVisualTile(map, x, y);
      const hasCollision = getCollision(map, x, y);
      const shouldCollide = shouldHaveCollision(visualTile.type);
      
      if (shouldCollide && !hasCollision) {
        issues.push({
          type: 'missing_collision',
          location: { x, y },
          description: `Visual obstacle "${visualTile.type}" has no collision`,
          visualTile: visualTile.type,
          collisionValue: hasCollision
        });
      } else if (!shouldCollide && hasCollision) {
        issues.push({
          type: 'incorrect_collision',
          location: { x, y },
          description: `Walkable tile "${visualTile.type}" has collision`,
          visualTile: visualTile.type,
          collisionValue: hasCollision
        });
      }
    }
  }
  
  return issues;
}
```

### Documentation Parsing

Parse markdown documentation using remark:

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

function parseEnemyCatalog(markdownPath: string): EnemyCatalogEntry[] {
  const content = readFileSync(markdownPath, 'utf-8');
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(content);
  
  // Extract enemy entries from markdown AST
  const enemies: EnemyCatalogEntry[] = [];
  
  // Find tables with enemy stats
  visit(tree, 'table', (node) => {
    const enemy = parseEnemyTable(node);
    if (enemy) enemies.push(enemy);
  });
  
  return enemies;
}
```

### Validation Report Schema

All reports follow consistent schema for easy aggregation:

```typescript
interface ValidationReport {
  reportType: string;
  timestamp: string;
  summary: {
    totalChecks: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  issues: Issue[];
  metadata: {
    validator: string;
    version: string;
    duration: number;
  };
}
```

This allows combining reports from multiple validators into a master report.

