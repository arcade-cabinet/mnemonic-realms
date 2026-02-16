/** Zod schemas for NPC dialogue tree DDL. */

import { z } from 'zod';

export const DialogueLineSchema = z.object({
  speaker: z.string(),
  text: z.string(),
  portrait: z.string().optional(),
  emotion: z.string().optional(),
});

export const DialogueEntryDdlSchema = z.object({
  id: z.string(),
  npcId: z.string(),
  npcName: z.string(),
  trigger: z.string(),
  location: z.string(),
  condition: z.string().optional(),
  lines: z.array(DialogueLineSchema).min(1),
  linkedScene: z.string().optional(),
  linkedQuest: z.string().optional(),
  targetPath: z.string(),
});

export const DialogueEntriesDdlSchema = z.object({
  dialogues: z.array(DialogueEntryDdlSchema).min(1),
});

export type DialogueEntryDdl = z.infer<typeof DialogueEntryDdlSchema>;
export type DialogueEntriesDdl = z.infer<typeof DialogueEntriesDdlSchema>;
