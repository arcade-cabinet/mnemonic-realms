# Mnemonic Realms — Production Release Plan

> **Comprehensive roadmap from current state to v1.0.0 release.**
> Generated 2026-02-14 from full codebase audit.

---

## Current State Inventory

| Layer | Files | Status |
|-------|-------|--------|
| Bible docs (`docs/`) | 30+ md files | Complete, names updated |
| Database — classes | 4 | Complete (knight, mage, rogue, cleric) |
| Database — weapons | 32 | Complete (all tiers) |
| Database — armor | 14 | Complete |
| Database — skills | 44 | Complete (base + subclass per class) |
| Database — items | 24 | Complete (consumables/usables) |
| Database — enemies | 8 | **Incomplete** — bible describes 20+ |
| Database — states | 11 | Complete |
| Events (act 1–3) | 42 | Generated, old names, needs rewrite |
| Dialogue | 70 | Generated, quality unknown |
| Quests | 28 | Generated, non-standard API |
| TMX maps | 20 | **AI-generated tilesets**, need full rework |
| Map TS files | 40 | Generated, mostly registration boilerplate |
| Client sprites | 28 PNGs | Complete (14 citizens × walk + combat) |
| Client effects | 17 files | Partial — implementations exist, untested |
| Client audio | 125 files | Complete (83 BGM, 32 SFX, 10 ambient) |
| Audio engine | 7 files | Complete (ambient, bgm, sfx, zone map) |
| GUI | 3 Vue files | Title screen polished; dialogue/HUD minimal |
| CI/CD | 1 workflow | Lint → build → deploy to GH Pages |
| **Core game systems** | **0** | **Nothing exists** |

### Critical Gaps

- **Zero** combat implementation — weapons/skills exist in database, no battle engine
- **Zero** memory collection — the game's core mechanic has no code
- **Zero** vibrancy system — per-zone mechanic described in docs, nothing built
- **Zero** save/load — title screen says "Coming soon"
- **Zero** inventory/equipment management
- **Zero** shop system
- **Zero** player progression (XP, leveling)
- **Zero** quest tracking runtime
- TMX maps reference 27 AI-generated tileset PNGs, not the 4,675+ purchased CC0 assets
- 49 event/map files still reference legacy NPC sprite IDs (working via aliases)
- Quest files import from `@rpgjs/server/lib/quests/quest` (non-public API path)

---

## Phase 0: Housekeeping & Foundation Commit

> **Goal**: Clean working state. Everything committed, no loose ends.

### 0.1 Commit NPC redesign work
- Stage and commit all pending changes from the citizen-name migration
- Includes: 27 doc renames, DDL rewrites, sprite registration updates, alias system, spritesheet-spec modernization

### 0.2 Audit and fix TypeScript compilation
- Run `npx tsc --noEmit` and resolve all errors (not just warnings)
- Ensure `pnpm build` produces a working `dist/`
- Verify `pnpm dev` launches and title screen renders

### 0.3 Clean up stale gen/ artifacts
- Remove orphaned image manifests (sprites, portraits, items, UI, tilesets — pipeline retired)
- Remove `gen/style-context.ts` (deleted in working tree)
- Clear dead builder/integrator references from gen/cli.ts if any remain
- Verify `pnpm gen status` shows only code + audio categories

### 0.4 Update .gitignore and repo hygiene
- Verify `gen/output/` is gitignored
- Verify `node_modules/`, `dist/`, `.env` are gitignored
- Remove any committed files that should be ignored
- Check for accidentally committed large binaries

---

## Phase 1: Tileset Rework & Map Foundation

> **Goal**: Replace all 27 AI-generated tileset PNGs with purchased CC0 tilesets. Build a tile catalog. Reauthor all 20 TMX maps with real tilesets.

### 1.1 Build tile catalog
- Survey all 182 purchased TSX files across 16 tileset packs
- Create `docs/design/tile-catalog.md` mapping:
  - Zone type (village, forest, mountain, dungeon, sketch, wetland, etc.) → tileset pack(s)
  - Terrain layer → specific TSX + tile IDs
  - Decoration layer → specific TSX + tile IDs
  - Collision layer conventions
- Define the tileset composition for each of the 20 maps

### 1.2 Create composite tilesets for TMX maps
- For each zone type, create a single composite tileset image + TSX that combines relevant tiles from purchased packs
- Or: reference multiple purchased TSX files per map (Tiled supports this)
- Place all map-ready tilesets in `assets/tilesets/composed/` or reference purchased TSX directly
- Delete the 27 AI-generated `tiles_*.png` files from `main/server/maps/tmx/`

