import type { RpgPlayer } from '@rpgjs/server';

// ---- Types ----

export type EquipmentSlot = 'weapon' | 'armor' | 'accessory';

export interface Equipment {
  weapon: string | null;
  armor: string | null;
  accessory: string | null;
}

export interface EquipBonuses {
  atk: number;
  def: number;
  int: number;
}

// ---- Player Variable Keys ----

const VAR_INVENTORY = 'INVENTORY';
const VAR_EQUIPMENT = 'EQUIPMENT';
const VAR_GOLD = 'GOLD';
const VAR_EQUIP_BONUSES = 'EQUIP_BONUSES';

// ---- Consumable Effects (derived from gen/ddl/consumables/) ----

interface ConsumableEffect {
  hp?: number;
  hpPercent?: number;
  sp?: number;
  spPercent?: number;
}

const CONSUMABLE_EFFECTS: Record<string, ConsumableEffect> = {
  // recovery.json
  'C-HP-01': { hp: 50 },
  'C-HP-02': { hp: 120 },
  'C-HP-03': { hp: 250 },
  'C-HP-04': { hpPercent: 100 },
  'C-SP-01': { sp: 20 },
  'C-SP-02': { sp: 50 },
  'C-SP-03': { sp: 120 },
  'C-SP-04': { spPercent: 100 },
  // specials.json (Dissolved Essence restores 50% HP + 50% SP)
  'C-SP-09': { hpPercent: 50, spPercent: 50 },
};

// ---- Weapon Stats (derived from gen/ddl/weapons/) ----

interface WeaponDef {
  statType: 'atk' | 'int';
  statBonus: number;
}

const WEAPON_STATS: Record<string, WeaponDef> = {
  // Swords (knight)
  'W-SW-01': { statType: 'atk', statBonus: 5 },
  'W-SW-02': { statType: 'atk', statBonus: 10 },
  'W-SW-03': { statType: 'atk', statBonus: 16 },
  'W-SW-04': { statType: 'atk', statBonus: 22 },
  'W-SW-05': { statType: 'atk', statBonus: 28 },
  'W-SW-06': { statType: 'atk', statBonus: 35 },
  'W-SW-07': { statType: 'atk', statBonus: 42 },
  'W-SW-08': { statType: 'atk', statBonus: 50 },
  // Daggers (rogue)
  'W-DG-01': { statType: 'atk', statBonus: 4 },
  'W-DG-02': { statType: 'atk', statBonus: 8 },
  'W-DG-03': { statType: 'atk', statBonus: 13 },
  'W-DG-04': { statType: 'atk', statBonus: 19 },
  'W-DG-05': { statType: 'atk', statBonus: 25 },
  'W-DG-06': { statType: 'atk', statBonus: 32 },
  'W-DG-07': { statType: 'atk', statBonus: 39 },
  'W-DG-08': { statType: 'atk', statBonus: 47 },
  // Staves (cleric)
  'W-ST-01': { statType: 'int', statBonus: 4 },
  'W-ST-02': { statType: 'int', statBonus: 8 },
  'W-ST-03': { statType: 'int', statBonus: 14 },
  'W-ST-04': { statType: 'int', statBonus: 20 },
  'W-ST-05': { statType: 'int', statBonus: 26 },
  'W-ST-06': { statType: 'int', statBonus: 33 },
  'W-ST-07': { statType: 'int', statBonus: 40 },
  'W-ST-08': { statType: 'int', statBonus: 48 },
  // Wands (mage)
  'W-WD-01': { statType: 'int', statBonus: 5 },
  'W-WD-02': { statType: 'int', statBonus: 9 },
  'W-WD-03': { statType: 'int', statBonus: 15 },
  'W-WD-04': { statType: 'int', statBonus: 21 },
  'W-WD-05': { statType: 'int', statBonus: 27 },
  'W-WD-06': { statType: 'int', statBonus: 34 },
  'W-WD-07': { statType: 'int', statBonus: 41 },
  'W-WD-08': { statType: 'int', statBonus: 49 },
};

// ---- Armor Stats (derived from gen/ddl/armor/) ----

const ARMOR_STATS: Record<string, number> = {
  // tier1-2.json
  'A-01': 3,
  'A-02': 6,
  'A-03': 10,
  'A-04': 15,
  'A-05': 12,
  'A-06': 18,
  'A-07': 14,
  'A-08': 20,
  // tier3.json
  'A-09': 25,
  'A-10': 30,
  'A-11': 22,
  'A-12': 28,
  'A-13': 24,
  'A-14': 35,
};

