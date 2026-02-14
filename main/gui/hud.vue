<template>
  <div class="hud" v-if="visible">
    <!-- Top-left: HP / SP bars -->
    <div class="hud-vitals">
      <div class="hud-bar hp-bar">
        <span class="bar-label">HP</span>
        <div class="bar-track">
          <div class="bar-fill hp-fill" :style="{ width: hpPercent + '%' }" />
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

    <!-- Top-right: Memory fragments + Zone vibrancy -->
    <div class="hud-info">
      <div class="hud-fragments">
        <span class="frag-icon">&#x2726;</span>
        <span class="frag-count">{{ fragments }}</span>
      </div>
      <div class="hud-zone" v-if="zoneName">
        <span class="zone-name">{{ zoneName }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'rpg-hud',
  props: {},
  setup() {
    const visible = ref(false);
    const hp = ref(100);
    const maxHp = ref(100);
    const sp = ref(50);
    const maxSp = ref(50);
    const fragments = ref(0);
    const zoneName = ref('');

    const hpPercent = ref(100);
    const spPercent = ref(100);

    const rpgGuiInteraction = inject<any>('rpgGuiInteraction');

    let pollInterval: ReturnType<typeof setInterval> | null = null;

    function updateStats() {
      if (!rpgGuiInteraction) return;

      try {
        const gui = rpgGuiInteraction;
        // RPG-JS standalone passes player data via GUI interaction
        // Read variables set by the server
        const playerHp = gui.getVariable?.('HP') ?? 100;
        const playerMaxHp = gui.getVariable?.('MAX_HP') ?? 100;
        const playerSp = gui.getVariable?.('SP') ?? 50;
        const playerMaxSp = gui.getVariable?.('MAX_SP') ?? 50;
        const playerFrags = gui.getVariable?.('MEMORY_FRAGMENTS') ?? 0;
        const mapId = gui.getVariable?.('CURRENT_MAP') ?? '';

        hp.value = playerHp;
        maxHp.value = playerMaxHp;
        sp.value = playerSp;
        maxSp.value = playerMaxSp;
        fragments.value = playerFrags;

        hpPercent.value = maxHp.value > 0 ? (hp.value / maxHp.value) * 100 : 0;
        spPercent.value = maxSp.value > 0 ? (sp.value / maxSp.value) * 100 : 0;

        // Format zone name from map ID
        if (mapId) {
          zoneName.value = mapId
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c: string) => c.toUpperCase());
        }
      } catch {
        // GUI interaction not ready yet
      }
    }

    onMounted(() => {
      visible.value = true;
      updateStats();
      // Poll for stat changes (RPG-JS standalone doesn't have reactive bindings)
      pollInterval = setInterval(updateStats, 500);
    });

    onUnmounted(() => {
      if (pollInterval) clearInterval(pollInterval);
    });

    return {
      visible,
      hp,
      maxHp,
      sp,
      maxSp,
      hpPercent,
      spPercent,
      fragments,
      zoneName,
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
  padding: 12px 16px;
  z-index: 100;
  font-family: var(--font-body, 'Merriweather', serif);
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
  transition: width 0.3s ease;
  border-radius: 1px;
}

.hp-fill {
  background: linear-gradient(180deg, #c54040 0%, #8b1f1f 100%);
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

/* === Info (fragments + zone) === */
.hud-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
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

.hud-zone {
  background: rgba(0, 0, 0, 0.4);
  padding: 1px 8px;
  border-radius: 2px;
}

.zone-name {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 10px;
  color: var(--text-secondary, #8a7a60);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
}
</style>
