# Vibrancy System: Per-Zone World Brightening

> Cross-references: [docs/design/memory-system.md](../design/memory-system.md), [docs/design/visual-direction.md](../design/visual-direction.md), [docs/world/geography.md](geography.md), [docs/world/core-theme.md](core-theme.md), [docs/world/factions.md](factions.md)

## Overview

Vibrancy is the numeric representation of how "alive" a zone is. Every zone in the game world tracks its own vibrancy score on a 0-100 scale. When the player broadcasts memory fragments into a zone, vibrancy rises, causing visible tile swaps, richer audio, and new gameplay content to appear. When the Preservers reinforce a zone, vibrancy drops toward crystalline stasis.

This system is the primary feedback loop of the game: explore → collect memories → broadcast memories → world brightens → more to explore.

---

## The Vibrancy Scale

### Per-Zone Tracking

Each of the game's 17 maps (see [geography.md](geography.md)) maintains an independent integer vibrancy score from 0 to 100. Vibrancy never drops below 0 or exceeds 100.

### Three Visual Tiers

| Tier | Range | Visual Keyword | Audio Keyword |
|------|-------|----------------|---------------|
| **Muted** | 0-33 | Watercolor sketch, soft pastels, sparse detail | Sparse, acoustic, solo instruments |
| **Normal** | 34-66 | Full natural palette, warm lighting, populated | Standard orchestration, ambient life sounds |
| **Vivid** | 67-100 | Saturated luminance, stained-glass quality, particle blooms | Full ensemble, choral elements, rich reverb |

Tier transitions happen **instantly** when a zone's vibrancy crosses a threshold (33→34 or 66→67). The tile swap is immediate but accompanied by a 2-second visual bloom effect so the player registers the change.

### Starting Vibrancy Values

These values are set when the game begins and represent how "remembered" each zone already is (see [geography.md](geography.md)):

| Zone | Starting Vibrancy | Starting Tier |
|------|-------------------|---------------|
| Village Hub | 60 | Normal |
| Heartfield | 55 | Normal |
| Millbrook | 50 | Normal |
| Ambergrove | 45 | Normal |
| Sunridge | 40 | Normal |
| Shimmer Marsh | 30 | Muted |
| Flickerveil | 25 | Muted |
| Hollow Ridge | 20 | Muted |
| Resonance Fields | 15 | Muted |
| Luminous Wastes | 5 | Muted |
| The Half-Drawn Forest | 8 | Muted |
| The Undrawn Peaks | 10 | Muted |
| Depths Level 1: Memory Cellar | 35 | Normal |
| Depths Level 2: Drowned Archive | 40 | Normal |
| Depths Level 3: Resonant Caverns | 30 | Muted |
| Depths Level 4: The Songline | 25 | Muted |
| Depths Level 5: The Deepest Memory | 45 | Normal |
| Preserver Fortress (all 3 floors) | 0 | Muted (crystallized) |

---

## Broadcasting: How Vibrancy Changes

### The Broadcast Formula

When the player broadcasts a memory fragment into a zone, vibrancy increases by:

```
vibrancy_gain = (fragment_potency × 3) + emotion_bonus + element_bonus
```

| Factor | Value | Notes |
|--------|-------|-------|
| **fragment_potency** | 1-5 stars | Core multiplier. A 1-star fragment yields base +3; a 5-star yields base +15. |
| **emotion_bonus** | +0 to +3 | If the fragment's emotion matches the zone's "resonant emotion" (see table below), add +3. Partial match: +1. No match: +0. |
| **element_bonus** | +0 to +2 | If the fragment's element matches the zone's biome affinity (see table below), add +2. No match: +0. |

**Maximum possible gain per broadcast**: 5×3 + 3 + 2 = **20 vibrancy points** (5-star fragment with perfect emotion and element match).

**Minimum possible gain per broadcast**: 1×3 + 0 + 0 = **3 vibrancy points** (1-star fragment, no resonance).

### Zone Resonant Emotions

Each zone responds most strongly to a specific emotion type. This creates strategic choice in which fragments to broadcast where.

