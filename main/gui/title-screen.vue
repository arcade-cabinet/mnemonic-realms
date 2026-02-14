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
        <p class="tagline">A World Unfinished</p>
        <div class="title-divider">
          <span class="divider-wing">&#x2500;&#x2500;&#x2500; &#x2666; &#x2500;&#x2500;&#x2500;</span>
        </div>
      </div>

      <nav class="menu">
        <button class="menu-btn" @click="openNewGame">
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
        <button class="menu-btn" @click="openCredits">
          <span class="menu-icon">&#x2606;</span>
          <span class="menu-label">Credits</span>
          <span class="menu-arrow">&#x25B8;</span>
        </button>
      </nav>

      <p class="version">v0.2.0</p>
    </div>

    <!-- New Game Modal -->
    <div class="new-game-modal" v-if="showNewGame">
      <div class="modal-frame">
        <button class="modal-close" @click="showNewGame = false">&#x2715;</button>

        <h2 class="modal-title">Forge Your Destiny</h2>

        <!-- Tabs -->
        <div class="tab-bar">
          <button
            class="tab" :class="{ active: activeTab === 'class' }"
            @click="activeTab = 'class'"
          >Class</button>
          <button
            class="tab" :class="{ active: activeTab === 'fate' }"
            @click="activeTab = 'fate'"
          >Fate</button>
        </div>

        <!-- Tab: Class -->
        <div class="tab-content" v-if="activeTab === 'class'">
          <p class="tab-desc">Choose your path. Each class has a unique bond with memory.</p>
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
                <span class="class-icon">{{ selectedClassData.icon }}</span>
                <div>
                  <h3 class="class-name">{{ selectedClassData.name }}</h3>
                  <span class="class-mechanic">{{ selectedClassData.mechanic }}</span>
                </div>
              </div>
              <p class="class-desc">{{ selectedClassData.description }}</p>
              <div class="class-skills">
                <span
                  class="skill-tag"
                  v-for="s in selectedClassData.skills"
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
          <p class="tab-desc">Your class shapes your strengths. Here is the measure of your fate.</p>
          <div class="stats-grid">
            <div class="stat-item" v-for="stat in fateStats" :key="stat.label">
              <span class="stat-name">{{ stat.label }}</span>
              <div class="stat-bar-bg">
                <div
                  class="stat-bar-fill"
                  :class="'stat-' + stat.label.toLowerCase()"
                  :style="{ width: stat.percent + '%' }"
                ></div>
              </div>
              <span class="stat-val">{{ stat.value }}</span>
            </div>
          </div>
          <p class="tab-hint">Stats are shaped by your chosen class.</p>
        </div>

        <!-- Embark Button -->
        <button class="embark-btn" @click="startGame">
          <span class="embark-icon">&#x269A;</span>
          Embark on Your Quest
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { audioManager } from '../client/audio';

interface ClassDef {
  id: string;
  name: string;
  icon: string;
  mechanic: string;
  description: string;
  skills: string[];
  stats: Record<string, number>;
}

const ALL_CLASSES: ClassDef[] = [
  {
    id: 'knight',
    name: 'Knight Oathweave',
    icon: '\u2694',
    mechanic: 'Oathweave',
    description: 'A warrior whose power comes from remembered oaths. Bind yourself to promises — each oath grants escalating strength. Fulfilled oaths become permanent.',
    skills: ['Oath Strike', 'Vow of Steel', 'Remembered Valor'],
    stats: { ATK: 75, INT: 30, DEF: 80, AGI: 45, HP: 150, SP: 50 },
  },
  {
    id: 'mage',
    name: 'Mage Inspired',
    icon: '\u2728',
    mechanic: 'Inspired Casting',
    description: 'A spellcaster who re-derives magic from inspiration rather than memorization. Collect memories to unlock elements, then combine them into devastating spells.',
    skills: ['Elemental Bolt', 'Inspired Shield', 'Eureka Moment'],
    stats: { ATK: 35, INT: 90, DEF: 25, AGI: 65, HP: 80, SP: 120 },
  },
  {
    id: 'rogue',
    name: 'Rogue Foreshadow',
    icon: '\uD83D\uDDE1',
    mechanic: 'Foreshadow',
    description: 'A trickster who perceives echoes of what is about to happen. Preemptive counters, perfect dodges, and devastating ambushes from glimpses of the future.',
    skills: ['Foreshadow Strike', 'Echo Dodge', 'Shadow Step'],
    stats: { ATK: 60, INT: 50, DEF: 30, AGI: 90, HP: 100, SP: 70 },
  },
  {
    id: 'cleric',
    name: 'Cleric Euphoric',
    icon: '\u2720',
    mechanic: 'Euphoric Recall',
    description: 'A healer who channels the emotional peak of collected memories. Joy heals, awe shields, fury empowers, and even sorrow cleanses afflictions.',
    skills: ['Joyful Mending', 'Awestruck Ward', 'Emotional Resonance'],
    stats: { ATK: 25, INT: 70, DEF: 65, AGI: 40, HP: 130, SP: 90 },
  },
];

