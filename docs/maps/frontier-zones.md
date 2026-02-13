# Frontier Zones: Transition Aesthetics & Solidification Mechanics

> Cross-references: [docs/world/geography.md](../world/geography.md), [docs/world/vibrancy-system.md](../world/vibrancy-system.md), [docs/design/visual-direction.md](../design/visual-direction.md), [docs/design/tileset-spec.md](../design/tileset-spec.md), [docs/design/memory-system.md](../design/memory-system.md), [docs/maps/overworld-layout.md](overworld-layout.md), [docs/world/dormant-gods.md](../world/dormant-gods.md)

## Overview

The Frontier is the game's Act II region — the middle ring of the concentric world structure, between the well-remembered Settled Lands and the unfinished Sketch. Its defining feature is the **vibrancy gradient**: a visible transition from near-Normal detail (adjacent to Settled Lands) through increasingly thin memory (mid-Frontier) to near-Sketch abstraction (at the outer edge).

This document specifies:
1. **Transition tile gradients** between Settled Lands and Frontier, and between Frontier and Sketch
2. **Unfinished aesthetic descriptions** for each Frontier zone
3. **How the player "remembers" areas into solidity** (broadcasting mechanics in the Frontier and Sketch)
4. **Per-zone Frontier characteristics** tied to Act II expansion

---

## Transition Gradients

### Settled Lands → Frontier Transition

The transition from Settled Lands to Frontier is a **5-tile-wide gradient strip** along the border of each connecting map pair. The gradient is rendered in the Settled Lands map (the last 5 tiles before the edge transition) and mirrors in the Frontier map (the first 5 tiles after entry).

**Visual progression over 5 tiles**:

| Tile Position | Visual Description | Vibrancy Feel |
|--------------|-------------------|---------------|
| Tile 1 (Settled side) | Normal biome tiles with subtle color softening. 95% opacity. | "Something is slightly off." |
| Tile 2 | Colors wash out 20%. Detail reduces — grass textures simplify. Shadow edges soften. | "The colors are fading." |
| Tile 3 | Colors wash out 40%. Objects lose fine detail — trees become silhouettes with flat color fill. Ground textures flatten. | "This is clearly less detailed." |
| Tile 4 | Colors wash out 60%. Objects simplify dramatically — trees are colored shapes, buildings are blocks of color. Sky transitions toward Frontier palette. | "The world is thinning." |
| Tile 5 (Frontier side) | Full Frontier Muted-tier aesthetic. Objects are simplified but distinct. Colors are present but washed. The transition is complete. | "This is the Frontier." |

**Implementation note**: The gradient is achieved via a dedicated transition tileset strip (5 tiles wide) placed along zone borders. These tiles are authored as part of the parent zone's tileset (e.g., `tiles_grassland_transition.png` for Heartfield's border). They use alpha blending to fade between the Settled and Frontier visual states.

### Per-Border Transition Descriptions

| Border | Settled Zone | Frontier Zone | Transition Character |
|--------|-------------|--------------|---------------------|
| Heartfield → Shimmer Marsh | Golden wheat fades to pale straw → mud-gray marsh ground | Farmland dissolves into marshy sponge. Irrigation ditches become undefined puddles. Fences trail off into empty posts. |
| Ambergrove → Flickerveil | Dense forest canopy thins → tree outlines flicker | Full-canopy trees become translucent → trunks visible through leaves → some branches missing → flickering between solid and outline. |
| Millbrook → Hollow Ridge | Riverside stone roads climb → trail narrows into rock ledge | Stone-paved paths break up → individual flagstones → gravel → bare rock with occasional frost crystal. Bridge railings disappear first. |
| Sunridge → Hollow Ridge | Highland grass shortens → alpine scrub → bare rock | Rolling green hills flatten → sparse grass tufts → exposed stone. Wind effects increase as detail decreases — visual emptiness emphasizes motion. |

### Frontier → Sketch Transition

The Frontier-to-Sketch transition is more dramatic than Settled-to-Frontier. It occurs along the outer Frontier map edges that connect to Sketch zones.

**Visual progression over 5 tiles**:

