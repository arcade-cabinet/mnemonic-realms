# Testing Infrastructure

Automated testing for Mnemonic Realms using Drizzle ORM, Playwright, and Yuka.js AI Governor.

## Overview

This testing infrastructure provides three key capabilities:

1. **Database Caching** (Drizzle ORM + sql.js) - Cache generated worlds for performance
2. **E2E Testing** (Playwright) - Browser-based functional testing
3. **AI Playtesting** (Yuka.js) - Automated gameplay testing with intelligent agents

## Reserved Test Seed

**Seed**: `"brave ancient warrior"`

This three-word seed is reserved for all deterministic E2E testing. It ensures:
- Reproducible test results
- Consistent world generation
- Reliable scenario execution
- Cross-platform compatibility

## Database Layer

### Schema

The database includes 5 tables:

- `worlds` - Cached procedurally generated world data
- `game_saves` - Player progress and game state
- `test_scenarios` - Expected outcomes for E2E tests
- `ai_scenarios` - AI governor test configurations
- `ai_test_runs` - Results from AI playtesting

### Usage

```typescript
import { getOrGenerateWorld, getCachedWorld } from './lib/db/worldCache';

// Generate or retrieve cached world
const world = await getOrGenerateWorld('brave ancient warrior');

// Check cache first
const cached = await getCachedWorld('dark ancient forest');
if (cached) {
  // Use cached data
}
```

### Browser Storage

The database runs entirely in-browser using sql.js (SQLite compiled to WebAssembly). Data is persisted to `localStorage` between sessions.

**Export/Import**:
```typescript
import { exportDatabase, importDatabase } from './lib/db';

// Export to file
const data = exportDatabase();
saveToFile(data, 'save-game.db');

// Import from file
const fileData = await loadFromFile();
await importDatabase(fileData);
```

## E2E Tests (Playwright)

### Running Tests

```bash
# Run all tests
pnpm test

# Run with UI
pnpm test:ui

# Run in headed mode (see browser)
pnpm test:headed

# Debug mode
pnpm test:debug
```

### Test Files

- `tests/e2e/procedural-generation.spec.ts` - Core generation tests
- `tests/e2e/ai-governor.spec.ts` - AI-driven gameplay tests

### Test Scenarios

**Procedural Generation Tests**:
- ✅ Landing page loads correctly
- ✅ World generates from reserved test seed
- ✅ Same seed produces deterministic output
- ✅ All content sections render
- ✅ Seed format validation (three words)
- ✅ Database caching works
- ✅ Cache hit improves performance

**AI Governor Tests**:
- ✅ Exploration scenario completion
- ✅ Scenario metrics recording
- ✅ Timeout on impossible scenarios
- ✅ Movement pattern capture

## AI Governor (Yuka.js)

### Purpose

The AI Governor uses Yuka.js to control player characters for automated playtesting. This enables:

- Automated gameplay scenario testing
- Performance benchmarking
- Regression detection
- Scenario capture for debugging

### Architecture

```
PlayerGovernor (Yuka.js)
├── Finite State Machine
│   ├── IDLE
│   ├── EXPLORING
│   ├── MOVING_TO_TARGET
│   ├── INTERACTING
│   ├── COMBAT
│   ├── GATHERING
│   ├── COMPLETED
│   └── FAILED
├── Vehicle (player representation)
├── Steering Behaviors
│   ├── Seek
│   ├── Wander
│   └── Pursue
└── Metrics Collection
    ├── Distance traveled
    ├── Goals completed
    ├── Interactions performed
    ├── Combat encounters
    └── Items gathered
```

### Creating AI Scenarios

