import type { RpgPlayer } from '@rpgjs/server';
import marenShop from './maren-shop';

export default async function (player: RpgPlayer) {
  const KHALI_FIRST_VISIT_FLAG = 'ACT_I_KHALI_FIRST_VISIT_DONE';

  // Check if this specific introductory dialogue has already been played
  if (player.getVariable(KHALI_FIRST_VISIT_FLAG)) {
    // If it's not the first visit, subsequent interactions should typically
    // just open the shop or play a different ambient line.
    // For this dialogue file, we'll delegate to the main shop dialogue.
    await marenShop(player);
    return;
  }

  // Dialogue for the first visit
  await player.showText(
    "Welcome, welcome! You must be the one Artun's been talking about — the new Architect!",
    { speaker: 'Khali' },
  );
  await player.showText(
    "I'm Khali. I sell a little of everything and know a little of everything. What can I get you?",
    { speaker: 'Khali' },
  );

  // Set the flag so this specific introductory dialogue doesn't play again
  player.setVariable(KHALI_FIRST_VISIT_FLAG, true);

  // After the introduction, open the shop
  await marenShop(player);
}
