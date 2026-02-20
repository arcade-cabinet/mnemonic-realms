---
id: hollow-ridge
type: overworld
biome: mountain
size: [100, 100]
vibrancy: 20
palette: snow-mountain
music: bgm-hollow-ridge
assemblages:
  - ref: resonance-point
    position: [23, 8]
    meta: {name: "Kinesis Spire"}
  - ref: ridge-camp
    position: [13, 23]
    meta: {name: "Ridgewalker Camp"}
  - ref: mountain-path
    position: [33, 28]
    meta: {name: "Shattered Pass"}
  - ref: dungeon-entrance
    position: [38, 3]
    meta: {name: "Echo Caverns", target: depths-l3}
  - ref: cliff-face
    position: [5, 5]
    meta: {name: "Ridge Overlook"}
  - ref: mountain-path
    position: [25, 40]
    meta: {name: "Mountain Trail"}
---

# Hollow Ridge

A chain of steep, wind-carved ridges rising above the mist. The peaks here are jagged and unfinished -- some mountains end abruptly in flat shimmer, as if the world's sculptor simply stopped mid-carve. The most dramatically unfinished Frontier zone.

Starting vibrancy 20 (Muted tier). Resonant emotion: Fury. Element affinity: Fire.

> Cross-references: [Act II script](../../story/act2-script.md), [Dormant Gods: Kinesis](../dormant-gods.md)

## Key Areas

| Area | Position | Size | Assemblage | Description |
|------|----------|------|------------|-------------|
| Kinesis Spire | (23, 8) | 3x8 | [resonance-point](../../../gen/assemblage/catalog/organisms/terrain/frontier/resonance-point.md) | Vibrating rock pillar. Dormant god Kinesis. Recall location. |
| Ridgewalker Camp | (13, 23) | 8x8 | [ridge-camp](../../../gen/assemblage/catalog/organisms/terrain/frontier/ridge-camp.md) | Frontier settlement. 6 NPCs, merchant, quest hub. |
| Shattered Pass | (33, 28) | 8x6 | [mountain-path](../../../gen/assemblage/catalog/organisms/terrain/mountain/mountain-path.md) | Partially crystallized mountain pass. Stagnation puzzle. |
| Echo Caverns | (38, 3) | 3x3 | [dungeon-entrance](../../../gen/assemblage/catalog/organisms/terrain/dungeon/dungeon-entrance.md) | Depths Level 3 entrance. |
| Mountain Trail (south) | (25, 40) -> (25, 49) | -- | [mountain-path](../../../gen/assemblage/catalog/organisms/terrain/mountain/mountain-path.md) | Approach from Sunridge |
| Ridge Overlook | (5, 5) | 4x4 | [cliff-face](../../../gen/assemblage/catalog/organisms/terrain/mountain/cliff-face.md) | Scenic viewpoint. Narrative beat. |

## NPCs

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Nel | (14, 24) | Static at camp center; patrols camp after GQ-04 | `npc_nel` | MQ-05, SQ-07, GQ-04 |
| Ridgewalker Scout | (16, 25) | Patrols camp perimeter (10-20, 20-30) | `npc_ridgewalker_m1` | -- |
| Ridgewalker Merchant | (15, 26) | Static at camp market stall | `npc_merchant_m2` | -- |
| Ridgewalker Elder | (12, 22) | Static at campfire | `npc_elder_m2` | -- (lore, Autumnus dialogue post-recall) |
| Ridgewalker Guard A | (18, 28) | Patrols south camp border | `npc_ridgewalker_m2` | -- |
| Ridgewalker Guard B | (10, 22) | Patrols west camp border | `npc_ridgewalker_f1` | -- |

## Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-HR-001 | (14, 24) | action | MQ-05+ | MQ-05, SQ-07, GQ-04 | Nel dialogue: dormant gods intro, Kinetic Boots (K-05) |
| EV-HR-002 | (15, 26) | action | always | -- | Ridgewalker merchant shop (Ridgewalker Claymore, Shadow Fang, etc.) |
| EV-HR-003 | (24, 10) | auto | GQ-04 | GQ-04 | Kinesis Spire recall vision |
| EV-HR-004 | (24, 10) | action | GQ-04 | GQ-04 | 4 emotion pedestals for Kinesis recall |
| EV-HR-005 | (33, 28) | action | -- | -- | Shattered Pass stagnation puzzle |
| EV-HR-006 | (38, 3) | touch | MQ-05+ | -- | Echo Caverns -> Depths Level 3 |
| EV-HR-007 | (25, 49) | touch | always | -- | South edge -> Sunridge (18, 0) |
| EV-HR-008 | (49, 25) | touch | MQ-05+ | -- | East edge -> Flickerveil (0, 15) |
| EV-HR-009 | (49, 35) | touch | MQ-05+ | -- | SE edge -> Shimmer Marsh (0, 25) |
| EV-HR-010 | (25, 0) | touch | MQ-07+ | -- | North edge -> Undrawn Peaks (20, 39) |
| EV-HR-011 | (14, 24) | action | SQ-07 | SQ-07 | Nel: escort quest trigger |

## Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (25, 49) | South | Sunridge | (18, 0) | Always |
| (49, 25) | East | Flickerveil | (0, 15) | After MQ-05 |
| (49, 35) | SE | Shimmer Marsh | (0, 25) | After MQ-05 |
| (25, 0) | North | Undrawn Peaks | (20, 39) | After MQ-07 |
| (38, 3) | Down | Depths Level 3 | (10, 0) | After MQ-05 |

## Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-HR-01 | (24, 10) | Special: recall pedestal | Kinesis Spire base; 4 emotion pedestals |
| RS-HR-02 | (14, 24) | 1 fragment (fury/fire/2) | Ridgewalker Camp center |
| RS-HR-03 | (6, 6) | 1 fragment (awe/wind/3) | Ridge Overlook |
| RS-HR-04 | (35, 30) | 1 fragment (sorrow/earth/2) | Shattered Pass approach |
| RS-HR-05 | (40, 5) | 1 fragment (fury/earth/3) | Echo Caverns entrance |

## Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-HR-01 | (5, 7) | Ridgewalker Claymore (W-SW-05) variant note: available at merchant | Ridge Overlook |
| CH-HR-02 | (36, 32) | Frontier Guard (A-09) | Shattered Pass (after breaking stasis) |
| CH-HR-03 | (38, 4) | Mana Draught (C-SP-02) x3 | Echo Caverns entrance |

## Enemy Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Mountain Trails | (5, 10) -> (30, 40) | Wind Elemental, Mountain Drake | 12-16 | Common: 1 Elemental; Standard: 1 Elemental + 1 Drake |
| Spire Approach | (18, 3) -> (30, 15) | Wind Elemental, Crystal Sentinel | 14-16 | Standard: 2 Elementals; Rare: 1 Sentinel + 1 Elemental |
| Shattered Pass | (30, 25) -> (40, 34) | Crystal Sentinel | 15-17 | Standard: 2 Sentinels (Preserver constructs) |
| Echo Caverns Approach | (35, 2) -> (45, 10) | Mountain Drake | 14-16 | Standard: 2 Drakes |
