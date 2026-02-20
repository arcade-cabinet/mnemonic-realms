---
id: ambergrove
type: overworld
biome: forest
size: [80, 80]
vibrancy: 45
palette: village-premium
music: bgm-ambergrove
---

# Ambergrove

Dense deciduous forest east of Everwick. Canopy filters light into dappled gold and green. Winding paths, mossy clearings, a small lake. The Hearthstone Circle is a rich source of environmental memory fragments.

Starting vibrancy 45 (Normal tier).

> Cross-references: [Act I, Scene 6](../../story/act1-script.md)

## Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| Hearthstone Circle | (18, 8) | 6x6 | Ring of standing Resonance Stones in a clearing. Rich fragment source. |
| Amber Lake | (28, 23) | 8x8 | Forest lake with submerged Resonance Stone at center (30, 27). |
| Woodcutter's Camp | (8, 28) | 6x5 | 3 NPCs, woodworking tools, tents. SQ-03 quest hub. |
| Eastern Canopy Path | (36, 18) | 4x10 | Elevated tree-bridge. Partially dissolved sections shimmer. |
| Dense Forest (north) | (5, 2) -> (35, 15) | -- | Primary enemy spawn zone |
| Mossy Clearing | (20, 20) | 4x4 | Open clearing with fallen log. Rest spot (ambient heal). |

## NPCs

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Lead Woodcutter | (9, 29) | Static at camp | `npc_woodcutter_m1` | SQ-03 |
| Woodcutter B | (10, 31) | Patrols camp-to-forest (10,31) -> (15,20) | `npc_woodcutter_m2` | -- |
| Woodcutter C | (11, 30) | Static, chopping | `npc_woodcutter_f1` | -- |

## Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-AG-001 | (9, 29) | action | MQ-03+ | SQ-03 | Lead Woodcutter: rapid-growth dialogue; SQ-03 trigger |
| EV-AG-002 | (20, 10) | action | always | -- | Hearthstone Circle center: fragment collection tutorial |
| EV-AG-003 | (30, 27) | action | MQ-05+ | -- | Amber Lake submerged stone: activates in Act II |
| EV-AG-004 | (0, 20) | touch | always | -- | West edge transition -> Everwick (29, 14) |
| EV-AG-005 | (0, 20) | touch | always | -- | West edge alt -> Heartfield (39, 20) |
| EV-AG-006 | (38, 20) | touch | MQ-04+ | -- | East edge (Canopy Path) transition -> Shimmer Marsh via Flickerveil approach |
| EV-AG-007 | (10, 39) | touch | always | -- | South edge transition -> Heartfield cross-country path |
| EV-AG-008 | SQ-03 sites | action | SQ-03 | SQ-03 | 3 rapid-growth investigation sites + beetle nest combat |

## Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (0, 20) | West | Everwick | (29, 14) | Always |
| (38, 20) | East | Flickerveil | (0, 30) | After MQ-04 (Canopy Path) |
| (10, 39) | South | Heartfield | (39, 20) | Always |

## Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-AG-01 | (18, 8) | 1 fragment (awe/earth/2) | Hearthstone Circle NW stone |
| RS-AG-02 | (22, 8) | 1 fragment (joy/earth/2) | Hearthstone Circle NE stone |
| RS-AG-03 | (20, 12) | 1 fragment (calm/wind/2) | Hearthstone Circle S stone |
| RS-AG-04 | (30, 27) | 1 fragment (awe/water/2) | Amber Lake submerged stone; dormant until Act II |
| RS-AG-05 | (15, 5) | 1 fragment (fury/earth/1) | Hidden in dense forest |

## Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-AG-01 | (21, 10) | Hearthstone Staff (W-ST-03) | Hearthstone Circle center |
| CH-AG-02 | (37, 20) | Windcatcher Rod (W-WD-03) | Canopy Path treasure, accessible after climb |
| CH-AG-03 | (30, 5) | Minor Potion (C-HP-01) x3 | Deep forest clearing |

## Enemy Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Dense Forest | (5, 2) -> (35, 15) | Forest Wisp (E-SL-03), Thornback Beetle (E-SL-04) | 3-5 | Common: 1 Wisp; Standard: 1 Wisp + 1 Beetle; Rare: 2 Wisps + 1 Beetle |
| Lake Shore | (24, 20) -> (35, 30) | Forest Wisp (E-SL-03) | 3-4 | Common: 1 Wisp (low rate) |
| Canopy Path | (36, 15) -> (39, 28) | Thornback Beetle (E-SL-04) | 3-5 | Standard: 2 Beetles |
