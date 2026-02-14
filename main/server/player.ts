import type { Direction, RpgPlayer, RpgPlayerHooks } from '@rpgjs/server';
import type { CombatAction } from './systems/combat';
import {
  CombatPhase,
  endCombat,
  getCombat,
  getCombatGoldReward,
  getCombatXpReward,
  processTurn,
} from './systems/combat';
import { checkEncounter, resetEncounterSteps } from './systems/encounters';
import type { EquipmentSlot } from './systems/inventory';
import { addGold, addItem, equipItem, useItem } from './systems/inventory';
import { addXP } from './systems/progression';
import type { SaveData, SaveSlotId } from './systems/save-load';
import { autoSave, deserializePlayer, loadGame } from './systems/save-load';
import { initVibrancy, syncZoneVibrancy } from './systems/vibrancy';

const SPRITE_MAP: Record<string, string> = {
  knight: 'sprite-player-knight',
  mage: 'sprite-player-mage',
  rogue: 'sprite-player-rogue',
  cleric: 'sprite-player-cleric',
};

function openInventory(player: RpgPlayer) {
  const inv = player.gui('inventory-screen');

  inv.on('use-item', (data: { itemId: string }) => {
    useItem(player, data.itemId);
  });

  inv.on('equip-item', (data: { slot: string; itemId: string }) => {
    equipItem(player, data.slot as EquipmentSlot, data.itemId);
  });

  inv.open();
}

function wireBattleUI(player: RpgPlayer) {
  const gui = player.gui('battle-ui');

  gui.on('combat-action', (data: CombatAction) => {
    const state = processTurn(player, data);
    if (!state) return;

    // Auto-end combat on flee (no rewards)
    if (state.phase === CombatPhase.Fled) {
      endCombat(player);
    }

    // Auto-end combat on defeat (onDead handles game-over UI)
    if (state.phase === CombatPhase.Defeat) {
      endCombat(player);
    }
  });

  gui.on('combat-end', (data: { phase: string }) => {
    const state = getCombat(player);
    if (!state) return;

    if (data.phase === 'victory') {
      // Award XP from defeated enemies
      const xp = getCombatXpReward(state);
      addXP(player, xp);

      // Award gold from defeated enemies
      const gold = getCombatGoldReward(state);
      addGold(player, gold);

      // Award rolled item drops
      for (const drop of state.itemDrops) {
        addItem(player, drop.itemId, drop.quantity);
      }
    }

    // Clean up all combat state
    endCombat(player);
  });
}

function openTitleScreen(player: RpgPlayer) {
  const gui = player.gui('title-screen');

  gui.on('class-selected', async (data: { classId: string }) => {
    const classId = data.classId;

    try {
      player.setClass(classId);
    } catch {
      // Generated class data may not match RPG-JS expectations yet
    }

    // Initialize vibrancy for all zones on new game start
    initVibrancy(player);

    // Store chosen class ID for progression system
    player.setVariable('PLAYER_CLASS_ID', classId);
    // Store chosen graphic for onJoinMap; apply after map is loaded
    // so the client-side component exists to receive the sprite.
    player.setVariable('CHOSEN_GRAPHIC', SPRITE_MAP[classId] ?? 'sprite-player-knight');
    player.removeGui('title-screen');
    player.gui('rpg-hud').open();
    openInventory(player);
    await player.changeMap('village-hub', { x: 480, y: 480 });
  });

  gui.on('load-save', async (data: { slotId: SaveSlotId; saveData: SaveData }) => {
    player.removeGui('title-screen');
    player.gui('rpg-hud').open();
    openInventory(player);
    await deserializePlayer(player, data.saveData);
  });

  gui.on('continue-game', async (data: { slotId: SaveSlotId }) => {
    player.removeGui('title-screen');
    player.gui('rpg-hud').open();
    openInventory(player);
    await loadGame(player, data.slotId);
  });

  gui.on('open-credits', () => {
    player.gui('credits-screen').open();
  });

  gui.open({}, { waitingAction: true, blockPlayerInput: true });
}

export const player: RpgPlayerHooks = {
  props: {
    zoneVibrancy: Number,
    zoneBiome: String,
  },

  onConnected(player: RpgPlayer) {
    // Internal seed -- buried, never shown to the player (v2 creative direction)
    player.setVariable('SEED', Date.now().toString());
    wireBattleUI(player);
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

    // Sync current zone vibrancy + biome to client
    syncZoneVibrancy(player);

    // Reset encounter step counter on map transition
    resetEncounterSteps(player);

    // Auto-save on every map change
    autoSave(player);
  },

  onInput(player: RpgPlayer, { input }: { input: Direction | string }) {
    // Only check encounters on directional movement input
    const moveInputs = ['up', 'down', 'left', 'right'];
    if (!moveInputs.includes(input as string)) return;

    const mapId = player.map?.id;
    if (!mapId) return;

    checkEncounter(player, mapId);
  },

  onDead(player: RpgPlayer) {
    // Clear any active combat state on death
    endCombat(player);

    player.removeGui('rpg-hud');
    player.removeGui('inventory-screen');
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
