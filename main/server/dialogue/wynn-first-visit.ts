import type { RpgPlayer } from '@rpgjs/server';

export default async function dialogue(player: RpgPlayer) {
  // Vash's graphic is usually 'wynn' or similar, assuming it's registered in the game.
  // The portrait will be automatically picked up if the speaker name matches a registered character.

  await player.showText(
    "Ah. A visitor. Unusual. I'm Vash — I study the Dissolved from this hut. The marsh is rich with their memories. Quieter than a library, and far more honest.",
    { speaker: 'Vash' },
  );

  await player.showText(
    "You're an Architect, aren't you? I can tell by the way you look at the water — like you're reading it. Most people just see reflections.",
    { speaker: 'Vash' },
  );

  await player.showText(
    "There's a glade south of here. Verdance's Hollow. The tree there has been pulsing stronger this past month. Something's waking up. I'd investigate myself, but I don't move fast enough for what lives between here and there.",
    { speaker: 'Vash' },
  );

  // After this initial dialogue, the game might set a flag or start a quest (SQ-06)
  // For example:
  // player.setVariable('SQ-06_Started', true);
  // player.addQuest('SQ-06'); // Assuming a quest system
}
