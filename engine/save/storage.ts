/**
 * Mnemonic Realms — Storage Adapter
 *
 * Thin wrapper around localStorage (web) for save/load persistence.
 * This is the ONLY impure code in the save subpackage.
 *
 * SSR-safe: all operations check for `window` before accessing localStorage.
 */

const SAVE_KEY_PREFIX = 'mnemonic-realms:save:';

/** Check if localStorage is available (SSR safety). */
function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/** Persist a serialized save string to disk (localStorage on web). */
export async function saveToDisk(key: string, data: string): Promise<void> {
  if (!hasStorage()) return;
  window.localStorage.setItem(`${SAVE_KEY_PREFIX}${key}`, data);
}

/** Load a serialized save string from disk. Returns null if not found. */
export async function loadFromDisk(key: string): Promise<string | null> {
  if (!hasStorage()) return null;
  return window.localStorage.getItem(`${SAVE_KEY_PREFIX}${key}`);
}

/** Delete a save slot. */
export async function deleteSave(key: string): Promise<void> {
  if (!hasStorage()) return;
  window.localStorage.removeItem(`${SAVE_KEY_PREFIX}${key}`);
}

/** List all save slot keys (without prefix). */
export async function listSaves(): Promise<string[]> {
  if (!hasStorage()) return [];

  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const fullKey = window.localStorage.key(i);
    if (fullKey?.startsWith(SAVE_KEY_PREFIX)) {
      keys.push(fullKey.slice(SAVE_KEY_PREFIX.length));
    }
  }
  return keys.sort();
}
