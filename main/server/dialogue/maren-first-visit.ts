import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const MAREN_FIRST_VISIT_FLAG = 'ACT_I_MAREN_FIRST_VISIT_DONE';

  // Check if this specific introductory dialogue has already been played
  if (player.getVariable(MAREN_FIRST_VISIT_FLAG)) {
    // If it's not the first visit, subsequent interactions should typically
    // just open the shop or play a different ambient line.
    // For this dialogue file, we'll open the shop directly.
    await player.openShop('general-shop');
    return;
  }

  // Dialogue for the first visit
  await player.showText(
    "Welcome, welcome! You must be the one Callum's been talking about — the new Architect!",
    { speaker: 'Maren' },
  );
  await player.showText(
    "I'm Maren. I sell a little of everything and know a little of everything. What can I get you?",
    { speaker: 'Maren' },
  );

  // Set the flag so this specific introductory dialogue doesn't play again
  player.setVariable(MAREN_FIRST_VISIT_FLAG, true);

  // After the introduction, open the shop
  await player.openShop('general-shop');
}
