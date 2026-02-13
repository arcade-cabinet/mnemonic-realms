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
    const seed = Date.now().toString();
    player.setVariable('SEED', seed);

    // Show the title screen GUI and wait for class selection
    const gui = player.gui('title-screen');

    gui.on('class-selected', async (data: { classId: string }) => {
      const classId = data.classId;

      // Apply class from database
      player.setClass(classId);

      // Set sprite based on chosen class
      const spriteId = SPRITE_MAP[classId];
      if (!spriteId) {
        throw new Error(`No sprite mapped for class "${classId}". Valid classes: ${Object.keys(SPRITE_MAP).join(', ')}`);
      }
      player.setGraphic(spriteId);

      // Close the title screen
      player.removeGui('title-screen');

      // Move to starting map
      await player.changeMap('village-hub');
    });

    gui.open(
      {},
      {
        waitingAction: true,
        blockPlayerInput: true,
      },
    );
  },

  onJoinMap(player: RpgPlayer) {
    player.speed = 3;
  },
};
