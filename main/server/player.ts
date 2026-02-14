import type { Direction, RpgPlayer, RpgPlayerHooks } from '@rpgjs/server';
import { checkEncounter, resetEncounterSteps } from './systems/encounters';
import type { EquipmentSlot } from './systems/inventory';
import { equipItem, useItem } from './systems/inventory';
import type { SaveData, SaveSlotId } from './systems/save-load';
import { autoSave, deserializePlayer, loadGame } from './systems/save-load';
import { buyItem, getShopDefinitions, getShopInventory, sellItem } from './systems/shop';
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

/**
 * Opens the shop GUI for a given shop and wires buy-item / sell-item / close
 * event handlers on the server side. The Vue component reads SHOP_DATA for the
 * item catalog and SHOP_RESULT for transaction feedback.
 */
export function openShop(player: RpgPlayer, shopId: string): void {
  const items = getShopInventory(shopId);
  if (!items) return;

  // Look up the shop definition for display name
  const defs = getShopDefinitions();
  const def = defs.find((d) => d.shopId === shopId);
  const shopName = def?.name ?? 'Shop';

  // Push shop data to the client via player variable so the Vue component can
  // reactively read it from the player observable.
  player.setVariable('SHOP_DATA', {
    shopId,
    shopName,
    items: items.map((i) => ({ itemId: i.itemId, name: i.name, price: i.price })),
  });

  // Clear any prior result message
  player.setVariable('SHOP_RESULT', null);

  const gui = player.gui('shop-screen');

  gui.on('buy-item', (data: { itemId: string; qty: number }) => {
    const qty = Math.max(1, Math.floor(data.qty ?? 1));
    const result = buyItem(player, shopId, data.itemId, qty);
    player.setVariable('SHOP_RESULT', {
      message: result.message,
      success: result.success,
    });
  });

  gui.on('sell-item', (data: { itemId: string; qty: number }) => {
    const qty = Math.max(1, Math.floor(data.qty ?? 1));
    const result = sellItem(player, data.itemId, qty);
    player.setVariable('SHOP_RESULT', {
      message: result.message,
      success: result.success,
    });
  });

  gui.on('close', () => {
    player.setVariable('SHOP_DATA', null);
    player.setVariable('SHOP_RESULT', null);
    player.removeGui('shop-screen');
  });

  gui.open();
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
