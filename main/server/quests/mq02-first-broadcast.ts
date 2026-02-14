import { Item } from '@rpgjs/database';
import { QuestStatus, type RpgMap, type RpgPlayer, type RpgQuest } from '@rpgjs/server';

export default {
  id: 'MQ-02',
  name: 'First Broadcast',
  category: 'main',
  act: 'act1',
  level: '1-2',
  dependencies: ['MQ-01'],
  unlockedQuests: ['MQ-03', 'SQ-01'],
  giver: {
    name: 'Lira',
    map: 'village_hub',
    position: { x: 8, y: 18 },
  },
  objectives: [
    {
      text: 'Visit Lira at her Workshop (8, 18) and learn memory operations (Collect, Remix, Broadcast)',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-02_OBJ_0', false);
      },
      is(player: RpgPlayer) {
        return player.getVariable('MQ-02_OBJ_0') === true;
      },
    },
    {
      text: 'Collect 2 memory fragments from the Memorial Garden Resonance Stones',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-02_FRAGMENTS_COLLECTED', 0);
      },
      is(player: RpgPlayer) {
        return player.getVariable('MQ-02_FRAGMENTS_COLLECTED') >= 2;
      },
    },
    {
      text: 'Use the Remix Table (K-03 unlock) to combine fragments',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-02_REMIX_USED', false);
      },
      is(player: RpgPlayer) {
        return player.getVariable('MQ-02_REMIX_USED') === true;
      },
    },
    {
      text: "Broadcast a remixed fragment into the Memorial Garden's central Resonance Stone",
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-02_BROADCAST_DONE', false);
      },
      is(player: RpgPlayer) {
        return player.getVariable('MQ-02_BROADCAST_DONE') === true;
      },
    },
  ],
  rewards: [
    { itemId: 'K-03', quantity: 1, type: 'key-item' }, // Remix Table Access
    { itemId: 'MF-02', quantity: 1, type: 'fragment' }, // Lira's Warmth
    { itemId: 'GOLD', quantity: 80, type: 'gold' },
  ],
  onStart(player: RpgPlayer) {
    // Ensure initial state for objectives if not already set
    player.setVariable('MQ-02_OBJ_0', false);
    player.setVariable('MQ-02_FRAGMENTS_COLLECTED', 0);
    player.setVariable('MQ-02_REMIX_USED', false);
    player.setVariable('MQ-02_BROADCAST_DONE', false);
    player.addQuest('MQ-02');
  },
  onComplete(player: RpgPlayer) {
    player.showNotification('Quest Complete: First Broadcast');
    player.dialogue([
      {
        text: "Lira: Did you feel that? The stone sang back to you. That's the world saying 'thank you.' Every fragment you share makes this place a little more alive.",
        speaker: 'Lira',
      },
    ]);

    // Award rewards
    this.rewards.forEach((reward) => {
      if (reward.type === 'key-item' || reward.type === 'fragment') {
        player.addItem(reward.itemId, reward.quantity);
      } else if (reward.type === 'gold') {
        player.addGold(reward.quantity);
      }
    });

    // Unlock dependent quests
    this.unlockedQuests.forEach((questId) => {
      player.addQuest(questId);
    });
  },
  async onTalk(player: RpgPlayer, npc: any) {
    const quest = player.getQuest('MQ-02');

    if (!quest) {
      // This quest should only be triggered by MQ-01 completion, not direct talk
      return;
    }

    if (quest.status === QuestStatus.NOT_STARTED) {
      // This path should ideally not be hit if MQ-01 is a hard dependency
      // But as a fallback, if MQ-01 is complete, start it.
      if (player.getQuest('MQ-01')?.status === QuestStatus.COMPLETED) {
        player.startQuest('MQ-02');
        await player.dialogue([
          {
            text: "Lira: Welcome back! Now that you understand the basics, it's time to learn how to truly interact with the world's memories. I'll teach you about collecting, remixing, and broadcasting.",
            speaker: 'Lira',
          },
        ]);
        player.setVariable('MQ-02_OBJ_0', true); // Objective 0 complete
      } else {
        await player.dialogue([
          {
            text: "Lira: I still need a moment to prepare. Come back after you've finished with Callum.",
            speaker: 'Lira',
          },
        ]);
      }
    } else if (quest.status === QuestStatus.IS_RUNNING) {
      if (player.getVariable('MQ-02_OBJ_0') === false) {
        await player.dialogue([
          {
            text: "Lira: Alright, let's dive into the core of being an Architect. You'll learn to Collect fragments from Resonance Stones, Remix them to create new memories, and Broadcast them to bring vibrancy back to the world.",
            speaker: 'Lira',
          },
          {
            text: 'Lira: Your first task is to head to the Memorial Garden. Find two Resonance Stones and Collect their fragments. Be careful, some memories are faint.',
            speaker: 'Lira',
          },
        ]);
        player.setVariable('MQ-02_OBJ_0', true); // Objective 0 complete
      } else if (player.getVariable('MQ-02_FRAGMENTS_COLLECTED') < 2) {
        await player.dialogue([
          {
            text: 'Lira: Have you found any fragments yet? Remember, the Memorial Garden is just outside. Look for the glowing stones.',
            speaker: 'Lira',
          },
        ]);
      } else if (player.getVariable('MQ-02_REMIX_USED') === false) {
        await player.dialogue([
          {
            text: "Lira: Excellent! You've collected some fragments. Now, come over to my Remix Table. With it, you can combine fragments to create new, more potent memories.",
            speaker: 'Lira',
          },
          {
            text: 'Lira: This table is now yours to use. Try combining the fragments you just found.',
            speaker: 'Lira',
          },
        ]);
        // Grant Remix Table Access here if not already given, or ensure it's given on quest start
        if (!player.hasItem('K-03')) {
          player.addItem('K-03', 1);
          player.showNotification('Received Key Item: Remix Table Access');
        }
      } else if (player.getVariable('MQ-02_BROADCAST_DONE') === false) {
        await player.dialogue([
          {
            text: "Lira: Wonderful! You've remixed a new memory. Now for the final step: broadcasting. Take your remixed fragment to the central Resonance Stone in the Memorial Garden and Broadcast it. Watch what happens!",
            speaker: 'Lira',
          },
        ]);
      } else {
        // All objectives met, ready for completion
        player.completeQuest('MQ-02');
      }
    } else if (quest.status === QuestStatus.COMPLETED) {
      await player.dialogue([
        {
          text: "Lira: The world feels a little brighter, doesn't it? You're a natural, Architect. Keep exploring, keep remembering.",
          speaker: 'Lira',
        },
      ]);
    }
  },
  // Helper to increment fragment count (to be called from a Resonance Stone interaction)
  onCollectFragment(player: RpgPlayer) {
    const quest = player.getQuest('MQ-02');
    if (
      quest &&
      quest.status === QuestStatus.IS_RUNNING &&
      player.getVariable('MQ-02_FRAGMENTS_COLLECTED') < 2
    ) {
      player.setVariable(
        'MQ-02_FRAGMENTS_COLLECTED',
        player.getVariable('MQ-02_FRAGMENTS_COLLECTED') + 1,
      );
      player.showNotification(
        `Collected fragment (${player.getVariable('MQ-02_FRAGMENTS_COLLECTED')}/2)`,
      );
    }
  },
  // Helper to mark Remix Table used (to be called when player successfully uses Remix Table)
  onRemixUsed(player: RpgPlayer) {
    const quest = player.getQuest('MQ-02');
    if (
      quest &&
      quest.status === QuestStatus.IS_RUNNING &&
      player.getVariable('MQ-02_REMIX_USED') === false
    ) {
      player.setVariable('MQ-02_REMIX_USED', true);
      player.showNotification('Remix Table used!');
    }
  },
  // Helper to mark Broadcast done (to be called when player successfully broadcasts in Memorial Garden)
  onBroadcastDone(player: RpgPlayer, map: RpgMap) {
    const quest = player.getQuest('MQ-02');
    if (
      quest &&
      quest.status === QuestStatus.IS_RUNNING &&
      player.getVariable('MQ-02_BROADCAST_DONE') === false
    ) {
      // Assuming the broadcast happens in Memorial Garden
      if (map.id === 'memorial_garden') {
        // Replace with actual Memorial Garden map ID
        player.setVariable('MQ-02_BROADCAST_DONE', true);
        player.showNotification('Fragment broadcasted!');
        // Optionally, trigger a visual vibrancy increase in Memorial Garden
        // map.setVariable('VIBRANCY_MEMORIAL_GARDEN', map.getVariable('VIBRANCY_MEMORIAL_GARDEN') + 5);
      }
    }
  },
} as RpgQuest;
