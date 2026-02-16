import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-11',
  name: "Hark's Masterwork",
  category: 'side',
  act: 'act2',
  objectives: [
    { index: 0, description: 'Speak with Hark at the Blacksmith' },
    { index: 1, description: 'Collect Crag Golem core from Sunridge' },
    { index: 2, description: 'Collect Crystal Shard from Preserver Agent/Captain' },
    { index: 3, description: 'Collect Dissolved Metal from Depths Level 2' },
    { index: 4, description: 'Bring materials to Hark' },
    { index: 5, description: 'Wait 1 in-game day for forging' },
    { index: 6, description: 'Collect class-specific masterwork weapon' },
  ],
  rewards: {},
  dependencies: [],
  unlocks: [],
};

export default quest;
