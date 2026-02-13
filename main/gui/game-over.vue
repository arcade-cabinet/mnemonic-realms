<template>
  <div class="game-over-screen" v-if="visible">
    <div class="game-over-container">
      <h1 class="game-over-title">You Have Fallen</h1>
      <p class="game-over-subtitle">The darkness claims another soul...</p>

      <div class="button-group">
        <button class="btn btn-primary" @click="retry">Retry (Same Seed)</button>
        <button class="btn btn-secondary" @click="newSeed">New Seed</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RpgGui } from '@rpgjs/client';

export default {
  name: 'game-over',
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    retry() {
      this.visible = false;
      RpgGui.emit('game-over-choice', { action: 'retry' });
    },
    newSeed() {
      this.visible = false;
      RpgGui.emit('game-over-choice', { action: 'new-seed' });
    },
  },
  mounted() {
    RpgGui.on('show-game-over', () => {
      this.visible = true;
    });
  },
};
</script>

<style scoped>
.game-over-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  z-index: 950;
  font-family: 'Cinzel', 'Georgia', serif;
  color: #d4c4a0;
}

.game-over-container {
  text-align: center;
  padding: 3rem;
  background: rgba(26, 10, 10, 0.8);
  border: 2px solid #8b1f1f;
  border-radius: 8px;
  box-shadow: 0 0 60px rgba(139, 31, 31, 0.5);
}

.game-over-title {
  font-size: 2.5rem;
  color: #8b1f1f;
  text-shadow: 0 0 30px rgba(139, 31, 31, 0.6);
  margin: 0 0 0.5rem;
}

.game-over-subtitle {
  color: #888;
  font-family: 'Merriweather', 'Georgia', serif;
  margin: 0 0 2rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-family: 'Cinzel', 'Georgia', serif;
  border: 1px solid;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-primary {
  background: #8b1f1f;
  border-color: #a33;
  color: #d4c4a0;
}

.btn-primary:hover { background: #a33; }

.btn-secondary {
  background: transparent;
  border-color: #b8860b;
  color: #b8860b;
}

.btn-secondary:hover { background: rgba(184, 134, 11, 0.1); }
</style>
