# Geography: The Unfinished World

> Cross-references: [docs/world/setting.md](setting.md), [docs/world/core-theme.md](core-theme.md), [docs/world/factions.md](factions.md), [docs/design/memory-system.md](../design/memory-system.md), [docs/design/visual-direction.md](../design/visual-direction.md)

## World Structure

The world is organized as **concentric rings** radiating outward from a central village hub. The closer to center, the more "remembered" and fully formed the land is. The farther out, the more unfinished, abstract, and unstable.

This is not a political boundary system — it's a gradient of completion. The world is young, still being remembered into existence (see [setting.md](setting.md)). These zones represent how far that process has reached.

### Zone Overview

| Zone | Ring | Biome Types | Starting Vibrancy | Tile Dimensions | Act |
|------|------|-------------|-------------------|-----------------|-----|
| Village Hub | Center | Village | 60 (Normal) | 30x30 | I |
| Settled Lands | Inner Ring | Grassland, Forest, Farmland | 40-55 (Normal) | 4 sub-maps, 40x40 each | I |
| Frontier | Middle Ring | Mixed (Forest, Mountain, Wetland) | 15-35 (Muted → Normal) | 4 sub-maps, 50x50 each | II |
| The Sketch | Outer Ring | Sketch (abstract, unfinished) | 0-15 (Muted) | 3 sub-maps, 40x40 each | III |
| The Depths | Underground | Dungeon, Dissolved Memory | 25-45 (varies by depth) | 5 dungeon floors, 20x25 each | I-III |

All maps use **32x32 pixel tiles** (see [visual-direction.md](../design/visual-direction.md)).

---

## Zone 1: The Village Hub

**Size**: 30 tiles wide x 30 tiles tall (960x960 pixels)

**Biome**: Village — cobblestone paths, thatched roofs, warm lantern light, flowering hedges.

**Starting Vibrancy**: 60 (Normal tier). The village is the most-remembered place in the world. It starts with natural colors and can bloom to Vivid through player action.

### Layout

The village is organized around a central square with paths radiating outward like wheel spokes. Buildings cluster along these paths. The southern edge connects to the Settled Lands; the northern edge has a lookout hill.

```
     N
     |
  [Lookout Hill / Callum's Observatory]
     |
  [Training Ground]--[Elder's House]
     |                    |
  [Quest Board]---[Central Square]---[Inn: The Bright Hearth]
     |                    |
  [Memorial Garden]--[General Shop]
     |                    |
  [Lira's Workshop]--[Blacksmith]
     |
  [South Gate → Settled Lands]
     S
```

### Building Positions (tile coordinates, top-left corner)

| Building | Position (x, y) | Size (tiles) | Description |
|----------|-----------------|--------------|-------------|
| Central Square | (12, 14) | 6x6 | Open gathering area with a Resonance Stone fountain at center. NPCs mill about here during daytime. |
| General Shop | (18, 16) | 5x4 | Run by Maren, a cheerful merchant. Sells potions, antidotes, basic gear. Inventory improves as village vibrancy rises. |
| Elder's House | (18, 10) | 5x5 | Callum's home and informal library. Bookshelves contain lore fragments. First place the player visits after the opening cutscene. |
| Quest Board | (8, 14) | 3x3 | Wooden board outside the square. Displays available side quests. Updates as vibrancy increases and new NPCs arrive. |
| Inn: The Bright Hearth | (20, 14) | 5x4 | Rest point (full HP/SP restore). Innkeeper tells rumors that hint at exploration targets. Rest triggers Dissolved dream sequences after Act I. |
| Lira's Workshop | (8, 18) | 5x4 | Where Lira teaches memory operations (Collect, Remix, Broadcast). Contains a Remix Table — the first place the player can combine fragments. |
| Blacksmith | (18, 18) | 4x4 | Sells and upgrades weapons/armor. Stock improves with vibrancy. |
| Training Ground | (8, 10) | 6x5 | Open area with practice dummies. Tutorial combat happens here. The ground is worn dirt with chalk markings. |
| Memorial Garden | (8, 16) | 4x3 | Small garden with three Resonance Stones. First memory collection tutorial location. Flowers bloom from Muted to Vivid as vibrancy rises. |
| Lookout Hill | (12, 2) | 6x5 | Elevated area at the village's north edge. Callum's telescope is here. Provides a narrative lookout over the Settled Lands and distant Frontier shimmer. |

