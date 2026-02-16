# Custom Visual Effects Audit

> Cross-references: [visual-direction.md](visual-direction.md), [memory-system.md](memory-system.md), [vibrancy-system.md](../world/vibrancy-system.md), [dormant-gods.md](../world/dormant-gods.md), [tileset-spec.md](tileset-spec.md), [ui-spec.md](ui-spec.md), [combat.md](combat.md)

## Overview

This document catalogs every custom visual effect required for Mnemonic Realms v2. Effects are organized by category, each with trigger conditions, technical approach, complexity, and priority.

**Priority definitions:**
- **P1 (Ship-blocking)**: The game cannot ship without this. Core gameplay loop or critical narrative moments.
- **P2 (Important)**: Significant quality impact. The game would feel incomplete without these.
- **P3 (Polish)**: Nice to have. Elevates the experience but can be deferred post-launch.

**Complexity definitions:**
- **Simple**: Single shader/filter or basic sprite animation. Estimated 1-2 days.
- **Medium**: Particle system, multi-step animation, or compound filter chain. Estimated 3-5 days.
- **Complex**: Custom renderer, multi-phase cinematic sequence, or system-wide visual pipeline. Estimated 1-2 weeks.

---

## Current Client State

The existing `main/client/` code is minimal:
- `main/client/index.ts` — Registers spritesheets only, no effects.
- `main/client/characters/generated.ts` — One spritesheet (`PlayerWarriorSprite`), standard `RMSpritesheet` grid. No custom rendering.
- No particle systems, filters, shaders, overlays, or animation code exists.

**Everything below must be built from scratch.**

RPG-JS renders on PixiJS. All effects should use the PixiJS API (filters, particles, graphics overlays) accessible from RPG-JS client hooks.

---

## Category 1: Vibrancy Tier System

### E-VIB-01: Tier Transition Bloom

**Description**: When a zone crosses a vibrancy threshold (33->34 or 66->67), a 2-second soft white flash blooms and fades to reveal the new tileset palette.

**Trigger**: Zone vibrancy crosses tier boundary after a broadcast.

**Technical approach**: PixiJS `ColorMatrixFilter` on the game container — animate brightness from 1.0 -> 2.0 -> 1.0 over 2 seconds, with a simultaneous tileset swap at the peak.

**Complexity**: Simple

**Priority**: P1 — Core feedback for the brightening loop.

---

### E-VIB-02: Broadcast Radial Bloom

**Description**: When the player broadcasts a fragment, a warm amber wave pulses outward from the broadcast point. The wave radius depends on fragment potency (3x3 to 11x11 tiles). Tiles touched by the wave visually brighten.

**Trigger**: Player broadcasts a memory fragment (any zone).

**Technical approach**: PixiJS `Graphics` circle with animated radius + alpha fade. Color tinted by fragment emotion: gold (joy), red (fury), purple (sorrow), green (awe), blue (calm). Overlay rendered above tile layer, below sprite layer.

**Complexity**: Medium — Needs emotion-based color mapping, radius scaling by potency, and smooth expansion animation (1.5-3.5s depending on potency).

**Priority**: P1 — Core mechanic visual feedback.

---

### E-VIB-03: Global Ambient Particle Layer

**Description**: Floating ambient particles (dust motes, pollen, fireflies) on all outdoor maps. Density scales with global sky vibrancy average: none at 0-20, sparse dust at 21-40, golden motes at 41-60, abundant motes + fireflies at 61-80, dense field + butterflies at 81-100.

**Trigger**: Always active outdoors. Density recalculated on zone entry.

**Technical approach**: PixiJS particle container with object pool (max 200 particles). Simple sprite particles (2x2 to 4x4 px) with gentle sine-wave drift and slow alpha oscillation. Different particle sprite per density tier.

**Complexity**: Medium — Object pool management, performance tuning, tier-based density configuration.

**Priority**: P2 — Major atmospheric element but not mechanically required.

---

### E-VIB-04: Sky Color Gradient

**Description**: The sky layer (visible above tiles in outdoor maps) smoothly transitions color based on global average vibrancy: luminous white (0-20) through cream, blue, golden-rimmed clouds, to full aurora with pastel bands (81-100).

**Trigger**: Recalculated on zone entry. Smooth transitions.

**Technical approach**: PixiJS `Graphics` rectangle behind all tile layers with gradient fill. Color stops interpolated from a lookup table keyed to global sky vibrancy. Aurora bands at high vibrancy use additional sine-wave animated color strips.

**Complexity**: Medium — Smooth interpolation, aurora effect at high vibrancy.

**Priority**: P2 — Strong world-coherence effect.

---

### E-VIB-05: Vivid-Tier Resonance Stone Particles

**Description**: At Vivid tier, Resonance Stones emit floating amber memory particles that drift upward and fade. The stones also pulse with a warm glow.

**Trigger**: Zone is at Vivid vibrancy (67+) and contains Resonance Stones.

**Technical approach**: Per-stone particle emitter (5-10 particles, short lifetime, upward drift). Stone sprite overlay with alpha oscillation (glow pulse). Reuse E-VIB-03 particle pool.

**Complexity**: Simple

**Priority**: P3 — Polish detail.

---

### E-VIB-06: Weather-Style Ambient Motion

**Description**: Vibrancy-driven ambient motion: grass sway, leaf drift (medium vibrancy); dynamic winds with visible streaming particles, light prismatic rain (high vibrancy).

**Trigger**: Continuous, based on zone vibrancy tier.

**Technical approach**: Animated tile variants for grass/leaves (tile animation in TMX). High-vibrancy wind streaks as long, thin, semi-transparent sprite particles moving horizontally. Rain as fast downward particles with slight randomized angle.

