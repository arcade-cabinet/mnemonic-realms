# E2E Playtesting Governor: Design Document

> Cross-references: [docs/design/ui-spec.md](ui-spec.md), [docs/design/combat.md](combat.md), [docs/story/quest-chains.md](../story/quest-chains.md), [docs/maps/overworld-layout.md](../maps/overworld-layout.md), [docs/design/progression.md](progression.md)

## Overview

The E2E Playtesting Governor is an autonomous agent that plays Mnemonic Realms from start to finish, exercising every major game system to detect bugs, softlocks, broken dialogue, missing assets, and balance issues. It combines **Playwright** (browser automation and DOM interaction) with **Yuka.js** (AI decision-making via goal-driven agents and state machines) running in a Node.js test harness outside the game process.

The governor does not modify game code. It interacts with the game exclusively through the browser, the same way a human player would: clicking GUI elements, pressing keyboard keys, and observing the resulting screen state.

---

## Architecture Overview

```
+------------------------------------------------------------------+
|  Governor Process (Node.js)                                      |
|                                                                  |
|  +------------------+    +------------------------------------+  |
|  | Playwright Driver |    | Yuka.js AI Brain                  |  |
|  |                  |    |                                    |  |
|  |  - Page handle   |    |  EntityManager                    |  |
|  |  - Screenshot    |    |    |                               |  |
|  |  - DOM queries   |    |    +-- GovernorEntity              |  |
|  |  - Click/type    |    |        |                           |  |
|  |  - Console logs  |    |        +-- Think (goal arbiter)    |  |
|  |  - Network watch |    |        |    +-- PlaythroughGoal    |  |
|  +--------+---------+    |        |    +-- ExploreZoneGoal    |  |
|           |              |        |    +-- CombatGoal         |  |
|           v              |        |    +-- DialogueGoal       |  |
|  +------------------+    |        |    +-- MenuGoal           |  |
|  | World State Model|<-->|        |    +-- HealGoal           |  |
|  |                  |    |        |                           |  |
|  |  - Current screen|    |        +-- StateMachine            |  |
|  |  - Player stats  |    |             (screen-level FSM)     |  |
|  |  - Quest state   |    |                                    |  |
|  |  - Zone / position|   +------------------------------------+  |
|  |  - Inventory     |                                            |
|  |  - Error log     |    +------------------------------------+  |
|  +------------------+    | Reporter                           |  |
|                          |  - JSON test results               |  |
|                          |  - Screenshot on failure           |  |
|                          |  - Timing metrics                  |  |
|                          +------------------------------------+  |
+------------------------------------------------------------------+
           |
           | Playwright WebSocket
           v
+------------------------------------------------------------------+
|  Chromium Browser                                                |
|  +------------------------------------------------------------+  |
|  | RPG-JS Game (localhost:3000)                               |  |
|  | - PixiJS canvas (game world)                               |  |
|  | - Vue GUI overlays (menus, dialogue, combat)               |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

### Component Responsibilities

| Component | Role |
|-----------|------|
| **Playwright Driver** | Browser lifecycle, DOM queries, click/keyboard input, console log capture, network request monitoring, screenshot capture |
| **World State Model** | Maintains a structured representation of the game's current state by polling the DOM and console output. Single source of truth for the AI. |
| **Yuka.js AI Brain** | Goal-driven agent (`Think` arbiter) that selects the highest-priority goal each tick. Goals decompose into atomic actions (click button, press arrow key, wait for element). |
| **StateMachine (screen-level)** | Tracks which screen the game is on (title, overworld, combat, dialogue, menu, shop, game-over). Transitions driven by DOM observation. |
| **Reporter** | Accumulates pass/fail results, screenshots, timing data, and writes a JSON report at completion. |

---

## Screen-Level State Machine

The governor's top-level control is a Yuka.js `StateMachine` that tracks the current game screen. Each state corresponds to a distinct GUI overlay or mode.

```
                         +-----------+
                         |   INIT    |
                         +-----+-----+
                               |
                         page loaded
                               |
                         +-----v-----+
              +--------->|  TITLE    |<---------+
              |          |  SCREEN   |          |
              |          +-----+-----+          |
              |                |                |
              |         "Begin Journey"         |
              |                |                |
              |          +-----v-----+          |
              |          | OVERWORLD |<----+    |
              |          +-----+-----+     |    |
              |           / |   \    \     |    |
              |          /  |    \    +----+    |
              |    touch /  |NPC  \menu        |
              |  enemy  /   |talk  \open       |
              |        /    |       \           |
              |  +----v-+ +-v------+ +--v----+ |
              |  |COMBAT| |DIALOGUE| | MENU  | |
              |  +----+-+ +---+----+ +--+----+ |
              |       |       |          |      |
              |  victory/  advance/   close     |
              |  defeat    choice               |
              |       |       |          |      |
              |       +-------+----------+      |
              |               |                 |
              |          +----v----+            |
              |          |GAME OVER|------------+
              |          +---------+  "Title"
              |               |
              |          "Retry"
              |               |
              +---------+-----+
                        |
                   (back to COMBAT or OVERWORLD)


  Additional sub-states not shown:
    MENU -> INVENTORY, EQUIPMENT, MEMORIES, QUESTS, SAVE, SETTINGS
    OVERWORLD -> SHOP (NPC shop interaction)
    OVERWORLD -> ZONE_TRANSITION (loading between maps)
