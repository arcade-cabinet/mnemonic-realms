---
title: "Game Systems Design"
version: 1.0.0
date: 2026-02-12
authors: ["jbdevprimary", "copilot"]
status: "Active"
tags: ["design", "gameplay", "systems", "mechanics"]
---

# Game Systems Design

## Overview

This document details the gameplay systems for **Mnemonic Realms**, including mechanics, formulas, and interactions between systems.

## Core Game Loop

```
1. Enter Seed
   ↓
2. Character Generated (class, stats)
   ↓
3. Spawn in Starting Area
   ↓
4. Explore World
   ├→ Combat Enemies
   ├→ Collect Loot
   ├→ Talk to NPCs
   ├→ Complete Quests
   └→ Level Up
   ↓
5. Progress to New Areas
   ↓
6. Defeat Final Boss
   ↓
7. Complete Seed / Try New Seed
```

## Character System

### Character Creation

**Seed-Based Generation**:
```typescript
Seed: "dark ancient warrior"
  ↓
Alignment: Dark (from "dark" keyword)
  ↓
Class: Shadow Assassin (dark classes pool)
  ↓
Stats Generated:
  - Strength: 8
  - Dexterity: 12
  - Intelligence: 6
  - Vitality: 10
  - Luck: 7
```

### Base Stats

| Stat | Description | Affects |
|------|-------------|---------|
| **Strength (STR)** | Physical power | Physical damage, carry capacity |
| **Dexterity (DEX)** | Agility & precision | Attack speed, dodge chance, critical rate |
| **Intelligence (INT)** | Magical prowess | Magic damage, mana pool, spell effectiveness |
| **Vitality (VIT)** | Health & endurance | Max HP, HP regen, defense |
| **Luck (LCK)** | Fortune | Critical damage, item drops, dodge chance |

### Derived Stats

```typescript
Max HP = 100 + (VIT * 10)
Max Mana = 50 + (INT * 5)
Physical Damage = Weapon Damage * (1 + STR / 20)
Magic Damage = Spell Power * (1 + INT / 20)
Critical Chance = 5% + (DEX / 10) + (LCK / 20)
Critical Multiplier = 1.5x + (LCK / 50)
Dodge Chance = 5% + (DEX / 15)
Attack Speed = 1.0 + (DEX / 30)
```

### Experience & Leveling

**Level Formula**:
```typescript
XP Required = 100 * (Level ^ 1.5)
// Level 2: 282 XP
// Level 3: 519 XP
// Level 10: 3162 XP
// Level 50: 35355 XP
```

**Level Up Rewards**:
- +5 Max HP
- +2 Max Mana
- +3 stat points to allocate
- Unlock new skills at levels 5, 10, 15, 20, 25, 30

### Classes

Generated from seed alignment:

#### Light Classes
- **Cleric**: Healer with holy magic
  - Primary: INT
  - Skills: Heal, Holy Smite, Divine Shield
  
- **Paladin**: Tank with light abilities
  - Primary: STR, VIT
  - Skills: Shield Bash, Lay on Hands, Aura of Protection

- **Priest**: Support caster
  - Primary: INT
  - Skills: Bless, Purify, Resurrection

#### Dark Classes
- **Shadow Assassin**: High damage rogue
  - Primary: DEX
  - Skills: Backstab, Shadow Step, Poison Strike
  
- **Necromancer**: Summon undead
  - Primary: INT
  - Skills: Raise Dead, Life Drain, Curse
  
- **Warlock**: Dark magic caster
  - Primary: INT
  - Skills: Shadow Bolt, Fear, Corruption

#### Neutral Classes
- **Bard**: Versatile support
  - Primary: DEX, INT
  - Skills: Song of Courage, Dissonance, Charm
  
- **Ranger**: Ranged physical damage
  - Primary: DEX
  - Skills: Aimed Shot, Trap, Animal Companion
  
