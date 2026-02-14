import {
  HookClient,
  HookServer,
  ItemType,
  Quest,
  type RpgItem,
  type RpgMap,
  RpgPlayer,
  RpgServer,
  RpgWorld,
} from '@rpgjs/server';

interface FragmentItem extends RpgItem {
  emotion: string;
  element: string;
  potency: number;
}

export default class AricsDoubtQuest extends Quest {
  id = 'SQ-05';
  name = 'Aric\'s Doubt';
  category = 'side';
  act = 'act1';
  level = 8; // Minimum level
  maxLevel = 12; // Maximum level for optimal experience

  // Giver details
  giver = {
    name: 'Aric',
    map: 'Sunridge',
    x: 32,
    y: 15,
  };

  // Quest objectives
  objectives = [
    {
      text: 'Speak with Aric at Sunridge',
      id: 'speakWithAric',
      onStart: (player: RpgPlayer) => {
        player.setVariable('SQ-05_objective_0_complete', false);
      },
      onComplete: (player: RpgPlayer) => {
        player.setVariable('SQ-05_objective_0_complete', true);
      },
      isComplete: (player: RpgPlayer) => player.getVariable('SQ-05_objective_0_complete') === true,
    },
    {
      text: 'Listen to Aric\'s confession',
      id: 'listenToConfession',
      onStart: (player: RpgPlayer) => {
        player.setVariable('SQ-05_objective_1_complete', false);
      },
      onComplete: (player: RpgPlayer) => {
        player.setVariable('SQ-05_objective_1_complete', true);
      },
      isComplete: (player: RpgPlayer) => player.getVariable('SQ-05_objective_1_complete') === true,
    },
    {
      text: 'Collect 3 fragments of different emotions (potency 2+)',
      id: 'collectFragments',
      onStart: (player: RpgPlayer) => {
        player.setVariable('SQ-05_fragments_collected', []); // Stores unique emotions collected
        player.setVariable('SQ-05_objective_2_complete', false);
      },
      onComplete: (player: RpgPlayer) => {
        player.setVariable('SQ-05_objective_2_complete', true);
      },
      isComplete: (player: RpgPlayer) => {
        const collectedFragments = player.getVariable('SQ-05_fragments_collected') || [];
        return collectedFragments.length >= 3;
      },
    },
    {
      text: 'Return after 1 in-game day',
      id: 'returnAfterDay',
      onStart: (player: RpgPlayer) => {
        player.setVariable('SQ-05_day_started', RpgWorld.get('time').day);
        player.setVariable('SQ-05_objective_3_complete', false);
      },
      onComplete: (player: RpgPlayer) => {
        player.setVariable('SQ-05_objective_3_complete', true);
      },
      isComplete: (player: RpgPlayer) => {
        const dayStarted = player.getVariable('SQ-05_day_started');
        if (dayStarted === undefined) return false;
        return RpgWorld.get('time').day > dayStarted;
      },
    },
    {
      text: 'Receive Preserver intelligence',
      id: 'receiveIntelligence',
      onStart: (player: RpgPlayer) => {
        player.setVariable('SQ-05_objective_4_complete', false);
      },
      onComplete: (player: RpgPlayer) => {
        player.setVariable('SQ-05_objective_4_complete', true);
      },
      isComplete: (player: RpgPlayer) => player.getVariable('SQ-05_objective_4_complete') === true,
    },
  ];

  // Rewards
  rewards = {
    gold: 250,
    items: [
      { itemId: 'C-SC-04', quantity: 5 }, // Stasis Breaker x5
      { itemId: 'K-06', quantity: 1 }, // Curator's Manifesto
    ],
    fragments: [
      { emotion: 'Sorrow', element: 'Dark', potency: 3, quantity: 1 }, // Sorrow/Dark Fragment (3-star)
    ],
  };

  // Completion dialogue
  completionText = 'Aric: I joined the Preservers because I was afraid of losing things I loved. The Curator promised that nothing would ever change. But watching that woman freeze... that wasn\'t preservation. That was theft. Take this manifesto. Understand what the Curator believes. Then decide for yourself whether they\'re right.';

