<template>
  <div class="hud" v-if="visible">
    <!-- Top-left: Level + HP / SP bars -->
    <div class="hud-vitals">
      <div class="hud-level">
        <span class="level-label">Lv</span>
        <span class="level-value">{{ level }}</span>
      </div>
      <div class="hud-bar hp-bar">
        <span class="bar-label">HP</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: hpPercent + '%', background: hpGradient }" />
        </div>
        <span class="bar-value">{{ hp }}/{{ maxHp }}</span>
      </div>
      <div class="hud-bar sp-bar">
        <span class="bar-label">SP</span>
        <div class="bar-track">
          <div class="bar-fill sp-fill" :style="{ width: spPercent + '%' }" />
        </div>
        <span class="bar-value">{{ sp }}/{{ maxSp }}</span>
      </div>
    </div>

    <!-- Top-center: Zone name -->
    <div class="hud-zone-banner" v-if="zoneName">
      <span class="zone-name">{{ zoneName }}</span>
    </div>

    <!-- Top-right: Gold, fragments, quest -->
    <div class="hud-info">
      <div class="hud-gold">
        <span class="gold-icon">&#x2742;</span>
        <span class="gold-amount">{{ gold }}</span>
      </div>
      <div class="hud-fragments">
        <span class="frag-icon">&#x2726;</span>
        <span class="frag-count">{{ fragments }}</span>
      </div>
      <div class="hud-quest" v-if="questName">
        <span class="quest-name">{{ questName }}</span>
        <span class="quest-obj">{{ questObj }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed, onMounted, onUnmounted } from 'vue';
import { audioManager } from '../client/audio';

/**
 * Read a custom variable from the client-side player object.
 * Server variables are synced as an array of [key, value] pairs.
 */
function readVar(player: any, key: string): unknown {
  if (!player) return undefined;
  // Try Map first (RPG-JS may hydrate as Map in standalone)
  if (player.variables instanceof Map) {
    return player.variables.get(key);
  }
  // Serialized form: array of [key, value] tuples
  if (Array.isArray(player.variables)) {
    const entry = player.variables.find((e: [string, unknown]) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
  return undefined;
}

export default defineComponent({
  name: 'rpg-hud',
  setup() {
    const visible = ref(false);
    const hp = ref(0);
    const maxHp = ref(1);
    const sp = ref(0);
    const maxSp = ref(1);
    const level = ref(1);
    const gold = ref(0);
    const fragments = ref(0);
    const zoneName = ref('');
    const questName = ref('');
    const questObj = ref('');

    const hpPercent = computed(() => (maxHp.value > 0 ? (hp.value / maxHp.value) * 100 : 0));
    const spPercent = computed(() => (maxSp.value > 0 ? (sp.value / maxSp.value) * 100 : 0));

    // Dynamic HP gradient: green (>50%) → yellow (25-50%) → red (<25%)
    const hpGradient = computed(() => {
      const pct = hpPercent.value;
      if (pct > 50) {
        return 'linear-gradient(180deg, #40c540 0%, #1f8b1f 100%)';
      }
      if (pct > 25) {
        return 'linear-gradient(180deg, #c5c040 0%, #8b8b1f 100%)';
      }
      return 'linear-gradient(180deg, #c54040 0%, #8b1f1f 100%)';
    });

    const rpgCurrentPlayer = inject<any>('rpgCurrentPlayer');
    let subscription: { unsubscribe(): void } | null = null;
    let prevLevel = 0;
    let prevQuestCompleteCount = -1;

    function formatMapId(mapId: string): string {
      return mapId
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c: string) => c.toUpperCase());
    }

    onMounted(() => {
      visible.value = true;

      if (!rpgCurrentPlayer) return;

      subscription = rpgCurrentPlayer.subscribe(({ object }: { object: any }) => {
        if (!object) return;

        // Built-in RPG-JS properties
        hp.value = object.hp ?? 0;
        maxHp.value = object.param?.maxHp ?? 1;
        sp.value = object.sp ?? 0;
        maxSp.value = object.param?.maxSp ?? 1;

        // Level: try built-in first, fall back to custom variable
        const builtinLevel = object.level;
        const varLevel = readVar(object, 'PLAYER_LEVEL') as number | undefined;
        const newLevel = builtinLevel ?? varLevel ?? 1;

        // SFX: level up (skip initial load when prevLevel is 0)
        if (prevLevel > 0 && newLevel > prevLevel) {
          audioManager.playSfx('SFX-UI-05');
        }
        prevLevel = newLevel;
        level.value = newLevel;

        // Gold: try built-in first, fall back to custom variable
        const builtinGold = object.gold;
        const varGold = readVar(object, 'GOLD') as number | undefined;
        gold.value = builtinGold || varGold || 0;

        // Memory fragments (custom variable, stored as array of IDs)
        const frags = readVar(object, 'MEMORY_FRAGMENTS');
        fragments.value = Array.isArray(frags) ? frags.length : (typeof frags === 'number' ? frags : 0);

        // Zone name from player's current map
        const mapId = object.map ?? (readVar(object, 'CURRENT_MAP') as string) ?? '';
        zoneName.value = mapId ? formatMapId(mapId) : '';

        // Active quest info (set by server quest system)
        questName.value = (readVar(object, 'ACTIVE_QUEST_NAME') as string) ?? '';
        questObj.value = (readVar(object, 'ACTIVE_QUEST_OBJ') as string) ?? '';

        // SFX: quest complete (server increments QUEST_COMPLETE_COUNT)
        const qcc = (readVar(object, 'QUEST_COMPLETE_COUNT') as number) ?? 0;
        if (prevQuestCompleteCount >= 0 && qcc > prevQuestCompleteCount) {
          audioManager.playSfx('SFX-MEM-03');
        }
        prevQuestCompleteCount = qcc;
      });
    });

    onUnmounted(() => {
      subscription?.unsubscribe();
    });

    return {
      visible,
      hp,
      maxHp,
      sp,
      maxSp,
      level,
      gold,
      fragments,
      zoneName,
      questName,
      questObj,
      hpPercent,
      spPercent,
      hpGradient,
    };
  },
});
</script>

