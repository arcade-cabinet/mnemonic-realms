import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // EV-HDF-001: Living Sketch broadcast solidification [MQ-08]
  // Appears if MQ-08 is started, not completed, and the forest hasn't been solidified yet.
  if (
    player.getVariable('MQ_08_STARTED') &&
    !player.getVariable('MQ_08_COMPLETED') &&
    !player.getVariable('HDF_SOLIDIFIED_SKETCH')
  ) {
    map.createDynamicEvent({
      x: 20,
      y: 25,
      name: 'EV-HDF-001',
      hitbox: { width: 16, height: 16 },
      onAction(player: RpgPlayer) {
        if (!player.getVariable('HDF_SOLIDIFIED_SKETCH')) {
          player.showText(
            'You stand before the Living Sketch. A faint hum emanates from the air, a broadcast signal waiting to be amplified. Activating it will solidify this section of the forest, locking its current form.',
          );
          // TODO: Implement choice dialog when showChoices is available
          // For now, solidify on action
          player.showText(
            'The air shimmers, lines deepen, and colors rush in! The Half-Drawn Forest solidifies around you.',
          );
          player.setVariable('HDF_SOLIDIFIED_SKETCH', true);
          // TODO: Track MQ-08 quest progress via variables when quest system is ready
        }
      },
    });
  }

  // EV-HDF-002: Archive of Intentions lore
  map.createDynamicEvent({
    x: 28,
    y: 9,
    name: 'EV-HDF-002',
    graphic: 'resonance_stone_sketch',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'You touch the Resonance Stone. A wave of dissolved memories washes over you... "We sought to capture the essence of creation, to hold the nascent thought before it fully formed. This forest was our canvas, a living testament to the power of intention. But the lines blurred, the colors ran, and the intent itself began to unravel..."',
      );
    },
  });

  // EV-HDF-003: Sketch Passage -> Depths L5 (conditional MQ_08_COMPLETED)
  if (player.getVariable('MQ_08_COMPLETED')) {
    map.createDynamicEvent({
      x: 13,
      y: 36,
      name: 'EV-HDF-003',
      hitbox: { width: 16, height: 16 },
      onAction(player: RpgPlayer) {
        player.showText('You found a hidden passage! It leads deeper into the Depths. Enter?');
        // TODO: Implement choice dialog when showChoices is available
        // For now, enter directly on action
        player.changeMap('depths-level-5', { x: 10, y: 0 });
      },
    });
  }

  // EV-HDF-004: West -> Flickerveil (conditional MQ_07_COMPLETED)
  if (player.getVariable('MQ_07_COMPLETED')) {
    map.createDynamicEvent({
      x: 0,
      y: 20,
      name: 'EV-HDF-004',
      hitbox: { width: 16, height: 16 },
      onAction(player: RpgPlayer) {
        player.changeMap('flickerveil', { x: 48, y: 25 });
      },
    });
  }

  // EV-HDF-005: NW -> Undrawn Peaks (conditional MQ_08_COMPLETED)
  if (player.getVariable('MQ_08_COMPLETED')) {
    map.createDynamicEvent({
      x: 0,
      y: 10,
      name: 'EV-HDF-005',
      hitbox: { width: 16, height: 16 },
      onAction(player: RpgPlayer) {
        player.changeMap('undrawn-peaks', { x: 39, y: 25 });
      },
    });
  }

  // EV-HDF-006: South -> Luminous Wastes (conditional MQ_08_COMPLETED)
  if (player.getVariable('MQ_08_COMPLETED')) {
    map.createDynamicEvent({
      x: 20,
      y: 39,
      name: 'EV-HDF-006',
      hitbox: { width: 16, height: 16 },
      onAction(player: RpgPlayer) {
        player.changeMap('luminous-wastes', { x: 20, y: 0 });
      },
    });
  }

  // --- Enemy Zones ---
  // TODO: Implement encounter zones when battle system is ready
  //
  // Forest Paths: bounds=(5,5) to (35,35)
  //   Common: 2 Sketch Wolves
  //   Standard: 1 Sketch Wolf + 1 Unfinished Treant
  //   Rare: 1 Unfinished Treant + 2 Memory Echoes
  //
  // Archive Approach: bounds=(25,5) to (35,15)
  //   Standard: 2 Memory Echoes
}
