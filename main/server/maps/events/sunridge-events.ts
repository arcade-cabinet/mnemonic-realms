import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- NPCs ---

  // Waystation Keeper
  map.createDynamicEvent({
    x: 19,
    y: 19,
    name: 'waystation-keeper',
    graphic: 'npc_keeper_f1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText('Welcome to the Ridgetop Waystation, traveler. Rest your weary bones.');
    },
  });

  // Traveling Merchant
  map.createDynamicEvent({
    x: 20,
    y: 20,
    name: 'traveling-merchant',
    graphic: 'npc_merchant_m1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText('Greetings! Looking for rare wares or a good bargain?');
      // TODO: Implement shop system when RPG-JS shop API is available
    },
  });

  // Waystation Guard
  map.createDynamicEvent({
    x: 17,
    y: 18,
    name: 'waystation-guard',
    graphic: 'npc_guard_m2',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Keep an eye out for anything unusual. The highlands can be unpredictable.',
      );
    },
  });

  // Aric (conditional spawn based on MQ_04 completion)
  if (player.getVariable('MQ_04_COMPLETED')) {
    map.createDynamicEvent({
      x: 31,
      y: 14,
      name: 'aric',
      graphic: 'npc_aric',
      hitbox: { width: 16, height: 16 },
      onAction(player: RpgPlayer) {
        if (!player.getVariable('SQ_05_STARTED')) {
          player.showText(
            '...The Preservers. They claim to protect us, but their methods... I have my doubts.',
          );
          player.showText(
            "Perhaps you could help me investigate? It's about a missing artifact.",
          );
          player.setVariable('SQ_05_STARTED', true);
        } else if (
          player.getVariable('SQ_05_STARTED') &&
          !player.getVariable('SQ_05_COMPLETED')
        ) {
          player.showText(
            "Have you found anything about the artifact yet? I'm growing more concerned.",
          );
        } else {
          player.showText(
            'Thank you again for your help with the artifact. The truth about the Preservers is slowly coming to light.',
          );
        }
      },
    });
  }

  // --- Action Events ---

  // EV-SR-002: Wind Shrine vibrating stone (RS-SR-01)
  map.createDynamicEvent({
    x: 9,
    y: 7,
    name: 'EV-SR-002',
    graphic: 'resonance_stone_wind',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'The ancient stone vibrates intensely, humming with a strange energy. You feel a faint breeze, even indoors.',
      );
      player.showText(
        'It seems to resonate with the element of Wind, but you cannot activate it yet. (Requires Act II progression)',
      );
    },
  });

  // EV-SR-003: Waystation rest point
  map.createDynamicEvent({
    x: 19,
    y: 19,
    name: 'EV-SR-003',
    graphic: 'event_rest_point',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText('You find a comfortable spot to rest at the waystation.');
      player.showText('Resting...');
      // TODO: Implement HP/SP restoration when RPG-JS stat API is verified
      player.showText('You feel refreshed!');
    },
  });

  // --- Transition Events ---

  // EV-SR-004: South -> Village Hub
  map.createDynamicEvent({
    x: 20,
    y: 39,
    name: 'EV-SR-004',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('village_hub', { x: 15, y: 0 });
    },
  });

  // EV-SR-005: North -> Hollow Ridge (conditional based on MQ_04 completion)
  if (player.getVariable('MQ_04_COMPLETED')) {
    map.createDynamicEvent({
      x: 18,
      y: 0,
      name: 'EV-SR-005',
      hitbox: { width: 16, height: 16 },
      onAction(player: RpgPlayer) {
        player.changeMap('hollow_ridge', { x: 25, y: 49 });
      },
    });
  }

  // EV-SR-006: East -> Ambergrove
  map.createDynamicEvent({
    x: 39,
    y: 20,
    name: 'EV-SR-006',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('ambergrove', { x: 5, y: 0 });
    },
  });

  // --- Enemy Zones ---
  // Encounter zones defined in systems/encounters.ts (SUNRIDGE_ZONES).
  // Random encounters triggered via player.ts onInput hook -> checkEncounter().
  //
  // Highland Grass: bounds=(5,10) to (25,35), rate=5%
  // Rocky Outcrops: bounds=(25,5) to (38,25), rate=6%
}
