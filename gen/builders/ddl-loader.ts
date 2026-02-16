/** Loads DDL entries and metadata from directory-based structure. */

import {
  type AmbientEntry,
  AmbientEntrySchema,
  type BgmEntry,
  BgmEntrySchema,
  type BgmMeta,
  BgmMetaSchema,
  type BiomeConfig,
  BiomeConfigSchema,
  type BiomesMeta,
  BiomesMetaSchema,
  type ItemEntry,
  ItemEntrySchema,
  type MapDdl,
  MapDdlSchema,
  type Npc,
  NpcSchema,
  type PlayerClass,
  PlayerClassSchema,
  type PortraitChar,
  PortraitCharSchema,
  type PortraitsMeta,
  PortraitsMetaSchema,
  type SfxEntry,
  SfxEntrySchema,
  type StagnationMeta,
  StagnationMetaSchema,
  type Transition,
  TransitionSchema,
  type TransitionsMeta,
  TransitionsMetaSchema,
  type UIElementEntry,
  UIElementEntrySchema,
  type UIElementsMeta,
  UIElementsMetaSchema,
} from '../schemas/ddl';
import { loadDdlDirectory, loadDdlMeta } from './ddl-directory';

export function loadBiomes(): BiomeConfig[] {
  return loadDdlDirectory('biomes', BiomeConfigSchema);
}

export function loadBiomesMeta(): BiomesMeta {
  return loadDdlMeta('biomes', BiomesMetaSchema);
}

export function loadTransitions(): Transition[] {
  return loadDdlDirectory('transitions', TransitionSchema);
}

export function loadTransitionsMeta(): TransitionsMeta {
  return loadDdlMeta('transitions', TransitionsMetaSchema);
}

export function loadStagnation(): StagnationMeta {
  return loadDdlMeta('stagnation', StagnationMetaSchema);
}

export function loadPlayerClasses(): PlayerClass[] {
  return loadDdlDirectory('player-classes', PlayerClassSchema);
}

export function loadNpcs(): Npc[] {
  return loadDdlDirectory('npcs', NpcSchema);
}

export function loadPortraits(): PortraitChar[] {
  return loadDdlDirectory('portraits', PortraitCharSchema);
}

export function loadPortraitsMeta(): PortraitsMeta {
  return loadDdlMeta('portraits', PortraitsMetaSchema);
}

export function loadItems(): ItemEntry[] {
  return loadDdlDirectory('items', ItemEntrySchema);
}

export function loadUIElements(): UIElementEntry[] {
  return loadDdlDirectory('ui-elements', UIElementEntrySchema);
}

export function loadUIElementsMeta(): UIElementsMeta {
  return loadDdlMeta('ui-elements', UIElementsMetaSchema);
}

export function loadSfxEntries(): SfxEntry[] {
  return loadDdlDirectory('audio-sfx', SfxEntrySchema);
}

export function loadBgmEntries(): BgmEntry[] {
  return loadDdlDirectory('audio-bgm', BgmEntrySchema);
}

export function loadBgmMeta(): BgmMeta {
  return loadDdlMeta('audio-bgm', BgmMetaSchema);
}

export function loadAmbientEntries(): AmbientEntry[] {
  return loadDdlDirectory('audio-ambient', AmbientEntrySchema);
}

export function loadMaps(): MapDdl[] {
  return loadDdlDirectory('maps', MapDdlSchema);
}

export {
  loadArmorStats,
  loadClassStats,
  loadConsumablesStats,
  loadDialogueEntries,
  loadEnemiesStats,
  loadQuests,
  loadSceneEvents,
  loadSkillsStats,
  loadStatusEffects,
  loadWeaponsStats,
} from './ddl-loader-code';
