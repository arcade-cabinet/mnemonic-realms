import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'MQ-04',
  name: 'The Stagnation',
  category: 'main',
  act: 'act1',
  objectives: [
    { index: 0, description: 'Travel to Stagnation Clearing', location: 'Heartfield', position: '35,30' },
    { index: 1, description: 'Witness Hana investigating' },
    { index: 2, description: 'Survive Preserver patrol combat' },
    { index: 3, description: "Watch Hana's freezing cutscene" },
    { index: 4, description: "Collect Hana's Scream (MF-04)" },
    { index: 5, description: 'Broadcast potency 2+ fragment to halt expansion' },
    { index: 6, description: 'Return to Artun', location: 'Village Hub' },
  ],
  rewards: { gold: 150 },
  dependencies: ['MQ-03'],
  unlocks: ['MQ-05', 'SQ-05'],
};

export default quest;
