import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-02',
  name: 'The Windmill Mystery',
  category: 'side',
  act: 'act1',
  objectives: [
    { index: 0, description: 'Speak with farmer at Heartfield Hamlet' },
    { index: 1, description: 'Travel to Old Windmill (30, 8)' },
    { index: 2, description: 'Defeat Dissolved Memory encounter' },
    { index: 3, description: 'Collect fragment from grinding stone' },
    { index: 4, description: 'Return to farmer' },
  ],
  rewards: { gold: 100, items: [{ id: 'W-DG-03', qty: 1 }] },
  dependencies: ['MQ-03'],
  unlocks: [],
};

export default quest;
