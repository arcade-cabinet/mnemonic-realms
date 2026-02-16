import type { RpgPlayer } from '@rpgjs/server';
import { getQuestStatus } from '../systems/quests';

export default async function (player: RpgPlayer) {
  // Trigger condition: The Edge — final scene (Scene 12)
  const questState = getQuestStatus(player, 'act3-scene12-new-beginning');
  const isFinalSceneActive = questState === 'active';

  if (!isFinalSceneActive) {
    return;
  }

  await player.showText(
    "Of course it is. The new question is 'What will we create next?' That's a question with infinite answers.",
    { speaker: 'Artun' },
  );
}
