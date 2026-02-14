import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'MQ-02',
  name: 'First Broadcast',
  category: 'main',
  act: 'act1',
  objectives: [
    { index: 0, description: 'Visit Hana and learn memory operations', location: 'Village Hub', position: '8,18' },
    { index: 1, description: 'Collect 2 fragments from Memorial Garden', location: 'Village Hub', position: '8,16' },
    { index: 2, description: 'Use the Remix Table', location: 'Village Hub' },
    { index: 3, description: 'Broadcast a remixed fragment', location: 'Village Hub' },
  ],
  rewards: { gold: 80 },
  dependencies: ['MQ-01'],
  unlocks: ['MQ-03', 'SQ-01'],
};

export default quest;