**Complexity**: Medium — Tile animation integration + additional particle types.

**Priority**: P3 — Atmospheric polish.

---

## Category 2: Stagnation / Preserver Effects

### E-STAG-01: Stagnation Zone Crystal Overlay

**Description**: Blue-white crystalline overlay on tiles within stagnation zones. Semi-transparent, desaturating the base tiles beneath. Crystal growths (sprites) near focal points. No ambient motion within the zone (leaves, water, particles all frozen).

**Trigger**: Entering a stagnation zone's tile boundary.

**Technical approach**: Separate TMX overlay layer with crystal tile sprites. `ColorMatrixFilter` with desaturation + blue tint applied to the base tile layer within the zone bounds. Particle system disabled within zone boundaries.

**Complexity**: Medium — Needs zone-bounded filter application and particle suppression.

**Priority**: P1 — Core antagonist visual. Stagnation zones are central to gameplay.

---

### E-STAG-02: Stagnation Border Shimmer

**Description**: 2-tile transition strip at the stagnation zone edge where normal tiles gradually gain crystal overlay. Subtle crystalline shimmer effect.

**Trigger**: Rendering tiles within 2 tiles of a stagnation zone boundary.

**Technical approach**: Alpha gradient on the crystal overlay layer (1.0 at inner edge, 0.0 at outer). Subtle sparkle particles (white, small, infrequent) along the border.

**Complexity**: Simple

**Priority**: P2 — Softens the visual transition.

---

### E-STAG-03: Stagnation Breaking Animation

**Description**: When the player breaks a stagnation zone, crystal shatters outward in a burst of prismatic light. Hairline fractures glow gold, then the crystal explodes. Color floods back, ambient sound returns, frozen NPCs/objects resume animation.

**Trigger**: Player broadcasts the correct fragment into a stagnation focal point.

**Technical approach**: Multi-phase sequence:
1. Fracture lines: PixiJS `Graphics` lines radiating from focal point, color transitioning from blue-white to gold (0.5s).
2. Shatter burst: Sprite particle explosion (crystal shard sprites flying outward with rotation and gravity, 1.0s).
3. Color flood: Reverse the E-STAG-01 desaturation filter with a 1.0s ease-out.
4. Particle burst of warm amber motes replacing shards.

**Complexity**: Complex — Multi-phase choreography, particle physics (gravity + rotation), filter animation, synchronized with audio crescendo.

**Priority**: P1 — One of the game's most satisfying moments. Directly tied to core mechanic.

---

### E-STAG-04: Frozen NPC Rendering

**Description**: NPCs within stagnation zones rendered in blue-tinted grayscale, completely motionless, with crystalline sparkle on edges.

**Trigger**: NPC is within a stagnation zone boundary.

**Technical approach**: Per-sprite `ColorMatrixFilter` (desaturate + blue tint). Disable sprite animation. Small edge-sparkle effect using 1-2 white pixel particles at sprite corners.

**Complexity**: Simple

**Priority**: P1 — Communicates stakes of stagnation.

---

### E-STAG-05: Preserver Agent Crystal Aura

**Description**: Preserver enemies have a subtle crystalline aura — a cold blue-white glow around their sprites, with occasional frost particle emission.

**Trigger**: Preserver-type enemy present on map or in combat.

**Technical approach**: Sprite `GlowFilter` (blue-white, low intensity). 2-3 small frost particles drifting outward per second.

**Complexity**: Simple

**Priority**: P2 — Enemy faction identity.

---

## Category 3: Memory Fragment Effects

### E-MEM-01: Fragment Collection Spiral

**Description**: When the player collects a memory fragment, golden motes spiral inward toward the player character from the source (Resonance Stone, enemy, environment). The spiral contracts over ~1 second and flashes on absorption.

**Trigger**: Memory fragment collected from any source.

**Technical approach**: 8-12 sprite particles spawned at source position, following a logarithmic spiral path toward player position. Particle color matches fragment emotion. Final flash: small circular bloom at player sprite.

**Complexity**: Medium — Spiral path calculation, emotion-based coloring.

**Priority**: P1 — Core collection feedback.

---

### E-MEM-02: Fragment Remix Swirl

**Description**: When remixing fragments at the Remix Table, input fragment icons swirl together, flash, and resolve into the new fragment icon. Colors blend from input emotions to output emotion.

**Trigger**: Player activates a remix at any Remix Table.

**Technical approach**: UI animation (Vue component or PixiJS overlay). Fragment icons orbit a center point with decreasing radius over 1.5s. At convergence: white flash, new fragment icon scales up from center.

**Complexity**: Medium — Coordinated multi-element animation in UI layer.

**Priority**: P1 — Core mechanic feedback.

---

### E-MEM-03: Broadcast Color Wave (Stagnation-Specific)

**Description**: When broadcasting into a stagnation zone (as opposed to normal broadcasting), the amber wave from E-VIB-02 visually clashes with the crystal. The wave front shows amber vs. blue-white interference patterns before the crystal shatters (see E-STAG-03).

**Trigger**: Broadcasting a fragment into a stagnation zone's focal point.

**Technical approach**: Extended version of E-VIB-02 where the expanding ring encounters a resistance layer (stagnation overlay). The ring slows, brightens, and the color shifts to gold + blue interference. Feeds into E-STAG-03 shatter sequence.

**Complexity**: Medium — Extension of existing broadcast effect with stagnation interaction.

**Priority**: P2 — Enhanced feedback for a dramatic moment. Can fall back to basic E-VIB-02 + E-STAG-03.

---

### E-MEM-04: Memory Fragment Counter Pulse

**Description**: The HUD memory fragment counter pulses gently (scale + glow) when a new fragment is collected.

**Trigger**: New fragment added to inventory.

