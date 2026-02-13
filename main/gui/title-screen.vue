<template>
  <div class="title-screen" v-if="visible">
    <!-- Animated background embers -->
    <div class="embers">
      <div class="ember" v-for="i in 12" :key="i" :style="emberStyle(i)"></div>
    </div>

    <!-- Ornate frame corners -->
    <div class="frame-corner tl"></div>
    <div class="frame-corner tr"></div>
    <div class="frame-corner bl"></div>
    <div class="frame-corner br"></div>

    <!-- Main Menu -->
    <div class="main-content" v-if="!showNewGame">
      <div class="title-block">
        <div class="title-ornament">&#x2726;</div>
        <h1 class="title">Mnemonic Realms</h1>
        <p class="tagline">Every Memory Forges a Realm</p>
        <div class="title-divider">
          <span class="divider-wing">&#x2500;&#x2500;&#x2500; &#x2666; &#x2500;&#x2500;&#x2500;</span>
        </div>
      </div>

      <nav class="menu">
        <button class="menu-btn" @click="showNewGame = true">
          <span class="menu-icon">&#x2694;</span>
          <span class="menu-label">New Quest</span>
          <span class="menu-arrow">&#x25B8;</span>
        </button>
        <button class="menu-btn" disabled>
          <span class="menu-icon">&#x25C8;</span>
          <span class="menu-label">Continue</span>
          <span class="menu-hint">No save found</span>
        </button>
        <button class="menu-btn" disabled>
          <span class="menu-icon">&#x2630;</span>
          <span class="menu-label">Load Game</span>
          <span class="menu-hint">Coming soon</span>
        </button>
        <button class="menu-btn" disabled>
          <span class="menu-icon">&#x2699;</span>
          <span class="menu-label">Settings</span>
          <span class="menu-hint">Coming soon</span>
        </button>
      </nav>

      <p class="version">v0.1.0</p>
    </div>

    <!-- New Game Modal -->
    <div class="new-game-modal" v-if="showNewGame">
      <div class="modal-frame">
        <button class="modal-close" @click="showNewGame = false">&#x2715;</button>

        <h2 class="modal-title">Forge Your Destiny</h2>

        <!-- Tabs -->
        <div class="tab-bar">
          <button
            class="tab" :class="{ active: activeTab === 'seed' }"
            @click="activeTab = 'seed'"
          >Seed</button>
          <button
            class="tab" :class="{ active: activeTab === 'class' }"
            @click="activeTab = 'class'"
          >Class</button>
          <button
            class="tab" :class="{ active: activeTab === 'fate' }"
            @click="activeTab = 'fate'"
          >Fate</button>
        </div>

        <!-- Tab: Seed -->
        <div class="tab-content" v-if="activeTab === 'seed'">
          <p class="tab-desc">Your seed shapes the entire world. Shuffle for a new destiny or enter your own.</p>
          <div class="seed-row">
            <input
              v-model="seedText"
              type="text"
              class="seed-input"
              placeholder="adjective adjective noun"
              @keyup.enter="startGame"
            />
            <button class="shuffle-btn" @click="shuffleSeed" title="Shuffle seed">
              &#x2684;
            </button>
          </div>
          <p class="seed-preview" v-if="charName">
            <span class="preview-label">Hero:</span> {{ charName }}
          </p>
        </div>

        <!-- Tab: Class -->
        <div class="tab-content" v-if="activeTab === 'class'">
          <p class="tab-desc">Choose your path. Each class shapes your abilities and destiny.</p>
          <div
            class="class-carousel"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
          >
            <button
              class="carousel-arrow carousel-prev"
              @click="prevClass"
              aria-label="Previous class"
            >&#x25C0;</button>
            <div class="class-card selected-class">
              <div class="class-header">
                <span class="class-icon">{{ selectedClassIcon }}</span>
                <div>
                  <h3 class="class-name">{{ allClasses[selectedClassIndex].name }}</h3>
                  <span class="class-alignment">{{ allClasses[selectedClassIndex].alignment }}</span>
                </div>
              </div>
              <p class="class-desc">{{ allClasses[selectedClassIndex].description }}</p>
              <div class="class-skills">
                <span
                  class="skill-tag"
                  v-for="s in allClasses[selectedClassIndex].skills"
                  :key="s"
                >{{ s }}</span>
              </div>
            </div>
            <button
              class="carousel-arrow carousel-next"
              @click="nextClass"
              aria-label="Next class"
            >&#x25B6;</button>
          </div>
          <div class="class-pips">
            <span
              class="pip"
              v-for="(cls, idx) in allClasses"
              :key="cls.id"
              :class="{ active: idx === selectedClassIndex }"
              @click="selectedClassIndex = idx"
            ></span>
          </div>
        </div>

        <!-- Tab: Fate (Stats) -->
        <div class="tab-content" v-if="activeTab === 'fate'">
          <div class="stats-grid" v-if="previewStats">
            <div class="stat-item" v-for="(val, key) in previewStats" :key="key">
              <span class="stat-name">{{ key }}</span>
              <div class="stat-bar-bg">
                <div class="stat-bar-fill" :style="{ width: statPercent(key, val) + '%' }"></div>
              </div>
              <span class="stat-val">{{ val }}</span>
            </div>
          </div>
          <p class="tab-hint">Stats are shaped by your chosen class.</p>
        </div>

        <!-- Embark Button -->
        <button class="embark-btn" @click="startGame" :disabled="!isValidSeed">
          <span class="embark-icon">&#x269A;</span>
          Embark on Your Quest
        </button>
        <p class="seed-error" v-if="seedError">{{ seedError }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { NameGenerator } from '../generation/generators/nameGenerator';
import { rpg } from './rpg-helpers';

const ADJECTIVE_POOL = [
  'brave', 'ancient', 'dark', 'holy', 'frozen', 'cursed', 'bright', 'shadow',
  'wild', 'mystic', 'fierce', 'gentle', 'iron', 'golden', 'silent', 'burning',
  'crystal', 'storm', 'forgotten', 'eternal', 'hidden', 'sacred', 'lost', 'royal',
  'crimson', 'ashen', 'feral', 'wicked', 'blessed', 'dread', 'pale', 'obsidian',
];
const NOUN_POOL = [
  'warrior', 'forest', 'temple', 'mountain', 'castle', 'realm', 'knight', 'dragon',
  'ruins', 'ocean', 'throne', 'shadow', 'blade', 'crown', 'citadel', 'dungeon',
  'spirit', 'tower', 'flame', 'oracle', 'guardian', 'wanderer', 'sage', 'phoenix',
  'sentinel', 'harbinger', 'wraith', 'champion', 'titan', 'specter', 'marauder', 'revenant',
];

interface ClassDef {
  id: string;
  name: string;
  icon: string;
  alignment: string;
  description: string;
  skills: string[];
  masteryBonus: Record<string, number>;
}

const ALL_CLASSES: ClassDef[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    icon: '\u2694',
    alignment: 'martial',
    description: 'A steadfast fighter who masters weapons and armor. Warriors excel in direct combat, shielding allies and cleaving through enemies with brute strength.',
    skills: ['Slash', 'Power Strike', 'Berserk'],
    masteryBonus: { combat: 25, support: 10 },
  },
  {
    id: 'mage',
    name: 'Mage',
    icon: '\u2728',
    alignment: 'arcane',
    description: 'A wielder of elemental forces and forbidden knowledge. Mages command fire, ice, and poison, devastating foes from afar with devastating spells.',
    skills: ['Fireball', 'Ice Bolt', 'Poison Strike'],
    masteryBonus: { magic: 25, crafting: 10 },
  },
  {
    id: 'rogue',
    name: 'Rogue',
    icon: '\uD83D\uDDE1',
    alignment: 'shadow',
    description: 'A cunning trickster who strikes from the shadows. Rogues rely on speed, precision, and dirty tactics to exploit every weakness.',
    skills: ['Slash', 'Backstab', 'Poison Strike'],
    masteryBonus: { stealth: 25, combat: 10 },
  },
  {
    id: 'cleric',
    name: 'Cleric',
    icon: '\u2720',
    alignment: 'divine',
    description: 'A devoted servant of higher powers who mends wounds and wards off darkness. Clerics sustain their allies through the harshest trials.',
    skills: ['Heal', 'Cure'],
    masteryBonus: { support: 25, magic: 10 },
  },
];

