# Implementation Plan: Complete Game Content and Creative Direction

## Overview

This implementation plan converts the validation-focused design into actionable coding tasks. The approach follows seven phases: building validation infrastructure, running initial validation, implementing missing enemies, fixing visual consistency issues, verifying event placement, ensuring content completeness, and final validation.

The implementation leverages TypeScript with libraries including tmx-parser/fast-xml-parser for TMX parsing, sharp/jimp for sprite analysis, TypeScript compiler API for AST parsing, remark for markdown parsing, and fast-check for property-based testing.

All validation systems produce structured reports (JSON/Markdown/HTML) with specific file paths, line numbers, and actionable issue descriptions. The goal is 100% content completeness with all 20 maps validated, all 252 events verified, all 42 enemies implemented, and comprehensive validation reports generated.

## Tasks

- [ ] 1. Set up validation infrastructure and core utilities
  - Create project structure for validation tools in `scripts/validation/`
  - Install dependencies: tmx-parser, fast-xml-parser, sharp, remark, remark-gfm, fast-check
  - Create shared types and interfaces for validation reports
  - Set up logging infrastructure with console and file output
  - Create validation cache system for parsed files
  - _Requirements: 20.1, 20.2_

- [ ] 2. Implement Visual Validator
  - [ ] 2.1 Create TMX parser integration
    - Write TMX file parser using fast-xml-parser
    - Extract all layers (background, midground, foreground, collision)
    - Parse tile data and sprite references
    - _Requirements: 1.1_

  - [ ] 2.2 Implement sprite tier detection
    - Parse visual tier documentation from docs/design/visual-direction.md
    - Create sprite tier matcher (muted/normal/vivid)
    - Validate sprite variants against expected tiers
    - _Requirements: 1.2, 13.1, 13.2_

  - [ ] 2.3 Create tile alignment checker
    - Verify tiles align to 16x16 grid
    - Detect misaligned tiles with coordinates
    - Check for visual inconsistencies between adjacent tiles
    - _Requirements: 1.3_

  - [ ] 2.4 Implement layer order validator
    - Verify z-order: background < midground < foreground < collision
    - Report layer ordering issues
    - _Requirements: 1.4_

  - [ ] 2.5 Create visual report generator
    - Generate JSON report with all visual issues
    - Generate Markdown report for human readability
    - Include file paths, coordinates, and issue descriptions
    - _Requirements: 1.5, 20.1, 20.2_

  - [ ]* 2.6 Write property test for visual consistency
    - **Property 1: Map Visual Consistency**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

- [ ] 3. Implement Sprite Analyzer
  - [ ] 3.1 Create sprite sheet parser
    - Load PNG files using sharp
    - Extract dimensions and calculate grid layout
    - Determine sprite category (character/npc/enemy/boss/effect)
    - _Requirements: 2.1_

  - [ ] 3.2 Implement walk cycle validator
    - Verify 4-direction walk cycles (down/left/right/up)
    - Check for 4 frames per direction
    - Calculate row offsets for each direction
    - Report missing or incomplete frames
    - _Requirements: 2.2, 2.3_

  - [ ] 3.3 Create sprite usage tracker
    - Scan all TMX files for sprite references
    - Build map of sprite ID to map usage
    - Document which maps use each sprite
    - _Requirements: 2.4_

  - [ ] 3.4 Implement direction validator
    - Parse spritesheet specification from docs/design/spritesheet-spec.md
    - Verify sprite directions match specification
    - Validate frame counts per direction
    - _Requirements: 2.5_

  - [ ] 3.5 Create sprite documentation generator
    - Generate comprehensive sprite documentation (JSON + Markdown)
    - Include frame counts, dimensions, directions, usage
    - List sprites with missing frames or incorrect dimensions
    - _Requirements: 2.1, 2.4_

  - [ ]* 3.6 Write property tests for sprite analysis
    - **Property 2: Sprite Documentation Round-Trip**
    - **Property 3: Sprite Completeness Validation**
    - **Property 4: Sprite Usage Documentation**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

