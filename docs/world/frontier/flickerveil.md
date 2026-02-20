---
id: flickerveil
type: overworld
biome: forest
size: [100, 100]
vibrancy: 25
palette: frontier-seasons
music: bgm-flickerveil
worldSlots:
  - id: flickerveil-store
    template: shop-single
    keeper: village-shopkeeper-fv
    shopType: general
  - id: flickerveil-inn
    template: inn
    keeper: village-innkeeper-fv
  - id: flickerveil-library
    template: shop-single
    keeper: archive-keeper
    shopType: library
assemblages:
  - ref: resonance-point
    position: [18, 18]
    meta: {name: "Luminos Grove"}
  - ref: flickering-structure
    position: [33, 28]
    meta: {name: "Flickering Village"}
  - ref: resonance-point
    position: [8, 8]
    meta: {name: "Resonance Archive"}
  - ref: frontier-gate
    position: [46, 23]
    meta: {name: "Veil's Edge"}
  - ref: seasonal-forest-patch
    edge: all
---

# Flickerveil

A vast forest where the trees flicker between fully rendered and sketch-like outlines. Light behaves strangely here -- shadows point in inconsistent directions, and luminous "memory motes" drift between branches. The most visually unsettling Frontier zone.

Starting vibrancy 25 (Muted tier). Resonant emotion: Awe. Element affinity: Wind.

> Cross-references: [Act II script](../../story/act2-script.md), [Dormant Gods: Luminos](../dormant-gods.md)

## Key Areas

| Area | Position | Size | Assemblage | Description |
|------|----------|------|------------|-------------|
| Luminos Grove | (18, 18) | 6x6 | [resonance-point](../../../gen/assemblage/catalog/organisms/terrain/frontier/resonance-point.md) | Clearing with light column. Dormant god Luminos. Prism at center. |
| Flickering Village | (33, 28) | 10x8 | [flickering-structure](../../../gen/assemblage/catalog/organisms/terrain/frontier/flickering-structure.md) | Frontier settlement. Buildings shimmer. 8 NPCs. |
| Resonance Archive | (8, 8) | 6x6 | [resonance-point](../../../gen/assemblage/catalog/organisms/terrain/frontier/resonance-point.md) | Spiral of ancient Resonance Stones. 5 collectible fragments. Preserver garrison. |
| Veil's Edge | (46, 23) | 4x6 | [frontier-gate](../../../gen/assemblage/catalog/organisms/terrain/frontier/frontier-gate.md) | Eastern boundary. Transition to Sketch (Half-Drawn Forest). |
| Flickering Canopy | throughout | -- | [seasonal-forest-patch](../../../gen/assemblage/catalog/organisms/terrain/frontier/seasonal-forest-patch.md) | Trees oscillate between rendered and sketch-outline |

## NPCs

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Reza (village elder) | (35, 30) | Static at village center | `npc_reza` | SQ-08, GQ-03 |
| Village Shopkeeper | (36, 29) | Static in shop | `npc_shopkeep_f2` | -- |
| Village Innkeeper | (34, 32) | Static in inn | `npc_innkeeper_f1` | -- |
| Flickering Guard A | (31, 28) | Patrols village perimeter | `npc_villager_m4` | -- |
| Preserver Agent (archive) | (9, 9) | Static at archive center | `npc_preserver_agent` | GQ-03-F1 (Burning Archive) |
| Preserver Agent B | (7, 10) | Patrols archive perimeter | `npc_preserver_agent` | -- |
| Preserver Agent C | (10, 7) | Patrols archive perimeter | `npc_preserver_agent` | -- |
| Julz (Preserver defector) | (30, 26) | Appears after Vesperis recall | `npc_julz` | GQ-03-S1 (The Defector) |

## Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-FV-001 | (35, 30) | action | MQ-05+ | SQ-08, GQ-03 | Reza dialogue: Light Lens (K-04), light studies |
| EV-FV-002 | (36, 29) | action | always | -- | Village shop (Prism Wand, Flickerblade, Stasis Breaker) |
| EV-FV-003 | (20, 20) | auto | GQ-03 | GQ-03 | Luminos recall vision (requires Light Lens K-04 equipped) |
| EV-FV-004 | (20, 20) | action | GQ-03 | GQ-03 | 4 emotion pedestals for Luminos recall |
| EV-FV-005 | (8, 8) | action | GQ-03-F1 | GQ-03-F1 | Archive: Burning Archive assault trigger |
| EV-FV-006 | (30, 26) | action | GQ-03-S1 | GQ-03-S1 | Julz: defector escort quest trigger (after Vesperis recall) |
| EV-FV-007 | (0, 25) | touch | MQ-05+ | -- | West edge -> Shimmer Marsh (49, 25) |
| EV-FV-008 | (0, 15) | touch | MQ-05+ | -- | NW edge -> Hollow Ridge (49, 25) |
| EV-FV-009 | (0, 38) | touch | always | -- | SW edge -> Ambergrove (38, 20) via Canopy Path |
| EV-FV-010 | (48, 25) | touch | MQ-07+ | -- | East edge -> Half-Drawn Forest (0, 20) |
| EV-FV-011 | (20, 20) | parallel | always | -- | Light column visual effect; intensity scales with vibrancy |
| EV-FV-012 | Flicker anomaly sites | action | SQ-08 | SQ-08 | 4 flicker anomaly observation points |

## Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (0, 25) | West | Shimmer Marsh | (49, 25) | After MQ-05 |
| (0, 15) | NW | Hollow Ridge | (49, 25) | After MQ-05 |
| (0, 38) | SW | Ambergrove | (38, 20) | Always |
| (48, 25) | East | Half-Drawn Forest | (0, 20) | After MQ-07 |

## Resonance Stones

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

## Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-FV-01 | (10, 10) | Flickerblade (W-DG-05) | Archive center (after clearing garrison via GQ-03-F1) |
| CH-FV-02 | (34, 28) | Stasis Breaker (C-SC-04) x3 | Village shop backroom |
| CH-FV-03 | (47, 25) | Potion (C-HP-02) x3 | Veil's Edge supply cache |

## Enemy Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| West Forest | (2, 15) -> (18, 40) | Phantom Fox, Canopy Crawler | 13-15 | Common: 1 Fox; Standard: 1 Fox + 1 Crawler |
| East Forest | (25, 5) -> (45, 25) | Flicker Wisp, Phantom Fox | 13-16 | Standard: 2 Wisps; Rare: 2 Wisps + 1 Fox |
| Archive Perimeter | (5, 5) -> (13, 13) | Preserver Agent (3 stationed) | 14-16 | Fixed encounters only (garrison) |
| Veil's Edge | (42, 20) -> (49, 28) | Flicker Wisp, Sketch Phantom (preview) | 15-17 | Standard: 1 Wisp + 1 Phantom |
