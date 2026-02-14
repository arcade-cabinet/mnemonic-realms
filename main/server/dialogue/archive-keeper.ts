import { type RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer, event: RpgEvent) {
  const graphic = event.getGraphic();

  // Trigger Condition: Ensure the player is on the correct map
  const currentMap = player.getMap();
  if (currentMap?.id !== 'preserver-fortress-floor2') {
    return; // This dialogue is not intended for other maps
  }

  // Quest State Check: Determine if the Archive Keeper is defeated or not
  // 'pre-combat': Dialogue before the fight
  // 'defeated': Dialogue after the fight
  const archiveKeeperCombatState = player.getVariable('archiveKeeperCombatState');

  if (archiveKeeperCombatState === 'defeated') {
    // Defeated dialogue line
    await player.showText('The Curator... will understand.', {
      speaker: 'Archive Keeper',
      graphic: graphic,
      whisper: true, // Indicates a whispering tone
    });
  } else {
    // Pre-combat dialogue lines (default for this trigger)
    await player.showText(
      'You do not understand what you are destroying. Each frozen moment is irreplaceable. Each one is a universe of perfection, held in crystal, safe from entropy.',
      {
        speaker: 'Archive Keeper',
        graphic: graphic,
      },
    );

    await player.showText('The Curator trusted me to protect these. I will not fail.', {
      speaker: 'Archive Keeper',
      graphic: graphic,
    });
  }
}