| Tile Position | Visual Description | Vibrancy Feel |
|--------------|-------------------|---------------|
| Tile 1 (Frontier side) | Standard Frontier Muted tiles. Simplified but colored. | "The Frontier, but barely." |
| Tile 2 | Colors drain further. Objects begin to show visible outlines — like a painting with pencil lines showing through. | "The artist's sketch is visible." |
| Tile 3 | 50% of objects are outline-only. Ground transitions to sketch-paper luminous base. Some tiles flicker between filled and outline. | "This is barely finished." |
| Tile 4 | 80% outline. Only the most prominent objects (large trees, rocks, paths) retain any color fill. The sky is pure luminous white. | "Almost nothing." |
| Tile 5 (Sketch side) | Full Sketch aesthetic: line-art on luminous background. The transition is complete. | "Unfinished." |

**Implementation note**: Sketch transition tiles use the Sketch biome tileset's Muted tier with a graduated alpha overlay. Tiles 2-4 blend between the Frontier biome's Muted tileset and the Sketch biome's Muted tileset using alpha masks.

### Per-Border Sketch Transition Descriptions

| Border | Frontier Zone | Sketch Zone | Transition Character |
|--------|--------------|------------|---------------------|
| Shimmer Marsh → Luminous Wastes | Marsh vegetation thins → scattered pools become dotted circles → ground flattens to luminous plane | Water loses all reflective quality, becoming simple parallel lines. Reed silhouettes thin to single strokes. Mist becomes blank luminous space. |
| Hollow Ridge → Undrawn Peaks | Mountain rock simplifies → geometric shapes → wireframe triangles | Textured stone becomes flat color fill → gradient fills → wireframe outlines. Paths become dotted lines. The sky transitions from pale blue to pure white. |
| Flickerveil → Half-Drawn Forest | Flickering trees stabilize → outline-only → single curved lines for trunks | Trees lose their flicker animation and become static sketches. Canopy becomes dot-clusters. The forest floor fades to luminous grid-paper. |
| Resonance Fields → Luminous Wastes | Standing stones thin → outlines → simple vertical lines on luminous ground | Resonance Stones lose their amber glow, becoming gray line-art. The humming fades to silence. Grass disappears entirely — just grid lines on glowing white. |

---

## The "Painted Detail" Effect

When the player broadcasts a memory fragment in a Frontier zone, the visual effect goes beyond the standard tile-swap vibrancy system. The Frontier has a unique **painted detail effect** that makes broadcasting feel like painting detail onto an unfinished canvas.

### How It Works

1. **Broadcast occurs**: The player broadcasts a fragment at any point in a Frontier zone.
2. **Bloom radius**: Tiles within the fragment's bloom radius (see [vibrancy-system.md](../world/vibrancy-system.md)) gain a temporary visual upgrade — they jump to one tier above the zone's current vibrancy tier for their tile detail. For example, if the zone is at Muted (vibrancy 20), tiles in the bloom radius display Normal-tier detail.
3. **Persistence**: This local detail upgrade persists permanently. The upgraded tiles keep their enhanced detail even if the zone's overall vibrancy hasn't crossed a tier threshold.
4. **Spreading**: The enhanced detail slowly spreads to adjacent tiles at a rate of **1 tile per 60 seconds of real time** (only while the player is in the zone). This creates a growing circle of detail that expands from each broadcast point.
5. **Zone vibrancy interaction**: When the zone's overall vibrancy crosses a tier threshold (e.g., Muted → Normal), all tiles jump to at least that tier's detail level. The painted detail effect only shows tiles that are above the current zone tier — once the zone catches up, the painted detail merges seamlessly.

### Visual Example (Shimmer Marsh, Starting Vibrancy 30)

```
Before broadcast (all Muted tier):
┌─────────────────────────┐
│ muted muted muted muted │
│ muted muted muted muted │
│ muted muted muted muted │
│ muted muted muted muted │
└─────────────────────────┘

After broadcasting potency-3 fragment at center:
┌─────────────────────────┐
│ muted muted muted muted │
│ muted NORM  NORM  muted │
│ muted NORM  NORM  muted │  ← 7x7 bloom radius shows Normal-tier detail
│ muted muted muted muted │
└─────────────────────────┘

5 minutes later (spreading 5 tiles outward):
┌─────────────────────────────────────┐
│ muted muted muted muted muted muted│
│ muted NORM  NORM  NORM  NORM  muted│
│ muted NORM  NORM  NORM  NORM  muted│
│ muted NORM  NORM  NORM  NORM  muted│
│ muted NORM  NORM  NORM  NORM  muted│
│ muted muted muted muted muted muted│
└─────────────────────────────────────┘
```

