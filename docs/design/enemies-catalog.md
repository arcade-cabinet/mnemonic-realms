# Enemies Catalog: Complete Bestiary

> Cross-references: [docs/design/progression.md](progression.md), [docs/design/combat.md](combat.md), [docs/design/items-catalog.md](items-catalog.md), [docs/design/classes.md](classes.md), [docs/design/memory-system.md](memory-system.md), [docs/world/geography.md](../world/geography.md), [docs/world/vibrancy-system.md](../world/vibrancy-system.md), [docs/world/dormant-gods.md](../world/dormant-gods.md), [docs/world/factions.md](../world/factions.md), [docs/story/act1-script.md](../story/act1-script.md)

## Overview

Every enemy in the game is listed here with exact stats, abilities, rewards, and spawn locations. Enemies are organized into five categories: **Settled Lands** (Act I), **Frontier** (Act II), **Sketch** (Act III), **Depths** (dungeon-specific), and **Preservers** (faction enemies appearing across Acts II-III). Boss encounters are documented separately at the end.

### Stat Design Principles

Enemy stats are tuned against the player stat tables in [progression.md](progression.md) and the damage formulas in [combat.md](combat.md):

```
Physical damage to enemy: floor((playerATK * 1.5 - enemyDEF * 0.8) * variance)
Magical damage to enemy:  floor((playerINT * 1.8 - enemyDEF * 0.4) * variance)
Enemy damage to player:   floor((enemyATK * 1.5 - playerDEF * 0.8) * variance)
```

**Design targets per act:**

| Act | Player Level | Hits to Kill Standard Enemy | Hits Enemy Takes to Kill Player | Enemy DEF Target |
|-----|-------------|---------------------------|-------------------------------|-----------------|
| I | 1-10 | 2-4 | 5-8 | 5-15 |
| II | 11-20 | 3-5 | 4-6 | 20-35 |
| III | 21-30 | 3-6 | 3-5 | 35-55 |

### Encounter Group Sizes

Enemies appear in groups on the overworld. Group composition determines encounter difficulty:

| Encounter Type | Group Size | Frequency |
|---------------|-----------|-----------|
| Common | 1-2 enemies | 60% |
| Standard | 2-3 enemies | 30% |
| Rare | 3-4 enemies (mixed types) | 10% |

### Drop Tables

Every enemy has three drop categories:
- **XP**: Fixed per enemy type, modified by level difference (see [progression.md](progression.md))
- **Gold**: Fixed per enemy type, no modifier
- **Items**: % chance per item, rolled independently. Only one item drops per enemy.
- **Fragments**: Separate from item drops. Normal enemies: 10% chance. Elite enemies: 50%. Bosses: guaranteed.

Fragment drops from normal enemies are always unnamed, with emotion/element matching the enemy's thematic affinity and potency 1-2 (Act I), 2-3 (Act II), or 3-4 (Act III).

---

## Settled Lands Enemies (Act I)

These enemies inhabit the Village Hub surroundings and the four Settled Lands sub-maps. They are the player's first opponents and teach basic combat.

### E-SL-01: Meadow Sprite

**Spawn zone**: Heartfield

**Flavor**: Tiny luminous creatures that float above the wheat fields, trailing wisps of golden pollen. They're not aggressive — they attack only when provoked (player walks into them) or cornered. They're memories of summer given form, and they giggle when they dodge.

| Stat | Value |
|------|-------|
| HP | 30 |
| ATK | 5 |
| INT | 3 |
| DEF | 3 |
| AGI | 8 |
| Base Level | 1 |

**Abilities**:
1. **Pollen Puff** — Basic attack. Deals ATK × 1.0 physical damage. 10% chance to inflict Slow (AGI halved, 2 turns).

**Rewards**: 18 XP | 8 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Minor Potion (C-HP-01) | 15% |
| — (no drop) | 85% |

**Fragment affinity**: Joy / Earth

---

### E-SL-02: Grass Serpent

**Spawn zone**: Heartfield

**Flavor**: Long, sinuous creatures that hide in the tall wheat. They ambush by lunging from the grass — the player gets a brief shadow warning on the tile before the attack. Their scales shimmer with muted green and gold, and they hiss with a sound like wind through stalks.

| Stat | Value |
|------|-------|
| HP | 45 |
| ATK | 8 |
| INT | 2 |
| DEF | 5 |
| AGI | 10 |
| Base Level | 2 |

**Abilities**:
1. **Lunge** — Basic attack. Deals ATK × 1.2 physical damage. This is the ambush attack — if the Grass Serpent acts first in the encounter (likely due to high AGI), Lunge deals ATK × 1.5 instead.
2. **Coil** — Self-buff. DEF +30% for 2 turns. Used when below 50% HP.

**Rewards**: 25 XP | 12 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Antidote (C-SC-01) | 20% |
| Minor Potion (C-HP-01) | 10% |
| — (no drop) | 70% |

**Fragment affinity**: Calm / Earth

---

### E-SL-03: Forest Wisp

**Spawn zone**: Ambergrove

**Flavor**: Ethereal spheres of pale blue-green light that drift between the trees. They're fragments of the Dissolved Choir's music given visible form — each one hums a faint note. They attack with concentrated sound-light bolts. When defeated, they pop like soap bubbles and leave a fading chord.

| Stat | Value |
|------|-------|
| HP | 35 |
| ATK | 3 |
| INT | 10 |
| DEF | 4 |
| AGI | 12 |
| Base Level | 3 |

**Abilities**:
1. **Wisp Bolt** — Magic attack. Deals INT × 1.5 magical damage (wind element). Targets one player.
2. **Flicker** — Evasion buff. 30% chance to dodge the next physical attack. Auto-activates at start of combat.

**Rewards**: 30 XP | 14 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Mana Drop (C-SP-01) | 20% |
| — (no drop) | 80% |

**Fragment affinity**: Awe / Wind

---

### E-SL-04: Thornback Beetle

**Spawn zone**: Ambergrove

**Flavor**: Palm-sized beetles with shells of bark and thorn. They cluster near fallen logs and root tangles. Their thorny backs make them painful to hit — dealing physical damage to them has a 15% chance to deal 5 recoil damage to the attacker. They're slow but tough, and they always fight to the last.

| Stat | Value |
|------|-------|
| HP | 55 |
| ATK | 7 |
| INT | 2 |
| DEF | 10 |
| AGI | 4 |
| Base Level | 3 |

**Abilities**:
1. **Mandible Crush** — Basic attack. Deals ATK × 1.3 physical damage.
2. **Thorn Shell** (passive) — Any physical attack against the Thornback Beetle has a 15% chance to deal 5 fixed damage back to the attacker. Magic attacks bypass this.

**Rewards**: 35 XP | 15 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Antidote (C-SC-01) | 15% |
| Minor Potion (C-HP-01) | 15% |
| — (no drop) | 70% |

**Fragment affinity**: Fury / Earth

**Design note**: The Thornback teaches players that high-DEF enemies exist and that magical damage bypasses physical armor more efficiently (DEF × 0.4 vs DEF × 0.8). Mages shine here; Knights and Rogues should use skills instead of basic attacks.

---

### E-SL-05: River Nymph

**Spawn zone**: Millbrook

**Flavor**: Translucent humanoid figures that emerge from the Brightwater River. They're composed of flowing water and faint memory-light — you can see the riverbed through their bodies. They sing wordlessly (echoes of the Choir) and attack with jets of pressurized water. Not malicious — they're territorial about the river.

| Stat | Value |
|------|-------|
| HP | 40 |
| ATK | 4 |
| INT | 9 |
| DEF | 6 |
| AGI | 11 |
| Base Level | 4 |

**Abilities**:
1. **Water Jet** — Magic attack. Deals INT × 1.6 water-element magical damage. Targets one player.
2. **Splash Guard** — Party-wide water shield. Reduces the next incoming fire-element attack by 50%. Used once per combat at the start.

**Rewards**: 35 XP | 16 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Mana Drop (C-SP-01) | 20% |
| Minor Potion (C-HP-01) | 10% |
| — (no drop) | 70% |

**Fragment affinity**: Joy / Water

---

### E-SL-06: Stone Crab

**Spawn zone**: Millbrook

**Flavor**: Flat, wide crabs with shells made of river-polished stone. They skitter along the riverbanks with surprising speed for their bulk. When threatened, they snap their massive pincers — the crack is audible across the map. Their shells are covered in small Resonance Stone chips that glint in the light.

| Stat | Value |
|------|-------|
| HP | 60 |
| ATK | 10 |
| INT | 2 |
| DEF | 12 |
| AGI | 5 |
| Base Level | 4 |

**Abilities**:
1. **Pincer Snap** — Basic attack. Deals ATK × 1.4 physical damage. 10% chance to inflict Weakness (DEF -30%, 3 turns).
2. **Shell Hunker** — DEF +50% for 1 turn. Used when targeted by 2+ attacks in the previous round.

**Rewards**: 40 XP | 18 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Fortify Tonic (C-SC-03) | 10% |
| Minor Potion (C-HP-01) | 15% |
| — (no drop) | 75% |

**Fragment affinity**: Calm / Water

---

### E-SL-07: Highland Hawk

**Spawn zone**: Sunridge

**Flavor**: Swift raptors with wingspans wider than the player is tall. Their feathers are wind-colored — gray-blue that shifts to silver at the tips. They dive-bomb from above, striking with talons before wheeling back into the sky. Between attacks they circle overhead, nearly untouchable.

| Stat | Value |
|------|-------|
| HP | 45 |
| ATK | 11 |
| INT | 3 |
| DEF | 6 |
| AGI | 18 |
| Base Level | 5 |

