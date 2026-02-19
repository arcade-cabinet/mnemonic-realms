# Ralph Loop Execution Plan - Mnemonic Realms Specs

## Overview
Execute two major specs in parallel where possible, with proper dependency management:
1. **Complete Game Content and Creative Direction** (validation & content completion)
2. **Mobile Deployment and PWA** (platform abstraction & deployment)

## Execution Strategy

### Phase 0: Asset Curation and Organization (NEW - Must run first)
Critical foundation work - organize assets before validation:

#### Content Spec - Asset Organization
- [ ] US-000: Audit and curate tileset assets
  - Scan all tileset directories in assets/tilesets/
  - Identify tilesets with TMX/TSX files (prioritize these)
  - Identify tilesets with Rules files (auto-tiling support)
  - Map tilesets to game zones (Village, Forest, Depths, Sketch, etc.)
  - Create asset inventory with TMX/TSX availability
  - Document which tilesets have pre-configured collision/rules
  
- [ ] US-001-NEW: Create organized asset structure
  - Design new directory structure: assets/game/zones/{zone-name}/
  - Move only relevant tilesets that match game aesthetic
  - Prioritize tilesets with TMX/TSX files over raw PNGs
  - Preserve TMX example maps and Rules files
  - Create zone-specific subdirectories (terrain, objects, buildings, etc.)
  - Document asset sources and TMX compatibility
  
- [ ] US-002-NEW: Validate TMX/TSX compatibility
  - Test all preserved TMX files load correctly
  - Verify TSX tilesets reference correct PNG paths
  - Check Rules files for auto-tiling configurations
  - Document collision layers in example TMX files
  - Create compatibility report for each tileset

### Phase 1: Independent Foundation Work (Parallel)
These tasks have no dependencies and can run in parallel:

#### Content Spec - Validation Infrastructure (Tasks 1-8)
- [ ] US-003-OLD: Set up validation infrastructure and core utilities
- [ ] US-004-OLD: Implement Visual Validator (2.1-2.6)
- [ ] US-005-OLD: Implement Sprite Analyzer (3.1-3.6)
- [ ] US-006-OLD: Implement Map Validator (4.1-4.7)
- [ ] US-007-OLD: Implement Event Verifier (5.1-5.9)
- [ ] US-008-OLD: Implement Content Validator (6.1-6.12)
- [ ] US-009-OLD: Create Validation Orchestrator
- [ ] US-010-OLD: Create validation CLI and npm scripts

#### Mobile Spec - Platform Foundation (Tasks 1-7)
- [ ] US-011-OLD: Set up project structure and dependencies (Task 1)
- [ ] US-012-OLD: Implement platform detection module (Tasks 2.1-2.4)
- [ ] US-013-OLD: Implement storage abstraction layer (Tasks 3.1-3.4)
- [ ] US-014-OLD: Implement SQLite storage provider (Tasks 4.1-4.7)
- [ ] US-015-OLD: Implement sql.js storage provider (Tasks 6.1-6.4)
- [ ] US-016-OLD: Implement haptics controller (Tasks 7.1-7.5)

### Phase 2: Content Validation & Fixes (Sequential)
Must run after Phase 0 and Phase 1 Content tasks complete:

- [ ] US-017-OLD: Run initial validation and review reports (Task 9)
- [ ] US-018-OLD: Implement Enemy Implementer tool (Tasks 10.1-10.6)
- [ ] US-019-OLD: Implement all 17 missing enemies (Tasks 11.1-11.6)
- [ ] US-020-OLD: Validate all enemies are implemented correctly (Task 12)
- [ ] US-021-OLD: Address visual consistency issues (Tasks 13.1-13.6)
- [ ] US-022-OLD: Verify all visual issues are resolved (Task 14)
- [ ] US-023-OLD: Verify and fix event placement (Tasks 15.1-15.8)
- [ ] US-024-OLD: Verify all 252 events are correctly placed (Task 16)
- [ ] US-025-OLD: Address content completeness gaps (Tasks 17.1-17.7)
- [ ] US-026-OLD: Verify 100% content completeness (Task 18)

### Phase 3: Mobile Integration (Sequential)
Must run after Phase 1 Mobile tasks complete:

