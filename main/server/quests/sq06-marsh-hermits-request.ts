import { Item } from '@rpgjs/database';
import { QuestStatus, RpgMap, type RpgPlayer, type RpgQuest, RpgSceneMap } from '@rpgjs/server';

export interface QuestVariables {
    'SQ-06_objective0_complete'?: boolean;
    'SQ-06_objective1_fragmentsCollected'?: number;
    'SQ-06_objective2_stonesBroadcasted'?: number;
    'SQ-06_objective3_ambushDefeated'?: boolean;
    'SQ-06_objective4_complete'?: boolean;
}

const quest: RpgQuest<QuestVariables> = {
    id: 'SQ-06',
    name: 'The Marsh Hermit\'s Request',
    category: 'side',
    act: 'act2',
    level: '11-14',
    dependencies: ['MQ-05'],
    unlockedBy: async (player: RpgPlayer) => {
        // Trigger: MQ-05 complete and enter Shimmer Marsh
        const mq05Status = player.getQuestStatus('MQ-05');
        const currentMap = player.map;
        return mq05Status === QuestStatus.COMPLETED && currentMap === 'shimmer_marsh';
    },
    giver: {
        name: 'Wynn',
        map: 'shimmer_marsh',
        position: { x: 12, y: 15 }
    },
    objectives: [
        {
            name: 'Speak with Wynn at the Marsh Hermit\'s Hut',
            onStart: async (player: RpgPlayer) => {
                // This objective is completed by the player interacting with Wynn
                // and accepting the quest. The quest system handles this automatically
                // when the quest is accepted.
                player.setVariable('SQ-06_objective0_complete', true);
            },
            isComplete: async (player: RpgPlayer) => player.getVariable('SQ-06_objective0_complete') === true
        },
        {
            name: 'Collect 3 water-element memory fragments (potency 2+)',
            onStart: async (player: RpgPlayer) => {
                player.setVariable('SQ-06_objective1_fragmentsCollected', 0);
                // Listen for fragment collection events
                player.on('collectFragment', (fragment: any) => { // Assuming 'any' for fragment type, replace with actual type if available
                    if (fragment.element === 'water' && fragment.potency >= 2) {
                        const currentCount = player.getVariable('SQ-06_objective1_fragmentsCollected') || 0;
                        player.setVariable('SQ-06_objective1_fragmentsCollected', currentCount + 1);
                        player.sendNotification(`Collected a water-element fragment (${currentCount + 1}/3)`);
                    }
                });
            },
            isComplete: async (player: RpgPlayer) => (player.getVariable('SQ-06_objective1_fragmentsCollected') || 0) >= 3,
            onComplete: async (player: RpgPlayer) => {
                player.off('collectFragment'); // Stop listening
            }
        },
        {
            name: 'Broadcast into 3 dormant marsh Resonance Stones',
            onStart: async (player: RpgPlayer) => {
                player.setVariable('SQ-06_objective2_stonesBroadcasted', 0);
                // Listen for broadcast events
                player.on('broadcastFragment', (stoneId: string) => { // Assuming 'any' for stoneId, replace with actual type if available
                    // You might need a way to identify "marsh Resonance Stones"
                    // For simplicity, let's assume any broadcast in Shimmer Marsh counts
                    if (player.map === 'shimmer_marsh') {
                        const currentCount = player.getVariable('SQ-06_objective2_stonesBroadcasted') || 0;
                        player.setVariable('SQ-06_objective2_stonesBroadcasted', currentCount + 1);
                        player.sendNotification(`Broadcasted to a Resonance Stone (${currentCount + 1}/3)`);
                    }
                });
            },
            isComplete: async (player: RpgPlayer) => (player.getVariable('SQ-06_objective2_stonesBroadcasted') || 0) >= 3,
            onComplete: async (player: RpgPlayer) => {
                player.off('broadcastFragment'); // Stop listening
            }
        },
        {
            name: 'Defeat Mire Crawler ambush at the third stone',
            onStart: async (player: RpgPlayer) => {
                player.setVariable('SQ-06_objective3_ambushDefeated', false);
                // This objective would typically be triggered by an event on the map
                // For example, after the 3rd broadcast, an event spawns enemies.
                // The event would then set this variable to true after combat.
                // Example: player.setVariable('SQ-06_objective3_ambushDefeated', true);
                player.sendNotification('An ambush has been triggered! Defeat the Mire Crawlers.');
            },
            isComplete: async (player: RpgPlayer) => player.getVariable('SQ-06_objective3_ambushDefeated') === true
        },
        {
            name: 'Return to Wynn',
            onStart: async (player: RpgPlayer) => {
                player.setVariable('SQ-06_objective4_complete', false);
                // This objective is completed by the player interacting with Wynn again.
                // The quest completion check will handle this when the player talks to Wynn.
            },
            isComplete: async (player: RpgPlayer) => player.getVariable('SQ-06_objective4_complete') === true
        }
    ],
    rewards: [
        {
            gold: 300
        },
        {
            item: {
                id: 'A-07',
                name: 'Hermit\'s Robe',
                description: '+14 DEF. +20% SP regen from Defend action. Cleric/Mage: +25% instead.',
                price: 0, // Quest reward, not purchasable
                type: Item.Type.ARMOR,
                equip: {
                    def: 14,
                    // Additional effects would be handled in a custom equip hook or status effect system
                }
            }
        },
        {
            item: {
                id: 'W-ST-05',
                name: 'Marsh Hermit\'s Crook',
                description: '+26 INT. SP cost of all heals reduced by 15%.',
                price: 0, // Quest reward, not purchasable
                type: Item.Type.WEAPON,
                equip: {
                    int: 26,
                    // Additional effects would be handled in a custom equip hook or status effect system
                },
                // Assuming Cleric only
                // class: ['cleric'] 
            }
        }
    ],
    onComplete: async (player: RpgPlayer) => {
        player.showNotification('Quest "The Marsh Hermit\'s Request" Completed!');
        player.callMapEvent('shimmer_marsh', 'Wynn', 'questCompleteDialogue'); // Trigger dialogue on Wynn
    },
    completionDialogue: [
        {
            speaker: 'Wynn',
            text: 'Fascinating. The vibrancy readings are exactly as I hypothesized — the marsh remembers itself in waves, not lines. Each broadcast creates a ripple. Here, take this robe and crook. I made them from marsh-woven fiber. They\'ll serve you better than they serve an old hermit who never leaves his hut.'
        }
    ],
    onAccept: async (player: RpgPlayer) => {
        player.setVariable('SQ-06_objective0_complete', true); // Mark first objective as complete upon acceptance
        player.sendNotification('Quest "The Marsh Hermit\'s Request" accepted!');
    },
    onCancel: async (player: RpgPlayer) => {
        player.sendNotification('Quest "The Marsh Hermit\'s Request" cancelled.');
        // Clean up any listeners if necessary
        player.off('collectFragment');
        player.off('broadcastFragment');
    }
};

export default quest;