/** Zod schemas for item DDLs: weapons, armor, consumables, key items, accessories. */

import { z } from 'zod';

export const WeaponStatsDdlSchema = z.object({
  id: z.string(),
  name: z.string(),
  classRestriction: z.enum(['knight', 'cleric', 'mage', 'rogue']),
  weaponType: z.enum(['sword', 'staff', 'wand', 'dagger']),
  statType: z.enum(['atk', 'int']),
  statBonus: z.number().int(),
  price: z.number().int().nonnegative(),
  tier: z.number().int().min(1).max(3),
  specialEffect: z.string(),
  acquisition: z.string(),
});

export const WeaponsDdlSchema = z.object({
  weapons: z.array(WeaponStatsDdlSchema).min(1),
});

export const ArmorStatsDdlSchema = z.object({
  id: z.string(),
  name: z.string(),
  def: z.number().int(),
  price: z.number().int().nonnegative(),
  tier: z.number().int().min(1).max(3),
  specialEffect: z.string(),
  acquisition: z.string(),
});

export const ArmorDdlSchema = z.object({
  armor: z.array(ArmorStatsDdlSchema).min(1),
});

export const ConsumableStatsDdlSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['healing', 'sp-recovery', 'status-cure', 'buff', 'special']),
  effect: z.string(),
  price: z.number().int().nonnegative(),
  stackMax: z.number().int().positive(),
  tier: z.number().int().min(1).max(3),
});

export const ConsumablesDdlSchema = z.object({
  consumables: z.array(ConsumableStatsDdlSchema).min(1),
});

export const KeyItemDdlSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  acquisition: z.string(),
  purpose: z.string(),
});

export const KeyItemsDdlSchema = z.object({
  keyItems: z.array(KeyItemDdlSchema).min(1),
});

export const AccessoryDdlSchema = z.object({
  id: z.string(),
  name: z.string(),
  effect: z.string(),
  acquisition: z.string(),
});

export const AccessoriesDdlSchema = z.object({
  accessories: z.array(AccessoryDdlSchema).min(1),
});

export type WeaponStatsDdl = z.infer<typeof WeaponStatsDdlSchema>;
export type WeaponsDdl = z.infer<typeof WeaponsDdlSchema>;
export type ArmorStatsDdl = z.infer<typeof ArmorStatsDdlSchema>;
export type ArmorDdl = z.infer<typeof ArmorDdlSchema>;
export type ConsumableStatsDdl = z.infer<typeof ConsumableStatsDdlSchema>;
export type ConsumablesDdl = z.infer<typeof ConsumablesDdlSchema>;
export type KeyItemDdl = z.infer<typeof KeyItemDdlSchema>;
export type KeyItemsDdl = z.infer<typeof KeyItemsDdlSchema>;
export type AccessoryDdl = z.infer<typeof AccessoryDdlSchema>;
export type AccessoriesDdl = z.infer<typeof AccessoriesDdlSchema>;
