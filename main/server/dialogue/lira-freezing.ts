import type { RpgMap, RpgPlayer, RpgSceneMap } from '@rpgjs/server';
import { RpgDialogue } from '@rpgjs/server/lib/modules/dialogue/dialogue';

export default async function (player: RpgPlayer) {
  const map: RpgMap = player.map;
  const scene: RpgSceneMap = map.getScene<RpgSceneMap>();

  // Trigger condition: Stagnation expansion — Lira rescues farmer (Scene 11)
  // This dialogue is part of the main quest MQ-04, specifically the climax of Act I.
  // We assume the quest state for MQ-04 is active and at the appropriate stage.
  // The location check is implicit by the dialogue being attached to an event in that map.
  const isQuestActive = player.getQuest('MQ-04')?.state === 'active';
  const isCorrectScene = player.getVariable('ACT1_SCENE11_LIRAS_FREEZING_ACTIVE') === true; // Custom flag for scene progression

  if (!isQuestActive || !isCorrectScene) {
    // If conditions are not met, do not play this dialogue.
    // This might be an empty function or a default "talk" dialogue.
    return;
  }

  const liraPortrait = 'lira_portrait'; // Assuming a graphic ID for Lira's portrait

  await player.showText("No. No, no — it's bigger. Much bigger. They're reinforcing it.", {
    speaker: 'Lira',
    portrait: liraPortrait,
  });

  await player.showText("I'll get her. You — stay back.", {
    speaker: 'Lira',
    portrait: liraPortrait,
  });

  await player.showText('Run. Get to the village. Everyone, GO.', {
    speaker: 'Lira',
    portrait: liraPortrait,
  });

  await player.showText("I'm going to break through. Stay here and —", {
    speaker: 'Lira',
    portrait: liraPortrait,
  });

  // SYSTEM: "Lira is frozen mid-stride."
  await player.gui('rpg-notification', {
    message: 'Lira is frozen mid-stride.',
    type: 'system',
    position: 'center',
  });

  // Set a flag or update quest state to reflect Lira being frozen.
  // This will prevent her from being interacted with normally and enable Act II questline.
  player.setVariable('LIRA_IS_FROZEN', true);
  player.updateQuest('MQ-04', 'lira_frozen'); // Example quest state update
}
