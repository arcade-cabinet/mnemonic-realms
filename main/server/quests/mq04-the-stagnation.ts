import {
  type RpgEvent,
  type RpgMap,
  type RpgPlayer,
  RpgSceneMap,
  RpgServer,
  RpgWorld,
} from '@rpgjs/server';

export default {
  id: 'MQ-04',
  name: 'The Stagnation',
  category: 'main',
  act: 'act1',
  level: '6-10',
  dependencies: ['MQ-03'],
  rewards: [
    { item: 'MF-04', quantity: 1 }, // Lira's Scream
    { item: 'MF-03', quantity: 1 }, // Echo of the Stagnation
    { gold: 150 },
  ],
  completionDialogue: async (player: RpgPlayer) => {
    await player.showText(
      "Callum: Lira... No. She can't — she was just... Listen to me. The Frontier. The answers are in the Frontier. Those Preservers — they think freezing the world is kindness. I'm opening the mountain pass. Go north. Find the old shrine sites. And find a way to undo what they've done to Lira.",
    );
  },
  onStart: async (player: RpgPlayer) => {
    player.setVariable('MQ-04_OBJ_0', 0); // Objective 0: Travel to Stagnation Clearing
    player.setVariable('MQ-04_OBJ_1', 0); // Objective 1: Witness Lira investigating
    player.setVariable('MQ-04_OBJ_2', 0); // Objective 2: Survive Preserver patrol combat
    player.setVariable('MQ-04_OBJ_3', 0); // Objective 3: Watch Lira's freezing cutscene
    player.setVariable('MQ-04_OBJ_4', 0); // Objective 4: Collect Lira's Scream (MF-04)
    player.setVariable('MQ-04_OBJ_5', 0); // Objective 5: Broadcast potency 2+ fragment
    player.setVariable('MQ-04_OBJ_6', 0); // Objective 6: Return to Callum
    player.addQuest('MQ-04');
    player.updateQuest('MQ-04', 'started');
    player.showNotification('Quest Started: The Stagnation');
  },
  onComplete: async (player: RpgPlayer) => {
    player.removeQuest('MQ-04');
    player.addGold(150);
    await player.addItem('MF-04', 1);
    await player.addItem('MF-03', 1);
    player.setVariable('MQ-05_UNLOCKED', 1); // Unlock MQ-05
    player.setVariable('SQ-05_UNLOCKED', 1); // Unlock SQ-05
    player.setVariable('MOUNTAIN_PASS_OPEN', 1); // Open mountain pass
    player.showNotification('Quest Completed: The Stagnation');
  },
  onUpdate: async (player: RpgPlayer, objId: string) => {
    // This quest is heavily scripted, so onUpdate will primarily react to variable changes
    // and trigger events.
    switch (objId) {
      case 'MQ-04_OBJ_0': // Travel to Stagnation Clearing
        if (player.getVariable('MQ-04_OBJ_0') === 1) {
          player.updateQuest(
            'MQ-04',
            'Travel to the Stagnation Clearing in Heartfield (35, 30)',
            true,
          );
          // Trigger Lira's investigation cutscene
          await RpgWorld.get<RpgMap>('Heartfield')?.spawnEvent(LiraInvestigatingEvent, {
            x: 35,
            y: 30,
          });
        }
        break;
      case 'MQ-04_OBJ_1': // Witness Lira investigating
        if (player.getVariable('MQ-04_OBJ_1') === 1) {
          player.updateQuest(
            'MQ-04',
            'Witness Lira investigating the expanding stagnation zone',
            true,
          );
          // Trigger Preserver patrol combat
          await RpgWorld.get<RpgMap>('Heartfield')?.spawnEvent(PreserverPatrolEvent, {
            x: 36,
            y: 30,
          });
        }
        break;
      case 'MQ-04_OBJ_2': // Survive Preserver patrol combat
        if (player.getVariable('MQ-04_OBJ_2') === 1) {
          player.updateQuest(
            'MQ-04',
            'Encounter the Preserver patrol — survive the combat encounter',
            true,
          );
          // Trigger Lira's freezing cutscene
          await RpgWorld.get<RpgMap>('Heartfield')?.spawnEvent(LiraFreezingEvent, { x: 35, y: 30 });
        }
        break;
      case 'MQ-04_OBJ_3': // Watch Lira's freezing cutscene
        if (player.getVariable('MQ-04_OBJ_3') === 1) {
          player.updateQuest(
            'MQ-04',
            "Watch the climax cutscene: Lira is caught at the stagnation zone's edge and frozen mid-sentence",
            true,
          );
          // Spawn Lira's Scream fragment
          await RpgWorld.get<RpgMap>('Heartfield')?.spawnEvent(LiraScreamFragmentEvent, {
            x: 35,
            y: 30,
          });
        }
        break;
      case 'MQ-04_OBJ_4': // Collect Lira's Scream (MF-04)
        if (player.getVariable('MQ-04_OBJ_4') === 1) {
          player.updateQuest(
            'MQ-04',
            "Collect Lira's Scream (MF-04) from the ground where she was frozen",
            true,
          );
          // Player now needs to broadcast. This is typically handled by a Resonance Stone interaction.
          // We'll assume a specific Resonance Stone in Stagnation Clearing is now active for this.
        }
        break;
      case 'MQ-04_OBJ_5': // Broadcast potency 2+ fragment
        if (player.getVariable('MQ-04_OBJ_5') === 1) {
          player.updateQuest(
            'MQ-04',
            "Broadcast a potency 2+ fragment into the Stagnation Clearing's edge to halt the expansion",
            true,
          );
          // Set objective to return to Callum
          player.setVariable('MQ-04_OBJ_6', 1);
        }
        break;
      case 'MQ-04_OBJ_6': // Return to Callum
        if (player.getVariable('MQ-04_OBJ_6') === 1) {
          player.updateQuest('MQ-04', 'Return to Callum at the Village Hub', true);
          // Quest completion will be triggered by talking to Callum
        }
        break;
    }
  },
};

