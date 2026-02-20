import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger conditions: Player approaches Stagnation Clearing (Scene 6)
  // Location: Heartfield — Stagnation Clearing (35, 30)
  const mapId = (player.map as { id?: string })?.id;
  const playerX = player.position.x;
  const playerY = player.position.y;

  if (
    mapId === 'act1-scene6-stagnation-clearing' &&
    playerX >= 30 &&
    playerX <= 40 &&
    playerY >= 25 &&
    playerY <= 35
  ) {
    if (player.getVariable('dlg-hana-stagnation-discovery-played')) {
      return;
    }

    player.setVariable('dlg-hana-stagnation-discovery-played', true);

    await player.showText('Wait. Do you feel that?', { speaker: 'Hana' });

    await player.showText(
      'This is a Stagnation Zone. Something — someone — froze this patch of the world. Time stopped here. Change stopped.',
      { speaker: 'Hana' },
    );

    await player.showText(
      "Look at the butterflies. Perfect. Every wing-scale, every spot of color. Beautiful, isn't it?",
      { speaker: 'Hana' },
    );

    await player.showText(
      "But they'll never land. They'll never fly anywhere new. They're just... frozen. Forever.",
      { speaker: 'Hana' },
    );

    await player.showText(
      'I\'ve seen these before, in the Frontier. The Preservers do this — people who think the world is too fragile to change. They freeze things to "protect" them.',
      { speaker: 'Hana' },
    );

    await player.showText(
      "This is small. Just a clearing. But they're getting bolder. I've heard reports of larger zones in the hills north of here.",
      { speaker: 'Hana' },
    );

    await player.showText(
      'We could break it. A single fragment broadcast into this stone would shatter the stasis. But...',
      { speaker: 'Hana' },
    );

    await player.showText(
      "Not yet. I want to show you more of the Settled Lands first. When we come back, you'll understand what you're doing — and why it matters.",
      { speaker: 'Hana' },
    );
  }
}
