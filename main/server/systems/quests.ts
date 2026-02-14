import type { RpgPlayer } from '@rpgjs/server';
import { addGold, addItem } from './inventory';
import { addXP } from './progression';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type QuestStatus = 'inactive' | 'active' | 'completed' | 'failed';

export type QuestCategory = 'main' | 'god-recall' | 'side';

export interface QuestReward {
  xp?: number;
  gold?: number;
  items?: { id: string; qty: number }[];
}

export interface QuestDef {
  id: string;
  name: string;
  category: QuestCategory;
  objectiveCount: number;
  rewards: QuestReward;
}

// ---------------------------------------------------------------------------
// Player Variable Keys
// ---------------------------------------------------------------------------

// Per-quest variables stored on the player:
//   QUEST_<id>_STATUS  — QuestStatus
//   QUEST_<id>_OBJ     — number (current objective index, 0-based)

function statusKey(questId: string): string {
  return `QUEST_${questId}_STATUS`;
}

function objectiveKey(questId: string): string {
  return `QUEST_${questId}_OBJ`;
}

// ---------------------------------------------------------------------------
// Quest Registry — 28 quests (10 main, 4 god-recall, 14 side)
// ---------------------------------------------------------------------------

const QUEST_DEFS: readonly QuestDef[] = [
  // --- Main Quests (10) ---
  {
    id: 'MQ-01',
    name: "The Architect's Awakening",
    category: 'main',
    objectiveCount: 4,
    rewards: { gold: 50 },
  },
  {
    id: 'MQ-02',
    name: 'First Broadcast',
    category: 'main',
    objectiveCount: 4,
    rewards: { gold: 80 },
  },
  {
    id: 'MQ-03',
    name: 'The Settled Lands',
    category: 'main',
    objectiveCount: 5,
    rewards: { gold: 200 },
  },
  {
    id: 'MQ-04',
    name: 'The Stagnation',
    category: 'main',
    objectiveCount: 7,
    rewards: { gold: 150 },
  },
  {
    id: 'MQ-05',
    name: 'Into the Frontier',
    category: 'main',
    objectiveCount: 5,
    rewards: { gold: 300, items: [{ id: 'C-SC-04', qty: 3 }] },
  },
  { id: 'MQ-06', name: 'Recall the First God', category: 'main', objectiveCount: 4, rewards: {} },
  {
    id: 'MQ-07',
    name: "The Curator's Endgame",
    category: 'main',
    objectiveCount: 5,
    rewards: {
      gold: 500,
      items: [
        { id: 'C-HP-03', qty: 5 },
        { id: 'C-SP-03', qty: 3 },
      ],
    },
  },
  {
    id: 'MQ-08',
    name: 'Through the Sketch',
    category: 'main',
    objectiveCount: 6,
    rewards: { gold: 400, items: [{ id: 'A-13', qty: 1 }] },
  },
  {
    id: 'MQ-09',
    name: 'The Preserver Fortress',
    category: 'main',
    objectiveCount: 5,
    rewards: { gold: 800 },
  },
  { id: 'MQ-10', name: 'The First Memory Remix', category: 'main', objectiveCount: 5, rewards: {} },

  // --- God Recall Quests (4) ---
  { id: 'GQ-01', name: 'Recall Resonance', category: 'god-recall', objectiveCount: 5, rewards: {} },
  { id: 'GQ-02', name: 'Recall Verdance', category: 'god-recall', objectiveCount: 5, rewards: {} },
  { id: 'GQ-03', name: 'Recall Luminos', category: 'god-recall', objectiveCount: 5, rewards: {} },
  { id: 'GQ-04', name: 'Recall Kinesis', category: 'god-recall', objectiveCount: 5, rewards: {} },

  // --- Side Quests (14) ---
  {
    id: 'SQ-01',
    name: 'The Memorial Garden',
    category: 'side',
    objectiveCount: 3,
    rewards: {
      gold: 120,
      items: [
        { id: 'C-HP-01', qty: 5 },
        { id: 'C-SP-01', qty: 3 },
      ],
    },
  },
  {
    id: 'SQ-02',
    name: 'The Windmill Mystery',
    category: 'side',
    objectiveCount: 5,
    rewards: { gold: 100, items: [{ id: 'W-DG-03', qty: 1 }] },
  },
  {
    id: 'SQ-03',
    name: "The Woodcutter's Dilemma",
    category: 'side',
    objectiveCount: 5,
    rewards: { gold: 150, items: [{ id: 'A-05', qty: 1 }] },
  },
  {
    id: 'SQ-04',
    name: 'Upstream Secrets',
    category: 'side',
    objectiveCount: 6,
    rewards: { gold: 180, items: [{ id: 'W-ST-03', qty: 1 }] },
  },
  {
    id: 'SQ-05',
    name: "Aric's Doubt",
    category: 'side',
    objectiveCount: 5,
    rewards: { gold: 250, items: [{ id: 'C-SC-04', qty: 5 }] },
  },
  {
    id: 'SQ-06',
    name: "The Marsh Hermit's Request",
    category: 'side',
    objectiveCount: 5,
    rewards: {
      gold: 300,
      items: [
        { id: 'A-07', qty: 1 },
        { id: 'W-ST-05', qty: 1 },
      ],
    },
  },
  {
    id: 'SQ-07',
    name: "Petra's Ridgewalkers",
    category: 'side',
    objectiveCount: 4,
    rewards: { gold: 350, items: [{ id: 'A-08', qty: 1 }] },
  },
  {
    id: 'SQ-08',
    name: "Solen's Light Studies",
    category: 'side',
    objectiveCount: 5,
    rewards: { gold: 300 },
  },
  {
    id: 'SQ-09',
    name: 'Harmonize the Path',
    category: 'side',
    objectiveCount: 3,
    rewards: { gold: 200 },
  },
  {
    id: 'SQ-10',
    name: 'The Depths Expedition',
    category: 'side',
    objectiveCount: 6,
    rewards: { gold: 400, items: [{ id: 'A-09', qty: 1 }] },
  },
  { id: 'SQ-11', name: "Torvan's Masterwork", category: 'side', objectiveCount: 7, rewards: {} },
  {
    id: 'SQ-12',
    name: "Ren's Dream Visions",
    category: 'side',
    objectiveCount: 5,
    rewards: { gold: 250, items: [{ id: 'C-BF-05', qty: 3 }] },
  },
  {
    id: 'SQ-13',
    name: "The Dissolved Choir's Instruments",
    category: 'side',
    objectiveCount: 4,
    rewards: { gold: 500, items: [{ id: 'C-SP-08', qty: 3 }] },
  },
  {
    id: 'SQ-14',
    name: 'The Stagnation Breaker',
    category: 'side',
    objectiveCount: 6,
    rewards: { gold: 500, items: [{ id: 'C-HP-04', qty: 2 }] },
  },
];

