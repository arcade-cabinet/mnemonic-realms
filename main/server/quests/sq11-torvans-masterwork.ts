import { ClassType } from '@rpgjs/database';
import { Quest, RpgMap, type RpgPlayer, RpgServer, RpgWorld } from '@rpgjs/server';

export interface TorvanMasterworkQuestVariables extends RpgPlayer {
  _quest_SQ11_objective: number;
  _quest_SQ11_cragGolemCore: boolean;
  _quest_SQ11_crystalShard: boolean;
  _quest_SQ11_dissolvedMetal: boolean;
  _quest_SQ11_forgingDay: number;
}

@Quest({
  id: 'SQ-11',
  name: "Torvan's Masterwork",
  category: 'side',
  act: 'act2',
  level: '15-20',
  giver: {
    map: 'village_hub',
    x: 18,
    y: 18,
    name: 'Torvan',
  },
  trigger: async (player: TorvanMasterworkQuestVariables) => {
    const villageHubMap = RpgWorld.getMap('village_hub');
    if (!villageHubMap) {
      return false;
    }
    // Assuming vibrancy is stored as a map variable or accessible via a service
    // For this example, we'll simulate it as a global variable or a player variable for simplicity
    // In a real game, you'd fetch this from the map's state or a global vibrancy system.
    const vibrancy = player.getVariable('VILLAGE_HUB_VIBRANCY') || 0; // Example: player variable for vibrancy
    return vibrancy >= 70;
  },
  objectives: [
    {
      name: 'Speak with Torvan at the Blacksmith',
      onStart: (player: TorvanMasterworkQuestVariables) => {
        player.setVariable('_quest_SQ11_objective', 0);
      },
      onComplete: (player: TorvanMasterworkQuestVariables) => {
        player.setVariable('_quest_SQ11_objective', 1);
      },
    },
    {
      name: 'Collect 1 Crag Golem Core from Sunridge',
      description:
        'Crag Golems in Sunridge drop these. Look for the elite encounter for a guaranteed drop.',
      onStart: (player: TorvanMasterworkQuestVariables) => {
        player.setVariable('_quest_SQ11_cragGolemCore', false);
      },
      onCheck: (player: TorvanMasterworkQuestVariables) => {
        return player.getVariable('_quest_SQ11_cragGolemCore') === true;
      },
    },
    {
      name: 'Collect 1 Crystal Shard from Preserver Agents/Captains',
      description: 'Preserver Agents have a chance to drop them, Captains drop them guaranteed.',
      onStart: (player: TorvanMasterworkQuestVariables) => {
        player.setVariable('_quest_SQ11_crystalShard', false);
      },
      onCheck: (player: TorvanMasterworkQuestVariables) => {
        return player.getVariable('_quest_SQ11_crystalShard') === true;
      },
    },
    {
      name: 'Collect 1 Dissolved Metal from Depths Level 2',
      description: 'Search treasure chests in Depths Level 2.',
      onStart: (player: TorvanMasterworkQuestVariables) => {
        player.setVariable('_quest_SQ11_dissolvedMetal', false);
      },
      onCheck: (player: TorvanMasterworkQuestVariables) => {
        return player.getVariable('_quest_SQ11_dissolvedMetal') === true;
      },
    },
    {
      name: 'Bring materials to Torvan',
      onStart: (player: TorvanMasterworkQuestVariables) => {
        player.setVariable('_quest_SQ11_objective', 4);
      },
      onCheck: (player: TorvanMasterworkQuestVariables) => {
        return (
          player.getVariable('_quest_SQ11_cragGolemCore') === true &&
          player.getVariable('_quest_SQ11_crystalShard') === true &&
          player.getVariable('_quest_SQ11_dissolvedMetal') === true
        );
      },
      onComplete: (player: TorvanMasterworkQuestVariables) => {
        player.setVariable('_quest_SQ11_objective', 5);
        // Remove items from inventory
        player.removeItem('crag_golem_core', 1); // Assuming item IDs
        player.removeItem('crystal_shard', 1);
        player.removeItem('dissolved_metal', 1);
      },
    },
    {
      name: 'Wait 1 in-game day for forging',
      description: 'Torvan needs time to forge the weapon. You can leave and return later.',
      onStart: (player: TorvanMasterworkQuestVariables) => {
        player.setVariable('_quest_SQ11_forgingDay', RpgWorld.get<any>('day') + 1); // Assuming RpgWorld.get('day') gives current day
        player.setVariable('_quest_SQ11_objective', 6);
      },
      onCheck: (player: TorvanMasterworkQuestVariables) => {
        return RpgWorld.get<any>('day') >= player.getVariable('_quest_SQ11_forgingDay');
      },
      onComplete: (player: TorvanMasterworkQuestVariables) => {
        player.setVariable('_quest_SQ11_objective', 7);
      },
    },
    {
      name: 'Collect class-specific masterwork weapon',
      onStart: (player: TorvanMasterworkQuestVariables) => {
        player.setVariable('_quest_SQ11_objective', 7);
      },
      onCheck: (player: TorvanMasterworkQuestVariables) => {
        // This objective is completed when the player talks to Torvan after the wait
        // and receives the weapon. The actual item giving is in onComplete of the quest.
        return true;
      },
    },
  ],
  rewards: async (player: TorvanMasterworkQuestVariables) => {
    let weaponId: string;
    const playerClass = player.class.id; // Assuming player.class.id gives the class ID

    switch (playerClass) {
      case ClassType.Knight:
        weaponId = 'W-SW-06'; // Frontier Greatsword
        break;
      case ClassType.Cleric:
        weaponId = 'W-ST-06'; // Luminary's Scepter
        break;
      case ClassType.Mage:
        weaponId = 'W-WD-06'; // Arcane Catalyst
        break;
      case ClassType.Rogue:
        weaponId = 'W-DG-06'; // Phantom Edge
        break;
      default:
        weaponId = 'W-SW-06'; // Default to Knight weapon if class not found
        console.warn(
          `[SQ-11] Unknown player class: ${playerClass}. Defaulting to Frontier Greatsword.`,
        );
        break;
    }
    await player.addItem(weaponId, 1);
    player.sendText(
      `You received: ${RpgServer.database.items[weaponId]?.name || 'Masterwork Weapon'}`,
    );
  },
  onComplete: (player: TorvanMasterworkQuestVariables) => {
    player.showText(
      "Torvan: There. My finest work. Those materials you brought — I've never worked with anything like them. The Crag Golem's core gives it weight, the crystal gives it edge, and the dissolved metal... it hums. Like the weapon remembers what it's supposed to be.",
      player.id,
    );
    // Clean up quest variables
    player.setVariable('_quest_SQ11_objective', undefined);
    player.setVariable('_quest_SQ11_cragGolemCore', undefined);
    player.setVariable('_quest_SQ11_crystalShard', undefined);
    player.setVariable('_quest_SQ11_dissolvedMetal', undefined);
    player.setVariable('_quest_SQ11_forgingDay', undefined);
  },
  onAccept: (player: TorvanMasterworkQuestVariables) => {
    player.setVariable('_quest_SQ11_objective', 0); // Set initial objective
  },
  onCancel: (player: TorvanMasterworkQuestVariables) => {
    // Optionally reset variables if quest is cancelled
    player.setVariable('_quest_SQ11_objective', undefined);
    player.setVariable('_quest_SQ11_cragGolemCore', undefined);
    player.setVariable('_quest_SQ11_crystalShard', undefined);
    player.setVariable('_quest_SQ11_dissolvedMetal', undefined);
    player.setVariable('_quest_SQ11_forgingDay', undefined);
  },
})
export default class TorvansMasterworkQuest {
  // This class can contain methods for quest-specific logic if needed,
  // but the core definition is handled by the @Quest decorator.