- **Monk**: Melee martial artist
  - Primary: STR, DEX
  - Skills: Flurry of Blows, Meditate, Chi Strike

### Skill System

**Skill Structure**:
```typescript
interface Skill {
  name: string;
  level: number;        // 1-10
  manaCost: number;
  cooldown: number;     // seconds
  damage: number;
  damageType: 'physical' | 'magical';
  effects: StatusEffect[];
}
```

**Skill Progression**:
- Skills level up with use (cast 10 times → level 2)
- Each level: +10% damage, -5% mana cost, -5% cooldown
- Max skill level: 10

## Combat System

### Combat Flow

```
1. Player enters combat range (enemy aggro)
   ↓
2. Turn-based or real-time? → Real-time (Diablo style)
   ↓
3. Player attacks (click or hotkey)
   ↓
4. Damage calculated
   ↓
5. Enemy takes damage / Dies
   ↓
6. Enemy attacks back
   ↓
7. Player takes damage / Dodge / Block
   ↓
8. Repeat until one side dies
```

### Damage Calculation

**Physical Damage**:
```typescript
BaseDamage = Weapon.damage
AttackDamage = BaseDamage * (1 + STR / 20)
CritMultiplier = isCritical ? (1.5 + LCK / 50) : 1.0
Defense = Target.VIT / 10
FinalDamage = (AttackDamage * CritMultiplier) - Defense
FinalDamage = Math.max(1, FinalDamage) // Minimum 1 damage
```

**Magical Damage**:
```typescript
BaseDamage = Spell.power
SpellDamage = BaseDamage * (1 + INT / 20)
Resistance = Target.INT / 15
FinalDamage = SpellDamage - Resistance
FinalDamage = Math.max(1, FinalDamage)
```

### Status Effects

| Effect | Duration | Impact |
|--------|----------|--------|
| **Poison** | 10s | -5 HP/sec |
| **Burn** | 8s | -8 HP/sec |
| **Freeze** | 3s | Cannot move or act |
| **Stun** | 2s | Cannot act |
| **Slow** | 5s | -50% movement/attack speed |
| **Bleed** | 15s | -3 HP/sec |
| **Curse** | 20s | -20% all stats |
| **Bless** | 30s | +20% all stats |

### Enemy AI

**Behavior States**:
1. **Idle**: Wander randomly in spawn area
2. **Alert**: Player within aggro range (10 tiles)
3. **Chase**: Move toward player
4. **Combat**: Attack player if in range
5. **Flee**: Health < 20%, run away
6. **Dead**: Drop loot, disappear

**Aggro System**:
- Aggro Range: 10 tiles
- Aggro Duration: 30 seconds after leaving range
- Group Aggro: Enemies within 5 tiles also aggro

## Loot System

### Item Rarity

| Rarity | Drop Rate | Color | Stat Bonus |
|--------|-----------|-------|------------|
| **Common** | 60% | Gray | +0-5% |
| **Uncommon** | 25% | Green | +6-15% |
| **Rare** | 10% | Blue | +16-30% |
| **Epic** | 4% | Purple | +31-50% |
| **Legendary** | 1% | Orange | +51-100% |

### Loot Generation

**Enemy Drops**:
```typescript
BaseDropChance = 30%
LuckBonus = Player.LCK / 100
FinalDropChance = BaseDropChance + LuckBonus

if (drops) {
  RarityRoll = random() + (Player.LCK / 200)
  // Common: 0.00-0.59
  // Uncommon: 0.60-0.84
  // Rare: 0.85-0.94
  // Epic: 0.95-0.98
  // Legendary: 0.99-1.00
}
```

**Item Stats**:
```typescript
BaseStat = ItemType.baseStat
RarityMultiplier = Rarity.statBonus
SeedVariation = seededRandom(seed) * 0.1 // ±10%
FinalStat = BaseStat * RarityMultiplier * (1 + SeedVariation)
```

### Item Types

