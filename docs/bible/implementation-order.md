# Implementation Order — Phase 2

> Sequenced work plan for translating the game bible into a playable RPG-JS build.
> Each step lists what it produces, what it depends on, and which bible docs it consumes.

---

## Guiding Principles

1. **Vertical slice first.** Get a playable Act I before expanding. A thin, complete loop (walk → fight → quest → broadcast → vibrancy change) proves the architecture.
2. **Data before logic.** Define databases (items, enemies, skills) before writing the systems that consume them.
3. **Maps before events.** Tiled TMX maps must exist before RPG-JS events can be placed on them.
4. **Core systems before edge cases.** Combat, inventory, and quest state before subclasses, god recalls, and stagnation mechanics.
5. **GenAI pipeline in parallel.** Asset generation (`gen:full`) can run alongside code work — it only needs completed bible docs, which are done.

---

## Step 0: Pre-Implementation Housekeeping

**Depends on**: Phase 1 completion (this document)
**Produces**: Clean codebase ready for Phase 2

- [ ] Apply advisory fixes from `consistency-check.md` (A1-A5): update `classes.md`, `combat.md`, `memory-system.md`
- [ ] Run `pnpm gen:build` to regenerate asset manifests from updated bible docs
- [ ] Run `pnpm gen:full` to generate all 117 assets (tilesets, sprites, portraits, icons)
- [ ] Verify `pnpm build` still produces a working dist/
- [ ] Create Phase 2 PRD (`tasks/prd-phase2.json`) with user stories derived from this implementation order

---

## Step 1: Core Data Layer

**Depends on**: Step 0
**Produces**: TypeScript database files that all systems import
**Bible sources**: `items-catalog.md`, `enemies-catalog.md`, `skills-catalog.md`, `progression.md`, `combat.md`

| Task | Output File | Description |
|------|-------------|-------------|
| 1a | `main/server/database/items.ts` | All weapons (32), armor (14), consumables (24), key items (15), accessories (13) as RPG-JS `@Item` declarations |
| 1b | `main/server/database/enemies.ts` | All 33 regular enemies + 4 Preserver types as `@Actor` declarations with stat tables |
| 1c | `main/server/database/skills.ts` | All 28 base + 16 subclass + 9 companion skills as `@Skill` declarations with formulas |
| 1d | `main/server/database/classes.ts` | 4 classes with stat growth curves, equipment restrictions, skill unlock tables |
| 1e | `main/server/database/status-effects.ts` | 6 status effects (Poison, Stun, Slow, Weakness, Inspired, Stasis) with tick/cure logic |
| 1f | `main/server/database/memory-fragments.ts` | 11 named fragments + fragment schema (emotion × element × potency) |

**Rationale**: Every other system references items, enemies, or skills. Building the data layer first means combat, shops, drops, and quests can all import from a single source of truth.

---

## Step 2: Tiled Maps — Act I

**Depends on**: Step 0 (generated tilesets from `gen:full`)
**Produces**: TMX map files for all Act I zones
**Bible sources**: `overworld-layout.md`, `geography.md`, `tileset-spec.md`

| Task | Output File | Dimensions | Description |
|------|-------------|------------|-------------|
| 2a | `main/maps/village-hub.tmx` | 25×25 | Village Hub with all 15 buildings/landmarks |
| 2b | `main/maps/heartfield.tmx` | 40×40 | Pastoral zone with hamlet, windmill, stagnation clearing |
| 2c | `main/maps/ambergrove.tmx` | 40×40 | Forest zone with Hearthstone Circle, lake, woodcutter camp |
| 2d | `main/maps/millbrook.tmx` | 35×35 | River town with bridge, falls, fishing area |
| 2e | `main/maps/sunridge.tmx` | 35×35 | Highland with waystation, wind shrine, preserver outpost |
| 2f | Map transition events | — | Zone connections matching geography.md connectivity |

**Rationale**: Maps are the spatial foundation. NPC events, enemy encounters, and quest triggers all reference tile coordinates from `overworld-layout.md`.

---

## Step 3: Player & Combat System

**Depends on**: Steps 1, 2
**Produces**: Playable character movement + turn-based combat
**Bible sources**: `combat.md`, `progression.md`, `classes.md`, `skills-catalog.md`

| Task | Description |
|------|-------------|
| 3a | Player creation flow: class selection (Knight/Cleric/Mage/Rogue) with stat initialization from `progression.md` tables |
| 3b | RPG-JS turn-based combat engine: damage formulas (physical + magical), turn order by AGI, variance calculation |
| 3c | Status effect system: apply/tick/cure for all 6 statuses |
| 3d | Skill system: SP costs, level-gated availability, per-class skill trees |
| 3e | XP/leveling: `floor(8 * level^2 + 15 * level)` curve, stat growth per level, skill unlock triggers |
| 3f | Enemy AI: ability selection logic per enemy type (documented in `enemies-catalog.md` per-enemy) |
| 3g | Victory rewards: XP, gold, item drops (% roll), fragment drops (10%/50%/100%) |

