import { RpgMap, type RpgPlayer, RpgSceneMap } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger condition: The Edge — final scene (Scene 12)
  // This assumes a quest 'act3-scene12-new-beginning' is active
  // or a specific flag is set to indicate the final scene is playing.
  const questState = player.getQuest('act3-scene12-new-beginning')?.state;
  const isFinalSceneActive = questState === 'active' || questState === 'stage_final_dialogue'; // Example states

  if (!isFinalSceneActive) {
    // If the trigger condition is not met, do not play the dialogue.
    return;
  }

  // Dialogue for Callum in the ending scene
  await player.showText(
    "Of course it is. The new question is 'What will we create next?' That's a question with infinite answers.",
    {
      speaker: 'Callum', // Assuming 'Callum' is the graphic ID for Callum
      portrait: 'callum_portrait', // Assuming 'callum_portrait' is the portrait ID for Callum
    },
  );

  // End of dialogue
}
