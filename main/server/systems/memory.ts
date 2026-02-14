import type { RpgPlayer } from '@rpgjs/server';
import { increaseVibrancy, type VibrancyZone } from './vibrancy';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Emotion = 'joy' | 'fury' | 'sorrow' | 'awe' | 'calm';

export type Zone =
  | 'village-hub'
  | 'heartfield'
  | 'ambergrove'
  | 'millbrook'
  | 'sunridge'
  | 'shimmer-marsh'
  | 'flickerveil'
  | 'hollow-ridge'
  | 'resonance-fields'
  | 'luminous-wastes'
  | 'half-drawn-forest'
  | 'undrawn-peaks'
  | 'depths'
  | 'fortress';

export interface MemoryFragment {
  id: string;
  name: string;
  category: 'exploration' | 'npc' | 'combat' | 'quest' | 'dissolved';
  emotion: Emotion;
  zone: Zone;
  potency: number; // 1-5
}

// Player variable key for stored fragment IDs
const COLLECTED_KEY = 'MEMORY_FRAGMENTS';

// ---------------------------------------------------------------------------
// Fragment Definitions (48 fragments across all zones and emotions)
// ---------------------------------------------------------------------------

export const MEMORY_FRAGMENTS: readonly MemoryFragment[] = [
  // --- Village Hub (6) ---
  {
    id: 'frag-vh-01',
    name: 'Wildflower Offering',
    category: 'exploration',
    emotion: 'joy',
    zone: 'village-hub',
    potency: 1,
  },
  {
    id: 'frag-vh-02',
    name: 'Rainy Vigil',
    category: 'exploration',
    emotion: 'calm',
    zone: 'village-hub',
    potency: 1,
  },
  {
    id: 'frag-vh-03',
    name: 'Communal Song',
    category: 'exploration',
    emotion: 'awe',
    zone: 'village-hub',
    potency: 2,
  },
  {
    id: 'frag-vh-04',
    name: "Callum's First Memory",
    category: 'npc',
    emotion: 'joy',
    zone: 'village-hub',
    potency: 2,
  },
  {
    id: 'frag-vh-05',
    name: "Lira's Spark",
    category: 'npc',
    emotion: 'fury',
    zone: 'village-hub',
    potency: 2,
  },
  {
    id: 'frag-vh-06',
    name: "Elder Torin's Regret",
    category: 'npc',
    emotion: 'sorrow',
    zone: 'village-hub',
    potency: 2,
  },

  // --- Heartfield (5) ---
  {
    id: 'frag-hf-01',
    name: 'Meadow Lullaby',
    category: 'exploration',
    emotion: 'calm',
    zone: 'heartfield',
    potency: 1,
  },
  {
    id: 'frag-hf-02',
    name: 'Harvest Dance',
    category: 'exploration',
    emotion: 'joy',
    zone: 'heartfield',
    potency: 1,
  },
  {
    id: 'frag-hf-03',
    name: 'Meadow Sprite Echo',
    category: 'combat',
    emotion: 'awe',
    zone: 'heartfield',
    potency: 2,
  },
  {
    id: 'frag-hf-04',
    name: "Farmer's Lost Hope",
    category: 'npc',
    emotion: 'sorrow',
    zone: 'heartfield',
    potency: 2,
  },
  {
    id: 'frag-hf-05',
    name: 'Serpent Fury',
    category: 'combat',
    emotion: 'fury',
    zone: 'heartfield',
    potency: 2,
  },

  // --- Ambergrove (5) ---
  {
    id: 'frag-ag-01',
    name: 'Ancient Root Song',
    category: 'exploration',
    emotion: 'awe',
    zone: 'ambergrove',
    potency: 2,
  },
  {
    id: 'frag-ag-02',
    name: 'Forest Wisp Glow',
    category: 'combat',
    emotion: 'calm',
    zone: 'ambergrove',
    potency: 2,
  },
  {
    id: 'frag-ag-03',
    name: 'Burning Canopy',
    category: 'exploration',
    emotion: 'fury',
    zone: 'ambergrove',
    potency: 2,
  },
  {
    id: 'frag-ag-04',
    name: 'Amber Tear',
    category: 'npc',
    emotion: 'sorrow',
    zone: 'ambergrove',
    potency: 2,
  },
  {
    id: 'frag-ag-05',
    name: 'First Bloom',
    category: 'quest',
    emotion: 'joy',
    zone: 'ambergrove',
    potency: 3,
  },

  // --- Millbrook (4) ---
  {
    id: 'frag-mb-01',
    name: 'Mill Wheel Rhythm',
    category: 'exploration',
    emotion: 'calm',
    zone: 'millbrook',
    potency: 2,
  },
  {
    id: 'frag-mb-02',
    name: 'Bridge Laughter',
    category: 'exploration',
    emotion: 'joy',
    zone: 'millbrook',
    potency: 2,
  },
  {
    id: 'frag-mb-03',
    name: 'River Nymph Wrath',
    category: 'combat',
    emotion: 'fury',
    zone: 'millbrook',
    potency: 2,
  },
  {
    id: 'frag-mb-04',
    name: 'Drowned Letter',
    category: 'npc',
    emotion: 'sorrow',
    zone: 'millbrook',
    potency: 2,
  },

  // --- Sunridge (4) ---
  {
    id: 'frag-sr-01',
    name: 'Sunrise Panorama',
    category: 'exploration',
    emotion: 'awe',
    zone: 'sunridge',
    potency: 2,
  },
  {
    id: 'frag-sr-02',
    name: 'Highland Hawk Screech',
    category: 'combat',
    emotion: 'fury',
    zone: 'sunridge',
    potency: 2,
  },
  {
    id: 'frag-sr-03',
    name: "Ridgewalker's Tale",
    category: 'npc',
    emotion: 'joy',
    zone: 'sunridge',
    potency: 2,
  },
  {
    id: 'frag-sr-04',
    name: 'Lonely Summit',
    category: 'exploration',
    emotion: 'sorrow',
    zone: 'sunridge',
    potency: 2,
  },

  // --- Shimmer Marsh (3) ---
  {
    id: 'frag-sm-01',
    name: 'Marsh Lights',
    category: 'exploration',
    emotion: 'awe',
    zone: 'shimmer-marsh',
    potency: 2,
  },
  {
    id: 'frag-sm-02',
    name: 'Sunken Shrine',
    category: 'exploration',
    emotion: 'sorrow',
    zone: 'shimmer-marsh',
    potency: 3,
  },
  {
    id: 'frag-sm-03',
    name: "Hermit's Wisdom",
    category: 'npc',
    emotion: 'calm',
    zone: 'shimmer-marsh',
    potency: 3,
  },

  // --- Flickerveil (3) ---
  {
    id: 'frag-fv-01',
    name: 'Flickering Boundary',
    category: 'exploration',
    emotion: 'awe',
    zone: 'flickerveil',
    potency: 3,
  },
  {
    id: 'frag-fv-02',
    name: 'Veil Warden Rage',
    category: 'combat',
    emotion: 'fury',
    zone: 'flickerveil',
    potency: 3,
  },
  {
    id: 'frag-fv-03',
    name: "Scout's Sacrifice",
    category: 'npc',
    emotion: 'sorrow',
    zone: 'flickerveil',
    potency: 3,
  },

  // --- Hollow Ridge (3) ---
  {
    id: 'frag-hr-01',
    name: 'Echo Chamber',
    category: 'exploration',
    emotion: 'calm',
    zone: 'hollow-ridge',
    potency: 3,
  },
  {
    id: 'frag-hr-02',
    name: 'Golem Triumph',
    category: 'combat',
    emotion: 'joy',
    zone: 'hollow-ridge',
    potency: 3,
  },
  {
    id: 'frag-hr-03',
    name: 'Collapsed Pass',
    category: 'exploration',
    emotion: 'fury',
    zone: 'hollow-ridge',
    potency: 3,
  },

  // --- Resonance Fields (3) ---
  {
    id: 'frag-rf-01',
    name: 'Resonance Harmonic',
    category: 'exploration',
    emotion: 'awe',
    zone: 'resonance-fields',
    potency: 3,
  },
  {
    id: 'frag-rf-02',
    name: 'God-Song Echo',
    category: 'quest',
    emotion: 'joy',
    zone: 'resonance-fields',
    potency: 4,
  },
  {
    id: 'frag-rf-03',
    name: 'Dissonant Cry',
    category: 'combat',
    emotion: 'sorrow',
    zone: 'resonance-fields',
    potency: 3,
  },

  // --- Luminous Wastes (2) ---
  {
    id: 'frag-lw-01',
    name: 'Blinding Revelation',
    category: 'exploration',
    emotion: 'awe',
    zone: 'luminous-wastes',
    potency: 4,
  },
  {
    id: 'frag-lw-02',
    name: 'Scorched Joy',
    category: 'quest',
    emotion: 'joy',
    zone: 'luminous-wastes',
    potency: 4,
  },

  // --- Half-Drawn Forest (2) ---
  {
    id: 'frag-hd-01',
    name: 'Unfinished Melody',
    category: 'exploration',
    emotion: 'sorrow',
    zone: 'half-drawn-forest',
    potency: 3,
  },
  {
    id: 'frag-hd-02',
    name: 'Sketch-Born Wonder',
    category: 'exploration',
    emotion: 'awe',
    zone: 'half-drawn-forest',
    potency: 4,
  },

  // --- Undrawn Peaks (2) ---
  {
    id: 'frag-up-01',
    name: 'Summit of Possibility',
    category: 'exploration',
    emotion: 'joy',
    zone: 'undrawn-peaks',
    potency: 4,
  },
  {
    id: 'frag-up-02',
    name: 'Void Gale',
    category: 'exploration',
    emotion: 'fury',
    zone: 'undrawn-peaks',
    potency: 4,
  },

  // --- The Depths (4) ---
  {
    id: 'frag-dp-01',
    name: 'Dissolved Civilization',
    category: 'dissolved',
    emotion: 'sorrow',
    zone: 'depths',
    potency: 3,
  },
  {
    id: 'frag-dp-02',
    name: 'Deepest Joy',
    category: 'dissolved',
    emotion: 'joy',
    zone: 'depths',
    potency: 4,
  },
  {
    id: 'frag-dp-03',
    name: 'Primordial Fury',
    category: 'dissolved',
    emotion: 'fury',
    zone: 'depths',
    potency: 4,
  },
  {
    id: 'frag-dp-04',
    name: 'The Songline',
    category: 'dissolved',
    emotion: 'awe',
    zone: 'depths',
    potency: 5,
  },

  // --- Fortress (2) ---
  {
    id: 'frag-ft-01',
    name: 'Frozen Moment',
    category: 'quest',
    emotion: 'calm',
    zone: 'fortress',
    potency: 4,
  },
  {
    id: 'frag-ft-02',
    name: 'The First Memory',
    category: 'quest',
    emotion: 'awe',
    zone: 'fortress',
    potency: 5,
  },
] as const;