  // Example: A method to handle item drops for quest materials
  static onEnemyDefeated(player: TorvanMasterworkQuestVariables, enemyId: string, mapId: string) {
    if (
      player.getQuestProgress('SQ-11')?.currentObjectiveId === 1 &&
      mapId === 'sunridge' &&
      enemyId === 'crag_golem'
    ) {
      if (Math.random() < 0.15 || enemyId === 'crag_golem_elite') {
        // 15% chance or guaranteed from elite
        if (!player.getVariable('_quest_SQ11_cragGolemCore')) {
          player.setVariable('_quest_SQ11_cragGolemCore', true);
          player.sendText('You found a Crag Golem Core!');
          player.updateQuest('SQ-11');
        }
      }
    }
    if (
      player.getQuestProgress('SQ-11')?.currentObjectiveId === 2 &&
      (enemyId === 'preserver_agent' || enemyId === 'preserver_captain')
    ) {
      if (Math.random() < 0.1 || enemyId === 'preserver_captain') {
        // 10% chance or guaranteed from captain
        if (!player.getVariable('_quest_SQ11_crystalShard')) {
          player.setVariable('_quest_SQ11_crystalShard', true);
          player.sendText('You found a Crystal Shard!');
          player.updateQuest('SQ-11');
        }
      }
    }
  }

