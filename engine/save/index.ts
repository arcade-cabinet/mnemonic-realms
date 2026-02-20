/**
 * Mnemonic Realms — Save System (barrel exports)
 *
 * Pure quest tracking + JSON serialization + localStorage adapter.
 */

// Quest tracker (pure functions)
export {
  advanceObjective,
  checkQuestAvailability,
  completeQuest,
  createQuestTracker,
  failQuest,
  getActiveQuests,
  getCompletedQuests,
  getQuestStatus,
  startQuest,
} from './quest-tracker.js';
// Types
export type { CreateSaveDataParams } from './serializer.js';
// Serializer (pure functions)
export {
  createSaveData,
  deserializeSave,
  migrateSave,
  SAVE_VERSION,
  serializeSave,
} from './serializer.js';
// Storage adapter (impure — localStorage)
export { deleteSave, listSaves, loadFromDisk, saveToDisk } from './storage.js';
export type { QuestObjectiveState, QuestState, QuestStatus, SaveData } from './types.js';
