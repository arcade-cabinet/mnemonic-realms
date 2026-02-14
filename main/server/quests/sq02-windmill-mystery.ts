import type { RpgQuestObjective, RpgQuestReward } from '@rpgjs/common';
import { type RpgPlayer, RpgQuest, RpgQuestStep } from '@rpgjs/server';

export default class WindmillMysteryQuest extends RpgQuest {
  id = 'SQ-02';
  name = 'The Windmill Mystery';
  category = 'side';
  act = 'act1';
  level = {
    min: 3,
    max: 5,
  };
  giver = {
    name: 'Farmer Gale',
    map: 'Heartfield Hamlet',
    x: 15,
    y: 15,
  };
  dependencies = ['MQ-03'];
  unlocks = [];

  trigger(player: RpgPlayer): boolean {
    // Quest triggers when MQ-03 is completed
    return player.getQuestProgress('MQ-03') === RpgQuestStep.Completed;
  }

  objectives: RpgQuestObjective[] = [
    {
      id: 'speak_farmer',
      text: 'Speak with Farmer Gale at Heartfield Hamlet',
      completion: async (player: RpgPlayer) => player.getVariable('SQ-02_OBJ_0_COMPLETE') === true,
    },
    {
      id: 'travel_windmill',
      text: 'Travel to the Old Windmill (30, 8)',
      completion: async (player: RpgPlayer) => player.getVariable('SQ-02_OBJ_1_COMPLETE') === true,
    },
    {
      id: 'defeat_memory',
      text: 'Defeat the Dissolved Memory encounter inside the Old Windmill',
      completion: async (player: RpgPlayer) => player.getVariable('SQ-02_OBJ_2_COMPLETE') === true,
    },
    {
      id: 'collect_fragment',
      text: "Collect the memory fragment sealed in the windmill's grinding stone",
      completion: async (player: RpgPlayer) => player.getVariable('SQ-02_OBJ_3_COMPLETE') === true,
    },
    {
      id: 'return_farmer',
      text: 'Return to Farmer Gale at Heartfield Hamlet',
      completion: async (player: RpgPlayer) => player.getVariable('SQ-02_OBJ_4_COMPLETE') === true,
    },
  ];

  rewards: RpgQuestReward[] = [
    { type: 'gold', value: 100 },
    { type: 'item', itemId: 'W-DG-03', quantity: 1 }, // Windmill Blade
    { type: 'fragment', emotion: 'Awe', element: 'Wind', potency: 2 }, // Awe/Wind Fragment (2-star)
  ];

  async onComplete(player: RpgPlayer) {
    await player.showText(
      "Farmer: The groaning's stopped. Whatever was caught in there... you freed it. That blade was stuck in the grinding stone — been there since before my grandparents settled here. Feels right that you should have it.",
    );
  }
}
