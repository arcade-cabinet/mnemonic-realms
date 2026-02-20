---
id: resonance-fields
type: overworld
biome: plains
size: [100, 100]
vibrancy: 15
palette: frontier-seasons
music: bgm-resonance-fields
assemblages:
  - ref: resonance-point
    position: [23, 23]
    meta: {name: "Resonance's Amphitheater"}
  - ref: ridge-camp
    position: [8, 33]
    meta: {name: "Listener's Camp"}
  - ref: frontier-gate
    position: [38, 13]
    meta: {name: "Preserver Cathedral"}
  - ref: resonance-point
    position: [28, 43]
    meta: {name: "Singing Stones"}
---

# Resonance Fields

Vast open plains where the wind carries audible memory-sounds: fragments of conversations, distant music, laughter. The ground is mostly flat and featureless -- the world ran out of detail. But Resonance Stones are plentiful, standing in scattered formations like a forest of standing stones. The most visually sparse but aurally rich Frontier zone.

Starting vibrancy 15 (Muted tier). Resonant emotion: Awe. Element affinity: Wind.

> Cross-references: [Act II script](../../story/act2-script.md), [Dormant Gods: Resonance](../dormant-gods.md)

## Key Areas

| Area | Position | Size | Assemblage | Description |
|------|----------|------|------------|-------------|
| Resonance's Amphitheater | (23, 23) | 8x8 | [resonance-point](../../../gen/assemblage/catalog/organisms/terrain/frontier/resonance-point.md) | Natural bowl. Dormant god Resonance. Massive stone ring. |
| Listener's Camp | (8, 33) | 6x5 | [ridge-camp](../../../gen/assemblage/catalog/organisms/terrain/frontier/ridge-camp.md) | 4 audiomancer NPCs. SQ-09 and SQ-13 quest hub. |
| Preserver Cathedral | (38, 13) | 8x6 | [frontier-gate](../../../gen/assemblage/catalog/organisms/terrain/frontier/frontier-gate.md) | Largest Preserver installation. Silences all memory within 10 tiles. |
| Singing Stones | (28, 43) | 6x3 | [resonance-point](../../../gen/assemblage/catalog/organisms/terrain/frontier/resonance-point.md) | Line of Resonance Stones. Sequential activation -> Depths L4 entrance. |
| Standing Stone Forest | throughout | -- | -- | Scattered Resonance Stones across the plains |

## NPCs

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Lead Audiomancer | (9, 34) | Static at camp | `npc_audiomancer_m1` | SQ-09, SQ-13 |
| Audiomancer B | (10, 36) | Patrols camp-to-stones route | `npc_audiomancer_f1` | -- |
| Audiomancer C | (8, 35) | Static, listening | `npc_audiomancer_m2` | -- |
| Audiomancer D | (11, 34) | Static, note-taking | `npc_audiomancer_f2` | -- |
| Preserver Captain | (40, 14) | Static inside Cathedral | `npc_preserver_captain` | GQ-01-F2 (Shattered Silence) |
| Preserver Agent A | (37, 13) | Patrols Cathedral exterior | `npc_preserver_agent` | -- |
| Preserver Agent B | (41, 15) | Patrols Cathedral exterior | `npc_preserver_agent` | -- |
| Preserver Agent C | (39, 12) | Static at Cathedral entrance | `npc_preserver_agent` | -- |

## Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-RF-001 | (9, 34) | action | MQ-05+ | SQ-09, SQ-13 | Lead Audiomancer: Amphitheater humming, SQ-09 trigger |
| EV-RF-002 | SQ-09 stones | action | SQ-09 | SQ-09 | 3 approach stones harmonization |
| EV-RF-003 | (25, 25) | auto | GQ-01 | GQ-01 | Resonance recall vision |
| EV-RF-004 | (25, 25) | action | GQ-01 | GQ-01 | 4 emotion pedestals for Resonance recall |
| EV-RF-005 | (38, 13) | action | GQ-01-F2 | GQ-01-F2 | Cathedral assault (Thunderstone K-15 required) |
| EV-RF-006 | (28, 43) | action | -- | -- | Singing Stones sequential puzzle -> Depths L4 |
| EV-RF-007 | (49, 25) | touch | MQ-05+ | -- | East edge -> Shimmer Marsh (0, 25) |
| EV-RF-008 | (25, 0) | touch | MQ-05+ | -- | North edge -> Hollow Ridge mountain-to-plains |
| EV-RF-009 | (0, 25) | touch | MQ-07+ | -- | West/South edge -> Luminous Wastes (39, 20) |
| EV-RF-010 | (25, 25) | parallel | always | -- | Amphitheater ambient hum; intensity scales with vibrancy |

## Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (49, 25) | East | Shimmer Marsh | (0, 25) | After MQ-05 |
| (25, 0) | North | Hollow Ridge | (25, 49) | After MQ-05 |
| (0, 25) | West | Luminous Wastes | (39, 20) | After MQ-07 |
| (28, 44) | Down | Depths Level 4 | (10, 0) | After Singing Stones puzzle |

## Resonance Stones

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

## Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-RF-01 | (25, 26) | Choir's Final Note (MF-05) | Amphitheater (GQ-01 recall vision) |
| CH-RF-02 | (40, 16) | Preserver's Crystal Mail (A-10) | Cathedral interior (after clearing via GQ-01-F2) |
| CH-RF-03 | (10, 45) | Mana Draught (C-SP-02) x3 | SW plains hidden |

## Enemy Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Open Plains | (5, 5) -> (35, 40) | Sound Echo, Stone Guardian | 13-16 | Common: 1 Echo; Standard: 1 Echo + 1 Guardian |
| Cathedral Zone | (33, 8) -> (45, 20) | Preserver Agent (3 stationed), Harmony Wraith | 15-17 | Fixed: Cathedral garrison. Random: 1-2 Harmony Wraiths |
| South Plains | (15, 35) -> (45, 48) | Stone Guardian, Harmony Wraith | 14-16 | Standard: 2 Guardians; Rare: 2 Guardians + 1 Wraith |
