---
id: everwick
type: village
biome: village
size: [60, 60]
vibrancy: 60
palette: village-premium
music: bgm-vh
worldSlots:
  - id: everwick-khali
    template: shop-single
    keeper: khali
    shopType: general
  - id: everwick-hark
    template: shop-single
    keeper: hark
    shopType: weapons
  - id: everwick-inn
    template: inn
    keeper: nyro
  - id: everwick-artun
    template: residence
assemblages:
  - ref: fountain-base
    position: [12, 14]
    meta: {name: "Resonance Fountain"}
  - ref: house-red-small
    position: [18, 16]
    meta: {name: "Khali's Curios", worldSlot: everwick-khali}
  - ref: house-blue-medium
    position: [18, 10]
    meta: {name: "Elder's House", worldSlot: everwick-artun}
  - ref: house-red-large
    position: [20, 14]
    meta: {name: "The Bright Hearth", worldSlot: everwick-inn}
  - ref: house-green-small
    position: [8, 18]
    meta: {name: "Hana's Workshop"}
  - ref: house-hay-medium
    position: [18, 18]
    meta: {name: "Hark's Forge", worldSlot: everwick-hark}
  - ref: training-ground
    position: [8, 10]
  - ref: memorial-garden
    position: [8, 16]
  - ref: lookout-hill
    position: [12, 2]
  - ref: forest-border
    edge: north
---

# Everwick

The eternal settlement -- the most-remembered place in the world. Organized around a central square with paths radiating outward like wheel spokes. Buildings cluster along these paths. The southern edge connects to the Settled Lands; the northern edge has a lookout hill.

Starting vibrancy 60 (Normal tier). The village can bloom to Vivid through player action. No combat encounters -- Everwick is a safe zone.

> Cross-references: [Act I, Scenes 1-4](../../story/act1-script.md), [Act I, Scenes 10, 12](../../story/act1-script.md)

## Buildings

| Building | Position (x, y) | Size (tiles) | Assemblage | Description |
|----------|-----------------|--------------|------------|-------------|
| Central Square | (12, 14) | 6x6 | [fountain-base](../../../gen/assemblage/catalog/molecules/fountain-base.md) | Open gathering area with a Resonance Stone fountain at center. NPCs mill about here during daytime. |
| General Shop | (18, 16) | 5x4 | [house-red-small](../../../gen/assemblage/catalog/organisms/buildings/house-red-small.md) | Run by Khali, a cheerful merchant. Sells potions, antidotes, basic gear. Inventory improves as village vibrancy rises. |
| Elder's House | (18, 10) | 5x5 | [house-blue-medium](../../../gen/assemblage/catalog/organisms/buildings/house-blue-medium.md) | Artun's home and informal library. Bookshelves contain lore fragments. First place the player visits after the opening cutscene. |
| Quest Board | (8, 14) | 3x3 | -- | Wooden board outside the square. Displays available side quests. Updates as vibrancy increases and new NPCs arrive. |
| Inn: The Bright Hearth | (20, 14) | 5x4 | [house-red-large](../../../gen/assemblage/catalog/organisms/buildings/house-red-large.md) | Rest point (full HP/SP restore). Innkeeper tells rumors that hint at exploration targets. Rest triggers Dissolved dream sequences after Act I. |
| Hana's Workshop | (8, 18) | 5x4 | [house-green-small](../../../gen/assemblage/catalog/organisms/buildings/house-green-small.md) | Where Hana teaches memory operations (Collect, Remix, Broadcast). Contains a Remix Table. |
| Blacksmith | (18, 18) | 4x4 | [house-hay-medium](../../../gen/assemblage/catalog/organisms/buildings/house-hay-medium.md) | Sells and upgrades weapons/armor. Stock improves with vibrancy. |
| Training Ground | (8, 10) | 6x5 | [training-ground](../../../gen/assemblage/catalog/organisms/terrain/training-ground.md) | Open area with practice dummies. Tutorial combat happens here. |
| Memorial Garden | (8, 16) | 4x3 | [memorial-garden](../../../gen/assemblage/catalog/organisms/terrain/memorial-garden.md) | Small garden with three Resonance Stones. First memory collection tutorial location. |
| Lookout Hill | (12, 2) | 6x5 | [lookout-hill](../../../gen/assemblage/catalog/organisms/terrain/lookout-hill.md) | Elevated area at the village's north edge. Artun's telescope is here. |

