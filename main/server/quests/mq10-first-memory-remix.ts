import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'MQ-10',
  name: 'The First Memory Remix',
  category: 'main',
  act: 'act3',
  objectives: [
    { index: 0, description: 'Remix First Memory with any fragment' },
    { index: 1, description: "Create World's New Dawn (MF-11)" },
    { index: 2, description: "Broadcast World's New Dawn" },
    { index: 3, description: 'Watch Endgame Bloom' },
    { index: 4, description: 'View epilogue' },
  ],
  rewards: {},
  dependencies: ['MQ-09'],
  unlocks: ['new-game-plus'],
};

export default quest;
