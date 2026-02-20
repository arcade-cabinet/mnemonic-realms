/**
 * Side Quest Focus Strategy
 *
 * Prioritizes side quests and god recall chains.
 * Defensive combat — conserve resources for longer play sessions.
 */

import type { PlaythroughStrategy } from './types.js';

export const sideQuestFocusStrategy: PlaythroughStrategy = {
  id: 'side-quest-focus',
  name: 'Side Quest Focus',
  prioritizeMainQuest: false,
  completeSideQuests: true,
  exploreAllAreas: true,
  combatStyle: 'defensive',
  maxTicksPerArea: 400,
};
