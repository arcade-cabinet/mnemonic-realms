<template>
  <div class="inventory-overlay" v-if="open" @click.self="close">
    <div class="inventory-panel">
      <!-- Header -->
      <div class="inv-header">
        <h2 class="inv-title">Inventory</h2>
        <button class="inv-close" @click="close">&#x2715;</button>
      </div>

      <!-- Tabs -->
      <div class="tab-bar">
        <button
          class="tab"
          :class="{ active: activeTab === 'items' }"
          @click="activeTab = 'items'"
        >Items</button>
        <button
          class="tab"
          :class="{ active: activeTab === 'equipment' }"
          @click="activeTab = 'equipment'"
        >Equipment</button>
        <button
          class="tab"
          :class="{ active: activeTab === 'key-items' }"
          @click="activeTab = 'key-items'"
        >Key Items</button>
      </div>

      <!-- Items Tab -->
      <div class="tab-content" v-if="activeTab === 'items'">
        <div class="items-layout">
          <div class="item-list">
            <p class="empty-msg" v-if="regularItems.length === 0">No items</p>
            <button
              class="item-row"
              v-for="item in regularItems"
              :key="item.id"
              :class="{ selected: selectedItemId === item.id }"
              @click="selectItem(item.id)"
              @mouseenter="hoveredItemId = item.id"
              @mouseleave="hoveredItemId = null"
            >
              <span class="item-icon">{{ item.icon }}</span>
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">x{{ item.qty }}</span>
            </button>
          </div>

          <div class="item-detail" v-if="selectedItemInfo">
            <h3 class="detail-name">
              <span class="detail-icon">{{ selectedItemInfo.icon }}</span>
              {{ selectedItemInfo.name }}
            </h3>
            <p class="detail-desc">{{ selectedItemInfo.desc }}</p>

            <!-- Stat comparison for equipment -->
            <div class="stat-compare" v-if="statComparison.length > 0">
              <div class="compare-row" v-for="comp in statComparison" :key="comp.label">
                <span class="compare-label">{{ comp.label }}</span>
                <span class="compare-current">{{ comp.current }}</span>
                <span class="compare-arrow">&#x2192;</span>
                <span class="compare-new" :class="comp.cls">{{ comp.next }}</span>
                <span class="compare-diff" :class="comp.cls">({{ comp.diffStr }})</span>
              </div>
            </div>

            <button
              class="action-btn use-btn"
              v-if="selectedItemInfo.category === 'consumable'"
              @click="onUseItem(selectedItemInfo.id)"
            >
              <span class="action-icon">&#x2726;</span> Use
            </button>
            <button
              class="action-btn equip-btn"
              v-if="selectedItemInfo.category === 'weapon'"
              @click="onEquipItem('weapon', selectedItemInfo.id)"
            >
              <span class="action-icon">&#x2694;</span> Equip
            </button>
            <button
              class="action-btn equip-btn"
              v-if="selectedItemInfo.category === 'armor'"
              @click="onEquipItem('armor', selectedItemInfo.id)"
            >
              <span class="action-icon">&#x25C6;</span> Equip
            </button>
          </div>
        </div>
      </div>

      <!-- Equipment Tab -->
      <div class="tab-content" v-if="activeTab === 'equipment'">
        <div class="equip-slots">
          <div class="equip-slot">
            <span class="slot-label">Weapon</span>
            <div class="slot-item" :class="{ 'slot-empty': !equipment.weapon }">
              <span class="slot-icon">&#x2694;</span>
              <span class="slot-name">{{ equippedName('weapon') }}</span>
              <span class="slot-stat" v-if="equipment.weapon && weaponStatStr(equipment.weapon)">
                {{ weaponStatStr(equipment.weapon) }}
              </span>
            </div>
          </div>
          <div class="equip-slot">
            <span class="slot-label">Armor</span>
            <div class="slot-item" :class="{ 'slot-empty': !equipment.armor }">
              <span class="slot-icon">&#x25C6;</span>
              <span class="slot-name">{{ equippedName('armor') }}</span>
              <span class="slot-stat" v-if="equipment.armor && armorStatStr(equipment.armor)">
                {{ armorStatStr(equipment.armor) }}
              </span>
            </div>
          </div>
          <div class="equip-slot">
            <span class="slot-label">Accessory</span>
            <div class="slot-item" :class="{ 'slot-empty': !equipment.accessory }">
              <span class="slot-icon">&#x2726;</span>
              <span class="slot-name">{{ equippedName('accessory') }}</span>
            </div>
          </div>
        </div>

        <div class="equip-bonuses">
          <h3 class="bonuses-title">Equipment Bonuses</h3>
          <div class="bonus-grid">
            <div class="bonus-row">
              <span class="bonus-label">ATK</span>
              <span class="bonus-value" :class="{ 'has-bonus': equipBonuses.atk > 0 }">
                +{{ equipBonuses.atk }}
              </span>
            </div>
            <div class="bonus-row">
              <span class="bonus-label">DEF</span>
              <span class="bonus-value" :class="{ 'has-bonus': equipBonuses.def > 0 }">
                +{{ equipBonuses.def }}
              </span>
            </div>
            <div class="bonus-row">
              <span class="bonus-label">INT</span>
              <span class="bonus-value" :class="{ 'has-bonus': equipBonuses.int > 0 }">
                +{{ equipBonuses.int }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Key Items Tab -->
      <div class="tab-content" v-if="activeTab === 'key-items'">
        <div class="item-list" v-if="keyItems.length > 0">
          <div class="item-row key-item-row" v-for="item in keyItems" :key="item.id">
            <span class="item-icon key-icon">{{ item.icon }}</span>
            <div class="key-item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="key-item-desc">{{ item.desc }}</span>
            </div>
          </div>
        </div>
        <p class="empty-msg" v-else>No key items collected</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed, onMounted, onUnmounted } from 'vue';

