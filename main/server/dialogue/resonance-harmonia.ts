import type { RpgPlayer } from '@rpgjs/server';
import { isQuestActive } from '../systems/quests';

export default async function (player: RpgPlayer) {
  // --- Trigger Conditions and Quest State Checks ---
  // This dialogue is specifically for the "Resonance recall — Awe" event.
  // It should only proceed if the following conditions are met.

  // Check if Quest GQ-01 is active
  const isQuestGQ01Active = isQuestActive(player, 'GQ-01');

  // Check if the 'awe emotion chosen' condition is met.
  // Assuming 'awe_emotion_chosen' is a boolean variable set by a previous player choice or event.
  const aweEmotionChosen = player.getVariable('awe_emotion_chosen') === true;

  // Check player's current location: "Resonance Fields — Amphitheater (25, 25)"
  // Assuming the map ID for "Resonance Fields — Amphitheater" is 'resonance-fields-amphitheater'.
  const isAtAmphitheater =
    (player.map as { id?: string })?.id === 'resonance-fields-amphitheater' &&
    player.position.x === 25 &&
    player.position.y === 25;

  // If any of the required conditions are not met, this specific dialogue sequence should not play.
  if (!isQuestGQ01Active || !aweEmotionChosen || !isAtAmphitheater) {
    // Optionally, you could play a different default dialogue here,
    // or simply return if this dialogue is only meant for these specific conditions.
    return;
  }

  // --- Dialogue Sequence ---

  // Harmonia: "I am Harmonia. Every sound the Choir ever made — I hold them all, and they are in balance."
  // The 'event' object is assumed to be Harmonia, and its graphic will be used as the speaker portrait.
  await player.showText(
    'I am Harmonia. Every sound the Choir ever made — I hold them all, and they are in balance.',
    {
      speaker: 'Harmonia',
    },
  );

  // End of dialogue.
}
