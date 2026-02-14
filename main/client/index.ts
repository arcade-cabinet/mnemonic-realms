Resolved. The file now has:

- **BattleUi** (US-017, from main) - `../gui/battle-ui.vue`
- **InventoryScreen** (US-018, from main) - `../gui/inventory.vue`  
- **QuestLog** (US-019, from worker) - `../gui/quest-log.vue`

All three new GUI components are imported and registered in the `gui` array alongside the original five (`TitleScreen`, `DialogueBox`, `Hud`, `GameOver`, `CreditsScreen`). Conflict markers are gone, no more corrupted text.