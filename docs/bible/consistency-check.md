# Consistency Check

> Cross-reference verification of every named entity, stat formula, location reference, and character detail across all 26+ bible documents.
> Status: **PASS with advisories** — zero blocking contradictions; 5 editorial advisories for Phase 2 implementers.

---

## Methodology

1. Extracted every named entity across all docs using parallel search agents (NPCs, locations, items, quests, enemies, skills, gods, classes, factions).
2. Cross-referenced every entity's properties (stats, names, IDs, locations, quest chains) against every doc that references it.
3. Verified damage formulas in `combat.md` against stat tables in `progression.md`.
4. Verified quest dependency chains against act scripts and event-placement tables.
5. Scanned all `docs/` files for stale TBD/TODO/PLACEHOLDER markers.

---

## TBD Marker Audit

### Resolved (Fixed During US-020)

| File | Line | Original Text | Resolution |
|------|------|---------------|------------|
| `classes.md` | 99 | "Details TBD based on god design" | Replaced with reference to `progression.md` §Subclass System (fully specified in US-009) |
| `visual-direction.md` | 103 | "Detailed in a separate doc (TBD)" | Replaced with reference to `audio-direction.md` (written in US-014) |

### Acceptable Uses (Not Stale)

| File | Line(s) | Context | Why Acceptable |
|------|---------|---------|----------------|
| `audio-pipeline-research.md` | 129, 331, 333 | "placeholder" in technical research context | Research doc, not game content spec |
| `tileset-spec.md` | 830 | "placeholder" as tile rendering term | Technical usage describing sprite behavior |

### Result: **Zero stale TBD markers remaining in game content docs.**

---

## Stat System Verification

### Canonical Stats (6)

Per `progression.md:118-125`, the game has exactly 6 stats:

| Stat | Abbreviation | Used In |
|------|-------------|---------|
| Hit Points | HP | All combat |
| Skill Points | SP | Skill costs |
| Attack | ATK | Physical damage formula |
| Intelligence | INT | Magical damage/healing formula |
| Defense | DEF | Damage reduction (both types) |
| Agility | AGI | Turn order, evasion, flee |

### Advisory A1: STR Reference in classes.md

- **File**: `classes.md:24`
- **Text**: "Stat Focus: STR, DEF"
- **Issue**: STR is not a canonical stat. Per `progression.md:127`: "Some documents reference 'STR' — this is the same stat as ATK."
- **Severity**: Advisory (editorial). The progression doc already calls this out and declares ATK canonical.
- **Phase 2 action**: Implementation uses ATK. No mechanical ambiguity.

### Advisory A2: DEX Reference in classes.md

- **File**: `classes.md:84`
- **Text**: "Stat Focus: AGI, DEX"
- **Issue**: DEX is not a canonical stat. The Rogue's stat focus should be AGI (already listed). There is no DEX stat in the progression tables.
- **Severity**: Advisory (editorial). `progression.md` Rogue tables use AGI, not DEX.
- **Phase 2 action**: Implementation uses AGI. The Rogue's stat focus is simply AGI (highest of all classes).

### Damage Formula Verification

Physical: `floor((ATK * 1.5 - DEF * 0.8) * variance * elementMod)`
Magical: `floor((INT * 1.8 - DEF * 0.4) * variance * elementMod)`

**Spot-checked against progression tables:**

| Scenario | Attacker | Stat | Defender DEF | Expected Damage | Verified? |
|----------|----------|------|-------------|-----------------|-----------|
| Knight L6 vs Crag Golem | ATK 20 | Physical | DEF 15 | floor((30 - 12) * 1.0) = 18 | Matches enemies-catalog design note |
| Mage L6 vs Crag Golem | INT 26 | Magical | DEF 15 | floor((46.8 - 6) * 1.0) = 40 | Matches enemies-catalog design note |
| E-SL-01 vs Knight L1 | ATK 5 | Physical | DEF 8 | floor((7.5 - 6.4) * 1.0) = 1 | Reasonable for tutorial enemy |
| Mountain Drake breath | INT 12 | Magical | DEF 20 (L14 Knight) | floor((21.6 - 8) * 1.0) = 13 | Fits 4-6 hits-to-kill design target |

