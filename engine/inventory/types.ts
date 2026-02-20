/**
 * Mnemonic Realms — Inventory Type Definitions
 *
 * Item categories, game items, equipment slots, and inventory state.
 * All types are immutable — inventory functions return new state.
 */

// ── Item Categories ─────────────────────────────────────────────────────────

export type ItemCategory = 'weapon' | 'armor' | 'consumable' | 'key-item' | 'fragment';

// ── Base Item ───────────────────────────────────────────────────────────────

export interface GameItem {
  readonly id: string;
  readonly name: string;
  readonly category: ItemCategory;
  readonly description: string;
  readonly stackable: boolean;
  readonly maxStack: number;
  readonly price: number;
}

// ── Specialized Items ───────────────────────────────────────────────────────

export interface WeaponItem extends GameItem {
  readonly category: 'weapon';
  readonly weaponType: string;
  readonly statType: 'atk' | 'int';
  readonly statBonus: number;
  readonly classRestriction: string;
}

export interface ArmorItem extends GameItem {
  readonly category: 'armor';
  readonly defBonus: number;
}

export interface ConsumableItem extends GameItem {
  readonly category: 'consumable';
  readonly effect: string;
}

// ── Equipment ───────────────────────────────────────────────────────────────

export interface EquipmentSlots {
  readonly weapon: string | null;
  readonly armor: string | null;
  readonly accessory: string | null;
}

// ── Inventory State ─────────────────────────────────────────────────────────

export interface InventoryState {
  /** Map of itemId → count. */
  readonly items: Map<string, number>;
  /** Currently equipped items by slot. */
  readonly equipment: EquipmentSlots;
  /** Player's gold balance. */
  readonly gold: number;
}
