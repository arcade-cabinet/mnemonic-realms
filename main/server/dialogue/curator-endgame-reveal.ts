import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // This dialogue is triggered after Hana's freedom, as a crystal projection.

  await player.showText(
    "You've freed your friend. I expected that. The crystal was never meant to hold her forever — only long enough for me to finish.",
    { speaker: 'Grym' },
  );

  await player.showText(
    "The First Memory — the world's original question — sits at the heart of my Fortress. When I crystallize it, the question stops being asked. The cycle of wonder-create-dissolve ends. No more civilizations rising and falling. No more loss.",
    { speaker: 'Grym' },
  );

  await player.showText(
    "You think this is evil. I think it is mercy. Come to the Fortress and we'll see which of us is right.",
    { speaker: 'Grym' },
  );
}
