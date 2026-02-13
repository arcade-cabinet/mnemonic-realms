/** Zod schemas for class stats DDL. */

import { z } from 'zod';

export const StatGrowthDdlSchema = z.object({
  base: z.number(),
  growthRate: z.number(),
});

export const ClassStatsDdlSchema = z.object({
  id: z.enum(['knight', 'cleric', 'mage', 'rogue']),
  name: z.string(),
  hp: StatGrowthDdlSchema,
  sp: StatGrowthDdlSchema,
  atk: StatGrowthDdlSchema,
  int: StatGrowthDdlSchema,
  def: StatGrowthDdlSchema,
  agi: StatGrowthDdlSchema,
  description: z.string(),
  skillIds: z.array(z.string()),
});

export const ClassStatsDdlListSchema = z.object({
  classes: z.array(ClassStatsDdlSchema).min(4),
});

export type ClassStatsDdl = z.infer<typeof ClassStatsDdlSchema>;
export type ClassStatsDdlList = z.infer<typeof ClassStatsDdlListSchema>;
