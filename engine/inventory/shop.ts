/**
 * Mnemonic Realms — Shop Transactions (Pure Functions)
 *
 * Buy/sell logic with gold management. All functions are immutable.
 * Sell price is 50% of buy price by default.
 */

import { addItem, removeItem } from './inventory.js';
import type { GameItem, InventoryState } from './types.js';

/** Default sell-price ratio (50% of buy price). */
const SELL_RATIO = 0.5;

/** Check if the player can afford to buy `quantity` of an item. */
export function canBuy(state: InventoryState, item: GameItem, quantity: number): boolean {
  return state.gold >= item.price * quantity;
}

/**
 * Buy `quantity` of an item from a shop.
 * Deducts gold and adds items to inventory. Returns new state.
 */
export function buyItem(state: InventoryState, item: GameItem, quantity: number): InventoryState {
  const totalCost = item.price * quantity;
  const next = addItem(state, item.id, quantity);
  return { ...next, gold: state.gold - totalCost };
}

/**
 * Sell `quantity` of an item to a shop.
 * Adds gold and removes items from inventory. Returns new state.
 */
export function sellItem(
  state: InventoryState,
  itemId: string,
  sellPrice: number,
  quantity: number,
): InventoryState {
  const next = removeItem(state, itemId, quantity);
  return { ...next, gold: state.gold + sellPrice * quantity };
}

/** Calculate sell price for an item (50% of buy price, floored). */
export function getSellPrice(item: GameItem): number {
  return Math.floor(item.price * SELL_RATIO);
}
