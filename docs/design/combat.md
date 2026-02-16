# Combat Design

## System: Turn-Based JRPG

Classic turn-based combat in the tradition of Final Fantasy, Dragon Quest, and Chrono Trigger. No action timing, no real-time elements. The complexity comes from the memory system, not from mechanical dexterity.

## Turn Order

AGI-based initiative. Each combatant's turn order is determined by their AGI stat with a small random variance (seeded). Rogue's Foreshadow passive can modify this — they occasionally act before their calculated turn.

## Combat Flow

```
1. Encounter triggers (touch enemy on map or scripted)
2. Combat GUI opens with enemy info and player commands
3. Each turn: Player selects action → Action resolves → Enemy acts → Status effects tick
4. Victory: XP + Gold + possible Memory Fragment + possible Item Drop
5. Defeat: Game Over screen with retry option
```

## Player Actions

### Attack
Basic physical attack. Damage = ATK - enemy DEF + weapon bonus + class modifier.

### Skill
Class-specific abilities that cost SP. Each class has 4-6 skills that unlock via level-up and memory progression. Skills are the primary way classes differentiate in combat.

### Item
Use consumable items from inventory. Potions (HP), Mana Potions (SP), Antidotes (cure status), etc.

### Defend
Reduce incoming damage by 50% for one turn. Generates a small amount of SP.

### Flee
Attempt to escape. Success based on AGI comparison. Cannot flee from bosses.

## Damage Formula

```
Physical: floor((ATK * 1.5 - DEF * 0.8) * variance * elementMod)
Magical:  floor((INT * 1.8 - DEF * 0.4) * variance * elementMod)
Healing:  floor(INT * 1.2 * variance)

variance = 0.9 + seededRandom() * 0.2  (90%-110%)
elementMod = 1.0 (neutral), 1.5 (weakness), 0.5 (resistance)
```

## Status Effects

| Status | Effect | Duration | Cure |
|--------|--------|----------|------|
| Poison | Lose 5% max HP per turn | 3 turns | Antidote, Cleric cleanse |
| Stun | Skip next turn | 1 turn | Auto-recovers |
| Slow | AGI halved | 2 turns | Haste item |
| Weakness | DEF reduced 30% | 3 turns | Defend action cleanses |
| Inspired | +20% all stats | 3 turns | Memory-granted buff |
| Stasis | Cannot act or use memory abilities | 2-3 turns | Stasis Breaker (C-SC-04), auto-recovers |

## Enemy Design Principles

### Overworld Enemies
- Low to medium difficulty
- 1-2 abilities each
- Teach combat basics
- Drop common items and small memory fragments

### Dungeon Enemies
- Medium difficulty, scaled 1.3x-1.9x from overworld
- 2-3 abilities each, may have status effects
- Drop better items and rarer memory fragments

### Bosses
- High difficulty, unique mechanics
- Multi-phase fights where the boss's behavior changes
- Always drop a significant memory fragment (used for story progression)
- Cannot be fled from

### Preserver Agents (Act II+)
- Unique enemy type: they try to freeze the player rather than kill
- Their attacks inflict Stasis (new status: can't use memory-based abilities for 2 turns)
- Defeating them breaks stagnation in the surrounding area

## Victory Rewards

```
XP:    Base value per enemy type, modified by level difference
Gold:  Base value per enemy type, flat
Items: % chance drop table per enemy type
Memory: Certain enemies drop memory fragments (boss = guaranteed, elite = 50%, normal = 10%)
```

## Death / Game Over

On defeat, the player sees the Game Over screen with options:
- **Retry**: Restart the combat encounter with full HP/SP
- **Return to Village**: Teleport to hub, keep all items/XP, lose nothing

No permadeath. No lost progress. The game respects the player's time. Death is a minor setback, not a punishment.

## Difficulty Scaling

Enemy stats scale with the player's level using a soft curve:

```
enemyStat = baseStat * (1 + 0.05 * max(0, playerLevel - enemyBaseLevel))
```

This prevents trivial encounters while keeping the game accessible. Overworld enemies cap their scaling earlier than dungeon enemies.
