# Ralph Execution Plan: Mnemonic Realms v2.0 Game Bible

> **PRD Reference**: `tasks/prd-v2-macro.md`
> **Working PRD**: `tasks/prd.json` (20 user stories)
> **Existing Docs**: 9 docs already written in `docs/`
> **Status**: Starting fresh — iteration 1
> **Approach**: Content authoring — no code, all markdown
> **Max Iterations**: 25

---

## Design Philosophy

**Core theme**: Memory as Creative Vitality. The world is young and unfinished. Memory is an abundant, renewable resource that players actively generate, share, and amplify. The threat is stagnation (Preservers freezing change), not erasure.

**Genre**: JRPG. Authored content, not roguelike. One world, deeply crafted. Seed phrase buried internally — players never see it.

**Tone**: Adventurous wonder. Not tragic restoration. Not grimdark. Not chosen one.

---

## ALREADY WRITTEN (Seed Documents)

| Document | Status | Content |
|----------|--------|---------|
| `docs/world/core-theme.md` | DONE | Memory as Creative Vitality thesis |
| `docs/world/setting.md` | DONE | The Unfinished World, dissolved civs, geography overview |
| `docs/world/factions.md` | DONE | Architects, Preservers, Dissolved, Dormant Pantheon |
| `docs/story/structure.md` | DONE | Three-act JRPG arc |
| `docs/story/characters.md` | DONE | Lira, Callum, Curator, Resonance, player |
| `docs/design/classes.md` | DONE | Knight/Cleric/Mage/Rogue with memory twists |
| `docs/design/combat.md` | DONE | Turn-based system, damage formulas, status effects |
| `docs/design/memory-system.md` | DONE | Collect/Remix/Broadcast, Vibrancy meter |
| `docs/design/visual-direction.md` | DONE | Brightening palette, sprite style, UI, particles |

These are the foundation. All subsequent stories build on and cross-reference them.

---

## PHASE 1: World Foundation (Iterations 1-3) — PARALLEL

### Iteration 1: Geography (US-001)
**Output**: `docs/world/geography.md`
**Read first**: `docs/world/setting.md`
**Write**: Detailed zone specs — Village Hub, Settled Lands, Frontier, The Sketch, The Depths. Tile dimensions, biome types, landmarks, connections.

### Iteration 2: Vibrancy System (US-002)
**Output**: `docs/world/vibrancy-system.md`
**Read first**: `docs/design/memory-system.md`, `docs/design/visual-direction.md`
**Write**: Per-zone 0-100 scale, visual tier thresholds, tile swap rules, broadcast formula, decay mechanics, audio layers.

### Iteration 3: Dormant Gods (US-003)
**Output**: `docs/world/dormant-gods.md`
**Read first**: `docs/world/factions.md`
**Write**: Resonance, Verdance, Luminos, Kinesis — 4 gods × 4 recall options = 16 outcomes. Origin stories, locations, world effects.

**Parallelizable**: All three. No dependencies between them.

---

## PHASE 2: Systems + Act I (Iterations 4-6) — MIXED

### Iteration 4: Class Progression (US-009)
**Output**: `docs/design/progression.md`
**Read first**: `docs/design/classes.md`, `docs/design/combat.md`
**Write**: XP curves, stat tables per level per class, skill unlock schedules, level cap.
**PARALLEL with Iteration 5.**

### Iteration 5: Items Catalog (US-010)
**Output**: `docs/design/items-catalog.md`
**Read first**: `docs/design/combat.md`, `docs/design/classes.md`
**Write**: All weapons, armor, consumables, key items, memory fragments.
**PARALLEL with Iteration 4.**

### Iteration 6: Act I Script (US-004)
**Output**: `docs/story/act1-script.md`
**Read first**: `docs/world/geography.md` (from iter 1), `docs/story/structure.md`, `docs/story/characters.md`
**Write**: 10-15 scenes, full dialogue, tutorial integration, emotional arc.
**SEQUENTIAL — needs geography (iter 1) complete.**

---

## PHASE 3: Enemies + Skills + Act II (Iterations 7-10) — MIXED

### Iteration 7: Enemies Catalog (US-011)
**Output**: `docs/design/enemies-catalog.md`
**Depends on**: US-009 (player stats), US-010 (drop items), US-001 (zones)
**Write**: All enemies, bosses, Preserver agents. Stats, abilities, drops, spawns.

### Iteration 8: Skills Catalog (US-012)
**Output**: `docs/design/skills-catalog.md`
**Depends on**: US-009 (skill unlock schedule)
**Write**: Every skill per class with formulas, costs, level learned.
**PARALLEL with Iteration 7.**

### Iteration 9: Act II Script (US-005)
**Output**: `docs/story/act2-script.md`
**Depends on**: US-003 (dormant gods), US-004 (Act I)
**Write**: 15-20 scenes. God recalls, Preserver confrontations, moral dilemmas.
**SEQUENTIAL — needs gods and Act I.**

