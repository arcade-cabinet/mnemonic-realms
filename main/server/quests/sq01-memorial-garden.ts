import { Item } from '@rpgjs/database';
import { type QuestObjective, type QuestReward, QuestStep, QuestTrigger, type RpgPlayer, RpgQuest } from '@rpgjs/server';

@QuestTrigger({
    name: 'SQ-01',
    dependencies: ['MQ-02'],
    level: {
        min: 2,
        max: 4
    },
    // Giver: Maren at Village Hub — General Shop (18, 16)
    // This is checked in the NPC interaction logic, not directly in the quest trigger.
    // However, we can add a location check if needed for more strictness.
    // For this quest, the trigger is primarily MQ-02 completion and then talking to Maren.
})
export default class MemorialGardenQuest extends RpgQuest {
    id = 'SQ-01';
    name = 'The Memorial Garden';
    category = 'side';
    act = 'act1';

    objectives: QuestObjective[] = [
        {
            text: 'Speak with Maren about the fading garden',
            onStart: (player: RpgPlayer) => {
                player.setVariable('SQ-01_OBJ_0_COMPLETE', false);
            },
            onComplete: (player: RpgPlayer) => {
                player.setVariable('SQ-01_OBJ_0_COMPLETE', true);
            },
            isCompleted: (player: RpgPlayer) => player.getVariable('SQ-01_OBJ_0_COMPLETE') === true
        },
        {
            text: 'Broadcast 3 fragments into Memorial Garden stones',
            onStart: (player: RpgPlayer) => {
                player.setVariable('SQ-01_BROADCAST_COUNT', 0);
            },
            onComplete: (player: RpgPlayer) => {
                player.setVariable('SQ-01_BROADCAST_COUNT', 3);
            },
            isCompleted: (player: RpgPlayer) => player.getVariable('SQ-01_BROADCAST_COUNT') >= 3
        },
        {
            text: 'Return to Maren',
            onStart: (player: RpgPlayer) => {
                player.setVariable('SQ-01_OBJ_2_COMPLETE', false);
            },
            onComplete: (player: RpgPlayer) => {
                player.setVariable('SQ-01_OBJ_2_COMPLETE', true);
            },
            isCompleted: (player: RpgPlayer) => player.getVariable('SQ-01_OBJ_2_COMPLETE') === true
        }
    ];

    rewards: QuestReward[] = [
        {
            gold: 120
        },
        {
            item: Item.get('C-HP-01'), // Minor Potion
            quantity: 5
        },
        {
            item: Item.get('C-SP-01'), // Mana Drop
            quantity: 3
        }
    ];

    onAccept(player: RpgPlayer) {
        player.showNotification('Quest Accepted: The Memorial Garden');
        player.setVariable('SQ-01_STATE', 'ACCEPTED');
        // Initialize objective 0 as not complete
        player.setVariable('SQ-01_OBJ_0_COMPLETE', false);
        // Initialize broadcast count
        player.setVariable('SQ-01_BROADCAST_COUNT', 0);
        // Initialize objective 2 as not complete
        player.setVariable('SQ-01_OBJ_2_COMPLETE', false);
    }

    onComplete(player: RpgPlayer) {
        player.showNotification('Quest Completed: The Memorial Garden');
        player.setVariable('SQ-01_STATE', 'COMPLETED');
        player.sendText('Maren: Oh! Oh, look at that. The flowers are actually... they\'re glowing! I haven\'t seen the garden like this since I was a girl. Thank you, Architect. The village needed this. I needed this.');

        // Unlock Maren's shop item (Smoke Bomb, C-SP-05, if not already available)
        // This would typically involve a custom shop logic or a global variable
        // that Maren's shop checks. For this example, we'll simulate it with a player variable.
        player.setVariable('MAREN_SHOP_UNLOCK_C-SP-05', true);
        player.showNotification('Maren\'s shop stock updated!');
    }

    onCancel(player: RpgPlayer) {
        player.showNotification('Quest Cancelled: The Memorial Garden');
        player.setVariable('SQ-01_STATE', 'CANCELLED');
    }

    // Helper to check if the quest is available to be accepted
    static isAvailable(player: RpgPlayer): boolean {
        const mq02Complete = player.getVariable('MQ-02_STATE') === 'COMPLETED';
        const questState = player.getVariable('SQ-01_STATE');
        const playerLevel = player.level;
        const minLevel = 2;
        const maxLevel = 4;

        return mq02Complete && (questState === undefined || questState === 'CANCELLED') && playerLevel >= minLevel && playerLevel <= maxLevel;
    }

    // Helper to check if the quest is currently active
    static isActive(player: RpgPlayer): boolean {
        return player.getVariable('SQ-01_STATE') === 'ACCEPTED';
    }

    // Helper to check if the quest is completed
    static isCompleted(player: RpgPlayer): boolean {
        return player.getVariable('SQ-01_STATE') === 'COMPLETED';
    }
}