# Skills Catalog: Complete Skill Reference

> Cross-references: [docs/design/progression.md](progression.md), [docs/design/combat.md](combat.md), [docs/design/classes.md](classes.md), [docs/design/enemies-catalog.md](enemies-catalog.md), [docs/design/memory-system.md](memory-system.md), [docs/design/items-catalog.md](items-catalog.md), [docs/world/dormant-gods.md](../world/dormant-gods.md), [docs/design/visual-direction.md](visual-direction.md)

## Overview

Every skill in the game is documented here with exact formulas, targeting, animation descriptions, and tactical usage notes. This document expands on the skill schedule in [progression.md](progression.md) with implementation-ready detail for sprite artists, VFX designers, and RPG-JS programmers.

Each class has **7 base skills** that unlock via leveling plus **2 subclass skills** that unlock when the player recalls their first dormant god in Act II (see [dormant-gods.md](../world/dormant-gods.md)). Companions use simplified 3-skill sets.

### Damage Convention

All skill damage follows the formulas from [combat.md](combat.md). Skill multipliers **replace** the base multiplier in the formula:

```
Physical skill: floor((ATK × skill_mult - targetDEF × 0.8) × variance × elementMod)
Magical skill:  floor((INT × skill_mult - targetDEF × 0.4) × variance × elementMod)
Healing skill:  floor(INT × heal_mult × variance)

variance = 0.9 + seededRandom() * 0.2  (90%-110%)
elementMod = 1.0 (neutral), 1.5 (weakness), 0.5 (resistance)
```

Skills with non-standard damage (fixed, percentage-based, or DEF-ignoring) note their exception explicitly. For reference, the basic "Attack" command uses ATK × 1.5.

### Target Types

| Code | Name | Description |
|------|------|-------------|
| SE | Single Enemy | One enemy selected by player |
| AE | All Enemies | Every enemy in the encounter |
| FR | Front Row | 1-2 enemies in front position |
| S | Self | Caster only |
| SA | Single Ally | One party member selected by player |
| AA | All Allies | Every party member including caster |
| RE | Random Enemy | System-selected enemy |
| A | Auto | Triggers automatically, no player input |

### SP Regeneration

