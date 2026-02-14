import { Quest, type RpgMap, type RpgPlayer, RpgSceneMap } from '@rpgjs/server';

export interface PlayerVariables extends RpgPlayer {
  _quests: { [key: string]: number };
  _godsRecalled: number;
  _completedQuests: { [key: string]: boolean };
  _level: number;
  _map: RpgMap;
}

@Quest({
  id: 'MQ-07',
  name: "The Curator's Endgame",
  category: 'main',
  act: 'act2',
  level: '16-20',
  giver: 'Callum',
  trigger: (player: PlayerVariables) => {
    const godsRecalled = player.getVariable('_godsRecalled') || 0;
    const sq05Complete = player.getVariable('_completedQuests')?.['SQ-05'] || false;
    const mq06Complete = player.getVariable('_completedQuests')?.['MQ-06'] || false;
    const playerLevel = player.getVariable('_level') || 0;
    const playerMap = player.getVariable('_map')?.id;

    return (
      godsRecalled >= 1 &&
      sq05Complete &&
      mq06Complete &&
      playerLevel >= 16 &&
      playerLevel <= 20 &&
      playerMap === 'village_hub' // Assuming Callum is at Elder's House in Village Hub
    );
  },
  objectives: [
    {
      text: 'Return to Village Hub and speak with Callum',
      condition: (player: PlayerVariables) => player.getVariable('MQ-07_OBJ0_COMPLETE') === true,
    },
    {
      text: "Learn about Curator's plan for First Memory",
      condition: (player: PlayerVariables) => player.getVariable('MQ-07_OBJ1_COMPLETE') === true,
    },
    {
      text: 'Speak with Aric',
      condition: (player: PlayerVariables) => player.getVariable('MQ-07_OBJ2_COMPLETE') === true,
    },
    {
      text: 'Recall at least 2 total gods',
      condition: (player: PlayerVariables) => (player.getVariable('_godsRecalled') || 0) >= 2,
    },
    {
      text: 'Return to Callum for expedition plan',
      condition: (player: PlayerVariables) => player.getVariable('MQ-07_OBJ4_COMPLETE') === true,
    },
  ],
  rewards: [
    { value: 500, type: 'gold' },
    { itemId: 'C-HP-03', quantity: 5, type: 'item' }, // High Potion
    { itemId: 'C-SP-03', quantity: 3, type: 'item' }, // Mana Surge
  ],
  completionDialogue: [
    {
      speaker: 'Callum',
      text: "The First Memory. The original seed that started everything. If the Curator crystallizes it, the world doesn't just stop growing — it stops being a world. It becomes a museum. Beautiful. Perfect. Dead. You need to reach it first. The fortress is in the Undrawn Peaks — through the Sketch. It's unfinished land out there. You'll have to remember it into existence as you go.",
    },
  ],
  dependencies: ['MQ-06', 'SQ-05'],
  unlocks: ['MQ-08'],
})
export default class QuestTheCuratorsEndgame extends Quest {
  onStart(player: PlayerVariables) {
    player.setVariable('MQ-07_OBJ0_COMPLETE', false);
    player.setVariable('MQ-07_OBJ1_COMPLETE', false);
    player.setVariable('MQ-07_OBJ2_COMPLETE', false);
    player.setVariable('MQ-07_OBJ4_COMPLETE', false);
    player.setQuest('MQ-07', 0); // Set quest to active, objective 0
  }

  onUpdate(player: PlayerVariables) {
    const currentObjective = player.getQuest('MQ-07');

    // Objective 0: Return to Village Hub and speak with Callum
    if (currentObjective === 0 && player.getVariable('MQ-07_OBJ0_COMPLETE')) {
      player.setQuest('MQ-07', 1);
    }

    // Objective 1: Learn about Curator's plan for First Memory
    if (currentObjective === 1 && player.getVariable('MQ-07_OBJ1_COMPLETE')) {
      player.setQuest('MQ-07', 2);
    }

    // Objective 2: Speak with Aric
    if (currentObjective === 2 && player.getVariable('MQ-07_OBJ2_COMPLETE')) {
      player.setQuest('MQ-07', 3);
    }

    // Objective 3: Recall at least 2 total gods
    if (currentObjective === 3 && (player.getVariable('_godsRecalled') || 0) >= 2) {
      player.setQuest('MQ-07', 4);
    }

    // Objective 4: Return to Callum for expedition plan
    if (currentObjective === 4 && player.getVariable('MQ-07_OBJ4_COMPLETE')) {
      this.onComplete(player);
    }
  }

  onComplete(player: PlayerVariables) {
    player.addGold(500);
    player.addItem('C-HP-03', 5);
    player.addItem('C-SP-03', 3);
    player.showText(this.completionDialogue[0].speaker + ': ' + this.completionDialogue[0].text);

    const completedQuests = player.getVariable('_completedQuests') || {};
    completedQuests['MQ-07'] = true;
    player.setVariable('_completedQuests', completedQuests);

    // Unlock dependent quests
    const unlockedQuests = player.getVariable('_unlockedQuests') || {};
    unlockedQuests['MQ-08'] = true;
    player.setVariable('_unlockedQuests', unlockedQuests);

    player.setQuest('MQ-07', 5); // Mark quest as completed
  }

  onFailure(player: PlayerVariables) {
    // No failure conditions for this quest
  }
}
