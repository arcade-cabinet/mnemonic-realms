import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-06',
  name: "The Marsh Hermit's Request",
  category: 'side',
  act: 'act2',
  objectives: [
    { index: 0, description: 'Speak with Wynn' },
    { index: 1, description: 'Collect 3 water-element fragments' },
    { index: 2, description: 'Broadcast into 3 marsh Resonance Stones' },
    { index: 3, description: 'Defeat Mire Crawler ambush' },
    { index: 4, description: 'Return to Wynn' },
  ],
  rewards: {
    gold: 300,
    items: [
      { id: 'A-07', qty: 1 },
      { id: 'W-ST-05', qty: 1 },
    ],
  },
  dependencies: ['MQ-05'],
  unlocks: [],
};

export default quest;
