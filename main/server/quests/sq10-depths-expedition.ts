import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-10',
  name: 'The Depths Expedition',
  category: 'side',
  act: 'act2',
  objectives: [
    { index: 0, description: 'Speak with Artun about the Depths' },
    { index: 1, description: 'Travel to Depths entrance in Memorial Garden (8, 17)' },
    { index: 2, description: 'Navigate Depths Level 1 (5 rooms)' },
    { index: 3, description: 'Defeat the Depths L1 floor guardian' },
    { index: 4, description: 'Collect dissolved memory fragment from guardian chamber' },
    { index: 5, description: 'Return to Artun' },
  ],
  rewards: { gold: 400, items: [{ id: 'A-09', qty: 1 }] },
  dependencies: ['MQ-05'],
  unlocks: [],
};

export default quest;
