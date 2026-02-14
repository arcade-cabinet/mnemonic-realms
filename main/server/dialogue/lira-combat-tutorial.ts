import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // This dialogue is intended to be called by a map event or quest manager
  // after specific trigger conditions (e.g., quest state, player location) are met.
  // The dialogue function itself focuses on presenting the dialogue lines.

  await player.showText(
    "See those practice dummies? They're enchanted with a bit of memory energy — enough to fight back.",
    { speaker: 'Hana' },
  );
  await player.showText(
    "I'll keep you standing. Focus on the dummies — try your class skill when you have SP for it.",
    { speaker: 'Hana' },
  );
  await player.showText("Not bad at all. You're a natural.", { speaker: 'Hana' });
  await player.showText('Now a real one. This little sprite wandered in from the fields.', {
    speaker: 'Hana',
  });
  await player.showText('Well done! You earned that.', { speaker: 'Hana' });
}