SP does not regenerate automatically. Recovery sources:
- **Defend action**: +5% max SP per turn defended
- **Consumables**: Mana Drop (C-SP-01, +15 SP), Mana Draught (C-SP-02, +40 SP), Mana Surge (C-SP-03, +80 SP)
- **Class passives**: Autumnus recall buff (Cycle's Gift: 10% of defeated enemy max HP as SP), some subclass passives
- **Inn rest**: Full SP restore
- **Victory**: SP does NOT restore between fights (resource management matters)

### Animation Style

Animations follow the 16-bit aesthetic from [visual-direction.md](visual-direction.md):
- **Memory energy**: Warm amber/gold (#DAA520) particle effects
- **Joy skills**: Sunlight yellow (#FFD700) accents
- **Sorrow skills**: Twilight purple (#7B68EE) accents
- **Awe skills**: Aurora green (#66CDAA) accents
- **Fury skills**: Forge red (#CD5C5C) accents
- **Stasis effects**: Cold crystal blue-white (#B0C4DE)
- **Healing**: Soft green-gold rising motes
- **Buff**: Upward amber swirl around target
- **Debuff**: Downward purple-grey spiral on target

---

## Knight Skills — Oathweave

**Class Identity**: The Knight's power comes from remembered promises. Every skill reinforces the oath system: commitments made, commitments kept, commitments broken. The Knight is strongest when bound to many oaths — their power is proportional to their word. See [classes.md](classes.md) for the Oathweave mechanic.

**Memory Twist**: Oaths are formed through NPC interactions and quest acceptance. Active oaths grant +2% ATK and +2% DEF each (max 5 active = +10% each). Fulfilled oaths become +1% permanent stat bonuses. Self-broadcasting joy fragments creates new oath opportunities; fury fragments boost Oathbreaker's Gambit; sorrow fragments boost DEF; awe fragments boost HP (see [progression.md](progression.md) Memory-Based Progression).

### SK-KN-01: Oath Strike

| Property | Value |
|----------|-------|
| Level | 1 |
| SP Cost | 0 |
| Target | SE |
| Element | Neutral (weapon element if applicable) |

**Formula**: `floor((ATK × 1.2 × (1 + 0.05 × active_oaths) - targetDEF × 0.8) × variance × elementMod)`

The Knight's basic attack command. Replaces the generic "Attack" action. At 0 oaths, the 1.2 multiplier is lower than the standard 1.5, making the Knight initially weaker in raw damage — a deliberate incentive to engage with the oath system. At 5 active oaths, the multiplier reaches 1.2 × 1.25 = 1.5, matching basic attack. The Knight must earn their full damage potential.

**Animation**: Sword raised overhead with a flash of amber light along the blade. For each active oath, a small golden rune appears on the blade before the swing (1-5 runes visible). Impact produces concentric amber sparks at the strike point. At 5 oaths, the full blade is wreathed in golden energy.

**Tactical Notes**: Always use over basic attack. With 0 oaths, Oath Strike is weaker than other classes' basic damage — prioritize accepting quests and forming oaths early in Act I. By mid-Act I (2-3 oaths), the Knight's damage output is competitive. At 5 oaths in Act II, the Knight hits as hard as a Rogue's Foreshadow Strike against targets that have already acted.

---

### SK-KN-02: Guardian's Shield

| Property | Value |
|----------|-------|
| Level | 3 |
| SP Cost | 8 |
| Target | SA |
| Element | — |

**Formula**: 50% of all single-target damage aimed at the chosen ally this turn is redirected to the Knight at full value. AoE damage is not redirected. Does not stack (only one Guardian's Shield active per turn).

The Knight's first support skill. Establishes the tank identity — the Knight absorbs hits so squishier allies survive. Costs the Knight's action for the turn (they cannot attack and shield simultaneously).

**Animation**: The Knight plants their feet and raises a translucent amber barrier between themselves and the chosen ally. A golden chain of light connects the Knight to the shielded ally. When redirected damage triggers, the chain pulses and a portion of the enemy's attack visually arcs toward the Knight.

**Tactical Notes**: Essential when the Mage (91 HP at L10) is being focused. At L10, the Knight has 175 HP — enough to absorb several redirected hits. Best used proactively when a high-damage enemy is targeting a fragile ally. Not useful against AoE attacks. Pair with Vow of Steel for maximum tanking.

---

### SK-KN-03: Vow of Steel

| Property | Value |
|----------|-------|
| Level | 6 |
| SP Cost | 12 |
| Target | S |
| Element | — |

**Formula**: Self-buff. DEF +40% for 3 turns. While active, the Knight cannot flee from combat (the flee action is disabled, not just penalized).

The Knight's signature defensive stance. The +40% DEF multiplier is applied to the Knight's current DEF (including equipment and buffs). At L10 with DEF 37, this grants effective DEF 51 — reducing incoming physical damage by an additional 11 points per hit.

**Animation**: The Knight drives their sword into the ground and crosses their arms. Iron-grey energy radiates outward in a brief shockwave. For 3 turns, the Knight's sprite gains a faint metallic sheen and a persistent grey aura at their feet. The flee button is visually greyed out with a chain icon.

**Tactical Notes**: Use at the start of boss fights or dangerous encounters. The flee restriction is rarely relevant (bosses already prevent fleeing). Combined with Guardian's Shield, the Knight becomes nearly invincible against physical damage. Less effective against magical enemies (DEF only reduces magical damage at 0.4 multiplier vs. 0.8 for physical).

---

### SK-KN-04: Remembered Valor

| Property | Value |
|----------|-------|
| Level | 10 |
| SP Cost | 18 |
| Target | AA |
| Element | — |

**Formula**: Party buff. All allies (including the Knight) gain ATK +20% for 3 turns. If the Knight has 3+ fulfilled oaths, also grants DEF +10%. Buff is multiplicative with other buffs and does not stack with itself (refreshes duration if recast).

The Knight's first party-wide contribution beyond tanking. The ATK buff benefits all party members, but the DEF bonus requires oath fulfillment — encouraging the Knight to complete quests, not just accept them.

**Animation**: The Knight raises their sword skyward. Amber light spirals up the blade and bursts outward in a warm pulse that washes over all allies. Each ally gains a brief upward-swirling golden particle effect. If the DEF bonus activates, a secondary iron-grey pulse follows the gold one.

**Tactical Notes**: Best used on turn 1 of boss fights to multiply the party's damage output for the critical opening. The 3-turn duration means the party gets 3 buffed attack turns. At L10, a 20% ATK buff on the Rogue (ATK 32 → 38) adds roughly 9 extra damage per hit — over 3 turns, that's ~27 bonus damage. Against Act I bosses (HP 300-400), this shaves 1-2 turns off the fight.

---

### SK-KN-05: Oathbreaker's Gambit

| Property | Value |
|----------|-------|
| Level | 15 |
| SP Cost | 25 |
| Target | SE |
| Element | Neutral |

**Formula**: `floor((ATK × 3.0 - targetDEF × 0.8) × variance × elementMod)`

Sacrifice one active oath to unleash a devastating single-target strike. The sacrificed oath's passive +2% ATK/DEF bonus is permanently lost — the oath slot is consumed. Cannot be used if no active oaths exist. This is a permanent trade: power now in exchange for scaling later.

**Animation**: One of the golden oath-runes on the Knight's blade cracks and shatters, releasing a blinding burst of amber energy. The Knight charges forward and delivers a two-handed overhead slash. The impact creates a shockwave of amber shards. A brief UI notification reads "Oath broken — [oath name]" as the oath disappears from the status panel.

**Tactical Notes**: The Knight's highest single-target damage but with a real cost. At L15, ATK ~56 → floor((56 × 3.0 - 25 × 0.8) × 1.0) = floor(148) = 148 damage. Compare to basic Oath Strike with 5 oaths: floor((56 × 1.5 - 25 × 0.8) × 1.0) = 64. So Gambit deals 2.3× Oath Strike's damage. Use as a finisher on bosses when the +2% passive bonus matters less than killing the boss this turn. Never use casually — the permanent oath loss is significant.

---

### SK-KN-06: Steadfast Wall

| Property | Value |
|----------|-------|
| Level | 20 |
| SP Cost | 30 |
| Target | S (but affects party) |
| Element | — |

**Formula**: For 1 turn, the Knight absorbs ALL single-target physical attacks aimed at any ally. Each absorbed attack deals 70% of its normal damage to the Knight. AoE and magical attacks bypass this entirely.

An upgraded Guardian's Shield that protects the entire party rather than one ally. The 70% damage reduction on absorbed hits (vs. Guardian's Shield's 100%) compensates for the wider coverage. Lasts only 1 turn — timing is critical.

**Animation**: The Knight steps forward and slams their shield (or sword in ground). A translucent iron-grey dome of overlapping hexagonal panels briefly surrounds the party. When attacks are absorbed, the panels flash and the damage visually deflects to the Knight with a metallic clang sound.

**Tactical Notes**: Best against multi-hit physical bosses or encounters with multiple physical enemies. At L20, the Knight has 320 HP — absorbing 3 attacks at 70% is roughly 3 × (enemy ATK ~30 × 1.5 × 0.7) ≈ 95 damage total. The Knight can survive this comfortably. Useless against magical enemies. Plan healing for the turn after.

---

### SK-KN-07: Unbroken Promise

| Property | Value |
|----------|-------|
| Level | 25 |
| SP Cost | 40 (auto-trigger, SP consumed when triggered) |
| Target | A (self, automatic) |
| Element | — |

**Formula**: When the Knight drops below 20% HP, immediately heal self for 35% of max HP and gain ATK +30% for 2 turns. Triggers automatically — does not consume the Knight's turn. Once per battle. Requires 40 SP available when triggered (if insufficient SP, does not activate).

The Knight's ultimate survival skill. Functions as a "last stand" mechanic that keeps the Knight alive and increases their damage in the process. The SP requirement prevents it from being a free safety net — the Knight must manage SP to ensure it's available.

**Animation**: When triggered, time briefly freezes (0.3-second pause). The Knight's sprite flashes white, then a golden shockwave radiates outward. Their HP bar rapidly refills to the 35% mark with an amber glow effect. The ATK buff manifests as a persistent golden sword-aura for 2 turns. A dramatic sound cue plays (rising orchestral hit).

**Tactical Notes**: At L25, Knight max HP ~420 → heals for ~147 HP when dropping below ~84 HP. The +30% ATK buff for 2 turns effectively turns a near-death situation into a damage opportunity. Keep SP above 40 in dangerous fights. Synergizes with Vow of Steel (the Knight's high DEF makes the HP threshold harder to reach) and Steadfast Wall (absorbed damage can trigger Unbroken Promise).

---

### Knight Subclass: Luminary — Oath Warden

Unlocks when the player recalls their first dormant god using **Joy** or **Awe** emotion. The Oath Warden extends the Knight's oaths to protect and empower the entire party.

### SK-KN-L1: Beacon of Oaths (Passive)

| Property | Value |
|----------|-------|
| Level | Subclass unlock (Act II, ~L13-16) |
| SP Cost | 0 (passive) |
| Target | AA (passive aura) |
| Element | — |

**Formula**: All allies gain +10% DEF passively while the Knight is conscious (HP > 0). If the Knight has 3+ active oaths, the bonus doubles to +20% DEF.

A party-wide defensive aura that rewards the Knight's oath commitment. At L15 with 3 oaths, the Mage's DEF 22 becomes 26 (minor) but the Cleric's DEF 42 becomes 50 (meaningful). The bonus disappears if the Knight is knocked out.

**Animation**: No active animation. A subtle golden circle appears beneath each ally's feet during combat — faint oath-runes rotating slowly. When the Knight has 3+ oaths, the circle brightens and the runes glow more intensely.

**Tactical Notes**: Makes the entire party tankier without any action cost. The "Knight conscious" condition means keeping the Knight alive is even more critical. Stacks additively with Vow of Steel on the Knight themselves. The DEF bonus is most impactful on the Mage and Rogue, who have low base DEF.

---

### SK-KN-L2: Shared Valor

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 22 |
| Target | AA |
| Element | — |

**Formula**: All allies gain ATK +20% and DEF +15% for 3 turns. Additionally, one chosen ally receives one of the Knight's active oath bonuses (+2% ATK, +2% DEF) for the duration. The oath is shared, not transferred — the Knight retains the bonus.

An upgraded Remembered Valor. The DEF +15% is guaranteed (no fulfilled-oath requirement), and the oath-sharing adds a unique tactical dimension. If using both, Shared Valor replaces Remembered Valor (they do not stack).

**Animation**: Same as Remembered Valor but with an additional step: after the golden pulse, the Knight points their sword at the chosen ally. A golden oath-rune flies from the Knight's blade to orbit the chosen ally, trailing amber light.

**Tactical Notes**: Strictly superior to Remembered Valor for Oath Warden Knights. The +15% DEF complements the Beacon of Oaths aura. Best used on turn 1 of boss fights. At L16, giving the Rogue +20% ATK (+10 ATK) and +15% DEF (+3 DEF) plus a shared oath (+2% ATK, +2% DEF) is a significant combat boost.

---

### Knight Subclass: Crucible — Oath Reaver

Unlocks when the player recalls their first dormant god using **Fury** or **Sorrow** emotion. The Oath Reaver channels broken oaths into raw destructive power.

### SK-KN-C1: Wrathful Oath (Passive)

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 0 (passive) |
| Target | S (passive) |
| Element | — |

**Formula**: Each fulfilled oath permanently grants the Knight +3% ATK (stacking, no cap). A Knight with 10 fulfilled oaths gains +30% ATK permanently.

Unlike Beacon of Oaths (defensive, party-wide), Wrathful Oath is purely offensive and personal. The stacking has no cap — a completionist Knight who fulfills every available oath becomes the highest-damage physical character in the game.

**Animation**: No active animation. Fulfilled oaths appear as crimson rune-marks on the Knight's blade (visible during Oath Strike animation). Each rune is slightly larger and more intense than the last.

**Tactical Notes**: Rewards thorough quest completion. At 10 fulfilled oaths with L20 ATK 74: +30% ATK → effective ATK 96. This makes Oath Strike at 5 active oaths deal: floor((96 × 1.5 - 30 × 0.8) × 1.0) = floor(120) = 120 damage — nearly matching the Mage's magical output. The Oath Reaver path trades party support for raw personal power.

---

### SK-KN-C2: Oathbreaker's Fury

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 35 |
| Target | AE |
| Element | Neutral |

**Formula**: `floor((ATK × 2.5 - targetDEF × 0.8) × variance × elementMod)` to all enemies.

Sacrifice one active oath to deal massive AoE damage. Compared to Oathbreaker's Gambit (SE, 3.0× mult), Oathbreaker's Fury trades single-target power for AoE coverage (AE, 2.5× mult). Same permanent oath cost. Cannot be used if no active oaths exist.

**Animation**: The oath-rune shatters with a crimson flash (instead of Gambit's amber). The Knight spins with their sword extended, releasing a ring of red-gold energy that expands outward through all enemies. Each enemy hit produces a burst of crimson sparks. The broken oath notification appears in red text.

**Tactical Notes**: The Knight's only AoE damage skill. Devastating against encounter groups of 3-4 enemies. At L16, ATK ~53 → floor((53 × 2.5 - 20 × 0.8) × 1.0) = floor(116.5) = 116 damage to all enemies. Against Frontier enemies (HP 70-180), this can one-shot weaker enemies and heavily damage elites. Use to clear trash encounters quickly — the permanent oath loss hurts less when the battle ends fast.

---

## Cleric Skills — Euphoric Recall

**Class Identity**: The Cleric channels the emotional peak of collected memories into healing and support. Every skill is named after an emotion because the Cleric literally converts emotional energy into magical effects. The Cleric is the party's lifeline — without them, sustained dungeon crawling becomes item-dependent and expensive.

**Memory Twist**: The Cleric accumulates emotional charges from two sources: collecting any memory fragment (+1 charge of that emotion) and self-broadcasting fragments (bonus charges, see [progression.md](progression.md)). Charges scale specific skills: Joy charges boost Joyful Mending (+3% per charge), Awe charges boost Awestruck Ward (+3%), Fury charges boost Fury Blessing (+2%), Sorrow charges boost Sorrowful Cleanse (bonus heal). At 10 charges of each, the Cleric's skills are 20-30% stronger than base.

### SK-CL-01: Joyful Mending

| Property | Value |
|----------|-------|
| Level | 1 |
| SP Cost | 6 |
| Target | SA |
| Element | — |

**Formula**: `floor(INT × 1.2 × (1 + joy_charges × 0.03) × variance)`

The Cleric's bread-and-butter heal. Reliable, low-cost, single-target. At 0 joy charges, heals for INT × 1.2. At 10 joy charges, heals for INT × 1.2 × 1.30 = INT × 1.56 — a 30% boost from emotional investment.

**Animation**: The Cleric extends one hand toward the target. Soft golden-yellow motes rise from the ground around the target, spiraling upward. The target briefly glows with warm light as the HP bar fills. The number of visible motes corresponds to joy charges (0 charges = sparse motes, 10 = a shower of golden light).

**Tactical Notes**: The most SP-efficient heal in the game. At L10, INT 41 → base heal 49 HP. With 10 joy charges: 63 HP. The Knight's 175 HP means Joyful Mending restores roughly 28-36% of the Knight's HP per cast — sufficient for most Act I encounters. In Act II+, supplement with Group Mending or items for group healing. The 6 SP cost means the Cleric can cast this 7 times on their L10 SP pool of 74 before needing a Defend turn.

---

### SK-CL-02: Sorrowful Cleanse

| Property | Value |
|----------|-------|
| Level | 3 |
| SP Cost | 8 |
| Target | SA |
| Element | — |

**Formula**: Remove one debuff from the target (Poison, Slow, Weakness, Stasis, Stun). If no debuff is present, heals for `floor(INT × 0.5 × variance)` instead. Sorrow charges add a bonus heal on successful cleanse: `sorrow_charges × 5% of target's max HP`.

The Cleric's utility skill. Stasis removal is particularly important against Preserver enemies (see [enemies-catalog.md](enemies-catalog.md)) — Stasis prevents the target from using memory-based class abilities for 2 turns, which cripples Mages and Rogues.

**Animation**: The Cleric traces a circular gesture with their staff. A ring of twilight-purple light descends over the target, passing through their body like a scanning beam. Each debuff removed produces a small purple burst as it's dissolved. If no debuff exists, the ring transforms into soft healing motes (recolored version of Joyful Mending in purple).

**Tactical Notes**: Keep this available for Preserver encounters. Stasis on the Mage disables Elemental Bolt, Memory Wave, and all spell skills — cleansing it immediately saves the party's primary damage dealer. Against non-Preserver enemies, the fallback heal makes this never feel like a wasted turn. At 10 sorrow charges vs. an L10 Knight (175 HP), the bonus heal adds 87 HP on successful cleanse — massive.

---

### SK-CL-03: Awestruck Ward

| Property | Value |
|----------|-------|
| Level | 7 |
| SP Cost | 14 |
| Target | SA |
| Element | — |

**Formula**: Shield absorbs up to `floor(INT × 0.8 × (1 + awe_charges × 0.03))` damage. Lasts 3 turns or until broken (absorbed damage exceeds shield value). Does not stack with itself (recast refreshes).

A damage absorption shield. Unlike healing, shields prevent damage before it happens — critical against boss attacks that can one-shot fragile characters. Stacks with Mage's Arcane Barrier.

**Animation**: The Cleric raises their staff and a translucent dome of aurora-green energy forms around the target. The dome has a visible HP bar (small, above the target's name). As the shield absorbs damage, the dome flickers and cracks. When it breaks, the dome shatters into green fragments.

**Tactical Notes**: At L10, INT 41 → shield absorbs 32 HP (0 charges) to 42 HP (10 charges). On the Mage with 91 HP, this effectively adds 35-46% bonus HP. Place on the Mage before boss turns. At L20, INT 74 → shield absorbs 59-76 HP — enough to survive one Mountain Drake Memory Breath (INT 12 × 1.8 = 21 damage, trivially absorbed). Scales well into endgame.

---

### SK-CL-04: Fury Blessing

| Property | Value |
|----------|-------|
| Level | 10 |
| SP Cost | 16 |
| Target | SA (cannot target self) |
| Element | — |

**Formula**: Target gains ATK +30% and INT +30% for 3 turns. Fury charges add `fury_charges × 2%` to both buffs (at 10 charges: ATK +50%, INT +50%). Cannot be self-cast — the Cleric empowers others, not themselves. Does not stack with itself (refreshes duration).

The Cleric's offensive contribution. A single-target buff that dramatically increases an ally's damage output. The "cannot self-cast" restriction reinforces the Cleric's support identity.

**Animation**: The Cleric strikes their staff on the ground, sending a wave of forge-red energy toward the target. The target is briefly wreathed in crimson flames that settle into a warm red aura. Their weapon sprite glows with the same red tint for the duration.

**Tactical Notes**: Cast on the Mage for maximum impact — at L10, Mage INT 48 + 30% = 62 → Elemental Bolt damage jumps from floor((48 × 1.8 - DEF × 0.4) × 1.0) = 80 (vs. DEF 15) to floor((62 × 1.8 - DEF × 0.4) × 1.0) = 105. That's a 31% damage increase for 16 SP. Cast on the Rogue before Foreshadow Strike for burst damage. On the Knight only if they're the primary damage dealer.

---

### SK-CL-05: Group Mending

| Property | Value |
|----------|-------|
| Level | 14 |
| SP Cost | 22 |
| Target | AA |
| Element | — |

**Formula**: `floor(INT × 0.7 × variance)` HP to all allies (including the Cleric).

Less efficient per-target than Joyful Mending (0.7× vs. 1.2× multiplier) but heals the entire party. Essential for AoE-heavy encounters. Joy charges do NOT affect Group Mending — it uses a flat multiplier. The Cleric must choose: efficient single-target or less-efficient party-wide.

**Animation**: The Cleric raises their staff overhead. A warm golden pulse radiates outward in a circle, washing over all allies simultaneously. Each ally receives a brief upward shower of golden motes (smaller and fewer than Joyful Mending's). The pulse leaves a lingering golden glow on the ground for 0.5 seconds.

**Tactical Notes**: At L14, INT ~55 → heals 38 HP per ally. Against Resonant Croak (Echo Toad AoE dealing ~25 damage to all), one Group Mending recovers the whole party. The 22 SP cost limits use — roughly 3 casts from L14's SP pool of 94 before needing SP recovery. In Act III, this is the primary response to AoE bosses like Oathbreaker's Fury enemies.

---

### SK-CL-06: Emotional Cascade

| Property | Value |
|----------|-------|
| Level | 19 |
| SP Cost | 28 |
| Target | AA |
| Element | — |

**Formula**: Remove ALL debuffs from ALL allies. Each debuff removed heals the affected ally for `floor(INT × 0.3 × variance)`.

An upgraded Sorrowful Cleanse that cleanses the entire party at once. The bonus healing per debuff makes this powerful against status-heavy encounters — a party with 4 total debuffs across members gets 4 × INT × 0.3 in total healing distributed to affected members.

**Animation**: The Cleric spins their staff in a wide arc, trailing a ring of purple-gold energy. The ring expands outward, passing through all allies. Each debuff removed produces a small implosion of purple light on the affected ally, followed by a green healing pulse. If no debuffs exist on a particular ally, the ring passes through them with a soft shimmer but no burst.

**Tactical Notes**: The counter to Preserver Captain encounters (multiple Stasis applications) and Harmony Wraith groups (Chord of Binding applies Slow to all). At L19, INT ~66 → each debuff removed heals for 19 HP. Against 3 party members each with Slow from Chord of Binding: 3 debuffs removed, 57 HP total healing distributed. The 28 SP cost is steep — use only when multiple debuffs are active.

---

### SK-CL-07: Emotional Resonance

| Property | Value |
|----------|-------|
| Level | 24 |
| SP Cost | 50 |
| Target | AA |
| Element | — |

**Formula**: Heal all allies for `floor(INT × 2.0 × variance)` HP. Grant Inspired status (+20% all stats) to all allies for 3 turns.

The Cleric's ultimate ability. Massive party-wide heal plus the strongest buff in the game. The 50 SP cost is enormous — at L24, the Cleric has ~157 SP, meaning this consumes roughly 32% of their total SP pool. Use sparingly and decisively.

**Animation**: The Cleric plants their staff and channels energy upward. Four streams of colored light (gold/joy, purple/sorrow, green/awe, red/fury) spiral up the staff and converge at its tip, forming a prismatic orb. The orb detonates in a radiant burst that fills the screen with warm light. All allies are bathed in the glow — their sprites briefly pulse with a rainbow sheen as HP bars fill rapidly. The Inspired status appears as a persistent upward spiral of multicolored motes around each ally.

**Tactical Notes**: Save for critical moments — boss phase transitions, near-wipe recovery, or the opening of a dangerous fight where the 3-turn Inspired buff maximizes party output. At L24, INT ~94 → heals for 188 HP per ally. The Mage with 210 HP is healed nearly to full. The +20% all stats for 3 turns is the equivalent of a Fury Blessing on everyone plus defensive and speed buffs. One Emotional Resonance can turn a losing battle around.

---

### Cleric Subclass: Luminary — Radiant Shepherd

Unlocks via Joy or Awe first recall. Focuses on passive sustain and auto-triggered emergency healing.

### SK-CL-L1: Radiant Aura (Passive)

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 0 (passive) |
| Target | AA (passive) |
| Element | — |

**Formula**: All allies regenerate 3% of their max HP at the end of each turn. Automatic, no SP cost, no action required. Does not activate when the Cleric is unconscious.

Persistent party-wide regeneration. At L15, this heals the Knight for ~6 HP/turn, Mage for ~3 HP/turn. Modest per-turn but adds up over a 6-8 turn fight to 18-48 HP healed per ally — the equivalent of a free Group Mending over the course of the battle.

**Animation**: A soft golden glow pulses at each ally's feet at the end of each turn. Very subtle — a gentle warmth effect, not a dramatic heal. The glow matches the Cleric's emotional charge colors (predominantly gold if joy charges are highest).

**Tactical Notes**: Makes the party substantially more durable in sustained fights. Frees the Cleric to use their action for Fury Blessing or Awestruck Ward instead of constant healing. Against bosses that deal consistent moderate damage, Radiant Aura can offset basic attack damage entirely, letting the Cleric focus on buffing.

---

### SK-CL-L2: Joyful Renewal

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 30 (auto-trigger) |
| Target | A (single ally, automatic) |
| Element | — |

**Formula**: When any ally (not the Cleric themselves) drops below 15% HP, instantly heal them to 50% HP. Does not consume the Cleric's turn. Once per battle. Requires 30 SP available when triggered.

An emergency safety net. Unlike the Knight's Unbroken Promise (self-only), this protects allies. The "not self" restriction prevents the Cleric from being their own safety net — they protect others. The SP cost mirrors Unbroken Promise's design: resource management matters.

**Animation**: When triggered, a beam of golden light shoots from the Cleric to the endangered ally. The ally's sprite flashes white, then a shower of golden motes fills their position. Their HP bar rapidly fills to the 50% mark. A chime sound plays (warm, reassuring).

**Tactical Notes**: At L15, healing the Mage from 15% to 50% of 140 HP = healing from 21 HP to 70 HP (49 HP healed). This can save a squishy ally from a follow-up attack. Keep SP above 30 in dangerous fights. Does not trigger on the Cleric — use items or Defend for self-preservation.

---

### Cleric Subclass: Crucible — Grief Channeler

Unlocks via Fury or Sorrow first recall. Converts the Cleric's healing into a hybrid healer/damage dealer.

### SK-CL-C1: Sorrow's Edge (Passive)

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 0 (passive) |
| Target | RE (passive effect) |
| Element | Dark |

**Formula**: The Cleric's healing spells (Joyful Mending, Group Mending, Emotional Resonance) also deal 30% of the heal amount as dark-element damage to a random enemy. Triggers on each heal cast.

Transforms every heal into a simultaneous attack. Joyful Mending at L15 heals for ~59 HP and deals ~17 dark damage to a random enemy. Group Mending heals all allies and hits a random enemy. This dramatically increases the Cleric's action efficiency — every turn contributes both support and offense.

**Animation**: When a healing spell resolves, a dark-purple echo of the healing energy detaches and shoots toward a random enemy. The enemy takes a brief purple flash on impact. The effect is visually distinct from the healing animation — sorrow-purple contrasting with joy-gold.

**Tactical Notes**: Enables the Cleric to contribute meaningful damage without changing playstyle. Against Void Wisps (E-SK-02, immune to dark via Absorption passive), the damage portion heals the enemy instead — avoid healing during Void Wisp encounters or accept the trade-off. Otherwise, 30% passive damage on every heal makes the Grief Channeler the most action-efficient Cleric build.

---

### SK-CL-C2: Martyrdom

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 35 |
| Target | AA (heal) / S (self-damage) |
| Element | — |

**Formula**: The Cleric sacrifices 40% of their current HP. All allies (not including the Cleric) are healed for 150% of the sacrificed amount. If this reduces the Cleric below 10% HP, the Cleric gains Inspired (+20% all stats) for 3 turns.

A powerful emergency heal that converts the Cleric's HP into party healing. At L15, Cleric HP ~175, current HP 175 → sacrifice 70 HP → heal each ally for 105 HP. If the Cleric was at 175 HP, they drop to 105 HP (60%) — safe enough. But if used at lower HP, the Inspired trigger can activate, making the Cleric a temporary powerhouse.

**Animation**: The Cleric clutches their chest as dark-purple energy drains visibly from their body. The sacrificed HP manifests as a swirling orb of purple-gold light above the Cleric. The orb explodes outward, raining healing energy on all allies. If the Inspired trigger activates, the Cleric's sprite pulses with a rainbow sheen and they stand taller.

**Tactical Notes**: Best used when the Cleric has high HP and allies are critically low. The 150% multiplier makes this more HP-efficient than any other heal — 1 HP sacrificed = 1.5 HP healed on each ally. At 3 party members: 70 HP sacrificed → 315 HP total healing (105 per ally). Compare to Emotional Resonance: heals ~120 HP each at similar level for 50 SP. Martyrdom costs HP instead of SP, making it ideal when SP is depleted. The Inspired trigger rewards deliberate low-HP play.

---

## Mage Skills — Inspired Casting

**Class Identity**: The Mage improvises spells from memory-derived elements and patterns. Unlike traditional memorized spellcasters, this Mage's repertoire grows through exploration — collecting memory fragments with different elements unlocks new spell elements. The Mage's damage is the highest in the game but their HP is the lowest.

**Memory Twist**: Elements unlock automatically when the player collects a fragment with a matching element. By mid-Act I the Mage should have 3-4 elements; by late Act II, all 7 (Fire, Water, Earth, Wind, Light, Dark, Neutral). Self-broadcasting fragments unlocks "pattern variants" that modify existing spells (see [progression.md](progression.md)).

### Element System

| Element | Unlocked By | Strong Against | Weak Against |
|---------|-------------|----------------|--------------|
| Neutral | Default (start) | Nothing | Nothing |
| Fire | Collecting a fire fragment | Earth enemies | Water enemies |
| Water | Collecting a water fragment | Fire enemies | Earth enemies |
| Earth | Collecting an earth fragment | Water, Wind enemies | Fire enemies |
| Wind | Collecting a wind fragment | — | Earth enemies |
| Light | Collecting a light fragment | Dark enemies | — |
| Dark | Collecting a dark fragment | Light enemies | — |

Element advantage applies the 1.5× elementMod from [combat.md](combat.md). Element disadvantage applies 0.5×.

### SK-MG-01: Elemental Bolt

| Property | Value |
|----------|-------|
| Level | 1 |
| SP Cost | 5 |
| Target | SE |
| Element | Player-chosen from unlocked elements |

**Formula**: `floor((INT × 1.8 - targetDEF × 0.4) × variance × elementMod)`

The Mage's primary single-target attack. The player selects the element each time they cast. This uses the standard magical damage formula — the 1.8 multiplier is the base magical multiplier. Against elemental weaknesses, damage increases by 50% (elementMod = 1.5), making element selection a meaningful tactical choice every turn.

**Animation**: The Mage raises their wand and a sphere of elemental energy coalesces at the tip — fire (orange-red flickering orb), water (swirling blue sphere), earth (brown crystalline cluster), wind (silver-white vortex), light (brilliant gold-white star), dark (purple-black void sphere), neutral (translucent amber orb). The sphere launches toward the target and detonates on impact with element-appropriate effects (fire: explosion and cinders; water: splash and ripples; earth: cracks and debris; wind: cutting gust lines; light: radiant burst; dark: implosion; neutral: amber shatter).

**Tactical Notes**: At L1 with INT 14 against Meadow Sprite (DEF 3): floor((14 × 1.8 - 3 × 0.4) × 1.0) = floor(24) = 24 damage. Compare to Knight Oath Strike at L1: floor((12 × 1.2 - 3 × 0.8) × 1.0) = floor(12) = 12. The Mage deals double damage from the start, compensated by 62% of the Knight's HP. Always exploit elemental weaknesses when possible — Thornback Beetle (E-SL-04) with DEF 10 takes floor((14 × 1.8 - 10 × 0.4) × 1.0) = 21 damage neutral, but 31 with water element (1.5×).

---

### SK-MG-02: Memory Wave

| Property | Value |
|----------|-------|
| Level | 4 |
| SP Cost | 10 |
| Target | AE |
| Element | Last collected fragment's element (before Chromatic Mastery) |

**Formula**: `floor((INT × 1.2 - targetDEF × 0.4) × variance × elementMod)` per target.

The Mage's first AoE. Hits all enemies at a reduced multiplier (1.2× vs. Elemental Bolt's 1.8×). The element is locked to the last memory fragment the player collected — the Mage channels residual emotional energy from the most recent collection. This creates a unique dynamic: the order the player collects fragments affects combat.

**Animation**: The Mage sweeps their wand in a wide arc. A wave of elemental energy expands outward from the Mage, passing through all enemies. The wave's visual matches the element (fire: spreading flame line; water: surging tidal wave; wind: horizontal slash of air). Each enemy hit produces a brief element-colored flash.

**Tactical Notes**: At L10, INT 48 against 3 Meadow Sprites (DEF 3): floor((48 × 1.2 - 3 × 0.4) × 1.0) = 56 damage each — kills all three in one cast. The 10 SP cost and AoE coverage makes this the go-to for clearing encounter groups. The locked element is usually fine (most fragments in a zone match the zone's enemies' weaknesses). In Act II, with Chromatic Mastery (Luminary), the Mage gains element choice on Memory Wave.

---

### SK-MG-03: Inspired Shield

| Property | Value |
|----------|-------|
| Level | 8 |
| SP Cost | 12 |
| Target | S |
| Element | Adaptive |

**Formula**: Self-buff. Creates a magic barrier absorbing up to `floor(INT × 0.6)` damage. Lasts 2 turns. The barrier's element adapts to the last attack that hit the Mage — if hit by a fire attack, the barrier gains fire resistance (reduces fire damage by an additional 50% while the barrier holds).

The Mage's only self-protection skill. The low-HP glass cannon needs this to survive focused attacks. The adaptive element is a reward for being attacked — taking a hit makes the Mage more resistant to follow-up attacks of the same element.

**Animation**: A translucent prismatic bubble forms around the Mage's sprite. The bubble shimmers with faint rainbow colors. When hit by an elemental attack, the bubble shifts to that element's color (fire → orange, water → blue, etc.) and solidifies briefly. When the barrier breaks, the bubble pops with a crystalline shatter.

**Tactical Notes**: At L10, INT 48 → barrier absorbs 28 damage. The Mage has 91 HP, so this effectively gives them 119 effective HP. Cast before known big hits. The adaptive resistance is most useful against boss elemental attacks — surviving one hit grants resistance to the next. Less useful against physical-only enemies (no element to adapt to). Does not stack with itself (recast replaces).

---

### SK-MG-04: Eureka Moment

| Property | Value |
|----------|-------|
| Level | 12 |
| SP Cost | 18 |
| Target | SE |
| Element | Random from unlocked elements |

**Formula**: `floor((INT × 2.5 - targetDEF × 0.4) × variance × elementMod)`

30% bonus chance to hit a weakness (even if the random element wouldn't normally match). High risk, high reward — the random element means the Mage cannot control whether they hit a weakness or resistance. The 30% weakness-override partially mitigates the randomness.

**Animation**: The Mage's eyes widen with sudden inspiration. A rapid montage of elemental symbols flickers above their head (slot-machine style). The symbols resolve to one element, which erupts from the wand in an oversized, dramatic version of the Elemental Bolt animation. If the weakness-override triggers, the bolt changes element mid-flight with a prismatic flash.

**Tactical Notes**: The Mage's highest single-target damage (2.5× mult vs. Elemental Bolt's 1.8×). At L12, INT ~55 against Frontier enemy (DEF 20): neutral = floor((55 × 2.5 - 20 × 0.4) × 1.0) = floor(129.5) = 129. With weakness: 194. Compare to Elemental Bolt: floor((55 × 1.8 - 20 × 0.4) × 1.5) = 136 (with chosen weakness). Eureka Moment has higher ceiling but lower floor. Use against single tough enemies when willing to gamble, or when the enemy has multiple weaknesses (increasing the odds of a hit). The Crucible subclass's Volatile Inspiration removes the randomness entirely.

---

### SK-MG-05: Elemental Storm

| Property | Value |
|----------|-------|
| Level | 16 |
| SP Cost | 24 |
| Target | AE |
| Element | Player-chosen |

**Formula**: `floor((INT × 1.5 - targetDEF × 0.4) × variance × elementMod)` per target. If the chosen element is super-effective against a specific target, damage to that target uses 2.0× multiplier instead: `floor((INT × 2.0 - targetDEF × 0.4) × variance × 1.5)`.

An upgraded Memory Wave with element selection and bonus damage against weak enemies. The 2.0× multiplier against weakness (vs. Elemental Bolt's 1.8×) makes this the Mage's premier AoE for exploiting weaknesses.

**Animation**: The Mage channels energy through their wand, raising it skyward. The chosen element forms a massive cloud/vortex above the battlefield (fire: firestorm; water: thunderstorm with rain; earth: meteor shower of rocks; wind: tornado; light: blinding sunburst; dark: shadow nova). The storm descends across all enemies with dramatic visual impact. Enemies weak to the chosen element get a larger, more intense hit effect.

**Tactical Notes**: At L16, INT ~66 against 3 Mountain Drakes (DEF 25, fire element → water weakness): neutral = floor((66 × 1.5 - 25 × 0.4) × 1.0) = 89 each. With water element vs. fire weakness: floor((66 × 2.0 - 25 × 0.4) × 1.5) = floor(183) = 183 each. Against a full encounter of 3 Drakes (HP 180), one Elemental Storm with the right element nearly wipes the encounter. This is the Mage's defining power spike.

---

### SK-MG-06: Arcane Barrier

| Property | Value |
|----------|-------|
| Level | 21 |
| SP Cost | 20 |
| Target | AA |
| Element | — |

**Formula**: Each ally receives a shield absorbing `floor(INT × 0.5)` damage. Lasts 2 turns. Stacks with Cleric's Awestruck Ward (separate shield pools, both must break independently).

Party-wide magic shield — the Mage's first support skill. Weaker per-target than Inspired Shield (0.5× vs. 0.6×) but protects everyone. The Awestruck Ward stacking makes the Mage-Cleric duo extremely effective at damage prevention.

**Animation**: The Mage traces a wide circle with their wand. Translucent blue-white hexagonal panels form around each ally's sprite (distinct from the Cleric's green dome — the Mage's barrier is geometric and cool-toned). Each panel has a small blue HP bar.

**Tactical Notes**: At L21, INT ~80 → shield absorbs 40 HP per ally. Across 3 party members, that's 120 total damage absorbed. Most efficient before a known AoE attack. Combined with Awestruck Ward on the squishiest ally, creates a layered defense. The 20 SP cost is reasonable for Act III — use before boss phase transitions.

---

### SK-MG-07: Grand Inspiration

| Property | Value |
|----------|-------|
| Level | 26 |
| SP Cost | 55 |
| Target | AE |
| Element | Two player-chosen elements simultaneously |

**Formula**: `floor((INT × 3.0 - targetDEF × 0.4) × variance × elementMod)` to all enemies. Enemies weak to EITHER chosen element take the full weakness multiplier (1.5×). This is the most expensive skill in the game.

The Mage's ultimate. Combines two unlocked elements into a compound spell that hits every enemy for devastating damage. The dual-element weakness check means if the Mage chooses fire + wind against a group of mixed fire-weak and wind-weak enemies, ALL of them take weakness damage.

**Animation**: Two elemental spheres orbit the Mage's wand — one per chosen element. They spiral faster, merge into a prismatic fusion orb, then the Mage hurls it skyward. The orb detonates in a spectacular dual-element explosion that fills the entire battlefield. Each element's visual effects layer over each other (fire+water = steam explosion; light+dark = prismatic implosion; earth+wind = sandstorm). The most visually dramatic skill in the game.

**Tactical Notes**: At L26, INT ~112 against Sketch enemies (DEF ~28): floor((112 × 3.0 - 28 × 0.4) × 1.5) = floor(487) = 487 damage per enemy on weakness. This one-shots most Sketch enemies (HP 90-220) and heavily damages bosses. The 55 SP cost (27% of L26 SP pool of 192) means at most 3 casts before SP depletion. Reserve for Act III boss encounters or dangerous multi-enemy groups.

---

### Mage Subclass: Luminary — Prism Weaver

Unlocks via Joy or Awe first recall. Emphasizes element mastery and tactical control.

### SK-MG-L1: Chromatic Mastery (Passive)

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 0 (passive) |
| Target | — |
| Element | — |

**Formula**: Memory Wave element is now player-chosen (previously locked to last collected fragment). Additionally, elemental weakness damage increases from 1.5× to 1.75× for all Mage spells.

Removes Memory Wave's randomness and amplifies weakness exploitation. The 1.75× modifier (vs. standard 1.5×) makes the Prism Weaver the most effective class against elemental weaknesses in the game.

**Animation**: No active animation. The Mage's wand gains a subtle prismatic shimmer visible in their idle sprite. When exploiting a weakness, the impact effect is slightly larger and more colorful.

**Tactical Notes**: Elemental Bolt with weakness now deals 1.75× instead of 1.5× — at L15, INT ~60 vs. DEF 20: floor((60 × 1.8 - 20 × 0.4) × 1.75) = floor(175) = 175 damage (vs. 150 without Chromatic Mastery). The Memory Wave element choice is transformative: the Mage can now AoE with the optimal element every turn. This is the tactical Mage build.

---

### SK-MG-L2: Spectrum Shield

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 20 |
| Target | SA |
| Element | Adaptive |

**Formula**: Shield absorbs `floor(INT × 1.0)` damage on one ally. The barrier automatically matches the element of any incoming attack (always counts as resistant — incoming damage of any element is reduced by 50% while the shield holds). Lasts 2 turns.

A stronger single-target shield (1.0× vs. Inspired Shield's 0.6×) with universal element resistance. At L15, INT 60 → absorbs 60 damage, and all incoming elemental attacks are halved while the shield holds.

**Animation**: A spinning prismatic prism hovers above the shielded ally. When an elemental attack hits, the prism rotates to the appropriate color and projects a matching-color barrier that deflects the attack. Visually distinct and dramatic.

**Tactical Notes**: Place on the Knight before boss elemental attacks for maximum value. The universal resistance makes this effective against any element — no need to predict boss attack patterns. At L20, INT 86 → absorbs 86 damage at half elemental damage. Combined with the Knight's high DEF, this makes the frontline extremely resilient.

---

### Mage Subclass: Crucible — Entropy Caster

Unlocks via Fury or Sorrow first recall. Maximizes raw damage at the cost of personal risk.

### SK-MG-C1: Volatile Inspiration (Passive)

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 0 (passive) |
| Target | — |
| Element | — |

**Formula**: Eureka Moment's random element is replaced with a guaranteed element matching the target's weakness (if one exists). If the target has no elemental weakness, Eureka Moment deals +20% bonus damage instead.

Removes Eureka Moment's randomness entirely, transforming it from a gamble into a precision strike. Against targets with weaknesses, Eureka Moment always hits weakness (2.5× mult × 1.5× element = 3.75× effective). Against targets without weaknesses, the flat +20% bonus makes it deal 3.0× effective.

**Animation**: Same as Eureka Moment, but the elemental symbol montage is replaced by a single decisive symbol that locks in immediately — no spinning, just instant knowledge. The bolt changes color mid-flight to match the target's weakness.

**Tactical Notes**: Transforms Eureka Moment into the Mage's best single-target damage skill. At L15, INT ~60 vs. DEF 20 with weakness: floor((60 × 2.5 - 20 × 0.4) × 1.5) = floor(213) = 213 damage. Without weakness: floor((60 × 2.5 × 1.2 - 20 × 0.4) × 1.0) = floor(172) = 172. Compare to Elemental Bolt with weakness: floor((60 × 1.8 - 20 × 0.4) × 1.5) = 150. Volatile Inspiration makes Eureka Moment strictly better than Elemental Bolt for single-target damage, but at 18 SP vs. 5 SP — use Elemental Bolt for SP-efficient clearing, Eureka Moment for priority targets.

---

### SK-MG-C2: Annihilation

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 60 |
| Target | SE |
| Element | Neutral (ignores elemental modifiers) |

**Formula**: `floor(INT × 4.0)` damage to one target. **Ignores DEF entirely.** The Mage takes 15% of the damage dealt as recoil (self-damage that bypasses shields).

The single highest-damage skill in the game. The DEF-ignoring property makes this devastating against high-DEF bosses (Stone Guardians, Mountain Drakes, Wireframe Drakes). The recoil is dangerous on a class with the lowest HP.

**Animation**: The Mage raises both hands (wand floats mid-air). A sphere of pure white energy forms between their palms, growing rapidly. The sphere compresses to a point, then fires as a beam that engulfs the target in blinding light. The screen flashes white. The Mage staggers backward, taking visible recoil damage with a red flash on their sprite. The most cinematically dramatic skill animation.

**Tactical Notes**: At L20, INT 86: damage = floor(86 × 4.0) = 344 ignoring DEF. Recoil = 51 damage to the Mage (who has 161 HP at L20). Two casts would deal 688 total damage but leave the Mage at 59 HP. Against bosses (HP 800-1500), this is the premier damage option. At L30, INT 124: damage = 496, recoil = 74 (Mage has 231 HP — survivable for 3 casts). The 60 SP cost limits use to 3 casts from the L30 SP pool of 204. Pair with Cleric healing to sustain repeated use.

---

## Rogue Skills — Foreshadow

**Class Identity**: The Rogue perceives future echoes of memories not yet formed — brief glimpses of what enemies are about to do. This grants preemptive strikes, perfect dodges, and devastating ambushes. The Rogue controls the tempo of combat through speed and prediction.

**Memory Twist**: Self-broadcasting fragments improves detection range (+2% per joy fragment), critical hit chance (+1% per fury fragment), dodge chance (+1% per sorrow fragment, beyond Echo Dodge formula), and Memory Theft effectiveness (+2% per awe fragment). A fully invested Rogue becomes nearly untouchable against single targets, balanced by vulnerability to AoE (see [progression.md](progression.md)).

### SK-RG-01: Foreshadow Strike

| Property | Value |
|----------|-------|
| Level | 1 |
| SP Cost | 0 |
| Target | SE |
| Element | Neutral (weapon element if applicable) |

**Formula**:
- If target has NOT acted this turn: `floor((ATK × 1.8 - targetDEF × 0.8) × variance × elementMod)`
- If target HAS acted this turn: `floor((ATK × 1.3 - targetDEF × 0.8) × variance × elementMod)`

The Rogue's basic attack command (replaces generic Attack). Deals bonus damage when the Rogue acts before the target — the Rogue reads the "shadow" of the enemy's intended action and strikes the opening. With the Rogue's highest AGI, the pre-enemy bonus triggers frequently. The gap between 1.8× (pre-enemy) and 1.3× (post-enemy) creates a meaningful speed incentive.

**Animation**: Pre-enemy: the Rogue dashes forward in a blur, leaving an afterimage trail (2-3 translucent copies of their sprite). The strike connects before the afterimages fade. Post-enemy: a standard quick slash with a single afterimage. Both produce amber sparks at the strike point, but the pre-enemy version has a brighter, more dramatic effect.

**Tactical Notes**: At L1, ATK 10 against Meadow Sprite (DEF 3): pre-enemy = floor((10 × 1.8 - 3 × 0.8) × 1.0) = floor(15.6) = 15. Post-enemy = floor((10 × 1.3 - 3 × 0.8) × 1.0) = floor(10.6) = 10. At L10 (ATK 32) vs. DEF 15: pre-enemy = 45, post-enemy = 29. The pre-enemy bonus is the Rogue's defining damage mechanic — always prioritize AGI (the Rogue has the highest base AGI in the game at every level). Against Highland Hawks (AGI 18), the Rogue at L5 (AGI ~19) barely outraces them — a tight but winnable speed check.

---

### SK-RG-02: Echo Dodge (Passive)

| Property | Value |
|----------|-------|
| Level | 3 |
| SP Cost | 0 (passive) |
| Target | S (passive) |
| Element | — |

**Formula**: `evasion_chance = min(0.60, 0.15 + 0.02 × (level - 1)) + memory_dodge_bonus`

Where `memory_dodge_bonus` is accumulated from self-broadcasting sorrow fragments (+1% each, uncapped but practically limited by fragment supply). At L3: 19% evasion. At L10: 33%. At L20: 53%. At L30: 60% (cap). With 10 sorrow self-broadcasts: cap becomes 70% (but the formula cap is 60%, so the memory bonus allows exceeding the level-based cap).

Bosses with guaranteed-hit attacks bypass Echo Dodge entirely.

**Animation**: When Echo Dodge triggers, the Rogue's sprite briefly splits into 2-3 transparent afterimages that scatter in different directions. The attack visually passes through one of the afterimages while the real Rogue reappears unharmed at their original position. A brief "missed!" text appears above the attack.

**Tactical Notes**: The Rogue's primary survival tool. At L10 with 33% evasion, roughly 1 in 3 attacks misses — equivalent to 33% damage reduction on average. Against multi-hit enemies (Phantom Flurry-style attacks), each hit rolls independently. Against AoE attacks, Echo Dodge does NOT trigger (AoE bypasses evasion). This is the Rogue's key vulnerability — prioritize killing AoE enemies.

---

### SK-RG-03: Shadow Step

| Property | Value |
|----------|-------|
| Level | 6 |
| SP Cost | 10 |
| Target | SE |
| Element | — |

**Formula**: No direct damage. Teleport behind one enemy. The next attack against this enemy (by any party member, this turn only) is guaranteed to hit and deals +25% bonus damage. The guaranteed hit bypasses evasion-type effects (Flicker Phase, Evasive Climb, etc.).

A setup skill that enables burst combos. The +25% damage bonus and guaranteed hit make this ideal for setting up the Knight's Oathbreaker's Gambit or the Mage's Eureka Moment against elusive enemies.

**Animation**: The Rogue dissolves into a dark silhouette, leaves a brief afterimage at their position, and reappears behind the targeted enemy in a crouching pose. A targeting reticle appears above the enemy with a glowing amber ring — the "exposed" indicator visible to the player for the remainder of the turn.

**Tactical Notes**: Critical against Highland Hawks (Evasive Climb), Phantom Foxes (Flicker Phase), and Flicker Wisps (Flicker Fade). Shadow Step's guaranteed hit bypasses all evasion mechanics. At L10, Shadow Step + Mage Elemental Bolt with weakness: floor((48 × 1.8 - 6 × 0.4) × 1.25 × 1.5) = floor(195) = 195 damage in one combo turn. The 10 SP cost is the Rogue's most common SP expenditure.

---

### SK-RG-04: Memory Theft

| Property | Value |
|----------|-------|
| Level | 10 |
| SP Cost | 14 |
| Target | SE |
| Element | Neutral |

**Formula**: `floor((ATK × 1.0 - targetDEF × 0.8) × variance)` damage. On hit, reduces the enemy's highest stat by 10% for 3 turns and grants the Rogue +10% to the corresponding stat for 3 turns. Against bosses: stat reduction is 5% and buff is +5%.

A debuff/buff hybrid that steals enemy power. The stat stolen is always the enemy's highest stat — against an ATK-focused enemy, the Rogue steals ATK. Against an INT-focused caster, the Rogue steals INT (less useful for a physical class, but the enemy debuff still matters).

**Animation**: The Rogue strikes the enemy and pulls back with a glowing amber thread connecting their hand to the enemy. The thread snaps, and a small colored orb (matching the stolen stat's color — red for ATK, blue for INT, grey for DEF, green for AGI) flies from the enemy to the Rogue. The enemy's sprite briefly dims while the Rogue's brightens.

**Tactical Notes**: At L10, ATK 32 vs. DEF 15: floor((32 × 1.0 - 15 × 0.8) × 1.0) = 20 damage + stat steal. Against Mountain Drake (ATK 25): steals 2 ATK from the Drake and gains +2 ATK → Drake ATK becomes 23, Rogue ATK becomes 34 for 3 turns. Modest but meaningful in sustained fights. Most powerful against bosses with extreme stats — stealing 5% of a boss's 35 ATK reduces it to 33 while the Rogue gains +1 ATK.

---

### SK-RG-05: Phantom Flurry

| Property | Value |
|----------|-------|
| Level | 15 |
| SP Cost | 20 |
| Target | SE (3 hits) |
| Element | Neutral (weapon element if applicable) |

**Formula**: 3 independent hits, each dealing `floor((ATK × 0.6 - targetDEF × 0.8) × variance × elementMod)`. Each hit rolls accuracy independently (can miss individually). If all 3 connect, inflict Weakness (DEF -30%) for 2 turns.

The Rogue's multi-hit skill. Total potential damage is ATK × 1.8 (3 × 0.6), matching pre-enemy Foreshadow Strike but distributed across hits. The Weakness debuff on full-connect is powerful — setting up the Knight or Mage for increased damage.

**Animation**: The Rogue becomes a blur of afterimages, striking three times in rapid succession from different angles — left, right, overhead. Each hit produces a flash of amber light. If all 3 connect, the target staggers and a downward purple-grey spiral indicates the Weakness debuff.

**Tactical Notes**: At L15, ATK ~56 vs. DEF 25: per hit = floor((56 × 0.6 - 25 × 0.8) × 1.0) = floor(13.6) = 13 damage × 3 = 39 total. Lower than Foreshadow Strike pre-enemy (floor((56 × 1.8 - 25 × 0.8) × 1.0) = 80). The value is in the Weakness application — a -30% DEF debuff on a DEF 25 enemy reduces DEF to 17, increasing all subsequent physical damage by ~6 per hit. Best used to set up the next turn's attacks. Against low-DEF enemies, Foreshadow Strike is usually better.

---

### SK-RG-06: Vanishing Act

| Property | Value |
|----------|-------|
| Level | 20 |
| SP Cost | 22 |
| Target | S |
| Element | — |

**Formula**: Self-buff. Invisible for 2 turns. While invisible: immune to single-target attacks (physical and magical). Next attack from invisibility deals double damage (2.0× multiplier applied to the full damage formula). Breaking invisibility occurs when the Rogue attacks. AoE attacks still hit the invisible Rogue.

The Rogue's stealth mechanic. Provides 2 turns of single-target immunity and a guaranteed double-damage strike. The AoE vulnerability prevents Vanishing Act from being a free invincibility button.

**Animation**: The Rogue fades to near-transparency, leaving only a faint shimmer outline. Their sprite becomes translucent with a slight blur effect. Single-target attacks aimed at the Rogue visibly pass through the shimmer. When the Rogue attacks from invisibility, they rematerialize mid-strike with a dramatic flash.

**Tactical Notes**: At L20, ATK 57. Breaking invisibility with Foreshadow Strike pre-enemy: floor((57 × 1.8 × 2.0 - 30 × 0.8) × 1.0) = floor(181) = 181 damage. That's the Rogue's highest non-ultimate damage. The 2-turn invisibility means the Rogue can also wait for the optimal moment — use it to stall during a dangerous boss phase, then emerge with a devastating hit. Against AoE-heavy enemies (Harmony Wraiths, boss AoE phases), Vanishing Act is less effective.

---

### SK-RG-07: Temporal Ambush

| Property | Value |
|----------|-------|
| Level | 26 |
| SP Cost | 45 |
| Target | S (affects action count) |
| Element | — |

**Formula**: The Rogue acts twice this turn. Both actions can be any skill or attack. The second action occurs immediately after the first (no enemy turns between them). Both actions consume SP independently if they cost SP.

The Rogue's ultimate. Two actions in one turn enables devastating combos: Shadow Step + Foreshadow Strike (guaranteed hit + pre-enemy + setup bonus), Phantom Flurry + Phantom Flurry (6 hits for Weakness application), or Vanishing Act + immediate follow-up on the next turn. The 45 SP cost limits use.

**Animation**: A "time ripple" effect appears around the Rogue — concentric amber rings pulsing outward. The Rogue's sprite briefly doubles (two overlapping versions offset by a few pixels). The first action plays normally. The second action plays with a faint amber afterglow trailing each movement. After both actions resolve, the doubles merge back.

**Tactical Notes**: The premier "kill this target NOW" skill. At L26, ATK ~75. Temporal Ambush → Shadow Step + Foreshadow Strike pre-enemy: floor((75 × 1.8 × 1.25 - 35 × 0.8) × 1.0) = floor(140.5) = 140 damage. Then Foreshadow Strike pre-enemy with weapon bonus: another 107+ damage. Total: ~247 damage in one turn. Against Act III enemies (HP 90-220), this one-turn-kills most targets. Against bosses, combine with party buffs (Fury Blessing, Remembered Valor) for burst windows.

---

### Rogue Subclass: Luminary — Phantom Guide

Unlocks via Joy or Awe first recall. Extends the Rogue's evasion and foresight to protect the party.

### SK-RG-L1: Shared Foresight (Passive)

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 0 (passive) |
| Target | AA (passive) |
| Element | — |

**Formula**: Echo Dodge's evasion bonus now applies to all allies at half effectiveness. At L15, Rogue evasion = 43% → allies gain 21% evasion. Maximum party evasion from this source: 30% (when Rogue reaches 60% cap).

Transforms the Rogue from a selfish dodger into a party-wide evasion buffer. 21-30% party evasion is significant — roughly 1 in 4-5 attacks against any ally misses.

**Animation**: Faint afterimage silhouettes of the Rogue appear near each ally — barely visible ghosts that mirror the ally's movements. When an ally dodges due to Shared Foresight, the Rogue's afterimage near that ally visibly deflects the attack.

**Tactical Notes**: Combined with the Knight's high HP and the Cleric's healing, party-wide evasion creates a durable team. Against physical-heavy encounters, the party effectively takes 21-30% less damage on average. AoE attacks bypass evasion, maintaining the Rogue's key vulnerability. Stacks with Mage's Arcane Barrier (the barrier only triggers on attacks that HIT).

---

### SK-RG-L2: Memory Link

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 18 |
| Target | S (counter-attack trigger) |
| Element | Neutral |

**Formula**: For 3 turns, whenever the Rogue successfully evades an attack via Echo Dodge, the attacker takes `floor((ATK × 0.8 - attackerDEF × 0.8) × variance)` counter-attack damage. Triggers on each dodge.

Turns the Rogue's evasion into an offensive tool. At L15 with 43% evasion, the Rogue dodges ~43% of single-target attacks, each triggering a counter-attack. Over 3 turns with ~6 incoming attacks, expect ~2-3 counter-attacks.

**Animation**: When activated, amber threads of light extend from the Rogue to each enemy (faint, web-like). When Echo Dodge triggers during Memory Link, the amber thread to the dodged attacker pulses brightly, and a spectral version of the Rogue strikes the attacker from behind.

**Tactical Notes**: Best against multi-attack enemies or encounters with many enemies targeting the Rogue. At L15, ATK ~50 vs. enemy DEF 20: counter-attack = floor((50 × 0.8 - 20 × 0.8) × 1.0) = floor(24) = 24 damage per dodge. Over 3 turns with ~3 dodges: 72 bonus damage for 18 SP — good efficiency. Less useful against bosses with guaranteed-hit attacks (bypass Echo Dodge entirely).

---

### Rogue Subclass: Crucible — Chrono Striker

Unlocks via Fury or Sorrow first recall. Maximizes burst damage and action advantage.

### SK-RG-C1: Time Scar (Passive)

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 0 (passive) |
| Target | — |
| Element | — |

**Formula**: Foreshadow Strike's pre-enemy multiplier increases from 1.8× to 2.2×. Additionally, enemies hit by Foreshadow Strike have AGI reduced by 15% for 2 turns (making them act later in subsequent turns).

Amplifies the Rogue's core damage skill and adds AGI disruption. The 2.2× pre-enemy multiplier makes Foreshadow Strike comparable to Eureka Moment's damage (but with no randomness and 0 SP cost). The AGI reduction cascades: slower enemies are easier to outspeed on subsequent turns.

**Animation**: Foreshadow Strike's pre-enemy version gains a crimson edge to the amber afterimage trail. On impact, a clock-like symbol briefly appears over the target, its hands spinning backward before dissolving. The target's movement animations visibly slow for the duration of the AGI debuff.

**Tactical Notes**: At L15, ATK ~50 vs. DEF 25: pre-enemy = floor((50 × 2.2 - 25 × 0.8) × 1.0) = floor(90) = 90 damage (0 SP). Compare to base Foreshadow Strike: floor((50 × 1.8 - 25 × 0.8) × 1.0) = floor(70) = 70. A 29% damage increase on every basic attack. The AGI debuff is subtle but powerful — reducing a Phantom Fox's AGI 28 by 15% drops it to 23, potentially letting a slower party member act before it.

---

### SK-RG-C2: Infinite Ambush

| Property | Value |
|----------|-------|
| Level | Subclass unlock |
| SP Cost | 55 |
| Target | S (affects action count) |
| Element | — |

**Formula**: The Rogue acts THREE times this turn instead of two. Each action can be any skill or attack. If all three actions target the same enemy, the third action deals +50% bonus damage.

An upgraded Temporal Ambush with an extra action and a same-target bonus. Three Foreshadow Strikes on the same target (all pre-enemy, since they all resolve before the enemy acts) with the +50% third-hit bonus delivers devastating burst damage.

**Animation**: Three overlapping time ripples instead of two. The Rogue's sprite triples briefly. All three actions play in rapid succession with increasing amber intensity — the third action has a bright crimson-gold flash on impact if it targets the same enemy as the first two.

**Tactical Notes**: At L20, ATK 57 vs. DEF 30. Three Foreshadow Strikes pre-enemy with Time Scar (2.2× mult): first two = floor((57 × 2.2 - 30 × 0.8) × 1.0) = floor(101.4) = 101 each. Third = 101 × 1.5 = 151. Total: 353 damage in one turn. This rivals the Mage's Annihilation (344 at L20) but costs 55 SP vs. 60 SP and doesn't deal recoil. The Chrono Striker Rogue is the game's premier single-target burst class.

---

## Companion Simplified Skill Sets

Companions use 3 simplified skills each. Their stats follow the same class formulas at a lower level (1-2 levels behind the player). Companions do NOT have subclass skills or memory-based progression. See [progression.md](progression.md) for companion stat tables and availability.

### Hana (Cleric) — Joins Act I Scene 3, Leaves Act I Climax

| Skill | SP Cost | Target | Formula | Notes |
|-------|---------|--------|---------|-------|
| **Gentle Mending** | 5 | SA | `floor(INT × 1.0 × variance)` | Simplified Joyful Mending (no charge scaling). Slightly weaker but reliable. |
| **Calm Cleanse** | 7 | SA | Remove one debuff. No fallback heal. | Simplified Sorrowful Cleanse. Critical for Act I Preserver encounters. |
| **Warm Ward** | 12 | SA | Shield absorbing `floor(INT × 0.6)` for 2 turns. | Simplified Awestruck Ward. Hana's most valuable Act I contribution. |

**Animation**: Hana's animations are gentler versions of the Cleric's — softer glow, smaller particle effects. Her healing motes are pale blue-white rather than golden, reflecting her calm temperament.

---

### Artun (Mage) — Joins Act II Scene 2, Permanent

| Skill | SP Cost | Target | Formula | Notes |
|-------|---------|--------|---------|-------|
| **Memory Spark** | 4 | SE | `floor((INT × 1.5 - targetDEF × 0.4) × variance × elementMod)` | Simplified Elemental Bolt (1.5× vs. 1.8×). Element = neutral only (Artun is a historian, not an elementalist). |
| **Lore Shield** | 10 | SA | Shield absorbing `floor(INT × 0.5)` for 2 turns. | Simplified Arcane Barrier, single target. |
| **Archive Blast** | 16 | AE | `floor((INT × 1.0 - targetDEF × 0.4) × variance)` | Simplified Memory Wave. Always neutral element. |

**Animation**: Artun's spells manifest as glowing pages and text rather than pure elemental energy — reflecting his scholarly approach. Memory Spark fires a spinning book page that explodes on impact. Lore Shield creates a dome of swirling manuscript pages. Archive Blast sends a wave of illuminated text across all enemies.

---

### Nel (Knight) — Joins Act II Scene 8, Permanent

| Skill | SP Cost | Target | Formula | Notes |
|-------|---------|--------|---------|-------|
| **Ridge Strike** | 0 | SE | `floor((ATK × 1.4 - targetDEF × 0.8) × variance)` | Simplified Oath Strike (flat 1.4× mult, no oath scaling). |
| **Mountain Guard** | 8 | SA | Redirect 40% of damage from chosen ally to Nel for 1 turn. | Simplified Guardian's Shield (40% vs. 50%). |
| **Rally Cry** | 15 | AA | All allies ATK +15% for 2 turns. | Simplified Remembered Valor (shorter duration, lower buff). |

**Animation**: Nel's animations are rougher and more kinetic than the player Knight — she's a frontier fighter, not a trained oath-keeper. Ridge Strike has a wide horizontal slash with rock-chip particles. Mountain Guard shows her physically stepping in front of the ally. Rally Cry has her raising her sword with a visible shockwave.

---

## Skill Damage Output Validation

The following tables verify that skill damage is balanced against enemy HP values from [enemies-catalog.md](enemies-catalog.md) at each act boundary.

### Act I: Level 10 vs. Settled Lands Enemies (DEF 3-15)

| Skill | Class | Damage vs. DEF 3 | Damage vs. DEF 15 | Enemy HP Range |
|-------|-------|-------------------|---------------------|----------------|
| Oath Strike (3 oaths) | Knight | floor((41 × 1.38 - 3 × 0.8)) = 54 | floor((41 × 1.38 - 15 × 0.8)) = 44 | 30-80 |
| Foreshadow Strike (pre) | Rogue | floor((32 × 1.8 - 3 × 0.8)) = 55 | floor((32 × 1.8 - 15 × 0.8)) = 45 | 30-80 |
| Elemental Bolt (neutral) | Mage | floor((48 × 1.8 - 3 × 0.4)) = 85 | floor((48 × 1.8 - 15 × 0.4)) = 80 | 30-80 |
| Elemental Bolt (weakness) | Mage | 127 | 120 | 30-80 |
| Joyful Mending (0 charges) | Cleric | — | — | Heals 49 HP |

**Analysis**: The Mage one-shots most Act I enemies. The Knight and Rogue need 2-3 hits for standard enemies and 3-5 hits for the Crag Golem (HP 80, DEF 15). This is consistent with the 2-4 hits design target from [enemies-catalog.md](enemies-catalog.md).

### Act II: Level 16 vs. Frontier Enemies (DEF 12-32)

| Skill | Class | Damage vs. DEF 20 | Damage vs. DEF 32 | Enemy HP Range |
|-------|-------|---------------------|---------------------|----------------|
| Oath Strike (5 oaths) | Knight | floor((56 × 1.5 - 20 × 0.8)) = 68 | floor((56 × 1.5 - 32 × 0.8)) = 58 | 70-180 |
| Oathbreaker's Gambit | Knight | floor((56 × 3.0 - 20 × 0.8)) = 152 | floor((56 × 3.0 - 32 × 0.8)) = 142 | 70-180 |
| Foreshadow Strike (pre) | Rogue | floor((44 × 1.8 - 20 × 0.8)) = 63 | floor((44 × 1.8 - 32 × 0.8)) = 53 | 70-180 |
| Elemental Storm (weakness) | Mage | floor((66 × 2.0 - 20 × 0.4) × 1.5) = 186 | floor((66 × 2.0 - 32 × 0.4) × 1.5) = 179 | 70-180 |
| Group Mending | Cleric | — | — | Heals 46 HP each |
| Fury Blessing on Rogue | Cleric | +13 ATK → +19 damage per Rogue hit | — | — |

**Analysis**: Elemental Storm with weakness one-shots most Frontier enemies. The Knight needs 2-3 Oath Strikes for standard enemies. Oathbreaker's Gambit can one-shot enemies up to HP 152 but costs an oath. The Rogue needs 2-3 Foreshadow Strikes. The Cleric's Fury Blessing on the Rogue adds ~19 damage per hit — meaningful in 3-hit kills.

### Act III: Level 25 vs. Sketch/Endgame Enemies (DEF 20-35)

| Skill | Class | Damage vs. DEF 28 | Damage vs. DEF 35 | Enemy HP Range |
|-------|-------|---------------------|---------------------|----------------|
| Oath Strike (5 oaths) | Knight | floor((95 × 1.5 - 28 × 0.8)) = 120 | floor((95 × 1.5 - 35 × 0.8)) = 114 | 90-250 |
| Steadfast Wall | Knight | Absorbs all ST physical for 1 turn | — | Defensive |
| Temporal Ambush → 2× FS(pre) | Rogue | 2 × floor((70 × 1.8 - 28 × 0.8)) = 2 × 103 = 206 | 2 × floor((70 × 1.8 - 35 × 0.8)) = 2 × 98 = 196 | 90-250 |
| Grand Inspiration (weakness) | Mage | floor((104 × 3.0 - 28 × 0.4) × 1.5) = 451 | floor((104 × 3.0 - 35 × 0.4) × 1.5) = 447 | 90-250 |
| Annihilation | Mage | floor(104 × 4.0) = 416 (ignores DEF) | 416 | 90-250 |
| Emotional Resonance | Cleric | — | — | Heals 176 HP each + Inspired |

**Analysis**: Grand Inspiration one-shots all Sketch enemies. Annihilation deals 416 damage ignoring DEF — devastating against high-DEF bosses. Temporal Ambush delivers 196-206 burst damage. The Knight's Oath Strike deals 114-120 per swing, requiring 2-3 hits for most enemies. No single skill dominates all situations: Grand Inspiration is limited by SP cost (55), Annihilation has recoil, Temporal Ambush requires the Rogue to survive to use it, and Emotional Resonance is healing, not damage.

---

## Skill Balance Summary

### No Single Skill Dominates

| Situation | Best Skill | Why Others Don't Work |
|-----------|-----------|----------------------|
| Single tough boss | Annihilation (Mage) | Rogue burst needs setup; Knight is slow |
| Group of 3-4 enemies | Elemental Storm (Mage) or Oathbreaker's Fury (Knight) | Rogue is single-target; Cleric can't AoE damage |
| Party near death | Emotional Resonance (Cleric) | Others can't heal the party |
| High-DEF enemy | Elemental Bolt (Mage) | Physical classes bounce off high DEF |
| Stasis-heavy encounter | Sorrowful Cleanse / Emotional Cascade (Cleric) | Only Cleric can remove Stasis |
| Speed-critical fight | Temporal Ambush (Rogue) | Others can't act twice |
| Sustained dungeon crawl | Joyful Mending (Cleric) + Oath Strike (Knight) | SP-efficient and reliable |
| Protect squishy Mage | Guardian's Shield / Steadfast Wall (Knight) | Only Knight can redirect damage |
| Exploit weakness | Chromatic Mastery + Elemental Storm (Prism Weaver Mage) | Other classes have no element selection |

### SP Economy Balance

| Class | L10 SP Pool | Signature Skill Cost | Casts Before Empty |
|-------|-------------|---------------------|-------------------|
| Knight | 43 | Remembered Valor: 18 | 2 casts + basic attacks |
| Cleric | 74 | Joyful Mending: 6 | 12 casts |
| Mage | 84 | Elemental Bolt: 5, Storm: 24 | 16 Bolts OR 3 Storms |
| Rogue | 60 | Shadow Step: 10, Flurry: 20 | 6 Steps OR 3 Flurries |

The Knight has the smallest SP pool but the most 0-cost skills (Oath Strike, Unbroken Promise auto). The Cleric has the second-highest SP and the most SP-efficient skills. The Mage has the highest SP pool but the most expensive skills. The Rogue has moderate SP with a mix of free and paid skills.

---

## Status Effects Applied by Skills

Cross-referencing [combat.md](combat.md) status table with all skill-applied statuses:

| Status | Effect | Duration | Applied By | Cured By |
|--------|--------|----------|-----------|----------|
| Weakness | DEF -30% | 2-3 turns | Phantom Flurry (3-hit connect) | Defend action |
| Inspired | +20% all stats | 2-3 turns | Emotional Resonance, Martyrdom (self) | Natural expiry |
| Slow (from AGI debuff) | AGI -15% | 2 turns | Time Scar (passive on FS hit) | Natural expiry |
| Shield (various) | Absorbs X damage | 2-3 turns | Awestruck Ward, Inspired Shield, Arcane Barrier, Spectrum Shield, Vortis's Orbit | Breaks on absorption |
| Invisible | Immune to ST attacks | 2 turns | Vanishing Act | Breaks on attack |
| ATK/DEF/INT buff | +X% to stat | 2-3 turns | Remembered Valor, Fury Blessing, Shared Valor, Vow of Steel | Natural expiry |
| Redirecting | Absorbs ally damage | 1 turn | Guardian's Shield, Steadfast Wall | Natural expiry |

Note: Stasis (can't use memory-based abilities, 2 turns) is inflicted by Preserver enemies only — no player skill inflicts Stasis.
