import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger: Luminos recall — Fury
  // Location: Flickerveil — Luminos Grove (20, 20)
  // References: Quest: GQ-03 | Condition: GQ-03, fury emotion chosen

  const mapId = player.map.id;
  const playerX = player.position.x;
  const playerY = player.position.y;

  const questGQ03 = player.getQuest('GQ-03');
  // Assuming 'GQ-03_fury_chosen' is a player variable set when the fury emotion is chosen
  const furyEmotionChosen = player.getVariable('GQ-03_fury_chosen');

  const isCorrectLocation =
    mapId === 'flickerveil-luminos-grove' && playerX === 20 && playerY === 20;
  const isQuestActive = questGQ03?.state === 'started';
  const isFuryConditionMet = furyEmotionChosen === true;

  if (isCorrectLocation && isQuestActive && isFuryConditionMet) {
    // Pyralis: "What hides in shadow rots. I am the burning eye. I am Pyralis."
    await player.showText('What hides in shadow rots. I am the burning eye. I am Pyralis.', {
      speaker: 'Pyralis', // The event object represents Pyralis, using its graphic as portrait
    });
  }
}
