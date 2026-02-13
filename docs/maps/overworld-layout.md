# Overworld Layout: Zone-by-Zone Map Specifications

> Cross-references: [docs/world/geography.md](../world/geography.md), [docs/story/quest-chains.md](../story/quest-chains.md), [docs/story/dialogue-bank.md](../story/dialogue-bank.md), [docs/design/enemies-catalog.md](../design/enemies-catalog.md), [docs/design/items-catalog.md](../design/items-catalog.md), [docs/design/tileset-spec.md](../design/tileset-spec.md), [docs/world/dormant-gods.md](../world/dormant-gods.md), [docs/world/vibrancy-system.md](../world/vibrancy-system.md)

## Overview

This document is the **map implementation blueprint** for every overworld zone in Mnemonic Realms. It specifies NPC placements, enemy spawn zones, Resonance Stone positions, treasure chest contents, map transitions, and event triggers — everything needed to build each Tiled TMX map and wire RPG-JS events.

All coordinates use **(x, y)** in tile units with (0, 0) at the top-left corner. All maps use **32x32 pixel tiles** (see [tileset-spec.md](../design/tileset-spec.md)).

### World Structure

The world consists of **17 overworld maps** organized in concentric rings plus underground layers:

| Ring | Maps | Tile Size | Total Tiles | Act |
|------|------|-----------|-------------|-----|
| Center | Village Hub (1) | 30x30 | 900 | I |
| Inner | Settled Lands (4) | 40x40 each | 6,400 | I |
| Middle | Frontier (4) | 50x50 each | 10,000 | II |
| Outer | The Sketch (3) | 40x40 each | 4,800 | III |
| Underground | Depths (5 floors + 3-floor fortress) | 20x25 each | 4,000 | I-III |
| **Total** | **17 surface + 8 underground** | | **~26,100** | |

Depths and Fortress layouts are covered in [dungeon-depths.md](dungeon-depths.md).

### Map Layers (Per Tiled TMX)

Every map uses these standard layers:

| Layer | Z-Order | Purpose |
|-------|---------|---------|
| `ground` | 0 | Base terrain tiles (grass, stone, water) |
| `ground2` | 1 | Ground detail (flowers, cracks, puddles) |
| `objects` | 2 | Buildings, trees, rocks, fences |
| `objects_upper` | 3 | Canopy, rooftops, bridge supports (renders above player) |
| `collision` | — | Invisible collision boundaries |
| `events` | — | Event trigger zones (invisible, RPG-JS event layer) |

### Event Trigger Types

| Type | RPG-JS Hook | Description |
|------|-------------|-------------|
| `touch` | `onPlayerInput('action')` | Triggered when player steps on tile |
| `action` | `onAction()` | Triggered when player presses action button facing the event |
| `auto` | `onInit()` | Triggered automatically when map loads (conditional) |
| `parallel` | `onChanges()` | Runs continuously while on map (vibrancy checks) |

---

## Map 1: Village Hub

**File**: `village-hub.tmx` | **Size**: 30x30 tiles (960x960 px) | **Tileset**: `tiles_village_{tier}.png`

**Starting Vibrancy**: 50 (Normal tier)

### Layout Diagram

```
  0         5        10        15        20        25     29
0 ┌─────────────────────────────────────────────────────────┐
  │  trees   trees    trees    trees    trees    trees      │
2 │       ┌──────────────┐                                  │
  │       │  Lookout Hill │  Callum's telescope (14,3)      │
4 │       │  (12,2) 6x5  │                                  │
  │       └──────────────┘                                  │
6 │          path                                           │
  │          ║                                              │
8 │  ┌────────────┐        ┌──────────┐                    │
  │  │  Training   │        │  Elder's  │                    │
10│  │  Ground     │  path  │  House    │                    │
  │  │  (8,10) 6x5│════════│ (18,10)5x5│                    │
12│  └────────────┘        └──────────┘                    │
  │       ║                      ║                          │
  │  ┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
14│  │  Quest  │  │  Central  │  │  Central  │  │   Inn    │ │
  │  │  Board  │  │  Square   │  │  Square   │  │  Bright  │ │
  │  │(8,14)3x3│  │ (12,14)   │  │   6x6     │  │  Hearth  │ │
  │  └────────┘  │           │  │  fountain  │  │(20,14)5x4│ │
16│  ┌────────┐  │  (14,15)  │  │  at center │  └──────────┘ │
  │  │Memorial│  │ Resonance │  │           │                │
  │  │ Garden │  │  Stone    │  └──────────┘                │
  │  │(8,16)4x3│  └──────────┘       ║                      │
18│  │         │               ┌──────────┐  ┌──────────┐  │
  │  └────────┘               │  General  │  │Blacksmith│  │
  │  ┌────────┐               │   Shop    │  │  Torvan  │  │
  │  │ Lira's │               │(18,16) 5x4│  │(18,18)4x4│  │
20│  │Workshop│               └──────────┘  └──────────┘  │
  │  │(8,18)5x4│                                           │
  │  └────────┘                                            │
22│       ║                                                │
  │       path                                             │
24│  ═══════════════════════════════════════════            │
  │              South Gate (15,25)                         │
26│                   ║                                    │
  │              → Heartfield                              │
28│                                                        │
  │  trees   trees    trees    trees    trees    trees      │
30└─────────────────────────────────────────────────────────┘
```

### NPC Placements

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Callum | (19, 11) | Patrols: Elder's House ↔ Lookout Hill (12, 3) on 60s cycle | `npc_callum` | MQ-01, MQ-03, MQ-05, MQ-07, SQ-10, SQ-14 |
| Lira | (9, 19) | Static at workshop until MQ-02 complete; roams village after | `npc_lira` | MQ-01, MQ-02 |
| Maren (shopkeeper) | (19, 17) | Static behind shop counter | `npc_maren` | SQ-01 |
| Torvan (blacksmith) | (19, 19) | Static at anvil | `npc_torvan` | SQ-11 |
| Ren (innkeeper) | (21, 15) | Static behind inn bar | `npc_ren` | SQ-12 |
| Villager A | (14, 15) | Wanders Central Square (12-17, 14-19) | `npc_villager_m1` | — |
| Villager B | (16, 16) | Wanders Central Square | `npc_villager_f1` | — |
| Villager C | (10, 22) | Patrols South Gate road | `npc_villager_m2` | — |

### Resonance Stones

| ID | Position | Type | Fragments Available | Notes |
|----|----------|------|---------------------|-------|
| RS-VH-01 | (14, 15) | Fountain stone | 1 environmental fragment (joy/neutral/1) | Central Square fountain; glows at Normal+ vibrancy |
| RS-VH-02 | (9, 16) | Memorial stone | 1 fragment (calm/earth/1) | Memorial Garden left stone; MQ-02 tutorial target |
| RS-VH-03 | (10, 17) | Memorial stone | 1 fragment (joy/light/1) | Memorial Garden center stone; MQ-02 tutorial target |
| RS-VH-04 | (11, 16) | Memorial stone | 1 fragment (sorrow/neutral/1) | Memorial Garden right stone; SQ-01 broadcast target |
| RS-VH-05 | (21, 15) | Hidden hearth stone | 1 fragment (calm/neutral/2) | Behind inn fireplace; revealed after SQ-12 dream 5 |

### Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-VH-01 | (13, 3) | Minor Potion (C-HP-01) x2 | Lookout Hill, always available |
| CH-VH-02 | (9, 11) | Mana Drop (C-SP-01) x2 | Training Ground, after MQ-01 |

### Enemy Spawns

None. Village Hub is a safe zone with no combat encounters.