### Key NPCs (Village Hub)

| NPC | Default Position | Role |
|-----|-----------------|------|
| Lira | Workshop (8, 18) → Roams after Act I tutorial | Mentor, memory operations teacher |
| Callum | Elder's House (18, 10) or Lookout Hill (12, 2) | Lore, world-building, first memory fragment source |
| Maren (shopkeeper) | General Shop (18, 16) | Buy/sell consumables and basic equipment |
| Torvan (blacksmith) | Blacksmith (18, 18) | Buy/sell/upgrade weapons and armor |
| Ren (innkeeper) | Inn (20, 14) | Rest, rumors, dream sequence trigger |

### Connections

| Direction | Destination | Transition Type |
|-----------|-------------|-----------------|
| South | Settled Lands: Heartfield (farmland sub-map) | Open road, no gate |
| East | Settled Lands: Ambergrove (forest sub-map) | Forest path |
| West | Settled Lands: Millbrook (riverside sub-map) | Bridge crossing |
| North (locked Act II) | Frontier: Hollow Ridge (mountain sub-map) | Mountain pass, opens after Lira's freezing |

### Environmental Details

- **Daytime**: Warm sunlight, NPCs active, birdsong ambient. Central fountain sparkles with memory energy (gold particle effect).
- **Evening**: Amber lantern glow, fewer NPCs outdoors, fireflies near the Memorial Garden.
- **Vibrancy effects**: At Muted (if somehow reduced by Preserver action), flowers close, fountain goes still, colors desaturate. At Vivid, flowers cascade over fences, fountain throws prismatic light, new decorative banners appear on buildings.

---

## Zone 2: The Settled Lands

**Ring**: Inner ring surrounding the Village Hub.

**Starting Vibrancy**: 40-55 (Normal tier, lower near the edges).

The Settled Lands are well-remembered regions — farms, roads, neighboring hamlets, established forests. They feel lived-in and safe, but the edges show the first hints of the world's unfinished nature: a fence that fades into nothing, a road that dissolves into shimmer.

### Sub-Maps

#### 2A: Heartfield (South)

**Size**: 40x40 tiles | **Biome**: Farmland/Grassland | **Starting Vibrancy**: 55

Rolling farmland south of the village. Golden wheat fields, vegetable patches, irrigation ditches fed by a stream. A small hamlet of 4-5 farmsteads clusters near the center.

**Key Landmarks**:
- **Heartfield Hamlet** (15, 15) — 5 farmsteads with unique farming families. NPCs offer fetch quests and share pastoral memory fragments.
- **The Old Windmill** (30, 8) — Abandoned windmill on a hilltop. Contains a Dissolved memory deposit accessible from Act I. The windmill's sails turn by themselves when vibrancy exceeds 50.
- **Stagnation Clearing** (35, 30) — Act I's first Stagnation Zone. A 5x5 patch of crystallized grass and frozen butterflies. Tutorial for understanding the Preserver threat. This is where Lira gets frozen during the Act I climax.
- **Southern Crossroads** (20, 38) — Road junction leading further south toward the Frontier (locked until Act II).

**Connections**: North → Village Hub (South Gate). South → Frontier: Shimmer Marsh (Act II). East → Ambergrove (forest path).

**Enemies**: Meadow Sprites (passive, provoked only), Grass Serpents (ambush from tall wheat). Difficulty: tutorial-level.

#### 2B: Ambergrove (East)

**Size**: 40x40 tiles | **Biome**: Forest | **Starting Vibrancy**: 45

Dense deciduous forest east of the village. Canopy filters light into dappled gold and green. Winding paths, mossy clearings, a small lake.

