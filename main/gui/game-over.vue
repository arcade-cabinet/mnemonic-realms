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
import { rpg } from './rpg-helpers';

export default {
  name: 'game-over',
  inject: ['rpgGuiInteraction', 'rpgGuiClose', 'rpgSocket'],
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    retry() {
      this.visible = false;
      rpg(this).interact('game-over', 'game-over-choice', { action: 'retry' });
    },
    newSeed() {
      this.visible = false;
      rpg(this).interact('game-over', 'game-over-choice', { action: 'new-seed' });
    },
  },
  mounted() {
    rpg(this).socket().on('gui.open', ({ guiId }: { guiId: string }) => {
      if (guiId === 'game-over') {
        this.visible = true;
      }
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
  padding: 1rem;
  box-sizing: border-box;
}

.game-over-container {
  text-align: center;
  padding: 1.5rem;
  background: rgba(26, 10, 10, 0.8);
  border: 2px solid #8b1f1f;
  border-radius: 8px;
  box-shadow: 0 0 60px rgba(139, 31, 31, 0.5);
  width: 100%;
  max-width: 450px;
}

.game-over-title {
  font-size: 1.6rem;
  color: #8b1f1f;
  text-shadow: 0 0 30px rgba(139, 31, 31, 0.6);
  margin: 0 0 0.3rem;
}

.game-over-subtitle {
  color: #888;
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 0.85rem;
  margin: 0 0 1.5rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  padding: 0.85rem 1.5rem;
  font-size: 0.9rem;
  font-family: 'Cinzel', 'Georgia', serif;
  border: 1px solid;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
}

.btn:active:not(:disabled) { filter: brightness(1.3); transform: scale(0.97); }

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

/* Desktop: larger title, side-by-side buttons */
@media (min-width: 600px) {
  .game-over-container { padding: 3rem; }
  .game-over-title { font-size: 2.5rem; }
  .game-over-subtitle { font-size: 1rem; margin-bottom: 2rem; }
  .button-group { flex-direction: row; justify-content: center; }
  .btn { padding: 0.75rem 2rem; font-size: 1rem; }
}
</style>
