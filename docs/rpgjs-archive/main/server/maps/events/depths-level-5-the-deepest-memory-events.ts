import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // EV-D5-001: Transition up to Depths L4 at (10,24)
  map.createDynamicEvent({
    x: 10,
    y: 0,
    name: 'EV-D5-001',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('depths-l4', { x: 10, y: 24 });
    },
  });

  // EV-D5-002: Transition down to Fortress F1 at (10,0), condition: GQ-03-F2
  map.createDynamicEvent({
    x: 19,
    y: 16,
    name: 'EV-D5-002',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const questDone = player.getVariable('GQ_03_F2_COMPLETED');
      if (questDone) {
        player.changeMap('fortress-f1', { x: 10, y: 0 });
      } else {
        player.showText(
          'A strange energy blocks this path. Perhaps a quest needs to be completed first.',
        );
      }
    },
  });

  // EV-D5-003: The Deepest Memory — final chamber lore
  map.createDynamicEvent({
    x: 10,
    y: 12,
    name: 'EV-D5-003',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('EV_D5_003_SEEN')) {
        player.showText(
          'You have reached the deepest layer of memory. The air is thick with forgotten emotions.',
        );
        player.showText(
          'Ancient whispers echo: "This is where all memories converge — the first and the last."',
        );
        player.setVariable('EV_D5_003_SEEN', true);
      } else {
        player.showText('The deepest chamber hums quietly with residual memory.');
      }
    },
  });

  // EV-D5-004: Memory lift back to surface
  map.createDynamicEvent({
    x: 5,
    y: 20,
    name: 'EV-D5-004',
    graphic: 'DUN-PA-06',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText('The Memory Lift hums. Return to the Everwick?');
    },
  });
}
