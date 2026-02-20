import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'MQ-05',
  name: 'Into the Frontier',
  category: 'main',
  act: 'act2',
  objectives: [
    { index: 0, description: 'Speak with Artun at Lookout Hill', position: '12,2' },
    { index: 1, description: 'Cross mountain pass into Hollow Ridge' },
    { index: 2, description: 'Reach Ridgewalker Camp and speak with Nel', position: '15,25' },
    { index: 3, description: 'Learn about dormant gods' },
    { index: 4, description: 'Visit another Frontier zone' },
  ],
  rewards: { gold: 300, items: [{ id: 'C-SC-04', qty: 3 }] },
  dependencies: ['MQ-04'],
  unlocks: ['MQ-06', 'GQ-01', 'GQ-02', 'GQ-03', 'GQ-04', 'SQ-06', 'SQ-07', 'SQ-08', 'SQ-09'],
};

export default quest;