```

### State Detection (DOM Selectors)

Each state is identified by the presence of specific DOM elements. The governor polls these selectors each tick (200ms default).

| State | Detection Method | Primary Selector |
|-------|-----------------|------------------|
| TITLE_SCREEN | Class carousel visible | `.title-screen`, `.class-carousel` |
| OVERWORLD | HUD overlay visible, no combat/dialogue | `.hud-overlay:visible`, absence of combat/dialogue panels |
| COMBAT | Combat GUI visible | `.combat-gui`, `.command-buttons` |
| DIALOGUE | Dialogue panel visible | `.dialogue-panel`, `.speaker-name` |
| MENU | Main menu overlay visible | `.main-menu` |
| SHOP | Shop interface visible | `.shop-interface` |
| GAME_OVER | Game over screen visible | `.game-over-screen` |
| ZONE_TRANSITION | Loading indicator or blank screen during map change | `.loading-indicator`, or canvas-only with no overlay |
| VICTORY | Victory screen / ending sequence | `.victory-screen`, `.credits-scroll` |

### State Transition Rules

```typescript
// Pseudocode for state detection each tick
function detectState(page: Page): GameScreen {
  if (await page.$('.game-over-screen')) return 'GAME_OVER';
  if (await page.$('.victory-screen'))   return 'VICTORY';
  if (await page.$('.combat-gui'))       return 'COMBAT';
  if (await page.$('.dialogue-panel'))   return 'DIALOGUE';
  if (await page.$('.shop-interface'))   return 'SHOP';
  if (await page.$('.main-menu'))        return 'MENU';
  if (await page.$('.title-screen'))     return 'TITLE_SCREEN';
  if (await page.$('.hud-overlay'))      return 'OVERWORLD';
  return 'UNKNOWN';  // Flag as potential issue
}
```

---

## Goal-Driven AI (Yuka.js Think System)

The governor entity uses Yuka.js's `Think` class to arbitrate between competing goals. Each `GoalEvaluator` calculates a desirability score (0.0-1.0) based on the current world state. The highest-scoring goal is activated.

### Goal Hierarchy

```
Think (GovernorEntity)
  |
  +-- CompleteMQGoalEvaluator    (0.7 base bias - always the primary driver)
  |     |
  |     +-- CompleteMQGoal (composite)
  |           +-- NavigateToZoneGoal
  |           +-- InteractWithNPCGoal
  |           +-- CollectFragmentGoal
  |           +-- BroadcastFragmentGoal
  |           +-- DefeatEnemyGoal
  |
  +-- HealGoalEvaluator          (0.9 when HP < 30% - survival priority)
  |     |
  |     +-- HealGoal (atomic)
  |           +-- OpenMenuGoal -> UseItemGoal
  |           or
  |           +-- RestAtInnGoal
  |
  +-- ExploreGoalEvaluator       (0.5 when quests require visiting new zones)
  |     |
  |     +-- ExploreZoneGoal (composite)
  |           +-- MoveToExitGoal
  |           +-- TraverseMapGoal
  |           +-- CollectVisibleFragmentGoal
  |
  +-- CombatGoalEvaluator        (0.8 when in COMBAT state)
  |     |
  |     +-- CombatGoal (composite)
  |           +-- SelectActionGoal (Attack/Skill/Item/Defend/Flee)
  |           +-- SelectTargetGoal
  |
  +-- SideQuestGoalEvaluator     (0.3 base - lower priority than main quest)
  |     |
  |     +-- CompleteSQGoal (composite)
  |           (same sub-goals as MQ)
  |
  +-- ShopGoalEvaluator          (0.4 when gold > 2x cheapest useful item)
        |
        +-- ShopGoal (composite)
              +-- NavigateToShopGoal
              +-- BuyItemGoal
