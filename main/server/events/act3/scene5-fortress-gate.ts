import {
  EventData,
  MapData,
  RpgCommonPlayer,
  RpgEvent,
  RpgMap,
  type RpgPlayer,
  RpgScene,
} from '@rpgjs/server';
import { advanceObjective, isQuestActive } from '../../systems/quests';

@EventData({
  id: 'act3-scene5-fortress-gate',
  name: 'The Fortress Gate',
  hitbox: { width: 32, height: 32 },
})
export default class TheFortressGateEvent extends RpgEvent {
  onInit() {
    this.set({
      graphic: '', // Invisible event graphic
      width: 1,
      height: 1,
      collision: true,
    });
  }

  async onPlayerTouch(player: RpgPlayer) {
    // 1. Checks trigger conditions
    if (!isQuestActive(player, 'MQ-09')) {
      return; // Only trigger if MQ-09 is active
    }

    // Ensure the event only triggers once per quest stage
    if (player.getVariable('FORTRESS_GATE_TRIGGERED')) {
      return;
    }
    player.setVariable('FORTRESS_GATE_TRIGGERED', true);

    // Prevent further movement during the scene
    player.canMove = false;

    // 2. Spawns NPCs at appropriate positions using createDynamicEvent()
    // Hana (npc_hana)
    const liraEvent = await player.map.createDynamicEvent({
      x: player.x - 1, // Position relative to player
      y: player.y + 1,
      event: {
        name: 'HanaFortressEntry',
        graphic: 'npc_hana',
        width: 1,
        height: 1,
        collision: true,
        speed: 0,
        onInit(event: RpgEvent) {
          event.setDirection(2); // Face player
        },
      },
    });

    // Artun (npc_artun)
    const callumEvent = await player.map.createDynamicEvent({
      x: player.x + 1, // Position relative to player
      y: player.y + 1,
      event: {
        name: 'ArtunFortressEntry',
        graphic: 'npc_artun',
        width: 1,
        height: 1,
        collision: true,
        speed: 0,
        onInit(event: RpgEvent) {
          event.setDirection(2); // Face player
        },
      },
    });

    // 4. Fires effects (screen effects, music)
    await player.map.setMusic('fortress-glass-harmonica', 0.8);
    await player.screenEffect({
      effect: 'crystal-chill-overlay',
      duration: 0, // Apply instantly
      opacity: 0.3,
      color: [150, 200, 255], // Blue tint
    });

    // 3. Plays dialogue sequences via player.showText()
    await player.showText(
      `The Preserver Fortress. Vibrancy: 0 (crystallized). Broadcasting is disabled — the crystal absorbs memory energy. However, god recall fractures create weak points that can be exploited. Three floors separate you from the First Memory.`,
      {
        type: 'dialog',
        talkWith: this,
      },
    );

    await player.showText(
      `I recognize this feeling. The crystal. The cold. The way everything is perfectly still.`,
      {
        type: 'dialog',
        talkWith: liraEvent,
      },
    );

    await player.showText(
      `I was frozen in crystal like this. For weeks. From my perspective, it was a single moment — one heartbeat between consciousness and nothing. But I remember the nothing. A perfect, silent, beautiful nothing.`,
      {
        type: 'dialog',
        talkWith: liraEvent,
      },
    );

    await player.showText(`I don't want the world to feel that.`, {
      type: 'dialog',
      talkWith: liraEvent,
    });

    await player.showText(`The god recall fractures — look.`, {
      type: 'dialog',
      talkWith: callumEvent,
    });

    // NOTE: Visual effects for god recall fractures would be handled by map design or parallel events
    // based on player's recalled gods, not directly in this event.
    // For example, a parallel event on the map could check player.getVariable('GOD_RECALLED_FLORIANA')
    // and apply a specific tile overlay or particle effect.

    await player.showText(
      `The gods are here. Not physically — but their influence has been eroding this crystal since the moment you recalled them. The Curator built this fortress to resist change, but the world keeps pushing.`,
      {
        type: 'dialog',
        talkWith: callumEvent,
      },
    );

    // 5. Updates quest state
    advanceObjective(player, 'MQ-09'); // Advance Main Quest 09

    // Allow player movement again
    player.canMove = true;

    // Remove dynamic NPCs
    player.map.removeEvent(liraEvent.id);
    player.map.removeEvent(callumEvent.id);

    // The player is now considered "inside" the fortress gate,
    // so we can move them to the next map or a safe spot.
    // For this scenario, we'll assume the player is now on the first floor of the fortress.
    // This transition would typically be handled by a separate transition event,
    // but for a narrative scene, we might force it.
    // For now, we'll just let them continue on the current map.
    // If this event is on the transition tile itself, the player will naturally move to the next map.
  }
}
