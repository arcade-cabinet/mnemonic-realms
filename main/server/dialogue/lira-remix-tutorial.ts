import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger conditions: After combat tutorial, player is in Hana's Workshop (8, 18)
  const hasCompletedCombatTutorial =
    player.getQuest('act1-scene4a-combat-tutorial')?.state === 'completed';
  const isInHanasWorkshop =
    player.map.id === 'village_hub' && player.position.x === 8 && player.position.y === 18;

  if (!hasCompletedCombatTutorial || !isInHanasWorkshop) {
    return;
  }

  player.setQuest('act1-scene4b-remix-broadcast', { state: 'started' });

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

  player.setQuest('act1-scene4b-remix-broadcast', { state: 'completed' });
}
