import { EventData, RpgEvent, type RpgPlayer } from '@rpgjs/server';

@EventData({
  name: 'act2-scene14-moral-dilemma-monument',
  hitbox: { width: 32, height: 32 },
  // This event is triggered by area-enter, so it doesn't need a graphic or explicit position on the map layer.
  // Its position (30,5) is for the trigger condition.
  // It will dynamically spawn NPCs.
})
export default class MoralDilemmaMonument extends RpgEvent {
  onInit() {
    this.set({
      name: 'act2-scene14-moral-dilemma-monument',
      // This event itself is invisible, it's a trigger for the scene.
      // The actual monument might be a tile or another static event.
      graphic: '',
      width: 32,
      height: 32,
      // The event is not visible on the map until its conditions are met.
      // It will be dynamically shown/triggered.
      visible: false,
    });
  }

  async onPlayerTouch(player: RpgPlayer) {
    // Check trigger conditions: map is hollow-ridge, player position is 30,5, and post-third-recall quest state
    if (
      player.map.id === 'hollow-ridge' &&
      player.position.x === 30 &&
      player.position.y === 5 &&
      player.getVariable('post-third-recall')
    ) {
      // Ensure the event only triggers once per relevant game state or until a choice is made
      if (player.getVariable('monument-dilemma-triggered')) {
        return;
      }
      player.setVariable('monument-dilemma-triggered', true);

      // 1. Spawn NPCs
      // Artun (npc_artun)
      const _callumEvent = await player.map.createDynamicEvent({
        x: 31, // Slightly offset from the monument for interaction
        y: 6,
        event: {
          name: 'npc_artun_monument',
          graphic: 'npc_artun',
          width: 32,
          height: 32,
          speed: 1,
          speedAnimation: 4,
          // Make Artun interactable
          onAction: async (player: RpgPlayer) => {
            await player.showText('dlg-callum-monument');
            // After Artun's dialogue, present the moral choice GUI
            await player.gui('moral-choice').open({
              choices: [
                { id: 'break-monument', text: 'Break the Monument' },
                { id: 'preserve-monument', text: 'Preserve the Monument' },
              ],
            });
          },
        },
      });

      // 3. Play dialogue sequences
      await player.showText(
        'A crystallized monument stands before you, shimmering with ancient energy. It depicts a Ridgewalker, frozen in a moment of triumph. Artun approaches, his expression somber.',
      );
      await player.showText('dlg-callum-monument'); // This will be triggered by interacting with Artun, as defined in his dynamic event.

      // 4. Fire effects (GUI overlay for moral choice)
      // The GUI will be opened after Artun's initial dialogue, via his onAction.
      // This ensures the player has context before making a choice.

      // The GUI response will be handled by a separate GUI event or a global listener.
      // For example, in a global player hook or a specific GUI handler:
      // player.on('gui.moral-choice.select', async (player, choiceId) => {
      //     if (choiceId === 'break-monument') {
      //         await player.showText('You decide to shatter the monument, releasing its trapped energy.');
      //         // Add effects for breaking (e.g., combat, item, quest update)
      //         player.setVariable('monument-state', 'broken');
      //     } else if (choiceId === 'preserve-monument') {
      //         await player.showText('You choose to preserve the monument, honoring the past.');
      //         // Add effects for preserving (e.g., buff, item, quest update)
      //         player.setVariable('monument-state', 'preserved');
      //     }
      //     player.gui('moral-choice').close();
      //     // Remove Artun after the choice is made
      //     player.map.removeEvent(callumEvent.id);
      // });

      // 5. Update quest state (handled by GUI choice)
      // No direct quest changes here, but the choice will lead to them.
    }
  }
}
