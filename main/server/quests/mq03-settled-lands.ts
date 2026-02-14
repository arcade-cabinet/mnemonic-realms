import { type QuestStep, type RpgMap, type RpgPlayer, RpgQuest } from '@rpgjs/server';
import { QuestState } from '@rpgjs/types';

export interface MQ03QuestVariables extends QuestStep {
  hasSpokenToCallum: boolean;
  visitedHeartfield: boolean;
  visitedAmbergrove: boolean;
  visitedMillbrook: boolean;
  visitedSunridge: boolean;
  memoryFragmentsCollected: number;
  encountersDefeatedHeartfield: number;
  encountersDefeatedAmbergrove: number;
  encountersDefeatedMillbrook: number;
  encountersDefeatedSunridge: number;
  returnedToCallum: boolean;
}

@RpgQuest<MQ03QuestVariables>({
  id: 'MQ-03',
  name: 'The Settled Lands',
  category: 'main',
  act: 'act1',
  level: '2-6',
  dependencies: ['MQ-02'],
  unlockedQuests: ['MQ-04', 'SQ-02', 'SQ-03', 'SQ-04'],
  rewards: [
    { item: { id: 'gold', name: 'Gold' }, quantity: 200 },
    {
      item: { id: 'fragment', name: 'Joy/Earth Fragment (2-star)' },
      quantity: 1,
      properties: { emotion: 'Joy', element: 'Earth', potency: 2 },
    },
    { item: { id: 'K-02', name: "Callum's Letters" }, quantity: 1 },
  ],
  completionDialogue: [
    {
      speaker: 'Callum',
      text: "You've seen it now — how the world changes at the edges. Those shimmering boundaries aren't natural decay. Something is holding the world back from growing. I've written down everything I know about the lands beyond. Take my letters. When you reach the Frontier, read the one for whatever zone you're in.",
    },
  ],
  onStart(player: RpgPlayer) {
    player.setVariable('MQ-03_hasSpokenToCallum', false);
    player.setVariable('MQ-03_visitedHeartfield', false);
    player.setVariable('MQ-03_visitedAmbergrove', false);
    player.setVariable('MQ-03_visitedMillbrook', false);
    player.setVariable('MQ-03_visitedSunridge', false);
    player.setVariable('MQ-03_memoryFragmentsCollected', 0);
    player.setVariable('MQ-03_encountersDefeatedHeartfield', 0);
    player.setVariable('MQ-03_encountersDefeatedAmbergrove', 0);
    player.setVariable('MQ-03_encountersDefeatedMillbrook', 0);
    player.setVariable('MQ-03_encountersDefeatedSunridge', 0);
    player.setVariable('MQ-03_returnedToCallum', false);
  },
  onComplete(player: RpgPlayer) {
    // Rewards are handled by the framework based on the 'rewards' array
    // Unlocked quests are handled by the framework based on 'unlockedQuests' array
  },
  onUpdate(player: RpgPlayer) {
    // No specific onUpdate logic needed beyond objective checks
  },
  onDead(player: RpgPlayer) {
    // No specific failure conditions for this quest
  },
  onLevelUp(player: RpgPlayer) {
    // No specific level-up logic needed for this quest
  },
  onJoinMap(player: RpgPlayer, map: RpgMap) {
    const questState = player.getQuest('MQ-03');
    if (questState && questState.state === QuestState.STARTED) {
      switch (map.id) {
        case 'Heartfield':
          player.setVariable('MQ-03_visitedHeartfield', true);
          break;
        case 'Ambergrove':
          player.setVariable('MQ-03_visitedAmbergrove', true);
          break;
        case 'Millbrook':
          player.setVariable('MQ-03_visitedMillbrook', true);
          break;
        case 'Sunridge':
          player.setVariable('MQ-03_visitedSunridge', true);
          break;
        case 'VillageHub': // Assuming Callum is in Village Hub
          if (
            player.getVariable('MQ-03_hasSpokenToCallum') &&
            !player.getVariable('MQ-03_returnedToCallum')
          ) {
            // This will be set by interaction with Callum, not just entering the map
          }
          break;
      }
    }
  },
  onCollectItem(player: RpgPlayer, item: any, quantity: number) {
    const questState = player.getQuest('MQ-03');
    if (questState && questState.state === QuestState.STARTED && item.id === 'fragment') {
      const currentFragments = player.getVariable('MQ-03_memoryFragmentsCollected') || 0;
      player.setVariable('MQ-03_memoryFragmentsCollected', currentFragments + quantity);
    }
  },
  onBattleEnd(player: RpgPlayer, win: boolean, enemies: any[]) {
    const questState = player.getQuest('MQ-03');
    if (questState && questState.state === QuestState.STARTED && win) {
      const currentMapId = player.map.id;
      switch (currentMapId) {
        case 'Heartfield':
          player.setVariable(
            'MQ-03_encountersDefeatedHeartfield',
            (player.getVariable('MQ-03_encountersDefeatedHeartfield') || 0) + 1,
          );
          break;
        case 'Ambergrove':
          player.setVariable(
            'MQ-03_encountersDefeatedAmbergrove',
            (player.getVariable('MQ-03_encountersDefeatedAmbergrove') || 0) + 1,
          );
          break;
        case 'Millbrook':
          player.setVariable(
            'MQ-03_encountersDefeatedMillbrook',
            (player.getVariable('MQ-03_encountersDefeatedMillbrook') || 0) + 1,
          );
          break;
        case 'Sunridge':
          player.setVariable(
            'MQ-03_encountersDefeatedSunridge',
            (player.getVariable('MQ-03_encountersDefeatedSunridge') || 0) + 1,
          );
          break;
      }
    }
  },
  steps: [
    {
      name: 'Speak with Callum for exploration guidance',
      description: "Find Callum in the Elder's House at the Village Hub and talk to him.",
      onStart(player: RpgPlayer) {
        // This step is implicitly started when the quest starts.
        // The actual completion is triggered by an NPC interaction.
      },
      onComplete(player: RpgPlayer) {
        player.setVariable('MQ-03_hasSpokenToCallum', true);
      },
      // This step is completed by an NPC interaction, not a variable check directly.
      // The NPC interaction would call player.setQuestStep('MQ-03', 1, true);
    },
    {
      name: 'Explore the Settled Lands',
      description: 'Visit Heartfield, Ambergrove, Millbrook, and Sunridge.',
      state: {
        visitedHeartfield: false,
        visitedAmbergrove: false,
        visitedMillbrook: false,
        visitedSunridge: false,
      },
      completion(player: RpgPlayer) {
        return (
          player.getVariable('MQ-03_visitedHeartfield') &&
          player.getVariable('MQ-03_visitedAmbergrove') &&
          player.getVariable('MQ-03_visitedMillbrook') &&
          player.getVariable('MQ-03_visitedSunridge')
        );
      },
    },
    {
      name: 'Collect Memory Fragments',
      description: 'Collect at least 5 memory fragments from across the Settled Lands.',
      state: {
        memoryFragmentsCollected: 0,
      },
      completion(player: RpgPlayer) {
        return (player.getVariable('MQ-03_memoryFragmentsCollected') || 0) >= 5;
      },
    },
    {
      name: 'Defeat Encounters in Each Zone',
      description:
        'Defeat at least one combat encounter in Heartfield, Ambergrove, Millbrook, and Sunridge.',
      state: {
        encountersDefeatedHeartfield: 0,
        encountersDefeatedAmbergrove: 0,
        encountersDefeatedMillbrook: 0,
        encountersDefeatedSunridge: 0,
      },
      completion(player: RpgPlayer) {
        return (
          (player.getVariable('MQ-03_encountersDefeatedHeartfield') || 0) >= 1 &&
          (player.getVariable('MQ-03_encountersDefeatedAmbergrove') || 0) >= 1 &&
          (player.getVariable('MQ-03_encountersDefeatedMillbrook') || 0) >= 1 &&
          (player.getVariable('MQ-03_encountersDefeatedSunridge') || 0) >= 1
        );
      },
    },
    {
      name: 'Return to Callum',
      description: "Go back to Callum in the Elder's House at the Village Hub.",
      state: {
        returnedToCallum: false,
      },
      completion(player: RpgPlayer) {
        return player.getVariable('MQ-03_returnedToCallum');
      },
      // This step is completed by an NPC interaction, not a variable check directly.
      // The NPC interaction would call player.setQuestStep('MQ-03', 5, true);
    },
  ],
})
export default class QuestMQ03 {}