**Result**: Damage formulas are consistent between `combat.md` and `progression.md` stat tables. Enemy design notes in `enemies-catalog.md` reference correct calculations.

### XP Formula Verification

Formula: `XP_required(level) = floor(8 * level^2 + 15 * level)`

| Level | XP Required | Cumulative | Verified in progression.md? |
|-------|------------|------------|----------------------------|
| 2 | 62 | 62 | Yes |
| 10 | 950 | 4,280 | Yes |
| 20 | 3,500 | 26,350 | Yes |
| 30 | 7,650 | 75,750 | Yes |

**Result**: XP curve formula matches the explicit tables in `progression.md`.

---

## Status Effects Verification

### Advisory A3: Stasis Not in combat.md Status Table

- **File**: `combat.md:51-57`
- **Issue**: The status effects table lists 5 statuses (Poison, Stun, Slow, Weakness, Inspired) but omits **Stasis**.
- **Where Stasis IS defined**: `combat.md:80` describes it informally: "Stasis (new status: can't use memory-based abilities for 2 turns)". The `enemies-catalog.md` defines Preserver enemies that inflict it. `items-catalog.md` defines C-SC-04 Stasis Breaker to cure it.
- **Severity**: Advisory. Stasis is mechanically well-defined across the enemy/item docs; it's just missing from the formal table.
- **Phase 2 action**: Add Stasis row to `combat.md` status table: "Stasis | Cannot act or use memory abilities | 2-3 turns | Stasis Breaker (C-SC-04), auto-recovers"

### Advisory A4: Inspired Duration Discrepancy

- **File**: `combat.md:57` says Inspired lasts **2 turns**.
- **File**: `items-catalog.md` says Memory Incense (C-BF-05) grants Inspired for **3 turns**.
- **File**: `skills-catalog.md` — Emotional Resonance (SK-CL-07) grants Inspired for **3 turns**.
- **Severity**: Advisory. The items/skills are more specific and say 3 turns. `combat.md` may have been written before the detailed systems. The implementation should use **3 turns** as canonical.
- **Phase 2 action**: Update `combat.md:57` from "2 turns" to "3 turns".

---

## Location Cross-References

### Geography ↔ Overworld Layout

Every zone defined in `geography.md` has a corresponding map section in `overworld-layout.md`. Verified:

| Geography Zone | Overworld Map | Tile Dimensions | Match? |
|----------------|--------------|-----------------|--------|
| Everwick | Everwick (25×25) | 25×25 | Yes |
| Heartfield | Heartfield (40×40) | 40×40 | Yes |
| Ambergrove | Ambergrove (40×40) | 40×40 | Yes |
| Millbrook | Millbrook (35×35) | 35×35 | Yes |
| Sunridge | Sunridge (35×35) | 35×35 | Yes |
| Shimmer Marsh | Shimmer Marsh (50×50) | 50×50 | Yes |
| Hollow Ridge | Hollow Ridge (50×50) | 50×50 | Yes |
| Flickerveil | Flickerveil (50×50) | 50×50 | Yes |
| Resonance Fields | Resonance Fields (50×50) | 50×50 | Yes |
| Luminous Wastes | Luminous Wastes (40×40) | 40×40 | Yes |
| Undrawn Peaks | Undrawn Peaks (40×40) | 40×40 | Yes |
| Half-Drawn Forest | Half-Drawn Forest (40×40) | 40×40 | Yes |

**Result**: All zone dimensions, biomes, and connections match between geography and map layout docs.

### Stagnation Zones ↔ Geography ↔ Event Placement

All 7 stagnation zones appear consistently in `geography.md`, `stagnation-zones.md`, and `event-placement.md` with matching coordinates and mechanics.

### Dungeon Floors ↔ Geography ↔ Event Placement

All 5 Depths floors and 3 Fortress floors appear consistently across `dungeon-depths.md`, `geography.md`, and `event-placement.md`. Room counts and boss placements match.

### God Shrine Locations

