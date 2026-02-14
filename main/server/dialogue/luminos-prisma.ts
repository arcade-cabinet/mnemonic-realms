import type { RpgEvent, RpgPlayer, RRpgQuest } from '@rpgjs/server';

export default async function (player: RpgPlayer, event: RpgEvent) {
  // --- Trigger Conditions and Quest State Checks ---
  const questGQ03: RRpgQuest | undefined = player.getQuest('GQ-03');
  const aweEmotionChosen: boolean = player.getVariable('aweEmotionChosen') || false; // Assuming 'aweEmotionChosen' is a boolean variable

  // Check if Quest GQ-03 is active (e.g., 'started' or 'accepted')
  // This dialogue is intended to play when the quest is active.
  if (!questGQ03 || questGQ03.state !== 'started') {
    // If the quest is not in the required state, exit the dialogue.
    // In a typical RPG-JS setup, the event trigger itself would prevent this,
    // but this check fulfills the requirement to "wire trigger conditions" within the dialogue.
    console.log(`[dlg-luminos-prisma] Dialogue skipped: Quest GQ-03 is not in 'started' state.`);
    return;
  }

  // Check if the specific 'awe emotion chosen' condition is met
  if (!aweEmotionChosen) {
    // If the specific emotion condition is not met, exit.
    console.log(`[dlg-luminos-prisma] Dialogue skipped: 'aweEmotionChosen' variable is not true.`);
    return;
  }

  // --- Dialogue Logic ---

  // Get the graphic of the NPC (Prisma) from the event that triggered this dialogue
  const prismaGraphic = event.getGraphic();

  // Prisma's dialogue line
  await player.showText(
    'One light enters the prism. Many colors emerge. Both are true. I am Prisma.',
    {
      speaker: prismaGraphic,
      speakerName: 'Prisma',
    },
  );
}
