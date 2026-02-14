# Class Progression: Levels, Stats, and Skills

> Cross-references: [docs/design/classes.md](classes.md), [docs/design/combat.md](combat.md), [docs/design/memory-system.md](memory-system.md), [docs/world/dormant-gods.md](../world/dormant-gods.md)

## Overview

Progression in Mnemonic Realms follows two parallel tracks:

1. **XP/Level progression** — traditional JRPG leveling from combat. Governs stat growth and skill unlocks.
2. **Memory progression** — broadcasting fragments into the world and self. Governs class-specific power boosts, subclass unlocking, and world evolution (see [memory-system.md](memory-system.md)).

Both tracks are independent. A player who focuses on combat will be high-level with strong base stats. A player who focuses on memory broadcasting will have a more vibrant world with unique class abilities. The ideal playthrough engages both.

---

## Level Cap

**Maximum level: 30.**

The game is designed for a 15-20 hour playthrough. A player who fights most encounters and doesn't grind excessively should reach level 27-28 by the final boss. Level 30 is achievable but requires thorough exploration and engagement with optional content.

### Level Pacing by Act

| Act | Level Range | Zone | Hours (approx.) |
|-----|-------------|------|-----------------|
| Act I: Awakening | 1-10 | Village Hub + Settled Lands | 4-6 hours |
| Act II: Expansion | 11-20 | Frontier + Depths L1-L3 | 6-8 hours |
| Act III: Renaissance | 21-30 | The Sketch + Depths L4-L5 + Preserver Fortress | 5-6 hours |

---

## XP Curve

### Formula

```
XP required for next level = floor(8 * level^2 + 15 * level)
```

Where `level` is the player's current level. This is a quadratic curve: early levels come quickly to keep new players engaged, while later levels require meaningful effort.

### XP Table (Levels 1-30)

| Level | XP to Next | Cumulative XP | Act |
|-------|-----------|---------------|-----|
| 1 | 23 | 0 | I |
| 2 | 62 | 23 | I |
| 3 | 117 | 85 | I |
| 4 | 188 | 202 | I |
| 5 | 275 | 390 | I |
| 6 | 378 | 665 | I |
| 7 | 497 | 1,043 | I |
| 8 | 632 | 1,540 | I |
| 9 | 783 | 2,172 | I |
| 10 | 950 | 2,955 | I |
| 11 | 1,133 | 3,905 | II |
| 12 | 1,332 | 5,038 | II |
| 13 | 1,547 | 6,370 | II |
| 14 | 1,778 | 7,917 | II |
| 15 | 2,025 | 9,695 | II |
| 16 | 2,288 | 11,720 | II |
| 17 | 2,567 | 14,008 | II |
| 18 | 2,862 | 16,575 | II |
| 19 | 3,173 | 19,437 | II |
| 20 | 3,500 | 22,610 | II |
| 21 | 3,843 | 26,110 | III |
| 22 | 4,202 | 29,953 | III |
| 23 | 4,577 | 34,155 | III |
| 24 | 4,968 | 38,732 | III |
| 25 | 5,375 | 43,700 | III |
| 26 | 5,798 | 49,075 | III |
| 27 | 6,237 | 54,873 | III |
| 28 | 6,692 | 61,110 | III |
| 29 | 7,163 | 67,802 | III |
| 30 | — | 74,965 | III |

### XP Sources

XP is earned from combat only. Quests do not grant XP — they grant gold, items, and memory fragments. This keeps leveling tied to the "fight monsters" loop while memory progression is tied to the "explore and broadcast" loop.

| Enemy Tier | Typical XP per Enemy | Examples |
|------------|---------------------|----------|
| Settled Lands (tutorial) | 15-30 | Meadow Sprites, Grass Serpents |
| Settled Lands (standard) | 25-50 | Forest Wisps, Thornback Beetles, River Nymphs |
| Frontier (standard) | 60-100 | Mire Crawlers, Wind Elementals, Phantom Foxes |
| Frontier (elite) | 100-150 | Crystal Sentinels, Harmony Wraiths |
| Depths (L1-L2) | 40-80 | 1.3x overworld base |
| Depths (L3-L4) | 90-150 | 1.5x-1.7x overworld base |
| Depths (L5) | 150-220 | 1.9x overworld base |
| Sketch enemies | 130-200 | Sketch Phantoms, Wireframe Drakes |
| Preserver agents | 120-180 | Scouts, agents, captains |
| Mini-bosses | 300-500 | Dormant god shrine guardians, Depths floor bosses |
| Major bosses | 600-1,000 | Act climax bosses, Preserver Fortress bosses |
| Final boss | 0 (game ends) | Grym's confrontation is dialogue, not combat |

