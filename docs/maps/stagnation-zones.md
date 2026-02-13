# Stagnation Zones: Preserver-Controlled Areas

> Cross-references: [docs/world/vibrancy-system.md](../world/vibrancy-system.md), [docs/world/factions.md](../world/factions.md), [docs/world/geography.md](../world/geography.md), [docs/design/enemies-catalog.md](../design/enemies-catalog.md), [docs/design/items-catalog.md](../design/items-catalog.md), [docs/maps/overworld-layout.md](overworld-layout.md), [docs/story/quest-chains.md](../story/quest-chains.md), [docs/design/memory-system.md](../design/memory-system.md), [docs/design/tileset-spec.md](../design/tileset-spec.md)

## Overview

Stagnation zones are localized areas within surface maps where the Preservers have frozen everything in crystalline stasis. They are the game's primary environmental antagonist — a visual and mechanical expression of the Preservers' philosophy that change should be stopped.

Stagnation zones are **distinct from a map's overall vibrancy**. A zone can be at Normal vibrancy (50) and still contain a Stagnation Zone (e.g., Heartfield's Stagnation Clearing). Breaking a stagnation zone is a one-time action that permanently removes the Preserver presence from that area.

### How Stagnation Looks

Stagnation tiles are **overlays** applied on top of the base biome's current vibrancy tier (see [tileset-spec.md](../design/tileset-spec.md), Stagnation/Crystal biome):

| Element | Visual Effect |
|---------|--------------|
| Ground | Semi-transparent blue-white crystalline sheet over base tile. Base visible but desaturated. |
| Structures | Buildings/objects coated in prismatic frost. Original details preserved but frozen — no animation. |
| NPCs | Rendered in blue-tinted grayscale, completely motionless, crystalline sparkle on edges. |
| Water | Frozen mid-ripple. Visible wave crests turned to ice. |
| Vegetation | Crystallized in place. Flowers, grass, leaves all frozen. No wind animation. |
| Crystal growths | Blue-white crystal formations sprouting from ground, walls, objects. Larger near focal point. |
| Border | 2-tile-wide transition strip: normal tiles → gradually crystallized → full crystal overlay. |
| Ambient | No particle effects, no ambient motion (leaves, water, wind) within boundaries. |

### How Stagnation Sounds

Within stagnation zone boundaries, audio is modified regardless of the parent zone's vibrancy (see [vibrancy-system.md](../world/vibrancy-system.md)):

- All BGM layers above Layer 1 are muffled (low-pass filter at 800 Hz)
- Layer 1 plays at 0.7x tempo with heavy reverb
- Crystalline tinkling ambient loop added (ice wind chimes)
- Breaking a stagnation zone: all layers explode to full clarity in a 3-second crescendo

### Breaking a Stagnation Zone

All stagnation zones follow this sequence:

1. **Approach**: The player enters the 2-tile border transition strip. Visual/audio effects begin fading in.
2. **Navigate**: The player must reach the zone's **crystallized focal point** — the central object that anchors the stasis field.
3. **Broadcast**: Stand adjacent to the focal point and broadcast a memory fragment meeting the zone's **unlock condition** (emotion, element, and/or potency requirements).
4. **Shatter**: 2-second animation — crystal fragments fly outward, warm color floods in. The stagnation overlay tiles are permanently removed.
5. **Combat**: Preserver agents in the zone become hostile (forced encounter). The number and type scale with zone difficulty.
6. **Reward**: After combat victory, the zone's vibrancy immediately gains +10. Frozen NPCs unfreeze. Preserver reinforcement for this zone permanently stops.

### Difficulty Progression

Stagnation zones are designed with an escalating difficulty curve:

| Difficulty | Act | Fragment Requirement | Preserver Combat | Zones |
|------------|-----|---------------------|------------------|-------|
| Tutorial | I | Any fragment, potency 1+ | None (narrative only) | Heartfield Stagnation Clearing |
| Easy | II (early) | Specific emotion, potency 2+ | 2 Scouts | Sunridge Preserver Outpost |
| Medium | II (mid) | Dual requirement (emotion + element), potency 3+ | 2 Scouts + 1 Agent | Shimmer Marsh Stagnation Bog |
| Hard | II (mid-late) | Sequential multi-broadcast, 3 different elements | 3 Agents | Hollow Ridge Shattered Pass |
| Very Hard | II (late) | High-emotion potency 4+ | 3 Agents + 1 Captain | Resonance Fields Preserver Cathedral |
| Extreme | III | Any 5-star fragment | 2 Archivists | Luminous Wastes Preserver Watchtower |
| Story-gated | III | All 4 gods recalled (not broadcast-breakable) | N/A (see Fortress) | Undrawn Peaks Crystalline Fortress Gate |

---

## Zone 1: Heartfield Stagnation Clearing (Tutorial)

