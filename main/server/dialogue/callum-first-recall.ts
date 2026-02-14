import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const hasRecalledFirstGod = player.getVariable('hasRecalledFirstGod');
  const dialoguePlayed = player.getVariable('dlg_callum_first_recall_played');
  const mq06Completed = player.getQuest('MQ-06')?.isCompleted();

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
