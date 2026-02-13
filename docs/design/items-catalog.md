# Items Catalog: Complete Inventory

> Cross-references: [docs/design/progression.md](progression.md), [docs/design/combat.md](combat.md), [docs/design/classes.md](classes.md), [docs/design/memory-system.md](memory-system.md), [docs/world/vibrancy-system.md](../world/vibrancy-system.md), [docs/world/geography.md](../world/geography.md), [docs/world/dormant-gods.md](../world/dormant-gods.md)

## Overview

Every item in the game is listed here with exact stats, prices, and acquisition methods. Items are organized into five categories: **Weapons**, **Armor**, **Consumables**, **Key Items**, and **Memory Fragments** (named/unique).

### Equipment Rules

- Each character can equip **1 weapon** and **1 armor piece** at a time.
- Weapons add flat ATK or INT to the character's base stats. Armor adds flat DEF.
- Equipment is **class-restricted**: Knights use swords, Clerics use staves, Mages use wands, Rogues use daggers.
- Companions use simplified equipment — they auto-equip the best available gear for their class. The player does not manually manage companion equipment.
- Sell price = 50% of buy price (rounded down) for all items.

### Shop Tiers

Shop inventories are gated by the local zone's vibrancy tier (see [vibrancy-system.md](../world/vibrancy-system.md)):

| Tier | Shops Available | Inventory Level |
|------|----------------|-----------------|
| Muted (0-33) | Limited stock | Tier 1 items only |
| Normal (34-66) | Standard stock | Tier 1 + Tier 2 items |
| Vivid (67-100) | Full stock | Tier 1 + Tier 2 + Tier 3 items |

---

## Weapons

### Swords (Knight Only)

| ID | Name | ATK | Price | Special Effect | Acquisition | Tier |
|----|------|-----|-------|----------------|-------------|------|
| W-SW-01 | Training Sword | +5 | — | None | Starting equipment | 1 |
| W-SW-02 | Iron Blade | +10 | 80g | None | Torvan's Blacksmith (Village Hub) | 1 |
| W-SW-03 | Oathkeeper's Edge | +16 | 250g | +5% Oath Strike damage | Torvan's Blacksmith (Normal vibrancy) | 2 |
| W-SW-04 | Brightwater Saber | +22 | 400g | Water element on basic attacks | Millbrook specialty shop | 2 |
| W-SW-05 | Ridgewalker Claymore | +28 | 600g | +10% ATK when HP above 75% | Ridgewalker Camp merchant | 2 |
| W-SW-06 | Frontier Greatsword | +35 | 900g | +15% damage vs. Preserver enemies | Torvan's Blacksmith (Vivid vibrancy) | 3 |
| W-SW-07 | Oath-Forged Blade | +42 | — | +3% ATK per active oath. Oath Strike costs 0 SP. | Quest reward: Knight oath chain (Act II) | 3 |
| W-SW-08 | Memory's Edge | +50 | — | ATK scales with total fragments collected (+1 ATK per 5 fragments, max +12). | Depths Level 4 treasure chest | 3 |

### Staves (Cleric Only)

| ID | Name | INT | Price | Special Effect | Acquisition | Tier |
|----|------|-----|-------|----------------|-------------|------|
| W-ST-01 | Wooden Staff | +4 | — | None | Starting equipment | 1 |
| W-ST-02 | Maren's Blessing Rod | +8 | 70g | +5% healing power | Maren's General Shop (Village Hub) | 1 |
| W-ST-03 | Hearthstone Staff | +14 | 220g | Sorrowful Cleanse also heals INT × 0.3 | Ambergrove (Hearthstone Circle loot) | 2 |
| W-ST-04 | Riverside Crosier | +20 | 380g | +10% shield strength (Awestruck Ward) | Millbrook specialty shop | 2 |
| W-ST-05 | Marsh Hermit's Crook | +26 | — | SP cost of all heals reduced by 15% | Quest reward from Wynn (Shimmer Marsh) | 2 |
| W-ST-06 | Luminary's Scepter | +33 | 850g | Group Mending heals +20% more. | Torvan's Blacksmith (Vivid vibrancy) | 3 |
| W-ST-07 | Euphoric Wand | +40 | — | Emotional charges grant +5% each (doubled from base +3%). | Quest reward: Cleric charge quest (Act II) | 3 |
| W-ST-08 | First Light | +48 | — | Healing spells also grant Inspired (+20% all stats, 1 turn) to the target. | Depths Level 5 treasure chest | 3 |

