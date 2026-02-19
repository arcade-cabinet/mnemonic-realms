# Gap Analysis: Game Content Implementation Status

> Generated: 2026-02-19
> Purpose: Map documented content vs actual implementation to identify gaps

## Executive Summary

The game has **extensive documentation** (26+ files across bible/, design/, maps/, story/, world/) and **significant implementation** already exists. This analysis identifies what's missing, what's incomplete, and what needs quality validation.

## Implementation Status by Category

### ✅ COMPLETE: Core Systems
- Combat system (damage formulas, turn order, variance)
- Enemy AI system
- Inventory management
- Memory system (collect, remix, broadcast)
- Progression system (XP, leveling)
- Quest system (state machine)
- Save/load system
- Shop system
- Skills system
- Vibrancy system
- NPC interaction system
- Encounter system

### ✅ COMPLETE: Maps
All 20 maps exist as TypeScript + TMX files:
- Village Hub, Heartfield, Ambergrove, Millbrook, Sunridge
- Shimmer Marsh, Hollow Ridge, Flickerveil, Resonance Fields
- Luminous Wastes, Undrawn Peaks, Half-Drawn Forest
- Depths L1-L5 (5 dungeon floors)
- Fortress F1-F3 (3 fortress floors)

### ✅ COMPLETE: Quests
All 28 quests implemented:
- 10 main quests (MQ-01 through MQ-10)
- 14 side quests (SQ-01 through SQ-14)
- 4 god recall quests (GQ-01 through GQ-04)

