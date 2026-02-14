import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const map: RpgMap = player.map;

  // Trigger conditions:
  // Location: Heartfield — Stagnation Clearing (35, 30)
  // Quest: MQ-04 active
  if (
    map.id !== 'Heartfield' ||
    player.position.x !== 35 ||
    player.position.y !== 30 ||
    player.getQuest('MQ-04')?.state !== 'active'
  ) {
    return;
  }

  // Lira's graphic for dialogue portrait
  const liraGraphic = 'female_01'; // Assuming a default graphic for Lira

  await player.showText('Here we are. The Stagnation Clearing. Same as when we left it.', {
    speaker: { name: 'Lira', graphic: liraGraphic },
  });
  await player.showText(
    'Broadcasting a memory into that stone will overwhelm the stasis energy and shatter the crystal.',
    { speaker: { name: 'Lira', graphic: liraGraphic } },
  );

  // The actual "breaking" action would happen here, likely involving a choice or item use.
  // For this dialogue file, we assume the action has just occurred or is about to occur.
  // The prompt implies the dialogue happens *after* the player returns with the active quest,
  // and the lines are about the *process* and *aftermath* of breaking it.

  // Assuming the player has just performed the action to break the stagnation.
  // The next lines are Lira's reaction to the successful break.

  await player.showText("There. That's what it looks like when the world starts breathing again.", {
    speaker: { name: 'Lira', graphic: liraGraphic },
  });
  await player.showText(
    'We should head back to the village. Callum will want to hear about the Preservers.',
    { speaker: { name: 'Lira', graphic: liraGraphic } },
  );

  // Optional: Update quest state or set a flag after this dialogue
  // player.updateQuest('MQ-04', 'completed');
  // player.setVariable('stagnationClearingBroken', true);
}