- [ ] 4. Implement Map Validator
  - [ ] 4.1 Create collision layer parser
    - Parse collision layer from TMX files
    - Extract collision data for all tiles
    - Build collision map for walkability checks
    - _Requirements: 3.1_

  - [ ] 4.2 Implement collision mismatch detector
    - Define obstacle tile types (wall, water, mountain, tree, rock, building)
    - Compare visual tiles against collision layer
    - Report tiles where visual appearance doesn't match collision
    - _Requirements: 3.2_

  - [ ] 4.3 Create boundary validator
    - Verify edge tiles have collision enabled
    - Check for walkable tiles at map edges
    - Validate tile snapping at boundaries
    - _Requirements: 3.3, 3.4_

  - [ ] 4.4 Implement transition validator
    - Parse transition documentation from docs/maps/event-placement.md
    - Verify source events exist at documented coordinates
    - Verify destination maps and coordinates are correct
    - Check bidirectional transitions have reverse transitions
    - _Requirements: 5.4, 11.1, 11.2, 11.3_

  - [ ] 4.5 Create map reachability analyzer
    - Build transition graph (nodes = maps, edges = transitions)
    - Implement breadth-first search from Village Hub
    - Find unreachable maps
    - Generate reachability report
    - _Requirements: 11.5_

  - [ ] 4.6 Create walkability report generator
    - Generate JSON report with collision issues
    - Generate Markdown report with boundary problems
    - Include transition validation results
    - _Requirements: 3.5, 20.1, 20.2_

  - [ ]* 4.7 Write property tests for map validation
    - **Property 5: Collision Layer Consistency**
    - **Property 6: Map Boundary Integrity**
    - **Property 8: Map Transition Correctness**
    - **Property 24: Map Reachability**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 5.4, 11.1, 11.2, 11.3, 11.5**

- [ ] 5. Implement Event Verifier
  - [ ] 5.1 Create event documentation parser
    - Parse event placement documentation from docs/maps/event-placement.md
    - Extract all 252 documented events with coordinates
    - Build expected event list by map
    - Categorize events (NPC, chest, stone, transition, cutscene, puzzle, boss, ambient)
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [ ] 5.2 Create TMX event layer parser
    - Parse event layers from TMX files
    - Extract event objects with positions and properties
    - Parse event implementation TypeScript files
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ] 5.3 Implement NPC event verifier
    - Verify all 26 NPC dialogue events at documented coordinates
    - Check NPC graphic and dialogue file references
    - Validate trigger types (touch/action)
    - _Requirements: 5.1_

  - [ ] 5.4 Implement treasure chest verifier
    - Verify all 54 treasure chests at documented coordinates
    - Check chest rewards match documentation
    - Validate persistence (opened state)
    - _Requirements: 5.2, 17.1, 17.3, 17.4_

  - [ ] 5.5 Implement Resonance Stone verifier
    - Verify all 93+ Resonance Stones at documented coordinates
    - Check memory fragment assignments
    - Validate quest progress updates
    - _Requirements: 5.3, 18.1, 18.2, 18.3, 18.4_

  - [ ] 5.6 Implement cutscene event verifier
    - Verify all 25 cutscene events trigger at documented locations
    - Check cutscene trigger conditions
    - Validate linked quest updates
    - _Requirements: 5.5_

  - [ ] 5.7 Create missing/undocumented event detector
    - Compare documented events against implemented events
    - Report missing events with expected coordinates
    - Report undocumented events with actual coordinates
    - _Requirements: 5.6, 5.7_

  - [ ] 5.8 Create comprehensive event report generator
    - Generate JSON report with all event issues
    - Generate Markdown report per map
    - Include event placement validation results
    - _Requirements: 20.1, 20.2_

  - [ ]* 5.9 Write property tests for event verification
    - **Property 7: Event Position Validation**
    - **Property 9: Event Documentation Completeness**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7**

