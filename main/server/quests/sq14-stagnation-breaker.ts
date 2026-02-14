import {
  HookClient,
  HookServer,
  Quest,
  RpgCommonPlayer,
  type RpgEvent,
  type RpgMap,
  type RpgPlayer,
  RpgSceneMap,
  RpgWorld,
} from '@rpgjs/server';
import { PreserverAgentEvent, PreserverCaptainEvent } from '../events/enemies'; // Assuming these are defined as RpgEvent classes

export const SQ14_ID = 'SQ-14';

@Quest({
  id: SQ14_ID,
  name: 'The Stagnation Breaker',
  category: 'side',
  act: 'act3',
  level: '22-26',
  dependencies: ['MQ-07'],
  rewards: [
    {
      item: 'gold',
      quantity: 500,
    },
    {
      item: 'C-HP-04', // Elixir
      quantity: 2,
    },
    {
      item: 'fragment', // Generic fragment reward
      value: {
        emotion: 'Fury',
        element: 'Light',
        potency: 4,
      },
    },
  ],
})
export default class TheStagnationBreakerQuest {
  // Quest Variables (stored on player)
  private static readonly VAR_PROGRESS = `${SQ14_ID}_PROGRESS`;
  private static readonly VAR_LIRA_MESSAGE_RECEIVED = `${SQ14_ID}_LIRA_MESSAGE`;
  private static readonly VAR_ENEMIES_DEFEATED = `${SQ14_ID}_ENEMIES_DEFEATED`;

  // Objective IDs for clarity
  private static readonly OBJ_SPEAK_CALLUM = 0;
  private static readonly OBJ_TRAVEL_CLEARING = 1;
  private static readonly OBJ_DEFEAT_REINFORCEMENTS = 2;
  private static readonly OBJ_BROADCAST_FRAGMENT = 3;
  private static readonly OBJ_WITNESS_AWAKENING = 4;
  private static readonly OBJ_RETURN_CALLUM = 5;

  onStart(player: RpgPlayer) {
    player.setVariable(
      TheStagnationBreakerQuest.VAR_PROGRESS,
      TheStagnationBreakerQuest.OBJ_SPEAK_CALLUM,
    );
    player.setVariable(TheStagnationBreakerQuest.VAR_LIRA_MESSAGE_RECEIVED, false);
    player.setVariable(TheStagnationBreakerQuest.VAR_ENEMIES_DEFEATED, 0);
    player.addQuest(SQ14_ID);
    player.showNotification('New Quest: The Stagnation Breaker');
    player.updateQuest(SQ14_ID, {
      description:
        "Callum has been researching a way to free Lira. Speak with him at the Elder's House.",
      objectives: [
        { name: 'Speak with Callum about freeing Lira', state: 'active' },
        { name: 'Travel to Heartfield Stagnation Clearing (35, 30)', state: 'not-started' },
        { name: 'Defeat Preserver reinforcements (2x Agent + 1x Captain)', state: 'not-started' },
        { name: "Broadcast potency 4+ joy fragment into Lira's frozen form", state: 'not-started' },
        { name: "Witness Lira's partial awakening message", state: 'not-started' },
        { name: "Return to Callum with Lira's message", state: 'not-started' },
      ],
    });
  }

  onComplete(player: RpgPlayer) {
    player.showNotification('Quest Completed: The Stagnation Breaker');
    player.updateQuest(SQ14_ID, {
      state: 'completed',
      description: "You've helped Lira partially awaken and delivered her message to Callum.",
      objectives: [
        { name: 'Speak with Callum about freeing Lira', state: 'completed' },
        { name: 'Travel to Heartfield Stagnation Clearing (35, 30)', state: 'completed' },
        { name: 'Defeat Preserver reinforcements (2x Agent + 1x Captain)', state: 'completed' },
        { name: "Broadcast potency 4+ joy fragment into Lira's frozen form", state: 'completed' },
        { name: "Witness Lira's partial awakening message", state: 'completed' },
        { name: "Return to Callum with Lira's message", state: 'completed' },
      ],
    });
    player.addGold(500);
    player.addItem('C-HP-04', 2); // Elixir
    player.addItem('fragment', 1, { emotion: 'Fury', element: 'Light', potency: 4 }); // Fury/Light Fragment (4-star)

    player.callDialog('Callum', [
      {
        text: "She spoke? She actually... 'The First Memory is the key.' Then that confirms it. The Curator isn't just preserving the world — they're using the First Memory as the anchor for all stasis. Free the First Memory, and every frozen thing in the world unfreezes. Including Lira.",
      },
    ]);
  }

