/**
 * Mnemonic Realms — Quest Tracker (Pure Functions)
 *
 * Immutable quest state management. Every function returns new state.
 * No side effects — no ECS coupling, no storage access.
 */

import type { QuestObjectiveState, QuestState, QuestStatus } from './types.js';

// ── Factory ─────────────────────────────────────────────────────────────────

/** Create an empty quest tracker. */
export function createQuestTracker(): Record<string, QuestState> {
  return {};
}

// ── Mutations (immutable — return new state) ────────────────────────────────

/** Start a quest with the given number of objectives. */
export function startQuest(
  tracker: Record<string, QuestState>,
  questId: string,
  objectiveCount: number,
): Record<string, QuestState> {
  const objectives: QuestObjectiveState[] = Array.from({ length: objectiveCount }, (_, i) => ({
    index: i,
    completed: false,
  }));

  return {
    ...tracker,
    [questId]: { questId, status: 'active', objectives },
  };
}

/** Mark an objective as completed within an active quest. */
export function advanceObjective(
  tracker: Record<string, QuestState>,
  questId: string,
  objectiveIndex: number,
): Record<string, QuestState> {
  const quest = tracker[questId];
  if (!quest || quest.status !== 'active') return tracker;

  const objectives = quest.objectives.map((obj) =>
    obj.index === objectiveIndex ? { ...obj, completed: true } : obj,
  );

  return {
    ...tracker,
    [questId]: { ...quest, objectives },
  };
}

/** Mark a quest as completed. */
export function completeQuest(
  tracker: Record<string, QuestState>,
  questId: string,
): Record<string, QuestState> {
  const quest = tracker[questId];
  if (!quest) return tracker;

  return {
    ...tracker,
    [questId]: { ...quest, status: 'completed' },
  };
}

/** Mark a quest as failed. */
export function failQuest(
  tracker: Record<string, QuestState>,
  questId: string,
): Record<string, QuestState> {
  const quest = tracker[questId];
  if (!quest) return tracker;

  return {
    ...tracker,
    [questId]: { ...quest, status: 'failed' },
  };
}

// ── Queries ─────────────────────────────────────────────────────────────────

/** Get the status of a quest, defaulting to 'not-started' if absent. */
export function getQuestStatus(tracker: Record<string, QuestState>, questId: string): QuestStatus {
  return tracker[questId]?.status ?? 'not-started';
}

/** Get all active quests. */
export function getActiveQuests(tracker: Record<string, QuestState>): QuestState[] {
  return Object.values(tracker).filter((q) => q.status === 'active');
}

/** Get all completed quests. */
export function getCompletedQuests(tracker: Record<string, QuestState>): QuestState[] {
  return Object.values(tracker).filter((q) => q.status === 'completed');
}

/**
 * Check whether a quest's dependencies are all completed.
 * If dependencies array is empty, quest is available.
 */
export function checkQuestAvailability(
  tracker: Record<string, QuestState>,
  quest: { dependencies: string[] },
): boolean {
  if (quest.dependencies.length === 0) return true;
  return quest.dependencies.every((dep) => tracker[dep]?.status === 'completed');
}
