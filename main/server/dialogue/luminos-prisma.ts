import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // --- Trigger Conditions and Quest State Checks ---
  const questGQ03 = player.getQuest('GQ-03');
  const aweEmotionChosen: boolean = player.getVariable('aweEmotionChosen') || false;

  // Check if Quest GQ-03 is active (e.g., 'started' or 'accepted')
  if (!questGQ03 || questGQ03.state !== 'started') {
    return;
  }

  // Check if the specific 'awe emotion chosen' condition is met
  if (!aweEmotionChosen) {
    return;
  }

  // --- Dialogue Logic ---

  // Prisma's dialogue line
  await player.showText(
    'One light enters the prism. Many colors emerge. Both are true. I am Prisma.',
    { speaker: 'Prisma' },
  );
}