| Zone | Resonant Emotion | Thematic Reason |
|------|-----------------|-----------------|
| Village Hub | Joy | Community warmth and celebration |
| Heartfield | Calm | Pastoral contentment |
| Ambergrove | Awe | Forest wonder and discovery |
| Millbrook | Joy | Riverside prosperity |
| Sunridge | Fury | Wind-battered determination |
| Shimmer Marsh | Sorrow | Reflective, meditative waters |
| Hollow Ridge | Fury | Mountain endurance and challenge |
| Flickerveil | Awe | Uncanny beauty of flickering reality |
| Resonance Fields | Awe | Sacred sound and wonder |
| Luminous Wastes | Sorrow | Grief for what was never completed |
| The Undrawn Peaks | Fury | Ambition to build higher |
| The Half-Drawn Forest | Calm | Patient growth and potential |
| Depths Level 1 | Calm | Gentle introduction to memory |
| Depths Level 2 | Sorrow | Drowned knowledge and loss |
| Depths Level 3 | Awe | Resonant cave acoustics |
| Depths Level 4 | Joy | The dissolved civilization's final song |
| Depths Level 5 | Awe | The world's oldest, deepest memory |
| Preserver Fortress | Any (all +0) | Crystallized — no emotion resonates |

### Zone Biome Element Affinities

| Biome Type | Element Affinity | Zones Using This Biome |
|------------|-----------------|------------------------|
| Village | Neutral | Village Hub |
| Grassland/Farmland | Earth | Heartfield, Sunridge |
| Forest | Wind | Ambergrove, Flickerveil, Half-Drawn Forest |
| Riverside/Water | Water | Millbrook, Shimmer Marsh |
| Mountain | Fire | Hollow Ridge, Undrawn Peaks |
| Plains | Wind | Resonance Fields |
| Sketch | Light | Luminous Wastes |
| Dungeon/Underground | Dark | All Depths levels |
| Crystal/Stagnation | Neutral | Preserver Fortress |

### Broadcast Radius

Broadcasting affects tiles in a radius around the broadcast point. This is primarily visual — vibrancy is tracked at the zone level, but the tile-brightening animation originates from the broadcast point and expands outward.

| Fragment Potency | Visual Bloom Radius | Animation Duration |
|-----------------|--------------------|--------------------|
| 1 star | 3x3 tiles | 1.5 seconds |
| 2 stars | 5x5 tiles | 2.0 seconds |
| 3 stars | 7x7 tiles | 2.5 seconds |
| 4 stars | 9x9 tiles | 3.0 seconds |
| 5 stars | 11x11 tiles | 3.5 seconds |

In the Frontier zones (see [geography.md](geography.md)), the broadcast radius also determines the local "painted detail" effect — tiles within the radius gain additional visual detail independent of the zone's overall vibrancy. This detail persists permanently and slowly spreads to adjacent tiles at a rate of 1 tile per 60 seconds of real time.

In the Sketch zones, broadcasting "paints" the area into solidity (see geography.md, Zone 4 section):
- 1-star fragment: solidifies a 3x3 tile area
- 5-star fragment: solidifies a 9x9 tile area
- Solidification is permanent and required for traversal

---

## Vibrancy Decay and Preserver Reinforcement

### Natural Decay

Vibrancy does **not** decay naturally. Once the player brightens a zone, it stays bright. This is a deliberate design choice: the theme is memory as creative vitality, and memories shared with the world should feel permanent and meaningful. Punishing the player with decay would undermine the core theme (see [core-theme.md](core-theme.md)).

### Preserver Reinforcement

The Preservers actively work to reduce vibrancy in zones where they have a presence. This is the only source of vibrancy reduction in the game.

**Preserver-Occupied Zones**: These zones have active Preserver agents that push vibrancy downward:

| Zone | Preserver Presence | Reinforcement Rate |
|------|-------------------|-------------------|
| Heartfield (Stagnation Clearing only) | Light — 1 scout | -1 vibrancy per 5 minutes (affects whole zone) |
| Sunridge (Preserver Outpost) | Medium — 2 agents | -2 vibrancy per 5 minutes |
| Shimmer Marsh (Stagnation Bog) | Medium — 2 agents + patrols | -2 vibrancy per 5 minutes |
| Hollow Ridge (Shattered Pass) | Heavy — 3 agents | -3 vibrancy per 5 minutes |
| Resonance Fields (Preserver Cathedral) | Heavy — 3 agents + captain | -3 vibrancy per 5 minutes |
| Luminous Wastes (Preserver Watchtower) | Elite — archivists | -4 vibrancy per 5 minutes |
| Preserver Fortress | Total — Grym | Locked at 0, cannot be raised until boss defeat |

