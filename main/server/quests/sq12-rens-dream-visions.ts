import type { QuestFileExport } from '../systems/quests';

const quest: QuestFileExport = {
  id: 'SQ-12',
  name: "Nyro's Dream Visions",
  category: 'side',
  act: 'act2',
  objectives: [
    { index: 0, description: 'Speak with Nyro about dream visions' },
    { index: 1, description: 'Rest at the inn 5 total times (unique dream each time)' },
    { index: 2, description: 'After 5th dream, dream fragment materializes' },
    { index: 3, description: "Broadcast dream fragment at Inn's hearth Resonance Stone" },
    { index: 4, description: 'Witness permanent lore projection activation' },
  ],
  rewards: { gold: 250, items: [{ id: 'C-BF-05', qty: 3 }] },
  dependencies: ['MQ-05'],
  unlocks: [],
};

export default quest;
