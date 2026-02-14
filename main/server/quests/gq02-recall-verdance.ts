import {
  HookClient,
  QuestStep,
  RpgCommonPlayer,
  RpgEvent,
  RpgMap,
  type RpgPlayer,
  type RpgQuest,
  RpgSceneMap,
} from '@rpgjs/server';
import { Element, Emotion, Fragment } from '@rpgjs/types';

// Define custom types for quest variables if needed
declare module '@rpgjs/server' {
  export interface RpgPlayer {
    _quest_GQ_02_objective: number;
    _quest_GQ_02_emotion_chosen: Emotion | null;
    _quest_GQ_02_fragment_potency: number;
    _quest_GQ_02_root_puzzle_solved: boolean;
    _quest_GQ_02_vision_watched: boolean;
    _quest_GQ_02_transformation_witnessed: boolean;
    _quest_GQ_02_subclass_unlocked: boolean; // To track if subclass was unlocked by this quest
  }
}

export const quest: RpgQuest = {
  id: 'GQ-02',
  name: 'Recall Verdance',
  category: 'god-recall',
  act: 'act2',
  level: 12, // Minimum level to accept

  // Giver details
  giver: {
    id: 'wynn',
    map: 'shimmer_marsh',
    position: { x: 25, y: 35 },
  },

  // Trigger conditions for the quest to become available
  trigger: async (player: RpgPlayer) => {
    const mq05Complete = player.getQuest('MQ-05')?.isCompleted();
    const hermitsPathComplete = player.getQuest('GQ-01')?.isCompleted(); // Assuming GQ-01 is Hermit's Path
    const playerLevel = player.level;
    const playerMap = player.map;
    const playerX = player.position.x;
    const playerY = player.position.y;

    const isAtGiverLocation = playerMap === 'shimmer_marsh' && playerX === 25 && playerY === 35;

    return mq05Complete && hermitsPathComplete && playerLevel >= 12 && isAtGiverLocation;
  },

  // Quest objectives
  objectives: [
    {
      text: "Follow Wynn to Verdance's Hollow",
      onStart: async (player: RpgPlayer) => {
        player.setVariable('_quest_GQ_02_objective', 0);
        await player.showText(
          "Wynn leads you deeper into Shimmer Marsh, towards Verdance's Hollow. Stay close.",
        );
        // Trigger Wynn to move and player to follow, or simply check player's position later.
        // For simplicity, we'll assume the player moves to the hollow.
      },
      onComplete: async (player: RpgPlayer) => {
        await player.showText("You have arrived at Verdance's Hollow with Wynn.");
      },
      // This objective is completed when player reaches Verdance's Hollow (e.g., map change or specific coordinates)
      // For this example, we'll check for player's map and position.
      // In a real game, Wynn might be an event that moves and triggers this.
      // We'll use a custom check in the quest's onUpdate hook.
    },
    {
      text: 'Solve the root puzzle by broadcasting an Earth or Water fragment into the ancient root',
      onStart: async (player: RpgPlayer) => {
        player.setVariable('_quest_GQ_02_objective', 1);
        await player.showText(
          'Wynn points to a gnarled root pulsing with dormant energy. "This root needs a touch of life. Earth or Water, perhaps?"',
        );
      },
      onComplete: async (player: RpgPlayer) => {
        player.setVariable('_quest_GQ_02_root_puzzle_solved', true);
        await player.showText(
          "The root shimmers, its branches unfurling slightly. The path to Verdance's core is open.",
        );
      },
      // This objective is completed by a specific game action (broadcasting a fragment)
      // This would typically be handled by an event on the map that listens for broadcasts.
      // For this example, we'll simulate it with a player variable set by an external trigger.
    },
    {
      text: 'Watch the Rootwalker recall vision',
      onStart: async (player: RpgPlayer) => {
        player.setVariable('_quest_GQ_02_objective', 2);
        await player.showText(
          'A shimmering vision begins to coalesce around the root. Focus on the memory.',
        );
      },
      onComplete: async (player: RpgPlayer) => {
        player.setVariable('_quest_GQ_02_vision_watched', true);
        await player.showText(
          "The vision fades, leaving you with a profound sense of Verdance's past.",
        );
      },
      // This objective is completed after a cinematic or dialogue sequence.
      // We'll use a player variable set by an external trigger.
    },
    {
      text: 'Choose an emotion and place a Potency 3+ fragment into the core',
      onStart: async (player: RpgPlayer) => {
        player.setVariable('_quest_GQ_02_objective', 3);
        await player.showText(
          'Wynn gestures to the now-open core. "Verdance needs a strong emotional anchor to fully awaken. Choose wisely, Architect."',
        );
      },
      onComplete: async (player: RpgPlayer) => {
        await player.showText(
          `You have chosen to imbue Verdance with the essence of ${player.getVariable('_quest_GQ_02_emotion_chosen')}.`,
        );
      },
      // This objective requires player choice and a specific item interaction.
      // We'll use player variables set by an external trigger.
    },
    {
      text: "Witness Verdance's transformation",
      onStart: async (player: RpgPlayer) => {
        player.setVariable('_quest_GQ_02_objective', 4);
        await player.showText(
          'The core pulses with the energy of your chosen fragment. Verdance is stirring!',
        );
      },
      onComplete: async (player: RpgPlayer) => {
        player.setVariable('_quest_GQ_02_transformation_witnessed', true);
        await player.showText('Verdance has fully awakened, transformed by your actions.');
      },
      // This objective is completed after a final cinematic.
      // We'll use a player variable set by an external trigger.
    },
  ],

  // Rewards for completing the quest
  rewards: [
    {
      type: 'vibrancy',
      zone: 'shimmer_marsh',
      value: 15,
    },
    {
      type: 'unlock',
      name: 'Subclass branch',
      condition: (player: RpgPlayer) => !player.getVariable('_quest_GQ_02_subclass_unlocked'), // Only if it's the first recall
      onApply: async (player: RpgPlayer) => {
        player.setVariable('_quest_GQ_02_subclass_unlocked', true);
        await player.showText(
          'You feel a new path open within you. A subclass branch has been unlocked!',
        );
        // In a real game, this would trigger a UI for subclass selection or a new quest.
      },
    },
    // Specific rewards based on chosen emotion (these would be follow-up quests, not direct GQ-02 rewards)
    // We'll handle the unlocking of follow-up quests in the onComplete hook.
  ],

  // Dialogue to be displayed upon quest completion
  completionDialogue: async (player: RpgPlayer) => {
    const chosenEmotion = player.getVariable('_quest_GQ_02_emotion_chosen');
    let dialogue = '';
    let followUpQuestId = '';

    switch (chosenEmotion) {
      case Emotion.Joy:
        dialogue =
          'Floriana emerges from the newly vibrant Verdance, her eyes sparkling. "Such joy! The roots sing with new life. Come, Architect, let us celebrate this awakening!"';
        followUpQuestId = 'GQ-02-J1'; // The Rootway
        break;
      case Emotion.Fury:
        dialogue =
          'Thornweald\'s form solidifies, his gaze sharp and determined. "The forest remembers its strength. This fury will protect us. There is work to be done, Architect."';
        followUpQuestId = 'GQ-02-F1'; // The Reclamation
        break;
      case Emotion.Sorrow:
        dialogue =
          'Autumnus, cloaked in gentle melancholy, steps forward. "A profound sorrow, yet one that brings understanding. Verdance accepts its past. Perhaps now, we can truly heal."';
        followUpQuestId = 'GQ-02-S1'; // The Composting
        break;
      case Emotion.Awe:
        dialogue =
          'Sylvanos, majestic and serene, appears amidst glowing flora. "The grandeur of life, reborn. You have shown Verdance its true potential, Architect. The world watches in awe."';
        followUpQuestId = 'GQ-02-A1'; // The Mycorrhizal Map
        break;
      default:
        dialogue =
          'Verdance hums with renewed energy. Your actions have brought about a profound change.';
        break;
    }

    await player.showText(dialogue);
    if (followUpQuestId) {
      player.addQuest(followUpQuestId); // Add the next quest in the chain
      await player.showText(
        `Quest "${player.getQuest(followUpQuestId)?.name}" has been added to your log!`,
      );
    }
  },

  // Dependencies and unlocks
  dependencies: ['MQ-05'],
  unlocks: ['MQ-06'], // Main quest MQ-06 is unlocked after Verdance recall

  // Quest hooks for dynamic behavior
  onStart: async (player: RpgPlayer) => {
    player.setVariable('_quest_GQ_02_objective', 0);
    player.setVariable('_quest_GQ_02_root_puzzle_solved', false);
    player.setVariable('_quest_GQ_02_vision_watched', false);
    player.setVariable('_quest_GQ_02_emotion_chosen', null);
    player.setVariable('_quest_GQ_02_fragment_potency', 0);
    player.setVariable('_quest_GQ_02_transformation_witnessed', false);
    // Initialize subclass_unlocked if it doesn't exist, assuming it's a global flag for first recall
    if (player.getVariable('_quest_GQ_02_subclass_unlocked') === undefined) {
      player.setVariable('_quest_GQ_02_subclass_unlocked', false);
    }
    await player.showText(
      'Wynn greets you. "The time has come, Architect. Verdance calls. Follow me to the Hollow."',
    );
  },

  onUpdate: async (player: RpgPlayer, quest: RpgQuest) => {
    const currentObjective = player.getVariable('_quest_GQ_02_objective');
    const playerMap = player.map;
    const playerX = player.position.x;
    const playerY = player.position.y;

    // Objective 0: Follow Wynn to Verdance's Hollow
    if (
      currentObjective === 0 &&
      playerMap === 'verdances_hollow' &&
      playerX >= 10 &&
      playerX <= 20 &&
      playerY >= 10 &&
      playerY <= 20
    ) {
      // Assuming Verdance's Hollow is a map, and a specific area within it.
      // In a real game, Wynn (an event) would lead the player and trigger this.
      quest.getObjective(0).complete(player);
      player.setVariable('_quest_GQ_02_objective', 1); // Move to next objective
    }

    // Objective 1: Solve root puzzle
    // This would be triggered by an event on the map, e.g., 'root_puzzle_event'
    // Example: player.on('broadcastFragment', (fragment: Fragment) => { ... })
    // For now, we'll assume an external event sets _quest_GQ_02_root_puzzle_solved
    if (currentObjective === 1 && player.getVariable('_quest_GQ_02_root_puzzle_solved')) {
      quest.getObjective(1).complete(player);
      player.setVariable('_quest_GQ_02_objective', 2);
    }

    // Objective 2: Watch the Rootwalker recall vision
    // This would be triggered by a cinematic event.
    if (currentObjective === 2 && player.getVariable('_quest_GQ_02_vision_watched')) {
      quest.getObjective(2).complete(player);
      player.setVariable('_quest_GQ_02_objective', 3);
    }

    // Objective 3: Choose emotion and place Potency 3+ fragment
    // This would be triggered by an interaction with the core, presenting choices.
    // We assume _quest_GQ_02_emotion_chosen and _quest_GQ_02_fragment_potency are set by that interaction.
    if (
      currentObjective === 3 &&
      player.getVariable('_quest_GQ_02_emotion_chosen') &&
      player.getVariable('_quest_GQ_02_fragment_potency') >= 3
    ) {
      quest.getObjective(3).complete(player);
      player.setVariable('_quest_GQ_02_objective', 4);
    }

    // Objective 4: Witness Verdance transformation
    // This would be triggered by a final cinematic event.
    if (currentObjective === 4 && player.getVariable('_quest_GQ_02_transformation_witnessed')) {
      quest.getObjective(4).complete(player);
      quest.complete(player); // Complete the entire quest
    }
  },

  onComplete: async (player: RpgPlayer) => {
    await player.showText('Verdance has been recalled! The marsh hums with new life.');
    player.addQuest('MQ-06'); // Unlock the next main quest
    await player.showText('Main Quest "MQ-06" has been added to your log!');

    // Award Verdant Mantle (A-12)
    player.addItem('A-12', 1);
    await player.showText("You found a Verdant Mantle (A-12) in Verdance's Hollow!");
  },

  onAbandon: async (player: RpgPlayer) => {
    await player.showText(
      'You have abandoned the Recall Verdance quest. Verdance remains dormant.',
    );
    // Reset quest-specific variables if needed
    player.setVariable('_quest_GQ_02_objective', -1);
    player.setVariable('_quest_GQ_02_root_puzzle_solved', false);
    player.setVariable('_quest_GQ_02_vision_watched', false);
    player.setVariable('_quest_GQ_02_emotion_chosen', null);
    player.setVariable('_quest_GQ_02_fragment_potency', 0);
    player.setVariable('_quest_GQ_02_transformation_witnessed', false);
  },
};

