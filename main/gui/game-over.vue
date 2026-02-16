<template>
  <div class="game-over" v-if="visible">
    <!-- Fading darkness particles -->
    <div class="void-particles">
      <div class="void-mote" v-for="i in 8" :key="i" :style="moteStyle(i)"></div>
    </div>

    <!-- Ornate frame corners -->
    <div class="frame-corner tl"></div>
    <div class="frame-corner tr"></div>
    <div class="frame-corner bl"></div>
    <div class="frame-corner br"></div>

    <div class="content">
      <div class="death-ornament">&#x2620;</div>
      <h1 class="death-title">Memories Fade</h1>
      <p class="death-tagline">The world grows dim without your light...</p>
      <div class="title-divider">
        <span class="divider-wing">&#x2500;&#x2500;&#x2500; &#x2666; &#x2500;&#x2500;&#x2500;</span>
      </div>

      <nav class="menu">
        <button class="menu-btn" @click="returnToTitle">
          <span class="menu-icon">&#x2302;</span>
          <span class="menu-label">Return to Title</span>
          <span class="menu-arrow">&#x25B8;</span>
        </button>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'game-over',
  inject: ['rpgGuiInteraction', 'rpgGuiClose'],
  data() {
    return {
      visible: true,
      keyHandler: null as ((e: KeyboardEvent) => void) | null,
    };
  },
  methods: {
    returnToTitle() {
      this.visible = false;
      this.rpgGuiInteraction('game-over', 'return-to-title', {});
    },
    moteStyle(i: number) {
      const x = (i * 137.5) % 100;
      const delay = (i * 1.1) % 5;
      const dur = 5 + (i % 3);
      const size = 3 + (i % 4);
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
      if (e.key === 'Enter') this.returnToTitle();
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
.game-over {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at 50% 50%, #1a0505 0%, #080202 60%, #000 100%);
  font-family: var(--font-heading);
  color: var(--text-primary);
  z-index: 1000;
  overflow: hidden;
}

/* ── Void particles (falling, fading) ─────────── */
.void-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.void-mote {
  position: absolute;
  top: -10px;
  background: radial-gradient(circle, rgba(100, 50, 50, 0.6) 0%, rgba(60, 20, 20, 0.3) 60%, transparent 100%);
  border-radius: 50%;
  opacity: 0;
  animation: drift-down linear infinite;
}
@keyframes drift-down {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 0.5; }
  90% { opacity: 0.1; }
  100% { transform: translateY(100vh) scale(0.5); opacity: 0; }
}

/* ── Ornate frame corners ─────────────────────── */
.frame-corner {
  position: absolute;
  width: 60px;
  height: 60px;
  border-color: #5a2a2a;
  pointer-events: none;
  opacity: 0.4;
}
.frame-corner.tl { top: 12px; left: 12px; border-top: 2px solid; border-left: 2px solid; }
.frame-corner.tr { top: 12px; right: 12px; border-top: 2px solid; border-right: 2px solid; }
.frame-corner.bl { bottom: 12px; left: 12px; border-bottom: 2px solid; border-left: 2px solid; }
.frame-corner.br { bottom: 12px; right: 12px; border-bottom: 2px solid; border-right: 2px solid; }

/* ── Content ─────────────────────────────────── */
.content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 1rem;
  width: 100%;
  max-width: 420px;
}

.death-ornament {
  font-size: 2rem;
  color: #8b1f1f;
  margin-bottom: 0.5rem;
  animation: pulse-death 3s ease-in-out infinite;
}
@keyframes pulse-death {
  0%, 100% { text-shadow: 0 0 8px rgba(139, 31, 31, 0.4); opacity: 0.7; }
  50% { text-shadow: 0 0 20px rgba(139, 31, 31, 0.8); opacity: 1; }
}

.death-title {
  font-size: 2rem;
  color: #8b1f1f;
  text-shadow: 0 0 30px rgba(139, 31, 31, 0.6), 0 0 60px rgba(139, 31, 31, 0.3), 0 2px 4px rgba(0, 0, 0, 0.8);
  margin: 0;
  letter-spacing: 0.12em;
  line-height: 1.2;
}

.death-tagline {
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0.8rem 0 0;
  font-style: italic;
  letter-spacing: 0.1em;
}

.title-divider { margin: 1rem 0 2rem; }
.divider-wing {
  color: #3a2222;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
}

/* ── Menu Buttons ─────────────────────────────── */
.menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.menu-btn:hover {
  background: linear-gradient(135deg, rgba(139, 31, 31, 0.3) 0%, rgba(60, 20, 20, 0.9) 100%);
  border-color: var(--border-primary);
  box-shadow: 0 0 20px rgba(139, 31, 31, 0.3), inset 0 0 20px rgba(139, 31, 31, 0.1);
  transform: translateX(4px);
}

.menu-btn:active {
  transform: translateX(4px) scale(0.98);
}

.menu-icon { font-size: 1.2rem; width: 28px; text-align: center; }
.menu-label { flex: 1; }
.menu-arrow { color: var(--border-primary); font-size: 0.8rem; }

/* ── Desktop ──────────────────────────────────── */
@media (min-width: 600px) {
  .death-title { font-size: 3rem; }
  .death-tagline { font-size: 0.9rem; }
  .frame-corner { width: 80px; height: 80px; }
}

/* ── Reduced Motion ───────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .void-mote { animation: none; display: none; }
  .death-ornament { animation: none; }
}
</style>
