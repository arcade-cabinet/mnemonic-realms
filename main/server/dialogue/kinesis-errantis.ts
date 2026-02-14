import type { RpgPlayer } from '@rpgjs/server';
import { isQuestActive } from '../systems/quests';

export default async function (player: RpgPlayer) {
  const NPC_ID = 'errantis'; // Assuming 'errantis' is the ID for the Errantis NPC graphic

  // 1. Check trigger conditions
  const questGQ04Active = isQuestActive(player, 'GQ-04');
  const isSorrowEmotionChosen = player.getVariable('GQ-04_emotion') === 'sorrow';

  // Location check (assuming map ID is 'hollow-ridge-kinesis-spire')
  const isAtCorrectLocation =
    (player.map as { id?: string })?.id === 'hollow-ridge-kinesis-spire' &&
    player.position.x === 24 &&
    player.position.y === 10;

  if (!questGQ04Active || !isSorrowEmotionChosen || !isAtCorrectLocation) {
    // If conditions are not met, do not proceed with the dialogue
    // Optionally, you could add a different dialogue or a system message here.
    // For this request, we'll just exit.
    return;
  }

  // 2. Play dialogue lines
  await player.showText(
    'Every road ends. Every step fades. But the walking mattered. I am Errantis.',
    { speaker: NPC_ID },
  );

  // End of dialogue
}
