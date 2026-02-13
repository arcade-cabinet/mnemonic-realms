# Master Event Placement Table

> Cross-references: [overworld-layout.md](overworld-layout.md), [dungeon-depths.md](dungeon-depths.md), [stagnation-zones.md](stagnation-zones.md), [frontier-zones.md](frontier-zones.md), [docs/story/quest-chains.md](../story/quest-chains.md), [docs/story/dialogue-bank.md](../story/dialogue-bank.md), [docs/design/enemies-catalog.md](../design/enemies-catalog.md), [docs/design/items-catalog.md](../design/items-catalog.md)

## Overview

This document catalogs **every event across all maps** in Mnemonic Realms — overworld zones, dungeons, stagnation zones, and frontier-specific mechanics. It is the definitive implementer reference for wiring RPG-JS events during Phase 2.

### Event Naming Convention

| Prefix | Map |
|--------|-----|
| `EV-VH-xxx` | Village Hub |
| `EV-HF-xxx` | Heartfield |
| `EV-AG-xxx` | Ambergrove |
| `EV-MB-xxx` | Millbrook |
| `EV-SR-xxx` | Sunridge |
| `EV-SM-xxx` | Shimmer Marsh |
| `EV-HR-xxx` | Hollow Ridge |
| `EV-FV-xxx` | Flickerveil |
| `EV-RF-xxx` | Resonance Fields |
| `EV-LW-xxx` | Luminous Wastes |
| `EV-UP-xxx` | Undrawn Peaks |
| `EV-HDF-xxx` | Half-Drawn Forest |
| `EV-D1-xxx` | Depths Level 1: Memory Cellar |
| `EV-D2-xxx` | Depths Level 2: Drowned Archive |
| `EV-D3-xxx` | Depths Level 3: Resonant Caverns |
| `EV-D4-xxx` | Depths Level 4: The Songline |
| `EV-D5-xxx` | Depths Level 5: The Deepest Memory |
| `EV-F1-xxx` | Fortress Floor 1: Gallery of Moments |
| `EV-F2-xxx` | Fortress Floor 2: Archive of Perfection |
| `EV-F3-xxx` | Fortress Floor 3: First Memory Chamber |

### Trigger Types

| Type | RPG-JS Hook | Description |
|------|-------------|-------------|
| `touch` | `onPlayerInput('action')` | Triggered when player steps on tile |
| `action` | `onAction()` | Triggered when player presses action button facing the event |
| `auto` | `onInit()` | Triggered automatically when map loads (conditional) |
| `parallel` | `onChanges()` | Runs continuously while on map (vibrancy checks, ambient effects) |

### Repeat Column Key

| Value | Meaning |
|-------|---------|
| `once` | One-time event, never fires again after first trigger |
| `repeat` | Fires every time the trigger condition is met |
| `quest` | Fires once per quest stage, then becomes inactive |
| `conditional` | Fires when a specific game-state condition is true |

---

## Section 1: Overworld — NPC Events

All NPC interactions. Sorted by map, then by NPC.

### Village Hub NPCs

| Event ID | Position | Trigger | Repeat | Linked Quest | NPC | Graphic | Description |
|----------|----------|---------|--------|--------------|-----|---------|-------------|
| EV-VH-001 | (19, 11) | action | quest | MQ-01 | Callum | `npc_callum` | Intro dialogue; gives Architect's Signet direction |
| EV-VH-002 | (9, 19) | action | quest | MQ-01, MQ-02 | Lira | `npc_lira` | Gives Architect's Signet (K-01); teaches memory ops |
| EV-VH-005 | (19, 17) | action | repeat | SQ-01 | Maren | `npc_maren` | Shop interface + SQ-01 dialogue trigger |
| EV-VH-006 | (19, 19) | action | conditional | SQ-11 | Torvan | `npc_torvan` | Shop interface + SQ-11 trigger (vibrancy 70+) |
| EV-VH-007 | (21, 15) | action | repeat | SQ-12 | Ren | `npc_ren` | Inn: rest + dream sequence trigger |
| EV-VH-008 | (8, 14) | action | repeat | — | Quest Board | — | Displays available side quests (MQ-03+) |
| EV-VH-013 | (12, 3) | action | repeat | — | Callum | `npc_callum` | Telescope: narrative lookout over Settled Lands |

### Heartfield NPCs

| Event ID | Position | Trigger | Repeat | Linked Quest | NPC | Graphic | Description |
|----------|----------|---------|--------|--------------|-----|---------|-------------|
| EV-HF-001 | (15, 14) | action | quest | SQ-02 | Farmer Gale | `npc_farmer_m1` | Windmill groaning dialogue; SQ-02 trigger (MQ-03+) |
| EV-HF-004 | (34, 29) | action | quest | MQ-04, SQ-14 | Lira (frozen) | `npc_lira` | Lira's frozen form; broadcast target for SQ-14 |
| EV-HF-009 | (34, 29) | action | once | SQ-14 | Lira (frozen) | `npc_lira` | Broadcast joy 4+ fragment; partial awakening |

### Ambergrove NPCs

| Event ID | Position | Trigger | Repeat | Linked Quest | NPC | Graphic | Description |
|----------|----------|---------|--------|--------------|-----|---------|-------------|
| EV-AG-001 | (9, 29) | action | quest | SQ-03 | Lead Woodcutter | `npc_woodcutter_m1` | Rapid-growth dialogue; SQ-03 trigger (MQ-03+) |
| EV-AG-008 | SQ-03 sites | action | quest | SQ-03 | — | — | 3 rapid-growth investigation sites + beetle nest combat |

### Millbrook NPCs

| Event ID | Position | Trigger | Repeat | Linked Quest | NPC | Graphic | Description |
|----------|----------|---------|--------|--------------|-----|---------|-------------|
| EV-MB-001 | (29, 29) | action | quest | SQ-04 | Fisher Tam | `npc_fisher_m1` | Strange lights dialogue; SQ-04 trigger (MQ-03+) |
| EV-MB-003 | (15, 15) | action | repeat | — | Specialty Shopkeeper | `npc_shopkeep_f1` | Shop interface (Brightwater Saber, Riverside Crosier) |

### Sunridge NPCs

| Event ID | Position | Trigger | Repeat | Linked Quest | NPC | Graphic | Description |
|----------|----------|---------|--------|--------------|-----|---------|-------------|
| EV-SR-001 | (31, 14) | action | quest | SQ-05 | Aric | `npc_aric` | Preserver doubt dialogue; SQ-05 trigger (MQ-04+) |
| EV-SR-003 | (19, 19) | action | repeat | — | Waystation Keeper | `npc_keeper_f1` | Rest point: full HP/SP restore |

### Shimmer Marsh NPCs

| Event ID | Position | Trigger | Repeat | Linked Quest | NPC | Graphic | Description |
|----------|----------|---------|--------|--------------|-----|---------|-------------|
| EV-SM-001 | (11, 14) | action | quest | SQ-06, GQ-02 | Wynn | `npc_wynn` | Marsh research + Verdance's Hollow info (MQ-05+) |

### Hollow Ridge NPCs

| Event ID | Position | Trigger | Repeat | Linked Quest | NPC | Graphic | Description |
|----------|----------|---------|--------|--------------|-----|---------|-------------|
| EV-HR-001 | (14, 24) | action | quest | MQ-05, SQ-07, GQ-04 | Petra | `npc_petra` | Dormant gods intro, Kinetic Boots (K-05) |
| EV-HR-002 | (15, 26) | action | repeat | — | Ridgewalker Merchant | `npc_merchant_m2` | Shop (Ridgewalker Claymore, Shadow Fang, etc.) |
| EV-HR-011 | (14, 24) | action | quest | SQ-07 | Petra | `npc_petra` | Escort quest trigger |

### Flickerveil NPCs

| Event ID | Position | Trigger | Repeat | Linked Quest | NPC | Graphic | Description |
|----------|----------|---------|--------|--------------|-----|---------|-------------|
| EV-FV-001 | (35, 30) | action | quest | SQ-08, GQ-03 | Solen | `npc_solen` | Light Lens (K-04), light studies (MQ-05+) |
| EV-FV-002 | (36, 29) | action | repeat | — | Village Shopkeeper | `npc_shopkeep_f2` | Shop (Prism Wand, Flickerblade, Stasis Breaker) |
| EV-FV-006 | (30, 26) | action | quest | GQ-03-S1 | Elyn | `npc_elyn` | Defector escort quest (after Vesperis recall) |

### Resonance Fields NPCs

| Event ID | Position | Trigger | Repeat | Linked Quest | NPC | Graphic | Description |
|----------|----------|---------|--------|--------------|-----|---------|-------------|
| EV-RF-001 | (9, 34) | action | quest | SQ-09, SQ-13 | Lead Audiomancer | `npc_audiomancer_m1` | Amphitheater humming, SQ-09 trigger (MQ-05+) |

