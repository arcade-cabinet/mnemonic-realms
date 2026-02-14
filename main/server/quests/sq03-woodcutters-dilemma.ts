import type { Item } from '@rpgjs/database';
import { HookClient, type Quest, type RpgEvent, RpgMap, type RpgPlayer, RpgSceneMap, RpgServer } from '@rpgjs/server';

// Define custom types for quest variables if needed
declare module '@rpgjs/server' {
    export interface RpgPlayer {
        _questData: { [questId: string]: any };
        getQuestProgress(questId: string, objectiveId: number): any;
        setQuestProgress(questId: string, objectiveId: number, value: any): void;
        getQuestStatus(questId: string): 'not_started' | 'started' | 'completed' | 'failed';
        setQuestStatus(questId: string, status: 'not_started' | 'started' | 'completed' | 'failed'): void;
        addQuest(questId: string): void;
        removeQuest(questId: string): void;
        hasQuest(questId: string): boolean;
        getVariable(name: string): any;
        setVariable(name: string, value: any): void;
        addItem(item: Item, quantity?: number): Promise<boolean>;
        addGold(amount: number): void;
        showNotification(message: string, type?: string): void;
        changeMap(mapId: string, x: number, y: number): Promise<void>;
        getQuests(): { [questId: string]: any };
        getQuest(questId: string): any;
    }
}

const QUEST_ID = 'SQ-03';
const GIVER_NPC_ID = 'woodcutter_lead'; // Assuming the Lead Woodcutter has this event ID
const GIVER_MAP_ID = 'Ambergrove_Woodcutters_Camp';
const GIVER_X = 10;
const GIVER_Y = 30;

