export default async function (player: RpgPlayer, event: RpgEvent) {
  // Condition: GQ-03 (assuming it needs to be completed for this specific dialogue branch)
  // and 'joy emotion chosen' (assuming a variable stores this choice)
  const questGQ03 = player.getQuest('GQ-03');
  const chosenEmotion = player.getVariable('luminos_recall_emotion');

  if (questGQ03 && questGQ03.state === 'completed' && chosenEmotion === 'joy') {
    // Solara's graphic ID is assumed to be 'solara' for the portrait
    await player.showText(
      'Dawn. The first light of a day that has never been lived before. I am Solara.',
      {
        speaker: 'solara',
      },
    );
  } else {
    // Optional: Handle cases where conditions are not met, e.g., a different dialogue or no dialogue.
    // For this specific trigger, we only proceed if the conditions are met.
    // If this dialogue is attached to an event, the event's onAction/onOverlap might handle this.
    // For now, if conditions aren't met, the dialogue simply doesn't play these specific lines.
  }
}
