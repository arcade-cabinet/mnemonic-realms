import { EventData, Move, RpgCommonEvent, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';

@EventData({
  id: 'act1-scene1-familiar-place',
  name: 'A Familiar Place',
  map: 'village-hub',
  // The player spawns at (18, 10) in the Elder's House.
  // This event is an auto-trigger for the scene, so its position doesn't directly matter for player interaction,
  // but it's good practice to place it logically, e.g., at the player's spawn or a central point.
  // For an auto-trigger, the hitbox is often irrelevant as it fires on map load.
  hitbox: { width: 32, height: 32 },
})
export class Act1Scene1FamiliarPlace extends RpgEvent {
  onInit() {
    this.set
      .graphic('invisible') // Make the event itself invisible as it's a scene trigger
      .setHitbox(0, 0); // No hitbox needed for an auto-trigger
  }

  async onChanges(player: RpgPlayer) {
    // Trigger condition: game-start and on the correct map
    // We assume 'game-start' is a state managed by the game,
    // e.g., a flag set after character creation and first map load.
    // For simplicity, we'll check if MQ-01 is not yet active, implying game start.
    if (
      player.getVariable('MQ-01_status') === undefined ||
      player.getVariable('MQ-01_status') === 'inactive'
    ) {
      // Ensure this event only runs once
      if (player.getVariable('act1-scene1-familiar-place_completed')) {
        return;
      }

      // Prevent re-triggering if player leaves and re-enters map during scene
      player.setVariable('act1-scene1-familiar-place_completed', true);

      // --- 1. Spawn NPCs ---
      // Callum at (19, 11)
      const callum = await player.map.createDynamicEvent({
        x: 19,
        y: 11,
        event: class CallumScene1 extends RpgEvent {
          onInit() {
            this.setGraphic('npc_callum');
            this.setDirection(Move.up); // Callum faces the player
          }
        },
      });

      // Player spawns at (18, 10)
      // Ensure player is facing Callum
      await player.changeDirection(Move.down);

      // --- 2. Play dialogue sequences ---
      await player.showText(
        "There you are. Come in, come in — careful of the stack by the door, I haven't shelved those yet.",
        { speaker: 'Callum' },
      );
      await player.showText(
        "I asked you here because something's been on my mind. Sit down? No? You young ones never sit.",
        { speaker: 'Callum' },
      );
      await player.showText(
        'You know how I study the Dissolved — the civilizations that came before us? Well, I found something in my journals that I should have noticed years ago.',
        { speaker: 'Callum' },
      );
      await player.showText(
        'This passage describes a talent the Dissolved called "Mnemonic Architecture." The ability to see memory where others see only stone and air. To collect it, reshape it, give it back to the world.',
        { speaker: 'Callum' },
      );
      await player.showText('Sound familiar?', { speaker: 'Callum' });
      await player.showText(
        "You've always noticed things the rest of us don't. The way the fountain shimmers when no one's watching. The humming from the Resonance Stones when you walk past. That time you told Maren her shop \"felt happy\" and she thought you were being poetic.",
        { speaker: 'Callum' },
      );
      await player.showText(
        "You weren't being poetic. You were perceiving memory energy. You're a Mnemonic Architect, and we just didn't have a word for it until now.",
        { speaker: 'Callum' },
      );
      await player.showText(
        "A traveler came through last month — a woman named Lira. She recognized it in you immediately. She's been waiting at her workshop for you to be ready.",
        { speaker: 'Callum' },
      );
      await player.showText(
        "But first — take this. It's been sitting in my collection for thirty years, and I think it's been waiting for you.",
        { speaker: 'Callum' },
      );

      // Visual effect for item giving (optional, can be a simple text)
      // For a more advanced effect, you might use player.gui() or a custom animation.
      await player.showText('Callum holds out his hands. A warm amber glow rises from his palms.', {
        speaker: 'Narrator',
      });
      await player.showText(
        "This is a memory fragment. My first lesson — the day my own teacher showed me how to see the world as it really is. It's a joyful memory. I'd like you to have it.",
        { speaker: 'Callum' },
      );

      // --- 3. Fire effects ---
      // Item-give: MF-01
      player.addItem('MF-01', 1); // Assuming MF-01 is the item ID

      // System message
      await player.showText(
        'You received a Memory Fragment: "Callum\'s First Lesson" (Joy, Neutral, ★★)',
        { type: 'system' },
      );

      // --- 4. Update quest state ---
      player.setVariable('MQ-01_status', 'active'); // Activate Main Quest 01

      await player.showText(
        "Now go find Lira. Her workshop is south of the square — the building with the amber lanterns. She'll teach you what I can't.",
        { speaker: 'Callum' },
      );
      await player.showText(
        'Oh — and take the scenic route through the Memorial Garden, would you? I have a feeling the stones there have something to show you.',
        { speaker: 'Callum' },
      );

      // Remove Callum after the scene, or set him to patrol
      if (callum) {
        // For now, remove him. A more complex game might have him patrol.
        player.map.removeEvent(callum.id);
      }
    }
  }
}

export default Act1Scene1FamiliarPlace;
