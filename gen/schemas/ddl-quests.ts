/** Zod schemas for quest chain DDL. */

import { z } from 'zod';

export const QuestObjectiveSchema = z.object({
  index: z.number().int().nonnegative(),
  description: z.string(),
  location: z.string().optional(),
  position: z.string().optional(),
});

export const QuestRewardSchema = z.object({
  type: z.enum(['gold', 'item', 'fragment', 'key-item', 'companion', 'vibrancy', 'unlock']),
  id: z.string().optional(),
  name: z.string(),
  amount: z.number().optional(),
});

export const QuestDdlSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['main', 'side', 'god-recall']),
  act: z.enum(['act1', 'act2', 'act3']),
  levelRange: z.string(),
  giver: z.string(),
  giverLocation: z.string(),
  triggerCondition: z.string(),
  objectives: z.array(QuestObjectiveSchema).min(1),
  rewards: z.array(QuestRewardSchema),
  completionDialogue: z.string(),
  failureConditions: z.string(),
  unlocks: z.array(z.string()),
  dependencies: z.array(z.string()),
  targetPath: z.string(),
});

export const QuestsDdlSchema = z.object({
  quests: z.array(QuestDdlSchema).min(1),
});

export type QuestDdl = z.infer<typeof QuestDdlSchema>;
export type QuestsDdl = z.infer<typeof QuestsDdlSchema>;