**Rationale**: Combat is the core gameplay loop. Without it, quests can't reward XP, enemies can't guard areas, and boss encounters can't exist.

---

## Step 4: Inventory & Shop System

**Depends on**: Step 1 (data layer)
**Produces**: Equipment management, item use, shop UI
**Bible sources**: `items-catalog.md`, `ui-spec.md`, `overworld-layout.md` (shop locations)

| Task | Description |
|------|-------------|
| 4a | Inventory GUI: visual grid per `ui-spec.md`, separate tabs for equipment/consumables/key items/fragments |
| 4b | Equipment system: equip/unequip weapons and armor, stat recalculation |
| 4c | Consumable use: HP/SP restore, status cure, buff application |
| 4d | Shop system: buy/sell with gold, per-shop inventory lists from `overworld-layout.md` |
| 4e | Khali's General Shop (Village Hub), Hark's Blacksmith, specialty shops |

---

## Step 5: NPC Events & Dialogue — Act I

**Depends on**: Steps 2, 4
**Produces**: All Act I NPC interactions
**Bible sources**: `dialogue-bank.md`, `event-placement.md`, `overworld-layout.md`

| Task | Description |
|------|-------------|
| 5a | Wire all Village Hub NPCs: Artun (EV-VH-001), Hana (EV-VH-002), Khali (EV-VH-005), Hark (EV-VH-006), Nyro (EV-VH-007), Quest Board (EV-VH-008) |
| 5b | Wire Settled Lands NPCs: Farmer Gale, Lead Woodcutter, Fisher Tam, Waystation Keeper, Janik, Sera |
| 5c | Dialogue system: conditional text based on quest state, vibrancy level, items carried |
| 5d | Rest points: The Bright Hearth (inn), Ridgetop Waystation — full HP/SP restore |

---

## Step 6: Quest System & Act I Quests

**Depends on**: Steps 3, 5
**Produces**: Quest state machine + all Act I main and side quests
**Bible sources**: `quest-chains.md`, `act1-script.md`, `event-placement.md`

| Task | Description |
|------|-------------|
| 6a | Quest state engine: accept, track objectives, complete, reward. Quest Board UI per `ui-spec.md` |
| 6b | MQ-01: The Architect's Awakening — Artun intro, Hana gives K-01, tutorial |
| 6c | MQ-02: First Broadcast — Hana teaches memory ops, gives K-03, first broadcast tutorial |
| 6d | MQ-03: The Settled Lands — explore 4 zones, meet NPCs, side quest availability |
| 6e | MQ-04: The Stagnation — Heartfield stagnation event, Hana freezes, B-01 boss fight |
| 6f | SQ-01 through SQ-05: Village and Settled Lands side quests |
| 6g | Treasure chests: all CH-VH, CH-HF, CH-AG, CH-MB, CH-SR chests from `event-placement.md` |

---

## Step 7: Memory System

**Depends on**: Steps 1, 3, 6
**Produces**: Fragment collection, remix, broadcast mechanics
**Bible sources**: `memory-system.md`, `vibrancy-system.md`

| Task | Description |
|------|-------------|
| 7a | Fragment collection: pickup events, enemy drops, quest rewards. 5 emotions × 7 elements × 5 potencies |
| 7b | Fragment inventory GUI: visual grid with emotion/element/potency display per `ui-spec.md` |
| 7c | Remix system: combine 2-3 fragments, rules from `memory-system.md` §Remix |
| 7d | Broadcast system: target selection (NPC/location/stagnation/god/self), vibrancy calculation per `vibrancy-system.md` |
| 7e | Vibrancy tracking: per-zone 0-100 scores, tier thresholds (Muted/Normal/Vivid), visual tier swaps |

**Rationale**: Memory is the game's unique mechanic. Implementing it after basic combat/quests lets the player experience the full loop: fight → collect fragments → remix → broadcast → world brightens.

---

## Step 8: Vibrancy Visual System

**Depends on**: Steps 2, 7
**Produces**: Per-zone visual tier changes
**Bible sources**: `vibrancy-system.md`, `visual-direction.md`, `tileset-spec.md`

| Task | Description |
|------|-------------|
| 8a | Tile swap system: 3 tileset variants per zone (Muted/Normal/Vivid), swap based on vibrancy score |
| 8b | Ambient effects: particle systems (golden motes, color bloom) triggered by broadcast |
| 8c | Sky/lighting changes: per-zone ambient color shifts |
| 8d | NPC detail evolution: sprite/dialogue changes at tier thresholds |

---

## Step 9: Act I Boss + Stagnation Tutorial

