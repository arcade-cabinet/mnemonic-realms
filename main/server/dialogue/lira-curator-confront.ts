import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const map: RpgMap = player.map;

  // Trigger conditions: Curator confrontation (Scene 8)
  // Location: Preserver Fortress Floor 3 — First Memory Chamber
  // Quest: MQ-09
  if (
    map.id !== 'act3-scene8-first-memory-chamber' ||
    player.getVariable('quest:MQ-09:state') !== 'active'
  ) {
    return;
  }

  await player.showText(
    "I was frozen. I was inside the crystal, in the silence you're describing. It wasn't terrible. But it wasn't alive, either.",
    {
      speaker: 'Hana',
    },
  );

  await player.showText("I couldn't choose.", {
    speaker: 'Hana',
  });
}