  // Dependencies and unlocks
  dependencies = ['MQ-04'];
  unlocks = ['MQ-07'];

  // Trigger conditions for starting the quest
  onStart(player: RpgPlayer) {
    if (!this.checkDependencies(player)) {
      return false;
    }
    if (!this.checkLevel(player)) {
      return false;
    }
    if (!this.checkLocation(player)) {
      return false;
    }

    // Initial dialogue with Aric
    player.showText('Aric: ...Player. I need to talk to you. Alone.', {
      talkWith: this.giver.name,
    }).then(() => {
      this.setObjective(player, 'speakWithAric');
      this.setObjective(player, 'listenToConfession'); // Automatically moves to next objective after initial talk
      player.setVariable('SQ-05_objective_0_complete', true); // Mark first objective complete
      player.showText('Aric: Watching Lira... it broke something in me. I thought we were preserving. But what if we\'re just... stealing? I need to understand. Can you help me?', {
        talkWith: this.giver.name,
        choices: [
          { text: 'I\'ll help you, Aric.', value: 'yes' },
          { text: 'I can\'t get involved.', value: 'no' },
        ],
      }).then((choice) => {
        if (choice.value === 'yes') {
          player.setVariable('SQ-05_objective_1_complete', true); // Mark confession objective complete
          this.setObjective(player, 'collectFragments'); // Move to fragment collection
          player.showText('Aric: Thank you. I need to see... what memories truly are. Bring me three fragments, but they must be different emotions, and potent. Potency 2 or higher. I need to feel the depth of what we\'re losing.', {
            talkWith: this.giver.name,
          });
        } else {
          player.showText('Aric: I understand. Perhaps I was foolish to ask.', {
            talkWith: this.giver.name,
          });
          this.cancel(player); // Cancel the quest if player refuses
        }
      });
    });
    return true;
  }

  // Check if quest can be started
  canStart(player: RpgPlayer): boolean {
    const isTriggered = player.getVariable('MQ-04_complete') === true;
    const isRightLevel = player.level >= this.level && player.level <= this.maxLevel;
    const isOnLocation = player.map.id === this.giver.map && player.position.x === this.giver.x && player.position.y === this.giver.y;
    const isNotStarted = !player.hasQuest(this.id);
    const isNotCompleted = !player.hasQuest(this.id, 'completed');

    return isTriggered && isRightLevel && isOnLocation && isNotStarted && isNotCompleted;
  }

  // Hook into item collection to track fragments
  @RpgServer.hook(HookServer.PlayerAddItem)
  onPlayerAddItem(player: RpgPlayer, item: RpgItem, quantity: number) {
    if (player.hasQuest(this.id) && player.getQuest(this.id).currentObjective.id === 'collectFragments') {
      const fragment = item as FragmentItem;
      // Check if it's a fragment item with emotion and potency
      if (fragment.itemType === ItemType.FRAGMENT && fragment.emotion && fragment.potency >= 2) {
        const collectedFragments = player.getVariable('SQ-05_fragments_collected') || [];
        if (!collectedFragments.includes(fragment.emotion)) {
          collectedFragments.push(fragment.emotion);
          player.setVariable('SQ-05_fragments_collected', collectedFragments);
          player.sendNotification(`Collected a ${fragment.emotion} fragment. ${collectedFragments.length}/3 different emotions.`);

          if (this.objectives[2].isComplete(player)) {
            this.setObjective(player, 'returnAfterDay'); // Move to next objective
            player.showText('Aric: You have them! Different emotions... I need time to process these. Come back tomorrow, after the sun has set and risen again. I need to think.', {
              talkWith: this.giver.name,
            });
          }
        }
      }
    }
  }

