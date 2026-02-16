import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-08',
  name: "Solen's Light Studies",
  category: 'side',
  act: 'act2',
  objectives: [
    { index: 0, description: 'Speak with Solen' },
    { index: 1, description: 'Investigate 4 flickering anomalies' },
    { index: 2, description: 'Broadcast Luminos-attuned fragment at archive' },
    { index: 3, description: 'Defeat Preserver patrol' },
    { index: 4, description: 'Return to Solen' },
  ],
  rewards: { gold: 300 },
  dependencies: ['MQ-05'],
  unlocks: [],
};

export default quest;
