/** Zod schemas for encounter DDL. */

import { z } from 'zod';

export const EncounterEnemyDdlSchema = z.object({
  enemyId: z.string(),
  count: z.number().int().positive(),
  position: z.enum(['front', 'back']).optional(),
});

export const EncounterRewardItemDdlSchema = z.object({
  itemId: z.string(),
  chance: z.number().min(0).max(1),
});

export const EncounterRewardsDdlSchema = z.object({
  xp: z.number().int().nonnegative(),
  gold: z.number().int().nonnegative(),
  items: z.array(EncounterRewardItemDdlSchema).optional(),
});

export const EncounterChainDdlSchema = z.object({
  next: z.string(),
  condition: z.string().optional(),
});

export const EncounterDdlSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
  type: z.enum(['random', 'boss', 'scripted', 'ambush']),
  enemies: z.array(EncounterEnemyDdlSchema).min(1),
  background: z.string().optional(),
  music: z.string().optional(),
  chain: EncounterChainDdlSchema.optional(),
  rewards: EncounterRewardsDdlSchema.optional(),
  escapeAllowed: z.boolean(),
});

export const EncounterPoolDdlSchema = z.object({
  regionId: z.string(),
  encounters: z.array(z.string()).min(1),
  stepsBetween: z.number().int().positive(),
  levelRange: z.tuple([z.number().int().nonnegative(), z.number().int().positive()]),
});

export const EncounterFileDdlSchema = z.object({
  encounters: z.array(EncounterDdlSchema).min(1),
  pools: z.array(EncounterPoolDdlSchema).optional(),
});

export type EncounterEnemyDdl = z.infer<typeof EncounterEnemyDdlSchema>;
export type EncounterRewardItemDdl = z.infer<typeof EncounterRewardItemDdlSchema>;
export type EncounterRewardsDdl = z.infer<typeof EncounterRewardsDdlSchema>;
export type EncounterChainDdl = z.infer<typeof EncounterChainDdlSchema>;
export type EncounterDdl = z.infer<typeof EncounterDdlSchema>;
export type EncounterPoolDdl = z.infer<typeof EncounterPoolDdlSchema>;
export type EncounterFileDdl = z.infer<typeof EncounterFileDdlSchema>;
