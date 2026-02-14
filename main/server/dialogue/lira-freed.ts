import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger conditions: Hana freed from expanded Stagnation Zone
  // Context: Player broadcasts potency 4+ fragment after all 4 god recalls.

  await player.showText('I... how long?', { speaker: 'Hana' });

  await player.showText(
    'I remember the crystal closing. I remember reaching for the anchor stone. And then... nothing. A perfect, silent nothing.',
    { speaker: 'Hana' },
  );

  await player.showText(
    "It wasn't terrible. That's the worst part. If it had hurt, I could hate them for it. But it was just... still. And I'm not built for still.",
    { speaker: 'Hana' },
  );

  await player.showText(
    "Thank you. Now tell me everything I missed — and then let's go finish what we started.",
    { speaker: 'Hana' },
  );
}
