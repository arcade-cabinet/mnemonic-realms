<template>
  <div class="shop-overlay" v-if="open" @click.self="close">
    <div class="shop-panel">
      <!-- Header -->
      <div class="shop-header">
        <h2 class="shop-title">{{ shopName }}</h2>
        <div class="shop-gold">
          <span class="gold-icon">&#x2742;</span>
          <span class="gold-amount">{{ gold }}g</span>
        </div>
        <button class="shop-close" @click="close">&#x2715;</button>
      </div>

      <!-- Tabs -->
      <div class="tab-bar">
        <button
          class="tab"
          :class="{ active: activeTab === 'buy' }"
          @click="activeTab = 'buy'"
        >Buy</button>
        <button
          class="tab"
          :class="{ active: activeTab === 'sell' }"
          @click="activeTab = 'sell'"
        >Sell</button>
      </div>

      <!-- Buy Tab -->
      <div class="tab-content" v-if="activeTab === 'buy'">
        <div class="items-layout">
          <div class="item-list">
            <p class="empty-msg" v-if="shopItems.length === 0">No items available</p>
            <button
              class="item-row"
              v-for="item in shopItems"
              :key="item.itemId"
              :class="{
                selected: selectedBuyId === item.itemId,
                'cannot-afford': gold < item.price,
              }"
              @click="selectBuyItem(item.itemId)"
            >
              <span class="item-icon">{{ itemIcon(item.itemId) }}</span>
              <span class="item-name">{{ item.name }}</span>
              <span class="item-price">{{ item.price }}g</span>
            </button>
          </div>

          <div class="item-detail" v-if="selectedBuyInfo">
            <h3 class="detail-name">
              <span class="detail-icon">{{ selectedBuyInfo.icon }}</span>
              {{ selectedBuyInfo.name }}
            </h3>
            <p class="detail-desc">{{ selectedBuyInfo.desc }}</p>
            <p class="detail-price">
              <span class="gold-icon">&#x2742;</span> {{ selectedBuyInfo.price }}g
            </p>

            <!-- Stat comparison for equipment -->
            <div class="stat-compare" v-if="buyStatComparison.length > 0">
              <div class="compare-row" v-for="comp in buyStatComparison" :key="comp.label">
                <span class="compare-label">{{ comp.label }}</span>
                <span class="compare-current">{{ comp.current }}</span>
                <span class="compare-arrow">&#x2192;</span>
                <span class="compare-new" :class="comp.cls">{{ comp.next }}</span>
                <span class="compare-diff" :class="comp.cls">({{ comp.diffStr }})</span>
              </div>
            </div>

            <!-- Quantity selector -->
            <div class="qty-row">
              <button class="qty-btn" @click="adjustBuyQty(-1)" :disabled="buyQty <= 1">-</button>
              <span class="qty-value">{{ buyQty }}</span>
              <button class="qty-btn" @click="adjustBuyQty(1)" :disabled="!canIncreaseBuyQty">+</button>
              <span class="qty-total">= {{ buyTotal }}g</span>
            </div>

            <!-- Confirm state -->
            <div class="confirm-area" v-if="confirmAction === 'buy'">
              <p class="confirm-msg">Buy {{ buyQty }}x {{ selectedBuyInfo.name }} for {{ buyTotal }}g?</p>
              <div class="confirm-buttons">
                <button class="action-btn confirm-yes" @click="executeBuy">Confirm</button>
                <button class="action-btn confirm-no" @click="confirmAction = null">Cancel</button>
              </div>
            </div>
            <button
              class="action-btn buy-btn"
              v-else
              :disabled="gold < buyTotal"
              @click="confirmAction = 'buy'"
            >
              <span class="action-icon">&#x2742;</span> Buy
            </button>
          </div>
        </div>
      </div>

      <!-- Sell Tab -->
      <div class="tab-content" v-if="activeTab === 'sell'">
        <div class="items-layout">
          <div class="item-list">
            <p class="empty-msg" v-if="sellableItems.length === 0">No items to sell</p>
            <button
              class="item-row"
              v-for="item in sellableItems"
              :key="item.id"
              :class="{ selected: selectedSellId === item.id }"
              @click="selectSellItem(item.id)"
            >
              <span class="item-icon">{{ item.icon }}</span>
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">x{{ item.qty }}</span>
              <span class="item-price sell-price">{{ item.sellPrice }}g</span>
            </button>
          </div>

          <div class="item-detail" v-if="selectedSellInfo">
            <h3 class="detail-name">
              <span class="detail-icon">{{ selectedSellInfo.icon }}</span>
              {{ selectedSellInfo.name }}
            </h3>
            <p class="detail-desc">{{ selectedSellInfo.desc }}</p>
            <p class="detail-price sell-label">
              Sell price: {{ selectedSellInfo.sellPrice }}g each
            </p>

            <!-- Quantity selector -->
            <div class="qty-row">
              <button class="qty-btn" @click="adjustSellQty(-1)" :disabled="sellQty <= 1">-</button>
              <span class="qty-value">{{ sellQty }}</span>
              <button
                class="qty-btn"
                @click="adjustSellQty(1)"
                :disabled="sellQty >= selectedSellInfo.qty"
              >+</button>
              <span class="qty-total">= {{ sellTotal }}g</span>
            </div>

            <!-- Confirm state -->
            <div class="confirm-area" v-if="confirmAction === 'sell'">
              <p class="confirm-msg">Sell {{ sellQty }}x {{ selectedSellInfo.name }} for {{ sellTotal }}g?</p>
              <div class="confirm-buttons">
                <button class="action-btn confirm-yes" @click="executeSell">Confirm</button>
                <button class="action-btn confirm-no" @click="confirmAction = null">Cancel</button>
              </div>
            </div>
            <button
              class="action-btn sell-btn"
              v-else
              @click="confirmAction = 'sell'"
            >
              <span class="action-icon">&#x2742;</span> Sell
            </button>
          </div>
        </div>
      </div>

      <!-- Result message -->
      <div class="result-msg" v-if="resultMessage" :class="resultSuccess ? 'msg-success' : 'msg-fail'">
        {{ resultMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed, onMounted, onUnmounted } from 'vue';

// ── Item Catalog (shared with inventory.vue) ────────────────────────────────

interface ItemInfo {
  name: string;
  desc: string;
  icon: string;
  category: 'consumable' | 'weapon' | 'armor' | 'key-item';
}

const ITEM_CATALOG: Record<string, ItemInfo> = {
  // Healing
  'C-HP-01': { name: 'Minor Potion', desc: 'Restore 50 HP', icon: '\u2697', category: 'consumable' },
  'C-HP-02': { name: 'Potion', desc: 'Restore 120 HP', icon: '\u2697', category: 'consumable' },
  'C-HP-03': { name: 'High Potion', desc: 'Restore 250 HP', icon: '\u2697', category: 'consumable' },
  'C-HP-04': { name: 'Elixir', desc: 'Restore 100% HP', icon: '\u2697', category: 'consumable' },
  // SP Recovery
  'C-SP-01': { name: 'Mana Drop', desc: 'Restore 20 SP', icon: '\u2697', category: 'consumable' },
  'C-SP-02': { name: 'Mana Draught', desc: 'Restore 50 SP', icon: '\u2697', category: 'consumable' },
  'C-SP-03': { name: 'Mana Surge', desc: 'Restore 120 SP', icon: '\u2697', category: 'consumable' },
  'C-SP-04': { name: 'Ether', desc: 'Restore 100% SP', icon: '\u2697', category: 'consumable' },
  // Specials
  'C-SP-05': { name: 'Smoke Bomb', desc: 'Guaranteed flee from non-boss encounters', icon: '\u2697', category: 'consumable' },
  'C-SP-06': { name: 'Crystal Dust', desc: 'Cure all debuffs. 50 light damage to Preservers', icon: '\u2697', category: 'consumable' },
  'C-SP-07': { name: 'Stasis Shard', desc: 'Freeze one non-boss enemy for 2 turns', icon: '\u2697', category: 'consumable' },
  'C-SP-08': { name: 'Broadcast Amplifier', desc: 'Next memory broadcast +5 vibrancy', icon: '\u2697', category: 'consumable' },
  'C-SP-09': { name: 'Dissolved Essence', desc: 'Restore 50% HP and 50% SP', icon: '\u2697', category: 'consumable' },
  'C-SP-10': { name: 'Phoenix Feather', desc: 'Auto-revive at 30% HP on death', icon: '\u2697', category: 'consumable' },
  // Buffs
  'C-BF-01': { name: 'Strength Seed', desc: 'ATK +15% for 3 turns', icon: '\u2726', category: 'consumable' },
  'C-BF-02': { name: 'Wisdom Seed', desc: 'INT +15% for 3 turns', icon: '\u2726', category: 'consumable' },
  'C-BF-03': { name: 'Aegis Seed', desc: 'DEF +15% for 3 turns', icon: '\u2726', category: 'consumable' },
  'C-BF-04': { name: 'Haste Seed', desc: 'AGI +15% for 3 turns', icon: '\u2726', category: 'consumable' },
  'C-BF-05': { name: 'Memory Incense', desc: 'Grant Inspired (+20% all stats, 3 turns)', icon: '\u2726', category: 'consumable' },
  // Status Cures
  'C-SC-01': { name: 'Antidote', desc: 'Cure Poison', icon: '\u2727', category: 'consumable' },
  'C-SC-02': { name: 'Haste Charm', desc: 'Cure Slow. AGI +20% for 2 turns', icon: '\u2727', category: 'consumable' },
  'C-SC-03': { name: 'Fortify Tonic', desc: 'Cure Weakness. DEF +20% for 2 turns', icon: '\u2727', category: 'consumable' },
  'C-SC-04': { name: 'Stasis Breaker', desc: 'Cure Stasis. Immunity for 3 turns', icon: '\u2727', category: 'consumable' },
  'C-SC-05': { name: 'Panacea', desc: 'Cure ALL status effects', icon: '\u2727', category: 'consumable' },
  // Swords
  'W-SW-01': { name: 'Training Sword', desc: 'ATK +5', icon: '\u2694', category: 'weapon' },
  'W-SW-02': { name: 'Iron Blade', desc: 'ATK +10', icon: '\u2694', category: 'weapon' },
  'W-SW-03': { name: "Oathkeeper's Edge", desc: 'ATK +16. +5% Oath Strike damage', icon: '\u2694', category: 'weapon' },
  'W-SW-04': { name: 'Brightwater Saber', desc: 'ATK +22. Water element attacks', icon: '\u2694', category: 'weapon' },
  'W-SW-05': { name: 'Ridgewalker Claymore', desc: 'ATK +28. +10% ATK when HP >75%', icon: '\u2694', category: 'weapon' },
  'W-SW-06': { name: 'Frontier Greatsword', desc: 'ATK +35. +15% vs Preservers', icon: '\u2694', category: 'weapon' },
  'W-SW-07': { name: 'Oath-Forged Blade', desc: 'ATK +42. +3% ATK per oath', icon: '\u2694', category: 'weapon' },
  'W-SW-08': { name: "Memory's Edge", desc: 'ATK +50. Scales with fragments', icon: '\u2694', category: 'weapon' },
  // Daggers
  'W-DG-01': { name: 'Worn Knife', desc: 'ATK +4', icon: '\u2020', category: 'weapon' },
  'W-DG-02': { name: 'Steel Stiletto', desc: 'ATK +8', icon: '\u2020', category: 'weapon' },
  'W-DG-03': { name: 'Windmill Blade', desc: 'ATK +13. +10% crit chance', icon: '\u2020', category: 'weapon' },
  'W-DG-04': { name: 'Shadow Fang', desc: 'ATK +19. Enhanced Foreshadow', icon: '\u2020', category: 'weapon' },
  'W-DG-05': { name: 'Flickerblade', desc: 'ATK +25. 20% double attack', icon: '\u2020', category: 'weapon' },
  'W-DG-06': { name: 'Phantom Edge', desc: 'ATK +32. Extended Vanishing Act', icon: '\u2020', category: 'weapon' },
  'W-DG-07': { name: 'Temporal Shard', desc: 'ATK +39. +25% Temporal Ambush', icon: '\u2020', category: 'weapon' },
  'W-DG-08': { name: 'Echo of Tomorrow', desc: 'ATK +47. Enhanced Echo Dodge', icon: '\u2020', category: 'weapon' },
  // Staves
  'W-ST-01': { name: 'Wooden Staff', desc: 'INT +4', icon: '\u2606', category: 'weapon' },
  'W-ST-02': { name: "Maren's Blessing Rod", desc: 'INT +8. +5% healing', icon: '\u2606', category: 'weapon' },
  'W-ST-03': { name: 'Hearthstone Staff', desc: 'INT +14. Enhanced Cleanse', icon: '\u2606', category: 'weapon' },
  'W-ST-04': { name: 'Riverside Crosier', desc: 'INT +20. +10% shield strength', icon: '\u2606', category: 'weapon' },
  'W-ST-05': { name: "Marsh Hermit's Crook", desc: 'INT +26. -15% heal SP cost', icon: '\u2606', category: 'weapon' },
  'W-ST-06': { name: "Luminary's Scepter", desc: 'INT +33. +20% group healing', icon: '\u2606', category: 'weapon' },
  'W-ST-07': { name: 'Euphoric Wand', desc: 'INT +40. Doubled charge bonus', icon: '\u2606', category: 'weapon' },
  'W-ST-08': { name: 'First Light', desc: 'INT +48. Heals grant Inspired', icon: '\u2606', category: 'weapon' },
  // Wands
  'W-WD-01': { name: 'Apprentice Wand', desc: 'INT +5', icon: '\u2605', category: 'weapon' },
  'W-WD-02': { name: 'Amber Focus', desc: 'INT +9. +5% spell damage', icon: '\u2605', category: 'weapon' },
  'W-WD-03': { name: 'Windcatcher Rod', desc: 'INT +15. +15% wind damage', icon: '\u2605', category: 'weapon' },
  'W-WD-04': { name: 'Prism Wand', desc: 'INT +21. Eureka hits weakness', icon: '\u2605', category: 'weapon' },
  'W-WD-05': { name: 'Resonance Tuner', desc: 'INT +27. AoE hits back row', icon: '\u2605', category: 'weapon' },
  'W-WD-06': { name: 'Arcane Catalyst', desc: 'INT +34. +20% Storm damage', icon: '\u2605', category: 'weapon' },
  'W-WD-07': { name: "Inspiration's Core", desc: 'INT +41. Reduced Grand cost', icon: '\u2605', category: 'weapon' },
  'W-WD-08': { name: 'Dissolved Memory Lens', desc: 'INT +49. +10% spell, 2x weakness', icon: '\u2605', category: 'weapon' },
  // Armor
  'A-01': { name: "Traveler's Tunic", desc: 'DEF +3', icon: '\u25C6', category: 'armor' },
  'A-02': { name: 'Padded Vest', desc: 'DEF +6', icon: '\u25C6', category: 'armor' },
  'A-03': { name: 'Leather Armor', desc: 'DEF +10. +5% HP', icon: '\u25C6', category: 'armor' },
  'A-04': { name: 'Chain Mail', desc: 'DEF +15', icon: '\u25C6', category: 'armor' },
  'A-05': { name: 'Forest Weave', desc: 'DEF +12. +10% evasion', icon: '\u25C6', category: 'armor' },
  'A-06': { name: 'Riverstone Plate', desc: 'DEF +18. Water resist, poison immune', icon: '\u25C6', category: 'armor' },
  'A-07': { name: "Hermit's Robe", desc: 'DEF +14. +20% SP regen on Defend', icon: '\u25C6', category: 'armor' },
  'A-08': { name: "Ridgewalker's Coat", desc: 'DEF +20. +10% ATK, wind resist', icon: '\u25C6', category: 'armor' },
  'A-09': { name: 'Frontier Guard', desc: 'DEF +25. +15% Stasis resist', icon: '\u25C6', category: 'armor' },
  'A-10': { name: "Preserver's Crystal Mail", desc: 'DEF +30. +20% DEF, Stasis immune', icon: '\u25C6', category: 'armor' },
  'A-11': { name: 'Luminary Vestment', desc: 'DEF +22. +20% healing received', icon: '\u25C6', category: 'armor' },
  'A-12': { name: 'Verdant Mantle', desc: 'DEF +28. Regen 2% HP per turn', icon: '\u25C6', category: 'armor' },
  'A-13': { name: 'Sketchweave Cloak', desc: 'DEF +24. +20% evasion', icon: '\u25C6', category: 'armor' },
  'A-14': { name: 'Memory-Woven Plate', desc: 'DEF +35. Scales with fragments', icon: '\u25C6', category: 'armor' },
};

// ── Weapon / Armor Stat Tables (client-side mirror for stat comparison) ──────

interface WeaponDef {
  statType: 'atk' | 'int';
  statBonus: number;
}

const WEAPON_STATS: Record<string, WeaponDef> = {
  'W-SW-01': { statType: 'atk', statBonus: 5 },
  'W-SW-02': { statType: 'atk', statBonus: 10 },
  'W-SW-03': { statType: 'atk', statBonus: 16 },
  'W-SW-04': { statType: 'atk', statBonus: 22 },
  'W-SW-05': { statType: 'atk', statBonus: 28 },
  'W-SW-06': { statType: 'atk', statBonus: 35 },
  'W-SW-07': { statType: 'atk', statBonus: 42 },
  'W-SW-08': { statType: 'atk', statBonus: 50 },
  'W-DG-01': { statType: 'atk', statBonus: 4 },
  'W-DG-02': { statType: 'atk', statBonus: 8 },
  'W-DG-03': { statType: 'atk', statBonus: 13 },
  'W-DG-04': { statType: 'atk', statBonus: 19 },
  'W-DG-05': { statType: 'atk', statBonus: 25 },
  'W-DG-06': { statType: 'atk', statBonus: 32 },
  'W-DG-07': { statType: 'atk', statBonus: 39 },
  'W-DG-08': { statType: 'atk', statBonus: 47 },
  'W-ST-01': { statType: 'int', statBonus: 4 },
  'W-ST-02': { statType: 'int', statBonus: 8 },
  'W-ST-03': { statType: 'int', statBonus: 14 },
  'W-ST-04': { statType: 'int', statBonus: 20 },
  'W-ST-05': { statType: 'int', statBonus: 26 },
  'W-ST-06': { statType: 'int', statBonus: 33 },
  'W-ST-07': { statType: 'int', statBonus: 40 },
  'W-ST-08': { statType: 'int', statBonus: 48 },
  'W-WD-01': { statType: 'int', statBonus: 5 },
  'W-WD-02': { statType: 'int', statBonus: 9 },
  'W-WD-03': { statType: 'int', statBonus: 15 },
  'W-WD-04': { statType: 'int', statBonus: 21 },
  'W-WD-05': { statType: 'int', statBonus: 27 },
  'W-WD-06': { statType: 'int', statBonus: 34 },
  'W-WD-07': { statType: 'int', statBonus: 41 },
  'W-WD-08': { statType: 'int', statBonus: 49 },
};

const ARMOR_STATS: Record<string, number> = {
  'A-01': 3, 'A-02': 6, 'A-03': 10, 'A-04': 15,
  'A-05': 12, 'A-06': 18, 'A-07': 14, 'A-08': 20,
  'A-09': 25, 'A-10': 30, 'A-11': 22, 'A-12': 28,
  'A-13': 24, 'A-14': 35,
};

// ── Item Prices (client-side mirror for sell prices — 50% of base) ──────────

const ITEM_PRICES: Record<string, number> = {
  'C-HP-01': 30, 'C-HP-02': 80, 'C-HP-03': 180, 'C-HP-04': 500,
  'C-SP-01': 25, 'C-SP-02': 70, 'C-SP-03': 160, 'C-SP-04': 450,
  'C-SP-05': 40, 'C-SP-06': 200, 'C-SP-07': 150, 'C-SP-08': 300,
  'C-SP-09': 0, 'C-SP-10': 0,
  'C-BF-01': 100, 'C-BF-02': 100, 'C-BF-03': 100, 'C-BF-04': 100, 'C-BF-05': 350,
  'C-SC-01': 20, 'C-SC-02': 60, 'C-SC-03': 60, 'C-SC-04': 120, 'C-SC-05': 200,
  'W-SW-01': 0, 'W-SW-02': 80, 'W-SW-03': 250, 'W-SW-04': 400,
  'W-SW-05': 600, 'W-SW-06': 900, 'W-SW-07': 0, 'W-SW-08': 0,
  'W-DG-01': 0, 'W-DG-02': 75, 'W-DG-03': 200, 'W-DG-04': 350,
  'W-DG-05': 550, 'W-DG-06': 900, 'W-DG-07': 0, 'W-DG-08': 0,
  'W-ST-01': 0, 'W-ST-02': 70, 'W-ST-03': 220, 'W-ST-04': 380,
  'W-ST-05': 0, 'W-ST-06': 850, 'W-ST-07': 0, 'W-ST-08': 0,
  'W-WD-01': 0, 'W-WD-02': 90, 'W-WD-03': 240, 'W-WD-04': 420,
  'W-WD-05': 650, 'W-WD-06': 950, 'W-WD-07': 0, 'W-WD-08': 0,
  'A-01': 0, 'A-02': 60, 'A-03': 120, 'A-04': 300,
  'A-05': 250, 'A-06': 450, 'A-07': 0, 'A-08': 500,
  'A-09': 800, 'A-10': 0, 'A-11': 1000, 'A-12': 0,
  'A-13': 0, 'A-14': 0,
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function readVar(player: any, key: string): unknown {
  if (!player) return undefined;
  if (player.variables instanceof Map) {
    return player.variables.get(key);
  }
  if (Array.isArray(player.variables)) {
    const entry = player.variables.find((e: [string, unknown]) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
  return undefined;
}

interface ShopItemData {
  itemId: string;
  name: string;
  price: number;
}

interface SellableItem {
  id: string;
  name: string;
  desc: string;
  icon: string;
  qty: number;
  category: 'consumable' | 'weapon' | 'armor' | 'key-item';
  sellPrice: number;
}

interface StatCompare {
  label: string;
  current: number;
  next: number;
  diff: number;
  diffStr: string;
  cls: string;
}

// ── Component ───────────────────────────────────────────────────────────────

export default defineComponent({
  name: 'shop-screen',
  setup() {
    const open = ref(false);
    const activeTab = ref<'buy' | 'sell'>('buy');
    const selectedBuyId = ref<string | null>(null);
    const selectedSellId = ref<string | null>(null);
    const buyQty = ref(1);
    const sellQty = ref(1);
    const confirmAction = ref<'buy' | 'sell' | null>(null);
    const resultMessage = ref('');
    const resultSuccess = ref(true);

    // Player data (reactive via subscription)
    const gold = ref(0);
    const inventory = ref<Record<string, number>>({});
    const equipment = ref<{ weapon: string | null; armor: string | null; accessory: string | null }>({
      weapon: null,
      armor: null,
      accessory: null,
    });

    // Shop data (set by server via player variable)
    const shopName = ref('Shop');
    const shopItems = ref<ShopItemData[]>([]);

    // Injections
    const rpgCurrentPlayer = inject<any>('rpgCurrentPlayer');
    const rpgGuiInteraction = inject<any>('rpgGuiInteraction');

    let subscription: { unsubscribe(): void } | null = null;
    let resultTimer: ReturnType<typeof setTimeout> | null = null;

    // ── Computed ──

    const selectedBuyInfo = computed(() => {
      const id = selectedBuyId.value;
      if (!id) return null;
      const shopItem = shopItems.value.find((i) => i.itemId === id);
      if (!shopItem) return null;
      const info = ITEM_CATALOG[id];
      return {
        id,
        name: shopItem.name,
        price: shopItem.price,
        desc: info?.desc ?? '',
        icon: info?.icon ?? '\u2726',
        category: info?.category ?? 'consumable',
      };
    });

    const buyTotal = computed(() => {
      const info = selectedBuyInfo.value;
      if (!info) return 0;
      return info.price * buyQty.value;
    });

    const canIncreaseBuyQty = computed(() => {
      const info = selectedBuyInfo.value;
      if (!info) return false;
      return gold.value >= info.price * (buyQty.value + 1);
    });

    const buyStatComparison = computed<StatCompare[]>(() => {
      const info = selectedBuyInfo.value;
      if (!info) return [];

      if (info.category === 'weapon') {
        const newWep = WEAPON_STATS[info.id];
        if (!newWep) return [];
        const curId = equipment.value.weapon;
        const curWep = curId ? WEAPON_STATS[curId] : null;
        const label = newWep.statType === 'atk' ? 'ATK' : 'INT';
        const curVal = curWep && curWep.statType === newWep.statType ? curWep.statBonus : 0;
        const diff = newWep.statBonus - curVal;
        return [{
          label,
          current: curVal,
          next: newWep.statBonus,
          diff,
          diffStr: diff > 0 ? `+${diff}` : `${diff}`,
          cls: diff > 0 ? 'stat-up' : diff < 0 ? 'stat-down' : 'stat-same',
        }];
      }

      if (info.category === 'armor') {
        const newDef = ARMOR_STATS[info.id];
        if (newDef === undefined) return [];
        const curId = equipment.value.armor;
        const curDef = curId && ARMOR_STATS[curId] !== undefined ? ARMOR_STATS[curId] : 0;
        const diff = newDef - curDef;
        return [{
          label: 'DEF',
          current: curDef,
          next: newDef,
          diff,
          diffStr: diff > 0 ? `+${diff}` : `${diff}`,
          cls: diff > 0 ? 'stat-up' : diff < 0 ? 'stat-down' : 'stat-same',
        }];
      }

      return [];
    });

    const sellableItems = computed<SellableItem[]>(() => {
      const items: SellableItem[] = [];
      for (const [id, qty] of Object.entries(inventory.value)) {
        if (qty <= 0) continue;
        const info = ITEM_CATALOG[id];
        if (!info || info.category === 'key-item') continue;
        const basePrice = ITEM_PRICES[id];
        if (basePrice === undefined) continue;
        items.push({
          id,
          qty,
          ...info,
          sellPrice: Math.floor(basePrice * 0.5),
        });
      }
      const order = { consumable: 0, weapon: 1, armor: 2, 'key-item': 3 };
      items.sort((a, b) => order[a.category] - order[b.category] || a.name.localeCompare(b.name));
      return items;
    });

    const selectedSellInfo = computed(() => {
      const id = selectedSellId.value;
      if (!id) return null;
      return sellableItems.value.find((i) => i.id === id) ?? null;
    });

    const sellTotal = computed(() => {
      const info = selectedSellInfo.value;
      if (!info) return 0;
      return info.sellPrice * sellQty.value;
    });

    // ── Methods ──

    function itemIcon(itemId: string): string {
      return ITEM_CATALOG[itemId]?.icon ?? '\u2726';
    }

    function close() {
      open.value = false;
      selectedBuyId.value = null;
      selectedSellId.value = null;
      confirmAction.value = null;
      resultMessage.value = '';
      rpgGuiInteraction?.('shop-screen', 'close', {});
    }

    function selectBuyItem(itemId: string) {
      selectedBuyId.value = selectedBuyId.value === itemId ? null : itemId;
      buyQty.value = 1;
      confirmAction.value = null;
    }

    function selectSellItem(itemId: string) {
      selectedSellId.value = selectedSellId.value === itemId ? null : itemId;
      sellQty.value = 1;
      confirmAction.value = null;
    }

    function adjustBuyQty(delta: number) {
      const next = buyQty.value + delta;
      if (next < 1) return;
      const info = selectedBuyInfo.value;
      if (!info) return;
      if (gold.value < info.price * next) return;
      buyQty.value = next;
    }

    function adjustSellQty(delta: number) {
      const next = sellQty.value + delta;
      if (next < 1) return;
      const info = selectedSellInfo.value;
      if (!info) return;
      if (next > info.qty) return;
      sellQty.value = next;
    }

    function showResult(message: string, success: boolean) {
      resultMessage.value = message;
      resultSuccess.value = success;
      if (resultTimer) clearTimeout(resultTimer);
      resultTimer = setTimeout(() => {
        resultMessage.value = '';
      }, 2500);
    }

    function executeBuy() {
      const info = selectedBuyInfo.value;
      if (!info) return;
      rpgGuiInteraction?.('shop-screen', 'buy-item', {
        itemId: info.id,
        qty: buyQty.value,
      });
      confirmAction.value = null;
      buyQty.value = 1;
    }

    function executeSell() {
      const info = selectedSellInfo.value;
      if (!info) return;
      rpgGuiInteraction?.('shop-screen', 'sell-item', {
        itemId: info.id,
        qty: sellQty.value,
      });
      confirmAction.value = null;
      // Clear selection if item will be fully sold
      if (sellQty.value >= info.qty) {
        selectedSellId.value = null;
      }
      sellQty.value = 1;
    }

    // ── Lifecycle ──

    onMounted(() => {
      if (rpgCurrentPlayer) {
        subscription = rpgCurrentPlayer.subscribe(({ object }: { object: any }) => {
          if (!object) return;

          // Gold
          const builtinGold = object.gold;
          const varGold = readVar(object, 'GOLD') as number | undefined;
          gold.value = builtinGold || varGold || 0;

          // Inventory
          const inv = readVar(object, 'INVENTORY') as Record<string, number> | undefined;
          inventory.value = inv ? { ...inv } : {};

          // Equipment
          const equip = readVar(object, 'EQUIPMENT') as {
            weapon: string | null;
            armor: string | null;
            accessory: string | null;
          } | undefined;
          equipment.value = equip ?? { weapon: null, armor: null, accessory: null };

          // Shop data (set by server when opening shop)
          const shop = readVar(object, 'SHOP_DATA') as {
            shopId: string;
            shopName: string;
            items: ShopItemData[];
          } | undefined;
          if (shop) {
            shopName.value = shop.shopName;
            shopItems.value = shop.items;
            open.value = true;
          }

          // Result message from server
          const result = readVar(object, 'SHOP_RESULT') as {
            message: string;
            success: boolean;
          } | undefined;
          if (result && result.message) {
            showResult(result.message, result.success);
          }
        });
      }
    });

    onUnmounted(() => {
      subscription?.unsubscribe();
      if (resultTimer) clearTimeout(resultTimer);
    });

    return {
      open,
      activeTab,
      gold,
      shopName,
      shopItems,
      selectedBuyId,
      selectedSellId,
      buyQty,
      sellQty,
      confirmAction,
      resultMessage,
      resultSuccess,
      selectedBuyInfo,
      buyTotal,
      canIncreaseBuyQty,
      buyStatComparison,
      sellableItems,
      selectedSellInfo,
      sellTotal,
      itemIcon,
      close,
      selectBuyItem,
      selectSellItem,
      adjustBuyQty,
      adjustSellQty,
      executeBuy,
      executeSell,
    };
  },
});
</script>

<style scoped>
/* ── Overlay ─────────────────────────────────── */
.shop-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 500;
  font-family: var(--font-body, 'Merriweather', serif);
  color: var(--text-primary, #d4c4a0);
}

/* ── Panel ───────────────────────────────────── */
.shop-panel {
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  background: linear-gradient(180deg, #1a0a0a 0%, #0d0505 100%);
  border: 2px solid var(--border-primary, #8b1f1f);
  border-radius: 6px;
  padding: 1.25rem;
  box-sizing: border-box;
  box-shadow: 0 0 60px rgba(139, 31, 31, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
}

/* ── Header ──────────────────────────────────── */
.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.75rem;
}

.shop-title {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 1.3rem;
  color: var(--text-accent, #b8860b);
  text-shadow: 0 0 15px rgba(184, 134, 11, 0.4);
  margin: 0;
  flex: 1;
}

.shop-gold {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  border: 1px solid rgba(218, 165, 32, 0.4);
  flex-shrink: 0;
}

.gold-icon {
  color: #daa520;
  font-size: 1.1rem;
  text-shadow: 0 0 6px rgba(218, 165, 32, 0.5);
}

.gold-amount {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-bright, #f0e6d0);
}

.shop-close {
  background: none;
  border: 1px solid #5a2a2a;
  color: #888;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.shop-close:hover { color: var(--text-primary, #d4c4a0); border-color: var(--border-primary, #8b1f1f); }

/* ── Tabs ─────────────────────────────────────── */
.tab-bar {
  display: flex;
  gap: 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid #5a2a2a;
}

.tab {
  flex: 1;
  padding: 0.6rem 0.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary, #8a7a60);
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tab:hover { color: var(--text-primary, #d4c4a0); }
.tab.active {
  color: var(--text-accent, #b8860b);
  border-bottom-color: var(--text-accent, #b8860b);
  text-shadow: 0 0 8px rgba(184, 134, 11, 0.3);
}

/* ── Tab Content ─────────────────────────────── */
.tab-content {
  min-height: 200px;
}

/* ── Items Layout (split list + detail) ──────── */
.items-layout {
  display: flex;
  gap: 1rem;
  min-height: 200px;
}

.item-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 50vh;
  overflow-y: auto;
}

.item-detail {
  flex: 1;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ── Item Rows ───────────────────────────────── */
.item-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.6rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid transparent;
  border-radius: 3px;
  color: var(--text-primary, #d4c4a0);
  font-family: var(--font-body, 'Merriweather', serif);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.item-row:hover {
  border-color: #5a2a2a;
  background: rgba(139, 31, 31, 0.15);
}

.item-row.selected {
  border-color: var(--text-accent, #b8860b);
  background: rgba(184, 134, 11, 0.1);
  box-shadow: 0 0 8px rgba(184, 134, 11, 0.15);
}

.item-row.cannot-afford {
  opacity: 0.5;
}

.item-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.item-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  font-size: 0.7rem;
  color: #daa520;
  font-family: var(--font-heading, 'Cinzel', serif);
  flex-shrink: 0;
}

.item-qty {
  font-size: 0.65rem;
  color: var(--text-secondary, #8a7a60);
  flex-shrink: 0;
}

.sell-price {
  color: #40c540;
}

/* ── Item Detail ─────────────────────────────── */
.detail-name {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.95rem;
  color: var(--text-primary, #d4c4a0);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.detail-icon {
  font-size: 1.2rem;
}

.detail-desc {
  font-size: 0.7rem;
  color: var(--text-secondary, #8a7a60);
  line-height: 1.5;
  margin: 0;
}

.detail-price {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.85rem;
  color: #daa520;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.sell-label {
  color: #40c540;
}

/* ── Stat Comparison ─────────────────────────── */
.stat-compare {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
  border-radius: 3px;
  padding: 0.5rem;
}

.compare-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
}

.compare-label {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-weight: 700;
  color: var(--text-accent, #b8860b);
  width: 28px;
}

.compare-current {
  color: var(--text-secondary, #8a7a60);
}

.compare-arrow {
  color: #555;
  font-size: 0.6rem;
}

.compare-new {
  font-weight: 700;
}

.compare-diff {
  font-size: 0.6rem;
  margin-left: 0.2rem;
}

.stat-up { color: #40c540; }
.stat-down { color: #c54040; }
.stat-same { color: var(--text-secondary, #8a7a60); }

/* ── Quantity Selector ───────────────────────── */
.qty-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-btn {
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #5a2a2a;
  border-radius: 3px;
  color: var(--text-primary, #d4c4a0);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.qty-btn:hover:not(:disabled) {
  border-color: var(--text-accent, #b8860b);
  background: rgba(184, 134, 11, 0.15);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.qty-value {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.9rem;
  min-width: 24px;
  text-align: center;
}

.qty-total {
  font-size: 0.7rem;
  color: #daa520;
  font-family: var(--font-heading, 'Cinzel', serif);
  margin-left: auto;
}

/* ── Confirm Area ────────────────────────────── */
.confirm-area {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  padding: 0.6rem;
  margin-top: auto;
}

.confirm-msg {
  font-size: 0.7rem;
  color: var(--text-primary, #d4c4a0);
  margin: 0 0 0.5rem;
  text-align: center;
}

.confirm-buttons {
  display: flex;
  gap: 0.5rem;
}

/* ── Action Buttons ──────────────────────────── */
.action-btn {
  flex: 1;
  padding: 0.6rem;
  border-radius: 4px;
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  min-height: 40px;
  -webkit-tap-highlight-color: transparent;
}

.buy-btn {
  background: linear-gradient(135deg, rgba(100, 80, 30, 0.4) 0%, rgba(60, 45, 15, 0.6) 100%);
  border: 1px solid #8a7a3a;
  color: #d4c890;
  margin-top: auto;
  width: 100%;
}
.buy-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(130, 100, 40, 0.5) 0%, rgba(80, 60, 20, 0.7) 100%);
  box-shadow: 0 0 15px rgba(184, 134, 11, 0.3);
}
.buy-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.sell-btn {
  background: linear-gradient(135deg, rgba(64, 130, 64, 0.4) 0%, rgba(30, 70, 30, 0.6) 100%);
  border: 1px solid #4a8a4a;
  color: #a0d4a0;
  margin-top: auto;
  width: 100%;
}
.sell-btn:hover {
  background: linear-gradient(135deg, rgba(64, 160, 64, 0.5) 0%, rgba(30, 90, 30, 0.7) 100%);
  box-shadow: 0 0 15px rgba(64, 160, 64, 0.3);
}

.confirm-yes {
  background: linear-gradient(135deg, rgba(64, 130, 64, 0.4) 0%, rgba(30, 70, 30, 0.6) 100%);
  border: 1px solid #4a8a4a;
  color: #a0d4a0;
}
.confirm-yes:hover {
  background: linear-gradient(135deg, rgba(64, 160, 64, 0.5) 0%, rgba(30, 90, 30, 0.7) 100%);
  box-shadow: 0 0 15px rgba(64, 160, 64, 0.3);
}

.confirm-no {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #5a2a2a;
  color: var(--text-secondary, #8a7a60);
}
.confirm-no:hover {
  border-color: #8b1f1f;
  color: var(--text-primary, #d4c4a0);
}

.action-btn:active { transform: scale(0.97); }

.action-icon { margin-right: 0.3rem; }

/* ── Result Message ──────────────────────────── */
.result-msg {
  text-align: center;
  font-size: 0.75rem;
  padding: 0.4rem 0.6rem;
  border-radius: 3px;
  margin-top: 0.75rem;
}

.msg-success {
  background: rgba(64, 197, 64, 0.15);
  border: 1px solid rgba(64, 197, 64, 0.3);
  color: #40c540;
}

.msg-fail {
  background: rgba(197, 64, 64, 0.15);
  border: 1px solid rgba(197, 64, 64, 0.3);
  color: #c54040;
}

/* ── Empty State ─────────────────────────────── */
.empty-msg {
  font-size: 0.75rem;
  color: var(--text-secondary, #8a7a60);
  font-style: italic;
  text-align: center;
  padding: 2rem 0;
  margin: 0;
}

/* ── Desktop ─────────────────────────────────── */
@media (min-width: 600px) {
  .shop-panel {
    padding: 1.5rem 2rem;
  }
  .shop-title {
    font-size: 1.5rem;
  }
}

/* ── Mobile: stack detail below list ─────────── */
@media (max-width: 599px) {
  .items-layout {
    flex-direction: column;
  }
  .item-list {
    max-height: 30vh;
  }
}

/* ── Reduced Motion ──────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .item-row,
  .action-btn,
  .tab,
  .shop-close,
  .qty-btn {
    transition: none;
  }
}
</style>