### Level Difference XP Modifier

To prevent trivial grinding of low-level enemies:

```
xp_gained = floor(base_xp * modifier)

modifier:
  if playerLevel <= enemyBaseLevel + 3: 1.0 (full XP)
  if playerLevel == enemyBaseLevel + 4: 0.75
  if playerLevel == enemyBaseLevel + 5: 0.50
  if playerLevel >= enemyBaseLevel + 6: 0.25 (minimum)
```

Conversely, there is no bonus for fighting enemies above the player's level. The difficulty IS the bonus.

---

## Stats

### The Six Stats

| Stat | Abbreviation | Role |
|------|-------------|------|
| Hit Points | HP | Total health. Reaches zero = defeat. |
| Skill Points | SP | Resource for class skills. Regenerates via Defend action (+5% max SP), items, and some passives. |
| Attack | ATK | Physical damage output. Used in physical damage formula (see [combat.md](combat.md)). |
| Intelligence | INT | Magical damage and healing output. Used in magical damage and healing formulas. |
| Defense | DEF | Damage reduction against both physical and magical attacks (physical: DEF * 0.8, magical: DEF * 0.4). |
| Agility | AGI | Turn order priority, evasion chance, and flee success rate. |

Note: The canonical stat abbreviation is ATK (not STR). All documents have been updated to use ATK consistently.

### Stat Growth Formulas

Each stat for each class follows a linear growth formula:

```
stat(level) = floor(base + growth_rate * (level - 1))
```

This produces exact, deterministic values at every level. No randomness in stat growth — the player always knows what they'll get.

#### Knight — Growth Rates

| Stat | Base (L1) | Growth Rate | L10 | L20 | L30 |
|------|-----------|-------------|-----|-----|-----|
| HP | 45 | +14.5/level | 175 | 320 | 466 |
| SP | 15 | +3.2/level | 43 | 75 | 107 |
| ATK | 12 | +3.3/level | 41 | 74 | 107 |
| INT | 5 | +1.0/level | 14 | 24 | 34 |
| DEF | 10 | +3.1/level | 37 | 69 | 99 |
| AGI | 7 | +1.5/level | 20 | 35 | 50 |

**Identity**: Highest HP and ATK. Tied for highest DEF. Lowest AGI and INT. A frontline tank and physical damage dealer who can absorb hits but acts late in the turn order.

#### Cleric — Growth Rates

| Stat | Base (L1) | Growth Rate | L10 | L20 | L30 |
|------|-----------|-------------|-----|-----|-----|
| HP | 35 | +10.0/level | 125 | 225 | 325 |
| SP | 25 | +5.5/level | 74 | 129 | 184 |
| ATK | 7 | +1.5/level | 20 | 35 | 50 |
| INT | 12 | +3.3/level | 41 | 74 | 107 |
| DEF | 9 | +2.5/level | 31 | 56 | 81 |
| AGI | 6 | +1.3/level | 17 | 30 | 43 |

**Identity**: Highest SP for sustained healing/buffing. Strong INT for heal power. Moderate HP and DEF for survivability. Lowest AGI — the Cleric is methodical, not fast. Weak ATK means physical attacks are a last resort.

#### Mage — Growth Rates

| Stat | Base (L1) | Growth Rate | L10 | L20 | L30 |
|------|-----------|-------------|-----|-----|-----|
| HP | 28 | +7.0/level | 91 | 161 | 231 |
| SP | 30 | +6.0/level | 84 | 144 | 204 |
| ATK | 5 | +1.0/level | 14 | 24 | 34 |
| INT | 14 | +3.8/level | 48 | 86 | 124 |
| DEF | 5 | +1.3/level | 16 | 29 | 42 |
| AGI | 10 | +2.5/level | 32 | 57 | 82 |

**Identity**: Highest INT for devastating magical damage. Highest SP pool for sustained casting. Lowest HP and DEF — a true glass cannon. Good AGI (second-fastest) to get spells off before taking hits. Lowest ATK — never use basic attack.

#### Rogue — Growth Rates

