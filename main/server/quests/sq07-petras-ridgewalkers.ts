import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-07',
  name: "Nel's Ridgewalkers",
  category: 'side',
  act: 'act2',
  objectives: [
    { index: 0, description: 'Speak with Nel' },
    { index: 1, description: 'Escort scouting party (3 patrol encounters)' },
    { index: 2, description: 'Reach Shattered Pass entrance (35, 30)' },
    { index: 3, description: 'Report to Nel' },
  ],
  rewards: { gold: 350, items: [{ id: 'A-08', qty: 1 }] },
  dependencies: ['MQ-05'],
  unlocks: [],
};

export default quest;