  // Hook into player interaction with Aric to progress objectives
  @RpgServer.hook(HookServer.PlayerInteract)
  onPlayerInteract(player: RpgPlayer, target: RpgPlayer | RpgMap) {
    if (player.hasQuest(this.id) && target instanceof RpgPlayer && target.name === this.giver.name) {
      const currentObjective = player.getQuest(this.id).currentObjective;

      if (currentObjective.id === 'speakWithAric' && !this.objectives[0].isComplete(player)) {
        // This case is handled by the onStart dialogue, but good to have a fallback
        player.setVariable('SQ-05_objective_0_complete', true);
        player.showText('Aric: Thank you for coming. I need to talk.', { talkWith: this.giver.name });
        this.setObjective(player, 'listenToConfession');
      } else if (currentObjective.id === 'listenToConfession' && !this.objectives[1].isComplete(player)) {
        player.showText('Aric: Watching Lira... it broke something in me. I thought we were preserving. But what if we\'re just... stealing? I need to understand. Can you help me?', {
          talkWith: this.giver.name,
          choices: [
            { text: 'I\'ll help you, Aric.', value: 'yes' },
            { text: 'I can\'t get involved.', value: 'no' },
          ],
        }).then((choice) => {
          if (choice.value === 'yes') {
            player.setVariable('SQ-05_objective_1_complete', true);
            this.setObjective(player, 'collectFragments');
            player.showText('Aric: Thank you. I need to see... what memories truly are. Bring me three fragments, but they must be different emotions, and potent. Potency 2 or higher. I need to feel the depth of what we\'re losing.', {
              talkWith: this.giver.name,
            });
          } else {
            player.showText('Aric: I understand. Perhaps I was foolish to ask.', {
              talkWith: this.giver.name,
            });
            this.cancel(player);
          }
        });
      } else if (currentObjective.id === 'collectFragments' && this.objectives[2].isComplete(player)) {
        // Player has collected fragments and is interacting with Aric again
        this.setObjective(player, 'returnAfterDay');
        player.showText('Aric: You have them! Different emotions... I need time to process these. Come back tomorrow, after the sun has set and risen again. I need to think.', {
          talkWith: this.giver.name,
        });
      } else if (currentObjective.id === 'returnAfterDay' && this.objectives[3].isComplete(player)) {
        // Player returns after a day
        player.setVariable('SQ-05_objective_4_complete', true); // Mark intelligence objective complete
        this.setObjective(player, 'receiveIntelligence'); // Move to final objective
        player.showText(this.completionText, { talkWith: this.giver.name }).then(() => {
          this.onComplete(player); // Complete the quest
        });
      } else if (currentObjective.id === 'returnAfterDay' && !this.objectives[3].isComplete(player)) {
        player.showText('Aric: Not yet. I still need more time. The weight of these memories... it\'s a lot. Please, come back tomorrow.', {
          talkWith: this.giver.name,
        });
      }
    }
  }

  // Quest completion logic
  onComplete(player: RpgPlayer) {
    player.addGold(this.rewards.gold);
    this.rewards.items?.forEach(item => {
      player.addItem(item.itemId, item.quantity);
    });
    this.rewards.fragments?.forEach(fragment => {
      // Assuming a generic fragment item ID and properties are set on it
      // In a real game, you'd have a system to create fragments with specific properties
      player.addItem('MEMORY_FRAGMENT', fragment.quantity, {
        emotion: fragment.emotion,
        element: fragment.element,
        potency: fragment.potency,
      });
    });

    player.sendNotification('Quest "Aric\'s Doubt" completed!');
    player.setVariable('SQ-05_complete', true); // Mark quest as completed
    this.unlocks.forEach(questId => {
      player.setVariable(`${questId}_unlocked`, true); // Mark dependent quests as unlocked
    });
  }

  // Quest cancellation logic (if player refuses)
  onCancel(player: RpgPlayer) {
    player.sendNotification('Quest "Aric\'s Doubt" cancelled.');
    player.removeQuest(this.id);
  }

  // Helper to check dependencies
  private checkDependencies(player: RpgPlayer): boolean {
    return this.dependencies.every(dep => player.getVariable(`${dep}_complete`) === true);
  }

  // Helper to check player level
  private checkLevel(player: RpgPlayer): boolean {
    return player.level >= this.level && player.level <= this.maxLevel;
  }

  // Helper to check player location
  private checkLocation(player: RpgPlayer): boolean {
    return player.map.id === this.giver.map && player.position.x === this.giver.x && player.position.y === this.giver.y;
  }
}