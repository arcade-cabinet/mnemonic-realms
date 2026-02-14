import type { RpgPlayer } from '@rpgjs/server';
import { isQuestComplete } from '../systems/quests';

export default async function (player: RpgPlayer) {
  // Condition: GQ-03 completed and 'joy' emotion chosen during Luminos recall
  const questComplete = isQuestComplete(player, 'GQ-03');
  const chosenEmotion = player.getVariable('luminos_recall_emotion');

  if (questComplete && chosenEmotion === 'joy') {
    await player.showText(
      'Dawn. The first light of a day that has never been lived before. I am Solara.',
      { speaker: 'Solara' },
    );
  }
}