| Stat | Base (L1) | Growth Rate | L10 | L20 | L30 |
|------|-----------|-------------|-----|-----|-----|
| HP | 32 | +8.5/level | 108 | 193 | 278 |
| SP | 20 | +4.5/level | 60 | 105 | 150 |
| ATK | 10 | +2.5/level | 32 | 57 | 82 |
| INT | 6 | +1.3/level | 17 | 30 | 43 |
| DEF | 7 | +1.5/level | 20 | 35 | 50 |
| AGI | 13 | +3.3/level | 42 | 75 | 108 |

**Identity**: Highest AGI — always acts first. Moderate ATK (compensated by skill multipliers and Foreshadow mechanics). Low DEF but evades instead. Moderate HP — can take a few hits but prefers not to. Low INT — relies on physical-based skills, not magic.

### Stat Comparison at Key Levels

#### Level 1 (Game Start)

| Stat | Knight | Cleric | Mage | Rogue |
|------|--------|--------|------|-------|
| HP | **45** | 35 | 28 | 32 |
| SP | 15 | **25** | **30** | 20 |
| ATK | **12** | 7 | 5 | 10 |
| INT | 5 | 12 | **14** | 6 |
| DEF | **10** | 9 | 5 | 7 |
| AGI | 7 | 6 | 10 | **13** |

#### Level 10 (End of Act I)

| Stat | Knight | Cleric | Mage | Rogue |
|------|--------|--------|------|-------|
| HP | **175** | 125 | 91 | 108 |
| SP | 43 | 74 | **84** | 60 |
| ATK | **41** | 20 | 14 | 32 |
| INT | 14 | 41 | **48** | 17 |
| DEF | **37** | 31 | 16 | 20 |
| AGI | 20 | 17 | 32 | **42** |

#### Level 20 (Mid Act II)

| Stat | Knight | Cleric | Mage | Rogue |
|------|--------|--------|------|-------|
| HP | **320** | 225 | 161 | 193 |
| SP | 75 | 129 | **144** | 105 |
| ATK | **74** | 35 | 24 | 57 |
| INT | 24 | 74 | **86** | 30 |
| DEF | **69** | 56 | 29 | 35 |
| AGI | 35 | 30 | 57 | **75** |

#### Level 30 (Endgame)

| Stat | Knight | Cleric | Mage | Rogue |
|------|--------|--------|------|-------|
| HP | **466** | 325 | 231 | 278 |
| SP | 107 | 184 | **204** | 150 |
| ATK | **107** | 50 | 34 | 82 |
| INT | 34 | 107 | **124** | 43 |
| DEF | **99** | 81 | 42 | 50 |
| AGI | 50 | 43 | 82 | **108** |

### Damage Output at Key Levels

Using the formulas from [combat.md](combat.md), against typical enemies at each stage:

#### Level 10 vs. Act I Enemy (DEF 15)

| Class | Attack Type | Formula | Damage |
|-------|------------|---------|--------|
| Knight | Physical | floor((41×1.5 - 15×0.8) × 1.0) | 49 |
| Cleric | Heal | floor(41 × 1.2) | 49 HP healed |
| Mage | Magical | floor((48×1.8 - 15×0.4) × 1.0) | 80 |
| Rogue | Physical | floor((32×1.5 - 15×0.8) × 1.0) | 36 |

**Analysis**: Mage deals ~63% more damage than Knight, but has 52% of Knight's HP (91 vs 175). Rogue deals less raw damage but acts first (AGI 42 vs Knight's 20) and gets bonus damage from Foreshadow Strike. Cleric's heal output matches Knight's damage output — every point of INT maps to both offense and support.

#### Level 20 vs. Act II Enemy (DEF 30)

| Class | Attack Type | Formula | Damage |
|-------|------------|---------|--------|
| Knight | Physical | floor((74×1.5 - 30×0.8) × 1.0) | 87 |
| Cleric | Heal | floor(74 × 1.2) | 88 HP healed |
| Mage | Magical | floor((86×1.8 - 30×0.4) × 1.0) | 142 |
| Rogue | Physical | floor((57×1.5 - 30×0.8) × 1.0) | 61 |

#### Level 30 vs. Endgame Enemy (DEF 50)

| Class | Attack Type | Formula | Damage |
|-------|------------|---------|--------|
| Knight | Physical | floor((107×1.5 - 50×0.8) × 1.0) | 120 |
| Cleric | Heal | floor(107 × 1.2) | 128 HP healed |
| Mage | Magical | floor((124×1.8 - 50×0.4) × 1.0) | 203 |
| Rogue | Physical | floor((82×1.5 - 50×0.8) × 1.0) | 83 |

