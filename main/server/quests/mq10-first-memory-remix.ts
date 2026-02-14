import {
  HookClient,
  HookServer,
  type Item,
  ItemType,
  Quest,
  type RpgPlayer,
  RpgServer,
} from '@rpgjs/server';
import { PreserverFortressMap } from '../maps/preserver-fortress'; // Assuming this exists for location check

export const QUEST_FIRST_MEMORY_REMIX_ID = 'MQ-10';
export const FRAGMENT_WORLDS_NEW_DAWN_ID = 'MF-11';

@Quest({
  id: QUEST_FIRST_MEMORY_REMIX_ID,
  name: 'The First Memory Remix',
  category: 'main',
  act: 'act3',
  level: 28, // Min level
  rewards: [
    { item: FRAGMENT_WORLDS_NEW_DAWN_ID, type: ItemType.MEMORY_FRAGMENT },
    { unlock: 'game-completion' },
    { unlock: 'new-game-plus' },
  ],
  completionDialogue: [
    {
      speaker: 'Lira',
      text: 'I... I can feel it. The whole world, singing. What did you do?',
    },
    {
      speaker: 'Player',
      text: "I reminded it what it's for.",
    },
    {
      speaker: 'Callum',
      text: "The edge... look at the edge. It's still going. Still growing. You didn't finish the world. You taught it how to finish itself.",
    },
  ],
  dependencies: ['MQ-09'],
  unlocks: ['new-game-plus'],
})
export class QuestFirstMemoryRemix extends Quest<RpgPlayer> {
  onStart(player: RpgPlayer) {
    // Ensure player is in the correct location and has completed MQ-09
    if (!player.getQuest('MQ-09')?.isCompleted) {
      player.showNotification('You must complete "The Curator\'s Grief" first.', 'error');
      return false;
    }
    if (player.level < this.level) {
      player.showNotification(
        `You must be at least level ${this.level} to start this quest.`,
        'error',
      );
      return false;
    }
    // Assuming 'PreserverFortress_FirstMemoryChamber' is the map ID for the chamber
    if (player.map.id !== PreserverFortressMap.id) {
      player.showNotification(
        'You must be in the First Memory Chamber to start this quest.',
        'error',
      );
      return false;
    }

    player.setVariable('MQ-10_objective', 0); // Initialize objective progress
    player.addQuest(this);
    player.showNotification('New Quest: The First Memory Remix', 'success');
    return true;
  }

  onUpdate(player: RpgPlayer) {
    const currentObjective = player.getVariable('MQ-10_objective');

    switch (currentObjective) {
      case 0: // Remix First Memory with any fragment
        // This objective is checked by an external event (e.g., interacting with a Remix Table)
        // The Remix Table event would call player.setVariable('MQ-10_objective', 1);
        // For now, we'll assume it's done by an external trigger.
        player.setQuestObjective(this, 'Remix First Memory with any fragment', false);
        break;
      case 1: // Create World's New Dawn (MF-11)
        player.setQuestObjective(this, 'Remix First Memory with any fragment', true);
        player.setQuestObjective(this, "Create World's New Dawn (MF-11)", false);
        // This objective is completed when the player successfully creates MF-11
        // The game's remix system should trigger player.setVariable('MQ-10_objective', 2);
        break;
      case 2: // Broadcast World's New Dawn
        player.setQuestObjective(this, "Create World's New Dawn (MF-11)", true);
        player.setQuestObjective(this, "Broadcast World's New Dawn", false);
        // This objective is completed when the player broadcasts MF-11
        // The game's broadcast system should trigger player.setVariable('MQ-10_objective', 3);
        break;
      case 3: // Watch Endgame Bloom
        player.setQuestObjective(this, "Broadcast World's New Dawn", true);
        player.setQuestObjective(this, 'Watch Endgame Bloom', false);
        // This objective is completed after the "Endgame Bloom" sequence plays
        // The game's cinematic system should trigger player.setVariable('MQ-10_objective', 4);
        break;
      case 4: // View epilogue
        player.setQuestObjective(this, 'Watch Endgame Bloom', true);
        player.setQuestObjective(this, 'View epilogue', false);
        // This objective is completed after the epilogue sequence plays
        // The game's cinematic system should trigger player.setVariable('MQ-10_objective', 5);
        break;
      case 5: // Quest completed
        player.setQuestObjective(this, 'View epilogue', true);
        this.onComplete(player);
        break;
    }
  }

