import type { RpgPlayer } from '@rpgjs/server';

const Lira = {
    name: 'Lira',
    graphic: 'npc_lira'
};

export default async function(player: RpgPlayer) {
    // Trigger condition: First time leaving the village south (Scene 5)
    const hasSeenSettledLandsDialogue = player.getVariable('hasSeenSettledLandsDialogue');

    if (hasSeenSettledLandsDialogue) {
        return; // Dialogue already played
    }

    await player.showText('The Settled Lands. Everything south, east, and west of the village for a day\'s walk.');
    await player.showText('But look at the edges. See how the fence line over there just... stops? Like someone forgot to finish it?');
    await player.showText('The world\'s young. It\'s still being built.');

    // Set the flag so this dialogue doesn't repeat
    player.setVariable('hasSeenSettledLandsDialogue', true);
}
