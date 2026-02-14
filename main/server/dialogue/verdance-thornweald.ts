import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger conditions:
  // 1. Quest GQ-02 is active (or known, depending on game logic)
  // 2. The 'fury' emotion was chosen in a previous 'Verdance recall' event
  // 3. Player is at the specified location
  const questGQ02IsActive = player.getQuest('GQ-02')?.state === 'active';
  const furyEmotionChosen = player.getVariable('verdance_recall_emotion') === 'fury'; // Assuming a variable stores the chosen emotion
  const isOnLocation =
    player.getMapId() === 'Shimmer Marsh' &&
    player.getPosition().x === 25 &&
    player.getPosition().y === 35;

  if (questGQ02IsActive && furyEmotionChosen && isOnLocation) {
    await player.showText(
      "Life doesn't ask permission — it pushes through stone, through crystal. I am Thornweald. Nothing resists me.",
      { speaker: 'Thornweald' },
    );
  }
}