  onComplete(player: RpgPlayer) {
    player.showNotification('Quest Completed: The First Memory Remix', 'success');

    // Award rewards
    const worldNewDawnFragment: Item = {
      id: FRAGMENT_WORLDS_NEW_DAWN_ID,
      name: "World's New Dawn",
      description: 'The result of remixing the First Memory. This fragment IS the new world.',
      type: ItemType.MEMORY_FRAGMENT,
      price: 0, // Fragments are not typically sold
      params: { emotion: 'Joy', element: 'Light', potency: 5 }, // Example params
    };
    player.addItem(worldNewDawnFragment);
    player.showNotification(`Received: ${worldNewDawnFragment.name}`, 'success');

    // Unlock game completion and New Game+
    player.setVariable('game_completed', true);
    player.setVariable('new_game_plus_unlocked', true);
    player.showNotification('Game Completed! New Game+ Unlocked!', 'success');

    // Trigger completion dialogue
    this.showCompletionDialogue(player);

    // Mark quest as completed
    player.completeQuest(this);
  }

  onDead(player: RpgPlayer) {
    // No specific failure conditions for this quest, as remix always succeeds.
    // If there were, this is where you'd handle them.
  }
}

// Register the quest with the server
RpgServer.on(HookServer.PlayerConnected, (player: RpgPlayer) => {
  // Example of how the quest might be automatically triggered
  // In a real game, this would be tied to MQ-09 completion and entering the specific map
  player.on('change:variable:MQ-09_completed', (isCompleted: boolean) => {
    if (
      isCompleted &&
      player.map.id === PreserverFortressMap.id &&
      !player.getQuest(QUEST_FIRST_MEMORY_REMIX_ID)
    ) {
      player.addQuest(new QuestFirstMemoryRemix());
    }
  });
});

// Example of how external game systems would update quest progress
// This would typically be in a map event, item interaction, or game system logic.
RpgServer.on(HookServer.PlayerInput, (player: RpgPlayer, { input }) => {
  const quest = player.getQuest(QUEST_FIRST_MEMORY_REMIX_ID);
  if (!quest || quest.isCompleted) return;

  const currentObjective = player.getVariable('MQ-10_objective');

  // Simulate remixing the First Memory
  if (input === 'remix_first_memory' && currentObjective === 0) {
    // Check if player has MF-10 and another fragment
    // For simplicity, we'll just advance the quest here.
    player.setVariable('MQ-10_objective', 1);
    player.updateQuest(quest);
    player.showNotification('First Memory remixed! A new fragment forms...', 'info');
  }

  // Simulate creating World's New Dawn (MF-11)
  // This would be triggered by the actual remix system creating the item
  if (input === 'created_worlds_new_dawn' && currentObjective === 1) {
    player.setVariable('MQ-10_objective', 2);
    player.updateQuest(quest);
    player.showNotification("World's New Dawn created!", 'info');
  }

  // Simulate broadcasting World's New Dawn
  if (input === 'broadcast_worlds_new_dawn' && currentObjective === 2) {
    // Check if MF-11 is being broadcast
    player.setVariable('MQ-10_objective', 3);
    player.updateQuest(quest);
    player.showNotification("Broadcasting World's New Dawn...", 'info');
    // Trigger global vibrancy changes, god awakenings, etc.
  }

  // Simulate watching Endgame Bloom
  if (input === 'endgame_bloom_watched' && currentObjective === 3) {
    player.setVariable('MQ-10_objective', 4);
    player.updateQuest(quest);
    player.showNotification('The world transforms before your eyes!', 'info');
    // Trigger Lira unfrozen, Preservers change, new land sketches
  }

  // Simulate viewing epilogue
  if (input === 'epilogue_viewed' && currentObjective === 4) {
    player.setVariable('MQ-10_objective', 5);
    player.updateQuest(quest);
    player.showNotification('The story concludes.', 'info');
  }
});

// Export the quest definition
export default QuestFirstMemoryRemix;