### 1.3 Reauthor all 20 TMX maps
- Rebuild each map in Tiled using the tile catalog
- Layer structure: ground, terrain, decoration, collision, events
- Proper collision boundaries on walls, water, cliffs
- NPC spawn points as object layers
- Map transition trigger points (doors, zone edges, stairs)
- Vibrancy property preserved per map

### 1.4 Map transition system
- Implement zone-change mechanics: touching a door/portal/edge triggers `player.changeMap()`
- Event-layer objects in TMX define transition targets (`targetMap`, `targetX`, `targetY`)
- Loading screen or fade transition between maps
- Breadcrumb system: player can return the way they came

### 1.5 Wire map registration
- Update `main/server/maps/*.ts` registration files to reference new tilesets
- Ensure RPG-JS `globFiles('tmx')` picks up the correct maps
- Test: walk between all 20 maps without crashes

---

## Phase 2: Core Game Systems

> **Goal**: Build the engine. Every system the game needs to function.

### 2.1 Player progression system
- XP gain from combat victories and quest completion
- Level-up stat growth per class (use class definitions from DDL)
- Skill unlock at specific levels (skill tree from DDL data)
- Max level cap (from bible: likely 30–40)
- `player.setVariable()` persistence for all progression state

### 2.2 Inventory & equipment system
- Inventory data structure: items, quantities, equipped slots
- Equipment slots: weapon, armor, accessory (minimum)
- Equip/unequip with stat recalculation
- Item use (consumables) with effect application
- Inventory capacity limit (or unlimited with UI pagination)
- Drop/discard items

### 2.3 Combat system (turn-based)
- Turn order based on AGI stat
- Actions: Attack, Skill, Item, Defend, Flee
- Damage formula: ATK vs DEF for physical, INT vs SDEF for magic
- Element system: 7 elements (fire, water, wind, earth, light, dark, neutral)
- Status effect application from states database (11 states)
- Skill SP costs and targeting (single, all enemies, single ally, all allies)
- Enemy AI: per-enemy behavior patterns from bible
- Victory: XP + item drops
- Defeat: game over screen, return to last save
- Random encounters (or on-map enemy sprites) per zone

### 2.4 Memory collection system
- Memory fragment data structure: id, name, category, emotion (joy/fury/sorrow/awe), description, zone
- Collection trigger: events, NPC dialogue, exploration, combat milestones
- Storage in player variables
- 40–60 fragments per playthrough (from bible)
- Memory recall mechanic: at god shrines, choose which emotion to recall
- 4 gods × 4 emotions = 16 world-state permutations
- Visual/audio feedback on collection (use existing memory-effects.ts)

### 2.5 Vibrancy system
- Per-zone vibrancy value (0–100), stored as map property
- Three visual tiers: muted (0–33), normal (34–66), vivid (67–100)
- Vibrancy increases when: memory collected in zone, quest completed in zone, stagnation cleared
- Vibrancy decreases when: certain story events (Preserver actions)
- Client-side tileset swap: muted/normal/vivid variants per zone
- Link to existing `vibrancy-tier.ts` and `zone-effects.ts` client effects

### 2.6 Quest tracking runtime
- Verify/fix `@Quest` and `@QuestStep` decorators (import from public API or rewrite)
- Quest state machine: inactive → active → completed / failed
- Objective tracking: per-quest variable-based progress
- Quest log data: active quests, completed quests, available quests
- Auto-update on variable changes (quest step completion triggers)
- Quest rewards: XP, items, vibrancy changes, unlock next quest

### 2.7 Save/load system
- Serialize player state: position, map, level, XP, stats, inventory, equipment, quest progress, memory fragments, vibrancy values, variables
- Storage backend: `localStorage` for browser (standalone mode)
- Multiple save slots (3 minimum)
- Auto-save on map change
- Title screen integration: "Continue" loads latest auto-save, "Load Game" shows slot picker
- Save file versioning for future compatibility

### 2.8 Shop system
- NPC-triggered shop GUI
- Buy: items with gold from inventory
- Sell: items at reduced price
- Equipment comparison in shop UI
- Per-shop inventory (different shops sell different items)
- Gold/currency tracking

