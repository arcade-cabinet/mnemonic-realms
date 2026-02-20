---
id: millbrook
type: overworld
biome: riverside
size: [80, 80]
vibrancy: 50
palette: village-premium
music: bgm-millbrook
worldSlots:
  - id: millbrook-provisions
    template: shop-single
    keeper: theron
    shopType: general
  - id: millbrook-forge
    template: shop-single
    keeper: dalla
    shopType: weapons
  - id: millbrook-inn
    template: inn
    keeper: oram
  - id: millbrook-fish
    template: shop-single
    keeper: lissa
    shopType: fish
assemblages:
  - ref: house-blue-small
    position: [12, 12]
    meta: {name: "Millbrook Townhouse", worldSlot: millbrook-provisions}
  - ref: house-blue-small
    position: [14, 14]
    meta: {name: "Riverside Goods"}
  - ref: house-blue-small
    position: [16, 13]
    meta: {name: "Town Hall"}
  - ref: house-blue-small
    position: [22, 14]
    meta: {name: "Fisher's Lodge"}
  - ref: house-blue-small
    position: [13, 18]
    meta: {name: "River Cottage"}
  - ref: house-blue-small
    position: [20, 12]
    meta: {name: "Dalla's Forge", worldSlot: millbrook-forge}
  - ref: house-blue-small
    position: [18, 16]
    meta: {name: "Oram's Rest", worldSlot: millbrook-inn}
  - ref: house-blue-small
    position: [24, 16]
    meta: {name: "Lissa's Fish Market", worldSlot: millbrook-fish}
  - ref: bridge
    position: [18, 18]
    meta: {name: "Brightwater Bridge"}
  - ref: watermill
    position: [6, 3]
    meta: {name: "Upstream Falls"}
  - ref: dock
    position: [28, 28]
    meta: {name: "Fisher's Rest"}
  - ref: house-green-medium
    position: [14, 14]
    meta: {name: "Specialty Shop"}
---

# Millbrook

A river town built along both banks of the Brightwater River. Bridges, watermills, fishing docks, stone quays. The most "civilized" of the Settled Lands sub-maps, with 8-10 buildings and a population of about 20 NPCs.

Starting vibrancy 50 (Normal tier).

> Cross-references: [Act I, Scene 7](../../story/act1-script.md)

## Key Areas

| Area | Position | Size | Assemblage | Description |
|------|----------|------|------------|-------------|
| Millbrook Town | (12, 12) | 12x12 | [house-blue-small](../../../gen/assemblage/catalog/organisms/buildings/house-blue-small.md) x8 | 8-10 buildings, bridge, shops. Main settlement area. |
| Brightwater Bridge | (18, 18) | 6x3 | [bridge](../../../gen/assemblage/catalog/organisms/terrain/bridge.md) | Large stone bridge. Resonance Stone built into keystone (21, 19). |
| Upstream Falls | (6, 3) | 5x5 | [watermill](../../../gen/assemblage/catalog/organisms/terrain/watermill.md) | Waterfall. Hidden cave behind at (6, 4). SQ-04 dungeon. |
| Fisher's Rest | (28, 28) | 5x5 | [dock](../../../gen/assemblage/catalog/organisms/terrain/dock.md) | Fishing dock area. Fisher NPC. |
| Brightwater River | (18, 0) -> (18, 39) | 3-wide | -- | River runs N-S through center of map |
| Specialty Shop | (14, 14) | 4x3 | [house-green-medium](../../../gen/assemblage/catalog/organisms/buildings/house-green-medium.md) | Water/riverside themed items |

## NPCs

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Fisher Tam | (29, 29) | Static at dock | `npc_fisher_m1` | SQ-04 |
| Specialty Shopkeeper | (15, 15) | Static in shop | `npc_shopkeep_f1` | -- |
| Millbrook Elder | (16, 13) | Patrols town (13-22, 12-20) | `npc_elder_m1` | -- (lore) |
| Bridge Guard | (20, 19) | Static on bridge | `npc_guard_m1` | -- |
| Townsfolk A | (14, 17) | Wanders town | `npc_villager_f2` | -- |
| Townsfolk B | (22, 14) | Wanders town | `npc_villager_m3` | -- |

## Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-MB-001 | (29, 29) | action | MQ-03+ | SQ-04 | Fisher Tam: strange lights dialogue; SQ-04 trigger |
| EV-MB-002 | (6, 4) | touch | SQ-04 | SQ-04 | Hidden cave entrance behind waterfall |
| EV-MB-003 | (15, 15) | action | always | -- | Specialty shop interface (Brightwater Saber, Riverside Crosier, etc.) |
| EV-MB-004 | (39, 20) | touch | always | -- | East edge transition -> Everwick (0, 14) |
| EV-MB-005 | (20, 39) | touch | always | -- | South edge transition -> Heartfield riverbank path |
| EV-MB-006 | (0, 20) | touch | MQ-04+ | -- | West edge transition -> Hollow Ridge foothills |
| EV-MB-007 | (21, 19) | action | always | -- | Bridge Resonance Stone: fragment collection + rainbow effect |

## Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (39, 20) | East | Everwick | (0, 14) | Always |
| (20, 39) | South | Heartfield | (5, 20) | Always |
| (0, 20) | West | Hollow Ridge | (49, 35) | After MQ-04 |

## Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-MB-01 | (21, 19) | 1 fragment (joy/water/2) | Bridge keystone stone; projects rainbow at Vivid |
| RS-MB-02 | (7, 4) | 1 fragment (awe/water/3) | Behind Upstream Falls (hidden) |
| RS-MB-03 | (30, 30) | 1 fragment (calm/water/1) | Fisher's Rest dock |
| RS-MB-04 | (8, 5) | 1 fragment (sorrow/water/3) | Inside falls cave (SQ-04) |

## Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-MB-01 | (7, 5) | 2 fragments (sorrow/water/3 + awe/water/3) | Inside falls cave (SQ-04) |
| CH-MB-02 | (25, 10) | Haste Seed (C-BF-04) x2 | North riverbank, hidden |
| CH-MB-03 | (32, 32) | Minor Potion (C-HP-01) x3 | Fisher's Rest storage |

## Enemy Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| West Riverbank | (2, 10) -> (16, 30) | River Nymph (E-SL-05), Stone Crab (E-SL-06) | 4-5 | Common: 1 Nymph; Standard: 1 Nymph + 1 Crab |
| East Riverbank | (22, 8) -> (38, 30) | Stone Crab (E-SL-06) | 4-5 | Common: 1 Crab; Standard: 2 Crabs |
| Falls Approach | (2, 2) -> (12, 8) | River Nymph (E-SL-05) | 4 | Common: 1 Nymph (low rate) |