**Clearing Preserver presence permanently stops decay in that zone.** Clearing means defeating all Preserver agents in the zone's stagnation area and broadcasting a memory fragment of potency 3+ into the cleared zone's focal point (the crystallized object/area). This is a one-time action per zone.

**Preserver reinforcement does not reduce vibrancy below the zone's "floor" value:**

| Zone | Vibrancy Floor | Reason |
|------|---------------|--------|
| Heartfield | 40 | Only a small clearing is affected |
| Sunridge | 25 | Outpost influence is limited |
| Shimmer Marsh | 15 | Bog is remote from rest of marsh |
| Hollow Ridge | 10 | Mountain terrain resists stagnation |
| Resonance Fields | 5 | Cathedral's silence field is potent |
| Luminous Wastes | 0 | The Sketch has no inherent resistance |
| Preserver Fortress | 0 | Fully crystallized |

### Stagnation Zone Mechanics

Stagnation zones are localized areas within a map where the Preservers have frozen everything. They are distinct from the zone's overall vibrancy — a zone can be at Normal vibrancy (50) but still have a Stagnation Zone within it (like Heartfield's Stagnation Clearing).

**Breaking a Stagnation Zone requires:**

1. The player must stand adjacent to the zone's crystallized focal point (e.g., a frozen Resonance Stone, crystallized tree, etc.)
2. Broadcast a memory fragment that meets the zone's **unlock condition**:

| Stagnation Zone | Location | Unlock Condition | Narrative Moment |
|----------------|----------|------------------|------------------|
| Stagnation Clearing | Heartfield (35, 30) | Any fragment, potency 1+ | Act I tutorial — Hana walks you through it |
| Preserver Outpost | Sunridge (32, 15) | Fury emotion, potency 2+ | First real challenge — requires intentional fragment choice |
| Stagnation Bog | Shimmer Marsh (40, 10) | Water element + Fury emotion, potency 3+ | Dual requirement — player must have remixed |
| Shattered Pass | Hollow Ridge (35, 30) | 3 sequential broadcasts: Earth, Fire, Wind elements | Puzzle — broadcast at 3 different crystals in order |
| Preserver Cathedral | Resonance Fields (40, 15) | Awe emotion, potency 4+ | Major milestone — requires high-quality fragment |
| Preserver Watchtower | Luminous Wastes (35, 10) | Any 5-star fragment | Brute force — the Sketch needs maximum memory power |
| Preserver Fortress | Undrawn Peaks entrance | Story-gated (Act III progression) | Cannot be broken by broadcast alone — requires all 4 gods recalled |

3. Upon breaking: crystallized tiles shatter in a 2-second animation (crystal fragments fly outward, warm color floods in), frozen NPCs unfreeze, the Preserver agents in that zone become hostile (combat encounter), and after victory the zone's vibrancy immediately gains +10.

---

## Visual Tier Specifications

### How Tile Swaps Work

Each biome has **three tileset variants** — one per vibrancy tier. When a zone crosses a tier threshold, every tile on the map is swapped to the corresponding variant. This is implemented as three complete tileset PNGs per biome; the game loads the appropriate one based on current vibrancy tier.

The swap is not gradual — it is instant, masked by a 2-second bloom transition effect (a soft white flash that fades to reveal the new palette).

### Biome: Village

**Used by**: Village Hub

| Tile Type | Muted (0-33) | Normal (34-66) | Vivid (67-100) |
|-----------|-------------|----------------|-----------------|
| Ground (cobblestone) | Pale gray, joints barely visible | Warm gray-brown, visible mortar lines | Rich warm stone, golden mortar highlights |
| Path (dirt) | Flat beige, no texture detail | Packed earth with footprints, pebbles | Warm ochre with wildflower edges |
| Grass (patches) | Pale sage, sparse | Medium green, small flowers | Deep emerald, abundant flowers, butterflies |
| Building walls | Washed-out cream | Warm plaster tones (cream, peach, soft yellow) | Saturated plaster with painted trim, hanging baskets |
| Roofs (thatched) | Flat tan | Golden straw with visible bundling | Rich gold-brown, birds nesting, chimney smoke |
| Water (fountain) | Still, pale blue | Flowing, natural blue with reflections | Sparkling prismatic, golden memory-motes rising |
| Lanterns | Unlit, gray metal | Warm amber glow | Bright golden light with floating sparkles |
| Trees | Bare silhouette, pale bark | Full canopy, green leaves | Lush canopy, blossoms, dappled light patches |
| Fences/hedges | Bare wooden stakes | Leafy hedges, whitewashed fences | Flowering hedges cascading over fences |
| Decorations | None | Occasional banners, potted plants | Banners on every building, flower boxes, bunting |

