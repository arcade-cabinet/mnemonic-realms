<template>
  <div class="pause-overlay" v-if="open" @click.self="close">
    <div class="pause-panel">
      <!-- Header: Player Status -->
      <div class="player-status">
        <div class="status-row">
          <div class="status-identity">
            <span class="status-class">{{ className }}</span>
            <span class="status-level">Lv {{ level }}</span>
          </div>
          <button class="pause-close" @click="close">&#x2715;</button>
        </div>

        <!-- HP / SP bars -->
        <div class="status-bars">
          <div class="status-bar">
            <span class="bar-label">HP</span>
            <div class="bar-track">
              <div class="bar-fill hp-fill" :style="{ width: hpPercent + '%' }" />
            </div>
            <span class="bar-value">{{ hp }}/{{ maxHp }}</span>
          </div>
          <div class="status-bar">
            <span class="bar-label">SP</span>
            <div class="bar-track">
              <div class="bar-fill sp-fill" :style="{ width: spPercent + '%' }" />
            </div>
            <span class="bar-value">{{ sp }}/{{ maxSp }}</span>
          </div>
        </div>

        <!-- Equipped items -->
        <div class="equipped-row">
          <div class="equip-tag" v-if="equippedWeaponName">
            <span class="equip-icon">&#x2694;</span>
            <span class="equip-name">{{ equippedWeaponName }}</span>
          </div>
          <div class="equip-tag" v-if="equippedArmorName">
            <span class="equip-icon">&#x25C6;</span>
            <span class="equip-name">{{ equippedArmorName }}</span>
          </div>
        </div>
      </div>

      <!-- Menu Options -->
      <nav class="menu-options" v-if="activeView === 'main'">
        <button class="menu-btn" @click="openInventory">
          <span class="menu-icon">&#x25C8;</span>
          <span class="menu-label">Inventory</span>
          <span class="menu-arrow">&#x25B8;</span>
        </button>
        <button class="menu-btn" @click="openQuestLog">
          <span class="menu-icon">&#x2630;</span>
          <span class="menu-label">Quest Log</span>
          <span class="menu-arrow">&#x25B8;</span>
        </button>
        <button class="menu-btn" @click="openMemories">
          <span class="menu-icon">&#x2726;</span>
          <span class="menu-label">Memories</span>
          <span class="menu-arrow">&#x25B8;</span>
        </button>
        <button class="menu-btn" @click="onSave">
          <span class="menu-icon">&#x2637;</span>
          <span class="menu-label">Save</span>
          <span class="menu-arrow">&#x25B8;</span>
        </button>
        <button class="menu-btn" @click="activeView = 'settings'">
          <span class="menu-icon">&#x2699;</span>
          <span class="menu-label">Settings</span>
          <span class="menu-arrow">&#x25B8;</span>
        </button>
        <button class="menu-btn menu-btn-danger" @click="activeView = 'confirm-title'">
          <span class="menu-icon">&#x2302;</span>
          <span class="menu-label">Return to Title</span>
          <span class="menu-arrow">&#x25B8;</span>
        </button>
      </nav>

      <!-- Save Slot Picker -->
      <div class="sub-view" v-if="activeView === 'save'">
        <div class="sub-header">
          <button class="back-btn" @click="activeView = 'main'">&#x25C0; Back</button>
          <h3 class="sub-title">Save Game</h3>
        </div>
        <div class="save-slots">
          <button
            class="save-slot"
            v-for="slot in saveSlotList"
            :key="slot.id"
            @click="executeSave(slot.id)"
          >
            <span class="slot-label">{{ slot.label }}</span>
            <div class="slot-info" v-if="slot.meta">
              <span class="slot-detail">Lv.{{ slot.meta.level }} &middot; {{ formatMap(slot.meta.mapId) }}</span>
              <span class="slot-extra">{{ formatPlayTime(slot.meta.playTimeMs) }} &middot; {{ formatDate(slot.meta.timestamp) }}</span>
            </div>
            <span class="slot-empty" v-else>Empty</span>
          </button>
        </div>
        <div class="save-result" v-if="saveMessage" :class="saveSuccess ? 'msg-success' : 'msg-fail'">
          {{ saveMessage }}
        </div>
      </div>

      <!-- Settings -->
      <div class="sub-view" v-if="activeView === 'settings'">
        <div class="sub-header">
          <button class="back-btn" @click="activeView = 'main'">&#x25C0; Back</button>
          <h3 class="sub-title">Settings</h3>
        </div>
        <div class="settings-list">
          <div class="setting-row">
            <span class="setting-label">BGM Volume</span>
            <input
              type="range"
              class="setting-slider"
              min="0"
              max="100"
              :value="bgmVolume"
              @input="onBgmVolume($event)"
            />
            <span class="setting-value">{{ bgmVolume }}%</span>
          </div>
          <div class="setting-row">
            <span class="setting-label">SFX Volume</span>
            <input
              type="range"
              class="setting-slider"
              min="0"
              max="100"
              :value="sfxVolume"
              @input="onSfxVolume($event)"
            />
            <span class="setting-value">{{ sfxVolume }}%</span>
          </div>
          <div class="setting-row">
            <span class="setting-label">Text Speed</span>
            <div class="speed-buttons">
              <button
                class="speed-btn"
                :class="{ active: textSpeed === 'slow' }"
                @click="setTextSpeed('slow')"
              >Slow</button>
              <button
                class="speed-btn"
                :class="{ active: textSpeed === 'normal' }"
                @click="setTextSpeed('normal')"
              >Normal</button>
              <button
                class="speed-btn"
                :class="{ active: textSpeed === 'fast' }"
                @click="setTextSpeed('fast')"
              >Fast</button>
            </div>
          </div>
          <div class="setting-row">
            <span class="setting-label">Screen Shake</span>
            <button
              class="toggle-btn"
              :class="{ active: screenShake }"
              @click="screenShake = !screenShake; persistSettings()"
            >
              {{ screenShake ? 'ON' : 'OFF' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Return to Title Confirmation -->
      <div class="sub-view" v-if="activeView === 'confirm-title'">
        <div class="confirm-dialog">
          <p class="confirm-text">Return to the title screen?</p>
          <p class="confirm-warn">Unsaved progress will be lost.</p>
          <div class="confirm-buttons">
            <button class="action-btn confirm-yes" @click="returnToTitle">Confirm</button>
            <button class="action-btn confirm-no" @click="activeView = 'main'">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed, onMounted, onUnmounted } from 'vue';
import { audioManager } from '../client/audio';
import { readAllMeta, writeSave } from '../client/save-load';
import type { SaveSlotId, SaveSlotMeta } from '../server/systems/save-load';

// ── Item Catalog (minimal subset for equipped item names) ────────────────────

const ITEM_NAMES: Record<string, string> = {
  'W-SW-01': 'Training Sword',
  'W-SW-02': 'Iron Blade',
  'W-SW-03': "Oathkeeper's Edge",
  'W-SW-04': 'Brightwater Saber',
  'W-SW-05': 'Ridgewalker Claymore',
  'W-SW-06': 'Frontier Greatsword',
  'W-SW-07': 'Oath-Forged Blade',
  'W-SW-08': "Memory's Edge",
  'W-DG-01': 'Worn Knife',
  'W-DG-02': 'Steel Stiletto',
  'W-DG-03': 'Windmill Blade',
  'W-DG-04': 'Shadow Fang',
  'W-DG-05': 'Flickerblade',
  'W-DG-06': 'Phantom Edge',
  'W-DG-07': 'Temporal Shard',
  'W-DG-08': 'Echo of Tomorrow',
  'W-ST-01': 'Wooden Staff',
  'W-ST-02': "Maren's Blessing Rod",
  'W-ST-03': 'Hearthstone Staff',
  'W-ST-04': 'Riverside Crosier',
  'W-ST-05': "Marsh Hermit's Crook",
  'W-ST-06': "Luminary's Scepter",
  'W-ST-07': 'Euphoric Wand',
  'W-ST-08': 'First Light',
  'W-WD-01': 'Apprentice Wand',
  'W-WD-02': 'Amber Focus',
  'W-WD-03': 'Windcatcher Rod',
  'W-WD-04': 'Prism Wand',
  'W-WD-05': 'Resonance Tuner',
  'W-WD-06': 'Arcane Catalyst',
  'W-WD-07': "Inspiration's Core",
  'W-WD-08': 'Dissolved Memory Lens',
  'A-01': "Traveler's Tunic",
  'A-02': 'Padded Vest',
  'A-03': 'Leather Armor',
  'A-04': 'Chain Mail',
  'A-05': 'Forest Weave',
  'A-06': 'Riverstone Plate',
  'A-07': "Hermit's Robe",
  'A-08': "Ridgewalker's Coat",
  'A-09': 'Frontier Guard',
  'A-10': "Preserver's Crystal Mail",
  'A-11': 'Luminary Vestment',
  'A-12': 'Verdant Mantle',
  'A-13': 'Sketchweave Cloak',
  'A-14': 'Memory-Woven Plate',
};

const CLASS_NAMES: Record<string, string> = {
  knight: 'Knight',
  mage: 'Mage',
  rogue: 'Rogue',
  cleric: 'Cleric',
};

const SETTINGS_KEY = 'mnemonic-realms-settings';

interface GameSettings {
  bgmVolume: number;
  sfxVolume: number;
  textSpeed: 'slow' | 'normal' | 'fast';
  screenShake: boolean;
}

function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw) as GameSettings;
  } catch {
    // Fall through to defaults
  }
  return { bgmVolume: 80, sfxVolume: 80, textSpeed: 'normal', screenShake: true };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function readVar(player: any, key: string): unknown {
  if (!player) return undefined;
  if (player.variables instanceof Map) {
    return player.variables.get(key);
  }
  if (Array.isArray(player.variables)) {
    const entry = player.variables.find((e: [string, unknown]) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
  return undefined;
}

interface SlotDisplay {
  id: SaveSlotId;
  label: string;
  meta: SaveSlotMeta | null;
}

// ── Component ───────────────────────────────────────────────────────────────

export default defineComponent({
  name: 'pause-menu',
  setup() {
    const open = ref(false);
    const activeView = ref<'main' | 'save' | 'settings' | 'confirm-title'>('main');

    // Player data
    const hp = ref(0);
    const maxHp = ref(1);
    const sp = ref(0);
    const maxSp = ref(1);
    const level = ref(1);
    const classId = ref('');
    const equippedWeapon = ref<string | null>(null);
    const equippedArmor = ref<string | null>(null);

    // Settings
    const saved = loadSettings();
    const bgmVolume = ref(saved.bgmVolume);
    const sfxVolume = ref(saved.sfxVolume);
    const textSpeed = ref<'slow' | 'normal' | 'fast'>(saved.textSpeed);
    const screenShake = ref(saved.screenShake);

    // Save
    const saveMessage = ref('');
    const saveSuccess = ref(true);
    const slotMeta = ref<Partial<Record<SaveSlotId, SaveSlotMeta>>>({});

    // Injections
    const rpgCurrentPlayer = inject<any>('rpgCurrentPlayer');
    const rpgGuiInteraction = inject<any>('rpgGuiInteraction');
    const rpgGuiClose = inject<(id: string, data?: any) => void>('rpgGuiClose');

    let subscription: { unsubscribe(): void } | null = null;
    let saveTimer: ReturnType<typeof setTimeout> | null = null;

    // ── Computed ──

    const hpPercent = computed(() => (maxHp.value > 0 ? (hp.value / maxHp.value) * 100 : 0));
    const spPercent = computed(() => (maxSp.value > 0 ? (sp.value / maxSp.value) * 100 : 0));
    const className = computed(() => CLASS_NAMES[classId.value] ?? 'Adventurer');
    const equippedWeaponName = computed(() =>
      equippedWeapon.value ? ITEM_NAMES[equippedWeapon.value] ?? equippedWeapon.value : null,
    );
    const equippedArmorName = computed(() =>
      equippedArmor.value ? ITEM_NAMES[equippedArmor.value] ?? equippedArmor.value : null,
    );

    const saveSlotList = computed<SlotDisplay[]>(() => {
      const slots: { id: SaveSlotId; label: string }[] = [
        { id: 'slot-1', label: 'Slot 1' },
        { id: 'slot-2', label: 'Slot 2' },
        { id: 'slot-3', label: 'Slot 3' },
      ];
      return slots.map((s) => ({
        ...s,
        meta: slotMeta.value[s.id] ?? null,
      }));
    });

    // ── Methods ──

    function close() {
      open.value = false;
      activeView.value = 'main';
      saveMessage.value = '';
    }

    function openInventory() {
      close();
      rpgGuiInteraction?.('pause-menu', 'open-inventory', {});
    }

    function openQuestLog() {
      close();
      rpgGuiInteraction?.('pause-menu', 'open-quest-log', {});
    }

    function openMemories() {
      close();
      rpgGuiInteraction?.('pause-menu', 'open-memories', {});
    }

    function onSave() {
      slotMeta.value = readAllMeta();
      activeView.value = 'save';
    }

    function executeSave(slotId: SaveSlotId) {
      rpgGuiInteraction?.('pause-menu', 'save-game', { slotId });
      audioManager.playSfx('SFX-UI-07');
      saveMessage.value = 'Game saved!';
      saveSuccess.value = true;
      slotMeta.value = readAllMeta();
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        saveMessage.value = '';
      }, 2500);
    }

    function returnToTitle() {
      close();
      rpgGuiInteraction?.('pause-menu', 'return-to-title', {});
    }

    function persistSettings() {
      const settings: GameSettings = {
        bgmVolume: bgmVolume.value,
        sfxVolume: sfxVolume.value,
        textSpeed: textSpeed.value,
        screenShake: screenShake.value,
      };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch {
        // localStorage may be unavailable
      }
      rpgGuiInteraction?.('pause-menu', 'settings-changed', settings);
    }

    function onBgmVolume(event: Event) {
      const val = Number((event.target as HTMLInputElement).value);
      bgmVolume.value = val;
      audioManager.setBgmVolume(val / 100);
      audioManager.setAmbientScale(val / 100);
      persistSettings();
    }

    function onSfxVolume(event: Event) {
      const val = Number((event.target as HTMLInputElement).value);
      sfxVolume.value = val;
      audioManager.setSfxVolume(val / 100);
      audioManager.setUiVolume(val / 100);
      persistSettings();
    }

    function setTextSpeed(speed: 'slow' | 'normal' | 'fast') {
      textSpeed.value = speed;
      persistSettings();
    }

    function formatMap(mapId: string): string {
      return mapId
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c: string) => c.toUpperCase());
    }

    function formatPlayTime(ms: number): string {
      const totalSec = Math.floor((ms || 0) / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    }

    function formatDate(timestamp: number): string {
      return new Date(timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    // ── Lifecycle ──

    let keyHandler: ((e: KeyboardEvent) => void) | null = null;

    onMounted(() => {
      // Apply saved volume settings on mount
      audioManager.setBgmVolume(bgmVolume.value / 100);
      audioManager.setAmbientScale(bgmVolume.value / 100);
      audioManager.setSfxVolume(sfxVolume.value / 100);
      audioManager.setUiVolume(sfxVolume.value / 100);

      if (rpgCurrentPlayer) {
        subscription = rpgCurrentPlayer.subscribe(({ object }: { object: any }) => {
          if (!object) return;

          hp.value = object.hp ?? 0;
          maxHp.value = object.param?.maxHp ?? 1;
          sp.value = object.sp ?? 0;
          maxSp.value = object.param?.maxSp ?? 1;

          const builtinLevel = object.level;
          const varLevel = readVar(object, 'PLAYER_LEVEL') as number | undefined;
          level.value = builtinLevel ?? varLevel ?? 1;

          classId.value = (readVar(object, 'PLAYER_CLASS_ID') as string) ?? '';

          const equip = readVar(object, 'EQUIPMENT') as {
            weapon: string | null;
            armor: string | null;
            accessory: string | null;
          } | undefined;
          equippedWeapon.value = equip?.weapon ?? null;
          equippedArmor.value = equip?.armor ?? null;
        });
      }

      keyHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          if (open.value) {
            if (activeView.value !== 'main') {
              activeView.value = 'main';
            } else {
              close();
            }
          } else {
            open.value = true;
            activeView.value = 'main';
            audioManager.playSfx('SFX-UI-04');
          }
        }
      };
      window.addEventListener('keydown', keyHandler);

      // Gamepad polling for Start button
      let gamepadRaf: number | null = null;
      let prevStartPressed = false;

      function pollGamepad() {
        const gamepads = navigator.getGamepads?.();
        if (gamepads) {
          for (const gp of gamepads) {
            if (!gp) continue;
            // Button 9 is typically the Start button
            const startPressed = gp.buttons[9]?.pressed ?? false;
            if (startPressed && !prevStartPressed) {
              if (open.value) {
                if (activeView.value !== 'main') {
                  activeView.value = 'main';
                } else {
                  close();
                }
              } else {
                open.value = true;
                activeView.value = 'main';
                audioManager.playSfx('SFX-UI-04');
              }
            }
            prevStartPressed = startPressed;
            break; // Only handle first connected gamepad
          }
        }
        gamepadRaf = requestAnimationFrame(pollGamepad);
      }
      gamepadRaf = requestAnimationFrame(pollGamepad);

      // Store cleanup ref for gamepad polling
      (keyHandler as any).__gamepadRaf = gamepadRaf;
    });

    onUnmounted(() => {
      subscription?.unsubscribe();
      if (keyHandler) {
        window.removeEventListener('keydown', keyHandler);
        const raf = (keyHandler as any).__gamepadRaf;
        if (raf) cancelAnimationFrame(raf);
      }
      if (saveTimer) clearTimeout(saveTimer);
    });

    return {
      open,
      activeView,
      hp,
      maxHp,
      sp,
      maxSp,
      level,
      className,
      equippedWeaponName,
      equippedArmorName,
      hpPercent,
      spPercent,
      bgmVolume,
      sfxVolume,
      textSpeed,
      screenShake,
      saveSlotList,
      saveMessage,
      saveSuccess,
      close,
      openInventory,
      openQuestLog,
      openMemories,
      onSave,
      executeSave,
      returnToTitle,
      onBgmVolume,
      onSfxVolume,
      setTextSpeed,
      persistSettings,
      formatMap,
      formatPlayTime,
      formatDate,
    };
  },
});
</script>