### Undrawn Peaks NPCs

| Event ID | Position | Trigger | Repeat | Linked Quest | NPC | Graphic | Description |
|----------|----------|---------|--------|--------------|-----|---------|-------------|
| — | (17, 34), (22, 34) | — | — | MQ-08 | Preserver Captains ×2 | `npc_preserver_captain` | Gate guards; step aside after player solidifies approach |

### NPC Movement Patterns

| NPC | Map | Movement Type | Patrol Path / Range | Condition |
|-----|-----|--------------|---------------------|-----------|
| Callum | Village Hub | Patrol (60s cycle) | Elder's House (19, 11) ↔ Lookout Hill (12, 3) | Always |
| Lira | Village Hub | Static → Roam | Static at (9, 19) until MQ-02; roams village after | MQ-02 flag |
| Maren | Village Hub | Static | (19, 17) behind counter | Always |
| Torvan | Village Hub | Static | (19, 19) at anvil | Always |
| Ren | Village Hub | Static | (21, 15) behind bar | Always |
| Villager A | Village Hub | Wander | Central Square (12-17, 14-19) | Always |
| Villager B | Village Hub | Wander | Central Square (12-17, 14-19) | Always |
| Villager C | Village Hub | Patrol | South Gate road | Always |
| Farmer Gale | Heartfield | Patrol | Hamlet (13-22, 13-22) | Always |
| Farmer Suri | Heartfield | Static | (17, 16) at farmstead | Always |
| Farmer Edric | Heartfield | Patrol | Fields (10-20, 18-25) | Always |
| Hamlet Elder | Heartfield | Static | (18, 14) at well | Always |
| Child NPC | Heartfield | Wander | Hamlet | After Solara recall |
| Lead Woodcutter | Ambergrove | Static | (9, 29) at camp | Always |
| Woodcutter B | Ambergrove | Patrol | (10,31) → (15,20) | Always |
| Woodcutter C | Ambergrove | Static | (11, 30) chopping | Always |
| Fisher Tam | Millbrook | Static | (29, 29) at dock | Always |
| Specialty Shopkeeper | Millbrook | Static | (15, 15) in shop | Always |
| Millbrook Elder | Millbrook | Patrol | Town (13-22, 12-20) | Always |
| Bridge Guard | Millbrook | Static | (20, 19) on bridge | Always |
| Waystation Keeper | Sunridge | Static | (19, 19) | Always |
| Traveling Merchant | Sunridge | Appears | (20, 20) every 3 game-hours | Rotation |
| Waystation Guard | Sunridge | Patrol | Waystation perimeter | Always |
| Aric | Sunridge | Static | (31, 14) at outpost perimeter | After MQ-04 |
| Wynn | Shimmer Marsh | Static → Move | (11, 14) at hut; moves to Verdance's Hollow after GQ-02 (joy) | GQ-02 flag |
| Marsh Researcher | Shimmer Marsh | Patrol | Hut vicinity | Always |
| Preserver Scout A | Shimmer Marsh | Patrol | Bog perimeter (34-42, 6-14) | Pre-break |
| Preserver Scout B | Shimmer Marsh | Static | (40, 10) bog center | Pre-break |
| Petra | Hollow Ridge | Static → Patrol | (14, 24) at camp; patrols after GQ-04 | GQ-04 flag |
| Ridgewalker Scout | Hollow Ridge | Patrol | Camp perimeter (10-20, 20-30) | Always |
| Ridgewalker Merchant | Hollow Ridge | Static | (15, 26) at market stall | Always |
| Ridgewalker Elder | Hollow Ridge | Static | (12, 22) at campfire | Always |
| Ridgewalker Guards | Hollow Ridge | Patrol | Camp borders | Always |
| Solen | Flickerveil | Static | (35, 30) village center | Always |
| Village Shopkeeper | Flickerveil | Static | (36, 29) in shop | Always |
| Village Innkeeper | Flickerveil | Static | (34, 32) in inn | Always |
| Flickering Guard A | Flickerveil | Patrol | Village perimeter | Always |
| Preserver Agent (archive) | Flickerveil | Static | (9, 9) archive center | Pre-clear |
| Preserver Agent B | Flickerveil | Patrol | Archive perimeter | Pre-clear |
| Preserver Agent C | Flickerveil | Patrol | Archive perimeter | Pre-clear |
| Elyn | Flickerveil | Static | (30, 26) | After Vesperis recall |
| Lead Audiomancer | Resonance Fields | Static | (9, 34) at camp | Always |
| Audiomancer B | Resonance Fields | Patrol | Camp-to-stones route | Always |
| Audiomancer C | Resonance Fields | Static | (8, 35) listening | Always |
| Audiomancer D | Resonance Fields | Static | (11, 34) note-taking | Always |
| Preserver Captain | Resonance Fields | Static | (40, 14) inside Cathedral | Pre-break |
| Preserver Agents A-C | Resonance Fields | Patrol/Static | Cathedral exterior | Pre-break |
| Preserver Archivist | Luminous Wastes | Static | (34, 9) at watchtower | Pre-break |
| Preserver Captain A | Undrawn Peaks | Static | (17, 34) at Fortress Gate | Always |
| Preserver Captain B | Undrawn Peaks | Static | (22, 34) at Fortress Gate | Always |

---

## Section 2: Overworld — Chest Events

All treasure chests. Sorted by map.

| Event ID | Map | Position | Trigger | Contents | Condition | Repeat |
|----------|-----|----------|---------|----------|-----------|--------|
| CH-VH-01 | Village Hub | (13, 3) | action | Minor Potion (C-HP-01) ×2 | Always | once |
| CH-VH-02 | Village Hub | (9, 11) | action | Mana Drop (C-SP-01) ×2 | After MQ-01 | once |
| CH-HF-01 | Heartfield | (32, 9) | action | Antidote (C-SC-01) ×3 | Always | once |
| CH-HF-02 | Heartfield | (5, 10) | action | Minor Potion (C-HP-01) ×2 | Always | once |
| CH-HF-03 | Heartfield | (36, 25) | action | Smoke Bomb (C-SP-05) ×2 | Always | once |
| CH-AG-01 | Ambergrove | (21, 10) | action | Hearthstone Staff (W-ST-03) | Always | once |
| CH-AG-02 | Ambergrove | (37, 20) | action | Windcatcher Rod (W-WD-03) | After canopy climb | once |
| CH-AG-03 | Ambergrove | (30, 5) | action | Minor Potion (C-HP-01) ×3 | Always | once |
| CH-MB-01 | Millbrook | (7, 5) | action | 2 fragments (sorrow/water/3 + awe/water/3) | SQ-04 | once |
| CH-MB-02 | Millbrook | (25, 10) | action | Haste Seed (C-BF-04) ×2 | Always | once |
| CH-MB-03 | Millbrook | (32, 32) | action | Minor Potion (C-HP-01) ×3 | Always | once |
| CH-SR-01 | Sunridge | (9, 8) | action | Strength Seed (C-BF-01) ×2 | Always | once |
| CH-SR-02 | Sunridge | (25, 30) | action | Smoke Bomb (C-SP-05) ×3 | Always | once |
| CH-SR-03 | Sunridge | (32, 14) | action | Fortify Tonic (C-SC-03) ×2 | After SQ-05 | once |
| CH-SM-01 | Shimmer Marsh | (12, 16) | action | Antidote (C-SC-01) ×5, Potion (C-HP-02) ×2 | Always | once |
| CH-SM-02 | Shimmer Marsh | (38, 5) | action | Stasis Breaker (C-SC-04) ×3 | After bog break or Silent Path | once |
| CH-SM-03 | Shimmer Marsh | (24, 36) | action | Verdant Mantle (A-12) | Post-Verdance recall | once |
| CH-HR-01 | Hollow Ridge | (5, 7) | action | Ridgewalker Claymore (W-SW-05) | Always | once |
| CH-HR-02 | Hollow Ridge | (36, 32) | action | Frontier Guard (A-09) | After Shattered Pass break | once |
| CH-HR-03 | Hollow Ridge | (38, 4) | action | Mana Draught (C-SP-02) ×3 | Always | once |
| CH-FV-01 | Flickerveil | (10, 10) | action | Flickerblade (W-DG-05) | After archive garrison clear (GQ-03-F1) | once |
| CH-FV-02 | Flickerveil | (34, 28) | action | Stasis Breaker (C-SC-04) ×3 | Always | once |
| CH-FV-03 | Flickerveil | (47, 25) | action | Potion (C-HP-02) ×3 | Always | once |
| CH-RF-01 | Resonance Fields | (25, 26) | action | Choir's Final Note (MF-05) | GQ-01 recall vision | once |
| CH-RF-02 | Resonance Fields | (40, 16) | action | Preserver's Crystal Mail (A-10) | After Cathedral clear (GQ-01-F2) | once |
| CH-RF-03 | Resonance Fields | (10, 45) | action | Mana Draught (C-SP-02) ×3 | Always | once |
| CH-HF2-01 | Half-Drawn Forest | (20, 24) | action | Sketchweave Cloak (A-13) | After Living Sketch solidification | once |
| CH-HF2-02 | Half-Drawn Forest | (30, 10) | action | Dissolved Essence (C-SP-09) ×1 | Always | once |
| CH-HF2-03 | Half-Drawn Forest | (14, 37) | action | Mana Surge (C-SP-03) ×2 | Always | once |

