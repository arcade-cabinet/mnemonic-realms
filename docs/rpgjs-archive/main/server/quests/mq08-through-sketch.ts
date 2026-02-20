import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'MQ-08',
  name: 'Through the Sketch',
  category: 'main',
  act: 'act3',
  objectives: [
    { index: 0, description: 'Enter the Sketch' },
    { index: 1, description: 'Navigate Half-Drawn Forest (3 broadcasts)' },
    { index: 2, description: 'Cross Luminous Wastes (5 stones)' },
    { index: 3, description: 'Reach Undrawn Peaks' },
    { index: 4, description: 'Survive 2 Sketch encounters' },
    { index: 5, description: 'Broadcast potency 3+ at Fortress Gate' },
  ],
  rewards: { gold: 400, items: [{ id: 'A-13', qty: 1 }] },
  dependencies: ['MQ-07'],
  unlocks: ['MQ-09'],
};

export default quest;