export default {
  name: 'title-screen',
  inject: ['rpgGuiInteraction'],
  data() {
    return {
      visible: true,
      showNewGame: false,
      activeTab: 'seed' as string,
      seedText: '',
      seedError: '',
      selectedClassIndex: 0,
      touchStartX: 0,
    };
  },
  computed: {
    allClasses(): ClassDef[] {
      return ALL_CLASSES;
    },
    selectedClass(): ClassDef {
      return ALL_CLASSES[this.selectedClassIndex];
    },
    selectedClassIcon(): string {
      return this.selectedClass.icon;
    },
    isValidSeed(): boolean {
      const parts = this.seedText.trim().split(/\s+/);
      return parts.length === 3 && parts.every((p: string) => p.length > 0);
    },
    charName(): string {
      if (!this.isValidSeed) return '';
      const gen = new NameGenerator(this.seedText.trim().toLowerCase());
      return gen.generateCharacterWithTitle();
    },
    previewStats(): Record<string, number> | null {
      const cls = this.selectedClass;
      if (!cls) return null;
      const base: Record<string, number> = { HP: 100, SP: 50, STR: 10, INT: 10, DEX: 10, AGI: 10 };
      for (const [skill, bonus] of Object.entries(cls.masteryBonus)) {
        switch (skill) {
          case 'combat': base.STR += bonus; base.HP += bonus * 2; break;
          case 'magic': base.INT += bonus; base.SP += bonus * 2; break;
          case 'stealth': base.DEX += bonus; base.AGI += bonus; break;
          case 'support': base.HP += bonus; base.SP += bonus; break;
          case 'crafting': base.DEX += Math.floor(bonus / 2); base.INT += Math.floor(bonus / 2); break;
        }
      }
      return base;
    },
  },
  methods: {
    shuffleSeed() {
      const adj1 = ADJECTIVE_POOL[Math.floor(Math.random() * ADJECTIVE_POOL.length)];
      const adj2 = ADJECTIVE_POOL[Math.floor(Math.random() * ADJECTIVE_POOL.length)];
      const noun = NOUN_POOL[Math.floor(Math.random() * NOUN_POOL.length)];
      this.seedText = `${adj1} ${adj2} ${noun}`;
    },
    prevClass() {
      this.selectedClassIndex = (this.selectedClassIndex - 1 + ALL_CLASSES.length) % ALL_CLASSES.length;
    },
    nextClass() {
      this.selectedClassIndex = (this.selectedClassIndex + 1) % ALL_CLASSES.length;
    },
    onTouchStart(e: TouchEvent) {
      this.touchStartX = e.changedTouches[0].clientX;
    },
    onTouchEnd(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - this.touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) this.nextClass();
        else this.prevClass();
      }
    },
    startGame() {
      if (!this.isValidSeed) {
        this.seedError = 'Enter exactly 3 words: adjective adjective noun';
        return;
      }
      this.seedError = '';
      this.visible = false;
      rpg(this).interact('title-screen', 'seed-selected', {
        seed: this.seedText.trim().toLowerCase(),
        classId: this.selectedClass.id,
      });
    },
    emberStyle(i: number) {
      const x = (i * 137.5) % 100;
      const delay = (i * 0.8) % 6;
      const dur = 4 + (i % 4);
      const size = 2 + (i % 3);
      return {
        left: `${x}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${dur}s`,
        width: `${size}px`,
        height: `${size}px`,
      };
    },
    statPercent(key: string, val: number): number {
      const maxes: Record<string, number> = { HP: 200, SP: 120, STR: 25, INT: 25, DEX: 25, AGI: 25 };
      return Math.min(100, (val / (maxes[key] || 25)) * 100);
    },
  },
  mounted() {
    this.shuffleSeed();
  },
};
</script>

