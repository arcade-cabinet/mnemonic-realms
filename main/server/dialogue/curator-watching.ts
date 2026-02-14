import type { RpgPlayer } from '@rpgjs/server';
import { getQuestStatus } from '../systems/quests';

export default async function (player: RpgPlayer) {
  // Define the NPC ID for The Curator's graphic, used for the speaker portrait.
  const curatorNpcId = 'curator'; // Assuming 'curator' is the graphic ID for The Curator.

  // Define trigger conditions
  const questId = 'MQ-10'; // Main Quest ID
  const requiredQuestStep = 'scene9-remix-watching'; // Specific step in MQ-10 for this dialogue
  const requiredMapId = 'map-first-memory-chamber'; // Map ID for the First Memory Chamber

  // Check if all conditions are met for this dialogue to trigger
  const questStatus = getQuestStatus(player, questId);
  const isQuestActiveAndStepMet =
    questStatus === 'active' &&
    player.getVariable(`QUEST_${questId}_STEP`) === requiredQuestStep;
  const isAtCorrectLocation = (player.map as { id?: string })?.id === requiredMapId;

  if (isQuestActiveAndStepMet && isAtCorrectLocation) {
    // The Curator: "You didn't destroy it. You... grew it."
    await player.showText("You didn't destroy it. You... grew it.", { speaker: curatorNpcId });

    // Optionally, update the quest step or set a flag after this dialogue to prevent re-triggering
    // player.setVariable(`QUEST_${questId}_STEP`, 'scene9-remix-dialogue-complete');
  }
}
