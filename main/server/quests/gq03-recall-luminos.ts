import { Quest, RpgMap, type RpgPlayer, RpgServer } from '@rpgjs/server';
import { QuestStep } from '@rpgjs/server/lib/quests/quest';

export enum LuminosRecallQuestVariables {
  HAS_LIGHT_LENS = 'GQ-03_HAS_LIGHT_LENS',
  ENTERED_GROVE = 'GQ-03_ENTERED_GROVE',
  NAVIGATED_CORRIDOR = 'GQ-03_NAVIGATED_CORRIDOR',
  WATCHED_VISION = 'GQ-03_WATCHED_VISION',
  CHOSEN_EMOTION = 'GQ-03_CHOSEN_EMOTION',
  LUMINOS_TRANSFORMED = 'GQ-03_LUMINOS_TRANSFORMED',
  RECALL_TYPE = 'GQ-03_RECALL_TYPE', // Stores 'Joy', 'Fury', 'Sorrow', 'Awe'
  IS_FIRST_RECALL = 'GLOBAL_IS_FIRST_RECALL', // Global variable to check if this is the player's first god recall
  SUBCLASS_UNLOCKED = 'GLOBAL_SUBCLASS_UNLOCKED', // Global variable to track subclass unlock
}

@Quest({
  id: 'GQ-03',
  name: 'Recall Luminos',
  category: 'god-recall',
  act: 'act2',
  level: 14, // Minimum level
  rewards: [
    {
      // Flickerveil vibrancy +15
      gain(player: RpgPlayer) {
        const map = RpgServer.getMap('Flickerveil');
        if (map) {
          map.setVariable('vibrancy', (map.getVariable('vibrancy') || 0) + 15);
          player.sendNotification('Flickerveil vibrancy increased by 15!');
        }
      },
    },
    {
      // Unlock Subclass branch (if first recall)
      gain(player: RpgPlayer) {
        if (player.getVariable(LuminosRecallQuestVariables.IS_FIRST_RECALL) === true) {
          player.setVariable(LuminosRecallQuestVariables.SUBCLASS_UNLOCKED, true);
          player.sendNotification('Subclass branch unlocked! Visit Lira to explore new paths.');
          // Set global flag to false for subsequent recalls
          player.setVariable(LuminosRecallQuestVariables.IS_FIRST_RECALL, false);
        }
      },
    },
  ],
  completionDialogue(player: RpgPlayer): string {
    const recallType = player.getVariable(LuminosRecallQuestVariables.RECALL_TYPE);
    switch (recallType) {
      case 'Joy':
        return "The grove hums with Solara's joy. A new dawn breaks, Architect. The world remembers.";
      case 'Fury':
        return "Pyralis's fury burns bright, cleansing the shadows. The truth will be forged in fire, Architect.";
      case 'Sorrow':
        return "Vesperis's sorrow echoes, a poignant reminder of what was lost. But in remembrance, there is strength, Architect.";
      case 'Awe':
        return "Prisma's awe illuminates the grove, revealing the spectrum of truth. The world is a canvas, Architect, ready for new colors.";
      default:
        return 'Luminos has been recalled. The light returns to the world, Architect.';
    }
  },
  dependencies: ['MQ-05'], // Main Quest 05 must be complete
  unlocks: ['MQ-06'], // Unlocks Main Quest 06
})
export default class RecallLuminosQuest extends Quest<RpgPlayer> {
  onStart(player: RpgPlayer) {
    // Check if this is the player's first god recall
    if (player.getVariable(LuminosRecallQuestVariables.IS_FIRST_RECALL) === undefined) {
      player.setVariable(LuminosRecallQuestVariables.IS_FIRST_RECALL, true);
    }

    // Initial check for Light Lens
    if (player.hasItem('K-04')) {
      player.setVariable(LuminosRecallQuestVariables.HAS_LIGHT_LENS, true);
    } else {
      player.setVariable(LuminosRecallQuestVariables.HAS_LIGHT_LENS, false);
    }
  }

  onAdd(player: RpgPlayer) {
    player.sendNotification('New Quest: Recall Luminos');
  }

  onRemove(player: RpgPlayer) {
    player.sendNotification('Quest Removed: Recall Luminos');
  }

