import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'GQ-02',
  name: 'Recall Verdance',
  category: 'god-recall',
  act: 'act2',
  objectives: [
    { index: 0, description: "Follow Wynn to Verdance's Hollow" },
    { index: 1, description: 'Solve root puzzle (broadcast earth/water fragment)' },
    { index: 2, description: 'Watch the Rootwalker recall vision' },
    { index: 3, description: 'Choose emotion and place potency 3+ fragment' },
    { index: 4, description: 'Witness Verdance transformation' },
  ],
  rewards: {},
  dependencies: ['MQ-05'],
  unlocks: ['MQ-06'],
};

export default quest;
