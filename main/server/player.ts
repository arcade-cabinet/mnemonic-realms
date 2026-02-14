import type { RpgPlayer, RpgPlayerHooks } from '@rpgjs/server';
import type { SaveData, SaveSlotId } from './systems/save-load';
import { autoSave, deserializePlayer, loadGame } from './systems/save-load';

const SPRITE_MAP: Record<string, string> = {
  knight: 'sprite-player-knight',
  mage: 'sprite-player-mage',
  rogue: 'sprite-player-rogue',
  cleric: 'sprite-player-cleric',
};

function openTitleScreen(player: RpgPlayer) {
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

  gui.on('load-save', async (data: { slotId: SaveSlotId; saveData: SaveData }) => {
    player.removeGui('title-screen');
    player.gui('rpg-hud').open();
    await deserializePlayer(player, data.saveData);
  });

  gui.on('continue-game', async (data: { slotId: SaveSlotId }) => {
    player.removeGui('title-screen');
    player.gui('rpg-hud').open();
    await loadGame(player, data.slotId);
  });

  gui.on('open-credits', () => {
    player.gui('credits-screen').open();
  });

  gui.open({}, { waitingAction: true, blockPlayerInput: true });
}

export const player: RpgPlayerHooks = {
  onConnected(player: RpgPlayer) {
    // Internal seed -- buried, never shown to the player (v2 creative direction)
    player.setVariable('SEED', Date.now().toString());
    openTitleScreen(player);
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

    // Auto-save on every map change
    autoSave(player);
  },

  onDead(player: RpgPlayer) {
    player.removeGui('rpg-hud');
    const gameOver = player.gui('game-over');

    gameOver.on('return-to-title', () => {
      player.removeGui('game-over');
      // Restore player to usable state before showing title
      player.hp = player.param.maxHp;
      player.sp = player.param.maxSp;
      openTitleScreen(player);
    });

    gameOver.open({}, { waitingAction: true, blockPlayerInput: true });
  },
};
