import { QuestStatus, RpgMap, type RpgPlayer, type RpgQuest, RpgSceneMap, RpgWorld } from '@rpgjs/server';
import { PreserverScout } from '../database/enemies/preserver-scout'; // Assuming enemy definition exists

export interface QuestVariables {
    'SQ-07_OBJ_0_COMPLETE'?: boolean;
    'SQ-07_OBJ_1_PATROLS_COMPLETE'?: number;
    'SQ-07_OBJ_2_COMPLETE'?: boolean;
    'SQ-07_OBJ_3_COMPLETE'?: boolean;
    'SQ-07_ESCORT_NPC_ALIVE'?: boolean; // To track escort party status
}

const quest: RpgQuest<QuestVariables> = {
    id: 'SQ-07',
    name: "Petra's Ridgewalkers",
    category: 'side',
    act: 'act2',
    level: '12-15',
    giver: 'Petra',
    trigger: async (player: RpgPlayer) => {
        const mq05Status = player.getQuestStatus('MQ-05');
        const hasVisitedCamp = player.getVariable('VISITED_RIDGEWALKER_CAMP'); // Assuming this variable is set on map entry

        if (mq05Status === QuestStatus.COMPLETED && hasVisitedCamp) {
            return true;
        }
        return false;
    },
    objectives: [
        {
            name: 'Speak with Petra at Ridgewalker Camp (15, 25)',
            onStart: async (player: RpgPlayer) => {
                player.setVariable('SQ-07_OBJ_0_COMPLETE', false);
            },
            isCompleted: async (player: RpgPlayer) => player.getVariable('SQ-07_OBJ_0_COMPLETE') === true
        },
        {
            name: 'Escort a Ridgewalker scouting party through the Shattered Pass approach (3 patrol encounters)',
            onStart: async (player: RpgPlayer) => {
                player.setVariable('SQ-07_OBJ_1_PATROLS_COMPLETE', 0);
                player.setVariable('SQ-07_ESCORT_NPC_ALIVE', true); // Assume NPCs are alive at start
                // Logic to spawn escort NPCs and trigger patrol encounters would go here.
                // For this example, we'll rely on external event triggers to increment 'SQ-07_OBJ_1_PATROLS_COMPLETE'.
                // Example: An event on the map triggers a battle, and if won, increments this variable.
            },
            isCompleted: async (player: RpgPlayer) => {
                const patrols = player.getVariable('SQ-07_OBJ_1_PATROLS_COMPLETE') || 0;
                const escortAlive = player.getVariable('SQ-07_ESCORT_NPC_ALIVE');
                
                if (!escortAlive) {
                    // Failure condition: escort NPCs defeated. Reset objective 1.
                    player.setVariable('SQ-07_OBJ_1_PATROLS_COMPLETE', 0);
                    player.setVariable('SQ-07_ESCORT_NPC_ALIVE', true); // Petra sends another party
                    player.sendNotification('The scouting party was defeated! Petra sends another. Try again.', {
                        color: 'red',
                        icon: 'error'
                    });
                    return false; // Quest is not completed, objective resets.
                }
                return patrols >= 3;
            }
        },
        {
            name: 'Reach the Shattered Pass entrance (35, 30) and assess the stagnation zone',
            onStart: async (player: RpgPlayer) => {
                player.setVariable('SQ-07_OBJ_2_COMPLETE', false);
                // Logic to check player position would be in a map event or a global hook.
                // Example: On player move, check if (player.x >= 35 && player.y >= 30 && player.map.id === 'HollowRidge_ShatteredPassApproach')
                // then player.setVariable('SQ-07_OBJ_2_COMPLETE', true);
            },
            isCompleted: async (player: RpgPlayer) => player.getVariable('SQ-07_OBJ_2_COMPLETE') === true
        },
        {
            name: 'Report back to Petra with your findings',
            onStart: async (player: RpgPlayer) => {
                player.setVariable('SQ-07_OBJ_3_COMPLETE', false);
            },
            isCompleted: async (player: RpgPlayer) => player.getVariable('SQ-07_OBJ_3_COMPLETE') === true
        }
    ],
    rewards: {
        gold: 350,
        items: [
            { itemId: 'A-08', quantity: 1 }, // Ridgewalker's Coat
            { itemId: 'K-05', quantity: 1 }  // Kinetic Boots
        ]
    },
    onComplete: async (player: RpgPlayer) => {
        await player.showText('Petra: "So the pass is fully crystallized. Can\'t push through without breaking the stasis. But now we know what we\'re dealing with. Take these boots — I had them made for the Spire approach, but you\'ll need them more than I will. And this coat — Ridgewalker-weave. Keeps you warm, keeps you alive."');
        // No unlocks specified for this quest.
    },
    onAccept: async (player: RpgPlayer) => {
        await player.showText('Petra: "Good, you\'re here. We need to scout the Shattered Pass. It\'s been quiet, too quiet. Join my ridgewalkers, and we\'ll see what\'s truly happening up there."');
    },
    onCancel: async (player: RpgPlayer) => {
        await player.showText('Petra: "Understood. The mountains will wait for no one, but I\'ll wait for you."');
    },
    dependencies: ['MQ-05']
};

export default quest;