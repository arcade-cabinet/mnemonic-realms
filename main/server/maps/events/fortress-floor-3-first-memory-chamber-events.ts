import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // EV-F3-001: Entry from F2 [MQ-09]
  map.createDynamicEvent({
    x: 10,
    y: 0,
    name: 'EV-F3-001',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_09_STARTED')) {
        player.changeMap('fortress-f2', { x: 10, y: 24 });
      }
    },
  });

  // EV-F3-002: Curator Dialogue [MQ-09]
  map.createDynamicEvent({
    x: 10,
    y: 5,
    name: 'EV-F3-002',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('MQ_09_STARTED') &&
        !player.getVariable('F3_VIGNETTE_5_SEEN')
      ) {
        player.showText(
          "A holographic projection flickers to life, showing the Curator, younger, but with a face hardened by resolve. 'Never again,' a voice echoes.",
        );
        player.setVariable('F3_VIGNETTE_5_SEEN', true);
      }
    },
  });

  // EV-F3-003: Final Boss: The Curator [MQ-09]
  map.createDynamicEvent({
    x: 10,
    y: 12,
    name: 'EV-F3-003',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('MQ_09_OBJECTIVE3_STARTED') &&
        !player.getVariable('F3_CURATOR_CONFRONTATION_STARTED')
      ) {
        player.showText(
          "The Curator stands before the First Memory, their gaze piercing. 'You've come far, Architect. But you cannot undo what I've preserved.'",
        );
        player.setVariable('F3_CURATOR_CONFRONTATION_STARTED', true);
        // TODO: Implement Curator boss battle when battle system is ready
      }
    },
  });

  // EV-F3-004: First Memory Interaction [MQ-09, MQ-10]
  map.createDynamicEvent({
    x: 10,
    y: 18,
    name: 'EV-F3-004',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('MQ_09_OBJECTIVE3_STARTED') &&
        !player.getVariable('MF_10_COLLECTED')
      ) {
        player.showText(
          "You reach out and touch the pulsing sphere. A wave of pure, calm energy washes over you. You've acquired the First Memory (MF-10).",
        );
        // TODO: Implement addItem when item system is ready
        // player.addItem('MF-10', 1);
        player.setVariable('MF_10_COLLECTED', true);
        player.setVariable('MQ_09_OBJECTIVE3_COMPLETED', true);
        player.showText(
          "Quest 'The Architect's Legacy' (MQ-09) objective 'Confront the Curator and retrieve the First Memory' completed!",
        );
        if (!player.getVariable('MQ_10_STARTED')) {
          player.setVariable('MQ_10_STARTED', true);
          player.showText("Quest 'World's New Dawn' (MQ-10) started!");
        }
      } else if (
        player.getVariable('MQ_10_OBJECTIVE1_STARTED') &&
        player.getVariable('MF_10_COLLECTED') &&
        !player.getVariable('MF_11_COLLECTED')
      ) {
        player.showText(
          'You hold the First Memory. This is the core. What will you combine it with to create a new dawn?',
        );
        player.showText(
          "You use the Remix interface, combining MF-10 with a fragment of your journey. A new memory, MF-11: World's New Dawn, is created!",
        );
        // TODO: Implement addItem when item system is ready
        // player.addItem('MF-11', 1);
        player.setVariable('MF_11_COLLECTED', true);
        player.setVariable('MQ_10_OBJECTIVE1_COMPLETED', true);
        player.showText(
          "Quest 'World's New Dawn' (MQ-10) objective 'Remix the First Memory' completed!",
        );
      } else if (
        player.getVariable('MQ_10_OBJECTIVE2_STARTED') &&
        player.getVariable('MF_11_COLLECTED')
      ) {
        player.showText(
          "You prepare to broadcast MF-11: World's New Dawn. This is it. The world awaits.",
        );
        player.showText(
          'A brilliant light erupts from the First Memory Chamber, spreading across the Mnemonic Realms. The world begins to bloom!',
        );
        player.setVariable('MQ_10_OBJECTIVE2_COMPLETED', true);
        player.showText(
          "Quest 'World's New Dawn' (MQ-10) objective 'Broadcast the New Dawn' completed!",
        );
        player.setVariable('F3_ENDGAME_BLOOM_TRIGGERED', true);
      } else {
        player.showText(
          'The First Memory pulses gently. Nothing more to do here right now.',
        );
      }
    },
  });

  // EV-F3-005: Ending Sequence
  map.createDynamicEvent({
    x: 10,
    y: 20,
    name: 'EV-F3-005',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('MQ_10_OBJECTIVE2_COMPLETED') &&
        player.getVariable('F3_ENDGAME_BLOOM_TRIGGERED') &&
        !player.getVariable('F3_ENDGAME_CINEMATIC_PLAYED')
      ) {
        player.showText(
          'The world outside transforms. Colors burst forth, stagnation shatters, and the Sketch fills with vibrant life. The Mnemonic Realms are reborn.',
        );
        player.setVariable('F3_ENDGAME_CINEMATIC_PLAYED', true);
      }
    },
  });
}