export default {
    id: QUEST_ID,
    name: 'The Woodcutter\'s Dilemma',
    category: 'side',
    act: 'act1',
    level: {
        min: 4,
        max: 6
    },
    dependencies: ['MQ-03'],
    rewards: [
        { itemId: 'gold', quantity: 150 },
        { itemId: 'A-05', quantity: 1 }, // Forest Weave
        { itemId: 'fragment_calm_earth_2', quantity: 1 } // Calm/Earth Fragment (2-star)
    ],
    completionDialogue: 'Woodcutter: The forest\'s calmer now. Still growing, but... peacefully. Like it\'s breathing instead of gasping. This weave — made it from the Ambergrove bark. Tougher than leather and lighter than cloth. Should serve you well out there.',
    
    onStart: async (player: RpgPlayer) => {
        player.setQuestProgress(QUEST_ID, 0, true); // Objective 0: Speak with woodcutter
        player.showNotification('Quest Started: The Woodcutter\'s Dilemma');
        player.setVariable(`${QUEST_ID}_rapid_growth_sites_visited`, 0);
        player.setVariable(`${QUEST_ID}_site_1_broadcasted`, false);
        player.setVariable(`${QUEST_ID}_site_2_broadcasted`, false);
        player.setVariable(`${QUEST_ID}_site_3_broadcasted`, false);
        player.setVariable(`${QUEST_ID}_beetle_nest_defeated`, false);

        // Mark rapid-growth sites on the map (example: by spawning temporary events or markers)
        // In a real game, this might involve adding map markers to the player's UI or spawning specific events.
        // For this example, we'll just set variables that can be checked by interaction events.
        player.setVariable('Ambergrove_RapidGrowthSite_1_active', true);
        player.setVariable('Ambergrove_RapidGrowthSite_2_active', true);
        player.setVariable('Ambergrove_RapidGrowthSite_3_active', true);
        
        // Example: Spawn temporary events for the sites
        // This would typically be handled by a map's onEnter hook or a global event manager
        // For simplicity, we'll assume these sites are interactable events that check player variables.
    },

    onComplete: async (player: RpgPlayer) => {
        player.showNotification('Quest Completed: The Woodcutter\'s Dilemma', 'success');
        player.addGold(150);
        await player.addItem(RpgServer.database.getItem('A-05')!, 1);
        await player.addItem(RpgServer.database.getItem('fragment_calm_earth_2')!, 1); // Assuming this is a defined item ID
        
        // Clean up quest-related variables
        player.setVariable('Ambergrove_RapidGrowthSite_1_active', false);
        player.setVariable('Ambergrove_RapidGrowthSite_2_active', false);
        player.setVariable('Ambergrove_RapidGrowthSite_3_active', false);
    },

    onAccept: async (player: RpgPlayer) => {
        // Dialogue for accepting the quest
        return [
            { text: 'Woodcutter: Thank the spirits you\'re here! The forest... it\'s not right. The trees are growing too fast, too wild. We can\'t keep up. It\'s like the very earth is restless.' },
            { text: 'Woodcutter: There are three spots where the growth is most unnatural. If you could investigate them, maybe even... calm them, with your Architect\'s touch. I\'d be forever grateful.' },
            { text: 'Player: I\'ll see what I can do. Where are these sites?' },
            { text: 'Woodcutter: I\'ve marked them on your map. Be careful, the forest is agitated.' }
        ];
    },

    onTalk: async (player: RpgPlayer, event: RpgEvent) => {
        if (event.id !== GIVER_NPC_ID) {
            return;
        }

        const questStatus = player.getQuestStatus(QUEST_ID);
        const currentObjective = player.getQuestProgress(QUEST_ID, 'currentObjective');

        if (questStatus === 'not_started') {
            // Check trigger conditions before offering quest
            const mq03Status = player.getQuestStatus('MQ-03');
            const playerLevel = player.level;
            const playerMap = player.map.id;
            const playerX = player.position.x;
            const playerY = player.position.y;

            if (mq03Status === 'completed' && playerLevel >= 4 && playerLevel <= 6 && playerMap === GIVER_MAP_ID && playerX === GIVER_X && playerY === GIVER_Y) {
                return [
                    { text: 'Woodcutter: Stranger, you look capable. We have a problem here, a strange one. The trees... they\'re growing too fast. It\'s unnatural.' },
                    { text: 'Woodcutter: Will you help us? We need someone to investigate these rapid-growth sites.' },
                    { choices: [
                        { text: 'Accept the quest', value: 'accept' },
                        { text: 'Decline for now', value: 'decline' }
                    ] }
                ];
            } else {
                return [{ text: 'Woodcutter: We\'re having trouble with the forest, but it\'s not your concern yet.' }];
            }
        } else if (questStatus === 'started') {
            if (currentObjective === 0) {
                // This objective is completed on quest start, so this state shouldn't be reached if logic is correct.
                // But if it is, it means the player accepted and immediately talked again.
                return [{ text: 'Woodcutter: You\'ve accepted the task. Now, go investigate those sites!' }];
            } else if (currentObjective === 1 || currentObjective === 2 || currentObjective === 3) {
                const sitesVisited = player.getVariable(`${QUEST_ID}_rapid_growth_sites_visited`);
                const beetleDefeated = player.getVariable(`${QUEST_ID}_beetle_nest_defeated`);
                
                let dialogue = `Woodcutter: Any luck with those sites? You've investigated ${sitesVisited} so far.`;
                if (sitesVisited === 3 && !beetleDefeated) {
                    dialogue += ' Remember, the last site might have something more... aggressive.';
                } else if (sitesVisited < 3) {
                    dialogue += ' Keep going, we need to calm the forest.';
                }
                return [{ text: dialogue }];
            } else if (currentObjective === 4) {
                // All objectives complete, ready to turn in
                player.setQuestStatus(QUEST_ID, 'completed');
                return [{ text: this.completionDialogue }];
            }
        } else if (questStatus === 'completed') {
            return [{ text: 'Woodcutter: Thank you again, Architect. The forest breathes easier now, thanks to you.' }];
        }
        return [{ text: 'Woodcutter: ...' }];
    },

    onUpdate: async (player: RpgPlayer) => {
        const questStatus = player.getQuestStatus(QUEST_ID);
        if (questStatus !== 'started') return;

        const currentObjective = player.getQuestProgress(QUEST_ID, 'currentObjective') || 0;

        // Objective 0: Speak with woodcutter (handled by onStart)
        if (currentObjective === 0 && player.getQuestProgress(QUEST_ID, 0)) {
            player.setQuestProgress(QUEST_ID, 'currentObjective', 1);
            player.showNotification('Objective Updated: Investigate 3 rapid-growth sites');
        }

        // Objective 1: Investigate 3 rapid-growth sites
        const sitesVisited = player.getVariable(`${QUEST_ID}_rapid_growth_sites_visited`);
        if (currentObjective === 1 && sitesVisited >= 3) {
            player.setQuestProgress(QUEST_ID, 'currentObjective', 2);
            player.showNotification('Objective Updated: Broadcast fragments at each site');
        }

        // Objective 2: Broadcast fragments at each site
        const site1Broadcasted = player.getVariable(`${QUEST_ID}_site_1_broadcasted`);
        const site2Broadcasted = player.getVariable(`${QUEST_ID}_site_2_broadcasted`);
        const site3Broadcasted = player.getVariable(`${QUEST_ID}_site_3_broadcasted`);
        if (currentObjective === 2 && site1Broadcasted && site2Broadcasted && site3Broadcasted) {
            player.setQuestProgress(QUEST_ID, 'currentObjective', 3);
            player.showNotification('Objective Updated: Defeat Thornback Beetle nest');
        }

        // Objective 3: Defeat Thornback Beetle nest
        const beetleNestDefeated = player.getVariable(`${QUEST_ID}_beetle_nest_defeated`);
        if (currentObjective === 3 && beetleNestDefeated) {
            player.setQuestProgress(QUEST_ID, 'currentObjective', 4);
            player.showNotification('Objective Updated: Return to woodcutter');
        }

        // Objective 4: Return to woodcutter (checked in onTalk)
        // If player is at giver location and objective 4 is active, quest can be completed.
        if (currentObjective === 4 && player.map.id === GIVER_MAP_ID && player.position.x === GIVER_X && player.position.y === GIVER_Y) {
            // This condition will trigger the completion dialogue when the player talks to the woodcutter.
            // No direct action here, just ensures the objective is ready for turn-in.
        }
    },

    // Example of how rapid-growth sites might be handled (these would be separate event definitions)
    // This is conceptual and assumes interaction events exist on the map.
    onEventInteraction: async (player: RpgPlayer, event: RpgEvent) => {
        const questStatus = player.getQuestStatus(QUEST_ID);
        if (questStatus !== 'started') return;

        const currentObjective = player.getQuestProgress(QUEST_ID, 'currentObjective');

        // Rapid Growth Site 1
        if (event.id === 'Ambergrove_RapidGrowthSite_1' && player.getVariable('Ambergrove_RapidGrowthSite_1_active')) {
            if (!player.getVariable(`${QUEST_ID}_site_1_broadcasted`)) {
                player.showNotification('You sense a powerful, chaotic energy emanating from this site.');
                // Simulate broadcasting a fragment
                // In a real game, this would involve a UI prompt to use a fragment
                // For now, we'll just mark it as broadcasted.
                player.setVariable(`${QUEST_ID}_site_1_broadcasted`, true);
                player.setVariable(`${QUEST_ID}_rapid_growth_sites_visited`, (player.getVariable(`${QUEST_ID}_rapid_growth_sites_visited`) || 0) + 1);
                player.showNotification('You broadcast a fragment, calming the chaotic growth at this site.', 'info');
                RpgServer.emit('quest_progress_updated', player, QUEST_ID); // Notify client for UI update
            } else {
                player.showNotification('The growth here is already stabilized.');
            }
        }
        // Rapid Growth Site 2
        if (event.id === 'Ambergrove_RapidGrowthSite_2' && player.getVariable('Ambergrove_RapidGrowthSite_2_active')) {
            if (!player.getVariable(`${QUEST_ID}_site_2_broadcasted`)) {
                player.showNotification('The trees here are twisting unnaturally fast.');
                player.setVariable(`${QUEST_ID}_site_2_broadcasted`, true);
                player.setVariable(`${QUEST_ID}_rapid_growth_sites_visited`, (player.getVariable(`${QUEST_ID}_rapid_growth_sites_visited`) || 0) + 1);
                player.showNotification('You broadcast a fragment, calming the chaotic growth at this site.', 'info');
                RpgServer.emit('quest_progress_updated', player, QUEST_ID);
            } else {
                player.showNotification('This site is already calm.');
            }
        }
        // Rapid Growth Site 3 (with beetle nest)
        if (event.id === 'Ambergrove_RapidGrowthSite_3' && player.getVariable('Ambergrove_RapidGrowthSite_3_active')) {
            if (!player.getVariable(`${QUEST_ID}_site_3_broadcasted`)) {
                player.showNotification('A buzzing sound emanates from the densest part of the growth. It feels hostile.');
                // Trigger combat here
                // Example: await player.battle('ThornbackBeetleNest');
                // For this example, we'll simulate the battle completion.
                player.showNotification('You engage the Thornback Beetles!', 'warning');
                // Simulate battle completion
                player.setVariable(`${QUEST_ID}_beetle_nest_defeated`, true);
                player.showNotification('The Thornback Beetle nest has been defeated!', 'success');

                player.setVariable(`${QUEST_ID}_site_3_broadcasted`, true);
                player.setVariable(`${QUEST_ID}_rapid_growth_sites_visited`, (player.getVariable(`${QUEST_ID}_rapid_growth_sites_visited`) || 0) + 1);
                player.showNotification('You broadcast a fragment, calming the chaotic growth at this site.', 'info');
                RpgServer.emit('quest_progress_updated', player, QUEST_ID);
            } else {
                player.showNotification('The site is clear and calm.');
            }
        }
        RpgServer.emit('quest_progress_updated', player, QUEST_ID); // Ensure update is always triggered
    }

} as Quest;