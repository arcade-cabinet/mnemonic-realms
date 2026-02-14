import { QuestStep, RewardType, type RpgPlayer, RpgQuest } from '@rpgjs/server';

@RpgQuest<RpgPlayer>({
  id: 'SQ-10',
  name: 'The Depths Expedition',
  category: 'side',
  act: 'act2',
  level: '14-18',
  dependencies: ['MQ-05'],

  trigger(player: RpgPlayer) {
    const mq05Complete = player.getVariable('QUEST_MQ-05_STATE') === 'COMPLETED';
    const playerLevel = player.level;
    const minLevel = 14;

    if (!mq05Complete) {
      return false; // MQ-05 must be completed
    }
    if (playerLevel < minLevel) {
      return false; // Player must be level 14+
    }

    // Check if player is near Callum in Elder's House (optional, but good for immersion)
    // For a letter trigger, this might be less strict, but for "giver" it's good.
    // Assuming Callum is at Village Hub, Elder's House (18, 10)
    const playerMap = player.map;
    const playerX = player.position.x;
    const playerY = player.position.y;

    if (
      playerMap === 'village_hub' &&
      playerX >= 17 &&
      playerX <= 19 &&
      playerY >= 9 &&
      playerY <= 11
    ) {
      return true;
    }

    return false; // Not at the trigger location
  },

  // Quest giver dialogue (optional, can be handled by an NPC event)
  // For this quest, the trigger is more about the player being ready,
  // and Callum's dialogue initiates the first objective.

  steps: [
    {
      name: 'Speak with Callum about the Depths',
      text: 'Callum has discovered something about the ancient "Depths" and wants to discuss it. Find him at the Elder\'s House in the Village Hub.',
      onStart(player: RpgPlayer) {
        player.setVariable('SQ-10_OBJ_0_STARTED', true);
      },
      onComplete(player: RpgPlayer) {
        player.setVariable('SQ-10_OBJ_0_COMPLETED', true);
      },
      // This objective is completed by interacting with Callum's NPC and him giving the next step.
      // The NPC event for Callum would call player.setQuestStep('SQ-10', 1)
    },
    {
      name: 'Travel to Depths entrance',
      text: 'Callum believes the entrance to the Depths is hidden in the Memorial Garden. Search for a hidden passage around (8, 17).',
      onStart(player: RpgPlayer) {
        player.setVariable('SQ-10_OBJ_1_STARTED', true);
      },
      onComplete(player: RpgPlayer) {
        player.setVariable('SQ-10_OBJ_1_COMPLETED', true);
      },
      // This objective is completed by the player entering the Depths map.
      // The map entry event for 'depths_l1' would call player.setQuestStep('SQ-10', 2)
      // Or by interacting with a specific hidden passage event at (8,17) that teleports them.
      completion(player: RpgPlayer) {
        return player.map === 'depths_l1';
      },
    },
    {
      name: 'Navigate Depths Level 1',
      text: 'Explore Depths Level 1. There are rumors of ancient mechanisms and strange creatures within.',
      onStart(player: RpgPlayer) {
        player.setVariable('SQ-10_OBJ_2_STARTED', true);
      },
      onComplete(player: RpgPlayer) {
        player.setVariable('SQ-10_OBJ_2_COMPLETED', true);
      },
      // This objective is completed by reaching a specific point in Depths L1,
      // likely the entrance to the guardian's chamber.
      // An event in the 5th room of Depths L1 would call player.setQuestStep('SQ-10', 3)
      completion(player: RpgPlayer) {
        // Example: Player reaches a specific room/tile in depths_l1
        // This would be handled by an event on the map itself.
        // For now, we'll assume the boss fight trigger handles it.
        return player.getVariable('SQ-10_REACHED_GUARDIAN_CHAMBER') === true;
      },
    },
    {
      name: 'Defeat the Depths L1 floor guardian',
      text: 'A powerful guardian blocks the path deeper into the Depths. Defeat it to proceed.',
      onStart(player: RpgPlayer) {
        player.setVariable('SQ-10_OBJ_3_STARTED', true);
      },
      onComplete(player: RpgPlayer) {
        player.setVariable('SQ-10_OBJ_3_COMPLETED', true);
      },
      // This objective is completed when the boss is defeated.
      // The boss entity's onDeath event would call player.setQuestStep('SQ-10', 4)
      completion(player: RpgPlayer) {
        return player.getVariable('SQ-10_GUARDIAN_DEFEATED') === true;
      },
    },
    {
      name: 'Collect dissolved memory fragment',
      text: "The guardian's chamber should contain a dissolved memory fragment. Collect it.",
      onStart(player: RpgPlayer) {
        player.setVariable('SQ-10_OBJ_4_STARTED', true);
      },
      onComplete(player: RpgPlayer) {
        player.setVariable('SQ-10_OBJ_4_COMPLETED', true);
      },
      // This objective is completed by interacting with a specific object in the guardian's chamber.
      // The object's interaction event would call player.setQuestStep('SQ-10', 5)
      completion(player: RpgPlayer) {
        return player.getVariable('SQ-10_MEMORY_FRAGMENT_COLLECTED') === true;
      },
    },
    {
      name: 'Return to Callum',
      text: "You have the fragment. Return to Callum at the Elder's House in the Village Hub to report your findings.",
      onStart(player: RpgPlayer) {
        player.setVariable('SQ-10_OBJ_5_STARTED', true);
      },
      onComplete(player: RpgPlayer) {
        player.setVariable('SQ-10_OBJ_5_COMPLETED', true);
      },
      // This objective is completed by speaking to Callum again.
      // Callum's NPC event would check if this step is active and then call player.setQuestStep('SQ-10', 6)
      // which would trigger the quest completion.
      completion(player: RpgPlayer) {
        const playerMap = player.map;
        const playerX = player.position.x;
        const playerY = player.position.y;
        // Assuming Callum is at Village Hub, Elder's House (18, 10)
        return (
          playerMap === 'village_hub' &&
          playerX >= 17 &&
          playerX <= 19 &&
          playerY >= 9 &&
          playerY <= 11 &&
          player.getVariable('SQ-10_SPOKE_TO_CALLUM_AFTER_FRAGMENT') === true
        );
      },
    },
  ],

  rewards: [
    { type: RewardType.GOLD, value: 400 },
    { type: RewardType.ITEM, itemId: 'A-09', quantity: 1 }, // Frontier Guard
    { type: RewardType.FRAGMENT, emotion: 'Sorrow', element: 'Dark', potency: 3, quantity: 1 },
    { type: RewardType.FRAGMENT, emotion: 'Awe', element: 'Neutral', potency: 3, quantity: 1 },
  ],

  onComplete(player: RpgPlayer) {
    player.showText(
      "Callum: The Depths... I've read about them my entire life. The dissolved civilizations stored their densest memories underground — the things too important to scatter on the wind. What you found down there is just the beginning. There are deeper levels. More memories. And more danger.",
    );
    // No unlocks specified for this quest.
  },
})
export default class QuestTheDepthsExpedition {}
