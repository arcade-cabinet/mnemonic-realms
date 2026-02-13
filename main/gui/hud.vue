<template>
  <div class="hud" v-if="visible">
    <div class="hud-bar">
      <div class="hud-item hp-bar">
        <span class="hud-label">HP</span>
        <div class="bar-container">
          <div class="bar-fill hp-fill" :style="{ width: hpPercent + '%' }"></div>
        </div>
        <span class="hud-value">{{ currentHp }}/{{ maxHp }}</span>
      </div>

      <div class="hud-item sp-bar">
        <span class="hud-label">SP</span>
        <div class="bar-container">
          <div class="bar-fill sp-fill" :style="{ width: spPercent + '%' }"></div>
        </div>
        <span class="hud-value">{{ currentSp }}/{{ maxSp }}</span>
      </div>

      <div class="hud-item">
        <span class="hud-label">Lv</span>
        <span class="hud-value level">{{ level }}</span>
      </div>

      <div class="hud-item">
        <span class="hud-label">Gold</span>
        <span class="hud-value gold">{{ gold }}</span>
      </div>

      <div class="hud-item seed-display">
        <span class="hud-label">Seed</span>
        <span class="hud-value seed">{{ seed }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'game-hud',
  inject: ['rpgCurrentPlayer'],
  data() {
    return {
      visible: true,
    };
  },
  computed: {
    player(): any {
      return (this as any).rpgCurrentPlayer?.object;
    },
    currentHp(): number {
      return this.player?.hp ?? 0;
    },
    maxHp(): number {
      return this.player?.param?.maxHp ?? 100;
    },
    currentSp(): number {
      return this.player?.sp ?? 0;
    },
    maxSp(): number {
      return this.player?.param?.maxSp ?? 50;
    },
    hpPercent(): number {
      if (!this.maxHp) return 0;
      return Math.max(0, Math.min(100, (this.currentHp / this.maxHp) * 100));
    },
    spPercent(): number {
      if (!this.maxSp) return 0;
      return Math.max(0, Math.min(100, (this.currentSp / this.maxSp) * 100));
    },
    level(): number {
      return this.player?.level ?? 1;
    },
    gold(): number {
      return this.player?.gold ?? 0;
    },
    seed(): string {
      return this.player?.variables?.SEED ?? '';
    },
  },
};
</script>

<style scoped>
.hud {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 500;
  pointer-events: none;
}

.hud-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.6) 100%);
  border-bottom: 1px solid #8b1f1f;
  font-family: 'Cinzel', 'Georgia', serif;
  color: #d4c4a0;
  font-size: 0.65rem;
}

.hud-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.hud-label {
  color: #b8860b;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.55rem;
  letter-spacing: 0.05em;
}

.hud-value {
  color: #d4c4a0;
  font-size: 0.65rem;
}

.bar-container {
  width: 50px;
  height: 8px;
  background: rgba(26, 10, 10, 0.8);
  border: 1px solid #555;
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.hp-fill {
  background: linear-gradient(90deg, #8b1f1f, #cc3333);
}

.sp-fill {
  background: linear-gradient(90deg, #1a4d8b, #3388cc);
}

.level {
  color: #b8860b;
  font-weight: bold;
}

.gold {
  color: #ffd700;
  font-weight: bold;
}

.seed-display {
  display: none;
}

.seed {
  color: #888;
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 0.6rem;
  font-style: italic;
}

/* Desktop: wider bars, show seed */
@media (min-width: 600px) {
  .hud-bar { gap: 1rem; padding: 0.5rem 1rem; font-size: 0.75rem; flex-wrap: nowrap; }
  .hud-label { font-size: 0.65rem; }
  .hud-value { font-size: 0.75rem; }
  .bar-container { width: 80px; height: 10px; }
  .seed-display { display: flex; margin-left: auto; }
}
</style>