### Biome: Grassland/Farmland

**Used by**: Heartfield, Sunridge

| Tile Type | Muted (0-33) | Normal (34-66) | Vivid (67-100) |
|-----------|-------------|----------------|-----------------|
| Grass (base) | Pale sage-green, flat | Medium green, subtle grass blade texture | Rich emerald, individual blades, wildflowers |
| Wheat fields | Pale straw, short | Golden wheat, medium height, gentle sway | Deep gold, tall wheat, wind ripples, pollen motes |
| Dirt paths | Flat light brown | Packed brown with wheel ruts | Warm ochre, lined with small stones and flowers |
| Farmsteads | Pale wood, minimal detail | Painted wood, flower boxes, smoke from chimneys | Saturated colors, abundant gardens, laundry lines |
| Fences | Simple posts | Rail fences, whitewashed | Decorated fences with climbing vines |
| Water (streams) | Pale, barely moving | Clear flowing blue | Sparkling, fish visible, reeds at edges |
| Rocks/boulders | Flat gray | Textured gray with moss | Gray-green with thick moss, small critters |
| Trees (scattered) | Bare trunks | Full canopy, bird nests | Fruit-bearing, butterflies, dappled shadows |
| Hills | Flat green bumps | Rolling contours with shadow | Rich undulating terrain, sheep grazing |

### Biome: Forest

**Used by**: Ambergrove, Flickerveil, Half-Drawn Forest

| Tile Type | Muted (0-33) | Normal (34-66) | Vivid (67-100) |
|-----------|-------------|----------------|-----------------|
| Ground (forest floor) | Flat gray-brown | Leaf litter, moss patches, root textures | Dense undergrowth, mushrooms, fallen logs |
| Trees (deciduous) | Bare trunks, no leaves | Full green canopy, bark texture | Lush multi-shade canopy, blossoms, nesting birds |
| Trees (conifer) | Dark silhouettes | Green needles, visible branches | Deep rich green, pinecones, sap gleam |
| Canopy light | None — flat ambient | Dappled light patches on ground | Golden light shafts with visible dust motes |
| Moss | None | Patches on rocks and tree bases | Thick carpet, bioluminescent accents |
| Water (lake/pond) | Gray, reflectionless | Blue-green, tree reflections | Crystal clear, fish, lily pads, dragonflies |
| Paths | Barely visible trails | Clear dirt paths, leaf edges | Mossy stone stepping paths, fern borders |
| Clearings | Flat open patches | Grass with wildflowers | Lush meadows, butterfly clouds, resonance motes |
| Resonance Stones | Dull gray pillars | Softly humming, faint amber glow | Bright pulsing amber, floating memory particles |

### Biome: Riverside/Water

**Used by**: Millbrook

| Tile Type | Muted (0-33) | Normal (34-66) | Vivid (67-100) |
|-----------|-------------|----------------|-----------------|
| River water | Flat pale blue, no flow | Flowing blue, white ripple lines | Deep blue-green, sparkling, splashing at banks |
| Riverbanks | Flat mud-brown | Sandy brown with reeds | Rich earth, wildflowers, smooth river stones |
| Bridges | Gray stone, minimal detail | Warm stone, visible arches, railings | Decorated stone, flower garlands, lanterns |
| Waterfalls | Pale vertical lines | White cascading water, mist | Prismatic spray, rainbow in mist, roaring foam |
| Docks/piers | Bare wood planks | Weathered wood, rope coils, crates | Painted wood, moored boats, fishing nets |
| Buildings (town) | Pale plaster, small windows | Warm-toned plaster, window boxes | Saturated facades, balconies, hanging signs |
| Fish | None visible | Occasional shadow under water | Schools of fish, leaping, bioluminescent at night |
| Reeds/cattails | Sparse, pale | Medium clusters, natural brown | Dense, flowering, swaying with current |

### Biome: Mountain/Highland

**Used by**: Hollow Ridge, Undrawn Peaks

