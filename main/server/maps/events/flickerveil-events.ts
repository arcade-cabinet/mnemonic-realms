import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- NPCs ---

  // Solen
  map.createDynamicEvent({
    x: 35,
    y: 30,
    name: 'solen',
    graphic: 'npc_solen',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('GQ_03_STARTED')) {
        player.showText(
          'Solen: "Ah, the Light Lens. It hums with a familiar energy. Have you felt the resonance?"',
        );
      } else if (player.getVariable('SQ_08_STARTED')) {
        player.showText(
          'Solen: "The flickering grows stronger. Keep observing the anomalies, young one."',
        );
      } else {
        player.showText('Solen: "Welcome to Flickerveil. The light here is... unique."');
      }
    },
  });

  // Village Shopkeeper
  map.createDynamicEvent({
    x: 36,
    y: 29,
    name: 'village-shopkeeper-fv',
    graphic: 'npc_shopkeep_f2',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Shopkeeper: "Greetings, traveler! Looking for something to aid your journey?"',
      );
      // TODO: Implement shop (PrismWand 500g, Flickerblade 750g, StasisBreaker 150g) when RPG-JS shop API is available
    },
  });

  // Village Innkeeper
  map.createDynamicEvent({
    x: 34,
    y: 32,
    name: 'village-innkeeper-fv',
    graphic: 'npc_innkeeper_f1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'Innkeeper: "Rest your weary bones, friend. A good night\'s sleep will do you wonders."',
      );
      // TODO: Implement rest (50 gold, full HP/SP restore) when RPG-JS rest/inn API is available
    },
  });

  // Flickering Guard A
  map.createDynamicEvent({
    x: 31,
    y: 28,
    name: 'flickering-guard-a',
    graphic: 'npc_villager_m4',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText('Guard: "Keep an eye out for anything unusual. The veil is thin here."');
    },
  });

  // Preserver Agent (Archive)
  map.createDynamicEvent({
    x: 9,
    y: 9,
    name: 'preserver-agent-archive',
    graphic: 'npc_preserver_agent',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('GQ_03_F1_STARTED')) {
        player.showText('Preserver Agent: "Intruder! You will not desecrate the Archive!"');
        // TODO: Implement battle with Preserver Agent when RPG-JS battle API is available
      } else {
        player.showText('Preserver Agent: "This area is restricted. Move along."');
      }
    },
  });

  // Elyn (conditional: appears after GQ-03-S1 starts)
  if (player.getVariable('GQ_03_S1_STARTED')) {
    map.createDynamicEvent({
      x: 30,
      y: 26,
      name: 'elyn',
      graphic: 'npc_elyn',
      hitbox: { width: 16, height: 16 },
      onAction(player: RpgPlayer) {
        if (player.getVariable('GQ_03_S1_STARTED') && !player.getVariable('ELYN_ESCORT_STARTED')) {
          player.showText(
            'Elyn: "Thank the stars you\'re here! The Preservers are closing in. We need to move, now!"',
          );
          player.setVariable('ELYN_ESCORT_STARTED', true);
          player.showText('Elyn joins your party temporarily for escort.');
          // TODO: Implement temporary party member / follow behavior
        } else if (player.getVariable('ELYN_ESCORT_STARTED')) {
          player.showText('Elyn: "Let\'s keep moving. We can\'t linger here."');
        } else {
          player.showText('Elyn: "The truth is out there, but it\'s dangerous to seek."');
        }
      },
    });
  }

  // --- General Events ---

  // EV-FV-003: Luminos Recall Vision
  map.createDynamicEvent({
    x: 20,
    y: 20,
    name: 'EV-FV-003',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('GQ_03_STARTED') && player.getVariable('HAS_LIGHT_LENS')) {
        player.showText(
          'A blinding light emanates from the prism. Visions of ancient power flood your mind...',
        );
        player.setVariable('GQ_03_COMPLETED', true);
      } else if (!player.getVariable('HAS_LIGHT_LENS')) {
        player.showText(
          'A strange prism stands here, surrounded by four empty pedestals. It seems to await something.',
        );
      }
    },
  });

  // EV-FV-004: Emotion Pedestals
  map.createDynamicEvent({
    x: 20,
    y: 20,
    name: 'EV-FV-004',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('GQ_03_STARTED')) {
        player.showText(
          'You stand before four pedestals, each resonating with a distinct emotion. Which will you touch?',
        );
        // TODO: Implement choice dialog (Joy/Sorrow/Fury/Calm) when RPG-JS choice API is verified
        // Each choice advances GQ-03 in a different way
      } else {
        player.showText('A strange prism stands here, surrounded by four empty pedestals.');
      }
    },
  });

  // EV-FV-005: Archive Assault
  map.createDynamicEvent({
    x: 8,
    y: 8,
    name: 'EV-FV-005',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('GQ_03_F1_STARTED') && !player.getVariable('ARCHIVE_CLEARED')) {
        player.showText(
          'The air crackles with hostile energy. Preserver Agents emerge from the shadows!',
        );
        // TODO: Implement battle with 2x Preserver Agents when RPG-JS battle API is available
        // On victory:
        player.showText("You've cleared the immediate threat. The Archive is now accessible.");
        player.setVariable('ARCHIVE_CLEARED', true);
      } else if (player.getVariable('ARCHIVE_CLEARED')) {
        player.showText('The Archive is quiet now. The Preservers are gone.');
      } else {
        player.showText('An ancient archive, guarded by vigilant Preservers.');
      }
    },
  });

  // --- Map Transitions ---

  // EV-FV-007: West -> Shimmer Marsh
  map.createDynamicEvent({
    x: 0,
    y: 25,
    name: 'EV-FV-007',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_05_COMPLETED')) {
        player.changeMap('shimmer_marsh', { x: 49, y: 25 });
      } else {
        player.showText(
          'A magical barrier prevents passage. You must advance further in your journey.',
        );
      }
    },
  });

  // EV-FV-008: West -> Hollow Ridge
  map.createDynamicEvent({
    x: 0,
    y: 15,
    name: 'EV-FV-008',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_05_COMPLETED')) {
        player.changeMap('hollow_ridge', { x: 49, y: 25 });
      } else {
        player.showText('The path ahead is shrouded in mist. It seems impassable for now.');
      }
    },
  });

  // EV-FV-009: West -> Ambergrove
  map.createDynamicEvent({
    x: 0,
    y: 38,
    name: 'EV-FV-009',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('ambergrove', { x: 38, y: 20 });
    },
  });

  // EV-FV-010: East -> Half-Drawn Forest
  map.createDynamicEvent({
    x: 48,
    y: 25,
    name: 'EV-FV-010',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_07_COMPLETED')) {
        player.changeMap('half_drawn_forest', { x: 0, y: 20 });
      } else {
        player.showText(
          "A shimmering distortion blocks your way. You are not ready to cross the Veil's Edge.",
        );
      }
    },
  });

  // --- Enemy Zones ---

  // TODO: West Forest zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (2,15) to (18,40), enemies: Phantom Fox / Canopy Crawler, levels 13-15, 10% rate

  // TODO: East Forest zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (25,5) to (45,25), enemies: Flicker Wisp / Phantom Fox, levels 13-16, 10% rate

  // TODO: Archive Perimeter zone — fixed encounters only (garrison), conditional on GQ_03_F1_STARTED
  // Bounds: (5,5) to (13,13), enemies: Preserver Agent, levels 14-16, 2% rate

  // TODO: Veil's Edge zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (42,20) to (49,28), enemies: Flicker Wisp / Sketch Phantom, levels 15-17, 10% rate
}
