import type { RpgPlayer } from '@rpgjs/server';
import { isQuestActive } from '../systems/quests';

export default async function (player: RpgPlayer) {
  // Trigger conditions:
  // 1. Quest GQ-02 is active (or known, depending on game logic)
  // 2. The 'fury' emotion was chosen in a previous 'Verdance recall' event
  // 3. Player is at the specified location
  const questGQ02IsActive = isQuestActive(player, 'GQ-02');
  const furyEmotionChosen = player.getVariable('verdance_recall_emotion') === 'fury'; // Assuming a variable stores the chosen emotion
  const isOnLocation =
    (player.map as { id?: string })?.id === 'Shimmer Marsh' &&
    player.position.x === 25 &&
    player.position.y === 35;

  if (questGQ02IsActive && furyEmotionChosen && isOnLocation) {
    await player.showText(
      "Life doesn't ask permission — it pushes through stone, through crystal. I am Thornweald. Nothing resists me.",
      { speaker: 'Thornweald' },
    );
  }
}
