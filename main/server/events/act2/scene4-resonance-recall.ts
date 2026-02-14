import {
  EventData,
  MapData,
  RpgCommonPlayer,
  RpgEvent,
  type RpgMap,
  type RpgPlayer,
} from '@rpgjs/server';

// Dialogue bank reference: docs/story/dialogue-bank.md
// Quest state reference: docs/story/quest-chains.md

@EventData({
  name: 'act2-scene4-resonance-recall',
  hitbox: { width: 32, height: 32 },
  // This event is auto-triggered when conditions are met, so it doesn't need a graphic initially.
  // It will dynamically create NPCs.
  graphic: '',
})
export class ResonanceRecallEvent extends RpgEvent {
  onInit() {
    this.set({
      name: 'Resonance Recall Trigger',
      // This event is initially invisible and only becomes active when conditions are met.
      // The actual visual elements (pedestals, sound column) are part of the map or GUI.
      visible: false,
      // The event is a 'touch' trigger, but we're using onChanges for condition check
      // and then a player.callEvent() to trigger the main sequence.
      // This allows for more complex conditions than just stepping on a tile.
    });
  }

  async onChanges(player: RpgPlayer) {
    // Trigger condition: quest-state, map: resonance-fields, pos: 25,25, condition: harmonize-path-complete
    if (
      player.map.id === 'resonance-fields' &&
      player.position.x === 25 &&
      player.position.y === 25 &&
      player.getQuest('GQ-01')?.state === 'activate' &&
      player.getQuest('SQ-09')?.state === 'complete' &&
      !player.getVariable('resonance_recalled')
    ) {
      // Ensure it only triggers once per player

      // Mark the event as triggered to prevent re-entry issues
      player.setVariable('resonance_recalled', true);

      // Make the event visible if needed, or just proceed with the sequence
      this.set({ visible: true });

      // Ensure Callum is spawned and visible
      const callum = await player.map.createDynamicEvent({
        x: 23, // Position Callum near the amphitheater
        y: 26,
        event: 'npc_callum',
        name: 'Callum',
        graphic: 'npc_callum',
        direction: 2, // Facing up
        speed: 1,
        speedAnimation: 1,
        width: 1,
        height: 1,
        canMove: false,
        through: false,
        priority: 1,
        visible: true,
      });

      // Part A: The Amphitheater
      await player.showText(
        "The player enters the amphitheater — a natural bowl ringed by massive Resonance Stones, each 3 tiles tall. The stones hum in overlapping harmonics. At the bowl's center, a column of visible sound waves rises: concentric rings of shimmering air, pulsing like a heartbeat. The air itself vibrates. The player's screen subtly oscillates.",
        {
          wait: true,
          type: 'cutscene',
        },
      );

      await player.showText("I've read about this for decades. I never thought I'd see it.", {
        speaker: callum,
        wait: true,
      });
      await player.showText(
        "That column — those sound waves — that's Resonance. A dormant god of sound, created by the Choir of the First Dawn. They sang the world's ambient soundscape into existence. Every breeze, every birdsong, every rush of water — that was their work.",
        {
          speaker: callum,
          wait: true,
        },
      );
      await player.showText(
        "And then they dissolved. They chose to become the sound they loved. What remains is this — an unfinished prototype, humming a note that's been sustained for centuries.",
        {
          speaker: callum,
          wait: true,
        },
      );

      await player.showText(
        'The player approaches the column. At its base, four stone pedestals emerge from the amphitheater floor, each carved with a glyph:',
        {
          wait: true,
          type: 'cutscene',
        },
      );
      await player.showText(
        'Four pedestals surround the dormant god. Each bears an emotion glyph:\n- Sun glyph — Joy\n- Flame glyph — Fury\n- Raindrop glyph — Sorrow\n- Star glyph — Awe',
        {
          wait: true,
          type: 'system',
        },
      );

      // Part B: The Recall Vision
      await player.showText(
        'Before the player can place a fragment, the dormant god reacts to their presence. The sound waves intensify. The screen fades to a vision — sepia-toned, dreamlike:',
        {
          wait: true,
          type: 'cutscene',
        },
      );

      // Effect: cutscene-play: {"cutsceneId":"resonance-recall-vision"}
      await player.callEvent('cutscene-play', { cutsceneId: 'resonance-recall-vision' });

      await player.showText(
        'They chose that. They chose to become the song rather than let it fade.',
        {
          speaker: callum,
          wait: true,
        },
      );
      await player.showText(
        "Now it's your turn. That god — Resonance — is waiting for someone to finish what the Choir started. The emotion you choose will determine what Resonance becomes. Joy, fury, sorrow, or awe — each will create a different god with a different domain.",
        {
          speaker: callum,
          wait: true,
        },
      );
      await player.showText(
        "This is permanent. Once you recall Resonance, the god takes their final form. There's no going back. Choose the emotion that feels right to you.",
        {
          speaker: callum,
          wait: true,
        },
      );

      // Part C: The Emotion Choice
      // Effect: gui-show: {"guiId":"god-recall-pedestal","god":"resonance"}
      const choice = await player.gui('god-recall-pedestal').open({ god: 'resonance' });

      // Assuming the GUI returns the chosen emotion (e.g., 'joy', 'fury', 'sorrow', 'awe')
      const chosenEmotion = choice.res;

      // Part D: The Transformation (simplified for event file)
      await player.showText(
        `You place a memory fragment on the ${chosenEmotion} pedestal. The recall transformation begins...`,
        {
          wait: true,
          type: 'cutscene',
        },
      );

      // Placeholder for actual transformation visuals/logic
      await player.showText(
        'The placed fragment dissolves into the pedestal, releasing a wave of amber-gold energy. The energy spirals upward into the dormant sound column. The column contracts, intensifies, and detonates outward. The god takes form!',
        {
          wait: true,
          type: 'cutscene',
        },
      );

      // Example dialogue for a recalled god (Cantara for Joy)
      if (chosenEmotion === 'joy') {
        await player.showText(
          "I was a single note. Now I am a song. Thank you, Architect — you've given me a voice I never had.",
          {
            speaker: { name: 'Cantara', graphic: 'god_cantara' }, // Placeholder for god NPC
            wait: true,
          },
        );
        await player.showText(
          'The Choir sang the world into being, and then they became the song. But a song needs listeners, and singers, and dancers. I will be all of these.',
          {
            speaker: { name: 'Cantara', graphic: 'god_cantara' },
            wait: true,
          },
        );
        await player.showText(
          'The world is quieter than it should be. Those who would silence it — the Preservers — they mean well, but silence is not the same as peace. I will sing against the quiet. And wherever my song reaches, life will follow.',
          {
            speaker: { name: 'Cantara', graphic: 'god_cantara' },
            wait: true,
          },
        );
      } else {
        await player.showText(
          `The newly recalled god, born of ${chosenEmotion}, speaks words of their new domain.`,
          {
            wait: true,
            type: 'cutscene',
          },
        );
      }

      await player.showText(
        'The god rises and diffuses into the landscape — not departing, but becoming an ambient presence. The zone transforms according to the specific recall outcome.',
        {
          wait: true,
          type: 'cutscene',
        },
      );

      // Effect: vibrancy-change: {"zone":"resonance-fields","delta":15}
      // This would typically be handled by a global system or a specific map event.
      // For now, we'll simulate a system message.
      await player.showText('The Resonance Fields surge with new vibrancy! (+15 Vibrancy)', {
        wait: true,
        type: 'system',
      });

      // Part E: Subclass Branch (First Recall Only)
      if (!player.getVariable('subclass_unlocked')) {
        // Check if subclass is already unlocked
        await player.showText(
          'Your choice has awakened something within you. The emotion you channeled resonates with your own abilities.',
          {
            wait: true,
            type: 'system',
          },
        );

        if (chosenEmotion === 'joy' || chosenEmotion === 'awe') {
          await player.showText(
            'You feel warmth spreading through your techniques — a creative, supportive energy. Subclass unlocked: Luminary. Your abilities gain new creative and communal effects.',
            {
              wait: true,
              type: 'system',
            },
          );
          player.addState('subclass_luminary'); // Add a state or variable for subclass
        } else if (chosenEmotion === 'fury' || chosenEmotion === 'sorrow') {
          await player.showText(
            'You feel intensity sharpening your techniques — a transformative, personal power. Subclass unlocked: Crucible. Your abilities gain new intense and individual effects.',
            {
              wait: true,
              type: 'system',
            },
          );
          player.addState('subclass_crucible'); // Add a state or variable for subclass
        }
        player.setVariable('subclass_unlocked', true);
      }

      // Effect: system-message: {"text":"Resonance recalled! Subclass unlocked."}
      await player.showText('Resonance recalled! Subclass unlocked.', {
        wait: true,
        type: 'system',
      });

      // Quest Changes: GQ-01 → complete, MQ-06 → activate
      player.setQuest('GQ-01', 'complete');
      player.setQuest('MQ-06', 'activate');

      // Remove Callum after the event
      if (callum) {
        await player.map.removeDynamicEvent(callum.id);
      }

      // This event is now complete for this player.
      this.set({ visible: false }); // Hide the trigger event
    }
  }
}

export default function resonanceRecallSetup(map: RpgMap) {
  map.createEvent(ResonanceRecallEvent);
}