**Parent map**: Heartfield | **Position**: (33, 28) | **Size**: 5×5 tiles
**Act**: I | **Difficulty**: Tutorial
**Quest link**: MQ-04 (Act I climax — Lira's freezing)

### Narrative Context

This is the player's first encounter with Preserver stagnation. During the Act I climax (MQ-04), a Preserver scout freezes a patch of farmland near the Heartfield hamlet — and Lira with it. The player witnesses the crystallization but cannot break it during Act I (they lack the knowledge and fragments).

When the player returns in Act II (after MQ-05 and reaching level 12+), they can break this zone as part of clearing the expanded stagnation from the Act I event. The boss encounter B-01 (Stagnation Heart) emerges from the shattered crystal.

### Layout

```
     33   34   35   36   37
 28  ┌────────────────────┐
     │  ·  ·  ·  ·  ·    │    · = crystallized grass
 29  │  ·  · [F] ·  ·    │    F = focal point (crystallized Resonance Stone)
     │  ·  · [L] ·  ·    │    L = Lira's frozen position
 30  │  ·  ·  ·  ·  ·    │    B = border transition tiles
     │  B  B  B  B  B    │
 32  └────────────────────┘
```

### Crystallized Objects

| Object | Position | Description |
|--------|----------|-------------|
| Crystallized Resonance Stone (focal point) | (35, 29) | A small Resonance Stone encased in blue-white crystal. Faint amber glow visible beneath the ice. This is the broadcast target. |
| Lira's frozen form | (35, 30) | Lira stands with one hand extended, frozen mid-gesture during her attempt to defend the clearing. Crystal sparkles on her edges. Interacting triggers dialogue: *"She's frozen at the exact moment she tried to broadcast. Her fragment is still in her hand — a potency-4 light fragment, half-delivered."* |
| Frozen butterflies | (33, 28), (37, 28) | Three butterflies frozen mid-flight. Wings catch prismatic light. After breaking: they flutter away and don't return (cosmetic). |
| Frozen wheat | throughout | Wheat stalks frozen upright, crystal coating each blade. After breaking: wheat sways normally. |

### Unlock Condition

| Requirement | Value |
|-------------|-------|
| Fragment emotion | Any |
| Fragment element | Any |
| Fragment potency | 1+ (minimum) |
| Broadcast target | Crystallized Resonance Stone at (35, 29) |
| Special notes | This is a tutorial. Lira (through a flashback vision) guides the player through the broadcast. No combat on first break. |

### Breaking Sequence

1. Player approaches the crystallized Resonance Stone.
2. Lira's flashback vision plays (10-second narrated sequence): *"Remember what I taught you. Hold the fragment. Feel the memory. Now push it into the stone. The crystal will resist — but memories are stronger than ice."*
3. Player broadcasts any fragment (potency 1+).
4. Shatter animation plays. Crystal fragments fly outward. Warm gold floods in.
5. **No combat** on this first break (tutorial exception).
6. Lira's frozen form remains (she can only be freed by the boss fight or SQ-14 later). Her crystal prison cracks but holds.
7. Heartfield vibrancy gains +10.

### Act II Return (B-01 Boss Fight)

When the player returns with a potency 3+ fragment (Act II, level 13-16), broadcasting at Lira's frozen form triggers the expanded stagnation break:

1. The remaining crystal around Lira's form shatters.
2. B-01: Stagnation Heart emerges (see [enemies-catalog.md](../design/enemies-catalog.md)).
3. Boss fight plays out (Phase 1: Crystal Shell, Phase 2: Heart Exposed).
4. On defeat: Crystal Collapse death trigger (50 fixed damage to party). Lira is freed.
5. Additional +10 vibrancy to Heartfield.

### Summary

| Metric | Value |
|--------|-------|
| Size | 5×5 tiles |
| Frozen NPCs | 1 (Lira — freed via B-01 boss or SQ-14) |
| Frozen objects | Resonance Stone, butterflies, wheat |
| Unlock requirement | Any fragment, potency 1+ (tutorial) |
| Combat | None (tutorial). Boss B-01 on Act II return. |
| Vibrancy reward | +10 (first break), +10 (boss clear) |
| Preserver reinforcement rate | -1 vibrancy per 5 min (cleared permanently after first break) |
| Quest links | MQ-04, SQ-14, B-01 |

---

## Zone 2: Sunridge Preserver Outpost (Easy)

**Parent map**: Sunridge | **Position**: (30, 13) | **Size**: 5×4 tiles
**Act**: II (early) | **Difficulty**: Easy
**Quest link**: SQ-05 (The Deserter — Aric's defection)

### Narrative Context

A crystallized watchtower where Preserver scouts monitor the Frontier border. This is the first non-tutorial stagnation zone — the player must choose a specific emotion fragment (fury) to break through, teaching the unlock mechanic. Aric, a Preserver scout who becomes an ally, is stationed here. The SQ-05 quest chain involves converting Aric from loyalist to doubter through dialogue and evidence.

### Layout

```
     30   31   32   33   34
 13  ┌────────────────────┐
     │  · [T][T] ·  ·    │    T = crystallized watchtower (2 tiles wide)
 14  │  ·  · [F] ·  ·    │    F = focal point (frozen signal fire)
     │  B  B [A] B  B    │    A = Aric's patrol position
 16  │  B  B  B  B  B    │    B = border tiles
     └────────────────────┘
```

### Crystallized Objects

| Object | Position | Description |
|--------|----------|-------------|
| Crystallized watchtower | (31, 13), (32, 13) | Two-tile stone watchtower frozen in blue-white crystal. A lookout platform at the top has a frozen Preserver banner. |
| Frozen signal fire (focal point) | (32, 14) | A bronze fire pit at the tower's base, frozen mid-flame. The crystal-encased fire still glows amber. Broadcast target. |
| Frozen grass | throughout | Highland grass frozen in wind-bent position. After breaking: grass resumes swaying. |
| Preserver supply crates | (30, 15) | Crystal-coated wooden crates. After breaking: lootable for Stasis Breaker (C-SC-04) ×2. |

### Frozen NPCs

| NPC | Position | Post-Break Behavior |
|-----|----------|-------------------|
| Aric (Preserver scout) | (32, 15) | Aric is NOT frozen — he patrols the border voluntarily. After breaking the stagnation zone, he becomes agitated: *"What did you — why did you break that? The signal fire kept the Frontier calm! Now anything could come through!"* This triggers SQ-05 if MQ-04+ is active. |

### Unlock Condition

| Requirement | Value |
|-------------|-------|
| Fragment emotion | Fury |
| Fragment element | Any |
| Fragment potency | 2+ |
| Broadcast target | Frozen signal fire at (32, 14) |
| Special notes | First zone requiring a specific emotion. The player must have a fury fragment potency 2+. Fury-type fragments are available from Sunridge Resonance Stones and Heartfield combat drops. |

### Breaking Sequence

1. Player broadcasts fury fragment (potency 2+) at the frozen signal fire.
2. Shatter animation: crystal cracks radially outward from the fire. The signal fire ignites naturally — warm orange flame.
3. **Combat**: 2 Preserver Scouts (E-PV-01) become hostile. They attack with polite dialogue: *"Please stop. The fire must stay frozen. It's protocol."*
4. After combat: Sunridge vibrancy gains +10. Supply crates become lootable.
5. Aric remains on-map as a questgiver (SQ-05).

### Preserver Reinforcement (Pre-Break)

| Rate | Floor | Effect |
|------|-------|--------|
| -2 vibrancy per 5 min | 25 | Sunridge can drop from starting 40 to 25. The outpost's presence gradually dims the highlands. |

### Summary

| Metric | Value |
|--------|-------|
| Size | 5×4 tiles |
| Frozen NPCs | 0 (Aric is voluntary, not frozen) |
| Frozen objects | Watchtower, signal fire, grass, supply crates |
| Unlock requirement | Fury emotion, potency 2+ |
| Combat | 2 Preserver Scouts (E-PV-01) |
| Vibrancy reward | +10 |
| Loot | Stasis Breaker (C-SC-04) ×2 from supply crates |
| Quest links | SQ-05, MQ-04+ |

---

## Zone 3: Shimmer Marsh Stagnation Bog (Medium)

**Parent map**: Shimmer Marsh | **Position**: (38, 8) | **Size**: 8×6 tiles
**Act**: II (mid) | **Difficulty**: Medium
**Quest link**: None (standalone environmental challenge)

### Narrative Context

A Preserver-controlled zone where the marsh has been crystallized into a frozen swamp. Ice-like formations trap water mid-ripple. This is the first stagnation zone with a **dual requirement** — the player must broadcast a fragment with BOTH the correct emotion (fury) AND element (water). This teaches the remix mechanic: the player likely needs to remix fragments to create a water+fury combination, since pure water+fury drops are rare.

### Layout

```
     38   39   40   41   42   43   44   45
  8  ┌──────────────────────────────────┐
     │  B  B  ·  ·  ·  ·  B  B        │    · = crystallized marsh
  9  │  B  · [P][P] ·  ·  ·  B        │    P = frozen marsh pools (ice)
     │  ·  ·  · [F] ·  · [P] ·        │    F = focal point (frozen Resonance Stone)
 10  │  ·  · [R] ·  ·  ·  ·  ·        │    R = frozen reeds (crystallized vegetation)
     │  ·  ·  ·  · [R] ·  ·  ·        │    S = Preserver Scout positions
 11  │  B  · [S] ·  · [S] ·  B        │    B = border transition tiles
     │  B  B  B  B  B  B  B  B        │
 13  └──────────────────────────────────┘
```

### Crystallized Objects

| Object | Position | Description |
|--------|----------|-------------|
| Frozen Resonance Stone (focal point) | (41, 10) | A marsh Resonance Stone encased in crystal. The water element energy within is visible as a frozen blue glow beneath the stasis shell. Broadcast target. |
| Frozen marsh pools | (39, 9), (40, 9), (44, 10) | Pools of water frozen mid-ripple. Surface is perfectly smooth crystal. Reflections locked in place. After breaking: water resumes flowing with memory-reflective surfaces. |
| Frozen reeds | (40, 11), (42, 12) | Reed clusters crystallized at full height. Crystal coats each reed blade individually. After breaking: reeds sway in marsh breeze. |
| Frozen frog | (43, 9) | A marsh frog frozen mid-leap. Purely cosmetic. After breaking: hops away. |
| Crystal growths (large) | (41, 9), (42, 10) | Tall blue-white crystal formations near the focal point. These are environmental obstacles — the player cannot walk through them. After breaking: they shatter completely, opening the path to the focal point. |

### Frozen NPCs

None. The Stagnation Bog is a remote area without permanent NPC residents. The Preserver Scouts patrol the perimeter voluntarily (not frozen).

### Unlock Condition

| Requirement | Value |
|-------------|-------|
| Fragment emotion | Fury |
| Fragment element | Water |
| Fragment potency | 3+ |
| Broadcast target | Frozen Resonance Stone at (41, 10) |
| Special notes | **Dual requirement** — the player needs a fragment with BOTH fury emotion AND water element at potency 3+. Water+fury fragments rarely drop naturally (most water fragments are sorrow-typed from Shimmer Marsh). The player likely needs to use the Remix Table to create this combination. This teaches an important lesson: remixing isn't just for optimizing broadcasts, it's sometimes necessary to solve puzzles. |

### How to Obtain a Water+Fury Fragment

Several paths to the required fragment:

1. **Remix**: Combine any fury fragment with any water fragment at a Remix Table (Lira's Workshop or Frontier camps). The result inherits the higher potency and the remixer can choose which emotion/element to keep.
2. **Rare drop**: Mire Crawlers (E-FR-01) in Shimmer Marsh have a 10% fragment drop chance. Their thematic affinity is water/fury (marsh predator). Getting a potency 3+ this way requires Vivid-tier Shimmer Marsh (potency modifier +1 at Vivid).
3. **River Nymphs**: River Nymphs (E-SL-05) in Millbrook drop water-element fragments. If the player has raised Millbrook's vibrancy to Vivid, they can get potency 3 water fragments and remix with any fury source.

### Breaking Sequence

1. Player navigates to the focal Resonance Stone (crystal growths block direct path — must circle around via (38, 10) → (39, 10) → (40, 10) → (41, 10)).
2. Broadcasts water+fury fragment (potency 3+).
3. Shatter animation: crystal explodes outward in concentric ripples (matching the frozen water motif). Water splashes as pools unfreeze. Color floods inward from the border.
4. **Combat**: 2 Preserver Scouts (E-PV-01) + 1 Preserver Agent (E-PV-02). Scouts rush in from patrol positions; Agent materializes from behind the large crystal growths.
5. After combat: Shimmer Marsh vibrancy gains +10. Marsh pools resume memory-reflective behavior. The Resonance Stone at RS-SM-03 (40, 12) becomes collectible.

### Preserver Reinforcement (Pre-Break)

| Rate | Floor | Effect |
|------|-------|--------|
| -2 vibrancy per 5 min | 15 | Shimmer Marsh can drop from starting 30 to 15. The bog's influence is remote but persistent. |

### Summary

| Metric | Value |
|--------|-------|
| Size | 8×6 tiles |
| Frozen NPCs | 0 |
| Frozen objects | Resonance Stone, 3 pools, reeds, frog, crystal growths |
| Unlock requirement | Fury emotion + Water element, potency 3+ |
| Combat | 2 Preserver Scouts + 1 Preserver Agent |
| Vibrancy reward | +10 |
| Loot | RS-SM-03 fragment (fury/water/2) accessible post-break |
| Quest links | None (standalone) |

---

## Zone 4: Hollow Ridge Shattered Pass (Hard)

**Parent map**: Hollow Ridge | **Position**: (33, 28) | **Size**: 8×6 tiles
**Act**: II (mid-late) | **Difficulty**: Hard
**Quest link**: None (environmental puzzle gate)

### Narrative Context

A mountain pass that the Preservers have partially crystallized. The ground is a mosaic of frozen rock and living stone. This zone introduces the **sequential broadcast puzzle** — the player must broadcast fragments at three separate crystal waypoints in the correct elemental order (earth → fire → wind) to unlock the central focal point. This teaches the player to plan their fragment inventory ahead of time.

### Layout

```
     33   34   35   36   37   38   39   40
 28  ┌──────────────────────────────────┐
     │  B  ·  · [1] ·  ·  ·  B        │    1,2,3 = crystal waypoints (sequential)
 29  │  ·  ·  ·  ·  ·  · [C] ·        │    F = focal point (frozen mountain gate)
     │  · [C] ·  · [F] ·  ·  ·        │    C = crystal growth obstacles
 30  │  ·  ·  ·  ·  ·  · [2] ·        │    B = border tiles
     │  ·  · [3] ·  ·  ·  ·  ·        │    · = crystallized rock
 31  │  B  ·  ·  ·  ·  ·  ·  B        │
     │  B  B  B  B  B  B  B  B        │
 33  └──────────────────────────────────┘
```

### Crystallized Objects

| Object | Position | Description |
|--------|----------|-------------|
| Crystal Waypoint 1: Earth | (36, 28) | A crystallized boulder with a visible earth-element rune beneath the ice. Broadcast earth-element fragment here first. |
| Crystal Waypoint 2: Fire | (39, 30) | A crystallized thermal vent with a frozen flame (visible orange glow trapped in crystal). Broadcast fire-element fragment here second. |
| Crystal Waypoint 3: Wind | (35, 31) | A crystallized wind tunnel — air frozen mid-gust, visible as streaked crystal. Broadcast wind-element fragment here third. |
| Frozen mountain gate (focal point) | (37, 30) | A massive stone gateway blocked by crystal barriers. Each correct waypoint broadcast removes one layer of crystal. All three cleared = gate opens. |
| Crystal growth obstacles | (34, 30), (39, 29) | Large crystal formations blocking direct routes. Force the player to navigate around them, discovering waypoints naturally. |
| Frozen mountain goats | (34, 29), (38, 31) | Two mountain goats frozen mid-climb. After breaking: they bound away over the rocks. |

### Frozen NPCs

None. The Shattered Pass is uninhabited terrain.

### Unlock Condition

| Requirement | Value |
|-------------|-------|
| Waypoint 1 | Earth element, any emotion, any potency |
| Waypoint 2 | Fire element, any emotion, any potency |
| Waypoint 3 | Wind element, any emotion, any potency |
| Sequence | Must be activated in order: Earth → Fire → Wind |
| Special notes | **Sequential multi-broadcast**. The player needs 3 different element fragments. The order is hinted at by rune symbols on each waypoint: a mountain (earth/foundation) → a flame (fire/transformation) → a spiral (wind/release). Wrong order resets all waypoints (no damage, just reset). No potency requirement — the puzzle is about element variety, not power. |

### Breaking Sequence

1. Player broadcasts earth-element fragment at Waypoint 1 (36, 28). Crystal layer 1 on the gate shatters.
2. Player broadcasts fire-element fragment at Waypoint 2 (39, 30). Crystal layer 2 shatters. Thermal vent reactivates (warm air rises).
3. Player broadcasts wind-element fragment at Waypoint 3 (35, 31). Crystal layer 3 shatters. Wind tunnel reactivates (gusts of wind visible).
4. Mountain gate crystal completely shatters. The pass is open.
5. **Combat**: 3 Preserver Agents (E-PV-02) emerge from behind the gate. They fight in formation — each has a positional buff when adjacent to another Agent (+10% DEF).
6. After combat: Hollow Ridge vibrancy gains +10. The mountain pass remains permanently open.

### Preserver Reinforcement (Pre-Break)

| Rate | Floor | Effect |
|------|-------|--------|
| -3 vibrancy per 5 min | 10 | Hollow Ridge can drop from starting 20 to 10. Heavy Preserver presence dims the highlands aggressively. |

### Summary

| Metric | Value |
|--------|-------|
| Size | 8×6 tiles |
| Frozen NPCs | 0 |
| Frozen objects | 3 waypoints, mountain gate, crystal growths, 2 goats |
| Unlock requirement | 3 sequential broadcasts: Earth → Fire → Wind elements |
| Combat | 3 Preserver Agents (E-PV-02) |
| Vibrancy reward | +10 |
| Loot | Frontier Guard armor (A-09) in chest CH-HR-02 behind the gate |
| Quest links | None (environmental gate) |

---

## Zone 5: Resonance Fields Preserver Cathedral (Very Hard)

**Parent map**: Resonance Fields | **Position**: (38, 13) | **Size**: 8×6 tiles
**Act**: II (late) | **Difficulty**: Very Hard
**Quest link**: GQ-01-F2 (The Shattered Silence — Thunderstone K-15 required to initiate assault)

### Narrative Context

The Preservers' largest Frontier installation. A crystallized cathedral built from frozen Resonance Stones, silencing all memory-sound within a 10-tile radius. This is a significant Act II milestone — breaking the Cathedral opens the path to the Resonance Fields' full potential and is narratively framed as the first major blow against the Preservers' infrastructure.

The Cathedral requires the Thunderstone (K-15), given by Tempestus during the "Shattered Silence" quest (GQ-01-F2). This ensures the player has recalled at least one god (Resonance, via fury → Tempestus) before attempting this challenge.

### Layout

```
     38   39   40   41   42   43   44   45
 13  ┌──────────────────────────────────┐
     │  B  B [W][W][W][W] B  B        │    W = cathedral walls (frozen Resonance Stone)
 14  │  B [W] ·  ·  ·  · [W] B        │    G = cathedral gate (entry point)
     │ [W] ·  ·  · [F] ·  · [W]       │    F = focal point (silenced Grand Stone)
 15  │ [W] ·  · [A] ·  ·  · [W]       │    A = altar (Preserver relic)
     │ [W] ·  ·  ·  ·  ·  · [W]       │    · = crystallized interior
 16  │  B [W] ·  ·  ·  · [W] B        │    B = border transition tiles
     │  B  B [W][G][G][W] B  B        │
 18  └──────────────────────────────────┘
```

### Crystallized Objects

| Object | Position | Description |
|--------|----------|-------------|
| Grand Resonance Stone (focal point) | (42, 15) | The largest Resonance Stone in the Frontier — a massive pillar of amber crystal, now coated in blue-white Preserver crystal that silences its hum. The silence is audible — standing near it, the player hears the absence of the constant hum from all other Resonance Stones in the zone. Broadcast target. |
| Cathedral walls | perimeter | Frozen Resonance Stones repurposed as building material. Each wall block is a crystallized standing stone, arranged in cathedral-like architecture. They glow faintly — the Resonance Stones are still active beneath the stasis, just silenced. |
| Cathedral gate | (41, 17), (42, 17) | Two crystallized Resonance Stones serving as gate pillars. They only open when the Thunderstone (K-15) is presented (K-15 resonates at the same frequency as the silenced stones, cracking the gate crystal). |
| Preserver altar | (41, 16) | A crystal altar where the Preservers perform their "preservation ceremonies" — freezing new objects for the collection. Contains lore inscriptions: *"To preserve is to love. To change is to destroy. We choose love."* |
| Silence field indicator | 10-tile radius | A visual overlay showing the silence field — a subtle desaturation and stillness in a 10-tile radius around the Cathedral. All Resonance Stones within this radius are dimmed and silent. After breaking: they reactivate with an audible chord that resonates across the entire Resonance Fields map. |

### Frozen NPCs

None inside the Cathedral (the Preservers occupy it willingly — they are NOT frozen). However, the silence field dims 5 Resonance Stones outside the Cathedral that the player may have already interacted with. After breaking, these stones regain full brightness and sound.

### Unlock Condition

| Requirement | Value |
|-------------|-------|
| Pre-requisite | Thunderstone (K-15) to open the cathedral gate |
| Fragment emotion | Awe |
| Fragment element | Any |
| Fragment potency | 4+ |
| Broadcast target | Grand Resonance Stone at (42, 15) |
| Special notes | **High-emotion, high-potency requirement**. The player needs an awe-type fragment at potency 4 or higher. Awe fragments of this potency are available from: Resonance Fields Resonance Stones (if vibrancy is at Vivid, +1 modifier), dormant god recall (each recall drops potency-4+ fragments), or Depths L3 treasure. The Thunderstone gate check ensures the player has completed at least part of the Resonance god questline. |

### Breaking Sequence

1. Player presents Thunderstone (K-15) at the cathedral gate. Gate crystal cracks and opens.
2. Player enters the Cathedral interior. Silence is palpable — no BGM inside, only the crystalline tinkling ambient.
3. Player navigates to the Grand Resonance Stone at (42, 15), passing the altar.
4. Broadcasts awe fragment (potency 4+). The Grand Stone's amber glow intensifies beneath the crystal.
5. Shatter animation: the entire Cathedral cracks from inside out. The Grand Stone explodes with SOUND — a deep, resonant chord that vibrates the screen. All stagnation tiles dissolve in a wave pattern radiating from the Stone.
6. **Combat**: 3 Preserver Agents (E-PV-02) + 1 Preserver Captain (E-PV-03). The Captain speaks: *"The silence kept them safe. You've just exposed every memory in this field to corruption."*
7. After combat: Resonance Fields vibrancy gains +10. The Curator's Manifesto (K-06) is found on the altar (if not already obtained via SQ-05). All Resonance Stones in the zone regain full activity.

### Preserver Reinforcement (Pre-Break)

| Rate | Floor | Effect |
|------|-------|--------|
| -3 vibrancy per 5 min | 5 | Resonance Fields can drop from starting 15 to 5. The Cathedral's silence field is the most aggressive Preserver influence in the Frontier. |

### Summary

| Metric | Value |
|--------|-------|
| Size | 8×6 tiles |
| Frozen NPCs | 0 (Preservers are voluntary occupants) |
| Frozen objects | Grand Resonance Stone, cathedral walls, gate, altar |
| Unlock requirement | K-15 (Thunderstone) gate + Awe emotion, potency 4+ broadcast |
| Combat | 3 Preserver Agents + 1 Preserver Captain |
| Vibrancy reward | +10 |
| Loot | Curator's Manifesto (K-06) if not already obtained |
| Quest links | GQ-01-F2 (The Shattered Silence) |

---

## Zone 6: Luminous Wastes Preserver Watchtower (Extreme)

**Parent map**: Luminous Wastes | **Position**: (33, 8) | **Size**: 4×4 tiles
**Act**: III | **Difficulty**: Extreme
**Quest link**: None (standalone, but blocks Act III exploration)

### Narrative Context

A fully crystallized tower the Preservers built at the Sketch's border. They're trying to freeze the Sketch before it finishes forming, locking the world's growth permanently. This is the most difficult stagnation zone before the Fortress — it requires a 5-star fragment (the player's best) to break through.

### Layout

```
     33   34   35   36
  8  ┌────────────────┐
     │ [W][F][F][W]   │    W = crystallized tower walls
  9  │ [W] ·  · [W]   │    F = focal point (frozen crystal spire, 2 tiles)
     │ [W] · [A][W]   │    A = Archivist position
 10  │ [B][G][G][B]   │    G = tower gate
     │  B  B  B  B    │    B = border tiles
 11  └────────────────┘
```

### Crystallized Objects

| Object | Position | Description |
|--------|----------|-------------|
| Frozen crystal spire (focal point) | (34, 8), (35, 8) | A two-tile-tall spire of concentrated Preserver crystal. It pulses with blue-white light, projecting a stasis field that prevents the Sketch from expanding westward. The spire is the tower's power source. Broadcast target (either tile). |
| Tower walls | perimeter | Crystallized stone blocks. Unlike the Cathedral's repurposed Resonance Stones, these are purpose-built Preserver construction — pure crystal, geometric, alien compared to the Sketch's organic line-art. |
| Tower gate | (34, 10), (35, 10) | Crystal barrier. Opens when any fragment is broadcast adjacent to it (potency 1+ — just to open the door, not to break the zone). |
| Sketch interference zone | 8-tile radius | The spire prevents Sketch solidification within 8 tiles. The player cannot broadcast to solidify Sketch terrain within this radius while the tower stands. After breaking: the player can solidify the area normally. |

### Frozen NPCs

None. The Preservers here are Archivists — elite, partially crystallized scholars who occupy the tower willingly.

### Unlock Condition

| Requirement | Value |
|-------------|-------|
| Fragment emotion | Any |
| Fragment element | Any |
| Fragment potency | 5 (maximum) |
| Broadcast target | Crystal spire at (34, 8) or (35, 8) |
| Special notes | **Brute force requirement**. The Sketch needs maximum memory power to overcome the Preserver's strongest stasis field. 5-star fragments come from: dormant god recall (each recall drops potency-4 or 5 fragments), Depths bosses (guaranteed high-potency drops), or Vivid-tier zone collection with the potency +1 modifier pushing a natural 4 to 5. This is the game's most expensive single broadcast. |

### Breaking Sequence

1. Player broadcasts any fragment at tower gate to enter.
2. Navigates to crystal spire.
3. Broadcasts a 5-star fragment. The spire absorbs the memory energy and cracks from within.
4. Shatter animation: the entire tower collapses — crystal walls fall outward in slow motion, the spire shatters into a thousand points of light that drift outward into the Sketch. Where each light point touches Sketch terrain, a tiny bloom of color appears. The Sketch around the tower gains a 5-tile radius of solidification.
5. **Combat**: 2 Preserver Archivists (E-PV-04). They fight with crystalline constructs and archive seals.
6. After combat: Luminous Wastes vibrancy gains +10. The Sketch interference zone clears — the player can now solidify terrain freely in this area.

### Preserver Reinforcement (Pre-Break)

| Rate | Floor | Effect |
|------|-------|--------|
| -4 vibrancy per 5 min | 0 | Luminous Wastes can drop from starting 5 to 0. The Watchtower's influence is the most aggressive in the game. |

### Summary

| Metric | Value |
|--------|-------|
| Size | 4×4 tiles |
| Frozen NPCs | 0 |
| Frozen objects | Crystal spire, tower walls, gate |
| Unlock requirement | Any fragment, potency 5 (maximum) |
| Combat | 2 Preserver Archivists (E-PV-04) |
| Vibrancy reward | +10 + 5-tile Sketch solidification radius |
| Loot | None (combat rewards only) |
| Quest links | None (standalone) |

---

## Zone 7: Undrawn Peaks Crystalline Fortress Gate (Story-Gated)

**Parent map**: Undrawn Peaks | **Position**: (18, 33) | **Size**: 6×4 tiles
**Act**: III | **Difficulty**: Story-gated (cannot be broken by broadcast alone)
**Quest link**: MQ-08 (Through the Sketch)

### Narrative Context

Two massive crystallized pillars frame the entrance to the Preserver Fortress (final dungeon). This is not a standard stagnation zone — it cannot be broken by a simple broadcast. The player must solidify the Sketch terrain around the gate by broadcasting a potency 3+ fragment at the Resonance Stone RS-UP-02 at (19, 34), which makes the gate solid enough to enter. The gate itself is permanently crystallized Preserver construction — it doesn't "break" so much as become traversable.

This zone is fully documented in [overworld-layout.md](overworld-layout.md) (Undrawn Peaks section) and [dungeon-depths.md](dungeon-depths.md) (Preserver Fortress entry). It is included here for completeness.

### Unlock Condition

| Requirement | Value |
|-------------|-------|
| Pre-requisite | MQ-08 (Through the Sketch) — player has navigated the Sketch |
| Broadcast | Any fragment, potency 3+, at RS-UP-02 (19, 34) |
| Special notes | This solidifies the Sketch terrain around the gate, not the gate itself. The Preserver Captains guarding the gate step aside after the player demonstrates their power by solidifying the approach. No combat at the gate — the Fortress itself is the challenge. |

### Summary

| Metric | Value |
|--------|-------|
| Size | 6×4 tiles |
| Frozen NPCs | 0 |
| Combat | None at gate (Fortress interior has all combat) |
| Vibrancy reward | None (the Fortress is locked at 0 until endgame bloom) |
| Quest links | MQ-08, MQ-09 |

---

## Cross-Reference Tables

### Stagnation Zone Summary

| Zone | Parent Map | Position | Size | Act | Unlock | Combat | Vibrancy |
|------|-----------|----------|------|-----|--------|--------|----------|
| Stagnation Clearing | Heartfield | (33, 28) | 5×5 | I | Any, pot. 1+ | None (tutorial) | +10 |
| Preserver Outpost | Sunridge | (30, 13) | 5×4 | II | Fury, pot. 2+ | 2 Scouts | +10 |
| Stagnation Bog | Shimmer Marsh | (38, 8) | 8×6 | II | Fury+Water, pot. 3+ | 2 Scouts + 1 Agent | +10 |
| Shattered Pass | Hollow Ridge | (33, 28) | 8×6 | II | Earth→Fire→Wind seq. | 3 Agents | +10 |
| Preserver Cathedral | Resonance Fields | (38, 13) | 8×6 | II | K-15 + Awe, pot. 4+ | 3 Agents + 1 Captain | +10 |
| Preserver Watchtower | Luminous Wastes | (33, 8) | 4×4 | III | Any, pot. 5 | 2 Archivists | +10 |
| Fortress Gate | Undrawn Peaks | (18, 33) | 6×4 | III | MQ-08 + pot. 3+ | None | 0 |

### Preserver Reinforcement Summary

| Zone | Rate | Floor | Time to Floor (from start) |
|------|------|-------|---------------------------|
| Heartfield | -1/5 min | 40 | 75 min (from 55) |
| Sunridge | -2/5 min | 25 | 37.5 min (from 40) |
| Shimmer Marsh | -2/5 min | 15 | 37.5 min (from 30) |
| Hollow Ridge | -3/5 min | 10 | 16.7 min (from 20) |
| Resonance Fields | -3/5 min | 5 | 16.7 min (from 15) |
| Luminous Wastes | -4/5 min | 0 | 6.25 min (from 5) |
| Fortress | Locked at 0 | 0 | N/A |

### Fragment Requirements by Zone

| Zone | Emotion | Element | Potency | How to Obtain |
|------|---------|---------|---------|---------------|
| Heartfield | Any | Any | 1+ | Any fragment works (tutorial) |
| Sunridge | Fury | Any | 2+ | Sunridge Resonance Stones, Highland Hawk drops |
| Shimmer Marsh | Fury | Water | 3+ | Remix fury+water fragments, or rare Mire Crawler drop |
| Hollow Ridge (×3) | Any | Earth, Fire, Wind | Any | Collect 3 different elements from any source |
| Resonance Fields | Awe | Any | 4+ | God recall drops, Depths L3 treasure, Vivid-tier stones |
| Luminous Wastes | Any | Any | 5 | God recall drops, Depths bosses, Vivid-tier +1 modifier |
| Fortress Gate | Any | Any | 3+ | Common by Act III |

### Stagnation Zone → Quest Dependencies

| Zone | Dependent Quests | Effect of Clearing |
|------|-----------------|-------------------|
| Heartfield | MQ-04 (witnessing), SQ-14 (Lira), B-01 (boss) | Frees Lira (via B-01), opens SQ-14 resolution |
| Sunridge | SQ-05 (Aric's defection) | Aric becomes quest-giver, provides Preserver intel |
| Shimmer Marsh | None directly | Opens RS-SM-03 fragment, removes reinforcement |
| Hollow Ridge | None directly | Opens passage through Shattered Pass, CH-HR-02 loot |
| Resonance Fields | GQ-01-F2 (Shattered Silence) | K-06 available, all Resonance Stones reactivate |
| Luminous Wastes | None directly | Enables Sketch solidification in area |
| Fortress Gate | MQ-08, MQ-09 | Enables Fortress entry |
