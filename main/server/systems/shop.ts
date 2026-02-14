import type { RpgPlayer } from '@rpgjs/server';
// -- DDL imports for price catalog --
import armorTier12 from '../../../gen/ddl/armor/tier1-2.json';
import armorTier3 from '../../../gen/ddl/armor/tier3.json';
import buffs from '../../../gen/ddl/consumables/buffs.json';
import recovery from '../../../gen/ddl/consumables/recovery.json';
import specials from '../../../gen/ddl/consumables/specials.json';
import statusCure from '../../../gen/ddl/consumables/status-cure.json';
import daggers from '../../../gen/ddl/weapons/daggers.json';
import staves from '../../../gen/ddl/weapons/staves.json';
import swords from '../../../gen/ddl/weapons/swords.json';
import wands from '../../../gen/ddl/weapons/wands.json';
import { addGold, addItem, getGold, removeGold, removeItem } from './inventory';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ShopItem {
  itemId: string;
  name: string;
  price: number;
}

export interface ShopDefinition {
  shopId: string;
  name: string;
  items: ShopItem[];
}

export interface BuyResult {
  success: boolean;
  message: string;
}

export interface SellResult {
  success: boolean;
  goldReceived: number;
  message: string;
}

// ---------------------------------------------------------------------------
// Item price catalog (built from DDL at import time)
// ---------------------------------------------------------------------------

interface DDLItem {
  id: string;
  name: string;
  price: number;
}

const ALL_DDL_ITEMS: DDLItem[] = [
  ...(recovery as DDLItem[]),
  ...(buffs as DDLItem[]),
  ...(statusCure as DDLItem[]),
  ...(specials as DDLItem[]),
  ...(swords as DDLItem[]),
  ...(daggers as DDLItem[]),
  ...(staves as DDLItem[]),
  ...(wands as DDLItem[]),
  ...(armorTier12 as DDLItem[]),
  ...(armorTier3 as DDLItem[]),
];

const ITEM_PRICES = new Map<string, number>(ALL_DDL_ITEMS.map((i) => [i.id, i.price]));

const ITEM_NAMES = new Map<string, string>(ALL_DDL_ITEMS.map((i) => [i.id, i.name]));

// ---------------------------------------------------------------------------
// Shop definitions (static inventories — no dynamic stock for v1)
// ---------------------------------------------------------------------------

function shopItem(itemId: string): ShopItem {
  return {
    itemId,
    name: ITEM_NAMES.get(itemId) ?? itemId,
    price: ITEM_PRICES.get(itemId) ?? 0,
  };
}

const SHOP_DEFINITIONS: ShopDefinition[] = [
  {
    shopId: 'village-general',
    name: "Maren's General Shop",
    items: [
      // Recovery
      shopItem('C-HP-01'), // Minor Potion — 30g
      shopItem('C-HP-02'), // Potion — 80g
      shopItem('C-SP-01'), // Mana Drop — 25g
      shopItem('C-SP-02'), // Mana Draught — 70g
      // Status cures
      shopItem('C-SC-01'), // Antidote — 20g
      shopItem('C-SC-02'), // Haste Charm — 60g
      shopItem('C-SC-03'), // Fortify Tonic — 60g
      // Specials
      shopItem('C-SP-05'), // Smoke Bomb — 40g
      // Basic equipment
      shopItem('A-02'), // Padded Vest — 60g
      shopItem('W-ST-02'), // Maren's Blessing Rod — 70g
      shopItem('W-WD-02'), // Amber Focus — 90g
    ],
  },
  {
    shopId: 'village-weapons',
    name: "Torvan's Blacksmith",
    items: [
      // Tier 1 weapons
      shopItem('W-SW-02'), // Iron Blade — 80g
      shopItem('W-DG-02'), // Steel Stiletto — 75g
      // Tier 2 weapons
      shopItem('W-SW-03'), // Oathkeeper's Edge — 250g
      // Armor
      shopItem('A-03'), // Leather Armor — 120g
      shopItem('A-04'), // Chain Mail — 300g
    ],
  },
  {
    shopId: 'frontier-supplies',
    name: 'Ridgewalker Camp Supplies',
    items: [
      // Mid-tier consumables
      shopItem('C-HP-02'), // Potion — 80g
      shopItem('C-HP-03'), // High Potion — 180g
      shopItem('C-SP-02'), // Mana Draught — 70g
      shopItem('C-SP-03'), // Mana Surge — 160g
      // Status cures
      shopItem('C-SC-04'), // Stasis Breaker — 120g
      shopItem('C-SC-05'), // Panacea — 200g
      // Buff seeds
      shopItem('C-BF-01'), // Strength Seed — 100g
      shopItem('C-BF-02'), // Wisdom Seed — 100g
      shopItem('C-BF-03'), // Aegis Seed — 100g
      shopItem('C-BF-04'), // Haste Seed — 100g
      // Frontier weapons + armor
      shopItem('W-SW-05'), // Ridgewalker Claymore — 600g
      shopItem('W-DG-04'), // Shadow Fang — 350g
      shopItem('A-08'), // Ridgewalker's Coat — 500g
    ],
  },
];

const SHOPS_BY_ID = new Map<string, ShopDefinition>(SHOP_DEFINITIONS.map((s) => [s.shopId, s]));

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getShopInventory(shopId: string): ShopItem[] | null {
  const shop = SHOPS_BY_ID.get(shopId);
  return shop ? [...shop.items] : null;
}

export function canAfford(player: RpgPlayer, price: number): boolean {
  return getGold(player) >= price;
}

export function buyItem(player: RpgPlayer, shopId: string, itemId: string, qty = 1): BuyResult {
  const shop = SHOPS_BY_ID.get(shopId);
  if (!shop) {
    return { success: false, message: 'Shop not found.' };
  }

  const listing = shop.items.find((i) => i.itemId === itemId);
  if (!listing) {
    return { success: false, message: 'Item not available in this shop.' };
  }

  const totalCost = listing.price * qty;
  if (!canAfford(player, totalCost)) {
    return { success: false, message: 'Not enough gold.' };
  }

  removeGold(player, totalCost);
  addItem(player, itemId, qty);

  return {
    success: true,
    message: `Bought ${qty}x ${listing.name} for ${totalCost}g.`,
  };
}

export function sellItem(player: RpgPlayer, itemId: string, qty = 1): SellResult {
  const basePrice = ITEM_PRICES.get(itemId);
  if (basePrice === undefined) {
    return { success: false, goldReceived: 0, message: 'Unknown item.' };
  }

  if (!removeItem(player, itemId, qty)) {
    return { success: false, goldReceived: 0, message: 'Not enough items to sell.' };
  }

  const sellPrice = Math.floor(basePrice * 0.5);
  const totalGold = sellPrice * qty;
  addGold(player, totalGold);

  const name = ITEM_NAMES.get(itemId) ?? itemId;
  return {
    success: true,
    goldReceived: totalGold,
    message: `Sold ${qty}x ${name} for ${totalGold}g.`,
  };
}

export function getItemPrice(itemId: string): number | null {
  return ITEM_PRICES.get(itemId) ?? null;
}

export function getShopDefinitions(): ShopDefinition[] {
  return SHOP_DEFINITIONS.map((s) => ({ ...s, items: [...s.items] }));
}
