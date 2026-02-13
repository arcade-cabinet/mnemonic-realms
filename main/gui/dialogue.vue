<template>
  <div
    class="dialogue-overlay"
    @click="dismiss"
    @touchend.prevent="dismiss"
  >
    <div class="dialogue-box">
      <p class="dialogue-text">
        <span v-if="speakerName" class="speaker-name">{{ speakerName }}</span>
        <span class="message-body">{{ displayedMsg }}</span>
      </p>

      <!-- Choices mode -->
      <div class="dialogue-choices" v-if="isChoice">
        <button
          v-for="(choice, idx) in choices"
          :key="idx"
          class="choice-btn"
          :class="{ active: selectedChoice === idx }"
          @click.stop="selectChoice(idx)"
          @touchend.stop.prevent="selectChoice(idx)"
          @mouseover="selectedChoice = idx"
        >
          {{ choice.text }}
        </button>
      </div>

      <!-- Advance indicator -->
      <div class="advance-hint" v-if="!isChoice && !autoClose && isFullyTyped">
        <span class="advance-arrow"></span>
      </div>
    </div>

    <!-- Full-screen tap hint for mobile -->
    <p class="tap-hint" v-if="!isChoice && !autoClose && isFullyTyped">Tap anywhere to continue</p>
  </div>
</template>

<script lang="ts">
import { Control } from '@rpgjs/client';

export default {
  name: 'rpg-dialog',
  inject: ['rpgEngine', 'rpgKeypress', 'rpgGuiClose'],
  props: ['message', 'choices', 'position', 'fullWidth', 'autoClose', 'typewriterEffect'],
  data() {
    return {
      displayedMsg: '' as string,
      selectedChoice: 0,
      obsKeyPress: null as { unsubscribe(): void } | null,
      typewriterDone: false,
      typewriterInterval: null as ReturnType<typeof setInterval> | null,
    };
  },
  computed: {
    isChoice(): boolean {
      return this.choices && this.choices.length > 0;
    },
    speakerName(): string {
      if (!this.message) return '';
      const match = this.message.match(/^\[([^\]]+)\]:\s*/);
      return match ? match[1] : '';
    },
    bodyText(): string {
      if (!this.message) return '';
      const match = this.message.match(/^\[([^\]]+)\]:\s*(.*)/s);
      return match ? match[2] : this.message;
    },
    isFullyTyped(): boolean {
      return this.typewriterDone || !this.typewriterEffect;
    },
  },
  mounted() {
    // Stop game inputs while dialogue is open
    this.rpgEngine.controls.stopInputs();

    // Listen for keyboard/gamepad action to dismiss
    if (!this.isChoice && !this.autoClose) {
      this.obsKeyPress = this.rpgKeypress.subscribe(({ control }: { control: { actionName: string } | null }) => {
        if (control && control.actionName === Control.Action) {
          this.dismiss();
        }
      });
    }

    // Handle choice navigation via keyboard
    if (this.isChoice) {
      this.obsKeyPress = this.rpgKeypress.subscribe(({ control }: { control: { actionName: string } | null }) => {
        if (!control) return;
        if (control.actionName === Control.Down) {
          this.selectedChoice = (this.selectedChoice + 1) % this.choices.length;
        } else if (control.actionName === Control.Up) {
          this.selectedChoice = (this.selectedChoice - 1 + this.choices.length) % this.choices.length;
        } else if (control.actionName === Control.Action) {
          this.selectChoice(this.selectedChoice);
        }
      });
    }

    // Typewriter effect
    if (this.typewriterEffect) {
      let index = 0;
      this.typewriterDone = false;
      this.typewriterInterval = setInterval(() => {
        if (index >= this.bodyText.length) {
          if (this.typewriterInterval) clearInterval(this.typewriterInterval);
          this.typewriterInterval = null;
          this.typewriterDone = true;
        } else {
          this.displayedMsg = this.displayedMsg + this.bodyText[index];
          index++;
        }
      }, 20);
    } else {
      this.displayedMsg = this.bodyText;
      this.typewriterDone = true;
    }
  },
  methods: {
    dismiss() {
      if (this.isChoice || this.autoClose) return;

      // If typewriter still running, skip to end
      if (!this.isFullyTyped) {
        if (this.typewriterInterval) clearInterval(this.typewriterInterval);
        this.typewriterInterval = null;
        this.displayedMsg = this.bodyText;
        this.typewriterDone = true;
        return;
      }

      this.close();
    },
    selectChoice(index: number) {
      this.close(index);
    },
    close(indexSelect?: number) {
      this.rpgGuiClose('rpg-dialog', indexSelect);
      this.rpgEngine.controls.listenInputs();
    },
  },
  unmounted() {
    if (this.obsKeyPress) this.obsKeyPress.unsubscribe();
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
  },
};
</script>

<style scoped>
/* Full-screen overlay — tappable to dismiss */
.dialogue-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  z-index: 800;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  pointer-events: auto;
}

/* Dialogue box at bottom of screen */
.dialogue-box {
  width: 100%;
  max-width: 720px;
  margin: 0 0.5rem 0.5rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(180deg, #1a0a0a 0%, #2d1b1b 100%);
  border: 2px solid #8b1f1f;
  border-radius: 6px;
  box-shadow: 0 0 40px rgba(139, 31, 31, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.3);
  position: relative;
  cursor: default;
  box-sizing: border-box;
}

.dialogue-text {
  margin: 0;
  line-height: 1.6;
}

.speaker-name {
  display: block;
  font-family: 'Cinzel', 'Georgia', serif;
  font-size: 0.85rem;
  color: #b8860b;
  text-shadow: 0 0 10px rgba(184, 134, 11, 0.3);
  font-weight: bold;
  letter-spacing: 0.05em;
  margin-bottom: 0.35rem;
}

.message-body {
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 0.8rem;
  color: #d4c4a0;
  line-height: 1.7;
}

/* Advance arrow indicator */
.advance-hint {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.advance-arrow {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #b8860b;
  animation: bounce-arrow 0.6s infinite alternate ease-in-out;
}

@keyframes bounce-arrow {
  0% { transform: translateY(0); opacity: 0.4; }
  100% { transform: translateY(4px); opacity: 0.9; }
}

/* Tap hint for mobile */
.tap-hint {
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 0.6rem;
  color: rgba(212, 196, 160, 0.4);
  text-align: center;
  margin: 0.4rem 0 0.75rem;
  letter-spacing: 0.1em;
  pointer-events: none;
}

/* Choices */
.dialogue-choices {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.75rem;
}

.choice-btn {
  width: 100%;
  padding: 0.65rem 1rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  color: #d4c4a0;
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
}

.choice-btn:hover,
.choice-btn.active {
  background: rgba(139, 31, 31, 0.25);
  border-color: #8b1f1f;
  box-shadow: inset 0 0 15px rgba(139, 31, 31, 0.15);
}

.choice-btn:active {
  transform: scale(0.98);
}

/* Desktop adjustments */
@media (min-width: 600px) {
  .dialogue-box {
    margin: 0 1rem 1rem;
    padding: 1.25rem 1.75rem;
  }

  .speaker-name {
    font-size: 0.95rem;
  }

  .message-body {
    font-size: 0.85rem;
  }

  .tap-hint {
    display: none;
  }

  .choice-btn {
    font-size: 0.8rem;
    padding: 0.6rem 1.25rem;
  }
}
</style>
