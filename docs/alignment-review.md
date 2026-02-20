# Alignment Review: v2 Creative Direction vs Codebase Reality

> Full audit of every file in `docs/`, `main/`, and project config against the v2 creative direction.
> Status: **34 docs reviewed, 8 source files reviewed, 3 config files reviewed.**
> Date: 2026-02-13

---

## Resolution Status

All 15 fixes (S1-S9, C1-C5) have been applied as of 2026-02-13.

---

## Executive Summary

The project is **strongly aligned** with the v2 creative direction. The bible docs (26+ files in `docs/`) are extensive, internally consistent, and faithfully express the v2 vision: authored JRPG, adventurous wonder tone, per-zone vibrancy, sympathetic antagonists, memory-as-creation theme.

The codebase (`main/`) is essentially a **skeleton** -- the old v1 procgen code has been completely removed, and only module entry points and one generated sprite remain. This is correct for the current phase (bible authoring complete, code implementation not yet started).

There are **8 stale references (all fixed)** across docs that needed updating, **5 editorial advisories** already identified by `consistency-check.md`, and **0 blocking contradictions**.

---

## STALE: References That Need Updating or Removing

### S1: `docs/story/characters.md` lines 51-58 -- "Procedural NPCs" Section

**Severity**: High (references removed v1 code)

The entire "Procedural NPCs" section references the old v1 ECS generation system:

```
In addition to named characters, the procedural generation system creates
village residents, frontier settlers, and dungeon denizens with:
- Seed-derived names (from NameGenerator)
- Personality-driven dialogue (from ECS PERSONALITY_TRAITS)
- Simple quest hooks (from QUEST_HOOK_TYPES)
```

`NameGenerator`, `PERSONALITY_TRAITS`, and `QUEST_HOOK_TYPES` were part of `main/generation/` which no longer exists. The v2 bible has a fully authored NPC roster (`dialogue-bank.md` has every line written) plus template-based "generic" NPCs (`dialogue-bank.md` Part 11) that use variable interpolation -- NOT ECS-driven procedural generation.

**Recommended fix**: Rewrite lines 51-58 to describe the v2 approach: 19 named NPCs with fully authored dialogue (see `dialogue-bank.md`), plus 6 template NPC archetypes with personality-keyed dialogue variants (see `dialogue-bank.md` Part 11, `spritesheet-spec.md` Section 3).

---

### S2: `docs/story/structure.md` line 5 -- "seed phrase controls RNG"

**Severity**: Medium (contradicts v2 seed-burying principle)

```
The seed phrase controls RNG (enemy drops, NPC dialogue variants, terrain details)
but not the story arc or major content.
```

In v2, seeds are buried internally (`Date.now()` or UUID) and never shown to the player. The phrase "seed phrase" implies player-visible input, which was the v1 design. The v2 `ui-spec.md:79` explicitly states: "No seed input -- seed is buried internally using `Date.now()`."

**Recommended fix**: Rewrite to: "An internal RNG seed (buried, never shown to the player) controls minor variance (enemy drops, NPC dialogue selection, terrain details) but not the story arc or major content."

---

### S3: `docs/story/structure.md` line 59 -- "seed phrase is just RNG"

**Severity**: Low (same issue as S2 but in a "What This Is NOT" list)

```
- The seed phrase is just RNG (like classic 16-bit RPGs), not a story element.
```

**Recommended fix**: Rewrite to: "An internal RNG seed drives minor variance. It is never exposed to the player."

---

### S4: `docs/story/act1-script.md` line 352 -- "seed-derived dialogue"

**Severity**: Low (implicit v1 reference)

```
4-5 farming families. Each NPC has seed-derived dialogue.
```

This casually references "seed-derived dialogue" for Heartfield NPCs. In v2, these NPCs have authored dialogue templates in `dialogue-bank.md`. The term "seed-derived" implies the old ECS generation pipeline.

**Recommended fix**: Replace "seed-derived dialogue" with "personality-variant dialogue" (per `dialogue-bank.md` template system).

---