<style scoped>
/* ── Base ─────────────────────────────────────── */
.title-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at 50% 30%, #2a0e0e 0%, #110505 50%, #050202 100%);
  font-family: 'Cinzel', 'Georgia', serif;
  color: #d4c4a0;
  z-index: 1000;
  overflow: hidden;
}

/* ── Ember particles ──────────────────────────── */
.embers { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.ember {
  position: absolute;
  bottom: -10px;
  background: radial-gradient(circle, #ff6622 0%, #ff220088 60%, transparent 100%);
  border-radius: 50%;
  opacity: 0;
  animation: float-up linear infinite;
}
@keyframes float-up {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.2; }
  100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
}

/* ── Ornate frame corners ─────────────────────── */
.frame-corner {
  position: absolute;
  width: 60px;
  height: 60px;
  border-color: #8b1f1f;
  pointer-events: none;
  opacity: 0.5;
}
.frame-corner.tl { top: 12px; left: 12px; border-top: 2px solid; border-left: 2px solid; }
.frame-corner.tr { top: 12px; right: 12px; border-top: 2px solid; border-right: 2px solid; }
.frame-corner.bl { bottom: 12px; left: 12px; border-bottom: 2px solid; border-left: 2px solid; }
.frame-corner.br { bottom: 12px; right: 12px; border-bottom: 2px solid; border-right: 2px solid; }

/* ── Main Menu ────────────────────────────────── */
.main-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 1rem;
  width: 100%;
  max-width: 420px;
}

