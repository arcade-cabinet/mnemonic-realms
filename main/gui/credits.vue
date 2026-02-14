<template>
  <div class="credits-screen" v-if="visible">
    <!-- Ornate frame corners -->
    <div class="frame-corner tl"></div>
    <div class="frame-corner tr"></div>
    <div class="frame-corner bl"></div>
    <div class="frame-corner br"></div>

    <div class="credits-container">
      <div class="scroll-content" ref="scrollContent" :style="scrollStyle">
        <div class="credits-header">
          <div class="header-ornament">&#x2726;</div>
          <h1 class="credits-title">Mnemonic Realms</h1>
          <p class="credits-subtitle">A World Unfinished</p>
          <div class="credits-divider">
            <span class="divider-wing">&#x2500;&#x2500;&#x2500; &#x2666; &#x2500;&#x2500;&#x2500;</span>
          </div>
        </div>

        <section class="credits-section">
          <h2 class="section-title">Game Design &amp; Development</h2>
          <p class="credit-line">Created with RPG-JS 4.3.0</p>
          <p class="credit-line">Story &amp; World Design by Ralph (AI Agent)</p>
          <p class="credit-line">Music &amp; Sound by Pixabay</p>
        </section>

        <section class="credits-section">
          <h2 class="section-title">Art &amp; Asset Attributions</h2>
          <p class="attribution-note">
            The following CC0-licensed asset packs are used in this game.
            We gratefully acknowledge their creators.
          </p>
          <div class="attribution-list">
            <div class="attribution-item" v-for="attr in attributions" :key="attr.name">
              <span class="attr-bullet">&#x25C8;</span>
              <span class="attr-name">{{ attr.name }}</span>
            </div>
          </div>
        </section>

        <section class="credits-section">
          <h2 class="section-title">Technology</h2>
          <p class="credit-line">RPG-JS &mdash; Open-source RPG engine</p>
          <p class="credit-line">PixiJS &mdash; 2D rendering engine</p>
          <p class="credit-line">Vue.js &mdash; UI framework</p>
          <p class="credit-line">Vite &mdash; Build tooling</p>
          <p class="credit-line">Google Gemini &mdash; Asset generation pipeline</p>
        </section>

        <section class="credits-section">
          <h2 class="section-title">Special Thanks</h2>
          <p class="credit-line">To all who remember, and dare to create anew.</p>
        </section>

        <div class="credits-footer">
          <div class="footer-ornament">&#x2726;</div>
          <p class="footer-text">Thank you for playing</p>
          <div class="credits-divider">
            <span class="divider-wing">&#x2500;&#x2500;&#x2500; &#x2666; &#x2500;&#x2500;&#x2500;</span>
          </div>
        </div>
      </div>
    </div>

    <button class="close-btn" @click="close">
      <span>&#x2715;</span> Close
    </button>
  </div>
</template>

<script lang="ts">
interface Attribution {
  name: string;
}

const ATTRIBUTIONS: Attribution[] = [
  { name: 'Backterria Tileset Pack (CC0)' },
  { name: 'Dungeons Tileset Pack (CC0)' },
  { name: 'Fantasy Castles Tileset Pack (CC0)' },
  { name: 'Fantasy Desert Tileset Pack (CC0)' },
  { name: 'Fantasy Free Tileset Pack (CC0)' },
  { name: 'Fantasy Interiors Tileset Pack (CC0)' },
  { name: 'Fantasy Premium Tileset Pack (CC0)' },
  { name: 'Fantasy Seasons Tileset Pack (CC0)' },
  { name: 'Fantasy Snow Tileset Pack (CC0)' },
  { name: 'Grand Forests Tileset Pack (CC0)' },
  { name: 'Lonesome Forest Tileset Pack (CC0)' },
  { name: 'Natural Interiors Tileset Pack (CC0)' },
  { name: 'Old Town Exteriors Tileset Pack (CC0)' },
  { name: 'Old Town Interiors Tileset Pack (CC0)' },
  { name: 'Pixel Dungeon Tileset Pack (CC0)' },
  { name: 'World Map Tileset Pack (CC0)' },
];