**Depends on**: Steps 3, 6, 7
**Produces**: First stagnation zone + first boss encounter
**Bible sources**: `stagnation-zones.md`, `enemies-catalog.md` (B-01), `act1-script.md`

| Task | Description |
|------|-------------|
| 9a | Heartfield Stagnation Clearing: frozen zone visual, Preserver scout encounters |
| 9b | B-01 Stagnation Heart boss: multi-phase fight per `enemies-catalog.md` |
| 9c | Stagnation breaking mechanic: broadcast fragments to dissolve frozen tiles |
| 9d | MQ-04 climax: Hana freezes, emotional beat, player earns MF-03/MF-04 |

---

## Step 10: Tiled Maps — Act II (Frontier)

**Depends on**: Step 0 (generated tilesets)
**Produces**: TMX map files for all Frontier zones
**Bible sources**: `overworld-layout.md`, `geography.md`, `frontier-zones.md`

| Task | Output | Dimensions |
|------|--------|------------|
| 10a | `shimmer-marsh.tmx` | 50×50 |
| 10b | `hollow-ridge.tmx` | 50×50 |
| 10c | `flickerveil.tmx` | 50×50 |
| 10d | `resonance-fields.tmx` | 50×50 |
| 10e | Frontier transition events and zone connections |

---

## Step 11: Act II Systems

**Depends on**: Steps 3, 7, 10
**Produces**: Frontier-specific mechanics
**Bible sources**: `frontier-zones.md`, `dormant-gods.md`, `stagnation-zones.md`

| Task | Description |
|------|-------------|
| 11a | Painted detail effect: per-tile boolean tracking, broadcast radius spread |
| 11b | Frontier vibrancy gating: content unlocks at 34/50/67 thresholds per `frontier-zones.md` |
| 11c | Flickerveil flicker system: per-object timers, 3-state cycling, stabilization on broadcast |
| 11d | Resonance Fields audio system: per-stone chord type, proximity-based audio layers |
| 11e | Companion system: Hana (Act I), Artun (Act II), Nel (Act II) with companion AI |

---

## Step 12: God Recall System

**Depends on**: Steps 7, 11
**Produces**: 4 god shrines with recall mechanic
**Bible sources**: `dormant-gods.md`, `quest-chains.md` (GQ-01 through GQ-04)

| Task | Description |
|------|-------------|
| 12a | Shrine approach puzzles: K-04 Light Lens (Luminos), K-05 Kinetic Boots (Kinesis), emotion broadcast (Resonance/Verdance) |
| 12b | Recall ceremony: pedestal interaction, emotion selection (joy/fury/sorrow/awe), potency 3+ validation |
| 12c | World effect application: per-god, per-emotion world changes from `dormant-gods.md` |
| 12d | Subclass unlock: first recall determines Luminary (joy/awe) or Crucible (fury/sorrow) branch |
| 12e | GQ sub-quests: 8 per god (2 per emotion), reward key items and accessories |

---

## Step 13: Act II Quests & Events

**Depends on**: Steps 10, 11, 12
**Produces**: All Act II content
**Bible sources**: `act2-script.md`, `quest-chains.md`, `event-placement.md`, `dialogue-bank.md`

| Task | Description |
|------|-------------|
| 13a | MQ-05: Into the Frontier — zone unlocks, Artun joins party |
| 13b | MQ-06: Recall the First God — drives to any shrine |
| 13c | MQ-07: Grym's Endgame — Sketch borders open |
| 13d | SQ-06 through SQ-13: Frontier side quests |
| 13e | Frontier NPCs: Vash, Nel, Reza, Lead Audiomancer, Julz |
| 13f | Frontier stagnation zones: Stagnation Bog, Shattered Pass, Preserver Cathedral |
| 13g | All Frontier treasure chests (CH-SM, CH-HR, CH-FV, CH-RF series) |

---

## Step 14: Depths Dungeons

**Depends on**: Steps 1, 3, 8
**Produces**: All 5 Depths dungeon floors
**Bible sources**: `dungeon-depths.md`, `event-placement.md`

| Task | Description |
|------|-------------|
| 14a | Depths L1: Memory Cellar (5 rooms, Village Hub entrance) |
| 14b | Depths L2: Drowned Archive (7 rooms, Deepwater Sinkhole entrance, B-03a The Archivist) |
| 14c | Depths L3: Resonant Caverns (8 rooms, Echo Caverns entrance, B-03b The Resonant King) |
| 14d | Depths L4: The Songline (5 rooms, Singing Stones entrance, B-03c The Conductor) |
| 14e | Depths L5: The Deepest Memory (8 rooms, Sketch Passage entrance, B-03d The First Dreamer) |

---

## Step 15: Act III — Sketch Zones & Fortress