### 2.9 NPC interaction system
- Talk-to-NPC event handling (action button when facing NPC)
- Dialogue tree from dialogue files (70 files exist)
- Conditional dialogue based on quest state, story progress, vibrancy
- NPC schedule/movement patterns (optional for v1)
- NPC sprite rendering using citizen sprites from generated.ts + aliases.ts

---

## Phase 3: Content Rewrite & Integration

> **Goal**: Make all 180+ generated code files actually work with the systems from Phase 2.

### 3.1 Migrate event file sprite IDs
- Replace legacy NPC IDs (npc_lira, npc_callum, etc.) with citizen-name IDs in all 49 files
- Can then remove legacy aliases from `aliases.ts` (keep variant aliases)
- Verify each event file compiles and no broken references

### 3.2 Rewrite event files for correct RPG-JS API
- Audit all 42 event files for non-standard API usage
- Fix: `player.showDialog()` → `player.showText()` where needed
- Fix: `Move.up` → `Direction.Up` where mixed
- Fix: coordinate-based triggers → proper event interaction triggers
- Fix: dynamic event creation to use correct RPG-JS patterns
- Ensure events integrate with quest system (set variables, advance objectives)

### 3.3 Rewrite quest files
- Verify `@Quest` / `@QuestStep` are valid RPG-JS 4.3.0 API or replace with custom implementation
- Fix import path `@rpgjs/server/lib/quests/quest` → public API
- Wire quest state to event triggers
- Test each quest chain: start → objectives → completion → rewards
- 10 main quests, 4 god quests, 14 side quests = 28 total

### 3.4 Validate dialogue files
- Audit all 70 dialogue files for old character names
- Verify dialogue tree format matches RPG-JS `showText` / `showChoices` API
- Fix any non-standard dialogue patterns
- Link dialogue to NPC events and quest triggers

### 3.5 Expand enemy database
- Bible describes 20+ enemy types; only 8 exist
- Add missing enemies from `docs/design/enemies-catalog.md`
- Each enemy needs: stats, element, drops, AI pattern, sprite reference
- Wire enemy sprites from purchased creature packs
- Define encounter tables per zone/map

### 3.6 Register all database entries
- Verify `main/database/index.ts` exports all 138 entries correctly
- Verify `main/server/index.ts` registers database with RPG-JS module
- Test: can access any weapon/armor/skill/item/enemy/class/state by ID at runtime

### 3.7 Wire audio to game events
- Battle music triggers on combat start
- Zone BGM changes on map transition (use zone-audio-map.ts)
- SFX on: attacks, skills, item use, menu navigation, level up, quest complete
- Ambient loops per zone
- Verify all 125 audio files are loadable and the right format

---

## Phase 4: UI & HUD

> **Goal**: Every screen the player needs to play the game.

### 4.1 Expand HUD
- HP/SP bars
- Current zone name
- Mini quest objective
- Gold amount
- Quick-access item slots (optional for v1)

### 4.2 Inventory screen (Vue component)
- Tab layout: Items, Equipment, Key Items
- Item list with icons, names, quantities, descriptions
- Use/Equip/Drop actions
- Equipment comparison (stat diff preview)
- Sort/filter options

### 4.3 Quest log screen (Vue component)
- Active quests tab with current objectives
- Completed quests tab
- Quest detail view: name, description, objectives with checkmarks, rewards

### 4.4 Memory collection screen (Vue component)
- Grid/collection view of all discovered memory fragments
- Categories: by god, by zone, by emotion
- Fragment detail: name, description, emotional resonance
- Progress indicator: X/60 fragments found

### 4.5 Battle UI (Vue component)
- Turn order display
- Action menu: Attack, Skills, Items, Defend, Flee
- Skill submenu with SP costs
- Item submenu
- Enemy HP bars
- Damage numbers / miss / critical indicators
- Status effect icons on combatants
- Victory screen: XP gained, items dropped, level ups

### 4.6 Shop UI (Vue component)
- Buy/sell tabs
- Item list with prices
- Player gold display
- Equipment stat comparison
- Quantity selector for stackable items

### 4.7 Dialogue box enhancement
- Speaker name display with portrait (optional)
- Text typewriter effect
- Choice selection with keyboard/gamepad support
- Emotion indicators (matching memory system emotions)

### 4.8 Pause/menu screen
- Accessible via ESC or gamepad start
- Party status (level, HP, SP)
- Equipment summary
- Save game option
- Settings submenu
- Return to title

### 4.9 Settings screen
- Volume controls: BGM, SFX, Ambient (separate sliders)
- Text speed: slow, normal, fast, instant
- Screen shake toggle
- Reduced motion toggle