**Key Landmarks**:
- **Hearthstone Circle** (20, 10) — Ring of standing Resonance Stones in a forest clearing. A dissolved civilization's gathering place. Rich source of environmental memory fragments (3 collectible fragments here).
- **Amber Lake** (30, 25) — Placid forest lake fed by an underground spring. A dormant Resonance Stone sits half-submerged at its center — it hums when the player approaches but cannot be activated until Act II.
- **Woodcutter's Camp** (10, 30) — Small NPC settlement (3 woodcutters). They report the forest is "growing faster than we can map it." Side quest hub.
- **Eastern Canopy Path** (38, 20) — Elevated tree-bridge path that leads toward the Frontier. Partially dissolved — sections shimmer and reform.

**Connections**: West → Village Hub (East Gate). South → Heartfield (cross-country path). East → Frontier: Shimmer Marsh (Act II, via Canopy Path).

**Enemies**: Forest Wisps (float between trees, magic attacks), Thornback Beetles (ground-based, armored). Difficulty: early game.

#### 2C: Millbrook (West)

**Size**: 40x40 tiles | **Biome**: Riverside/Grassland | **Starting Vibrancy**: 50

A river town built along both banks of the Brightwater River. Bridges, watermills, fishing docks, stone quays. The most "civilized" of the Settled Lands sub-maps.

**Key Landmarks**:
- **Millbrook Town** (15, 15) — Proper small town with 8-10 buildings: a second shop (specializing in fishing/water items), a small chapel, residential homes. Population ~20 NPCs.
- **The Brightwater Bridge** (20, 20) — Large stone bridge, the town's centerpiece. A Resonance Stone is built into its keystone. At high vibrancy, the stone projects rainbow light across the river.
- **Upstream Falls** (8, 5) — Waterfall at the map's northwest. Behind the falls is a shallow cave containing a dissolved memory grotto (2 high-potency fragments, accessible from late Act I).
- **Fisher's Rest** (30, 30) — Fishing dock area. Fishing minigame available (catch memory-infused fish for minor fragments).

**Connections**: East → Village Hub (West Gate). West → Frontier: Hollow Ridge foothills (Act II). South → Heartfield (road along riverbank).

**Enemies**: River Nymphs (water magic, spawn near water tiles), Stone Crabs (armored, near riverbanks). Difficulty: early-mid game.

#### 2D: Sunridge (North of Village, unlocks end of Act I)

**Size**: 40x40 tiles | **Biome**: Hills/Highland Grassland | **Starting Vibrancy**: 40

Rolling highlands north of the village. The grass here is shorter, wind-blown. Visibility is excellent — on clear tiles, the player can see the Frontier's shimmer on the horizon. This zone opens when the mountain pass north of the Village Hub unlocks after Lira's freezing.

**Key Landmarks**:
- **Ridgetop Waystation** (20, 20) — A small traveler's outpost with 3 NPCs. Serves as a rest stop and transition point to the Frontier. A traveling merchant visits here with rotating stock.
- **Wind Shrine** (10, 8) — Ruined shrine on the highest point. Contains the first hint of the dormant god Kinesis (motion). A Resonance Stone here vibrates intensely but can't be activated until the player reaches the Frontier.
- **Preserver Outpost** (32, 15) — A crystallized watchtower where Preserver scouts monitor the Frontier border. First non-tutorial encounter with Preserver agents. Cannot be cleared until Act II.
- **The Threshold** (20, 2) — Northern map edge. The land visibly transitions here: grass becomes shorter, colors soften, shapes blur slightly. This is the boundary between Settled Lands and Frontier.

**Connections**: South → Village Hub (North Gate). North → Frontier: Hollow Ridge (mountain pass, Act II). East → Ambergrove (highland trail).

**Enemies**: Highland Hawks (fast, evasive), Crag Golems (slow, high DEF, near rocky outcrops). Difficulty: mid game.

---

## Zone 3: The Frontier

