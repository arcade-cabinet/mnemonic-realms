# Mnemonic Realms v2.0 — Game Bible Fix Plan

> **PRD**: `tasks/prd.json` (20 user stories)
> **Execution Plan**: `tasks/ralph-execution-plan.md`
> **Phase**: 1 — Content Authoring (no code)

## Priority 1 — World Foundation (PARALLEL)

- [x] **US-001**: Write `docs/world/geography.md` — Detailed zone specs (Village Hub, Settled Lands, Frontier, Sketch, Depths) with tile dimensions, biomes, landmarks, connections
- [x] **US-002**: Write `docs/world/vibrancy-system.md` — Per-zone 0-100 scale, visual tier thresholds, tile swap rules, broadcast formula, decay/reinforcement, audio layers
- [x] **US-003**: Write `docs/world/dormant-gods.md` — 4 gods (Resonance/Verdance/Luminos/Kinesis), 4 recall options each (joy/fury/sorrow/awe), 16 outcomes with world effects

## Priority 2 — Systems + Act I (MIXED)

- [x] **US-009**: Write `docs/design/progression.md` — XP curves, stat growth tables per level per class, skill unlock schedules, level cap, subclass conditions
- [x] **US-010**: Write `docs/design/items-catalog.md` — All weapons (12+), armor (8+), consumables (8+), key items (5+), named memory fragments
- [ ] **US-004**: Write `docs/story/act1-script.md` — 10-15 scenes with full dialogue, tutorial integration, emotional arc (depends on US-001)

## Priority 3 — Enemies, Skills, Art Specs (MIXED)

- [ ] **US-011**: Write `docs/design/enemies-catalog.md` — Overworld (6+), dungeon (6+), Preserver agents (3+), bosses (4+), drop tables (depends on US-009, US-010)
- [ ] **US-012**: Write `docs/design/skills-catalog.md` — All skills per class with formulas, SP costs, level learned (depends on US-009)
- [ ] **US-013**: Write `docs/design/tileset-spec.md` — Tile-by-tile per biome per vibrancy level (depends on US-002)
- [ ] **US-014**: Write `docs/design/spritesheet-spec.md` + `docs/design/audio-direction.md` — Sprite dimensions/frames, audio mood per zone
- [ ] **US-015**: Write `docs/design/ui-spec.md` — Wireframes for every GUI screen, mobile-first

## Priority 4 — Act II, Act III, Dialogue (MIXED)

- [ ] **US-005**: Write `docs/story/act2-script.md` — 15-20 scenes, god recalls, moral dilemmas (depends on US-003, US-004)
- [ ] **US-006**: Write `docs/story/act3-script.md` — 10-15 scenes, Sketch/Depths/fortress, ending (depends on US-005)
- [ ] **US-007**: Write `docs/story/dialogue-bank.md` — All NPC dialogue organized by character and trigger

## Priority 5 — Quests + Maps (SEQUENTIAL)

- [ ] **US-008**: Write `docs/story/quest-chains.md` — Main quests (8-12), side quests (10+), god quests (4 chains) (depends on act scripts)
- [ ] **US-016**: Write `docs/maps/overworld-layout.md` — Full overworld with zones, NPCs, enemies, events (depends on US-001, US-008, US-011)
- [ ] **US-017**: Write `docs/maps/dungeon-depths.md` — All dungeon floors + god shrines + final dungeon
- [ ] **US-018**: Write `docs/maps/stagnation-zones.md` + `docs/maps/frontier-zones.md` — Crystalline zones, frontier transitions

## Priority 6 — Event Placement (SEQUENTIAL)

- [ ] **US-019**: Write `docs/maps/event-placement.md` — Master event table for all maps (depends on US-016, US-017, US-018)

## Priority 7 — Integration (SEQUENTIAL)

- [ ] **US-020**: Write `docs/bible/master-index.md` + `docs/bible/consistency-check.md` + `docs/bible/implementation-order.md` — Cross-reference index, verify zero contradictions, order Phase 2 work
