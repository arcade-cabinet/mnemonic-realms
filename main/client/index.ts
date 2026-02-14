`★ Insight ─────────────────────────────────────`
**Merge resolution**: Both branches added a new Vue GUI component to the same `gui` array — `BattleUi` from main (US-017) and `InventoryScreen` from the worker (US-018). Since RPG-JS's `gui` array is order-independent for registration, combining both additions is the correct resolution. The imports were already auto-merged by git (no conflict there), so only the array literal needed manual resolution.
`─────────────────────────────────────────────────`

Resolved — kept both `BattleUi` (from main/US-017) and `InventoryScreen` (from worker/US-018) in the `gui` array. The imports were already cleanly merged by git.