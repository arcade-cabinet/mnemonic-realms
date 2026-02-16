import type { RpgPlayer } from '@rpgjs/server';
import { isQuestActive } from '../systems/quests';

export default async function (player: RpgPlayer) {
  // --- Trigger Conditions and Quest State Checks ---
  const aweEmotionChosen: boolean = player.getVariable('aweEmotionChosen') || false;

  // Check if Quest GQ-03 is active
  if (!isQuestActive(player, 'GQ-03')) {
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