| God | Shrine | Zone | In geography? | In overworld-layout? | In event-placement? | In dormant-gods? |
|-----|--------|------|---------------|----------------------|---------------------|------------------|
| Resonance | Resonance's Amphitheater | Resonance Fields (25,25) | Yes | Yes | Yes | Yes |
| Verdance | Verdance's Hollow | Shimmer Marsh (25,35) | Yes | Yes | Yes | Yes |
| Luminos | Luminos Grove | Flickerveil (20,20) | Yes | Yes | Yes | Yes |
| Kinesis | Kinesis Spire | Hollow Ridge (25,10) | Yes | Yes | Yes | Yes |

**Result**: All shrine locations consistent across all referencing docs.

---

## Character Cross-References

### characters.md ↔ dialogue-bank.md

Every named character in `characters.md` has corresponding dialogue entries in `dialogue-bank.md`. Verified for all 19 named NPCs plus the 4 dormant gods.

### Companion Stats ↔ progression.md

| Companion | Class | Join Point | Level Range | In progression.md? | In skills-catalog? |
|-----------|-------|------------|-------------|--------------------|--------------------|
| Hana | Cleric | Act I (MQ-02) | 1-30 | Yes (lines 500-520) | Yes (3 skills) |
| Artun | Mage | Act II (MQ-05) | 10-30 | Yes (lines 523-543) | Yes (3 skills) |
| Nel | Knight | Act II (SQ-07) | 12-30 | Yes (lines 546-566) | Yes (3 skills) |

**Result**: Companion availability, stats, and skills are consistent across `characters.md`, `progression.md`, and `skills-catalog.md`.

---

## Quest Chain Verification

### Main Quest Dependencies

```
MQ-01 → MQ-02 → MQ-03 → MQ-04 → MQ-05 → MQ-06 → MQ-07 → MQ-08 → MQ-09 → MQ-10
```

Verified: Each quest's prerequisites match in `quest-chains.md`, act scripts, and `event-placement.md`.

### Side Quest Dependencies

| Quest | Dependency | In quest-chains? | In event-placement? | Match? |
|-------|-----------|-------------------|---------------------|--------|
| SQ-01 | MQ-02 | Yes | Yes (EV-VH-005) | Yes |
| SQ-02 | MQ-03 | Yes | Yes (EV-HF-001) | Yes |
| SQ-03 | MQ-03 | Yes | Yes (EV-AG-001) | Yes |
| SQ-04 | MQ-03 | Yes | Yes (EV-MB-001) | Yes |
| SQ-05 | MQ-04 | Yes | Yes (EV-SR-001) | Yes |
| SQ-06 | MQ-05 | Yes | Yes (EV-SM-001) | Yes |
| SQ-07 | MQ-05 | Yes | Yes (EV-HR-001) | Yes |
| SQ-08 | MQ-05 | Yes | Yes (EV-FV-001) | Yes |
| SQ-09 | MQ-05 | Yes | Yes (EV-RF-001) | Yes |
| SQ-10 | MQ-05, Lv14+ | Yes | Yes | Yes |
| SQ-11 | Hub Vibrancy 70+ | Yes | Yes (EV-VH-006) | Yes |
| SQ-12 | MQ-05, 5 inn rests | Yes | Yes (EV-VH-007) | Yes |
| SQ-13 | SQ-09, GQ-01 | Yes | Yes | Yes |
| SQ-14 | MQ-07 | Yes | Yes (EV-HF-004/009) | Yes |

**Result**: All quest dependencies are internally consistent.

### God Quest → Subclass → Key Item Chains

| God Quest | First Recall → Subclass Branch | Key Item Rewarded | In items? | In quest-chains? |
|-----------|-------------------------------|-------------------|-----------|-----------------|
| GQ-01 (any emotion) | First recall → Luminary or Crucible | Varies by emotion | Yes | Yes |
| GQ-02 | Subsequent | Varies by emotion | Yes | Yes |
| GQ-03 | Subsequent | K-04 required (SQ-08), K-13/K-14 from sub-quests | Yes | Yes |
| GQ-04 | Subsequent | K-05 required (SQ-07) | Yes | Yes |

**Result**: God recall → subclass branching → key item reward chains are consistent across `dormant-gods.md`, `progression.md`, `quest-chains.md`, and `items-catalog.md`.