<style scoped>
/* ── Overlay ─────────────────────────────────── */
.pause-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 600;
  font-family: var(--font-body, 'Merriweather', serif);
  color: var(--text-primary, #d4c4a0);
}

/* ── Panel ───────────────────────────────────── */
.pause-panel {
  width: 100%;
  max-width: 420px;
  max-height: 90vh;
  background: linear-gradient(180deg, #1a0a0a 0%, #0d0505 100%);
  border: 2px solid var(--border-primary, #8b1f1f);
  border-radius: 6px;
  padding: 1.25rem;
  box-sizing: border-box;
  box-shadow: 0 0 60px rgba(139, 31, 31, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
}

/* ── Player Status ──────────────────────────── */
.player-status {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #5a2a2a;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.status-identity {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.status-class {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 1.1rem;
  color: var(--text-accent, #b8860b);
  text-shadow: 0 0 10px rgba(184, 134, 11, 0.3);
}

.status-level {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.8rem;
  color: var(--text-primary, #d4c4a0);
}

.pause-close {
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
.pause-close:hover { color: var(--text-primary, #d4c4a0); border-color: var(--border-primary, #8b1f1f); }

/* ── HP / SP Bars ───────────────────────────── */
.status-bars {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bar-label {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-accent, #b8860b);
  width: 22px;
  text-align: right;
}

.bar-track {
  flex: 1;
  height: 10px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(139, 31, 31, 0.5);
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 1px;
}

.hp-fill {
  background: linear-gradient(180deg, #40c540 0%, #1f8b1f 100%);
}

.sp-fill {
  background: linear-gradient(180deg, #4078c5 0%, #1f3f8b 100%);
}

.bar-value {
  font-size: 0.65rem;
  color: var(--text-secondary, #8a7a60);
  min-width: 55px;
  text-align: right;
}

/* ── Equipped Items ─────────────────────────── */
.equipped-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.equip-tag {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  background: rgba(0, 0, 0, 0.4);
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  border: 1px solid #3a1a1a;
}

.equip-icon {
  font-size: 0.75rem;
  color: var(--text-accent, #b8860b);
}

.equip-name {
  color: var(--text-secondary, #8a7a60);
}

/* ── Menu Options ───────────────────────────── */
.menu-options {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.menu-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.7rem 0.9rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #3a1a1a;
  border-radius: 4px;
  color: var(--text-primary, #d4c4a0);
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  min-height: 42px;
  -webkit-tap-highlight-color: transparent;
}

.menu-btn:hover {
  background: rgba(139, 31, 31, 0.2);
  border-color: #5a2a2a;
  transform: translateX(3px);
}

.menu-btn:active {
  transform: translateX(3px) scale(0.98);
}

.menu-btn-danger {
  border-color: #4a1a1a;
  color: var(--text-secondary, #8a7a60);
}
.menu-btn-danger:hover {
  color: #cc6666;
  border-color: #8b1f1f;
}

.menu-icon {
  font-size: 1rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.menu-label { flex: 1; }

.menu-arrow {
  color: #5a2a2a;
  font-size: 0.7rem;
  flex-shrink: 0;
}
.menu-btn:hover .menu-arrow { color: var(--border-primary, #8b1f1f); }

/* ── Sub-view Header ────────────────────────── */
.sub-view {
  min-height: 120px;
}

.sub-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.back-btn {
  background: none;
  border: 1px solid #5a2a2a;
  color: var(--text-secondary, #8a7a60);
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
}
.back-btn:hover { color: var(--text-primary, #d4c4a0); border-color: var(--border-primary, #8b1f1f); }

.sub-title {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 1rem;
  color: var(--text-accent, #b8860b);
  margin: 0;
}

/* ── Save Slots ─────────────────────────────── */
.save-slots {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.save-slot {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.6rem 0.8rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #3a1a1a;
  border-radius: 4px;
  color: var(--text-primary, #d4c4a0);
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.save-slot:hover {
  border-color: var(--text-accent, #b8860b);
  box-shadow: 0 0 10px rgba(184, 134, 11, 0.15);
}

.slot-label {
  font-weight: bold;
  min-width: 50px;
  color: var(--text-accent, #b8860b);
  font-size: 0.7rem;
  text-transform: uppercase;
}

.slot-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.slot-detail {
  font-family: var(--font-body, 'Merriweather', serif);
  font-size: 0.65rem;
  color: var(--text-primary, #d4c4a0);
}

.slot-extra {
  font-family: var(--font-body, 'Merriweather', serif);
  font-size: 0.55rem;
  color: var(--text-secondary, #8a7a60);
}

.slot-empty {
  font-family: var(--font-body, 'Merriweather', serif);
  font-size: 0.65rem;
  color: var(--text-secondary, #8a7a60);
  font-style: italic;
}

/* ── Save Result ────────────────────────────── */
.save-result {
  text-align: center;
  font-size: 0.75rem;
  padding: 0.4rem 0.6rem;
  border-radius: 3px;
  margin-top: 0.75rem;
}

.msg-success {
  background: rgba(64, 197, 64, 0.15);
  border: 1px solid rgba(64, 197, 64, 0.3);
  color: #40c540;
}

.msg-fail {
  background: rgba(197, 64, 64, 0.15);
  border: 1px solid rgba(197, 64, 64, 0.3);
  color: #c54040;
}

/* ── Settings ───────────────────────────────── */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.setting-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.setting-label {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.75rem;
  color: var(--text-primary, #d4c4a0);
  min-width: 90px;
}

.setting-slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #5a2a2a;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.setting-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--text-accent, #b8860b);
  border: 2px solid #1a0a0a;
  cursor: pointer;
  box-shadow: 0 0 6px rgba(184, 134, 11, 0.4);
}

.setting-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--text-accent, #b8860b);
  border: 2px solid #1a0a0a;
  cursor: pointer;
  box-shadow: 0 0 6px rgba(184, 134, 11, 0.4);
}

.setting-value {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.7rem;
  color: var(--text-secondary, #8a7a60);
  min-width: 36px;
  text-align: right;
}

/* ── Speed buttons ──────────────────────────── */
.speed-buttons {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}

.speed-btn {
  flex: 1;
  padding: 0.35rem 0.3rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #3a1a1a;
  border-radius: 3px;
  color: var(--text-secondary, #8a7a60);
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
}

.speed-btn:hover { color: var(--text-primary, #d4c4a0); border-color: #5a2a2a; }
.speed-btn.active {
  color: var(--text-accent, #b8860b);
  border-color: var(--text-accent, #b8860b);
  background: rgba(184, 134, 11, 0.1);
  text-shadow: 0 0 6px rgba(184, 134, 11, 0.3);
}

/* ── Toggle button ──────────────────────────── */
.toggle-btn {
  padding: 0.35rem 0.8rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #3a1a1a;
  border-radius: 3px;
  color: var(--text-secondary, #8a7a60);
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 50px;
}

.toggle-btn:hover { border-color: #5a2a2a; }
.toggle-btn.active {
  color: #40c540;
  border-color: rgba(64, 197, 64, 0.4);
  background: rgba(64, 197, 64, 0.1);
}

/* ── Confirmation Dialog ────────────────────── */
.confirm-dialog {
  text-align: center;
  padding: 1rem 0;
}

.confirm-text {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.95rem;
  color: var(--text-primary, #d4c4a0);
  margin: 0 0 0.3rem;
}

.confirm-warn {
  font-size: 0.7rem;
  color: #cc6666;
  font-style: italic;
  margin: 0 0 1rem;
}

.confirm-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  flex: 1;
  max-width: 140px;
  padding: 0.6rem;
  border-radius: 4px;
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  min-height: 40px;
  -webkit-tap-highlight-color: transparent;
}

.confirm-yes {
  background: linear-gradient(135deg, rgba(139, 31, 31, 0.5) 0%, rgba(80, 15, 15, 0.7) 100%);
  border: 1px solid #8b1f1f;
  color: #cc8888;
}
.confirm-yes:hover {
  background: linear-gradient(135deg, rgba(170, 40, 40, 0.6) 0%, rgba(100, 20, 20, 0.8) 100%);
  box-shadow: 0 0 15px rgba(139, 31, 31, 0.3);
}

.confirm-no {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #5a2a2a;
  color: var(--text-secondary, #8a7a60);
}
.confirm-no:hover {
  border-color: var(--text-accent, #b8860b);
  color: var(--text-primary, #d4c4a0);
}

.action-btn:active { transform: scale(0.97); }

/* ── Desktop ─────────────────────────────────── */
@media (min-width: 600px) {
  .pause-panel {
    padding: 1.5rem 2rem;
  }
  .status-class {
    font-size: 1.3rem;
  }
}

/* ── Mobile ──────────────────────────────────── */
@media (max-width: 599px) {
  .pause-panel {
    max-width: 100%;
    border-radius: 0;
    max-height: 100vh;
  }
}

/* ── Reduced Motion ──────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .menu-btn,
  .action-btn,
  .back-btn,
  .pause-close,
  .save-slot,
  .speed-btn,
  .toggle-btn,
  .bar-fill {
    transition: none;
  }
}
</style>
