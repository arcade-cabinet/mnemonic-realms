import {
  type QuestObjective,
  type RpgMap,
  type RpgPlayer,
  type RpgQuest,
  RpgSceneMap,
  RpgWorld,
} from '@rpgjs/server';
import { CrystalSentinel, PreserverAgent } from '../database/enemies/preserver'; // Assuming these enemy classes exist

export interface SolensLightStudiesVariables extends QuestObjective {
  hasSpokenToSolen?: boolean;
  anomaliesInvestigated?: number;
  hasBroadcastFragment?: boolean;
  preserverPatrolDefeated?: boolean;
  returnedToSolen?: boolean;
}

export default {
  id: 'SQ-08',
  name: "Solen's Light Studies",
  category: 'side',
  act: 'act2',
  level: '13-16',

  trigger(player: RpgPlayer) {
    // Trigger: MQ-05 complete, visit Flickerveil
    const mq05Status = player.getQuest('MQ-05')?.state;
    const hasVisitedFlickerveil = player.getVariable('VISITED_FLICKERVEIL') === true; // Assuming a variable is set on map entry

    return mq05Status === 'completed' && hasVisitedFlickerveil;
  },

  onStart(player: RpgPlayer) {
    player.addQuest('SQ-08');
    player.setQuestObjective('SQ-08', 'hasSpokenToSolen', false);
    player.setQuestObjective('SQ-08', 'anomaliesInvestigated', 0);
    player.setQuestObjective('SQ-08', 'hasBroadcastFragment', false);
    player.setQuestObjective('SQ-08', 'preserverPatrolDefeated', false);
    player.setQuestObjective('SQ-08', 'returnedToSolen', false);
    player.showNotification("New Quest: Solen's Light Studies");
    player.addQuestLog('Solen at Flickerveil needs help investigating strange light anomalies.');
  },

  async onTalk(player: RpgPlayer, npcId: string) {
    const quest = player.getQuest<SolensLightStudiesVariables>('SQ-08');
    if (!quest || quest.state !== 'started') return;

    if (npcId === 'solen' && !quest.hasSpokenToSolen) {
      await player.showText(
        'Solen: "The light here... it\'s been behaving strangely. Flickering, almost like it\'s trying to decide what to be. Can you help me understand it?"',
      );
      player.setQuestObjective('SQ-08', 'hasSpokenToSolen', true);
      player.addQuestLog('Objective: Investigate 4 flickering anomalies in Flickerveil.');
      player.showNotification('Objective Updated: Investigate anomalies');
    } else if (npcId === 'solen' && quest.hasSpokenToSolen && quest.returnedToSolen) {
      await player.showText(
        'Solen: "The flicker frequency has stabilized. Whatever you broadcast tuned the local resonance. This lens — I\'ve polished it my whole life, waiting for someone who could use it. The grove where Luminos sleeps... you\'ll need it to approach without going blind."',
      );
      player.completeQuest('SQ-08');
    }
  },

  onUpdate(player: RpgPlayer, quest: RpgQuest<SolensLightStudiesVariables>) {
    // Objective 1: Speak with Solen (handled in onTalk)

    // Objective 2: Investigate 4 flickering anomalies
    // This would typically be triggered by interacting with specific map events.
    // For example, an event on the map could call player.setQuestObjective('SQ-08', 'anomaliesInvestigated', currentCount + 1);
    if (quest.hasSpokenToSolen && quest.anomaliesInvestigated >= 4 && !quest.hasBroadcastFragment) {
      player.addQuestLog(
        'Objective: Broadcast a light-element fragment at the strongest anomaly (near the Resonance Archive).',
      );
      player.showNotification('Objective Updated: Broadcast fragment');
    }

    // Objective 3: Broadcast light-element fragment at archive
    // This would be triggered by a specific action, e.g., using a "Broadcast" skill/item at a specific map location.
    // For example, a map event at (10,10) could check for a light fragment and then call:
    // player.setQuestObjective('SQ-08', 'hasBroadcastFragment', true);
    if (
      quest.anomaliesInvestigated >= 4 &&
      quest.hasBroadcastFragment &&
      !quest.preserverPatrolDefeated
    ) {
      player.addQuestLog('Objective: Defeat the Preserver patrol guarding the archive perimeter.');
      player.showNotification('Objective Updated: Defeat patrol');
      // Spawn enemies if not already spawned
      // This would typically be handled by a map event or a global event system
      // For demonstration, let's assume a battle is triggered here.
      // In a real game, this might be a specific map event that spawns enemies.
      // Example: RpgWorld.getMap('Flickerveil_Archive_Perimeter').spawnEnemy(PreserverAgent, 2);
      // RpgWorld.getMap('Flickerveil_Archive_Perimeter').spawnEnemy(CrystalSentinel, 1);
    }

    // Objective 4: Defeat Preserver patrol
    // This would be triggered by the combat system.
    // For example, after a battle, a hook could check if the defeated enemies match the quest objective.
    // player.setQuestObjective('SQ-08', 'preserverPatrolDefeated', true);
    if (quest.hasBroadcastFragment && quest.preserverPatrolDefeated && !quest.returnedToSolen) {
      player.addQuestLog('Objective: Return to Solen at Flickering Village (35, 30).');
      player.showNotification('Objective Updated: Return to Solen');
    }

    // Objective 5: Return to Solen (handled in onTalk)
  },

  onComplete(player: RpgPlayer) {
    player.removeQuest('SQ-08');
    player.addGold(300);
    player.addItem('K-04', 1); // Light Lens
    player.addItem('MF-AWE-LIGHT-3', 1); // Awe/Light Fragment (3-star) - Assuming a generic ID for unnamed fragments
    player.showNotification("Quest Completed: Solen's Light Studies!");
    player.addQuestLog("Solen's Light Studies has been completed. You received rewards.");
  },

  onDead(player: RpgPlayer, quest: RpgQuest<SolensLightStudiesVariables>) {
    // No specific failure conditions mentioned, so no action on player death.
    // If there were, you might reset an objective or fail the quest.
  },

  // Example of how map events might interact with the quest
  onMapLoaded(player: RpgPlayer, map: RpgMap) {
    if (map.id === 'Flickerveil') {
      player.setVariable('VISITED_FLICKERVEIL', true);
      // Check if quest is active and trigger conditions met
      const quest = player.getQuest<SolensLightStudiesVariables>('SQ-08');
      if (quest && quest.state === 'not-started' && this.trigger(player)) {
        this.onStart(player);
      }
    }
  },

  // Example of how an anomaly interaction might work
  onEventTrigger(player: RpgPlayer, eventId: string) {
    const quest = player.getQuest<SolensLightStudiesVariables>('SQ-08');
    if (!quest || quest.state !== 'started' || !quest.hasSpokenToSolen) return;

    if (eventId.startsWith('flickering_anomaly_') && quest.anomaliesInvestigated < 4) {
      player.setQuestObjective(
        'SQ-08',
        'anomaliesInvestigated',
        (quest.anomaliesInvestigated || 0) + 1,
      );
      player.showText(
        `You observe the flickering anomaly. (${quest.anomaliesInvestigated}/4 investigated)`,
      );
      this.onUpdate(player, quest); // Manually trigger update to check for next objective
    }

    if (
      eventId === 'resonance_archive_broadcast_point' &&
      quest.anomaliesInvestigated >= 4 &&
      !quest.hasBroadcastFragment
    ) {
      // In a real game, this would involve checking player inventory for a light fragment
      // and potentially consuming it. For now, we'll simulate success.
      const hasLightFragment = player.hasItem('MF-AWE-LIGHT-3') || player.hasItem('MF-JOY-LIGHT-2'); // Example check
      if (hasLightFragment) {
        player.showText(
          'You broadcast a light-element fragment, and the anomaly stabilizes briefly.',
        );
        player.setQuestObjective('SQ-08', 'hasBroadcastFragment', true);
        // player.removeItem('MF-AWE-LIGHT-3', 1); // Consume fragment
        this.onUpdate(player, quest);
      } else {
        player.showText('You need a light-element fragment to broadcast here.');
      }
    }
  },

  // Example of how combat might interact with the quest
  onBattleEnd(player: RpgPlayer, enemiesDefeated: any[], victory: boolean) {
    const quest = player.getQuest<SolensLightStudiesVariables>('SQ-08');
    if (
      !quest ||
      quest.state !== 'started' ||
      !quest.hasBroadcastFragment ||
      quest.preserverPatrolDefeated
    )
      return;

    if (victory) {
      const defeatedPreservers = enemiesDefeated.filter(
        (enemy) => enemy.id === PreserverAgent.id || enemy.id === CrystalSentinel.id,
      ).length;

      // This is a simplified check. A more robust system would track specific enemy spawns for the quest.
      if (defeatedPreservers >= 3) {
        // Assuming 2 Agents + 1 Sentinel
        player.setQuestObjective('SQ-08', 'preserverPatrolDefeated', true);
        player.showText('The Preserver patrol has been defeated!');
        this.onUpdate(player, quest);
      }
    }
  },
} as RpgQuest<SolensLightStudiesVariables>;