// ---- Internal Helpers ----

function getInventoryMap(player: RpgPlayer): Record<string, number> {
  return (player.getVariable(VAR_INVENTORY) as Record<string, number>) ?? {};
}

function getEquipment(player: RpgPlayer): Equipment {
  return (
    (player.getVariable(VAR_EQUIPMENT) as Equipment) ?? {
      weapon: null,
      armor: null,
      accessory: null,
    }
  );
}

function recalculateStats(player: RpgPlayer): void {
  const equip = getEquipment(player);
  const bonuses: EquipBonuses = { atk: 0, def: 0, int: 0 };

  if (equip.weapon) {
    const wep = WEAPON_STATS[equip.weapon];
    if (wep) {
      if (wep.statType === 'atk') bonuses.atk += wep.statBonus;
      else bonuses.int += wep.statBonus;
    }
  }

  if (equip.armor) {
    const def = ARMOR_STATS[equip.armor];
    if (def !== undefined) bonuses.def += def;
  }

  player.setVariable(VAR_EQUIP_BONUSES, bonuses);
}

// ---- Inventory Functions ----

export function addItem(player: RpgPlayer, itemId: string, qty = 1): void {
  const inv = getInventoryMap(player);
  inv[itemId] = (inv[itemId] ?? 0) + qty;
  player.setVariable(VAR_INVENTORY, inv);
}

export function removeItem(player: RpgPlayer, itemId: string, qty = 1): boolean {
  const inv = getInventoryMap(player);
  const current = inv[itemId] ?? 0;
  if (current < qty) return false;
  const remaining = current - qty;
  if (remaining <= 0) {
    delete inv[itemId];
  } else {
    inv[itemId] = remaining;
  }
  player.setVariable(VAR_INVENTORY, inv);
  return true;
}

export function getInventory(player: RpgPlayer): Record<string, number> {
  return { ...getInventoryMap(player) };
}

// ---- Equipment Functions ----

export function equipItem(player: RpgPlayer, slot: EquipmentSlot, itemId: string): boolean {
  const inv = getInventoryMap(player);
  if (!inv[itemId]) return false;

  // Validate item matches slot
  if (slot === 'weapon' && !WEAPON_STATS[itemId]) return false;
  if (slot === 'armor' && !ARMOR_STATS[itemId]) return false;

  const equip = getEquipment(player);

  // Return currently equipped item to inventory
  const currentId = equip[slot];
  if (currentId) {
    inv[currentId] = (inv[currentId] ?? 0) + 1;
  }

  // Move item from inventory to equipment slot
  inv[itemId] -= 1;
  if (inv[itemId] <= 0) delete inv[itemId];
  equip[slot] = itemId;

  player.setVariable(VAR_INVENTORY, inv);
  player.setVariable(VAR_EQUIPMENT, equip);
  recalculateStats(player);
  return true;
}

export function getEquipBonuses(player: RpgPlayer): EquipBonuses {
  return (player.getVariable(VAR_EQUIP_BONUSES) as EquipBonuses) ?? { atk: 0, def: 0, int: 0 };
}

// ---- Consumable Functions ----

export function useItem(player: RpgPlayer, itemId: string): boolean {
  const effect = CONSUMABLE_EFFECTS[itemId];
  if (!effect) return false;
  if (!removeItem(player, itemId, 1)) return false;

  if (effect.hp) {
    player.hp = Math.min(player.hp + effect.hp, player.param.maxHp);
  }
  if (effect.hpPercent) {
    const restore = Math.floor(player.param.maxHp * (effect.hpPercent / 100));
    player.hp = Math.min(player.hp + restore, player.param.maxHp);
  }
  if (effect.sp) {
    player.sp = Math.min(player.sp + effect.sp, player.param.maxSp);
  }
  if (effect.spPercent) {
    const restore = Math.floor(player.param.maxSp * (effect.spPercent / 100));
    player.sp = Math.min(player.sp + restore, player.param.maxSp);
  }

  return true;
}

// ---- Gold Functions ----

export function addGold(player: RpgPlayer, amount: number): void {
  player.setVariable(VAR_GOLD, getGold(player) + amount);
}

export function removeGold(player: RpgPlayer, amount: number): boolean {
  const current = getGold(player);
  if (current < amount) return false;
  player.setVariable(VAR_GOLD, current - amount);
  return true;
}

export function getGold(player: RpgPlayer): number {
  return (player.getVariable(VAR_GOLD) as number) ?? 0;
}
