import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const hasVisitedTorvanBlacksmith = player.getVariable('firstVisitTorvanBlacksmith');

  if (hasVisitedTorvanBlacksmith) {
    return;
  }

  await player.showText(
    "Mm. New Architect? Callum told me. I make weapons and armor — nothing fancy, but solid. If the world's going to test you, at least you'll be properly equipped.",
    {
      speaker: 'torvan',
    },
  );

  player.setVariable('firstVisitTorvanBlacksmith', true);
}
