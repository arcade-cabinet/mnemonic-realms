export default async function (player: RpgPlayer) {
  // This dialogue is triggered after Lira's freedom, as a crystal projection.
  // Assuming the calling event/scene handles the quest state and location checks.

  await player.showText(
    "You've freed your friend. I expected that. The crystal was never meant to hold her forever — only long enough for me to finish.",
    {
      speaker: {
        name: 'The Curator',
        graphic: 'curator', // Assuming 'curator' is the graphic ID for The Curator
      },
    },
  );

  await player.showText(
    "The First Memory — the world's original question — sits at the heart of my Fortress. When I crystallize it, the question stops being asked. The cycle of wonder-create-dissolve ends. No more civilizations rising and falling. No more loss.",
    {
      speaker: {
        name: 'The Curator',
        graphic: 'curator',
      },
    },
  );

  await player.showText(
    "You think this is evil. I think it is mercy. Come to the Fortress and we'll see which of us is right.",
    {
      speaker: {
        name: 'The Curator',
        graphic: 'curator',
      },
    },
  );
}
