import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-14',
  name: 'The Stagnation Breaker',
  category: 'side',
  act: 'act3',
  objectives: [
    { index: 0, description: 'Speak with Callum about freeing Lira' },
    { index: 1, description: 'Travel to Heartfield Stagnation Clearing (35, 30)' },
    { index: 2, description: 'Defeat Preserver reinforcements (2x Agent + 1x Captain)' },
    { index: 3, description: "Broadcast potency 4+ joy fragment into Lira's frozen form" },
    { index: 4, description: "Witness Lira's partial awakening message" },
    { index: 5, description: "Return to Callum with Lira's message" },
  ],
  rewards: { gold: 500, items: [{ id: 'C-HP-04', qty: 2 }] },
  dependencies: ['MQ-07'],
  unlocks: [],
};

export default quest;
