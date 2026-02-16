import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // This dialogue is triggered by Hana's freezing (Scene 11) in the expanded Stagnation Zone.
  // The external game logic handles the initial trigger condition (quest state, location).

  await player.showText('I did not want this.', { speaker: 'Grym' });
  await player.showText(
    'Your friend is brave. She pushed against the boundary, and the boundary pushed back.',
    { speaker: 'Grym' },
  );
  await player.showText(
    'She is not harmed. She is... held. Every memory she carries — all preserved. Perfectly. Is that not a kindness?',
    { speaker: 'Grym' },
  );
}
