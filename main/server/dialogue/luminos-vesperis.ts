export default async function (player: RpgPlayer, event: RpgEvent) {
  // Trigger Condition: Luminos recall — Sorrow
  // Checks if Quest GQ-03 is active/completed and if 'sorrow' emotion was chosen during a previous Luminos recall.
  const questGQ03 = player.getQuest('GQ-03');
  const luminosRecallEmotion = player.getVariable('luminos_recall_emotion');

  if (
    questGQ03 &&
    (questGQ03.isStarted || questGQ03.isCompleted) &&
    luminosRecallEmotion === 'sorrow'
  ) {
    // Vesperis: "Not every light needs to blaze. Some lights are kindest when they soften. I am Vesperis."
    await player.showText(
      'Not every light needs to blaze. Some lights are kindest when they soften. I am Vesperis.',
      { speaker: event },
    );
  } else {
    // Optional: Handle cases where the trigger condition is not met.
    // For this specific request, we only proceed if the condition is met.
    // If no other dialogue is intended, the function can simply end.
    // await player.showText('Vesperis is silent, observing you quietly.'); // Example fallback
  }
}