```

### Desirability Calculation

```typescript
// Each evaluator returns 0.0-1.0
class HealGoalEvaluator extends GoalEvaluator {
  calculateDesirability(entity: GovernorEntity): number {
    const hpRatio = entity.worldState.playerHP / entity.worldState.playerMaxHP;
    if (hpRatio < 0.3) return 0.9;  // Critical: heal immediately
    if (hpRatio < 0.5) return 0.6;  // Low: heal when convenient
    return 0.0;                      // Healthy: no need
  }
}

class CombatGoalEvaluator extends GoalEvaluator {
  calculateDesirability(entity: GovernorEntity): number {
    if (entity.worldState.currentScreen === 'COMBAT') return 0.85;
    return 0.0;  // Not in combat, not relevant
  }
}

class CompleteMQGoalEvaluator extends GoalEvaluator {
  calculateDesirability(entity: GovernorEntity): number {
    if (entity.worldState.currentScreen === 'COMBAT') return 0.0;
    if (entity.worldState.currentScreen === 'DIALOGUE') return 0.0;
    return 0.7 * this.characterBias;  // Always the background driver
  }
}
```

### Goal Lifecycle

Each Yuka.js `Goal` follows this lifecycle:

1. **`activate()`** — Called when the goal becomes active. Determines the sub-goals needed (e.g., "navigate to Heartfield" decomposes into "walk to south gate" + "wait for zone transition").
2. **`execute()`** — Called each tick while the goal is active. Monitors progress and issues Playwright commands. Detects stuck states.
3. **`terminate()`** — Called when the goal completes or is interrupted. Cleans up state.

---

## RPG-JS Integration Points

The governor interacts with the game through Playwright's browser automation. It does NOT inject code into the game or modify RPG-JS internals. All interaction is external.

### Input Methods

| Game System | Interaction Method | Details |
|------------|-------------------|---------|
| **Title screen** | DOM click | Click class arrows (`.class-carousel .arrow-left`, `.arrow-right`), click "Begin Your Journey" (`.begin-button`) |
| **Overworld movement** | Keyboard (arrow keys) | `page.keyboard.down('ArrowUp')`, held for duration, then `page.keyboard.up('ArrowUp')`. Movement is grid-based in RPG-JS. |
| **NPC interaction** | Keyboard (Enter/Space) | Face NPC via arrow keys, press Enter/Space to trigger action event |
| **Dialogue advance** | DOM click or Enter | Click dialogue panel or press Enter to advance typewriter text |
| **Dialogue choices** | DOM click | Click specific response button (`.dialogue-choice:nth-child(N)`) |
| **Combat commands** | DOM click | Click command buttons: `.cmd-attack`, `.cmd-skill`, `.cmd-item`, `.cmd-defend`, `.cmd-flee` |
| **Combat targeting** | DOM click | Click enemy sprite or use arrow keys to cycle targets |
| **Menu navigation** | DOM click | Click menu buttons: `.menu-inventory`, `.menu-equipment`, `.menu-memories`, `.menu-quests` |
| **Shop interaction** | DOM click | Click Buy/Sell tabs, item rows, confirm buttons |
| **Map transitions** | Overworld movement | Walk to edge tiles; zone transitions are automatic |

### Observation Methods

| Data Point | How to Read | Source |
|-----------|------------|--------|
| **Current HP/SP** | DOM query on HUD bars | `.hp-bar` text content or `aria-valuenow` |
| **Player level** | DOM query on HUD | `.player-level` text content |
| **Fragment count** | DOM query on HUD | `.fragment-counter` text content |
| **Zone name** | DOM query on zone entry text | `.zone-name` text content (fades after 3s, capture immediately) |
| **Quest state** | Open quest log, read DOM | `.quest-card` elements with status indicators |
| **Inventory** | Open inventory, read DOM | `.item-card` elements with names and quantities |
| **Error detection** | Console log capture | `page.on('console', msg => ...)` — filter for errors, warnings |
| **Network failures** | Network request monitoring | `page.on('requestfailed', ...)` — missing assets, failed loads |
| **Missing assets** | Console errors + visual | 404 errors in network tab; pink/checkered placeholder textures on canvas |
| **Game state variables** | Evaluate in page context | `page.evaluate(() => window.__rpg_debug?.playerState)` — only if debug hooks are added |

### RPG-JS Specific Hooks

RPG-JS does not expose a public debug API by default. The governor should work without any game modifications. However, for richer state observation, a lightweight debug module can be optionally added:

```typescript
// Optional: main/debug/index.ts (only loaded in test builds)
// Exposes read-only game state to window for Playwright to query
@RpgModule<RpgServer>({})
export default class DebugModule {
  onConnected(player: RpgPlayer) {
    // Expose state to window for external observation
    player.on('stateChange', (state) => {
      (globalThis as any).__rpg_debug = {
        position: { x: player.position.x, y: player.position.y },
        hp: player.hp,
        sp: player.sp,
        level: player.level,
        currentMap: player.map?.id,
        quests: player.getVariable('activeQuests'),
      };
    });
  }
}
```

This is purely optional. The governor's primary mode is DOM-only observation.

---

## Playthrough Strategy

The governor follows the main quest chain as its primary objective, with side quests and exploration as secondary goals. The strategy mirrors how a competent first-time player would play.

### Phase 1: Title Screen (< 30 seconds)

1. Wait for title screen to load
2. Select a class (configurable; default: cycle through all 4 in separate runs)
3. Click "Begin Your Journey"
4. Verify zone loads (HUD visible, zone name appears)

### Phase 2: Act I - Tutorial & Settled Lands (MQ-01 through MQ-04)

1. **MQ-01**: Follow NPC interaction chain (Callum -> Lira -> Memorial Garden -> Callum)
2. **MQ-02**: Learn memory operations (collect, remix, broadcast)
3. **MQ-03**: Visit all 4 Settled Lands sub-maps, fight encounters, collect fragments
4. **MQ-04**: Travel to Stagnation Clearing, survive combat, witness cutscene
5. **Side quests**: Attempt SQ-01 through SQ-04 when in the relevant zones

### Phase 3: Act II - Frontier & God Recalls (MQ-05 through MQ-07)

1. **MQ-05**: Cross mountain pass, reach Ridgewalker Camp
2. **SQ-06 through SQ-09**: Complete Frontier exploration quests
3. **GQ-01 through GQ-04**: Recall all 4 gods (with configurable emotion choices)
4. **SQ-05**: Complete Aric's Doubt
5. **MQ-06**: First god recall acknowledged
6. **MQ-07**: Learn Curator's endgame

### Phase 4: Act III - The Sketch & Endgame (MQ-08 through MQ-10)

1. **MQ-08**: Navigate Sketch zones, broadcast to solidify terrain
2. **MQ-09**: Preserver Fortress (3 floors)
3. **MQ-10**: First Memory Remix, endgame bloom

### Navigation Strategy

The governor uses a pre-loaded zone connectivity graph (from `overworld-layout.md`) to plan navigation between zones:

```typescript
const ZONE_GRAPH: Record<string, { exits: Array<{ direction: string; toZone: string; condition?: string }> }> = {
  'village-hub': {
    exits: [
      { direction: 'south', toZone: 'heartfield' },
      { direction: 'east', toZone: 'ambergrove' },
      { direction: 'west', toZone: 'millbrook' },
      { direction: 'north', toZone: 'sunridge', condition: 'MQ-04' },
    ]
  },
  // ... all 17+ zones
};
```

Within a zone, movement follows a simple exploration pattern:
1. Walk toward known NPC/event positions (from the zone spec)
2. If position is unknown, spiral outward from the entry point
3. If stuck (no progress for 30 seconds), try a different direction
4. If stuck for 2 minutes, flag as potential softlock and attempt recovery

### Combat Strategy

The combat AI uses a simple priority system, not deep tactical planning:

```
1. If HP < 25%: Use healing item (Potion/High Potion)
2. If HP < 40% and Cleric in party: Hope companion heals (Defend to buy time)
3. If enemy count > 2 and Mage skills available: Use AoE skill
4. If boss fight: Use highest-damage skill available
5. If SP < 10%: Use basic Attack
6. Default: Use strongest available skill
7. Flee: Only if HP < 15% and no healing items and not a boss
```

Target selection: Attack the enemy with the lowest current HP to reduce incoming damage quickly.

---

## Stuck State Detection & Recovery

The governor maintains a "progress timer" that resets whenever a meaningful game state change occurs. If the timer exceeds a threshold, the governor flags a potential issue and attempts recovery.

### What Counts as Progress

| Event | Resets Timer |
|-------|-------------|
| Zone change | Yes |
| Quest objective completed | Yes |
| Combat encounter started/ended | Yes |
| Dialogue advanced | Yes |
| Item acquired | Yes |
| Fragment collected | Yes |
| Level up | Yes |
| Menu opened/closed | Yes |
| Player position changed (significant) | Yes |

### Stuck Detection Thresholds

| Threshold | Duration | Severity | Action |
|-----------|----------|----------|--------|
| Minor stuck | 30 seconds | Warning | Try alternate direction, press Escape, attempt interaction |
| Moderate stuck | 2 minutes | Error | Screenshot, try menu open/close, attempt zone transition |
| Severe stuck | 5 minutes | Critical | Screenshot, dump DOM state, attempt title screen return |
| Softlock | 10 minutes | Blocker | Screenshot, full page reload, report as critical bug |

### Common Stuck Scenarios and Recovery

| Scenario | Detection | Recovery |
|----------|-----------|----------|
| **Invisible collision** | Position unchanged after 10s of movement input | Try all 4 directions; if all blocked, flag as collision bug |
| **Dialogue loop** | Same dialogue text appears 3+ times | Press Escape, try clicking outside dialogue panel |
| **Combat softlock** | Combat screen visible but no commands available for 15s | Screenshot, check for missing command buttons |
| **Missing map transition** | At zone edge, expected transition doesn't fire | Walk along entire edge; flag if no transition found |
| **GUI overlay stuck** | Non-combat overlay persists through movement attempts | Press Escape repeatedly, click close buttons |
| **Asset loading failure** | Network 404 errors, console image load errors | Log the missing asset path, continue (visual bug, not blocking) |
| **Infinite loading** | Zone transition screen persists > 30s | Reload page, resume from last known state |
| **NPC not spawning** | Expected NPC position is empty | Check quest prerequisites in quest log, try re-entering zone |

---

## Error Detection Categories

### Category 1: Crashes & Hard Errors

- **JavaScript exceptions** — Caught via `page.on('pageerror')`
- **Unhandled promise rejections** — Caught via console error monitoring
- **Page crashes** — Caught via `page.on('close')` unexpectedly
- **Blank screen** — No DOM elements detected for 10+ seconds

### Category 2: Missing Assets

- **Image 404s** — Network request failures for `.png`, `.webp`, `.jpg`
- **Audio 404s** — Network request failures for `.mp3`, `.ogg`, `.wav`
- **TMX/tileset failures** — Console errors mentioning tileset or map loading
- **Font loading failures** — "Press Start 2P" font not applied (fallback to system font detected)

### Category 3: Softlocks & Logic Errors

- **Stuck states** — No progress for defined thresholds (see above)
- **Unreachable NPCs** — NPC position inside collision geometry
- **Broken quest chains** — Quest objective not completable (e.g., NPC dialogue doesn't trigger)
- **Combat imbalance** — Player cannot deal damage or enemy has 0 HP but doesn't die
- **Infinite combat** — Combat exceeds 100 turns

### Category 4: Visual & UX Issues

- **Overlapping GUI elements** — Multiple overlays visible simultaneously (combat + dialogue)
- **Text overflow** — Text content exceeding container bounds
- **Missing animations** — Expected visual transitions not occurring
- **Z-order issues** — Game canvas rendering above GUI overlays

### Category 5: Balance Warnings

- **Repeated game overs** — Same encounter causes 3+ defeats
- **Resource depletion** — Player runs out of healing items with no accessible shop
- **Over-leveled** — Player level 5+ above zone expected range
- **Under-leveled** — Player level 3+ below zone expected range

---

## Success / Failure Criteria

### Full Playthrough Success

A playthrough run is considered **successful** if ALL of the following are met:

1. All 10 main quests (MQ-01 through MQ-10) are completed
2. At least 1 god recall quest is completed
3. The endgame bloom sequence plays
4. Zero Category 1 errors (crashes)
5. Zero Category 3 errors (softlocks)
6. Total playthrough completes in under 60 minutes (wall clock — the AI plays fast)

### Partial Success (Smoke Test)

A shorter smoke test verifies:

1. Title screen loads and class selection works for all 4 classes
2. MQ-01 and MQ-02 complete successfully (tutorial quests)
3. At least 1 combat encounter resolves
4. At least 1 zone transition works
5. Menu opens and all sub-screens are accessible
6. Zero Category 1 errors

### Run Configurations

| Config | Classes | Gods | Side Quests | Expected Duration |
|--------|---------|------|-------------|-------------------|
| `smoke` | Warrior only | None | None | 5-10 min |
| `act1` | All 4 (parallel) | None | SQ-01 to SQ-04 | 15-20 min per class |
| `full-joy` | All 4 | All 4 (joy emotion) | All 14 | 45-60 min per class |
| `full-fury` | All 4 | All 4 (fury emotion) | All 14 | 45-60 min per class |
| `full-sorrow` | All 4 | All 4 (sorrow emotion) | All 14 | 45-60 min per class |
| `full-awe` | All 4 | All 4 (awe emotion) | All 14 | 45-60 min per class |
| `matrix` | All 4 | All 16 permutations | Varies | Full matrix coverage |

---

## File Structure

```
tests/
  governor/
    README.md                    # Setup and usage instructions
    governor.config.ts           # Run configuration (class, emotions, quest set)
    run.ts                       # Entry point: launches browser, creates governor, runs

    core/
      driver.ts                  # Playwright wrapper: page lifecycle, input helpers
      world-state.ts             # World state model: polls DOM, maintains state
      reporter.ts                # Test results accumulator, JSON/HTML output
      zone-graph.ts              # Zone connectivity data from overworld-layout.md
      quest-tracker.ts           # Tracks quest progress, determines next objective

    ai/
      governor-entity.ts         # Yuka.js GameEntity subclass for the governor
      governor-brain.ts          # Think instance with all GoalEvaluators
      state-machine.ts           # Screen-level StateMachine (Yuka State subclasses)

      states/
        title-screen.state.ts    # Title screen behavior (class select, begin)
        overworld.state.ts       # Overworld behavior (movement, NPC approach)
        combat.state.ts          # Combat behavior (action selection, targeting)
        dialogue.state.ts        # Dialogue behavior (advance, choose responses)
        menu.state.ts            # Menu navigation behavior
        shop.state.ts            # Shop interaction behavior
        game-over.state.ts       # Game over recovery behavior
        zone-transition.state.ts # Wait for zone load, verify arrival

      goals/
        complete-mq.goal.ts      # Main quest chain goal (composite)
        complete-sq.goal.ts      # Side quest goal (composite)
        explore-zone.goal.ts     # Zone exploration (movement patterns)
        combat.goal.ts           # Combat action selection
        heal.goal.ts             # HP recovery (items or rest)
        shop.goal.ts             # Shop interaction
        navigate.goal.ts         # Zone-to-zone pathfinding
        interact-npc.goal.ts     # NPC interaction sequence
        collect-fragment.goal.ts # Fragment collection at Resonance Stones
        broadcast.goal.ts        # Memory broadcasting

      evaluators/
        mq.evaluator.ts          # Main quest desirability
        sq.evaluator.ts          # Side quest desirability
        heal.evaluator.ts        # Healing desirability (HP-based)
        combat.evaluator.ts      # Combat desirability (screen-based)
        explore.evaluator.ts     # Exploration desirability
        shop.evaluator.ts        # Shopping desirability (gold/items)

    data/
      quest-scripts.ts           # Quest objectives and expected sequences
      zone-positions.ts          # Known NPC/event positions per zone
      combat-strategy.ts         # Item/skill priority tables per class
      expected-assets.ts         # Asset manifest for 404 checking

    reports/
      (generated at runtime)
      run-{timestamp}.json       # Machine-readable results
      run-{timestamp}.html       # Human-readable report with screenshots
      screenshots/               # Captured screenshots on events/failures
