import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Check if this dialogue has been played before for "first visit" logic
  // This is a common pattern to ensure "first visit" dialogues only play once.
  if (player.getVariable('DIALOGUE_NYRO_FIRST_VISIT_PLAYED')) {
    return; // Dialogue already played, exit
  }

  // Nyro: "The Bright Hearth — best inn in the village! Well, only inn. Rest your feet, rest your mind."
  await player.showText(
    'The Bright Hearth — best inn in the village! Well, only inn. Rest your feet, rest your mind.',
    { speaker: 'Nyro' },
  );

  // Mark the dialogue as played
  player.setVariable('DIALOGUE_NYRO_FIRST_VISIT_PLAYED', true);
}