  onJoinMap(player: RpgPlayer, map: RpgMap) {
    const progress = player.getVariable(TheStagnationBreakerQuest.VAR_PROGRESS);

    if (
      progress === TheStagnationBreakerQuest.OBJ_TRAVEL_CLEARING &&
      map.id === 'Heartfield_StagnationClearing'
    ) {
      // Check if player is near Lira's frozen form (35, 30)
      if (
        player.position.x >= 30 &&
        player.position.x <= 40 &&
        player.position.y >= 25 &&
        player.position.y <= 35
      ) {
        this.updateProgress(player, TheStagnationBreakerQuest.OBJ_DEFEAT_REINFORCEMENTS);
        this.spawnPreserverReinforcements(player);
      }
    }
  }

  onPlayerDamaged(player: RpgPlayer, enemy: RpgEvent) {
    // This hook is not directly used for quest progress, but could be for failure conditions if any.
  }

  onPlayerDefeated(player: RpgPlayer, enemy: RpgEvent) {
    // This hook is not directly used for quest progress, but could be for failure conditions if any.
  }

  onBattleEnd(player: RpgPlayer, enemies: RpgEvent[], win: boolean) {
    const progress = player.getVariable(TheStagnationBreakerQuest.VAR_PROGRESS);

    if (progress === TheStagnationBreakerQuest.OBJ_DEFEAT_REINFORCEMENTS && win) {
      const defeatedCount = player.getVariable(TheStagnationBreakerQuest.VAR_ENEMIES_DEFEATED) || 0;
      let newDefeatedCount = defeatedCount;

      for (const enemy of enemies) {
        if (enemy instanceof PreserverAgentEvent || enemy instanceof PreserverCaptainEvent) {
          newDefeatedCount++;
        }
      }

      player.setVariable(TheStagnationBreakerQuest.VAR_ENEMIES_DEFEATED, newDefeatedCount);

      // Check if all required enemies are defeated (2x Agent + 1x Captain = 3 total)
      if (newDefeatedCount >= 3) {
        // Assuming 2 agents + 1 captain are spawned and counted here
        this.updateProgress(player, TheStagnationBreakerQuest.OBJ_BROADCAST_FRAGMENT);
        player.showNotification(
          "The Preserver reinforcements are defeated. Now, broadcast a joy fragment into Lira's form.",
        );
      } else {
        player.showNotification(`Defeated ${newDefeatedCount}/3 Preserver reinforcements.`);
      }
    }
  }

  // Custom hook for broadcasting fragments (assuming a custom event or action triggers this)
  // This would be called from a custom event on the map, or a player action.
  // Example: player.callQuestHook(SQ14_ID, 'onBroadcastFragment', fragment);
  onBroadcastFragment(
    player: RpgPlayer,
    fragment: { emotion: string; element: string; potency: number },
  ) {
    const progress = player.getVariable(TheStagnationBreakerQuest.VAR_PROGRESS);

    if (progress === TheStagnationBreakerQuest.OBJ_BROADCAST_FRAGMENT) {
      if (fragment.emotion === 'Joy' && fragment.potency >= 4) {
        player.showNotification('The stasis around Lira cracks! You hear a faint voice...');
        this.updateProgress(player, TheStagnationBreakerQuest.OBJ_WITNESS_AWAKENING);
        player.setVariable(TheStagnationBreakerQuest.VAR_LIRA_MESSAGE_RECEIVED, true);
        player.callDialog('Lira', [{ text: "The First Memory. It's the key to everything." }]);
        player.showNotification("Lira's message received. Return to Callum.");
      } else {
        player.showNotification(
          "That fragment doesn't seem to have enough potency or the right emotion. Try a Joy fragment with potency 4 or higher.",
        );
      }
    }
  }

