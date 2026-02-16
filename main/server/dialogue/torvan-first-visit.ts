import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const hasVisitedHarkBlacksmith = player.getVariable('DIALOGUE_HARK_FIRST_VISIT');

  if (hasVisitedHarkBlacksmith) {
    return;
  }

  await player.showText(
    "Mm. New Architect? Artun told me. I make weapons and armor — nothing fancy, but solid. If the world's going to test you, at least you'll be properly equipped.",
    {
      speaker: 'Hark',
    },
  );

  player.setVariable('DIALOGUE_HARK_FIRST_VISIT', true);
}
