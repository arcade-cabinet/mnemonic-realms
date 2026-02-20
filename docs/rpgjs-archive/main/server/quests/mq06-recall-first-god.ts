import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'MQ-06',
  name: 'Recall the First God',
  category: 'main',
  act: 'act2',
  objectives: [
    { index: 0, description: 'Discover a dormant god shrine' },
    { index: 1, description: 'Complete shrine approach challenge' },
    { index: 2, description: 'Choose emotion and recall god with potency 3+ fragment' },
    { index: 3, description: 'Witness transformation' },
  ],
  rewards: {},
  dependencies: ['MQ-05'],
  unlocks: ['MQ-07'],
};

export default quest;