  // Example: A method to handle treasure chest loot for quest materials
  static onTreasureChestOpened(
    player: TorvanMasterworkQuestVariables,
    mapId: string,
    chestId: string,
  ) {
    if (
      player.getQuestProgress('SQ-11')?.currentObjectiveId === 3 &&
      mapId === 'depths_level_2' &&
      chestId === 'depths_l2_treasure_01'
    ) {
      // Example chest ID
      if (!player.getVariable('_quest_SQ11_dissolvedMetal')) {
        player.setVariable('_quest_SQ11_dissolvedMetal', true);
        player.sendText('You found Dissolved Metal!');
        player.updateQuest('SQ-11');
      }
    }
  }

  // Example: A method to handle interaction with Torvan
  static async onTorvanInteract(player: TorvanMasterworkQuestVariables) {
    const questProgress = player.getQuestProgress('SQ-11');

    if (!questProgress) {
      // Quest not started, check trigger conditions
      const isTriggered = await RpgServer.quests['SQ-11'].trigger(player);
      if (isTriggered) {
        player.showText(
          'Torvan: Ah, adventurer. The village hums with new life. It stirs something within me, a desire to forge something truly magnificent. But for such a masterwork, I need materials beyond the ordinary...',
          player.id,
        );
        player.addQuest('SQ-11');
      } else {
        player.showText(
          'Torvan: My forge is busy, but my heart yearns for something more... something grander. Perhaps when the village truly thrives, inspiration will strike.',
          player.id,
        );
      }
      return;
    }

    switch (questProgress.currentObjectiveId) {
      case 0: // Speak with Torvan
        player.showText(
          "Torvan: Excellent! So you're interested in helping me forge a true masterwork? I'll need three rare components: a Crag Golem core from Sunridge, a Crystal Shard from the Preservers, and some Dissolved Metal from the Depths. Bring them back to me when you have them.",
          player.id,
        );
        player.setVariable('_quest_SQ11_objective', 1); // Advance to next objective
        player.updateQuest('SQ-11');
        break;
      case 1: // Collecting Crag Golem Core
      case 2: // Collecting Crystal Shard
      case 3: // Collecting Dissolved Metal
        player.showText(
          "Torvan: Have you found those rare materials yet? I'm eager to begin!",
          player.id,
        );
        player.updateQuest('SQ-11'); // Check if materials are collected
        break;
      case 4: // Bring materials to Torvan
        player.showText(
          'Torvan: Ah, you have them! The Crag Golem core, the Crystal Shard, and the Dissolved Metal... magnificent! Now, this will take time. Come back in one in-game day, and your masterwork will be ready.',
          player.id,
        );
        player.setVariable('_quest_SQ11_objective', 5); // Advance to wait objective
        player.updateQuest('SQ-11');
        break;
      case 5: // Waiting for forging
        if (RpgWorld.get<any>('day') >= player.getVariable('_quest_SQ11_forgingDay')) {
          player.showText(
            'Torvan: Ah, perfect timing! Your weapon is ready. My finest work, indeed!',
            player.id,
          );
          player.setVariable('_quest_SQ11_objective', 6); // Advance to collect objective
          player.updateQuest('SQ-11');
          player.completeQuest('SQ-11'); // Complete the quest
        } else {
          player.showText(
            'Torvan: Not yet, adventurer. A true masterwork cannot be rushed. Come back tomorrow.',
            player.id,
          );
        }
        break;
      case 6: // Collect weapon (should be completed by now)
        player.showText(
          'Torvan: I trust your new weapon serves you well. May it bring you glory!',
          player.id,
        );
        break;
      default:
        player.showText('Torvan: What can I do for you, adventurer?', player.id);
        break;
    }
  }
}
