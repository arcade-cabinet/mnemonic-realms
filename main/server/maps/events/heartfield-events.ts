import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- NPCs ---

  // Farmer Gale (farmer-gale)
  map.createDynamicEvent({
    x: 15,
    y: 14,
    name: 'farmer-gale',
    graphic: 'npc_farmer_m1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const sq02Started = player.getVariable('SQ_02_STARTED');
      const sq02Completed = player.getVariable('SQ_02_COMPLETED');
      const mq03Started = player.getVariable('MQ_03_STARTED');
      const mq03Completed = player.getVariable('MQ_03_COMPLETED');

      if (sq02Started && !sq02Completed) {
        player.showText(
          'Farmer Gale: "The old windmill... it groans more than usual. Something\'s not right with it. Could you take a look?"',
        );
      } else if (mq03Started && !mq03Completed) {
        player.showText(
          'Farmer Gale: "The crops are struggling. I fear the blight is spreading from the east."',
        );
      } else {
        player.showText('Farmer Gale: "A good harvest makes a happy farmer."');
      }
    },
  });

  // Farmer Suri (farmer-suri)
  map.createDynamicEvent({
    x: 17,
    y: 16,
    name: 'farmer-suri',
    graphic: 'npc_farmer_f1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const mq03Started = player.getVariable('MQ_03_STARTED');
      const mq03Completed = player.getVariable('MQ_03_COMPLETED');
      if (mq03Started && !mq03Completed) {
        player.showText(
          'Farmer Suri: "Have you seen the fields to the east? They look... different, almost frozen."',
        );
      } else {
        player.showText(
          'Farmer Suri: "Welcome to Heartfield. We work hard here to keep the land vibrant."',
        );
      }
    },
  });

  // Farmer Edric (farmer-edric)
  map.createDynamicEvent({
    x: 14,
    y: 18,
    name: 'farmer-edric',
    graphic: 'npc_farmer_m2',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Farmer Edric: "The soil is good, but the air feels heavy sometimes. I worry for the future."',
      );
    },
  });

  // Hamlet Elder (hamlet-elder)
  map.createDynamicEvent({
    x: 18,
    y: 14,
    name: 'hamlet-elder',
    graphic: 'npc_elder_f1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Hamlet Elder: "The Heartfield has sustained us for generations. We must protect its vibrancy, for it is our lifeblood."',
      );
    },
  });

  // Child NPC (child-npc) - Appears after Solara recall
  if (player.getVariable('SOLARA_RECALLED')) {
    map.createDynamicEvent({
      x: 16,
      y: 15,
      name: 'child-npc',
      graphic: 'npc_child_01',
      hitbox: { width: 16, height: 16 },
      onAction(player: RpgPlayer) {
        player.showText(
          'Child: "Whee! Playing in the fields is the best! The butterflies are so pretty!"',
        );
      },
    });
  }

  // --- Standard Events ---

  // EV-HF-002: Old Windmill entrance
  map.createDynamicEvent({
    x: 30,
    y: 8,
    name: 'EV-HF-002',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const sq02Started = player.getVariable('SQ_02_STARTED');
      const sq02Completed = player.getVariable('SQ_02_COMPLETED');
      if (sq02Started && !sq02Completed) {
        player.changeMap('windmill_interior', { x: 10, y: 10 });
      } else {
        player.showText(
          'The old windmill stands silent. Its sails are still, and the entrance is locked from the inside.',
        );
      }
    },
  });

  // EV-HF-003: Stagnation Clearing cutscene
  map.createDynamicEvent({
    x: 33,
    y: 28,
    name: 'EV-HF-003',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const mq04Started = player.getVariable('MQ_04_STARTED');
      const mq04Completed = player.getVariable('MQ_04_COMPLETED');
      const alreadyTriggered = player.getVariable('EV_HF_003_TRIGGERED');

      if (mq04Started && !mq04Completed && !alreadyTriggered) {
        player.setVariable('EV_HF_003_TRIGGERED', true);
        player.showText(
          'A chilling stillness permeates the air. The grass here is frozen, crystallized.',
        );
        player.showText('A faint, sorrowful hum resonates from the clearing ahead...');
      } else if (!alreadyTriggered) {
        player.showText('The clearing ahead feels unnaturally still.');
      }
    },
  });

  // EV-HF-005: South -> Shimmer Marsh (conditional MQ_04_COMPLETED)
  map.createDynamicEvent({
    x: 20,
    y: 38,
    name: 'EV-HF-005',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_04_COMPLETED')) {
        player.changeMap('shimmer_marsh', { x: 20, y: 0 });
      } else {
        player.showText(
          'The path south is overgrown and seems impassable for now. Perhaps later, when the way is clearer.',
        );
      }
    },
  });

  // EV-HF-006: North -> Village Hub
  map.createDynamicEvent({
    x: 15,
    y: 0,
    name: 'EV-HF-006',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('village_hub', { x: 15, y: 25 });
    },
  });

  // EV-HF-007: East -> Ambergrove
  map.createDynamicEvent({
    x: 39,
    y: 20,
    name: 'EV-HF-007',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('ambergrove', { x: 0, y: 20 });
    },
  });

  // EV-HF-008: Windmill Resonance Stone
  map.createDynamicEvent({
    x: 31,
    y: 9,
    name: 'EV-HF-008',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'You touch the Resonance Stone. It hums with a faint, awe-inspiring energy. (Awe/Wind Fragment)',
      );
      // TODO: Add logic to collect fragment, check if already collected
    },
  });

  // EV-HF-009: Broadcast joy into frozen Hana (conditional SQ_14)
  map.createDynamicEvent({
    x: 34,
    y: 29,
    name: 'EV-HF-009',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const sq14Started = player.getVariable('SQ_14_STARTED');
      const sq14Completed = player.getVariable('SQ_14_COMPLETED');
      if (sq14Started && !sq14Completed) {
        const joyFragments = player.getVariable('JOY_FRAGMENTS_COLLECTED') || 0;
        if (joyFragments >= 4) {
          player.showText(
            'You focus your collected joy fragments into the frozen form. A faint warmth spreads, and a single tear thaws on her cheek.',
          );
          // TODO: Advance SQ-14, potentially trigger a cutscene or state change
        } else {
          player.showText(
            'The frozen form of Hana radiates immense sorrow. You feel a pull to broadcast joy, but lack sufficient fragments.',
          );
        }
      } else {
        player.showText(
          'A figure, frozen in time, lies here. A profound sadness emanates from her.',
        );
      }
    },
  });

  // --- Enemy Zones ---
  // Encounter zones defined in systems/encounters.ts (HEARTFIELD_ZONES).
  // Random encounters triggered via player.ts onInput hook -> checkEncounter().
  //
  // Wheat Fields West: bounds=(2,5) to (14,20), rate=3%
  // Wheat Fields East: bounds=(22,5) to (32,17), rate=4%
}
