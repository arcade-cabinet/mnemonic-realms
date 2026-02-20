import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-03',
  name: "The Woodcutter's Dilemma",
  category: 'side',
  act: 'act1',
  objectives: [
    { index: 0, description: 'Speak with woodcutter' },
    { index: 1, description: 'Investigate 3 rapid-growth sites' },
    { index: 2, description: 'Broadcast fragments at each site' },
    { index: 3, description: 'Defeat Thornback Beetle nest' },
    { index: 4, description: 'Return to woodcutter' },
  ],
  rewards: { gold: 150, items: [{ id: 'A-05', qty: 1 }] },
  dependencies: ['MQ-03'],
  unlocks: [],
};

export default quest;