  // Helper to update quest progress and player variables
  private updateProgress(player: RpgPlayer, newProgress: number) {
    const currentProgress = player.getVariable(TheStagnationBreakerQuest.VAR_PROGRESS);
    if (newProgress > currentProgress) {
      player.setVariable(TheStagnationBreakerQuest.VAR_PROGRESS, newProgress);
      const objectives = player.getQuest(SQ14_ID).objectives;

      // Mark previous objective as completed
      if (currentProgress >= 0 && currentProgress < objectives.length) {
        objectives[currentProgress].state = 'completed';
      }

      // Mark current objective as active
      if (newProgress < objectives.length) {
        objectives[newProgress].state = 'active';
      }
      player.updateQuest(SQ14_ID, { objectives });
    }
  }

  // --- Giver Interaction ---
  // This method would be called by an event on Callum.
  // Example: CallumEvent.onAction(player) { player.startQuest(SQ14_ID); }
  onPlayerInteractWithGiver(player: RpgPlayer) {
    const progress = player.getVariable(TheStagnationBreakerQuest.VAR_PROGRESS);
    const questState = player.getQuest(SQ14_ID)?.state;

    if (questState === 'not-started') {
      player.callDialog('Callum', [
        {
          text: "Ah, you're here. I've been poring over ancient texts, trying to find a way to break Lira's stasis. I think I've found something. A high-potency joy fragment, broadcast directly into her frozen form, might just crack it. You'll need to go to the Heartfield Stagnation Clearing, where she's frozen.",
        },
        { text: "Be warned, the Preservers won't have left her unguarded. Prepare for a fight." },
      ]);
      this.onStart(player);
      this.updateProgress(player, TheStagnationBreakerQuest.OBJ_TRAVEL_CLEARING);
    } else if (progress === TheStagnationBreakerQuest.OBJ_SPEAK_CALLUM) {
      player.callDialog('Callum', [
        {
          text: "Good, you're ready. Head to the Heartfield Stagnation Clearing. It's at coordinates (35, 30). Find Lira's frozen form and be ready for Preserver resistance.",
        },
      ]);
      this.updateProgress(player, TheStagnationBreakerQuest.OBJ_TRAVEL_CLEARING);
    } else if (progress === TheStagnationBreakerQuest.OBJ_RETURN_CALLUM) {
      const liraMessageReceived = player.getVariable(
        TheStagnationBreakerQuest.VAR_LIRA_MESSAGE_RECEIVED,
      );
      if (liraMessageReceived) {
        this.onComplete(player);
      } else {
        player.callDialog('Callum', [{ text: 'Did you manage to reach Lira? What happened?' }]);
      }
    } else if (questState === 'completed') {
      player.callDialog('Callum', [
        {
          text: "We have a lead now, thanks to you. 'The First Memory is the key.' It changes everything.",
        },
      ]);
    } else {
      player.callDialog('Callum', [
        { text: 'You still need to free Lira. Head to the Heartfield Stagnation Clearing.' },
      ]);
    }
  }

  // --- Enemy Spawning ---
  private spawnPreserverReinforcements(player: RpgPlayer) {
    const map = player.map;
    if (!map) return;

    const spawnPoints = [
      { x: 33, y: 28 },
      { x: 37, y: 32 },
      { x: 35, y: 29 },
    ];

    const enemiesToSpawn = [
      { event: PreserverAgentEvent, x: spawnPoints[0].x, y: spawnPoints[0].y },
      { event: PreserverAgentEvent, x: spawnPoints[1].x, y: spawnPoints[1].y },
      { event: PreserverCaptainEvent, x: spawnPoints[2].x, y: spawnPoints[2].y },
    ];

    for (const enemyData of enemiesToSpawn) {
      const event = map.createEvent(enemyData.event, enemyData.x, enemyData.y);
      if (event) {
        event.setProperty('questEnemy', true); // Mark as quest enemy
        event.on('dead', (player: RpgPlayer, enemy: RpgEvent) => {
          // This is a simplified way to track. In a real game, you'd want to ensure
          // the 'dead' hook is properly integrated with the quest system.
          // For now, onBattleEnd handles the count.
        });
      }
    }
    player.showNotification('Preserver reinforcements have appeared!');
  }
}