```typescript
import { PlayerGovernor, type GovernorConfig, type AIGoal } from './tests/ai-governor/PlayerGovernor';

// Define goals
const goals: AIGoal[] = [
  { type: 'move', target: { x: 10, y: 10 } },
  { type: 'interact', targetEntity: 'npc-merchant' },
  { type: 'combat', targetEntity: 'enemy-goblin' },
  { type: 'explore', duration: 30 },
  { type: 'gather', target: { x: 20, y: 20 } },
];

// Configure governor
const config: GovernorConfig = {
  worldSeed: 'brave ancient warrior',
  startPosition: { x: 0, y: 0 },
  goals,
  maxDuration: 300, // 5 minutes
  aggressiveness: 0.6, // Combat preference (0-1)
  exploration: 0.7,    // Exploration preference (0-1)
};

// Create and run
const governor = new PlayerGovernor(config);
governor.start();

// Update loop (60 FPS)
let running = true;
while (running) {
  running = governor.update(0.016); // 16ms delta
  await sleep(16);
}

// Get results
const results = governor.getResults();
console.log(`Completed: ${results.completed}`);
console.log(`Goals: ${results.completedGoals}/${results.totalGoals}`);
console.log(`Metrics:`, results.metrics);
```

### Goal Types

- **move**: Navigate to specific coordinates
- **explore**: Wander and discover (duration-based)
- **interact**: Interact with entity (NPC, object)
- **combat**: Engage in combat with enemy
- **gather**: Collect items/resources

### Metrics

The AI Governor tracks:
- `distanceTraveled` - Total distance moved
- `goalsCompleted` - Number of goals achieved
- `interactionsPerformed` - NPC/object interactions
- `combatEncounters` - Number of battles
- `itemsGathered` - Resources collected

### Scenario Storage

AI scenarios are stored in the database:

```typescript
import { getDatabase } from './lib/db';
import { aiScenarios } from './lib/db/schema';

const db = await getDatabase();

// Insert scenario
await db.insert(aiScenarios).values({
  scenarioName: 'exploration-test',
  description: 'Test basic exploration behavior',
  worldSeed: 'brave ancient warrior',
  startState: JSON.stringify({ x: 0, y: 0 }),
  goals: JSON.stringify(goals),
  behaviorConfig: JSON.stringify({ aggressiveness: 0.3, exploration: 0.9 }),
  maxDuration: 180,
  successCriteria: JSON.stringify({ minGoalsCompleted: 3 }),
});
```

## CI/CD Integration

Tests run automatically in GitHub Actions:

```yaml
- name: Install dependencies
  run: pnpm install

- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: pnpm test

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

## Test Data

### Reserved Seeds

- `"brave ancient warrior"` - Primary E2E test seed (Light alignment, Paladin class)

### Expected Outcomes

For the reserved test seed, expected values are:

```typescript
{
  seed: "brave ancient warrior",
  character: {
    alignment: "light",
    class: "Paladin" | "Cleric" | "Warrior", // Light-aligned classes
    // Name is procedurally generated but deterministic
  },
  location: {
    // Deterministic based on seed
  },
  terrain: {
    // 10x10 grid, deterministic biome distribution
  }
}
```

## Performance Targets

- World generation: < 500ms (uncached)
- Cache retrieval: < 50ms
- Database operations: < 10ms
- AI scenario execution: 60 FPS
- Test suite completion: < 5 minutes

## Troubleshooting

### Database not persisting

Check localStorage:
```typescript
const data = localStorage.getItem('mnemonic-realms-db');
console.log('DB size:', data?.length || 0);
```

### AI Governor not moving

Check vehicle configuration:
```typescript
console.log('Max speed:', governor.vehicle.maxSpeed);
console.log('Max force:', governor.vehicle.maxForce);
```

### Tests timing out

Increase timeout in `playwright.config.ts`:
```typescript
use: {
  timeout: 60000, // 60 seconds per test
}
```

## Future Enhancements

- [ ] Parallel AI scenario execution
- [ ] Visual replay of AI test runs
- [ ] Machine learning for behavior optimization
- [ ] Distributed testing across multiple seeds
- [ ] Performance regression detection
- [ ] Automated bug report generation
