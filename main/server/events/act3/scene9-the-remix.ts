import {
  EventData,
  RpgCommonEvent,
  RpgEvent,
  type RpgMap,
  type RpgPlayer,
  RpgSceneMap,
} from '@rpgjs/server';
import { addItem } from '../../systems/inventory';
import { advanceObjective } from '../../systems/quests';

@EventData({
  id: 'act3-scene9-the-remix',
  name: 'The Remix',
  hitbox: { width: 32, height: 32 },
  // This event is triggered by an action on the First Memory pedestal,
  // but its visibility and actual logic are gated by quest state.
  // The actual trigger will be on the First Memory object itself,
  // which will then call this event's logic.
})
export default class TheRemixEvent extends RpgEvent {
  onInit() {
    this.set({
      graphic: '',
      // The pedestal itself might be visible, but the interaction is conditional.
      // We'll manage visibility of NPCs dynamically.
      // The actual trigger will be an action on the pedestal.
    });
  }

  async onAction(player: RpgPlayer) {
    const map = player.map as RpgMap;

    // 1. Check trigger conditions
    const curatorDialogueComplete = player.getVariable('MQ_09_OBJ5_COMPLETE') === true; // Assuming MQ-09, objective 5 is the Curator dialogue
    const onCorrectMap = map.id === 'fortress-f3';

    if (!onCorrectMap || !curatorDialogueComplete) {
      // Player is not at the right place or hasn't completed prerequisite dialogue
      // This should ideally be handled by the event that triggers this one,
      // but as a safeguard, we can add a message.
      if (onCorrectMap) {
        await player.showText(
          'The First Memory hums, but something is not quite right. Perhaps the Curator has more to say.',
        );
      }
      return;
    }

    // Prevent re-triggering the main sequence if already completed
    if (player.getVariable('MQ_10_OBJ2_COMPLETE') === true) {
      await player.showText("The World's New Dawn pulses with infinite possibility.");
      return;
    }

    // 2. Spawns NPCs at appropriate positions using createDynamicEvent()
    // Hana: (12, 10), Artun: (8, 10), The Curator: (10, 15) - relative to pedestal (10,10)
    // Assuming the pedestal is at (10,10) on fortress-f3
    const hana = await map.createDynamicEvent({
      x: 12,
      y: 10,
      event: class HanaRemix extends RpgEvent {
        onInit() {
          this.setGraphic('npc_hana');
          this.setDirection(0);
        }
      },
    });
    const artun = await map.createDynamicEvent({
      x: 8,
      y: 10,
      event: class ArtunRemix extends RpgEvent {
        onInit() {
          this.setGraphic('npc_artun');
          this.setDirection(0);
        }
      },
    });
    const curator = await map.createDynamicEvent({
      x: 10,
      y: 15,
      event: class CuratorRemix extends RpgEvent {
        onInit() {
          this.setGraphic('npc_grym');
          this.setDirection(2);
        } // Facing player
      },
    });

    // Ensure NPCs are visible
    hana.show();
    artun.show();
    curator.show();

    // 3. Plays dialogue sequences via player.showText()
    await player.showText('This is it. The first question. "Why do things change?"', {
      speaker: 'Hana',
    });
    await player.showText(
      "The Dissolved answered it by becoming the world. The Curator wants to answer it by stopping the world. But there's a third option.",
      { speaker: 'Artun' },
    );
    await player.showText('You can answer it with a new question.', { speaker: 'Artun' });
    await player.showText('What do you mean?', { speaker: 'Hana' });
    await player.showText(
      '"Why do things change?" That question created the world. But the world has grown beyond that question — it\'s bigger now, richer, more complex. It doesn\'t need the old question anymore. It needs a new one.',
      { speaker: 'Artun' },
    );
    await player.showText(
      'One that includes everything this Architect has experienced. Every god recalled, every fragment collected, every moment preserved or freed.',
      { speaker: 'Artun' },
    );

    await player.showText(
      "The First Memory awaits. You carry within you the memories of your journey: fragments collected, gods recalled, moments preserved and freed, the dissolved civilizations' stories, and the world's ongoing growth.\n\nPlace your hand on the First Memory to remix it.",
      { speaker: 'SYSTEM' },
    );

    // 4. Fires effects (GUI, item, screen effect)
    await player.gui('first-memory-remix').open();

    // Wait for player interaction with the GUI (simulated here, actual GUI would handle this)
    // For this example, we'll assume the GUI interaction completes and triggers the next step.
    // In a real scenario, the GUI would send a server event back to confirm remix completion.
    await player.showText(
      "This is not a standard remix. You are not combining fragments. You are answering a question.\n\nThe First Memory asks: \"Why do things change?\"\n\nYour answer is everything you've done. The remix will combine:\n- Your recalled gods (4 domains, 4 emotions)\n- Your journey's fragments (every emotion you've carried)\n- Your choices (what you preserved, what you freed)\n\nThere is no wrong answer. There is only YOUR answer.\n\n[Remix the First Memory]",
      { speaker: 'SYSTEM - FIRST MEMORY REMIX' },
    );

    // Simulate player activating the remix
    await player.showText(
      "The First Memory sphere absorbs the player's touch. Amber light intensifies. The sphere cracks — not breaking, but opening, like a seed splitting to sprout. From within, a new light emerges: not amber but prismatic, containing every color the player has brought to the world.",
      { speaker: 'NARRATION' },
    );

    await player.screenEffect('white-out', 2000); // White-out for 2 seconds
    await player.wait(2000); // Wait for the effect to finish

    await player.showText(
      "The new memory forms: MF-11: World's New Dawn. It is not a sphere but a branching, growing shape — like a tree, like a river delta, like a network of roots. It is alive. It is asking a new question.",
      { speaker: 'NARRATION' },
    );
    await player.showText(
      "The new question is never stated aloud. It doesn't need to be. It is felt rather than heard — a sense of possibility, of forward motion, of growth without end.",
      { speaker: 'NARRATION' },
    );

    await player.gui('first-memory-remix').close(); // Close the GUI after remix

    // Give the item
    addItem(player, 'MF-11', 1);
    await player.showText("You received MF-11: World's New Dawn!", { speaker: 'SYSTEM' });

    // Final dialogue
    await player.showText("You didn't destroy it. You... grew it.", { speaker: 'The Curator' });
    await player.showText(
      'The question changed. It\'s not "Why do things change?" anymore. It\'s...',
      { speaker: 'Artun' },
    );
    await player.showText('"What will we create next?"', { speaker: 'Hana' });

    // 5. Updates quest state
    player.setVariable('MQ_10_OBJ2_COMPLETE', true);
    advanceObjective(player, 'MQ-10');

    // Clean up dynamic NPCs
    hana.remove();
    artun.remove();
    curator.remove();

    // Optionally, trigger the endgame cinematic or next scene transition
    // This would typically be another event or a direct scene change.
    // await player.changeMap('undrawn-peaks', { x: 19, y: 35 }); // Example: exit fortress
  }
}