### Dungeon Chests

| Event ID | Map | Position | Trigger | Contents | Condition | Repeat |
|----------|-----|----------|---------|----------|-----------|--------|
| EV-D1-005 | Depths L1 R2 | (2, 8) | action | Minor Potion (C-HP-01) ×3 | Always | once |
| EV-D1-009 | Depths L1 R4 | (12, 15) | action | Mana Drop (C-SP-01) ×3, 50 gold | Always | once |
| EV-D2-004 | Depths L2 R2 | (2, 6) | action | Potion (C-HP-02) ×2 | Always | once |
| EV-D2-006 | Depths L2 R3 | (18, 6) | action | Dissolved Metal (unique, SQ-11) | Always | once |
| EV-D2-007 | Depths L2 R4 | (3, 12) | action | Mana Draught (C-SP-02) ×2 | Requires wading (20 HP) | once |
| EV-D2-019 | Depths L2 R7 | (15, 20) | action | Dissolved Essence (C-SP-09) ×1, 120 gold | After boss | once |
| EV-D3-013 | Depths L3 R5 | (17, 11) | action | Stasis Breaker (C-SC-04) ×3, 80 gold | Always | once |
| EV-D3-015 | Depths L3 R6 | (2, 14) | action | Potion (C-HP-02) ×3, Mana Draught (C-SP-02) ×2 | Always | once |
| EV-D3-021 | Depths L3 R8 | (15, 19) | action | Dissolved Essence (C-SP-09) ×1, 150 gold | After boss | once |
| EV-D4-005 | Depths L4 R2 | (18, 6) | action | Strength Seed (C-BF-01) ×2, 100 gold | Always | once |
| EV-D4-009 | Depths L4 R4 | (15, 12) | action | Memory's Edge (W-SW-08) or Echo of Tomorrow (W-DG-08) | Forced encounter guard | once |
| EV-D4-011 | Depths L4 R5 | (18, 16) | action | Dissolved Essence (C-SP-09) ×1, 150 gold | Always | once |
| EV-D4-012 | Depths L4 R6 | (4, 17) | action | Aegis Seed (C-BF-03) ×3, Wisdom Seed (C-BF-02) ×3 | Always | once |
| EV-D4-018 | Depths L4 R7 | (5, 21) | action | Phoenix Feather (C-SP-10), 200 gold | After boss | once |
| EV-D5-004 | Depths L5 R3 | (7, 6) | action | First Light (W-ST-08) or Dissolved Memory Lens (W-WD-08) | Class-matched | once |
| EV-D5-012 | Depths L5 R7 | (8, 14) | action | Elixir (C-HP-04) ×1, Ether (C-SP-04) ×1 | Always | once |
| EV-D5-016 | Depths L5 R9 | (18, 15) | action | Memory-Woven Plate (A-14, DEF +35) | Always | once |
| EV-D5-022 | Depths L5 R10 | (10, 23) | action | Dissolved Essence (C-SP-09) ×2, Memory Incense (C-BF-05) ×1, 300 gold | After boss | once |
| EV-F1-007 | Fortress F1 R3 | (8, 6) | action | Stasis Breaker (C-SC-04) ×5, High Potion (C-HP-03) ×3 | After forced encounter | once |
| EV-F1-014 | Fortress F1 R5 | (17, 12) | action | Phoenix Feather (C-SP-10) | MQ-09 sub-goal | once |
| EV-F2-013 | Fortress F2 R4 | (15, 13) | action | Panacea (C-SC-05) ×3, 200 gold | Always | once |
| EV-F2-020 | Fortress F2 R6 | (12, 16) | action | Dissolved Essence (C-SP-09) ×1, Memory Incense (C-BF-05) ×1, 300 gold | After boss | once |

---

## Section 3: Overworld — Transition Events

All map-to-map transitions. Sorted by source map.

### Village Hub Transitions

| Event ID | Position | Type | Destination Map | Dest. Tile | Condition |
|----------|----------|------|----------------|------------|-----------|
| EV-VH-009 | (15, 25) | touch | Heartfield | (15, 0) | Always |
| EV-VH-010 | (29, 14) | touch | Ambergrove | (0, 20) | Always |
| EV-VH-011 | (0, 14) | touch | Millbrook | (39, 20) | Always |
| EV-VH-012 | (15, 0) | touch | Sunridge | (20, 39) | After MQ-04 |
| EV-VH-014 | (8, 17) | touch | Depths L1 | (10, 0) | After MQ-05 |

### Heartfield Transitions

| Event ID | Position | Type | Destination Map | Dest. Tile | Condition |
|----------|----------|------|----------------|------------|-----------|
| EV-HF-005 | (20, 38) | touch | Shimmer Marsh | (20, 0) | After MQ-04 |
| EV-HF-006 | (15, 0) | touch | Village Hub | (15, 25) | Always |
| EV-HF-007 | (39, 20) | touch | Ambergrove | (0, 20) | Always |

### Ambergrove Transitions

| Event ID | Position | Type | Destination Map | Dest. Tile | Condition |
|----------|----------|------|----------------|------------|-----------|
| EV-AG-004 | (0, 20) | touch | Village Hub | (29, 14) | Always |
| EV-AG-006 | (38, 20) | touch | Flickerveil | (0, 30) | After MQ-04 |
| EV-AG-007 | (10, 39) | touch | Heartfield | (39, 20) | Always |

### Millbrook Transitions

| Event ID | Position | Type | Destination Map | Dest. Tile | Condition |
|----------|----------|------|----------------|------------|-----------|
| EV-MB-004 | (39, 20) | touch | Village Hub | (0, 14) | Always |
| EV-MB-005 | (20, 39) | touch | Heartfield | (5, 20) | Always |
| EV-MB-006 | (0, 20) | touch | Hollow Ridge | (49, 35) | After MQ-04 |

### Sunridge Transitions

| Event ID | Position | Type | Destination Map | Dest. Tile | Condition |
|----------|----------|------|----------------|------------|-----------|
| EV-SR-004 | (20, 39) | touch | Village Hub | (15, 0) | Always |
| EV-SR-005 | (18, 0) | touch | Hollow Ridge | (25, 49) | After MQ-04 |
| EV-SR-006 | (39, 20) | touch | Ambergrove | (5, 0) | Always |

### Shimmer Marsh Transitions

| Event ID | Position | Type | Destination Map | Dest. Tile | Condition |
|----------|----------|------|----------------|------------|-----------|
| EV-SM-005 | (33, 43) | touch | Depths L2 | (10, 0) | After MQ-05 |
| EV-SM-006 | (20, 0) | touch | Heartfield | (20, 38) | After MQ-04 |
| EV-SM-007 | (49, 25) | touch | Flickerveil | (0, 25) | After MQ-05 |
| EV-SM-008 | (0, 25) | touch | Hollow Ridge | (49, 35) | After MQ-05 |
| EV-SM-009 | (25, 49) | touch | Luminous Wastes | (25, 0) | After MQ-07 |

### Hollow Ridge Transitions

| Event ID | Position | Type | Destination Map | Dest. Tile | Condition |
|----------|----------|------|----------------|------------|-----------|
| EV-HR-006 | (38, 3) | touch | Depths L3 | (10, 0) | After MQ-05 |
| EV-HR-007 | (25, 49) | touch | Sunridge | (18, 0) | Always |
| EV-HR-008 | (49, 25) | touch | Flickerveil | (0, 15) | After MQ-05 |
| EV-HR-009 | (49, 35) | touch | Shimmer Marsh | (0, 25) | After MQ-05 |
| EV-HR-010 | (25, 0) | touch | Undrawn Peaks | (20, 39) | After MQ-07 |

### Flickerveil Transitions

| Event ID | Position | Type | Destination Map | Dest. Tile | Condition |
|----------|----------|------|----------------|------------|-----------|
| EV-FV-007 | (0, 25) | touch | Shimmer Marsh | (49, 25) | After MQ-05 |
| EV-FV-008 | (0, 15) | touch | Hollow Ridge | (49, 25) | After MQ-05 |
| EV-FV-009 | (0, 38) | touch | Ambergrove | (38, 20) | Always |
| EV-FV-010 | (48, 25) | touch | Half-Drawn Forest | (0, 20) | After MQ-07 |

### Resonance Fields Transitions

