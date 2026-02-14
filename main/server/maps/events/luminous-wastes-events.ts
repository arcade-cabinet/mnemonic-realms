import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- NPCs ---
  map.createDynamicEvent({
    x: 34,
    y: 9,
    name: 'preserver-archivist-lw',
    graphic: 'npc_preserver_elite',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'The Archivist stands guard, observing the shifting landscape. "The Wastes are... unstable. Be wary."',
      );
    },
  });

  // --- Action Events ---
  // EV-LW-001: Half-Built Village broadcast solidification [MQ-08]
  map.createDynamicEvent({
    x: 20,
    y: 20,
    name: 'EV-LW-001',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const mq08Done = player.getVariable('MQ_08_COMPLETED');
      if (!mq08Done) {
        player.showText(
          'Sketch outlines of a village. It feels unfinished, waiting for something.',
        );
      } else {
        player.showText(
          'You stand in the center of the Half-Built Village. A faint hum suggests it awaits further solidification.',
        );
      }
    },
  });

  // EV-LW-002: The Edge narrative beat
  map.createDynamicEvent({
    x: 4,
    y: 18,
    name: 'EV-LW-002',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'You stand at the absolute western boundary of the world. Beyond, a pure, luminous void stretches into infinity. The world is still growing.',
      );
    },
  });

  // --- Transition Events ---
  // EV-LW-003: North -> Shimmer Marsh
  map.createDynamicEvent({
    x: 25,
    y: 0,
    name: 'EV-LW-003',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const mq07Done = player.getVariable('MQ_07_COMPLETED');
      if (mq07Done) {
        player.changeMap('shimmer-marsh', { x: 25, y: 49 });
      } else {
        player.showText(
          "The path north is blocked by an unseen barrier. Perhaps it will open once you've progressed further.",
        );
      }
    },
  });

  // EV-LW-004: East -> Resonance Fields
  map.createDynamicEvent({
    x: 39,
    y: 20,
    name: 'EV-LW-004',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const mq07Done = player.getVariable('MQ_07_COMPLETED');
      if (mq07Done) {
        player.changeMap('resonance-fields', { x: 0, y: 25 });
      } else {
        player.showText('A shimmering wall prevents passage to the east.');
      }
    },
  });

  // EV-LW-005: NE -> Half-Drawn Forest
  map.createDynamicEvent({
    x: 20,
    y: 0,
    name: 'EV-LW-005',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const mq08Done = player.getVariable('MQ_08_COMPLETED');
      if (mq08Done) {
        player.changeMap('half-drawn-forest', { x: 20, y: 39 });
      } else {
        player.showText(
          'The northern path to the forest is incomplete. It will solidify once the nearby village is fully drawn.',
        );
      }
    },
  });

  // --- Enemy Zones ---
  // TODO: Implement encounter zones when battle system is ready
  // Open Wastes: bounds=5,5 -> 35,35, enemies=[Sketch Phantom, Void Wisp], levels=21-24
  // Watchtower Zone: bounds=30,5 -> 38,14, enemies=[Preserver Archivist (elite)], levels=23-25
}
