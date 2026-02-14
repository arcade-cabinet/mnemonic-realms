import {
  QuestCompletionCondition,
  QuestReward,
  QuestStep,
  type RpgPlayer,
  RpgQuest,
} from '@rpgjs/server';
import { PreserverFortressMap } from '../maps/preserver-fortress'; // Assuming a map definition exists

@RpgQuest({
  id: 'MQ-09',
  name: 'The Preserver Fortress',
  category: 'main',
  act: 'act3',
  level: 24, // Minimum level
  rewards: [
    { item: 'MF-09', quantity: 1 }, // Curator's Grief
    { item: 'MF-10', quantity: 1 }, // The First Memory
    { gold: 800 },
    { item: 'A-14', quantity: 1 }, // Memory-Woven Plate (found in Depths L5, but listed as quest reward)
  ],
  completionCondition: QuestCompletionCondition.ALL_OBJECTIVES,
  dependencies: ['MQ-08'],
  unlocks: ['MQ-10'],
})
export default class ThePreserverFortressQuest {
  // Quest Giver: Automatic at Preserver Fortress entrance (triggered by MQ-08 completion)

  onStart(player: RpgPlayer) {
    player.addQuest('MQ-09');
    player.setVariable('MQ-09_OBJ_0_STATUS', 'active'); // Floor 1
    player.setVariable('MQ-09_OBJ_1_STATUS', 'inactive'); // Floor 2
    player.setVariable('MQ-09_OBJ_2_STATUS', 'inactive'); // Floor 3
    player.setVariable('MQ-09_OBJ_3_STATUS', 'inactive'); // Confront Curator
    player.setVariable('MQ-09_OBJ_4_STATUS', 'inactive'); // Collect First Memory
    player.showNotification('New Quest: The Preserver Fortress');
  }

  @QuestStep(0, {
    name: 'Navigate Floor 1: Crystal Gallery',
    description:
      "Find your way through the Crystal Gallery, dealing with Preserver patrols and solving the resonance puzzle. Don't forget to look for the Phoenix Feather!",
    onCheck: (player: RpgPlayer) => {
      // This objective is completed when the player reaches the entrance to Floor 2
      return player.getVariable('MQ-09_FLOOR1_CLEARED') === true;
    },
    onComplete: (player: RpgPlayer) => {
      player.setVariable('MQ-09_OBJ_0_STATUS', 'completed');
      player.setVariable('MQ-09_OBJ_1_STATUS', 'active');
      player.showNotification('Objective Complete: Floor 1 navigated.');
    },
  })
  floor1Navigation(player: RpgPlayer) {
    // This method is a placeholder. Actual logic for clearing Floor 1 (defeating patrols, solving puzzle, finding item)
    // would be handled by event scripts on the map itself, setting 'MQ-09_FLOOR1_CLEARED' to true.
    // Example:
    // In a map event script for the F1-F2 transition:
    // if (player.getQuest('MQ-09')?.isActive()) {
    //     player.setVariable('MQ-09_FLOOR1_CLEARED', true);
    //     player.updateQuest('MQ-09'); // This will trigger onCheck for objective 0
    // }
    // Example for Phoenix Feather (C-SP-10)
    // In a map event script for the hidden alcove:
    // if (player.getQuest('MQ-09')?.isActive() && !player.hasItem('C-SP-10')) {
    //     player.addItem('C-SP-10');
    //     player.showNotification('Found Phoenix Feather!');
    // }
  }

  @QuestStep(1, {
    name: 'Navigate Floor 2: Archive of Perfection',
    description:
      "Traverse the Archive of Perfection, witness the frozen moments, collect the Curator's Grief, and defeat the Preserver Captain.",
    onCheck: (player: RpgPlayer) => {
      // This objective is completed when the player defeats the Preserver Captain and collects MF-09
      return player.getVariable('MQ-09_CAPTAIN_DEFEATED') === true && player.hasItem('MF-09');
    },
    onComplete: (player: RpgPlayer) => {
      player.setVariable('MQ-09_OBJ_1_STATUS', 'completed');
      player.setVariable('MQ-09_OBJ_2_STATUS', 'active');
      player.showNotification('Objective Complete: Floor 2 navigated.');
    },
  })
  floor2Navigation(player: RpgPlayer) {
    // Logic for Floor 2:
    // - Witnessing vignettes: Handled by map events, possibly setting a variable like 'MQ-09_VIGNETTES_SEEN'
    // - Collecting MF-09: Handled by an item interaction event on the pedestal.
    //   Example:
    //   if (player.getQuest('MQ-09')?.isActive() && !player.hasItem('MF-09')) {
    //       player.addItem('MF-09');
    //       player.showNotification('Collected The Curator\'s Grief!');
    //       player.updateQuest('MQ-09'); // Trigger onCheck
    //   }
    // - Defeating Preserver Captain: Handled by the combat system.
    //   Example: In the Preserver Captain's onDead hook:
    //   if (player.getQuest('MQ-09')?.isActive()) {
    //       player.setVariable('MQ-09_CAPTAIN_DEFEATED', true);
    //       player.updateQuest('MQ-09'); // Trigger onCheck
    //   }
    // Failure condition: Respawn at F2 entrance if defeated by Preserver Captain
    // This would be handled in the game's global onPlayerDead hook or specific enemy script.
    // Example:
    // if (player.getQuest('MQ-09')?.isActive() && enemy.id === 'PreserverCaptain') {
    //     player.changeMap(PreserverFortressMap.id, 'f2_entrance_spawn_point');
    //     player.hp = player.param.maxHp;
    //     player.sp = player.param.maxSp;
    //     player.showNotification('You were defeated, but the Fortress allows you to try again from the Archive entrance.');
    // }
  }

