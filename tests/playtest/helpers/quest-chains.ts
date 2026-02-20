/**
 * Quest chain definitions for playtest suite.
 *
 * Defines all main quests (MQ), side quests (SQ), and guild quests (GQ)
 * with objectives and dependencies for AI player traversal.
 */

import type { QuestChain } from '../../../engine/testing/behaviors/quest-following.js';

// ── Helper ─────────────────────────────────────────────────────────────────

function obj(
  index: number,
  description: string,
  targetMap: string,
  targetX: number,
  targetY: number,
  actionType: 'interact' | 'collect' | 'defeat' | 'reach' | 'broadcast' = 'interact',
) {
  return { index, description, targetX, targetY, targetMap, actionType };
}

// ── Act 1 Main Quests (MQ-01 → MQ-04) ─────────────────────────────────────

export const MQ01: QuestChain = {
  questId: 'MQ-01',
  name: 'The Fading Light',
  dependencies: [],
  isMainQuest: true,
  objectives: [
    obj(0, 'Speak with Artun in Everwick', 'settled-lands-everwick', 4, 4),
    obj(1, 'Investigate the fading resonance stone', 'settled-lands-everwick', 8, 2, 'interact'),
    obj(2, 'Return to Artun with findings', 'settled-lands-everwick', 4, 4),
  ],
};

export const MQ02: QuestChain = {
  questId: 'MQ-02',
  name: 'Echoes of the Past',
  dependencies: ['MQ-01'],
  isMainQuest: true,
  objectives: [
    obj(0, 'Travel to the Whispering Caves', 'whispering-caves-floor1', 1, 7, 'reach'),
    obj(1, 'Find the memory fragment', 'whispering-caves-floor1', 6, 1, 'collect'),
  ],
};

export const MQ03: QuestChain = {
  questId: 'MQ-03',
  name: 'The Keeper\'s Trial',
  dependencies: ['MQ-02'],
  isMainQuest: true,
  objectives: [
    obj(0, 'Enter the Keeper\'s sanctum', 'keepers-sanctum', 3, 3, 'reach'),
    obj(1, 'Defeat the trial guardian', 'keepers-sanctum', 5, 2, 'defeat'),
  ],
};

export const MQ04: QuestChain = {
  questId: 'MQ-04',
  name: 'Restoration Begins',
  dependencies: ['MQ-03'],
  isMainQuest: true,
  objectives: [
    obj(0, 'Restore the first resonance stone', 'settled-lands-everwick', 8, 2, 'interact'),
    obj(1, 'Witness the vibrancy bloom', 'settled-lands-everwick', 5, 5, 'reach'),
  ],
};

// ── Act 2 Main Quests (MQ-05 → MQ-07) ─────────────────────────────────────

export const MQ05: QuestChain = {
  questId: 'MQ-05',
  name: 'Beyond the Frontier',
  dependencies: ['MQ-04'],
  isMainQuest: true,
  objectives: [
    obj(0, 'Cross into the Frontier', 'frontier-outpost', 2, 8, 'reach'),
    obj(1, 'Speak with the frontier scout', 'frontier-outpost', 4, 3),
  ],
};

export const MQ06: QuestChain = {
  questId: 'MQ-06',
  name: 'The Shattered Archive',
  dependencies: ['MQ-05'],
  isMainQuest: true,
  objectives: [
    obj(0, 'Locate the archive entrance', 'shattered-archive', 1, 1, 'reach'),
    obj(1, 'Recover the lost codex', 'shattered-archive', 6, 3, 'collect'),
  ],
};

export const MQ07: QuestChain = {
  questId: 'MQ-07',
  name: 'The Second Bloom',
  dependencies: ['MQ-06'],
  isMainQuest: true,
  objectives: [
    obj(0, 'Restore the frontier stone', 'frontier-outpost', 5, 5, 'interact'),
  ],
};

// ── Act 3 Main Quests (MQ-08 → MQ-10) ─────────────────────────────────────

export const MQ08: QuestChain = {
  questId: 'MQ-08',
  name: 'The Forgotten Core',
  dependencies: ['MQ-07'],
  isMainQuest: true,
  objectives: [
    obj(0, 'Enter the Forgotten Core', 'forgotten-core', 4, 8, 'reach'),
    obj(1, 'Defeat the memory warden', 'forgotten-core', 4, 2, 'defeat'),
  ],
};

