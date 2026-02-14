import { Direction, EventData, Move, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';

@EventData({
  id: 'act1-scene7-ambergrove',
  name: 'Ambergrove - Forest of Echoes Scene Event',
  hitbox: { width: 1, height: 1 }, // Invisible event, triggered on map enter
})
export class AmbergroveSceneEvent extends RpgEvent {
  onInit() {
    this.set({
      graphic: 'invisible',
      collidable: false,
      priority: 0, // Below player
    });
  }

  async onPlayerTouch(player: RpgPlayer) {
    // Trigger: map-enter, map: ambergrove, condition: first-visit
    if (player.map.id === 'ambergrove' && !player.getVariable('ACT1_SCENE7_AMBERGROVE_VISITED')) {
      player.setVariable('ACT1_SCENE7_AMBERGROVE_VISITED', true);

      // Effects: system-message
      await player.showText('Ambergrove: dense forest with ancient Hearthstone Circle.', {
        time: 3000,
        style: {
          fontSize: '20px',
          color: '#FFF',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '10px',
          borderRadius: '5px',
        },
      });

      // Spawn Hana (npc_hana) at Hearthstone Circle (20, 10)
      const liraEvent = await player.map.createDynamicEvent({
        x: 20,
        y: 10,
        event: 'npc_hana', // Assuming 'npc_hana' is a registered RpgEvent class
        properties: {
          name: 'Hana',
          graphic: 'npc_hana',
          direction: Direction.DOWN,
          speed: 1,
          frequency: 1000,
          moveRandom: false,
          collidable: true,
          priority: 1, // Above player
        },
      });

      // Dialogue: dlg-lira-scene7 (Hearthstone Circle intro)
      await player.showText(
        'This is a Hearthstone Circle. Before the Dissolved chose to let go, they gathered in places like this. Their strongest memories are still here — more concentrated than anything in the village.',
        {
          speaker: 'Hana',
          talkWith: liraEvent,
        },
      );

      // Quest Changes: MQ-03 → advance (obj 1)
      player.addQuestProgress('MQ-03', 1);

      // Hearthstone Circle fragments (RS-AG-01, RS-AG-02, RS-AG-03)
      // These would typically be separate action events on the map,
      // but for this scene event, we'll just acknowledge their presence.
      // The actual collection logic would be in individual RpgEvent classes for each stone.

      // Amber Lake foreshadowing (RS-AG-04)
      // This would also be a separate action event on the map.
      // For this scene event, we'll simulate the initial observation.
      await player.showText('That stone in the lake... I can hear it from here. Can you?', {
        speaker: 'Hana',
        talkWith: liraEvent,
      });
      await player.showText(
        "It's dormant, but not empty. Whatever it's carrying is strong. Too strong for us right now — we'd need to be much further along in our training to handle a memory that dense.",
        {
          speaker: 'Hana',
          talkWith: liraEvent,
        },
      );
      await player.showText(
        'The submerged Resonance Stone hums with immense memory energy. It cannot be activated until Act II.',
        {
          time: 3000,
          style: {
            fontSize: '20px',
            color: '#FFF',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px',
            borderRadius: '5px',
          },
        },
      );

      // Woodcutter's Camp (SQ-03 trigger)
      // This would be handled by EV-AG-001, a separate NPC event.
      // For this scene event, we'll just ensure the player is aware of the area.
      await player.showText(
        "It looks like there's a small camp of woodcutters nearby. Perhaps they know more about this forest.",
        {
          time: 3000,
          style: {
            fontSize: '20px',
            color: '#FFF',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px',
            borderRadius: '5px',
          },
        },
      );

      // Hana moves to a less central position after initial dialogue
      await liraEvent.moveAndPlay(Move.tile(22, 12));
    }
  }
}

export default AmbergroveSceneEvent;