// Helper Events (simplified for quest logic, actual implementation would be more complex)

// Lira Investigating Event
const LiraInvestigatingEvent: RpgEvent = {
  name: 'LiraInvestigating',
  onInit(event) {
    event.setGraphic('lira_sprite'); // Placeholder graphic
    event.setHitbox(32, 32);
  },
  async onAction(player: RpgPlayer) {
    if (player.getVariable('MQ-04_OBJ_0') === 1 && player.getVariable('MQ-04_OBJ_1') === 0) {
      await player.showText(
        'Lira is here, examining the edge of the Stagnation. She seems troubled.',
      );
      await player.showText(
        "Lira: The expansion... it's accelerating. I can feel the memories dissolving.",
      );
      player.setVariable('MQ-04_OBJ_1', 1); // Objective 1 complete
      player.removeEvent(this.event.id); // Remove Lira after cutscene
    }
  },
};

// Preserver Patrol Combat Event
const PreserverPatrolEvent: RpgEvent = {
  name: 'PreserverPatrol',
  onInit(event) {
    event.setGraphic('preserver_scout_sprite'); // Placeholder graphic
    event.setHitbox(32, 32);
  },
  async onAction(player: RpgPlayer) {
    if (player.getVariable('MQ-04_OBJ_1') === 1 && player.getVariable('MQ-04_OBJ_2') === 0) {
      await player.showText('Suddenly, two Preserver Scouts emerge from the Stagnation!');
      // Simplified combat: auto-resolve for quest progression
      await player.showText('A fierce battle ensues! You fight valiantly against the Preservers.');
      // In a real game, this would trigger a combat scene.
      // For quest purposes, we assume player "survives" as per failure conditions.
      await player.showText('The Preservers are defeated, but the Stagnation pulses ominously.');
      player.setVariable('MQ-04_OBJ_2', 1); // Objective 2 complete
      player.removeEvent(this.event.id);
    }
  },
};

// Lira Freezing Cutscene Event
const LiraFreezingEvent: RpgEvent = {
  name: 'LiraFreezing',
  onInit(event) {
    event.setGraphic('lira_sprite'); // Placeholder graphic
    event.setHitbox(32, 32);
  },
  async onAction(player: RpgPlayer) {
    if (player.getVariable('MQ-04_OBJ_2') === 1 && player.getVariable('MQ-04_OBJ_3') === 0) {
      await player.showText(
        'Lira rushes towards the Stagnation, trying to understand its rapid growth.',
      );
      await player.showText("Lira: No... it's too fast! I can't—");
      await player.showText(
        'A wave of freezing energy erupts from the Stagnation, engulfing Lira mid-sentence. She is encased in a crystalline prison.',
      );
      player.setGraphic('lira_frozen_sprite'); // Change Lira's graphic to frozen
      player.setVariable('MQ-04_OBJ_3', 1); // Objective 3 complete
      // Don't remove Lira, she stays frozen.
    }
  },
};

// Lira's Scream Fragment Event
const LiraScreamFragmentEvent: RpgEvent = {
  name: 'LiraScreamFragment',
  onInit(event) {
    event.setGraphic('fragment_mf04_sprite'); // Placeholder graphic
    event.setHitbox(32, 32);
  },
  async onAction(player: RpgPlayer) {
    if (player.getVariable('MQ-04_OBJ_3') === 1 && player.getVariable('MQ-04_OBJ_4') === 0) {
      await player.showText(
        'You find a potent memory fragment shimmering on the ground where Lira was frozen. It pulses with raw fury and light.',
      );
      await player.addItem('MF-04', 1);
      player.showNotification("Item Acquired: Lira's Scream (MF-04)");
      player.setVariable('MQ-04_OBJ_4', 1); // Objective 4 complete
      player.removeEvent(this.event.id);
    }
  },
};

