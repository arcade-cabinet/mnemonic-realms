# Mnemonic Realms — Agent Handoff

**Date**: 2026-02-21
**Session**: Full MnemonicEngine build + pipeline alignment (Waves 0–14)
**Branch**: `main` (both repos up to date)
**Repos**:
- Intent workspace: `/Users/jbogaty/intent/workspaces/intact-swordtail/mnemonic-realms`
- Dev copy: `/Users/jbogaty/src/arcade-cabinet/mnemonic-realms`

---

## What Got Built (Waves 0–14) — 45 Commits

### Wave 0–1: Foundation
- Expo + React Native Skia scaffold merged onto main
- Koota ECS: 19 traits, 15 cached queries, world factory (`createGameWorld()`)
- Game loop: 60fps via Reanimated `useFrameCallback`, delta clamped [0,100]ms

### Wave 2–7: Engine Systems
- **7 pure ECS systems**: movement, collision, camera, interaction, npc-ai, vibrancy, particles
- **Skia renderers**: Atlas tile renderer (GPU), sprite renderer, particle renderer (mote pool)
- **Fog-of-war shader**: per-area vibrancy grid, forgotten/partial/remembered states
- **Camera**: smooth interpolation, viewport culling
- **World loader**: reads `data/maps/*.json` runtime JSON
- **Entity spawner**: NPCs, transitions, chests, triggers, resonance stones — property contract standardized
- **World transition**: state machine with crossfade + spawn lookup

### Wave 8–12: Game Features
- **Audio**: BGM state machine (crossfade), SFX registry, BiquadFilterNode vibrancy filter (2000Hz→20000Hz)
- **Combat engine**: turn-based, AGI turn order, skills, status effects, rewards
- **Encounter chain**: combat→dialogue→surprise→combat executor
- **HUD**: HP bar, vibrancy meter, zone placard (entrance animation)
- **Dialogue box**: typewriter effect, portraits, choices
- **Touch controls**: virtual d-pad + action buttons + intent mapping
- **Title screen**: logo animation, menu, class selection carousel
- **Inventory**: parchment grid, equipment slots, stack management
- **Shop**: buy/sell with keeper personality
- **Quest log**: Callum's journal style
- **Save/load**: AsyncStorage adapter, quest-tracker, serializer

### Wave 13–14: Pipeline Alignment
- **All validators rewritten**: TMX/XML → runtime JSON (`data/maps/*.json`)
  - map-validator, visual-validator, npc-validator, content-validator, event-verifier, dungeon-validator, puzzle-validator
- **Spawner property contract fixed**: generator writes `targetWorld`, spawner now reads `targetWorld`
- **DDL tile sizes fixed**: all `gen/ddl/maps/*.json` updated tileSize 32→16
- **DDL schemas updated**: tileSize default 32→16 in `gen/schemas/ddl-maps.ts`
- **Assemblage types**: RPG-JS doc strings purged
- **Runtime content scripts**: `generate-runtime-content.ts` + `validate-runtime-content.ts`
- **Playwright + Vitest**: configs updated for Expo Metro architecture
- **AI playtest system**: Playwright AI player with strategies + diagnostics reporter
- **Biome lint**: clean across engine/, gen/, ui/
- **Metro resolver**: `.js` extension resolution fixed for Expo web

