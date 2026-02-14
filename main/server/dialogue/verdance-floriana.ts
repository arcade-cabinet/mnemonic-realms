import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger Conditions:
  // 1. Quest GQ-02 is active or completed
  // 2. The 'joy' emotion was chosen during the Verdance recall event
  // 3. Player is at Shimmer Marsh, Verdance's Hollow (25, 35)

  const questGQ02 = player.getQuest('GQ-02');
  const verdanceRecallEmotion = player.getVariable('verdance_recall_emotion');

  const isAtCorrectLocation =
    player.map.id === 'shimmer_marsh' && player.position.x === 25 && player.position.y === 35;
  const isQuestConditionMet =
    questGQ02 && (questGQ02.state === 'ACCEPTED' || questGQ02.state === 'COMPLETED');
  const isEmotionConditionMet = verdanceRecallEmotion === 'joy';

  if (isAtCorrectLocation && isQuestConditionMet && isEmotionConditionMet) {
    await player.showText(
      'I was a seed! A seed dreaming of forests and flowers — and now I bloom! I am Floriana.',
      { speaker: 'Floriana' },
    );

    player.setVariable('dlg_verdance_floriana_joy_spoken', true);
  }
}
