import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // EV-D4-001: Entry from Resonance Fields
  map.createDynamicEvent({
    x: 10,
    y: 0,
    name: 'EV-D4-001',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('resonance-fields', { x: 28, y: 44 });
    },
  });

  // EV-D4-002: First Verse vision
  map.createDynamicEvent({
    x: 10,
    y: 2,
    name: 'EV-D4-002',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('D4_FIRST_VERSE_VISION_SEEN')) {
        player.setVariable('D4_FIRST_VERSE_VISION_SEEN', true);
        player.showText(
          'The air hums with anticipation. Ghostly figures assemble, instruments poised. The Conductor raises their baton...',
        );
        player.showText('A vision of the First Verse: Prelude.');
      }
    },
  });

  // EV-D4-004: Burdened RS: final compost [GQ-02-S1]
  map.createDynamicEvent({
    x: 15,
    y: 7,
    name: 'EV-D4-004',
    graphic: 'DUN-DE-06',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      const alreadyComposted = player.getVariable('GQ_02_S1_BURDENED_STONE_D4_COMPOSTED');
      if (!alreadyComposted) {
        if (player.getVariable('GQ_02_S1_ACTIVE')) {
          player.showText(
            'You found the final burdened Resonance Stone. It pulses with a deep sorrow.',
          );
          player.showText('Broadcasting a sorrow-type fragment to "compost" the stone...');
          player.showText(
            'The stone shimmers, yielding 2 fragments (potency 3, random emotions).',
          );
          player.setVariable('GQ_02_S1_BURDENED_STONE_D4_COMPOSTED', true);
          const count = (player.getVariable('GQ_02_S1_COUNT') as number) || 0;
          player.setVariable('GQ_02_S1_COUNT', count + 1);
          player.showText('Quest "The Composting" updated: 3/3 burdened stones found.');
          player.showText(
            'The stone now emanates a calming energy, becoming a rest point.',
          );
          // TODO: Implement HP/SP heal when stat system is ready
        } else {
          player.showText(
            'A burdened Resonance Stone. It hums with a deep sorrow, but you lack the means to interact with it fully.',
          );
        }
      } else {
        player.showText('You rest at the Resonance Stone. HP and SP fully restored.');
        // TODO: Implement HP/SP heal when stat system is ready
      }
    },
  });

  // EV-D4-006: Memory lift -> Resonance Fields
  map.createDynamicEvent({
    x: 4,
    y: 7,
    name: 'EV-D4-006',
    graphic: 'DUN-PA-06',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText('Activate the Memory Lift? Travel to Resonance Fields.');
      // TODO: Implement choice dialog when showChoices is available
      // For now, travel directly on action
      player.changeMap('resonance-fields', { x: 28, y: 44 });
    },
  });

  // EV-D4-010: Fourth Verse dissolution vision
  map.createDynamicEvent({
    x: 15,
    y: 17,
    name: 'EV-D4-010',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('D4_FOURTH_VERSE_VISION_SEEN')) {
        player.setVariable('D4_FOURTH_VERSE_VISION_SEEN', true);
        player.showText(
          'The phantom performers begin to dissolve, their bodies thinning to wisps. Instruments fall silent...',
        );
        player.showText('A vision of the Fourth Verse: The Dissolution.');
      }
    },
  });

  // EV-D4-014: Boss: The Conductor dialogue
  map.createDynamicEvent({
    x: 10,
    y: 22,
    name: 'EV-D4-014',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('D4_CONDUCTOR_DIALOGUE_DONE')) {
        player.showText(
          "The Conductor: \"You've heard the verses. You've watched them dissolve. Now... the finale. I've been holding this last note for a thousand years. Help me finish it.\"",
        );
        player.setVariable('D4_CONDUCTOR_DIALOGUE_DONE', true);
      } else if (!player.getVariable('D4_CONDUCTOR_DEFEATED')) {
        player.showText('The Conductor stands ready. "The finale awaits."');
      } else {
        player.showText('The Conductor is at peace. The song is complete.');
      }
    },
  });

  // EV-D4-015: Boss fight: The Conductor
  map.createDynamicEvent({
    x: 10,
    y: 22,
    name: 'EV-D4-015',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('D4_CONDUCTOR_DIALOGUE_DONE') &&
        !player.getVariable('D4_CONDUCTOR_DEFEATED')
      ) {
        // TODO: Implement boss battle when battle system is ready
        // Battle: B-03c (The Conductor)
        // On win:
        //   player.setVariable('D4_CONDUCTOR_DEFEATED', true);
        //   Full HP/SP heal
        //   "The Conductor fades, a final, perfect note resonating through the hall."
        // On loss:
        //   "The Conductor's song overwhelms you. You retreat..."
        //   player.changeMap('resonance-fields', { x: 28, y: 44 });
        player.showText(
          'The Conductor raises their baton. The finale begins! (Battle not yet implemented)',
        );
        player.setVariable('D4_CONDUCTOR_DEFEATED', true);
        player.showText(
          'The Conductor fades, a final, perfect note resonating through the hall. Your party feels invigorated. The song is complete.',
        );
      }
    },
  });

  // EV-D4-017: Stairway -> Depths L5
  map.createDynamicEvent({
    x: 10,
    y: 24,
    name: 'EV-D4-017',
    graphic: 'DUN-PA-04',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('D4_CONDUCTOR_DEFEATED')) {
        player.showText('Descend to Depths Level 5?');
        // TODO: Implement choice dialog when showChoices is available
        // For now, descend directly on action
        player.changeMap('depths-l5', { x: 10, y: 0 });
      } else {
        player.showText(
          'The stairway is sealed by a powerful resonance. You must complete the song first.',
        );
      }
    },
  });

  // --- Enemy Zones ---
  // TODO: Implement encounter zones when battle system is ready
  //
  // Prelude hall: bounds=(1,1) to (20,4)
  //   enemies: [E-DP-04], levels: 19-20
  //
  // Rising hall: bounds=(10,5) to (20,9)
  //   enemies: [E-DP-04], levels: 19-21
  //
  // Crescendo corridor: bounds=(1,10) to (20,14)
  //   enemies: [E-DP-04], levels: 19-21
  //
  // Dissolution hall: bounds=(10,15) to (20,19)
  //   enemies: [E-DP-04], levels: 20-21
  //
  // Alcove guard: bounds=(1,15) to (8,19)
  //   enemies: [E-DP-04], levels: 19-21
}
