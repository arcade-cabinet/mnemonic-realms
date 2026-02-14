import type { RpgPlayer } from '@rpgjs/server';

export default async function dialogue(player: RpgPlayer) {
  // This dialogue is triggered by Lira's freezing (Scene 11) in the expanded Stagnation Zone.
  // The external game logic handles the initial trigger condition (quest state, location).
  // No internal checks are required within this specific dialogue file as it's a linear sequence.

  await player.showText('I did not want this.', 'The Curator', { portrait: 'curator' });
  await player.showText(
    'Your friend is brave. She pushed against the boundary, and the boundary pushed back.',
    'The Curator',
    { portrait: 'curator' },
  );
  await player.showText(
    'She is not harmed. She is... held. Every memory she carries — all preserved. Perfectly. Is that not a kindness?',
    'The Curator',
    { portrait: 'curator' },
  );
}
