import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- NPC Events ---

  // Fisher Tam (fisher-tam): pos=29,29, graphic=npc_fisher_m1, quests=[SQ-04]
  map.createDynamicEvent({
    x: 29,
    y: 29,
    name: 'fisher-tam',
    graphic: 'npc_fisher_m1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_03_STARTED')) {
        player.showText(
          'Fisher Tam: "The river has been acting strange lately. Seen some odd lights near the falls... almost like a shimmer."',
        );
        if (!player.getVariable('SQ_04_STARTED')) {
          player.setVariable('SQ_04_STARTED', true);
          player.showText(
            'Quest Updated: Strange Lights at the Falls (SQ-04) added to your log.',
          );
        }
      } else {
        player.showText(
          'Fisher Tam: "Just enjoying the quiet. The fish are biting well today."',
        );
      }
    },
  });

  // Specialty Shopkeeper (specialty-shop): pos=15,15, graphic=npc_shopkeep_f1
  map.createDynamicEvent({
    x: 15,
    y: 15,
    name: 'specialty-shop',
    graphic: 'npc_shopkeep_f1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Shopkeeper: "Welcome to the Brightwater Emporium! We specialize in unique riverside wares."',
      );
      // TODO: Implement shop interface when openShop is available
      // Would offer Brightwater Saber, Riverside Crosier, etc.
      player.showText(
        'Shop interface would open here, offering Brightwater Saber, Riverside Crosier, etc.',
      );
    },
  });

  // Millbrook Elder (millbrook-elder): pos=16,13, graphic=npc_elder_m1
  map.createDynamicEvent({
    x: 16,
    y: 13,
    name: 'millbrook-elder',
    graphic: 'npc_elder_m1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Millbrook Elder: "The river is the lifeblood of our town. We must respect its power."',
      );
    },
  });

  // Bridge Guard (bridge-guard): pos=20,19, graphic=npc_guard_m1
  map.createDynamicEvent({
    x: 20,
    y: 19,
    name: 'bridge-guard',
    graphic: 'npc_guard_m1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Bridge Guard: "Greetings, traveler. The Brightwater Bridge is safe, thanks to the Resonance Stone."',
      );
    },
  });

  // Townsfolk A (townsfolk-a): pos=14,17, graphic=npc_villager_f2
  map.createDynamicEvent({
    x: 14,
    y: 17,
    name: 'townsfolk-a',
    graphic: 'npc_villager_f2',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Townsfolk A: "It\'s a peaceful life here by the river."',
      );
    },
  });

  // Townsfolk B (townsfolk-b): pos=22,14, graphic=npc_villager_m3
  map.createDynamicEvent({
    x: 22,
    y: 14,
    name: 'townsfolk-b',
    graphic: 'npc_villager_m3',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Townsfolk B: "Heard the fishing\'s good down by Fisher\'s Rest."',
      );
    },
  });

  // --- Action/Touch Events ---

  // ev-mb-002: Hidden cave behind waterfall [SQ-04]
  map.createDynamicEvent({
    x: 6,
    y: 4,
    name: 'ev-mb-002',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('SQ_04_STARTED')) {
        player.showText('You found a hidden passage behind the waterfall!');
        player.changeMap('millbrook_falls_cave', { x: 5, y: 5 });
      } else {
        player.showText(
          "The waterfall's spray is refreshing, but there's nothing else here.",
        );
      }
    },
  });

  // ev-mb-004: East -> Village Hub
  map.createDynamicEvent({
    x: 39,
    y: 20,
    name: 'ev-mb-004',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('village_hub', { x: 0, y: 14 });
    },
  });

  // ev-mb-005: South -> Heartfield
  map.createDynamicEvent({
    x: 20,
    y: 39,
    name: 'ev-mb-005',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('heartfield', { x: 5, y: 20 });
    },
  });

  // ev-mb-006: West -> Hollow Ridge [MQ-04]
  map.createDynamicEvent({
    x: 0,
    y: 20,
    name: 'ev-mb-006',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_04_STARTED') || player.getVariable('MQ_04_COMPLETED')) {
        player.changeMap('hollow_ridge', { x: 49, y: 35 });
      } else {
        player.showText(
          'A sturdy gate blocks the path west. It seems impassable for now.',
        );
      }
    },
  });

  // ev-mb-007: Bridge Resonance Stone + rainbow
  map.createDynamicEvent({
    x: 21,
    y: 19,
    name: 'ev-mb-007',
    graphic: 'resonance_stone_bridge',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'You touch the Resonance Stone embedded in the bridge keystone. It hums with a gentle energy.',
      );
      // TODO: Logic for collecting fragments, checking vibrancy
      // TODO: Client-side rainbow animation based on vibrancy
      player.showText(
        'The stone pulses softly. It seems to be in harmony with the river.',
      );
    },
  });

  // --- Enemy Zones ---
  // TODO: Implement encounter zones when battle system is ready
  // West Riverbank: bounds=2,10 -> 16,30, enemies=[E-SL-05,E-SL-06], levels=4-5, rate=20%
  // East Riverbank: bounds=22,8 -> 38,30, enemies=[E-SL-06], levels=4-5, rate=20%
  // Falls Approach: bounds=2,2 -> 12,8, enemies=[E-SL-05], levels=4, rate=10%
}
