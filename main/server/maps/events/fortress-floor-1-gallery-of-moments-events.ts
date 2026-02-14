import type { RpgMap, RpgPlayer } from '@rpgjs/server';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // Helper to read/write map-scoped variables
  const getVar = (key: string) => player.getVariable('F1_' + key);
  const setVar = (key: string, value: unknown) => player.setVariable('F1_' + key, value);

  // EV-F1-001: Entry from Undrawn Peaks [MQ-09]
  map.createDynamicEvent({
    x: 10,
    y: 0,
    name: 'EV-F1-001',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('MQ_09_STARTED')) {
        player.setVariable('MQ_09_STARTED', true);
        player.showText(
          'You feel a strange pull, as if the very air is trying to freeze your progress. This must be the Preserver Fortress.',
        );
      }
    },
  });

  // EV-F1-004: RS behind crystal barrier
  map.createDynamicEvent({
    x: 2,
    y: 7,
    name: 'EV-F1-004',
    graphic: 'DUN-DE-06',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (getVar('CrystalBarrierBroken')) {
        player.showText(
          'The Resonance Stone hums freely now. It offers a faint sorrowful fragment.',
        );
        if (!getVar('RS_F1_004_COLLECTED')) {
          setVar('RS_F1_004_COLLECTED', true);
          player.showText('You absorb the sorrowful fragment from the freed Resonance Stone.');
        }
      } else {
        player.showText(
          "A Resonance Stone, humming with faint sorrowful energy. It's behind a shimmering crystal barrier. Perhaps broadcasting a fragment could shatter it?",
        );
        // TODO: Implement fragment broadcast mechanic to break the crystal barrier
        // On success: setVar('CrystalBarrierBroken', true)
      }
    },
  });

  // EV-F1-006: Forced encounter: 2 Agents
  map.createDynamicEvent({
    x: 7,
    y: 7,
    name: 'EV-F1-006',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!getVar('WeaponCacheCleared')) {
        player.showText('Two Preserver Agents ambush you!');
        // TODO: Implement battle with 2x E-PV-02 when RPG-JS battle API is available
        // On victory: setVar('WeaponCacheCleared', true)
        player.showText('The Preserver Agents are defeated.');
        setVar('WeaponCacheCleared', true);
      } else {
        player.showText('The weapon cache area is clear.');
      }
    },
  });

  // EV-F1-008: Joy receptacle [MQ-09]
  map.createDynamicEvent({
    x: 11,
    y: 7,
    name: 'EV-F1-008',
    graphic: 'DUN-DE-08',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (getVar('JoyReceptacleFilled')) {
        player.showText('The joy receptacle is already filled and glowing brightly.');
        return;
      }
      player.showText(
        'A crystal receptacle, marked with the glyph of joy. It awaits a matching resonance.',
      );
      // TODO: Implement fragment broadcast mechanic for joy emotion
      // On success: setVar('JoyReceptacleFilled', true) then check all 3 receptacles
    },
  });

  // EV-F1-009: Sorrow receptacle [MQ-09]
  map.createDynamicEvent({
    x: 15,
    y: 7,
    name: 'EV-F1-009',
    graphic: 'DUN-DE-08',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (getVar('SorrowReceptacleFilled')) {
        player.showText('The sorrow receptacle is already filled and glowing brightly.');
        return;
      }
      player.showText(
        'A crystal receptacle, marked with the glyph of sorrow. It awaits a matching resonance.',
      );
      // TODO: Implement fragment broadcast mechanic for sorrow emotion
      // On success: setVar('SorrowReceptacleFilled', true) then check all 3 receptacles
    },
  });

  // EV-F1-010: Fury receptacle [MQ-09]
  map.createDynamicEvent({
    x: 19,
    y: 7,
    name: 'EV-F1-010',
    graphic: 'DUN-DE-08',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (getVar('FuryReceptacleFilled')) {
        player.showText('The fury receptacle is already filled and glowing brightly.');
        return;
      }
      player.showText(
        'A crystal receptacle, marked with the glyph of fury. It awaits a matching resonance.',
      );
      // TODO: Implement fragment broadcast mechanic for fury emotion
      // On success: setVar('FuryReceptacleFilled', true) then check all 3 receptacles
      // When all 3 filled: player.showText('A deep hum resonates through the room as the inner door slides open!');
      //   setVar('InnerDoorOpen', true);
    },
  });

  // EV-F1-011: Inner door (blocks passage until all 3 receptacles filled)
  if (!getVar('InnerDoorOpen')) {
    map.createDynamicEvent({
      x: 15,
      y: 9,
      name: 'EV-F1-011',
      graphic: 'DUN-OB-05',
      hitbox: { width: 16, height: 16 },
      onAction(player: RpgPlayer) {
        if (
          getVar('JoyReceptacleFilled') &&
          getVar('SorrowReceptacleFilled') &&
          getVar('FuryReceptacleFilled')
        ) {
          player.showText(
            'A deep hum resonates through the room as the inner door slides open!',
          );
          setVar('InnerDoorOpen', true);
        } else {
          player.showText(
            'A heavy crystal door blocks your path. It seems to be sealed by the three receptacles in this room.',
          );
        }
      },
    });
  }

  // EV-F1-012: Memory lift -> Undrawn Peaks
  map.createDynamicEvent({
    x: 3,
    y: 11,
    name: 'EV-F1-012',
    graphic: 'DUN-PA-06',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'The Memory Lift hums to life. It can return you to the Undrawn Peaks.',
      );
      // TODO: Implement choice dialog when RPG-JS choice API is verified
      // For now, activate immediately
      player.changeMap('undrawn-peaks', { x: 19, y: 35 });
    },
  });

  // EV-F1-016: Boss: Curator's Right Hand dialogue [MQ-09]
  map.createDynamicEvent({
    x: 10,
    y: 16,
    name: 'EV-F1-016',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (getVar('RightHandDefeated')) {
        player.showText("The Curator's Right Hand lies defeated. The path forward is clear.");
        return;
      }

      if (!player.getVariable('MQ_09_STARTED')) {
        player.showText(
          'A formidable figure stands guard, blocking the path. You should probably deal with the receptacles first.',
        );
        return;
      }

      player.showText(
        'The Curator\'s Right Hand turns to face you. "The Curator weeps for every battle. So do I. But you must understand — every step you take forward is a moment that can never be perfect again."',
      );
      player.showText('Prepare for battle!');
      // TODO: Implement battle with boss B-04a when RPG-JS battle API is available
      // On victory:
      player.showText(
        "The Curator's Right Hand falls. A moment of silence hangs heavy in the air.",
      );
      player.showText(
        'The Right Hand removes their helmet, revealing a weary face. "It... it was never meant to be this way. The Curator... they just wanted to preserve... to prevent the pain..."',
      );
      setVar('RightHandDefeated', true);
      player.setVariable('MQ_09_STEP', 2);
    },
  });

  // EV-F1-019: Stairway -> F2 [MQ-09]
  map.createDynamicEvent({
    x: 10,
    y: 19,
    name: 'EV-F1-019',
    graphic: 'DUN-PA-04',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (getVar('RightHandDefeated')) {
        player.showText('You descend the stairway to the next floor.');
        player.changeMap('fortress-f2', { x: 10, y: 0 });
      } else {
        player.showText(
          'A stairway descends, but a powerful aura prevents you from passing. You must defeat the guardian first.',
        );
      }
    },
  });

  // --- Enemy Zones ---

  // TODO: Entry patrol zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (1,1) to (20,4), enemies: [E-PV-02, E-PV-04], levels 24-26, 5% per step

  // TODO: Puzzle room zone — implement random encounters when RPG-JS battle API is available
  // Bounds: (11,5) to (20,9), enemies: [E-PV-04], levels 24-26, 5% per step
}
