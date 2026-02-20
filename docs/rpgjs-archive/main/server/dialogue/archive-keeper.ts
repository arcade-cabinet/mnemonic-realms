import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger Condition: Ensure the player is on the correct map
  if (player.map?.id !== 'preserver-fortress-floor2') {
    return;
  }

  // Quest State Check: Determine if the Archive Keeper is defeated or not
  const archiveKeeperCombatState = player.getVariable('archiveKeeperCombatState');

  if (archiveKeeperCombatState === 'defeated') {
    await player.showText('The Curator... will understand.', { speaker: 'Archive Keeper' });
  } else {
    await player.showText(
      'You do not understand what you are destroying. Each frozen moment is irreplaceable. Each one is a universe of perfection, held in crystal, safe from entropy.',
      { speaker: 'Archive Keeper' },
    );

    await player.showText('The Curator trusted me to protect these. I will not fail.', {
      speaker: 'Archive Keeper',
    });
  }
}
