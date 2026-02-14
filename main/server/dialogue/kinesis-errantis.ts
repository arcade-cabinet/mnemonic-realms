import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const NPC_ID = 'errantis'; // Assuming 'errantis' is the ID for the Errantis NPC graphic

  // 1. Check trigger conditions
  const questGQ04 = player.getQuest('GQ-04');
  const isQuestGQ04Active = questGQ04?.isStarted();
  const isSorrowEmotionChosen = questGQ04 && questGQ04.get('emotion') === 'sorrow';

  // Location check (assuming map ID is 'hollow-ridge-kinesis-spire')
  const isAtCorrectLocation =
    player.map.id === 'hollow-ridge-kinesis-spire' &&
    player.position.x === 24 &&
    player.position.y === 10;

  if (!isQuestGQ04Active || !isSorrowEmotionChosen || !isAtCorrectLocation) {
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
