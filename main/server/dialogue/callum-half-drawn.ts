import type { RpgPlayer } from '@rpgjs/server';

// Define Artun's speaker information for dialogue portraits
/**
 * Dialogue for Artun upon entering the Half-Drawn Forest.
 * This dialogue provides lore about the Dissolved and the nature of the forest.
 */
export default async function (player: RpgPlayer) {
  // Trigger Condition: Player enters the 'act3-scene1-half-drawn-forest' map
  // AND this specific dialogue has not been played before.
  const currentMapId = (player.map as { id?: string })?.id;
  const hasDialoguePlayed = player.getVariable('dlg_callum_half_drawn_played');

  if (currentMapId === 'act3-scene1-half-drawn-forest' && !hasDialoguePlayed) {
    // Mark the dialogue as played to ensure it only triggers once
    await player.setVariable('dlg_callum_half_drawn_played', true);

    // Play Artun's dialogue lines
    await player.showText(
      'Not walked away. Chose not to finish. The Dissolved trusted that future generations would complete it.',
      { speaker: 'Artun' },
    );

    await player.showText(
      "Broadcasting here is different. You're painting reality into existence.",
      { speaker: 'Artun' },
    );

    // No branching choices or system notifications are specified for this dialogue.
  }
}
