import { EventData, RpgEvent, type RpgPlayer } from '@rpgjs/server';

@EventData({
    id: 'act3-scene11-curators-choice',
    name: 'The Curator\'s Choice',
    map: 'undrawn-peaks',
})
export class Act3Scene11CuratorsChoice extends RpgEvent {
    onInit() {
        // This event triggers when the player enters the Undrawn Peaks map
        // AND the 'bloom-complete' condition is met.
    }

    async onChanges(player: RpgPlayer) {
        if (player.map.id === 'undrawn-peaks' && player.getVariable('bloom-complete') && !player.getVariable('MQ-10-complete')) {
            await this.triggerScene(player);
        }
    }

    async triggerScene(player: RpgPlayer) {
        // Ensure the event only triggers once
        if (player.getVariable('MQ-10-complete')) {
            return;
        }

        player.setVariable('MQ-10-complete', true);

        // --- Part 1: Curator's Transformation at Preserver Fortress Gate (Undrawn Peaks) ---
        // Spawn Curator and Aric dynamically
        const curatorEvent = await player.createDynamicEvent({
            x: 19,
            y: 33,
            graphic: 'npc_curator',
            name: 'The Curator',
        });

        const aricEvent = await player.createDynamicEvent({
            x: 17,
            y: 35,
            graphic: 'npc_aric',
            name: 'Aric',
        });

        // Curator dialogue
        await player.showText('I spent years building a perfect museum. Collecting the world\'s most beautiful moments. Protecting them from time, from change, from entropy.');
        await player.showText('And you turned the whole world into something more beautiful than anything I ever froze.');
        await player.showText('I was wrong. Not about the moments being beautiful — they were. They are. But about what to do with beauty. I wanted to hold it still. You showed me that beauty moves.');
        await player.showText('The question I wanted to silence — "Why do things change?" — you gave it a new answer. Not silence. Not stasis. Just... "What will we create next?"');

        // Aric approaches
        await player.showText('Aric: Curator. The Gallery subjects are waking up. They\'re confused but alive. Someone needs to help them adjust.');

        // Curator's new role
        await player.showText('The Curator: Then that\'s what we\'ll do. The Preservers built a museum. Perhaps it\'s time we became librarians instead — not freezing memories, but keeping them. Sharing them. Letting people borrow what they need and bring it back changed.');
        await player.showText('The Curator: An archive, not a prison.');

        // System message for role change
        await player.showText('SYSTEM: The Preservers\' role transforms. They are no longer enforcers of stasis — they become the world\'s archivists, memory keepers who record and share rather than freeze and guard.');

        // Clean up dynamic events
        if (curatorEvent) curatorEvent.remove();
        if (aricEvent) aricEvent.remove();

        // --- Part 2: Return to Village Hub and NPC Reactions ---
        // Spawn Callum and Lira dynamically for this scene
        const callumEvent = await player.createDynamicEvent({
            x: 14,
            y: 16,
            graphic: 'npc_callum',
            name: 'Callum',
        });

        const liraEvent = await player.createDynamicEvent({
            x: 16,
            y: 16,
            graphic: 'npc_lira',
            name: 'Lira',
        });

        // Callum dialogue
        await player.showText('Callum: Forty years I spent studying the Dissolved. Reading their journals, tracing their memories, trying to understand why they chose to let go.');
        await player.showText('Callum: I think I understand now. They let go because they were done. Their work was complete. The world was better for what they built, and the best thing they could do was trust the next generation to carry it forward.');
        await player.showText('Callum: That\'s what you did with the First Memory. You didn\'t destroy it or freeze it. You carried it forward. Into something new.');
        await player.showText('Callum: I\'m proud of you. Lira and I both are.');

        // Lira dialogue
        await player.showText('Lira: Don\'t speak for me, old man. I\'m proud of myself too — I taught you everything you know.');
        await player.showText('Callum: You taught the combat. I taught the wisdom.');
        await player.showText('Lira: You taught the lectures. There\'s a difference.');

        // Clean up dynamic events
        if (callumEvent) callumEvent.remove();
        if (liraEvent) liraEvent.remove();

        // Update quest state
        player.setVariable('MQ-10_STATE', 'COMPLETED');

        // Allow free exploration
        await player.showText('The world is vivid. Explore the Village Hub and talk to its residents to hear their reactions to the bloom.');
    }
}

export default Act3Scene11CuratorsChoice;
