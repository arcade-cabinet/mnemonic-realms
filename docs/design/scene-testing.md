# Scene Testing Infrastructure

## Scene State Injection

The game supports jumping to any act/scene via URL query parameters for testing:

```
?act=1&scene=1    # Jump to Act 1, Scene 1 (Everwick, Elder's House)
?act=1&scene=5    # Jump to Act 1, Scene 5 (First journey to Heartfield)
?act=2&scene=1    # Jump to Act 2, Scene 1 (Frontier opens)
```

**Implementation** (TODO -- build as part of scene testing infrastructure):
- `main/server/systems/scene-loader.ts` -- Reads query params, injects required game state
- Each scene defines its prerequisites: map, player position, quest flags, party members, inventory, vibrancy levels
- Scene loader sets all prerequisites and teleports the player to the correct location
- Works in both dev mode (`pnpm dev`) and E2E tests

## Playwright E2E Tests Per Scene

Each scene gets a dedicated test file:

```
tests/e2e/scenes/
  act1-scene01-familiar-place.test.ts
  act1-scene02-memorial-garden.test.ts
  act1-scene03-training-ground.test.ts
  ...
```

Each test:
1. **Navigates** to `/?act={N}&scene={M}` to inject scene state
2. **Validates** the scene loads correctly (correct map, NPCs present, UI elements)
3. **Runs the AI player controller** with scene-specific instructions
4. **Asserts** scene completion criteria (quest flags set, dialogue completed, transitions triggered)

## AI Player Controller

An AI-governed E2E player controller that can navigate the game world and execute scene instructions:

```typescript
// Example test structure
test('Act 1, Scene 1: A Familiar Place', async ({ page }) => {
  await page.goto('/?act=1&scene=1');
  await waitForMapLoad(page, 'everwick');

  // AI player controller executes scene instructions
  await playScene(page, {
    instructions: [
      'Talk to Artun in the Elder\'s House',
      'Listen to the awakening dialogue',
      'Exit the Elder\'s House to the village square',
      'Optionally talk to Khali, Hark, or Nyro',
    ],
    successCriteria: {
      questFlags: ['MQ-01'],
      visitedLocations: ['elders-house'],
    },
  });
});
```
