import type { RpgEvent, RpgPlayer } from '@rpgjs/server';
import { RpgQuestState } from '@rpgjs/server/lib/quests/quest';

export default async function (player: RpgPlayer, event: RpgEvent) {
  // Trigger conditions and quest state checks
  const questGQ02 = player.getQuest('GQ-02');
  const aweEmotionChosen = player.getVariable('awe_emotion_chosen'); // Assuming 'awe_emotion_chosen' is a boolean variable set when the emotion is chosen.

  // This dialogue is specifically for the "Verdance recall — Awe" trigger,
  // which implies Quest GQ-02 is active/completed and 'awe_emotion_chosen' is true.
  if (
    questGQ02 &&
    (questGQ02.state === RpgQuestState.STARTED || questGQ02.state === RpgQuestState.COMPLETED) &&
    aweEmotionChosen === true
  ) {
    // Sylvanos's speech line
    await player.showText(
      'I grew downward while you looked up. I am Sylvanos. The patient understand what the hurried never will.',
      { speaker: event.graphic },
    );
  }
  // If the conditions are not met, this specific dialogue will not proceed.
  // An event's onAction method would typically handle alternative dialogues or actions
  // if these conditions are not met.
}