**Weapons**:
- Sword (STR): High damage, medium speed
- Dagger (DEX): Low damage, fast speed, high crit
- Staff (INT): Magic damage, slow speed
- Bow (DEX): Ranged physical, medium speed
- Wand (INT): Ranged magic, fast speed

**Armor**:
- Helmet: +HP, +Defense
- Chest: +HP, +Defense
- Legs: +HP, +Defense
- Boots: +Movement Speed, +Dodge
- Gloves: +Attack Speed, +Damage

**Accessories**:
- Ring: +2 random stats
- Amulet: +3 random stats
- Belt: +Inventory Space, +HP

### Gold Drops

```typescript
BaseGold = Enemy.level * 10
LuckBonus = Player.LCK / 10
SeedVariation = seededRandom(seed) * 0.5
FinalGold = (BaseGold + LuckBonus) * (1 + SeedVariation)
```

## World Generation

### Map Structure

**Overworld**:
- 100x100 tile grid
- Divided into 5x5 regions (20x20 tiles each)
- Each region has a biome type
- Transitions between biomes

**Regions**:
```typescript
interface Region {
  x: number, y: number;
  biome: BiomeType;
  difficulty: number;      // 1-5
  resources: Resource[];
  enemies: Enemy[];
  npcs: NPC[];
  quests: Quest[];
}
```

### Biome System

**8 Biome Types**:

1. **Plains** (Neutral)
   - Grass, trees, flowers
   - Low difficulty (1-2)
   - Enemies: Wolves, Bandits
   - Resources: Herbs, Wood

2. **Forest** (Neutral/Dark)
   - Dense trees, shadows
   - Medium difficulty (2-3)
   - Enemies: Bears, Spiders, Treants
   - Resources: Rare Herbs, Hardwood

3. **Mountain** (Neutral)
   - Rocky cliffs, caves
   - High difficulty (3-4)
   - Enemies: Golems, Harpies, Dragons
   - Resources: Ore, Gems

4. **Desert** (Light/Neutral)
   - Sand dunes, cacti, oases
   - Medium difficulty (2-3)
   - Enemies: Scorpions, Snakes, Sand Elementals
   - Resources: Crystals, Rare Minerals

5. **Swamp** (Dark)
   - Murky water, dead trees
   - High difficulty (3-4)
   - Enemies: Slimes, Zombies, Hydras
   - Resources: Poisonous Plants, Bones

6. **Tundra** (Light)
   - Snow, ice, frozen lakes
   - High difficulty (3-4)
   - Enemies: Yetis, Ice Wolves, Frost Giants
   - Resources: Ice Crystals, Rare Furs

7. **Volcano** (Dark)
   - Lava, ash, fire
   - Very High difficulty (4-5)
   - Enemies: Fire Elementals, Demons, Phoenixes
   - Resources: Obsidian, Fire Gems

8. **Ocean** (Neutral)
   - Water, islands, ships
   - Medium difficulty (2-3)
   - Enemies: Pirates, Krakens, Merfolk
   - Resources: Pearls, Coral

### Procedural Generation Rules

**Biome Placement**:
```typescript
// Seed determines starting biome
const startBiome = hashString(seed) % 8;

// Adjacent biomes influenced by seed
for (let region of regions) {
  const biomeIndex = (
    hashString(seed + region.x + region.y) % 8
  );
  region.biome = biomes[biomeIndex];
}
```

**Difficulty Scaling**:
```typescript
// Distance from spawn increases difficulty
const distanceFromSpawn = Math.sqrt(
  (x - spawnX)**2 + (y - spawnY)**2
);
const difficulty = Math.min(5, 1 + distanceFromSpawn / 20);
```

## NPC System

### NPC Types

1. **Merchants**
   - Buy/sell items
   - Inventory based on seed
   - Prices: Base * (0.8 to 1.2) seed variation

2. **Quest Givers**
   - Offer quests generated from seed
   - Reward XP, gold, items
   - Dialogue from DialogueGenerator

