# Narrative-First Architecture

## The Problem

The design docs are organized by **Acts and Scenes** (the story), but the code was organized by **Maps** (the geography). This is backwards for a story-driven RPG. The story drives what maps are needed, not the other way around.

## The Structure: DDL-Driven Scene Architecture

The source of truth is **JSON DDL validated by Zod**. No TypeScript needed for scene definitions.

```
SOURCE (narrative-aligned, JSON DDL):
gen/schemas/ddl-scenes.ts        # Zod schema -- the contract for all scene data
gen/ddl/scenes/act1.json         # 12 scenes with assemblage refs, NPC pointers, effects
gen/ddl/scenes/act2.json         # 18 scenes
gen/ddl/scenes/act3.json         # 12 scenes
gen/ddl/maps/everwick.json       # Geographic specs (canvas, tilesets, connections)

PIPELINE:
gen/assemblage/parser/           # Markdown -> DDL parser
  act-script-parser.ts           # Reads docs/story/act{N}-script.md -> scene DDL JSON
gen/assemblage/compiler/         # DDL -> MapComposition compiler
  scene-compiler.ts              # Reads scene DDL + map DDL -> MapComposition objects
gen/assemblage/pipeline/         # MapComposition -> output files
  canvas.ts                      # Multi-layer stamp/path/border operations
  tmx-serializer.ts              # Canvas + palette -> TMX XML
  event-codegen.ts               # Objects + hooks -> TypeScript events

COMPILED OUTPUT (RPG-JS-aligned):
main/server/maps/everwick.ts     # Generated map class
main/server/maps/events/         # Generated event spawning
main/server/maps/tmx/            # Generated TMX files
gen/ddl/compiled/                # Scene metadata for E2E tests
```

## CLI Workflow

```bash
# Step 1: Parse act scripts -> scene DDL JSON (re-run when docs change)
pnpm assemblage parse all

# Step 2: Compile scene DDL -> TMX + events (re-run when DDL or assemblages change)
pnpm assemblage compile everwick

# Step 3: View scene coverage
pnpm assemblage scenes all        # List all maps and their scenes
pnpm assemblage scenes everwick   # Show scene details for one map

# Legacy: Build from TypeScript compositions (still works for existing maps)
pnpm assemblage build everwick
```

## Scene -> Map Relationship

Each scene specifies which map it takes place on. Multiple scenes can use the same map. The scene scripts in `main/server/events/act*/` contain the narrative logic (triggers, conditions, dialogue sequences). The map files just handle geography and event spawning.

| Act 1 Scene | Location | Map ID |
|------------|----------|--------|
| Scene 1: A Familiar Place | Everwick -- Elder's House | `everwick` |
| Scene 2: Memorial Garden | Everwick -- Memorial Garden | `everwick` |
| Scene 3: Training Ground | Everwick -- Training Ground | `everwick` |
| Scene 4: Hana's Workshop | Everwick -- Workshop | `everwick` |
| Scene 5: First Journey | Heartfield | `heartfield` |
| Scene 6: The Ancient Grove | Ambergrove | `ambergrove` |
| Scene 7: River Crossing | Millbrook | `millbrook` |
| Scene 8: The High Road | Sunridge | `sunridge` |
| Scene 9: Into the Depths | Memory Cellar | `depths-l1` |
| Scene 10: Return & Report | Everwick | `everwick` |
| Scene 11: The Clearing Grows | Heartfield | `heartfield` |
| Scene 12: New Resolve | Everwick -- Lookout Hill | `everwick` |

## Building Workflow (Scene-Driven)

For each act/scene in sequence:

1. **Read the scene script** in `docs/story/act{N}-script.md`
2. **Identify the map** the scene takes place on
3. **If the map doesn't exist yet**: Build it via assemblage system
   - Identify new/reusable assemblages needed
   - Create assemblage factories
   - Write the map composition
   - Generate: `pnpm assemblage build {map-id}`
4. **Review the scene's events/NPCs/dialogue** for creative quality
   - Fix placeholder names, generic dialogue, wireframe labels
   - Ensure NPC personalities match character docs
5. **Write the scene's Playwright E2E test** (see [scene-testing.md](./scene-testing.md))
6. **Run the AI player controller** through the scene
7. **Update progress** in [progress.md](./progress.md)