**Technical approach**: CSS animation on Vue HUD component. Scale 1.0 -> 1.15 -> 1.0 with `--text-accent` glow over 0.4s.

**Complexity**: Simple

**Priority**: P2 — HUD polish.

---

## Category 4: God Recall Transformations

Each dormant god has a recall transformation — a 15-30 second cinematic sequence unique to the god and the emotion used. There are 16 possible transformations (4 gods x 4 emotions). These are the game's biggest set-piece visual moments.

### E-GOD-01: Resonance Recall — Base Dormant State

**Description**: The dormant Resonance shrine: concentric rings of shimmering air rising from the amphitheater center. No physical body — just visible sound waves. The air hums.

**Trigger**: Player approaches Resonance's Amphitheater before recall.

**Technical approach**: Concentric circle sprites with animated radius oscillation and alpha pulse. Vertical "heat shimmer" distortion using PixiJS `DisplacementFilter` with a sine-wave displacement map.

**Complexity**: Medium

**Priority**: P1 — God shrines are major landmarks.

---

### E-GOD-02: Resonance Recall Transformations (4 variants)

**Description**: Four distinct transformation sequences for Resonance based on emotion:
- **Joy (Cantara)**: Sound waves coalesce into golden light figure. Resonance Stones ring in a major chord. Amphitheater blooms with moss and wildflowers.
- **Fury (Tempestus)**: Sound compresses into storm clouds with internal lightning. Resonance Stones crack with visible shockwaves. Storm clouds gather.
- **Sorrow (Tacet)**: Sound thins to absolute silence (5s of no audio/particles). Translucent blue-purple figure appears. Crystalline moss covers ground.
- **Awe (Harmonia)**: Sound folds inward and expands simultaneously. Prismatic geometric figure emerges. Visible harmonic patterns shimmer between standing stones.

**Trigger**: Player places a potency 3+ fragment on an emotion pedestal at the shrine.

**Technical approach**: Scripted cinematic sequence per variant. Combination of:
- Particle systems (motes, shockwaves, sparks)
- Screen filters (color shift, brightness, displacement)
- Sprite overlays (god figure, environmental changes)
- Camera control (zoom, pan)
- Audio sync (the visual effects must align with musical cues)

Each variant is a ~15-second choreographed sequence.

**Complexity**: Complex (per variant, x4 = very complex total)

**Priority**: P1 — These are the game's signature moments. Act II's emotional peaks.

---

### E-GOD-03: Verdance Recall — Base Dormant State

**Description**: Massive half-formed tree trunk (10 tiles wide) with veins of vivid green light pulsing like a heartbeat. Roots extend 15 tiles, glowing beneath marsh water. Seedlings sprout where roots surface.

**Trigger**: Player approaches Verdance's Hollow before recall.

**Technical approach**: Large composite sprite for tree trunk with animated green vein overlays (alpha pulse). Root glow using PixiJS `Graphics` lines with alpha animation beneath water layer. Small seedling sprites that pop up intermittently near root endpoints.

**Complexity**: Medium

**Priority**: P1

---

### E-GOD-04: Verdance Recall Transformations (4 variants)

**Description**:
- **Joy (Floriana)**: Tree explodes upward — bark spiraling, branches unfurling, golden-green leaf cascade. Flowers erupt across the marsh. Water clears.
- **Fury (Thornweald)**: Thorns erupt from bark. Vines whip outward cracking stone. Jagged angular figure of twisted wood rises. Vegetation aggressively reclaims surfaces.
- **Sorrow (Autumnus)**: Bark develops russet autumn coloring. Branches extend shedding crimson-gold leaves in endless slow cascade. Warm autumn palette transformation. Ground carpeted in glowing leaves.
- **Awe (Sylvanos)**: Tree grows downward — ground becomes translucent revealing root network. Bioluminescent fungal growth. Intricate bark patterns form maps/circuits.

**Trigger**: Player places fragment on emotion pedestal at Verdance's shrine.

**Technical approach**: Same toolkit as E-GOD-02. Notable unique requirements:
- Floriana: Upward growth animation (trunk extends, branches unfurl frame-by-frame), leaf particle shower
- Thornweald: Thorn sprites erupting outward, vine whip line animations
- Autumnus: Leaf fall particle system (slow, numerous, color-varied), palette swap to autumn
- Sylvanos: Ground transparency effect (alpha layer revealing root network beneath)

**Complexity**: Complex (x4 variants)

**Priority**: P1

---

### E-GOD-05: Luminos Recall — Base Dormant State

**Description**: Column of pure white light descending from a canopy gap. Suspended rotating prism (human-sized crystal) splitting light into faint rainbow patterns on surrounding trees. Player's shadow multiplies near the shrine.

**Trigger**: Player approaches Luminos Grove before recall.

**Technical approach**: Vertical light beam sprite (bright white, high alpha, subtle width oscillation). Rotating prism sprite. Rainbow refraction using angled `Graphics` lines with prismatic color. Multiple shadow sprites for player (offset copies with low alpha, different angles).

**Complexity**: Medium

**Priority**: P1

---

### E-GOD-06: Luminos Recall Transformations (4 variants)

**Description**:
- **Joy (Solara)**: Prism absorbs light, goes dark 1s, detonates in warm golden burst. Figure of liquid sunrise emerges. Screen color temperature shifts warm. Forest settles into permanent golden light.
- **Fury (Pyralis)**: Prism focuses into a searing beam cutting across the grove. White-hot angular figure. Flickering sketch-outlines are burned away. Harsh brilliant light, razor-sharp shadows.
- **Sorrow (Vesperis)**: Light column slowly dims to amber-purple sunset spectrum. Translucent figure at edges. Permanent golden-hour glow. Fireflies appear.
- **Awe (Prisma)**: Prism shatters into a thousand fragments becoming different-colored beams spiraling in a double helix. Constantly shifting rainbow figure. Every surface becomes subtly prismatic.

