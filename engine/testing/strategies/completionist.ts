/**
 * Completionist Strategy
 *
 * Explores every area, completes every quest, opens every chest.
 * Balanced combat style — uses skills when available, heals when needed.
 */

import type { PlaythroughStrategy } from './types.js';

export const completionistStrategy: PlaythroughStrategy = {
  id: 'completionist',
  name: 'Completionist',
  prioritizeMainQuest: false,
  completeSideQuests: true,
  exploreAllAreas: true,
  combatStyle: 'balanced',
  maxTicksPerArea: 500,
};