- [ ] US-027-OLD: Initialize Capacitor configuration (Tasks 8.1-8.3)
- [ ] US-028-OLD: Configure iOS build settings (Tasks 9.1-9.3)
- [ ] US-029-OLD: Configure Android build settings (Tasks 10.1-10.3)
- [ ] US-030-OLD: Ensure platform configurations are valid (Task 11)
- [ ] US-031-OLD: Create PWA manifest (Tasks 12.1-12.4)
- [ ] US-032-OLD: Implement service worker (Tasks 13.1-13.12)
- [ ] US-033-OLD: Register service worker in application (Tasks 14.1-14.3)
- [ ] US-034-OLD: Ensure PWA functionality works (Task 15)

### Phase 4: Advanced Features (Parallel after Phase 2 & 3)
Can run in parallel once their respective phases complete:

#### Content - Final Polish
- [ ] US-035-OLD: Implement player journey initialization (Tasks 19.1-19.3)
- [ ] US-036-OLD: Validate puzzle mechanics (Tasks 20.1-20.3)
- [ ] US-037-OLD: Validate NPC placement and behavior (Tasks 21.1-21.3)
- [ ] US-038-OLD: Validate dungeon progression (Tasks 22.1-22.4)

#### Mobile - Performance & Network
- [ ] US-039-OLD: Implement network handling for mobile (Tasks 16.1-16.9)
- [ ] US-040-OLD: Implement mobile performance optimizations (Tasks 17.1-17.7)
- [ ] US-041-OLD: Implement touch controls optimization (Tasks 18.1-18.5)

### Phase 5: Integration & Final Validation (Sequential)
Must run after all previous phases:

- [ ] US-042-OLD: Integrate platform abstraction with game engine (Tasks 19.1-19.4)
- [ ] US-043-OLD: Ensure all platform integrations work (Task 20)
- [ ] US-044-OLD: Set up build pipeline (Tasks 21.1-21.5)
- [ ] US-045-OLD: Configure CI/CD pipeline (Tasks 22.1-22.3)
- [ ] US-046-OLD: Content - Final validation pass (Tasks 23.1-23.4)
- [ ] US-047-OLD: Content - Complete validation and polish (Task 24)
- [ ] US-048-OLD: Mobile - Ensure all builds succeed and tests pass (Task 23)

## Execution Rules

### Parallelism
- Phase 0 must run first (asset curation is foundation for everything)
- Phase 1 tasks (US-003-OLD to US-016-OLD) can run in parallel after Phase 0
- Within each phase, tasks can run in parallel unless they have explicit dependencies
- Checkpoints must wait for all tasks in their phase to complete

### Dependencies
- Phase 0 has no dependencies (runs first)
- Phase 1 depends on Phase 0 completion (need organized assets)
- Phase 2 depends on US-003-OLD to US-010-OLD (Content validation infrastructure)
- Phase 3 depends on US-011-OLD to US-016-OLD (Mobile platform foundation)
- Phase 4 Content depends on Phase 2 completion
- Phase 4 Mobile depends on Phase 3 completion
- Phase 5 depends on all Phase 4 tasks completion

### Task Execution
- Each US-XXX represents a logical unit of work (may contain multiple sub-tasks)
- Mark [x] when all sub-tasks within a US are complete
- Run tests after each US completion
- Stop at checkpoints for user review if issues arise

### Priority
1. Asset curation (Phase 0) - CRITICAL FOUNDATION
2. Foundation work (Phase 1) - highest priority
3. Content validation and fixes (Phase 2) - high priority
4. Mobile integration (Phase 3) - high priority
5. Advanced features (Phase 4) - medium priority
6. Final integration (Phase 5) - required for completion

## Current Status
- All tasks are queued and ready to execute
- Starting with Phase 0 asset curation (MUST RUN FIRST)
- Next action: Begin US-000 (Audit and curate tileset assets)

## Notes
- Phase 0 is NEW and CRITICAL - must audit assets before validation
- Prioritize tilesets with TMX/TSX files (pre-configured, ready to use)
- Prioritize tilesets with Rules files (auto-tiling support)
- Remove unused/irrelevant tilesets to reduce bloat
- Organize by game zone for easy discovery
- This plan optimizes for maximum parallelism while respecting dependencies
- Estimated total: 49 user stories across 2 specs (3 new for asset curation)
- Content spec: ~27 user stories (3 new + 24 existing)
- Mobile spec: ~22 user stories
- Checkpoints provide natural pause points for review