| Tile Type | Muted (0-33) | Normal (34-66) | Vivid (67-100) |
|-----------|-------------|----------------|-----------------|
| Rock faces | Flat gray | Textured gray with striations, lichen | Warm-toned stone, mineral veins, crystal inlays |
| Paths (mountain) | Barely visible ledges | Clear switchback trails, cairns | Stone-paved paths, iron handrails, prayer flags |
| Grass (alpine) | Short, pale | Wind-blown medium green | Vivid green tufts, alpine flowers, grazing animals |
| Snow/ice | Flat white patches | Textured snow with blue shadows | Sparkling snow, ice crystals catching light |
| Caves (entrances) | Dark holes | Visible depth, stalactites at mouth | Glowing interior light, crystal formations |
| Wind effects | None | Occasional dust particles | Visible wind streams, floating seeds, swirling leaves |
| Shrines | Broken stone rubble | Weathered but intact structures | Restored, glowing runes, offerings present |
| Sky (visible) | Pale overcast white | Clear blue, distant clouds | Deep blue, dramatic clouds, aurora wisps |

### Biome: Wetland/Marsh

**Used by**: Shimmer Marsh

| Tile Type | Muted (0-33) | Normal (34-66) | Vivid (67-100) |
|-----------|-------------|----------------|-----------------|
| Ground (marsh) | Flat mud-gray | Spongy brown-green, puddle reflections | Rich dark earth, vibrant moss, glowing fungi |
| Water (pools) | Gray, opaque | Semi-transparent blue-green | Crystal pools reflecting memories (shimmer effect) |
| Reeds/vegetation | Sparse pale stalks | Medium clusters, natural colors | Dense, flowering, bioluminescent tips |
| Trees (mangrove) | Bare root systems | Leafy canopy, hanging moss | Lush canopy, epiphytes, orchids, fireflies |
| Paths (boardwalk) | Rotting planks | Sturdy wooden walkways | Ornate walkways with lanterns, safe rails |
| Mist/fog | Dense gray blanket | Wispy white patches | Translucent golden haze with memory motes |
| Huts (stilted) | Bare frames | Thatched roofs, rope bridges | Decorated huts, glowing windows, wind chimes |

### Biome: Plains

**Used by**: Resonance Fields

| Tile Type | Muted (0-33) | Normal (34-66) | Vivid (67-100) |
|-----------|-------------|----------------|-----------------|
| Grass (open) | Flat pale green, featureless | Rolling green, individual blades | Tall vivid grass, wildflower seas, seed puffs |
| Resonance Stones | Gray monoliths, silent | Softly humming, amber runes visible | Pulsing bright amber, floating memory particles, audible harmonics |
| Paths | Barely worn trails | Clear paths between stone clusters | Glowing amber paths connecting stone formations |
| Sky (dominant) | Pale white | Open blue, large clouds | Dramatic sky, auroral color bands, wheeling birds |
| Wind effects | None | Grass sway, distant dust | Visible wind rivers through grass, floating pollen |
| Camps | Bare tent frames | Functional tents, campfires | Colorful tents, banners, bustling activity |

### Biome: Sketch

**Used by**: Luminous Wastes, Undrawn Peaks, Half-Drawn Forest (when below vibrancy 34)

Sketch biome tiles are unique — they represent the world's **unfinished state**. Rather than three quality levels of the same scene, the Sketch tiles show the same scene at three levels of **completion**.

| Tile Type | Muted (0-33): Outline | Normal (34-66): Partially Filled | Vivid (67-100): Nearly Complete |
|-----------|----------------------|----------------------------------|-------------------------------|
| Ground | Faint grid lines on luminous white | Brushstroke texture, soft color wash | Nearly solid ground, still slightly translucent |
| Trees | Single curved lines (trunks only) | Trunks + branch outlines + dot-clusters for leaves | Full tree silhouettes with color, still slightly shimmery |
| Water | Flowing parallel lines | Colored flowing lines with wave animation | Near-solid water with impressionist sparkle |
| Mountains | Geometric wireframe triangles | Wireframe with gradient fills | Solid mountains with sketch-line edges still visible |
| Paths | Dotted lines | Dashed lines with color fill | Nearly solid paths with luminous border |
| Structures | Blueprint outlines | Partially filled walls, empty windows | Nearly complete buildings, slightly transparent |
| Sky gradient | Pure luminous white | Pale gold near ground, white above | Soft blue gradient, sketch-clouds forming |
| Objects (misc) | Faint outlines, sometimes flickering | Flickering between outline and filled | Stable, mostly filled, slight shimmer at edges |

### Biome: Dungeon/Underground

**Used by**: All Depths levels

