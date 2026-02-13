<template>
  <div class="victory-screen" v-if="visible">
    <div class="victory-container">
      <h1 class="victory-title">Quest Complete!</h1>
      <p class="victory-subtitle">The dungeon lord has been vanquished</p>

      <div class="stats-panel">
        <div class="stat-row">
          <span class="stat-label">Seed</span>
          <span class="stat-value seed">{{ seed }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Level</span>
          <span class="stat-value">{{ level }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Class</span>
          <span class="stat-value">{{ playerClass }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Gold</span>
          <span class="stat-value gold">{{ gold }}</span>
        </div>
      </div>

      <div class="button-group">
        <button class="btn btn-primary" @click="continueExploring">Continue Exploring</button>
        <button class="btn btn-secondary" @click="newSeed">New Seed</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RpgGui } from '@rpgjs/client';

export default {
  name: 'victory-screen',
  inject: ['rpgCurrentPlayer'],
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    player(): any {
      return (this as any).rpgCurrentPlayer?.object;
    },
    seed(): string {
      return this.player?.variables?.SEED ?? '';
    },
    level(): number {
      return this.player?.level ?? 1;
    },
    playerClass(): string {
      return this.player?.variables?.class ?? 'Adventurer';
    },
    gold(): number {
      return this.player?.gold ?? 0;
    },
  },
  methods: {
    continueExploring() {
      this.visible = false;
      RpgGui.emit('victory-choice', { action: 'continue' });
    },
    newSeed() {
      this.visible = false;
      RpgGui.emit('victory-choice', { action: 'new-seed' });
    },
  },
  mounted() {
    RpgGui.on('show-victory', () => {
      this.visible = true;
    });
  },
};
</script>

<style scoped>
.victory-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  z-index: 950;
  font-family: 'Cinzel', 'Georgia', serif;
  color: #d4c4a0;
}

.victory-container {
  text-align: center;
  padding: 3rem;
  background: linear-gradient(180deg, #1a1a0a 0%, #2d2b1b 100%);
  border: 2px solid #b8860b;
  border-radius: 8px;
  box-shadow: 0 0 60px rgba(184, 134, 11, 0.4);
  max-width: 450px;
  width: 90%;
}

.victory-title {
  font-size: 2rem;
  color: #b8860b;
  text-shadow: 0 0 20px rgba(184, 134, 11, 0.5);
  margin: 0 0 0.5rem;
}

.victory-subtitle {
  color: #999;
  font-family: 'Merriweather', 'Georgia', serif;
  margin: 0 0 2rem;
}

.stats-panel {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #555;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-label { color: #b8860b; font-size: 0.85rem; }
.stat-value { color: #d4c4a0; font-size: 0.85rem; }
.seed { font-style: italic; color: #888; }
.gold { color: #ffd700; }

.button-group { display: flex; gap: 1rem; justify-content: center; }

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-family: 'Cinzel', 'Georgia', serif;
  border: 1px solid;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
}

.btn-primary { background: #b8860b; border-color: #d4a017; color: #1a1a0a; }
.btn-primary:hover { background: #d4a017; }
.btn-secondary { background: transparent; border-color: #888; color: #888; }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.05); }
</style>