### ✅ COMPLETE: Dialogue
60+ dialogue files covering:
- All named NPCs (Artun, Hana, Khali, Hark, Nyro, Nel, Janik, Julz, Reza, Vash, etc.)
- All god recall forms (Cantara, Harmonia, Tacet, Tempestus, Floriana, Thornweald, Autumnus, Sylvanos, Solara, Pyralis, Vesperis, Prisma, Errantis, Jubila, Tecton, Vortis)
- Boss encounters (Archive Keeper, First Dreamer, Curator, Curator's Right Hand)
- Story beats (awakening, freezing, fortress entry, ending, etc.)

### ✅ COMPLETE: Equipment
- **Armor**: 14/14 pieces (all documented armor exists)
- **Weapons**: 33/32 documented (all weapons exist)
- **Consumables**: 24/24 items (all consumables exist)

### ⚠️ PARTIAL: Enemies
**Status**: 25/42 enemies implemented (59% complete)

**Implemented** (25 enemies):
- E-SL: Meadow Sprite, Grass Serpent, Forest Wisp, Thornback Beetle, River Nymph, Stone Crab, Highland Hawk, Crag Golem (8/8 Settled Lands ✅)
- E-FR: Mire Crawler, Echo Toad, Bog Wisp, Wind Elemental, Mountain Drake, Phantom Fox, Canopy Crawler (7/11 Frontier)
- E-SK: Sketch Phantom, Wireframe Drake (2/6 Sketch)
- E-DP: Memory Shade, Drowned Scholar, Abyssal Memory (3/5 Depths)
- E-PV: Preserver Scout, Preserver Agent (2/4 Preserver)
- Bosses: Stagnation Heart, Grym's Right Hand (2/9 bosses)

**MISSING** (17 enemies):
- E-FR: Flicker Wisp, Sound Echo, Stone Guardian, Harmony Wraith (4 Frontier enemies)
- E-SK: Void Wisp, Sketch Wolf, Unfinished Treant, Memory Echo (4 Sketch enemies)
- E-DP: Resonant Crystal, Songline Phantom (2 Depths enemies)
- E-PV: Preserver Captain, Preserver Archivist (2 Preserver enemies)
- Bosses: 4 Shrine Guardians, The Archivist, The Resonant King, The Conductor, The First Dreamer, Grym (7 bosses)

### ❓ UNKNOWN: Event Placement
**Documented**: 252 events across all maps
- 26 NPC dialogue events
- 54 treasure chests
- 60 map transitions
- 25 cutscene/lore events
- 15 puzzle mechanics
- 93+ Resonance Stones
- 11 boss/combat encounters
- 3 parallel/ambient events

**Status**: Need to verify each event is wired correctly in map files

### ❌ MISSING: Visual Validation Systems
**User's Primary Concern**: "i do not want anything that looks out of place anywhere"

**No systems found for**:
1. Sprite sheet usage verification
2. Map visual alignment checks
3. Tile boundary validation
4. NPC sprite consistency checks
5. Visual tier (Muted/Normal/Vivid) validation

### ❌ MISSING: Content Verification Tools
**Need tools to verify**:
1. All 54 treasure chests are placed per event-placement.md
2. All 93+ Resonance Stones are placed correctly
3. All NPCs are on correct maps with correct sprites
4. All enemy spawn zones match documentation
5. All quest triggers are wired correctly

## Priority Gaps (User's Main Goals)

### Priority 1: Visual Consistency
> "each map i want visually assessed. i do not want anything that looks out of place anywhere"

**Required**:
- Map-by-map visual assessment tool
- Sprite alignment validator
- Tile boundary checker
- Visual tier consistency validator

### Priority 2: Sprite Documentation
> "you must thoroughly understand and document every single sprite sheet and how they are used, what direction they can face, everything"

**Status**: Documentation exists in `docs/design/spritesheet-spec.md` but needs:
- Verification that all sprites match spec
- Direction validation (4-direction walk cycles)
- Frame count validation
- Usage documentation per sprite

### Priority 3: Complete Enemy Implementation
**Missing 17 enemies** need to be implemented with:
- Correct stats per enemies-catalog.md
- All abilities implemented
- Correct drop tables
- Correct spawn zones

### Priority 4: Event Placement Verification
**All 252 events** need verification:
- NPCs at correct positions
- Treasure chests at correct positions
- Resonance Stones at correct positions
- Transitions wired correctly
- Cutscenes trigger correctly

### Priority 5: Map Mechanics
> "maps that actually work so that there are actual paths and boundaries and you cant walk over shit you shouldn't be able to"

**Need to verify**:
- Collision layers are correct
- Walkable paths are clear
- Boundaries prevent walking over obstacles
- Tile snapping works correctly

### Priority 6: Random Encounters
> "a fully implemented random encounter system"

**Status**: Encounter system exists, need to verify:
- Encounter rates per zone
- Enemy group compositions
- Level scaling
- Spawn zones match documentation

## Recommended Spec Structure

Based on gaps identified, the spec should focus on:

1. **Visual Validation & Polish**
   - Map visual assessment
   - Sprite consistency checks
   - Alignment validation
   - Tile boundary verification

2. **Missing Content Implementation**
   - 17 missing enemies
   - Event placement verification
   - Resonance Stone placement

3. **Quality Assurance**
   - Map walkability testing
   - Visual tier consistency
   - NPC placement verification
   - Treasure chest verification

4. **Documentation Verification**
   - Sprite sheet usage matches spec
   - Enemy stats match catalog
   - Item stats match catalog
   - Quest flow matches documentation

## Files Requiring Deep Analysis

### High Priority
1. `main/server/maps/events/*.ts` - Verify all 252 events are wired
2. `main/database/enemies/*.ts` - Verify stats match documentation
3. TMX files - Verify collision layers, event placement, visual tiers
4. Sprite files - Verify all sprites exist and match spec

### Medium Priority
1. `main/server/systems/encounters.ts` - Verify random encounter logic
2. `main/server/systems/vibrancy.ts` - Verify visual tier swapping
3. `main/server/quests/*.ts` - Verify quest flow matches documentation

## Next Steps

1. Create requirements.md focusing on visual validation and missing content
2. Create design.md with validation tools and implementation approach
3. Create tasks.md with specific verification and implementation tasks
4. Prioritize visual consistency (user's #1 concern)
