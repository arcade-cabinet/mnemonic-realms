<template>
  <div class="dialogue-overlay" v-if="visible" @click="advance">
    <div class="dialogue-panel">
      <!-- Speaker portrait + name row -->
      <div class="dialogue-header" v-if="speakerName">
        <div class="portrait-frame" v-if="portraitSrc">
          <img
            :src="portraitSrc"
            :alt="speakerName + ' portrait'"
            class="portrait-img"
          />
        </div>
        <span class="speaker-name">{{ speakerName }}</span>
      </div>

      <!-- Dialogue text with typewriter effect -->
      <div class="dialogue-body">
        <p class="dialogue-text">{{ displayedText }}</p>
      </div>

      <!-- Choice buttons (when choices are provided) -->
      <div class="dialogue-choices" v-if="showChoices">
        <button
          class="choice-btn"
          :class="{ 'choice-focused': idx === focusedChoice }"
          v-for="(choice, idx) in choices"
          :key="idx"
          @click.stop="selectChoice(idx)"
          @mouseenter="focusedChoice = idx"
        >
          <span class="choice-cursor" v-if="idx === focusedChoice">&#x25B8;</span>
          {{ choice.text }}
        </button>
      </div>

      <!-- Advance indicator -->
      <div class="advance-indicator" v-if="textComplete && !showChoices">
        <span class="advance-arrow">&#x25BC;</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getPortraitUrl, type Expression } from './portraits';

type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant';

const SPEED_DELAYS: Record<TextSpeed, number> = {
  slow: 30,
  normal: 15,
  fast: 5,
  instant: 0,
};

export default {
  name: 'dialogue-box',
  inject: ['rpgGuiInteraction', 'rpgGuiClose'],
  props: {
    text: { type: String, default: '' },
    speaker: { type: String, default: '' },
    characterId: { type: String, default: '' },
    expression: { type: String, default: 'neutral' },
    choices: { type: Array, default: () => [] },
    speed: { type: String, default: 'normal' },
  },
  data() {
    return {
      visible: true,
      displayedText: '',
      textComplete: false,
      typewriterTimer: null as ReturnType<typeof setTimeout> | null,
      charIndex: 0,
      focusedChoice: 0,
      keyHandler: null as ((e: KeyboardEvent) => void) | null,
    };
  },
  computed: {
    speakerName(): string {
      return this.speaker || '';
    },
    portraitSrc(): string | undefined {
      if (!this.characterId) return undefined;
      return getPortraitUrl(this.characterId, this.expression as Expression);
    },
    showChoices(): boolean {
      return this.textComplete && this.choices && this.choices.length > 0;
    },
    baseDelay(): number {
      return SPEED_DELAYS[this.speed as TextSpeed] ?? SPEED_DELAYS.normal;
    },
  },
  watch: {
    text: {
      immediate: true,
      handler() {
        this.startTypewriter();
      },
    },
    showChoices(visible: boolean) {
      if (visible) {
        this.focusedChoice = 0;
      }
    },
  },
  methods: {
    startTypewriter() {
      this.clearTypewriter();
      this.displayedText = '';
      this.textComplete = false;
      this.charIndex = 0;

      if (!this.text) {
        this.textComplete = true;
        return;
      }

      // Instant speed: show all text immediately
      if (this.baseDelay === 0) {
        this.displayedText = this.text;
        this.textComplete = true;
        return;
      }

      this.typewriterTick();
    },

    typewriterTick() {
      if (this.charIndex >= this.text.length) {
        this.textComplete = true;
        return;
      }

      const char = this.text[this.charIndex];
      this.displayedText += char;
      this.charIndex++;

      // Punctuation pauses scaled relative to base speed
      let delay = this.baseDelay;
      if (char === '.') delay = Math.max(delay * 6, 60);
      else if (char === ',') delay = Math.max(delay * 3, 30);
      else if (char === '\u2026') delay = Math.max(delay * 10, 100); // ellipsis

      this.typewriterTimer = setTimeout(() => this.typewriterTick(), delay);
    },

    clearTypewriter() {
      if (this.typewriterTimer !== null) {
        clearTimeout(this.typewriterTimer);
        this.typewriterTimer = null;
      }
    },

    advance() {
      if (!this.textComplete) {
        // Skip to end of typewriter
        this.clearTypewriter();
        this.displayedText = this.text;
        this.textComplete = true;
        return;
      }

      // If there are choices, wait for a choice selection
      if (this.showChoices) return;

      // Close the dialogue
      this.close();
    },

    selectChoice(index: number) {
      const choice = this.choices[index];
      this.close(choice);
    },

    close(data?: any) {
      this.visible = false;
      this.clearTypewriter();
      this.rpgGuiClose('dialogue-box', data);
    },
  },

  mounted() {
    const onKey = (e: KeyboardEvent) => {
      if (!this.visible) return;

      // Choice navigation when choices are visible
      if (this.showChoices) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.focusedChoice = (this.focusedChoice + 1) % this.choices.length;
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.focusedChoice =
            (this.focusedChoice - 1 + this.choices.length) % this.choices.length;
          return;
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectChoice(this.focusedChoice);
          return;
        }
        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.advance();
      }
    };
    window.addEventListener('keydown', onKey);
    this.keyHandler = onKey;
  },

  beforeUnmount() {
    this.clearTypewriter();
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
    }
  },
};
</script>

