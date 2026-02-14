import { RpgMap as RpgMapClient } from '@rpgjs/client';
import { EventData, MapData, RpgEvent, RpgMap, type RpgPlayer, RpgSceneMap } from '@rpgjs/server';

@EventData({
  id: 'act2-scene12-resonant-caverns',
  name: 'The Resonant Caverns Scene Event',
  // This event is primarily triggered on map enter, so no specific hitbox is needed
  // for a single point, but we can define a dummy one if required by the engine.
  // For map-enter events, the @EventData is often just for ID and name.
})
export default class ResonantCavernsEvent extends RpgEvent {
  onInit() {
    this.set({
      name: 'ResonantCavernsSceneEvent',
      // This event is invisible as it's a scene manager, not an interactive object.
      graphic: '',
      width: 1,
      height: 1,
      // Position can be arbitrary for a map-enter event, often (0,0) or center.
      x: 0,
      y: 0,
    });
  }

  async onPlayerTouch(player: RpgPlayer) {
    // This event is primarily designed for 'map-enter' trigger,
    // but if a touch trigger is also desired for specific spots,
    // it would be handled here. For now, we'll focus on onPlayerJoin.
  }

  async onPlayerJoin(player: RpgPlayer) {
    // Check if the player is entering the 'depths-l3' map
    if (player.map.id === 'depths-l3') {
      // Check if this scene event has already been processed for this player
      // This prevents re-triggering on every map re-entry if it's a one-time intro.
      const sceneId = 'act2-scene12-resonant-caverns';
      if (player.getVariable(sceneId + '_triggered')) {
        return; // Already triggered, do nothing
      }

      // Set a flag to prevent re-triggering
      player.setVariable(sceneId + '_triggered', true);

      // 1. Spawn NPCs
      // Artun (npc_artun) at a specific position for dialogue
      const callumEvent = player.map.createDynamicEvent({
        x: 10, // Example X coordinate
        y: 15, // Example Y coordinate
        id: 'npc_artun_resonant_caverns',
        name: 'Artun',
        graphic: 'npc_artun',
        speed: 1,
        // Make Artun static for this dialogue
        moveRandom: false,
        // Make him face the player when they approach
        direction: 2, // Down
        hitbox: {
          width: 32,
          height: 32,
        },
        // Define an onAction for Artun to trigger his dialogue
        onAction: async (player: RpgPlayer) => {
          await player.showText(
            'Artun: "The air here... it hums with a strange energy. Be careful, [PLAYER_NAME]."',
          );
          await player.showText(
            'Artun: "Those crystal formations seem to react to sound. Perhaps there\'s a pattern to them."',
          );
          // Trigger the specific dialogue bank entry
          await player.callMapEvent('dlg-callum-resonant-caverns');
        },
      });

      // 2. Play dialogue sequences
      await player.showText('A deep, resonant hum echoes through the caverns as you step inside.');
      await player.showText('The crystal formations glow faintly, reacting to the ambient sound.');
      await player.showText(
        'You feel a growing sense of unease, as if the very rock is listening.',
      );

      // 3. Fire effects
      // Music change for the boss area atmosphere
      player.changeMusic('resonant_caverns_theme', 0.8, 0); // Example music file and volume

      // Screen tint for atmospheric effect
      player.screenTint([0, 0, 0, 0.2], 1000); // Darken slightly over 1 second

      // GUI overlay for scene title
      player.gui('scene-title-overlay', {
        title: 'The Resonant Caverns',
        subtitle: 'Depths Level 3',
      });

      // Trigger boss combat when player reaches a specific point or condition
      // For this example, let's assume the boss is triggered by an event at (10, 20)
      // This would typically be a separate event, but for a scene event, we can define it here.
      const bossTriggerEvent = player.map.createDynamicEvent({
        x: 10,
        y: 20,
        id: 'boss_resonant_king_trigger',
        name: 'Resonant King Trigger',
        graphic: '', // Invisible trigger
        hitbox: {
          width: 32,
          height: 32,
        },
        onPlayerTouch: async (player: RpgPlayer) => {
          if (!player.getVariable('resonant_king_defeated')) {
            await player.showText(
              'A deafening roar shakes the caverns! The Resonant King emerges!',
            );
            player.map.removeEvent(bossTriggerEvent.id); // Remove trigger after first touch
            await player.combat({
              encounter: 'boss-resonant-king',
              enemies: 'B-03b',
            });
            player.setVariable('resonant_king_defeated', true); // Mark boss as defeated
          }
        },
      });

      // 4. Update quest state (None specified for this scene, but example below)
      // player.setQuest('main-quest-05', 'step-3-entered-caverns');
    }
  }
}