```

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `playwright` | ^1.50 | Browser automation, DOM queries, screenshots |
| `yuka` | ^0.7 | Goal-driven AI, state machines, entity management |
| `tsx` | ^4.x | TypeScript execution for the governor runner |

### Development Dependencies (already in project)

| Package | Purpose |
|---------|---------|
| `@playwright/test` | Already configured for E2E tests |
| `typescript` | Already configured |
| `vitest` | Unit tests for governor logic |

### Why These Dependencies

**Playwright** is already the project's E2E test framework. The governor extends existing infrastructure rather than introducing a new browser automation tool.

**Yuka.js** provides battle-tested game AI primitives. The alternative would be writing a custom state machine and goal system from scratch, which Yuka already implements correctly:
- `StateMachine` + `State` for screen-level FSM
- `Think` + `GoalEvaluator` + `Goal` for decision-making
- `EntityManager` + `Time` for the simulation loop
- `GameEntity` as the base class for the governor agent

Yuka.js runs in Node.js (no browser required). It provides the "brain" while Playwright provides the "hands."

---

## Tick Loop

The governor runs on a fixed-interval tick loop (200ms default). Each tick:

```
1. OBSERVE:  Poll DOM for current screen state (detectState)
2. UPDATE:   Feed observations into WorldState model
3. THINK:    Yuka EntityManager.update() -> Think.arbitrate() -> Goal.execute()
4. ACT:      Active goal issues Playwright commands (click, keypress, wait)
5. CHECK:    Verify expected result occurred. Update progress timer.
6. REPORT:   Log action and result. Screenshot if notable event.
```

The tick rate of 200ms is fast enough to respond to game events but slow enough to avoid race conditions with RPG-JS's own update loop (which runs at 60fps but GUI transitions take 150-400ms per the UI spec).

### Timing Considerations

- **Dialogue typewriter**: 30ms per character at Normal speed. The governor waits for the advance indicator (pulsing arrow) before clicking to advance.
- **Combat turn resolution**: After selecting an action, wait for the animation to complete (up to 1 second for skill animations).
- **Zone transitions**: Wait up to 10 seconds for the new zone to load and HUD to appear.
- **Menu animations**: 200ms ease-out for open, 150ms for tab switch.

---

## CI/CD Integration

The governor is designed to run in GitHub Actions as part of the build pipeline.

### Workflow Integration

```yaml
# In .github/workflows/build-deploy.yml
governor-smoke:
  runs-on: ubuntu-latest
  needs: build
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - run: pnpm install
    - run: pnpm exec playwright install chromium
    - run: pnpm governor:smoke
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: governor-report
        path: tests/governor/reports/
