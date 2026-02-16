import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-13',
  name: "The Dissolved Choir's Instruments",
  category: 'side',
  act: 'act2',
  objectives: [
    { index: 0, description: "Return to Listener's Camp after Resonance recall" },
    { index: 1, description: 'Learn about awakened Choir Instruments' },
    { index: 2, description: 'Find 5 Choir Instruments in Settled Lands Resonance Stones' },
    { index: 3, description: 'Bring all 5 instruments to the Amphitheater (25, 25)' },
  ],
  rewards: { gold: 500, items: [{ id: 'C-SP-08', qty: 3 }] },
  dependencies: ['SQ-09', 'GQ-01'],
  unlocks: [],
};

export default quest;
