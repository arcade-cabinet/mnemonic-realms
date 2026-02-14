import type { RpgPlayer } from '@rpgjs/server';
import { isQuestActive } from '../systems/quests';

export default async function (player: RpgPlayer) {
  // --- Trigger Conditions Check ---
  // This dialogue is intended to be triggered by "Resonance recall — Fury".
  // The following checks ensure the dialogue only proceeds if specific quest conditions are met.

  // Check if Quest GQ-01 is currently active
  if (!isQuestActive(player, 'GQ-01')) {
    // If the quest is not active, Tempestus might not engage in this specific dialogue.
    // Optionally, you could add a different dialogue line here or simply return.
    // await player.showText({ text: "Tempestus is lost in thought, seemingly ignoring you.", speaker: 'Tempestus' });
    return;
  }

  // Check if the 'fury emotion chosen' condition for Quest GQ-01 is met
  const furyEmotionChosen = player.getVariable('GQ-01_fury_emotion_chosen');

  if (!furyEmotionChosen) {
    // If the specific condition is not met, Tempestus might have a different response.
    // Optionally, you could add a different dialogue line here or simply return.
    // await player.showText({ text: "Tempestus eyes you with a gaze that demands more.", speaker: 'Tempestus' });
    return;
  }

  // --- Dialogue Sequence ---

  // Tempestus: "ENOUGH SILENCE. I am Tempestus, and the sky will answer when I call."
  await player.showText('ENOUGH SILENCE. I am Tempestus, and the sky will answer when I call.', {
    speaker: 'Tempestus',
  });

  // End of dialogue.
}