**Ring**: Middle ring beyond the Settled Lands.

**Starting Vibrancy**: 15-35 (Muted to low-Normal). The Frontier is where memory thins noticeably.

The Frontier is the game's Act II region — a vast, varied landscape where the world is still actively forming. The terrain here shifts subtly over time: a hill might be slightly different each time the player visits (cosmetic variance, not gameplay-affecting). Colors are muted, edges shimmer, and the line between solid ground and unfinished sketch is sometimes hard to spot.

### Vibrancy Transition Gradients

The Frontier's defining visual feature is the **vibrancy gradient**. Unlike the Settled Lands (mostly uniform Normal-tier) or the Sketch (uniformly Muted), the Frontier shows visible transitions:

- **Inner Frontier** (adjacent to Settled Lands): Vibrancy 25-35. Colors are present but washed out. Trees have leaves but they're translucent. Water flows but lacks sparkle.
- **Mid Frontier**: Vibrancy 15-25. Terrain simplifies. Fewer details per tile. Ground textures flatten. Sky fades from blue to pale luminous white.
- **Outer Frontier** (adjacent to the Sketch): Vibrancy 5-15. Objects lose definition. Tree silhouettes replace detailed sprites. Ground becomes impressionistic — brushstroke texture rather than individual blades of grass. The sky is a soft, glowing void.

**Player broadcasting effect**: When the player broadcasts a memory into a Frontier zone, vibrancy increases locally. A 5x5 tile radius around the broadcast point gains +5-15 vibrancy (depending on fragment potency), causing visible brightening. This "painted circle of detail" persists and slowly spreads to adjacent tiles over time.

### Sub-Maps

#### 3A: Shimmer Marsh (South Frontier)

**Size**: 50x50 tiles | **Biome**: Wetland/Marsh | **Starting Vibrancy**: 30

Misty marshland where pools of water reflect memories rather than sky. The ground is spongy and unreliable — some paths dissolve underfoot and reform elsewhere.

**Key Landmarks**:
- **Verdance's Hollow** (25, 35) — A sunken glade of impossibly green growth surrounded by muted marsh. This is where the dormant god Verdance (growth) sleeps. The shrine is a massive, half-formed tree trunk with roots that pulse with verdant light. Recall quest triggers here in Act II.
- **Marsh Hermit's Hut** (12, 15) — Isolated hut built on stilts. An NPC scholar named Wynn studies the Dissolved from here. Offers lore-rich quests and high-potency sorrow-type fragments.
- **Stagnation Bog** (40, 10) — A Preserver-controlled zone where the marsh has been crystallized into a frozen swamp. Ice-like formations trap water mid-ripple. Breaking it requires water + fury fragments broadcast together.
- **Deepwater Sinkhole** (35, 45) — Entrance to Depths Level 2 (dissolved memory dungeon). Water spirals downward into luminous depths.

**Connections**: North → Settled Lands: Heartfield (Southern Crossroads). East → Flickerveil (forest path). West → Hollow Ridge (mountain trail). South → The Sketch: Luminous Wastes (Act III, partial shimmer boundary).

**Enemies**: Mire Crawlers (poison, slow), Echo Toads (water magic, can duplicate themselves), Bog Wisps (evasive, drain SP). Preserver Scouts patrol near Stagnation Bog. Difficulty: mid game.

#### 3B: Hollow Ridge (North Frontier)

**Size**: 50x50 tiles | **Biome**: Mountain/Highland | **Starting Vibrancy**: 20

A chain of steep, wind-carved ridges rising above the mist. The peaks here are jagged and unfinished — some mountains end abruptly in flat shimmer, as if the world's sculptor simply stopped mid-carve.

