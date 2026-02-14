import { type RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';

/**
 * Dialogue for Jubila, triggered by the "Kinesis recall — Joy" event.
 *
 * Dialogue ID: dlg-kinesis-jubila
 * NPC ID: jubila
 * Trigger Location: Hollow Ridge — Kinesis Spire (24, 10)
 * Conditions: Quest GQ-04 is active or completed, and 'joy' emotion was chosen.
 */
export default async function (player: RpgPlayer, event: RpgEvent) {
  // Retrieve current player and quest state
  const currentMapId = player.getMap().id;
  const playerPosition = player.getPosition();
  const questGQ04 = player.getQuest('GQ-04');
  const emotionChoice = player.getVariable('kinesis_emotion_choice');

  // Define trigger conditions
  const isAtCorrectLocation =
    currentMapId === 'hollow_ridge' && playerPosition.x === 24 && playerPosition.y === 10;

  const isQuestRelevant =
    questGQ04 && (questGQ04.state === 'active' || questGQ04.state === 'completed');
  const isJoyChosen = emotionChoice === 'joy';

  // Only proceed with the dialogue if all conditions are met
  if (isAtCorrectLocation && isQuestRelevant && isJoyChosen) {
    // Jubila: "Stillness? Stillness is OVER! I am Jubila. Follow me if you can!"
    await player.showText('Stillness? Stillness is OVER! I am Jubila. Follow me if you can!', {
      speaker: 'jubila', // Assuming 'jubila' is the graphic ID for Jubila's portrait
    });
  }
  // If conditions are not met, the dialogue function will simply complete without showing any text.
  // The calling event or system can handle alternative actions or dialogues.
}