.title-block { margin-bottom: 2.5rem; }
.title-ornament {
  font-size: 1.5rem;
  color: #b8860b;
  margin-bottom: 0.5rem;
  animation: pulse-glow 3s ease-in-out infinite;
}
@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 8px rgba(184, 134, 11, 0.4); }
  50% { text-shadow: 0 0 20px rgba(184, 134, 11, 0.8); }
}

.title {
  font-size: 2rem;
  color: #8b1f1f;
  text-shadow: 0 0 30px rgba(139, 31, 31, 0.6), 0 0 60px rgba(139, 31, 31, 0.3), 0 2px 4px rgba(0,0,0,0.8);
  margin: 0;
  letter-spacing: 0.12em;
  line-height: 1.2;
  animation: title-breathe 4s ease-in-out infinite;
}
@keyframes title-breathe {
  0%, 100% { text-shadow: 0 0 30px rgba(139, 31, 31, 0.6), 0 0 60px rgba(139, 31, 31, 0.3), 0 2px 4px rgba(0,0,0,0.8); }
  50% { text-shadow: 0 0 40px rgba(139, 31, 31, 0.8), 0 0 80px rgba(139, 31, 31, 0.5), 0 2px 4px rgba(0,0,0,0.8); }
}

.tagline {
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 0.8rem;
  color: #b8860b;
  margin: 0.6rem 0 0;
  font-style: italic;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.title-divider { margin-top: 1rem; }
.divider-wing {
  color: #5a3a3a;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
}

/* ── Menu Buttons ─────────────────────────────── */
.menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.menu-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.9rem 1.2rem;
  background: linear-gradient(135deg, rgba(26, 10, 10, 0.9) 0%, rgba(40, 18, 18, 0.8) 100%);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  color: #d4c4a0;
  font-family: 'Cinzel', 'Georgia', serif;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s;
  text-align: left;
  min-height: 48px;
  -webkit-tap-highlight-color: transparent;
}

.menu-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(139, 31, 31, 0.3) 0%, rgba(60, 20, 20, 0.9) 100%);
  border-color: #8b1f1f;
  box-shadow: 0 0 20px rgba(139, 31, 31, 0.3), inset 0 0 20px rgba(139, 31, 31, 0.1);
  transform: translateX(4px);
}

