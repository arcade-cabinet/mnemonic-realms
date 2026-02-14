import { Element, Emotion } from '@rpgjs/common';
import { type RpgPlayer, type RpgQuest, RpgSceneMap, RpgWorld } from '@rpgjs/server';

export default {
  id: 'GQ-04',
  name: 'Recall Kinesis',
  category: 'god-recall',
  act: 'act2',
  level: '14-18',
  giver: 'Petra',
  categoryName: 'God Recall',
  categoryColor: '#FFD700', // Gold for God Recall quests

  trigger: (player: RpgPlayer) => {
    const mq05Complete = player.getQuest('MQ-05')?.isCompleted();
    const hasKineticBoots = player.hasItem('K-05');
    const playerLevel = player.level;
    const playerMap = player.map;
    const playerPosition = player.position;

    return (
      mq05Complete &&
      hasKineticBoots &&
      playerLevel >= 14 &&
      playerLevel <= 18 &&
      playerMap === 'Hollow Ridge' &&
      playerPosition.x === 24 &&
      playerPosition.y === 10
    );
  },

  objectives: [
    {
      name: 'Climb to Kinesis Spire with Kinetic Boots',
      description: 'Equip the Kinetic Boots and reach the summit of Kinesis Spire.',
      onStart: (player: RpgPlayer) => {
        player.setVariable('GQ-04_climbedSpire', false);
      },
      onCheck: (player: RpgPlayer) => {
        // This objective is checked by a map event or specific location trigger
        return player.getVariable('GQ-04_climbedSpire');
      },
    },
    {
      name: 'Survive vibration gauntlet',
      description: "Navigate through the Kinesis Spire's vibration gauntlet.",
      onStart: (player: RpgPlayer) => {
        player.setVariable('GQ-04_gauntletSurvived', false);
      },
      onCheck: (player: RpgPlayer) => {
        // This objective is checked by a map event or specific location trigger
        return player.getVariable('GQ-04_gauntletSurvived');
      },
    },
    {
      name: 'Watch the Peregrine Road recall vision',
      description: 'Witness the memory vision of the Peregrine Road.',
      onStart: (player: RpgPlayer) => {
        player.setVariable('GQ-04_visionWatched', false);
      },
      onCheck: (player: RpgPlayer) => {
        // This objective is checked by a specific event trigger after the vision plays
        return player.getVariable('GQ-04_visionWatched');
      },
    },
    {
      name: 'Choose emotion and place potency 3+ fragment',
      description:
        "Select an emotion and broadcast a fragment of potency 3 or higher to guide Kinesis's recall.",
      onStart: (player: RpgPlayer) => {
        player.setVariable('GQ-04_emotionChosen', null); // Stores the chosen emotion (Joy, Fury, Sorrow, Awe)
        player.setVariable('GQ-04_fragmentPlaced', false);
      },
      onCheck: (player: RpgPlayer) => {
        // This objective is checked by a specific interaction event after fragment broadcast
        return player.getVariable('GQ-04_fragmentPlaced');
      },
    },
    {
      name: 'Witness Kinesis transformation',
      description: 'Observe the transformation of Kinesis based on your choice.',
      onStart: (player: RpgPlayer) => {
        player.setVariable('GQ-04_transformationWitnessed', false);
      },
      onCheck: (player: RpgPlayer) => {
        // This objective is checked by a specific event trigger after the transformation cinematic
        return player.getVariable('GQ-04_transformationWitnessed');
      },
    },
  ],

  rewards: [
    {
      name: 'Hollow Ridge Vibrancy +15',
      onReward: async (player: RpgPlayer) => {
        const hollowRidgeMap = RpgWorld.getMap('Hollow Ridge');
        if (hollowRidgeMap) {
          // Assuming a vibrancy system where maps have a vibrancy property
          // This would likely be handled by a global vibrancy manager or map-specific logic
          // For now, we'll simulate it or log it.
          console.log(`Hollow Ridge vibrancy increased by 15 for player ${player.name}.`);
          // Example: await RpgWorld.getMap('Hollow Ridge').increaseVibrancy(15);
        }
      },
    },
    {
      name: 'Unlock Subclass Branch',
      onReward: async (player: RpgPlayer) => {
        // Check if this is the player's first god recall quest completion
        const completedRecallQuests = player
          .getQuests()
          .filter((q) => q.category === 'god-recall' && q.isCompleted());
        if (completedRecallQuests.length === 1) {
          // This is the first one
          player.sendNotification('A new path opens! You can now choose a Subclass branch.', {
            color: 'gold',
            icon: 'fa-star',
          });
          // This would trigger a UI element or a new quest to select a subclass
          player.setVariable('unlockedSubclassBranch', true);
        }
      },
    },
  ],

  onComplete: async (player: RpgPlayer) => {
    const chosenEmotion = player.getVariable('GQ-04_emotionChosen');
    let completionDialogue = '';
    let nextQuestId = '';

    switch (chosenEmotion) {
      case Emotion.Joy:
        completionDialogue =
          'Zephira: "The Peregrine Road remembers joy. Your path is clear, Architect. Go, and let the wind guide you."';
        player.addQuest('GQ-04-J1'); // Unlock "The Peregrine Circuit"
        nextQuestId = 'GQ-04-J1';
        break;
      case Emotion.Fury:
        completionDialogue =
          'Tecton: "Kinesis roars with fury! The mountains shift to your will, Architect. Forge your own path through the earth."';
        player.addQuest('GQ-04-F1'); // Unlock "The Mountain's March"
        nextQuestId = 'GQ-04-F1';
        break;
      case Emotion.Sorrow:
        completionDialogue =
          'Stillara: "A quiet sorrow settles, yet Kinesis moves. The echoes of the past will guide your steps, Architect. Remember what was lost."';
        player.addQuest('GQ-04-S1'); // Unlock "The Footprints of the Peregrine"
        nextQuestId = 'GQ-04-S1';
        break;
      case Emotion.Awe:
        completionDialogue =
          'Orbitas: "The spire hums with awe! Kinesis embraces the boundless. Your journey is a marvel, Architect. Let the world unfold before you."';
        player.addQuest('GQ-04-A1'); // Unlock "The Perpetual Engine"
        nextQuestId = 'GQ-04-A1';
        break;
      default:
        completionDialogue = 'Kinesis hums with a new energy. Your choice has shaped its recall.';
        break;
    }

    await player.showText(completionDialogue);
    player.addQuest('MQ-06'); // Unlocks MQ-06 regardless of emotion choice
    player.sendNotification(`Quest "Recall Kinesis" completed!`, {
      color: 'green',
      icon: 'fa-check-circle',
    });
    if (nextQuestId) {
      player.sendNotification(`New quest unlocked: "${RpgWorld.getQuest(nextQuestId)?.name}"`, {
        color: 'blue',
        icon: 'fa-plus',
      });
    }
  },

  onAccept: async (player: RpgPlayer) => {
    await player.showText(
      'Petra: "The spire calls, Architect. With the Kinetic Boots, you can finally ascend. Be ready for what Kinesis reveals."',
    );
  },

  onAbandon: async (player: RpgPlayer) => {
    await player.showText(
      'Petra: "The spire will wait, but Kinesis\'s memory fades with time. Return when you are ready."',
    );
  },
} as RpgQuest;