### Wands (Mage Only)

| ID | Name | INT | Price | Special Effect | Acquisition | Tier |
|----|------|-----|-------|----------------|-------------|------|
| W-WD-01 | Apprentice Wand | +5 | — | None | Starting equipment | 1 |
| W-WD-02 | Amber Focus | +9 | 90g | +5% spell damage | Maren's General Shop (Village Hub) | 1 |
| W-WD-03 | Windcatcher Rod | +15 | 240g | Wind-element spells deal +15% damage | Ambergrove (Canopy Path treasure) | 2 |
| W-WD-04 | Prism Wand | +21 | 420g | Eureka Moment always hits weakness if one exists | Flickerveil (Flickering Village shop) | 2 |
| W-WD-05 | Resonance Tuner | +27 | 650g | Memory Wave AoE radius includes back-row enemies | Resonance Fields (Listener's Camp) | 2 |
| W-WD-06 | Arcane Catalyst | +34 | 950g | Elemental Storm damage +20% | Torvan's Blacksmith (Vivid vibrancy) | 3 |
| W-WD-07 | Inspiration's Core | +41 | — | Grand Inspiration costs 40 SP instead of 55. | Quest reward: Mage element mastery (Act II) | 3 |
| W-WD-08 | Dissolved Memory Lens | +49 | — | All spell damage +10%. Spells that hit a weakness deal 2.0x instead of 1.5x. | Depths Level 5 treasure chest | 3 |

### Daggers (Rogue Only)

| ID | Name | ATK | Price | Special Effect | Acquisition | Tier |
|----|------|-----|-------|----------------|-------------|------|
| W-DG-01 | Worn Knife | +4 | — | None | Starting equipment | 1 |
| W-DG-02 | Steel Stiletto | +8 | 75g | None | Torvan's Blacksmith (Village Hub) | 1 |
| W-DG-03 | Windmill Blade | +13 | 200g | +10% critical hit chance | Heartfield (Old Windmill loot) | 2 |
| W-DG-04 | Shadow Fang | +19 | 350g | Foreshadow Strike pre-enemy bonus increased by +10% | Ridgewalker Camp merchant | 2 |
| W-DG-05 | Flickerblade | +25 | 550g | 20% chance to act twice (basic attack only, not skills) | Flickerveil (Flickering Village shop) | 2 |
| W-DG-06 | Phantom Edge | +32 | 900g | Vanishing Act lasts 3 turns instead of 2. | Torvan's Blacksmith (Vivid vibrancy) | 3 |
| W-DG-07 | Temporal Shard | +39 | — | Temporal Ambush: the second action deals +25% bonus damage. | Quest reward: Rogue time-echo quest (Act II) | 3 |
| W-DG-08 | Echo of Tomorrow | +47 | — | Echo Dodge cap increased from 60% to 70%. Memory Theft always succeeds. | Depths Level 4 treasure chest | 3 |

### Weapon Progression Summary

| Tier | ATK/INT Range | Price Range | Availability |
|------|---------------|-------------|-------------|
| Tier 1 | +4 to +10 | Free or 70-90g | Starting gear + Muted/Normal shops |
| Tier 2 | +13 to +28 | 200-650g | Normal/Vivid shops + exploration loot |
| Tier 3 | +32 to +50 | 850-950g (shop) or quest/dungeon only | Vivid shops + Act II quests + Depths |

---

## Armor

Armor provides flat DEF. Each class can equip any armor piece, but some have class-specific bonuses.

| ID | Name | DEF | Price | Special Effect | Acquisition | Tier |
|----|------|-----|-------|----------------|-------------|------|
| A-01 | Traveler's Tunic | +3 | — | None | Starting equipment (all classes) | 1 |
| A-02 | Padded Vest | +6 | 60g | None | Maren's General Shop (Village Hub) | 1 |
| A-03 | Leather Armor | +10 | 120g | +5% HP | Torvan's Blacksmith (Village Hub) | 1 |
| A-04 | Chain Mail | +15 | 300g | Knight: +8 DEF instead of +15. Others: AGI -3. | Torvan's Blacksmith (Normal vibrancy) | 2 |
| A-05 | Forest Weave | +12 | 250g | +10% evasion. Rogue: +15% evasion instead. | Ambergrove (Woodcutter's Camp quest reward) | 2 |
| A-06 | Riverstone Plate | +18 | 450g | +10% water resistance. Immune to Poison. | Millbrook specialty shop | 2 |
| A-07 | Hermit's Robe | +14 | — | +20% SP regen from Defend action. Cleric/Mage: +25% instead. | Quest reward from Wynn (Shimmer Marsh) | 2 |
| A-08 | Ridgewalker's Coat | +20 | 500g | +10% ATK. Wind resistance +15%. | Ridgewalker Camp merchant | 2 |
| A-09 | Frontier Guard | +25 | 800g | +15% resistance to Stasis status. | Hollow Ridge (Shattered Pass loot, after clearing) | 3 |
| A-10 | Preserver's Crystal Mail | +30 | — | +20% DEF. Immune to Stasis. | Drop from Preserver Captain (Resonance Fields) | 3 |
| A-11 | Luminary Vestment | +22 | 1,000g | All healing received +20%. Knight: oath bonuses +5%. | Torvan's Blacksmith (Vivid vibrancy) | 3 |
| A-12 | Verdant Mantle | +28 | — | Regenerate 2% max HP per turn (in combat). | Verdance's Hollow (post-recall loot) | 3 |
| A-13 | Sketchweave Cloak | +24 | — | +20% evasion. In Sketch zones: +30% evasion. | The Half-Drawn Forest (Living Sketch reward) | 3 |
| A-14 | Memory-Woven Plate | +35 | — | DEF scales with total fragments broadcast (+1 DEF per 3 broadcasts, max +10). | Depths Level 5 treasure chest | 3 |

### Armor Progression Summary

| Tier | DEF Range | Price Range | Availability |
|------|-----------|-------------|-------------|
| Tier 1 | +3 to +10 | Free or 60-120g | Starting gear + Muted/Normal shops |
| Tier 2 | +12 to +20 | 250-500g | Normal/Vivid shops + quests + exploration |
| Tier 3 | +22 to +35 | 800-1,000g (shop) or quest/drop only | Vivid shops + Act II-III content |

---

## Consumables

All consumables stack up to **10** per type in inventory. Using a consumable in combat costs the character's turn.

### Healing Items

| ID | Name | Effect | Price | Stack | Acquisition | Tier |
|----|------|--------|-------|-------|-------------|------|
| C-HP-01 | Minor Potion | Restore 50 HP | 30g | 10 | Maren's General Shop (always) | 1 |
| C-HP-02 | Potion | Restore 120 HP | 80g | 10 | Maren's General Shop (Normal vibrancy) | 2 |
| C-HP-03 | High Potion | Restore 250 HP | 180g | 10 | Maren's General Shop (Vivid vibrancy) | 3 |
| C-HP-04 | Elixir | Restore 100% HP | 500g | 5 | Vivid-tier shops only. Also: Depths treasure chests. | 3 |

### SP Recovery Items

| ID | Name | Effect | Price | Stack | Acquisition | Tier |
|----|------|--------|-------|-------|-------------|------|
| C-SP-01 | Mana Drop | Restore 20 SP | 25g | 10 | Maren's General Shop (always) | 1 |
| C-SP-02 | Mana Draught | Restore 50 SP | 70g | 10 | Maren's General Shop (Normal vibrancy) | 2 |
| C-SP-03 | Mana Surge | Restore 120 SP | 160g | 10 | Maren's General Shop (Vivid vibrancy) | 3 |
| C-SP-04 | Ether | Restore 100% SP | 450g | 5 | Vivid-tier shops only. Also: Depths treasure chests. | 3 |

### Status Cure Items

| ID | Name | Effect | Price | Stack | Acquisition | Tier |
|----|------|--------|-------|-------|-------------|------|
| C-SC-01 | Antidote | Cure Poison | 20g | 10 | Maren's General Shop (always) | 1 |
| C-SC-02 | Haste Charm | Cure Slow. Grant AGI +20% for 2 turns. | 60g | 10 | Maren's General Shop (Normal vibrancy) | 2 |
| C-SC-03 | Fortify Tonic | Cure Weakness. Grant DEF +20% for 2 turns. | 60g | 10 | Maren's General Shop (Normal vibrancy) | 2 |
| C-SC-04 | Stasis Breaker | Cure Stasis. Grant immunity to Stasis for 3 turns. | 120g | 10 | Frontier shops (Ridgewalker, Flickering Village) | 2 |
| C-SC-05 | Panacea | Cure ALL status effects on one character. | 200g | 5 | Vivid-tier shops only | 3 |

### Buff Items

| ID | Name | Effect | Price | Stack | Acquisition | Tier |
|----|------|--------|-------|-------|-------------|------|
| C-BF-01 | Strength Seed | ATK +15% for 3 turns (one character) | 100g | 5 | Torvan's Blacksmith (Normal vibrancy) | 2 |
| C-BF-02 | Wisdom Seed | INT +15% for 3 turns (one character) | 100g | 5 | Maren's General Shop (Normal vibrancy) | 2 |
| C-BF-03 | Aegis Seed | DEF +15% for 3 turns (one character) | 100g | 5 | Torvan's Blacksmith (Normal vibrancy) | 2 |
| C-BF-04 | Haste Seed | AGI +15% for 3 turns (one character) | 100g | 5 | Millbrook specialty shop | 2 |
| C-BF-05 | Memory Incense | Grant Inspired status (+20% all stats, 3 turns) to one character. | 350g | 3 | Vivid-tier shops only | 3 |

### Special Consumables

| ID | Name | Effect | Price | Stack | Acquisition | Tier |
|----|------|--------|-------|-------|-------------|------|
| C-SP-05 | Smoke Bomb | Guaranteed flee from non-boss encounters. | 40g | 5 | Maren's General Shop (always) | 1 |
| C-SP-06 | Crystal Dust | Cure all debuffs on one character. Deal 50 fixed light damage to one Preserver enemy. | 200g | 5 | Elyn's shop (Flickerveil, after Vesperis recall) | 3 |
| C-SP-07 | Stasis Shard | Freeze one non-boss enemy for 2 turns (cannot act). | 150g | 5 | Elyn's shop (Flickerveil, after Vesperis recall) | 3 |
| C-SP-08 | Broadcast Amplifier | Next memory broadcast gains +5 vibrancy bonus (consumed on use, outside combat). | 300g | 3 | Vivid-tier shops only | 3 |
| C-SP-09 | Dissolved Essence | Restore 50% HP and 50% SP to entire party. | — | 3 | Depths treasure chests only (not purchasable) | 3 |
| C-SP-10 | Phoenix Feather | Auto-revive: if a party member is knocked to 0 HP, restore them to 30% HP immediately. Must be in inventory (consumed automatically). | — | 1 | Rare drop from Depths L3+ bosses. Also: 1 found in Preserver Fortress F1. | 3 |

### Consumable Summary

| Category | Items | Price Range | Primary Source |
|----------|-------|-------------|---------------|
| Healing (HP) | 4 | 30-500g | Maren's General Shop |
| SP Recovery | 4 | 25-450g | Maren's General Shop |
| Status Cures | 5 | 20-200g | Maren's / Frontier shops |
| Buff Seeds | 5 | 100-350g | Torvan's / Specialty shops |
| Special | 6 | 40-300g | Various / non-purchasable |
| **Total** | **24** | | |

---

## Key Items

Key items are non-consumable, non-sellable items that serve story, puzzle, or permanent gameplay functions. They occupy a separate inventory tab and are never lost.

| ID | Name | Description | Acquisition | Purpose |
|----|------|-------------|-------------|---------|
| K-01 | **Architect's Signet** | A ring of warm amber that identifies the player as a Mnemonic Architect. | Given by Lira during Act I, Scene 2 | Story item. Required to interact with Resonance Stones and use memory operations. |
| K-02 | **Callum's Letters** | A bundle of letters from Callum containing lore about each Frontier zone. | Given by Callum before Act II begins | Reading a letter for a specific zone reveals the dissolved civilization backstory narrated during god recall visions. |
| K-03 | **Remix Table Access** | Grants access to any Remix Table in the game (Lira's Workshop, Frontier camps). | Unlocked during Act I tutorial (Scene 4) | Allows the player to combine memory fragments via the Remix interface. |
| K-04 | **Light Lens** | A polished crystal that focuses scattered light into a coherent beam. | Given by Solen (Flickerveil elder) | Required to approach Luminos Grove without being blinded. See [dormant-gods.md](../world/dormant-gods.md). |
| K-05 | **Kinetic Boots** | Weighted boots that resist the Kinesis Spire's vibrational pushback. | Given by Petra (Ridgewalker Camp) | Required to reach Kinesis Spire's base. See [dormant-gods.md](../world/dormant-gods.md). |
| K-06 | **Curator's Manifesto** | A crystal tablet inscribed with the Curator's philosophy of perfect preservation. | Found in Preserver Cathedral after clearing (Resonance Fields) | Provides the Curator's perspective. Unlocks unique dialogue options in Act III. |
| K-07 | **Cantara's Baton** | A conductor's baton that resonates with broadcast energy. | Quest reward: "The Unfinished Symphony" (Cantara recall) | Increases broadcast vibrancy gain by +2 in any zone. See [dormant-gods.md](../world/dormant-gods.md). |
| K-08 | **Harmonia's Tuning Fork** | A crystal fork that vibrates at the world's fundamental frequency. | Quest reward: "The Harmonist's Attunement" (Harmonia recall) | Doubles the visual broadcast radius of all memory broadcasts. |
| K-09 | **Rootwalker's Seed** | A glowing seed from the last Rootwalker. | Quest reward: "The Last Rootwalker" (Autumnus recall) | When planted at any zone's central point, permanently raises that zone's vibrancy by +5. Single use. |
| K-10 | **Vesperis's Lantern** | A twilight-hued lantern that reveals fragment properties. | Quest reward: "The Twilight Vigil" (Vesperis recall) | When used at any Resonance Stone, reveals the full emotional spectrum of all available fragments before collecting. |
| K-11 | **Peregrine's Journal** | An ancient explorer's travel diary that reveals hidden passages. | Quest reward: "The Footprints of the Peregrine" (Errantis recall) | Reveals all hidden items and passages in any zone the player has visited for 5+ minutes. |
| K-12 | **Wayfinder's Compass** | A compass that always points toward uncollected fragments. | Quest reward: "The Road That Remembers" (Jubila recall) | Points toward the nearest uncollected memory fragment in the current zone. |
| K-13 | **Curator's Doubt** | A cracked crystal containing the Curator's suppressed uncertainties. | Quest reward: "The Many-Colored Truth" (Prisma recall) | In the final confrontation, provides a unique dialogue option that shortens the encounter. |
| K-14 | **Elyn's Intelligence Report** | Detailed floor plan of Preserver Fortress Floor 1. | Quest reward: "The Defector" (Vesperis recall) | Reveals the Preserver Fortress F1 map layout before entering. |
| K-15 | **Thunderstone** | A fragment of Tempestus's lightning, crackling with storm energy. | Given by Tempestus during "The Shattered Silence" quest | Required to initiate the Preserver Cathedral assault. |

---

## Named Memory Fragments

While most memory fragments are procedurally described (emotion + element + potency), certain story-critical fragments have unique names, fixed properties, and specific narrative significance. These are always found in fixed locations and cannot be remixed (they are too important to the story).

| ID | Name | Emotion | Element | Potency | Source | Narrative Significance |
|----|------|---------|---------|---------|--------|----------------------|
| MF-01 | **Callum's First Lesson** | Joy | Neutral | 2 | Given by Callum in Act I, Scene 2 | The player's first fragment. Callum shares a memory of teaching someone to see Resonance Stones. Tutorial item. |
| MF-02 | **Lira's Warmth** | Joy | Light | 3 | Given by Lira in Act I, Scene 4 | Lira shares a memory of her first successful broadcast as a young Architect. Used for the first tutorial broadcast. |
| MF-03 | **Echo of the Stagnation** | Sorrow | Dark | 2 | Collected from Heartfield's Stagnation Clearing after breaking it | A frozen butterfly's last moment before crystallization. First encounter with Preserver-touched memories. |
| MF-04 | **Lira's Scream** | Fury | Light | 4 | Dropped when Lira is frozen during Act I climax | The emotional shockwave of Lira's freezing. The player's most potent fragment at this point — and the most painful. |
| MF-05 | **Choir's Final Note** | Awe | Wind | 4 | Resonance's Amphitheater (Resonance Fields), pre-recall vision | A fragment of the Choir of the First Dawn's last performance. Contains the note that Resonance hums. |
| MF-06 | **Rootwalker's Seedling** | Joy | Earth | 4 | Verdance's Hollow (Shimmer Marsh), pre-recall vision | A memory of the Rootwalkers planting the first tree. The seed that became Verdance's shrine. |
| MF-07 | **Radiant Lens Theorem** | Awe | Light | 4 | Luminos Grove (Flickerveil), pre-recall vision | A memory of the Radiant Lens discovering how to focus light into pure truth. |
| MF-08 | **Peregrine's First Step** | Fury | Fire | 4 | Kinesis Spire (Hollow Ridge), pre-recall vision | A memory of the Peregrine Road's founder taking the first step on an unmapped path. Pure determination. |
| MF-09 | **The Curator's Grief** | Sorrow | Dark | 5 | Preserver Fortress Floor 2 (Archive of Perfection) | The Curator's personal memory: watching a beloved community dissolve and feeling powerless to stop it. This is why they became a Preserver. |
| MF-10 | **The First Memory** | Calm | Neutral | 5 | Preserver Fortress Floor 3 (First Memory Chamber) | The world's original memory — the seed from which all reality grew. The player remixes this in the final act. Cannot be broadcast, only remixed. |
| MF-11 | **World's New Dawn** | Joy | Light | 5 | Created by remixing The First Memory with any player-held fragment | The result of remixing the First Memory. This fragment IS the new world. Broadcasting it triggers the endgame bloom (see [vibrancy-system.md](../world/vibrancy-system.md)). |

### Fragment Acquisition by Act

| Act | Named Fragments | Typical Unnamed Fragments | Running Total (Named + ~Unnamed) |
|-----|----------------|--------------------------|----------------------------------|
| Act I | MF-01 through MF-04 | ~12-18 from exploration, quests, enemies | ~16-22 |
| Act II | MF-05 through MF-08 + god recall fragments | ~15-25 from Frontier exploration, Depths, quests | ~35-50 |
| Act III | MF-09 through MF-11 | ~5-10 from Sketch, Depths L5, Fortress | ~42-63 |

This keeps the total within the **40-60 fragment** target per playthrough (see [memory-system.md](memory-system.md)).

---

## Accessory Items

Accessories are reward items from god-recall side quests and special encounters. Each character can equip **1 accessory** in addition to their weapon and armor.

| ID | Name | Effect | Acquisition |
|----|------|--------|-------------|
| ACC-01 | **Storm Aegis** | +10 DEF. Immune to lightning damage. | Quest: "The Storm Wall" (Tempestus recall) |
| ACC-02 | **Silent Tread** | Encounter rate reduced by 50%. | Quest: "The Silent Path" (Tacet recall) |
| ACC-03 | **Kaleidoscope Lens** | +10 INT. +10 AGI. Prismatic fragment drop rate doubled. | Quest: "The Spectrum Walk" (Prisma recall) |
| ACC-04 | **Accord Pendant** | Preserver enemies deal 15% less damage. | Quest: "The Accord" (Harmonia recall) |
| ACC-05 | **Thornweald's Gauntlet** | +10 ATK. Thorn retaliation damage 30% (from 20%). | Quest: "The Reclamation" (Thornweald recall) |
| ACC-06 | **Rootmap Pendant** | +15% gold from all sources. | Quest: "The Mycorrhizal Map" (Sylvanos recall) |
| ACC-07 | **Sunstone Ring** | +10 INT. +10 AGI. First attack each combat deals +25% light damage. | Quest: "The First Sunrise" (Solara recall) |
| ACC-08 | **Lens of Truth** | +15 INT. Enemy HP bars always visible. Critical hits deal +20% damage. | Quest: "The Burning Archive" (Pyralis recall) |
| ACC-09 | **Lantern Keeper's Cloak** | +12 DEF. Immune to Blind. | Quest: "Solara's Lanterns" (Solara recall) |
| ACC-10 | **Peregrine Boots** | +20 AGI. +25% movement speed. Immune to Slow. | Quest: "The Peregrine Circuit" (Jubila recall) |
| ACC-11 | **Earthshaker Hammer** | Weapon override: ATK +40. AoE attacks have +15% area. (Knight only.) | Quest: "The Mountain's March" (Tecton recall) |
| ACC-12 | **Tecton's Fist** | +15 STR. +15 DEF. Critical hits deal +25% damage. | Quest: "Tecton's Challenge" (Tecton recall) |
| ACC-13 | **Gyroscope Charm** | +15 AGI. Immune to knockback. Momentum cap +3 (Rogue). | Quest: "The Perpetual Engine" (Vortis recall) |

Note: Not all players will have access to all accessories. Each is tied to a specific god recall form (see [dormant-gods.md](../world/dormant-gods.md)). A typical playthrough yields 2-4 accessories depending on which gods are recalled and which side quests are completed.

---

## Acquisition Summary by Location

### Village Hub Shops

**Maren's General Shop** (consumables + basic gear):

| Item | Price | Tier |
|------|-------|------|
| Minor Potion (C-HP-01) | 30g | 1 (always) |
| Mana Drop (C-SP-01) | 25g | 1 (always) |
| Antidote (C-SC-01) | 20g | 1 (always) |
| Smoke Bomb (C-SP-05) | 40g | 1 (always) |
| Padded Vest (A-02) | 60g | 1 (always) |
| Maren's Blessing Rod (W-ST-02) | 70g | 1 (always) |
| Amber Focus (W-WD-02) | 90g | 1 (always) |
| Potion (C-HP-02) | 80g | 2 (Normal) |
| Mana Draught (C-SP-02) | 70g | 2 (Normal) |
| Wisdom Seed (C-BF-02) | 100g | 2 (Normal) |
| Haste Charm (C-SC-02) | 60g | 2 (Normal) |
| Fortify Tonic (C-SC-03) | 60g | 2 (Normal) |
| High Potion (C-HP-03) | 180g | 3 (Vivid) |
| Mana Surge (C-SP-03) | 160g | 3 (Vivid) |
| Elixir (C-HP-04) | 500g | 3 (Vivid) |
| Ether (C-SP-04) | 450g | 3 (Vivid) |
| Panacea (C-SC-05) | 200g | 3 (Vivid) |
| Memory Incense (C-BF-05) | 350g | 3 (Vivid) |
| Broadcast Amplifier (C-SP-08) | 300g | 3 (Vivid) |

**Torvan's Blacksmith** (weapons + armor + buff seeds):

| Item | Price | Tier |
|------|-------|------|
| Iron Blade (W-SW-02) | 80g | 1 (always) |
| Steel Stiletto (W-DG-02) | 75g | 1 (always) |
| Leather Armor (A-03) | 120g | 1 (always) |
| Oathkeeper's Edge (W-SW-03) | 250g | 2 (Normal) |
| Chain Mail (A-04) | 300g | 2 (Normal) |
| Strength Seed (C-BF-01) | 100g | 2 (Normal) |
| Aegis Seed (C-BF-03) | 100g | 2 (Normal) |
| Frontier Greatsword (W-SW-06) | 900g | 3 (Vivid) |
| Luminary Vestment (A-11) | 1,000g | 3 (Vivid) |
| Phantom Edge (W-DG-06) | 900g | 3 (Vivid) |
| Arcane Catalyst (W-WD-06) | 950g | 3 (Vivid) |
| Luminary's Scepter (W-ST-06) | 850g | 3 (Vivid) |

### Settled Lands

**Millbrook Specialty Shop** (water/riverside themed):
- Brightwater Saber (W-SW-04): 400g
- Riverside Crosier (W-ST-04): 380g
- Riverstone Plate (A-06): 450g
- Haste Seed (C-BF-04): 100g

### Frontier Settlements

**Ridgewalker Camp Merchant** (rotating stock, mountain-themed):
- Ridgewalker Claymore (W-SW-05): 600g
- Shadow Fang (W-DG-04): 350g
- Ridgewalker's Coat (A-08): 500g
- Stasis Breaker (C-SC-04): 120g

**Flickering Village Shop** (light/forest-themed):
- Prism Wand (W-WD-04): 420g
- Flickerblade (W-DG-05): 550g
- Stasis Breaker (C-SC-04): 120g

**Listener's Camp** (sound-themed, available after Resonance zone exploration):
- Resonance Tuner (W-WD-05): 650g

### Exploration / Quest / Dungeon Loot

Items not sold in any shop — found only through exploration, quests, or dungeon treasure:

| Item | Location |
|------|----------|
| Windcatcher Rod (W-WD-03) | Ambergrove, Canopy Path treasure |
| Windmill Blade (W-DG-03) | Heartfield, Old Windmill loot |
| Hearthstone Staff (W-ST-03) | Ambergrove, Hearthstone Circle |
| Forest Weave (A-05) | Ambergrove, Woodcutter's Camp quest |
| Hermit's Robe (A-07) | Shimmer Marsh, Wynn quest reward |
| Marsh Hermit's Crook (W-ST-05) | Shimmer Marsh, Wynn quest reward |
| Frontier Guard (A-09) | Hollow Ridge, Shattered Pass loot |
| Preserver's Crystal Mail (A-10) | Drop: Preserver Captain (Resonance Fields) |
| Verdant Mantle (A-12) | Verdance's Hollow, post-recall |
| Sketchweave Cloak (A-13) | Half-Drawn Forest, Living Sketch |
| All Tier 3 quest weapons (W-xx-07) | Class-specific quests in Act II |
| All Tier 3 dungeon weapons (W-xx-08) | Depths Level 4-5 treasure chests |
| Memory-Woven Plate (A-14) | Depths Level 5 treasure chest |
| All accessory items (ACC-01 to ACC-13) | God-recall side quests |
| Dissolved Essence (C-SP-09) | Depths treasure chests |
| Phoenix Feather (C-SP-10) | Depths L3+ boss drop / Fortress F1 |

---

## Gold Economy Validation

Using the gold income baseline from [progression.md](progression.md):

### Act I Budget (~4-6 hours, ~80 encounters × ~15g avg = ~1,200g)

**Essential purchases**: Iron Blade/Steel Stiletto (75-80g) + Leather Armor (120g) + 5× Minor Potions (150g) + 3× Antidotes (60g) = **~420g**

**Affordable upgrades**: Padded Vest (60g), Mana Drops (25g each), Amber Focus/Maren's Blessing (70-90g)

**Remaining budget for Tier 2**: ~500-700g — enough for ONE Tier 2 weapon or armor, but not both. This encourages exploration for non-shop loot (Windmill Blade, Forest Weave, Hearthstone Staff).

### Act II Budget (~6-8 hours, ~120 encounters × ~45g avg = ~5,400g)

**Cumulative gold**: ~6,600g total. Tier 2 weapons (200-650g) and armor (250-500g) are comfortably affordable. Multiple Tier 2 purchases possible.

**Frontier shop access**: Stasis Breakers (120g) become a recurring expense. Players should budget ~500g for status cures.

**Remaining for Tier 3 prep**: ~2,000-3,000g — enough for one Vivid-tier shop item at end of Act II.

### Act III Budget (~5-6 hours, ~80 encounters × ~85g avg = ~6,800g)

**Cumulative gold**: ~13,400g total. Multiple Tier 3 shop items affordable (800-1,000g each). Endgame consumables (Elixirs 500g, Ethers 450g) are practical purchases.

**Best endgame gear**: Comes from Depths treasure and quests, not shops. Shops provide reliable-but-not-best options; exploration rewards the best.

This economy follows the game's theme of abundance: gold is generous enough that essential purchases never feel like a sacrifice, but premium items require engagement with the world beyond pure grinding.