export default {
  name: 'credits-screen',
  inject: ['rpgGuiInteraction', 'rpgGuiClose'],
  data() {
    return {
      visible: true,
      scrollY: 0,
      animFrame: null as number | null,
      keyHandler: null as ((e: KeyboardEvent) => void) | null,
    };
  },
  computed: {
    attributions(): Attribution[] {
      return ATTRIBUTIONS;
    },
    scrollStyle(): Record<string, string> {
      return {
        transform: `translateY(${-this.scrollY}px)`,
      };
    },
  },
  methods: {
    close() {
      this.visible = false;
      this.rpgGuiClose('credits-screen');
    },
    startScroll() {
      const tick = () => {
        this.scrollY += 0.5;
        const el = this.$refs.scrollContent as HTMLElement | undefined;
        if (el) {
          const maxScroll = el.scrollHeight - window.innerHeight + 100;
          if (this.scrollY >= maxScroll) {
            this.scrollY = maxScroll;
          }
        }
        this.animFrame = requestAnimationFrame(tick);
      };
      this.animFrame = requestAnimationFrame(tick);
    },
    stopScroll() {
      if (this.animFrame !== null) {
        cancelAnimationFrame(this.animFrame);
        this.animFrame = null;
      }
    },
  },
  mounted() {
    this.startScroll();

    const onKey = (e: KeyboardEvent) => {
      if (!this.visible) return;
      if (e.key === 'Escape' || e.key === 'Enter') {
        this.close();
      }
    };
    window.addEventListener('keydown', onKey);
    this.keyHandler = onKey;
  },
  beforeUnmount() {
    this.stopScroll();
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
    }
  },
};
</script>

<style scoped>
/* ── Base ─────────────────────────────────────── */
.credits-screen {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: radial-gradient(ellipse at 50% 30%, var(--bg-primary) 0%, var(--bg-secondary) 50%, #050202 100%);
  font-family: var(--font-heading);
  color: var(--text-primary);
  z-index: 1000;
  overflow: hidden;
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

/* ── Scrolling container ─────────────────────── */
.credits-container {
  flex: 1;
  width: 100%;
  max-width: 560px;
  overflow: hidden;
  position: relative;
  z-index: 10;
  padding: 0 1rem;
  box-sizing: border-box;
  mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
}

.scroll-content {
  padding-top: 100vh;
  padding-bottom: 60vh;
  will-change: transform;
}

/* ── Credits Header ──────────────────────────── */
.credits-header {
  text-align: center;
  margin-bottom: 3rem;
}

.header-ornament {
  font-size: 1.5rem;
  color: var(--text-accent);
  margin-bottom: 0.5rem;
}

.credits-title {
  font-size: 2rem;
  color: var(--border-primary);
  text-shadow: 0 0 30px rgba(139, 31, 31, 0.6), 0 0 60px rgba(139, 31, 31, 0.3), 0 2px 4px rgba(0, 0, 0, 0.8);
  margin: 0;
  letter-spacing: 0.12em;
  line-height: 1.2;
}

.credits-subtitle {
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--text-accent);
  margin: 0.6rem 0 0;
  font-style: italic;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.credits-divider {
  margin-top: 1rem;
}

.divider-wing {
  color: #5a3a3a;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
}

/* ── Sections ────────────────────────────────── */
.credits-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 0.85rem;
  color: var(--text-accent);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 0 0 1rem;
  text-shadow: 0 0 10px rgba(184, 134, 11, 0.3);
}

.credit-line {
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--text-primary);
  margin: 0.4rem 0;
  line-height: 1.6;
}

.attribution-note {
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-style: italic;
  margin: 0 0 1rem;
  line-height: 1.5;
}

/* ── Attribution list ────────────────────────── */
.attribution-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: center;
}

.attribution-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-primary);
}

.attr-bullet {
  color: #5a2a2a;
  font-size: 0.5rem;
}

.attr-name {
  color: var(--text-primary);
}

/* ── Footer ──────────────────────────────────── */
.credits-footer {
  text-align: center;
  margin-top: 3rem;
}

.footer-ornament {
  font-size: 1.2rem;
  color: var(--text-accent);
  margin-bottom: 0.5rem;
}

.footer-text {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-accent);
  font-style: italic;
  letter-spacing: 0.1em;
  margin: 0 0 1rem;
}

/* ── Close button ────────────────────────────── */
.close-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 20;
  padding: 0.6rem 1.2rem;
  background: rgba(26, 10, 10, 0.9);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  color: var(--text-secondary);
  font-family: var(--font-heading);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 40px;
  -webkit-tap-highlight-color: transparent;
}

.close-btn:hover {
  color: var(--text-primary);
  border-color: var(--border-primary);
  box-shadow: 0 0 15px rgba(139, 31, 31, 0.3);
}

.close-btn:active {
  transform: scale(0.96);
}

/* ── Desktop ──────────────────────────────────── */
@media (min-width: 600px) {
  .credits-title { font-size: 3rem; }
  .credits-subtitle { font-size: 0.9rem; }
  .section-title { font-size: 1rem; }
  .credit-line { font-size: 0.85rem; }
  .attribution-item { font-size: 0.8rem; }
  .frame-corner { width: 80px; height: 80px; }
}

/* ── Reduced Motion ───────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .scroll-content {
    padding-top: 2rem;
    padding-bottom: 2rem;
    transform: none !important;
  }
  .credits-container {
    overflow-y: auto;
  }
}
</style>