  onUpdate(player: RpgPlayer) {
    // Check if player has Light Lens (K-04)
    if (!player.getVariable(LuminosRecallQuestVariables.HAS_LIGHT_LENS) && player.hasItem('K-04')) {
      player.setVariable(LuminosRecallQuestVariables.HAS_LIGHT_LENS, true);
      player.sendNotification('You now possess the Light Lens. Luminos Grove awaits.');
    }
  }

  onDead(player: RpgPlayer) {
    // No specific failure conditions for this quest on death.
    // Player can retry objectives.
  }

  // Giver: Solen at Flickerveil — Luminos Grove (20, 20)
  // Trigger: MQ-05 complete, Light Lens (K-04) obtained
  canStart(player: RpgPlayer): boolean {
    const mq05Status = player.getQuest('MQ-05')?.state;
    const hasLightLens = player.hasItem('K-04');
    const playerLevel = player.level;

    return mq05Status === 'completed' && hasLightLens && playerLevel >= 14 && playerLevel <= 18;
  }

  // Objective 0: Enter Luminos Grove with Light Lens
  @QuestStep({
    name: 'Enter Luminos Grove',
    description: 'Enter Luminos Grove (20, 20) with the Light Lens (K-04) in your inventory.',
    onStart(player: RpgPlayer) {
      player.setVariable(LuminosRecallQuestVariables.ENTERED_GROVE, false);
    },
    onUpdate(player: RpgPlayer) {
      const map = player.map;
      const x = player.position.x;
      const y = player.position.y;

      if (map?.id === 'Flickerveil' && x === 20 && y === 20 && player.hasItem('K-04')) {
        player.setVariable(LuminosRecallQuestVariables.ENTERED_GROVE, true);
        player.sendNotification('You have entered Luminos Grove. The Light Lens protects you.');
      }
    },
    completion(player: RpgPlayer): boolean {
      return player.getVariable(LuminosRecallQuestVariables.ENTERED_GROVE) === true;
    },
  })
  objective0: any;

  // Objective 1: Navigate light corridor to prism
  @QuestStep({
    name: 'Navigate Light Corridor',
    description:
      'Find your way through the light-infused corridor to the central prism within Luminos Grove.',
    onStart(player: RpgPlayer) {
      player.setVariable(LuminosRecallQuestVariables.NAVIGATED_CORRIDOR, false);
      // Example: Set up an event on the map that triggers this objective completion
      // This would typically be an event at the end of the corridor.
      // For this example, we'll simulate it with a specific coordinate.
      // In a real game, this would be an interaction with a specific map event.
    },
    onUpdate(player: RpgPlayer) {
      const map = player.map;
      const x = player.position.x;
      const y = player.position.y;

      // Simulate reaching the prism location within Luminos Grove
      if (map?.id === 'Flickerveil' && x === 25 && y === 15) {
        // Example coordinates for the prism
        player.setVariable(LuminosRecallQuestVariables.NAVIGATED_CORRIDOR, true);
        player.sendNotification(
          'You have reached the central prism. The light pulses with ancient energy.',
        );
      }
    },
    completion(player: RpgPlayer): boolean {
      return player.getVariable(LuminosRecallQuestVariables.NAVIGATED_CORRIDOR) === true;
    },
  })
  objective1: any;

  // Objective 2: Watch the Radiant Lens recall vision
  @QuestStep({
    name: 'Witness Recall Vision',
    description:
      'Interact with the central prism to witness the Radiant Lens recall vision (MF-07).',
    onStart(player: RpgPlayer) {
      player.setVariable(LuminosRecallQuestVariables.WATCHED_VISION, false);
      // This would typically be triggered by an interaction with the prism event.
      // The event would play a cinematic or dialogue sequence.
      // After the cinematic, the event would call player.setVariable(WATCHED_VISION, true);
    },
    onUpdate(player: RpgPlayer) {
      // Simulate vision completion via a game event or direct call
      // For example, an event script might do:
      // player.showCinematic('radiant_lens_vision');
      // player.addFragment('MF-07'); // Add the Radiant Lens Theorem fragment
      // player.setVariable(LuminosRecallQuestVariables.WATCHED_VISION, true);
      // For now, we'll assume a direct trigger for testing.
      if (player.getVariable(LuminosRecallQuestVariables.WATCHED_VISION) === undefined) {
        // Simulate the vision playing and fragment acquisition
        player.addFragment('MF-07'); // Radiant Lens Theorem
        player.setVariable(LuminosRecallQuestVariables.WATCHED_VISION, true);
        player.sendNotification(
          'The Radiant Lens vision unfolds before you, revealing ancient truths.',
        );
      }
    },
    completion(player: RpgPlayer): boolean {
      return player.getVariable(LuminosRecallQuestVariables.WATCHED_VISION) === true;
    },
  })
  objective2: any;

