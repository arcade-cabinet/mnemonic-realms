import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-09',
  name: 'Harmonize the Path',
  category: 'side',
  act: 'act2',
  objectives: [
    { index: 0, description: 'Speak with Vess' },
    { index: 1, description: 'Broadcast into 3 dissonant Resonance Stones' },
    { index: 2, description: 'Open path to amphitheater' },
  ],
  rewards: { gold: 200 },
  dependencies: ['MQ-05'],
  unlocks: ['GQ-01'],
};

export default quest;
