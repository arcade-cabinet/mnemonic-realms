import { EventData, Move, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';
import { addItem } from '../../systems/inventory';
import { advanceObjective } from '../../systems/quests';
// Note: quest step/objective is tracked via player variable QUEST_<id>_OBJ

@EventData({
  id: 'act1-scene11-clearing-grows',
  name: 'The Clearing Grows',
  // This event is triggered by quest state and player map change, not a direct hitbox.
  // It will be dynamically spawned or activated.
  // We'll use a dummy position for the base event, but actual NPC positions will be dynamic.
  hitbox: { width: 1, height: 1 },
  // This event is essentially an auto-trigger based on global state,
  // so it doesn't need to be visible or interactable in the traditional sense.
  // It will be activated by a global check or a specific map entry.
  // For now, setting it to a non-interactive type.
  // The actual trigger is handled by the map change and quest state.
  // We'll make it invisible by default and only activate its logic when conditions are met.
  graphic: 'invisible',
})
export class TheClearingGrowsEvent extends RpgEvent {
  onInit() {
    this.set({
      name: 'The Clearing Grows Trigger',
      // This event is a global trigger, not tied to a specific map tile initially.
      // It will be activated when the player enters Everwick and MQ-04 is advanced.
      // We'll make it invisible and non-interactive by default.
      visible: false,
      // This event will be dynamically managed, so no graphic needed.
      graphic: 'invisible',
    });
  }

  async onChanges(player: RpgPlayer) {
    // Trigger condition: Player returns to Everwick AND MQ-04 is advanced (obj 6)
    // This event should only fire once.
    if (
      player.map.id === 'everwick' &&
      player.getVariable('QUEST_MQ-04_OBJ') === 6 &&
      !player.getVariable('ACT1_SCENE11_COMPLETED')
    ) {
      await this.triggerScene(player);
      player.setVariable('ACT1_SCENE11_COMPLETED', true); // Ensure it only runs once
    }
  }

  private async triggerScene(player: RpgPlayer) {
    // Prevent player movement during cutscene
    player.canMove = false;
    player.fixDirection();

    // --- Part A: Artun's Warning (in Everwick) ---
    // Dynamically spawn Artun in his house (18, 10)
    const artunEvent = await player.map.createDynamicEvent({
      x: 18,
      y: 10,
      event: class ArtunScene11 extends RpgEvent {
        onInit() {
          this.setGraphic('npc_artun');
          this.setDirection(Move.up);
        }
      },
    });

    await player.teleport('everwick', 19, 11); // Player appears in Artun's house
    await player.showText(
      'You broke the clearing. Good. Hana told me what you found — a Preserver scout, a frozen watchtower, the whole thing.',
    );
    await player.showText(
      "I wish I could say it's an isolated case. But I've been reading reports from travelers for months now. Stagnation zones in the Frontier. Whole settlements frozen. The Preservers are expanding.",
    );
    await player.showText(
      "There's something else. The clearing you broke — it wasn't just a clearing. It was a test. The Preservers were seeing how much they could freeze this close to a populated area. And now that you've broken it...",
    );

    // Rumble and light flare effect (simulate with screen effects or temporary graphic)
    // TODO: screenEffect not available in RPG-JS 4.3.0
    // TODO: screenEffect not available in RPG-JS 4.3.0

    await player.showText("...they're pushing back.");

    // Remove Artun's dynamic event
    await player.map.removeEvent(artunEvent.id);

    // --- Part B: The Expansion (Transition to Heartfield) ---
    await player.teleport('heartfield', 35, 30); // Player and Hana run to Heartfield

    // Play cutscene: Hana freezing
    await player.playCutscene('hana-freezing'); // This cutscene handles the visual expansion and Hana's initial actions

    // Dynamically spawn Hana (frozen) at the stagnation border
    const _hanaFrozenEvent = await player.map.createDynamicEvent({
      x: 34,
      y: 29,
      event: class HanaFrozenScene11 extends RpgEvent {
        onInit() {
          this.setGraphic('npc_hana'); // Use Hana's graphic
          this.setDirection(Move.up); // Frozen mid-stride, hand extended
          this.setAnimation('frozen_state'); // Assuming a 'frozen_state' animation or graphic
          this.setHitbox(1, 1); // Make her interactable for the player to "hammer"
        }

        async onAction(player: RpgPlayer) {
          if (!player.getVariable('HANA_FROZEN_HAMMERED')) {
            await player.showText(
              "You hammer against the crystal. It doesn't break. It doesn't even crack.",
            );
            player.setVariable('HANA_FROZEN_HAMMERED', true);
          } else {
            await player.showText('The crystal remains unyielding.');
          }
        }
      },
    });

    // System message for Hana being frozen
    await player.showText('Hana has been frozen by the Stagnation Zone.', { type: 'system' });

    // Dialogue from The Curator (echoing from crystal)
    await player.showText('I did not want this.', {
      speaker: 'The Curator',
      style: { color: 'lightblue', fontStyle: 'italic' },
    });
    await player.showText(
      'Your friend is brave. She pushed against the boundary, and the boundary pushed back. That is the nature of preservation — it resists change. It must, or it is nothing.',
      { speaker: 'The Curator', style: { color: 'lightblue', fontStyle: 'italic' } },
    );
    await player.showText(
      'She is not harmed. She is... held. Every memory she carries, every breath she took, every thought she was thinking — all preserved. Perfectly. She will not age, will not suffer, will not fade. Is that not a kindness?',
      { speaker: 'The Curator', style: { color: 'lightblue', fontStyle: 'italic' } },
    );

    // Effects:
    // 1. Companion leave: Hana is removed from the party
    player.removeCompanion('lira');
    // 2. Vibrancy change: Heartfield vibrancy drops sharply
    // Assuming a global vibrancy system or map-specific variable
    const map = player.map as RpgMap;
    if (map.setVariable) {
      // Check if map supports variables
      const currentVibrancy = map.getVariable('vibrancy_heartfield') || 65; // Default from docs
      map.setVariable('vibrancy_heartfield', Math.max(40, currentVibrancy - 25)); // Drops to 40
    }
    // 3. Item give: MF-04 "Hana's Scream"
    addItem(player, 'MF-04', 1);
    await player.showText(
      "You received a Memory Fragment: \"Hana's Scream\" (Fury, Light, ★★★★) — the emotional shockwave of Hana's freezing. The player's most potent fragment yet — and the most painful.",
      { type: 'system' },
    );

    // Quest Changes: MQ-04 → advance (obj 6)
    // This event is triggered *after* MQ-04 step 6 is met, so we advance to the next step.
    advanceObjective(player, 'MQ-04'); // Advances to step 7 (or completes if step 6 was the last objective)

    // Re-enable player movement
    player.canMove = true;
  }
}

export default TheClearingGrowsEvent;