```

### Package.json Scripts

```json
{
  "governor:smoke": "tsx tests/governor/run.ts --config smoke",
  "governor:act1": "tsx tests/governor/run.ts --config act1",
  "governor:full": "tsx tests/governor/run.ts --config full-joy",
  "governor:matrix": "tsx tests/governor/run.ts --config matrix"
}
```

---

## Report Format

Each run produces a JSON report:

```json
{
  "config": {
    "class": "knight",
    "emotions": ["joy", "joy", "joy", "joy"],
    "sideQuests": true,
    "startTime": "2026-02-13T10:00:00Z",
    "endTime": "2026-02-13T10:47:23Z"
  },
  "summary": {
    "result": "PASS",
    "duration_ms": 2843000,
    "quests_completed": 28,
    "quests_attempted": 36,
    "combats_fought": 84,
    "combats_won": 82,
    "combats_fled": 2,
    "game_overs": 1,
    "zones_visited": 17,
    "fragments_collected": 43,
    "final_level": 28
  },
  "errors": [],
  "warnings": [
    {
      "category": "balance",
      "severity": "info",
      "message": "Player under-leveled for Hollow Ridge (level 11, expected 12-16)",
      "timestamp": "2026-02-13T10:12:45Z",
      "screenshot": "screenshots/warning-001.png"
    }
  ],
  "timeline": [
    {
      "timestamp": "2026-02-13T10:00:05Z",
      "event": "title_screen_loaded",
      "details": { "loadTime_ms": 3200 }
    },
    {
      "timestamp": "2026-02-13T10:00:08Z",
      "event": "class_selected",
      "details": { "class": "knight" }
    }
  ]
}
```

---

## Open Questions for Implementation

1. **Debug module**: Should the optional `__rpg_debug` window exposure be gated behind an environment variable (`GOVERNOR_MODE=true`) or a build flag?

2. **Canvas pixel reading**: Some game state (player position on the PixiJS canvas) may not be accessible via DOM. Options: (a) rely solely on the debug module, (b) use Playwright screenshot + image analysis, (c) accept that exact tile position is approximated.

3. **Deterministic seeds**: v2 uses `Date.now()` as the seed, making runs non-deterministic. Should the governor inject a fixed seed via the debug module for reproducible regression testing?

4. **Parallel runs**: The `matrix` config runs 4 classes x 4 emotion sets = 16 playthroughs. Should these run in parallel (16 browser instances) or sequential? Memory and CI resource constraints apply.

5. **Combat AI sophistication**: The current combat strategy is simple priority-based. If boss fights prove too difficult for the simple AI, should we add boss-specific strategies or accept game-over + retry as valid?
