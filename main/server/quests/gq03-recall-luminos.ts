import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'GQ-03',
  name: 'Recall Luminos',
  category: 'god-recall',
  act: 'act2',
  objectives: [
    { index: 0, description: 'Enter Luminos Grove with Light Lens' },
    { index: 1, description: 'Navigate light corridor to prism' },
    { index: 2, description: 'Watch the Radiant Lens recall vision' },
    { index: 3, description: 'Choose emotion and place potency 3+ fragment' },
    { index: 4, description: 'Witness Luminos transformation' },
  ],
  rewards: {},
  dependencies: ['MQ-05'],
  unlocks: ['MQ-06'],
};

export default quest;
