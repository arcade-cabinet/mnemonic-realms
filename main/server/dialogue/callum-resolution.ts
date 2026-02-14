import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const currentMapId = player.map?.id;
  const endgameBloomTriggered = player.get('endgameBloomTriggered');
  const hasPlayed = player.get('dlg-callum-resolution-played');

  if (!endgameBloomTriggered || currentMapId !== 'village_hub' || hasPlayed) {
    return;
  }
  await player.showText('Forty years I spent studying the Dissolved.', {
    speaker: 'Artun',
  });

  await player.showText('They let go because they were done. Their work was complete.', {
    speaker: 'Artun',
  });

  await player.showText("I'm proud of you. Hana and I both are.", {
    speaker: 'Artun',
  });

  player.set('dlg-callum-resolution-played', true);
}
