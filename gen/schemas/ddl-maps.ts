/** Zod schemas for map DDL entries. */

import { z } from 'zod';

export const MapConnectionSchema = z.object({
  fromTile: z.string().describe('Exit tile as "x,y"'),
  direction: z.string().describe('Cardinal or vertical direction'),
  toMap: z.string().describe('Target map id'),
  toTile: z.string().describe('Arrival tile as "x,y"'),
  condition: z.string().describe('Availability condition (e.g., "always", "MQ-04+")'),
});

export const NpcSpawnSchema = z.object({
  npcId: z.string(),
  name: z.string(),
  position: z.string().describe('Tile position as "x,y"'),
  graphic: z.string(),
  movement: z.string().describe('Static, Patrol, Wander'),
  patrolRange: z.string().optional(),
  condition: z.string().optional(),
  quests: z.array(z.string()).optional(),
});

export const EnemyZoneSchema = z.object({
  zone: z.string(),
  bounds: z.string().describe('Bounds as "x1,y1 -> x2,y2"'),
  enemies: z.array(z.string()),
  levelRange: z.string(),
  encounterRate: z.string(),
});

export const EventTriggerSchema = z.object({
  id: z.string(),
  position: z.string().describe('Tile position as "x,y"'),
  type: z.enum(['touch', 'action', 'auto', 'parallel']),
  linkedQuest: z.string().optional(),
  repeat: z.string().optional(),
  description: z.string(),
});

export const ResonanceStoneSchema = z.object({
  id: z.string(),
  position: z.string(),
  fragments: z.string().describe('Fragment details or "recall pedestal"'),
  notes: z.string().optional(),
});

export const TreasureChestSchema = z.object({
  id: z.string(),
  position: z.string(),
  contents: z.string(),
  condition: z.string().optional(),
});

export const MapDdlSchema = z.object({
  id: z.string().describe('Map identifier (e.g., "village-hub", "depths-l1")'),
  name: z.string().describe('Display name'),
  filename: z.string().describe('TMX filename'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  tileSize: z.number().int().default(32),
  biome: z.string(),
  tilesetRefs: z.array(z.string()),
  startVibrancy: z.number().int().min(0).max(100),
  category: z.enum(['overworld', 'depths', 'fortress']),
  act: z.string(),
  connections: z.array(MapConnectionSchema),
  npcSpawns: z.array(NpcSpawnSchema),
  enemyZones: z.array(EnemyZoneSchema),
  eventTriggers: z.array(EventTriggerSchema),
  resonanceStones: z.array(ResonanceStoneSchema),
  treasureChests: z.array(TreasureChestSchema),
});

export type MapConnection = z.infer<typeof MapConnectionSchema>;
export type NpcSpawn = z.infer<typeof NpcSpawnSchema>;
export type EnemyZone = z.infer<typeof EnemyZoneSchema>;
export type EventTrigger = z.infer<typeof EventTriggerSchema>;
export type ResonanceStone = z.infer<typeof ResonanceStoneSchema>;
export type TreasureChest = z.infer<typeof TreasureChestSchema>;
export type MapDdl = z.infer<typeof MapDdlSchema>;