## NPCs

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Artun | (19, 11) | Patrols: Elder's House <-> Lookout Hill (12, 3) on 60s cycle | `npc_artun` | MQ-01, MQ-03, MQ-05, MQ-07, SQ-10, SQ-14 |
| Hana | (9, 19) | Static at workshop until MQ-02 complete; roams village after | `npc_hana` | MQ-01, MQ-02 |
| Khali (shopkeeper) | (19, 17) | Static behind shop counter | `npc_khali` | SQ-01 |
| Hark (blacksmith) | (19, 19) | Static at anvil | `npc_hark` | SQ-11 |
| Nyro (innkeeper) | (21, 15) | Static behind inn bar | `npc_nyro` | SQ-12 |
| Villager A | (14, 15) | Wanders Central Square (12-17, 14-19) | `npc_villager_m1` | -- |
| Villager B | (16, 16) | Wanders Central Square | `npc_villager_f1` | -- |
| Villager C | (10, 22) | Patrols South Gate road | `npc_villager_m2` | -- |

## Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-EW-001 | (19, 11) | action | MQ-01 | MQ-01 | Artun intro dialogue; gives Architect's Signet direction |
| EV-EW-002 | (9, 19) | action | MQ-01 | MQ-01, MQ-02 | Hana gives Architect's Signet (K-01); teaches memory ops |
| EV-EW-003 | (10, 17) | action | MQ-02 | MQ-02 | Memorial Garden Resonance Stone; first fragment collection (MF-01) |
| EV-EW-004 | (10, 17) | action | MQ-02 | MQ-02 | Remix Table tutorial; broadcast tutorial |
| EV-EW-005 | (19, 17) | action | always | SQ-01 | Khali shop interface + SQ-01 dialogue trigger |
| EV-EW-006 | (19, 19) | action | always | SQ-11 | Hark shop interface + SQ-11 trigger (vibrancy 70+) |
| EV-EW-007 | (21, 15) | action | always | SQ-12 | Nyro inn: rest + dream sequence trigger |
| EV-EW-008 | (8, 14) | action | MQ-03+ | -- | Quest Board: displays available side quests |
| EV-EW-009 | (15, 25) | touch | always | -- | South Gate transition -> Heartfield (15, 0) |
| EV-EW-010 | (29, 14) | touch | always | -- | East Gate transition -> Ambergrove (0, 20) |
| EV-EW-011 | (0, 14) | touch | always | -- | West Gate transition -> Millbrook (39, 20) |
| EV-EW-012 | (15, 0) | touch | MQ-04+ | -- | North Gate transition -> Sunridge (20, 39); locked until Act II |
| EV-EW-013 | (12, 3) | action | always | -- | Artun's telescope: narrative lookout over Settled Lands |
| EV-EW-014 | (8, 17) | touch | MQ-05+ | SQ-10 | Hidden Depths entrance under Memorial Garden -> Depths L1 |
| EV-EW-015 | (14, 15) | parallel | always | -- | Fountain vibrancy check: particle effects scale with zone vibrancy |
| EV-EW-016 | (0, 0) | auto | MQ-01 | MQ-01 | Opening cutscene trigger on first map load |

## Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (15, 25) | South | Heartfield | (15, 0) | Always open |
| (29, 14) | East | Ambergrove | (0, 20) | Always open |
| (0, 14) | West | Millbrook | (39, 20) | Always open |
| (15, 0) | North | Sunridge | (20, 39) | After MQ-04 (mountain pass opens) |
| (8, 17) | Down | Depths Level 1 | (10, 0) | After MQ-05 (hidden entrance revealed) |

## Resonance Stones

| ID | Position | Type | Fragments Available | Notes |
|----|----------|------|---------------------|-------|
| RS-EW-01 | (14, 15) | Fountain stone | 1 environmental fragment (joy/neutral/1) | Central Square fountain; glows at Normal+ vibrancy |
| RS-EW-02 | (9, 16) | Memorial stone | 1 fragment (calm/earth/1) | Memorial Garden left stone; MQ-02 tutorial target |
| RS-EW-03 | (10, 17) | Memorial stone | 1 fragment (joy/light/1) | Memorial Garden center stone; MQ-02 tutorial target |
| RS-EW-04 | (11, 16) | Memorial stone | 1 fragment (sorrow/neutral/1) | Memorial Garden right stone; SQ-01 broadcast target |
| RS-EW-05 | (21, 15) | Hidden hearth stone | 1 fragment (calm/neutral/2) | Behind inn fireplace; revealed after SQ-12 dream 5 |

## Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-EW-01 | (13, 3) | Minor Potion (C-HP-01) x2 | Lookout Hill, always available |
| CH-EW-02 | (9, 11) | Mana Drop (C-SP-01) x2 | Training Ground, after MQ-01 |
