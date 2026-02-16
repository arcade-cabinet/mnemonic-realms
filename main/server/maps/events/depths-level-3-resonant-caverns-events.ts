import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- Sound Puzzle State ---
  // The correct sequence is C - E - G - A - B (from the wall inscription EV-D3-002)
  const correctSequence = ['C', 'E', 'G', 'A', 'B'];

  const handlePillarAction = (player: RpgPlayer, tone: string) => {
    const puzzleSolved = player.getVariable('D3_SOUND_PUZZLE_SOLVED');
    if (puzzleSolved) {
      player.showText(`The ${tone} pillar resonates harmonically. The path is already open.`);
      return;
    }

    // Get current sequence from variable (stored as comma-separated string)
    const currentStr = player.getVariable('D3_PUZZLE_SEQUENCE') || '';
    const currentSequence = currentStr ? currentStr.split(',') : [];
    currentSequence.push(tone);

    player.showText(`The ${tone} pillar rings out.`);

    if (currentSequence.length === correctSequence.length) {
      const isCorrect = currentSequence.every(
        (val: string, index: number) => val === correctSequence[index],
      );
      if (isCorrect) {
        player.showText(
          'A perfect harmonic chord rings through the hall! The barrier shimmers and dissolves.',
        );
        player.setVariable('D3_SOUND_PUZZLE_SOLVED', true);
        player.setVariable('D3_PUZZLE_SEQUENCE', '');
      } else {
        player.showText('A jarring dissonance! The pillars blast you with sound!');
        // TODO: Implement HP damage (40 HP) when stat manipulation API is verified
        player.setVariable('D3_PUZZLE_SEQUENCE', '');
        player.showText('The puzzle resets.');
      }
    } else if (
      currentSequence[currentSequence.length - 1] !== correctSequence[currentSequence.length - 1]
    ) {
      player.showText('A jarring dissonance! The pillars blast you with sound!');
      // TODO: Implement HP damage (40 HP) when stat manipulation API is verified
      player.setVariable('D3_PUZZLE_SEQUENCE', '');
      player.showText('The puzzle resets.');
    } else {
      player.setVariable('D3_PUZZLE_SEQUENCE', currentSequence.join(','));
    }
  };

  // --- EV-D3-001: Transition to Hollow Ridge ---
  map.createDynamicEvent({
    x: 10,
    y: 0,
    name: 'EV-D3-001',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('hollow-ridge', { x: 38, y: 3 });
    },
  });

  // --- EV-D3-002: Crystal wall inscription (musical notation clue) ---
  map.createDynamicEvent({
    x: 15,
    y: 2,
    name: 'EV-D3-002',
    graphic: 'DUN-DE-10',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'An inscription on the crystal wall glows faintly. It depicts a sequence of musical notes: C - E - G - A - B.',
      );
    },
  });

  // --- EV-D3-003: Resonance Stone: 1 fragment (awe/wind/3) ---
  map.createDynamicEvent({
    x: 2,
    y: 6,
    name: 'EV-D3-003',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('EV_D3_003_COLLECTED')) {
        player.showText(
          'A Resonance Stone hums with a feeling of awe, carried on a gentle wind. You absorb its energy.',
        );
        player.showText('Gained 1 Awe/Wind fragment (Potency 3).');
        player.setVariable('EV_D3_003_COLLECTED', true);
      } else {
        player.showText('The Resonance Stone is quiet now, its energy already absorbed.');
      }
    },
  });

  // --- EV-D3-004: Burdened RS: compost sorrow [GQ-02-S1] ---
  map.createDynamicEvent({
    x: 7,
    y: 6,
    name: 'EV-D3-004',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('GQ_02_S1_COMPOST_SORROW_DONE')) {
        player.showText('The Resonance Stone hums softly, now at peace.');
        return;
      }

      player.showText(
        'A burdened Resonance Stone. It resonates with deep sorrow, suppressed by crystalline growths. Perhaps a sorrow-type fragment could help it.',
      );
      // TODO: Implement fragment broadcast choice mechanic
      // On success with sorrow fragment:
      //   player.showText('You focus a sorrow-type fragment into the stone...');
      //   player.setVariable('GQ_02_S1_COMPOST_SORROW_DONE', true);
      //   Yields 2 random fragments
    },
  });

  // --- EV-D3-005: Sound puzzle pillar A ---
  map.createDynamicEvent({
    x: 12,
    y: 6,
    name: 'EV-D3-005',
    graphic: 'crystal-pillar',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      handlePillarAction(player, 'A');
    },
  });

  // --- EV-D3-006: Sound puzzle pillar C ---
  map.createDynamicEvent({
    x: 14,
    y: 5,
    name: 'EV-D3-006',
    graphic: 'crystal-pillar',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      handlePillarAction(player, 'C');
    },
  });

  // --- EV-D3-007: Sound puzzle pillar E ---
  map.createDynamicEvent({
    x: 16,
    y: 5,
    name: 'EV-D3-007',
    graphic: 'crystal-pillar',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      handlePillarAction(player, 'E');
    },
  });

  // --- EV-D3-008: Sound puzzle pillar G ---
  map.createDynamicEvent({
    x: 18,
    y: 6,
    name: 'EV-D3-008',
    graphic: 'crystal-pillar',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      handlePillarAction(player, 'G');
    },
  });

  // --- EV-D3-009: Sound puzzle pillar B ---
  map.createDynamicEvent({
    x: 19,
    y: 7,
    name: 'EV-D3-009',
    graphic: 'crystal-pillar',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      handlePillarAction(player, 'B');
    },
  });

  // --- EV-D3-010: Harmonic barrier (blocks passage until puzzle solved) ---
  if (!player.getVariable('D3_SOUND_PUZZLE_SOLVED')) {
    map.createDynamicEvent({
      x: 15,
      y: 8,
      name: 'EV-D3-010',
      hitbox: { width: 16, height: 16 },
      onAction(player: RpgPlayer) {
        if (player.getVariable('D3_SOUND_PUZZLE_SOLVED')) {
          player.showText('The harmonic barrier has dissolved. The path is clear.');
        } else {
          player.showText(
            'A shimmering harmonic barrier blocks the path. It seems to react to sound...',
          );
        }
      },
    });
  }

  // --- EV-D3-011: Memory lift -> Hollow Ridge ---
  map.createDynamicEvent({
    x: 3,
    y: 10,
    name: 'EV-D3-011',
    graphic: 'DUN-PA-06',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('D3_SOUND_PUZZLE_SOLVED')) {
        player.showText('The memory lift hums to life. Traveling to Hollow Ridge.');
        player.changeMap('hollow-ridge', { x: 38, y: 3 });
      } else {
        player.showText(
          'The memory lift is inert. It seems to require a specific harmonic frequency to activate.',
        );
      }
    },
  });

  // --- EV-D3-012: Resonance Stone: 1 fragment (fury/earth/3) ---
  map.createDynamicEvent({
    x: 10,
    y: 10,
    name: 'EV-D3-012',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('EV_D3_012_COLLECTED')) {
        player.showText(
          'A Resonance Stone vibrates with raw fury, rooted deep in the earth. You absorb its energy.',
        );
        player.showText('Gained 1 Fury/Earth fragment (Potency 3).');
        player.setVariable('EV_D3_012_COLLECTED', true);
      } else {
        player.showText('The Resonance Stone is quiet now, its energy already absorbed.');
      }
    },
  });

  // --- EV-D3-013: Treasure chest: Stasis Breaker x3, 80 gold ---
  map.createDynamicEvent({
    x: 17,
    y: 11,
    name: 'EV-D3-013',
    graphic: 'DUN-DE-02',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('EV_D3_013_OPENED')) {
        player.showText('You found a treasure chest!');
        // TODO: Implement item grant (Stasis Breaker x3, 80 Gold) when inventory API is verified
        player.showText('Gained Stasis Breaker x3, 80 Gold.');
        player.setVariable('EV_D3_013_OPENED', true);
      } else {
        player.showText('The chest is empty.');
      }
    },
  });

  // --- EV-D3-014: Crystal pool: lore vision ---
  map.createDynamicEvent({
    x: 4,
    y: 15,
    name: 'EV-D3-014',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('EV_D3_014_VISION_SEEN')) {
        player.showText('You touch the crystal-clear water. A vision floods your mind...');
        player.showText(
          'Images of an ancient civilization, carving these caverns with resonant tools, their lives intertwined with the living crystals. A sense of harmony, then a growing discord...',
        );
        player.showText('The vision fades, leaving a lingering echo of their history.');
        player.setVariable('EV_D3_014_VISION_SEEN', true);
      } else {
        player.showText('The crystal pool is calm, its memories already shared.');
      }
    },
  });

  // --- EV-D3-015: Treasure chest: Potion x3, Mana Draught x2 ---
  map.createDynamicEvent({
    x: 2,
    y: 14,
    name: 'EV-D3-015',
    graphic: 'DUN-DE-02',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('EV_D3_015_OPENED')) {
        player.showText('You found a treasure chest!');
        // TODO: Implement item grant (Potion x3, Mana Draught x2) when inventory API is verified
        player.showText('Gained Potion x3, Mana Draught x2.');
        player.setVariable('EV_D3_015_OPENED', true);
      } else {
        player.showText('The chest is empty.');
      }
    },
  });

  // --- EV-D3-016: Resonance Stone: 1 fragment (sorrow/earth/2) ---
  map.createDynamicEvent({
    x: 6,
    y: 16,
    name: 'EV-D3-016',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('EV_D3_016_COLLECTED')) {
        player.showText(
          'A Resonance Stone emanates a quiet sorrow, grounded deeply in the earth. You absorb its energy.',
        );
        player.showText('Gained 1 Sorrow/Earth fragment (Potency 2).');
        player.setVariable('EV_D3_016_COLLECTED', true);
      } else {
        player.showText('The Resonance Stone is quiet now, its energy already absorbed.');
      }
    },
  });

  // --- EV-D3-017: Bridge walking check ---
  map.createDynamicEvent({
    x: 10,
    y: 13,
    name: 'EV-D3-017',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'A crystal bridge stretches ahead. It vibrates dangerously — running here would be unwise.',
      );
      // TODO: Implement movement speed check / running penalty when movement API is verified
      // Running on bridge should deal 50 HP damage and knock back to (10, 13)
    },
  });

  // --- EV-D3-018: Boss: Resonant King dialogue ---
  map.createDynamicEvent({
    x: 10,
    y: 20,
    name: 'EV-D3-018',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('B_03B_DEFEATED')) {
        player.showText("The Resonant King's throne is silent, its power dissipated.");
        return;
      }

      if (!player.getVariable('D3_RESONANT_KING_DIALOGUE_DONE')) {
        player.showText(
          'As you approach, the entire cavern vibrates. Words form from harmonics, not voice: "Intruders... You disturb the ancient song. Your presence is a dissonance."',
        );
        player.showText(
          'The King rises from his crystalline throne, his form shifting with resonant energy. "Prepare to join the eternal chorus!"',
        );
        player.setVariable('D3_RESONANT_KING_DIALOGUE_DONE', true);
      } else {
        player.showText('The Resonant King stands ready for battle.');
      }

      // TODO: Implement battle with boss B-03b (level 17) when RPG-JS battle API is available
      // On victory:
      //   player.showText('The Resonant King shatters into a thousand crystalline fragments...');
      //   player.setVariable('B_03B_DEFEATED', true);
    },
  });

  // --- EV-D3-019: Boss fight trigger (same tile as dialogue) ---
  // Merged into EV-D3-018 above since both are at (10,20)

  // --- EV-D3-020: Stairway -> Depths L4 ---
  map.createDynamicEvent({
    x: 10,
    y: 24,
    name: 'EV-D3-020',
    graphic: 'DUN-PA-04',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('B_03B_DEFEATED')) {
        player.showText('You descend the crystalline stairway into the depths below.');
        player.changeMap('depths-l4', { x: 10, y: 0 });
      } else {
        player.showText(
          'The path forward is blocked by the Resonant King. You must defeat him first.',
        );
      }
    },
  });

  // --- Enemy Zones ---

  // TODO: Echo Chamber zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (1,4) to (4,8), enemies: [E-DP-03], levels 16-17

  // TODO: Puzzle hall zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (11,4) to (20,8), enemies: [E-DP-03], levels 16-17

  // TODO: Nexus zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (1,9) to (20,12), enemies: [E-DP-03, E-DP-02], levels 16-17

  // TODO: Bridge approach zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (10,13) to (14,15), enemies: [E-DP-03], levels 16-18
}
