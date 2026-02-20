/**
 * Worlds Playtest — Shops, Inns, Dungeons
 *
 * Tests all nested child world types using the world transition system.
 * Verifies shop buy/sell, dungeon multi-floor traversal,
 * and world transition state machine.
 */

import { describe, expect, it } from 'vitest';
import { AIPlayer } from '../../engine/testing/ai-player.js';
import { completionistStrategy } from '../../engine/testing/strategies/completionist.js';
import {
  createInventory,
  addItem,
  equipItem,
} from '../../engine/inventory/inventory.js';
import { buyItem, sellItem, canBuy, getSellPrice } from '../../engine/inventory/shop.js';
import type { GameItem } from '../../engine/inventory/types.js';
import {
  createTransitionState,
  beginTransition,
  onMapLoaded,
  completeTransition,
} from '../../engine/world/transition.js';
import {
  createTestWorld,
  buildConfig,
  registerCleanup,
  runTicks,
} from './helpers/setup.js';
import {
  loadTestMap,
  OVERWORLD_MAP,
  SHOP_MAP,
  DUNGEON_MAP,
} from './helpers/mock-maps.js';

registerCleanup();

// ── Test Fixtures ──────────────────────────────────────────────────────────

const healingHerb: GameItem = {
  id: 'C-01',
  name: 'Healing Herb',
  category: 'consumable',
  description: 'Basic HP restoration.',
  stackable: true,
  maxStack: 99,
  price: 20,
};

const ironSword: GameItem = {
  id: 'W-SW-01',
  name: 'Iron Sword',
  category: 'weapon',
  description: 'Simple iron sword.',
  stackable: false,
  maxStack: 1,
  price: 80,
};

describe('Worlds — Nested Child Worlds', () => {
  describe('Shop World', () => {
    it('shop map loads correctly', () => {
      const map = loadTestMap(SHOP_MAP);
      expect(map.id).toBe('everwick-shop');
      expect(map.width).toBe(5);
      expect(map.transitions.length).toBeGreaterThan(0);
    });

    it('buy items from shop', () => {
      let inv = { ...createInventory(), gold: 200 };
      expect(canBuy(inv, healingHerb, 5)).toBe(true);
      inv = buyItem(inv, healingHerb, 3);
      expect(inv.gold).toBe(140); // 200 - 60
      expect(inv.items.get('C-01')).toBe(3);
    });

    it('sell items to shop', () => {
      let inv = { ...createInventory(), gold: 50 };
      inv = addItem(inv, 'C-01', 5);
      const sellPrice = getSellPrice(healingHerb);
      expect(sellPrice).toBe(10); // 50% of 20
      inv = sellItem(inv, 'C-01', sellPrice, 3);
      expect(inv.gold).toBe(80); // 50 + 30
      expect(inv.items.get('C-01')).toBe(2);
    });

    it('cannot buy when gold is insufficient', () => {
      const inv = { ...createInventory(), gold: 10 };
      expect(canBuy(inv, ironSword, 1)).toBe(false);
    });

    it('equip purchased weapon', () => {
      let inv = { ...createInventory(), gold: 200 };
      inv = buyItem(inv, ironSword, 1);
      inv = equipItem(inv, 'W-SW-01', 'weapon');
      expect(inv.equipment.weapon).toBe('W-SW-01');
      expect(inv.items.has('W-SW-01')).toBe(false);
    });

    it('AI player navigates shop map without errors', () => {
      const map = loadTestMap(SHOP_MAP);
      const world = createTestWorld(2, 4);
      const config = buildConfig(world, map, completionistStrategy);
      const ai = new AIPlayer(config);

      const errors: string[] = [];
      for (let i = 0; i < 50; i++) {
        const t = ai.tick(16);
        errors.push(...t.errors);
      }
      expect(errors).toEqual([]);
    });
  });

  describe('Dungeon World', () => {
    it('dungeon map loads with multiple vibrancy areas', () => {
      const map = loadTestMap(DUNGEON_MAP);
      expect(map.id).toBe('whispering-caves-floor1');
      expect(map.vibrancyAreas.length).toBe(2);
    });

    it('dungeon has floor transition', () => {
      const map = loadTestMap(DUNGEON_MAP);
      expect(map.transitions.length).toBeGreaterThan(0);
      const stairsTransition = map.transitions.find((t) => t.id === 'floor2-stairs');
      expect(stairsTransition).toBeDefined();
      expect(stairsTransition!.target).toBe('whispering-caves-floor2');
    });

    it('AI player navigates dungeon without errors', () => {
      const map = loadTestMap(DUNGEON_MAP);
      const world = createTestWorld(1, 7);
      const config = buildConfig(world, map, completionistStrategy);
      const ai = new AIPlayer(config);

      const errors: string[] = [];
      for (let i = 0; i < 100; i++) {
        const t = ai.tick(16);
        errors.push(...t.errors);
      }
      expect(errors).toEqual([]);
    });
  });

  describe('World Transitions', () => {
    it('creates idle transition state', () => {
      const state = createTransitionState();
      expect(state.phase).toBe('idle');
    });

    it('begins transition to child world', () => {
      const state = beginTransition(
        createTransitionState(),
        'everwick-shop',
        'player-spawn',
        'child-world',
      );
      expect(state.phase).toBe('loading');
      expect(state.targetMapId).toBe('everwick-shop');
      expect(state.type).toBe('child-world');
    });

    it('completes transition with loaded map data', () => {
      let state = beginTransition(
        createTransitionState(),
        'everwick-shop',
        'player-spawn',
        'child-world',
      );
      const mapData = loadTestMap(SHOP_MAP);
      state = onMapLoaded(state, mapData);
      expect(state.phase).toBe('crossfade');
      // Simulate crossfade completion
      state = { ...state, phase: 'complete', progress: 1 };
      const result = completeTransition(state);
      expect(result.state.phase).toBe('idle');
      expect(result.mapData.id).toBe('everwick-shop');
    });
  });
});

