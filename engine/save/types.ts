/**
 * Mnemonic Realms — Save Data Types
 *
 * Plain JSON-serializable types for the save/load system.
 * No Maps, Sets, or class instances — everything is a plain object.
 */

// ── Quest State ─────────────────────────────────────────────────────────────

/** Objective completion tracking within a quest. */
export interface QuestObjectiveState {
  index: number;
  completed: boolean;
}

/** Lifecycle status of a quest. */
export type QuestStatus = 'not-started' | 'active' | 'completed' | 'failed';

/** Runtime state of a single quest. */
export interface QuestState {
  questId: string;
  status: QuestStatus;
  objectives: QuestObjectiveState[];
}

// ── Save Data ───────────────────────────────────────────────────────────────

/** Complete save file structure — plain JSON-serializable. */
export interface SaveData {
  /** Save format version for migration. */
  version: number;
  /** Unix timestamp (ms) when the save was created. */
  timestamp: number;
  /** Player's map position at time of save. */
  playerPosition: {
    mapId: string;
    x: number;
    y: number;
  };
  /** Player stats snapshot. */
  playerStats: {
    hp: number;
    maxHp: number;
    level: number;
    xp: number;
    className: string;
  };
  /** Inventory snapshot. */
  inventory: {
    items: Record<string, number>;
    equipment: {
      weapon: string | null;
      armor: string | null;
      accessory: string | null;
    };
    gold: number;
  };
  /** Quest tracker state keyed by questId. */
  quests: Record<string, QuestState>;
  /** Global quest flags (quest completions, story triggers). */
  questFlags: Record<string, boolean>;
  /** Vibrancy area states: areaId → VibrancyState string. */
  vibrancy: Record<string, string>;
  /** IDs of discovered Resonance Stones. */
  discoveredStones: string[];
  /** Total play time in seconds. */
  playTime: number;
}
