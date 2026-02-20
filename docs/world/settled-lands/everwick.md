---
id: everwick
type: village
biome: village
size: [60, 60]
vibrancy: 60
palette: village-premium
music: bgm-vh
interiors:
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
---

# Everwick

The eternal settlement -- the most-remembered place in the world. Organized around a central square with paths radiating outward like wheel spokes. Buildings cluster along these paths. The southern edge connects to the Settled Lands; the northern edge has a lookout hill.

Starting vibrancy 60 (Normal tier). The village can bloom to Vivid through player action. No combat encounters -- Everwick is a safe zone.

> Cross-references: [Act I, Scenes 1-4](../../story/act1-script.md), [Act I, Scenes 10, 12](../../story/act1-script.md)

## Buildings

| Building | Position (x, y) | Size (tiles) | Description |
|----------|-----------------|--------------|-------------|
| Central Square | (12, 14) | 6x6 | Open gathering area with a Resonance Stone fountain at center. NPCs mill about here during daytime. |
| General Shop | (18, 16) | 5x4 | Run by Khali, a cheerful merchant. Sells potions, antidotes, basic gear. Inventory improves as village vibrancy rises. |
| Elder's House | (18, 10) | 5x5 | Artun's home and informal library. Bookshelves contain lore fragments. First place the player visits after the opening cutscene. |
| Quest Board | (8, 14) | 3x3 | Wooden board outside the square. Displays available side quests. Updates as vibrancy increases and new NPCs arrive. |
| Inn: The Bright Hearth | (20, 14) | 5x4 | Rest point (full HP/SP restore). Innkeeper tells rumors that hint at exploration targets. Rest triggers Dissolved dream sequences after Act I. |
| Hana's Workshop | (8, 18) | 5x4 | Where Hana teaches memory operations (Collect, Remix, Broadcast). Contains a Remix Table. |
| Blacksmith | (18, 18) | 4x4 | Sells and upgrades weapons/armor. Stock improves with vibrancy. |
| Training Ground | (8, 10) | 6x5 | Open area with practice dummies. Tutorial combat happens here. |
| Memorial Garden | (8, 16) | 4x3 | Small garden with three Resonance Stones. First memory collection tutorial location. |
| Lookout Hill | (12, 2) | 6x5 | Elevated area at the village's north edge. Artun's telescope is here. |

## NPCs

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Artun | (19, 11) | Patrols: Elder's House <-> Lookout Hill (12, 3) on 60s cycle | `npc_callum` | MQ-01, MQ-03, MQ-05, MQ-07, SQ-10, SQ-14 |
| Hana | (9, 19) | Static at workshop until MQ-02 complete; roams village after | `npc_lira` | MQ-01, MQ-02 |
| Khali (shopkeeper) | (19, 17) | Static behind shop counter | `npc_maren` | SQ-01 |
| Hark (blacksmith) | (19, 19) | Static at anvil | `npc_torvan` | SQ-11 |
| Nyro (innkeeper) | (21, 15) | Static behind inn bar | `npc_ren` | SQ-12 |
| Villager A | (14, 15) | Wanders Central Square (12-17, 14-19) | `npc_villager_m1` | -- |
| Villager B | (16, 16) | Wanders Central Square | `npc_villager_f1` | -- |
| Villager C | (10, 22) | Patrols South Gate road | `npc_villager_m2` | -- |

## Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-VH-001 | (19, 11) | action | MQ-01 | MQ-01 | Artun intro dialogue; gives Architect's Signet direction |
| EV-VH-002 | (9, 19) | action | MQ-01 | MQ-01, MQ-02 | Hana gives Architect's Signet (K-01); teaches memory ops |
| EV-VH-003 | (10, 17) | action | MQ-02 | MQ-02 | Memorial Garden Resonance Stone; first fragment collection (MF-01) |
| EV-VH-004 | (10, 17) | action | MQ-02 | MQ-02 | Remix Table tutorial; broadcast tutorial |
| EV-VH-005 | (19, 17) | action | always | SQ-01 | Khali shop interface + SQ-01 dialogue trigger |
| EV-VH-006 | (19, 19) | action | always | SQ-11 | Hark shop interface + SQ-11 trigger (vibrancy 70+) |
| EV-VH-007 | (21, 15) | action | always | SQ-12 | Nyro inn: rest + dream sequence trigger |
| EV-VH-008 | (8, 14) | action | MQ-03+ | -- | Quest Board: displays available side quests |
| EV-VH-009 | (15, 25) | touch | always | -- | South Gate transition -> Heartfield (15, 0) |
| EV-VH-010 | (29, 14) | touch | always | -- | East Gate transition -> Ambergrove (0, 20) |
| EV-VH-011 | (0, 14) | touch | always | -- | West Gate transition -> Millbrook (39, 20) |
| EV-VH-012 | (15, 0) | touch | MQ-04+ | -- | North Gate transition -> Sunridge (20, 39); locked until Act II |
| EV-VH-013 | (12, 3) | action | always | -- | Artun's telescope: narrative lookout over Settled Lands |
| EV-VH-014 | (8, 17) | touch | MQ-05+ | SQ-10 | Hidden Depths entrance under Memorial Garden -> Depths L1 |
| EV-VH-015 | (14, 15) | parallel | always | -- | Fountain vibrancy check: particle effects scale with zone vibrancy |
| EV-VH-016 | (0, 0) | auto | MQ-01 | MQ-01 | Opening cutscene trigger on first map load |

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
| RS-VH-01 | (14, 15) | Fountain stone | 1 environmental fragment (joy/neutral/1) | Central Square fountain; glows at Normal+ vibrancy |
| RS-VH-02 | (9, 16) | Memorial stone | 1 fragment (calm/earth/1) | Memorial Garden left stone; MQ-02 tutorial target |
| RS-VH-03 | (10, 17) | Memorial stone | 1 fragment (joy/light/1) | Memorial Garden center stone; MQ-02 tutorial target |
| RS-VH-04 | (11, 16) | Memorial stone | 1 fragment (sorrow/neutral/1) | Memorial Garden right stone; SQ-01 broadcast target |
| RS-VH-05 | (21, 15) | Hidden hearth stone | 1 fragment (calm/neutral/2) | Behind inn fireplace; revealed after SQ-12 dream 5 |

## Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-VH-01 | (13, 3) | Minor Potion (C-HP-01) x2 | Lookout Hill, always available |
| CH-VH-02 | (9, 11) | Mana Drop (C-SP-01) x2 | Training Ground, after MQ-01 |