| Event ID | Position | Type | Destination Map | Dest. Tile | Condition |
|----------|----------|------|----------------|------------|-----------|
| EV-RF-007 | (49, 25) | touch | Shimmer Marsh | (0, 25) | After MQ-05 |
| EV-RF-008 | (25, 0) | touch | Hollow Ridge | (25, 49) | After MQ-05 |
| EV-RF-009 | (0, 25) | touch | Luminous Wastes | (39, 20) | After MQ-07 |

### Luminous Wastes Transitions

| Event ID | Position | Type | Destination Map | Dest. Tile | Condition |
|----------|----------|------|----------------|------------|-----------|
| EV-LW-003 | (25, 0) | touch | Shimmer Marsh | (25, 49) | After MQ-07 |
| EV-LW-004 | (39, 20) | touch | Resonance Fields | (0, 25) | After MQ-07 |
| EV-LW-005 | (20, 0) | touch | Half-Drawn Forest | (20, 39) | After MQ-08 |

### Undrawn Peaks Transitions

| Event ID | Position | Type | Destination Map | Dest. Tile | Condition |
|----------|----------|------|----------------|------------|-----------|
| EV-UP-004 | (19, 35) | touch | Fortress F1 | (10, 0) | After MQ-08 (gate solidified) |
| EV-UP-005 | (20, 39) | touch | Hollow Ridge | (25, 0) | After MQ-07 |
| EV-UP-006 | (39, 25) | touch | Half-Drawn Forest | (0, 10) | After MQ-08 |

### Half-Drawn Forest Transitions

| Event ID | Position | Type | Destination Map | Dest. Tile | Condition |
|----------|----------|------|----------------|------------|-----------|
| EV-HDF-003 | (13, 36) | touch | Depths L5 | (10, 0) | After MQ-08 |
| EV-HDF-004 | (0, 20) | touch | Flickerveil | (48, 25) | After MQ-07 |
| EV-HDF-005 | (0, 10) | touch | Undrawn Peaks | (39, 25) | After MQ-08 |
| EV-HDF-006 | (20, 39) | touch | Luminous Wastes | (20, 0) | After MQ-08 |

### Dungeon Transitions (Between Floors)

| Event ID | Source Map | Position | Destination Map | Dest. Tile | Condition |
|----------|-----------|----------|----------------|------------|-----------|
| EV-D1-001 | Depths L1 | (10, 0) | Village Hub | (8, 17) | Entry point |
| EV-D1-011 | Depths L1 | (12, 20) | Village Hub | (8, 17) | Memory lift (after R3 clear) |
| EV-D1-012 | Depths L1 | (15, 22) | Depths L2 | (10, 0) | Always |
| EV-D2-001 | Depths L2 | (10, 0) | Shimmer Marsh | (33, 43) | Entry point |
| EV-D2-013 | Depths L2 | (15, 16) | Shimmer Marsh | (33, 43) | Memory lift (after water puzzle) |
| EV-D2-018 | Depths L2 | (10, 24) | Depths L3 | (10, 0) | Always |
| EV-D3-001 | Depths L3 | (10, 0) | Hollow Ridge | (38, 3) | Entry point |
| EV-D3-011 | Depths L3 | (3, 10) | Hollow Ridge | (38, 3) | Memory lift (after sound puzzle) |
| EV-D3-020 | Depths L3 | (10, 24) | Depths L4 | (10, 0) | Always |
| EV-D4-001 | Depths L4 | (10, 0) | Resonance Fields | (28, 44) | Entry point |
| EV-D4-006 | Depths L4 | (4, 7) | Resonance Fields | (28, 44) | Memory lift |
| EV-D4-017 | Depths L4 | (10, 24) | Depths L5 | (10, 0) | Always |
| EV-D5-001 | Depths L5 | (10, 0) | Half-Drawn Forest | (13, 36) | Entry point |
| EV-D5-007 | Depths L5 | (3, 10) | Half-Drawn Forest | (13, 36) | Memory lift |
| EV-D5-018 | Depths L5 | (19, 16) | Fortress F1 | — | GQ-03-F2 shortcut only |
| EV-F1-001 | Fortress F1 | (10, 0) | Undrawn Peaks | (19, 35) | Entry point |
| EV-F1-012 | Fortress F1 | (3, 11) | Undrawn Peaks | (19, 35) | Memory lift |
| EV-F1-019 | Fortress F1 | (10, 19) | Fortress F2 | (10, 0) | After boss B-04a |
| EV-F2-001 | Fortress F2 | (10, 0) | Fortress F1 | (10, 19) | Entry point |
| EV-F2-019 | Fortress F2 | (15, 19) | Fortress F3 | (10, 0) | After boss B-04b |
| EV-F3-001 | Fortress F3 | (10, 0) | Fortress F2 | (15, 19) | Entry point |
| EV-F3-013 | Fortress F3 | (10, 18) | Undrawn Peaks | (19, 35) | Post-game (after MQ-10) |

---

## Section 4: Cutscene & Story Triggers

Cutscene events and narrative cinematics, sorted by quest chain.

### Main Quest Cutscenes

| Event ID | Map | Position | Type | Trigger | Quest | Description | Repeat |
|----------|-----|----------|------|---------|-------|-------------|--------|
| EV-VH-016 | Village Hub | (0, 0) | auto | First load | MQ-01 | Opening cutscene (Act I opening) | once |
| EV-VH-003 | Village Hub | (10, 17) | action | MQ-02 active | MQ-02 | Memorial Garden: first fragment collection (MF-01) | once |
| EV-VH-004 | Village Hub | (10, 17) | action | MQ-02 active | MQ-02 | Remix Table tutorial; broadcast tutorial | once |
| EV-HF-003 | Heartfield | (33, 28) | auto | MQ-04 active | MQ-04 | Stagnation Clearing cutscene: Lira's freezing | once |
| EV-SM-003 | Shimmer Marsh | (25, 35) | auto | GQ-02 active | GQ-02 | Verdance recall vision (30-sec cinematic) | once |
| EV-HR-003 | Hollow Ridge | (24, 10) | auto | GQ-04 active | GQ-04 | Kinesis Spire recall vision | once |
| EV-FV-003 | Flickerveil | (20, 20) | auto | GQ-03 active | GQ-03 | Luminos recall vision (requires K-04 equipped) | once |
| EV-RF-003 | Resonance Fields | (25, 25) | auto | GQ-01 active | GQ-01 | Resonance recall vision | once |
| EV-F3-002 | Fortress F3 | (5, 2) | auto | MQ-09 active | MQ-09 | Curator vignette: child playing in sunlit village | once |
| EV-F3-003 | Fortress F3 | (10, 3) | auto | MQ-09 active | MQ-09 | Curator vignette: young Architect broadcasting | once |
| EV-F3-004 | Fortress F3 | (15, 4) | auto | MQ-09 active | MQ-09 | Curator vignette: community dissolving | once |
| EV-F3-005 | Fortress F3 | (10, 5) | auto | MQ-09 active | MQ-09 | Curator vignette: founding the Preservers | once |
| EV-F3-007 | Fortress F3 | (10, 12) | auto | MQ-09 active | MQ-09 | Curator confrontation begins (dialogue sequence) | once |
| EV-F3-012 | Fortress F3 | (10, 18) | auto | MQ-10 complete | MQ-10 | Endgame cinematic: world blooms | once |

### Dungeon Lore Visions

| Event ID | Map | Position | Type | Quest | Description | Repeat |
|----------|-----|----------|------|-------|-------------|--------|
| EV-D1-010 | Depths L1 R4 | (15, 15) | auto | — | Memory fog: 15-sec narrated vignette of dissolved village | once |
| EV-D2-002 | Depths L2 R1 | (5, 2) | action | — | Submerged tablet lore: "We stored everything we were in these pages" | once |
| EV-D2-012 | Depths L2 R5 | (5, 17) | action | — | Mural hint: "We read from the edges inward" | once |
| EV-D3-002 | Depths L3 R1 | (15, 2) | action | — | Crystal wall inscription (musical notation): Sound Puzzle hint | once |
| EV-D3-014 | Depths L3 R6 | (4, 15) | action | — | Crystal pool: 30-sec lore cinematic (mountain civilization) | once |
| EV-D4-002 | Depths L4 R1 | (10, 2) | auto | — | First Verse vision: performers assembling | once |
| EV-D4-010 | Depths L4 R5 | (15, 17) | auto | — | Fourth Verse vision: performers dissolving (20-sec) | once |
| EV-D4-013 | Depths L4 R6 | (2, 18) | action | — | Performer's note: "We play not because the world needs saving" | once |
| EV-D5-002 | Depths L5 R1 | (10, 1) | auto | — | Threshold vision: montage of all dissolved civilizations (10-sec) | once |
| EV-D5-010 | Depths L5 R6 | (2, 15) | action | — | Curator image: "Before the crystal. Before the title." | once |
| EV-D5-011 | Depths L5 R7 | (7, 15) | auto | — | Civilization vision: oldest dissolution (30-sec cinematic) | once |
| EV-D5-017 | Depths L5 R9 | (17, 14) | action | — | Stone tablet: "The First Memory is not a beginning. It is a question." | once |

