/**
 * Mnemonic Realms — Inventory Management (Pure Functions)
 *
 * All functions are immutable — they return new InventoryState.
 * No side effects; logic only. UI lives in ui/inventory-screen.tsx.
 */

import type { EquipmentSlots, InventoryState } from './types.js';

// ── Create ──────────────────────────────────────────────────────────────────

/** Create a fresh, empty inventory. */
export function createInventory(): InventoryState {
  return {
    items: new Map(),
    equipment: { weapon: null, armor: null, accessory: null },
    gold: 0,
  };
}

// ── Item Management ─────────────────────────────────────────────────────────

/** Add `count` of an item (default 1). Returns new state. */
export function addItem(state: InventoryState, itemId: string, count = 1): InventoryState {
  const items = new Map(state.items);
  const current = items.get(itemId) ?? 0;
  items.set(itemId, current + count);
  return { ...state, items };
}

/** Remove `count` of an item (default 1). Removes entry at 0. Returns new state. */
export function removeItem(state: InventoryState, itemId: string, count = 1): InventoryState {
  const items = new Map(state.items);
  const current = items.get(itemId) ?? 0;
  const next = current - count;
  if (next <= 0) {
    items.delete(itemId);
  } else {
    items.set(itemId, next);
  }
  return { ...state, items };
}

/** Check if inventory has at least `count` of an item (default 1). */
export function hasItem(state: InventoryState, itemId: string, count = 1): boolean {
  return (state.items.get(itemId) ?? 0) >= count;
}

/** Get the count of a specific item. Returns 0 if not present. */
export function getItemCount(state: InventoryState, itemId: string): number {
  return state.items.get(itemId) ?? 0;
}

// ── Equipment Management ────────────────────────────────────────────────────

/**
 * Equip an item from inventory to a slot.
 * - Removes item from inventory
 * - If slot already occupied, returns old item to inventory
 * - Sets the slot to the new itemId
 */
export function equipItem(
  state: InventoryState,
  itemId: string,
  slot: keyof EquipmentSlots,
): InventoryState {
  // Remove the item being equipped from inventory
  let next = removeItem(state, itemId);

  // If slot already has an item, return it to inventory
  const currentEquipped = state.equipment[slot];
  if (currentEquipped) {
    next = addItem(next, currentEquipped);
  }

  // Set the new equipment
  const equipment: EquipmentSlots = { ...next.equipment, [slot]: itemId };
  return { ...next, equipment };
}

/**
 * Unequip an item from a slot back to inventory.
 * - Adds equipped item back to inventory
 * - Clears the slot
 */
export function unequipItem(state: InventoryState, slot: keyof EquipmentSlots): InventoryState {
  const equipped = state.equipment[slot];
  if (!equipped) return state;

  const next = addItem(state, equipped);
  const equipment: EquipmentSlots = { ...next.equipment, [slot]: null };
  return { ...next, equipment };
}

/** Get the item ID currently in a slot, or null. */
export function getEquippedItem(state: InventoryState, slot: keyof EquipmentSlots): string | null {
  return state.equipment[slot];
}
