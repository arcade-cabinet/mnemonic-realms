import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // Map-scoped variable helpers
  const getVar = (key: string) => player.getVariable(`D2_${key}`);
  const setVar = (key: string, value: unknown) => player.setVariable(`D2_${key}`, value);

  // Initialize valve puzzle state if not set
  if (getVar('VALVE_STATE') === undefined) {
    setVar('VALVE_STATE', 0);
  }

  // --- EV-D2-001: Entry from Shimmer Marsh ---
  map.createDynamicEvent({
    x: 10,
    y: 0,
    name: 'EV-D2-001',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'You stand at the entrance to the Drowned Archive. The path back to Shimmer Marsh is behind you.',
      );
    },
  });

  // --- EV-D2-005: Burdened Resonance Stone [GQ-02-S1] ---
  map.createDynamicEvent({
    x: 15,
    y: 7,
    name: 'EV-D2-005',
    graphic: 'DUN-DE-06',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('GQ_02_S1_STARTED')) {
        if (!getVar('RS_005_COMPOSTED')) {
          player.showText(
            'The massive Resonance Stone hums with a dense, sorrowful energy. It feels overloaded.',
          );
          player.showText(
            'You focus your will, broadcasting a sorrow-type fragment to "compost" the dense memories.',
          );
          // TODO: Implement fragment grant (sorrow x2 potency 3, random x2 potency 3) when inventory API is verified
          setVar('RS_005_COMPOSTED', true);
          player.showText(
            'The stone shimmers, releasing its burden. It now feels calm and restorative.',
          );
          // TODO: Implement HP/SP full restore when stat API is verified
          player.showText('Your HP and SP have been fully restored!');
        } else {
          player.showText('The Resonance Stone is calm. It offers a moment of peace.');
          // TODO: Implement HP/SP full restore when stat API is verified
          player.showText('Your HP and SP have been fully restored!');
        }
      } else {
        player.showText(
          'A massive Resonance Stone, glowing with a sickly amber light. It feels heavy with unseen memories.',
        );
      }
    },
  });

  // --- Valve Puzzle Events ---

  // Valve puzzle: correct order is Left (0->1), Right (1->2), Center (2->3 = solved)
  const handleValveAction = (
    player: RpgPlayer,
    valveId: string,
    expectedState: number,
    nextState: number,
    isCenterValve: boolean = false,
  ) => {
    const waterPuzzleSolved = getVar('WATER_PUZZLE_SOLVED');
    if (waterPuzzleSolved) {
      player.showText('The valves are already set. The path ahead is clear.');
      return;
    }

    const valveState = getVar('VALVE_STATE') || 0;
    if (valveState === expectedState) {
      setVar('VALVE_STATE', nextState);
      player.showText(`You turn the ${valveId} valve. A faint click echoes.`);
      if (isCenterValve && nextState === 3) {
        setVar('WATER_PUZZLE_SOLVED', true);
        player.showText(
          'With a final grind, the water level in the boss arena begins to recede! The southern door unseals.',
        );
        setVar('MEMORY_LIFT_ACTIVATED', true);
      }
    } else {
      player.showText(
        'You turn the valve, but the mechanism grinds loudly. The room suddenly floods!',
      );
      setVar('VALVE_STATE', 0);
      // TODO: Implement 30 HP damage to party when stat manipulation API is verified
      player.showText('You take 30 damage from the sudden deluge! The puzzle resets.');
    }
  };

  // EV-D2-009: Left Valve
  map.createDynamicEvent({
    x: 3,
    y: 15,
    name: 'EV-D2-009',
    graphic: 'DUN-DE-08',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      handleValveAction(player, 'left', 0, 1);
    },
  });

  // EV-D2-010: Right Valve
  map.createDynamicEvent({
    x: 7,
    y: 15,
    name: 'EV-D2-010',
    graphic: 'DUN-DE-08',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      handleValveAction(player, 'right', 1, 2);
    },
  });

  // EV-D2-011: Center Valve
  map.createDynamicEvent({
    x: 5,
    y: 15,
    name: 'EV-D2-011',
    graphic: 'DUN-DE-08',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      handleValveAction(player, 'center', 2, 3, true);
    },
  });

  // --- EV-D2-013: Memory lift -> Shimmer Marsh ---
  map.createDynamicEvent({
    x: 15,
    y: 16,
    name: 'EV-D2-013',
    graphic: 'DUN-PA-06',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (getVar('WATER_PUZZLE_SOLVED')) {
        player.showText(
          'You activate the Memory Lift. It shimmers with a soft light, ready to ascend.',
        );
        player.changeMap('shimmer-marsh', { x: 33, y: 43 });
      } else {
        player.showText(
          'The Memory Lift is inactive. Perhaps a mechanism nearby controls its power.',
        );
      }
    },
  });

  // --- EV-D2-015: Boss: The Archivist dialogue ---
  map.createDynamicEvent({
    x: 10,
    y: 21,
    name: 'EV-D2-015',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (getVar('ARCHIVIST_DEFEATED')) {
        player.showText('The Archivist is gone. Only the echoes of knowledge remain.');
        return;
      }

      if (!getVar('ARCHIVIST_DIALOGUE_DONE')) {
        setVar('ARCHIVIST_DIALOGUE_DONE', true);
        player.showText(
          'As you approach the central lectern, a figure looks up from a dissolving book.',
        );
        player.showText(
          'The Archivist: "Another reader? The archive is closing. But I suppose... one more consultation."',
        );
        player.showText('The Archivist prepares for battle!');
      } else {
        player.showText('The Archivist stands ready.');
      }

      // TODO: Implement battle with boss B-03a (level 15) when RPG-JS battle API is available
      // On victory:
      //   player.showText('The Archivist dissolves into luminous ink. The archive is silent once more.');
      //   setVar('ARCHIVIST_DEFEATED', true);
      //   Apply buff: Archivist's Insight (+10% INT for remainder of floor)
    },
  });

  // --- EV-D2-016: Boss fight trigger (same tile as dialogue) ---
  // Merged into EV-D2-015 above since both are at (10,21)

  // --- EV-D2-018: Stairway -> Depths L3 ---
  map.createDynamicEvent({
    x: 10,
    y: 24,
    name: 'EV-D2-018',
    graphic: 'DUN-PA-04',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (getVar('ARCHIVIST_DEFEATED')) {
        player.showText('You descend the ancient stairway into the deeper levels of the archive.');
        player.changeMap('depths-l3', { x: 10, y: 0 });
      } else {
        player.showText(
          'The path ahead is blocked by a shimmering barrier. You sense a powerful presence nearby.',
        );
      }
    },
  });

  // --- Enemy Zones ---

  // TODO: Reading Hall zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (1,5) to (9,9), enemies: [E-DP-02 Drowned Scholar], levels 14-15, 8% rate

  // TODO: Burdened Chamber zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (11,5) to (20,9), enemies: [E-DP-02, E-DP-01 Memory Shade], levels 14-15, 10% rate

  // TODO: Flood Corridor zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (1,10) to (20,13), enemies: [E-DP-02, E-DP-01], levels 14-16, 12% rate
}
