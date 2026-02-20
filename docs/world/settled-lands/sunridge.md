---
id: sunridge
type: overworld
biome: highland
size: [80, 80]
vibrancy: 40
palette: village-premium
music: bgm-sunridge
---

# Sunridge

Rolling highlands north of Everwick. The grass here is shorter, wind-blown. Visibility is excellent -- on clear tiles, the player can see the Frontier's shimmer on the horizon. This zone opens when the mountain pass north of Everwick unlocks after Hana's freezing.

Starting vibrancy 40 (Normal tier).

> Cross-references: [Act I, Scene 8](../../story/act1-script.md)

## Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| Ridgetop Waystation | (18, 18) | 5x5 | Traveler's outpost, 3 NPCs, rotating merchant. Rest point. |
| Wind Shrine | (8, 6) | 4x4 | Ruined shrine on highest point. Kinesis hint. Vibrating Resonance Stone. |
| Preserver Outpost | (30, 13) | 5x4 | Crystallized watchtower. SQ-05 location (Janik). |
| The Threshold | (18, 0) | 6x2 | Northern map edge. Visual transition to Frontier shimmer. |
| Highland Grass | (5, 10) -> (35, 35) | -- | Primary enemy spawn zone (hawks, golems) |

## NPCs

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Waystation Keeper | (19, 19) | Static | `npc_keeper_f1` | -- (rest dialogue, rumors) |
| Traveling Merchant | (20, 20) | Appears on rotation (visits every 3 game-hours) | `npc_merchant_m1` | -- |
| Waystation Guard | (17, 18) | Patrols waystation perimeter | `npc_guard_m2` | -- |
| Janik | (31, 14) | Static at Preserver Outpost perimeter (appears after MQ-04) | `npc_aric` | SQ-05 |

## Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-SR-001 | (31, 14) | action | MQ-04+ | SQ-05 | Janik dialogue: Preserver doubt; SQ-05 trigger |
| EV-SR-002 | (9, 7) | action | always | -- | Wind Shrine stone: vibrates, hints at Kinesis (Act II lore) |
| EV-SR-003 | (19, 19) | action | always | -- | Waystation rest point: full HP/SP restore |
| EV-SR-004 | (20, 39) | touch | always | -- | South edge transition -> Everwick (15, 0) |
| EV-SR-005 | (18, 0) | touch | MQ-04+ | -- | North edge (Threshold) -> Hollow Ridge (25, 49) |
| EV-SR-006 | (39, 20) | touch | always | -- | East edge -> Ambergrove highland trail |

## Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (20, 39) | South | Everwick | (15, 0) | Always |
| (18, 0) | North | Hollow Ridge | (25, 49) | After MQ-04 |
| (39, 20) | East | Ambergrove | (5, 0) | Always |

## Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-SR-01 | (9, 7) | 1 fragment (fury/wind/2) | Wind Shrine; vibrates intensely, can't activate until Act II |
| RS-SR-02 | (20, 20) | 1 fragment (calm/earth/1) | Waystation garden |
| RS-SR-03 | (35, 5) | 1 fragment (awe/wind/2) | Northeast cliff edge; requires climb |

## Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-SR-01 | (9, 8) | Strength Seed (C-BF-01) x2 | Wind Shrine interior |
| CH-SR-02 | (25, 30) | Smoke Bomb (C-SP-05) x3 | Hidden in rock formation |
| CH-SR-03 | (32, 14) | Fortify Tonic (C-SC-03) x2 | Preserver Outpost perimeter (after SQ-05) |

## Enemy Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Highland Grass | (5, 10) -> (25, 35) | Highland Hawk (E-SL-07) | 5-6 | Common: 1 Hawk; Standard: 2 Hawks |
| Rocky Outcrops | (25, 5) -> (38, 25) | Crag Golem (E-SL-08) | 6-7 | Common: 1 Golem; Rare: 1 Golem + 1 Hawk |
| Outpost Perimeter | (27, 10) -> (35, 18) | Preserver Scout (after MQ-04) | 8-10 | Standard: 2 Preserver Scouts |