| Tile Type | Muted (0-33) | Normal (34-66) | Vivid (67-100) |
|-----------|-------------|----------------|-----------------|
| Walls (stone) | Dark gray, flat | Textured stone, cracks, moisture | Rich stone with mineral veins, glowing crystals |
| Floor (paved) | Flat dark | Worn tiles, dust patterns | Ornate tiles, dissolved civilization patterns |
| Torches/light | Dim, barely visible | Warm flickering amber | Bright, casting dynamic shadows, memory flames |
| Water (underground) | Dark still pools | Rippling pools, faint reflections | Bioluminescent pools, dissolved memories visible beneath |
| Doors | Simple dark rectangles | Wooden/iron doors, handles | Ornate doors with glowing runes |
| Chests | Simple wooden boxes | Detailed chests, metal bands | Glowing chests, memory energy leaking |
| Dissolved memory deposits | Faint amber shimmer | Visible amber veins in walls | Bright amber geodes, pulsing with memory |
| Rubble/debris | Dark lumps | Identifiable ruins: pillars, pottery | Rich ruins with readable inscriptions, intact murals |

### Biome: Stagnation/Crystal

**Used by**: Preserver Fortress, Stagnation Zones within other maps

Stagnation tiles are **overlays** applied on top of the base biome's current tier. They represent the Preservers' crystallization effect.

| Tile Type | Description |
|-----------|-------------|
| Crystal overlay (ground) | Semi-transparent blue-white crystalline sheet over base tile. Base tile is visible but desaturated beneath. |
| Crystal overlay (structures) | Buildings/objects coated in prismatic frost. Original details preserved but frozen — no animation, no particle effects. |
| Frozen NPCs | NPC sprites rendered in blue-tinted grayscale, completely motionless, crystalline sparkle on edges. |
| Frozen water | River/pool frozen mid-ripple. Water texture locked in place with visible wave crests turned to ice. |
| Crystal growths | Blue-white crystal formations sprouting from ground, walls, and objects. Larger crystals near the zone's focal point. |
| Stagnation border | 2-tile-wide transition strip where normal tiles gradually gain crystal overlay. Outside: normal. Inside: full crystal. |
| Silence indicator | Subtle visual: no particle effects, no ambient motion (leaves, water, etc.) within stagnation boundaries. |

---

## Global Ambient Effects

While vibrancy is tracked per-zone, the player perceives a **global ambient layer** based on their overall progress. This prevents the world from feeling disjointed when moving between zones.

### Sky Color

The sky color (visible in overworld and Frontier maps, above the tile layer) is calculated as:

```
global_sky_vibrancy = average(vibrancy of all zones the player has visited)
```

| Global Sky Vibrancy | Sky Appearance |
|---------------------|---------------|
| 0-20 | Pale luminous white, no clouds, soft diffuse light |
| 21-40 | Soft cream fading to pale blue at zenith, wispy clouds |
| 41-60 | Clear blue sky, white cumulus clouds, warm sunlight |
| 61-80 | Deep blue sky, dramatic golden-rimmed clouds, light rays |
| 81-100 | Azure sky with auroral color bands (pastel green, pink, gold), dynamic clouds |

The sky transitions smoothly (not in tiers) as global sky vibrancy changes.

### Particle Density

A global particle layer adds ambient particles (floating motes, pollen, fireflies) to all outdoor maps:

| Global Sky Vibrancy | Particle Density | Particle Type |
|---------------------|-----------------|---------------|
| 0-20 | None | — |
| 21-40 | Sparse | Occasional floating dust motes |
| 41-60 | Light | Golden memory-motes, drifting pollen |
| 61-80 | Medium | Abundant motes, occasional fireflies, floating seeds |
| 81-100 | Rich | Dense mote field, fireflies, butterflies, sparkling dust |

Indoor/dungeon maps use their own particle system based on the individual zone's vibrancy, not the global average.

### Weather Effects

The game does not have a traditional weather system. Instead, the "weather" is the ambient state driven by vibrancy:

- **Low vibrancy zones**: Still air, muted light, no dynamic weather
- **Medium vibrancy zones**: Gentle breeze (grass sway, leaf drift), warm light
- **High vibrancy zones**: Dynamic winds, light rain (refreshing, not gloomy), prismatic light through moisture

Weather is cosmetic and does not affect gameplay.

---

## Audio Layer System

Audio is layered to match vibrancy, with each tier adding instruments and richness to the zone's base composition. Each zone has a single musical composition; the three vibrancy tiers control which layers of that composition are audible.