export const MQ09: QuestChain = {
  questId: 'MQ-09',
  name: 'Convergence',
  dependencies: ['MQ-08'],
  isMainQuest: true,
  objectives: [
    obj(0, 'Gather all resonance fragments', 'forgotten-core', 4, 4, 'collect'),
    obj(1, 'Activate the convergence ritual', 'forgotten-core', 4, 4, 'broadcast'),
  ],
};

export const MQ10: QuestChain = {
  questId: 'MQ-10',
  name: 'The Final Bloom',
  dependencies: ['MQ-09'],
  isMainQuest: true,
  objectives: [
    obj(0, 'Restore the world\'s memory', 'settled-lands-everwick', 5, 5, 'broadcast'),
  ],
};

// ── Act 1 Side Quests (SQ-01 → SQ-05) ─────────────────────────────────────

export const SQ01: QuestChain = {
  questId: 'SQ-01',
  name: 'The Herbalist\'s Request',
  dependencies: [],
  isMainQuest: false,
  objectives: [
    obj(0, 'Collect 3 moonpetal herbs', 'settled-lands-everwick', 3, 7, 'collect'),
    obj(1, 'Deliver herbs to the herbalist', 'settled-lands-everwick', 6, 2),
  ],
};

export const SQ02: QuestChain = {
  questId: 'SQ-02',
  name: 'Lost Heirloom',
  dependencies: [],
  isMainQuest: false,
  objectives: [
    obj(0, 'Search the old well', 'settled-lands-everwick', 5, 8, 'collect'),
    obj(1, 'Return the heirloom', 'settled-lands-everwick', 2, 3),
  ],
};

export const SQ03: QuestChain = {
  questId: 'SQ-03',
  name: 'Pest Control',
  dependencies: ['MQ-01'],
  isMainQuest: false,
  objectives: [
    obj(0, 'Defeat 5 slimes near the farm', 'settled-lands-everwick', 9, 9, 'defeat'),
  ],
};

export const SQ04: QuestChain = {
  questId: 'SQ-04',
  name: 'The Merchant\'s Woe',
  dependencies: ['MQ-01'],
  isMainQuest: false,
  objectives: [
    obj(0, 'Escort the merchant to the crossroads', 'settled-lands-everwick', 8, 5, 'reach'),
  ],
};

export const SQ05: QuestChain = {
  questId: 'SQ-05',
  name: 'Stone Whispers',
  dependencies: ['MQ-02'],
  isMainQuest: false,
  objectives: [
    obj(0, 'Find the hidden resonance stone', 'whispering-caves-floor1', 3, 3, 'collect'),
    obj(1, 'Attune to the stone', 'whispering-caves-floor1', 3, 3, 'interact'),
  ],
};

// ── Act 2 Side Quests (SQ-06 → SQ-13) ─────────────────────────────────────

export const SQ06: QuestChain = {
  questId: 'SQ-06',
  name: 'Frontier Foraging',
  dependencies: ['MQ-05'],
  isMainQuest: false,
  objectives: [
    obj(0, 'Gather frontier berries', 'frontier-outpost', 7, 6, 'collect'),
  ],
};

export const SQ07: QuestChain = {
  questId: 'SQ-07',
  name: 'The Scout\'s Debt',
  dependencies: ['MQ-05'],
  isMainQuest: false,
  objectives: [
    obj(0, 'Retrieve the scout\'s journal', 'frontier-outpost', 2, 2, 'collect'),
    obj(1, 'Return the journal', 'frontier-outpost', 4, 3),
  ],
};

