import type { RpgPlayer } from '@rpgjs/server';
import { isQuestActive, isQuestComplete } from '../systems/quests';

/**
 * Dialogue for Cantara, triggered by a "Resonance recall — Joy".
 * This dialogue plays when Quest GQ-01 is active or completed,
 * and the player has previously chosen the 'joy' emotion within that quest.
 */
export default async function (player: RpgPlayer) {
  // --- Trigger Conditions Check ---
  // This dialogue is specific to a "Resonance recall — Joy".
  // It requires Quest GQ-01 to be in an active or completed state,
  // and a specific variable 'GQ-01_joy_chosen' to be true, indicating the player's choice.
  const questActive = isQuestActive(player, 'GQ-01');
  const questComplete = isQuestComplete(player, 'GQ-01');
  const joyEmotionChosen = player.getVariable('GQ-01_joy_chosen');

  // If the quest is not active/completed or the 'joy' choice wasn't made,
  // this specific recall dialogue should not proceed.
  if ((!questActive && !questComplete) || !joyEmotionChosen) {
    return;
  }

  // --- Dialogue Sequence ---

  // Cantara's speech line
  await player.showText(
    'I was a hum. Now I am a song! I am Cantara, and the world will sing with me!',
    {
      speaker: 'Cantara', // Use the graphic of the triggering event (Cantara) as the speaker portrait
    },
  );

  // No further lines or choices in this specific recall.
}