### Map Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-VH-001 | (19, 11) | action | MQ-01 | MQ-01 | Callum intro dialogue; gives Architect's Signet direction |
| EV-VH-002 | (9, 19) | action | MQ-01 | MQ-01, MQ-02 | Lira gives Architect's Signet (K-01); teaches memory ops |
| EV-VH-003 | (10, 17) | action | MQ-02 | MQ-02 | Memorial Garden Resonance Stone; first fragment collection (MF-01) |
| EV-VH-004 | (10, 17) | action | MQ-02 | MQ-02 | Remix Table tutorial; broadcast tutorial |
| EV-VH-005 | (19, 17) | action | always | SQ-01 | Maren shop interface + SQ-01 dialogue trigger |
| EV-VH-006 | (19, 19) | action | always | SQ-11 | Torvan shop interface + SQ-11 trigger (vibrancy 70+) |
| EV-VH-007 | (21, 15) | action | always | SQ-12 | Ren inn: rest + dream sequence trigger |
| EV-VH-008 | (8, 14) | action | MQ-03+ | — | Quest Board: displays available side quests |
| EV-VH-009 | (15, 25) | touch | always | — | South Gate transition → Heartfield (15, 0) |
| EV-VH-010 | (29, 14) | touch | always | — | East Gate transition → Ambergrove (0, 20) |
| EV-VH-011 | (0, 14) | touch | always | — | West Gate transition → Millbrook (39, 20) |
| EV-VH-012 | (15, 0) | touch | MQ-04+ | — | North Gate transition → Sunridge (20, 39); locked until Act II |
| EV-VH-013 | (12, 3) | action | always | — | Callum's telescope: narrative lookout over Settled Lands |
| EV-VH-014 | (8, 17) | touch | MQ-05+ | SQ-10 | Hidden Depths entrance under Memorial Garden → Depths L1 |
| EV-VH-015 | (14, 15) | parallel | always | — | Fountain vibrancy check: particle effects scale with zone vibrancy |
| EV-VH-016 | (0, 0) | auto | MQ-01 | MQ-01 | Opening cutscene trigger on first map load |

### Map Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (15, 25) | South | Heartfield | (15, 0) | Always open |
| (29, 14) | East | Ambergrove | (0, 20) | Always open |
| (0, 14) | West | Millbrook | (39, 20) | Always open |
| (15, 0) | North | Sunridge | (20, 39) | After MQ-04 (mountain pass opens) |
| (8, 17) | Down | Depths Level 1 | (10, 0) | After MQ-05 (hidden entrance revealed) |

---

## Map 2A: Heartfield (South Settled Lands)

**File**: `heartfield.tmx` | **Size**: 40x40 tiles (1280x1280 px) | **Tileset**: `tiles_grassland_{tier}.png`

**Starting Vibrancy**: 55 (Normal tier)

### Layout Overview

Rolling farmland with golden wheat fields, vegetable patches, and a small hamlet of 4-5 farmsteads in the center. The Stagnation Clearing is in the northeast — the first encounter with Preserver-frozen land.

### Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| Heartfield Hamlet | (13, 13) | 10x10 | 5 farmsteads, well, cart path. NPC cluster. |
| The Old Windmill | (30, 8) | 4x5 | Hilltop windmill. SQ-02 dungeon entrance. Sails turn at vibrancy 50+. |
| Stagnation Clearing | (33, 28) | 5x5 | Crystallized grass, frozen butterflies. MQ-04 climax location. |
| Southern Crossroads | (20, 38) | 3x3 | Road junction. Locked transition to Frontier (Act II). |
| Wheat Fields (west) | (2, 5) | 12x15 | Dense wheat; Meadow Sprite + Grass Serpent spawn zone |
| Wheat Fields (east) | (22, 5) | 10x12 | Sparser wheat; Grass Serpent spawn zone |
| Stream | (5, 20) → (5, 35) | 2-wide | Irrigation stream running N-S on west side |

### NPC Placements

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Farmer Gale | (15, 14) | Patrols hamlet (13-22, 13-22) | `npc_farmer_m1` | SQ-02, MQ-03 |
| Farmer Suri | (17, 16) | Static at farmstead | `npc_farmer_f1` | MQ-03 (exploration confirmation) |
| Farmer Edric | (14, 18) | Patrols fields (10-20, 18-25) | `npc_farmer_m2` | — |
| Hamlet Elder | (18, 14) | Static at hamlet well | `npc_elder_f1` | — (lore dialogue) |
| Child NPC | (16, 15) | Wanders hamlet | `npc_child_01` | — (appears after Solara recall) |

### Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-HF-01 | (18, 14) | 1 fragment (joy/earth/1) | Hamlet well stone |
| RS-HF-02 | (31, 9) | 1 fragment (awe/wind/2) | Windmill hilltop stone |
| RS-HF-03 | (35, 30) | 1 fragment (sorrow/dark/1) | Stagnation Clearing edge |
| RS-HF-04 | (8, 30) | 1 fragment (calm/earth/1) | Stream bank; hidden behind tree |

### Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-HF-01 | (32, 9) | Antidote (C-SC-01) x3 | Inside windmill ground floor |
| CH-HF-02 | (5, 10) | Minor Potion (C-HP-01) x2 | Hidden in wheat field |
| CH-HF-03 | (36, 25) | Smoke Bomb (C-SP-05) x2 | Near stagnation clearing approach |

### Enemy Spawn Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Wheat Fields West | (2, 5) → (14, 20) | Meadow Sprite (E-SL-01), Grass Serpent (E-SL-02) | 1-3 | Common: 1 Sprite; Standard: 1 Sprite + 1 Serpent |
| Wheat Fields East | (22, 5) → (32, 17) | Grass Serpent (E-SL-02) | 2-3 | Common: 1 Serpent; Standard: 2 Serpents |
| Stagnation Approach | (28, 25) → (38, 33) | Preserver Scout (after MQ-04) | 8-10 | Rare: 1 Preserver Scout (MQ-04 event only) |

### Map Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-HF-001 | (15, 14) | action | MQ-03+ | SQ-02 | Farmer Gale: windmill groaning dialogue; SQ-02 trigger |
| EV-HF-002 | (30, 8) | touch | SQ-02 | SQ-02 | Old Windmill entrance; Dissolved Memory encounter inside |
| EV-HF-003 | (33, 28) | auto | MQ-04 | MQ-04 | Stagnation Clearing cutscene: Lira's freezing |
| EV-HF-004 | (34, 29) | action | MQ-04+ | MQ-04 | Lira's frozen form; broadcast target for SQ-14 |
| EV-HF-005 | (20, 38) | touch | MQ-04+ | — | Southern Crossroads transition → Shimmer Marsh (20, 0) |
| EV-HF-006 | (15, 0) | touch | always | — | North edge transition → Village Hub (15, 25) |
| EV-HF-007 | (39, 20) | touch | always | — | East edge transition → Ambergrove (0, 20) |
| EV-HF-008 | (31, 9) | action | always | — | Windmill Resonance Stone; fragment collection |
| EV-HF-009 | (34, 29) | action | SQ-14 | SQ-14 | Broadcast joy 4+ fragment into Lira; partial awakening |

### Map Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (15, 0) | North | Village Hub | (15, 25) | Always |
| (39, 20) | East | Ambergrove | (0, 20) | Always |
| (20, 38) | South | Shimmer Marsh | (20, 0) | After MQ-04 |

---

## Map 2B: Ambergrove (East Settled Lands)

**File**: `ambergrove.tmx` | **Size**: 40x40 tiles (1280x1280 px) | **Tileset**: `tiles_forest_{tier}.png`

**Starting Vibrancy**: 45 (Normal tier)

### Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| Hearthstone Circle | (18, 8) | 6x6 | Ring of standing Resonance Stones in a clearing. Rich fragment source. |
| Amber Lake | (28, 23) | 8x8 | Forest lake with submerged Resonance Stone at center (30, 27). |
| Woodcutter's Camp | (8, 28) | 6x5 | 3 NPCs, woodworking tools, tents. SQ-03 quest hub. |
| Eastern Canopy Path | (36, 18) | 4x10 | Elevated tree-bridge. Partially dissolved sections shimmer. |
| Dense Forest (north) | (5, 2) → (35, 15) | — | Primary enemy spawn zone |
| Mossy Clearing | (20, 20) | 4x4 | Open clearing with fallen log. Rest spot (ambient heal). |

