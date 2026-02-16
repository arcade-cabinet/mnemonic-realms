/** Zod schemas for skill and status effect DDLs. */

import { z } from 'zod';

export const SkillStatsDdlSchema = z.object({
  id: z.string(),
  name: z.string(),
  classId: z.enum(['knight', 'cleric', 'mage', 'rogue']),
  level: z.number().int().min(1),
  spCost: z.number().int().nonnegative(),
  target: z.enum(['SE', 'AE', 'FR', 'S', 'SA', 'AA', 'RE', 'A']),
  element: z.string(),
  formula: z.string(),
  description: z.string(),
  isPassive: z.boolean(),
  isSubclass: z.boolean(),
  subclassPath: z.enum(['luminary', 'crucible', 'none']),
});

export const SkillsDdlSchema = z.object({
  skills: z.array(SkillStatsDdlSchema).min(1),
});

export const StatusEffectDdlSchema = z.object({
  id: z.string(),
  name: z.string(),
  effect: z.string(),
  duration: z.number().int().positive(),
  stackable: z.boolean(),
});

export const StatusEffectsDdlSchema = z.object({
  statuses: z.array(StatusEffectDdlSchema).min(1),
});

export type SkillStatsDdl = z.infer<typeof SkillStatsDdlSchema>;
export type SkillsDdl = z.infer<typeof SkillsDdlSchema>;
export type StatusEffectDdl = z.infer<typeof StatusEffectDdlSchema>;
export type StatusEffectsDdl = z.infer<typeof StatusEffectsDdlSchema>;
