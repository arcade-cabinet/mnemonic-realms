import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- NPCs ---

  // Lead Audiomancer (SQ-09, SQ-13 hub)
  map.createDynamicEvent({
    x: 9,
    y: 34,
    name: 'lead-audiomancer',
    graphic: 'npc_audiomancer_m1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const sq09Started = player.getVariable('SQ_09_STARTED');
      const sq09Completed = player.getVariable('SQ_09_COMPLETED');
      const sq13Started = player.getVariable('SQ_13_STARTED');

      if (sq09Started && !sq09Completed) {
        player.showText(
          'Lead Audiomancer: "The resonance is still unstable. We need to align the harmonic frequencies before we can proceed. Keep searching for the tuning crystals."',
        );
      } else if (sq09Completed && !sq13Started) {
        player.showText(
          'Lead Audiomancer: "Excellent work with the tuning. But now I sense a deeper dissonance... something in the cathedral. Will you investigate?"',
        );
      } else {
        player.showText(
          'Lead Audiomancer: "Welcome to the Resonance Fields. The sound of creation echoes here, if you listen closely."',
        );
      }
    },
  });

  // Audiomancer B
  map.createDynamicEvent({
    x: 10,
    y: 36,
    name: 'audiomancer-b',
    graphic: 'npc_audiomancer_f1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Audiomancer B: "The harmonics in this area are particularly strong. Can you feel them?"',
      );
    },
  });

  // Audiomancer C
  map.createDynamicEvent({
    x: 8,
    y: 35,
    name: 'audiomancer-c',
    graphic: 'npc_audiomancer_m2',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Audiomancer C: "We study the resonance patterns left by the dormant god. Each vibration tells a story."',
      );
    },
  });

  // Audiomancer D
  map.createDynamicEvent({
    x: 11,
    y: 34,
    name: 'audiomancer-d',
    graphic: 'npc_audiomancer_f2',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Audiomancer D: "Be careful near the amphitheater. The resonance there can overwhelm the unprepared."',
      );
    },
  });

  // Preserver Captain
  map.createDynamicEvent({
    x: 40,
    y: 14,
    name: 'preserver-captain-rf',
    graphic: 'npc_preserver_captain',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const gq01f2Started = player.getVariable('GQ_01_F2_STARTED');
      if (gq01f2Started) {
        player.showText(
          'Preserver Captain: "The cathedral is under our protection. Your presence here is... noted. Do not interfere with the Preservation."',
        );
      } else {
        player.showText(
          'Preserver Captain: "Move along. The cathedral grounds are restricted to authorized personnel only."',
        );
      }
    },
  });

  // Preserver Agent A
  map.createDynamicEvent({
    x: 37,
    y: 13,
    name: 'preserver-agent-rf-a',
    graphic: 'npc_preserver_agent',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Preserver Agent: "The Preservation ensures stability. Without order, the world would dissolve into chaos."',
      );
    },
  });

  // Preserver Agent B
  map.createDynamicEvent({
    x: 41,
    y: 15,
    name: 'preserver-agent-rf-b',
    graphic: 'npc_preserver_agent',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Preserver Agent: "The Preservation ensures stability. Without order, the world would dissolve into chaos."',
      );
    },
  });

  // Preserver Agent C
  map.createDynamicEvent({
    x: 39,
    y: 12,
    name: 'preserver-agent-rf-c',
    graphic: 'npc_preserver_agent',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Preserver Agent: "The Preservation ensures stability. Without order, the world would dissolve into chaos."',
      );
    },
  });

  // --- Events ---

  // EV-RF-003: Resonance recall vision (Amphitheater)
  map.createDynamicEvent({
    x: 25,
    y: 25,
    name: 'EV-RF-003',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const gq01Started = player.getVariable('GQ_01_STARTED');
      const visionSeen = player.getVariable('GQ_01_RECALL_VISION_SEEN');
      if (gq01Started && !visionSeen) {
        player.setVariable('GQ_01_RECALL_VISION_SEEN', true);
        player.showText(
          'The amphitheater resonates with ancient harmonics. Ghostly figures appear, performing a long-forgotten melody...',
        );
        player.showText(
          'A vision of the Resonance God floods your mind. The recall is powerful, overwhelming...',
        );
      } else {
        player.showText(
          'The amphitheater hums with a faint, ambient resonance. You feel at peace here.',
        );
      }
    },
  });

  // EV-RF-004: 4 emotion pedestals (Amphitheater)
  map.createDynamicEvent({
    x: 25,
    y: 25,
    name: 'EV-RF-004',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const gq01Started = player.getVariable('GQ_01_STARTED');
      if (gq01Started) {
        player.showText(
          'Four pedestals surround the amphitheater stage, each inscribed with an emotion: Joy, Fury, Sorrow, Awe. Which will you choose to broadcast?',
        );
        // TODO: Implement emotion pedestal choice logic (joy/fury/sorrow/awe recall options)
      } else {
        player.showText(
          'Four ancient pedestals stand around the stage. They seem dormant, waiting for something to awaken them.',
        );
      }
    },
  });

  // EV-RF-005: Cathedral entrance
  map.createDynamicEvent({
    x: 38,
    y: 13,
    name: 'EV-RF-005',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const gq01f2Started = player.getVariable('GQ_01_F2_STARTED');
      if (gq01f2Started) {
        player.showText(
          'The cathedral doors creak open. The Preservers inside seem agitated by your presence. Prepare yourself.',
        );
        // TODO: Implement cathedral assault encounter/cutscene
      } else {
        player.showText(
          'The cathedral entrance is heavily guarded by Preservers. They will not let you pass.',
        );
      }
    },
  });

  // EV-RF-006: Singing Stones puzzle -> Depths L4
  map.createDynamicEvent({
    x: 28,
    y: 43,
    name: 'EV-RF-006',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'A circle of Singing Stones hums with an ancient melody. Each stone resonates at a different pitch. Perhaps playing them in the right order will reveal a hidden path...',
      );
      // TODO: Implement Singing Stones puzzle logic
      // On success: player.changeMap('depths-l4', { x: 10, y: 0 });
    },
  });

  // EV-RF-007: East -> Shimmer Marsh (conditional MQ_05_COMPLETED)
  map.createDynamicEvent({
    x: 49,
    y: 25,
    name: 'EV-RF-007',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_05_COMPLETED')) {
        player.changeMap('shimmer-marsh', { x: 0, y: 25 });
      } else {
        player.showText(
          'The path to Shimmer Marsh is currently blocked by a powerful resonance barrier.',
        );
      }
    },
  });

  // EV-RF-008: North -> Hollow Ridge (conditional MQ_05_COMPLETED)
  map.createDynamicEvent({
    x: 25,
    y: 0,
    name: 'EV-RF-008',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_05_COMPLETED')) {
        player.changeMap('hollow-ridge', { x: 25, y: 49 });
      } else {
        player.showText(
          "The northern pass to Hollow Ridge is unstable. It's too dangerous to cross.",
        );
      }
    },
  });

  // EV-RF-009: West -> Luminous Wastes (conditional MQ_07_COMPLETED)
  map.createDynamicEvent({
    x: 0,
    y: 25,
    name: 'EV-RF-009',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_07_COMPLETED')) {
        player.changeMap('luminous-wastes', { x: 39, y: 20 });
      } else {
        player.showText(
          'A strange, shimmering barrier blocks the way west. It seems to react to your presence.',
        );
      }
    },
  });

  // EV-RF-010: Amphitheater ambient hum
  map.createDynamicEvent({
    x: 25,
    y: 25,
    name: 'EV-RF-010',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'The amphitheater hums with a gentle, ever-present resonance. The sound seems to pulse in time with your heartbeat.',
      );
    },
  });

  // --- Enemy Zones ---
  // TODO: Implement encounter zones when battle system is ready
  //
  // Open Plains: bounds=(5,5) to (35,40)
  //   enemies: [sound-echo, stone-guardian], levels: 13-16, rate: 3%
  //
  // Cathedral: bounds=(33,8) to (45,20)
  //   enemies: [preserver-agent, harmony-wraith], levels: 15-17, rate: 4%
  //
  // South Plains: bounds=(15,35) to (45,48)
  //   enemies: [stone-guardian, harmony-wraith], levels: 14-16, rate: 3.5%
}
