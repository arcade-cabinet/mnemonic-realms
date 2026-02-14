import { Element, Emotion } from '@rpgjs/common';
import {
  HookClient,
  Quest,
  type RpgEvent,
  RpgMap,
  type RpgPlayer,
  RpgSceneMap,
  RpgServer,
} from '@rpgjs/server';

export const SQ13_CHOIR_INSTRUMENTS_QUEST_ID = 'SQ-13';

@Quest({
  id: SQ13_CHOIR_INSTRUMENTS_QUEST_ID,
  name: "The Dissolved Choir's Instruments",
  category: 'side',
  act: 'act2',
  level: '18-24',
  dependencies: ['SQ-09', 'GQ-01'], // SQ-09 complete, GQ-01 complete (any emotion)
  rewards: [
    { type: 'gold', value: 500 },
    { type: 'item', id: 'C-SP-08', quantity: 3 }, // Broadcast Amplifier x3
    { type: 'fragment', emotion: Emotion.AWE, element: Element.WIND, potency: 4 }, // Awe/Wind Fragment (4-star)
  ],
})
export default class TheDissolvedChoirInstrumentsQuest extends Quest<RpgPlayer> {
  onStart(player: RpgPlayer) {
    player.setVariable('SQ13_OBJ_RETURN_TO_CAMP', false);
    player.setVariable('SQ13_OBJ_LEARN_ABOUT_INSTRUMENTS', false);
    player.setVariable('SQ13_INSTRUMENTS_COLLECTED', 0);
    player.setVariable('SQ13_OBJ_AMPHITHEATER_DELIVERY', false);

    // Set up instrument locations. These could be dynamic or fixed.
    // For this quest, they are fixed Resonance Stones.
    player.setVariable('SQ13_INSTRUMENT_LOCATIONS', {
      'Heartfield Old Windmill': false,
      'Ambergrove Hearthstone Circle': false,
      'Millbrook Upstream Falls': false,
      'Sunridge Wind Shrine': false,
      'Village Hub Central Square Fountain': false,
    });
  }

  onAdd(player: RpgPlayer) {
    // Check initial trigger conditions
    const sq09Complete = player.getQuest('SQ-09')?.isCompleted();
    const gq01Complete = player.getQuest('GQ-01')?.isCompleted(); // Any emotion means just completion

    if (!sq09Complete || !gq01Complete) {
      player.showNotification('You are not ready for this quest yet.', 'error');
      return false; // Quest cannot be added if dependencies are not met
    }

    // Check player level
    const playerLevel = player.level;
    if (playerLevel < 18 || playerLevel > 24) {
      player.showNotification('You are not the right level for this quest.', 'error');
      return false;
    }

    // Check player location (Audiomancer at Resonance Fields — Listener's Camp (10, 35))
    // This check would typically be done by the NPC that gives the quest,
    // but for a server-side quest definition, we assume the NPC handles the initial trigger.
    // If the quest is added via a command or other means, this might need refinement.

    player.addQuest(this);
    player.setQuestTracking(this.id); // Start tracking this quest
    player.showNotification("New Quest: The Dissolved Choir's Instruments", 'success');
    return true;
  }

  onUpdate(player: RpgPlayer) {
    // Objective 0: Return to Listener's Camp after Resonance recall
    // This objective is implicitly completed by talking to the Audiomancer after GQ-01.
    // The Audiomancer NPC would set this variable.
    if (!player.getVariable('SQ13_OBJ_RETURN_TO_CAMP')) {
      this.setObjective(player, 0, {
        text: "Return to the Listener's Camp after Resonance's recall",
        is: false,
      });
    } else {
      this.setObjective(player, 0, {
        text: "Returned to the Listener's Camp after Resonance's recall",
        is: true,
      });
    }

    // Objective 1: Learn about awakened Choir Instruments
    // This objective is completed by the Audiomancer's dialogue.
    if (!player.getVariable('SQ13_OBJ_LEARN_ABOUT_INSTRUMENTS')) {
      this.setObjective(player, 1, {
        text: 'Learn about the awakened Choir Instruments from the Audiomancer',
        is: false,
      });
    } else {
      this.setObjective(player, 1, {
        text: 'Learned about the awakened Choir Instruments',
        is: true,
      });
    }

    // Objective 2: Find 5 Choir Instruments in Settled Lands Resonance Stones
    const instrumentsCollected = player.getVariable('SQ13_INSTRUMENTS_COLLECTED') || 0;
    this.setObjective(player, 2, {
      text: `Find ${instrumentsCollected}/5 Choir Instruments in Settled Lands Resonance Stones`,
      is: instrumentsCollected >= 5,
    });

    // Objective 3: Bring all 5 instruments to the Amphitheater (25, 25)
    if (!player.getVariable('SQ13_OBJ_AMPHITHEATER_DELIVERY')) {
      this.setObjective(player, 3, {
        text: 'Bring all 5 instruments to the Amphitheater (25, 25)',
        is: false,
      });
    } else {
      this.setObjective(player, 3, {
        text: 'Delivered all 5 instruments to the Amphitheater',
        is: true,
      });
    }

    // Check for quest completion
    if (
      player.getVariable('SQ13_OBJ_RETURN_TO_CAMP') &&
      player.getVariable('SQ13_OBJ_LEARN_ABOUT_INSTRUMENTS') &&
      instrumentsCollected >= 5 &&
      player.getVariable('SQ13_OBJ_AMPHITHEATER_DELIVERY')
    ) {
      this.onComplete(player);
    }
  }

