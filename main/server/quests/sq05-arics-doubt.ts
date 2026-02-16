import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-05',
  name: "Aric's Doubt",
  category: 'side',
  act: 'act1',
  objectives: [
    { index: 0, description: 'Speak with Aric at Sunridge' },
    { index: 1, description: "Listen to Aric's confession" },
    { index: 2, description: 'Collect 3 fragments of different emotions (potency 2+)' },
    { index: 3, description: 'Return after 1 in-game day' },
    { index: 4, description: 'Receive Preserver intelligence' },
  ],
  rewards: { gold: 250, items: [{ id: 'C-SC-04', qty: 5 }] },
  dependencies: ['MQ-04'],
  unlocks: ['MQ-07'],
};

export default quest;
