import type { RpgPlayer } from '@rpgjs/server';
import { isQuestActive, isQuestComplete } from '../systems/quests';

export default async function (player: RpgPlayer) {
  // Trigger Condition: Luminos recall — Sorrow
  const luminosRecallEmotion = player.getVariable('luminos_recall_emotion');

  if (
    (isQuestActive(player, 'GQ-03') || isQuestComplete(player, 'GQ-03')) &&
    luminosRecallEmotion === 'sorrow'
  ) {
    await player.showText(
      'Not every light needs to blaze. Some lights are kindest when they soften. I am Vesperis.',
      { speaker: 'Vesperis' },
    );
  }
}