### NPC Placements

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Lead Woodcutter | (9, 29) | Static at camp | `npc_woodcutter_m1` | SQ-03 |
| Woodcutter B | (10, 31) | Patrols camp-to-forest (10,31) → (15,20) | `npc_woodcutter_m2` | — |
| Woodcutter C | (11, 30) | Static, chopping | `npc_woodcutter_f1` | — |

### Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-AG-01 | (18, 8) | 1 fragment (awe/earth/2) | Hearthstone Circle NW stone |
| RS-AG-02 | (22, 8) | 1 fragment (joy/earth/2) | Hearthstone Circle NE stone |
| RS-AG-03 | (20, 12) | 1 fragment (calm/wind/2) | Hearthstone Circle S stone |
| RS-AG-04 | (30, 27) | 1 fragment (awe/water/2) | Amber Lake submerged stone; dormant until Act II |
| RS-AG-05 | (15, 5) | 1 fragment (fury/earth/1) | Hidden in dense forest |

### Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-AG-01 | (21, 10) | Hearthstone Staff (W-ST-03) | Hearthstone Circle center |
| CH-AG-02 | (37, 20) | Windcatcher Rod (W-WD-03) | Canopy Path treasure, accessible after climb |
| CH-AG-03 | (30, 5) | Minor Potion (C-HP-01) x3 | Deep forest clearing |

### Enemy Spawn Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Dense Forest | (5, 2) → (35, 15) | Forest Wisp (E-SL-03), Thornback Beetle (E-SL-04) | 3-5 | Common: 1 Wisp; Standard: 1 Wisp + 1 Beetle; Rare: 2 Wisps + 1 Beetle |
| Lake Shore | (24, 20) → (35, 30) | Forest Wisp (E-SL-03) | 3-4 | Common: 1 Wisp (low rate) |
| Canopy Path | (36, 15) → (39, 28) | Thornback Beetle (E-SL-04) | 3-5 | Standard: 2 Beetles |

### Map Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-AG-001 | (9, 29) | action | MQ-03+ | SQ-03 | Lead Woodcutter: rapid-growth dialogue; SQ-03 trigger |
| EV-AG-002 | (20, 10) | action | always | — | Hearthstone Circle center: fragment collection tutorial |
| EV-AG-003 | (30, 27) | action | MQ-05+ | — | Amber Lake submerged stone: activates in Act II |
| EV-AG-004 | (0, 20) | touch | always | — | West edge transition → Village Hub (29, 14) |
| EV-AG-005 | (0, 20) | touch | always | — | West edge alt → Heartfield (39, 20) |
| EV-AG-006 | (38, 20) | touch | MQ-04+ | — | East edge (Canopy Path) transition → Shimmer Marsh via Flickerveil approach |
| EV-AG-007 | (10, 39) | touch | always | — | South edge transition → Heartfield cross-country path |
| EV-AG-008 | SQ-03 sites | action | SQ-03 | SQ-03 | 3 rapid-growth investigation sites + beetle nest combat |

### Map Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (0, 20) | West | Village Hub | (29, 14) | Always |
| (38, 20) | East | Flickerveil | (0, 30) | After MQ-04 (Canopy Path) |
| (10, 39) | South | Heartfield | (39, 20) | Always |

---

## Map 2C: Millbrook (West Settled Lands)

**File**: `millbrook.tmx` | **Size**: 40x40 tiles (1280x1280 px) | **Tileset**: `tiles_riverside_{tier}.png`

**Starting Vibrancy**: 50 (Normal tier)

### Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| Millbrook Town | (12, 12) | 12x12 | 8-10 buildings, bridge, shops. Main settlement area. |
| Brightwater Bridge | (18, 18) | 6x3 | Large stone bridge. Resonance Stone built into keystone (21, 19). |
| Upstream Falls | (6, 3) | 5x5 | Waterfall. Hidden cave behind at (6, 4). SQ-04 dungeon. |
| Fisher's Rest | (28, 28) | 5x5 | Fishing dock area. Fisher NPC. |
| Brightwater River | (18, 0) → (18, 39) | 3-wide | River runs N-S through center of map |
| Specialty Shop | (14, 14) | 4x3 | Water/riverside themed items |

### NPC Placements

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Fisher Tam | (29, 29) | Static at dock | `npc_fisher_m1` | SQ-04 |
| Specialty Shopkeeper | (15, 15) | Static in shop | `npc_shopkeep_f1` | — |
| Millbrook Elder | (16, 13) | Patrols town (13-22, 12-20) | `npc_elder_m1` | — (lore) |
| Bridge Guard | (20, 19) | Static on bridge | `npc_guard_m1` | — |
| Townsfolk A | (14, 17) | Wanders town | `npc_villager_f2` | — |
| Townsfolk B | (22, 14) | Wanders town | `npc_villager_m3` | — |

### Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-MB-01 | (21, 19) | 1 fragment (joy/water/2) | Bridge keystone stone; projects rainbow at Vivid |
| RS-MB-02 | (7, 4) | 1 fragment (awe/water/3) | Behind Upstream Falls (hidden) |
| RS-MB-03 | (30, 30) | 1 fragment (calm/water/1) | Fisher's Rest dock |
| RS-MB-04 | (8, 5) | 1 fragment (sorrow/water/3) | Inside falls cave (SQ-04) |

### Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-MB-01 | (7, 5) | 2 fragments (sorrow/water/3 + awe/water/3) | Inside falls cave (SQ-04) |
| CH-MB-02 | (25, 10) | Haste Seed (C-BF-04) x2 | North riverbank, hidden |
| CH-MB-03 | (32, 32) | Minor Potion (C-HP-01) x3 | Fisher's Rest storage |

### Enemy Spawn Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| West Riverbank | (2, 10) → (16, 30) | River Nymph (E-SL-05), Stone Crab (E-SL-06) | 4-5 | Common: 1 Nymph; Standard: 1 Nymph + 1 Crab |
| East Riverbank | (22, 8) → (38, 30) | Stone Crab (E-SL-06) | 4-5 | Common: 1 Crab; Standard: 2 Crabs |
| Falls Approach | (2, 2) → (12, 8) | River Nymph (E-SL-05) | 4 | Common: 1 Nymph (low rate) |

### Map Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-MB-001 | (29, 29) | action | MQ-03+ | SQ-04 | Fisher Tam: strange lights dialogue; SQ-04 trigger |
| EV-MB-002 | (6, 4) | touch | SQ-04 | SQ-04 | Hidden cave entrance behind waterfall |
| EV-MB-003 | (15, 15) | action | always | — | Specialty shop interface (Brightwater Saber, Riverside Crosier, etc.) |
| EV-MB-004 | (39, 20) | touch | always | — | East edge transition → Village Hub (0, 14) |
| EV-MB-005 | (20, 39) | touch | always | — | South edge transition → Heartfield riverbank path |
| EV-MB-006 | (0, 20) | touch | MQ-04+ | — | West edge transition → Hollow Ridge foothills |
| EV-MB-007 | (21, 19) | action | always | — | Bridge Resonance Stone: fragment collection + rainbow effect |

### Map Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (39, 20) | East | Village Hub | (0, 14) | Always |
| (20, 39) | South | Heartfield | (5, 20) | Always |
| (0, 20) | West | Hollow Ridge | (49, 35) | After MQ-04 |

---

## Map 2D: Sunridge (North Settled Lands)

**File**: `sunridge.tmx` | **Size**: 40x40 tiles (1280x1280 px) | **Tileset**: `tiles_highland_{tier}.png`

**Starting Vibrancy**: 40 (Normal tier)

### Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| Ridgetop Waystation | (18, 18) | 5x5 | Traveler's outpost, 3 NPCs, rotating merchant. Rest point. |
| Wind Shrine | (8, 6) | 4x4 | Ruined shrine on highest point. Kinesis hint. Vibrating Resonance Stone. |
| Preserver Outpost | (30, 13) | 5x4 | Crystallized watchtower. SQ-05 location (Aric). |
| The Threshold | (18, 0) | 6x2 | Northern map edge. Visual transition to Frontier shimmer. |
| Highland Grass | (5, 10) → (35, 35) | — | Primary enemy spawn zone (hawks, golems) |

### NPC Placements

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Waystation Keeper | (19, 19) | Static | `npc_keeper_f1` | — (rest dialogue, rumors) |
| Traveling Merchant | (20, 20) | Appears on rotation (visits every 3 game-hours) | `npc_merchant_m1` | — |
| Waystation Guard | (17, 18) | Patrols waystation perimeter | `npc_guard_m2` | — |
| Aric | (31, 14) | Static at Preserver Outpost perimeter (appears after MQ-04) | `npc_aric` | SQ-05 |

### Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-SR-01 | (9, 7) | 1 fragment (fury/wind/2) | Wind Shrine; vibrates intensely, can't activate until Act II |
| RS-SR-02 | (20, 20) | 1 fragment (calm/earth/1) | Waystation garden |
| RS-SR-03 | (35, 5) | 1 fragment (awe/wind/2) | Northeast cliff edge; requires climb |

### Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-SR-01 | (9, 8) | Strength Seed (C-BF-01) x2 | Wind Shrine interior |
| CH-SR-02 | (25, 30) | Smoke Bomb (C-SP-05) x3 | Hidden in rock formation |
| CH-SR-03 | (32, 14) | Fortify Tonic (C-SC-03) x2 | Preserver Outpost perimeter (after SQ-05) |

### Enemy Spawn Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Highland Grass | (5, 10) → (25, 35) | Highland Hawk (E-SL-07) | 5-6 | Common: 1 Hawk; Standard: 2 Hawks |
| Rocky Outcrops | (25, 5) → (38, 25) | Crag Golem (E-SL-08) | 6-7 | Common: 1 Golem; Rare: 1 Golem + 1 Hawk |
| Outpost Perimeter | (27, 10) → (35, 18) | Preserver Scout (after MQ-04) | 8-10 | Standard: 2 Preserver Scouts |

### Map Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-SR-001 | (31, 14) | action | MQ-04+ | SQ-05 | Aric dialogue: Preserver doubt; SQ-05 trigger |
| EV-SR-002 | (9, 7) | action | always | — | Wind Shrine stone: vibrates, hints at Kinesis (Act II lore) |
| EV-SR-003 | (19, 19) | action | always | — | Waystation rest point: full HP/SP restore |
| EV-SR-004 | (20, 39) | touch | always | — | South edge transition → Village Hub (15, 0) |
| EV-SR-005 | (18, 0) | touch | MQ-04+ | — | North edge (Threshold) → Hollow Ridge (25, 49) |
| EV-SR-006 | (39, 20) | touch | always | — | East edge → Ambergrove highland trail |

### Map Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (20, 39) | South | Village Hub | (15, 0) | Always |
| (18, 0) | North | Hollow Ridge | (25, 49) | After MQ-04 |
| (39, 20) | East | Ambergrove | (5, 0) | Always |

---

## Map 3A: Shimmer Marsh (South Frontier)

**File**: `shimmer-marsh.tmx` | **Size**: 50x50 tiles (1600x1600 px) | **Tileset**: `tiles_marsh_{tier}.png`

**Starting Vibrancy**: 30 (Muted tier)

### Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| Verdance's Hollow | (23, 33) | 6x6 | Sunken glade. Dormant god Verdance shrine. Impossibly green. |
| Marsh Hermit's Hut | (10, 13) | 3x3 | Wynn's stilted hut. SQ-06 and GQ-02 quest hub. |
| Stagnation Bog | (38, 8) | 8x6 | Preserver-controlled crystallized marsh. Break requires water+fury. |
| Deepwater Sinkhole | (33, 43) | 4x4 | Depths Level 2 entrance. Water spirals downward. |
| Blocked Root Cluster | (18, 28) | 3x3 | GQ-02 approach barrier. Broadcast earth/water to retract roots. |
| Marsh Pools | throughout | — | Scattered water tiles with memory-reflective surfaces |

### NPC Placements

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Wynn (Marsh Hermit) | (11, 14) | Static at hut; moves to Verdance's Hollow after GQ-02 (joy) | `npc_wynn` | SQ-06, GQ-02 |
| Marsh Researcher | (12, 15) | Patrols hut vicinity | `npc_researcher_f1` | — (lore) |
| Preserver Scout A | (36, 9) | Patrols Stagnation Bog perimeter (34-42, 6-14) | `npc_preserver_scout` | — |
| Preserver Scout B | (40, 10) | Static at bog center | `npc_preserver_scout` | — |

### Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-SM-01 | (11, 14) | 1 fragment (sorrow/water/2) | Near Wynn's hut |
| RS-SM-02 | (25, 35) | Special: recall pedestal | Verdance's Hollow center; 4 emotion pedestals |
| RS-SM-03 | (40, 12) | 1 fragment (fury/water/2) | Stagnation Bog edge (contested) |
| RS-SM-04 | (20, 25) | 1 fragment (calm/earth/2) | Mid-marsh, near root cluster |
| RS-SM-05 | (30, 20) | 1 fragment (sorrow/water/3) | Deep marsh, partially submerged |
| RS-SM-06 | (15, 40) | 1 fragment (joy/earth/2) | South marsh, near Depths entrance |
| SQ-06 target A | (20, 10) | Dormant | SQ-06 broadcast target 1 |
| SQ-06 target B | (35, 25) | Dormant | SQ-06 broadcast target 2 |
| SQ-06 target C | (25, 42) | Dormant | SQ-06 broadcast target 3 |

### Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-SM-01 | (12, 16) | Antidote (C-SC-01) x5, Potion (C-HP-02) x2 | Near Wynn's hut |
| CH-SM-02 | (38, 5) | Stasis Breaker (C-SC-04) x3 | Behind Stagnation Bog (requires breaking or Silent Path) |
| CH-SM-03 | (24, 36) | Verdant Mantle (A-12) | Verdance's Hollow (post-recall) |

### Enemy Spawn Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Outer Marsh | (5, 5) → (30, 20) | Mire Crawler (E-FR-01), Echo Toad (E-FR-02) | 11-13 | Common: 1 Crawler; Standard: 1 Crawler + 1 Toad |
| Deep Marsh | (15, 25) → (40, 45) | Mire Crawler (E-FR-01), Bog Wisp | 12-14 | Standard: 2 Crawlers; Rare: 2 Crawlers + 1 Bog Wisp |
| Bog Perimeter | (34, 6) → (44, 16) | Preserver Scout, Mire Crawler | 12-14 | Standard: 1 Scout + 1 Crawler |
| Hollow Approach | (20, 28) → (28, 38) | Echo Toad (E-FR-02) | 13-15 | Common: 1 Toad |

