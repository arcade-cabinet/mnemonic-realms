import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'MQ-07',
  name: "The Curator's Endgame",
  category: 'main',
  act: 'act2',
  objectives: [
    { index: 0, description: 'Return to Village Hub and speak with Artun' },
    { index: 1, description: "Learn about Curator's plan for First Memory" },
    { index: 2, description: 'Speak with Aric' },
    { index: 3, description: 'Recall at least 2 total gods' },
    { index: 4, description: 'Return to Artun for expedition plan' },
  ],
  rewards: {
    gold: 500,
    items: [
      { id: 'C-HP-03', qty: 5 },
      { id: 'C-SP-03', qty: 3 },
    ],
  },
  dependencies: ['MQ-06', 'SQ-05'],
  unlocks: ['MQ-08'],
};

export default quest;