**Key Landmarks**:
- **Kinesis Spire** (25, 10) — A towering natural rock pillar that vibrates with seismic energy. The dormant god Kinesis (motion) sleeps at its peak, dreaming of earthquakes and avalanches that never quite happen. Recall quest location.
- **Ridgewalker Camp** (15, 25) — A frontier settlement of hardy explorers clinging to a plateau. 6 NPCs, rotating merchant, side quest hub. These people choose to live on the edge of the unfinished world because they like watching new land form.
- **The Shattered Pass** (35, 30) — A mountain pass that the Preservers have partially crystallized. The ground is a mosaic of frozen rock and living stone. Navigating it is a puzzle: broadcasting memories at specific points breaks stasis locks to open the route.
- **Echo Caverns** (40, 5) — Cave network entrance. Contains strong dissolved memories from a mountain-dwelling civilization. Leads to Depths Level 3.

**Connections**: South → Settled Lands: Sunridge (The Threshold). East → Flickerveil (mountain-to-forest descent). West → Shimmer Marsh (mountain trail). North → The Sketch: The Undrawn Peaks (Act III).

**Enemies**: Wind Elementals (AGI-based, group attacks), Mountain Drakes (high HP, fire breath), Crystal Sentinels (Preserver constructs near Shattered Pass). Difficulty: mid-high game.

#### 3C: Flickerveil (East Frontier)

**Size**: 50x50 tiles | **Biome**: Forest transitioning to Sketch | **Starting Vibrancy**: 25

A vast forest where the trees flicker between fully rendered and sketch-like outlines. Light behaves strangely here — shadows point in inconsistent directions, and luminous "memory motes" drift between branches.

**Key Landmarks**:
- **Luminos Grove** (20, 20) — A clearing where the canopy opens to reveal a column of pure light descending from the sky. The dormant god Luminos (light) sleeps here as a suspended prism of concentrated luminance. Recall quest location.
- **The Flickering Village** (35, 30) — A frontier settlement that exists in a state of partial formation. Buildings shimmer between complete and sketch-outline. 8 NPCs live here, accustomed to their unstable environment. They've learned to broadcast memories into their homes to keep them solid.
- **Resonance Archive** (10, 10) — A grove of ancient Resonance Stones arranged in a spiral pattern. Contains the densest concentration of dissolved memory fragments in the Frontier (5 collectible fragments). A Preserver garrison occupies the site, claiming they're "protecting" the archive from remix.
- **Veil's Edge** (48, 25) — The eastern boundary where forest abruptly becomes Sketch. Trees transition from detailed to outline over just 3-4 tiles. Walking past this point enters Sketch territory.

**Connections**: West → Shimmer Marsh and Hollow Ridge (forest paths). South → Settled Lands: Ambergrove (Canopy Path). East → The Sketch: The Half-Drawn Forest (Act III).

**Enemies**: Phantom Foxes (phase through tiles, backstab), Canopy Crawlers (drop from above, web/slow), Flicker Wisps (alternate between visible/invisible, magic attacks). Difficulty: mid game.

#### 3D: Resonance Fields (West Frontier)

**Size**: 50x50 tiles | **Biome**: Open Plains/Grassland | **Starting Vibrancy**: 15

Vast open plains where the wind carries audible memory-sounds: fragments of conversations, distant music, laughter. The ground here is mostly flat and featureless — the world ran out of detail. But Resonance Stones are plentiful, standing in scattered formations like a forest of standing stones.

**Key Landmarks**:
- **Resonance's Amphitheater** (25, 25) — A natural bowl in the earth ringed by massive Resonance Stones. The dormant god Resonance (sound) sleeps here, humming a note that vibrates every stone on the map. Recall quest location.
- **The Listener's Camp** (10, 35) — A frontier outpost of 4 NPCs who came here specifically to hear the dissolved memories echoing through the stones. They're the world's only "audiomancers" — they collect fragments by listening rather than touching. Side quest hub offering unique awe-type fragments.
- **Preserver Cathedral** (40, 15) — The Preservers' largest Frontier installation. A crystallized cathedral built from frozen Resonance Stones, silencing all memory-sound within a 10-tile radius. Major Preserver encounter: 3 agents + a Preserver captain. Breaking this zone is a significant Act II milestone.
- **The Singing Stones** (30, 45) — A line of Resonance Stones that, when activated in sequence by broadcasting specific emotion-type fragments, opens a hidden passage to Depths Level 4.

