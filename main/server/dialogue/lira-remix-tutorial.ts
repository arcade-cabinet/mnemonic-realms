import type { RpgPlayer } from '@rpgjs/server';
import { isQuestComplete, startQuest, completeQuest } from '../systems/quests';

export default async function (player: RpgPlayer) {
  // Trigger conditions: After combat tutorial, player is in Hana's Workshop (8, 18)
  const hasCompletedCombatTutorial = isQuestComplete(player, 'act1-scene4a-combat-tutorial');
  const isInHanasWorkshop =
    (player.map as { id?: string })?.id === 'village_hub' && player.position.x === 8 && player.position.y === 18;

  if (!hasCompletedCombatTutorial || !isInHanasWorkshop) {
    return;
  }

  startQuest(player, 'act1-scene4b-remix-broadcast');

  await player.showText(
    'Now for the real work. Come back to the Workshop — I want to show you the Remix Table.',
    { speaker: 'Hana' },
  );

  await player.showText(
    'Place two fragments on the table. Same emotion works best for your first try.',
    { speaker: 'Hana' },
  );

  await player.showText('Beautiful. Feel the difference? That fragment has weight to it now.', {
    speaker: 'Hana',
  });

  await player.showText('Broadcasting. This is how Architects change the world.', {
    speaker: 'Hana',
  });

  await player.showText(
    "That's what we do. Collect. Remix. Broadcast. The world gets brighter. Ready to see what's beyond the village?",
    { speaker: 'Hana' },
  );

  completeQuest(player, 'act1-scene4b-remix-broadcast');
}