**Depends on**: Steps 10, 11, 14
**Produces**: Sketch zone maps + Preserver Fortress
**Bible sources**: `geography.md`, `frontier-zones.md`, `dungeon-depths.md`, `act3-script.md`

| Task | Output | Description |
|------|--------|-------------|
| 15a | `luminous-wastes.tmx` (40×40) | Sketch zone with grid-line terrain, Preserver Watchtower |
| 15b | `undrawn-peaks.tmx` (40×40) | Wireframe mountains, Crystalline Fortress Gate |
| 15c | `half-drawn-forest.tmx` (40×40) | Line-art canopy, Living Sketch, Archive of Intentions |
| 15d | Solidification mechanic | Per-tile boolean, collision layer updates in real-time |
| 15e | Fortress F1-F3 maps | Gallery of Moments, Archive of Perfection, First Memory Chamber |
| 15f | B-04a/B-04b/B-05 boss encounters | Fortress bosses + Grym dialogue encounter |

---

## Step 16: Act III Quests & Endgame

**Depends on**: Steps 13, 14, 15
**Produces**: Final act content
**Bible sources**: `act3-script.md`, `quest-chains.md`, `event-placement.md`

| Task | Description |
|------|-------------|
| 16a | MQ-08: Through the Sketch — zone exploration, solidification gameplay |
| 16b | MQ-09: The Preserver Fortress — 3-floor dungeon, boss sequence, Grym confrontation |
| 16c | MQ-10: The First Memory Remix — final ceremony, world bloom, ending |
| 16d | SQ-14: The Stagnation Breaker — Hana's liberation |
| 16e | Sketch treasure chests (CH-HF2 series) |
| 16f | Endgame bloom: all zones → Vivid tier, NPC evolutions, final ambient state |

---

## Step 17: Audio Integration

**Depends on**: Steps 8, 11 (vibrancy + frontier systems)
**Produces**: Full audio layer
**Bible sources**: `audio-direction.md`, `visual-direction.md`

| Task | Description |
|------|-------------|
| 17a | Per-zone BGM: 3 layers per zone (Muted/Normal/Vivid), crossfade on tier change |
| 17b | Combat music: standard, boss, Preserver variants |
| 17c | Ambient SFX: per-biome environmental sounds |
| 17d | Memory operation SFX: collection sparkle, remix swirl, broadcast wave |
| 17e | Resonance Fields dynamic audio: per-stone chord system, proximity mixing |

---

## Step 18: UI Polish

**Depends on**: All gameplay systems
**Produces**: Final GUI screens
**Bible sources**: `ui-spec.md`

| Task | Description |
|------|-------------|
| 18a | Main menu, save/load, settings |
| 18b | HUD: HP/SP bars, minimap, quest tracker |
| 18c | Battle UI: command menu, status display, damage numbers |
| 18d | Memory UI: fragment grid, remix interface, broadcast targeting |
| 18e | Mobile-first responsive layout per `ui-spec.md` |

---

## Step 19: Testing & Balance

**Depends on**: All steps
**Produces**: Validated, balanced playthrough

| Task | Description |
|------|-------------|
| 19a | Full playthrough test: Act I → II → III, all main quests |
| 19b | Damage curve validation: verify hits-to-kill targets from `enemies-catalog.md` design notes |
| 19c | Economy balance: gold income vs shop prices across progression |
| 19d | Memory balance: 40-60 fragments per playthrough, remix meaningful, broadcast impactful |
| 19e | God recall permutation testing: verify all 16 world-state combinations |
| 19f | Playwright E2E test suite expansion |

---

## Parallelism Opportunities

These steps can run concurrently:

| Parallel Track A | Parallel Track B | Notes |
|-----------------|-----------------|-------|
| Step 1 (Data Layer) | Step 2 (Act I Maps) | Data and maps have no dependency on each other |
| Step 10 (Act II Maps) | Steps 6-9 (Act I Content) | Map creation can proceed while Act I gameplay is wired |
| Step 14 (Depths Dungeons) | Step 13 (Act II Quests) | Dungeons are independent zones |
| Step 17 (Audio) | Steps 15-16 (Act III) | Audio integration is independent of map/quest wiring |
| GenAI pipeline (`gen:full`) | All code steps | Asset generation only needs bible docs (complete) |

---

## Estimated Scope

| Category | Count |
|----------|-------|
| TMX map files | 20 |
| Database entries | ~500 (items + enemies + skills + fragments) |
| NPC event scripts | ~50 named + ~20 ambient |
| Quest state machines | 28 (10 main + 14 side + 4 god base) |
| Boss encounter scripts | 9 |
| Treasure chest events | 54 |
| Vibrancy tier tilesets | 36 (12 zones × 3 tiers) |
| Audio tracks | ~40 (BGM layers + SFX) |
| GUI screens | ~12 |