**Trigger**: Player places fragment on emotion pedestal at Luminos shrine.

**Technical approach**: Heavy use of lighting effects and color manipulation.
- Solara: Screen-wide `ColorMatrixFilter` shift to warm, golden burst particle explosion
- Pyralis: Beam line animation, high-contrast filter, shadow rendering changes
- Vesperis: Gradual color temperature shift, firefly particles, alpha-transparent sprite edges
- Prisma: Shard particle explosion that becomes spiral beams, prismatic `ColorMatrixFilter` cycling on environment sprites

**Complexity**: Complex (x4 variants)

**Priority**: P1

---

### E-GOD-07: Kinesis Recall — Base Dormant State

**Description**: Towering vibrating rock pillar (3x8 tiles) with carved route-maps. Small rocks orbit the peak in slow ellipse. Ground shakes rhythmically within 5 tiles. Player movement speed increases 10% nearby.

**Trigger**: Player approaches Kinesis Spire before recall.

**Technical approach**: Sprite vibration (rapid small-offset oscillation on pillar sprite). Orbiting rock sprites using circular path animation. Screen shake (subtle, rhythmic) within proximity radius. Speed modifier via RPG-JS player hook.

**Complexity**: Medium

**Priority**: P1

---

### E-GOD-08: Kinesis Recall Transformations (4 variants)

**Description**:
- **Joy (Jubila)**: Spire stops vibrating (held breath). Figure of golden wind leaps from peak — feet never touch ground, amber speed-lines, green flowing curves, blue spiral trails. Afterimage trail. Mountain pass smooths.
- **Fury (Tecton)**: Spire cracks like an egg. Giant figure of fractured stone and molten amber seams. Mountain shakes. New passes crack open. Tectonic stress lines appear.
- **Sorrow (Errantis)**: Vibration slows. Orbiting rocks drift away leaving fading amber trails. Translucent blue-gray figure materializes from the trails. Footprints appear wherever the figure walks, then fade. Stone shows ancient footprints.
- **Awe (Vortis)**: Vibration intensifies until pillar blurs. Orbiting rocks accelerate into planetary rings. Figure of pure motion defined by orbiting particles. Letters form in spaces between moving stones. Permanent kinetic sculpture.

**Trigger**: Player places fragment on emotion pedestal at Kinesis shrine.

**Technical approach**:
- Jubila: Afterimage trail (previous frame copies with decreasing alpha), speed-line particles
- Tecton: Crack sprites, screen shake intensification, molten glow overlays
- Errantis: Fading trail particles, footprint sprites with timed alpha decay
- Vortis: Acceleration of existing orbital sprites, text assembly from moving components

**Complexity**: Complex (x4 variants)

**Priority**: P1

---

### E-GOD-09: Post-Recall Ambient God Effects

**Description**: After recall, each god's zone gains a persistent ambient visual effect:
- Cantara: Warm gold Resonance Stone glow, floating note particles
- Tempestus: Storm clouds, periodic cosmetic lightning, wind-bent grass
- Tacet: Profound quiet — reduced particles, "sound shadow" markers near hidden content
- Harmonia: Visible harmonic patterns between standing stones, prismatic shimmer
- Floriana: Flower blooms spreading over time (1-2 new patches per game-hour)
- Thornweald: Thorny vine overlays on zone edges, dense wild growth
- Autumnus: Endless falling autumn leaves, warm amber palette
- Sylvanos: Bioluminescent mushroom rings, visible root network glow on ground
- Solara: Golden dawn lighting, warm tint on all surfaces
- Pyralis: High-contrast harsh lighting, glowing outlines on hidden objects
- Vesperis: Permanent golden-hour glow, firefly particles, long warm shadows
- Prisma: Prismatic edge shimmer on all surfaces, color-cycling trees
- Jubila: Golden light on paths, speed-line particles on moving entities
- Tecton: Steam vents, visible fault lines glowing amber, stress-line overlays
- Errantis: Translucent amber footprint trails on ground, fading ghost paths
- Vortis: Floating rocks, spiral wind patterns, visible force lines

**Trigger**: Persistent after the corresponding god is recalled.

**Technical approach**: Zone-specific particle configurations + filters applied on zone load. Most are particle emitter variations or simple filter overlays. Each is relatively simple individually but there are 16 variants total.

**Complexity**: Medium (individually simple, but 16 variants require systematic implementation)

**Priority**: P2 — The zone feels complete without these, but they provide massive payoff for player choices. Could ship with simplified versions (1 per god rather than 1 per god-emotion combo) and add full variants in a patch.

---

## Category 5: Sketch Zone Effects

### E-SKT-01: Sketch Rendering Style

**Description**: The Sketch zones render the world as luminous line-art: tree trunks are single curved lines, branches are delicate strokes, leaves are dot clusters. The ground glows with soft parchment-light. The player's shadow is the most detailed thing on screen.

**Trigger**: Player enters any Sketch zone (Half-Drawn Forest, Luminous Wastes, Undrawn Peaks).

**Technical approach**: Dedicated Sketch tileset with line-art style tiles (see tileset-spec.md). The "outline-only" aesthetic is baked into the tile art, not a runtime effect. However, the "flickering between outline and filled" behavior for partially solidified areas requires a runtime alpha oscillation on the tile layer.

**Complexity**: Simple (runtime). The heavy lift is tile art production, not code.

**Priority**: P1 — Sketch zones are a major act of the game.

---

### E-SKT-02: Sketch Solidification Animation