**No class dominates all situations.** The Mage does the most raw damage but dies fastest. The Knight survives longest but acts last. The Rogue controls the turn order. The Cleric keeps everyone alive.

---

## Skill Unlock Schedule

Each class has **7 base skills** that unlock via leveling, plus **2 subclass skills** that unlock after the first dormant god recall in Act II (see [dormant-gods.md](../world/dormant-gods.md) for recall mechanics, subclass branching rules below).

Skills cost SP to use. SP regenerates via the Defend action (+5% max SP), items, and some class passives.

### Knight Skills

| Level | Skill | SP Cost | Description |
|-------|-------|---------|-------------|
| 1 | **Oath Strike** | 0 | Enhanced basic attack. Damage = ATK × 1.2. Deals +5% bonus damage per active oath (max 5 oaths = +25%). Always available. |
| 3 | **Guardian's Shield** | 8 | Choose one ally. For this turn, 50% of damage aimed at that ally is redirected to the Knight instead. The Knight takes the redirected damage at full value. |
| 6 | **Vow of Steel** | 12 | Self-buff: DEF +40% for 3 turns. While active, the Knight cannot flee from combat. |
| 10 | **Remembered Valor** | 18 | Party buff: all allies gain ATK +20% for 3 turns. If the Knight has 3+ fulfilled oaths, also grants DEF +10%. |
| 15 | **Oathbreaker's Gambit** | 25 | Sacrifice one active oath to deal ATK × 3.0 damage to a single target. The sacrificed oath's passive bonus is permanently lost. Cannot be used if no oaths are active. |
| 20 | **Steadfast Wall** | 30 | For 1 turn, the Knight absorbs ALL single-target physical attacks aimed at any ally. Each absorbed attack deals 70% of its normal damage to the Knight. |
| 25 | **Unbroken Promise** | 40 | Once per battle (auto-trigger): when the Knight drops below 20% HP, immediately heal self for 35% of max HP and grant self ATK +30% for 2 turns. Triggers automatically — does not cost a turn. |

### Cleric Skills

| Level | Skill | SP Cost | Description |
|-------|-------|---------|-------------|
| 1 | **Joyful Mending** | 6 | Heal one ally for INT × 1.2 HP. The Cleric's bread-and-butter heal. |
| 3 | **Sorrowful Cleanse** | 8 | Remove one debuff (Poison, Slow, Weakness, Stasis) from one ally. If no debuff is present, heals for INT × 0.5 instead. |
| 7 | **Awestruck Ward** | 14 | Place a shield on one ally that absorbs up to INT × 0.8 damage. Lasts 3 turns or until broken. |
| 10 | **Fury Blessing** | 16 | Buff one ally: ATK +30% and INT +30% for 3 turns. Cannot be used on self. |
| 14 | **Group Mending** | 22 | Heal all allies for INT × 0.7 HP. Less efficient per-target than Joyful Mending, but affects the whole party. |
| 19 | **Emotional Cascade** | 28 | Remove ALL debuffs from ALL allies. Additionally, each debuff removed heals the affected ally for INT × 0.3 HP. |
| 24 | **Emotional Resonance** | 50 | Ultimate: heal all allies for INT × 2.0 HP and grant the Inspired status (+20% all stats) to the entire party for 3 turns. The Cleric's most powerful ability — use sparingly due to SP cost. |

### Mage Skills