  @QuestStep(2, {
    name: 'Navigate Floor 3: First Memory Chamber',
    description: 'Reach the First Memory Chamber on the third floor.',
    onCheck: (player: RpgPlayer) => {
      // This objective is completed when the player enters the First Memory Chamber
      return player.getVariable('MQ-09_ENTERED_F3_CHAMBER') === true;
    },
    onComplete: (player: RpgPlayer) => {
      player.setVariable('MQ-09_OBJ_2_STATUS', 'completed');
      player.setVariable('MQ-09_OBJ_3_STATUS', 'active');
      player.showNotification('Objective Complete: Floor 3 reached.');
    },
  })
  floor3Navigation(player: RpgPlayer) {
    // Logic for entering Floor 3 chamber.
    // Example:
    // In a map event script for the F2-F3 transition or F3 chamber entrance:
    // if (player.getQuest('MQ-09')?.isActive()) {
    //     player.setVariable('MQ-09_ENTERED_F3_CHAMBER', true);
    //     player.updateQuest('MQ-09'); // This will trigger onCheck for objective 2
    // }
  }

  @QuestStep(3, {
    name: 'Confront the Curator',
    description:
      'Engage the Curator in a dialogue, challenging their philosophy with your collected memories and arguments.',
    onCheck: (player: RpgPlayer) => {
      // This objective is completed after the dialogue sequence with the Curator is finished.
      return player.getVariable('MQ-09_CURATOR_CONFRONTED') === true;
    },
    onComplete: (player: RpgPlayer) => {
      player.setVariable('MQ-09_OBJ_3_STATUS', 'completed');
      player.setVariable('MQ-09_OBJ_4_STATUS', 'active');
      player.showNotification('Objective Complete: Curator confronted.');
    },
  })
  confrontCurator(player: RpgPlayer) {
    // This would be a complex dialogue event.
    // Example:
    // In the Curator NPC's dialogue script:
    // async function curatorDialogue(player: RpgPlayer) {
    //     await player.showText('The Curator: "You\'ve walked through my gallery. You\'ve seen what perfection looks like. And you still choose... change?"');
    //     let choices = [
    //         { text: 'Player: "Change isn\'t the enemy of beauty. It\'s the source of it."', value: 'challenge' },
    //         { text: 'Player: "Perfection is a cage. Life is flux."', value: 'flux' }
    //     ];
    //     if (player.hasItem('K-13')) { // Curator's Doubt
    //         choices.push({ text: 'Player: "Even you have doubts, Curator. I\'ve seen them."', value: 'doubt' });
    //     }
    //     const { selection } = await player.showChoices('What do you say?', choices);
    //     // ... more dialogue based on selection ...
    //     player.setVariable('MQ-09_CURATOR_CONFRONTED', true);
    //     player.updateQuest('MQ-09'); // Trigger onCheck for objective 3
    // }
  }

  @QuestStep(4, {
    name: 'Collect the First Memory (MF-10)',
    description: 'After confronting the Curator, collect The First Memory from its pedestal.',
    onCheck: (player: RpgPlayer) => {
      // This objective is completed when the player collects MF-10.
      return player.hasItem('MF-10');
    },
    onComplete: (player: RpgPlayer) => {
      player.setVariable('MQ-09_OBJ_4_STATUS', 'completed');
      player.showNotification('Objective Complete: The First Memory collected.');
    },
  })
  collectFirstMemory(player: RpgPlayer) {
    // Logic for collecting MF-10.
    // Example:
    // In an item interaction event on the First Memory pedestal (after Curator dialogue):
    // if (player.getQuest('MQ-09')?.isActive() && player.getVariable('MQ-09_CURATOR_CONFRONTED') === true && !player.hasItem('MF-10')) {
    //     player.addItem('MF-10');
    //     player.showNotification('Collected The First Memory!');
    //     player.updateQuest('MQ-09'); // Trigger onCheck for objective 4
    // }
  }

  onComplete(player: RpgPlayer) {
    player.showNotification('Quest Complete: The Preserver Fortress');
    player.addGold(800);
    player.addItem('MF-09', 1);
    player.addItem('MF-10', 1);
    player.addItem('A-14', 1); // Memory-Woven Plate
    player.showText(
      'The Curator: "You\'ve walked through my gallery. You\'ve seen what perfection looks like. And you still choose... change?"',
    );
    player.showText('Player: "Change isn\'t the enemy of beauty. It\'s the source of it."');
    player.showText(
      'The Curator: "Then show me. Remix the First Memory. Show me what comes after perfection."',
    );
    player.unlockQuest('MQ-10');
    player.setVariable('MQ-09_COMPLETED', true);
  }

  onFailure(player: RpgPlayer) {
    // Specific failure conditions (e.g., being defeated by Preserver Captain) are handled
    // by map/enemy scripts directly, not by this quest's onFailure hook.
    // This hook would be for general quest failure, if any.
    player.showNotification('Quest Failed: The Preserver Fortress');
  }

  // Optional: onAccept and onCancel hooks if the quest was not automatic
  // onAccept(player: RpgPlayer) {
  //     player.showNotification('Quest Accepted: The Preserver Fortress');
  // }

  // onCancel(player: RpgPlayer) {
  //     player.showNotification('Quest Canceled: The Preserver Fortress');
  // }
}