**Description**: When the player broadcasts a fragment in the Sketch, the affected tiles transition from line-art to filled-in reality. The solidification radiates from the broadcast point over 2-3 seconds. Color and texture "paint" themselves into the outlines.

**Trigger**: Player broadcasts a fragment in a Sketch zone.

**Technical approach**: Per-tile transition from Sketch tileset to the corresponding biome tileset (forest, mountain, etc.). Animate as a radial reveal: tiles within the broadcast radius swap one-by-one outward from center with a 50ms delay between rings. Each tile's swap is accompanied by a brief "paint fill" animation (alpha of new tile fades from 0 to 1 over 200ms).

**Complexity**: Medium — Tile-by-tile radial reveal with timing coordination.

**Priority**: P1 — Core Act III mechanic.

---

### E-SKT-03: The Living Sketch

**Description**: In a specific Sketch area, the world actively draws itself in real-time: new tree-lines appear, branches extend, flowers outline-bloom then erase and restart. Unstable creation without memory to anchor it.

**Trigger**: Player enters The Living Sketch area in the Half-Drawn Forest.

**Technical approach**: Procedural line-drawing animation: PixiJS `Graphics` lines that grow from origin points, branch, then fade. Cycle of draw-erase-redraw. 3-5 simultaneous "drawing" instances at different lifecycle stages.

**Complexity**: Medium

**Priority**: P2 — Specific set-piece area. Impressive but confined.

---

### E-SKT-04: Sketch-to-Reality Boundary Shimmer

**Description**: At the boundary between solidified and unsolidified Sketch terrain, tiles shimmer and flicker — partially rendered, oscillating between line-art and filled states.

**Trigger**: Tiles adjacent to solidified areas in Sketch zones.

**Technical approach**: Boundary tiles alternate between Sketch and filled tileset variants on a slow timer (1-2 second cycle) with alpha crossfade.

**Complexity**: Simple

**Priority**: P2 — Visual polish for Sketch traversal.

---

### E-SKT-05: Wireframe Mountain Rendering

**Description**: Undrawn Peaks mountains are geometric wireframe shapes — glowing line segments against luminous sky, visible construction lines, glowing vertices.

**Trigger**: Player is in the Undrawn Peaks zone.

**Technical approach**: Tile art (line-art mountain tiles from tileset-spec). Glowing vertices as small point-light sprites at wireframe intersections. Vertex sprites pulse gently.

**Complexity**: Simple (runtime). Art-dependent.

**Priority**: P1 — Required for Act III zone.

---

### E-SKT-06: World's Edge Void

**Description**: At the Luminous Wastes western boundary, the world ends: a soft warm white void. New sketch-lines slowly draw themselves at the boundary every 5 seconds — a hill, tree, river bend — then solidify slightly.

**Trigger**: Player stands within 5 tiles of the Edge in Luminous Wastes.

**Technical approach**: Edge of playable area rendered as a gradient fade to white. PixiJS `Graphics` line-drawing animation beyond the boundary (same technique as E-SKT-03 but slower, more deliberate). Each new sketch element persists slightly longer before the next appears.

**Complexity**: Medium

**Priority**: P2 — Major narrative moment (Act III Scene 2 and final scene) but visually contained.

---

## Category 6: Combat Effects

### E-CMB-01: Elemental Attack Particles

**Description**: When a skill with an elemental type hits, particles matching the element burst from the target: fire sparks (red-orange), water droplets (blue), wind slashes (green), earth chunks (brown), light rays (gold), dark wisps (purple).

**Trigger**: Any elemental skill hit in combat.

**Technical approach**: Per-element particle preset. 10-15 particles burst from target sprite position, fanning outward with gravity/drift. Each element has a distinct sprite (2x4 to 4x4 px) and motion pattern (fire rises, water falls, wind circles, etc.).

**Complexity**: Medium — 6 element presets, each with unique behavior.

**Priority**: P1 — Combat feels flat without hit effects.

---

### E-CMB-02: Status Effect Indicators

**Description**: Visual indicators for active status effects on combatant sprites: Poison (green bubbles), Stun (stars circling head), Slow (blue clock icon), Weakness (cracked shield), Inspired (golden sparkle aura), Stasis (blue crystal creep on sprite edges).

**Trigger**: Status effect applied to any combatant.

**Technical approach**: Small animated sprite overlays attached to the affected combatant's sprite. Each status has a looping 2-4 frame animation. Stasis uses partial E-STAG-04 crystal overlay technique.

**Complexity**: Simple (per status, x6 total)

**Priority**: P1 — Status readability is critical for turn-based combat.

---

### E-CMB-03: Healing Bloom

**Description**: When a healing skill is used, green-gold motes rise from the healed character with a soft upward bloom. HP bar fills with a smooth 300ms animation.

**Trigger**: Any healing action in combat.

**Technical approach**: Upward-drifting particle emitter (green-gold, 6-8 particles, 1s lifetime). HP bar CSS transition (already in UI spec animation standard).

**Complexity**: Simple

**Priority**: P1

---

### E-CMB-04: Critical Hit Flash

**Description**: On a critical hit, the screen flashes briefly (50ms white flash) and the damage number appears larger with a shake animation.

**Trigger**: Critical hit lands in combat.

**Technical approach**: Screen-wide white overlay at 0.3 alpha for 50ms. Damage text sprite with scale 1.5x + horizontal shake (3 oscillations over 200ms).

**Complexity**: Simple

**Priority**: P2 — Satisfying but combat functions without it.

---

### E-CMB-05: Preserver Stasis Attack

**Description**: Preserver enemies' stasis attacks show crystal creeping from the enemy toward the target, momentarily encasing them in blue-white crystal before the status applies.

**Trigger**: Preserver enemy uses a stasis-type ability.