// O(1) lookup by quest ID
const questById = new Map<string, QuestDef>(QUEST_DEFS.map((q) => [q.id, q]));

// ---------------------------------------------------------------------------
// Public API — Quest Definitions
// ---------------------------------------------------------------------------

export function getQuestDef(questId: string): QuestDef | undefined {
  return questById.get(questId);
}

export function getAllQuestDefs(): readonly QuestDef[] {
  return QUEST_DEFS;
}

// ---------------------------------------------------------------------------
// Public API — State Machine (inactive → active → completed | failed)
// ---------------------------------------------------------------------------

export function getQuestStatus(player: RpgPlayer, questId: string): QuestStatus {
  return (player.getVariable(statusKey(questId)) as QuestStatus) ?? 'inactive';
}

export function getObjectiveProgress(player: RpgPlayer, questId: string): number {
  return (player.getVariable(objectiveKey(questId)) as number) ?? 0;
}

export function isQuestActive(player: RpgPlayer, questId: string): boolean {
  return getQuestStatus(player, questId) === 'active';
}

export function isQuestComplete(player: RpgPlayer, questId: string): boolean {
  return getQuestStatus(player, questId) === 'completed';
}

export function startQuest(player: RpgPlayer, questId: string): boolean {
  const def = questById.get(questId);
  if (!def) return false;

  const current = getQuestStatus(player, questId);
  if (current !== 'inactive') return false;

  player.setVariable(statusKey(questId), 'active');
  player.setVariable(objectiveKey(questId), 0);
  return true;
}

export function advanceObjective(player: RpgPlayer, questId: string): number {
  if (!isQuestActive(player, questId)) return -1;

  const current = getObjectiveProgress(player, questId);
  const next = current + 1;
  player.setVariable(objectiveKey(questId), next);
  return next;
}

export function completeQuest(player: RpgPlayer, questId: string): boolean {
  if (!isQuestActive(player, questId)) return false;

  const def = questById.get(questId);
  if (!def) return false;

  player.setVariable(statusKey(questId), 'completed');
  distributeRewards(player, def.rewards);
  return true;
}

export function failQuest(player: RpgPlayer, questId: string): boolean {
  if (!isQuestActive(player, questId)) return false;

  player.setVariable(statusKey(questId), 'failed');
  return true;
}

// ---------------------------------------------------------------------------
// Public API — Query Helpers
// ---------------------------------------------------------------------------

export function getActiveQuests(player: RpgPlayer): QuestDef[] {
  return QUEST_DEFS.filter((q) => isQuestActive(player, q.id));
}

export function getCompletedQuests(player: RpgPlayer): QuestDef[] {
  return QUEST_DEFS.filter((q) => isQuestComplete(player, q.id));
}

// ---------------------------------------------------------------------------
// Internal — Reward Distribution
// ---------------------------------------------------------------------------

function distributeRewards(player: RpgPlayer, rewards: QuestReward): void {
  if (rewards.xp) {
    addXP(player, rewards.xp);
  }
  if (rewards.gold) {
    addGold(player, rewards.gold);
  }
  if (rewards.items) {
    for (const item of rewards.items) {
      addItem(player, item.id, item.qty);
    }
  }
}
