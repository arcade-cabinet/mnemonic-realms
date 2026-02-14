import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger condition: The Edge — final scene (Scene 12)
  const questState = player.getQuest('act3-scene12-new-beginning')?.state;
  const isFinalSceneActive = questState === 'active' || questState === 'stage_final_dialogue';

  if (!isFinalSceneActive) {
    return;
  }

  await player.showText(
    "Of course it is. The new question is 'What will we create next?' That's a question with infinite answers.",
    { speaker: 'Artun' },
  );
}
