import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- NPCs ---

  // Nel
  map.createDynamicEvent({
    x: 14,
    y: 24,
    name: 'nel',
    graphic: 'npc_nel',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('MQ_05_STARTED') &&
        !player.getVariable('GQ_04_STARTED')
      ) {
        player.showText(
          'Nel: "Welcome, traveler. The air here hums with ancient power, a dormant god stirs..."',
        );
        player.setVariable('GQ_04_STARTED', true);
      } else if (
        player.getVariable('SQ_07_STARTED') &&
        !player.getVariable('SQ_07_COMPLETED')
      ) {
        player.showText(
          'Nel: "Are you ready to escort me? The path ahead is treacherous."',
        );
        // TODO: Implement escort quest mechanic
      } else {
        player.showText(
          'Nel: "The mountains hold many secrets. Be wary, and be strong."',
        );
      }
    },
  });

  // Ridgewalker Scout
  map.createDynamicEvent({
    x: 16,
    y: 25,
    name: 'ridgewalker-scout',
    graphic: 'npc_ridgewalker_m1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Scout: "Keep your eyes peeled. The mountains are restless."',
      );
    },
  });

  // Ridgewalker Merchant
  map.createDynamicEvent({
    x: 15,
    y: 26,
    name: 'ridgewalker-merchant',
    graphic: 'npc_merchant_m2',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Merchant: "Looking for supplies, traveler? I have the finest wares this side of the ridge."',
      );
      // TODO: Implement shop interface when openShop is available
    },
  });

  // Ridgewalker Elder
  map.createDynamicEvent({
    x: 12,
    y: 22,
    name: 'ridgewalker-elder',
    graphic: 'npc_elder_m2',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Elder: "The spirits of the mountain watch over us. Listen to their whispers."',
      );
    },
  });

  // Ridgewalker Guard A
  map.createDynamicEvent({
    x: 18,
    y: 28,
    name: 'ridgewalker-guard-a',
    graphic: 'npc_ridgewalker_m2',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Guard: "Stay vigilant. The wilds are unforgiving."',
      );
    },
  });

  // Ridgewalker Guard B
  map.createDynamicEvent({
    x: 10,
    y: 22,
    name: 'ridgewalker-guard-b',
    graphic: 'npc_ridgewalker_f1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Guard: "The path is clear, for now. Tread carefully."',
      );
    },
  });

  // --- Events ---

  // EV-HR-003: Kinesis Vision
  map.createDynamicEvent({
    x: 24,
    y: 10,
    name: 'EV-HR-003',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('GQ_04_STARTED') &&
        !player.getVariable('KINESIS_VISION_TRIGGERED')
      ) {
        player.showText(
          'A blinding light erupts from the spire! Images of ancient power flash through your mind...',
        );
        player.setVariable('KINESIS_VISION_TRIGGERED', true);
        // TODO: Implement cinematic/vision sequence for Kinesis spire
      } else if (player.getVariable('KINESIS_VISION_TRIGGERED')) {
        player.showText(
          'The spire still hums with residual energy from the vision.',
        );
      } else {
        player.showText(
          'The spire hums with a faint energy, but nothing happens.',
        );
      }
    },
  });

  // EV-HR-004: Kinesis Pedestals
  map.createDynamicEvent({
    x: 24,
    y: 10,
    name: 'EV-HR-004',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('GQ_04_STARTED')) {
        player.showText(
          'You stand before four pedestals, each radiating a distinct emotion. Which will you choose?',
        );
        // TODO: Implement pedestal puzzle mechanic when showChoices is available
        // Options: Joy, Fury, Sorrow, Awe
      } else {
        player.showText(
          'The spire hums with a faint energy, but nothing happens.',
        );
      }
    },
  });

  // EV-HR-005: Shattered Pass Puzzle
  map.createDynamicEvent({
    x: 33,
    y: 28,
    name: 'EV-HR-005',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'The air here is thick with a strange stagnation. A puzzle of crystallized energy blocks the path.',
      );
      // TODO: Implement shattered pass puzzle mechanic
    },
  });

  // EV-HR-006: Echo Caverns -> depths-l3 [MQ-05]
  map.createDynamicEvent({
    x: 38,
    y: 3,
    name: 'EV-HR-006',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_05_STARTED')) {
        player.changeMap('depths-level-3', { x: 10, y: 0 });
      } else {
        player.showText(
          'A chilling draft emanates from the cave entrance. It feels too dangerous to enter yet.',
        );
      }
    },
  });

  // EV-HR-007: South -> Sunridge
  map.createDynamicEvent({
    x: 25,
    y: 49,
    name: 'EV-HR-007',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('sunridge', { x: 18, y: 0 });
    },
  });

  // EV-HR-008: East -> Flickerveil [MQ-05]
  map.createDynamicEvent({
    x: 49,
    y: 25,
    name: 'EV-HR-008',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_05_STARTED')) {
        player.changeMap('flickerveil', { x: 0, y: 15 });
      } else {
        player.showText(
          'A magical barrier blocks the path east. It seems impassable for now.',
        );
      }
    },
  });

  // EV-HR-009: SE -> Shimmer Marsh [MQ-05]
  map.createDynamicEvent({
    x: 49,
    y: 35,
    name: 'EV-HR-009',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_05_STARTED')) {
        player.changeMap('shimmer-marsh', { x: 0, y: 25 });
      } else {
        player.showText(
          'The path to the southeast is overgrown and impassable. You need to find another way.',
        );
      }
    },
  });

  // EV-HR-010: North -> Undrawn Peaks [MQ-07]
  map.createDynamicEvent({
    x: 25,
    y: 0,
    name: 'EV-HR-010',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_07_STARTED')) {
        player.changeMap('undrawn-peaks', { x: 20, y: 39 });
      } else {
        player.showText(
          'The northern pass is blocked by a massive rockslide. It looks like a recent event.',
        );
      }
    },
  });

  // --- Enemy Zones ---
  // TODO: Implement encounter zones when battle system is ready
  // Mountain Trails: bounds=5,10 -> 30,40, enemies=[wind_elemental,mountain_drake], levels=12-16, rate=5%
  // Spire Approach: bounds=18,3 -> 30,15, enemies=[wind_elemental,crystal_sentinel], levels=14-16, rate=7%
  // Shattered Pass: bounds=30,25 -> 40,34, enemies=[crystal_sentinel], levels=15-17, rate=8%
  // Echo Caverns Approach: bounds=35,2 -> 45,10, enemies=[mountain_drake], levels=14-16, rate=6%
}