### Map Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-SM-001 | (11, 14) | action | MQ-05+ | SQ-06, GQ-02 | Wynn dialogue: marsh research + Verdance's Hollow info |
| EV-SM-002 | (18, 28) | action | GQ-02 | GQ-02 | Blocked root cluster: broadcast earth/water to clear path |
| EV-SM-003 | (25, 35) | auto | GQ-02 | GQ-02 | Verdance recall vision (30-sec cinematic) |
| EV-SM-004 | (25, 35) | action | GQ-02 | GQ-02 | 4 emotion pedestals: place potency 3+ fragment |
| EV-SM-005 | (33, 43) | touch | MQ-05+ | — | Deepwater Sinkhole → Depths Level 2 |
| EV-SM-006 | (20, 0) | touch | MQ-04+ | — | North edge transition → Heartfield (20, 38) |
| EV-SM-007 | (49, 25) | touch | MQ-05+ | — | East edge transition → Flickerveil (0, 25) |
| EV-SM-008 | (0, 25) | touch | MQ-05+ | — | West edge transition → Hollow Ridge (49, 35) |
| EV-SM-009 | (25, 49) | touch | MQ-07+ | — | South edge → Luminous Wastes (25, 0) |
| EV-SM-010 | SQ-06 sites | action | SQ-06 | SQ-06 | 3 dormant Resonance Stone broadcast targets |
| EV-SM-011 | (38, 8) | action | — | — | Stagnation Bog: crystallized zone with break mechanic |

### Map Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (20, 0) | North | Heartfield | (20, 38) | After MQ-04 |
| (49, 25) | East | Flickerveil | (0, 25) | After MQ-05 |
| (0, 25) | West | Hollow Ridge | (49, 35) | After MQ-05 |
| (25, 49) | South | Luminous Wastes | (25, 0) | After MQ-07 |
| (33, 43) | Down | Depths Level 2 | (10, 0) | After MQ-05 |

---

## Map 3B: Hollow Ridge (North Frontier)

**File**: `hollow-ridge.tmx` | **Size**: 50x50 tiles (1600x1600 px) | **Tileset**: `tiles_mountain_{tier}.png`

**Starting Vibrancy**: 20 (Muted tier)

### Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| Kinesis Spire | (23, 8) | 3x8 | Vibrating rock pillar. Dormant god Kinesis. Recall location. |
| Ridgewalker Camp | (13, 23) | 8x8 | Frontier settlement. 6 NPCs, merchant, quest hub. |
| Shattered Pass | (33, 28) | 8x6 | Partially crystallized mountain pass. Stagnation puzzle. |
| Echo Caverns | (38, 3) | 3x3 | Depths Level 3 entrance. |
| Mountain Trail (south) | (25, 40) → (25, 49) | — | Approach from Sunridge |
| Ridge Overlook | (5, 5) | 4x4 | Scenic viewpoint. Narrative beat. |

### NPC Placements

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Petra | (14, 24) | Static at camp center; patrols camp after GQ-04 | `npc_petra` | MQ-05, SQ-07, GQ-04 |
| Ridgewalker Scout | (16, 25) | Patrols camp perimeter (10-20, 20-30) | `npc_ridgewalker_m1` | — |
| Ridgewalker Merchant | (15, 26) | Static at camp market stall | `npc_merchant_m2` | — |
| Ridgewalker Elder | (12, 22) | Static at campfire | `npc_elder_m2` | — (lore, Autumnus dialogue post-recall) |
| Ridgewalker Guard A | (18, 28) | Patrols south camp border | `npc_ridgewalker_m2` | — |
| Ridgewalker Guard B | (10, 22) | Patrols west camp border | `npc_ridgewalker_f1` | — |

### Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-HR-01 | (24, 10) | Special: recall pedestal | Kinesis Spire base; 4 emotion pedestals |
| RS-HR-02 | (14, 24) | 1 fragment (fury/fire/2) | Ridgewalker Camp center |
| RS-HR-03 | (6, 6) | 1 fragment (awe/wind/3) | Ridge Overlook |
| RS-HR-04 | (35, 30) | 1 fragment (sorrow/earth/2) | Shattered Pass approach |
| RS-HR-05 | (40, 5) | 1 fragment (fury/earth/3) | Echo Caverns entrance |

### Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-HR-01 | (5, 7) | Ridgewalker Claymore (W-SW-05) variant note: available at merchant | Ridge Overlook |
| CH-HR-02 | (36, 32) | Frontier Guard (A-09) | Shattered Pass (after breaking stasis) |
| CH-HR-03 | (38, 4) | Mana Draught (C-SP-02) x3 | Echo Caverns entrance |

### Enemy Spawn Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Mountain Trails | (5, 10) → (30, 40) | Wind Elemental, Mountain Drake | 12-16 | Common: 1 Elemental; Standard: 1 Elemental + 1 Drake |
| Spire Approach | (18, 3) → (30, 15) | Wind Elemental, Crystal Sentinel | 14-16 | Standard: 2 Elementals; Rare: 1 Sentinel + 1 Elemental |
| Shattered Pass | (30, 25) → (40, 34) | Crystal Sentinel | 15-17 | Standard: 2 Sentinels (Preserver constructs) |
| Echo Caverns Approach | (35, 2) → (45, 10) | Mountain Drake | 14-16 | Standard: 2 Drakes |

### Map Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-HR-001 | (14, 24) | action | MQ-05+ | MQ-05, SQ-07, GQ-04 | Petra dialogue: dormant gods intro, Kinetic Boots (K-05) |
| EV-HR-002 | (15, 26) | action | always | — | Ridgewalker merchant shop (Ridgewalker Claymore, Shadow Fang, etc.) |
| EV-HR-003 | (24, 10) | auto | GQ-04 | GQ-04 | Kinesis Spire recall vision |
| EV-HR-004 | (24, 10) | action | GQ-04 | GQ-04 | 4 emotion pedestals for Kinesis recall |
| EV-HR-005 | (33, 28) | action | — | — | Shattered Pass stagnation puzzle |
| EV-HR-006 | (38, 3) | touch | MQ-05+ | — | Echo Caverns → Depths Level 3 |
| EV-HR-007 | (25, 49) | touch | always | — | South edge → Sunridge (18, 0) |
| EV-HR-008 | (49, 25) | touch | MQ-05+ | — | East edge → Flickerveil (0, 15) |
| EV-HR-009 | (49, 35) | touch | MQ-05+ | — | SE edge → Shimmer Marsh (0, 25) |
| EV-HR-010 | (25, 0) | touch | MQ-07+ | — | North edge → Undrawn Peaks (20, 39) |
| EV-HR-011 | (14, 24) | action | SQ-07 | SQ-07 | Petra: escort quest trigger |

### Map Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (25, 49) | South | Sunridge | (18, 0) | Always |
| (49, 25) | East | Flickerveil | (0, 15) | After MQ-05 |
| (49, 35) | SE | Shimmer Marsh | (0, 25) | After MQ-05 |
| (25, 0) | North | Undrawn Peaks | (20, 39) | After MQ-07 |
| (38, 3) | Down | Depths Level 3 | (10, 0) | After MQ-05 |

---

## Map 3C: Flickerveil (East Frontier)

**File**: `flickerveil.tmx` | **Size**: 50x50 tiles (1600x1600 px) | **Tileset**: `tiles_forest_{tier}.png` + `overlay_flicker.png`

**Starting Vibrancy**: 25 (Muted tier)

### Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| Luminos Grove | (18, 18) | 6x6 | Clearing with light column. Dormant god Luminos. Prism at center. |
| Flickering Village | (33, 28) | 10x8 | Frontier settlement. Buildings shimmer. 8 NPCs. |
| Resonance Archive | (8, 8) | 6x6 | Spiral of ancient Resonance Stones. 5 collectible fragments. Preserver garrison. |
| Veil's Edge | (46, 23) | 4x6 | Eastern boundary. Transition to Sketch (Half-Drawn Forest). |
| Flickering Canopy | throughout | — | Trees oscillate between rendered and sketch-outline |

### NPC Placements

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Solen (village elder) | (35, 30) | Static at village center | `npc_solen` | SQ-08, GQ-03 |
| Village Shopkeeper | (36, 29) | Static in shop | `npc_shopkeep_f2` | — |
| Village Innkeeper | (34, 32) | Static in inn | `npc_innkeeper_f1` | — |
| Flickering Guard A | (31, 28) | Patrols village perimeter | `npc_villager_m4` | — |
| Preserver Agent (archive) | (9, 9) | Static at archive center | `npc_preserver_agent` | GQ-03-F1 (Burning Archive) |
| Preserver Agent B | (7, 10) | Patrols archive perimeter | `npc_preserver_agent` | — |
| Preserver Agent C | (10, 7) | Patrols archive perimeter | `npc_preserver_agent` | — |
| Elyn (Preserver defector) | (30, 26) | Appears after Vesperis recall | `npc_elyn` | GQ-03-S1 (The Defector) |

### Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-FV-01 | (20, 20) | Special: recall pedestal | Luminos Grove center prism; 4 emotion pedestals |
| RS-FV-02 | (8, 8) | 1 fragment (awe/light/3) | Archive stone 1 |
| RS-FV-03 | (9, 10) | 1 fragment (sorrow/light/3) | Archive stone 2 |
| RS-FV-04 | (10, 9) | 1 fragment (joy/light/2) | Archive stone 3 |
| RS-FV-05 | (7, 9) | 1 fragment (fury/light/3) | Archive stone 4 |
| RS-FV-06 | (9, 7) | 1 fragment (calm/light/3) | Archive stone 5 |
| RS-FV-07 | (35, 30) | 1 fragment (calm/neutral/2) | Village center |
| RS-FV-08 | (45, 24) | 1 fragment (awe/wind/2) | Veil's Edge boundary |

### Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-FV-01 | (10, 10) | Flickerblade (W-DG-05) | Archive center (after clearing garrison via GQ-03-F1) |
| CH-FV-02 | (34, 28) | Stasis Breaker (C-SC-04) x3 | Village shop backroom |
| CH-FV-03 | (47, 25) | Potion (C-HP-02) x3 | Veil's Edge supply cache |

### Enemy Spawn Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| West Forest | (2, 15) → (18, 40) | Phantom Fox, Canopy Crawler | 13-15 | Common: 1 Fox; Standard: 1 Fox + 1 Crawler |
| East Forest | (25, 5) → (45, 25) | Flicker Wisp, Phantom Fox | 13-16 | Standard: 2 Wisps; Rare: 2 Wisps + 1 Fox |
| Archive Perimeter | (5, 5) → (13, 13) | Preserver Agent (3 stationed) | 14-16 | Fixed encounters only (garrison) |
| Veil's Edge | (42, 20) → (49, 28) | Flicker Wisp, Sketch Phantom (preview) | 15-17 | Standard: 1 Wisp + 1 Phantom |

### Map Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-FV-001 | (35, 30) | action | MQ-05+ | SQ-08, GQ-03 | Solen dialogue: Light Lens (K-04), light studies |
| EV-FV-002 | (36, 29) | action | always | — | Village shop (Prism Wand, Flickerblade, Stasis Breaker) |
| EV-FV-003 | (20, 20) | auto | GQ-03 | GQ-03 | Luminos recall vision (requires Light Lens K-04 equipped) |
| EV-FV-004 | (20, 20) | action | GQ-03 | GQ-03 | 4 emotion pedestals for Luminos recall |
| EV-FV-005 | (8, 8) | action | GQ-03-F1 | GQ-03-F1 | Archive: Burning Archive assault trigger |
| EV-FV-006 | (30, 26) | action | GQ-03-S1 | GQ-03-S1 | Elyn: defector escort quest trigger (after Vesperis recall) |
| EV-FV-007 | (0, 25) | touch | MQ-05+ | — | West edge → Shimmer Marsh (49, 25) |
| EV-FV-008 | (0, 15) | touch | MQ-05+ | — | NW edge → Hollow Ridge (49, 25) |
| EV-FV-009 | (0, 38) | touch | always | — | SW edge → Ambergrove (38, 20) via Canopy Path |
| EV-FV-010 | (48, 25) | touch | MQ-07+ | — | East edge → Half-Drawn Forest (0, 20) |
| EV-FV-011 | (20, 20) | parallel | always | — | Light column visual effect; intensity scales with vibrancy |
| EV-FV-012 | Flicker anomaly sites | action | SQ-08 | SQ-08 | 4 flicker anomaly observation points |

### Map Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (0, 25) | West | Shimmer Marsh | (49, 25) | After MQ-05 |
| (0, 15) | NW | Hollow Ridge | (49, 25) | After MQ-05 |
| (0, 38) | SW | Ambergrove | (38, 20) | Always |
| (48, 25) | East | Half-Drawn Forest | (0, 20) | After MQ-07 |

---

## Map 3D: Resonance Fields (West Frontier)

**File**: `resonance-fields.tmx` | **Size**: 50x50 tiles (1600x1600 px) | **Tileset**: `tiles_plains_{tier}.png`

**Starting Vibrancy**: 15 (Muted tier)

### Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| Resonance's Amphitheater | (23, 23) | 8x8 | Natural bowl. Dormant god Resonance. Massive stone ring. |
| Listener's Camp | (8, 33) | 6x5 | 4 audiomancer NPCs. SQ-09 and SQ-13 quest hub. |
| Preserver Cathedral | (38, 13) | 8x6 | Largest Preserver installation. Silences all memory within 10 tiles. |
| Singing Stones | (28, 43) | 6x3 | Line of Resonance Stones. Sequential activation → Depths L4 entrance. |
| Standing Stone Forest | throughout | — | Scattered Resonance Stones across the plains |

### NPC Placements

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Lead Audiomancer | (9, 34) | Static at camp | `npc_audiomancer_m1` | SQ-09, SQ-13 |
| Audiomancer B | (10, 36) | Patrols camp-to-stones route | `npc_audiomancer_f1` | — |
| Audiomancer C | (8, 35) | Static, listening | `npc_audiomancer_m2` | — |
| Audiomancer D | (11, 34) | Static, note-taking | `npc_audiomancer_f2` | — |
| Preserver Captain | (40, 14) | Static inside Cathedral | `npc_preserver_captain` | GQ-01-F2 (Shattered Silence) |
| Preserver Agent A | (37, 13) | Patrols Cathedral exterior | `npc_preserver_agent` | — |
| Preserver Agent B | (41, 15) | Patrols Cathedral exterior | `npc_preserver_agent` | — |
| Preserver Agent C | (39, 12) | Static at Cathedral entrance | `npc_preserver_agent` | — |

### Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-RF-01 | (25, 25) | Special: recall pedestal | Amphitheater center; 4 emotion pedestals |
| RS-RF-02 | (10, 10) | 1 fragment (awe/wind/2) | NW standing stone |
| RS-RF-03 | (35, 8) | 1 fragment (fury/wind/2) | Near Cathedral (contested) |
| RS-RF-04 | (15, 45) | 1 fragment (calm/earth/2) | SW corner |
| RS-RF-05 | (45, 40) | 1 fragment (sorrow/wind/3) | SE corner |
| RS-RF-06 | (8, 34) | 1 fragment (joy/wind/2) | Listener's Camp |
| RS-RF-07-11 | (28-33, 43) | Singing Stones x5 | Sequential activation for Depths L4 |
| SQ-09 approach stones | (18, 28), (22, 20), (28, 22) | Dormant | SQ-09 harmonization targets |

### Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-RF-01 | (25, 26) | Choir's Final Note (MF-05) | Amphitheater (GQ-01 recall vision) |
| CH-RF-02 | (40, 16) | Preserver's Crystal Mail (A-10) | Cathedral interior (after clearing via GQ-01-F2) |
| CH-RF-03 | (10, 45) | Mana Draught (C-SP-02) x3 | SW plains hidden |

### Enemy Spawn Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Open Plains | (5, 5) → (35, 40) | Sound Echo, Stone Guardian | 13-16 | Common: 1 Echo; Standard: 1 Echo + 1 Guardian |
| Cathedral Zone | (33, 8) → (45, 20) | Preserver Agent (3 stationed), Harmony Wraith | 15-17 | Fixed: Cathedral garrison. Random: 1-2 Harmony Wraiths |
| South Plains | (15, 35) → (45, 48) | Stone Guardian, Harmony Wraith | 14-16 | Standard: 2 Guardians; Rare: 2 Guardians + 1 Wraith |

