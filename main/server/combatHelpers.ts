import type { RpgPlayer } from '@rpgjs/server';

/**
 * Attach server-side listeners to the combat GUI so that HP/SP changes
 * and item consumption happen on the authoritative server, not just the client.
 *
 * Call this BEFORE gui.open() so listeners are ready when the client emits events.
 */
// biome-ignore lint/suspicious/noExplicitAny: RPG-JS Gui type is not exported
export function setupCombatListeners(player: RpgPlayer, gui: any): void {
  // Handle damage/heal from combat (enemy attacks, skill heals)
  gui.on('combat-action', (data: { type: string; amount: number }) => {
    if (data.type === 'damage') {
      player.hp = Math.max(0, player.hp - data.amount);
    } else if (data.type === 'heal') {
      player.hp = Math.min(player.param.maxHp, player.hp + data.amount);
    } else if (data.type === 'sp-restore') {
      player.sp = Math.min(player.param.maxSp, player.sp + data.amount);
    }
    player.syncChanges();
  });

  // Handle SP cost when a skill is used
  gui.on('combat-sp-cost', (data: { cost: number }) => {
    player.sp = Math.max(0, player.sp - data.cost);
    player.syncChanges();
  });

  // Handle item consumption from real inventory
  gui.on('combat-use-item', (data: { itemId: string }) => {
    try {
      player.useItem(data.itemId);
    } catch {
      // Item might not be in inventory or not consumable — ignore silently
      // The HP/SP restore is already handled by combat-action
      try {
        player.removeItem(data.itemId, 1);
      } catch {
        // Already removed or not found
      }
    }
    player.syncChanges();
  });
}
