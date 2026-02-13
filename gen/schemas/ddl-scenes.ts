/** Zod schemas for scene event DDL. */

import { z } from 'zod';

export const SceneTriggerSchema = z.object({
  type: z.enum([
    'map-enter',
    'npc-talk',
    'quest-state',
    'item-pickup',
    'auto',
    'cutscene',
    'area-enter',
  ]),
  map: z.string(),
  position: z.string().optional(),
  condition: z.string().optional(),
});

export const SceneNpcSchema = z.object({
  npcId: z.string(),
  name: z.string(),
  graphic: z.string(),
  dialogueKey: z.string(),
});

export const SceneEffectSchema = z.object({
  type: z.enum([
    'vibrancy-change',
    'companion-join',
    'companion-leave',
    'item-give',
    'item-remove',
    'quest-update',
    'combat-start',
    'cutscene-play',
    'gui-show',
    'system-message',
    'music-change',
    'screen-effect',
    'teleport',
  ]),
  params: z.record(z.string(), z.unknown()),
});

export const SceneQuestChangeSchema = z.object({
  questId: z.string(),
  action: z.enum(['activate', 'advance', 'complete']),
  objectiveIndex: z.number().int().nonnegative().optional(),
});

export const SceneEventDdlSchema = z.object({
  id: z.string(),
  act: z.enum(['act1', 'act2', 'act3']),
  sceneNumber: z.number().int().min(1),
  name: z.string(),
  location: z.string(),
  trigger: SceneTriggerSchema,
  npcs: z.array(SceneNpcSchema),
  effects: z.array(SceneEffectSchema),
  questChanges: z.array(SceneQuestChangeSchema),
  targetPath: z.string(),
  levelRange: z.string(),
  summary: z.string(),
});

export const SceneEventsDdlSchema = z.object({
  scenes: z.array(SceneEventDdlSchema).min(1),
});

export type SceneEventDdl = z.infer<typeof SceneEventDdlSchema>;
export type SceneEventsDdl = z.infer<typeof SceneEventsDdlSchema>;