### 4.10 Game Over screen
- Displayed on party defeat
- Options: Load last save, Return to title

### 4.11 Credits screen
- CC0 asset attributions (required)
- Game credits
- Scrolling text format
- Accessible from title screen or after game completion

---

## Phase 5: Effects & Visual Polish

> **Goal**: Make the game look and feel finished.

### 5.1 Vibrancy visual tiers
- Wire `vibrancy-tier.ts` to actual tileset swaps (muted/normal/vivid)
- Test visual transitions when vibrancy changes
- Ensure particle effects match vibrancy tier

### 5.2 God awakening effects
- Implement `god-resonance.ts`, `god-verdance.ts`, `god-luminos.ts`, `god-kinesis.ts`
- Visual transformation when a god is recalled
- Zone-wide effect changes after recall

### 5.3 Stagnation zone effects
- Crystalline overlay in Preserver-controlled zones
- Particle effects from `stagnation-effects.ts`
- Desaturated color filter

### 5.4 Cinematic sequences
- Wire `cinematic-scenes.ts` and `cinematic-sequencer.ts` to key story moments
- Screen shake, fade, overlay for dramatic events
- Camera movement for cutscenes

### 5.5 Combat visual effects
- Skill animations using `combat-effects.ts`
- Elemental particles from `elementalHit()`
- Status effect indicators from `showStatusEffect()`
- Screen shake on critical hits

### 5.6 Memory collection effects
- Visual/audio flourish when a fragment is discovered
- Different effects per emotion type (joy, fury, sorrow, awe)
- Use existing `memory-effects.ts`

### 5.7 Sketch zone visuals
- "Undrawn" aesthetic for frontier zones
- Use `sketch-effects.ts` for hand-drawn visual style
- Transition from sketch → vivid as vibrancy increases

### 5.8 UI visual polish
- Consistent color theme across all Vue components
- CSS variable system (already started in title screen)
- Pixel-perfect font rendering
- Smooth transitions between screens
- Loading indicators for map changes

---

## Phase 6: Game Balance & Content Tuning

> **Goal**: The game is fun, fair, and completable.

### 6.1 Combat balance pass
- Playtest each class through Act 1 encounters
- Verify damage formulas produce reasonable numbers
- Tune weapon/armor stat progression across tiers
- Ensure skill SP costs are manageable at each level
- Enemy difficulty curve: zone-by-zone tuning

### 6.2 Progression pacing
- XP requirements per level: smooth curve, no grinding needed for main quest
- Gold economy: enough gold from quests/enemies to buy necessary equipment
- Skill unlock timing: new skills available when needed for upcoming challenges
- Item availability: healing items accessible before each difficulty spike

### 6.3 Quest flow testing
- Play through all 10 main quests in sequence
- Verify quest chain dependencies work (MQ-01 → MQ-02 → etc.)
- Test 4 god recall quests with all 4 emotion choices each
- Test all 14 side quests
- Verify no soft-locks (can always progress)

### 6.4 Memory fragment distribution
- Place 40–60 fragments across all zones
- Ensure balanced distribution: ~10 per act
- Verify fragments are discoverable without guide (clear visual/audio cues)
- Test all 16 god recall permutations produce distinct outcomes

### 6.5 Map traversal testing
- Walk through all 20 maps
- Verify all transitions work bidirectionally
- Check collision boundaries (no walking through walls)
- Ensure no unreachable areas (or clearly intentional)
- Verify NPC placement matches story context

### 6.6 Difficulty curve
- Act 1: gentle introduction, easy combat, first recall
- Act 2: ramping difficulty, moral choices, multiple recalls
- Act 3: challenging dungeon/fortress, final confrontation
- Optional superboss or challenge content for completionists

---

## Phase 7: Testing & Quality Assurance

> **Goal**: Confidence that the game works.

### 7.1 Expand Playwright E2E tests
- Title screen → class selection → embark flow
- Walk to first NPC → dialogue → quest accepted
- Map transition between 2+ zones
- Combat initiation → victory
- Save → reload → state preserved
- Full Act 1 playthrough (automated)

### 7.2 Vitest unit tests
- Combat damage formula calculations
- Memory fragment collection logic
- Vibrancy system tier calculations
- Quest state machine transitions
- Inventory add/remove/equip operations
- Save/load serialization roundtrip