---

## Section 5: Boss & Combat Encounters

All forced combat events and boss triggers.

### Overworld Boss Events

| Event ID | Map | Position | Boss | Level | HP | Quest | Description |
|----------|-----|----------|------|-------|-----|-------|-------------|
| EV-HF-003 | Heartfield | (33, 28) | B-01: Stagnation Heart | 13-16 | — | MQ-04 | Emerges from crystal when player broadcasts pot. 3+ at Lira's form (Act II return) |

### Dungeon Boss Events

| Event ID | Map | Position | Type | Boss | Level | HP | Pre-Dialogue | Death Trigger |
|----------|-----|----------|------|------|-------|-----|-------------|---------------|
| EV-D2-015/016 | Depths L2 R7 | (10, 21) | action → auto | B-03a: The Archivist | 14-16 | 450 | "Another reader? The archive is closing." | +10% INT for floor |
| EV-D3-018/019 | Depths L3 R8 | (10, 20) | action → auto | B-03b: The Resonant King | 16-18 | 550 | Harmonic speech | Resonant Collapse |
| EV-D4-014/015 | Depths L4 R7 | (10, 22) | action → auto | B-03c: The Conductor | 19-21 | 650 | "I've been holding this last note for a thousand years." | Full HP/SP heal |
| EV-D5-019/020 | Depths L5 R10 | (10, 21) | action → auto | B-03d: The First Dreamer | 24-26 | 1,200 (2-phase) | "Show me what you remember." | Peaceful dissolution |
| EV-F1-016/017 | Fortress F1 R6 | (10, 16) | action → auto | B-04a: Curator's Right Hand | 24-26 | 750 | "Every step forward is a moment that can never be perfect again." | Curator's Lament |
| EV-F2-016/017 | Fortress F2 R6 | (15, 17) | action → auto | B-04b: Archive Keeper | 26-28 | 900 | "That's not creation. That's vandalism." | +15% all stats for Fortress |
| EV-F3-007/008 | Fortress F3 R2 | (10, 12)/(10, 15) | auto → action | B-05: The Curator | — | — (dialogue) | Varies by carried items/recalled gods | Endgame bloom |

### Forced Encounter Events

| Event ID | Map | Position | Enemies | Level | Trigger |
|----------|-----|----------|---------|-------|---------|
| EV-D1-006 | Depths L1 R3 | (14, 9) | 2 Memory Shades + 1 scaled (1.3x) | 4-6 | touch |
| EV-D4-009 | Depths L4 R4 | (15, 12) | 2 Songline Phantoms | 19-21 | action (chest guard) |
| EV-F1-006 | Fortress F1 R3 | (7, 7) | 2 Preserver Agents | 24-26 | touch |
| EV-F2-010 | Fortress F2 R4 | (10, 12) | 1 Preserver Captain | 26-28 | touch |

### Stagnation Zone Combat Events

| Zone | Map | Post-Break Enemies | Level | Quest Link |
|------|-----|--------------------|-------|------------|
| Heartfield Clearing | Heartfield (33, 28) | None (tutorial). B-01 on Act II return. | — / 13-16 | MQ-04, SQ-14 |
| Sunridge Outpost | Sunridge (30, 13) | 2 Preserver Scouts (E-PV-01) | 8-10 | SQ-05 |
| Shimmer Marsh Bog | Shimmer Marsh (38, 8) | 2 Preserver Scouts + 1 Preserver Agent (E-PV-02) | 12-14 | — |
| Hollow Ridge Pass | Hollow Ridge (33, 28) | 3 Preserver Agents (E-PV-02) | 15-17 | — |
| Resonance Fields Cathedral | Resonance Fields (38, 13) | 3 Preserver Agents + 1 Preserver Captain (E-PV-03) | 15-17 | GQ-01-F2 |
| Luminous Wastes Watchtower | Luminous Wastes (33, 8) | 2 Preserver Archivists (E-PV-04) | 23-25 | — |
| Fortress Gate | Undrawn Peaks (18, 33) | None (Fortress interior is the challenge) | — | MQ-08 |

---

## Section 6: God Recall Events

All events related to the 4 dormant god recall sequences.

### Resonance (Resonance Fields)

| Event ID | Map | Position | Type | Quest | Description |
|----------|-----|----------|------|-------|-------------|
| EV-RF-002 | Resonance Fields | SQ-09 stones | action | SQ-09 | 3 approach stones harmonization (pre-requisite) |
| EV-RF-003 | Resonance Fields | (25, 25) | auto | GQ-01 | Resonance recall vision cinematic |
| EV-RF-004 | Resonance Fields | (25, 25) | action | GQ-01 | 4 emotion pedestals: place potency 3+ fragment |
| EV-RF-005 | Resonance Fields | (38, 13) | action | GQ-01-F2 | Cathedral assault (K-15 Thunderstone required) |

### Verdance (Shimmer Marsh)

| Event ID | Map | Position | Type | Quest | Description |
|----------|-----|----------|------|-------|-------------|
| EV-SM-002 | Shimmer Marsh | (18, 28) | action | GQ-02 | Blocked root cluster: broadcast earth/water to clear path |
| EV-SM-003 | Shimmer Marsh | (25, 35) | auto | GQ-02 | Verdance recall vision (30-sec cinematic) |
| EV-SM-004 | Shimmer Marsh | (25, 35) | action | GQ-02 | 4 emotion pedestals: place potency 3+ fragment |

### Luminos (Flickerveil)

| Event ID | Map | Position | Type | Quest | Description |
|----------|-----|----------|------|-------|-------------|
| EV-FV-003 | Flickerveil | (20, 20) | auto | GQ-03 | Luminos recall vision (requires Light Lens K-04) |
| EV-FV-004 | Flickerveil | (20, 20) | action | GQ-03 | 4 emotion pedestals for Luminos recall |
| EV-FV-005 | Flickerveil | (8, 8) | action | GQ-03-F1 | Resonance Archive: Burning Archive assault trigger |

### Kinesis (Hollow Ridge)

| Event ID | Map | Position | Type | Quest | Description |
|----------|-----|----------|------|-------|-------------|
| EV-HR-003 | Hollow Ridge | (24, 10) | auto | GQ-04 | Kinesis Spire recall vision |
| EV-HR-004 | Hollow Ridge | (24, 10) | action | GQ-04 | 4 emotion pedestals for Kinesis recall |

---

## Section 7: Puzzle Events

All puzzle mechanics with their event wiring.

### Dungeon Puzzles