const STAT_MAXES: Record<string, number> = { ATK: 100, INT: 100, DEF: 100, AGI: 100, HP: 200, SP: 150 };

export default {
  name: 'title-screen',
  inject: ['rpgGuiInteraction', 'rpgGuiClose'],
  data() {
    return {
      visible: true,
      showNewGame: false,
      activeTab: 'class' as string,
      selectedClassIndex: 0,
      touchStartX: 0,
      keyHandler: null as ((e: KeyboardEvent) => void) | null,
    };
  },
  computed: {
    allClasses(): ClassDef[] {
      return ALL_CLASSES;
    },
    selectedClassData(): ClassDef {
      return ALL_CLASSES[this.selectedClassIndex];
    },
    fateStats(): { label: string; value: number; percent: number }[] {
      const stats = this.selectedClassData.stats;
      return Object.entries(stats).map(([label, value]) => ({
        label,
        value,
        percent: Math.min(100, (value / (STAT_MAXES[label] || 100)) * 100),
      }));
    },
  },
  methods: {
    openNewGame() {
      this.showNewGame = true;
      audioManager.init().then(() => {
        audioManager.playSfx('SFX-UI-04');
      });
    },
    openCredits() {
      audioManager.init().then(() => {
        audioManager.playSfx('SFX-UI-04');
      });
      this.rpgGuiInteraction('title-screen', 'open-credits', {});
    },
    prevClass() {
      this.selectedClassIndex = (this.selectedClassIndex - 1 + ALL_CLASSES.length) % ALL_CLASSES.length;
      audioManager.init().then(() => {
        audioManager.playSfx('SFX-UI-03');
      });
    },
    nextClass() {
      this.selectedClassIndex = (this.selectedClassIndex + 1) % ALL_CLASSES.length;
      audioManager.init().then(() => {
        audioManager.playSfx('SFX-UI-03');
      });
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
      audioManager.init().then(() => {
        audioManager.playSfx('SFX-UI-07');
      });
      this.visible = false;
      this.rpgGuiInteraction('title-screen', 'class-selected', {
        classId: this.selectedClassData.id,
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
  },
  mounted() {
    const onKey = (e: KeyboardEvent) => {
      if (!this.visible) return;
      if (this.showNewGame) {
        if (e.key === 'ArrowLeft') this.prevClass();
        else if (e.key === 'ArrowRight') this.nextClass();
        else if (e.key === 'Escape') this.showNewGame = false;
        else if (e.key === 'Enter') this.startGame();
      }
    };
    window.addEventListener('keydown', onKey);
    this.keyHandler = onKey;
  },
  beforeUnmount() {
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
    }
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
  background: radial-gradient(ellipse at 50% 30%, var(--bg-primary) 0%, var(--bg-secondary) 50%, #050202 100%);
  font-family: var(--font-heading);
  color: var(--text-primary);
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
  border-color: var(--border-primary);
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
  color: var(--text-accent);
  margin-bottom: 0.5rem;
  animation: pulse-glow 3s ease-in-out infinite;
}
@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 8px rgba(184, 134, 11, 0.4); }
  50% { text-shadow: 0 0 20px rgba(184, 134, 11, 0.8); }
}

.title {
  font-size: 2rem;
  color: var(--border-primary);
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
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--text-accent);
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
  color: var(--text-primary);
  font-family: var(--font-heading);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s;
  text-align: left;
  min-height: 48px;
  -webkit-tap-highlight-color: transparent;
}

.menu-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(139, 31, 31, 0.3) 0%, rgba(60, 20, 20, 0.9) 100%);
  border-color: var(--border-primary);
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
.menu-arrow { color: var(--border-primary); font-size: 0.8rem; }
.menu-hint {
  font-size: 0.6rem;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-style: italic;
}

