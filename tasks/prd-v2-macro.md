# PRD: Mnemonic Realms v2.0 — Complete Game Bible

## Introduction

Mnemonic Realms v2.0 is a complete creative and technical overhaul. v1.0 delivered a working RPG-JS game loop with procedural generation. v2.0 replaces the generic RPG shell with a fully authored JRPG built around the "Memory as Creative Vitality" theme.

This macro PRD covers Phase 1: writing the complete game bible as markdown documentation. Phase 2 (code translation) has its own PRD.

## Goals

- Author a complete, internally consistent game world, story, and system design
- Document every authored element: locations, NPCs, enemies, items, quests, dialogue, maps
- Produce specs detailed enough for a fresh Claude Code instance (via Ralph) to translate each section into RPG-JS code without creative decisions
- Lock in all design decisions so no creative ambiguity remains for implementation

## Meso PRD Sections

Each section becomes its own meso PRD with micro user stories. The macro PRD defines what each section must contain and how they relate.

### Section 1: World Foundation (Sequential — must come first)
**PRD**: `tasks/prd-v2-world.md`
**Depends on**: Nothing (foundation layer)
**Outputs**:
- `docs/world/core-theme.md` — DONE (Memory as Creative Vitality)
- `docs/world/setting.md` — DONE (The Unfinished World)
- `docs/world/factions.md` — DONE (Architects, Preservers, Dissolved, Pantheon)
- `docs/world/geography.md` — Detailed map of all zones with tile-level specs
- `docs/world/vibrancy-system.md` — Per-zone vibrancy mechanics, visual thresholds, tile swap rules
- `docs/world/dormant-gods.md` — All 4 gods with recall options, world-state effects

### Section 2: Story & Characters (Sequential — depends on World)
**PRD**: `tasks/prd-v2-story.md`
**Depends on**: Section 1
**Outputs**:
- `docs/story/structure.md` — DONE (Three-act JRPG arc)
- `docs/story/characters.md` — DONE (Lira, Callum, Curator, Resonance)
- `docs/story/act1-script.md` — Complete scene-by-scene script for Act I
- `docs/story/act2-script.md` — Complete scene-by-scene script for Act II
- `docs/story/act3-script.md` — Complete scene-by-scene script for Act III
- `docs/story/dialogue-bank.md` — All NPC dialogue lines, organized by character and trigger
- `docs/story/quest-chains.md` — Every quest with triggers, objectives, rewards, dialogue

### Section 3: Game Systems (Parallel — independent of story specifics)
**PRD**: `tasks/prd-v2-systems.md`
**Depends on**: Section 1 (theme/factions), NOT Section 2
**Outputs**:
- `docs/design/classes.md` — DONE (Knight/Cleric/Mage/Rogue with memory twists)
- `docs/design/combat.md` — DONE (Turn-based system, formulas)
- `docs/design/memory-system.md` — DONE (Collect/Remix/Broadcast)
- `docs/design/progression.md` — XP curves, level-up stat tables, skill unlock schedule per class
- `docs/design/items-catalog.md` — Every item: weapons, armor, consumables, key items, memory fragments
- `docs/design/enemies-catalog.md` — Every enemy: stats, abilities, drop tables, spawn locations
- `docs/design/skills-catalog.md` — Every skill per class: damage formula, SP cost, level learned, animation

### Section 4: Visual & Audio Direction (Parallel — independent)
**PRD**: `tasks/prd-v2-visual.md`
**Depends on**: Section 1 (vibrancy system for palette rules)
**Outputs**:
- `docs/design/visual-direction.md` — DONE (Brightening palette, sprites, UI)
- `docs/design/tileset-spec.md` — Tile-by-tile spec for each biome at each vibrancy level
- `docs/design/spritesheet-spec.md` — Character/enemy sprite specs (dimensions, animation frames, color keys)
- `docs/design/audio-direction.md` — Music per zone/act, SFX catalog, vibrancy audio layers
- `docs/design/ui-spec.md` — Wireframes for every GUI screen (title, combat, inventory, memory, dialogue)

### Section 5: Map Design (Sequential — depends on World + Story + Enemies)
**PRD**: `tasks/prd-v2-maps.md`
**Depends on**: Sections 1, 2, 3
**Outputs**:
- `docs/maps/overworld-layout.md` — Zone-by-zone map with tile grid, NPC placements, enemy spawns, event triggers
- `docs/maps/village-hub.md` — Detailed hub village layout: buildings, shops, quest NPCs, paths
- `docs/maps/dungeon-depths.md` — Dungeon floor layouts: rooms, corridors, chests, boss arenas
- `docs/maps/stagnation-zones.md` — Preserver zones: crystalline tilesets, puzzle layouts, frozen NPCs
- `docs/maps/frontier-zones.md` — Frontier/Sketch areas: transition tiles, unfinished aesthetics
- `docs/maps/event-placement.md` — Every map event: position, trigger type, linked quest/dialogue

### Section 6: Integration & Cross-Reference (Sequential — depends on ALL above)
**PRD**: `tasks/prd-v2-integration.md`
**Depends on**: Sections 1-5
**Outputs**:
- `docs/bible/master-index.md` — Cross-reference index linking every entity across all docs
- `docs/bible/consistency-check.md` — Verified: no contradictions, no dangling references, no gaps
- `docs/bible/implementation-order.md` — Ordered list of what to build first for Phase 2

## Dependency Graph

```
Section 1 (World) ──────────┬── Section 2 (Story)
                             │
                             ├── Section 3 (Systems) ──┐
                             │                          │
                             ├── Section 4 (Visual)     ├── Section 5 (Maps)
                             │                          │
                             └──────────────────────────┘
                                                        │
                                                        └── Section 6 (Integration)
```

Parallelizable: Sections 3 + 4 can run simultaneously after Section 1 is done.
Sections 2 + 3 + 4 can overlap (2 depends on 1, but 3 and 4 only depend on 1).

## Non-Goals

- No code writing in Phase 1 — this is pure content authoring
- No GenAI sprite generation — that's Phase 3
- No RPG-JS implementation details — Phase 2 handles translation
- No save/load design — Phase 2 handles persistence
- No deployment/CI — already working from v1.0

## Success Criteria

Phase 1 is complete when:
1. Every output file listed above exists and is fully written
2. Master index cross-references every named entity (NPC, item, location, quest, enemy)
3. Consistency check passes — no contradictions between sections
4. A fresh Claude Code instance given any single doc can understand what to build without asking creative questions
5. All design decisions are locked — no "TBD" or "to be decided" markers remain