// Trigger for MQ-04 start (player enters Heartfield after MQ-03)
RpgServer.on('player.onMapChanged', async (player: RpgPlayer, map: RpgMap) => {
  if (
    map.id === 'Heartfield' &&
    player.getQuest('MQ-03')?.state === 'completed' &&
    player.getQuest('MQ-04')?.state === 'not-started'
  ) {
    if (player.getVariable('MQ-04_TRIGGERED') !== 1) {
      player.setVariable('MQ-04_TRIGGERED', 1);
      await player.startQuest('MQ-04');
      player.setVariable('MQ-04_OBJ_0', 1); // Objective 0 complete immediately on trigger
    }
  }
});

// Trigger for Objective 0 completion (player reaches Stagnation Clearing)
RpgServer.on('player.onMove', async (player: RpgPlayer, map: RpgMap) => {
  if (map.id === 'Heartfield' && player.getQuest('MQ-04')?.state === 'started') {
    const { x, y } = player.position;
    // Assuming Stagnation Clearing is a small area around (35, 30)
    if (x >= 33 && x <= 37 && y >= 28 && y <= 32) {
      if (player.getVariable('MQ-04_OBJ_0') === 0) {
        player.setVariable('MQ-04_OBJ_0', 1);
      }
    }
  }
});

// Trigger for Objective 5 completion (broadcasting a fragment)
// This would typically be handled by a custom Resonance Stone interaction or a global broadcast system.
// For this example, we'll simulate it with a specific event.
const StagnationResonanceStoneEvent: RpgEvent = {
  name: 'StagnationResonanceStone',
  onInit(event) {
    event.setGraphic('resonance_stone_sprite'); // Placeholder graphic
    event.setHitbox(32, 32);
  },
  async onAction(player: RpgPlayer) {
    if (player.getVariable('MQ-04_OBJ_4') === 1 && player.getVariable('MQ-04_OBJ_5') === 0) {
      await player.showText(
        "This Resonance Stone hums with the Stagnation's chaotic energy. A broadcast here might stabilize it.",
      );
      // In a real game, this would open a UI for fragment selection and broadcasting.
      // For simplicity, we'll assume the player has a suitable fragment and chooses to broadcast.
      const hasSuitableFragment = player.hasItem('MF-04') || player.hasItem('MF-03'); // Or any other potency 2+ fragment
      if (hasSuitableFragment) {
        await player.showText(
          'You focus your will and broadcast a potent memory fragment into the Stagnation. The freezing expansion visibly recedes!',
        );
        // Consume a fragment, e.g., MF-04 if they used it
        if (player.hasItem('MF-04')) {
          await player.removeItem('MF-04', 1);
        } else if (player.hasItem('MF-03')) {
          await player.removeItem('MF-03', 1);
        }
        player.setVariable('MQ-04_OBJ_5', 1); // Objective 5 complete
        player.showNotification("The Stagnation's expansion has been halted!");
      } else {
        await player.showText(
          'You need a fragment with a potency of 2 or higher to affect the Stagnation.',
        );
      }
    } else if (player.getVariable('MQ-04_OBJ_5') === 1) {
      await player.showText(
        'The Resonance Stone is now stable. The Stagnation is contained for now.',
      );
    }
  },
};

// Spawn the Resonance Stone in Heartfield
RpgServer.on('map.onLoad', (map: RpgMap) => {
  if (map.id === 'Heartfield') {
    map.spawnEvent(StagnationResonanceStoneEvent, { x: 34, y: 30 });
  }
});

// Trigger for Objective 6 completion (return to Callum)
const CallumEvent: RpgEvent = {
  name: 'Callum',
  onInit(event) {
    event.setGraphic('callum_sprite'); // Placeholder graphic
    event.setHitbox(32, 32);
  },
  async onAction(player: RpgPlayer) {
    if (player.getQuest('MQ-04')?.state === 'started' && player.getVariable('MQ-04_OBJ_6') === 1) {
      await player.completeQuest('MQ-04');
    } else {
      await player.showText('Callum: Hello, Architect. What brings you back to the Village Hub?');
    }
  },
};

// Spawn Callum in Village Hub
RpgServer.on('map.onLoad', (map: RpgMap) => {
  if (map.id === 'VillageHub') {
    map.spawnEvent(CallumEvent, { x: 10, y: 10 }); // Example coordinates for Callum
  }
});