### Layer Structure Per Zone

Every zone's BGM is composed as a **4-layer track**:

| Layer | Instruments | Active At |
|-------|------------|-----------|
| **Layer 1: Foundation** | Single solo instrument (flute, harp, or acoustic guitar) | Always (vibrancy 0+) |
| **Layer 2: Harmony** | Second instrument (strings, woodwinds) + simple percussion | Vibrancy 34+ (Normal tier) |
| **Layer 3: Ensemble** | Full section (string quartet, wind ensemble, or mixed) | Vibrancy 67+ (Vivid tier) |
| **Layer 4: Chorus** | Choral voices, rich reverb, tonal sparkle effects | Vibrancy 85+ (high Vivid) |

Layer 4 is a bonus layer within Vivid tier — it rewards players who push vibrancy to its upper range.

### Audio Transitions

When vibrancy crosses a tier threshold:
- New layers **fade in** over 4 seconds (not instant, unlike tiles)
- Layers **fade out** over 6 seconds if vibrancy drops below threshold (Preserver reinforcement)
- Cross-fade ensures no jarring silence gaps

### Zone Audio Moods

| Zone | Mood | Foundation Instrument | Thematic Feel |
|------|------|----------------------|---------------|
| Village Hub | Warm, welcoming | Acoustic guitar | Folk hearth, gentle community |
| Heartfield | Pastoral, content | Wooden flute | Rolling fields, quiet joy |
| Ambergrove | Mysterious, enchanted | Harp | Forest wonder, dappled light |
| Millbrook | Lively, flowing | Fiddle | River dance, market bustle |
| Sunridge | Expansive, windswept | Pan pipes | Open sky, highland breeze |
| Shimmer Marsh | Reflective, eerie | Oboe | Mist and memory, twilight water |
| Hollow Ridge | Determined, epic | French horn | Mountain conquest, endurance |
| Flickerveil | Ethereal, shifting | Celesta | Flickering reality, gentle awe |
| Resonance Fields | Sacred, resonant | Singing bowl / drone | Ancient sound, vibrating stones |
| Luminous Wastes | Stark, luminous | Solo violin (high register) | Beautiful emptiness, potential |
| Undrawn Peaks | Austere, majestic | Solo cello | Wireframe grandeur, ascent |
| Half-Drawn Forest | Tender, growing | Music box | Sketched lullaby, patience |
| Depths (general) | Ancient, echoing | Low strings (contrabass) | Deep caverns, memory fossils |
| Preserver Fortress | Cold, pristine, unsettling | Glass harmonica | Crystal perfection, uncanny beauty |

### Stagnation Zone Audio Effect

Within stagnation zones, audio is modified regardless of the zone's overall vibrancy:

- All layers above Layer 1 are **muffled** (low-pass filter at 800 Hz)
- Layer 1 continues but with **heavy reverb** and **reduced tempo** (0.7x speed)
- A subtle **crystalline tinkling** ambient loop is added (like wind chimes made of ice)
- When the player breaks a stagnation zone, all layers explode back to full clarity in a 3-second crescendo

### Combat Music

Combat has its own BGM tracks that override zone music:

| Encounter Type | Music Style | Vibrancy Influence |
|----------------|-------------|-------------------|
| Normal battle | Upbeat orchestral, 120 BPM | Layer count matches current zone tier (muted zone = 2 layers, vivid = 4 layers) |
| Boss battle | Epic orchestral, 140 BPM, full 4 layers always | No vibrancy influence — bosses always get full music |
| Preserver battle | Distorted version of zone's BGM, crystalline percussion, 100 BPM | Deliberately stripped — the Preservers "freeze" even the battle music |

---

## Gameplay Effects of Vibrancy

Beyond visuals and audio, vibrancy affects concrete gameplay systems.

### NPC Activity

| Tier | NPC Behavior |
|------|-------------|
| Muted | Minimal NPCs present. Those present have short, sparse dialogue. No side quests available. Shops have limited stock (basic potions only). |
| Normal | Standard NPC population. Full dialogue trees. Side quests active. Shops carry standard inventory. |
| Vivid | Maximum NPC population (new NPCs arrive). Expanded dialogue with unique Vivid-only lines. Bonus side quests unlock. Shops carry rare items. Traveling merchants visit. |

### Shop Inventory Scaling

