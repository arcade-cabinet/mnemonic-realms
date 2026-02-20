import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'MQ-03',
  name: 'The Settled Lands',
  category: 'main',
  act: 'act1',
  objectives: [
    { index: 0, description: 'Speak with Artun for exploration guidance', location: 'Everwick' },
    { index: 1, description: 'Visit Heartfield, Ambergrove, Millbrook, Sunridge' },
    { index: 2, description: 'Collect at least 5 memory fragments' },
    { index: 3, description: 'Defeat encounters in each zone' },
    { index: 4, description: 'Return to Artun', location: 'Everwick' },
  ],
  rewards: { gold: 200 },
  dependencies: ['MQ-02'],
  unlocks: ['MQ-04', 'SQ-02', 'SQ-03', 'SQ-04'],
};

export default quest;