3. **Trainers**
   - Teach new skills
   - Require gold + level requirement
   - Available skills based on seed

4. **Townsfolk**
   - Provide lore/hints
   - No gameplay function
   - Atmosphere/immersion

### NPC Dialogue

**Greeting System**:
```typescript
const personality = hashString(seed) % 3;
// 0: Friendly
// 1: Suspicious
// 2: Wise

const greetings = {
  friendly: ["Well met!", "Ho there!", "Greetings, friend!"],
  suspicious: ["What do you want?", "State your business.", "..."],
  wise: ["The path ahead is treacherous.", "Seek wisdom, not power."]
};
```

**Quest Hooks**:
Generated from MicrostoryGenerator based on seed

## Quest System

### Quest Types

1. **Kill Quest**: Defeat X enemies
2. **Collection Quest**: Gather X items
3. **Exploration Quest**: Reach location
4. **Delivery Quest**: Bring item to NPC
5. **Boss Quest**: Defeat specific boss

### Quest Generation

```typescript
function generateQuest(seed: string): Quest {
  const type = hashString(seed) % 5;
  const target = enemies[hashString(seed + 'target') % enemies.length];
  const count = 5 + (hashString(seed + 'count') % 10);
  const reward = {
    xp: count * 50,
    gold: count * 20,
    item: generateItem(seed + 'reward')
  };
  
  return {
    type,
    title: `Defeat ${count} ${target.name}s`,
    description: MicrostoryGenerator.generateQuestBackstory(seed),
    objectives: [{ type: 'kill', target, count, current: 0 }],
    reward
  };
}
```

### Quest Progression

- Quests tied to seed (always same quests for same seed)
- Main quest chain: 10 quests leading to final boss
- Side quests: 20+ optional quests
- Quest log tracks progress
- Rewards scale with player level

## Progression Systems

### Level Caps by Region

| Region Difficulty | Enemy Level Range | Recommended Player Level |
|------------------|-------------------|--------------------------|
| 1 | 1-10 | 1-10 |
| 2 | 11-20 | 15-20 |
| 3 | 21-30 | 25-30 |
| 4 | 31-40 | 35-40 |
| 5 | 41-50 | 45-50 |

### Endgame Content

**Final Boss**:
- Level 50
- Located in center of map
- Procedural abilities based on seed
- Drops legendary item + completes seed

**Post-Game**:
- Continue exploring
- Hunt for legendary items
- Try new seed
- Compare completion times (speedrunning)

## UI/UX Design

### HUD Elements

```
┌─────────────────────────────────────────────┐
│ HP: [████████░░] 80/100    Level: 15        │
│ MP: [██████░░░░] 60/100    XP: 450/519      │
│                                              │
│ [1] [2] [3] [4] [5]  ← Skill Hotbar         │
└─────────────────────────────────────────────┘
```

### Inventory Grid

```
┌───────────────────┐
│ [I] [I] [I] [I]  │  ← 4x8 grid = 32 slots
│ [I] [W] [A] [I]  │  I = Item, W = Weapon
│ [I] [I] [I] [G]  │  A = Armor, G = Gold
│ ... (8 rows)      │
└───────────────────┘
```

### MiniMap

```
┌─────────────┐
│  ╔═══╗      │  ← Minimap (50x50 tiles shown)
│  ║ P ║      │  P = Player
│  ║   E      │  E = Enemy
│  ╚═══╝      │  ■ = Wall/Collision
│      N      │  N = NPC
└─────────────┘
```

## Performance Targets

### Frame Rate
- Target: 60 FPS
- Minimum: 30 FPS
- Optimization: Viewport culling, sprite atlases

### Memory
- Target: <100MB total memory
- Entity pooling for frequent creation/deletion
- Texture atlas for sprites

### Load Times
- Initial load: <3 seconds
- Map generation: <500ms
- Save/Load: <100ms

---

*Related: See `/docs/vision/GAME_VISION.md` for high-level vision and `/docs/architecture/` for technical implementation*