.menu-btn:active:not(:disabled) {
  transform: translateX(4px) scale(0.98);
}

.menu-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.menu-icon { font-size: 1.2rem; width: 28px; text-align: center; }
.menu-label { flex: 1; }
.menu-arrow { color: #8b1f1f; font-size: 0.8rem; }
.menu-hint {
  font-size: 0.6rem;
  color: #666;
  font-family: 'Merriweather', 'Georgia', serif;
  font-style: italic;
}

.version {
  font-size: 0.6rem;
  color: #444;
  font-family: 'Merriweather', 'Georgia', serif;
}

/* ── New Game Modal ───────────────────────────── */
.new-game-modal {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 480px;
  padding: 0.75rem;
  box-sizing: border-box;
  max-height: 100vh;
  overflow-y: auto;
}

.modal-frame {
  background: linear-gradient(180deg, #1a0a0a 0%, #0d0505 100%);
  border: 2px solid #8b1f1f;
  border-radius: 6px;
  padding: 1.25rem;
  position: relative;
  box-shadow: 0 0 60px rgba(139, 31, 31, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
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
.modal-close:hover { color: #d4c4a0; border-color: #8b1f1f; }

.modal-title {
  font-size: 1.3rem;
  color: #b8860b;
  text-shadow: 0 0 15px rgba(184, 134, 11, 0.4);
  margin: 0 0 1rem;
  text-align: center;
}

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
  color: #777;
  font-family: 'Cinzel', 'Georgia', serif;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tab:hover { color: #d4c4a0; }
.tab.active {
  color: #b8860b;
  border-bottom-color: #b8860b;
  text-shadow: 0 0 8px rgba(184, 134, 11, 0.3);
}

/* ── Tab Content ──────────────────────────────── */
.tab-content {
  min-height: 140px;
  margin-bottom: 1rem;
}

.tab-desc {
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 0.75rem;
  color: #888;
  margin: 0 0 1rem;
  line-height: 1.5;
}

.tab-hint {
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 0.65rem;
  color: #555;
  font-style: italic;
  margin-top: 0.75rem;
}

/* ── Seed Input ───────────────────────────────── */
.seed-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.seed-input {
  flex: 1;
  padding: 0.7rem 0.8rem;
  font-size: 0.95rem;
  font-family: 'Merriweather', 'Georgia', serif;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  color: #d4c4a0;
  text-align: center;
  outline: none;
  box-sizing: border-box;
  -webkit-appearance: none;
}

.seed-input:focus {
  border-color: #b8860b;
  box-shadow: 0 0 10px rgba(184, 134, 11, 0.2);
}

.shuffle-btn {
  width: 44px;
  height: 44px;
  border: 1px solid #b8860b;
  background: rgba(184, 134, 11, 0.1);
  border-radius: 4px;
  color: #b8860b;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.shuffle-btn:hover {
  background: rgba(184, 134, 11, 0.2);
  box-shadow: 0 0 15px rgba(184, 134, 11, 0.3);
  transform: rotate(15deg);
}

.shuffle-btn:active { transform: rotate(30deg) scale(0.95); }

.seed-preview {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #d4c4a0;
}
.preview-label { color: #b8860b; font-size: 0.7rem; }

/* ── Class Card ───────────────────────────────── */
.class-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  padding: 1rem;
}

.class-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.class-icon { font-size: 1.8rem; }
.class-name {
  font-size: 1.1rem;
  color: #d4c4a0;
  margin: 0;
}

.class-alignment {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
  font-family: 'Merriweather', 'Georgia', serif;
}
.class-alignment.light { color: #ffd700; background: rgba(255, 215, 0, 0.1); }
.class-alignment.dark { color: #9966ff; background: rgba(153, 102, 255, 0.1); }
.class-alignment.neutral { color: #88aacc; background: rgba(136, 170, 204, 0.1); }

.class-desc {
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 0.75rem;
  color: #999;
  line-height: 1.5;
  margin: 0 0 0.75rem;
}

.class-skills { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.skill-tag {
  font-size: 0.6rem;
  padding: 0.2rem 0.5rem;
  background: rgba(139, 31, 31, 0.2);
  border: 1px solid #5a2a2a;
  border-radius: 2px;
  color: #cc8888;
  font-family: 'Merriweather', 'Georgia', serif;
}

/* ── Stats ────────────────────────────────────── */
.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-name {
  width: 32px;
  font-size: 0.65rem;
  color: #b8860b;
  font-weight: bold;
  text-transform: uppercase;
}

.stat-bar-bg {
  flex: 1;
  height: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  border-radius: 2px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  transition: width 0.4s ease;
  border-radius: 1px;
}

.stat-item:nth-child(1) .stat-bar-fill { background: linear-gradient(90deg, #8b1f1f, #cc3333); }
.stat-item:nth-child(2) .stat-bar-fill { background: linear-gradient(90deg, #1a4d8b, #3388cc); }
.stat-item:nth-child(3) .stat-bar-fill { background: linear-gradient(90deg, #8b4513, #cc6633); }
.stat-item:nth-child(4) .stat-bar-fill { background: linear-gradient(90deg, #4b0082, #8844cc); }
.stat-item:nth-child(5) .stat-bar-fill { background: linear-gradient(90deg, #228b22, #33cc33); }
.stat-item:nth-child(6) .stat-bar-fill { background: linear-gradient(90deg, #b8860b, #ffcc33); }

.stat-val {
  width: 28px;
  font-size: 0.7rem;
  color: #d4c4a0;
  text-align: right;
}

/* ── Class Carousel ──────────────────────────── */
.class-carousel {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  user-select: none;
  touch-action: pan-y;
}

.carousel-arrow {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  color: #b8860b;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-arrow:hover {
  background: rgba(184, 134, 11, 0.15);
  border-color: #b8860b;
  box-shadow: 0 0 10px rgba(184, 134, 11, 0.2);
}

.carousel-arrow:active {
  transform: scale(0.92);
}

.class-carousel .class-card {
  flex: 1;
  min-width: 0;
}

.selected-class {
  border-color: #b8860b !important;
  box-shadow: 0 0 15px rgba(184, 134, 11, 0.2), inset 0 0 10px rgba(184, 134, 11, 0.05);
}

.class-pips {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.6rem;
}

.pip {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #333;
  border: 1px solid #5a2a2a;
  cursor: pointer;
  transition: all 0.2s;
}

.pip.active {
  background: #b8860b;
  border-color: #b8860b;
  box-shadow: 0 0 6px rgba(184, 134, 11, 0.5);
}

.pip:hover:not(.active) {
  background: #555;
}

/* ── Embark Button ────────────────────────────── */
.embark-btn {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #8b1f1f 0%, #6b1515 100%);
  border: 1px solid #a33;
  border-radius: 4px;
  color: #d4c4a0;
  font-family: 'Cinzel', 'Georgia', serif;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  min-height: 48px;
  -webkit-tap-highlight-color: transparent;
}

.embark-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #a33 0%, #8b1f1f 100%);
  box-shadow: 0 0 25px rgba(139, 31, 31, 0.5);
  transform: translateY(-1px);
}

.embark-btn:active:not(:disabled) { transform: scale(0.98); }
.embark-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.embark-icon { margin-right: 0.3rem; }

.seed-error {
  font-size: 0.7rem;
  color: #cc3333;
  text-align: center;
  margin-top: 0.5rem;
  font-family: 'Merriweather', 'Georgia', serif;
}

/* ── Desktop ──────────────────────────────────── */
@media (min-width: 600px) {
  .title { font-size: 3rem; }
  .tagline { font-size: 0.9rem; }
  .modal-frame { padding: 2rem; }
  .modal-title { font-size: 1.5rem; }
  .tab-content { min-height: 180px; }
  .frame-corner { width: 80px; height: 80px; }
}
</style>
