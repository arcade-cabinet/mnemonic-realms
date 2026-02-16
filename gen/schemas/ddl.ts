/** Zod schemas for validating gen/ddl/ directory-based DDL data. */

import { z } from 'zod';

export const BiomeConfigSchema = z.object({
  biome: z.string(),
  heading: z.string(),
  zones: z.array(z.string()).min(1),
  gridCols: z.number().int().positive(),
  gridRows: z.number().int().positive(),
});

export const BiomesMetaSchema = z.object({
  tierColumnMap: z.record(z.string(), z.string()),
  sketchTierColumnMap: z.record(z.string(), z.string()),
});

export const TransitionSchema = z.object({
  from: z.string(),
  to: z.string(),
  usedAt: z.string(),
});

export const TransitionsMetaSchema = z.object({
  gridCols: z.number().int().positive(),
  gridRows: z.number().int().positive(),
});

export const StagnationMetaSchema = z.object({
  gridCols: z.number().int().positive(),
  gridRows: z.number().int().positive(),
  zones: z.array(z.string()).min(1),
});

export const PlayerClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  heading: z.string(),
  color: z.string(),
  accent: z.string(),
});

export const NpcSchema = z.object({
  id: z.string(),
  name: z.string(),
  heading: z.string(),
  type: z.enum(['named', 'template']),
  desc: z.string(),
});

export const PortraitCharSchema = z.object({
  id: z.string(),
  name: z.string(),
  heading: z.string().optional(),
  appearance: z.string(),
  type: z.enum(['named', 'god']),
});

export const PortraitsMetaSchema = z.object({
  expressions: z.array(z.string()).min(1),
});

export const ItemEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  desc: z.string(),
});

export type BiomeConfig = z.infer<typeof BiomeConfigSchema>;
export type BiomesMeta = z.infer<typeof BiomesMetaSchema>;
export type Transition = z.infer<typeof TransitionSchema>;
export type TransitionsMeta = z.infer<typeof TransitionsMetaSchema>;
export type StagnationMeta = z.infer<typeof StagnationMetaSchema>;
export type PlayerClass = z.infer<typeof PlayerClassSchema>;
export type Npc = z.infer<typeof NpcSchema>;
export type PortraitChar = z.infer<typeof PortraitCharSchema>;
export type PortraitsMeta = z.infer<typeof PortraitsMetaSchema>;
export type ItemEntry = z.infer<typeof ItemEntrySchema>;

// UI Element DDL schemas

export const UIElementEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum([
    'dialogue-frame',
    'battle-frame',
    'menu-background',
    'title-background',
    'window-border',
    'button',
    'hud-element',
  ]),
  desc: z.string(),
  nineSlice: z.boolean().optional(),
});

export const UIElementsMetaSchema = z.object({
  styleNote: z.string(),
  nineSlicePadding: z.number().int().positive(),
});

export type UIElementEntry = z.infer<typeof UIElementEntrySchema>;
export type UIElementsMeta = z.infer<typeof UIElementsMetaSchema>;

// Audio DDL schemas

export const SfxEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['ui', 'combat', 'memory', 'environment']),
  description: z.string(),
  durationSec: z.number().positive(),
  looping: z.boolean().optional(),
  preset: z.array(z.number()).optional(),
});

export const BgmEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['zone', 'combat', 'event']),
  zone: z.string().optional(),
  tempo: z.number().int().positive(),
  key: z.string(),
  timeSignature: z.string(),
  mood: z.string(),
  durationSec: z.number().positive(),
  stems: z.array(
    z.object({
      layer: z.number().int().min(1).max(4),
      instruments: z.string(),
      description: z.string(),
    }),
  ),
});

export const BgmMetaSchema = z.object({
  format: z.string(),
  sampleRate: z.number(),
  bitDepth: z.number(),
});

export const AmbientEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  biome: z.string(),
  description: z.string(),
  sourceQuery: z.string(),
  defaultVolume: z.number().min(0).max(1),
  mutedDesc: z.string(),
  vividDesc: z.string(),
});

export type SfxEntry = z.infer<typeof SfxEntrySchema>;
export type BgmEntry = z.infer<typeof BgmEntrySchema>;
export type BgmMeta = z.infer<typeof BgmMetaSchema>;
export type AmbientEntry = z.infer<typeof AmbientEntrySchema>;

// Map DDL schemas (re-exported from dedicated module)

export type {
  EnemyZone,
  EventTrigger,
  MapConnection,
  MapDdl,
  NpcSpawn,
  ResonanceStone,
  TreasureChest,
} from './ddl-maps';
export {
  EnemyZoneSchema,
  EventTriggerSchema,
  MapConnectionSchema,
  MapDdlSchema,
  NpcSpawnSchema,
  ResonanceStoneSchema,
  TreasureChestSchema,
} from './ddl-maps';