<style scoped>
/* ── Overlay ─────────────────────────────────── */
.dialogue-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 200;
  pointer-events: auto;
}

/* ── Panel ───────────────────────────────────── */
.dialogue-panel {
  width: 100%;
  max-width: 640px;
  background: linear-gradient(180deg, rgba(26, 10, 10, 0.95) 0%, rgba(13, 5, 5, 0.97) 100%);
  border-top: 2px solid #8b1f1f;
  padding: 16px;
  box-sizing: border-box;
  position: relative;
}

/* ── Header: portrait + speaker name ─────────── */
.dialogue-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.portrait-frame {
  width: 48px;
  height: 48px;
  border: 2px solid #8b1f1f;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 0 10px rgba(139, 31, 31, 0.3);
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  image-rendering: auto;
}

.speaker-name {
  font-family: 'Cinzel', 'Georgia', serif;
  font-size: 14px;
  color: #daa520;
  text-shadow: 0 0 8px rgba(218, 165, 32, 0.3);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* ── Body: dialogue text ─────────────────────── */
.dialogue-body {
  min-height: 48px;
}

.dialogue-text {
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 14px;
  color: #d4c4a0;
  line-height: 1.6;
  margin: 0;
}

/* ── Choices ─────────────────────────────────── */
.dialogue-choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.choice-btn {
  width: 100%;
  padding: 10px 16px;
  background: linear-gradient(135deg, rgba(26, 10, 10, 0.9) 0%, rgba(40, 18, 18, 0.8) 100%);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  color: #d4c4a0;
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
}

.choice-btn:hover,
.choice-btn.choice-focused {
  background: linear-gradient(135deg, rgba(139, 31, 31, 0.3) 0%, rgba(60, 20, 20, 0.9) 100%);
  border-color: #8b1f1f;
  box-shadow: 0 0 15px rgba(139, 31, 31, 0.3);
}

.choice-btn:active {
  transform: scale(0.98);
}

.choice-cursor {
  color: #daa520;
  margin-right: 8px;
  text-shadow: 0 0 6px rgba(218, 165, 32, 0.5);
}

/* ── Advance indicator ───────────────────────── */
.advance-indicator {
  position: absolute;
  bottom: 12px;
  right: 16px;
}

.advance-arrow {
  color: #b8860b;
  font-size: 12px;
  animation: bounce-arrow 1s ease-in-out infinite;
}

@keyframes bounce-arrow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

/* ── Desktop ─────────────────────────────────── */
@media (min-width: 768px) {
  .dialogue-panel {
    max-height: 30vh;
    padding: 20px 24px;
  }

  .portrait-frame {
    width: 64px;
    height: 64px;
  }

  .speaker-name {
    font-size: 16px;
  }

  .dialogue-text {
    font-size: 15px;
  }
}

/* ── Reduced Motion ──────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .advance-arrow {
    animation: none;
  }
}
</style>
