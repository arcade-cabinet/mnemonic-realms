---
id: shimmer-marsh
type: overworld
biome: marsh
size: [100, 100]
vibrancy: 30
palette: frontier-seasons
music: bgm-shimmer-marsh
interiors:
  - id: shimmer-marsh-store
    template: shop-single
    keeper: vash-assistant
    shopType: general
  - id: shimmer-marsh-inn
    template: inn
    keeper: marsh-keeper
---

# Shimmer Marsh

Misty marshland where pools of water reflect memories rather than sky. The ground is spongy and unreliable -- some paths dissolve underfoot and reform elsewhere. The most "complete" Frontier zone (starting vibrancy 30, near the Muted/Normal threshold).

Starting vibrancy 30 (Muted tier). Resonant emotion: Sorrow. Element affinity: Water.

> Cross-references: [Act II script](../../story/act2-script.md), [Dormant Gods: Verdance](../dormant-gods.md)

## Key Areas

| Area | Position | Size | Description |
|------|----------|------|-------------|
| Verdance's Hollow | (23, 33) | 6x6 | Sunken glade. Dormant god Verdance shrine. Impossibly green. |
| Marsh Hermit's Hut | (10, 13) | 3x3 | Vash's stilted hut. SQ-06 and GQ-02 quest hub. |
| Stagnation Bog | (38, 8) | 8x6 | Preserver-controlled crystallized marsh. Break requires water+fury. |
| Deepwater Sinkhole | (33, 43) | 4x4 | Depths Level 2 entrance. Water spirals downward. |
| Blocked Root Cluster | (18, 28) | 3x3 | GQ-02 approach barrier. Broadcast earth/water to retract roots. |
| Marsh Pools | throughout | -- | Scattered water tiles with memory-reflective surfaces |

## NPCs

| NPC | Position | Movement | Graphic | Linked Quests |
|-----|----------|----------|---------|---------------|
| Vash (Marsh Hermit) | (11, 14) | Static at hut; moves to Verdance's Hollow after GQ-02 (joy) | `npc_wynn` | SQ-06, GQ-02 |
| Marsh Researcher | (12, 15) | Patrols hut vicinity | `npc_researcher_f1` | -- (lore) |
| Preserver Scout A | (36, 9) | Patrols Stagnation Bog perimeter (34-42, 6-14) | `npc_preserver_scout` | -- |
| Preserver Scout B | (40, 10) | Static at bog center | `npc_preserver_scout` | -- |

## Events

| Event ID | Position | Type | Trigger | Linked Quest | Description |
|----------|----------|------|---------|--------------|-------------|
| EV-SM-001 | (11, 14) | action | MQ-05+ | SQ-06, GQ-02 | Vash dialogue: marsh research + Verdance's Hollow info |
| EV-SM-002 | (18, 28) | action | GQ-02 | GQ-02 | Blocked root cluster: broadcast earth/water to clear path |
| EV-SM-003 | (25, 35) | auto | GQ-02 | GQ-02 | Verdance recall vision (30-sec cinematic) |
| EV-SM-004 | (25, 35) | action | GQ-02 | GQ-02 | 4 emotion pedestals: place potency 3+ fragment |
| EV-SM-005 | (33, 43) | touch | MQ-05+ | -- | Deepwater Sinkhole -> Depths Level 2 |
| EV-SM-006 | (20, 0) | touch | MQ-04+ | -- | North edge transition -> Heartfield (20, 38) |
| EV-SM-007 | (49, 25) | touch | MQ-05+ | -- | East edge transition -> Flickerveil (0, 25) |
| EV-SM-008 | (0, 25) | touch | MQ-05+ | -- | West edge transition -> Hollow Ridge (49, 35) |
| EV-SM-009 | (25, 49) | touch | MQ-07+ | -- | South edge -> Luminous Wastes (25, 0) |
| EV-SM-010 | SQ-06 sites | action | SQ-06 | SQ-06 | 3 dormant Resonance Stone broadcast targets |
| EV-SM-011 | (38, 8) | action | -- | -- | Stagnation Bog: crystallized zone with break mechanic |

## Transitions

| From | Direction | To Map | Destination Tile | Condition |
|------|-----------|--------|-----------------|-----------|
| (20, 0) | North | Heartfield | (20, 38) | After MQ-04 |
| (49, 25) | East | Flickerveil | (0, 25) | After MQ-05 |
| (0, 25) | West | Hollow Ridge | (49, 35) | After MQ-05 |
| (25, 49) | South | Luminous Wastes | (25, 0) | After MQ-07 |
| (33, 43) | Down | Depths Level 2 | (10, 0) | After MQ-05 |

## Resonance Stones

| ID | Position | Fragments Available | Notes |
|----|----------|---------------------|-------|
| RS-SM-01 | (11, 14) | 1 fragment (sorrow/water/2) | Near Vash's hut |
| RS-SM-02 | (25, 35) | Special: recall pedestal | Verdance's Hollow center; 4 emotion pedestals |
| RS-SM-03 | (40, 12) | 1 fragment (fury/water/2) | Stagnation Bog edge (contested) |
| RS-SM-04 | (20, 25) | 1 fragment (calm/earth/2) | Mid-marsh, near root cluster |
| RS-SM-05 | (30, 20) | 1 fragment (sorrow/water/3) | Deep marsh, partially submerged |
| RS-SM-06 | (15, 40) | 1 fragment (joy/earth/2) | South marsh, near Depths entrance |
| SQ-06 target A | (20, 10) | Dormant | SQ-06 broadcast target 1 |
| SQ-06 target B | (35, 25) | Dormant | SQ-06 broadcast target 2 |
| SQ-06 target C | (25, 42) | Dormant | SQ-06 broadcast target 3 |

## Treasure Chests

| ID | Position | Contents | Condition |
|----|----------|----------|-----------|
| CH-SM-01 | (12, 16) | Antidote (C-SC-01) x5, Potion (C-HP-02) x2 | Near Vash's hut |
| CH-SM-02 | (38, 5) | Stasis Breaker (C-SC-04) x3 | Behind Stagnation Bog (requires breaking or Silent Path) |
| CH-SM-03 | (24, 36) | Verdant Mantle (A-12) | Verdance's Hollow (post-recall) |

## Enemy Zones

| Zone | Bounds | Enemies | Level Range | Encounter Rate |
|------|--------|---------|-------------|----------------|
| Outer Marsh | (5, 5) -> (30, 20) | Mire Crawler (E-FR-01), Echo Toad (E-FR-02) | 11-13 | Common: 1 Crawler; Standard: 1 Crawler + 1 Toad |
| Deep Marsh | (15, 25) -> (40, 45) | Mire Crawler (E-FR-01), Bog Wisp | 12-14 | Standard: 2 Crawlers; Rare: 2 Crawlers + 1 Bog Wisp |
| Bog Perimeter | (34, 6) -> (44, 16) | Preserver Scout, Mire Crawler | 12-14 | Standard: 1 Scout + 1 Crawler |
| Hollow Approach | (20, 28) -> (28, 38) | Echo Toad (E-FR-02) | 13-15 | Common: 1 Toad |
