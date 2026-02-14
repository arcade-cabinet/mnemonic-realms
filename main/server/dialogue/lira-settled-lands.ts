import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger condition: First time leaving the village south (Scene 5)
  if (player.getVariable('hasSeenSettledLandsDialogue')) {
    return;
  }

  await player.showText(
    "The Settled Lands. Everything south, east, and west of the village for a day's walk.",
    { speaker: 'Hana' },
  );
  await player.showText(
    'But look at the edges. See how the fence line over there just... stops? Like someone forgot to finish it?',
    { speaker: 'Hana' },
  );
  await player.showText("The world's young. It's still being built.", { speaker: 'Hana' });

  player.setVariable('hasSeenSettledLandsDialogue', true);
}
