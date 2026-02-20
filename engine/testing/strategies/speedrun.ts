/**
 * Speedrun Strategy
 *
 * Main quest only, skips side content, aggressive combat.
 * Minimal exploration — beeline to objectives.
 */

import type { PlaythroughStrategy } from './types.js';

export const speedrunStrategy: PlaythroughStrategy = {
  id: 'speedrun',
  name: 'Speedrun',
  prioritizeMainQuest: true,
  completeSideQuests: false,
  exploreAllAreas: false,
  combatStyle: 'aggressive',
  maxTicksPerArea: 200,
};