export const SQ08: QuestChain = { questId: 'SQ-08', name: 'Elemental Samples', dependencies: ['MQ-05'], isMainQuest: false, objectives: [obj(0, 'Collect elemental samples', 'frontier-outpost', 6, 1, 'collect')] };
export const SQ09: QuestChain = { questId: 'SQ-09', name: 'Bridge Repair', dependencies: ['MQ-05'], isMainQuest: false, objectives: [obj(0, 'Gather bridge materials', 'frontier-outpost', 3, 7, 'collect')] };
export const SQ10: QuestChain = { questId: 'SQ-10', name: 'The Cartographer', dependencies: ['MQ-06'], isMainQuest: false, objectives: [obj(0, 'Map the archive halls', 'shattered-archive', 4, 4, 'reach')] };
export const SQ11: QuestChain = { questId: 'SQ-11', name: 'Archive Guardians', dependencies: ['MQ-06'], isMainQuest: false, objectives: [obj(0, 'Defeat archive sentinels', 'shattered-archive', 5, 2, 'defeat')] };
export const SQ12: QuestChain = { questId: 'SQ-12', name: 'Lost Scholars', dependencies: ['MQ-06'], isMainQuest: false, objectives: [obj(0, 'Find the scholar\'s notes', 'shattered-archive', 2, 5, 'collect')] };
export const SQ13: QuestChain = { questId: 'SQ-13', name: 'The Sealed Door', dependencies: ['MQ-06'], isMainQuest: false, objectives: [obj(0, 'Unseal the archive vault', 'shattered-archive', 7, 1, 'interact')] };

// ── Act 3 Side Quest (SQ-14) ───────────────────────────────────────────────

export const SQ14: QuestChain = {
  questId: 'SQ-14',
  name: 'Echoes of the Forgotten',
  dependencies: ['MQ-08'],
  isMainQuest: false,
  objectives: [
    obj(0, 'Collect all memory shards', 'forgotten-core', 2, 6, 'collect'),
    obj(1, 'Restore the forgotten monument', 'forgotten-core', 4, 1, 'interact'),
  ],
};

// ── Guild Quests (GQ-01 → GQ-04) ──────────────────────────────────────────

export const GQ01: QuestChain = { questId: 'GQ-01', name: 'Guild Initiation', dependencies: ['MQ-04'], isMainQuest: false, objectives: [obj(0, 'Complete the guild trial', 'settled-lands-everwick', 7, 7, 'defeat')] };
export const GQ02: QuestChain = { questId: 'GQ-02', name: 'Bounty: Wolf Pack', dependencies: ['GQ-01'], isMainQuest: false, objectives: [obj(0, 'Defeat the wolf pack leader', 'frontier-outpost', 8, 2, 'defeat')] };
export const GQ03: QuestChain = { questId: 'GQ-03', name: 'Bounty: Elemental', dependencies: ['GQ-01'], isMainQuest: false, objectives: [obj(0, 'Defeat the rogue elemental', 'frontier-outpost', 1, 5, 'defeat')] };
export const GQ04: QuestChain = { questId: 'GQ-04', name: 'Guild Master\'s Challenge', dependencies: ['GQ-02', 'GQ-03'], isMainQuest: false, objectives: [obj(0, 'Defeat the guild master', 'settled-lands-everwick', 7, 7, 'defeat')] };

// ── Aggregated Lists ───────────────────────────────────────────────────────

export const ACT1_MAIN_QUESTS: QuestChain[] = [MQ01, MQ02, MQ03, MQ04];
export const ACT1_SIDE_QUESTS: QuestChain[] = [SQ01, SQ02, SQ03, SQ04, SQ05];
export const ACT1_ALL: QuestChain[] = [...ACT1_MAIN_QUESTS, ...ACT1_SIDE_QUESTS];

export const ACT2_MAIN_QUESTS: QuestChain[] = [MQ05, MQ06, MQ07];
export const ACT2_SIDE_QUESTS: QuestChain[] = [SQ06, SQ07, SQ08, SQ09, SQ10, SQ11, SQ12, SQ13];
export const ACT2_GUILD_QUESTS: QuestChain[] = [GQ01, GQ02, GQ03, GQ04];
export const ACT2_ALL: QuestChain[] = [...ACT2_MAIN_QUESTS, ...ACT2_SIDE_QUESTS, ...ACT2_GUILD_QUESTS];

export const ACT3_MAIN_QUESTS: QuestChain[] = [MQ08, MQ09, MQ10];
export const ACT3_SIDE_QUESTS: QuestChain[] = [SQ14];
export const ACT3_ALL: QuestChain[] = [...ACT3_MAIN_QUESTS, ...ACT3_SIDE_QUESTS];

export const ALL_QUESTS: QuestChain[] = [...ACT1_ALL, ...ACT2_ALL, ...ACT3_ALL];
