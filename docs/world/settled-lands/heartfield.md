---
id: heartfield
type: overworld
biome: grassland
size: [80, 80]
vibrancy: 55
palette: village-premium
music: bgm-heartfield
assemblages:
  - ref: house-hay-small
    position: [13, 13]
    meta: {name: "Gale's Farmstead"}
  - ref: house-hay-small
    position: [17, 13]
    meta: {name: "Suri's Farmstead"}
  - ref: house-hay-small
    position: [15, 17]
    meta: {name: "Edric's Farmstead"}
  - ref: house-hay-small
    position: [19, 16]
    meta: {name: "Hamlet Well House"}
  - ref: house-hay-small
    position: [21, 14]
    meta: {name: "Elder's Cottage"}
  - ref: watermill
    position: [30, 8]
    meta: {name: "The Old Windmill"}
  - ref: forest-clearing
    position: [33, 28]
    meta: {name: "Stagnation Clearing"}
  - ref: road-intersection
    position: [20, 38]
    meta: {name: "Southern Crossroads"}
  - ref: farm-field
    position: [2, 5]
    meta: {name: "Western Wheat Fields"}
  - ref: farm-field
    position: [22, 5]
    meta: {name: "Eastern Wheat Fields"}
  - ref: forest-border
    edge: north
---

# Heartfield

Rolling farmland south of Everwick. Golden wheat fields, vegetable patches, irrigation ditches fed by a stream. A small hamlet of 4-5 farmsteads clusters near the center. The Stagnation Clearing in the northeast is the first encounter with Preserver-frozen land.

Starting vibrancy 55 (Normal tier).

> Cross-references: [Act I, Scene 5](../../story/act1-script.md), [Act I, Scene 11](../../story/act1-script.md)

## Key Areas

| Area | Position | Size | Assemblage | Description |
|------|----------|------|------------|-------------|
| Heartfield Hamlet | (13, 13) | 10x10 | [house-hay-small](../../../gen/assemblage/catalog/organisms/buildings/house-hay-small.md) x5 | 5 farmsteads, well, cart path. NPC cluster. |
| The Old Windmill | (30, 8) | 4x5 | [watermill](../../../gen/assemblage/catalog/organisms/terrain/watermill.md) | Hilltop windmill. SQ-02 dungeon entrance. Sails turn at vibrancy 50+. |
| Stagnation Clearing | (33, 28) | 5x5 | [forest-clearing](../../../gen/assemblage/catalog/organisms/terrain/forest-clearing.md) | Crystallized grass, frozen butterflies. MQ-04 climax location. |
| Southern Crossroads | (20, 38) | 3x3 | [road-intersection](../../../gen/assemblage/catalog/organisms/terrain/road-intersection.md) | Road junction. Locked transition to Frontier (Act II). |
| Wheat Fields (west) | (2, 5) | 12x15 | [farm-field](../../../gen/assemblage/catalog/organisms/terrain/farm-field.md) | Dense wheat; Meadow Sprite + Grass Serpent spawn zone |
| Wheat Fields (east) | (22, 5) | 10x12 | [farm-field](../../../gen/assemblage/catalog/organisms/terrain/farm-field.md) | Sparser wheat; Grass Serpent spawn zone |
| Stream | (5, 20) -> (5, 35) | 2-wide | -- | Irrigation stream running N-S on west side |

## NPCs

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Farmer Gale | (15, 14) | Patrols hamlet (13-22, 13-22) | `npc_farmer_m1` | SQ-02, MQ-03 |
| Farmer Suri | (17, 16) | Static at farmstead | `npc_farmer_f1` | MQ-03 (exploration confirmation) |
| Farmer Edric | (14, 18) | Patrols fields (10-20, 18-25) | `npc_farmer_m2` | -- |
| Hamlet Elder | (18, 14) | Static at hamlet well | `npc_elder_f1` | -- (lore dialogue) |
| Child NPC | (16, 15) | Wanders hamlet | `npc_child_01` | -- (appears after Solara recall) |

## Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-HF-001 | (15, 14) | action | MQ-03+ | SQ-02 | Farmer Gale: windmill groaning dialogue; SQ-02 trigger |
| EV-HF-002 | (30, 8) | touch | SQ-02 | SQ-02 | Old Windmill entrance; Dissolved Memory encounter inside |
| EV-HF-003 | (33, 28) | auto | MQ-04 | MQ-04 | Stagnation Clearing cutscene: Hana's freezing |
| EV-HF-004 | (34, 29) | action | MQ-04+ | MQ-04 | Hana's frozen form; broadcast target for SQ-14 |
| EV-HF-005 | (20, 38) | touch | MQ-04+ | -- | Southern Crossroads transition -> Shimmer Marsh (20, 0) |
| EV-HF-006 | (15, 0) | touch | always | -- | North edge transition -> Everwick (15, 25) |
| EV-HF-007 | (39, 20) | touch | always | -- | East edge transition -> Ambergrove (0, 20) |
| EV-HF-008 | (31, 9) | action | always | -- | Windmill Resonance Stone; fragment collection |
| EV-HF-009 | (34, 29) | action | SQ-14 | SQ-14 | Broadcast joy 4+ fragment into Hana; partial awakening |

## Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (15, 0) | North | Everwick | (15, 25) | Always |
| (39, 20) | East | Ambergrove | (0, 20) | Always |
| (20, 38) | South | Shimmer Marsh | (20, 0) | After MQ-04 |

## Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-HF-01 | (18, 14) | 1 fragment (joy/earth/1) | Hamlet well stone |
| RS-HF-02 | (31, 9) | 1 fragment (awe/wind/2) | Windmill hilltop stone |
| RS-HF-03 | (35, 30) | 1 fragment (sorrow/dark/1) | Stagnation Clearing edge |
| RS-HF-04 | (8, 30) | 1 fragment (calm/earth/1) | Stream bank; hidden behind tree |

## Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-HF-01 | (32, 9) | Antidote (C-SC-01) x3 | Inside windmill ground floor |
| CH-HF-02 | (5, 10) | Minor Potion (C-HP-01) x2 | Hidden in wheat field |
| CH-HF-03 | (36, 25) | Smoke Bomb (C-SP-05) x2 | Near stagnation clearing approach |

## Enemy Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Wheat Fields West | (2, 5) -> (14, 20) | Meadow Sprite (E-SL-01), Grass Serpent (E-SL-02) | 1-3 | Common: 1 Sprite; Standard: 1 Sprite + 1 Serpent |
| Wheat Fields East | (22, 5) -> (32, 17) | Grass Serpent (E-SL-02) | 2-3 | Common: 1 Serpent; Standard: 2 Serpents |
| Stagnation Approach | (28, 25) -> (38, 33) | Preserver Scout (after MQ-04) | 8-10 | Rare: 1 Preserver Scout (MQ-04 event only) |
