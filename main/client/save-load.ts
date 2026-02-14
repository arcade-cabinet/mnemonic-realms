import type { SaveData, SaveSlotId, SaveSlotMeta } from '../server/systems/save-load';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_PREFIX = 'mnemonic-realms-save-';
const META_KEY = 'mnemonic-realms-save-meta';

// ---------------------------------------------------------------------------
// localStorage Persistence
// ---------------------------------------------------------------------------

function slotKey(slotId: SaveSlotId): string {
  return `${STORAGE_PREFIX}${slotId}`;
}

/**
 * Write save data to a localStorage slot.
 */
export function writeSave(slotId: SaveSlotId, data: SaveData, meta: SaveSlotMeta): void {
  try {
    localStorage.setItem(slotKey(slotId), JSON.stringify(data));

    // Update the meta index (used by title screen to show slot summaries)
    const allMeta = readAllMeta();
    allMeta[slotId] = meta;
    localStorage.setItem(META_KEY, JSON.stringify(allMeta));
  } catch {
    // localStorage may be full or unavailable
    console.warn(`[save-load] Failed to write save to slot "${slotId}"`);
  }
}

/**
 * Read save data from a localStorage slot.
 * Returns null if the slot is empty or the data is corrupted.
 */
export function readSave(slotId: SaveSlotId): SaveData | null {
  try {
    const raw = localStorage.getItem(slotKey(slotId));
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    console.warn(`[save-load] Failed to read save from slot "${slotId}"`);
    return null;
  }
}

/**
 * Delete a save slot.
 */
export function deleteSave(slotId: SaveSlotId): void {
  try {
    localStorage.removeItem(slotKey(slotId));
    const allMeta = readAllMeta();
    delete allMeta[slotId];
    localStorage.setItem(META_KEY, JSON.stringify(allMeta));
  } catch {
    // Ignore
  }
}

/**
 * Read metadata for all save slots.
 * Returns a partial record — only populated slots have entries.
 */
export function readAllMeta(): Partial<Record<SaveSlotId, SaveSlotMeta>> {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<Record<SaveSlotId, SaveSlotMeta>>;
  } catch {
    return {};
  }
}

/**
 * Check whether any save slot has data (for "Continue" button on title screen).
 */
export function hasAnySave(): boolean {
  const meta = readAllMeta();
  return Object.keys(meta).length > 0;
}

/**
 * Get the most recent save slot (for "Continue" quick-load).
 * Returns null if no saves exist.
 */
export function getMostRecentSlot(): SaveSlotId | null {
  const meta = readAllMeta();
  let newest: SaveSlotMeta | null = null;
  for (const m of Object.values(meta)) {
    if (m && (!newest || m.timestamp > newest.timestamp)) {
      newest = m;
    }
  }
  return newest?.slotId ?? null;
}
