import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'MQ-09',
  name: 'The Preserver Fortress',
  category: 'main',
  act: 'act3',
  objectives: [
    { index: 0, description: 'Navigate Floor 1: Crystal Gallery' },
    { index: 1, description: 'Navigate Floor 2: Archive of Perfection' },
    { index: 2, description: 'Navigate Floor 3: First Memory Chamber' },
    { index: 3, description: 'Confront the Curator (dialogue)' },
    { index: 4, description: 'Collect the First Memory (MF-10)' },
  ],
  rewards: { gold: 800 },
  dependencies: ['MQ-08'],
  unlocks: ['MQ-10'],
};

export default quest;