<style scoped>
.hud {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 16px;
  z-index: 100;
  font-family: var(--font-body, 'Merriweather', serif);
}

/* === Level badge === */
.hud-level {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 4px;
}

.level-label {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary, #8a7a60);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.level-value {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-bright, #f0e6d0);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

/* === Vitals (HP / SP) === */
.hud-vitals {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hud-bar {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bar-label {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-accent, #b8860b);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  width: 20px;
  text-align: right;
}

.bar-track {
  width: 120px;
  height: 10px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(139, 31, 31, 0.5);
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease, background 0.5s ease;
  border-radius: 1px;
}

.sp-fill {
  background: linear-gradient(180deg, #4078c5 0%, #1f3f8b 100%);
}

.bar-value {
  font-size: 10px;
  color: var(--text-primary, #d4c4a0);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  min-width: 50px;
}

/* === Zone banner (top center) === */
.hud-zone-banner {
  background: rgba(0, 0, 0, 0.4);
  padding: 2px 12px;
  border-radius: 2px;
  border: 1px solid rgba(138, 122, 96, 0.3);
}

.zone-name {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 11px;
  color: var(--text-secondary, #8a7a60);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
}

/* === Info panel (top right) === */
.hud-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.hud-gold {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 8px;
  border-radius: 3px;
  border: 1px solid rgba(218, 165, 32, 0.4);
}

.gold-icon {
  color: #daa520;
  font-size: 14px;
  text-shadow: 0 0 6px rgba(218, 165, 32, 0.5);
}

.gold-amount {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-bright, #f0e6d0);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.hud-fragments {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 8px;
  border-radius: 3px;
  border: 1px solid rgba(184, 134, 11, 0.4);
}

.frag-icon {
  color: #b8860b;
  font-size: 14px;
  text-shadow: 0 0 6px rgba(184, 134, 11, 0.6);
}

.frag-count {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-bright, #f0e6d0);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

/* === Quest mini-objective === */
.hud-quest {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.4);
  padding: 3px 8px;
  border-radius: 2px;
  border: 1px solid rgba(138, 122, 96, 0.3);
  max-width: 200px;
}

.quest-name {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 9px;
  color: var(--text-accent, #b8860b);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.quest-obj {
  font-size: 9px;
  color: var(--text-secondary, #8a7a60);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}
</style>
