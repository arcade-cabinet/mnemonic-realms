import { EventData, MapData, Move, RpgCommonPlayer, RpgEvent, RpgMap, RpgMoveRoute, type RpgPlayer, RpgScene } from '@rpgjs/server';

@EventData({
    id: 'act2-scene16-lira-freed',
    name: 'Freeing Hana',
    hitbox: { width: 32, height: 32 },
})
export class FreeingHanaEvent extends RpgEvent {
    onInit() {
        this.setGraphic('invisible'); // Start invisible, only trigger on specific conditions
    }

    async onPlayerTouch(player: RpgPlayer) {
        // 1. Check trigger conditions
        const questState = player.getQuest('SQ-14'); // Hana's Freeing Quest
        const allGodsRecalled = player.getVariable('4-gods-recalled'); // Custom variable for all gods recalled

        if (player.map.id === 'heartfield' && this.pos.x === 35 && this.pos.y === 30 && questState?.state === 'active' && allGodsRecalled) {
            // Prevent re-triggering if already completed
            if (player.getQuest('SQ-14')?.state === 'completed') {
                return;
            }

            // Ensure the event is visible and interactive for the player
            this.setGraphic('invisible'); // The actual crystal is a map tile, this event is just the trigger
            this.setHitbox(32, 32); // Make sure it's interactable

            // Part A: Return to Heartfield - Dialogue with Artun
            const callum = await player.map.createDynamicEvent({
                x: 34,
                y: 29,
                event: 'npc_artun', // Assuming 'npc_artun' is an existing RpgEvent class
                properties: {
                    graphic: 'npc_artun',
                    direction: 2, // Facing player
                    name: 'Artun'
                }
            });

            await player.showText(player.getDialogue('dlg-callum-lira-freed').partA1, { speaker: callum });
            await player.showText(player.getDialogue('dlg-callum-lira-freed').partA2, { speaker: callum });

            // System message for broadcasting
            await player.showText("SYSTEM: The expanded stagnation zone's crystal is fractured and weakened. Broadcasting a **potency 4+ fragment** into the focal point will shatter the zone and free Hana.");

            // Wait for player to broadcast a fragment
            const fragmentBroadcasted = await player.gui('broadcast-fragment-gui').open({
                minPotency: 4,
                targetElement: 'stagnation-zone-lira', // Identifier for the target
                requiredElements: [], // No specific elements required, just potency
                requiredEmotions: [] // No specific emotions required
            });

            if (!fragmentBroadcasted) {
                // Player cancelled or failed to broadcast, exit event
                await player.showText("You decide not to broadcast a fragment yet.");
                callum.remove();
                return;
            }

            // Part B: The Shattering
            // 2. Spawns NPCs at appropriate positions using createDynamicEvent()
            // Hana is initially frozen, her dynamic event will be created after shattering
            const liraFrozen = await player.map.createDynamicEvent({
                x: 35,
                y: 30,
                event: 'npc_hana', // Assuming 'npc_hana' is an existing RpgEvent class
                properties: {
                    graphic: 'npc_hana_frozen', // A special graphic for frozen Hana
                    direction: 2,
                    name: 'Hana'
                }
            });

            // 4. Fires effects (screen effects)
            await player.triggerMapEvent('stagnation-mega-shatter'); // Custom map event for screen effect
            await player.screenEffect({ effect: 'stagnation-mega-shatter' }); // Example screen effect

            // Remove the frozen Hana event
            liraFrozen.remove();

            // Create the freed Hana event
            const liraFreed = await player.map.createDynamicEvent({
                x: 35,
                y: 30,
                event: 'npc_hana',
                properties: {
                    graphic: 'npc_hana', // Normal Hana graphic
                    direction: 2,
                    name: 'Hana'
                }
            });

            // Dialogue with Hana and Artun
            await player.showText(player.getDialogue('dlg-lira-freed').partB1, { speaker: liraFreed });
            await player.showText(player.getDialogue('dlg-lira-freed').partB2, { speaker: liraFreed });
            await player.showText(player.getDialogue('dlg-callum-lira-freed').partB3, { speaker: callum });
            await player.showText(player.getDialogue('dlg-lira-freed').partB4, { speaker: liraFreed });
            await player.showText(player.getDialogue('dlg-lira-freed').partB5, { speaker: liraFreed });

            // 4. Fires effects (companion join)
            await player.addCompanion('lira', { class: 'cleric' }); // Hana rejoins the party
            await player.showText("SYSTEM: Hana rejoins the party! (Cleric — full moveset restored, leveled to match player)");

            // Final dialogue
            await player.showText(player.getDialogue('dlg-callum-lira-freed').partB6, { speaker: callum });

            // 4. Fires effects (vibrancy change)
            player.map.setVibrancy('heartfield', player.map.getVibrancy('heartfield') + 25); // Increase Heartfield vibrancy
            await player.showText("Heartfield's vibrancy increased by 25!");

            // 5. Updates quest state
            player.setQuest('SQ-14', 'completed');

            // Clean up dynamic NPCs
            callum.remove();
            liraFreed.remove();

            // Mark this event as completed to prevent re-triggering
            this.setGraphic('invisible');
            this.setHitbox(0, 0);
        }
    }
}

export default function setup() {
    return FreeingHanaEvent;
}