| Level | Skill | SP Cost | Description |
|-------|-------|---------|-------------|
| 1 | **Elemental Bolt** | 5 | Single-target magic attack. Damage = INT × 1.8 (element chosen from unlocked elements — see Memory-Based Element Unlocks below). |
| 4 | **Memory Wave** | 10 | AoE magic attack hitting all enemies. Damage = INT × 1.2 per target. Element = the last memory fragment the player collected. |
| 8 | **Inspired Shield** | 12 | Self-buff: for 2 turns, gain a magic barrier that absorbs damage up to INT × 0.6. The barrier's element adapts to the last attack that hit the Mage (grants resistance to that element). |
| 12 | **Eureka Moment** | 18 | Random powerful spell: deals INT × 2.5 damage to one target, element chosen randomly from all unlocked elements. 30% chance to hit a weakness (even if the random element wouldn't normally match). High risk, high reward. |
| 16 | **Elemental Storm** | 24 | AoE magic attack: INT × 1.5 damage to all enemies. The player chooses the element. If the chosen element is super-effective against any target, damage to that target increases to INT × 2.0. |
| 21 | **Arcane Barrier** | 20 | Party-wide magic shield absorbing INT × 0.5 damage per ally. Lasts 2 turns. Stacks with Awestruck Ward. |
| 26 | **Grand Inspiration** | 55 | Ultimate: combine 2 unlocked elements into a compound spell. Deals INT × 3.0 damage to all enemies. Element = both chosen elements simultaneously (enemies weak to either take full weakness damage). Costs the most SP of any skill in the game. |

### Rogue Skills

| Level | Skill | SP Cost | Description |
|-------|-------|---------|-------------|
| 1 | **Foreshadow Strike** | 0 | Enhanced basic attack. Damage = ATK × 1.3. If used before the target acts this turn, deals ATK × 1.8 instead (the Rogue reads the "shadow" of the enemy's intended action). Always available. |
| 3 | **Echo Dodge** | 0 (passive) | Passive: 15% base chance to completely avoid any attack. Chance increases by +2% per level (L10: 33%, L20: 53%, L30: 73% — capped at 60% to prevent invincibility). |
| 6 | **Shadow Step** | 10 | Teleport behind one enemy. The next attack against this enemy (by any party member, this turn only) is guaranteed to hit and deals +25% bonus damage. |
| 10 | **Memory Theft** | 14 | Attack one enemy for ATK × 1.0 damage. If it hits, steal a minor buff: reduce the enemy's highest stat by 10% for 3 turns and gain +10% to the corresponding stat. Against bosses, stat reduction is 5% and buff is +5%. |
| 15 | **Phantom Flurry** | 20 | Strike one enemy 3 times, each hit dealing ATK × 0.6 damage. Each hit has independent accuracy (can miss individually). If all 3 connect, inflict Weakness (DEF -30%) for 2 turns. |
| 20 | **Vanishing Act** | 22 | Become invisible for 2 turns. While invisible: immune to single-target attacks, next attack deals double damage and breaks invisibility. AoE attacks still hit. |
| 26 | **Temporal Ambush** | 45 | Ultimate: the Rogue acts twice this turn. Both actions can be any skill or attack. The second action occurs immediately after the first (no enemy turns between them). |

### Echo Dodge Cap Correction

Echo Dodge uses a diminishing formula to prevent abuse:

```
evasion_chance = min(0.60, 0.15 + 0.02 * (level - 1))
```

At level 30: min(0.60, 0.15 + 0.58) = 0.60 (60%). This means a max-level Rogue dodges 60% of attacks — powerful but not invincible. Bosses with guaranteed-hit attacks bypass Echo Dodge.

---

## Subclass System

### Unlock Condition

Subclasses unlock when the player recalls their **first dormant god** during Act II. This typically happens around level 13-16.

The **emotion** used for the first recall determines which subclass branch opens (see [dormant-gods.md](../world/dormant-gods.md)):

| First Recall Emotion | Branch | Philosophy |
|---------------------|--------|------------|
| Joy or Awe | **Luminary** | Community, support, creative enhancement |
| Fury or Sorrow | **Crucible** | Individual power, transformation, intensity |

Once unlocked, subclass skills become available immediately. They do not have level requirements (the Act II timing is the gate). The player retains all base class skills — subclass skills are additions, not replacements.

### Knight Subclass Skills

#### Luminary: Oath Warden

| Skill | SP Cost | Description |
|-------|---------|-------------|
| **Beacon of Oaths** | 0 (passive) | All allies within the party gain +10% DEF passively while the Knight is conscious. This bonus doubles to +20% if the Knight has 3+ active oaths. |
| **Shared Valor** | 22 | Upgrade to Remembered Valor: now grants ATK +20% AND DEF +15% to all allies for 3 turns. Additionally, transfers one of the Knight's active oath bonuses to one chosen ally for the duration. |

#### Crucible: Oath Reaver

| Skill | SP Cost | Description |
|-------|---------|-------------|
| **Wrathful Oath** | 0 (passive) | Each fulfilled oath permanently grants the Knight +3% ATK (stacking, no cap). A Knight with 10 fulfilled oaths gains a permanent +30% ATK bonus. |
| **Oathbreaker's Fury** | 35 | Enhanced Oathbreaker's Gambit: sacrifice one oath to deal ATK × 2.5 damage to ALL enemies (AoE). Single-target damage is lower than Gambit, but AoE makes it devastating against groups. |

### Cleric Subclass Skills

#### Luminary: Radiant Shepherd

| Skill | SP Cost | Description |
|-------|---------|-------------|
| **Radiant Aura** | 0 (passive) | All allies regenerate 3% of their max HP at the end of each turn. This is automatic and does not cost SP or a turn. |
| **Joyful Renewal** | 30 | Once per battle (auto-trigger): when any ally drops below 15% HP, instantly heal them to 50% HP. Does not consume the Cleric's turn. Cannot trigger on the Cleric themselves. |

#### Crucible: Grief Channeler

| Skill | SP Cost | Description |
|-------|---------|-------------|
| **Sorrow's Edge** | 0 (passive) | The Cleric's healing spells now also deal 30% of the heal amount as dark-element damage to a random enemy. Joyful Mending heals an ally AND hurts an enemy simultaneously. |
| **Martyrdom** | 35 | The Cleric sacrifices 40% of their current HP to heal all allies for 150% of the sacrificed amount (effectively a 1.5x multiplier). If this reduces the Cleric below 10% HP, the Cleric gains Inspired (+20% all stats) for 3 turns. |

### Mage Subclass Skills

#### Luminary: Prism Weaver

| Skill | SP Cost | Description |
|-------|---------|-------------|
| **Chromatic Mastery** | 0 (passive) | The Mage can choose the element of Memory Wave (previously locked to last collected fragment's element). Additionally, elemental weakness damage increases from 1.5x to 1.75x for all of the Mage's spells. |
| **Spectrum Shield** | 20 | Grant one ally a prismatic barrier that absorbs INT × 1.0 damage. The barrier automatically matches the element of any incoming attack (always counts as resistant). Lasts 2 turns. |

#### Crucible: Entropy Caster

| Skill | SP Cost | Description |
|-------|---------|-------------|
| **Volatile Inspiration** | 0 (passive) | Eureka Moment's random element is replaced with a guaranteed element that matches the target's weakness (if a weakness exists). If no weakness exists, Eureka Moment deals +20% bonus damage instead. Removes the randomness, adds tactical precision. |
| **Annihilation** | 60 | The Mage's most expensive skill. Deal INT × 4.0 damage to one target, ignoring DEF entirely. The Mage takes 15% of the damage dealt as recoil. |

### Rogue Subclass Skills

#### Luminary: Phantom Guide

| Skill | SP Cost | Description |
|-------|---------|-------------|
| **Shared Foresight** | 0 (passive) | Echo Dodge's evasion bonus (up to 60%) now applies to all allies at half effectiveness (up to 30% party-wide evasion). The whole party becomes harder to hit. |
| **Memory Link** | 18 | For 3 turns, whenever the Rogue successfully evades an attack via Echo Dodge, the would-be attacker is automatically counter-attacked for ATK × 0.8 damage. This triggers on each dodge. |

#### Crucible: Chrono Striker

| Skill | SP Cost | Description |
|-------|---------|-------------|
| **Time Scar** | 0 (passive) | Foreshadow Strike's pre-enemy bonus increases from ATK × 1.8 to ATK × 2.2. Additionally, enemies hit by Foreshadow Strike have their AGI reduced by 15% for 2 turns (slowing them further). |
| **Infinite Ambush** | 55 | Enhanced Temporal Ambush: the Rogue acts THREE times this turn instead of two. Each action can be any skill or attack. If all three actions target the same enemy, the third action deals +50% bonus damage. |

---

## Memory-Based Progression

Memory broadcasting provides class-specific power boosts separate from XP/leveling. These come from broadcasting fragments into the "Self (Class)" target (see [memory-system.md](memory-system.md)).

### How Self-Broadcasting Works

The player can broadcast a memory fragment into themselves instead of into the world. This consumes the fragment and grants a class-specific enhancement based on the fragment's properties:

| Fragment Property | Knight Effect | Cleric Effect | Mage Effect | Rogue Effect |
|------------------|---------------|---------------|-------------|--------------|
| **Emotion: Joy** | New oath opportunity (NPC quest link) | +1 Joy Charge (max 10) — scales Joyful Mending | Pattern unlock: "Rain" variant (healing rain for non-Clerics) | +2% Foreshadow detection range |
| **Emotion: Fury** | +2% Oathbreaker's Gambit damage | +1 Fury Charge (max 10) — scales Fury Blessing | Pattern unlock: "Burst" variant (explosive AoE) | +1% critical hit chance |
| **Emotion: Sorrow** | +1% DEF permanently | +1 Sorrow Charge (max 10) — scales Sorrowful Cleanse | Pattern unlock: "Veil" variant (defensive shield) | +1% Echo Dodge (beyond base formula, stacking) |
| **Emotion: Awe** | +1% HP permanently | +1 Awe Charge (max 10) — scales Awestruck Ward | Pattern unlock: "Wave" variant (wider AoE) | +2% Memory Theft effectiveness |
| **Emotion: Calm** | +1% to all stats | +1 to all Charges | Unlock one random locked element | +1% to all evasion/accuracy |
| **Potency 1-2** | Minor version of above | Minor version | Pattern variant is basic | Minor version |
| **Potency 3-4** | Standard version | Standard version | Pattern variant is enhanced | Standard version |
| **Potency 5** | Double the bonus | Double the charges | Pattern variant is mastered + bonus element | Double the bonus |

### Mage Element Unlock System

The Mage's spell repertoire grows via memory collection (not self-broadcasting). Elements unlock automatically when the player collects a fragment with a matching element:

| Element | Source Fragment Element | Unlock Condition |
|---------|----------------------|------------------|
| Fire | Fire | Collect any fire-element fragment |
| Water | Water | Collect any water-element fragment |
| Earth | Earth | Collect any earth-element fragment |
| Wind | Wind | Collect any wind-element fragment |
| Light | Light | Collect any light-element fragment |
| Dark | Dark | Collect any dark-element fragment |
| Neutral | Neutral | Available from start |

By mid-Act I, the Mage should have 3-4 elements. By late Act II, all 7. This natural unlocking via exploration keeps the Mage's toolkit growing without requiring grinding.

### Cleric Charge System

The Cleric accumulates emotional charges from two sources:
1. **Automatic**: collecting any memory fragment grants +1 charge of that fragment's emotion type
2. **Self-broadcasting**: broadcasting a fragment into self grants charges per the table above

Charges are a persistent resource (not consumed when used). They scale specific skills:

```
Joyful Mending bonus = joy_charges * 3% (at 10 charges: +30% healing power)
Awestruck Ward bonus = awe_charges * 3% (at 10 charges: +30% shield strength)
Fury Blessing bonus = fury_charges * 2% (at 10 charges: +20% buff strength)
Sorrowful Cleanse bonus = sorrow_charges * 5% of target's max HP as bonus heal
```

### Knight Oath System

Oaths are gained from NPC interactions and quest acceptance. Each active oath provides:

```
passive_bonus = +2% ATK and +2% DEF per active oath (max 5 active = +10% each)
oath_strike_bonus = +5% damage per active oath
```

Fulfilled oaths (completed quests/objectives) become permanent:

```
fulfilled_bonus = +1% to a specific stat permanently (stat depends on the oath's theme)
```

A Knight who completes many oaths and fulfills them all becomes the strongest raw-stats character in the game. But breaking oaths (failing quests, abandoning NPCs) removes the active bonus permanently — the oath slot is lost.

### Rogue Foreshadow System

The Rogue's Foreshadow mechanics scale with both level (Echo Dodge formula) and memory-based progression:

```
foreshadow_bonus = base_level_bonus + memory_bonus
memory_bonus = sum of all self-broadcast bonuses from above table
```

At maximum investment (10 fragments self-broadcast, assorted emotions), the Rogue gains approximately: +20% Foreshadow detection, +10% crit chance, +10% bonus evasion, +20% Memory Theft effectiveness. Combined with level-based Echo Dodge (60% at L30), the Rogue becomes nearly untouchable — but only against single targets. AoE attacks bypass evasion.

---

## Party Composition

Combat in Mnemonic Realms is party-based. The player controls their chosen character plus **NPC companions** who join at fixed story points.

### Companion Availability

| Companion | Class | Joins | Leaves | Level When Joining |
|-----------|-------|-------|--------|-------------------|
| Hana | Cleric (simplified) | Act I, Scene 3 | Act I climax (frozen) | Player level - 1 |
| Artun | Mage (simplified) | Act II, Scene 2 | — (permanent from Act II onward) | Player level - 2 |
| Nel | Knight (simplified) | Act II, Scene 8 (Ridgewalker Camp) | — (permanent) | Player level - 1 |

Companions use **simplified versions** of their class skills (3 skills each instead of 7+). Their stats follow the same formulas as the player character of that class but at a lower level (1-2 levels behind). Companions do not have subclass skills or memory-based progression — they are support characters, not the star.

The player always has the most powerful character in the party. Companions provide tactical variety and emotional connection, not a replacement for player skill.

### Party Size

Maximum party size: **3** (player + 2 companions). In Act I, the player has Hana as their only companion (party of 2). In Act II-III, the player chooses 2 of their available companions for each outing.

Single-character sections exist in the story (player alone in certain Depths levels, solo sections in the Preserver Fortress), testing the player character's individual power.

---

## Endgame Stat Targets

These are the stat ranges a well-played character should have at the final boss encounter (level 27-30):

### Without Memory Broadcasting

| Stat | Knight | Cleric | Mage | Rogue |
|------|--------|--------|------|-------|
| HP | 420-466 | 290-325 | 210-231 | 250-278 |
| SP | 96-107 | 165-184 | 183-204 | 135-150 |
| ATK | 96-107 | 45-50 | 30-34 | 74-82 |
| INT | 30-34 | 96-107 | 112-124 | 38-43 |
| DEF | 89-99 | 73-81 | 38-42 | 45-50 |
| AGI | 45-50 | 39-43 | 74-82 | 97-108 |

### With Full Memory Broadcasting (Self-Focused)

A player who self-broadcasts ~10 fragments (out of 40-60 collected) gains:

| Class | Key Stat Boost | Result |
|-------|---------------|--------|
| Knight | +10% ATK, +10% DEF, +10% HP from oaths/broadcasts | ATK ~117, DEF ~109, HP ~512 |
| Cleric | +30% heal power, +30% shield, +20% buff from charges | Effective INT equivalent ~139 for healing |
| Mage | 7/7 elements, 4 pattern variants, bonus element pools | Access to every spell combination |
| Rogue | +70% base evasion (60% + 10% memory), +10% crit | Near-untouchable with burst damage |

The difference between a "no memory" and "full memory" character is significant but not required to beat the game. The final encounter is a dialogue scene with Grym, not a stat check. The combat bosses leading up to it are tuned for the "without memory broadcasting" stat range — memory-invested characters will find them comfortably beatable rather than trivial.

---

## Balance Philosophy

### No Dominant Class

Every class has clear strengths and weaknesses. No class can solo all content optimally:

| Situation | Best Class | Why |
|-----------|-----------|-----|
| Sustained boss fights | Knight | Highest HP/DEF, Vow of Steel, self-heal passive |
| Group enemy encounters | Mage | AoE spells clear groups efficiently |
| Speed-critical fights | Rogue | Guaranteed first action, burst damage |
| Party survival | Cleric | Healing + shields + debuff removal |
| Stagnation zone combat | Knight or Rogue | Stasis status (can't use memory skills) hurts Mage/Cleric more |
| Solo dungeon sections | Rogue | Self-sufficient via evasion + steal + burst |

### Difficulty Curve

The game is not punishing. It's a JRPG about wonder and creation (see [core-theme.md](../world/core-theme.md)):

- **Act I**: Tutorial-level difficulty. Encounters teach mechanics. Death is rare.
- **Act II**: Moderate difficulty. Preserver agents introduce Stasis status, requiring tactical adaptation. Party composition matters more.
- **Act III**: Challenging but fair. Sketch enemies are unpredictable. Depths L5 and Preserver Fortress test mastery. The game wants the player to feel accomplished, not frustrated.
- **Game Over**: Returns the player to the fight with full HP/SP or teleports them to the Village Hub. No lost progress (see [combat.md](combat.md)).

### Gold Economy Baseline

Gold scales with level progression to keep shops relevant:

| Act | Typical Gold per Enemy | Typical Shop Item Cost |
|-----|----------------------|----------------------|
| I | 8-20 gold | 30-150 gold |
| II | 25-60 gold | 150-500 gold |
| III | 50-120 gold | 400-1,500 gold |

The player should be able to afford essential consumables (potions, antidotes) comfortably. Premium gear requires either saving or thorough exploration. The economy should feel generous, not stingy — this is a game about abundance, not scarcity.