### Map Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-RF-001 | (9, 34) | action | MQ-05+ | SQ-09, SQ-13 | Lead Audiomancer: Amphitheater humming, SQ-09 trigger |
| EV-RF-002 | SQ-09 stones | action | SQ-09 | SQ-09 | 3 approach stones harmonization |
| EV-RF-003 | (25, 25) | auto | GQ-01 | GQ-01 | Resonance recall vision |
| EV-RF-004 | (25, 25) | action | GQ-01 | GQ-01 | 4 emotion pedestals for Resonance recall |
| EV-RF-005 | (38, 13) | action | GQ-01-F2 | GQ-01-F2 | Cathedral assault (Thunderstone K-15 required) |
| EV-RF-006 | (28, 43) | action | — | — | Singing Stones sequential puzzle → Depths L4 |
| EV-RF-007 | (49, 25) | touch | MQ-05+ | — | East edge → Shimmer Marsh (0, 25) |
| EV-RF-008 | (25, 0) | touch | MQ-05+ | — | North edge → Hollow Ridge mountain-to-plains |
| EV-RF-009 | (0, 25) | touch | MQ-07+ | — | West/South edge → Luminous Wastes (39, 20) |
| EV-RF-010 | (25, 25) | parallel | always | — | Amphitheater ambient hum; intensity scales with vibrancy |

### Map Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (49, 25) | East | Shimmer Marsh | (0, 25) | After MQ-05 |
| (25, 0) | North | Hollow Ridge | (25, 49) | After MQ-05 |
| (0, 25) | West | Luminous Wastes | (39, 20) | After MQ-07 |
| (28, 44) | Down | Depths Level 4 | (10, 0) | After Singing Stones puzzle |

---

## Map 4A: Luminous Wastes (South/West Sketch)

**File**: `luminous-wastes.tmx` | **Size**: 40x40 tiles (1280x1280 px) | **Tileset**: `tiles_sketch_plains.png`

**Starting Vibrancy**: 5 (Muted tier, near-zero)

### Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| Half-Built Village | (18, 18) | 8x8 | Sketch outlines of an entire village. Broadcasting solidifies it. |
| The Edge | (3, 18) | 3x3 | World's absolute western boundary. White void beyond. |
| Preserver Watchtower | (33, 8) | 4x4 | Crystallized tower at Sketch border. Elite Preserver agents. |
| Grid-line Plains | throughout | — | Faint grid lines on luminous ground |

### NPC Placements

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Preserver Archivist | (34, 9) | Static at watchtower | `npc_preserver_elite` | — |
| (Solidified Village NPCs) | (18-25, 18-25) | Appear after broadcasting into Half-Built Village | various | — (lore) |

### Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-LW-01 | (20, 20) | 3 fragments (various/3-4) | Half-Built Village center (after solidification) |
| RS-LW-02 | (4, 18) | 1 fragment (calm/neutral/4) | The Edge; world's boundary stone |
| RS-LW-03 | (30, 35) | 1 fragment (sorrow/neutral/3) | South plains, near transition |

### Enemy Spawn Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Open Wastes | (5, 5) → (35, 35) | Sketch Phantom, Void Wisp | 21-24 | Common: 1 Phantom; Standard: 1 Phantom + 1 Void Wisp |
| Watchtower Zone | (30, 5) → (38, 14) | Preserver Archivist (elite) | 23-25 | Standard: 2 Archivists |

### Map Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-LW-001 | (20, 20) | action | MQ-08 | MQ-08 | Half-Built Village: broadcast to solidify (3 broadcasts needed) |
| EV-LW-002 | (4, 18) | action | — | — | The Edge: narrative beat (world still growing) |
| EV-LW-003 | (25, 0) | touch | MQ-07+ | — | North edge → Shimmer Marsh (25, 49) / Resonance Fields |
| EV-LW-004 | (39, 20) | touch | MQ-07+ | — | East edge → Resonance Fields (0, 25) |
| EV-LW-005 | (20, 0) | touch | MQ-08+ | — | North edge → Half-Drawn Forest (20, 39) |

### Map Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (25, 0) | North | Shimmer Marsh | (25, 49) | After MQ-07 |
| (39, 20) | East | Resonance Fields | (0, 25) | After MQ-07 |
| (20, 0) | NE | Half-Drawn Forest | (20, 39) | After MQ-08 |

---

## Map 4B: The Undrawn Peaks (North Sketch)

**File**: `undrawn-peaks.tmx` | **Size**: 40x40 tiles (1280x1280 px) | **Tileset**: `tiles_sketch_mountain.png`

**Starting Vibrancy**: 10 (Muted tier)

### Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| The Apex | (18, 3) | 4x4 | Highest point in game. Panoramic view. GQ-03-J1 target (Solara). |
| Crystalline Fortress Gate | (18, 33) | 6x4 | Final dungeon entrance. Two crystallized pillars. Preserver Captains guard. |
| Wireframe Ridges | throughout | — | Geometric line-art mountains. Must solidify handholds to traverse. |
| Sketch Bridge | (20, 20) | 6x2 | Outline bridge over chasm. Requires broadcast to solidify. |

### NPC Placements

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Preserver Captain A | (17, 34) | Static at Fortress Gate | `npc_preserver_captain` | MQ-08 |
| Preserver Captain B | (22, 34) | Static at Fortress Gate | `npc_preserver_captain` | MQ-08 |

### Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-UP-01 | (19, 4) | 1 fragment (awe/wind/4) | Apex summit |
| RS-UP-02 | (19, 34) | Broadcast target | Fortress Gate: solidify with potency 3+ to enter |
| RS-UP-03 | (10, 15) | 1 fragment (fury/fire/3) | Mountain ledge |
| RS-UP-04 | (30, 25) | 1 fragment (sorrow/earth/3) | East ridge |
| RS-UP-05 | (20, 20) | Broadcast target | Sketch Bridge solidification point |

### Enemy Spawn Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Mountain Paths | (5, 5) → (35, 30) | Wireframe Drake, Sketch Phantom | 22-26 | Standard: 1 Drake + 1 Phantom; Rare: 2 Drakes |
| Fortress Approach | (12, 28) → (28, 38) | Apex Guardian (Preserver elite) | 25-28 | Standard: 2 Guardians |

### Map Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-UP-001 | (19, 4) | action | GQ-03-J1 | GQ-03-J1 | Apex: broadcast joy fragment for sunrise beacon (Solara quest) |
| EV-UP-002 | (20, 20) | action | MQ-08 | MQ-08 | Sketch Bridge: broadcast to solidify crossing |
| EV-UP-003 | (19, 34) | action | MQ-08 | MQ-08 | Fortress Gate: broadcast potency 3+ to enter |
| EV-UP-004 | (19, 35) | touch | MQ-08+ | MQ-09 | Fortress Gate entrance → Preserver Fortress F1 |
| EV-UP-005 | (20, 39) | touch | MQ-07+ | — | South edge → Hollow Ridge (25, 0) |
| EV-UP-006 | (39, 25) | touch | MQ-08+ | — | East edge → Half-Drawn Forest (0, 10) |

### Map Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (20, 39) | South | Hollow Ridge | (25, 0) | After MQ-07 |
| (39, 25) | East | Half-Drawn Forest | (0, 10) | After MQ-08 |
| (19, 35) | Down | Preserver Fortress F1 | (10, 0) | After MQ-08 (gate solidified) |

---

## Map 4C: The Half-Drawn Forest (East Sketch)

**File**: `half-drawn-forest.tmx` | **Size**: 40x40 tiles (1280x1280 px) | **Tileset**: `tiles_sketch_forest.png`

**Starting Vibrancy**: 8 (Muted tier)

### Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| The Living Sketch | (18, 23) | 6x6 | Area actively drawing itself. Broadcasting locks in a version. |
| Archive of Intentions | (28, 8) | 5x5 | Resonance Stone grove. Dissolved memory of forest planners. |
| Sketch Passage | (13, 36) | 3x3 | Hidden entrance to Depths Level 5. |
| Line-Art Canopy | throughout | — | Elegant sketch trees. Single curved lines for trunks. |

### NPC Placements

None in initial state. After solidification events, dissolved memory echoes may appear temporarily.

### Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-HF2-01 | (20, 25) | 1 fragment (created by broadcasting) | Living Sketch: RS appears after solidification |
| RS-HF2-02 | (28, 9) | 2 fragments (awe/neutral/3 each) | Archive of Intentions |
| RS-HF2-03 | (29, 10) | 1 fragment (sorrow/light/3) | Archive of Intentions |
| RS-HF2-04 | (10, 15) | 1 fragment (calm/earth/3) | West path |
| RS-HF2-05 | (35, 30) | 1 fragment (fury/wind/3) | East clearing |
| MQ-08 trail stones | (5, 20), (12, 18), (20, 15), (28, 17), (35, 20) | Trail markers | 5 stones in sequence for MQ-08 navigation |

### Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-HF2-01 | (20, 24) | Sketchweave Cloak (A-13) | Living Sketch reward (after solidification) |
| CH-HF2-02 | (30, 10) | Dissolved Essence (C-SP-09) x1 | Archive of Intentions |
| CH-HF2-03 | (14, 37) | Mana Surge (C-SP-03) x2 | Near Depths L5 entrance |

### Enemy Spawn Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Forest Paths | (5, 5) → (35, 35) | Sketch Wolf, Unfinished Treant, Memory Echo | 22-26 | Common: 2 Wolves; Standard: 1 Wolf + 1 Treant; Rare: 1 Treant + 2 Echoes |
| Archive Approach | (25, 5) → (35, 15) | Memory Echo | 24-26 | Standard: 2 Echoes |

### Map Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-HDF-001 | (20, 25) | action | MQ-08 | MQ-08 | Living Sketch: broadcast to solidify forest section |
| EV-HDF-002 | (28, 9) | action | — | — | Archive of Intentions: dissolved memory lore |
| EV-HDF-003 | (13, 36) | touch | MQ-08+ | — | Sketch Passage → Depths Level 5 |
| EV-HDF-004 | (0, 20) | touch | MQ-07+ | — | West edge → Flickerveil (48, 25) |
| EV-HDF-005 | (0, 10) | touch | MQ-08+ | — | NW edge → Undrawn Peaks (39, 25) |
| EV-HDF-006 | (20, 39) | touch | MQ-08+ | — | South edge → Luminous Wastes (20, 0) |
| EV-HDF-007 | MQ-08 trail stones | action | MQ-08 | MQ-08 | 5 Resonance Stones activated in sequence to navigate |

### Map Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (0, 20) | West | Flickerveil | (48, 25) | After MQ-07 |
| (0, 10) | NW | Undrawn Peaks | (39, 25) | After MQ-08 |
| (20, 39) | South | Luminous Wastes | (20, 0) | After MQ-08 |
| (13, 36) | Down | Depths Level 5 | (10, 0) | After MQ-08 |

---

## Resonance Stone Master List

All Resonance Stones across the overworld, organized for quick reference:

| Map | Count | Fragment-Bearing | Recall Pedestals | Quest Targets | Total |
|-----|-------|-----------------|-----------------|---------------|-------|
| Village Hub | 5 | 4 | 0 | 1 (SQ-12 hidden) | 5 |
| Heartfield | 4 | 4 | 0 | 0 | 4 |
| Ambergrove | 5 | 5 | 0 | 0 | 5 |
| Millbrook | 4 | 4 | 0 | 0 | 4 |
| Sunridge | 3 | 3 | 0 | 0 | 3 |
| Shimmer Marsh | 9 | 6 | 1 | 3 (SQ-06) | 10 |
| Hollow Ridge | 5 | 4 | 1 | 0 | 5 |
| Flickerveil | 8 | 7 | 1 | 0 | 8 |
| Resonance Fields | 8+ | 4 | 1 | 3 (SQ-09) + 5 (Singing) | 13 |
| Luminous Wastes | 3 | 3 | 0 | 0 | 3 |
| Undrawn Peaks | 5 | 3 | 0 | 2 (broadcast targets) | 5 |
| Half-Drawn Forest | 8+ | 5 | 0 | 5 (MQ-08 trail) | 10 |
| **Total** | **67+** | **52** | **4** | **~19** | **75** |

---

## Dungeon Entrance Summary

| Dungeon | Surface Map | Position | Entrance Type | Condition |
|---------|-----------|----------|---------------|-----------|
| Depths Level 1: Memory Cellar | Village Hub | (8, 17) | Hidden passage (Memorial Garden) | After MQ-05 |
| Depths Level 2: Drowned Archive | Shimmer Marsh | (33, 43) | Deepwater Sinkhole | After MQ-05 |
| Depths Level 3: Resonant Caverns | Hollow Ridge | (38, 3) | Echo Caverns | After MQ-05 |
| Depths Level 4: The Songline | Resonance Fields | (28, 44) | Singing Stones passage | After Singing Stones puzzle |
| Depths Level 5: The Deepest Memory | Half-Drawn Forest | (13, 36) | Sketch Passage (hidden) | After MQ-08 |
| Preserver Fortress | Undrawn Peaks | (19, 35) | Crystalline Fortress Gate | After MQ-08 (gate solidified) |

---

## Inter-Zone Connection Map (Complete)

```
                        [Undrawn Peaks]
                         /          \
                   [Hollow Ridge]  [Half-Drawn Forest]
                    / |    \           |        \
             [Sunridge]|  [Flickerveil]|     [Luminous Wastes]
                |      |      /    \   |         /
          [Village Hub]|  [Ambergrove] |        /
            / |    \   |     |         |       /
    [Millbrook]|  [Heartfield]         |      /
         \     |      /               |     /
          \  [Shimmer Marsh]──[Resonance Fields]
           \        |                  |
            +──[Luminous Wastes]───────+

    ═══ Act I (always open)
    ─── Act II (after MQ-04/MQ-05)
    ··· Act III (after MQ-07/MQ-08)
```

### Connection Table (Complete)

| From | To | Direction | Act Available |
|------|----|-----------|---------------|
| Village Hub | Heartfield | South | I |
| Village Hub | Ambergrove | East | I |
| Village Hub | Millbrook | West | I |
| Village Hub | Sunridge | North | II (MQ-04) |
| Heartfield | Ambergrove | East | I |
| Heartfield | Millbrook | SW (river) | I |
| Heartfield | Shimmer Marsh | South | II (MQ-04) |
| Ambergrove | Flickerveil | East (Canopy) | II (MQ-04) |
| Millbrook | Hollow Ridge | West | II (MQ-04) |
| Sunridge | Hollow Ridge | North | II (MQ-04) |
| Sunridge | Ambergrove | East | I |
| Shimmer Marsh | Flickerveil | East | II (MQ-05) |
| Shimmer Marsh | Hollow Ridge | West | II (MQ-05) |
| Shimmer Marsh | Resonance Fields | (via south) | II (MQ-05) |
| Shimmer Marsh | Luminous Wastes | South | III (MQ-07) |
| Hollow Ridge | Flickerveil | East | II (MQ-05) |
| Hollow Ridge | Resonance Fields | South | II (MQ-05) |
| Hollow Ridge | Undrawn Peaks | North | III (MQ-07) |
| Flickerveil | Half-Drawn Forest | East | III (MQ-07) |
| Resonance Fields | Luminous Wastes | West | III (MQ-07) |
| Luminous Wastes | Half-Drawn Forest | North | III (MQ-08) |
| Undrawn Peaks | Half-Drawn Forest | East | III (MQ-08) |
