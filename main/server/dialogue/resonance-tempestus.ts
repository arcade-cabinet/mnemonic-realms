import type { RpgEvent, RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer, event: RpgEvent) {
  // --- Trigger Conditions Check ---
  // This dialogue is intended to be triggered by "Resonance recall — Fury".
  // The following checks ensure the dialogue only proceeds if specific quest conditions are met.

  const questGQ01 = player.getQuest('GQ-01');

  // Check if Quest GQ-01 exists and is currently active ('started' state)
  if (!questGQ01 || questGQ01.state !== 'started') {
    // If the quest is not active, Tempestus might not engage in this specific dialogue.
    // Optionally, you could add a different dialogue line here or simply return.
    // await player.showText({ text: "Tempestus is lost in thought, seemingly ignoring you.", speaker: event.graphic });
    return;
  }

  // Check if the 'fury emotion chosen' condition for Quest GQ-01 is met
  const furyEmotionChosen = questGQ01.getCondition('fury emotion chosen');

  if (!furyEmotionChosen) {
    // If the specific condition is not met, Tempestus might have a different response.
    // Optionally, you could add a different dialogue line here or simply return.
    // await player.showText({ text: "Tempestus eyes you with a gaze that demands more.", speaker: event.graphic });
    return;
  }

  // --- Dialogue Sequence ---

  // Tempestus: "ENOUGH SILENCE. I am Tempestus, and the sky will answer when I call."
  await player.showText({
    text: 'ENOUGH SILENCE. I am Tempestus, and the sky will answer when I call.',
    speaker: event.graphic, // Uses the graphic of the event (Tempestus) as the speaker portrait
  });

  // End of dialogue.
}