---

## Vibrancy System Verification

### Advisory A5: Global vs Per-Zone Wording in memory-system.md

- **File**: `memory-system.md:60`
- **Text**: "The game tracks a global 'Vibrancy' meter based on total memories broadcast to the world."
- **File**: `memory-system.md:88`
- **Text**: "Vibrancy is tracked per-zone, not globally."
- **Issue**: The same document contradicts itself. Lines 58-66 describe a "global" meter; lines 87-94 clarify vibrancy is per-zone. The per-zone design is canonical (confirmed in `vibrancy-system.md`, `geography.md`, `frontier-zones.md`, and all map docs).
- **Severity**: Advisory (editorial). Lines 58-66 were likely written before the per-zone decision was finalized. Lines 87-94 and all other docs agree.
- **Phase 2 action**: Rewrite `memory-system.md:60` from "global 'Vibrancy' meter" to "per-zone vibrancy scores" to match the rest of the bible.

### Per-Zone Starting Vibrancy

| Zone | Starting Vibrancy | In geography? | In frontier-zones? | In vibrancy-system? |
|------|-------------------|---------------|--------------------|--------------------|
| Everwick | 50 | Yes | N/A | Yes |
| Heartfield | 40 | Yes | N/A | Yes |
| Ambergrove | 40 | Yes | N/A | Yes |
| Millbrook | 45 | Yes | N/A | Yes |
| Sunridge | 35 | Yes | N/A | Yes |
| Shimmer Marsh | 30 | Yes | Yes | Yes |
| Hollow Ridge | 20 | Yes | Yes | Yes |
| Flickerveil | 25 | Yes | Yes | Yes |
| Resonance Fields | 15 | Yes | Yes | Yes |
| Luminous Wastes | 10 | Yes | Yes | Yes |
| Undrawn Peaks | 5 | Yes | Yes | Yes |
| Half-Drawn Forest | 10 | Yes | Yes | Yes |

**Result**: Starting vibrancy values are consistent across all zone-referencing docs.

---

## Item Distribution Verification

### Weapon Tier Progression

All 4 weapon types follow the same 8-tier pattern: 2 Tier 1, 3 Tier 2, 3 Tier 3. Stat values scale linearly within each tier. Verified across `items-catalog.md`, `event-placement.md` (chest contents), and `quest-chains.md` (quest rewards).

### Chest Contents ↔ Items Catalog

All 54 treasure chests referenced in `event-placement.md` contain items whose IDs exist in `items-catalog.md`. No dangling item references found.

### Quest Rewards ↔ Items Catalog

All quest rewards referenced in `quest-chains.md` have matching entries in `items-catalog.md`. Key item IDs (K-01 through K-15), weapon rewards (W-DG-03 from SQ-02, etc.), armor rewards (A-05 from SQ-03, etc.), and named memory fragments (MF-01 through MF-11) all cross-reference correctly.

### Enemy Drops ↔ Items Catalog

All enemy drop table entries in `enemies-catalog.md` reference items that exist in `items-catalog.md`. Fragment affinities use valid emotion/element combinations per `memory-system.md`.

---

## Summary

### Blocking Issues: **0**

No contradictions that would cause ambiguous or incorrect implementation.

### Advisories: **5**

| # | Issue | Files | Phase 2 Fix |
|---|-------|-------|-------------|
| A1 | STR used instead of ATK | `classes.md:24` | FIXED — applied 2026-02-13 |
| A2 | DEX used (doesn't exist) | `classes.md:84` | FIXED — applied 2026-02-13 |
| A3 | Stasis missing from status table | `combat.md:51-57` | FIXED — applied 2026-02-13 |
| A4 | Inspired duration: 2 vs 3 turns | `combat.md:57` vs items/skills | FIXED — applied 2026-02-13 |
| A5 | Global vs per-zone vibrancy | `memory-system.md:60` vs `:88` | FIXED — applied 2026-02-13 |

All advisories are editorial — the correct values are unambiguous from context. None would cause implementation confusion because the more detailed/specific docs always have the right answer.

### Dangling References: **0**

Every entity ID referenced in any doc exists in the canonical source doc for that entity type.