| Puzzle | Map | Events | Mechanic | Fail Penalty | Solution |
|--------|-----|--------|----------|-------------|----------|
| Water Valves | Depths L2 R5 | EV-D2-009, 010, 011, 012 | Turn 3 valves in order | 30 HP flood + reset | Left (3,15) → Right (7,15) → Center (5,15) |
| Sound Puzzle | Depths L3 R4 | EV-D3-005 to 010 | Strike 5 crystal pillars in ascending chord | 40 HP dissonance + reset | C (14,5) → E (16,5) → G (18,6) → A (12,6) → B (19,7) |
| Harmonic Bridge | Depths L3 R7 | EV-D3-017 | Walk (don't run) across bridge | 50 HP shockwave + knockback | Walk, don't run |
| Paradox Corridor | Depths L5 R4 | EV-D5-005, 006 | Walk backward to progress | No penalty, just no progress | Press opposite direction |
| Crystal Receptacle | Fortress F1 R4 | EV-F1-008, 009, 010, 011 | Broadcast 3 emotion-matched fragments | None | Joy at (11,7) → Sorrow at (15,7) → Fury at (19,7) |
| Moral Dilemma Gallery | Fortress F2 R3 | EV-F2-007, 008, 009 | Free or leave 3 frozen NPCs | None (choice-based) | Broadcast any fragment to free; skip to leave |
| Curator Dialogue | Fortress F3 R2 | EV-F3-007, 008 | Branching dialogue based on items/recalled gods | None | Varies: K-06, K-13, MF-09 influence outcomes |

### Stagnation Zone Puzzles

| Puzzle | Map | Unlock Condition | Fail Penalty | Notes |
|--------|-----|-----------------|-------------|-------|
| Tutorial Break | Heartfield (35, 29) | Any fragment, potency 1+ | None | Guided by Lira's flashback |
| Fury Break | Sunridge (32, 14) | Fury emotion, potency 2+ | None (wrong fragment type = no effect) | First emotion-specific puzzle |
| Dual Requirement | Shimmer Marsh (41, 10) | Fury + Water, potency 3+ | None | Teaches remix mechanic |
| Sequential Broadcasts | Hollow Ridge (36,28)→(39,30)→(35,31) | Earth → Fire → Wind, any potency | Wrong order resets all waypoints | 3 separate fragments needed |
| Key Item + Broadcast | Resonance Fields (42, 15) | K-15 (gate) + Awe potency 4+ | None | Requires GQ-01 progression |
| Brute Force | Luminous Wastes (34, 8) | Any fragment, potency 5 | None | Most expensive single broadcast |
| Story Gate | Undrawn Peaks (19, 34) | MQ-08 + any potency 3+ | None | Solidifies Sketch terrain around gate |

### Overworld Puzzles

| Puzzle | Map | Events | Mechanic |
|--------|-----|--------|----------|
| Singing Stones | Resonance Fields (28-33, 43) | EV-RF-006 | Activate 5 Resonance Stones in sequence → Depths L4 entrance |
| Sketch Bridge | Undrawn Peaks (20, 20) | EV-UP-002 | Broadcast any potency 2+ fragment to solidify crossing |
| Living Sketch | Half-Drawn Forest (18, 23) | EV-HDF-001 | Broadcast potency 3+ to lock in forest section |
| Half-Built Village | Luminous Wastes (18, 18) | EV-LW-001 | 3 separate broadcasts (any, potency 2+ each) to solidify village |
| MQ-08 Trail | Half-Drawn Forest (5 positions) | EV-HDF-007 | Activate 5 Resonance Stones in sequence to navigate Sketch |

---

## Section 8: Resonance Stone Events

All Resonance Stone interactions across all maps.

### Fragment-Bearing Stones (Overworld)

| Stone ID | Map | Position | Fragment | Emotion | Element | Potency | Condition |
|----------|-----|----------|----------|---------|---------|---------|-----------|
| RS-VH-01 | Village Hub | (14, 15) | Yes | Joy | Neutral | 1 | Always |
| RS-VH-02 | Village Hub | (9, 16) | Yes | Calm | Earth | 1 | MQ-02 tutorial |
| RS-VH-03 | Village Hub | (10, 17) | Yes | Joy | Light | 1 | MQ-02 tutorial |
| RS-VH-04 | Village Hub | (11, 16) | Yes | Sorrow | Neutral | 1 | SQ-01 broadcast target |
| RS-VH-05 | Village Hub | (21, 15) | Yes | Calm | Neutral | 2 | After SQ-12 dream 5 |
| RS-HF-01 | Heartfield | (18, 14) | Yes | Joy | Earth | 1 | Always |
| RS-HF-02 | Heartfield | (31, 9) | Yes | Awe | Wind | 2 | Always |
| RS-HF-03 | Heartfield | (35, 30) | Yes | Sorrow | Dark | 1 | Always |
| RS-HF-04 | Heartfield | (8, 30) | Yes | Calm | Earth | 1 | Hidden behind tree |
| RS-AG-01 | Ambergrove | (18, 8) | Yes | Awe | Earth | 2 | Always |
| RS-AG-02 | Ambergrove | (22, 8) | Yes | Joy | Earth | 2 | Always |
| RS-AG-03 | Ambergrove | (20, 12) | Yes | Calm | Wind | 2 | Always |
| RS-AG-04 | Ambergrove | (30, 27) | Yes | Awe | Water | 2 | Dormant until Act II |
| RS-AG-05 | Ambergrove | (15, 5) | Yes | Fury | Earth | 1 | Hidden in dense forest |
| RS-MB-01 | Millbrook | (21, 19) | Yes | Joy | Water | 2 | Always |
| RS-MB-02 | Millbrook | (7, 4) | Yes | Awe | Water | 3 | Behind falls (hidden) |
| RS-MB-03 | Millbrook | (30, 30) | Yes | Calm | Water | 1 | Always |
| RS-MB-04 | Millbrook | (8, 5) | Yes | Sorrow | Water | 3 | Inside falls cave (SQ-04) |
| RS-SR-01 | Sunridge | (9, 7) | Yes | Fury | Wind | 2 | Dormant until Act II |
| RS-SR-02 | Sunridge | (20, 20) | Yes | Calm | Earth | 1 | Always |
| RS-SR-03 | Sunridge | (35, 5) | Yes | Awe | Wind | 2 | Requires climb |
| RS-SM-01 | Shimmer Marsh | (11, 14) | Yes | Sorrow | Water | 2 | Always |
| RS-SM-03 | Shimmer Marsh | (40, 12) | Yes | Fury | Water | 2 | After bog break |
| RS-SM-04 | Shimmer Marsh | (20, 25) | Yes | Calm | Earth | 2 | Always |
| RS-SM-05 | Shimmer Marsh | (30, 20) | Yes | Sorrow | Water | 3 | Deep marsh |
| RS-SM-06 | Shimmer Marsh | (15, 40) | Yes | Joy | Earth | 2 | Always |
| RS-HR-02 | Hollow Ridge | (14, 24) | Yes | Fury | Fire | 2 | Always |
| RS-HR-03 | Hollow Ridge | (6, 6) | Yes | Awe | Wind | 3 | Ridge Overlook |
| RS-HR-04 | Hollow Ridge | (35, 30) | Yes | Sorrow | Earth | 2 | Always |
| RS-HR-05 | Hollow Ridge | (40, 5) | Yes | Fury | Earth | 3 | Echo Caverns entrance |
| RS-FV-02 | Flickerveil | (8, 8) | Yes | Awe | Light | 3 | Archive stone 1 |
| RS-FV-03 | Flickerveil | (9, 10) | Yes | Sorrow | Light | 3 | Archive stone 2 |
| RS-FV-04 | Flickerveil | (10, 9) | Yes | Joy | Light | 2 | Archive stone 3 |
| RS-FV-05 | Flickerveil | (7, 9) | Yes | Fury | Light | 3 | Archive stone 4 |
| RS-FV-06 | Flickerveil | (9, 7) | Yes | Calm | Light | 3 | Archive stone 5 |
| RS-FV-07 | Flickerveil | (35, 30) | Yes | Calm | Neutral | 2 | Village center |
| RS-FV-08 | Flickerveil | (45, 24) | Yes | Awe | Wind | 2 | Veil's Edge |
| RS-RF-02 | Resonance Fields | (10, 10) | Yes | Awe | Wind | 2 | NW standing stone |
| RS-RF-03 | Resonance Fields | (35, 8) | Yes | Fury | Wind | 2 | Near Cathedral (contested) |
| RS-RF-04 | Resonance Fields | (15, 45) | Yes | Calm | Earth | 2 | SW corner |
| RS-RF-05 | Resonance Fields | (45, 40) | Yes | Sorrow | Wind | 3 | SE corner |
| RS-RF-06 | Resonance Fields | (8, 34) | Yes | Joy | Wind | 2 | Listener's Camp |
| RS-LW-01 | Luminous Wastes | (20, 20) | Yes | Various | Various | 3-4 | After solidification (×3) |
| RS-LW-02 | Luminous Wastes | (4, 18) | Yes | Calm | Neutral | 4 | The Edge, world's boundary |
| RS-LW-03 | Luminous Wastes | (30, 35) | Yes | Sorrow | Neutral | 3 | South plains |
| RS-UP-01 | Undrawn Peaks | (19, 4) | Yes | Awe | Wind | 4 | Apex summit |
| RS-UP-03 | Undrawn Peaks | (10, 15) | Yes | Fury | Fire | 3 | Mountain ledge |
| RS-UP-04 | Undrawn Peaks | (30, 25) | Yes | Sorrow | Earth | 3 | East ridge |
| RS-HF2-01 | Half-Drawn Forest | (20, 25) | Yes | Created | — | — | After Living Sketch solidification |
| RS-HF2-02 | Half-Drawn Forest | (28, 9) | Yes | Awe | Neutral | 3 | Archive of Intentions (×2) |
| RS-HF2-03 | Half-Drawn Forest | (29, 10) | Yes | Sorrow | Light | 3 | Archive of Intentions |
| RS-HF2-04 | Half-Drawn Forest | (10, 15) | Yes | Calm | Earth | 3 | West path |
| RS-HF2-05 | Half-Drawn Forest | (35, 30) | Yes | Fury | Wind | 3 | East clearing |

### Recall Pedestals (4 Gods)

| Stone ID | Map | Position | God | Emotion Options | Quest |
|----------|-----|----------|-----|----------------|-------|
| RS-SM-02 | Shimmer Marsh | (25, 35) | Verdance | Joy / Fury / Sorrow / Awe | GQ-02 |
| RS-HR-01 | Hollow Ridge | (24, 10) | Kinesis | Joy / Fury / Sorrow / Awe | GQ-04 |
| RS-FV-01 | Flickerveil | (20, 20) | Luminos | Joy / Fury / Sorrow / Awe | GQ-03 |
| RS-RF-01 | Resonance Fields | (25, 25) | Resonance | Joy / Fury / Sorrow / Awe | GQ-01 |

### Broadcast Targets (Not Fragment-Bearing)

| Stone ID | Map | Position | Purpose | Quest |
|----------|-----|----------|---------|-------|
| RS-UP-02 | Undrawn Peaks | (19, 34) | Fortress Gate solidification | MQ-08 |
| RS-UP-05 | Undrawn Peaks | (20, 20) | Sketch Bridge solidification | MQ-08 |
| SQ-06 targets A-C | Shimmer Marsh | (20,10), (35,25), (25,42) | Dormant stone broadcasts | SQ-06 |
| SQ-09 stones | Resonance Fields | (18,28), (22,20), (28,22) | Harmonization targets | SQ-09 |
| RS-RF-07-11 | Resonance Fields | (28-33, 43) | Singing Stones (×5 sequential) | — (Depths L4 entrance) |
| MQ-08 trail stones | Half-Drawn Forest | (5,20), (12,18), (20,15), (28,17), (35,20) | Navigation trail (×5) | MQ-08 |

### Dungeon Resonance Stones

| Event ID | Map | Position | Fragment | Emotion | Element | Potency | Notes |
|----------|-----|----------|----------|---------|---------|---------|-------|
| EV-D1-003 | Depths L1 R1 | (17, 4) | Yes | Calm | Earth | 1 | Cracked stone |
| EV-D1-004 | Depths L1 R2 | (4, 9) | Yes | Sorrow | Neutral | 2 | — |
| EV-D1-008 | Depths L1 R4 | (15, 14) | Yes | Joy | Neutral | 2 | — |
| EV-D2-003 | Depths L2 R2 | (4, 7) | Yes | Sorrow | Water | 2 | Half-submerged |
| EV-D2-005 | Depths L2 R3 | (15, 7) | Burdened | — | — | — | GQ-02-S1 (yields ×2 pot. 3) |
| EV-D2-008 | Depths L2 R4 | (17, 11) | Yes | Awe | Water | 3 | Floating |
| EV-D2-014 | Depths L2 R6 | (13, 15) | Rest | — | — | — | Full HP/SP (reusable) |
| EV-D3-003 | Depths L3 R2 | (2, 6) | Yes | Awe | Wind | 3 | — |
| EV-D3-004 | Depths L3 R3 | (7, 6) | Burdened | — | — | — | GQ-02-S1 (yields ×2 pot. 3) |
| EV-D3-012 | Depths L3 R5 | (10, 10) | Yes | Fury | Earth | 3 | — |
| EV-D3-016 | Depths L3 R6 | (6, 16) | Yes | Sorrow | Earth | 2 | — |
| EV-D4-003 | Depths L4 R1 | (5, 3) | Yes | Awe | Wind | 3 | — |
| EV-D4-004 | Depths L4 R2 | (15, 7) | Burdened | — | — | — | GQ-02-S1 final (3/3, yields ×2 pot. 3) |
| EV-D4-007 | Depths L4 R3 | (2, 6) | Rest | — | — | — | Full HP/SP (reusable) |
| EV-D4-008 | Depths L4 R4 | (5, 12) | Yes | Fury | Fire | 3 | — |
| EV-D5-003 | Depths L5 R2 | (2, 6) | Yes | Awe | Light | 4 | Inverted chamber |
| EV-D5-008 | Depths L5 R5 | (5, 10) | Rest | — | — | — | Full HP/SP (reusable) |
| EV-D5-009 | Depths L5 R5 | (17, 11) | Yes | Calm | Neutral | 4 | — |
| EV-D5-013 | Depths L5 R8 | (12, 14) | Yes | Joy | Light | 4 | Fragment Vault A |
| EV-D5-014 | Depths L5 R8 | (13, 16) | Yes | Fury | Fire | 4 | Fragment Vault B |
| EV-D5-015 | Depths L5 R8 | (12, 16) | Yes | Sorrow | Dark | 4 | Fragment Vault C |
| EV-F1-004 | Fortress F1 R2 | (2, 7) | Yes | Sorrow | Dark | 3 | Behind crystal barrier |
| EV-F1-013 | Fortress F1 R5 | (5, 11) | Rest | — | — | — | Full HP/SP (reusable) |
| EV-F2-012 | Fortress F2 R4 | (5, 12) | Yes | Calm | Dark | 4 | — |
| EV-F2-014 | Fortress F2 R5 | (3, 17) | Rest | — | — | — | Full HP/SP (reusable) |
| EV-F3-006 | Fortress F3 R1 | (10, 6) | Rest | — | — | — | Full HP/SP (pre-confrontation) |

---

## Section 9: Parallel / Ambient Events

Events that run continuously while the player is on a map.

| Event ID | Map | Position | Description |
|----------|-----|----------|-------------|
| EV-VH-015 | Village Hub | (14, 15) | Fountain vibrancy check: particle effects scale with zone vibrancy |
| EV-FV-011 | Flickerveil | (20, 20) | Light column visual effect: intensity scales with vibrancy |
| EV-RF-010 | Resonance Fields | (25, 25) | Amphitheater ambient hum: intensity scales with vibrancy |

---

## Section 10: Frontier-Specific Mechanics

Events unique to Frontier and Sketch zone broadcasting mechanics. Full specifications in [frontier-zones.md](frontier-zones.md).

### Painted Detail Effect Triggers

When a player broadcasts in any Frontier zone, tiles within the bloom radius receive a permanent visual tier upgrade (one tier above zone's current vibrancy tier). This effect spreads to adjacent tiles at 1 tile/60 seconds real time while the player is in the zone.

| Map | Starting Vibrancy | Resonant Emotion | Element Affinity | Max Bonus |
|-----|------------------|------------------|-----------------|-----------|
| Shimmer Marsh | 30 | Sorrow | Water | +5 |
| Hollow Ridge | 20 | Fury | Fire | +5 |
| Flickerveil | 25 | Awe | Wind | +5 |
| Resonance Fields | 15 | Awe | Wind | +5 |

### Sketch Solidification Events

When a player broadcasts in Sketch zones, outline terrain becomes traversable. Collision layer updates.

| Event ID | Map | Position | Potency Req. | Radius | Quest | Notes |
|----------|-----|----------|-------------|--------|-------|-------|
| EV-LW-001 | Luminous Wastes | (18, 18) | 2+ (×3 broadcasts) | — | MQ-08 | Half-Built Village: 3 broadcasts to solidify |
| EV-UP-002 | Undrawn Peaks | (20, 20) | 2+ | 5×5 | MQ-08 | Sketch Bridge solidification |
| EV-UP-003 | Undrawn Peaks | (19, 34) | 3+ | — | MQ-08 | Fortress Gate approach solidification |
| EV-HDF-001 | Half-Drawn Forest | (20, 25) | 3+ | 6×6 | MQ-08 | Living Sketch: locks in forest section |
| — | Undrawn Peaks | throughout | 1+ per handhold | 3×3 each | — | Wireframe Ridges: ~5 broadcasts to traverse |

### Solidification Area by Potency

| Fragment Potency | Solidification Radius | Tiles Solidified |
|-----------------|----------------------|-----------------|
| 1 star | 3×3 | 9 |
| 2 stars | 5×5 | 25 |
| 3 stars | 7×7 | 49 |
| 4 stars | 9×9 | 81 |
| 5 stars | 11×11 | 121 |

---

## Section 11: Stagnation Zone Events

Complete stagnation break event sequences. Full zone details in [stagnation-zones.md](stagnation-zones.md).

| Zone | Map | Focal Point | Unlock Requirement | Break Sequence | Post-Break Combat | Vibrancy Reward |
|------|-----|-------------|-------------------|---------------|-------------------|----------------|
| Heartfield Clearing | Heartfield | (35, 29) | Any pot. 1+ | Lira flashback → broadcast → shatter | None (tutorial) | +10 |
| Sunridge Outpost | Sunridge | (32, 14) | Fury pot. 2+ | Broadcast → shatter → combat | 2 Scouts (E-PV-01) | +10 |
| Shimmer Marsh Bog | Shimmer Marsh | (41, 10) | Fury+Water pot. 3+ | Navigate crystals → broadcast → shatter → combat | 2 Scouts + 1 Agent (E-PV-02) | +10 |
| Hollow Ridge Pass | Hollow Ridge | (37, 30) | Earth→Fire→Wind seq. | Waypoint 1 → 2 → 3 → gate shatters → combat | 3 Agents (E-PV-02) | +10 |
| Resonance Cathedral | Resonance Fields | (42, 15) | K-15 gate + Awe pot. 4+ | Present K-15 → enter → broadcast → sound explosion → combat | 3 Agents + 1 Captain (E-PV-03) | +10 |
| Luminous Watchtower | Luminous Wastes | (34, 8) | Any pot. 5 | Open gate (any pot. 1+) → navigate → broadcast 5-star → tower collapses → combat | 2 Archivists (E-PV-04) | +10 + 5-tile solidification |
| Fortress Gate | Undrawn Peaks | (19, 34) | MQ-08 + any pot. 3+ | Broadcast at RS-UP-02 → Sketch solidifies → Captains step aside | None | 0 |

### Preserver Reinforcement Rates (Pre-Break)

| Zone | Map | Rate | Vibrancy Floor | Time to Floor (from start) |
|------|-----|------|---------------|---------------------------|
| Heartfield Clearing | Heartfield | -1 / 5 min | 40 | 75 min (from 55) |
| Sunridge Outpost | Sunridge | -2 / 5 min | 25 | 37.5 min (from 40) |
| Shimmer Marsh Bog | Shimmer Marsh | -2 / 5 min | 15 | 37.5 min (from 30) |
| Hollow Ridge Pass | Hollow Ridge | -3 / 5 min | 10 | 16.7 min (from 20) |
| Resonance Cathedral | Resonance Fields | -3 / 5 min | 5 | 16.7 min (from 15) |
| Luminous Watchtower | Luminous Wastes | -4 / 5 min | 0 | 6.25 min (from 5) |
| Fortress Gate | Undrawn Peaks | Locked at 0 | 0 | N/A |

---

## Section 12: Event Count Summary

### Per-Map Event Totals

| Map | NPCs | Chests | Transitions | Cutscenes | Puzzles | Resonance Stones | Combat | Parallel | Total |
|-----|------|--------|-------------|-----------|---------|-----------------|--------|----------|-------|
| Village Hub | 7 | 2 | 5 | 2 | 0 | 5 | 0 | 1 | 16 |
| Heartfield | 3 | 3 | 3 | 1 | 0 | 4 | 1 | 0 | 9 |
| Ambergrove | 2 | 3 | 3 | 0 | 0 | 5 | 0 | 0 | 8 |
| Millbrook | 2 | 3 | 3 | 0 | 0 | 4 | 0 | 0 | 7 |
| Sunridge | 2 | 3 | 3 | 0 | 0 | 3 | 0 | 0 | 6 |
| Shimmer Marsh | 1 | 3 | 5 | 1 | 1 | 9 | 0 | 0 | 11 |
| Hollow Ridge | 3 | 3 | 5 | 1 | 1 | 5 | 0 | 0 | 11 |
| Flickerveil | 3 | 3 | 4 | 1 | 0 | 8 | 0 | 1 | 12 |
| Resonance Fields | 1 | 3 | 3 | 1 | 1 | 8+ | 0 | 1 | 10 |
| Luminous Wastes | 0 | 0 | 3 | 0 | 1 | 3 | 0 | 0 | 5 |
| Undrawn Peaks | 2 | 0 | 3 | 0 | 2 | 5 | 0 | 0 | 6 |
| Half-Drawn Forest | 0 | 3 | 4 | 0 | 2 | 8+ | 0 | 0 | 7 |
| Depths L1 | 0 | 2 | 2 | 1 | 0 | 3 | 1 | 0 | 12 |
| Depths L2 | 0 | 4 | 2 | 2 | 1 | 4 | 1 | 0 | 19 |
| Depths L3 | 0 | 4 | 2 | 2 | 2 | 4 | 1 | 0 | 21 |
| Depths L4 | 0 | 5 | 2 | 2 | 0 | 4 | 2 | 0 | 18 |
| Depths L5 | 0 | 5 | 2 | 3 | 1 | 6 | 1 | 0 | 22 |
| Fortress F1 | 0 | 2 | 2 | 0 | 1 | 2 | 2 | 0 | 19 |
| Fortress F2 | 0 | 3 | 2 | 3 | 1 | 2 | 2 | 0 | 20 |
| Fortress F3 | 0 | 0 | 2 | 5 | 1 | 1 | 0 | 0 | 13 |
| **Totals** | **26** | **54** | **60** | **25** | **15** | **93+** | **11** | **3** | **~252** |

### Event Type Distribution

| Category | Count | Description |
|----------|-------|-------------|
| NPC dialogue | 26 | Unique NPC interaction events |
| Treasure chests | 54 | 28 overworld + 25 dungeon + 1 stagnation loot |
| Map transitions | 60 | 38 overworld + 22 dungeon floor connections |
| Cutscene / lore | 25 | Cinematics, vignettes, lore inscriptions |
| Puzzle mechanics | 15 | 7 dungeon + 7 stagnation + 1 overworld (singing stones) |
| Resonance Stones | 93+ | 52 fragment-bearing + 4 recall + ~19 quest targets + rest points |
| Boss / forced combat | 11 | 7 bosses + 4 forced encounters |
| Parallel / ambient | 3 | Continuous vibrancy-scaled effects |
| **Grand Total** | **~252** | Unique wirable events across 20 maps |

### Quest → Event Cross-Reference

| Quest | Event IDs | Maps Touched |
|-------|-----------|-------------|
| MQ-01 | EV-VH-001, 002, 016 | Village Hub |
| MQ-02 | EV-VH-002, 003, 004 | Village Hub |
| MQ-03 | EV-HF-001, AG-001, MB-001 | Heartfield, Ambergrove, Millbrook |
| MQ-04 | EV-HF-003, 004, 005 | Heartfield |
| MQ-05 | EV-SM-001, HR-001 | Shimmer Marsh, Hollow Ridge |
| MQ-06 | (God recall events — see Section 6) | Varies by god |
| MQ-07 | (Transitions unlock) | All Sketch borders |
| MQ-08 | EV-UP-002, 003, LW-001, HDF-001, 007 | Undrawn Peaks, Luminous Wastes, Half-Drawn Forest |
| MQ-09 | EV-F1-001 through F3-009 | Fortress F1-F3 |
| MQ-10 | EV-F3-009, 010, 011, 012 | Fortress F3 |
| SQ-01 | EV-VH-005 | Village Hub |
| SQ-02 | EV-HF-001, 002 | Heartfield |
| SQ-03 | EV-AG-001, 008 | Ambergrove |
| SQ-04 | EV-MB-001, 002 | Millbrook |
| SQ-05 | EV-SR-001 | Sunridge |
| SQ-06 | EV-SM-001, 010 | Shimmer Marsh |
| SQ-07 | EV-HR-001, 011 | Hollow Ridge |
| SQ-08 | EV-FV-001, 012 | Flickerveil |
| SQ-09 | EV-RF-001, 002 | Resonance Fields |
| SQ-10 | EV-D1-002, 006, 007 | Depths L1 |
| SQ-11 | EV-VH-006, D2-006 | Village Hub, Depths L2 |
| SQ-12 | EV-VH-007 | Village Hub |
| SQ-13 | EV-RF-001 | Resonance Fields |
| SQ-14 | EV-HF-004, 009 | Heartfield |
| GQ-01 | EV-RF-002, 003, 004, 005 | Resonance Fields |
| GQ-02 | EV-SM-001, 002, 003, 004 | Shimmer Marsh |
| GQ-03 | EV-FV-001, 003, 004, 005, 006 | Flickerveil |
| GQ-04 | EV-HR-001, 003, 004 | Hollow Ridge |
| GQ-02-S1 | EV-D2-005, D3-004, D4-004 | Depths L2, L3, L4 |
| GQ-03-F2 | EV-D5-018 | Depths L5 |

---

## Implementation Notes for Phase 2

### RPG-JS Event Wiring Pattern

Each event in this table maps to an RPG-JS event in the `events` layer of the corresponding Tiled TMX map. The general pattern:

```typescript
@EventData({
  name: 'EV-VH-001',
  hitbox: { width: 32, height: 32 }
})
class EventVH001 extends RpgEvent {
  onAction(player: RpgPlayer) {
    // Check quest state, trigger dialogue, give items
  }
}
```

### Event Priority Order (When Multiple Events Overlap)

1. **Quest-gated events** take priority over repeatable events at the same position
2. **Auto events** fire before touch/action events on the same tile
3. **One-time events** are marked in a persistent `completed_events` set per save file
4. **Parallel events** run independently of all other event types

### Conditional Event Visibility

Events with quest-gate conditions should be invisible (no graphic, no interaction) until their condition is met. Use RPG-JS `visible: false` + condition check in `onChanges()` to show events when appropriate.

### Stagnation Zone Event Lifecycle

Stagnation zone events have a specific lifecycle that requires careful state management:

1. **Pre-break**: Stagnation overlay tiles active, reinforcement timer running, NPC frozen sprites displayed
2. **During break**: 2-second shatter animation, overlay removal, NPC sprite swap, combat trigger
3. **Post-break**: Overlay permanently removed, reinforcement timer stopped, zone vibrancy +10, post-break NPCs/objects activated
4. **Save state**: `stagnation_zones_broken: Set<string>` in save data

### Resonance Stone Fragment Depletion

Fragment-bearing Resonance Stones are one-time collection events. After collection, the stone remains visible but dims (no glow) and triggers a "This stone has no more memories to share" dialogue. Rest-point stones remain functional indefinitely.