- [ ] 6. Implement Content Validator
  - [ ] 6.1 Create catalog parsers
    - Parse enemies-catalog.md using remark
    - Parse items-catalog.md for equipment
    - Parse quest-chains.md for quest documentation
    - Extract structured data from markdown tables
    - _Requirements: 4.1, 12.1, 12.2, 12.3, 9.1_

  - [ ] 6.2 Create implementation parsers
    - Use TypeScript compiler API to parse enemy implementations
    - Parse dialogue files from main/server/dialogue/**/*.ts
    - Parse shop configurations from main/server/shops/*.ts
    - Extract stats, abilities, and properties via AST
    - _Requirements: 4.2, 10.1, 7.4_

  - [ ] 6.3 Implement enemy stat validator
    - Compare implemented enemy stats against catalog
    - Report stat mismatches with file paths and line numbers
    - Validate abilities match documentation
    - Check drop tables match catalog
    - _Requirements: 4.2, 4.3, 4.4_

  - [ ] 6.4 Implement enemy completeness checker
    - Identify all 17 missing enemies
    - Calculate completeness percentage
    - List missing enemies with catalog references
    - _Requirements: 4.1, 4.6_

  - [ ] 6.5 Implement equipment obtainability validator
    - Check all armor pieces (14) are obtainable
    - Check all weapons (33) are obtainable
    - Check all consumables (24) are obtainable
    - Verify sources: shops, quests, treasure chests
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ] 6.6 Implement quest chain validator
    - Verify all 10 main quests are accessible in sequence
    - Check quest prerequisites are correctly configured
    - Verify 4 god recall quests are accessible
    - Validate ending sequence is reachable
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 6.7 Implement dialogue reference validator
    - Verify all 60+ dialogue files are referenced by events
    - Report orphaned dialogue files
    - Report missing dialogue file references
    - Check dialogue trees for dead ends
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 6.8 Implement shop inventory validator
    - Verify shop inventories match documentation
    - Check shop visual indicators exist
    - Validate shop NPC placement
    - _Requirements: 7.2, 7.3, 7.4_

  - [ ] 6.9 Implement boss encounter validator
    - Verify all 9 bosses are implemented
    - Check boss reachability through quest progression
    - Validate boss dialogue triggers
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [ ] 6.10 Implement encounter zone validator
    - Verify enemy groups match documentation per zone
    - Check encounter rates are configured
    - Validate level scaling
    - Verify encounter-free zones
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 6.11 Create content completeness report generator
    - Calculate completeness percentage per category
    - Generate master report with all content validation results
    - Include specific file paths and line numbers for issues
    - List missing and incomplete content
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

  - [ ]* 6.12 Write property tests for content validation
    - **Property 10: Enemy Implementation Completeness**
    - **Property 11: Encounter Zone Validation**
    - **Property 12: Shop Content Validation**
    - **Property 13: Quest Chain Accessibility**
    - **Property 14: Dialogue Reference Integrity**
    - **Property 15: Dialogue Tree Completeness**
    - **Property 16: Boss Encounter Validation**
    - **Property 17: Equipment Obtainability**
    - **Property 25: Validation Report Completeness**
    - **Validates: Requirements 4.1-4.6, 6.1-6.5, 7.2-7.4, 9.1-9.5, 10.1-10.4, 12.1-12.5, 14.1-14.5, 20.1-20.6**

- [ ] 7. Create Validation Orchestrator
  - Create main validation coordinator that runs all validators
  - Implement parallel processing with worker threads
  - Add progress reporting for long-running validations
  - Aggregate reports from all validators
  - Generate master validation report (JSON + Markdown + HTML)
  - _Requirements: 20.1, 20.2, 20.5_

- [ ] 8. Create validation CLI and npm scripts
  - Create CLI tool for interactive validation
  - Add npm scripts: validate:all, validate:visual, validate:maps, validate:events, validate:content, validate:sprites
  - Implement strict mode (fail fast) and permissive mode (report all)
  - Add report generation scripts: report:html, report:summary
  - _Requirements: 20.1, 20.2_

- [ ] 9. Checkpoint - Run initial validation and review reports
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement Enemy Implementer tool
  - [ ] 10.1 Create enemy template generator
    - Design TypeScript template for enemy classes
    - Include stats, abilities, drops, fragment affinity
    - Support RPGJS @Enemy decorator format
    - _Requirements: 4.1_

  - [ ] 10.2 Create catalog parser for enemy data
    - Parse enemies-catalog.md to extract missing enemy entries
    - Extract stats (HP, ATK, INT, DEF, AGI, level)
    - Extract abilities with descriptions and types
    - Extract drop tables and rewards
    - _Requirements: 4.2_

  - [ ] 10.3 Implement enemy file generator
    - Generate TypeScript class files from catalog entries
    - Create skill implementations for abilities
    - Write files to main/database/enemies/
    - _Requirements: 4.1, 4.3_

  - [ ] 10.4 Implement enemy registration system
    - Update enemy database index to register new enemies
    - Update spawn zone configurations in encounter system
    - _Requirements: 4.5_

  - [ ] 10.5 Create implementation validator
    - Validate generated implementation matches catalog
    - Run Content Validator on generated enemies
    - Report any mismatches
    - _Requirements: 4.6_

  - [ ]* 10.6 Write unit tests for enemy implementer
    - Test template generation
    - Test catalog parsing
    - Test file generation
    - Test registration

- [x] 11. Implement all 17 missing enemies
  - [ ] 11.1 Implement Forgotten Realm enemies (4 enemies)
    - Generate E-FR-08: Flicker Wisp (HP: 75, INT: 24, abilities: Prismatic Bolt, Dazzle Flash)
    - Generate E-FR-09: Sound Echo (HP: 80, INT: 22, abilities: Sonic Pulse, Resonant Scream)
    - Generate E-FR-10: Stone Guardian (HP: 120, DEF: 28, abilities: Boulder Throw, Stone Skin)
    - Generate E-FR-11: Harmony Wraith (HP: 90, INT: 26, abilities: Harmony Strike, Peaceful Aura)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 11.2 Implement Sketch Realm enemies (5 enemies)
    - Generate E-SK-02: Void Wisp (HP: 65, INT: 20, abilities: Void Bolt, Erase)
    - Generate E-SK-03: Wireframe Drake (HP: 110, ATK: 24, abilities: Wire Slash, Incomplete Form)
    - Generate E-SK-04: Sketch Wolf (HP: 85, ATK: 22, AGI: 24, abilities: Quick Sketch, Blur Strike)
    - Generate E-SK-05: Unfinished Treant (HP: 130, DEF: 26, abilities: Root Grasp, Incomplete Shield)
    - Generate E-SK-06: Memory Echo (HP: 70, INT: 24, abilities: Memory Drain, Echo Strike)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 11.3 Implement Depths enemies (2 enemies)
    - Generate E-DP-03: Resonant Crystal (HP: 95, INT: 28, DEF: 24, abilities: Crystal Beam, Resonance)
    - Generate E-DP-04: Songline Phantom (HP: 100, INT: 26, abilities: Songline Strike, Phantom Wail)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 11.4 Implement Preserver enemies (2 enemies)
    - Generate E-PV-03: Preserver Captain (HP: 140, ATK: 28, DEF: 26, abilities: Command Strike, Rally)
    - Generate E-PV-04: Preserver Archivist (HP: 110, INT: 30, abilities: Archive Blast, Preserve)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 11.5 Implement boss enemies (4 bosses)
    - Generate BO-02: Shrine Guardians (4 variants: Courage, Compassion, Curiosity, Connection)
    - Generate BO-03a: The Archivist (HP: 800, multi-phase boss)
    - Generate BO-03b: The Resonant King (HP: 850, music-based abilities)
    - Generate BO-03c: The Conductor (HP: 900, orchestration mechanics)
    - Generate BO-03d: The First Dreamer (HP: 1000, final boss)
    - Generate BO-04b: The Archive Keeper (HP: 750, knowledge-based abilities)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 14.1, 14.2_

  - [ ]* 11.6 Write unit tests for generated enemies
    - Test each enemy has correct stats
    - Test abilities are implemented
    - Test drop tables are configured
    - Test spawn zones are assigned

- [ ] 12. Checkpoint - Validate all enemies are implemented correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Address visual consistency issues
  - [ ] 13.1 Review Visual Validator reports
    - Analyze visual assessment reports for all 20 maps
    - Prioritize critical visual issues
    - Create fix list with specific coordinates
    - _Requirements: 1.5_

  - [ ] 13.2 Fix misaligned tiles
    - Correct tiles not aligned to 16x16 grid
    - Update TMX files with corrected positions
    - Re-run Visual Validator to confirm fixes
    - _Requirements: 1.3_

  - [ ] 13.3 Fix sprite tier mismatches
    - Update sprites to match documented visual tiers
    - Ensure muted/normal/vivid variants exist where needed
    - Verify Vibrancy System updates sprites correctly
    - _Requirements: 1.2, 13.1, 13.2, 13.4_

  - [ ] 13.4 Fix layer ordering issues
    - Correct layer z-order in TMX files
    - Ensure background < midground < foreground < collision
    - _Requirements: 1.4_

  - [ ] 13.5 Add shop visual indicators
    - Add shop signage or visual markers to shop buildings
    - Verify shop NPCs are positioned inside shops
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 13.6 Write property tests for visual tier consistency
    - **Property 18: Visual Tier Consistency**
    - **Validates: Requirements 13.1, 13.2, 13.4**

- [ ] 14. Checkpoint - Verify all visual issues are resolved
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Verify and fix event placement
  - [ ] 15.1 Review Event Verifier reports
    - Analyze event placement reports for all maps
    - Identify missing events with expected coordinates
    - Identify undocumented events with actual coordinates
    - _Requirements: 5.6, 5.7_

  - [ ] 15.2 Add missing NPC dialogue events
    - Place missing NPC events at documented coordinates
    - Wire dialogue file references
    - Configure trigger types (touch/action)
    - _Requirements: 5.1_

  - [ ] 15.3 Add missing treasure chests
    - Place missing chest events at documented coordinates
    - Configure rewards to match documentation
    - Set up persistence for opened state
    - _Requirements: 5.2, 17.1, 17.2_

  - [ ] 15.4 Add missing Resonance Stones
    - Place missing stone events at documented coordinates
    - Assign correct memory fragments
    - Wire quest progress updates
    - _Requirements: 5.3, 18.1, 18.2_

  - [ ] 15.5 Fix incorrectly positioned events
    - Move events to correct coordinates per documentation
    - Update event properties if needed
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [ ] 15.6 Fix map transitions
    - Verify all 60 transitions wire to correct destinations
    - Add missing reverse transitions for bidirectional transitions
    - Fix transition trigger zones
    - _Requirements: 5.4, 11.1, 11.2, 11.3_

  - [ ] 15.7 Document or remove undocumented events
    - Review undocumented events with user
    - Either add to documentation or remove from maps
    - _Requirements: 5.7_

  - [ ]* 15.8 Write integration tests for event placement
    - Test NPC events trigger correctly
    - Test treasure chests give correct rewards
    - Test Resonance Stones update quest progress
    - Test map transitions work bidirectionally

- [ ] 16. Checkpoint - Verify all 252 events are correctly placed
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Address content completeness gaps
  - [ ] 17.1 Review Content Validator reports
    - Analyze content completeness reports
    - Identify stat mismatches with file paths and line numbers
    - List missing dialogue references
    - Note shop inventory discrepancies
    - _Requirements: 20.1, 20.2, 20.3_

  - [ ] 17.2 Fix enemy stat mismatches
    - Update enemy implementations to match catalog
    - Correct HP, ATK, INT, DEF, AGI, level values
    - Fix ability implementations
    - Update drop tables
    - _Requirements: 4.2, 4.3, 4.4_

  - [ ] 17.3 Fix dialogue references
    - Add missing dialogue file references to events
    - Remove references to non-existent dialogue files
    - Fix dialogue tree dead ends
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 17.4 Fix shop inventories
    - Update shop configurations to match documentation
    - Ensure all equipment is obtainable
    - Verify shop prices match documentation
    - _Requirements: 7.4, 12.1, 12.2, 12.3_

  - [ ] 17.5 Verify quest chain accessibility
    - Test all 10 main quests are accessible in sequence
    - Verify quest prerequisites work correctly
    - Test 4 god recall quests are accessible
    - Verify ending sequence is reachable
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 17.6 Verify boss encounters
    - Test all 9 bosses are reachable through gameplay
    - Verify boss dialogue triggers before and after combat
    - Test boss defeat updates quest state
    - _Requirements: 14.3, 14.4, 14.5_

  - [ ]* 17.7 Write property tests for additional content validation
    - **Property 19: Puzzle Mechanic Validation**
    - **Property 20: NPC Placement and Behavior**
    - **Property 21: Treasure Distribution Validation**
    - **Property 22: Resonance Stone Collection**
    - **Property 23: Dungeon Progression Connectivity**
    - **Validates: Requirements 15.1-15.4, 16.1-16.5, 17.1-17.4, 18.1-18.4, 19.1-19.5**

- [ ] 18. Checkpoint - Verify 100% content completeness
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Implement player journey initialization
  - [ ] 19.1 Create awakening scripted event
    - Implement awakening event in Village Hub
    - Provide clear initial objectives
    - Introduce core mechanics (movement, interaction, memory collection)
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ] 19.2 Wire awakening event to first quest
    - Trigger first main quest on awakening completion
    - Provide clear directional guidance to next location
    - _Requirements: 8.4, 8.5_

  - [ ]* 19.3 Write integration tests for player journey
    - Test awakening event triggers on game start
    - Test first quest activates after awakening
    - Test player receives clear guidance

- [ ] 20. Validate puzzle mechanics
  - [ ] 20.1 Review puzzle documentation
    - Parse puzzle catalog from documentation
    - Identify all 15 documented puzzles
    - Note puzzle locations and mechanics
    - _Requirements: 15.1_

  - [ ] 20.2 Verify puzzle implementations
    - Check each puzzle is implemented on documented map
    - Verify puzzle triggers correct reward when solved
    - Test puzzle prerequisite checks
    - _Requirements: 15.2, 15.3, 15.4_

  - [ ]* 20.3 Write unit tests for puzzle mechanics
    - Test puzzle solution detection
    - Test reward distribution
    - Test prerequisite enforcement

- [ ] 21. Validate NPC placement and behavior
  - [ ] 21.1 Verify NPC placement
    - Check all named NPCs are on documented maps
    - Verify NPC sprites match documentation
    - Test NPC interaction triggers work at appropriate distances
    - _Requirements: 16.1, 16.2, 16.5_

  - [ ] 21.2 Verify NPC dialogue states
    - Test all documented dialogue states are accessible
    - Verify dialogue state transitions work correctly
    - _Requirements: 16.3, 16.4_

  - [ ]* 21.3 Write integration tests for NPC behavior
    - Test NPC dialogue triggers
    - Test dialogue state changes
    - Test NPC movement patterns

- [ ] 22. Validate dungeon progression
  - [ ] 22.1 Verify Depths progression
    - Check all 5 Depths floors are connected in sequence
    - Verify encounters match difficulty progression
    - Test boss encounters on correct floors
    - _Requirements: 19.1, 19.2, 19.3_

  - [ ] 22.2 Verify Fortress progression
    - Check all 3 Fortress floors are connected in sequence
    - Verify encounters match difficulty progression
    - Test boss encounters on correct floors
    - _Requirements: 19.1, 19.2, 19.3_

  - [ ] 22.3 Verify dungeon accessibility
    - Test dungeons are accessible through quest progression
    - Verify dungeon prerequisites are enforced
    - _Requirements: 19.4, 19.5_

  - [ ]* 22.4 Write integration tests for dungeon progression
    - Test floor transitions work correctly
    - Test encounter difficulty scales appropriately
    - Test boss encounters trigger on correct floors

- [ ] 23. Final validation pass
  - [ ] 23.1 Run full validation suite
    - Execute all validators (Visual, Sprite, Map, Event, Content)
    - Generate comprehensive reports (JSON + Markdown + HTML)
    - _Requirements: 20.1, 20.2, 20.5_

  - [ ] 23.2 Review final reports
    - Analyze all validation reports
    - Verify no critical issues remain
    - Document any remaining minor issues
    - _Requirements: 20.3, 20.4_

  - [ ] 23.3 Verify all 25 correctness properties pass
    - Run all property-based tests
    - Ensure minimum 100 iterations per property
    - Verify all properties pass
    - _Requirements: All requirements_

  - [ ] 23.4 Generate content completeness certificate
    - Calculate final completeness percentage
    - Generate summary report with all metrics
    - Document validation results
    - _Requirements: 20.6_

- [ ] 24. Final checkpoint - Complete validation and polish
  - Ensure all tests pass, ask the user if questions arise.


## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and user feedback
- Property tests validate universal correctness properties (25 total)
- Unit tests validate specific examples and edge cases
- All validators produce structured reports with file paths and line numbers
- Implementation uses TypeScript with tmx-parser, sharp, remark, and fast-check
- Validation can run in strict mode (fail fast) or permissive mode (report all)
- Reports generated in JSON, Markdown, and HTML formats
- Enemy implementation uses template-based generation from catalog
- All 252 events must be verified across 20 maps
- All 42 enemies must be implemented (25 existing + 17 missing)
- Visual consistency validation covers all maps and sprites
- Content completeness target is 100% across all categories