### S5: `docs/story/dialogue-bank.md` line 1100 -- "ECS personality system" reference

**Severity**: Medium (references removed v1 system)

```
These templates generate dialogue for non-named NPCs. The RPG-JS implementation
fills {variables} from the ECS personality system (see characters.md).
```

The "ECS personality system" was the v1 `main/generation/ecs/` system which no longer exists. The v2 approach uses template variables filled from authored NPC properties, not an ECS.

**Recommended fix**: Replace "from the ECS personality system" with "from authored NPC personality properties" or simply "from the NPC's assigned personality type."

---

### S6: `docs/story/act2-script.md` line 31 -- STR stat in Artun's table

**Severity**: Low (editorial, same class as A1)

Artun's companion stat table uses `STR` instead of the canonical `ATK`:

```
| STR | Low (base 8, +1 per level) |
```

**Recommended fix**: Change `STR` to `ATK`.

---

### S7: `docs/design/combat.md` line 24 -- STR in basic attack description

**Severity**: Low (editorial)

```
Basic physical attack. Damage = STR - enemy DEF + weapon bonus + class modifier.
```

**Recommended fix**: Change `STR` to `ATK`.

---

### S8: `docs/design/ui-spec.md` lines 115, 479 -- STR in UI spec

**Severity**: Low (editorial)

Line 115: "4 mini-bars showing STR/INT/DEF/AGI relative strengths per class"
Line 479: "STR: 28  INT: 12  DEF: 22"

**Recommended fix**: Change `STR` to `ATK` in both locations.

---

### S9: `docs/design/items-catalog.md` line 261 -- STR in accessory description

**Severity**: Low (editorial)

```
| ACC-12 | **Tecton's Fist** | +15 STR. +15 DEF. ... |
```

**Recommended fix**: Change `STR` to `ATK`.

---

## CONFLICTS: Internal Contradictions Between Documents

### C1: Global vs Per-Zone Vibrancy (`memory-system.md` lines 60 vs 88)

**Already identified as**: Advisory A5 in `consistency-check.md`

Line 60: "The game tracks a global 'Vibrancy' meter based on total memories broadcast to the world."
Line 88: "Vibrancy is tracked per-zone, not globally."

**Canonical answer**: Per-zone (confirmed in `vibrancy-system.md`, `geography.md`, `frontier-zones.md`, all map docs).

**Fix**: Rewrite line 60 to say "per-zone vibrancy scores."

---

### C2: Inspired Duration -- 2 turns vs 3 turns (`combat.md` line 57 vs items/skills)

**Already identified as**: Advisory A4 in `consistency-check.md`

`combat.md:57` says 2 turns. `items-catalog.md` (Memory Incense) and `skills-catalog.md` (Emotional Resonance) say 3 turns.

**Canonical answer**: 3 turns.

**Fix**: Update `combat.md:57` from "2 turns" to "3 turns."

---

### C3: Stasis Missing from Status Effects Table (`combat.md` lines 51-57)

**Already identified as**: Advisory A3 in `consistency-check.md`

The formal status effects table lists 5 statuses but omits Stasis. Stasis is defined informally in `combat.md:80`, referenced by Preserver enemies in `enemies-catalog.md`, and curable by Stasis Breaker (C-SC-04) in `items-catalog.md`.

**Fix**: Add row to `combat.md` status table: "Stasis | Cannot act or use memory abilities | 2-3 turns | Stasis Breaker (C-SC-04), auto-recovers."

---

### C4: STR/DEX as Non-Canonical Stats (`classes.md` lines 24, 84)

**Already identified as**: Advisories A1, A2 in `consistency-check.md`

Line 24: "Stat Focus: STR, DEF" (Knight) -- STR should be ATK.
Line 84: "Stat Focus: AGI, DEX" (Rogue) -- DEX does not exist; AGI is already listed.

**Fix**: Line 24 to "ATK, DEF". Line 84 to "AGI" (single stat, highest of all classes).

---

### C5: Everwick Starting Vibrancy -- 50 vs 60