// Lookup map for O(1) access by ID
const fragmentById = new Map<string, MemoryFragment>(MEMORY_FRAGMENTS.map((f) => [f.id, f]));

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Look up a fragment definition by ID.
 * Returns undefined if the fragment ID is not in the registry.
 */
export function getFragmentDef(fragmentId: string): MemoryFragment | undefined {
  return fragmentById.get(fragmentId);
}

/**
 * Collect a memory fragment for the player.
 * Stores the fragment ID in the player's MEMORY_FRAGMENTS variable and
 * emits a 'memory-fragment-collected' event on the player for UI notification.
 *
 * Returns `true` if the fragment was newly collected, `false` if already owned
 * or the fragment ID is unknown.
 */
export function collectFragment(player: RpgPlayer, fragmentId: string): boolean {
  const def = fragmentById.get(fragmentId);
  if (!def) return false;

  const collected = getCollectedIds(player);
  if (collected.includes(fragmentId)) return false;

  collected.push(fragmentId);
  player.setVariable(COLLECTED_KEY, collected);

  // Emit event for UI notification (client-side GUI can listen for this)
  player.emit('memory-fragment-collected', {
    fragment: def,
    totalCount: collected.length,
  });

  return true;
}

/**
 * Return all collected fragment definitions for this player.
 */