### Iteration 10: Act III Script (US-006)
**Output**: `docs/story/act3-script.md`
**Depends on**: US-005 (Act II)
**Write**: 10-15 scenes. The Sketch, Depths, Preserver fortress, ending.
**SEQUENTIAL — needs Act II.**

---

## PHASE 4: Art/Audio Specs + Dialogue (Iterations 11-14) — PARALLEL

### Iteration 11: Tileset Spec (US-013)
**Output**: `docs/design/tileset-spec.md`
**Depends on**: US-002 (vibrancy tiers)
**Write**: Tile-by-tile spec per biome per vibrancy level.

### Iteration 12: Spritesheet + Audio Spec (US-014)
**Output**: `docs/design/spritesheet-spec.md`, `docs/design/audio-direction.md`
**Depends on**: `docs/design/visual-direction.md`
**Write**: Sprite dimensions/frames, audio mood/style per zone.

### Iteration 13: UI Spec (US-015)
**Output**: `docs/design/ui-spec.md`
**Depends on**: US-002 (vibrancy HUD), US-009 (progression display)
**Write**: Wireframes for every GUI screen. Mobile-first.

### Iteration 14: Dialogue Bank + Quest Chains (US-007, US-008)
**Output**: `docs/story/dialogue-bank.md`, `docs/story/quest-chains.md`
**Depends on**: US-004/005/006 (all act scripts)
**Write**: Every NPC line organized by trigger. Every quest with objectives/rewards.
**Note**: Two stories combined into one iteration since dialogue feeds quest text.

**Parallelizable**: 11, 12, 13 all parallel. 14 sequential (needs act scripts).

---

## PHASE 5: Map Design (Iterations 15-18) — MIXED

### Iteration 15: Overworld Layout (US-016)
**Output**: `docs/maps/overworld-layout.md`
**Depends on**: US-001, US-008, US-011
**Write**: Full overworld map with zone boundaries, NPC positions, enemy spawns, event triggers.

### Iteration 16: Dungeon Layouts (US-017)
**Output**: `docs/maps/dungeon-depths.md`
**Depends on**: Same as 15
**Write**: All dungeon floors, god shrine dungeons, final dungeon.
**PARALLEL with Iteration 15.**

### Iteration 17: Stagnation + Frontier Zones (US-018)
**Output**: `docs/maps/stagnation-zones.md`, `docs/maps/frontier-zones.md`
**Depends on**: US-002, US-003
**Write**: Crystalline zone layouts, frontier transitions, puzzle specs.
**PARALLEL with 15, 16.**

### Iteration 18: Event Placement (US-019)
**Output**: `docs/maps/event-placement.md`
**Depends on**: US-016, US-017, US-018 (ALL maps)
**Write**: Master event table — every event with position, type, links.
**SEQUENTIAL — needs all map layouts.**

---

## PHASE 6: Integration (Iteration 19-20) — SEQUENTIAL

### Iteration 19: Master Index (US-020 part 1)
**Output**: `docs/bible/master-index.md`
**Depends on**: ALL previous
**Write**: Alphabetical cross-reference of every named entity across all docs.

### Iteration 20: Consistency Check + Implementation Order (US-020 part 2)
**Output**: `docs/bible/consistency-check.md`, `docs/bible/implementation-order.md`
**Depends on**: Iteration 19
**Write**: Verify zero contradictions. Order Phase 2 implementation.

---

## Dependency Graph

```
Iter 1 (Geography) ─────────┬── Iter 6 (Act I) ─── Iter 9 (Act II) ─── Iter 10 (Act III)
Iter 2 (Vibrancy) ──────────┤                                            │
Iter 3 (Gods) ──────────────┘                                            │
                                                                          │
Iter 4 (Progression) ──┬── Iter 7 (Enemies) ─┬── Iter 15 (Overworld) ──┤
Iter 5 (Items) ────────┘   Iter 8 (Skills) ──┤   Iter 16 (Dungeons) ───┤
                                               │   Iter 17 (Zones) ─────┤
Iter 11 (Tilesets) ────────────────────────────┤                         │
Iter 12 (Sprites/Audio) ──────────────────────┤   Iter 14 (Dialogue) ──┤
Iter 13 (UI) ──────────────────────────────────┤                         │
                                                │                         │
                                                └── Iter 18 (Events) ────┤
                                                                          │
                                                    Iter 19 (Index) ──── Iter 20 (Check)
```

Critical paths:
- Iters 1→6→9→10→14 (story pipeline)
- Iters 4→7→15→18 (systems→maps pipeline)
- Iters 1→2→11 (vibrancy→tilesets pipeline)

---

## Completion Promise

The Ralph loop is complete when ALL of the following are TRUE:
1. All 20 prd.json user stories have `passes: true`
2. Zero TBD markers across ALL `docs/` files
3. Zero dangling references (every named entity exists in its catalog)
4. `docs/bible/master-index.md` cross-references every NPC, location, item, quest, enemy, skill, and god
5. `docs/bible/consistency-check.md` confirms zero contradictions
6. `docs/bible/implementation-order.md` provides a clear sequence for Phase 2 (code translation)
