import type { RpgEvent, RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer, event: RpgEvent) {
  // Trigger Conditions:
  // 1. Quest 'GQ-01' is active.
  // 2. Quest 'GQ-01' has 'sorrow emotion chosen'.
  // 3. The triggering event (Tacet) is at the specified location.

  const questGQ01 = player.getQuest('GQ-01');
  const isQuestActive = questGQ01 && questGQ01.state === 'started'; // Assuming 'started' means active
  const hasSorrowChosen = questGQ01 && questGQ01.getVariable('emotionChosen') === 'sorrow';

  // Check if the event (Tacet) is at the correct map and coordinates
  const isAtAmphitheater =
    event.map.id === 'Resonance Fields — Amphitheater' && event.x === 25 && event.y === 25;

  if (!isQuestActive || !hasSorrowChosen || !isAtAmphitheater) {
    // Conditions not met, dialogue does not proceed.
    return;
  }

  // Define the speaker for Tacet (using the event's properties)
  const tacetSpeaker = {
    name: 'Tacet',
    graphic: event.graphic, // Assumes event.graphic holds the graphic ID for Tacet
  };

  // SYSTEM: "I am Tacet. The Necessary Silence. Listen to what you cannot hear. That is where truth lives."
  await player.gui('rpg-notification').open({
    text: 'I am Tacet. The Necessary Silence. Listen to what you cannot hear. That is where truth lives.',
    type: 'info', // Use 'info' for a general system notification
  });

  // End of dialogue
}
