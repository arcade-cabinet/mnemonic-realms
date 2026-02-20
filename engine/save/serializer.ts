/**
 * Mnemonic Realms — Save Serializer (Pure Functions)
 *
 * Creates, serializes, and deserializes SaveData objects.
 * No side effects — works with plain JSON-serializable data.
 */

import type { QuestState, SaveData } from './types.js';

// ── Constants ───────────────────────────────────────────────────────────────

/** Current save format version. Bump when the SaveData shape changes. */
export const SAVE_VERSION = 1;

// ── Params type for createSaveData ──────────────────────────────────────────

export interface CreateSaveDataParams {
  position: { mapId: string; x: number; y: number };
  stats: { hp: number; maxHp: number; level: number; xp: number; className: string };
  inventory: {
    items: Record<string, number>;
    equipment: { weapon: string | null; armor: string | null; accessory: string | null };
    gold: number;
  };
  quests: Record<string, QuestState>;
  questFlags: Record<string, boolean>;
  vibrancy: Record<string, string>;
  stones: string[];
  playTime: number;
}

// ── Pure Functions ──────────────────────────────────────────────────────────

/** Assemble a SaveData object from extracted game state. */
export function createSaveData(params: CreateSaveDataParams): SaveData {
  return {
    version: SAVE_VERSION,
    timestamp: Date.now(),
    playerPosition: { ...params.position },
    playerStats: { ...params.stats },
    inventory: {
      items: { ...params.inventory.items },
      equipment: { ...params.inventory.equipment },
      gold: params.inventory.gold,
    },
    quests: { ...params.quests },
    questFlags: { ...params.questFlags },
    vibrancy: { ...params.vibrancy },
    discoveredStones: [...params.stones],
    playTime: params.playTime,
  };
}

/** Serialize SaveData to a JSON string. */
export function serializeSave(data: SaveData): string {
  return JSON.stringify(data);
}

/**
 * Deserialize a JSON string to SaveData.
 * Returns null if the string is not valid JSON or missing required fields.
 */
export function deserializeSave(json: string): SaveData | null {
  try {
    const parsed = JSON.parse(json);

    // Basic structural validation — must have version and core fields
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof parsed.version !== 'number' ||
      typeof parsed.timestamp !== 'number' ||
      !parsed.playerPosition ||
      !parsed.playerStats ||
      !parsed.inventory ||
      !parsed.quests ||
      !parsed.questFlags ||
      !parsed.vibrancy ||
      !Array.isArray(parsed.discoveredStones) ||
      typeof parsed.playTime !== 'number'
    ) {
      return null;
    }

    // Migrate if needed
    return migrateSave(parsed as SaveData);
  } catch {
    return null;
  }
}

/**
 * Migrate a save from an older version to the current version.
 * Currently a no-op since we're at version 1.
 * Add migration steps here as the format evolves.
 */
export function migrateSave(data: SaveData): SaveData {
  const migrated = { ...data };

  // Future migration example:
  // if (migrated.version < 2) {
  //   migrated = { ...migrated, newField: defaultValue, version: 2 };
  // }

  // Ensure version is current
  migrated.version = SAVE_VERSION;

  return migrated;
}
