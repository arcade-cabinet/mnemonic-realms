import type { RpgPlayer } from '@rpgjs/server';

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
