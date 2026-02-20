import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-04',
  name: 'Upstream Secrets',
  category: 'side',
  act: 'act1',
  objectives: [
    { index: 0, description: 'Speak with fisher' },
    { index: 1, description: 'Travel to Upstream Falls (8, 5)' },
    { index: 2, description: 'Find hidden cave behind waterfall' },
    { index: 3, description: 'Navigate dissolved memory grotto' },
    { index: 4, description: 'Collect 2 high-potency fragments' },
    { index: 5, description: 'Return to fisher' },
  ],
  rewards: { gold: 180, items: [{ id: 'W-ST-03', qty: 1 }] },
  dependencies: ['MQ-03'],
  unlocks: [],
};

export default quest;
