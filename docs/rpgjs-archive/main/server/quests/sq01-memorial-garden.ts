import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-01',
  name: 'The Memorial Garden',
  category: 'side',
  act: 'act1',
  objectives: [
    { index: 0, description: 'Speak with Maren about the fading garden' },
    { index: 1, description: 'Broadcast 3 fragments into Memorial Garden stones' },
    { index: 2, description: 'Return to Maren' },
  ],
  rewards: {
    gold: 120,
    items: [
      { id: 'C-HP-01', qty: 5 },
      { id: 'C-SP-01', qty: 3 },
    ],
  },
  dependencies: ['MQ-02'],
  unlocks: [],
};

export default quest;
