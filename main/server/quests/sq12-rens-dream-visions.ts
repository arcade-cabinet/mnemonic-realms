import {
  HookClient,
  HookServer,
  type Quest,
  RpgCommonPlayer,
  type RpgEvent,
  RpgMap,
  type RpgPlayer,
  RpgSceneMap,
  RpgWorld,
} from '@rpgjs/server';

export interface RenDreamVisionQuestVariables extends RpgPlayer {
  _SQ12_STATE: number; // 0: Not started, 1: Started, 2: Spoke with Ren, 3: Resting, 4: Fragment materialized, 5: Broadcasted, 6: Completed
  _SQ12_REST_COUNT: number;
  _SQ12_HAS_FRAGMENT: boolean;
  _SQ12_HEARTH_REVEALED: boolean;
}

export default {
  id: 'SQ-12',
  name: "Ren's Dream Visions",
  category: 'side',
  act: 'act2',
  level: '16-22',

  // Quest Giver and Trigger
  onStart(player: RpgPlayer & RenDreamVisionQuestVariables) {
    // Check if MQ-05 is complete
    if (!player.getQuest('MQ-05')?.isCompleted()) {
      return false; // Quest MQ-05 must be completed
    }

    // Check if player has rested 3+ times at the inn (pre-quest trigger)
    // This variable would be tracked by a global hook on player.onRest
    const innRestCount = player.getVariable('INN_REST_COUNT') || 0;
    if (innRestCount < 3) {
      return false; // Needs 3+ rests to trigger Ren's initial comment
    }

    // Check player level
    const playerLevel = player.get('level');
    if (playerLevel < 16 || playerLevel > 22) {
      return false; // Player level not within range
    }

    // Check player location (Ren at Village Hub — Inn: The Bright Hearth (20, 14))
    // This check would typically be done by the event that triggers the quest
    // For a server-side quest definition, we assume the event handles the location.
    // If the quest is started via dialogue, the dialogue event would be at this location.

    player.setVariable('_SQ12_STATE', 1); // Quest started
    player.setVariable('_SQ12_REST_COUNT', innRestCount); // Initialize rest count from global
    player.setVariable('_SQ12_HAS_FRAGMENT', false);
    player.setVariable('_SQ12_HEARTH_REVEALED', false);
    player.addQuest(this.id);
    player.showNotification("New Quest: Ren's Dream Visions");
    return true;
  },

  // Objectives
  objectives: [
    {
      text: 'Speak with Ren at the Inn about the dream visions',
      condition: (player: RpgPlayer & RenDreamVisionQuestVariables) =>
        player.getVariable('_SQ12_STATE') >= 2,
    },
    {
      text: 'Rest at the inn 5 total times, watching a unique dissolved civilization dream each time',
      condition: (player: RpgPlayer & RenDreamVisionQuestVariables) =>
        player.getVariable('_SQ12_REST_COUNT') >= 5,
    },
    {
      text: "After the 5th dream, a dream fragment materializes in the player's inventory",
      condition: (player: RpgPlayer & RenDreamVisionQuestVariables) =>
        player.getVariable('_SQ12_HAS_FRAGMENT') === true,
    },
    {
      text: "Broadcast the dream fragment at the Inn's hearth Resonance Stone",
      condition: (player: RpgPlayer & RenDreamVisionQuestVariables) =>
        player.getVariable('_SQ12_STATE') >= 5,
    },
    {
      text: 'Witness the hearth stone activate — a permanent lore projection showing highlights of dissolved civilizations',
      condition: (player: RpgPlayer & RenDreamVisionQuestVariables) =>
        player.getVariable('_SQ12_STATE') >= 6,
    },
  ],

  // Dialogue for quest giver (Ren)
  dialogue: {
    // Initial dialogue to start the quest (after trigger conditions met)
    start: (player: RpgPlayer & RenDreamVisionQuestVariables) => {
      if (player.getVariable('_SQ12_STATE') === 1) {
        return [
          {
            text: "Ren: You've been sleeping restlessly lately, adventurer. I've noticed you tossing and turning, muttering about... strange visions. Dissolved cities, ancient hums... Is everything alright?",
            choices: [
              { text: 'Tell Ren about the dreams.', value: 'talk_dreams' },
              { text: 'Dismiss it as nothing.', value: 'dismiss' },
            ],
          },
        ];
      }
      return [];
    },
    talk_dreams: (player: RpgPlayer & RenDreamVisionQuestVariables) => {
      player.setVariable('_SQ12_STATE', 2); // Objective 1 complete
      player.updateQuest(this.id, {
        objective: 1,
        state: 'completed',
      });
      return [
        {
          text: "Player: I've been having these vivid dreams, Ren. Of places that feel ancient, yet utterly gone. They're... unsettling.",
        },
        {
          text: "Ren: Dreams, eh? My grandmother used to say dreams are echoes of the world's forgotten songs. Perhaps you're hearing one. Keep an eye on them, adventurer. Sometimes, dreams have a way of showing us what's truly hidden.",
        },
        {
          text: "Ren: And perhaps, try resting here a few more times. Maybe the inn's hearth has a way of... focusing such things.",
        },
      ];
    },
    dismiss: (player: RpgPlayer & RenDreamVisionQuestVariables) => {
      return [
        { text: 'Player: Just a few bad nights, Ren. Nothing to worry about.' },
        { text: 'Ren: If you say so. But if anything changes, you know where to find me.' },
      ];
    },
    // Dialogue after 5th dream, before fragment broadcast
    after_dreams: (player: RpgPlayer & RenDreamVisionQuestVariables) => {
      if (player.getVariable('_SQ12_STATE') === 3 && player.getVariable('_SQ12_REST_COUNT') >= 5) {
        player.setVariable('_SQ12_STATE', 4); // Fragment materialized
        player.setVariable('_SQ12_HAS_FRAGMENT', true);
        player.addItem('fragment_calm_neutral_4', 1); // Add the 4-star calm/neutral fragment
        player.updateQuest(this.id, {
          objective: 2,
          state: 'completed',
        });
        player.showNotification('A Dream Fragment materialized in your inventory!');
        player.setVariable('_SQ12_HEARTH_REVEALED', true); // Hearth Resonance Stone is now interactable
        return [
          {
            text: "Ren: You look... different. More focused. And what's that glowing in your hand? It wasn't there a moment ago.",
          },
          { text: "Player: It's... a fragment. From the dreams. It just appeared." },
          {
            text: "Ren: Remarkable! I always knew there was something special about this inn. About that old hearth, specifically. My grandmother used to say it hummed sometimes. Perhaps... it's a place of resonance. Try broadcasting that fragment there, adventurer. See what happens.",
          },
        ];
      }
      return [];
    },
    // Dialogue after fragment broadcast, before completion
    after_broadcast: (player: RpgPlayer & RenDreamVisionQuestVariables) => {
      if (player.getVariable('_SQ12_STATE') === 5) {
        player.setVariable('_SQ12_STATE', 6); // Objective 5 complete (quest ready for completion)
        player.updateQuest(this.id, {
          objective: 4,
          state: 'completed',
        });
        return [
          {
            text: "Ren: Incredible! The hearth... it's glowing! And those images... they're so clear, so ancient. It's like the inn itself is remembering.",
          },
          {
            text: "Ren: I always knew there was something behind that fireplace. When I was a child, I'd press my ear against the stones and hear... humming. I think it was waiting for the right dreams. Yours.",
          },
        ];
      }
      return [];
    },
    // Completion dialogue
    completion: (player: RpgPlayer & RenDreamVisionQuestVariables) => {
      return [
        {
          text: "Ren: I always knew there was something behind that fireplace. When I was a child, I'd press my ear against the stones and hear... humming. I think it was waiting for the right dreams. Yours.",
        },
      ];
    },
  },

  // Rewards
  onComplete(player: RpgPlayer & RenDreamVisionQuestVariables) {
    player.addGold(250);
    player.addItem('C-BF-05', 3); // Memory Incense x3
    player.addItem('fragment_calm_neutral_4', 1); // 4-star Calm/Neutral Fragment
    player.showNotification("Quest Completed: Ren's Dream Visions! Rewards received.");
    player.removeQuest(this.id); // Remove from active quest log
    player.setVariable('_SQ12_STATE', 7); // Mark quest as fully completed
  },

  // Hooks for quest progression
  hooks: [
    // Hook for player resting at the inn
    {
      name: HookClient.PlayerRest, // This hook would be triggered by the inn's bed interaction
      async method(player: RpgPlayer & RenDreamVisionQuestVariables) {
        if (
          player.getQuest(this.id)?.isStarted() &&
          player.getVariable('_SQ12_STATE') >= 2 &&
          player.getVariable('_SQ12_STATE') < 4
        ) {
          let restCount = player.getVariable('_SQ12_REST_COUNT') || 0;
          restCount++;
          player.setVariable('_SQ12_REST_COUNT', restCount);
          player.setVariable('INN_REST_COUNT', restCount); // Update global rest count

          // Simulate unique dream vision
          await player.showText(
            `You drift into a deep sleep, visions of a dissolved civilization swirling in your mind. (Rest ${restCount}/5)`,
          );

          if (restCount >= 5) {
            player.setVariable('_SQ12_STATE', 3); // Ready for fragment materialization
            player.updateQuest(this.id, {
              objective: 2,
              state: 'completed',
            });
            // Trigger Ren's dialogue about the fragment
            const renEvent = RpgWorld.get<RpgEvent>('Ren'); // Assuming Ren is an event on the map
            if (renEvent) {
              await renEvent.callMethod('triggerDialogue', player, 'after_dreams');
            }
          } else {
            player.updateQuest(this.id, {
              objective: 1, // Still on objective 1, but progress is tracked
              state: 'active',
              data: {
                currentRests: restCount,
                totalRests: 5,
              },
            });
          }
        }
      },
    },
    // Hook for player interacting with the Hearth Resonance Stone
    {
      name: HookClient.PlayerInteract, // This hook would be triggered by interacting with the Resonance Stone event
      async method(player: RpgPlayer & RenDreamVisionQuestVariables, event: RpgEvent) {
        if (event.name === 'InnHearthResonanceStone' && player.getQuest(this.id)?.isStarted()) {
          if (
            player.getVariable('_SQ12_HEARTH_REVEALED') === true &&
            player.getVariable('_SQ12_STATE') === 4
          ) {
            // Check if player has the fragment to broadcast
            if (player.hasItem('fragment_calm_neutral_4')) {
              await player.showText(
                'You place the Dream Fragment against the Hearth Resonance Stone. It hums with ancient energy, and images of dissolved civilizations bloom into a permanent projection above the fireplace.',
              );
              player.removeItem('fragment_calm_neutral_4', 1); // Consume the fragment
              player.setVariable('_SQ12_STATE', 5); // Fragment broadcasted
              player.updateQuest(this.id, {
                objective: 3,
                state: 'completed',
              });
              // Trigger Ren's dialogue about the broadcast
              const renEvent = RpgWorld.get<RpgEvent>('Ren');
              if (renEvent) {
                await renEvent.callMethod('triggerDialogue', player, 'after_broadcast');
              }
              // Complete the quest after the final dialogue
              player.getQuest(this.id)?.complete();
            } else {
              await player.showText(
                'The Hearth Resonance Stone hums faintly, but you need a Dream Fragment to activate it fully.',
              );
            }
          } else if (
            player.getVariable('_SQ12_HEARTH_REVEALED') === true &&
            player.getVariable('_SQ12_STATE') < 4
          ) {
            await player.showText(
              'The Hearth Resonance Stone is active, but nothing happens yet. Perhaps you need to experience more dreams first.',
            );
          } else {
            await player.showText(
              "You examine the old hearth. It looks like a normal fireplace, though there's a faint warmth emanating from behind the stones.",
            );
          }
        }
      },
    },
  ],
} as Quest;
