# Class Design: Memory-Infused Archetypes

## Design Philosophy

Every class in Mnemonic Realms has a unique relationship with memory that goes beyond flavor text. Memory isn't just the world's theme — it's woven into each class's core mechanic. The classes are familiar enough to be immediately readable (knight, cleric, mage, rogue) but the memory twist makes each one feel fresh.

## The Four Classes

### Knight — Oathweave

**Fantasy**: A warrior whose power comes from remembered promises.

**Core Mechanic: Oathweave**
The Knight doesn't just swing a sword — they bind themselves to remembered oaths that grant escalating power. Each oath is a commitment the Knight makes during the game (protect this NPC, clear this dungeon, defeat this boss). Active oaths provide passive stat bonuses. Fulfilled oaths become permanent upgrades.

**In Combat**:
- **Oath Strike**: Base attack scales with number of active oaths
- **Vow of Steel**: Defensive stance that strengthens based on how many oaths the Knight has fulfilled
- **Oathbreaker's Gambit**: Sacrifice an active oath for a massive single attack (powerful but permanently loses that oath's bonus)
- **Remembered Valor**: Party buff that shares oath bonuses with allies

**Memory Twist**: The Knight's power is literally built on keeping promises. Breaking an oath (failing a quest, abandoning an NPC) has real mechanical consequences — not as punishment, but as the natural cost of broken memory.

**Stat Focus**: STR, DEF. High HP growth. Frontline tank/damage.

---

### Cleric — Euphoric Recall

**Fantasy**: A healer who channels the emotional peak of memories.

**Core Mechanic: Euphoric Recall**
The Cleric draws power from the strongest emotional moments in collected memories. Every memory fragment the player collects has an emotional "charge" — joy, sorrow, awe, fury. The Cleric converts these charges into healing and support abilities. Joy heals. Awe shields. Fury empowers. Even sorrow has use — it cleanses debuffs.

**In Combat**:
- **Joyful Mending**: Standard heal, scales with joy charges
- **Awestruck Ward**: Shield/barrier, scales with awe charges
- **Sorrowful Cleanse**: Remove debuffs and status effects
- **Fury Blessing**: Temporarily boost an ally's attack using fury charges
- **Emotional Resonance**: Ultimate ability that releases ALL stored charges in a massive party-wide heal + buff

**Memory Twist**: The Cleric doesn't create healing energy from nothing. They are literally recycling the emotional content of the world's memories. This makes them the class most attuned to NPCs and story content — the more the player engages with the world, the stronger the Cleric becomes.

**Stat Focus**: INT, DEF. Moderate HP. Pure support/healer.

---

### Mage — Inspired Casting

**Fantasy**: A spellcaster who doesn't memorize spells — they re-derive them from inspiration.

**Core Mechanic: Inspired Casting**
Traditional mages memorize spell formulae. This Mage doesn't. They draw inspiration from collected memories and improvise spells in the moment. The spell system is semi-combinatorial: the Mage has a set of memory-derived "elements" (fire, ice, lightning, force, etc.) and combines them with "patterns" (bolt, wave, shield, rain) to create spells on the fly.

**In Combat**:
- **Elemental Bolt**: Single-target, element chosen from collected memories
- **Memory Wave**: AoE attack using the most recently collected memory's element
- **Inspired Shield**: Defensive spell whose element adapts to the last attack received
- **Eureka Moment**: Random powerful spell from the full collection (high risk, high reward)
- **Grand Inspiration**: Ultimate — combines multiple elements for a unique compound spell

**Memory Twist**: The Mage's spell repertoire grows directly with exploration. Collecting memories from fire-biome regions unlocks fire elements. Water dungeons unlock water. This creates a natural incentive to explore everywhere — the Mage who has seen the most has the biggest toolkit.

**Stat Focus**: INT, AGI. Low HP, high SP. Glass cannon.

---

### Rogue — Foreshadow Strike

**Fantasy**: A trickster who sees echoes of what's about to happen.

**Core Mechanic: Foreshadow**
The Rogue has a unique relationship with memory — they can perceive the **future echoes** of memories not yet formed. In practice, this means the Rogue gets brief glimpses of what enemies are about to do, enabling preemptive counters, perfect dodges, and devastating ambushes.

**In Combat**:
- **Foreshadow Strike**: Attack that deals bonus damage if used before the enemy acts (reading the "shadow" of their intended action)
- **Echo Dodge**: Passive chance to completely avoid attacks by seeing them coming
- **Memory Theft**: Steal a memory fragment from the enemy, reducing their stats and adding to your collection
- **Shadow Step**: Teleport behind an enemy using a memory of where you "will be"
- **Temporal Ambush**: Ultimate — the Rogue acts twice in one turn by overlapping their present action with their foreshadowed future action

**Memory Twist**: The Rogue's power comes from memories that haven't happened yet. This makes them thematically tied to the game's core question about growth vs. preservation — they literally embody the idea that the future is worth more than a frozen past.

**Stat Focus**: AGI, DEX. Moderate HP. Evasion-based damage dealer.

## Class Progression

All classes evolve through the same memory-sharing system, but each benefits differently:

| Memory Type | Knight | Cleric | Mage | Rogue |
|-------------|--------|--------|------|-------|
| NPC Memories | New oath opportunities | Emotional charges | Pattern unlocks | Foreshadow range |
| Environmental | Oath power scaling | Charge capacity | Element unlocks | Echo dodge chance |
| Dissolved | Permanent oath buffs | Resonance power | Compound elements | Temporal ambush chains |
| Boss Defeats | Oathbreaker's Gambit power | Ultimate charge rate | Eureka pool size | Memory Theft potency |

## Subclasses (Future / Act II+)

Each class has two subclass branches that unlock mid-game when the player recalls their first dormant god. The emotion used for the first recall determines the branch: Joy or Awe opens the **Luminary** path; Fury or Sorrow opens the **Crucible** path. Full subclass specs — stat modifiers, bonus skills, and unlock conditions — are detailed in `progression.md` §Subclass System.
