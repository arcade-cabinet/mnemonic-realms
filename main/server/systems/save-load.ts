import type { RpgPlayer } from '@rpgjs/server';
import { VIBRANCY_ZONES } from './vibrancy';

// ---------------------------------------------------------------------------
// Save Format
// ---------------------------------------------------------------------------

const SAVE_VERSION = 1;

export interface SaveSlotMeta {
  slotId: string;
  version: number;
  timestamp: number;
  mapId: string;
  level: number;
  playTimeMs: number;
  classId: string;
}

export interface SaveData {
  version: number;
  timestamp: number;

  // Position
  mapId: string;
  positionX: number;
  positionY: number;

  // Class & Progression
  classId: string;
  level: number;
  xp: number;
  hp: number;
  sp: number;

  // Stats (derived from class growth + level, but saved for quick restore)
  stats: {
    hp: number;
    sp: number;
    atk: number;
    int: number;
    def: number;
    agi: number;
  };

  // Inventory & Equipment
  inventory: Record<string, number>;
  equipment: { weapon: string | null; armor: string | null; accessory: string | null };
  equipBonuses: { atk: number; def: number; int: number };
  gold: number;

  // Memory system
  memoryFragments: string[];

  // Vibrancy values per zone
  vibrancy: Record<string, number>;

  // All remaining player variables (quest progress, event flags, etc.)
  variables: Record<string, unknown>;

  // Play-time tracking
  playTimeMs: number;
}

// Slot IDs
export const SAVE_SLOTS = ['slot-1', 'slot-2', 'slot-3', 'auto'] as const;
export type SaveSlotId = (typeof SAVE_SLOTS)[number];

// localStorage keys (shared convention with client module)
const STORAGE_PREFIX = 'mnemonic-realms-save-';
const META_KEY = 'mnemonic-realms-save-meta';

// Variable keys managed by known systems (excluded from generic variables capture).
// PLAYER_CLASS_ID is covered by SYSTEM_VAR_PREFIXES ('PLAYER_'), listed here for clarity.
const SYSTEM_VAR_PREFIXES = ['PLAYER_', 'VIBRANCY_', 'ACTIVE_QUEST_'];
const SYSTEM_VAR_EXACT = [
  'INVENTORY',
  'EQUIPMENT',
  'GOLD',
  'EQUIP_BONUSES',
  'MEMORY_FRAGMENTS',
  'CHOSEN_GRAPHIC',
  'SEED',
  'PLAY_TIME_MS',
];

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

type VarMap = Map<string, unknown>;

function getAllVarsMap(player: RpgPlayer): VarMap {
  // RPG-JS 4.3.0 stores player variables in a Map<string, any>.
  // The typed API only exposes get/setVariable; bulk access requires a cast.
  return (player as unknown as { variables: VarMap }).variables ?? new Map();
}

function getPlayerMapId(player: RpgPlayer): string {
  return (player as unknown as { map: string }).map ?? '';
}

function extractVibrancy(vars: VarMap): Record<string, number> {
  const vibrancy: Record<string, number> = {};
  for (const zone of VIBRANCY_ZONES) {
    vibrancy[zone] = (vars.get(`VIBRANCY_${zone}`) as number) ?? 0;
  }
  return vibrancy;
}

function extractGenericVars(vars: VarMap): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of vars) {
    if (SYSTEM_VAR_EXACT.includes(key)) continue;
    if (SYSTEM_VAR_PREFIXES.some((p) => key.startsWith(p))) continue;
    result[key] = value;
  }
  return result;
}