**Connections**: East → Shimmer Marsh (marshy transition). North → Hollow Ridge (plains-to-mountain). South/West → The Sketch: Luminous Wastes (Act III, the world simply fades out).

**Enemies**: Sound Echoes (duplicate player abilities, mirror fights), Stone Guardians (high DEF, slow, guard Resonance Stones), Harmony Wraiths (group encounters, buff each other with resonance). Difficulty: mid-high game.

---

## Zone 4: The Sketch

**Ring**: Outer ring — the world's unfinished edge.

**Starting Vibrancy**: 0-15 (Muted tier, often near-zero).

The Sketch is where the world simply... hasn't been completed yet. It's not empty or dead. It's **unfinished** — like a painting where the artist sketched the outline but never filled in the color. The terrain is luminous, abstract, and beautiful in a stark, minimalist way.

### Sketch Aesthetic

- Ground tiles are **line-drawn outlines** over a soft luminous background — think pencil sketch on glowing parchment
- Trees are silhouettes without leaves or bark texture, just graceful curves
- Water is represented by flowing line patterns, not realistic liquid
- Mountains are geometric shapes with visible construction lines
- The sky is a gradient from pale gold (near the Frontier) to pure white (at the world's absolute edge)
- Movement feels slightly floaty — the player's shadow is the most detailed thing on screen
- **Memory broadcasting here is dramatic**: a 5-star fragment can paint an entire screen's worth of detail into the sketch, like watching a watercolor painting fill in real-time

### Player Interaction

The player must **remember areas into solidity** to traverse the Sketch. This is the core gameplay mechanic of Act III:

1. Player approaches a sketch-outlined area (e.g., a bridge that's just two lines)
2. Broadcasting a memory fragment "paints" the area with detail: the bridge gains planks, ropes, wood grain
3. The solidified area persists permanently
4. Higher-potency fragments solidify larger areas (1-star = 3x3 tiles, 5-star = 9x9 tiles)
5. Specific areas require specific emotion/element combos to solidify (puzzle element)

### Sub-Maps

#### 4A: Luminous Wastes (South/West Sketch)

**Size**: 40x40 tiles | **Biome**: Sketch-plains | **Starting Vibrancy**: 5

A vast, flat expanse of luminous nothing. The ground is a soft glow with faint grid lines — like graph paper made of light. Occasional sketch-outlines of objects dot the landscape: a fence post, a well, a tree — all incomplete.

**Key Landmarks**:
- **The Half-Built Village** (20, 20) — Sketch outlines of an entire village that was never finished. Broadcasting memories here reveals it was planned by a dissolved civilization that ran out of collective will. Solidifying it creates a new rest point and reveals 3 high-potency dissolved fragments.
- **The Edge** (5, 20) — The world's absolute western boundary. Beyond this point, even the sketch-lines stop. Just a soft, warm, white void. Standing here, the player can see new lines slowly drawing themselves — the world is still growing.
- **Preserver Watchtower** (35, 10) — A fully crystallized tower the Preservers built at the Sketch's border. They're trying to freeze the Sketch before it finishes forming, locking the world's growth permanently.

**Connections**: East → Frontier: Shimmer Marsh / Resonance Fields. North → The Half-Drawn Forest.

**Enemies**: Sketch Phantoms (outlines of enemies from other zones, weaker but unpredictable), Void Wisps (drain vibrancy from solidified areas if not defeated quickly), Preserver Archivists (elite agents stationed at the edge). Difficulty: high game.

#### 4B: The Undrawn Peaks (North Sketch)

**Size**: 40x40 tiles | **Biome**: Sketch-mountain | **Starting Vibrancy**: 10

Mountains that are geometric wireframes against the luminous sky. The paths are line segments connecting vertices. Climbing these mountains means solidifying handholds and ledges as you go.

**Key Landmarks**:
- **The Apex** (20, 5) — The highest point in the game world. A flat sketch-platform at the mountain's wireframe peak. From here, the player can see the entire world stretching south: the vivid Settled Lands, the transitioning Frontier, and the Sketch all visible at once. A narrative beat, not a gameplay objective.
- **Crystalline Fortress Gate** (20, 35) — The entrance to the Preserver Fortress (final dungeon). Two massive crystallized pillars frame a passage that descends into the Depths. Guarded by Preserver Captains.

**Connections**: South → Frontier: Hollow Ridge. East → The Half-Drawn Forest. Down → The Depths: Preserver Fortress (final dungeon entrance).

**Enemies**: Wireframe Drakes (geometric versions of mountain drakes, fire + void element), Apex Guardians (Preserver elite, stasis-heavy attacks). Difficulty: high game.

#### 4C: The Half-Drawn Forest (East Sketch)

**Size**: 40x40 tiles | **Biome**: Sketch-forest | **Starting Vibrancy**: 8

A forest rendered in elegant line-art. Tree trunks are single curved lines. Branches are delicate strokes. Leaves are suggested by clusters of dots. The effect is hauntingly beautiful — a master artist's preliminary sketch of the perfect forest.

**Key Landmarks**:
- **The Living Sketch** (20, 25) — A unique area where the sketch is actively drawing itself in real-time. New tree-lines appear, grow, and sometimes erase themselves as the player watches. Broadcasting a memory here "locks in" a version of the forest, creating a permanent clearing with a Resonance Stone that didn't exist before.
- **The Archive of Intentions** (30, 10) — A grove of Resonance Stones that contain the dissolved memories of the civilization that planned this forest. They didn't finish it — they chose to dissolve while the work was still in progress, trusting that future generations would complete it in their own way.
- **Sketch Passage** (15, 38) — A path through the sketch-forest that leads to a hidden Depths entrance (Depths Level 5: The Deepest Memory).

**Connections**: West → Frontier: Flickerveil (Veil's Edge). North → The Undrawn Peaks. South → Luminous Wastes.

**Enemies**: Sketch Wolves (line-art predators, fast, pack tactics), Unfinished Treants (half-drawn tree guardians, unpredictable attack patterns), Memory Echoes (replay fragments of past battles). Difficulty: high game.

---

## Zone 5: The Depths

**Structure**: Underground — not a ring but a **layered system** beneath the surface. Accessed via entrances scattered across all surface zones.

**Starting Vibrancy**: 25-45, varies by floor. The Depths are memory-dense: dissolved civilizations deposited their most concentrated memories underground. This makes the Depths paradoxically more detailed than the surface Frontier or Sketch — vivid colors, complex architecture, rich ambient sound. But it's ancient detail, inherited from civilizations that no longer exist.

### Dungeon Design Principles

- Each floor is a **self-contained map** (20 tiles wide x 25 tiles tall)
- Floors are connected by **stairways** (descent events) and **memory lifts** (fast-travel back to surface after clearing a floor)
- Enemies are stronger than their surface equivalents (1.3x-1.9x scaling, see [combat.md](../design/combat.md))
- Each floor has a **Dissolved Memory Cache** — a mandatory encounter/puzzle that yields high-potency fragments
- Boss encounters guard the deepest floors

### Floor Overview

| Floor | Entrance Location | Theme | Difficulty | Key Content |
|-------|-------------------|-------|------------|-------------|
| Level 1: Memory Cellar | Village Hub (hidden entrance beneath Memorial Garden) | Tutorial dungeon, village ruins | Low | Teaching dungeon mechanics. 3 rooms. First dissolved memory encounter. |
| Level 2: Drowned Archive | Shimmer Marsh (Deepwater Sinkhole) | Submerged library of a dissolved civilization | Mid | Water puzzles. 6 rooms. Contains lore about why civilizations dissolve. |
| Level 3: Resonant Caverns | Hollow Ridge (Echo Caverns) | Sound-themed caves with crystalline formations | Mid-High | Audio puzzles (activate Resonance Stones in sequences). 7 rooms. Dense fragment deposits. |
| Level 4: The Songline | Resonance Fields (Singing Stones passage) | Linear memory-corridor, each room a "verse" of a dissolved song | High | 5 rooms, each replaying a scene from the dissolved civilization's final days. |
| Level 5: The Deepest Memory | The Sketch (Sketch Passage hidden entrance) | Abstract, surreal, non-euclidean. The world's oldest memory deposit. | Very High | 8 rooms. Contains fragments of the First Memory. Final story revelations before the endgame. |

### Preserver Fortress (Final Dungeon)

**Entrance**: The Undrawn Peaks (Crystalline Fortress Gate)

**Size**: 3 floors, each 20x25 tiles

**Theme**: Crystalline museum — the Preservers' masterwork. Every room is a "gallery" displaying frozen moments of perfect beauty. NPCs from across the game are trapped here in crystalline stasis, frozen at their happiest moments.

**Structure**:
- **Floor 1: The Gallery of Moments** — Frozen snapshots of villages, festivals, peaceful scenes. Navigating requires broadcasting memories to shatter crystal barriers without damaging the frozen subjects.
- **Floor 2: The Archive of Perfection** — The Curator's personal collection. Stronger Preserver agents. Puzzle rooms where the player must choose which frozen memories to free and which to leave preserved (moral complexity).
- **Floor 3: The First Memory Chamber** — The Curator's sanctum. Contains the First Memory — the world's original seed. The Curator awaits here for the final confrontation (dialogue, not combat). The player's final act: remix the First Memory with their collected fragments.

---

## Inter-Zone Connections Map

```
                    [The Undrawn Peaks]
                          |
                    [Hollow Ridge]--------[Half-Drawn Forest]
                     /    |                      |
              [Sunridge]  |                [Flickerveil]
                |         |                  /        \
         [Village Hub]    |         [Ambergrove]   [Veil's Edge]
           /    |    \    |              |
   [Millbrook] [|] [Heartfield]    [Canopy Path]
        |       |        |
        |   [Shimmer Marsh]---[Resonance Fields]
        |        |                    |
        +---[Luminous Wastes]---------+

        Depths entrances:
        - Village Hub → Level 1
        - Shimmer Marsh → Level 2
        - Hollow Ridge → Level 3
        - Resonance Fields → Level 4
        - Half-Drawn Forest → Level 5
        - Undrawn Peaks → Preserver Fortress
```

## Zone Summary Table

| Zone | Maps | Total Tiles | Act | Biomes | Depths Entrances |
|------|------|-------------|-----|--------|-----------------|
| Village Hub | 1 | 30x30 = 900 | I | Village | Level 1 |
| Settled Lands | 4 | 4 x 40x40 = 6,400 | I | Grassland, Forest, Riverside, Highland | — |
| Frontier | 4 | 4 x 50x50 = 10,000 | II | Marsh, Mountain, Forest, Plains | Level 2, 3, 4 |
| The Sketch | 3 | 3 x 40x40 = 4,800 | III | Sketch-plains, Sketch-mountain, Sketch-forest | Level 5, Fortress |
| The Depths | 5 floors + 3-floor fortress | 8 x 20x25 = 4,000 | I-III | Dungeon, Dissolved Memory, Crystal | — |
| **Total** | **17 maps** | **~26,100 tiles** | | | |

## Travel and Pacing

- **Act I** (Village Hub + Settled Lands): ~7,300 tiles. Intimate, well-remembered spaces. Player learns mechanics in safety.
- **Act II** (Frontier): ~10,000 tiles. Vast, varied, and increasingly unfinished. The world opens up. Multiple quest lines run concurrently.
- **Act III** (The Sketch + Depths endgame): ~8,800 tiles. Stark, challenging, narratively intense. Linear progression toward the finale.

Estimated traversal time (without encounters): ~45 seconds per map at walking speed. The world is large enough for JRPG exploration but compact enough to avoid empty-world syndrome.
