import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const map: RpgMap = player.map;
  const mapId = map.id;
  const playerX = player.position.x;
  const playerY = player.position.y;

  // Trigger conditions: Player approaches Stagnation Clearing (Scene 6)
  // Location: Heartfield — Stagnation Clearing (35, 30)
  // Quest: MQ-04 (Main Quest 4) - Assuming this quest is active or not yet completed
  if (
    mapId === 'act1-scene6-stagnation-clearing' &&
    playerX >= 30 &&
    playerX <= 40 &&
    playerY >= 25 &&
    playerY <= 35
  ) {
    // Check if this dialogue has already been played or if MQ-04 is not yet started/completed
    // For simplicity, let's assume a flag 'dlg-lira-stagnation-discovery-played'
    if (player.getVariable('dlg-lira-stagnation-discovery-played')) {
      return; // Dialogue already played
    }

    // Set the flag to prevent re-triggering
    player.setVariable('dlg-lira-stagnation-discovery-played', true);

    // Lira: "Wait. Do you feel that?"
    await player.showText('Wait. Do you feel that?', {
      speaker: {
        name: 'Lira',
        graphic: 'lira_portrait', // Assuming 'lira_portrait' is the graphic ID for Lira
      },
    });

    // Lira: "This is a Stagnation Zone. Something — someone — froze this patch of the world."
    await player.showText(
      'This is a Stagnation Zone. Something — someone — froze this patch of the world. Time stopped here. Change stopped.',
      {
        speaker: {
          name: 'Lira',
          graphic: 'lira_portrait',
        },
      },
    );

    // Lira: "Look at the butterflies. Perfect. Every wing-scale, every spot of color. Beautiful, isn't it?"
    await player.showText(
      "Look at the butterflies. Perfect. Every wing-scale, every spot of color. Beautiful, isn't it?",
      {
        speaker: {
          name: 'Lira',
          graphic: 'lira_portrait',
        },
      },
    );

    // Lira: "But they'll never land. They'll never fly anywhere new. They're just... frozen. Forever."
    await player.showText(
      "But they'll never land. They'll never fly anywhere new. They're just... frozen. Forever.",
      {
        speaker: {
          name: 'Lira',
          graphic: 'lira_portrait',
        },
      },
    );

    // Lira: "I've seen these before, in the Frontier. The Preservers do this — people who think the world is too fragile to change. They freeze things to "protect" them."
    await player.showText(
      'I\'ve seen these before, in the Frontier. The Preservers do this — people who think the world is too fragile to change. They freeze things to "protect" them.',
      {
        speaker: {
          name: 'Lira',
          graphic: 'lira_portrait',
        },
      },
    );

    // Lira: "This is small. Just a clearing. But they're getting bolder. I've heard reports of larger zones in the hills north of here."
    await player.showText(
      "This is small. Just a clearing. But they're getting bolder. I've heard reports of larger zones in the hills north of here.",
      {
        speaker: {
          name: 'Lira',
          graphic: 'lira_portrait',
        },
      },
    );

    // Lira: "We could break it. A single fragment broadcast into this stone would shatter the stasis. But..."
    await player.showText(
      'We could break it. A single fragment broadcast into this stone would shatter the stasis. But...',
      {
        speaker: {
          name: 'Lira',
          graphic: 'lira_portrait',
        },
      },
    );

    // Lira: "Not yet. I want to show you more of the Settled Lands first. When we come back, you'll understand what you're doing — and why it matters."
    await player.showText(
      "Not yet. I want to show you more of the Settled Lands first. When we come back, you'll understand what you're doing — and why it matters.",
      {
        speaker: {
          name: 'Lira',
          graphic: 'lira_portrait',
        },
      },
    );

    // Optionally, update quest state or set a flag for MQ-04 progression
    // player.setQuest('MQ-04', 'stagnation_discovered');
  }
}
