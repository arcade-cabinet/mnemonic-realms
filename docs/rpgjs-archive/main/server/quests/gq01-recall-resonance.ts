import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'GQ-01',
  name: 'Recall Resonance',
  category: 'god-recall',
  act: 'act2',
  objectives: [
    { index: 0, description: "Enter Resonance's Amphitheater" },
    { index: 1, description: 'Watch the Choir recall vision' },
    { index: 2, description: 'Choose an emotion pedestal (Joy/Fury/Sorrow/Awe)' },
    { index: 3, description: 'Place potency 3+ fragment on pedestal' },
    { index: 4, description: 'Witness Resonance transformation' },
  ],
  rewards: {},
  dependencies: ['MQ-05', 'SQ-09'],
  unlocks: ['MQ-06'],
};

export default quest;