### Thematic Significance

The painted detail effect is the Frontier's primary visual reward. It makes the player feel like they're literally painting the world into existence — each broadcast leaves a visible mark on the landscape. Combined with the vibrancy system's tile-swap at tier boundaries, the Frontier provides constant visual feedback for the player's creative engagement.

---

## Sketch Solidification Mechanics

In Sketch zones (Luminous Wastes, Undrawn Peaks, Half-Drawn Forest), broadcasting doesn't just add visual detail — it makes terrain **traversable**. Sketch terrain starts as outline-only and must be solidified before the player can walk on it.

### How Solidification Works

1. **Unsolidified terrain**: The default state. Sketch tiles are outline-only (Muted tier). The player can see the outline of a bridge, path, or building, but cannot walk on it. Collision layer blocks passage.
2. **Broadcasting**: The player broadcasts a fragment at or adjacent to the unsolidified terrain.
3. **Solidification**: Tiles within the broadcast's bloom radius become solid — they transition from outline to filled (the Sketch biome's Normal or Vivid tier, depending on fragment potency). The collision layer updates: previously blocked tiles become walkable.
4. **Permanence**: Solidification is permanent. Once terrain is solidified, it stays solid regardless of future vibrancy changes.

### Solidification Area by Potency

| Fragment Potency | Solidification Radius | Tiles Solidified |
|-----------------|----------------------|-----------------|
| 1 star | 3×3 | 9 tiles |
| 2 stars | 5×5 | 25 tiles |
| 3 stars | 7×7 | 49 tiles |
| 4 stars | 9×9 | 81 tiles |
| 5 stars | 11×11 | 121 tiles (~1/12th of a Sketch map) |

### Specific Solidification Targets

Some Sketch terrain requires specific emotion/element combinations to solidify, creating puzzle elements:

| Target | Location | Requirement | Narrative |
|--------|----------|-------------|-----------|
| Half-Built Village | Luminous Wastes (18, 18) | 3 separate broadcasts (any), potency 2+ each | Three broadcasts to solidify village outline → village becomes a rest point with 3 dissolved fragments |
| Sketch Bridge | Undrawn Peaks (20, 20) | Any fragment, potency 2+ | Bridge outline solidifies into planks, ropes, wood grain. Required for MQ-08 traversal. |
| Wireframe Ridges | Undrawn Peaks (throughout) | Any fragment, potency 1+ per handhold | Each 3×3 section of ridge needs a broadcast to create solid handholds. ~5 broadcasts to traverse the full ridge. |
| The Living Sketch | Half-Drawn Forest (18, 23) | Any fragment, potency 3+ | Broadcasting "locks in" a version of the self-drawing forest. Creates a clearing with a Resonance Stone. |
| Crystalline Fortress Gate approach | Undrawn Peaks (19, 34) | Any fragment, potency 3+ | Solidifies the Sketch terrain around the gate for MQ-08 entry. |

### Solidification Visual Sequence

The solidification animation is one of the game's signature visual moments:

1. **Frame 0-10 (0.5 sec)**: Fragment energy pulses outward from broadcast point as a ring of golden light.
2. **Frame 10-30 (1.0 sec)**: Within the solidification radius, outline tiles begin to fill. Colors "paint" inward from the edges of each tile — like watercolor on wet paper. The fill color matches the base biome at Normal tier.
3. **Frame 30-50 (1.0 sec)**: Detail textures appear. Grass blades resolve from flat color. Tree bark develops texture. Paths gain stone or dirt definition.
4. **Frame 50-60 (0.5 sec)**: Final settling. Shadows appear. Ambient particles (pollen, dust) begin within the solidified area. The collision layer silently updates.
5. **Frame 60+ (ongoing)**: Solidified tiles match the zone's current vibrancy tier. If the zone is still at Muted, the newly solidified tiles show Normal-tier detail (one tier above, like the painted detail effect in Frontier zones).

---

## Per-Zone Frontier Characteristics

### 3A: Shimmer Marsh — The Reflective Frontier

**Starting Vibrancy**: 30 (Muted) | **Biome**: Wetland/Marsh
**Act**: II | **Theme**: Memory as reflection — pools show the past, not the present