**Technical approach**: Line of crystal sprites advancing from enemy to target (4-5 sprites, sequential reveal over 0.5s). Target sprite gets brief E-STAG-04 crystal overlay (0.3s) before returning to normal with the Stasis status icon.

**Complexity**: Medium

**Priority**: P2 — Faction identity in combat.

---

### E-CMB-06: Boss Phase Transition

**Description**: When a boss enters a new phase (HP threshold), the screen darkens briefly, the boss sprite flashes, and the boss's appearance/aura changes.

**Trigger**: Boss HP crosses a phase threshold.

**Technical approach**: Screen darken overlay (0.5 alpha black, 0.5s), boss sprite flash (rapid alpha toggle, 0.3s), new boss sprite/aura swap. Aura is a `GlowFilter` color change.

**Complexity**: Simple

**Priority**: P2 — Communicates boss danger escalation.

---

## Category 7: Narrative Cinematic Effects

### E-CIN-01: Hana's Freezing Sequence (Act I Climax)

**Description**: Hana runs into expanding stagnation zone, broadcasting amber light. Her glow stops. Blue-white energy pulse radiates outward. Crystal surges. Hana is visible through semi-transparent crystal, frozen mid-stride. The player hammers against the crystal (automatic).

**Trigger**: Act I Scene 11 — scripted sequence.

**Technical approach**: Scripted cutscene with:
- Hana NPC sprite moving along a path with trailing amber particles
- Particles stop (all particle emitters freeze)
- Blue-white radial pulse (expanding circle, opposite of broadcast bloom — cold colors)
- Crystal overlay rapidly spreading (E-STAG-01 applied in real-time expansion)
- Hana sprite gets E-STAG-04 frozen treatment
- Player sprite automatic approach + "hammering" animation

**Complexity**: Complex — Multi-stage scripted sequence with precise timing.

**Priority**: P1 — Act I emotional climax. Cannot be skipped.

---

### E-CIN-02: God Recall Vision (Pre-Recall Cinematic)

**Description**: When approaching a dormant god shrine, a 30-second cinematic plays showing fragments of the dissolved civilization that created the god. Narrated by Artun's letter. Fragments of ancient life: people singing (Resonance), cultivating (Verdance), stargazing (Luminos), traveling (Kinesis).

**Trigger**: Player approaches any dormant god shrine for the first time.

**Technical approach**: Overlay sequence of sepia/amber-tinted static images or animated vignettes. These are essentially illustrated slides with particle effects (amber motes, dissolving edges). Letter text overlaid with typewriter effect. Could be implemented as a Vue overlay component with CSS transitions.

**Complexity**: Medium (per god, x4)

**Priority**: P2 — Builds narrative weight for recall. Could be simplified to text + ambient effects if art assets aren't ready.

---

### E-CIN-03: Endgame Bloom (Act III Climax)

**Description**: 90-second cinematic showing every zone simultaneously jumping to vibrancy 95. Camera sweeps from the Fortress through the Sketch (trees filling in, terrain solidifying), across the Frontier (gods fully manifesting), down to the Settled Lands (village in full vivid glory). First true sunrise. Sun rises on eastern horizon.

**Trigger**: Player broadcasts World's New Dawn from the First Memory Chamber.

**Technical approach**: This is the game's most complex visual sequence. Requires:
- Camera control breaking free from player-locked view (pan/zoom across multiple zones)
- Rapid tileset transitions (Sketch -> filled, Muted -> Vivid) with cascading bloom effects
- God manifestation animations (abbreviated versions of recall transformations)
- Sun rise: gradient animation on sky layer, warm light spreading across all visible tiles
- NPC sprite animations (emerging from houses, looking up)
- Full particle density activation

Likely implemented as a dedicated cinematic mode that loads zone snapshots as background layers and animates over them, rather than trying to render live zone transitions.

**Complexity**: Complex — The most ambitious single visual sequence in the game.

**Priority**: P1 — The game's emotional climax. This moment IS the payoff for the entire experience.

---

### E-CIN-04: First Memory Remix

**Description**: The First Memory sphere (warm amber, pulsing) absorbs the player's touch. Light intensifies. Sphere cracks open like a sprouting seed. Prismatic light emerges. New branching/growing shape forms — tree-like, river-delta-like. It is alive.

**Trigger**: Player activates the First Memory Remix in Act III Scene 9.

**Technical approach**: Central sphere sprite with:
1. Pulse intensification (scale + brightness ramp, 2s)
2. Crack sprites appearing on surface (branching fracture lines, gold-lit, 1s)
3. Sphere opens: sprite splits/fades while particle system takes over
4. Prismatic particle fountain — multi-colored motes flowing upward in branching patterns
5. New shape forms from converging particles

**Complexity**: Complex — Multi-phase particle choreography with sprite morphing.

**Priority**: P1 — Narrative climax moment.

---

### E-CIN-05: Grym Dialogue — God Pulse Responses

**Description**: During Grym confrontation, each recalled god sends a visible pulse into the chamber: Joy = warm golden light, Fury = crystal wall cracks, Sorrow = gentle hush (particle slowdown), Awe = harmonic resonance (prismatic shimmer).

**Trigger**: Grym dialogue sequence in Act III Scene 8.

**Technical approach**: Per-emotion screen effect:
- Joy: `ColorMatrixFilter` warm shift + golden mote particles
- Fury: Crystal crack sprites on walls + screen shake
- Sorrow: Particle deceleration + subtle blur filter
- Awe: Prismatic color cycling on environment + harmonic wave overlay

**Complexity**: Medium (4 variants, each relatively simple)

**Priority**: P2 — Powerful narrative payoff for Act II choices. The scene works without these (dialogue carries it) but they elevate it enormously.

---

### E-CIN-06: Credits World Growth