`geography.md` and `vibrancy-system.md` list Everwick starting vibrancy as **50**.
`overworld-layout.md` line 54 lists Everwick starting vibrancy as **60**.

Both cannot be correct.

**Fix**: Verify against `consistency-check.md` zone table (line 242 says 50). Use 50 as canonical. Update `overworld-layout.md` line 54 from 60 to 50.

---

## MISSING: Things v2 Requires That Don't Exist Yet

### M1: All Game Code (Expected -- Phase 2 Not Started)

The entire `main/` codebase is a skeleton:
- `main/server/index.ts` -- Empty `RpgServerModule` (no hooks, no maps, no events)
- `main/client/index.ts` -- Registers 1 spritesheet
- `main/client/characters/generated.ts` -- Only `PlayerWarriorSprite`
- `main/index.ts` -- Module entry point

All of the following are missing and expected to be built in Phase 2 (per `implementation-order.md`):
- Database layer (items, enemies, skills, classes, status effects, fragments)
- Tiled TMX maps (17 surface + 8 underground = 25 maps)
- Player creation and combat system
- Inventory and shop system
- Memory system (collect, remix, broadcast)
- Quest engine and NPC dialogue system
- Vibrancy rendering (3-tier tile swapping, particle effects)
- Companion system
- God recall system
- Subclass branching
- All GUI screens (title, HUD, combat, inventory, dialogue, quest log, memory collection)

**This is not a problem** -- the bible was Phase 1, code is Phase 2. The `implementation-order.md` has a clear 10-step build plan.

### M2: Phase 2 PRD

`implementation-order.md` Step 0 calls for creating `tasks/prd-phase2.json`. This does not exist yet.

### M3: Advisory Fixes from `consistency-check.md`

`implementation-order.md` Step 0 calls for applying advisories A1-A5. These are still open (this review adds more: S1-S9).

---

## ALIGNED: What's Correct and v2-Faithful

### Fully Aligned Documents (No Issues Found)

| Document | Status | Notes |
|----------|--------|-------|
| `docs/world/core-theme.md` | Aligned | Explicitly anti-roguelike, anti-grimdark, pro-authored |
| `docs/world/setting.md` | Aligned | Young/unfinished world, memory as building material |
| `docs/world/factions.md` | Aligned | Preservers as sympathetic, not evil |
| `docs/world/geography.md` | Aligned | All 17 maps specified with coordinates, enemies, vibrancy |
| `docs/world/vibrancy-system.md` | Aligned | Per-zone, three tiers, broadcast formula |
| `docs/world/dormant-gods.md` | Aligned | 4 gods, 4 emotions, 16 permutations |
| `docs/design/visual-direction.md` | Aligned | Brightening theme, anti-grimdark |
| `docs/design/progression.md` | Aligned | 4 classes, stat curves, subclass system |
| `docs/design/items-catalog.md` | Aligned (except S9) | Complete inventory, all IDs cross-reference |
| `docs/design/skills-catalog.md` | Aligned | 53 skills with exact formulas |
| `docs/design/enemies-catalog.md` | Aligned | 33+ enemies, stat tables, AI notes |
| `docs/design/tileset-spec.md` | Aligned | 32x32 tiles, 3 vibrancy tiers per biome |
| `docs/design/spritesheet-spec.md` | Aligned | All sprites spec'd |
| `docs/design/audio-direction.md` | Aligned | 4-layer vibrancy system, full BGM catalog |
| `docs/design/audio-pipeline-research.md` | Aligned | Technical research, no creative issues |
| `docs/design/ui-spec.md` | Aligned (except S8) | Mobile-first, buried seed confirmed at line 79 |
| `docs/design/e2e-governor.md` | Aligned | Yuka.js + Playwright spec |
| `docs/design/custom-effects-audit.md` | Aligned | PixiJS effects catalog for v2 |
| `docs/story/act1-script.md` | Aligned (except S4) | Fully authored 12-scene Act I |
| `docs/story/act2-script.md` | Aligned (except S6) | Fully authored 18-scene Act II |
| `docs/story/act3-script.md` | Aligned | Fully authored 12-scene Act III |
| `docs/story/quest-chains.md` | Aligned | All 28 quests with exact triggers/rewards |
| `docs/maps/overworld-layout.md` | Aligned (except C5) | All 17 maps with tile-level layout |
| `docs/maps/dungeon-depths.md` | Aligned | 8 dungeon floors fully spec'd |
| `docs/maps/stagnation-zones.md` | Aligned | 7 stagnation zones with break mechanics |
| `docs/maps/frontier-zones.md` | Aligned | Transition gradients, solidification mechanics |
| `docs/maps/event-placement.md` | Aligned | Every event across all maps cataloged |
| `docs/bible/master-index.md` | Aligned | ~500 entities cross-referenced |
| `docs/bible/consistency-check.md` | Aligned | 5 advisories, 0 blockers |
| `docs/bible/implementation-order.md` | Aligned | 10-step Phase 2 build plan |