export function getCollectedFragments(player: RpgPlayer): MemoryFragment[] {
  return getCollectedIds(player)
    .map((id) => fragmentById.get(id))
    .filter((f): f is MemoryFragment => f !== undefined);
}

/**
 * Check whether the player has already collected a specific fragment.
 */
export function hasFragment(player: RpgPlayer, fragmentId: string): boolean {
  return getCollectedIds(player).includes(fragmentId);
}

/**
 * Return the total number of fragments the player has collected.
 */
export function getFragmentCount(player: RpgPlayer): number {
  return getCollectedIds(player).length;
}

/**
 * Return collected fragment IDs filtered by emotion.
 */
export function getFragmentsByEmotion(player: RpgPlayer, emotion: Emotion): MemoryFragment[] {
  return getCollectedFragments(player).filter((f) => f.emotion === emotion);
}

/**
 * Return collected fragment IDs filtered by zone.
 */
export function getFragmentsByZone(player: RpgPlayer, zone: Zone): MemoryFragment[] {
  return getCollectedFragments(player).filter((f) => f.zone === zone);
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function getCollectedIds(player: RpgPlayer): string[] {
  return (player.getVariable(COLLECTED_KEY) as string[] | undefined) ?? [];
}

// ---------------------------------------------------------------------------
// God Recall System
// ---------------------------------------------------------------------------

export type GodId = 'resonance' | 'verdance' | 'luminos' | 'kinesis';
export type RecallEmotion = 'joy' | 'fury' | 'sorrow' | 'awe';
export type SubclassBranch = 'luminary' | 'crucible';

export interface RecallResult {
  success: boolean;
  error?: string;
  godName?: string;
  abilityName?: string;
  subclassBranch?: SubclassBranch;
  vibrancyGain?: number;
}

export interface GodRecallState {
  godId: GodId;
  emotion: RecallEmotion;
  godName: string;
  abilityName: string;
}

const GODS: readonly GodId[] = ['resonance', 'verdance', 'luminos', 'kinesis'];
const RECALL_EMOTIONS: readonly RecallEmotion[] = ['joy', 'fury', 'sorrow', 'awe'];

/** Player variable keys for the recall system. */
const RECALL_PREFIX = 'RECALL_';
const RECALL_ORDER_KEY = 'RECALL_ORDER';
const SUBCLASS_BRANCH_KEY = 'SUBCLASS_BRANCH';

/** Map each god to the vibrancy zone affected by recall. */
const GOD_ZONE: Record<GodId, VibrancyZone> = {
  resonance: 'resonance-fields',
  verdance: 'shimmer-marsh',
  luminos: 'flickerveil',
  kinesis: 'hollow-ridge',
};

/** Base vibrancy increase from any recall (per docs/world/dormant-gods.md). */
const RECALL_VIBRANCY_BASE = 15;

/**
 * 16 recalled god names — one per god+emotion combination.
 * Source: docs/world/dormant-gods.md summary table.
 */
const RECALLED_GOD_NAMES: Record<GodId, Record<RecallEmotion, string>> = {
  resonance: {
    joy: 'Cantara, God of the Living Song',
    fury: 'Tempestus, God of the Thundersong',
    sorrow: 'Tacet, God of the Necessary Silence',
    awe: 'Harmonia, God of the Perfect Chord',
  },
  verdance: {
    joy: 'Floriana, God of the Endless Bloom',
    fury: 'Thornweald, God of the Wild Overgrowth',
    sorrow: 'Autumnus, God of the Falling Leaf',
    awe: 'Sylvanos, God of the Deep Root',
  },
  luminos: {
    joy: 'Solara, God of the Golden Dawn',
    fury: 'Pyralis, God of the Searing Truth',
    sorrow: 'Vesperis, God of the Twilight',
    awe: 'Prisma, God of the Living Spectrum',
  },
  kinesis: {
    joy: 'Jubila, God of the Joyful Stride',
    fury: 'Tecton, God of the Avalanche',
    sorrow: 'Errantis, God of the Fading Footprint',
    awe: 'Vortis, God of the Eternal Momentum',
  },
};

/**
 * 16 subclass abilities — the player buff unlocked by each god+emotion combo.
 * Source: docs/world/dormant-gods.md player buff names.
 */
const SUBCLASS_ABILITIES: Record<GodId, Record<RecallEmotion, string>> = {
  resonance: {
    joy: 'Song of the Heart',
    fury: 'Thunderstrike',
    sorrow: 'Veil of Silence',
    awe: 'Perfect Chord',
  },
  verdance: {
    joy: 'Verdant Embrace',
    fury: 'Thorn Barrier',
    sorrow: "Cycle's Gift",
    awe: 'Root Sense',
  },
  luminos: {
    joy: "Dawn's Clarity",
    fury: 'Searing Gaze',
    sorrow: 'Twilight Grace',
    awe: 'Spectral Shift',
  },
  kinesis: {
    joy: 'Swift Stride',
    fury: 'Tectonic Force',
    sorrow: 'Fading Step',
    awe: 'Orbital Force',
  },
};

// ---------------------------------------------------------------------------
// Recall Public API
// ---------------------------------------------------------------------------

/**
 * Recall a dormant god at its shrine by broadcasting an emotion.
 *
 * This is permanent and irreversible within a playthrough:
 * - Stores the god+emotion choice in player variables
 * - Increases the god's zone vibrancy by +15
 * - Unlocks the subclass ability for that god+emotion combo
 * - On first recall, determines the player's subclass branch
 *   (joy/awe → luminary, fury/sorrow → crucible)
 *
 * Returns a result indicating success or the reason for failure.
 */
export function recallMemory(
  player: RpgPlayer,
  godId: GodId,
  emotion: RecallEmotion,
): RecallResult {
  if (!GODS.includes(godId)) {
    return { success: false, error: `Unknown god: ${godId}` };
  }
  if (!RECALL_EMOTIONS.includes(emotion)) {
    return { success: false, error: `Invalid recall emotion: ${emotion}` };
  }

  // Check if this god has already been recalled
  const existing = player.getVariable(`${RECALL_PREFIX}${godId}`) as string | undefined;
  if (existing) {
    return { success: false, error: `${godId} has already been recalled with ${existing}` };
  }

  // Store the god+emotion choice
  player.setVariable(`${RECALL_PREFIX}${godId}`, emotion);

  // Track recall order
  const order = getRecallOrder(player);
  order.push(godId);
  player.setVariable(RECALL_ORDER_KEY, order);

  // On first recall, determine subclass branch
  const isFirstRecall = order.length === 1;
  let subclassBranch: SubclassBranch | undefined;
  if (isFirstRecall) {
    subclassBranch = emotion === 'joy' || emotion === 'awe' ? 'luminary' : 'crucible';
    player.setVariable(SUBCLASS_BRANCH_KEY, subclassBranch);
  }

  // Increase zone vibrancy
  const zone = GOD_ZONE[godId];
  const newVibrancy = increaseVibrancy(player, zone, RECALL_VIBRANCY_BASE);

  // Store the unlocked ability
  const abilityName = SUBCLASS_ABILITIES[godId][emotion];
  player.setVariable(`${RECALL_PREFIX}${godId}_ABILITY`, abilityName);

  const godName = RECALLED_GOD_NAMES[godId][emotion];

  // Emit event for UI/scene system
  player.emit('god-recalled', {
    godId,
    emotion,
    godName,
    abilityName,
    subclassBranch,
    isFirstRecall,
    zoneVibrancy: newVibrancy,
  });

  return {
    success: true,
    godName,
    abilityName,
    subclassBranch,
    vibrancyGain: RECALL_VIBRANCY_BASE,
  };
}

/**
 * Get the emotion used to recall a specific god, or undefined if not yet recalled.
 */
export function getGodRecallEmotion(player: RpgPlayer, godId: GodId): RecallEmotion | undefined {
  return player.getVariable(`${RECALL_PREFIX}${godId}`) as RecallEmotion | undefined;
}

/**
 * Check whether a specific god has been recalled.
 */
export function isGodRecalled(player: RpgPlayer, godId: GodId): boolean {
  return getGodRecallEmotion(player, godId) !== undefined;
}

/**
 * Get the full recall state for a god (name, emotion, ability), or undefined.
 */
export function getGodRecallState(player: RpgPlayer, godId: GodId): GodRecallState | undefined {
  const emotion = getGodRecallEmotion(player, godId);
  if (!emotion) return undefined;
  return {
    godId,
    emotion,
    godName: RECALLED_GOD_NAMES[godId][emotion],
    abilityName: SUBCLASS_ABILITIES[godId][emotion],
  };
}

/**
 * Get the ordered list of god IDs in the sequence they were recalled.
 */
export function getRecallOrder(player: RpgPlayer): GodId[] {
  return (player.getVariable(RECALL_ORDER_KEY) as GodId[] | undefined) ?? [];
}

/**
 * Get the number of gods recalled so far (0-4).
 */
export function getRecallCount(player: RpgPlayer): number {
  return getRecallOrder(player).length;
}

/**
 * Get the player's subclass branch, or undefined if no god has been recalled yet.
 */
export function getSubclassBranch(player: RpgPlayer): SubclassBranch | undefined {
  return player.getVariable(SUBCLASS_BRANCH_KEY) as SubclassBranch | undefined;
}

/**
 * Get all recall states for gods that have been recalled.
 */
export function getAllRecallStates(player: RpgPlayer): GodRecallState[] {
  return getRecallOrder(player)
    .map((godId) => getGodRecallState(player, godId))
    .filter((s): s is GodRecallState => s !== undefined);
}

/**
 * Return the full world-state permutation key.
 * Format: "resonance:joy|verdance:fury|luminos:sorrow|kinesis:awe" (only recalled gods).
 * Useful for tracking which of the 16^n states the player is in.
 */
export function getWorldStateKey(player: RpgPlayer): string {
  return GODS.map((godId) => {
    const emotion = getGodRecallEmotion(player, godId);
    return emotion ? `${godId}:${emotion}` : null;
  })
    .filter(Boolean)
    .join('|');
}
