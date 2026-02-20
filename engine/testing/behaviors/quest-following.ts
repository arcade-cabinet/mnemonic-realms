/**
 * Quest-Following Behavior — Quest objective tracking and resolution.
 *
 * Pure functions. Determines the next quest objective the AI player
 * should pursue based on the current quest tracker state and available
 * quest chain definitions.
 */

import { checkQuestAvailability, getQuestStatus } from '../../save/quest-tracker.js';
import type { QuestState } from '../../save/types.js';

/** A quest chain definition — describes objectives and their locations. */
export interface QuestChain {
  questId: string;
  name: string;
  /** Quest IDs that must be completed before this quest is available. */
  dependencies: string[];
  /** Ordered objectives with target locations. */
  objectives: QuestObjective[];
  /** Whether this is a main quest (MQ) or side quest (SQ/GQ). */
  isMainQuest: boolean;
}

/** A single quest objective with a target location. */
export interface QuestObjective {
  index: number;
  description: string;
  /** Target tile coordinates on the relevant map. */
  targetX: number;
  targetY: number;
  /** Map ID where this objective takes place. */
  targetMap: string;
  /** Type of action needed to complete this objective. */
  actionType: 'interact' | 'collect' | 'defeat' | 'reach' | 'broadcast';
}

/** Result of resolving the next quest objective. */
export interface NextObjective {
  questId: string;
  questName: string;
  objectiveIndex: number;
  objective: QuestObjective;
  isMainQuest: boolean;
}

/** Sort quest chains with main quests first when preferred. */
function sortChains(questChains: QuestChain[], preferMainQuest: boolean): QuestChain[] {
  return [...questChains].sort((a, b) => {
    if (!preferMainQuest) return 0;
    if (a.isMainQuest && !b.isMainQuest) return -1;
    if (!a.isMainQuest && b.isMainQuest) return 1;
    return 0;
  });
}

/** Find the first incomplete objective in an active quest. */
function findActiveObjective(
  chain: QuestChain,
  tracker: Record<string, QuestState>,
): NextObjective | null {
  const questState = tracker[chain.questId];
  if (!questState) return null;

  for (const obj of chain.objectives) {
    const objState = questState.objectives.find((o) => o.index === obj.index);
    if (objState && !objState.completed) {
      return {
        questId: chain.questId,
        questName: chain.name,
        objectiveIndex: obj.index,
        objective: obj,
        isMainQuest: chain.isMainQuest,
      };
    }
  }
  return null;
}

/**
 * Get the next quest objective the AI should pursue.
 *
 * Priority:
 * 1. Active quests — find the first incomplete objective.
 * 2. Available quests (dependencies met) — start the highest-priority one.
 *
 * @param tracker - Current quest tracker state
 * @param questChains - All known quest chain definitions
 * @param preferMainQuest - If true, main quests are checked first
 * @returns The next objective to pursue, or null if nothing available.
 */
export function getNextQuestObjective(
  tracker: Record<string, QuestState>,
  questChains: QuestChain[],
  preferMainQuest: boolean,
): NextObjective | null {
  const sorted = sortChains(questChains, preferMainQuest);

  // 1. Check active quests for incomplete objectives
  for (const chain of sorted) {
    if (getQuestStatus(tracker, chain.questId) !== 'active') continue;
    const result = findActiveObjective(chain, tracker);
    if (result) return result;
  }

  // 2. Check for available quests that can be started
  for (const chain of sorted) {
    if (getQuestStatus(tracker, chain.questId) !== 'not-started') continue;
    if (!checkQuestAvailability(tracker, chain)) continue;
    if (chain.objectives.length === 0) continue;

    return {
      questId: chain.questId,
      questName: chain.name,
      objectiveIndex: 0,
      objective: chain.objectives[0],
      isMainQuest: chain.isMainQuest,
    };
  }

  return null;
}

/**
 * Get all quests that are currently available to start.
 *
 * @param tracker - Current quest tracker state
 * @param questChains - All known quest chain definitions
 * @returns Quest chains whose dependencies are met and haven't been started.
 */
export function getAvailableQuests(
  tracker: Record<string, QuestState>,
  questChains: QuestChain[],
): QuestChain[] {
  return questChains.filter((chain) => {
    const status = getQuestStatus(tracker, chain.questId);
    if (status !== 'not-started') return false;
    return checkQuestAvailability(tracker, chain);
  });
}