function extractStats(vars: VarMap): SaveData['stats'] {
  return {
    hp: (vars.get('PLAYER_HP') as number) ?? 0,
    sp: (vars.get('PLAYER_SP') as number) ?? 0,
    atk: (vars.get('PLAYER_ATK') as number) ?? 0,
    int: (vars.get('PLAYER_INT') as number) ?? 0,
    def: (vars.get('PLAYER_DEF') as number) ?? 0,
    agi: (vars.get('PLAYER_AGI') as number) ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Serialize
// ---------------------------------------------------------------------------

export function serializePlayer(player: RpgPlayer): SaveData {
  const vars = getAllVarsMap(player);

  return {
    version: SAVE_VERSION,
    timestamp: Date.now(),
    mapId: getPlayerMapId(player),
    positionX: player.position?.x ?? 0,
    positionY: player.position?.y ?? 0,
    classId: player.class?.id ?? '',
    level: (vars.get('PLAYER_LEVEL') as number) ?? 1,
    xp: (vars.get('PLAYER_XP') as number) ?? 0,
    hp: player.hp ?? 0,
    sp: player.sp ?? 0,
    stats: extractStats(vars),
    inventory: { ...((vars.get('INVENTORY') as Record<string, number>) ?? {}) },
    equipment: (vars.get('EQUIPMENT') as SaveData['equipment']) ?? {
      weapon: null,
      armor: null,
      accessory: null,
    },
    equipBonuses: (vars.get('EQUIP_BONUSES') as SaveData['equipBonuses']) ?? {
      atk: 0,
      def: 0,
      int: 0,
    },
    gold: (vars.get('GOLD') as number) ?? 0,
    memoryFragments: [...((vars.get('MEMORY_FRAGMENTS') as string[]) ?? [])],
    vibrancy: extractVibrancy(vars),
    variables: extractGenericVars(vars),
    playTimeMs: (vars.get('PLAY_TIME_MS') as number) ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Deserialize
// ---------------------------------------------------------------------------

export async function deserializePlayer(player: RpgPlayer, data: SaveData): Promise<void> {
  // Defensive: validate that data has the expected shape before accessing
  if (!data || typeof data !== 'object' || typeof data.version !== 'number') {
    console.warn('[save-load] Invalid or corrupted save data, skipping load');
    return;
  }

  // Restore class
  if (data.classId) {
    try {
      player.setClass(data.classId);
    } catch {
      // Class may not be registered yet
    }
    // Restore the class ID variable that the progression system reads from
    player.setVariable('PLAYER_CLASS_ID', data.classId);
  }

  // Restore progression variables
  player.setVariable('PLAYER_LEVEL', data.level);
  player.setVariable('PLAYER_XP', data.xp);
  player.setVariable('PLAYER_HP', data.stats.hp);
  player.setVariable('PLAYER_SP', data.stats.sp);
  player.setVariable('PLAYER_ATK', data.stats.atk);
  player.setVariable('PLAYER_INT', data.stats.int);
  player.setVariable('PLAYER_DEF', data.stats.def);
  player.setVariable('PLAYER_AGI', data.stats.agi);

  // Restore inventory & equipment
  player.setVariable('INVENTORY', data.inventory);
  player.setVariable('EQUIPMENT', data.equipment);
  player.setVariable('EQUIP_BONUSES', data.equipBonuses);
  player.setVariable('GOLD', data.gold);

  // Restore memory fragments
  player.setVariable('MEMORY_FRAGMENTS', data.memoryFragments);

  // Restore vibrancy per zone
  for (const [zone, value] of Object.entries(data.vibrancy ?? {})) {
    player.setVariable(`VIBRANCY_${zone}`, value);
  }

  // Restore generic variables (quests, event flags, etc.)
  for (const [key, value] of Object.entries(data.variables ?? {})) {
    player.setVariable(key, value);
  }

  // Restore play-time
  player.setVariable('PLAY_TIME_MS', data.playTimeMs);

  // Restore sprite graphic from class
  const SPRITE_MAP: Record<string, string> = {
    knight: 'sprite-player-knight',
    mage: 'sprite-player-mage',
    rogue: 'sprite-player-rogue',
    cleric: 'sprite-player-cleric',
  };
  const graphic = SPRITE_MAP[data.classId] ?? 'sprite-player-knight';
  player.setVariable('CHOSEN_GRAPHIC', graphic);

  // Move player to saved map and position
  if (data.mapId) {
    await player.changeMap(data.mapId, { x: data.positionX, y: data.positionY });
  }

  // Restore HP/SP after map change (changeMap may reset them)
  player.hp = Math.min(data.hp, player.param.maxHp || data.hp);
  player.sp = Math.min(data.sp, player.param.maxSp || data.sp);
}

// ---------------------------------------------------------------------------
// Save / Load — Direct localStorage (standalone mode runs in-browser)
// ---------------------------------------------------------------------------

/**
 * Serialize the player state and persist to a localStorage slot.
 * Works because RPG-JS standalone runs entirely in the browser.
 */
export function saveGame(player: RpgPlayer, slotId: SaveSlotId): void {
  if (typeof localStorage === 'undefined') return;

  const data = serializePlayer(player);
  const meta: SaveSlotMeta = {
    slotId,
    version: data.version,
    timestamp: data.timestamp,
    mapId: data.mapId,
    level: data.level,
    playTimeMs: data.playTimeMs,
    classId: data.classId,
  };

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${slotId}`, JSON.stringify(data));

    // Update meta index
    const rawMeta = localStorage.getItem(META_KEY);
    const allMeta: Record<string, SaveSlotMeta> = rawMeta ? JSON.parse(rawMeta) : {};
    allMeta[slotId] = meta;
    localStorage.setItem(META_KEY, JSON.stringify(allMeta));
  } catch {
    // localStorage may be full or unavailable
  }
}

/**
 * Read save data from a localStorage slot and restore the player state.
 * Returns true if a save was found and loaded, false otherwise.
 */
export async function loadGame(player: RpgPlayer, slotId: SaveSlotId): Promise<boolean> {
  if (typeof localStorage === 'undefined') return false;

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${slotId}`);
    if (!raw) return false;

    const data: unknown = JSON.parse(raw);

    // Basic structural validation before casting
    if (!data || typeof data !== 'object' || !('version' in data)) {
      console.warn(`[save-load] Corrupted save in slot "${slotId}", ignoring`);
      return false;
    }

    await deserializePlayer(player, data as SaveData);
    return true;
  } catch {
    return false;
  }
}

/**
 * Trigger auto-save. Called on map transitions.
 */
export function autoSave(player: RpgPlayer): void {
  // Skip auto-save if the player hasn't chosen a class yet (still on title screen)
  if (!player.class?.id) return;
  saveGame(player, 'auto');
}
