<template>
  <div class="title-screen" v-if="visible">
    <div class="title-container">
      <h1 class="title">Mnemonic Realms</h1>
      <p class="subtitle">Enter your world seed to begin</p>

      <div class="seed-input-group">
        <input
          ref="seedInput"
          v-model="seedText"
          type="text"
          class="seed-input"
          placeholder="adjective adjective noun"
          @keyup.enter="startGame"
          autofocus
        />
        <p class="seed-hint" v-if="seedError">{{ seedError }}</p>
        <p class="seed-hint" v-else>Three words: "brave ancient warrior"</p>
      </div>

      <div class="button-group">
        <button class="btn btn-primary" @click="startGame" :disabled="!isValidSeed">
          New Quest
        </button>
        <button class="btn btn-secondary" @click="useRandomSeed">
          Random Seed
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RpgGui } from '@rpgjs/client';

const ADJECTIVE_POOL = [
  'brave', 'ancient', 'dark', 'holy', 'frozen', 'cursed', 'bright', 'shadow',
  'wild', 'mystic', 'fierce', 'gentle', 'iron', 'golden', 'silent', 'burning',
  'crystal', 'storm', 'forgotten', 'eternal', 'hidden', 'sacred', 'lost', 'royal',
];
const NOUN_POOL = [
  'warrior', 'forest', 'temple', 'mountain', 'castle', 'realm', 'knight', 'dragon',
  'ruins', 'ocean', 'throne', 'shadow', 'blade', 'crown', 'citadel', 'dungeon',
  'spirit', 'tower', 'flame', 'oracle', 'guardian', 'wanderer', 'sage', 'phoenix',
];

export default {
  name: 'title-screen',
  data() {
    return {
      visible: true,
      seedText: '',
      seedError: '',
    };
  },
  computed: {
    isValidSeed(): boolean {
      const parts = this.seedText.trim().split(/\s+/);
      return parts.length === 3 && parts.every((p: string) => p.length > 0);
    },
  },
  methods: {
    startGame() {
      if (!this.isValidSeed) {
        this.seedError = 'Enter exactly 3 words: adjective adjective noun';
        return;
      }
      this.seedError = '';
      this.visible = false;

      RpgGui.emit('seed-selected', { seed: this.seedText.trim().toLowerCase() });
    },
    useRandomSeed() {
      const adj1 = ADJECTIVE_POOL[Math.floor(Math.random() * ADJECTIVE_POOL.length)];
      const adj2 = ADJECTIVE_POOL[Math.floor(Math.random() * ADJECTIVE_POOL.length)];
      const noun = NOUN_POOL[Math.floor(Math.random() * NOUN_POOL.length)];
      this.seedText = `${adj1} ${adj2} ${noun}`;
    },
  },
  mounted() {
    (this.$refs.seedInput as HTMLInputElement)?.focus();
  },
};
</script>

<style scoped>
.title-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #1a0a0a 0%, #2d1b1b 50%, #1a0a0a 100%);
  font-family: 'Cinzel', 'Georgia', serif;
  color: #d4c4a0;
  z-index: 1000;
  padding: 1rem;
  box-sizing: border-box;
}

.title-container {
  text-align: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid #8b1f1f;
  border-radius: 8px;
  box-shadow: 0 0 40px rgba(139, 31, 31, 0.3);
  max-width: 500px;
  width: 100%;
}

.title {
  font-size: 1.6rem;
  color: #8b1f1f;
  text-shadow: 0 0 20px rgba(139, 31, 31, 0.5);
  margin: 0 0 0.3rem;
  letter-spacing: 0.1em;
}

.subtitle {
  font-size: 0.85rem;
  color: #b8860b;
  margin: 0 0 1.5rem;
  font-family: 'Merriweather', 'Georgia', serif;
}

.seed-input-group {
  margin-bottom: 1.5rem;
}

.seed-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-family: 'Merriweather', 'Georgia', serif;
  background: rgba(26, 10, 10, 0.8);
  border: 1px solid #b8860b;
  border-radius: 4px;
  color: #d4c4a0;
  text-align: center;
  outline: none;
  box-sizing: border-box;
  -webkit-appearance: none;
}

.seed-input:focus {
  border-color: #8b1f1f;
  box-shadow: 0 0 10px rgba(139, 31, 31, 0.3);
}

.seed-input::placeholder {
  color: #666;
}

.seed-hint {
  font-size: 0.75rem;
  color: #888;
  margin: 0.5rem 0 0;
  font-family: 'Merriweather', 'Georgia', serif;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  padding: 0.85rem 1.5rem;
  font-size: 0.95rem;
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

.btn-primary {
  background: #8b1f1f;
  border-color: #a33;
  color: #d4c4a0;
}

.btn-primary:hover:not(:disabled) {
  background: #a33;
  box-shadow: 0 0 15px rgba(139, 31, 31, 0.5);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  border-color: #b8860b;
  color: #b8860b;
}

.btn-secondary:hover {
  background: rgba(184, 134, 11, 0.1);
}

/* Desktop: larger title, side-by-side buttons */
@media (min-width: 600px) {
  .title-container { padding: 3rem; }
  .title { font-size: 2.5rem; }
  .subtitle { font-size: 1rem; margin-bottom: 2rem; }
  .seed-input { font-size: 1.2rem; }
  .seed-input-group { margin-bottom: 2rem; }
  .button-group { flex-direction: row; justify-content: center; }
  .btn { padding: 0.75rem 2rem; font-size: 1rem; }
}
</style>