**Description**: During 4-minute credits, the world continues to grow beyond The Edge. New terrain forms in real-time: hills rise, rivers carve, trees grow from seed to canopy in seconds. Tiny NPC figures appear on new terrain.

**Trigger**: Credits roll after Act III Scene 12.

**Technical approach**: Procedural terrain generation animation — similar to E-SKT-03/E-SKT-06 but at larger scale and faster. PixiJS `Graphics` drawing terrain outlines that immediately fill with color. Small NPC sprites placed on completed terrain. Camera slowly pulls back.

**Complexity**: Medium — Reuses Sketch drawing techniques at scale.

**Priority**: P3 — Beautiful capstone but the game is functionally complete at this point.

---

### E-CIN-07: Stagnation Zone Expansion (Act I Scene 11)

**Description**: The Stagnation Clearing regrows and expands from 5x5 to 12x12 in real-time. Crystal formations grow visibly. Farmer Elda gets caught at the border with crystal creeping up her legs.

**Trigger**: Act I Scene 11 — scripted sequence.

**Technical approach**: Progressive E-STAG-01 overlay expansion — crystal tiles appearing in an outward ring pattern over 3-4 seconds. Crystal creep on Elda's sprite (gradual blue-tint + overlay from feet upward). Farmers running (NPC path movement toward exits).

**Complexity**: Medium

**Priority**: P1 — Part of the Act I climax sequence (with E-CIN-01).

---

## Category 8: UI Effects

### E-UI-01: Dialogue Typewriter Effect

**Description**: Dialogue text appears character-by-character at a steady rate. Tap/click to instantly show all text. Speaker name in bronze/amber accent.

**Trigger**: Any dialogue interaction.

**Technical approach**: Vue component with character-by-character text rendering via `setInterval`. Skip-on-tap listener. Already described in ui-spec.md.

**Complexity**: Simple

**Priority**: P1 — Core interaction.

---

### E-UI-02: Combat Vignette Overlay

**Description**: Combat screen has a soft vignette (darkened edges) framing it as a "remembered battle." Dark parchment background with warm text.

**Trigger**: Combat encounter starts.

**Technical approach**: CSS radial gradient overlay on the combat Vue component. Static — no animation needed.

**Complexity**: Simple

**Priority**: P2 — Aesthetic cohesion.

---

### E-UI-03: Menu Transitions

**Description**: Menus open/close with 200ms ease-out slide. Tab switches use 150ms cross-fade. Fragment collect notifications slide in from right (400ms), display 3s, fade out (300ms).

**Trigger**: Menu open/close, tab switch, fragment collection.

**Technical approach**: CSS transitions on Vue components. Already specified in ui-spec.md.

**Complexity**: Simple

**Priority**: P2 — UI polish.

---

### E-UI-04: Vibrancy Tier Transition HUD Flash

**Description**: When a zone crosses a vibrancy tier, the HUD briefly flashes with the new tier's accent color and displays a tier-change notification (e.g., "Heartfield has reached Vivid!").

**Trigger**: Zone vibrancy crosses tier threshold.

**Technical approach**: Toast notification Vue component with color pulse animation. 2s display, 0.5s fade.

**Complexity**: Simple

**Priority**: P2 — Player awareness of progression.

---

## Category 9: Fortress-Specific Effects

### E-FOR-01: God Recall Fractures in Fortress Walls

**Description**: Visible cracks in the Preserver Fortress crystal walls, colored by the recalled gods: vine-green (Verdance/joy), amber-brown (Verdance/fury), golden-light (Luminos/joy), storm-dark (Resonance/fury), etc. Fractures are decorative tile overlays that vary by the player's specific recall choices.

**Trigger**: Persistent throughout the Fortress. Determined by Act II recall choices.

**Technical approach**: Conditional tile overlay layer in the Fortress TMX maps. 16 fracture tile variants (one per god-emotion combination) placed at predefined positions. Loaded based on save state.

**Complexity**: Simple (per variant). Art production is the main cost.

**Priority**: P2 — Powerful "your choices matter" feedback. The Fortress functions without them.

---

### E-FOR-02: Fortress De-Crystallization (Endgame Bloom)

**Description**: During the Endgame Bloom, the Fortress crystal walls melt — warm light floods through fractures, crystal becomes simple stone and mortar. Frozen gallery subjects begin waking up.

**Trigger**: Endgame Bloom sequence (part of E-CIN-03).

**Technical approach**: Tileset swap from crystal tiles to stone tiles with E-VIB-01 bloom transition. Frozen NPC sprites lose their E-STAG-04 blue tint and resume idle animations.

**Complexity**: Medium — Coordinated with the larger Endgame Bloom.

**Priority**: P2 — Part of the broader climax. Can be simplified to a fade-to-white + scene reload with new tiles.

---

### E-FOR-03: Gallery Frozen Scenes