Shop inventories (Khali's General Shop, Hark's Blacksmith, Millbrook's specialty shop) scale with the **local zone's vibrancy tier**, not global average:

| Tier | Inventory Level |
|------|----------------|
| Muted | Tier 1: Basic potions (50g), antidotes (30g), basic sword/shield (100g each) |
| Normal | Tier 2: Mid potions (120g), status cures (80g), mid weapons/armor (300-500g each) |
| Vivid | Tier 3: High potions (250g), elixirs (400g), rare weapons/armor (800-1500g each), memory-infused items |

### Enemy Behavior

Vibrancy does not change enemy stats or spawn rates (those are fixed per zone, per [geography.md](geography.md)). However:

- In **Muted** zones, enemies have a +10% chance to ambush (surprise round) — the muted world is harder to read.
- In **Vivid** zones, enemies have a +10% chance to be **visible on the overworld** before engagement, allowing the player to choose whether to fight or avoid.
- In **Stagnation** zones, enemies are replaced with **Preserver-type enemies** regardless of the zone's base enemy table.

### Memory Fragment Quality

Fragments found via Resonance Stones or environmental collection have their potency influenced by the zone's vibrancy:

| Tier | Potency Modifier |
|------|-----------------|
| Muted | -1 star (minimum 1) |
| Normal | No modifier |
| Vivid | +1 star (maximum 5) |

This creates a virtuous cycle: brightening a zone makes it produce better fragments, which can brighten other zones more effectively.

---

## Implementation Notes for Phase 2

### Data Structure

Each zone's vibrancy is stored as a single integer (0-100) in the save file. The save format should include:

```
vibrancy: {
  "village_hub": 60,
  "heartfield": 55,
  "ambergrove": 45,
  // ... one entry per zone
}
preserver_cleared: {
  "heartfield_stagnation": false,
  "sunridge_outpost": false,
  // ... one entry per stagnation zone
}
zones_visited: ["village_hub", "heartfield", ...]
```

### Tileset Loading Strategy

- Preload the current zone's tileset variant for all three tiers (they're small — 32x32 tiles × ~40 tile types per biome = ~40 KB per variant at 16-bit color)
- On tier transition: swap the TMX layer's tileset reference and trigger the bloom effect
- Adjacent zones' tilesets should be preloaded when the player is within 5 tiles of a zone boundary

### Performance Considerations

- Global sky vibrancy recalculation happens only when the player enters a new zone (not continuously)
- Particle density uses an object pool with a maximum of 200 simultaneous particles
- Audio layer crossfades use Web Audio API gain nodes for smooth transitions
- Stagnation zone overlays are a separate tile layer rendered on top of the base tileset — they don't require a separate tileset swap

---

## Vibrancy Progression Through the Game

### Expected Vibrancy Arc (Typical Playthrough)

| Game Stage | Player Action | World State |
|------------|---------------|-------------|
| Early Act I | Learning to collect and broadcast | Village Hub nudges toward Vivid (60→70+). Settled Lands remain Normal. |
| Late Act I | Cleared first stagnation zone, fragments stockpiled | Village Hub at Vivid. Heartfield/Ambergrove approaching 60+. |
| Early Act II | Entering Frontier, broadcasting into new zones | Frontier zones climbing from Muted toward Normal. Settled Lands solidly Normal/Vivid. |
| Mid Act II | Clearing Preserver outposts, recalling gods | Multiple Frontier zones crossing into Normal. Some reaching Vivid near god shrines. |
| Late Act II | Preserver Cathedral cleared, approaching Sketch | Most Frontier zones at Normal+. Global sky vibrancy around 45-55. |
| Act III | Broadcasting into the Sketch, solidifying paths | Sketch zones slowly climbing. Rest of world at Vivid. Global sky vibrancy 55-70. |
| Endgame | Preserver Fortress, First Memory remix | Post-endgame bloom: all zones jump to 90+ as the First Memory is remixed. |

### The Endgame Bloom

When the player remixes the First Memory in the Preserver Fortress (the game's final act), every zone in the game simultaneously jumps to vibrancy 95. This triggers:

- Every zone swaps to Vivid tileset
- All 4 audio layers activate across the entire world
- Maximum particle density everywhere
- Sky becomes full aurora
- NPCs deliver unique "the world is complete" dialogue lines

This is the game's visual and audio climax — the world the player has been brightening all game long finally reaches its full potential in a single, dramatic moment. The player can then freely explore the fully vivid world before the credits roll.