// Helper function to simulate external events for testing/demonstration
// In a real game, these would be triggered by map events, NPC interactions, or UI choices.
export async function simulateQuestProgress(player: RpgPlayer, step: number, data?: any) {
  const questInstance = player.getQuest('GQ-02');
  if (!questInstance || !questInstance.isActive()) {
    console.warn('Quest GQ-02 is not active for player', player.id);
    return;
  }

  switch (step) {
    case 0: // Simulate player reaching Verdance's Hollow
      player.map = 'verdances_hollow'; // Change player's map
      player.position.x = 15; // Set player's position within the hollow
      player.position.y = 15;
      await player.callHook(HookClient.PlayerUpdate); // Trigger update to check position
      break;
    case 1: // Simulate root puzzle solved
      player.setVariable('_quest_GQ_02_root_puzzle_solved', true);
      await player.callHook(HookClient.PlayerUpdate);
      break;
    case 2: // Simulate vision watched
      player.setVariable('_quest_GQ_02_vision_watched', true);
      await player.callHook(HookClient.PlayerUpdate);
      break;
    case 3: // Simulate emotion choice and fragment placement
      if (data && data.emotion && data.potency) {
        player.setVariable('_quest_GQ_02_emotion_chosen', data.emotion);
        player.setVariable('_quest_GQ_02_fragment_potency', data.potency);
        await player.callHook(HookClient.PlayerUpdate);
      } else {
        console.warn('Missing emotion or potency for step 3 simulation.');
      }
      break;
    case 4: // Simulate transformation witnessed
      player.setVariable('_quest_GQ_02_transformation_witnessed', true);
      await player.callHook(HookClient.PlayerUpdate);
      break;
    default:
      console.warn('Invalid simulation step for GQ-02:', step);
  }
}
