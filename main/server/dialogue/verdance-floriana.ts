export default async function (player: RpgPlayer, event: RpgEvent) {
  // Trigger Conditions:
  // 1. Quest GQ-02 is active or completed
  // 2. The 'joy' emotion was chosen during the Verdance recall event (represented by a player variable)
  // 3. Player is at Shimmer Marsh, Verdance's Hollow (25, 35)

  const questGQ02 = player.getQuest('GQ-02');
  const verdanceRecallEmotion = player.getVariable('verdance_recall_emotion');

  const isAtCorrectLocation =
    player.map.id === 'shimmer_marsh' && player.position.x === 25 && player.position.y === 35;
  const isQuestConditionMet =
    questGQ02 && (questGQ02.state === 'ACCEPTED' || questGQ02.state === 'COMPLETED');
  const isEmotionConditionMet = verdanceRecallEmotion === 'joy';

  if (isAtCorrectLocation && isQuestConditionMet && isEmotionConditionMet) {
    // Floriana's dialogue
    await player.showText(
      'I was a seed! A seed dreaming of forests and flowers — and now I bloom! I am Floriana.',
      {
        speaker: 'Floriana',
        portrait: 'floriana_portrait', // Assuming 'floriana_portrait' is the graphic ID for Floriana
      },
    );

    // Optionally, set a flag so this specific dialogue doesn't repeat
    player.setVariable('dlg_verdance_floriana_joy_spoken', true);
  } else {
    // If conditions are not met, the dialogue does not play.
    // You could add a default "else" dialogue here if needed,
    // or simply let the event continue without dialogue.
    // For this specific request, we only play if conditions are met.
  }
}