### Git State
- Worktree mess: RESOLVED — fresh clone at intent workspace, main worktree updated
- Stale remote branches: DELETED (assemblage-system, copilot/*, creative-direction-overhaul, fix/gh-pages-base-path, ralph/kiro-specs-execution, rebuild/rpgjs-proper, village-hub-map)
- Only `origin/main` remains

---

## Critical Gaps — 23 Known Issues

### 🔴 Combat Engine (`engine/encounters/combat-engine.ts`)

1. **No seeded RNG** — `getEnemyAiAction()` uses `Math.random()` 3 times (lines ~302, 307, 308). Design doc mandates: `variance = 0.9 + seededRandom() * 0.2` (90–110%). Seed should be buried as `Date.now()` at game start. A seeded PRNG exists in `gen/assemblage/composer/fill-engine.ts` — port it to `engine/`.

2. **No SP/Mana on Combatant** — `engine/encounters/types.ts` `Combatant` interface has no `sp`/`maxSp` fields. Skills have `cost` but `executeSkill()` never checks or deducts SP.

3. **Damage formula wrong** — Design doc (`docs/design/combat.md`):
   - Physical: `floor((ATK * 1.5 - DEF * 0.8) * variance * elementMod)`
   - Magical: `floor((INT * 1.8 - DEF * 0.4) * variance * elementMod)`
   - Healing: `floor(INT * 1.2 * variance)`
   - Current: `Math.max(1, Math.floor(attacker.atk * multiplier - defender.def * 0.5))` — flat, no variance, no elements

4. **No element weakness/resistance** — elementMod = 1.0 (neutral), 1.5 (weakness), 0.5 (resistance). Zero implementation.

5. **No weapon stat bonus** — DDL weapons have `statBonus` field. Damage calc uses raw `attacker.atk`, ignores equipped weapon.

6. **Items disabled in combat** — CombatUI "Item" button exists but is disabled. No item usage path in combat engine.

7. **Flee always succeeds** — Design: AGI comparison check, cannot flee bosses. Current: unconditional state change to 'fled'.

8. **Skill formulas are string DDL, not engine logic** — DDL skills have formulas like `"ATK*1.5 + (active_oaths * 0.1)"` as strings. Combat engine uses generic `multiplier: number`. The class-specific string formulas are never parsed or executed.

### 🔴 Class Mechanics (ZERO implementation)

9. **Knight Oathweave** — Power scales with active oaths. Oath Strike: `ATK * (1 + 0.1 * active_oaths)`. Vow of Steel: damage reduction scales with fulfilled oaths. Oathbreaker's Gambit: sacrifice oath for 3x ATK damage. None of this exists in engine.

10. **Cleric Euphoric Recall** — Healing scales with "emotional peak" charges (collected from NPC memories). Emotional charges are a currency that amplifies Cleric healing multiplier. Zero implementation.

11. **Mage Inspired Casting** — Collects "elements" from the world (fire, water, wind, etc.). Spell palette expands as more elements are discovered. Eureka: combine two elements for compound spells. Zero implementation.

12. **Rogue Foreshadow** — Passive: occasionally acts before calculated turn. Memory Theft: steals enemy stat. Vanishing Act: stealth + 2x next attack. Temporal Ambush (ultimate): act twice in one turn. Zero implementation.

13. **Weapon specialization not enforced** — DDL weapons have `classRestriction` arrays. Combat allows any class to use any weapon.

14. **Equipment stat modifiers not applied** — Weapons/armor have `statBonus` fields. Nothing applies them to combatant stats when loading save or starting combat.

### 🟡 Design Tokens / Branding

15. **Font is 'System'** — `ui/theme/game-theme.ts` `fonts.body: 'System'`, `fonts.heading: 'System'`. Design mandates "Press Start 2P" (Google Fonts pixel font). No `@import` in `global.css`.

16. **Wrong color palette** — Theme uses Material Design amber (`#FFC107`). Authoritative palette from `docs/design/ui-spec.md`:
    - bg-primary: `#2A1810` (dark parchment)
    - bg-secondary: `#3C2818`
    - text-primary: `#D4C4A0` (warm cream)
    - text-accent: `#DAA520` (memory amber)
    - btn: `#6B4C30` (warm wood)
    - hp: `#5C8C3C`, sp: `#4A8CB8`, xp: `#DAA520`, danger: `#CD5C5C`

17. **Tailwind tokens not aligned** — `tailwind.config.js` colors don't match the rewritten game-theme tokens.

### 🟡 HUD Gaps

18. **No SP/Mana bar** — HUD only shows HP + vibrancy. No SP display.

19. **No memory fragment counter** — Design spec: pulsing counter in HUD when fragment collected. Zero implementation.

20. **No class accent colors in HUD** — Each class has defined colors (Knight: steel blue-gray, Cleric: twilight purple, Mage: river blue, Rogue: forest green). HUD ignores selected class.

### 🔴 Game Wiring (Critical Path)

21. **`app/game.tsx` is placeholder** — Just `<Text>Game Canvas — MnemonicEngine</Text>`. No Skia canvas, no game loop, no ECS systems running, no map loading. THE most critical gap for a playable game.

22. **No class selection → game state** — Title screen lets you pick a class but the selection is never stored, never passed to combat, never used for stat initialization.

23. **Map never loads at game start** — `engine/world/loader.ts` has `loadMapData()`. `engine/world/spawner.ts` has `spawnEntities()`. Nothing calls them. The game loop has no map data.

---

## Unexplored Domains (Deep Dive Needed)

The following were not researched this session. The next agent must do a full domain-by-domain audit:

### Narrative & Quest System
- `engine/save/quest-tracker.ts` exists but nothing drives quest state transitions
- MQ-01 → MQ-10 main quests: zero wired into gameplay
- 14 side quests: zero wired
- 4 God recall quest chains (GQ-01 → GQ-04) with 4 emotion variants each: zero wired
- Quest completion → vibrancy state transition: logic exists in vibrancy system but quest completion never fires it
- `docs/story/quest-chains.md`, `docs/story/act1.md`, `docs/story/act2.md`, `docs/story/act3.md` — unread this session

### Memory System (Core Unique Mechanic)
- Memory fragment collection: mechanic described in docs, zero wired in engine
- Memory Album screen: referenced in docs, not in current `ui/` files
- Emotion system: Joy, Sorrow, Fury, Calm, Awe — Cleric charges, god recall variants
- Dormant gods: 4 gods, recall at shrines, emotion-variant outcomes
- Memory sharing with NPCs: NPCs have memory states that player can read/share
- Resonance stones: placed on map as triggers, how they work in engine unclear
- `docs/design/memory-system.md`, `docs/world/vibrancy-system.md` — unread this session

### Progression System
- XP formula: unclear if implemented (CombatRewards has `xp` field but nothing applies it to player)
- Leveling: stat growth tables per class
- Skill unlock on level-up: described in docs, not wired
- Subclass unlock: mid-game when player recalls first dormant god (joy/awe → Luminary, fury/sorrow → Crucible)
- `docs/design/progression.md` — unread this session

### World & Map
- 14+ overworld maps — DDL exists, runtime JSON not yet generated
- 20+ nested worlds (shops, inns, dungeons) — DDL partially exists
- Map interconnections: which transitions go where? Validated?
- Encounter zones per region: how does overworld enemy placement work?
- `docs/world/` hierarchy — partially read, much unexplored

### Audio
- BGM state machine: exists but what triggers BGM changes? Quest state? Area transition?
- Vibrancy filter: wired in `engine/audio/vibrancy-filter.ts`, but what reads vibrancy level and updates the filter?
- SFX registry: exists but nothing calls it during combat, dialogue, or movement
- `docs/design/audio.md` — unread this session

### Visual Direction Alignment
- Biome-specific vibrancy tile variants: 3 vibrancy levels per biome
- Stagnation crystalline overlay: Preserver zones
- Class portrait artwork: referenced in title screen, assets needed
- Enemy sprites: memory-corrupted natural creatures, dungeon abstract enemies, Preserver crystalline humanoids
- Boss sprites: 64x64 or 96x96, multi-part

### Technical Gaps
- `pnpm generate:content` output: `data/maps/` and `data/encounters/` — probably empty or stale
- `pnpm validate:runtime` — status unknown
- `pnpm assemblage compile-world` — does this succeed? Output correct?
- TypeScript types: `tsc --noEmit` — status unknown this session
- Unit tests: `pnpm test:unit` — some known passes, full status unknown
- E2E: `pnpm test` — configs updated but not validated against real Expo server

---

## Research Plan for Next Agent

### Phase 1: Domain Expert Deep Dive (parallel sub-agents)
Send 6 specialist sub-agents simultaneously, each reading their domain completely:

1. **Narrative agent**: Read `docs/story/` entirely — all act scripts, all quest chains, all character profiles, dialogue bank. Output: complete quest dependency graph, all quest trigger conditions, all emotion-variant branches.

2. **World agent**: Read `docs/world/` entirely + `gen/ddl/regions/`, `gen/ddl/maps/`, `gen/ddl/worlds/`. Output: complete map adjacency graph, all transition definitions, encounter zone assignments per region, nested world registry.

3. **Systems agent**: Read `docs/design/combat.md`, `docs/design/classes.md`, `docs/design/progression.md`, `docs/design/memory-system.md`. Output: complete formula specifications, class mechanic contracts, progression tables, memory mechanic rules.

4. **Art/Audio agent**: Read `docs/design/visual-direction.md`, `docs/design/ui-spec.md`, `docs/design/audio.md`. Output: complete design token spec, all screen wireframes, all animation specs, all audio cue mappings.

5. **Technical agent**: Run `pnpm lint`, `pnpm test:unit`, `tsc --noEmit`, `pnpm generate:content`, `pnpm validate:runtime`. Output: current error list, test pass/fail status, content generation status.

6. **Gap analyst**: Read ALL engine files (`engine/`) and cross-reference against design docs. Output: gap matrix (feature described → implementation status → effort estimate).

### Phase 2: Comprehensive Spec
After all 6 agents report back, write a NEW comprehensive spec with:
- 30+ implementation tasks (not the 23 already catalogued — ALL gaps)
- Dependency graph between tasks
- Wave structure for parallel execution
- Acceptance criteria for each
- Design references for each

### Phase 3: Execute
Delegate in parallel waves, verify each wave, no approval needed.

---

## Key Files for Next Agent

| What | Where |
|------|-------|
| Engine types | `engine/encounters/types.ts` |
| Combat engine | `engine/encounters/combat-engine.ts` |
| Game theme | `ui/theme/game-theme.ts` |
| Game canvas (placeholder) | `app/game.tsx` |
| ECS systems | `engine/ecs/systems/` |
| World loader | `engine/world/loader.ts` |
| Entity spawner | `engine/world/spawner.ts` |
| All design docs | `docs/design/` |
| All story docs | `docs/story/` |
| All world docs | `docs/world/` |
| DDL schemas | `gen/schemas/` |
| All DDL data | `gen/ddl/` |
| Runtime JSON output | `data/maps/`, `data/encounters/` |
| Validation suite | `scripts/validation/` |

---

## Commands to Run First

```bash
cd /Users/jbogaty/intent/workspaces/intact-swordtail/mnemonic-realms
pnpm install
pnpm lint                    # Should be clean
pnpm test:unit               # Check current state
tsc --noEmit                 # Check type errors
pnpm generate:content        # Generate runtime JSON
pnpm validate:runtime        # Validate generated data
pnpm expo start --web        # Start dev server for visual check
```

---

## The Vision (Never Lose Sight Of This)

Mnemonic Realms is a 16-bit JRPG where **memory is the mechanics**. Not just the theme. The mechanics:
- The world gets **brighter** as you progress (opposite of every RPG)
- **Vibrancy** is spatial fog-of-war driven by quest progression, not player position
- **Class mechanics** are memory metaphors: Knights keep promises, Clerics channel emotional peaks, Mages collect element patterns, Rogues see the future
- **God recalls** are the narrative climaxes — 4 dormant gods, each recalled differently based on which emotion the player channeled
- **Open world from minute one** — no invisible walls, no area gates, just darkness that warns you before dealing damage
- **Combat is a world** — not a modal overlay, a full world transition with its own fractal hierarchy

The goal: something that feels genuinely special because the memory conceit is woven into EVERY system, not just the narrative.