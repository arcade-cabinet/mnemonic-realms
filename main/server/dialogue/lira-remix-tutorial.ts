import { RpgCommonMap, RpgCommonPlayer, RpgMap, type RpgPlayer, RpgScene } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const LIRA_NPC_ID = 'lira_npc'; // Assuming Lira's NPC ID
  const LIRA_PORTRAIT = 'lira_portrait'; // Assuming Lira's portrait asset name

  // Trigger conditions: After combat tutorial, player is in Lira's Workshop (8, 18)
  // Assuming a quest state or flag for "after combat tutorial"
  const hasCompletedCombatTutorial =
    player.getQuest('act1-scene4a-combat-tutorial')?.state === 'completed';
  const isInLirasWorkshop =
    player.map.id === 'village_hub' && player.position.x === 8 && player.position.y === 18; // Adjust map ID and coordinates as needed

  if (!hasCompletedCombatTutorial || !isInLirasWorkshop) {
    // Dialogue should not trigger if conditions are not met
    return;
  }

  // Mark the tutorial as started/completed to prevent re-triggering
  player.setQuest('act1-scene4b-remix-broadcast', { state: 'started' }); // Or 'completed' if it's a one-shot trigger

  await player.showText(
    'Now for the real work. Come back to the Workshop — I want to show you the Remix Table.',
    {
      speaker: LIRA_NPC_ID,
      portrait: LIRA_PORTRAIT,
    },
  );

  await player.showText(
    'Place two fragments on the table. Same emotion works best for your first try.',
    {
      speaker: LIRA_NPC_ID,
      portrait: LIRA_PORTRAIT,
    },
  );

  await player.showText('Beautiful. Feel the difference? That fragment has weight to it now.', {
    speaker: LIRA_NPC_ID,
    portrait: LIRA_PORTRAIT,
  });

  await player.showText('Broadcasting. This is how Architects change the world.', {
    speaker: LIRA_NPC_ID,
    portrait: LIRA_PORTRAIT,
  });

  await player.showText(
    "That's what we do. Collect. Remix. Broadcast. The world gets brighter. Ready to see what's beyond the village?",
    {
      speaker: LIRA_NPC_ID,
      portrait: LIRA_PORTRAIT,
    },
  );

  // Mark the tutorial as completed
  player.setQuest('act1-scene4b-remix-broadcast', { state: 'completed' });
}
