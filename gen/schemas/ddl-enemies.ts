/** Zod schemas for enemy DDL. */

import { z } from 'zod';

export const EnemyAbilityDdlSchema = z.object({
  name: z.string(),
  formula: z.string(),
  effect: z.string(),
});

export const EnemyDropDdlSchema = z.object({
  itemId: z.string(),
  chance: z.number().min(0).max(1),
});

export const EnemyStatsDdlSchema = z.object({
  id: z.string(),
  name: z.string(),
  zone: z.string(),
  category: z.enum(['settled', 'frontier', 'sketch', 'depths', 'preserver', 'boss']),
  hp: z.number().int().positive(),
  atk: z.number().int().nonnegative(),
  int: z.number().int().nonnegative(),
  def: z.number().int().nonnegative(),
  agi: z.number().int().nonnegative(),
  baseLevel: z.number().int().positive(),
  xp: z.number().int().nonnegative(),
  gold: z.number().int().nonnegative(),
  abilities: z.array(EnemyAbilityDdlSchema).min(1),
  drops: z.array(EnemyDropDdlSchema),
  fragmentAffinity: z.string(),
});

export const EnemiesDdlSchema = z.object({
  enemies: z.array(EnemyStatsDdlSchema).min(1),
});

export type EnemyStatsDdl = z.infer<typeof EnemyStatsDdlSchema>;
export type EnemiesDdl = z.infer<typeof EnemiesDdlSchema>;