  // Objective 3: Choose emotion and place potency 3+ fragment
  @QuestStep({
    name: 'Choose Emotion and Broadcast Fragment',
    description:
      "Choose an emotion (Joy, Fury, Sorrow, or Awe) and broadcast a fragment of potency 3 or higher to influence Luminos's recall.",
    onStart(player: RpgPlayer) {
      player.setVariable(LuminosRecallQuestVariables.CHOSEN_EMOTION, false);
      // This step requires player input and a specific action (broadcasting a fragment).
      // This would typically be handled by a dialogue choice or a special UI for god recall.
      // The UI would allow selecting an emotion and then a fragment from inventory.
      // Upon selection and "broadcast", the game would call:
      // player.setVariable(LuminosRecallQuestVariables.RECALL_TYPE, chosenEmotion);
      // player.setVariable(LuminosRecallQuestVariables.CHOSEN_EMOTION, true);
      // player.removeFragment(fragmentId); // Consume the fragment
    },
    onUpdate(player: RpgPlayer) {
      // This objective is completed when the player successfully broadcasts a fragment
      // of potency 3+ with a chosen emotion.
      // We'll simulate this with a placeholder variable.
      // In a real game, this would be tied to the fragment broadcasting system.
      if (player.getVariable(LuminosRecallQuestVariables.CHOSEN_EMOTION) === undefined) {
        // Simulate player choosing 'Joy' and broadcasting a suitable fragment
        // For example, if player has MF-02 (Joy/Light/3)
        if (player.hasFragment('MF-02')) {
          // Assuming MF-02 is available and meets criteria
          player.setVariable(LuminosRecallQuestVariables.RECALL_TYPE, 'Joy');
          player.setVariable(LuminosRecallQuestVariables.CHOSEN_EMOTION, true);
          player.removeFragment('MF-02'); // Consume the fragment
          player.sendNotification("You broadcast a fragment of Joy, influencing Luminos's recall.");
        } else {
          // Fallback if no specific fragment is available for simulation, or if player needs to acquire one.
          // In a real game, the UI would guide the player.
          // For now, let's just force a choice for testing if no fragment is available.
          if (player.getVariable(LuminosRecallQuestVariables.CHOSEN_EMOTION) === false) {
            player.setVariable(LuminosRecallQuestVariables.RECALL_TYPE, 'Awe'); // Default to Awe for simulation
            player.setVariable(LuminosRecallQuestVariables.CHOSEN_EMOTION, true);
            player.sendNotification(
              "You broadcast a powerful fragment, influencing Luminos's recall with Awe.",
            );
          }
        }
      }
    },
    completion(player: RpgPlayer): boolean {
      return player.getVariable(LuminosRecallQuestVariables.CHOSEN_EMOTION) === true;
    },
  })
  objective3: any;

  // Objective 4: Witness Luminos transformation
  @QuestStep({
    name: 'Witness Luminos Transformation',
    description: "Observe Luminos's transformation based on the emotion you broadcasted.",
    onStart(player: RpgPlayer) {
      player.setVariable(LuminosRecallQuestVariables.LUMINOS_TRANSFORMED, false);
      // This would be a cinematic or a series of events/dialogue after the fragment broadcast.
      // The game would show Luminos transforming into Solara, Pyralis, Vesperis, or Prisma.
      // After the transformation sequence, the game would call:
      // player.setVariable(LuminosRecallQuestVariables.LUMINOS_TRANSFORMED, true);
    },
    onUpdate(player: RpgPlayer) {
      if (player.getVariable(LuminosRecallQuestVariables.LUMINOS_TRANSFORMED) === undefined) {
        player.setVariable(LuminosRecallQuestVariables.LUMINOS_TRANSFORMED, true);
        player.sendNotification(
          'Luminos transforms, embodying the chosen emotion. The god has been recalled!',
        );
      }
    },
    completion(player: RpgPlayer): boolean {
      return player.getVariable(LuminosRecallQuestVariables.LUMINOS_TRANSFORMED) === true;
    },
  })
  objective4: any;
}