.version {
  font-size: 0.6rem;
  color: var(--text-secondary);
  font-family: var(--font-body);
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
  border: 2px solid var(--border-primary);
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
.modal-close:hover { color: var(--text-primary); border-color: var(--border-primary); }

.modal-title {
  font-size: 1.3rem;
  color: var(--text-accent);
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
  color: var(--text-secondary);
  font-family: var(--font-heading);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tab:hover { color: var(--text-primary); }
.tab.active {
  color: var(--text-accent);
  border-bottom-color: var(--text-accent);
  text-shadow: 0 0 8px rgba(184, 134, 11, 0.3);
}

/* ── Tab Content ──────────────────────────────── */
.tab-content {
  min-height: 140px;
  margin-bottom: 1rem;
}

.tab-desc {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0 0 1rem;
  line-height: 1.5;
}

.tab-hint {
  font-family: var(--font-body);
  font-size: 0.65rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-top: 0.75rem;
}

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
  color: var(--text-primary);
  margin: 0;
}

.class-mechanic {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-accent);
  font-family: var(--font-body);
  font-style: italic;
}

.class-desc {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-secondary);
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
  font-family: var(--font-body);
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
  color: var(--text-accent);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-arrow:hover {
  background: rgba(184, 134, 11, 0.15);
  border-color: var(--text-accent);
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
  border-color: var(--text-accent) !important;
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
  background: var(--text-accent);
  border-color: var(--text-accent);
  box-shadow: 0 0 6px rgba(184, 134, 11, 0.5);
}

.pip:hover:not(.active) {
  background: #555;
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
  color: var(--text-accent);
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

.stat-bar-fill.stat-atk { background: linear-gradient(90deg, #8b1f1f, #cc3333); }
.stat-bar-fill.stat-int { background: linear-gradient(90deg, #4b0082, #8844cc); }
.stat-bar-fill.stat-def { background: linear-gradient(90deg, #8b4513, #cc6633); }
.stat-bar-fill.stat-agi { background: linear-gradient(90deg, #228b22, #33cc33); }
.stat-bar-fill.stat-hp { background: linear-gradient(90deg, #1a4d8b, #3388cc); }
.stat-bar-fill.stat-sp { background: linear-gradient(90deg, #b8860b, #ffcc33); }

.stat-val {
  width: 28px;
  font-size: 0.7rem;
  color: var(--text-primary);
  text-align: right;
}

/* ── Embark Button ────────────────────────────── */
.embark-btn {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, var(--btn-primary) 0%, #6b1515 100%);
  border: 1px solid #a33;
  border-radius: 4px;
  color: var(--text-primary);
  font-family: var(--font-heading);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  min-height: 48px;
  -webkit-tap-highlight-color: transparent;
}

.embark-btn:hover {
  background: linear-gradient(135deg, #a33 0%, var(--btn-primary) 100%);
  box-shadow: 0 0 25px rgba(139, 31, 31, 0.5);
  transform: translateY(-1px);
}

.embark-btn:active { transform: scale(0.98); }
.embark-icon { margin-right: 0.3rem; }

/* ── Desktop ──────────────────────────────────── */
@media (min-width: 600px) {
  .title { font-size: 3rem; }
  .tagline { font-size: 0.9rem; }
  .modal-frame { padding: 2rem; }
  .modal-title { font-size: 1.5rem; }
  .tab-content { min-height: 180px; }
  .frame-corner { width: 80px; height: 80px; }
}

/* ── Reduced Motion ───────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .ember { animation: none; display: none; }
  .title { animation: none; }
  .title-ornament { animation: none; }
  .stat-bar-fill { transition: none; }
}
</style>
