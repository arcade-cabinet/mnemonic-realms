import { Direction, EventData, RpgEvent, type RpgPlayer } from '@rpgjs/server';
import { addGold, addItem } from '../../systems/inventory';

@EventData({
  id: 'act2-scene15-songline',
  name: 'The Songline',
  map: 'depths-l4',
  trigger: 'map-enter',
  hitbox: { width: 1, height: 1 },
})
export class TheSonglineEvent extends RpgEvent {
  onInit() {
    this.setGraphic(''); // Invisible event, acts as a scene manager
  }

  async onChanges(_player: RpgPlayer) {
    // This event is primarily triggered by map-enter, but onChanges can handle
    // continuous checks or visual updates if needed for the dungeon.
    // For this scene, the main logic is in onMapEnter.
  }

  async onMapEnter(player: RpgPlayer) {
    // Ensure this scene only plays once or under specific quest conditions
    const sceneId = 'act2-scene15-songline';
    if (player.getVariable(`SCENE_COMPLETED_${sceneId}`)) {
      return;
    }

    // --- Scene Setup ---
    await player.fadeAndChangeMap('depths-l4', { x: 10, y: 2 }); // Ensure player starts at the entrance
    await player.showText(
      'You step into the Depths Level 4: The Songline. A faint, ethereal hum fills the air.',
    );
    // TODO: changeMusic not available in RPG-JS 4.3.0

    // --- Room 1: The First Verse — Joy ---
    await player.showText(
      'Room 1: The First Verse — Joy. A bright, golden room. The walls vibrate with visible sound waves.',
    );
    // TODO: screenEffect not available in RPG-JS 4.3.0
    await player.showText(
      "Dissolved Chorister (echo): This is the beginning. We sang because we loved the sound. Every voice added something the others couldn't. Together, we were the most beautiful thing in the world.",
    );
    addItem(player, 'frag-joy-light-3', 1); // Joy / Light / Potency 3
    await player.showText('You feel a surge of Joy. (Fragment: Joy / Light / Potency 3 acquired)');

    // Move player to Room 2 entrance
    await player.moveRoutes([{ direction: Direction.Down, nbSteps: 5 }]);

    // --- Room 2: The Second Verse — Complexity ---
    await player.showText(
      'Room 2: The Second Verse — Complexity. The room darkens slightly. The harmonies become more complex.',
    );
    // TODO: screenEffect not available in RPG-JS 4.3.0
    await player.showText(
      'Dissolved Conductor (echo): The song grew. We added voices, instruments, harmonics upon harmonics. It was magnificent — and it was breaking us. We were losing each other in the complexity.',
    );
    // No fragment in this room, only lore text.
    await player.showText(
      'The Resonance Stone here hums with a dense, overlapping melody, but yields no fragment.',
    );

    // Move player to Room 3 entrance
    await player.moveRoutes([{ direction: Direction.Down, nbSteps: 5 }]);

    // --- Room 3: The Third Verse — The Choice ---
    await player.showText(
      'Room 3: The Third Verse — The Choice. A quiet room. The echoes sit in a circle, not singing. The silence feels heavy.',
    );
    // TODO: screenEffect not available in RPG-JS 4.3.0
    await player.showText(
      'Dissolved Elder (echo): We could have simplified. But the song WAS us. Simplifying it meant losing parts of ourselves.',
    );
    await player.showText(
      'Dissolved Elder (echo): So we chose the other option. If the song was too large for us... we would become large enough for the song.',
    );
    addItem(player, 'frag-sorrow-wind-4', 1); // Sorrow / Wind / Potency 4
    await player.showText(
      'A profound sadness washes over you. (Fragment: Sorrow / Wind / Potency 4 acquired)',
    );

    // Move player to Room 4 entrance
    await player.moveRoutes([{ direction: Direction.Down, nbSteps: 5 }]);

    // --- Room 4: The Fourth Verse — Dissolution ---
    await player.showText(
      'Room 4: The Fourth Verse — Dissolution. The room is vast, open, luminous. The echoes stand, arms raised, voices lifted.',
    );
    // TODO: screenEffect not available in RPG-JS 4.3.0
    await player.showText(
      'One by one, the singers dissolve — their bodies becoming visible sound waves that merge with the ambient music.',
    );
    await player.showText(
      "Dissolved Chorister (the last one standing, smiling): Listen. Can you hear it? The song didn't end. It just... became the world. Every breeze is one of our voices. Every echo is a verse we sang.",
    );
    await player.showText('The last chorister dissolves into pure sound.');

    // Spawn Artun dynamically
    const callumEvent = await player.map.createDynamicEvent({
      x: player.x,
      y: player.y + 1, // Spawn near player
      graphic: 'npc_artun',
      name: 'Artun_Songline',
      event: class extends RpgEvent {
        onInit() {
          this.setGraphic('npc_artun');
          this.setHitbox(16, 16);
        }
        async onAction(player: RpgPlayer) {
          await player.showText(
            "Artun: They didn't die. They became infinite. The song... the song is everywhere. It always was.",
          );
        }
      },
    });
    await player.showText(
      "Artun (crying openly): They didn't die. They became infinite. The song... the song is everywhere. It always was.",
    );

    // Move player to Room 5 entrance
    await player.moveRoutes([{ direction: Direction.Down, nbSteps: 5 }]);

    // --- Room 5: The Fifth Verse — The Unfinished Note ---
    await player.showText(
      'Room 5: The Fifth Verse — The Unfinished Note. A single room with a single Resonance Stone. The stone hums with the note A below middle C.',
    );
    await player.showText(
      "Artun: The note they couldn't finish. The last piece of the song, left for someone else to complete.",
    );

    // Check for Resonance recall state to determine Artun's next line
    const hasRecalledResonance = player.getVariable('GOD_RECALLED_Resonance'); // Assuming a variable for recalled gods
    if (hasRecalledResonance) {
      await player.showText(
        "Artun: You completed it. When you recalled Resonance, you finished the Choir's work. Not the way they would have, but the way you chose. And that's exactly what they hoped for.",
      );
    } else {
      await player.showText(
        'Artun: Perhaps one day, someone will finish this note. Complete the song.',
      );
    }
    addItem(player, 'frag-awe-neutral-5', 1); // Awe / Neutral / Potency 5
    await player.showText(
      'You feel a profound sense of Awe. (Fragment: Awe / Neutral / Potency 5 acquired)',
    );

    // --- Boss Encounter: The Conductor ---
    await player.showText('A dissonant chord rings through the chamber. The Conductor appears!');
    await player.map.removeEvent(callumEvent.id); // Artun disappears before combat
    // TODO: changeMusic not available in RPG-JS 4.3.0
    await player.battle('boss-conductor', ['B-03c']); // Trigger boss combat

    // --- Post-Boss ---
    await player.showText(
      "The Conductor's final note fades into silence. The Songline is complete.",
    );
    // TODO: changeMusic not available in RPG-JS 4.3.0
    addGold(player, 200);
    await player.showText('You gained 200 gold.');
    await player.addState('player_level_up', { levels: 2 }); // Player gains ~2 levels
    await player.showText(
      'You feel stronger, more determined. Your understanding of dissolution has deepened.',
    );

    // Mark scene as completed
    player.setVariable(`SCENE_COMPLETED_${sceneId}`, true);

    // Optional: Teleport player out or open a new path
    await player.showText(
      'A path opens, leading deeper into the Depths, or back to Resonance Fields.',
    );
    // Example: Teleport back to Resonance Fields entrance
    // await player.fadeAndChangeMap('resonance-fields', { x: 28, y: 44 });
  }
}

export default TheSonglineEvent;
