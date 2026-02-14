import {
  Quest,
  RpgEvent,
  RpgItem,
  RpgItemFixture,
  RpgMap,
  type RpgPlayer,
  RpgSceneMap,
} from '@rpgjs/server';

@Quest({
  id: 'MQ-01',
  name: "The Architect's Awakening",
  category: 'main',
  act: 'act1',
  level: 1,
  dependencies: [],
  unlocks: ['MQ-02'],
})
export default class TheArchitectsAwakening extends Quest {
  onStart(player: RpgPlayer) {
    // Set initial quest state
    player.setVariable('MQ-01_PROGRESS', 0); // 0: Not started, 1: Objective 0 complete, etc.
    player.setVariable('MQ-01_ACTIVE', true);
    player.addQuest('MQ-01'); // Add to player's active quest log
  }

  onUpdate(player: RpgPlayer) {
    // This method is called whenever a variable changes or player state updates.
    // We use it to check objective progress.
    this.checkObjectives(player);
  }

  async checkObjectives(player: RpgPlayer) {
    const progress = player.getVariable('MQ-01_PROGRESS');
    const currentMap = player.map;
    const currentX = player.position.x;
    const currentY = player.position.y;

    // Objective 0: Speak with Callum at Elder's House
    if (progress === 0) {
      // This objective is typically completed via an event interaction.
      // For this tutorial quest, we'll assume the player is placed near Callum
      // and the initial dialogue triggers this.
      // The actual trigger would be in Callum's event script:
      // if (player.getVariable('MQ-01_PROGRESS') === 0) {
      //     await player.showDialog('Callum: Welcome, Architect. We have much to discuss.');
      //     player.setVariable('MQ-01_PROGRESS', 1);
      // }
      // For now, we'll simulate it if the player is at the right spot.
      if (currentMap === 'village_hub' && currentX === 18 && currentY === 10) {
        // In a real game, this would be triggered by interacting with Callum.
        // For the purpose of this quest file, we'll assume the interaction
        // has already happened or is about to happen.
        // Let's make it so that if they are at Callum's location, they complete it.
        // This is a simplification for the quest file itself.
        // The actual game logic would involve an event interaction.
        player.setVariable('MQ-01_PROGRESS', 1);
        await player.showDialog(
          'Callum: Welcome, Architect. We have much to discuss. Your journey begins now. Find Lira; she has something important for you.',
        );
        player.updateQuest('MQ-01', {
          description: "Receive Architect's Signet from Lira at her Workshop (8, 18).",
        });
      }
    }

    // Objective 1: Receive Architect's Signet from Lira
    if (progress === 1) {
      // This would be triggered by an interaction with Lira.
      // Lira's event script:
      // if (player.getVariable('MQ-01_PROGRESS') === 1) {
      //     await player.showDialog('Lira: Ah, you must be the new Architect. Callum told me you were coming. Here, take this. It will guide you.');
      //     player.addItem('K-01', 1); // Architect's Signet
      //     player.setVariable('MQ-01_PROGRESS', 2);
      // }
      // For this quest file, we'll simulate it if the player is at Lira's workshop.
      if (currentMap === 'village_hub' && currentX === 8 && currentY === 18) {
        if (!player.hasItem('K-01')) {
          // Check if player already has the signet
          await player.showDialog(
            'Lira: Ah, you must be the new Architect. Callum told me you were coming. Here, take this. It will guide you.',
          );
          player.addItem('K-01', 1); // Architect's Signet
          player.setVariable('MQ-01_PROGRESS', 2);
          player.updateQuest('MQ-01', {
            description: 'Collect your first memory fragment from the Memorial Garden (8, 16).',
          });
        }
      }
    }

    // Objective 2: Collect first fragment from Memorial Garden
    if (progress === 2) {
      // This would be triggered by interacting with a specific object/spot in the Memorial Garden.
      // Memorial Garden event script:
      // if (player.getVariable('MQ-01_PROGRESS') === 2) {
      //     await player.showDialog('You feel a faint hum from the ground. A memory fragment coalesces before you.');
      //     player.addItem('MF-01', 1); // Callum's First Lesson
      //     player.setVariable('MQ-01_PROGRESS', 3);
      // }
      // For this quest file, we'll simulate it if the player is at the Memorial Garden spot.
      if (currentMap === 'village_hub' && currentX === 8 && currentY === 16) {
        if (!player.hasItem('MF-01')) {
          // Check if player already has the fragment
          await player.showDialog(
            'You feel a faint hum from the ground. A memory fragment coalesces before you.',
          );
          player.addItem('MF-01', 1); // Callum's First Lesson
          player.setVariable('MQ-01_PROGRESS', 3);
          player.updateQuest('MQ-01', {
            description: "Return to Callum at the Elder's House (18, 10).",
          });
        }
      }
    }

    // Objective 3: Return to Callum
    if (progress === 3) {
      // This would be triggered by interacting with Callum again.
      // Callum's event script:
      // if (player.getVariable('MQ-01_PROGRESS') === 3) {
      //     await player.showDialog('Callum: There it is — that glow in your palm. You can feel it, can\'t you? The world remembering through you. This is what an Architect does. We listen, we gather, and we give back.');
      //     player.setVariable('MQ-01_PROGRESS', 4); // Mark quest as complete
      //     this.onComplete(player);
      // }
      // For this quest file, we'll simulate it if the player is at Callum's location.
      if (currentMap === 'village_hub' && currentX === 18 && currentY === 10) {
        player.setVariable('MQ-01_PROGRESS', 4); // Mark quest as complete
        this.onComplete(player);
      }
    }
  }

  async onComplete(player: RpgPlayer) {
    player.setVariable('MQ-01_ACTIVE', false);
    player.setVariable('MQ-01_COMPLETED', true);
    player.removeQuest('MQ-01'); // Remove from active quests
    player.addQuest('MQ-01', true); // Add to completed quests

    // Rewards
    if (!player.hasItem('K-01')) player.addItem('K-01', 1); // Architect's Signet (ensure it's there)
    if (!player.hasItem('MF-01')) player.addItem('MF-01', 1); // Callum's First Lesson (ensure it's there)
    player.addGold(50);

    // Completion Dialogue
    await player.showDialog(
      "Callum: There it is — that glow in your palm. You can feel it, can't you? The world remembering through you. This is what an Architect does. We listen, we gather, and we give back.",
    );

    // Unlock next quest
    player.unlockQuest('MQ-02');
  }

  // Optional: onAbandon, onFailure, etc.
  // For this tutorial quest, failure conditions are none.
}