**Description**: The Gallery of Moments contains frozen NPC tableaux — groups of NPCs frozen at their happiest moments (festival dancers, embracing couple, child's first steps). Each is rendered with E-STAG-04 crystal treatment but with exceptional detail — fine crystal edges, individual expressions visible.

**Trigger**: Player enters Gallery rooms in the Fortress.

**Technical approach**: Pre-composed sprite groups with E-STAG-04 filter. Each tableau is a static composite sprite (multiple NPCs in fixed positions). Crystal edge sparkle slightly enhanced (more frequent sparkle particles than standard frozen NPCs).

**Complexity**: Simple (per tableau, art-dependent)

**Priority**: P2 — Emotional weight of the Fortress scenes.

---

## Priority Summary

### P1 (Ship-Blocking) — 22 effects

| ID | Effect | Complexity |
|----|--------|------------|
| E-VIB-01 | Tier Transition Bloom | Simple |
| E-VIB-02 | Broadcast Radial Bloom | Medium |
| E-STAG-01 | Stagnation Zone Crystal Overlay | Medium |
| E-STAG-03 | Stagnation Breaking Animation | Complex |
| E-STAG-04 | Frozen NPC Rendering | Simple |
| E-MEM-01 | Fragment Collection Spiral | Medium |
| E-MEM-02 | Fragment Remix Swirl | Medium |
| E-GOD-01 | Resonance Dormant State | Medium |
| E-GOD-02 | Resonance Recall (x4) | Complex |
| E-GOD-03 | Verdance Dormant State | Medium |
| E-GOD-04 | Verdance Recall (x4) | Complex |
| E-GOD-05 | Luminos Dormant State | Medium |
| E-GOD-06 | Luminos Recall (x4) | Complex |
| E-GOD-07 | Kinesis Dormant State | Medium |
| E-GOD-08 | Kinesis Recall (x4) | Complex |
| E-SKT-01 | Sketch Rendering Style | Simple |
| E-SKT-02 | Sketch Solidification Animation | Medium |
| E-SKT-05 | Wireframe Mountain Rendering | Simple |
| E-CMB-01 | Elemental Attack Particles | Medium |
| E-CMB-02 | Status Effect Indicators | Simple |
| E-CMB-03 | Healing Bloom | Simple |
| E-CIN-01 | Hana's Freezing Sequence | Complex |
| E-CIN-03 | Endgame Bloom | Complex |
| E-CIN-04 | First Memory Remix | Complex |
| E-CIN-07 | Stagnation Zone Expansion | Medium |
| E-UI-01 | Dialogue Typewriter | Simple |

### P2 (Important) — 18 effects

| ID | Effect | Complexity |
|----|--------|------------|
| E-VIB-03 | Global Ambient Particle Layer | Medium |
| E-VIB-04 | Sky Color Gradient | Medium |
| E-STAG-02 | Stagnation Border Shimmer | Simple |
| E-STAG-05 | Preserver Agent Crystal Aura | Simple |
| E-MEM-03 | Broadcast vs. Stagnation Clash | Medium |
| E-MEM-04 | Memory Fragment Counter Pulse | Simple |
| E-GOD-09 | Post-Recall Ambient God Effects (x16) | Medium |
| E-SKT-03 | The Living Sketch | Medium |
| E-SKT-04 | Sketch-to-Reality Boundary Shimmer | Simple |
| E-SKT-06 | World's Edge Void | Medium |
| E-CMB-04 | Critical Hit Flash | Simple |
| E-CMB-05 | Preserver Stasis Attack | Medium |
| E-CMB-06 | Boss Phase Transition | Simple |
| E-CIN-02 | God Recall Vision (x4) | Medium |
| E-CIN-05 | Grym God Pulse Responses | Medium |
| E-UI-02 | Combat Vignette | Simple |
| E-UI-03 | Menu Transitions | Simple |
| E-UI-04 | Vibrancy Tier HUD Flash | Simple |
| E-FOR-01 | Fortress God Fractures | Simple |
| E-FOR-02 | Fortress De-Crystallization | Medium |
| E-FOR-03 | Gallery Frozen Scenes | Simple |

### P3 (Polish) — 4 effects

| ID | Effect | Complexity |
|----|--------|------------|
| E-VIB-05 | Vivid-Tier Resonance Stone Particles | Simple |
| E-VIB-06 | Weather-Style Ambient Motion | Medium |
| E-CIN-06 | Credits World Growth | Medium |

---

## Implementation Recommendations

### Shared Systems to Build First

1. **Particle Engine**: A reusable PixiJS particle system with configurable emitters, lifetime, gravity, drift, color, and alpha. Used by E-VIB-02, E-VIB-03, E-MEM-01, E-CMB-01, E-STAG-03, and all god recall effects. Build this first.

2. **Filter Manager**: A utility for applying and animating PixiJS filters (`ColorMatrixFilter`, `GlowFilter`, `DisplacementFilter`, `BlurFilter`) on the game container, individual sprites, or bounded zones. Used by E-VIB-01, E-STAG-01, E-STAG-04, E-GOD-* recall sequences.

3. **Cinematic Sequencer**: A timeline-based system for choreographing multi-step visual sequences (particle bursts at time T, filter changes at time T+500ms, camera moves at time T+1000ms). Used by all E-CIN-* effects and god recall transformations.

4. **Zone-Bounded Effects**: A system for applying visual effects only within defined tile regions (stagnation zones, broadcast radii). Used by E-STAG-01, E-STAG-02, E-VIB-02.

### Estimated Total Effort

| Category | P1 Effects | P2 Effects | P3 Effects | Est. Effort (P1 only) |
|----------|-----------|-----------|-----------|----------------------|
| Vibrancy | 2 | 3 | 2 | 1 week |
| Stagnation | 3 | 2 | 0 | 1.5 weeks |
| Memory | 2 | 2 | 0 | 1 week |
| God Recall | 8 | 1 | 0 | 4-6 weeks |
| Sketch | 3 | 3 | 0 | 1.5 weeks |
| Combat | 3 | 3 | 0 | 1.5 weeks |
| Cinematic | 4 | 2 | 1 | 3-4 weeks |
| UI | 1 | 3 | 0 | 0.5 weeks |
| Fortress | 0 | 3 | 0 | — |
| **Total** | **26** | **22** | **3** | **~14-17 weeks** |

The god recall transformations (16 variants across 4 gods) represent roughly 30-40% of the total P1 effort. Consider shipping with simplified recall sequences (e.g., a common "energy burst + color shift + god figure appears" template with emotion-specific color palettes) and enhancing to full unique sequences in a post-launch update.
