import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- MQ-09 state checks ---
  const isMq09Started = player.getVariable('MQ_09_STARTED');

  // --- EV-F2-001: Entry from F1 [MQ-09] ---
  map.createDynamicEvent({
    x: 10,
    y: 0,
    name: 'EV-F2-001',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_09_STARTED')) {
        player.changeMap('fortress-f1', { x: 10, y: 24 });
      }
    },
  });

  // --- Dilemma Events (EV-F2-007, EV-F2-008, EV-F2-009) ---

  // EV-F2-007: Dilemma 1: free musician
  map.createDynamicEvent({
    x: 8,
    y: 7,
    name: 'EV-F2-007',
    graphic: 'DUN-AN-05',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('F2_DILEMMA1_FREED')) {
        player.showText(
          'The Musician is already free. Their story continues.',
        );
        return;
      }
      // TODO: Implement fragment check when item system is ready
      // if (!player.hasItem('FRAGMENT')) { show "you need a Memory Fragment" }
      player.showText(
        'A Musician is frozen in a perfect moment, an eternal melody playing on an endless loop.',
      );
      // TODO: Implement choice mechanic when showChoices is available
      // Options: Free them (consume 1 Fragment), Leave them in their perfect moment
      // On free:
      //   player.setVariable('F2_DILEMMA1_FREED', true);
      //   player.showText('You broadcast a fragment, shattering the stasis. The musician stirs, confused, the perfect note lost to the winds of time. Their future is now their own.');
      // On leave:
      //   player.showText("The musician's perfect note plays on, an eternal melody. You leave them to their timeless performance.");
    },
  });

  // EV-F2-008: Dilemma 2: free lovers
  map.createDynamicEvent({
    x: 13,
    y: 7,
    name: 'EV-F2-008',
    graphic: 'DUN-AN-05',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('F2_DILEMMA2_FREED')) {
        player.showText(
          'The Lovers are already free. Their story continues.',
        );
        return;
      }
      player.showText(
        'Two Lovers are frozen in an eternal embrace, a perfect moment preserved forever.',
      );
      // TODO: Implement choice mechanic when showChoices is available
      // Options: Free them (consume 1 Fragment), Leave them in their perfect moment
      // On free:
      //   player.setVariable('F2_DILEMMA2_FREED', true);
      //   player.showText('You broadcast a fragment, breaking the stasis. The lovers stir, disoriented, their perfect embrace now a memory. They must rediscover each other in a changed world.');
      // On leave:
      //   player.showText('The lovers remain locked in their eternal embrace, a perfect moment preserved. You leave them to their timeless affection.');
    },
  });

  // EV-F2-009: Dilemma 3: free scholar
  map.createDynamicEvent({
    x: 18,
    y: 7,
    name: 'EV-F2-009',
    graphic: 'DUN-AN-05',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('F2_DILEMMA3_FREED')) {
        player.showText(
          'The Scholar is already free. Their story continues.',
        );
        return;
      }
      player.showText(
        'A Scholar is frozen in a moment of profound discovery, a perfect insight preserved.',
      );
      // TODO: Implement choice mechanic when showChoices is available
      // Options: Free them (consume 1 Fragment), Leave them in their perfect moment
      // On free:
      //   player.setVariable('F2_DILEMMA3_FREED', true);
      //   player.showText('You broadcast a fragment, releasing the stasis. The scholar blinks, the thread of their thought lost. The discovery may never be fully articulated, but their mind is free to wander anew.');
      // On leave:
      //   player.showText('The scholar remains lost in their moment of profound discovery, a perfect insight preserved. You leave them to their timeless contemplation.');
    },
  });

  // --- EV-F2-010: Forced: Preserver Captain [MQ-09] ---
  map.createDynamicEvent({
    x: 10,
    y: 12,
    name: 'EV-F2-010',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('F2_CAPTAIN_DEFEATED')) {
        player.showText(
          'The area is clear. The Preserver Captain has been defeated.',
        );
        return;
      }
      if (player.getVariable('MQ_09_STARTED')) {
        player.showText(
          'A Preserver Captain blocks your path! "None shall disturb the Curator\'s Grief!"',
        );
        // TODO: Implement Preserver Captain battle when battle system is ready
        // Level 26-28 Preserver Captain encounter
        // On victory: player.setVariable('F2_CAPTAIN_DEFEATED', true);
      }
    },
  });

  // --- EV-F2-011: Curator's Grief (MF-09) [MQ-09] ---
  map.createDynamicEvent({
    x: 10,
    y: 11,
    name: 'EV-F2-011',
    graphic: 'DUN-DE-08',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('F2_GRIEF_COLLECTED')) {
        player.showText(
          "The altar where the Curator's Grief once rested is now empty.",
        );
        return;
      }
      if (
        player.getVariable('MQ_09_STARTED') &&
        player.getVariable('F2_CAPTAIN_DEFEATED')
      ) {
        player.showText(
          "You stand before the Curator's Grief, a deep blue crystal pulsing with sorrow. It is a memory of profound loss.",
        );
        // TODO: Implement choice mechanic when showChoices is available
        // Options: Yes (collect), No (leave)
        // On collect:
        //   TODO: player.addItem('MF-09') when item system is ready
        //   player.setVariable('F2_GRIEF_COLLECTED', true);
        //   player.showText("You collected the Curator's Grief (MF-09).");
      }
    },
  });

  // --- EV-F2-016: Boss: Archive Keeper dialogue [MQ-09] ---
  map.createDynamicEvent({
    x: 15,
    y: 17,
    name: 'EV-F2-016',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('F2_ARCHIVE_KEEPER_DEFEATED')) {
        player.showText(
          'The archive is silent. The Archive Keeper has been defeated.',
        );
        return;
      }
      if (
        player.getVariable('MQ_09_STARTED') &&
        !player.getVariable('F2_ARCHIVE_KEEPER_DIALOGUE_DONE')
      ) {
        player.showText(
          'The Archive Keeper turns their gaze towards you, their voice echoing with the weight of countless memories.',
        );
        player.showText(
          "\"I've catalogued every memory worth preserving. Every smile, every triumph, every moment of grace. You want to... remix them? That's not creation. That's vandalism.\"",
        );
        player.setVariable('F2_ARCHIVE_KEEPER_DIALOGUE_DONE', true);
      } else if (
        player.getVariable('MQ_09_STARTED') &&
        player.getVariable('F2_ARCHIVE_KEEPER_DIALOGUE_DONE')
      ) {
        // EV-F2-017: Boss fight: Archive Keeper [MQ-09]
        player.showText(
          'The Archive Keeper prepares to fight!',
        );
        // TODO: Implement Archive Keeper boss battle when battle system is ready
        // HP=900, ATK=25, INT=42, DEF=35, AGI=18, Level 26-28
        // On victory:
        //   player.setVariable('F2_ARCHIVE_KEEPER_DEFEATED', true);
        //   player.showText('The Archive Keeper dissolves into a cascade of shimmering fragments. The archive is silent once more.');
        //   player.showText('A wave of residual energy washes over you. You feel stronger, more resolute.');
        //   TODO: player.addItem('C-SP-09') — Dissolved Essence
        //   TODO: player.addItem('C-BF-05') — Memory Incense
        //   TODO: player.addGold(300)
        //   player.showText('You received Dissolved Essence, Memory Incense, and 300 gold.');
      }
    },
  });

  // --- EV-F2-019: Stairway -> F3 [MQ-09] ---
  map.createDynamicEvent({
    x: 15,
    y: 19,
    name: 'EV-F2-019',
    graphic: 'DUN-PA-04',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (
        player.getVariable('MQ_09_STARTED') &&
        player.getVariable('F2_ARCHIVE_KEEPER_DEFEATED')
      ) {
        player.showText(
          'You found the stairway leading deeper into the Fortress.',
        );
        player.changeMap('fortress-f3', { x: 10, y: 0 });
      } else if (player.getVariable('MQ_09_STARTED')) {
        player.showText(
          'The stairway is blocked by a powerful force. The Archive Keeper must be defeated first.',
        );
      } else {
        player.showText('A dark stairway leads downward, but the way is sealed.');
      }
    },
  });

  // --- Enemy Zones ---
  // TODO: Implement encounter zones when battle system is ready
  // Entry hall: bounds=1,1 -> 20,4, enemies=[E-PV-04,E-PV-03], levels=26-28, rate=15%
  // Gallery patrol: bounds=6,5 -> 20,9, enemies=[E-PV-04,E-PV-03], levels=26-28, rate=15%
  // Archive patrol: bounds=1,10 -> 20,14, enemies=[E-PV-04], levels=26-28, rate=15%
}
