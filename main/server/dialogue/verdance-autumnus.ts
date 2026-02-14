import type { RpgPlayer } from '@rpgjs/server';
import { isQuestActive } from '../systems/quests';

export default async function (player: RpgPlayer) {
  // --- Trigger Conditions Check ---
  const questActive = isQuestActive(player, 'GQ-02');
  const isSorrowEmotionChosen = player.getVariable('verdance_recall_emotion') === 'sorrow';

  // Assuming 'verdance_hollow' is the map ID for "Shimmer Marsh — Verdance's Hollow"
  const currentMapId = (player.map as { id?: string })?.id;
  const playerPosition = player.position;
  const isAtCorrectLocation =
    currentMapId === 'verdance_hollow' && playerPosition.x === 25 && playerPosition.y === 35;

  // This dialogue triggers specifically for the "Verdance recall — Sorrow" event
  // when Quest GQ-02 is active and the 'sorrow' emotion has been chosen.
  if (questActive && isSorrowEmotionChosen && isAtCorrectLocation) {
    // Autumnus: "Every garden has its autumn. Growth means shedding. I am Autumnus. What falls feeds what rises."
    await player.showText(
      'Every garden has its autumn. Growth means shedding. I am Autumnus. What falls feeds what rises.',
      { speaker: 'Autumnus' },
    );

    // Optionally, after this dialogue, you might want to update a quest objective
    // or set a flag to indicate this specific recall has been experienced.
    // Example: player.setVariable('verdance_recall_sorrow_completed', true);
    // Example: player.updateQuest('GQ-02', 'objective_autumnus_spoken');
  }
}
