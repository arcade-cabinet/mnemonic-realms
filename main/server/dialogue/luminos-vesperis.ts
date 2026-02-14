import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger Condition: Luminos recall — Sorrow
  const questGQ03 = player.getQuest('GQ-03');
  const luminosRecallEmotion = player.getVariable('luminos_recall_emotion');

  if (
    questGQ03 &&
    (questGQ03.isStarted || questGQ03.isCompleted) &&
    luminosRecallEmotion === 'sorrow'
  ) {
    await player.showText(
      'Not every light needs to blaze. Some lights are kindest when they soften. I am Vesperis.',
      { speaker: 'Vesperis' },
    );
  }
}
