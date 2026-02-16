import type { RpgPlayer } from '@rpgjs/server';
import { isQuestActive } from '../systems/quests';

export default async function (player: RpgPlayer) {
  // Trigger conditions:
  // Location: Heartfield — Stagnation Clearing (35, 30)
  // Quest: MQ-04 active
  if (
    (player.map as { id?: string })?.id !== 'Heartfield' ||
    player.position.x !== 35 ||
    player.position.y !== 30 ||
    !isQuestActive(player, 'MQ-04')
  ) {
    return;
  }

  await player.showText('Here we are. The Stagnation Clearing. Same as when we left it.', {
    speaker: 'Hana',
  });
  await player.showText(
    'Broadcasting a memory into that stone will overwhelm the stasis energy and shatter the crystal.',
    { speaker: 'Hana' },
  );

  await player.showText("There. That's what it looks like when the world starts breathing again.", {
    speaker: 'Hana',
  });
  await player.showText(
    'We should head back to the village. Artun will want to hear about the Preservers.',
    { speaker: 'Hana' },
  );
}