// ── Item Catalog ────────────────────────────────────────────────────────────

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
  // Memory Fragments (key items)
  'MF-GENERIC': { name: 'Memory Fragment', desc: 'Glowing amber crystal shard, warm golden light', icon: '\u2726', category: 'key-item' },
  'MF-JOY': { name: 'Fragment of Joy', desc: 'Bright golden crystal with sunlight glow', icon: '\u2726', category: 'key-item' },
  'MF-FURY': { name: 'Fragment of Fury', desc: 'Deep red crystal with forge-fire glow', icon: '\u2726', category: 'key-item' },
  'MF-SORROW': { name: 'Fragment of Sorrow', desc: 'Twilight purple crystal with luminous tears', icon: '\u2726', category: 'key-item' },
  'MF-AWE': { name: 'Fragment of Awe', desc: 'Aurora green crystal with prismatic sparkle', icon: '\u2726', category: 'key-item' },
  'MF-CALM': { name: 'Fragment of Calm', desc: 'Sky blue crystal with gentle steady glow', icon: '\u2726', category: 'key-item' },
};

// ── Weapon / Armor Stat Tables (client-side mirror for stat comparison) ──

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

interface DisplayItem {
  id: string;
  name: string;
  desc: string;
  icon: string;
  qty: number;
  category: 'consumable' | 'weapon' | 'armor' | 'key-item';
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
  name: 'inventory-screen',
  setup() {
    const open = ref(false);
    const activeTab = ref<'items' | 'equipment' | 'key-items'>('items');
    const selectedItemId = ref<string | null>(null);
    const hoveredItemId = ref<string | null>(null);

    // Player data (reactive via subscription)
    const inventory = ref<Record<string, number>>({});
    const equipment = ref<{ weapon: string | null; armor: string | null; accessory: string | null }>({
      weapon: null,
      armor: null,
      accessory: null,
    });
    const equipBonuses = ref<{ atk: number; def: number; int: number }>({ atk: 0, def: 0, int: 0 });
    const memoryFragments = ref<string[]>([]);

    // Injections
    const rpgCurrentPlayer = inject<any>('rpgCurrentPlayer');
    const rpgGuiInteraction = inject<any>('rpgGuiInteraction');

    let subscription: { unsubscribe(): void } | null = null;

    // ── Computed ──

    const regularItems = computed<DisplayItem[]>(() => {
      const items: DisplayItem[] = [];
      for (const [id, qty] of Object.entries(inventory.value)) {
        if (qty <= 0) continue;
        const info = ITEM_CATALOG[id];
        if (!info || info.category === 'key-item') continue;
        items.push({ id, qty, ...info });
      }
      // Sort: consumables first, then weapons, then armor
      const order = { consumable: 0, weapon: 1, armor: 2, 'key-item': 3 };
      items.sort((a, b) => order[a.category] - order[b.category] || a.name.localeCompare(b.name));
      return items;
    });

    const keyItems = computed<DisplayItem[]>(() => {
      const items: DisplayItem[] = [];
      for (const fragId of memoryFragments.value) {
        const info = ITEM_CATALOG[fragId];
        if (info) {
          items.push({ id: fragId, qty: 1, ...info });
        }
      }
      return items;
    });

    const activeItemId = computed(() => hoveredItemId.value ?? selectedItemId.value);

    const selectedItemInfo = computed<DisplayItem | null>(() => {
      const id = activeItemId.value;
      if (!id) return null;
      const info = ITEM_CATALOG[id];
      if (!info) return null;
      return { id, qty: inventory.value[id] ?? 0, ...info };
    });

    const statComparison = computed<StatCompare[]>(() => {
      const item = selectedItemInfo.value;
      if (!item) return [];

      if (item.category === 'weapon') {
        const newWep = WEAPON_STATS[item.id];
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

      if (item.category === 'armor') {
        const newDef = ARMOR_STATS[item.id];
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

    // ── Methods ──

    function close() {
      open.value = false;
      selectedItemId.value = null;
      hoveredItemId.value = null;
    }

    function selectItem(id: string) {
      selectedItemId.value = selectedItemId.value === id ? null : id;
    }

    function equippedName(slot: 'weapon' | 'armor' | 'accessory'): string {
      const id = equipment.value[slot];
      if (!id) return 'None';
      return ITEM_CATALOG[id]?.name ?? id;
    }

    function weaponStatStr(id: string): string {
      const wep = WEAPON_STATS[id];
      if (!wep) return '';
      return `${wep.statType === 'atk' ? 'ATK' : 'INT'} +${wep.statBonus}`;
    }

    function armorStatStr(id: string): string {
      const def = ARMOR_STATS[id];
      return def !== undefined ? `DEF +${def}` : '';
    }

    function onUseItem(itemId: string) {
      rpgGuiInteraction?.('inventory-screen', 'use-item', { itemId });
    }

    function onEquipItem(slot: string, itemId: string) {
      rpgGuiInteraction?.('inventory-screen', 'equip-item', { slot, itemId });
      selectedItemId.value = null;
    }

    // ── Lifecycle ──

    let keyHandler: ((e: KeyboardEvent) => void) | null = null;

    onMounted(() => {
      // Subscribe to player data changes
      if (rpgCurrentPlayer) {
        subscription = rpgCurrentPlayer.subscribe(({ object }: { object: any }) => {
          if (!object) return;

          const inv = readVar(object, 'INVENTORY') as Record<string, number> | undefined;
          inventory.value = inv ? { ...inv } : {};

          const equip = readVar(object, 'EQUIPMENT') as {
            weapon: string | null;
            armor: string | null;
            accessory: string | null;
          } | undefined;
          equipment.value = equip ?? { weapon: null, armor: null, accessory: null };

          const bonuses = readVar(object, 'EQUIP_BONUSES') as {
            atk: number;
            def: number;
            int: number;
          } | undefined;
          equipBonuses.value = bonuses ?? { atk: 0, def: 0, int: 0 };

          const frags = readVar(object, 'MEMORY_FRAGMENTS');
          memoryFragments.value = Array.isArray(frags) ? frags : [];
        });
      }

      // ESC key toggles inventory
      keyHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (open.value) {
            close();
          } else {
            open.value = true;
            activeTab.value = 'items';
          }
        }
      };
      window.addEventListener('keydown', keyHandler);
    });

    onUnmounted(() => {
      subscription?.unsubscribe();
      if (keyHandler) {
        window.removeEventListener('keydown', keyHandler);
      }
    });

    return {
      open,
      activeTab,
      selectedItemId,
      hoveredItemId,
      equipment,
      equipBonuses,
      regularItems,
      keyItems,
      selectedItemInfo,
      statComparison,
      close,
      selectItem,
      equippedName,
      weaponStatStr,
      armorStatStr,
      onUseItem,
      onEquipItem,
    };
  },
});
</script>

<style scoped>
/* ── Overlay ─────────────────────────────────── */
.inventory-overlay {
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
.inventory-panel {
  width: 100%;
  max-width: 560px;
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
.inv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.inv-title {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 1.3rem;
  color: var(--text-accent, #b8860b);
  text-shadow: 0 0 15px rgba(184, 134, 11, 0.4);
  margin: 0;
}

.inv-close {
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
}
.inv-close:hover { color: var(--text-primary, #d4c4a0); border-color: var(--border-primary, #8b1f1f); }

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
  font-size: 0.8rem;
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

.item-qty {
  font-size: 0.65rem;
  color: var(--text-secondary, #8a7a60);
  flex-shrink: 0;
}

/* ── Key Item rows ───────────────────────────── */
.key-item-row {
  cursor: default;
  flex-direction: row;
  align-items: flex-start;
  padding: 0.6rem;
}

.key-icon {
  color: var(--text-accent, #b8860b);
  text-shadow: 0 0 6px rgba(184, 134, 11, 0.5);
}

.key-item-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
}

.key-item-desc {
  font-size: 0.65rem;
  color: var(--text-secondary, #8a7a60);
  font-style: italic;
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

/* ── Action Buttons ──────────────────────────── */
.action-btn {
  width: 100%;
  padding: 0.6rem;
  border-radius: 4px;
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  min-height: 40px;
  margin-top: auto;
  -webkit-tap-highlight-color: transparent;
}

.use-btn {
  background: linear-gradient(135deg, rgba(64, 130, 64, 0.4) 0%, rgba(30, 70, 30, 0.6) 100%);
  border: 1px solid #4a8a4a;
  color: #a0d4a0;
}
.use-btn:hover {
  background: linear-gradient(135deg, rgba(64, 160, 64, 0.5) 0%, rgba(30, 90, 30, 0.7) 100%);
  box-shadow: 0 0 15px rgba(64, 160, 64, 0.3);
}

.equip-btn {
  background: linear-gradient(135deg, rgba(100, 80, 30, 0.4) 0%, rgba(60, 45, 15, 0.6) 100%);
  border: 1px solid #8a7a3a;
  color: #d4c890;
}
.equip-btn:hover {
  background: linear-gradient(135deg, rgba(130, 100, 40, 0.5) 0%, rgba(80, 60, 20, 0.7) 100%);
  box-shadow: 0 0 15px rgba(184, 134, 11, 0.3);
}

.action-btn:active { transform: scale(0.97); }

.action-icon { margin-right: 0.3rem; }

/* ── Equipment Tab ───────────────────────────── */
.equip-slots {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.equip-slot {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.slot-label {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-accent, #b8860b);
}

.slot-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
}

.slot-item.slot-empty {
  border-color: #333;
  opacity: 0.5;
}

.slot-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.slot-name {
  flex: 1;
  font-size: 0.8rem;
}

.slot-stat {
  font-size: 0.65rem;
  color: var(--text-accent, #b8860b);
  font-family: var(--font-heading, 'Cinzel', serif);
}

/* ── Equipment Bonuses ───────────────────────── */
.equip-bonuses {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
  border-radius: 4px;
  padding: 0.8rem;
}

.bonuses-title {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.75rem;
  color: var(--text-secondary, #8a7a60);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 0.5rem;
}

.bonus-grid {
  display: flex;
  gap: 1.5rem;
}

.bonus-row {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.bonus-label {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-secondary, #8a7a60);
}

.bonus-value {
  font-size: 0.7rem;
  color: var(--text-secondary, #8a7a60);
}

.bonus-value.has-bonus {
  color: #40c540;
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
  .inventory-panel {
    padding: 1.5rem 2rem;
  }
  .inv-title {
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
  .inv-close {
    transition: none;
  }
}
</style>