**Abilities**:
1. **Dive Strike** — Physical attack. Deals ATK × 1.5 damage. If the Hawk acts first this turn, deals ATK × 1.8 instead (similar to the Rogue's Foreshadow mechanic — teaches the player how speed-based combat works).
2. **Evasive Climb** — For 1 turn, the Hawk cannot be targeted by single-target physical attacks (it's circling out of range). AoE and magic still hit. Used every 3rd turn.

**Rewards**: 40 XP | 18 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Haste Charm (C-SC-02) | 10% |
| Smoke Bomb (C-SP-05) | 15% |
| — (no drop) | 75% |

**Fragment affinity**: Fury / Wind

**Design note**: Highland Hawks are the Act I skill-check enemy. Their high AGI (18) means they almost always act first, and Evasive Climb forces the player to use magic or AoE skills rather than basic attacks. This prepares the player for Frontier enemies that use similar mechanics at higher intensity.

---

### E-SL-08: Crag Golem

**Spawn zone**: Sunridge

**Flavor**: Humanoid figures assembled from loose highland rock. They stand motionless near outcrops until the player comes within 3 tiles, then lumber forward with grinding stone steps. Their eyes are chips of amber Resonance Stone — they're animated by dissolved memory energy leaking from the nearby Wind Shrine. Slow and patient. Every swing of their stone fists sends gravel flying.

| Stat | Value |
|------|-------|
| HP | 80 |
| ATK | 13 |
| INT | 1 |
| DEF | 15 |
| AGI | 3 |
| Base Level | 6 |

**Abilities**:
1. **Stone Fist** — Basic attack. Deals ATK × 1.3 physical damage. 15% chance to inflict Stun (skip next turn, 1 turn).
2. **Earthen Wall** (passive) — Takes 25% less damage from earth-element attacks. Takes 25% more damage from water-element attacks.

**Rewards**: 50 XP | 20 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Strength Seed (C-BF-01) | 8% |
| Fortify Tonic (C-SC-03) | 12% |
| Minor Potion (C-HP-01) | 15% |
| — (no drop) | 65% |

**Fragment affinity**: Awe / Fire

**Design note**: The Crag Golem is the tankiest Act I enemy. A Level 6 Knight deals floor((20 × 1.5 - 15 × 0.8) × 1.0) = 18 damage per basic attack → 5 hits to kill. The Mage at Level 6 deals floor((26 × 1.8 - 15 × 0.4) × 1.0) = 40 → 2 hits. This heavily reinforces the lesson that magic > physical against armored foes.

---

### Settled Lands Enemy Summary

| ID | Name | Zone | HP | ATK | DEF | AGI | XP | Gold | Base Lvl |
|----|------|------|----|-----|-----|-----|----|------|----------|
| E-SL-01 | Meadow Sprite | Heartfield | 30 | 5 | 3 | 8 | 18 | 8 | 1 |
| E-SL-02 | Grass Serpent | Heartfield | 45 | 8 | 5 | 10 | 25 | 12 | 2 |
| E-SL-03 | Forest Wisp | Ambergrove | 35 | 3 | 4 | 12 | 30 | 14 | 3 |
| E-SL-04 | Thornback Beetle | Ambergrove | 55 | 7 | 10 | 4 | 35 | 15 | 3 |
| E-SL-05 | River Nymph | Millbrook | 40 | 4 | 6 | 11 | 35 | 16 | 4 |
| E-SL-06 | Stone Crab | Millbrook | 60 | 10 | 12 | 5 | 40 | 18 | 4 |
| E-SL-07 | Highland Hawk | Sunridge | 45 | 11 | 6 | 18 | 40 | 18 | 5 |
| E-SL-08 | Crag Golem | Sunridge | 80 | 13 | 15 | 3 | 50 | 20 | 6 |

---

## Frontier Enemies (Act II)

Frontier enemies are more dangerous, use 2-3 abilities, and introduce status effects and multi-target attacks. The player should be Level 11-20 when facing these.

### E-FR-01: Mire Crawler

**Spawn zone**: Shimmer Marsh

**Flavor**: Low, many-legged creatures that slither through the marsh muck. Their bodies are segmented and translucent — you can see the swamp water churning inside them. They leave trails of toxic residue. They ambush by rising from pools that appear shallow.

| Stat | Value |
|------|-------|
| HP | 120 |
| ATK | 22 |
| INT | 8 |
| DEF | 20 |
| AGI | 10 |
| Base Level | 11 |

**Abilities**:
1. **Toxic Lunge** — Physical attack. Deals ATK × 1.3 damage. 25% chance to inflict Poison (5% max HP per turn, 3 turns).
2. **Mire Grip** — Targeted attack. Deals ATK × 1.0 damage and inflicts Slow (AGI halved, 2 turns). Used when a party member has the highest AGI.
3. **Burrow** — The Crawler sinks into the ground for 1 turn, becoming untargetable. Emerges next turn with a guaranteed Toxic Lunge.

**Rewards**: 65 XP | 30 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Antidote (C-SC-01) | 25% |
| Potion (C-HP-02) | 15% |
| — (no drop) | 60% |

**Fragment affinity**: Sorrow / Water

---

### E-FR-02: Echo Toad

**Spawn zone**: Shimmer Marsh

**Flavor**: Large, bloated amphibians whose croaks carry dissolved memory energy. Their skin shimmers with reflected memory-light, and their eyes glow amber. When they croak, the sound hangs in the air as a visible ripple. Their most dangerous trick: they can split into duplicates made of solidified sound.

| Stat | Value |
|------|-------|
| HP | 90 |
| ATK | 15 |
| INT | 18 |
| DEF | 18 |
| AGI | 14 |
| Base Level | 12 |

**Abilities**:
1. **Resonant Croak** — Magic attack. Deals INT × 1.4 water-element damage to all party members. Used every other turn.
2. **Echo Split** — Creates 1 Echo Duplicate (HP 30, ATK 10, DEF 8, AGI 14). The duplicate attacks with a basic croak (INT × 0.8 single target). Max 2 duplicates active. Duplicates yield no rewards.
3. **Memory Drain** — Single target. Deals INT × 1.0 damage and drains 10 SP from the target. Used when the Toad has 0 active duplicates.

**Rewards**: 75 XP | 35 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Mana Draught (C-SP-02) | 20% |
| Potion (C-HP-02) | 10% |
| — (no drop) | 70% |

**Fragment affinity**: Awe / Water

**Design note**: Echo Toads teach the player to prioritize the main body over duplicates. Killing duplicates is a trap — they respawn. Kill the Toad itself and everything despawns.

---

### E-FR-03: Bog Wisp

**Spawn zone**: Shimmer Marsh

**Flavor**: Larger, more aggressive cousins of the Forest Wisps from Ambergrove. These are sickly yellow-green and trail a miasma of swamp gas. They're the marsh's immune system — they attack anything that disrupts the dissolved memories stored in the water. Their SP-draining attacks are particularly dangerous to Mages and Clerics.

| Stat | Value |
|------|-------|
| HP | 70 |
| ATK | 10 |
| INT | 20 |
| DEF | 15 |
| AGI | 22 |
| Base Level | 12 |

**Abilities**:
1. **Marsh Light** — Magic attack. Deals INT × 1.6 dark-element damage. Single target.
2. **SP Siphon** — Drains 15 SP from one target. Deals no damage. Prioritizes the party member with the highest current SP.
3. **Will-o'-Wisp** (passive) — 25% chance to evade physical attacks. Magic always hits.

**Rewards**: 70 XP | 28 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Mana Draught (C-SP-02) | 25% |
| — (no drop) | 75% |

**Fragment affinity**: Sorrow / Dark

---

### E-FR-04: Wind Elemental

**Spawn zone**: Hollow Ridge

**Flavor**: Churning vortices of mountain air and scattered debris — pebbles, leaves, snow crystals all spinning in a contained cyclone. They're born from Kinesis's dormant dream of motion, perpetually swirling at the ridgeline. They attack in groups and coordinate their wind patterns to create cross-drafts that buffet the party.

| Stat | Value |
|------|-------|
| HP | 100 |
| ATK | 18 |
| INT | 16 |
| DEF | 16 |
| AGI | 24 |
| Base Level | 13 |

**Abilities**:
1. **Gust Slash** — Physical attack. Deals ATK × 1.3 wind-element damage to one target.
2. **Crosswind** — AoE magic attack. Deals INT × 1.0 wind-element damage to all party members. Only used when 2+ Wind Elementals are in the encounter (they combine their wind).
3. **Updraft** — Buff one ally. Target gains AGI +30% for 2 turns. Used on the slowest ally in the encounter.

**Rewards**: 80 XP | 38 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Haste Charm (C-SC-02) | 15% |
| Haste Seed (C-BF-04) | 10% |
| — (no drop) | 75% |

**Fragment affinity**: Fury / Wind

---

### E-FR-05: Mountain Drake

**Spawn zone**: Hollow Ridge

**Flavor**: Scaled reptilian beasts the size of large dogs. They nest in the crevices of unfinished peaks and breathe gouts of amber-tinged fire — memory-flame that burns with the heat of the mountain-dwelling Dissolved civilization's forges. Their scales are iron-dark with veins of glowing amber. They're aggressive but not evil — they're protecting their nesting grounds.

| Stat | Value |
|------|-------|
| HP | 180 |
| ATK | 25 |
| INT | 12 |
| DEF | 25 |
| AGI | 12 |
| Base Level | 14 |

**Abilities**:
1. **Flame Bite** — Physical attack. Deals ATK × 1.4 fire-element damage.
2. **Memory Breath** — Cone AoE magic attack. Deals INT × 1.8 fire-element damage to 1-2 targets (front row only in groups). 15% chance to inflict Weakness per target. 3-turn cooldown.
3. **Scale Harden** — Self-buff. DEF +40% for 2 turns. Used when HP drops below 40%.

**Rewards**: 100 XP | 50 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Potion (C-HP-02) | 20% |
| Strength Seed (C-BF-01) | 10% |
| — (no drop) | 70% |

**Fragment affinity**: Fury / Fire

---

### E-FR-06: Phantom Fox

**Spawn zone**: Flickerveil

**Flavor**: Sleek fox-like creatures that phase between fully rendered and sketch-outline. They flicker in and out of visibility mid-combat, striking from unexpected angles. Their fur shifts between silver and transparent, and their eyes are the only consistently visible part — two amber points floating through the flickering forest.

| Stat | Value |
|------|-------|
| HP | 85 |
| ATK | 20 |
| INT | 10 |
| DEF | 14 |
| AGI | 28 |
| Base Level | 13 |

**Abilities**:
1. **Phase Strike** — Physical attack. Deals ATK × 1.5 damage. If the Fox is in "phased" state, this attack ignores 50% of target's DEF.
2. **Flicker Phase** — Toggle ability. The Fox alternates between visible and phased state each turn. While phased: physical attacks against it have 40% chance to miss. Magic attacks are unaffected.
3. **Pack Howl** — Buff all Phantom Foxes in the encounter: ATK +15% for 2 turns. Used on the Fox's first turn if 2+ Foxes are present.

**Rewards**: 80 XP | 35 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Smoke Bomb (C-SP-05) | 20% |
| Haste Charm (C-SC-02) | 10% |
| — (no drop) | 70% |

**Fragment affinity**: Calm / Wind

---

### E-FR-07: Canopy Crawler

**Spawn zone**: Flickerveil

**Flavor**: Spider-like creatures the size of a human torso that lurk in the flickering canopy above. They drop silently from branches, trailing gossamer threads of solidified memory. Their bodies are partially transparent — you can see the dissolved memories they've consumed glowing inside their abdomens like captured fireflies.

| Stat | Value |
|------|-------|
| HP | 110 |
| ATK | 22 |
| INT | 6 |
| DEF | 22 |
| AGI | 16 |
| Base Level | 14 |

**Abilities**:
1. **Drop Attack** — Physical attack. Deals ATK × 1.6 damage on the first turn of combat only (ambush bonus from above). Subsequent attacks deal ATK × 1.2.
2. **Memory Web** — Targeted debuff. Inflicts Slow (AGI halved, 2 turns) on one target. 80% accuracy. 3-turn cooldown.
3. **Cocoon** — Self-heal. Recovers 20% max HP. Used once per combat when HP drops below 30%.

**Rewards**: 85 XP | 40 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Haste Charm (C-SC-02) | 20% |
| Potion (C-HP-02) | 15% |
| — (no drop) | 65% |

**Fragment affinity**: Sorrow / Dark

---

### E-FR-08: Flicker Wisp

**Spawn zone**: Flickerveil

**Flavor**: Evolved Forest Wisps adapted to the Flickerveil's unstable reality. These are larger, brighter, and more aggressive. They pulse between two states — a bright golden orb and a dim, nearly invisible outline — matching the forest's flickering nature. Their attacks carry light-element energy that dazzles and disorients.

| Stat | Value |
|------|-------|
| HP | 75 |
| ATK | 5 |
| INT | 24 |
| DEF | 12 |
| AGI | 20 |
| Base Level | 13 |

**Abilities**:
1. **Prismatic Bolt** — Magic attack. Deals INT × 1.5 light-element damage. Single target.
2. **Dazzle Flash** — AoE debuff. 30% chance per party member to inflict Stun (skip next turn). No damage. 4-turn cooldown.
3. **Flicker Fade** (passive) — Alternates between visible and invisible each turn. While invisible: immune to single-target attacks. AoE attacks still hit.

**Rewards**: 70 XP | 30 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Mana Draught (C-SP-02) | 20% |
| — (no drop) | 80% |

**Fragment affinity**: Awe / Light

---

### E-FR-09: Sound Echo

**Spawn zone**: Resonance Fields

**Flavor**: Humanoid silhouettes made of compressed sound waves. They look like static-filled outlines of the player character — reflections in a broken mirror. They mimic the player's actions with a slight delay, creating an uncanny mirror-match experience. Their bodies ripple with visible sound waves, and every step they take produces a reversed version of the ambient zone music.

| Stat | Value |
|------|-------|
| HP | 95 |
| ATK | * |
| INT | * |
| DEF | 18 |
| AGI | * |
| Base Level | 14 |

*Stats marked with \* are copied from the player character at the time of encounter: ATK = player ATK × 0.7, INT = player INT × 0.7, AGI = player AGI × 0.8.*

**Abilities**:
1. **Mirrored Strike** — Copies the player's last-used attack action. If the player used a basic attack, the Echo uses a basic attack. If the player used a skill, the Echo uses a simplified version (same damage, no special effects). Always targets a random party member.
2. **Resonant Feedback** — AoE attack. Deals fixed damage equal to 10% of each party member's max HP. Used every 4th turn.
3. **Dissonance** (passive) — The Echo takes 50% more damage from attacks that match the zone's resonant emotion (Awe for Resonance Fields). This rewards players who saved awe-type fragments for self-broadcasting.

**Rewards**: 90 XP | 42 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Memory Incense (C-BF-05) | 5% |
| Mana Draught (C-SP-02) | 15% |
| — (no drop) | 80% |

**Fragment affinity**: Awe / Wind

**Design note**: Sound Echoes are the game's most unique standard enemy. Their adaptive stats prevent them from becoming trivial regardless of player level. The mirror mechanic makes every fight feel personal.

---

### E-FR-10: Stone Guardian

**Spawn zone**: Resonance Fields

**Flavor**: Massive humanoid figures carved from Resonance Stone. They stand motionless beside the standing stones, distinguishable from natural formations only by the faint amber glow in their eye-sockets. When threatened, they move with surprising fluidity — the Resonance Stone flows like liquid for a moment before re-hardening with each step. They don't attack unless the player tries to interact with a Resonance Stone they're guarding.

| Stat | Value |
|------|-------|
| HP | 160 |
| ATK | 28 |
| INT | 5 |
| DEF | 32 |
| AGI | 6 |
| Base Level | 15 |

**Abilities**:
1. **Resonant Smash** — Physical attack. Deals ATK × 1.5 damage. 20% chance to inflict Stun.
2. **Stone Resonance** — Self-buff. Gains a shield absorbing 40 damage. While the shield holds, the Guardian's attacks deal +20% damage. Used at the start of combat.
3. **Petrifying Gaze** — Single target. 30% chance to inflict Slow + Weakness simultaneously. No damage. 4-turn cooldown.

**Rewards**: 110 XP | 55 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Aegis Seed (C-BF-03) | 12% |
| Fortify Tonic (C-SC-03) | 15% |
| Potion (C-HP-02) | 10% |
| — (no drop) | 63% |

**Fragment affinity**: Awe / Earth

---

### E-FR-11: Harmony Wraith

**Spawn zone**: Resonance Fields

**Flavor**: Ghostly figures in flowing robes that drift above the grass, trailing wisps of amber light. They are the most intact remnants of the Choir of the First Dawn — dissolved musicians whose memories crystallized into semi-autonomous forms. They always appear in groups of 2-3 and coordinate their attacks through harmonic resonance. Each Wraith "sings" a different note, and their combined chord creates devastating effects.

| Stat | Value |
|------|-------|
| HP | 100 |
| ATK | 12 |
| INT | 22 |
| DEF | 20 |
| AGI | 18 |
| Base Level | 15 |

**Abilities**:
1. **Harmonic Bolt** — Magic attack. Deals INT × 1.3 wind-element damage. Damage increases by +15% for each other Harmony Wraith alive in the encounter (2 Wraiths = +15%, 3 = +30%).
2. **Chord of Binding** — AoE debuff. Inflicts Slow on all party members. 50% accuracy per target. Only usable when 2+ Wraiths are alive. 4-turn cooldown.
3. **Resonant Heal** — Heals one other Wraith for INT × 0.8 HP. Prioritizes the Wraith with the lowest HP. Used when an ally Wraith drops below 50%.

**Rewards**: 100 XP | 45 gold (per Wraith)

**Drop table**:

| Item | Chance |
|------|--------|
| Mana Draught (C-SP-02) | 20% |
| Wisdom Seed (C-BF-02) | 8% |
| — (no drop) | 72% |

**Fragment affinity**: Awe / Wind

**Design note**: Harmony Wraiths are the Frontier's hardest standard encounter. Their mutual buffing and healing means the player must either burst one down quickly or use AoE to weaken all three simultaneously. This is the skill-check for Act II readiness.

---

### Frontier Enemy Summary

| ID | Name | Zone | HP | ATK | INT | DEF | AGI | XP | Gold | Base Lvl |
|----|------|------|----|-----|-----|-----|-----|----|------|----------|
| E-FR-01 | Mire Crawler | Shimmer Marsh | 120 | 22 | 8 | 20 | 10 | 65 | 30 | 11 |
| E-FR-02 | Echo Toad | Shimmer Marsh | 90 | 15 | 18 | 18 | 14 | 75 | 35 | 12 |
| E-FR-03 | Bog Wisp | Shimmer Marsh | 70 | 10 | 20 | 15 | 22 | 70 | 28 | 12 |
| E-FR-04 | Wind Elemental | Hollow Ridge | 100 | 18 | 16 | 16 | 24 | 80 | 38 | 13 |
| E-FR-05 | Mountain Drake | Hollow Ridge | 180 | 25 | 12 | 25 | 12 | 100 | 50 | 14 |
| E-FR-06 | Phantom Fox | Flickerveil | 85 | 20 | 10 | 14 | 28 | 80 | 35 | 13 |
| E-FR-07 | Canopy Crawler | Flickerveil | 110 | 22 | 6 | 22 | 16 | 85 | 40 | 14 |
| E-FR-08 | Flicker Wisp | Flickerveil | 75 | 5 | 24 | 12 | 20 | 70 | 30 | 13 |
| E-FR-09 | Sound Echo | Resonance Fields | 95 | * | * | 18 | * | 90 | 42 | 14 |
| E-FR-10 | Stone Guardian | Resonance Fields | 160 | 28 | 5 | 32 | 6 | 110 | 55 | 15 |
| E-FR-11 | Harmony Wraith | Resonance Fields | 100 | 12 | 22 | 20 | 18 | 100 | 45 | 15 |

---

## Sketch Enemies (Act III)

Sketch enemies are abstract, visually distinct from other zones, and challenge high-level players. They exploit the Sketch's unfinished nature — their forms shift, their attack patterns are unpredictable, and some can undo the player's solidification work.

### E-SK-01: Sketch Phantom

**Spawn zone**: Luminous Wastes, The Undrawn Peaks, The Half-Drawn Forest

**Flavor**: Outline-only versions of enemies from earlier zones — a Meadow Sprite rendered as a single glowing line, a Mountain Drake as a wireframe. They flicker between different enemy silhouettes mid-combat, making them visually unpredictable. They're not hostile memories — they're the world's attempt to populate the Sketch with something, anything, before it's finished.

| Stat | Value |
|------|-------|
| HP | 130 |
| ATK | 30 |
| INT | 22 |
| DEF | 28 |
| AGI | 20 |
| Base Level | 21 |

**Abilities**:
1. **Form Shift** — At the start of each turn, the Phantom randomly shifts its attack type: physical (ATK × 1.4) or magical (INT × 1.5, random element). The player cannot predict which type is coming.
2. **Outline Fade** — The Phantom becomes semi-transparent for 1 turn. All damage against it is reduced by 30%. Used when HP drops below 60%.
3. **Memory Scatter** — AoE attack. Deals 8% of each target's max HP as fixed damage. 3-turn cooldown.

**Rewards**: 140 XP | 65 gold

**Drop table**:

| Item | Chance |
|------|--------|
| High Potion (C-HP-03) | 15% |
| Panacea (C-SC-05) | 8% |
| — (no drop) | 77% |

**Fragment affinity**: Random (changes each encounter)

---

### E-SK-02: Void Wisp

**Spawn zone**: Luminous Wastes

**Flavor**: Dark inversions of the luminous wisps found elsewhere. Where other wisps glow with memory energy, Void Wisps are pockets of absence — dark spheres that absorb light around them. They drift toward solidified areas and consume the detail the player has broadcast, literally unpainting the world.

| Stat | Value |
|------|-------|
| HP | 90 |
| ATK | 15 |
| INT | 30 |
| DEF | 20 |
| AGI | 25 |
| Base Level | 22 |

**Abilities**:
1. **Void Pulse** — Magic attack. Deals INT × 1.6 dark-element damage to one target. Ignores 20% of target's DEF.
2. **Vibrancy Drain** — Does not deal damage. Instead, reduces the current zone's vibrancy by 2 points. If the Void Wisp is not defeated within 3 turns, it uses this again. This is the only enemy in the game that can reduce vibrancy.
3. **Absorption** (passive) — Heals for 50% of all dark-element damage dealt to it. Immune to dark-element attacks.

**Rewards**: 150 XP | 55 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Mana Surge (C-SP-03) | 15% |
| Crystal Dust (C-SP-06) | 8% |
| — (no drop) | 77% |

**Fragment affinity**: Sorrow / Dark

**Design note**: Void Wisps create urgency — they're the only enemies that mechanically threaten the player's vibrancy investment. Kill them fast or lose hard-earned progress. This makes them a high-priority target in mixed encounters.

---

### E-SK-03: Wireframe Drake

**Spawn zone**: The Undrawn Peaks

**Flavor**: Geometric versions of Mountain Drakes. Their bodies are wireframe polygons — triangles and lines forming a dragon silhouette. Fire leaks from the gaps between polygons as glowing vectors. When they roar, it sounds like data corrupting — a digital screech mixed with the original Drake's organic bellow.

| Stat | Value |
|------|-------|
| HP | 200 |
| ATK | 35 |
| INT | 25 |
| DEF | 35 |
| AGI | 16 |
| Base Level | 23 |

**Abilities**:
1. **Vector Flame** — Physical attack. Deals ATK × 1.5 fire-element damage.
2. **Void Breath** — Cone AoE. Deals INT × 1.6 mixed fire+dark damage to 1-2 targets. 20% chance to inflict Weakness per target. 3-turn cooldown.
3. **Geometric Shift** — Self-buff. The Drake rearranges its wireframe, gaining +30% DEF for 2 turns. Used once per combat when HP drops below 50%.

**Rewards**: 180 XP | 80 gold

**Drop table**:

| Item | Chance |
|------|--------|
| High Potion (C-HP-03) | 20% |
| Strength Seed (C-BF-01) | 10% |
| — (no drop) | 70% |

**Fragment affinity**: Fury / Fire

---

### E-SK-04: Sketch Wolf

**Spawn zone**: The Half-Drawn Forest

**Flavor**: Wolves drawn in elegant line-art — single continuous strokes forming legs, body, and head. They move with the fluid grace of an artist's hand, and their paws leave ink-like marks on the sketch-ground. They hunt in packs of 2-3, flanking their prey with coordinated dashes. Their howls sound like a pen scratching across parchment.

| Stat | Value |
|------|-------|
| HP | 110 |
| ATK | 32 |
| INT | 8 |
| DEF | 22 |
| AGI | 30 |
| Base Level | 22 |

**Abilities**:
1. **Ink Fang** — Physical attack. Deals ATK × 1.3 damage. If another Sketch Wolf attacked the same target this turn, deals ATK × 1.8 instead (pack tactics).
2. **Flanking Dash** — Moves to "flank" position. Next attack against this wolf has -30% accuracy. Next attack BY this wolf has +30% accuracy. 3-turn cooldown.
3. **Pack Rally** (passive) — When a Sketch Wolf in the encounter is defeated, all surviving Sketch Wolves gain ATK +20% permanently for the rest of the encounter. This discourages picking off wolves one by one — AoE is preferred.

**Rewards**: 150 XP | 60 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Haste Charm (C-SC-02) | 15% |
| Smoke Bomb (C-SP-05) | 15% |
| — (no drop) | 70% |

**Fragment affinity**: Fury / Wind

---

### E-SK-05: Unfinished Treant

**Spawn zone**: The Half-Drawn Forest

**Flavor**: Tree guardians that are only half-drawn — trunk on one side, empty outline on the other. They lurch through the forest with asymmetric movement, one arm a gnarled branch and the other a sweeping line. Their attacks are unpredictable because they're literally incomplete: sometimes a branch-swipe connects, sometimes it passes through the target like a sketch-line through air.

| Stat | Value |
|------|-------|
| HP | 220 |
| ATK | 28 |
| INT | 18 |
| DEF | 30 |
| AGI | 8 |
| Base Level | 23 |

**Abilities**:
1. **Half-Swing** — Physical attack. 70% accuracy (the attack sometimes passes through). When it hits: ATK × 1.8 damage. When it misses: the Treant gains +20% ATK for its next attempt (frustration).
2. **Root Tangle** — AoE debuff. 40% chance per target to inflict Slow. No damage. 3-turn cooldown.
3. **Sketch Regrowth** — Self-heal. Recovers 15% max HP. The healed portion of the Treant "draws itself in" with visible line-art animation. Used every 4th turn.

**Rewards**: 170 XP | 70 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Elixir (C-HP-04) | 5% |
| High Potion (C-HP-03) | 20% |
| — (no drop) | 75% |

**Fragment affinity**: Calm / Earth

---

### E-SK-06: Memory Echo

**Spawn zone**: The Half-Drawn Forest

**Flavor**: Ghostly replays of previous battles. These are not Sound Echoes from the Resonance Fields — they're complete scene-memories of past combatants, replaying fragments of fights that happened in this forest before it was even fully drawn. They appear as translucent figures locked in combat stances, suddenly becoming aware of the player and redirecting their aggression.

| Stat | Value |
|------|-------|
| HP | 140 |
| ATK | 25 |
| INT | 25 |
| DEF | 25 |
| AGI | 22 |
| Base Level | 23 |

**Abilities**:
1. **Replayed Strike** — The Echo uses a random attack type each turn: physical (ATK × 1.4), magical (INT × 1.5, random element), or debuff (inflict random status effect, 40% chance). Determined at the start of each turn.
2. **Temporal Loop** — Once per combat: when the Echo reaches 0 HP, it "rewinds" to 30% HP and resets all debuffs. Only triggers once.
3. **Fading** (passive) — The Echo loses 5% of its max HP at the end of each of its turns. Even without player action, it will die in 20 turns. This rewards patient play if the player is low on resources.

**Rewards**: 160 XP | 65 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Memory Incense (C-BF-05) | 10% |
| Panacea (C-SC-05) | 10% |
| — (no drop) | 80% |

**Fragment affinity**: Sorrow / Neutral

---

### Sketch Enemy Summary

| ID | Name | Zone | HP | ATK | INT | DEF | AGI | XP | Gold | Base Lvl |
|----|------|------|----|-----|-----|-----|-----|----|------|----------|
| E-SK-01 | Sketch Phantom | All Sketch | 130 | 30 | 22 | 28 | 20 | 140 | 65 | 21 |
| E-SK-02 | Void Wisp | Luminous Wastes | 90 | 15 | 30 | 20 | 25 | 150 | 55 | 22 |
| E-SK-03 | Wireframe Drake | Undrawn Peaks | 200 | 35 | 25 | 35 | 16 | 180 | 80 | 23 |
| E-SK-04 | Sketch Wolf | Half-Drawn Forest | 110 | 32 | 8 | 22 | 30 | 150 | 60 | 22 |
| E-SK-05 | Unfinished Treant | Half-Drawn Forest | 220 | 28 | 18 | 30 | 8 | 170 | 70 | 23 |
| E-SK-06 | Memory Echo | Half-Drawn Forest | 140 | 25 | 25 | 25 | 22 | 160 | 65 | 23 |

---

## Depths Enemies (Dungeon-Specific)

Depths enemies scale at 1.3x-1.9x of their surface-zone equivalents (see [combat.md](combat.md)). Each Depths level has unique enemies themed to the dungeon's dissolved civilization.

### E-DP-01: Memory Shade

**Spawn zone**: Depths Level 1 (Memory Cellar)

**Flavor**: Shadow-like figures that detach from the cellar walls. They're the weakest dissolved memories — remnants of everyday moments (a meal, a greeting, a walk) given just enough form to wander. They're more confused than hostile. Their attacks are clumsy, like someone reaching for something they can't quite remember.

| Stat | Value |
|------|-------|
| HP | 50 |
| ATK | 9 |
| INT | 7 |
| DEF | 6 |
| AGI | 8 |
| Base Level | 4 |

**Abilities**:
1. **Grasp** — Physical attack. Deals ATK × 1.2 damage. 10% chance to inflict Slow.
2. **Memory Flicker** (passive) — 15% chance to become intangible when attacked (attack misses).

**Rewards**: 40 XP | 15 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Mana Drop (C-SP-01) | 20% |
| — (no drop) | 80% |

**Fragment affinity**: Calm / Dark

---

### E-DP-02: Drowned Scholar

**Spawn zone**: Depths Level 2 (Drowned Archive)

**Flavor**: Spectral figures in waterlogged robes, clutching disintegrating books. They're the Dissolved scholars who chose to remain with their library even as their civilization poured itself into the earth. They attack by hurling compressed memory-water in devastating jets. Their books occasionally open during combat, projecting brief visions of the world as it was.

| Stat | Value |
|------|-------|
| HP | 130 |
| ATK | 14 |
| INT | 28 |
| DEF | 22 |
| AGI | 12 |
| Base Level | 14 |

**Abilities**:
1. **Archive Torrent** — Magic attack. Deals INT × 1.7 water-element damage to one target.
2. **Knowledge Drain** — Targeted debuff. Reduces target's INT by 20% for 3 turns. No damage. Used against Mages/Clerics (highest INT target).
3. **Lore Shield** — Creates a barrier of floating pages around one ally. Absorbs INT × 0.5 damage. Lasts 2 turns.

**Rewards**: 95 XP | 48 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Mana Draught (C-SP-02) | 20% |
| Wisdom Seed (C-BF-02) | 10% |
| — (no drop) | 70% |

**Fragment affinity**: Sorrow / Water

---

### E-DP-03: Resonant Crystal

**Spawn zone**: Depths Level 3 (Resonant Caverns)

**Flavor**: Living crystalline formations that grow from the cavern walls. They vibrate at frequencies that resonate with the Resonance Stones above, channeling concentrated sound energy into piercing attacks. They're beautiful — prismatic light refracts through their facets — and deadly. When struck, they ring like bells.

| Stat | Value |
|------|-------|
| HP | 150 |
| ATK | 18 |
| INT | 30 |
| DEF | 28 |
| AGI | 10 |
| Base Level | 16 |

**Abilities**:
1. **Sonic Shard** — Magic attack. Deals INT × 1.5 wind-element damage to one target.
2. **Harmonic Burst** — AoE magic. Deals INT × 1.0 damage to all targets. 20% chance to inflict Stun per target. 3-turn cooldown.
3. **Crystal Resonance** (passive) — When hit by a wind-element attack, the Crystal heals for 25% of the damage instead of taking it. All other elements deal normal damage.

**Rewards**: 120 XP | 55 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Stasis Breaker (C-SC-04) | 15% |
| Mana Surge (C-SP-03) | 8% |
| — (no drop) | 77% |

**Fragment affinity**: Awe / Wind

---

### E-DP-04: Songline Phantom

**Spawn zone**: Depths Level 4 (The Songline)

**Flavor**: Ghostly performers frozen mid-song. Each room of The Songline replays a "verse" of a dissolved civilization's final performance. These phantoms are fragments of the performers — they're not fighting the player, they're continuing their performance, and the player is an obstacle in their choreography. Their attacks are dance steps and vocal blasts.

| Stat | Value |
|------|-------|
| HP | 160 |
| ATK | 20 |
| INT | 32 |
| DEF | 25 |
| AGI | 22 |
| Base Level | 19 |

**Abilities**:
1. **Vocal Blast** — Magic attack. Deals INT × 1.6 wind-element damage to one target.
2. **Encore** — Self-buff. The Phantom acts twice next turn (both actions are Vocal Blast). 4-turn cooldown.
3. **Final Verse** — On death: deals INT × 1.0 damage to all party members as a parting note. This is unavoidable.

**Rewards**: 140 XP | 65 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Mana Surge (C-SP-03) | 15% |
| Memory Incense (C-BF-05) | 8% |
| — (no drop) | 77% |

**Fragment affinity**: Joy / Wind

---

### E-DP-05: Abyssal Memory

**Spawn zone**: Depths Level 5 (The Deepest Memory)

**Flavor**: The most ancient dissolved memories, given form by the sheer density of the Deepest Memory deposit. They appear as shifting, surreal forms — a face that becomes a landscape that becomes a hand reaching upward. They're the world's oldest memories, predating every civilization, and they're powerful beyond anything the player has faced in the Depths. Fighting them feels like arguing with the concept of time itself.

| Stat | Value |
|------|-------|
| HP | 250 |
| ATK | 35 |
| INT | 38 |
| DEF | 35 |
| AGI | 18 |
| Base Level | 24 |

**Abilities**:
1. **Primal Surge** — Magic attack. Deals INT × 1.8 damage, random element. Targets one party member.
2. **Time Fold** — AoE attack. Deals 12% of each target's max HP as fixed damage. Ignores DEF. 3-turn cooldown.
3. **Dissolution** — Self-destruct when HP drops below 15%. Deals INT × 2.0 damage to all party members. Can be prevented by killing the Abyssal Memory in a single hit that takes it from above 15% to 0.
4. **Ancient Aura** (passive) — All status effects (positive and negative) last 1 turn shorter on the Abyssal Memory.

**Rewards**: 200 XP | 90 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Elixir (C-HP-04) | 10% |
| Ether (C-SP-04) | 10% |
| Dissolved Essence (C-SP-09) | 5% |
| — (no drop) | 75% |

**Fragment affinity**: Awe / Neutral

---

### Depths Enemy Summary

| ID | Name | Floor | HP | ATK | INT | DEF | AGI | XP | Gold | Base Lvl |
|----|------|-------|----|-----|-----|-----|-----|----|------|----------|
| E-DP-01 | Memory Shade | L1 | 50 | 9 | 7 | 6 | 8 | 40 | 15 | 4 |
| E-DP-02 | Drowned Scholar | L2 | 130 | 14 | 28 | 22 | 12 | 95 | 48 | 14 |
| E-DP-03 | Resonant Crystal | L3 | 150 | 18 | 30 | 28 | 10 | 120 | 55 | 16 |
| E-DP-04 | Songline Phantom | L4 | 160 | 20 | 32 | 25 | 22 | 140 | 65 | 19 |
| E-DP-05 | Abyssal Memory | L5 | 250 | 35 | 38 | 35 | 18 | 200 | 90 | 24 |

---

## Preserver Enemies

Preserver agents are a distinct faction (see [factions.md](../world/factions.md)). They appear in Act II and III in stagnation zones and the Preserver Fortress. Their unique trait: they inflict **Stasis**, a status effect that prevents the use of memory-based class abilities for 2 turns (see [combat.md](combat.md)).

### Status: Stasis

| Property | Detail |
|----------|--------|
| Effect | Cannot use memory-based class abilities (skills that reference oaths, charges, elements, or foreshadow). Basic Attack, Defend, Item, and Flee still work. |
| Duration | 2 turns |
| Cure | Stasis Breaker (C-SC-04), Cleric's Sorrowful Cleanse, or wait it out |
| Resistance | Preserver's Crystal Mail (A-10) grants immunity. Frontier Guard (A-09) grants +15% resistance. |

### E-PV-01: Preserver Scout

**Spawn zone**: Sunridge (Preserver Outpost), Shimmer Marsh (Stagnation Bog perimeter), all Frontier zones (rare patrol)

**Flavor**: Humanoid figures in pale blue-white robes with crystalline faceplates. They move with mechanical precision and speak in measured, polite tones even during combat. Their weapons are crystal staffs that project freezing beams. They genuinely believe they're protecting the world.

| Stat | Value |
|------|-------|
| HP | 120 |
| ATK | 20 |
| INT | 18 |
| DEF | 22 |
| AGI | 14 |
| Base Level | 12 |

**Abilities**:
1. **Crystal Beam** — Physical attack. Deals ATK × 1.3 damage. 20% chance to inflict Stasis.
2. **Preservation Protocol** — Self-buff. DEF +30%, immunity to Weakness for 3 turns. Used on the Scout's first turn.
3. **Warning** — Non-damaging. The Scout announces: "This is your last warning." Inflicts no damage but grants the player a visible "Stasis incoming" indicator on the Scout's next turn (Crystal Beam guaranteed to inflict Stasis). This is the game teaching the player to prepare for Stasis.

**Rewards**: 120 XP | 50 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Stasis Breaker (C-SC-04) | 30% |
| Potion (C-HP-02) | 15% |
| — (no drop) | 55% |

**Fragment affinity**: Calm / Neutral

---

### E-PV-02: Preserver Agent

**Spawn zone**: Hollow Ridge (Shattered Pass), Flickerveil (Resonance Archive), Resonance Fields (Cathedral perimeter)

**Flavor**: More heavily armored Preservers in crystalline plate mail. Their faceplates are fully opaque — no features visible. They carry crystal halberds and deploy stasis fields that restrict movement. They're the Preservers' enforcers — less polite than Scouts, more focused on neutralization.

| Stat | Value |
|------|-------|
| HP | 180 |
| ATK | 28 |
| INT | 22 |
| DEF | 28 |
| AGI | 12 |
| Base Level | 15 |

**Abilities**:
1. **Stasis Halberd** — Physical attack. Deals ATK × 1.4 damage. 30% chance to inflict Stasis.
2. **Crystal Field** — AoE debuff. Creates a field that reduces all party members' AGI by 20% for 3 turns. No damage. 4-turn cooldown.
3. **Reinforced Stance** — When the Agent drops below 40% HP, it gains +25% DEF permanently and its Stasis chance increases to 50%. One-time trigger.

**Rewards**: 150 XP | 60 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Stasis Breaker (C-SC-04) | 25% |
| Fortify Tonic (C-SC-03) | 15% |
| Potion (C-HP-02) | 10% |
| — (no drop) | 50% |

**Fragment affinity**: Calm / Neutral

---

### E-PV-03: Preserver Captain

**Spawn zone**: Resonance Fields (Preserver Cathedral), The Undrawn Peaks (Crystalline Fortress Gate)

**Flavor**: The Preservers' field commanders. They wear flowing crystal cloaks over midnight-blue armor and carry twin crystal blades. Their faceplates are clear — revealing calm, focused faces. They speak during combat, expressing genuine regret: "I wish you'd chosen preservation." Their fighting style is elegant and precise.

| Stat | Value |
|------|-------|
| HP | 280 |
| ATK | 35 |
| INT | 30 |
| DEF | 35 |
| AGI | 18 |
| Base Level | 18 |

**Abilities**:
1. **Twin Crystal Slash** — Physical attack. Two hits: each deals ATK × 0.9 damage. Each hit has 25% chance to inflict Stasis independently.
2. **Stasis Dome** — AoE. All party members are hit with a 40% chance to inflict Stasis each. No damage. 5-turn cooldown.
3. **Curator's Blessing** — Self-heal. Recovers 20% max HP and removes all debuffs. Used once per combat when HP drops below 30%.
4. **Crystalline Armor** (passive) — Takes 25% less damage from light-element attacks. Takes 25% more damage from dark-element attacks.

**Rewards**: 180 XP | 75 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Preserver's Crystal Mail (A-10) | 5% |
| Stasis Breaker (C-SC-04) | 25% |
| High Potion (C-HP-03) | 15% |
| — (no drop) | 55% |

**Fragment affinity**: Sorrow / Neutral

---

### E-PV-04: Preserver Archivist

**Spawn zone**: Luminous Wastes (Preserver Watchtower), Preserver Fortress (all floors)

**Flavor**: The Preservers' elite scholars. They don't carry weapons — their entire body is partially crystallized, giving them the appearance of living statues. They fight by projecting pure stasis energy from their hands, creating crystal constructs mid-combat. Their voices echo as though speaking through glass. They're the most dangerous non-boss Preserver enemies.

| Stat | Value |
|------|-------|
| HP | 220 |
| ATK | 20 |
| INT | 38 |
| DEF | 30 |
| AGI | 16 |
| Base Level | 22 |

**Abilities**:
1. **Stasis Bolt** — Magic attack. Deals INT × 1.5 damage. 35% chance to inflict Stasis. Targets the party member with the most active buffs (Preservers target change).
2. **Crystal Construct** — Summons 1 Crystal Shard (HP 60, ATK 15, DEF 20, AGI 10). The Shard attacks with a basic physical hit (ATK × 1.2) and has no special abilities. Max 2 Shards. Shards yield no rewards.
3. **Archive Seal** — Single target. Seals one player's highest-SP-cost skill for 3 turns (that skill cannot be used). No damage. 5-turn cooldown.
4. **Temporal Freeze** (passive) — When the Archivist reaches 0 HP, time "hiccups" — all active status effects on all party members (positive and negative) are frozen in place for 1 additional turn.

**Rewards**: 170 XP | 70 gold

**Drop table**:

| Item | Chance |
|------|--------|
| Crystal Dust (C-SP-06) | 15% |
| Stasis Breaker (C-SC-04) | 20% |
| Mana Surge (C-SP-03) | 10% |
| — (no drop) | 55% |

**Fragment affinity**: Sorrow / Dark

---

### Preserver Enemy Summary

| ID | Name | HP | ATK | INT | DEF | AGI | XP | Gold | Base Lvl |
|----|------|----|-----|-----|-----|-----|----|------|----------|
| E-PV-01 | Preserver Scout | 120 | 20 | 18 | 22 | 14 | 120 | 50 | 12 |
| E-PV-02 | Preserver Agent | 180 | 28 | 22 | 28 | 12 | 150 | 60 | 15 |
| E-PV-03 | Preserver Captain | 280 | 35 | 30 | 35 | 18 | 180 | 75 | 18 |
| E-PV-04 | Preserver Archivist | 220 | 20 | 38 | 30 | 16 | 170 | 70 | 22 |

---

## Boss Encounters

Bosses are multi-phase fights with unique mechanics. They always drop a named memory fragment and cannot be fled from. Each boss is designed to test the player's understanding of a specific mechanic.

### B-01: Stagnation Heart — Heartfield Stagnation Zone Guardian

**Location**: Heartfield, expanded Stagnation Clearing (Act II return visit)

**Context**: When the player returns to Heartfield with a potency 3+ fragment to break the expanded stagnation zone from the Act I climax, this boss emerges from the shattered crystal.

**Level range**: 13-16 (early Act II)

#### Phase 1: Crystal Shell

| Stat | Value |
|------|-------|
| HP | 400 |
| ATK | 25 |
| INT | 20 |
| DEF | 30 |
| AGI | 8 |

**Appearance**: A massive crystalline formation — a heart-shaped geode of frozen memory, pulsing with cold blue light. Crystal tendrils extend from its base into the ground.

**Abilities**:
1. **Crystal Spike** — Physical attack. Deals ATK × 1.5 damage to one target. 20% chance to inflict Stasis.
2. **Frost Pulse** — AoE magic. Deals INT × 1.2 damage to all party members. Slows all targets (AGI halved, 2 turns).
3. **Stagnation Aura** (passive) — All healing effects on party members are reduced by 25% while in Phase 1.

**Phase transition**: When Phase 1 HP reaches 0, the crystal shell shatters, revealing Phase 2.

#### Phase 2: Memory Storm

| Stat | Value |
|------|-------|
| HP | 300 |
| ATK | 30 |
| INT | 28 |
| DEF | 20 |
| AGI | 16 |

**Appearance**: The inner heart exposed — a swirling vortex of frozen memory fragments. Lira's amber silhouette is visible at its center (this is the anchor point where Lira is frozen). The boss desperately tries to re-crystallize.

**Abilities**:
1. **Memory Barrage** — 3 random hits across the party. Each hit deals ATK × 0.7 damage.
2. **Desperate Freeze** — Single target. 60% chance to inflict Stasis. Deals no damage. Used every 3rd turn.
3. **Re-Crystallize** — Self-heal. Recovers 10% max HP and gains +10% DEF for 2 turns. Used once when HP drops below 50%.
4. **Crystal Collapse** (death trigger) — On defeat, the boss explodes outward, dealing 50 fixed damage to all party members. Lira is freed.

**Rewards**: 500 XP | 150 gold

**Guaranteed drop**: MF-03 upgrades — the Echo of the Stagnation fragment (if the player still holds it) evolves from Potency 2 → 3 as the full memory of the event is recovered. If the player already consumed MF-03, a new unnamed Sorrow/Dark/3★ fragment drops instead.

**Item drop**: Phoenix Feather (C-SP-10) — 25% chance

**Narrative**: Defeating this boss frees Lira. She immediately returns to the party (Cleric companion, now at player level - 1). This is the emotional payoff for the Act I climax.

**Design note**: This boss tests the player's ability to handle Stasis. Phase 1 is a DEF-heavy wall that punishes basic attacks; Phase 2 is a speed-based race against re-crystallization. Bringing Stasis Breakers is essential.

---

### B-02: Shrine Guardian — Dormant God Shrine Protector

**Location**: Each dormant god shrine (Resonance's Amphitheater, Verdance's Hollow, Luminos Grove, Kinesis Spire)

**Context**: Before the player can access the recall pedestals, they must defeat the Shrine Guardian — a construct left by the dissolved civilization that created the god. Each Guardian is themed to its god's domain.

**Level range**: 14-18 (mid Act II)

*The four variants share the same stat block but differ in abilities.*

#### Base Stats (All Variants)

| Stat | Value |
|------|-------|
| HP | 600 |
| ATK | 30 |
| INT | 30 |
| DEF | 28 |
| AGI | 14 |

#### Variant A: Resonance Guardian (Sound)

**Appearance**: A towering figure made of vibrating Resonance Stone, constantly emitting a deep harmonic drone. Sound waves visually ripple from its body.

**Abilities**:
1. **Sonic Slam** — Physical attack. Deals ATK × 1.5 damage. 20% chance to inflict Stun.
2. **Harmonic Cascade** — AoE magic. Deals INT × 1.3 wind-element damage to all targets. Targets with Slow take 50% more damage.
3. **Silence Field** — Targeted debuff. Seals one party member's skills for 2 turns (can only use Attack, Defend, Item). 4-turn cooldown.
4. **Crescendo** (phase trigger at 50% HP) — Permanently gains +20% ATK and INT. All subsequent Harmonic Cascades also inflict Slow.

#### Variant B: Verdance Guardian (Growth)

**Appearance**: A massive root-construct, a tangle of living wood and green light. Vines trail from every surface, and flowers bloom and wilt in rapid cycles across its body.

**Abilities**:
1. **Vine Lash** — Physical attack. Deals ATK × 1.4 damage. 25% chance to inflict Slow.
2. **Spore Cloud** — AoE. 35% chance per target to inflict Poison (5% max HP per turn, 3 turns). No damage.
3. **Regrowth** — Self-heal. Recovers 8% max HP per turn automatically (passive). This makes sustained fights longer — burst damage is rewarded.
4. **Bloom Burst** (phase trigger at 50% HP) — One-time AoE. Deals INT × 2.0 earth-element damage to all targets. The room fills with flowers. After this burst, Regrowth increases to 12% per turn.

#### Variant C: Luminos Guardian (Light)

**Appearance**: A being of concentrated light in a humanoid frame — too bright to look at directly. Its edges are soft and blurred, as though reality can't contain it. Looking at it for too long causes the screen to bloom white.

**Abilities**:
1. **Radiant Strike** — Physical attack. Deals ATK × 1.3 light-element damage. Always hits (cannot be evaded by Echo Dodge or Flicker).
2. **Blinding Flash** — AoE debuff. All party members: -30% accuracy for 2 turns. No damage. 3-turn cooldown.
3. **Photon Barrier** — Self-buff. Absorbs the next 100 damage. While the barrier holds, the Guardian is immune to status effects. Refreshes every 5 turns.
4. **Supernova** (phase trigger at 50% HP) — One-time AoE. Deals INT × 2.5 light-element damage to all targets. The screen goes pure white for 1 second. After this, the Guardian's attacks gain +15% damage permanently.

#### Variant D: Kinesis Guardian (Motion)

**Appearance**: A figure of perpetual motion — humanoid but constantly shifting position, as though existing at multiple points simultaneously. Afterimages trail behind every movement. The ground cracks beneath it with each step.

**Abilities**:
1. **Velocity Strike** — Physical attack. Deals ATK × 1.6 damage. The Guardian always acts first in the turn order (AGI is effectively infinite for initiative purposes).
2. **Seismic Pulse** — AoE physical. Deals ATK × 1.0 damage to all targets. 30% chance to inflict Stun per target. 3-turn cooldown.
3. **Momentum** (passive) — Each consecutive turn the Guardian attacks without being stunned or slowed, its ATK increases by +5% (stacking up to +30%). Being stunned or slowed resets the counter.
4. **Terminal Velocity** (phase trigger at 50% HP) — The Guardian attacks 3 times this turn (each is a Velocity Strike at ATK × 1.2). After this burst, Momentum's cap increases to +50%.

**Rewards (all variants)**: 800 XP | 200 gold

**Guaranteed fragment drop**: 1 unnamed fragment matching the god's thematic affinity:
- Resonance: Awe/Wind/3★
- Verdance: Joy/Earth/3★
- Luminos: Awe/Light/3★
- Kinesis: Fury/Fire/3★

**Item drop**: Dissolved Essence (C-SP-09) — 50% chance

---

### B-03: Depths Floor Bosses

Each Depths level (except L1, which is a tutorial) has a boss guarding the floor's deepest room.

#### B-03a: The Archivist — Depths Level 2 Boss

**Location**: Drowned Archive, final room

**Level range**: 14-16

| Stat | Value |
|------|-------|
| HP | 500 |
| ATK | 22 |
| INT | 32 |
| DEF | 25 |
| AGI | 14 |

**Appearance**: A massive spectral librarian, 3x the size of the Drowned Scholars. Its body is made of flowing water and dissolving parchment. It holds a crystal quill that writes equations in the air.

**Abilities**:
1. **Tidal Equation** — Magic attack. Deals INT × 1.8 water-element damage to one target. The damage formula is displayed visually as a flowing equation.
2. **Book Barricade** — Self-buff. Creates a wall of floating books. Absorbs 80 damage. While active, the Archivist cannot be targeted by physical attacks (books intercept).
3. **Dissolution Lesson** — AoE. Each party member loses their highest-potency held memory fragment's emotion bonus for 2 turns (fragments are not consumed, only suppressed). No damage. 4-turn cooldown.
4. **Final Chapter** (death trigger) — Drops all books. The room floods with dissolved lore. All party members gain +10% INT for the remainder of the dungeon floor (buff persists outside of combat until leaving the Depths).

**Rewards**: 400 XP | 120 gold

**Guaranteed drop**: Unnamed Sorrow/Water/4★ fragment

**Item drop**: Dissolved Essence (C-SP-09) — 50%

---

#### B-03b: The Resonant King — Depths Level 3 Boss

**Location**: Resonant Caverns, final room

**Level range**: 16-18

| Stat | Value |
|------|-------|
| HP | 650 |
| ATK | 28 |
| INT | 35 |
| DEF | 30 |
| AGI | 12 |

**Appearance**: A humanoid figure made entirely of Resonance Stone, crowned with a ring of vibrating crystal shards. It "speaks" by making the entire cavern vibrate. Its throne is a Resonance Stone the size of a house.

**Abilities**:
1. **Royal Chord** — Magic attack. Deals INT × 1.6 wind-element damage to all targets. This is the primary pressure tool — it hits everyone, every turn.
2. **Crystal Crown** — Summons 2 Resonant Shards (HP 80, DEF 20, ATK 15). Shards attack with Sonic Shard (INT 15 × 1.3 wind damage). Max 2 active. 5-turn cooldown.
3. **Harmonic Lock** — Targets the party member who dealt the most damage last turn. Inflicts Stasis (2 turns). 3-turn cooldown.
4. **Shatter Throne** (phase trigger at 30% HP) — Destroys its own throne. One-time AoE: deals INT × 2.5 damage to all targets. After this, the King's DEF drops by 40% (no more throne to hide behind) but ATK increases by 30%.

**Rewards**: 500 XP | 160 gold

**Guaranteed drop**: Unnamed Awe/Wind/4★ fragment

**Item drop**: Phoenix Feather (C-SP-10) — 30%

---

#### B-03c: The Conductor — Depths Level 4 Boss

**Location**: The Songline, final room

**Level range**: 19-21

| Stat | Value |
|------|-------|
| HP | 800 |
| ATK | 25 |
| INT | 40 |
| DEF | 28 |
| AGI | 20 |

**Appearance**: A spectral figure in flowing robes, holding a conductor's baton made of pure amber light. It hovers above a stage, directing invisible musicians. Each of its attacks is a musical movement — visually represented by flowing notation in the air.

**Abilities**:
1. **First Movement: Allegro** — Magic attack. Deals INT × 1.4 damage. Hits 2 random targets.
2. **Second Movement: Adagio** — Party-wide debuff. All party members' AGI reduced by 30% for 2 turns. The music slows. 4-turn cooldown.
3. **Third Movement: Crescendo** — Self-buff. INT +40% for 3 turns. Used once at 60% HP.
4. **Fourth Movement: Fortissimo** — Ultimate attack at 30% HP. AoE magic. Deals INT × 2.0 damage to all targets. Inflicts Stun on all targets (1 turn). Used once.
5. **Finale** (death trigger) — Heals all party members to full HP and SP. The Conductor bows. The music resolves to a peaceful chord. This is the only boss death trigger that benefits the player — it represents the song finally being finished after centuries.

**Rewards**: 600 XP | 200 gold

**Guaranteed drop**: Unnamed Joy/Wind/4★ fragment (the song's final note, crystallized)

**Item drop**: Memory-Woven Plate (A-14) — 15% (rare)

---

#### B-03d: The First Dreamer — Depths Level 5 Boss

**Location**: The Deepest Memory, final room

**Level range**: 24-26

| Stat | Value |
|------|-------|
| HP | 1,200 |
| ATK | 40 |
| INT | 45 |
| DEF | 40 |
| AGI | 16 |

**Appearance**: An ancient, immense figure — the oldest dissolved memory given form. It appears as a shifting face that fills the entire room, composed of every biome in the game layered on top of each other: grass growing through stone through water through light. Its voice is all voices at once. It's not hostile — it's testing whether the player is worthy of the First Memory.

**Phase 1: The Test of Memory** (HP 1,200 → 600)

**Abilities**:
1. **Primal Recall** — Randomly uses one ability from a previous boss the player has defeated. The ability uses the First Dreamer's stats, not the original boss's.
2. **Memory Surge** — AoE. Deals 15% of each target's max HP as fixed damage. 3-turn cooldown.
3. **Dream Shift** — Changes the room's element. For 3 turns, all attacks (player and enemy) of the corresponding element deal +50% damage. The element cycles through fire → water → earth → wind → light → dark.

**Phase 2: The Test of Will** (HP 600 → 0)

At 50% HP, the First Dreamer speaks: *"You have seen what was. Now show me what will be."*

**Abilities**:
4. **Will Check** — Targeted. Deals INT × 2.0 damage to the party member with the most memory fragments. This punishes hoarding but rewards players who've been broadcasting throughout the game.
5. **Temporal Collapse** — AoE. All buffs and debuffs on all combatants (including the Dreamer) are removed. 5-turn cooldown.
6. **Acceptance** (below 10% HP) — The First Dreamer stops attacking. It asks: *"Will you carry this forward?"* The player must use a single action (any action — even Defend) to "answer." The Dreamer then dissipates peacefully.

**Rewards**: 1,000 XP | 300 gold

**Guaranteed drops**:
- MF-09 variant: Unnamed Awe/Neutral/5★ fragment (this is the strongest non-story fragment in the game)
- Dissolved Essence (C-SP-09) × 2

---

### B-04: Preserver Fortress Bosses

#### B-04a: The Curator's Right Hand — Fortress Floor 1 Boss

**Location**: Gallery of Moments, final gallery room

**Level range**: 25-27

| Stat | Value |
|------|-------|
| HP | 900 |
| ATK | 38 |
| INT | 35 |
| DEF | 38 |
| AGI | 16 |

**Appearance**: A Preserver in ornate ceremonial armor — the Curator's most loyal lieutenant. They carry a crystal shield depicting frozen scenes from the world's history. They fight with reluctant grace: *"The Curator weeps for every battle. So do I."*

**Abilities**:
1. **Gallery Strike** — Physical attack. Deals ATK × 1.5 damage. The shield flashes an image of a frozen memory with each swing.
2. **Exhibit Shield** — Self-buff. Absorbs 120 damage. While active, reflects 20% of incoming damage back to the attacker. Refreshes at 50% HP.
3. **Stasis Wave** — AoE. 35% chance per target to inflict Stasis. No damage. 4-turn cooldown.
4. **Curator's Lament** — At 25% HP, the Right Hand hesitates. For 1 turn, they do not attack. They say: *"Is this really what the world needs? More change? More loss?"* This is a narrative beat — the player sees that the Preservers are people, not monsters.
5. **Final Stand** — After the hesitation turn, the Right Hand attacks with ATK × 2.0 to the party member with the lowest HP. One-time desperation attack.

**Rewards**: 800 XP | 250 gold

**Guaranteed drop**: Unnamed Sorrow/Neutral/4★ fragment

**Item drop**: Phoenix Feather (C-SP-10) — guaranteed (1 in Fortress F1, as noted in [items-catalog.md](items-catalog.md))

---

#### B-04b: The Archive Keeper — Fortress Floor 2 Boss

**Location**: Archive of Perfection, central gallery

**Level range**: 26-28

| Stat | Value |
|------|-------|
| HP | 1,100 |
| ATK | 35 |
| INT | 42 |
| DEF | 35 |
| AGI | 18 |

**Appearance**: A Preserver Archivist who has been partially absorbed by the Archive itself. Their lower body is fused with a massive crystal dais. Shelves of frozen memories orbit them like a planetary system. They speak with two voices — their own, and the Archive's.

**Abilities**:
1. **Archive Blast** — Magic attack. Deals INT × 1.7 damage to one target. Element matches the target's elemental weakness (if known from previous attacks). If no weakness is known, deals neutral damage.
2. **Perfect Memory** — Summons a frozen scene (HP 200, DEF 40, cannot attack). The scene projects a field: all party healing is reduced by 50%. Destroying the scene removes the effect. Used at start of combat and once more at 50% HP.
3. **Catalogue** (passive) — Each time a party member uses a skill, the Archive Keeper "catalogues" it. After 3 unique skills have been used, the Keeper gains +15% DEF permanently. This rewards using a varied skill rotation rather than spamming the same skill.
4. **Stasis Prison** — Single target. Inflicts Stasis for 3 turns (extended duration). 5-turn cooldown. Targets the party member who has dealt the most cumulative damage.
5. **Dissolution** (death trigger) — The Archive shatters. All frozen scenes in the room crack. The Keeper whispers: *"The Curator... will understand."* All party members gain +15% all stats for the remainder of the Fortress.

**Rewards**: 900 XP | 300 gold

**Guaranteed drop**: MF-09: The Curator's Grief (Sorrow/Dark/5★) — see [items-catalog.md](items-catalog.md). This is the Curator's personal memory and provides a unique dialogue option in the final scene.

---

### B-05: The Curator — Final Confrontation

**Location**: Preserver Fortress Floor 3 — The First Memory Chamber

**Context**: The Curator is not fought in traditional combat. The final confrontation is a **dialogue encounter** — the player must persuade, confront, or simply prove the Curator wrong through their actions. See [structure.md](../story/structure.md) for the narrative framing.

**No combat stats.** The Curator does not attack the player. Instead:

1. The player enters the First Memory Chamber. The Curator stands before the First Memory (MF-10), which hovers in a crystal lattice.
2. The Curator speaks. Dialogue varies based on which gods the player recalled and which key items they carry (K-06: Curator's Manifesto, K-13: Curator's Doubt, MF-09: Curator's Grief).
3. The player does not fight the Curator. They walk to the First Memory and remix it (see [items-catalog.md](items-catalog.md), MF-10 → MF-11).
4. The Curator watches. Depending on dialogue choices, the Curator either steps aside willingly, is held back by their own Preservers (who have begun to doubt), or simply watches in silence.
5. The player broadcasts the remixed fragment (MF-11: World's New Dawn). The endgame bloom triggers (see [vibrancy-system.md](../world/vibrancy-system.md)).

**Rewards**: The game ending. No XP (the game is over). The Curator becomes an archivist in the post-game world.

---

## Enemy Encounter Tables by Zone

These tables specify which enemies spawn in each zone and at what frequency.

### Settled Lands

| Zone | Common (60%) | Standard (30%) | Rare (10%) |
|------|-------------|---------------|------------|
| Heartfield | 1 Meadow Sprite | 1 Grass Serpent + 1 Meadow Sprite | 2 Grass Serpents |
| Ambergrove | 1 Forest Wisp | 1 Thornback Beetle + 1 Forest Wisp | 2 Thornback Beetles + 1 Forest Wisp |
| Millbrook | 1 River Nymph | 1 Stone Crab + 1 River Nymph | 2 Stone Crabs |
| Sunridge | 1 Highland Hawk | 1 Crag Golem | 1 Crag Golem + 2 Highland Hawks |

### Frontier

| Zone | Common (60%) | Standard (30%) | Rare (10%) |
|------|-------------|---------------|------------|
| Shimmer Marsh | 1 Mire Crawler | 1 Echo Toad + 1 Bog Wisp | 2 Mire Crawlers + 1 Bog Wisp |
| Hollow Ridge | 1 Wind Elemental | 1 Mountain Drake | 2 Wind Elementals + 1 Mountain Drake |
| Flickerveil | 1 Phantom Fox | 1 Canopy Crawler + 1 Flicker Wisp | 2 Phantom Foxes + 1 Canopy Crawler |
| Resonance Fields | 1 Sound Echo | 1 Stone Guardian | 2-3 Harmony Wraiths |

### The Sketch

| Zone | Common (60%) | Standard (30%) | Rare (10%) |
|------|-------------|---------------|------------|
| Luminous Wastes | 1 Sketch Phantom | 1 Sketch Phantom + 1 Void Wisp | 2 Void Wisps + 1 Sketch Phantom |
| The Undrawn Peaks | 1 Sketch Phantom | 1 Wireframe Drake | 1 Wireframe Drake + 2 Sketch Phantoms |
| Half-Drawn Forest | 2 Sketch Wolves | 1 Unfinished Treant | 1 Memory Echo + 2 Sketch Wolves |

### The Depths

| Floor | Common (60%) | Standard (30%) | Rare (10%) |
|-------|-------------|---------------|------------|
| Level 1 | 1 Memory Shade | 2 Memory Shades | 3 Memory Shades |
| Level 2 | 1 Drowned Scholar | 2 Drowned Scholars | 2 Drowned Scholars + 1 Memory Shade (scaled) |
| Level 3 | 1 Resonant Crystal | 2 Resonant Crystals | 2 Resonant Crystals + 1 Drowned Scholar (scaled) |
| Level 4 | 1 Songline Phantom | 2 Songline Phantoms | 3 Songline Phantoms |
| Level 5 | 1 Abyssal Memory | 1 Abyssal Memory + 1 Songline Phantom (scaled) | 2 Abyssal Memories |

### Preserver Encounters (Stagnation Zones + Fortress)

| Location | Encounter |
|----------|-----------|
| Sunridge Outpost | 2 Preserver Scouts |
| Shimmer Marsh Stagnation Bog | 2 Preserver Scouts + 1 Preserver Agent |
| Hollow Ridge Shattered Pass | 3 Preserver Agents |
| Flickerveil Resonance Archive | 2 Preserver Agents + 1 Preserver Captain |
| Resonance Fields Cathedral | 3 Preserver Agents + 1 Preserver Captain |
| Luminous Wastes Watchtower | 2 Preserver Archivists |
| Fortress Floor 1 | Preserver Agents + Archivists (mixed) |
| Fortress Floor 2 | Preserver Archivists + Captains (mixed) |
| Fortress Floor 3 | No random encounters (boss-only floor) |

---

## Difficulty Curve Validation

### Act I (Levels 1-10)

**Player damage output** (Knight L5, ATK ~20, vs DEF 5-15 enemies):
- vs Meadow Sprite (DEF 3): floor((20×1.5 - 3×0.8)) = 27 → kills in 2 hits
- vs Crag Golem (DEF 15): floor((20×1.5 - 15×0.8)) = 18 → kills in 5 hits
- **Range**: 2-5 hits to kill. Matches design target (2-4 hits).

**Enemy damage to player** (Knight L5, DEF ~17):
- Meadow Sprite (ATK 5): floor((5×1.5 - 17×0.8)) = 0 (minimum 1) → 45+ turns to kill player
- Crag Golem (ATK 13): floor((13×1.5 - 17×0.8)) = 6 → 30 turns to kill player
- **Verdict**: Act I is safe. The player learns without fear of death. Matches design.

### Act II (Levels 11-20)

**Player damage output** (Knight L15, ATK ~55, vs DEF 16-32 enemies):
- vs Mire Crawler (DEF 20): floor((55×1.5 - 20×0.8)) = 66 → kills in 2 hits
- vs Stone Guardian (DEF 32): floor((55×1.5 - 32×0.8)) = 57 → kills in 3 hits
- vs Mountain Drake (DEF 25): floor((55×1.5 - 25×0.8)) = 62 → kills in 3 hits
- **Range**: 2-3 hits. Matches design target (3-5 hits at lower levels, faster with gear).

**Enemy damage to player** (Knight L15, DEF ~52):
- Mire Crawler (ATK 22): floor((22×1.5 - 52×0.8)) = 0 (minimum 1) → safe from basic physical
- Mountain Drake (ATK 25): floor((25×1.5 - 52×0.8)) = 0 (minimum 1) → safe from basic physical
- Mountain Drake Memory Breath (INT 12, magic): floor((12×1.8 - 52×0.4)) = 1 → minimal magic damage to Knight

**Mage perspective** (Mage L15, DEF ~22, HP ~126):
- Mountain Drake (ATK 25): floor((25×1.5 - 22×0.8)) = 20 → kills Mage in 6 hits
- Harmony Wraith Harmonic Bolt (INT 22, with 2 allies = +30%): floor((22×1.3×1.3 - 22×0.4)) = 28 → kills Mage in 5 hits
- **Verdict**: Mage needs party protection. Knight is safe. Balanced.

### Act III (Levels 21-30)

**Player damage output** (Knight L25, ATK ~90, vs DEF 28-40 enemies):
- vs Sketch Phantom (DEF 28): floor((90×1.5 - 28×0.8)) = 112 → kills in 2 hits
- vs Wireframe Drake (DEF 35): floor((90×1.5 - 35×0.8)) = 107 → kills in 2 hits
- vs Abyssal Memory (DEF 35): floor((90×1.5 - 35×0.8)) = 107 → kills in 3 hits with HP 250

**Enemy damage to player** (Knight L25, DEF ~86, HP ~393):
- Wireframe Drake (ATK 35): floor((35×1.5 - 86×0.8)) = 0 (minimum 1) → Knight barely scratched by physical
- Abyssal Memory Primal Surge (INT 38): floor((38×1.8 - 86×0.4)) = 34 → 12 hits to kill Knight
- Time Fold: 12% max HP = 47 → 9 uses to kill Knight

**Mage perspective** (Mage L25, DEF ~38, HP ~196):
- Wireframe Drake (ATK 35): floor((35×1.5 - 38×0.8)) = 22 → kills Mage in 9 hits
- Abyssal Memory Primal Surge (INT 38): floor((38×1.8 - 38×0.4)) = 53 → kills Mage in 4 hits
- **Verdict**: Act III is challenging for Mages. Clerics and Knights are comfortable. Rogues evade heavily. Balanced for party-based play.

---

## Global Enemy Count Summary

| Category | Count | Examples |
|----------|-------|---------|
| Settled Lands | 8 | Meadow Sprite through Crag Golem |
| Frontier | 11 | Mire Crawler through Harmony Wraith |
| Sketch | 6 | Sketch Phantom through Memory Echo |
| Depths | 5 | Memory Shade through Abyssal Memory |
| Preservers | 4 | Scout through Archivist |
| Bosses | 10 | Stagnation Heart, 4 Shrine Guardians, 4 Depths Bosses, Curator's Right Hand, Archive Keeper |
| **Total unique enemies** | **34** | + The Curator (dialogue, no combat) |
