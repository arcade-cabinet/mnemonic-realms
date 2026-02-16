import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'GQ-04',
  name: 'Recall Kinesis',
  category: 'god-recall',
  act: 'act2',
  objectives: [
    { index: 0, description: 'Climb to Kinesis Spire with Kinetic Boots' },
    { index: 1, description: 'Survive vibration gauntlet' },
    { index: 2, description: 'Watch the Peregrine Road recall vision' },
    { index: 3, description: 'Choose emotion and place potency 3+ fragment' },
    { index: 4, description: 'Witness Kinesis transformation' },
  ],
  rewards: {},
  dependencies: ['MQ-05'],
  unlocks: ['MQ-06'],
};

export default quest;