### Fully Aligned Config/Code

| File | Status | Notes |
|------|--------|-------|
| `CLAUDE.md` | Aligned | Updated for v2, no stale procgen references |
| `rpg.toml` | Aligned | Minimal, clean |
| `package.json` | Aligned | v2 gen/ pipeline, proper dependencies |
| `main/index.ts` | Aligned | Clean module entry |
| `main/server/index.ts` | Aligned | Empty skeleton (expected for pre-Phase 2) |
| `main/client/index.ts` | Aligned | Registers generated sprites |

---

## RECOMMENDATIONS: Prioritized Action Items

### Priority 1: Fix Before Phase 2 Coding Begins

1. [FIXED] **Rewrite `characters.md` lines 51-58** (S1) -- Remove all references to NameGenerator, ECS PERSONALITY_TRAITS, QUEST_HOOK_TYPES. Replace with v2 template NPC system description.

2. [FIXED] **Rewrite `memory-system.md` line 60** (C1/A5) -- Change "global Vibrancy meter" to "per-zone vibrancy scores."

3. [FIXED] **Fix `combat.md` status table** (C3/A3) -- Add Stasis row.

4. [FIXED] **Fix `combat.md` Inspired duration** (C2/A4) -- Change 2 turns to 3 turns.

5. [FIXED] **Fix `overworld-layout.md` Everwick vibrancy** (C5) -- Change 60 to 50.

### Priority 2: Editorial Cleanup (Can Be Done Alongside Phase 2)

6. [FIXED] **Replace all STR references with ATK** -- Affects `classes.md:24`, `combat.md:24`, `act2-script.md:31`, `ui-spec.md:115,479`, `items-catalog.md:261`.

7. [FIXED] **Remove DEX reference** -- `classes.md:84`, change "AGI, DEX" to "AGI".

8. [FIXED] **Fix seed phrase wording** -- `structure.md:5,59`: replace "seed phrase" with "internal RNG seed" language.

9. [FIXED] **Fix act1-script.md:352** -- Replace "seed-derived dialogue" with "personality-variant dialogue."

10. [FIXED] **Fix dialogue-bank.md:1100** -- Replace "ECS personality system" with "authored NPC personality properties."

### Priority 3: Phase 2 Prep

11. **Create Phase 2 PRD** (`tasks/prd-phase2.json`) as specified in `implementation-order.md` Step 0.

12. **Generate assets** -- Run `pnpm gen:full` after doc fixes to ensure manifests reflect corrected content.

---

## Methodology

1. Used `Glob` to enumerate every file in `docs/`, `main/`, and project root.
2. Used `Read` to examine every document in full (34 docs, 8 source files, 3 config files).
3. Used `Grep` to search for stale terms across the entire project: `seed`, `procgen`, `procedural`, `roguelike`, `STR`, `DEX`, `global vibrancy`.
4. Cross-referenced every finding against the v2 creative direction principles documented in the project memory and `core-theme.md`.
5. Cross-referenced against `consistency-check.md` to avoid duplicating already-identified issues.
6. Verified that all stale references point to code/systems that no longer exist in the codebase.
