import type { RpgPlayer } from '@rpgjs/server';
import { isQuestComplete } from '../systems/quests';

export default async function (player: RpgPlayer) {
  // Trigger condition: After 3 god recalls completed
  // Count how many god-recall quests are completed
  const godRecallQuests = ['GQ-01', 'GQ-02', 'GQ-03', 'GQ-04'];
  const completedCount = godRecallQuests.filter((id) => isQuestComplete(player, id)).length;

  if (completedCount < 3) {
    return;
  }

  await player.showText(
    "You've recalled three of them now. The dormant gods. Unfinished things, completed by force.",
    { speaker: 'Grym' },
  );

  await player.showText(
    "Did you ask them if they wanted to wake? Did the Choir's prototype choose to become a storm? Did the Rootwalkers' seed choose to bloom?",
    { speaker: 'Grym' },
  );

  await player.showText(
    'You impose your vision on the world and call it growth. I preserve what already exists and you call it stagnation. We are not so different, Architect.',
    { speaker: 'Grym' },
  );
}
