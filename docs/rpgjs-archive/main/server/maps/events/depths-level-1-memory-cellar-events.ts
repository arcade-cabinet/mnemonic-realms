import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- EV-D1-001: Entry from Everwick ---
  map.createDynamicEvent({
    x: 10,
    y: 0,
    name: 'EV-D1-001',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('everwick', { x: 8, y: 17 });
    },
  });

  // --- EV-D1-002: Wall inscription lore [SQ-10] ---
  map.createDynamicEvent({
    x: 3,
    y: 2,
    name: 'EV-D1-002',
    graphic: 'DUN-DE-10',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('SQ_10_STARTED')) {
        player.showText(
          'An ancient inscription reads: "The Memorial Garden was built atop our resting place. We chose this." Artun nods thoughtfully. "More pieces of the puzzle..."',
        );
      } else {
        player.showText(
          'An ancient inscription is carved into the wall, but the words are faded and hard to decipher.',
        );
      }
    },
  });

  // --- EV-D1-003: Cracked RS: calm/earth/1 ---
  map.createDynamicEvent({
    x: 17,
    y: 4,
    name: 'EV-D1-003',
    graphic: 'DUN-DE-06',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('EV_D1_003_COLLECTED')) {
        player.showText(
          'You touch the cracked Resonance Stone. A faint, calming energy flows into you, leaving behind a small fragment.',
        );
        // TODO: Implement fragment grant (Calm/Earth potency 1) when inventory API is verified
        player.showText('Gained 1 Calm/Earth fragment (Potency 1).');
        player.setVariable('EV_D1_003_COLLECTED', true);
      } else {
        player.showText('The cracked Resonance Stone is inert, its energy already harvested.');
      }
    },
  });

  // --- EV-D1-006: Forced encounter: 2+1 Shades [SQ-10] ---
  map.createDynamicEvent({
    x: 14,
    y: 9,
    name: 'EV-D1-006',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('SQ_10_STARTED') && !player.getVariable('SQ_10_OBJ_4_COMPLETE')) {
        player.showText(
          'As you step onto the platform, the air shimmers. Two Memory Shades materialize, and a larger, more menacing one looms behind them!',
        );
        // TODO: Implement battle with 2x Memory Shade (lv5) + 1x scaled Memory Shade (lv6) when RPG-JS battle API is available
        // On victory:
        player.showText('The shades dissipate, leaving behind a lingering sense of calm.');
        player.setVariable('SQ_10_OBJ_4_COMPLETE', true);
      } else if (player.getVariable('SQ_10_OBJ_4_COMPLETE')) {
        player.showText('The platform is quiet now, the memory shades long gone.');
      } else {
        player.showText('The stone platform feels cold and empty.');
      }
    },
  });

  // --- EV-D1-007: Dissolved fragment (appears after EV-D1-006 victory) ---
  if (player.getVariable('SQ_10_OBJ_4_COMPLETE') && !player.getVariable('EV_D1_007_COLLECTED')) {
    map.createDynamicEvent({
      x: 14,
      y: 9,
      name: 'EV-D1-007',
      graphic: 'DUN-DE-06',
      hitbox: { width: 16, height: 16 },
      onAction(player: RpgPlayer) {
        if (!player.getVariable('EV_D1_007_COLLECTED')) {
          player.showText(
            'A shimmering fragment coalesces from the dissipating memory fog. You collect it.',
          );
          // TODO: Implement fragment grant (Calm/Earth potency 2) when inventory API is verified
          player.showText('Gained 1 Calm/Earth fragment (Potency 2).');
          player.setVariable('EV_D1_007_COLLECTED', true);
        }
      },
    });
  }

  // --- EV-D1-008: RS: joy/neutral/2 ---
  map.createDynamicEvent({
    x: 15,
    y: 14,
    name: 'EV-D1-008',
    graphic: 'DUN-DE-06',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('EV_D1_008_COLLECTED')) {
        player.showText(
          'You touch the Resonance Stone. A wave of gentle joy washes over you, leaving behind a fragment.',
        );
        // TODO: Implement fragment grant (Joy/Neutral potency 2) when inventory API is verified
        player.showText('Gained 1 Joy/Neutral fragment (Potency 2).');
        player.setVariable('EV_D1_008_COLLECTED', true);
      } else {
        player.showText('The Resonance Stone is quiet, its joyful energy already shared.');
      }
    },
  });

  // --- EV-D1-010: Memory fog vision ---
  map.createDynamicEvent({
    x: 15,
    y: 15,
    name: 'EV-D1-010',
    graphic: 'DUN-GR-04',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('EV_D1_010_SEEN')) {
        player.showText(
          'As you step into the luminous fog, fragmented visions flash before your eyes: children laughing, a bustling market, a haunting melody...',
        );
        player.showText('The visions fade, leaving a new entry in your lore journal.');
        player.setVariable('EV_D1_010_SEEN', true);
      } else {
        player.showText('The luminous fog swirls gently. The visions have already been shared.');
      }
    },
  });

  // --- EV-D1-011: Memory lift -> Everwick ---
  map.createDynamicEvent({
    x: 12,
    y: 20,
    name: 'EV-D1-011',
    graphic: 'DUN-PA-06',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('SQ_10_OBJ_4_COMPLETE')) {
        player.showText('The Memory Lift hums to life. Returning to the Everwick.');
        player.changeMap('everwick', { x: 8, y: 17 });
      } else {
        player.showText(
          'The Memory Lift is inert. Perhaps it requires a surge of energy, or a specific condition to be met.',
        );
      }
    },
  });

  // --- EV-D1-012: Stairway -> Depths L2 ---
  map.createDynamicEvent({
    x: 15,
    y: 22,
    name: 'EV-D1-012',
    graphic: 'DUN-PA-04',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText('The stairway descends into deeper darkness. Proceeding to Depths Level 2.');
      player.changeMap('depths-l2', { x: 10, y: 0 });
    },
  });

  // --- Enemy Zones ---

  // TODO: Alcove patrol zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (3,7) to (7,10), enemies: [E-DP-01 Memory Shade], levels 4-5, 5% rate

  // TODO: Guardian Chamber zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (10,7) to (20,11), enemies: [E-DP-01 Memory Shade x2-3], levels 4-6, 7% rate

  // TODO: Stairway guard zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (11,18) to (19,23), enemies: [E-DP-01 Memory Shade x1-2], levels 4-6, 6% rate
}
