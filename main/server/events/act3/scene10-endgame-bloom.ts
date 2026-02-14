import {
  EventData,
  RpgCommonMap,
  RpgEvent,
  RpgMap,
  type RpgPlayer,
} from '@rpgjs/server';

@EventData({
  id: 'act3-scene10-endgame-bloom',
  name: 'The Endgame Bloom',
  map: 'fortress-f3',
  hitbox: { width: 32, height: 32 },
  autoAnimation: {
    stand: {
      direction: 'down',
      animations: ['_event_stand'],
    },
  },
})
export class EndgameBloomEvent extends RpgEvent {
  onInit() {
    this.setGraphic(''); // Invisible event graphic
  }

  async onChanges(player: RpgPlayer) {
    // Trigger condition: worlds-new-dawn-broadcast
    // This condition is assumed to be set in player.getVariable() or similar
    // after the final boss fight/Curator confrontation.
    if (
      player.getVariable('worlds-new-dawn-broadcast') &&
      !player.getVariable('endgame-bloom-triggered')
    ) {
      await this.triggerEndgameBloom(player);
      player.setVariable('endgame-bloom-triggered', true); // Ensure it only triggers once
    }
  }

  private async triggerEndgameBloom(player: RpgPlayer) {
    // 1. Play cutscene
    await player.callScene('cutscene-play', { cutsceneId: 'endgame-bloom-cinematic' });

    // 2. Apply effects
    // Vibrancy change for all zones
    // Note: RPG-JS doesn't have a direct 'all zones' concept for map effects.
    // This would typically involve iterating through all loaded maps or
    // having a global system that listens for this event.
    // For this example, we'll simulate a global effect.
    // In a real game, this might be handled by a global service or a custom map property.
    player.emit('apply-global-vibrancy', { zone: 'all', delta: 95 });

    // Music change
    // TODO: changeMusic not available in RPG-JS 4.3.0

    // Screen effect
    // TODO: screenEffect not available in RPG-JS 4.3.0

    // 3. Dialogue sequence
    await player.showText(
      'The world blooms. Vibrancy 95 in every zone. The Endgame Bloom has transformed the Unfinished World into something new — not finished, but alive. Not perfect, but growing.',
      {
        talkWith: this,
      },
    );

    // 4. Update quest state (None for this specific event, but included for completeness)
    // Example: player.setQuest('MQ-10', 'completed');

    // 5. Player regains control (handled automatically after showText and cutscene)
  }
}

export default function endgameBloomEvent() {
  return EndgameBloomEvent;
}