#### Unfinished Aesthetic

Shimmer Marsh is the most "complete" Frontier zone (starting vibrancy 30, near the Muted/Normal threshold). Its incompleteness manifests as:

- **Water surfaces** that reflect memories instead of sky — players occasionally see flashes of dissolved civilization scenes in pool reflections (narrative texture, not gameplay-affecting)
- **Ground paths** that are spongy and unreliable — some boardwalk sections are drawn but not solid (cosmetic variance: the planks flicker between solid and translucent)
- **Vegetation** that's inconsistent in detail — some reeds are fully rendered while adjacent ones are translucent smudges
- **Mist** that's too thick and too still — it hangs in sheets rather than drifting, as if the world hasn't remembered how wind works in this area yet

#### Broadcasting Interaction

Broadcasting in Shimmer Marsh has a unique water-themed visual: the painted detail effect spreads outward in concentric ripples (matching the water motif) rather than the standard circular bloom. Water pools within the broadcast radius gain reflective properties — they show the current sky instead of dissolved memories.

**Resonant emotion**: Sorrow | **Element affinity**: Water

Sorrow+water broadcasts gain maximum bonus (+3 emotion + 2 element = +5 bonus) on top of potency. This makes Shimmer Marsh the fastest zone to brighten if the player has sorrow/water fragments — thematically fitting (sorrow feeds the reflective waters).

#### Frontier Expansion Trigger

