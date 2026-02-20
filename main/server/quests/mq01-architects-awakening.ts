import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'MQ-01',
  name: "The Architect's Awakening",
  category: 'main',
  act: 'act1',
  objectives: [
    {
      index: 0,
      description: "Speak with Artun at Elder's House",
      location: 'Everwick',
      position: '18,10',
    },
    {
      index: 1,
      description: "Receive Architect's Signet from Hana",
      location: 'Everwick',
      position: '8,18',
    },
    {
      index: 2,
      description: 'Collect first fragment from Memorial Garden',
      location: 'Everwick',
      position: '8,16',
    },
    { index: 3, description: 'Return to Artun', location: 'Everwick', position: '18,10' },
  ],
  rewards: { gold: 50 },
  dependencies: [],
  unlocks: ['MQ-02'],
};

export default quest;
