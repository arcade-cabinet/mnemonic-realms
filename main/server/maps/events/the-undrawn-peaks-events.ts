import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- NPCs ---

  // Preserver Captain A
  map.createDynamicEvent({
    x: 17,
    y: 34,
    name: 'preserver-captain-up-a',
    graphic: 'npc_preserver_captain',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_08_STARTED')) {
        player.showText(
          'Captain A: The gate remains sealed until the broadcast is complete. We cannot risk the integrity of the Sketch.',
        );
      } else {
        player.showText(
          'Captain A: Greetings, traveler. This area is restricted. Please keep your distance from the Fortress Gate.',
        );
      }
    },
  });

  // Preserver Captain B
  map.createDynamicEvent({
    x: 22,
    y: 34,
    name: 'preserver-captain-up-b',
    graphic: 'npc_preserver_captain',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_08_STARTED')) {
        player.showText(
          "Captain B: The integrity of the Sketch is paramount. Do not interfere with the gate's stabilization process.",
        );
      } else {
        player.showText(
          'Captain B: Move along, citizen. The Preserver Fortress is not open to the public.',
        );
      }
    },
  });

  // --- Action Events ---

  // EV-UP-001: Apex
  map.createDynamicEvent({
    x: 19,
    y: 4,
    name: 'EV-UP-001',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('GQ_03_J1_STARTED')) {
        player.showText(
          'You stand at the Apex. A powerful resonance point. Perhaps broadcasting a "joy" fragment here could create a sunrise beacon for Solara.',
        );
        // TODO: Implement broadcast logic (joy, sunrise-beacon)
      } else {
        player.showText(
          'The air here is thin, yet vibrant. You feel a strong resonance with the sky.',
        );
      }
    },
  });

  // EV-UP-002: Sketch Bridge
  map.createDynamicEvent({
    x: 20,
    y: 20,
    name: 'EV-UP-002',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_08_STARTED')) {
        player.showText(
          'This Sketch Bridge is incomplete. A powerful broadcast might solidify its form, allowing passage.',
        );
        // TODO: Implement broadcast logic (solidify, sketch-bridge)
      } else {
        player.showText(
          'A precarious outline of a bridge spans the chasm. It seems impassable in its current state.',
        );
      }
    },
  });

  // EV-UP-003: Fortress Gate
  map.createDynamicEvent({
    x: 19,
    y: 34,
    name: 'EV-UP-003',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_08_STARTED')) {
        player.showText(
          'The Fortress Gate pulses with raw Sketch energy. A broadcast of potency 3 or higher is required to stabilize and open it.',
        );
        // TODO: Implement broadcast logic (stabilize, fortress-gate, potency 3)
      } else {
        player.showText(
          'The Crystalline Fortress Gate stands before you, an imposing barrier of unfinished lines.',
        );
      }
    },
  });

  // --- Transitions ---

  // EV-UP-004: South -> Fortress F1 (conditional MQ_08_COMPLETED)
  map.createDynamicEvent({
    x: 19,
    y: 35,
    name: 'EV-UP-004',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_08_COMPLETED')) {
        player.changeMap('preserver-fortress-f1', { x: 10, y: 0 });
      } else {
        player.showText('The Fortress Gate is sealed. You need to find a way to open it.');
      }
    },
  });

  // EV-UP-005: South -> Hollow Ridge (conditional MQ_07_COMPLETED)
  map.createDynamicEvent({
    x: 20,
    y: 39,
    name: 'EV-UP-005',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_07_COMPLETED')) {
        player.changeMap('hollow-ridge', { x: 25, y: 0 });
      } else {
        player.showText(
          'The path south is blocked by unstable Sketch energy. You cannot proceed yet.',
        );
      }
    },
  });

  // EV-UP-006: East -> Half-Drawn Forest (conditional MQ_08_COMPLETED)
  map.createDynamicEvent({
    x: 39,
    y: 25,
    name: 'EV-UP-006',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_08_COMPLETED')) {
        player.changeMap('half-drawn-forest', { x: 0, y: 10 });
      } else {
        player.showText('The eastern path is too dangerous to traverse. It seems unfinished.');
      }
    },
  });

  // --- Enemy Zones ---
  // TODO: Implement encounter zones when battle system is ready
  //
  // Mountain Paths: bounds=(5,5) to (35,30)
  //   enemies: [Wireframe Drake, Sketch Phantom], levels: 22-26, rate: 5%
  //
  // Fortress Approach: bounds=(12,28) to (28,38)
  //   enemies: [Apex Guardian, Apex Guardian], levels: 25-28, rate: 7%
}
