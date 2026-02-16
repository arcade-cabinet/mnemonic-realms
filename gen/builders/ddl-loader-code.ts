/** Code-gen DDL loaders — uses directory-based recomposable pattern. */

import type {
  ArmorStatsDdl,
  ClassStatsDdl,
  ConsumableStatsDdl,
  DialogueEntryDdl,
  EnemyStatsDdl,
  QuestDdl,
  SceneEventDdl,
  SkillStatsDdl,
  StatusEffectDdl,
  WeaponStatsDdl,
} from '../schemas/codegen-ddl';
import {
  ArmorStatsDdlSchema,
  ClassStatsDdlSchema,
  ConsumableStatsDdlSchema,
  DialogueEntryDdlSchema,
  EnemyStatsDdlSchema,
  QuestDdlSchema,
  SceneEventDdlSchema,
  SkillStatsDdlSchema,
  StatusEffectDdlSchema,
  WeaponStatsDdlSchema,
} from '../schemas/codegen-ddl';
import { loadDdlDirectory } from './ddl-directory';

export function loadWeaponsStats(): WeaponStatsDdl[] {
  return loadDdlDirectory('weapons', WeaponStatsDdlSchema);
}

export function loadArmorStats(): ArmorStatsDdl[] {
  return loadDdlDirectory('armor', ArmorStatsDdlSchema);
}

export function loadConsumablesStats(): ConsumableStatsDdl[] {
  return loadDdlDirectory('consumables', ConsumableStatsDdlSchema);
}

export function loadSkillsStats(): SkillStatsDdl[] {
  return loadDdlDirectory('skills', SkillStatsDdlSchema);
}

export function loadEnemiesStats(): EnemyStatsDdl[] {
  return loadDdlDirectory('enemies', EnemyStatsDdlSchema);
}

export function loadClassStats(): ClassStatsDdl[] {
  return loadDdlDirectory('classes', ClassStatsDdlSchema);
}

export function loadStatusEffects(): StatusEffectDdl[] {
  return loadDdlDirectory('status-effects', StatusEffectDdlSchema);
}

export function loadSceneEvents(): SceneEventDdl[] {
  return loadDdlDirectory('scenes', SceneEventDdlSchema);
}

export function loadQuests(): QuestDdl[] {
  return loadDdlDirectory('quests', QuestDdlSchema);
}

export function loadDialogueEntries(): DialogueEntryDdl[] {
  return loadDdlDirectory('dialogue', DialogueEntryDdlSchema);
}