Shimmer Marsh becomes accessible after MQ-04 (Lira's freezing opens the southern road from Heartfield). The zone opens fully after MQ-05 when the player enters the Frontier proper. Key content gated by vibrancy:

| Vibrancy Threshold | Content Unlocked |
|-------------------|------------------|
| 30 (start) | Basic marsh exploration, Wynn's hut, initial fragments |
| 34 (Normal tier) | Verdance's Hollow approach clears, SQ-06 dormant stones activate, deeper marsh paths become traversable |
| 50 | Traveling merchant visits Wynn's hut (sells Tier 2 consumables), additional NPC dialogue about the marsh's history |
| 67 (Vivid tier) | Marsh pools become fully reflective (show real-time scene). Memory fragment potency +1. Deepwater Sinkhole entrance glows brighter. |

---

### 3B: Hollow Ridge — The Ambitious Frontier

**Starting Vibrancy**: 20 (Muted) | **Biome**: Mountain/Highland
**Act**: II | **Theme**: The world reached up but couldn't finish

#### Unfinished Aesthetic

Hollow Ridge is dramatically unfinished — mountains that end mid-peak, cliffs that trail off into shimmer, paths that dead-end at nothing. Its incompleteness manifests as:

- **Mountain peaks** that are flat-topped or end in shimmering caps — the world's sculptor stopped mid-carve. Some peaks visually "draw themselves" in real time (the top edge slowly shifts, as if being sketched by an invisible hand)
- **Cliff faces** with visible construction lines — the striations look like pencil guidelines on rock rather than natural geological patterns
- **Wind** that carries audible memory-sounds: distant laughter, echoes of hammering, fragments of shouted conversations from the mountain-dwelling civilization that dissolved
- **Snow patches** that are too perfect — rectangular, evenly distributed, as if placed by an artist rather than accumulated naturally

#### Broadcasting Interaction

Broadcasting on Hollow Ridge has a seismic visual: the painted detail effect radiates from the broadcast point as visible shockwaves through the rock. Mountain faces within the radius gain additional geological detail — striations deepen, crystals appear in rock faces, caves develop visible depth. The effect feels like the mountain is remembering its own geology.

**Resonant emotion**: Fury | **Element affinity**: Fire

Fury+fire broadcasts gain maximum bonus here. This is thematically apt — the mountains were built by a civilization of determined builders (fury = determination), and the Kinesis god (motion/earth/fire) sleeps at the highest spire.

#### Frontier Expansion Trigger

Hollow Ridge becomes accessible from Sunridge (north) after MQ-04 and from other Frontier zones after MQ-05. Content gating:

| Vibrancy Threshold | Content Unlocked |
|-------------------|------------------|
| 20 (start) | Ridgewalker Camp accessible, basic mountain paths, Kinesis Spire visible but not approachable |
| 34 (Normal tier) | Echo Caverns entrance visible, Shattered Pass puzzle activates, additional mountain trails solidify |
| 50 | Ridgewalker Camp expands (new NPCs arrive, merchant stock improves), Kinesis Spire approach path stabilizes |
| 67 (Vivid tier) | Mountain peaks complete their formation (dramatic visual: peaks rise to full height over 5 seconds). Crystal inlays visible in all rock faces. Fragment potency +1. |

---

### 3C: Flickerveil — The Unstable Frontier

**Starting Vibrancy**: 25 (Muted) | **Biome**: Forest transitioning to Sketch
**Act**: II | **Theme**: Reality flickering between complete and incomplete

#### Unfinished Aesthetic

Flickerveil is the most visually unsettling Frontier zone. The forest actively flickers between states of completion — trees blink between fully rendered and outline-only, light behaves inconsistently, and the player's shadow is sometimes the most detailed thing on screen.

- **Trees** that flicker between three states: (1) full rendered tree, (2) flat-color silhouette, (3) line-art outline. Each tree flickers independently on a 3-8 second random cycle. The effect is like a forest caught between existing and not-existing.
- **Light** that contradicts itself — shadows point in multiple directions simultaneously, some cast by invisible objects, others cast by objects that aren't currently in their "rendered" flicker state
- **Memory motes** that drift between branches in visible streams — luminous particles that look like dissolved fireflies, carrying micro-flashes of imagery from the civilization that planned this forest
- **Ground textures** that phase between leaf litter (rendered) and luminous grid-paper (Sketch), creating a checkerboard effect that shifts with the player's movement

#### Broadcasting Interaction

Broadcasting in Flickerveil "stabilizes" the flicker in the bloom radius. Trees within the radius stop flickering and lock into their fully rendered state. This is the Frontier's most dramatic painted detail effect — a broadcast literally stops the forest from blinking, creating an island of visual stability in the flickering chaos.

**Resonant emotion**: Awe | **Element affinity**: Wind

Awe+wind broadcasts gain maximum bonus. Flickerveil's civilization planned this forest with awe and reverence for nature — the wind that carries their dissolved memories still rustles through the incomplete branches.

#### Frontier Expansion Trigger

Flickerveil is accessible from Ambergrove (east, via Canopy Path) after MQ-04, and from other Frontier zones after MQ-05. Content gating:

| Vibrancy Threshold | Content Unlocked |
|-------------------|------------------|
| 25 (start) | Flickering Village reachable, Luminos Grove visible but blinding (requires K-04), Resonance Archive occupied |
| 34 (Normal tier) | Flickering reduces to 50% of trees (half are permanently stable). Veil's Edge becomes traversable. Additional paths through forest stabilize. |
| 50 | Flickering Village stabilizes fully (buildings stop shimmering). Elyn's shop opens (if GQ-03-S1 completed). |
| 67 (Vivid tier) | All flickering stops — the entire forest locks into its rendered state permanently. The transition from solid forest to Sketch at Veil's Edge becomes visually dramatic (fully rendered → outline over 3-4 tiles). Fragment potency +1. |

---

### 3D: Resonance Fields — The Sacred Frontier

**Starting Vibrancy**: 15 (Muted) | **Biome**: Open Plains
**Act**: II | **Theme**: Sound without form — the land ran out of detail but filled with music

#### Unfinished Aesthetic

Resonance Fields is the most visually sparse Frontier zone but the most aurally rich. The land is almost featureless — flat, pale grass with scattered Resonance Stones — but every stone hums, and the wind carries audible fragments of the dissolved Choir's performances.

- **Ground** that is nearly featureless — short pale grass with no flowers, no rocks, no terrain variation. The emptiness is deliberate: the world ran out of visual detail but invested everything in acoustic richness.
- **Resonance Stones** that are the dominant visual features — tall standing stones scattered across the plains like a petrified forest. Each stone hums at a different pitch. Walking between them creates a harmonic landscape — the BGM is literally generated by the player's proximity to stones.
- **Sky** that is enormous — the low detail level means the sky dominates the visual frame. In Muted tier, it's pale luminous white. As vibrancy rises, the sky gains color and depth, becoming the zone's primary visual reward.
- **Wind** that is visible — the only animated element in the Muted-tier landscape. Grass sway and dust particles are the sole sources of motion, making them hypnotically prominent.

#### Broadcasting Interaction

Broadcasting in Resonance Fields creates an **audible detail effect** in addition to the standard painted detail. When a fragment is broadcast, every Resonance Stone within the bloom radius briefly rings in unison, creating a chord. The chord's quality depends on the fragment's emotion:

| Emotion | Chord Quality |
|---------|--------------|
| Joy | Major chord (warm, bright, resolved) |
| Fury | Power chord (raw, energetic, driving) |
| Sorrow | Minor chord (melancholic, deep, resonant) |
| Awe | Suspended chord (open, expansive, unresolved → resolving) |

This audio effect persists: stones within a broadcast radius permanently add their chord quality to the zone's BGM when the player passes near them. Multiple broadcasts with different emotions create a layered musical landscape unique to each playthrough.

**Resonant emotion**: Awe | **Element affinity**: Wind

Awe+wind broadcasts gain maximum bonus. The Choir of the First Dawn created Resonance Fields with awe as their primary creative emotion.

#### Frontier Expansion Trigger

Resonance Fields is accessible from Hollow Ridge (south) and Shimmer Marsh (east) after MQ-05. Content gating:

| Vibrancy Threshold | Content Unlocked |
|-------------------|------------------|
| 15 (start) | Listener's Camp reachable, basic stone exploration, Amphitheater visible but surrounded by dissonant stones |
| 25 | Preserver Cathedral silence field perimeter visible. 3 of the harmonization stones for Amphitheater approach become active. |
| 34 (Normal tier) | All harmonization stones active. Singing Stones puzzle activatable. Standing stone density increases (cosmetic: more stones "grow" from the ground). Amphitheater approach becomes traversable. |
| 50 | Listener's Camp expands. Traveling merchant visits. Sky gains visible color bands (pre-aurora). Resonance Stone hums become louder and more melodic. |
| 67 (Vivid tier) | Full Resonance — every stone is active and visually pulsing. The sky shows aurora wisps. The ground develops flower meadows between stones. The entire zone hums with a continuous, beautiful harmonic. Fragment potency +1. |

---

## Frontier Expansion Timeline

The Frontier zones open in a staged progression tied to the main quest:

| Quest | Unlock | Frontier Access |
|-------|--------|----------------|
| MQ-04 (Act I climax) | Mountain pass north of Village Hub opens | Sunridge → Hollow Ridge border visible, Heartfield → Shimmer Marsh road opens |
| MQ-05 (Enter the Frontier) | All Frontier zones accessible | Shimmer Marsh, Hollow Ridge, Flickerveil, Resonance Fields all reachable |
| GQ-01–04 (God recalls) | God shrine areas activate | Each shrine's approach challenge becomes solvable |
| MQ-07 (Curator's Endgame) | Sketch borders open | Frontier → Sketch transitions traversable (Shimmer → Luminous, Hollow → Undrawn, Flickerveil → Half-Drawn, Resonance → Luminous) |

### Typical Vibrancy Progression (Frontier, Full Playthrough)

| Game Stage | Shimmer (30) | Hollow (20) | Flicker (25) | Resonance (15) |
|------------|-------------|-------------|-------------|----------------|
| MQ-05 (entry) | 30 | 20 | 25 | 15 |
| First god recall | 40-45 | 30-35 | 35-40 | 30-35 |
| Second god recall | 50-55 | 45-50 | 50-55 | 45-50 |
| MQ-07 (Act II end) | 55-65 | 50-60 | 55-65 | 50-60 |
| Act III (backtracking) | 65-80 | 60-75 | 65-80 | 60-75 |
| Endgame bloom | 95 | 95 | 95 | 95 |

These estimates assume the player broadcasts ~3-5 fragments per zone visit, completes side quests that grant vibrancy bonuses, and clears stagnation zones (which remove Preserver reinforcement and grant +10 each).

---

## Frontier Visual Vocabulary

### Elements That Indicate Incompleteness

The Frontier uses a consistent visual vocabulary to communicate "this is not finished yet":

| Visual Cue | Meaning | Examples |
|------------|---------|---------|
| Translucent edges | Object is not fully remembered | Tree canopies, building walls, fence posts |
| Visible construction lines | The world's underlying structure shows through | Mountain striations, path borders, bridge supports |
| Inconsistent shadows | Light hasn't been fully figured out | Multiple shadow directions, shadows from invisible objects |
| Missing small detail | Large forms exist but fine texture doesn't | Trees without bark texture, water without ripples, grass without individual blades |
| Flickering | Object exists in superposition (Flickerveil only) | Trees, buildings, bridges |
| Flat color fills | Shape exists but texture doesn't | Distant mountains, background vegetation, decorative objects |
| Luminous void (background) | Where the world simply stops | Beyond map edges, behind unfinished structures, below incomplete floors |

### Elements That Indicate Broadcasting Impact

After the player broadcasts, these visual changes confirm their impact:

| Visual Change | Meaning | Duration |
|--------------|---------|----------|
| Color intensification | Vibrancy rising | Permanent |
| Texture resolution | Detail being added | Permanent |
| Shadow correction | Lighting being finalized | Permanent |
| Flicker stabilization | Object being solidified | Permanent |
| Ambient particle bloom | Memory energy settling | 5 seconds post-broadcast |
| Resonance Stone brightening | Local memory density increasing | Permanent |
| NPC detail increase | Characters becoming more realized | At tier threshold |

---

## Implementation Notes for Phase 2

### Frontier Gradient Tiles

Each Frontier zone needs a 5-tile transition strip tileset for each border:

| Zone | Borders Needing Gradients | Tileset Files |
|------|--------------------------|---------------|
| Shimmer Marsh | North (→Heartfield), East (→Flickerveil), South (→Luminous Wastes) | `tiles_marsh_gradient_settled.png`, `tiles_marsh_gradient_frontier.png`, `tiles_marsh_gradient_sketch.png` |
| Hollow Ridge | South (→Sunridge), East (→Flickerveil), North (→Undrawn Peaks) | `tiles_mountain_gradient_settled.png`, `tiles_mountain_gradient_frontier.png`, `tiles_mountain_gradient_sketch.png` |
| Flickerveil | SW (→Ambergrove), West (→Shimmer/Hollow), East (→Half-Drawn Forest) | `tiles_forest_gradient_settled.png`, `tiles_forest_gradient_frontier.png`, `tiles_forest_gradient_sketch.png` |
| Resonance Fields | North (→Hollow Ridge), East (→Shimmer Marsh), West (→Luminous Wastes) | `tiles_plains_gradient_frontier.png`, `tiles_plains_gradient_sketch.png` |

### Painted Detail Effect Data

Track painted detail as a per-tile boolean array per zone. Each zone's Tiled TMX map gets an additional data layer (`painted_detail`) that tracks which tiles have been upgraded:

```
painted_detail: {
  "shimmer_marsh": {
    tiles: [false, false, true, true, ...],  // 50×50 = 2500 entries
    spread_origins: [{x: 25, y: 30, time: 1234567890}, ...]
  }
}
```

The spreading mechanic runs only when the player is in the zone — check `spread_origins` timestamps and expand the `true` region outward by 1 tile per 60 seconds elapsed.

### Solidification State (Sketch Zones)

Track solidification as a per-tile boolean array per Sketch zone. Solidified tiles update the collision layer in real time:

```
solidification: {
  "luminous_wastes": {
    tiles: [false, false, true, true, ...],  // 40×40 = 1600 entries
  }
}
```

When a tile transitions from `false` to `true`, update the TMX collision layer to remove the block and swap the tile graphic from Sketch Muted to Sketch Normal.

### Flickerveil Flicker System

Flickerveil's tree flicker requires per-object timers:

- Each tree object has a `flickerCycle` (3-8 seconds, randomized at map load)
- Each tree object has a `flickerState` (0 = full render, 1 = silhouette, 2 = outline)
- Trees cycle through states on their individual timers
- Trees within a painted-detail region lock to state 0 (full render) permanently
- At Vivid tier, all trees lock to state 0

### Resonance Fields Audio Detail

Resonance Fields' per-stone chord system requires:

- Each Resonance Stone stores a `chordType` (null until broadcast near it, then "joy"/"fury"/"sorrow"/"awe")
- Proximity detection: when the player is within 5 tiles of a stone with a chordType, that chord plays as an audio layer
- Multiple simultaneous chords blend additively (Web Audio API gain nodes)
- Maximum 4 simultaneous chord layers (the 4 nearest stones)
