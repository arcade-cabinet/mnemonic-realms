import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  await player.showText('No. This is where the world is still beginning.', { speaker: 'Artun' });
  await player.showText(
    'If the Curator succeeds... these lines stop. The drawing ends mid-stroke.',
    { speaker: 'Artun' },
  );
}