### 7.3 Manual QA checklist
- Play through entire game (all 3 acts)
- Test all 4 classes to completion
- Test all save/load scenarios
- Test edge cases: inventory full, SP depleted, party wipe, quest sequence break
- Cross-browser: Chrome, Firefox, Safari
- Mobile browser testing (touch controls)

### 7.4 Performance testing
- Measure load time: initial boot, map transitions
- Profile memory usage: no leaks after long play sessions
- Asset loading: verify all sprites/tilesets/audio load without 404s
- Build size: `dist/` should be reasonable for browser delivery

### 7.5 Accessibility audit
- Keyboard navigation through all menus
- Gamepad support (already have `@rpgjs/gamepad` dependency)
- Text readability at various screen sizes
- Color contrast ratios
- Screen reader landmarks (where feasible for canvas game)
- Reduced motion: respect `prefers-reduced-motion` (title screen already does)

---

## Phase 8: Production Release

> **Goal**: Ship it.

### 8.1 Build optimization
- Verify `pnpm build` produces clean output
- Asset optimization: confirm WebP sprites are small, PNG tilesets are reasonable
- Code splitting if supported by RPG-JS compiler
- Gzip/brotli compression in deployment

### 8.2 Deployment pipeline
- Update GitHub Actions workflow for production build
- Deploy to GitHub Pages (already configured)
- Custom domain setup (if desired)
- CDN for assets (if needed for performance)

### 8.3 Version bump
- `package.json`: 0.1.0 → 1.0.0
- Title screen: v0.2.0 → v1.0.0
- CHANGELOG.md (optional)

### 8.4 Pre-launch checklist
- [ ] All 3 acts playable start to finish
- [ ] All 4 classes functional
- [ ] All 28 quests completable
- [ ] All 20 maps navigable
- [ ] Save/load works across sessions
- [ ] Combat system balanced and fun
- [ ] Memory system functional with all 16 recall variants
- [ ] Vibrancy visual changes visible
- [ ] All audio plays correctly
- [ ] No console errors during normal gameplay
- [ ] Title screen → credits achievable
- [ ] Mobile browser playable
- [ ] GitHub Pages deployment live
- [ ] CC0 attributions in credits

### 8.5 Post-launch monitoring
- Check GitHub Pages analytics (if available)
- Monitor issue reports
- Plan hotfix process for critical bugs
- Consider: itch.io publishing for broader reach

---

## Phase Dependency Map

```
Phase 0 (Housekeeping)
    │
    ├──→ Phase 1 (Tilesets & Maps)
    │         │
    │         └──→ Phase 5 (Visual Effects) ──→ Phase 6 (Balance)
    │
    └──→ Phase 2 (Core Systems)
              │
              ├──→ Phase 3 (Content Rewrite)
              │         │
              │         └──→ Phase 6 (Balance)
              │
              └──→ Phase 4 (UI/HUD)
                        │
                        └──→ Phase 6 (Balance)

Phase 6 (Balance) ──→ Phase 7 (Testing) ──→ Phase 8 (Release)
```

**Phases 1 and 2 can run in parallel.** Phase 1 (tilesets/maps) is independent of Phase 2 (systems). Phases 3, 4, and 5 depend on Phase 2. Phase 6 needs everything before it. Phases 7 and 8 are sequential.

---

## Estimated Scope

| Phase | Files to create/modify | Relative effort |
|-------|----------------------|-----------------|
| Phase 0 | ~5 | Small — commit + cleanup |
| Phase 1 | ~80 (20 TMX + 20 TS + tilesets + catalog) | Large — map authoring is manual |
| Phase 2 | ~25–35 new system files | **Very Large** — all core mechanics |
| Phase 3 | ~140 existing files to fix | Large — bulk rewrite |
| Phase 4 | ~12 new Vue components | Large — full UI suite |
| Phase 5 | ~17 existing + new files | Medium — effects already stubbed |
| Phase 6 | Tuning data, no new files | Medium — playtesting |
| Phase 7 | ~15 test files | Medium |
| Phase 8 | ~5 config files | Small |

---

## Notes

- **Ralph pipeline** can be used for Phases 2–4 (system implementation, content rewrite, UI). Each phase maps naturally to a PRD with user stories.
- **Tileset rework** (Phase 1) is largely manual Tiled editor work, not code generation.
- **Balance tuning** (Phase 6) requires actual playtesting — not automatable.
- The existing 445 generated code files in `gen/output/` are already integrated into `main/`. The gen pipeline is for regeneration, not first-time creation.
- Audio engine is the most complete subsystem — it just needs wiring to game events.
