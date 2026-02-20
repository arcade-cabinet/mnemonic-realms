/**
 * Mnemonic Realms — Inventory Subpackage
 *
 * Pure-function inventory management, equipment, and shop transactions.
 * No UI code — rendering lives in ui/inventory-screen.tsx and ui/shop-screen.tsx.
 */

export {
  addItem,
  createInventory,
  equipItem,
  getEquippedItem,
  getItemCount,
  hasItem,
  removeItem,
  unequipItem,
} from './inventory.js';
export { buyItem, canBuy, getSellPrice, sellItem } from './shop.js';
export type {
  ArmorItem,
  ConsumableItem,
  EquipmentSlots,
  GameItem,
  InventoryState,
  ItemCategory,
  WeaponItem,
} from './types.js';
