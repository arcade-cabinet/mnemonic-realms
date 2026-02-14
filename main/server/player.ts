import type { RpgPlayer, RpgPlayerHooks } from '@rpgjs/server';

const SPRITE_MAP: Record<string, string> = {
  knight: 'sprite-player-knight',
  mage: 'sprite-player-mage',
  rogue: 'sprite-player-rogue',
  cleric: 'sprite-player-cleric',
};

export const player: RpgPlayerHooks = {
  onConnected(player: RpgPlayer) {
    // Internal seed -- buried, never shown to the player (v2 creative direction)
    player.setVariable('SEED', Date.now().toString());

    const gui = player.gui('title-screen');

    gui.on('class-selected', async (data: { classId: string }) => {
      const classId = data.classId;

      try {
        player.setClass(classId);
      } catch {
        // Generated class data may not match RPG-JS expectations yet
      }

      // Store chosen graphic for onJoinMap; apply after map is loaded
      // so the client-side component exists to receive the sprite.
      player.setVariable('CHOSEN_GRAPHIC', SPRITE_MAP[classId] ?? 'sprite-player-knight');
      player.removeGui('title-screen');
      player.gui('rpg-hud').open();
      await player.changeMap('village-hub', { x: 480, y: 480 });
    });

    gui.open({}, { waitingAction: true, blockPlayerInput: true });
  },

  onJoinMap(player: RpgPlayer) {
    player.speed = 3;
    player.canMove = true;
    // Apply graphic after map load — standalone mode needs the client component
    // to exist before setGraphic can sync the sprite texture.
    const graphic = player.getVariable('CHOSEN_GRAPHIC') as string | undefined;
    if (graphic) {
      player.setGraphic(graphic);
    }
  },
};