  onComplete(player: RpgPlayer) {
    player.showNotification("Quest Completed: The Dissolved Choir's Instruments", 'success');
    player.addGold(500);
    player.addItem('C-SP-08', 3); // Broadcast Amplifier x3
    player.addFragment(Emotion.AWE, Element.WIND, 4); // Awe/Wind Fragment (4-star)

    player.showText(
      "Audiomancer: Five instruments. Five voices of the Choir, found after all this time. When you placed them in the Amphitheater, I heard it — just for a moment — the song they sang at the end. It wasn't sad. It was... proud. Like parents watching their child take a first step.",
      player.id,
    );

    player.setQuestCompleted(this.id);
    player.setQuestTracking(null); // Stop tracking this quest
  }

  // Helper function to be called by the Audiomancer NPC
  static async triggerQuestStart(player: RpgPlayer, audiomancer: RpgEvent) {
    const quest = RpgServer.getQuest(SQ13_CHOIR_INSTRUMENTS_QUEST_ID);
    if (!quest) {
      console.error(`Quest ${SQ13_CHOIR_INSTRUMENTS_QUEST_ID} not found.`);
      return;
    }

    if (player.hasQuest(quest.id)) {
      if (player.getQuest(quest.id)?.isCompleted()) {
        await player.showText(
          'Audiomancer: Thank you again for finding the instruments. The Amphitheater hums with their memory.',
          player.id,
        );
      } else {
        await player.showText(
          'Audiomancer: Have you found any of the Choir Instruments yet? Keep searching the Resonance Stones!',
          player.id,
        );
        player.setVariable('SQ13_OBJ_RETURN_TO_CAMP', true); // Ensure this is set
        player.setVariable('SQ13_OBJ_LEARN_ABOUT_INSTRUMENTS', true); // Ensure this is set
        quest.onUpdate(player);
      }
      return;
    }

    const canAdd = quest.onAdd(player);
    if (canAdd) {
      await player.showText(
        "Audiomancer: Welcome back, Architect. The Resonance recall... it was powerful. I've noticed something strange. The energy seems to have awakened dormant Choir Instruments within some of the older Resonance Stones in the Settled Lands. If you could find them, and bring them to the Amphitheater, perhaps we could hear their final song...",
        player.id,
      );
      player.setVariable('SQ13_OBJ_RETURN_TO_CAMP', true);
      player.setVariable('SQ13_OBJ_LEARN_ABOUT_INSTRUMENTS', true);
      quest.onStart(player);
      quest.onUpdate(player);
    }
  }

  // Helper function to be called when interacting with a Resonance Stone
  static async collectInstrument(player: RpgPlayer, locationName: string) {
    const quest = RpgServer.getQuest(SQ13_CHOIR_INSTRUMENTS_QUEST_ID);
    if (!quest || !player.hasQuest(quest.id) || player.getQuest(quest.id)?.isCompleted()) {
      return;
    }

    const instrumentLocations = player.getVariable('SQ13_INSTRUMENT_LOCATIONS');
    if (instrumentLocations && !instrumentLocations[locationName]) {
      instrumentLocations[locationName] = true;
      player.setVariable('SQ13_INSTRUMENT_LOCATIONS', instrumentLocations);
      const collectedCount = (player.getVariable('SQ13_INSTRUMENTS_COLLECTED') || 0) + 1;
      player.setVariable('SQ13_INSTRUMENTS_COLLECTED', collectedCount);
      await player.showNotification(
        `You found a Choir Instrument at ${locationName}! (${collectedCount}/5)`,
        'success',
      );
      quest.onUpdate(player);
    } else if (instrumentLocations && instrumentLocations[locationName]) {
      await player.showNotification(
        `You've already collected the instrument from ${locationName}.`,
        'info',
      );
    } else {
      await player.showNotification('This Resonance Stone seems inactive.', 'info');
    }
  }

  // Helper function to be called when interacting with the Amphitheater
  static async deliverInstruments(player: RpgPlayer, amphitheaterEvent: RpgEvent) {
    const quest = RpgServer.getQuest(SQ13_CHOIR_INSTRUMENTS_QUEST_ID);
    if (!quest || !player.hasQuest(quest.id) || player.getQuest(quest.id)?.isCompleted()) {
      return;
    }

    const instrumentsCollected = player.getVariable('SQ13_INSTRUMENTS_COLLECTED') || 0;

    if (instrumentsCollected >= 5) {
      if (!player.getVariable('SQ13_OBJ_AMPHITHEATER_DELIVERY')) {
        await player.showText(
          'You carefully place the five Choir Instruments around the Amphitheater. A faint, beautiful hum fills the air, growing stronger for a moment before fading.',
          player.id,
        );
        player.setVariable('SQ13_OBJ_AMPHITHEATER_DELIVERY', true);
        quest.onUpdate(player);
      } else {
        await player.showText(
          'The instruments are already placed. The Amphitheater feels... complete.',
          player.id,
        );
      }
    } else {
      await player.showText(
        `You need to find all 5 Choir Instruments before you can place them here. You currently have ${instrumentsCollected}/5.`,
        player.id,
      );
    }
  }
}
