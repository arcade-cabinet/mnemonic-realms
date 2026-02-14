import type { RpgPlayer } from '@rpgjs/server';

export default async function dialogue(player: RpgPlayer) {
  const aricSpeaker = {
    name: 'Aric',
    graphic: player.getGraphic('Aric'), // Assuming 'Aric' is the ID for Aric's graphic
  };

  // No specific trigger conditions (quest state, location, flags) are checked within this dialogue function itself,
  // as the RPG-JS engine typically handles the initial trigger for the dialogue event.
  // This function assumes it is called when the conditions for "Fortress Gate — Aric's intelligence briefing (Scene 3)" are met.

  await player.showText('Architect. I expected you.', aricSpeaker);
  await player.showText(
    "The Curator is wrong about the First Memory. Crystallizing it won't preserve the world — it will kill it.",
    aricSpeaker,
  );
  await player.showText(
    'Three floors. The Gallery of Moments. The Archive of Perfection. The First Memory Chamber.',
    aricSpeaker,
  );
  await player.showText(
    'Your four recalled gods are weakening the crystal from outside.',
    aricSpeaker,
  );
}
