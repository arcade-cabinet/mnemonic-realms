import type { RpgPlayer } from '@rpgjs/server';
import { isQuestComplete } from '../systems/quests';

export default async function (player: RpgPlayer) {
  const hasRecalledFirstGod = player.getVariable('hasRecalledFirstGod');
  const dialoguePlayed = player.getVariable('dlg_callum_first_recall_played');
  const mq06Completed = isQuestComplete(player, 'MQ-06');

  if (!hasRecalledFirstGod || dialoguePlayed || !mq06Completed) {
    return;
  }

  player.setVariable('dlg_callum_first_recall_played', true);

  await player.showText("Forty years of study. And now I'm watching one wake up.", {
    speaker: 'Artun',
  });
  await player.showText("I thought I'd cry. I'm not crying. I'm too amazed to cry.", {
    speaker: 'Artun',
  });
}
