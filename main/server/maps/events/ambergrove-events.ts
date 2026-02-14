import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- NPCs ---

  // Lead Woodcutter (lead-woodcutter)
  map.createDynamicEvent({
    x: 9,
    y: 29,
    name: 'lead-woodcutter',
    graphic: 'npc_woodcutter_m1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('SQ_03_COMPLETED')) {
        player.showText(
          'Lead Woodcutter: "Thanks to you, the forest is returning to normal. We\'re all grateful."',
        );
      } else if (player.getVariable('SQ_03_STARTED')) {
        player.showText(
          'Lead Woodcutter: "Any luck finding the source of this rapid growth? It\'s getting worse."',
        );
      } else if (player.getVariable('MQ_03_STARTED')) {
        player.showText(
          'Lead Woodcutter: "Ah, traveler! You look capable. We\'ve got a problem. The forest is growing... too fast. It\'s choking out the old trees. Can you investigate these rapid growth sites?"',
        );
        player.setVariable('SQ_03_STARTED', true);
        player.showText('Quest "Rapid Growth" started!');
      } else {
        player.showText(
          'The Lead Woodcutter is busy, muttering about strange plant growth. "Not now, traveler. This rapid growth... it\'s unnatural."',
        );
      }
    },
  });

  // Woodcutter B (woodcutter-b)
  map.createDynamicEvent({
    x: 10,
    y: 31,
    name: 'woodcutter-b',
    graphic: 'npc_woodcutter_m2',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Woodcutter B: "Hard work, but someone\'s gotta keep the village warm."',
      );
    },
  });

  // Woodcutter C (woodcutter-c)
  map.createDynamicEvent({
    x: 11,
    y: 30,
    name: 'woodcutter-c',
    graphic: 'npc_woodcutter_f1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Woodcutter C: "The forest provides, but it demands respect."',
      );
    },
  });

  // --- Action Events ---

  // EV-AG-002: Hearthstone Circle center
  map.createDynamicEvent({
    x: 20,
    y: 10,
    name: 'EV-AG-002',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'You stand at the center of the Hearthstone Circle. The air here hums with latent energy. Perhaps interacting with the standing stones could yield something valuable.',
      );
    },
  });

  // EV-AG-003: Amber Lake submerged stone (Act II)
  map.createDynamicEvent({
    x: 30,
    y: 27,
    name: 'EV-AG-003',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('MQ_05_STARTED') ||
        player.getVariable('MQ_05_COMPLETED')
      ) {
        player.showText(
          "The submerged Resonance Stone pulses with a soft amber light. You feel a connection to the water's memory.",
        );
        // TODO: Logic to collect fragment or activate stone
      } else {
        player.showText(
          'A large, smooth stone lies submerged in the Amber Lake. It seems dormant for now.',
        );
      }
    },
  });

  // --- Transition Events ---

  // EV-AG-004: West -> Village Hub
  map.createDynamicEvent({
    x: 0,
    y: 20,
    name: 'EV-AG-004',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('village-hub', { x: 29, y: 14 });
    },
  });

  // EV-AG-006: East -> Flickerveil [MQ-04]
  map.createDynamicEvent({
    x: 38,
    y: 20,
    name: 'EV-AG-006',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('MQ_04_STARTED') ||
        player.getVariable('MQ_04_COMPLETED')
      ) {
        player.changeMap('flickerveil', { x: 0, y: 30 });
      } else {
        player.showText(
          'The Canopy Path to the east is unstable and blocked by dense, shimmering mist. It seems impassable for now.',
        );
      }
    },
  });

  // EV-AG-007: South -> Heartfield
  map.createDynamicEvent({
    x: 10,
    y: 39,
    name: 'EV-AG-007',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('heartfield', { x: 39, y: 20 });
    },
  });

  // --- Enemy Zones ---
  // Encounter zones defined in systems/encounters.ts (AMBERGROVE_ZONES).
  // Random encounters triggered via player.ts onInput hook -> checkEncounter().
  //
  // Dense Forest: bounds=(5,2) to (35,15), rate=8%
  // Lake Shore: bounds=(24,20) to (35,30), rate=3%
  // Canopy Path: bounds=(36,15) to (39,28), rate=6%
}
