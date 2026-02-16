import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger: Endgame Bloom — Village Hub return (Scene 11)
  // Location: Village Hub
  // This dialogue assumes the player is in the Village Hub and the endgame bloom event has occurred.
  // Specific quest state or flags would be checked here if available.
  // For example:
  // if (!player.getQuest('endgameBloom').isCompleted()) {
  //     return;
  // }
  // if (player.getVariable('currentScene') !== 'act3-scene11-curators-choice') {
  //     return;
  // }

  await player.showText(
    "Don't speak for me, old man. I'm proud of myself too — I taught you everything you know.",
    {
      speaker: 'Hana',
    },
  );

  await player.showText("You taught the lectures. There's a difference.", {
    speaker: 'Hana',
  });
}
