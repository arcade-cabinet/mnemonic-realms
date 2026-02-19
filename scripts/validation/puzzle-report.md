# Puzzle Validation Report

**Generated:** 2026-02-19T19:26:55.711Z
**Validator:** PuzzleValidator
**Duration:** 0ms

## Summary

- **Total Puzzles:** 19
- **Dungeon Puzzles:** 7
- **Stagnation Zone Puzzles:** 7
- **Overworld Puzzles:** 5
- **Passed:** 19
- **Failed:** 0
- **Warnings:** 0

## Puzzle Catalog

### Dungeon Puzzles

| Puzzle | Map | Events | Mechanic | Fail Penalty |
|--------|-----|--------|----------|-------------|
| Water Valves | Depths L2 R5 | EV-D2-009, 010, 011, 012 | Turn 3 valves in order | 30 HP flood + reset |
| Sound Puzzle | Depths L3 R4 | EV-D3-005 to 010 | Strike 5 crystal pillars in ascending chord | 40 HP dissonance + reset |
| Harmonic Bridge | Depths L3 R7 | EV-D3-017 | Walk (don't run) across bridge | 50 HP shockwave + knockback |
| Paradox Corridor | Depths L5 R4 | EV-D5-005, 006 | Walk backward to progress | No penalty, just no progress |
| Crystal Receptacle | Fortress F1 R4 | EV-F1-008, 009, 010, 011 | Broadcast 3 emotion-matched fragments | None |
| Moral Dilemma Gallery | Fortress F2 R3 | EV-F2-007, 008, 009 | Free or leave 3 frozen NPCs | None (choice-based) |
| Grym Dialogue | Fortress F3 R2 | EV-F3-007, 008 | Branching dialogue based on items/recalled gods | None |

### Stagnation Zone Puzzles

| Puzzle | Map | Unlock Condition | Fail Penalty |
|--------|-----|-----------------|-------------|
| Tutorial Break | Heartfield (35, 29) | Any fragment, potency 1+ | None |
| Fury Break | Sunridge (32, 14) | Fury emotion, potency 2+ | None (wrong fragment type = no effect) |
| Dual Requirement | Shimmer Marsh (41, 10) | Fury + Water, potency 3+ | None |
| Sequential Broadcasts | Hollow Ridge (36,28)→(39,30)→(35,31) | Earth → Fire → Wind, any potency | Wrong order resets all waypoints |
| Key Item + Broadcast | Resonance Fields (42, 15) | K-15 (gate) + Awe potency 4+ | None |
| Brute Force | Luminous Wastes (34, 8) | Any fragment, potency 5 | None |
| Story Gate | Undrawn Peaks (19, 34) | MQ-08 + any potency 3+ | None |

### Overworld Puzzles

| Puzzle | Map | Events | Mechanic |
|--------|-----|--------|----------|
| Singing Stones | Resonance Fields (28-33, 43) | EV-RF-006 | Activate 5 Resonance Stones in sequence → Depths L4 entrance |
| Sketch Bridge | Undrawn Peaks (20, 20) | EV-UP-002 | Broadcast any potency 2+ fragment to solidify crossing |
| Living Sketch | Half-Drawn Forest (18, 23) | EV-HDF-001 | Broadcast potency 3+ to lock in forest section |
| Half-Built Village | Luminous Wastes (18, 18) | EV-LW-001 | 3 separate broadcasts (any, potency 2+ each) to solidify village |
| MQ-08 Trail | Half-Drawn Forest (5 positions) | EV-HDF-007 | Activate 5 Resonance Stones in sequence to navigate Sketch |
