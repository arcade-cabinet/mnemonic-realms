import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- NPCs ---

  // Wynn (Marsh Hermit)
  map.createDynamicEvent({
    x: 11,
    y: 14,
    graphic: 'npc_wynn',
    name: 'wynn',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('GQ_02_STARTED')) {
        player.showText(
          "The marsh holds many secrets, especially around Verdance's Hollow. I'm still trying to understand the resonance here.",
        );
      } else if (player.getVariable('SQ_06_STARTED')) {
        player.showText(
          'Have you found the dormant stones yet? Their energy is subtle, but crucial for my research.',
        );
      } else {
        player.showText(
          'Welcome to the Shimmer Marsh. Be careful, the Preservers are active here.',
        );
      }
    },
  });

  // Marsh Researcher
  map.createDynamicEvent({
    x: 12,
    y: 15,
    graphic: 'npc_researcher_f1',
    name: 'marsh-researcher',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        "The flora here is unlike anything I've seen. The way the light refracts through the water... it's mesmerizing.",
      );
    },
  });

  // Preserver Scout A
  map.createDynamicEvent({
    x: 36,
    y: 9,
    graphic: 'npc_preserver_scout',
    name: 'preserver-scout-a',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText('Halt! This area is under Preserver jurisdiction. Move along.');
    },
  });

  // Preserver Scout B
  map.createDynamicEvent({
    x: 40,
    y: 10,
    graphic: 'npc_preserver_scout',
    name: 'preserver-scout-b',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText('Nothing to see here. Move along, civilian.');
    },
  });

  // --- Events ---

  // EV-SM-002: Blocked root cluster broadcast [GQ-02]
  map.createDynamicEvent({
    x: 18,
    y: 28,
    name: 'EV-SM-002',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('GQ_02_ROOT_CLUSTER_CLEARED')) {
        player.showText('The roots have receded, revealing a path forward.');
      } else if (player.getVariable('GQ_02_STARTED')) {
        player.showText(
          'A dense cluster of roots blocks the path. It seems to respond to specific elemental broadcasts (Earth and Water).',
        );
        // TODO: Implement choice mechanic when showChoices is available
        // Options: Broadcast Earth, Broadcast Water, Do nothing
        // On success: player.setVariable('GQ_02_ROOT_CLUSTER_CLEARED', true)
      } else {
        player.showText(
          'A dense cluster of roots blocks the path. It feels ancient and unyielding.',
        );
      }
    },
  });

  // EV-SM-003: Verdance recall vision [GQ-02]
  map.createDynamicEvent({
    x: 25,
    y: 35,
    name: 'EV-SM-003',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('GQ_02_STARTED') &&
        !player.getVariable('VERDANCE_VISION_SEEN')
      ) {
        player.showText(
          "As you step into Verdance's Hollow, a shimmering mist envelops you...",
        );
        // TODO: Implement cinematic/vision sequence
        player.setVariable('VERDANCE_VISION_SEEN', true);
        player.showText(
          'A vision of ancient power, a verdant god, flashes through your mind. You feel a pull towards the pedestals.',
        );
      } else if (player.getVariable('VERDANCE_VISION_SEEN')) {
        player.showText(
          "Verdance's Hollow hums with residual energy from the vision.",
        );
      } else {
        player.showText(
          'This hollow feels significant, but nothing stirs at the moment.',
        );
      }
    },
  });

  // EV-SM-004: 4 emotion pedestals [GQ-02]
  map.createDynamicEvent({
    x: 25,
    y: 35,
    name: 'EV-SM-004',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('GQ_02_STARTED') &&
        player.getVariable('VERDANCE_VISION_SEEN')
      ) {
        player.showText(
          'Four ancient pedestals stand before you, each etched with a symbol of emotion. They hum faintly, awaiting a resonance.',
        );
        // TODO: Implement pedestal choice mechanic when showChoices is available
        // Options: Joy, Sorrow, Fury, Calm, Do nothing
        // On choice: check inventory for potency 3+ fragments, update quest objectives
      } else {
        player.showText(
          'Four ancient pedestals stand here, silent and still.',
        );
      }
    },
  });

  // EV-SM-005: Deepwater Sinkhole -> Depths Level 2
  map.createDynamicEvent({
    x: 33,
    y: 43,
    name: 'EV-SM-005',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('MQ_05_STARTED') ||
        player.getVariable('MQ_05_COMPLETED')
      ) {
        player.changeMap('depths-l2', { x: 10, y: 0 });
      } else {
        player.showText(
          'The water here swirls ominously, leading to unknown depths. It feels too dangerous to enter right now.',
        );
      }
    },
  });

  // EV-SM-006: North edge transition -> Heartfield
  map.createDynamicEvent({
    x: 20,
    y: 0,
    name: 'EV-SM-006',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('MQ_04_STARTED') ||
        player.getVariable('MQ_04_COMPLETED')
      ) {
        player.changeMap('heartfield', { x: 20, y: 38 });
      } else {
        player.showText(
          'A dense fog blocks the path north. It seems impassable for now.',
        );
      }
    },
  });

  // EV-SM-007: East edge transition -> Flickerveil
  map.createDynamicEvent({
    x: 49,
    y: 25,
    name: 'EV-SM-007',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('MQ_05_STARTED') ||
        player.getVariable('MQ_05_COMPLETED')
      ) {
        player.changeMap('flickerveil', { x: 0, y: 25 });
      } else {
        player.showText(
          'The marsh extends endlessly to the east, but a strange barrier prevents passage.',
        );
      }
    },
  });

  // EV-SM-008: West edge transition -> Hollow Ridge
  map.createDynamicEvent({
    x: 0,
    y: 25,
    name: 'EV-SM-008',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('MQ_05_STARTED') ||
        player.getVariable('MQ_05_COMPLETED')
      ) {
        player.changeMap('hollow-ridge', { x: 49, y: 35 });
      } else {
        player.showText(
          'The western path is overgrown and impassable. You need to find another way.',
        );
      }
    },
  });

  // EV-SM-009: South edge -> Luminous Wastes
  map.createDynamicEvent({
    x: 25,
    y: 49,
    name: 'EV-SM-009',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('MQ_07_STARTED') ||
        player.getVariable('MQ_07_COMPLETED')
      ) {
        player.changeMap('luminous-wastes', { x: 25, y: 0 });
      } else {
        player.showText(
          'A strange, glowing mist emanates from the south, making the path too dangerous to traverse.',
        );
      }
    },
  });

  // EV-SM-011: Stagnation Bog break mechanic
  map.createDynamicEvent({
    x: 38,
    y: 8,
    name: 'EV-SM-011',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('STAGNATION_BOG_BROKEN')) {
        player.showText(
          'The crystallized bog has been cleared, revealing a path.',
        );
      } else {
        player.showText(
          'The marsh here is unnaturally crystallized. It seems to require a powerful combination of Water and Fury energy to break.',
        );
        // TODO: Implement choice mechanic when showChoices is available
        // Options: Use Water + Fury, Do nothing
        // On success: player.setVariable('STAGNATION_BOG_BROKEN', true)
      }
    },
  });

  // --- Enemy Zones ---
  // TODO: Implement encounter zones when battle system is ready
  // Outer Marsh: bounds=5,5 -> 30,20, enemies=[E-FR-01,E-FR-02], levels=11-13, rate=15%
  // Deep Marsh: bounds=15,25 -> 40,45, enemies=[E-FR-01,bog-wisp], levels=12-14, rate=20%
  // Bog Perimeter: bounds=34,6 -> 44,16, enemies=[preserver-scout,E-FR-01], levels=12-14, rate=18%
  // Hollow Approach: bounds=20,28 -> 28,38, enemies=[E-FR-02], levels=13-15, rate=12%
}
