<template>
  <div class="battle-ui" v-if="visible && combatActive">
    <!-- ── Victory Screen ───────────────────────── -->
    <div class="victory-overlay" v-if="phase === 'victory'">
      <div class="victory-panel">
        <div class="victory-ornament">&#x2726;</div>
        <h2 class="victory-title">Victory!</h2>
        <div class="victory-divider">
          <span class="divider-wing">&#x2500;&#x2500;&#x2500; &#x2666; &#x2500;&#x2500;&#x2500;</span>
        </div>
        <div class="victory-rewards">
          <div class="reward-row">
            <span class="reward-label">XP Gained</span>
            <span class="reward-value xp-value">+{{ xpReward }}</span>
          </div>
          <div class="reward-row">
            <span class="reward-label">Gold Gained</span>
            <span class="reward-value gold-value">
              <span class="gold-icon">&#x2742;</span> +{{ goldReward }}
            </span>
          </div>
          <div class="reward-row" v-if="itemDrops.length > 0">
            <span class="reward-label">Items Found</span>
            <div class="reward-items">
              <span class="drop-item" v-for="item in itemDrops" :key="item">{{ item }}</span>
            </div>
          </div>
        </div>
        <button class="continue-btn" @click="dismissVictory">
          Continue
        </button>
      </div>
    </div>

    <!-- ── Main Battle HUD (not shown during victory) ── -->
    <template v-if="phase !== 'victory'">
      <!-- Turn Order Bar (top) -->
      <div class="turn-order-bar">
        <span class="turn-label">Turn Order</span>
        <div class="turn-pips">
          <span
            class="turn-pip"
            v-for="(entry, idx) in turnOrder"
            :key="idx"
            :class="{
              'pip-player': entry.kind === 'player',
              'pip-enemy': entry.kind === 'enemy',
              'pip-active': idx === turnIndex,
              'pip-dead': entry.kind === 'enemy' && isEnemyDead(entry.enemyIndex),
            }"
          >
            {{ entry.kind === 'player' ? 'YOU' : enemyShortName(entry.enemyIndex) }}
          </span>
        </div>
      </div>

      <!-- Enemy Panel (top-right area) -->
      <div class="enemy-panel">
        <div
          class="enemy-row"
          v-for="(enemy, idx) in enemies"
          :key="enemy.id + '-' + idx"
          :class="{ 'enemy-dead': enemy.hp <= 0, 'enemy-targeted': selectedTarget === idx }"
          @click="selectTarget(idx)"
        >
          <span class="enemy-name">{{ enemy.name }}</span>
          <div class="enemy-hp-track">
            <div
              class="enemy-hp-fill"
              :style="{ width: enemyHpPercent(enemy) + '%', background: enemyHpGradient(enemy) }"
            ></div>
          </div>
          <span class="enemy-hp-text">{{ enemy.hp }}/{{ enemy.maxHp }}</span>
        </div>
      </div>

      <!-- Floating Damage Numbers -->
      <div class="damage-floats">
        <transition-group name="float-dmg">
          <div
            class="damage-number"
            v-for="dmg in floatingDamage"
            :key="dmg.id"
            :class="{ 'dmg-player': dmg.targetIsPlayer, 'dmg-enemy': !dmg.targetIsPlayer }"
            :style="dmg.style"
          >
            {{ dmg.value }}
          </div>
        </transition-group>
      </div>

      <!-- Action Panel (bottom) — only during player turn -->
      <div class="action-panel" v-if="phase === 'player_turn'">
        <!-- Main menu -->
        <div class="action-menu" v-if="submenu === 'none'">
          <button class="action-btn" @click="doAttack">
            <span class="action-icon">&#x2694;</span>
            <span class="action-label">Attack</span>
          </button>
          <button class="action-btn" @click="openSkills">
            <span class="action-icon">&#x2728;</span>
            <span class="action-label">Skills</span>
          </button>
          <button class="action-btn" @click="openItems">
            <span class="action-icon">&#x2697;</span>
            <span class="action-label">Items</span>
          </button>
          <button class="action-btn" @click="doDefend">
            <span class="action-icon">&#x26E8;</span>
            <span class="action-label">Defend</span>
          </button>
          <button class="action-btn" @click="doFlee">
            <span class="action-icon">&#x21B6;</span>
            <span class="action-label">Flee</span>
          </button>
        </div>

        <!-- Skills submenu -->
        <div class="submenu-panel" v-if="submenu === 'skills'">
          <div class="submenu-header">
            <button class="back-btn" @click="submenu = 'none'">&#x25C0; Back</button>
            <span class="submenu-title">Skills</span>
          </div>
          <div class="submenu-list">
            <button
              class="submenu-item"
              v-for="skill in playerSkills"
              :key="skill.id"
              :disabled="skill.spCost > currentSp"
              @click="doSkill(skill.id)"
            >
              <span class="item-name">{{ skill.name }}</span>
              <span class="item-cost">{{ skill.spCost }} SP</span>
            </button>
            <p class="submenu-empty" v-if="playerSkills.length === 0">No skills learned</p>
          </div>
        </div>

        <!-- Items submenu -->
        <div class="submenu-panel" v-if="submenu === 'items'">
          <div class="submenu-header">
            <button class="back-btn" @click="submenu = 'none'">&#x25C0; Back</button>
            <span class="submenu-title">Items</span>
          </div>
          <div class="submenu-list">
            <button
              class="submenu-item"
              v-for="item in usableItems"
              :key="item.id"
              @click="doItem(item.id)"
            >
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">x{{ item.qty }}</span>
            </button>
            <p class="submenu-empty" v-if="usableItems.length === 0">No usable items</p>
          </div>
        </div>
      </div>

      <!-- Message bar (bottom, shows last action result) -->
      <div class="message-bar" v-if="lastMessage">
        <p class="message-text">{{ lastMessage }}</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed, onMounted, onUnmounted } from 'vue';
import { audioManager } from '../client/audio';
import type { SfxId } from '../client/audio';

// ── Combat SFX mapping ──────────────────────────────
const COMBAT_SFX: Record<string, SfxId> = {
  'player-attack': 'SFX-CBT-01',
  'enemy-attack': 'SFX-CBT-02',
  'skill-cast': 'SFX-CBT-03',
  defend: 'SFX-CBT-06',
  'item-use': 'SFX-UI-03',
  victory: 'SFX-MEM-05',
  flee: 'SFX-ENV-01',
};

// Import DDL data for skill names and SP costs
import clericBase from '../../gen/ddl/skills/cleric-base.json';
import clericSubclass from '../../gen/ddl/skills/cleric-subclass.json';
import knightBase from '../../gen/ddl/skills/knight-base.json';
import knightSubclass from '../../gen/ddl/skills/knight-subclass.json';
import mageBase from '../../gen/ddl/skills/mage-base.json';
import mageSubclass from '../../gen/ddl/skills/mage-subclass.json';
import rogueBase from '../../gen/ddl/skills/rogue-base.json';
import rogueSubclass from '../../gen/ddl/skills/rogue-subclass.json';

// Import consumable DDL for item names
import recoveryItems from '../../gen/ddl/consumables/recovery.json';
import specialItems from '../../gen/ddl/consumables/specials.json';
import buffItems from '../../gen/ddl/consumables/buffs.json';
import statusCureItems from '../../gen/ddl/consumables/status-cure.json';

// ── Client-side lookup maps ─────────────────────────

interface SkillInfo {
  id: string;
  name: string;
  spCost: number;
}

interface ConsumableInfo {
  id: string;
  name: string;
}

const allSkillDefs: SkillInfo[] = [
  ...(knightBase as SkillInfo[]),
  ...(knightSubclass as SkillInfo[]),
  ...(mageBase as SkillInfo[]),
  ...(mageSubclass as SkillInfo[]),
  ...(clericBase as SkillInfo[]),
  ...(clericSubclass as SkillInfo[]),
  ...(rogueBase as SkillInfo[]),
  ...(rogueSubclass as SkillInfo[]),
];
const skillMap = new Map<string, SkillInfo>(allSkillDefs.map((s) => [s.id, s]));

const allConsumables: ConsumableInfo[] = [
  ...(recoveryItems as ConsumableInfo[]),
  ...(specialItems as ConsumableInfo[]),
  ...(buffItems as ConsumableInfo[]),
  ...(statusCureItems as ConsumableInfo[]),
];
const consumableMap = new Map<string, string>(allConsumables.map((c) => [c.id, c.name]));

// ── readVar helper (same pattern as hud.vue) ────────

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

// ── Floating damage ID counter ──────────────────────

let dmgIdCounter = 0;

interface FloatingDmg {
  id: number;
  value: string;
  targetIsPlayer: boolean;
  style: Record<string, string>;
}

export default defineComponent({
  name: 'battle-ui',
  setup() {
    const rpgGuiInteraction = inject<(gui: string, event: string, data: any) => void>(
      'rpgGuiInteraction',
    );
    const rpgCurrentPlayer = inject<any>('rpgCurrentPlayer');

    const visible = ref(false);
    const combatActive = ref(false);
    const phase = ref('');
    const enemies = ref<any[]>([]);
    const turnOrder = ref<any[]>([]);
    const turnIndex = ref(0);
    const lastMessage = ref('');
    const xpReward = ref(0);
    const goldReward = ref(0);
    const itemDrops = ref<string[]>([]);
    const currentSp = ref(0);
    const submenu = ref<'none' | 'skills' | 'items'>('none');
    const selectedTarget = ref(0);
    const playerSkillIds = ref<string[]>([]);
    const inventory = ref<Record<string, number>>({});
    const floatingDamage = ref<FloatingDmg[]>([]);
    const prevLastResult = ref<any>(null);
    const prevCombatActive = ref(false);
    const prevPhase = ref('');
    let currentMapId = '';

    // Derived: player skills with names + SP costs
    const playerSkills = computed(() => {
      return playerSkillIds.value
        .map((id) => skillMap.get(id))
        .filter((s): s is SkillInfo => s !== undefined && !(s as any).isPassive);
    });

    // Derived: usable items (consumables in inventory)
    const usableItems = computed(() => {
      const items: { id: string; name: string; qty: number }[] = [];
      for (const [id, qty] of Object.entries(inventory.value)) {
        if (qty > 0 && consumableMap.has(id)) {
          items.push({ id, name: consumableMap.get(id)!, qty });
        }
      }
      return items;
    });

    function enemyHpPercent(enemy: any): number {
      return enemy.maxHp > 0 ? (enemy.hp / enemy.maxHp) * 100 : 0;
    }

    function enemyHpGradient(enemy: any): string {
      const pct = enemyHpPercent(enemy);
      if (pct > 50) return 'linear-gradient(180deg, #c54040 0%, #8b1f1f 100%)';
      if (pct > 25) return 'linear-gradient(180deg, #c57040 0%, #8b4f1f 100%)';
      return 'linear-gradient(180deg, #c54070 0%, #8b1f3f 100%)';
    }

    function enemyShortName(enemyIndex: number | undefined): string {
      if (enemyIndex === undefined) return '?';
      const e = enemies.value[enemyIndex];
      if (!e) return '?';
      // First 3 characters of name
      return e.name.slice(0, 3).toUpperCase();
    }

    function isEnemyDead(enemyIndex: number | undefined): boolean {
      if (enemyIndex === undefined) return false;
      const e = enemies.value[enemyIndex];
      return e ? e.hp <= 0 : false;
    }

    function selectTarget(idx: number) {
      if (enemies.value[idx] && enemies.value[idx].hp > 0) {
        selectedTarget.value = idx;
      }
    }

    function findFirstAliveEnemy(): number {
      return enemies.value.findIndex((e: any) => e.hp > 0);
    }

    // ── Actions ──────────────────────────────────

    function doAttack() {
      const target = selectedTarget.value >= 0 && enemies.value[selectedTarget.value]?.hp > 0
        ? selectedTarget.value
        : findFirstAliveEnemy();
      rpgGuiInteraction?.('battle-ui', 'combat-action', {
        type: 'attack',
        targetIndex: target,
      });
      submenu.value = 'none';
    }

    function doSkill(skillId: string) {
      rpgGuiInteraction?.('battle-ui', 'combat-action', {
        type: 'skill',
        skillId,
        targetIndex: selectedTarget.value,
      });
      submenu.value = 'none';
    }

    function doItem(itemId: string) {
      rpgGuiInteraction?.('battle-ui', 'combat-action', {
        type: 'item',
        itemId,
      });
      submenu.value = 'none';
    }

    function doDefend() {
      rpgGuiInteraction?.('battle-ui', 'combat-action', {
        type: 'defend',
      });
      submenu.value = 'none';
    }

    function doFlee() {
      rpgGuiInteraction?.('battle-ui', 'combat-action', {
        type: 'flee',
      });
      submenu.value = 'none';
    }

    function openSkills() {
      submenu.value = 'skills';
    }

    function openItems() {
      submenu.value = 'items';
    }

    function dismissVictory() {
      rpgGuiInteraction?.('battle-ui', 'combat-end', {
        phase: 'victory',
        xp: xpReward.value,
        gold: goldReward.value,
      });
    }

    // ── Floating damage spawner ──────────────────

    function spawnFloatingDamage(value: number, targetIsPlayer: boolean) {
      const id = dmgIdCounter++;
      const x = targetIsPlayer ? 20 + Math.random() * 20 : 55 + Math.random() * 30;
      const y = 30 + Math.random() * 20;
      const dmg: FloatingDmg = {
        id,
        value: String(value),
        targetIsPlayer,
        style: {
          left: `${x}%`,
          top: `${y}%`,
        },
      };
      floatingDamage.value.push(dmg);
      setTimeout(() => {
        floatingDamage.value = floatingDamage.value.filter((d) => d.id !== id);
      }, 1200);
    }

    // ── Subscription ─────────────────────────────

    let subscription: { unsubscribe(): void } | null = null;

    onMounted(() => {
      visible.value = true;

      if (!rpgCurrentPlayer) return;

      subscription = rpgCurrentPlayer.subscribe(({ object }: { object: any }) => {
        if (!object) return;

        // Track current map for restoring zone BGM after combat
        currentMapId = object.map ?? (readVar(object, 'CURRENT_MAP') as string) ?? '';

        const state = readVar(object, 'COMBAT_STATE') as any;
        if (!state) {
          // Combat just ended — restore zone BGM
          if (prevCombatActive.value) {
            const vibrancy = (readVar(object, 'ZONE_VIBRANCY') as number) ?? 50;
            audioManager.endCombat(currentMapId, vibrancy);
          }
          combatActive.value = false;
          prevCombatActive.value = false;
          prevPhase.value = '';
          return;
        }

        combatActive.value = true;
        phase.value = state.phase ?? '';
        enemies.value = state.enemies ?? [];
        turnOrder.value = state.turnOrder ?? [];
        turnIndex.value = state.turnIndex ?? 0;

        // ── Audio: start battle BGM on combat entry ──
        if (!prevCombatActive.value) {
          audioManager.startCombat().catch(() => {});
        }

        // ── Audio: victory/flee SFX on phase transition ──
        const currentPhase = state.phase ?? '';
        if (currentPhase !== prevPhase.value) {
          if (currentPhase === 'victory') {
            audioManager.playSfx(COMBAT_SFX.victory);
          } else if (currentPhase === 'fled') {
            audioManager.playSfx(COMBAT_SFX.flee);
          }
        }
        prevCombatActive.value = true;
        prevPhase.value = currentPhase;

        // Read player SP
        currentSp.value = object.sp ?? 0;

        // Read skills and inventory
        playerSkillIds.value = (readVar(object, 'PLAYER_SKILLS') as string[]) ?? [];
        inventory.value = (readVar(object, 'INVENTORY') as Record<string, number>) ?? {};

        // Handle last result — spawn floating damage + combat SFX
        const lastResult = state.lastResult;
        if (lastResult && lastResult !== prevLastResult.value) {
          lastMessage.value = lastResult.message ?? '';
          if (lastResult.damage && lastResult.damage > 0) {
            const targetIsPlayer = lastResult.targetName === 'Player';
            spawnFloatingDamage(lastResult.damage, targetIsPlayer);
          }

          // ── Audio: action SFX ──
          const action = lastResult.action as string;
          const actor = lastResult.actor as string;
          if (action === 'attack') {
            audioManager.playSfx(
              actor === 'Player' ? COMBAT_SFX['player-attack'] : COMBAT_SFX['enemy-attack'],
            );
          } else if (action === 'skill') {
            audioManager.playSfx(COMBAT_SFX['skill-cast']);
          } else if (action === 'item') {
            audioManager.playSfx(COMBAT_SFX['item-use']);
          } else if (action === 'defend') {
            audioManager.playSfx(COMBAT_SFX.defend);
          }

          prevLastResult.value = lastResult;
        }

        // Victory rewards
        if (state.phase === 'victory') {
          xpReward.value = state.enemies
            ?.filter((e: any) => e.hp <= 0)
            .reduce((sum: number, e: any) => sum + (e.xp ?? 0), 0) ?? 0;
          goldReward.value = state.enemies
            ?.filter((e: any) => e.hp <= 0)
            .reduce((sum: number, e: any) => sum + (e.gold ?? 0), 0) ?? 0;

          // Read rolled item drops from combat state
          const drops = (state.itemDrops as { itemId: string; quantity: number }[]) ?? [];
          itemDrops.value = drops.map((d: { itemId: string; quantity: number }) => {
            const name = consumableMap.get(d.itemId) ?? d.itemId;
            return d.quantity > 1 ? `${name} x${d.quantity}` : name;
          });
        }

        // Reset submenu when it's not player turn
        if (state.phase !== 'player_turn') {
          submenu.value = 'none';
        }

        // Auto-select first alive enemy if current target is dead
        if (selectedTarget.value >= 0 && enemies.value[selectedTarget.value]?.hp <= 0) {
          const alive = findFirstAliveEnemy();
          if (alive >= 0) selectedTarget.value = alive;
        }
      });
    });

    onUnmounted(() => {
      subscription?.unsubscribe();
    });

    return {
      visible,
      combatActive,
      phase,
      enemies,
      turnOrder,
      turnIndex,
      lastMessage,
      xpReward,
      goldReward,
      itemDrops,
      currentSp,
      submenu,
      selectedTarget,
      playerSkills,
      usableItems,
      floatingDamage,
      enemyHpPercent,
      enemyHpGradient,
      enemyShortName,
      isEnemyDead,
      selectTarget,
      doAttack,
      doSkill,
      doItem,
      doDefend,
      doFlee,
      openSkills,
      openItems,
      dismissVictory,
    };
  },
});
</script>

<style scoped>
/* ── Base ─────────────────────────────────────── */
.battle-ui {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 200;
  font-family: var(--font-body, 'Merriweather', serif);
}

.battle-ui > * {
  pointer-events: auto;
}

/* ── Turn Order Bar ──────────────────────────── */
.turn-order-bar {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(139, 31, 31, 0.4);
  border-top: none;
  border-radius: 0 0 6px 6px;
  padding: 6px 14px;
}

.turn-label {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 9px;
  color: var(--text-secondary, #8a7a60);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.turn-pips {
  display: flex;
  gap: 4px;
}

.turn-pip {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 2px;
  border: 1px solid rgba(90, 42, 42, 0.5);
  background: rgba(0, 0, 0, 0.4);
  color: var(--text-secondary, #8a7a60);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.turn-pip.pip-player {
  color: #88ccff;
  border-color: rgba(100, 160, 220, 0.4);
}

.turn-pip.pip-enemy {
  color: #cc8888;
  border-color: rgba(139, 31, 31, 0.4);
}

.turn-pip.pip-active {
  background: rgba(184, 134, 11, 0.25);
  border-color: var(--text-accent, #b8860b);
  color: var(--text-accent, #b8860b);
  box-shadow: 0 0 8px rgba(184, 134, 11, 0.3);
}

.turn-pip.pip-dead {
  opacity: 0.3;
  text-decoration: line-through;
}

/* ── Enemy Panel ─────────────────────────────── */
.enemy-panel {
  position: absolute;
  top: 48px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
}

.enemy-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(139, 31, 31, 0.3);
  border-radius: 3px;
  padding: 4px 10px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.enemy-row:hover:not(.enemy-dead) {
  border-color: rgba(184, 134, 11, 0.5);
}

.enemy-row.enemy-targeted {
  border-color: var(--text-accent, #b8860b);
  box-shadow: 0 0 8px rgba(184, 134, 11, 0.2);
}

.enemy-row.enemy-dead {
  opacity: 0.35;
  pointer-events: none;
}

.enemy-name {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 11px;
  color: var(--text-primary, #d4c4a0);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  min-width: 60px;
}

.enemy-hp-track {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(90, 42, 42, 0.5);
  border-radius: 2px;
  overflow: hidden;
  min-width: 50px;
}

.enemy-hp-fill {
  height: 100%;
  transition: width 0.3s ease, background 0.5s ease;
  border-radius: 1px;
}

.enemy-hp-text {
  font-size: 9px;
  color: var(--text-secondary, #8a7a60);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  min-width: 42px;
  text-align: right;
}

/* ── Action Panel ────────────────────────────── */
.action-panel {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  max-width: 500px;
}

.action-menu {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(135deg, rgba(26, 10, 10, 0.9) 0%, rgba(40, 18, 18, 0.85) 100%);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  color: var(--text-primary, #d4c4a0);
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 40px;
  -webkit-tap-highlight-color: transparent;
}

.action-btn:hover {
  background: linear-gradient(135deg, rgba(139, 31, 31, 0.3) 0%, rgba(60, 20, 20, 0.9) 100%);
  border-color: var(--border-primary, #8b1f1f);
  box-shadow: 0 0 12px rgba(139, 31, 31, 0.3);
  transform: translateY(-1px);
}

.action-btn:active {
  transform: scale(0.97);
}

.action-icon {
  font-size: 14px;
}

.action-label {
  font-size: 12px;
}

/* ── Submenu ─────────────────────────────────── */
.submenu-panel {
  background: linear-gradient(180deg, rgba(13, 5, 5, 0.95) 0%, rgba(26, 10, 10, 0.95) 100%);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  padding: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.submenu-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(90, 42, 42, 0.4);
}

.back-btn {
  background: none;
  border: 1px solid #5a2a2a;
  color: var(--text-secondary, #8a7a60);
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: var(--text-accent, #b8860b);
  color: var(--text-accent, #b8860b);
}

.submenu-title {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 12px;
  color: var(--text-accent, #b8860b);
  text-shadow: 0 0 6px rgba(184, 134, 11, 0.3);
}

.submenu-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.submenu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(90, 42, 42, 0.3);
  border-radius: 3px;
  color: var(--text-primary, #d4c4a0);
  font-family: var(--font-body, 'Merriweather', serif);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.submenu-item:hover:not(:disabled) {
  border-color: var(--text-accent, #b8860b);
  background: rgba(184, 134, 11, 0.1);
}

.submenu-item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.item-name {
  flex: 1;
}

.item-cost {
  font-size: 10px;
  color: #6688cc;
  margin-left: 8px;
}

.item-qty {
  font-size: 10px;
  color: var(--text-secondary, #8a7a60);
  margin-left: 8px;
}

.submenu-empty {
  font-size: 11px;
  color: var(--text-secondary, #8a7a60);
  font-style: italic;
  text-align: center;
  padding: 8px;
  margin: 0;
}

/* ── Message Bar ─────────────────────────────── */
.message-bar {
  position: absolute;
  bottom: 70px;
  left: 16px;
  right: 16px;
  max-width: 500px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(90, 42, 42, 0.4);
  border-radius: 3px;
  padding: 6px 12px;
}

.message-text {
  font-size: 11px;
  color: var(--text-primary, #d4c4a0);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  margin: 0;
  line-height: 1.4;
}

/* ── Floating Damage Numbers ─────────────────── */
.damage-floats {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.damage-number {
  position: absolute;
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 22px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.5);
  animation: float-up-dmg 1.2s ease-out forwards;
  pointer-events: none;
}

.damage-number.dmg-enemy {
  color: #ff4444;
}

.damage-number.dmg-player {
  color: #ffaa44;
}

@keyframes float-up-dmg {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  15% {
    transform: translateY(-10px) scale(1.2);
    opacity: 1;
  }
  50% {
    transform: translateY(-30px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-60px) scale(0.8);
    opacity: 0;
  }
}

/* ── Victory Overlay ─────────────────────────── */
.victory-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.75);
  pointer-events: auto;
  animation: fade-in 0.5s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.victory-panel {
  background: linear-gradient(180deg, #1a0a0a 0%, #0d0505 100%);
  border: 2px solid var(--text-accent, #b8860b);
  border-radius: 6px;
  padding: 2rem;
  text-align: center;
  max-width: 360px;
  width: 90%;
  box-shadow: 0 0 40px rgba(184, 134, 11, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5);
}

.victory-ornament {
  font-size: 1.5rem;
  color: var(--text-accent, #b8860b);
  margin-bottom: 0.5rem;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 8px rgba(184, 134, 11, 0.4); }
  50% { text-shadow: 0 0 20px rgba(184, 134, 11, 0.8); }
}

.victory-title {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 1.8rem;
  color: var(--text-accent, #b8860b);
  text-shadow: 0 0 20px rgba(184, 134, 11, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8);
  margin: 0;
  letter-spacing: 0.1em;
}

.victory-divider {
  margin: 0.8rem 0 1.2rem;
}

.victory-divider .divider-wing {
  color: #5a3a3a;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
}

.victory-rewards {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.reward-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(90, 42, 42, 0.3);
  border-radius: 3px;
}

.reward-label {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 11px;
  color: var(--text-secondary, #8a7a60);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.reward-value {
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 14px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.xp-value {
  color: #88cc88;
}

.gold-value {
  color: #daa520;
  display: flex;
  align-items: center;
  gap: 4px;
}

.gold-value .gold-icon {
  font-size: 14px;
  text-shadow: 0 0 6px rgba(218, 165, 32, 0.5);
}

.reward-items {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.drop-item {
  font-size: 10px;
  padding: 2px 6px;
  background: rgba(139, 31, 31, 0.2);
  border: 1px solid #5a2a2a;
  border-radius: 2px;
  color: #cc8888;
  font-family: var(--font-body, 'Merriweather', serif);
}

.continue-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, var(--btn-primary, #8b1f1f) 0%, #6b1515 100%);
  border: 1px solid #a33;
  border-radius: 4px;
  color: var(--text-primary, #d4c4a0);
  font-family: var(--font-heading, 'Cinzel', serif);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.continue-btn:hover {
  background: linear-gradient(135deg, #a33 0%, var(--btn-primary, #8b1f1f) 100%);
  box-shadow: 0 0 20px rgba(139, 31, 31, 0.4);
  transform: translateY(-1px);
}

.continue-btn:active {
  transform: scale(0.98);
}

/* ── Desktop ─────────────────────────────────── */
@media (min-width: 600px) {
  .action-panel {
    left: 50%;
    transform: translateX(-50%);
  }

  .message-bar {
    left: 50%;
    transform: translateX(-50%);
  }

  .enemy-panel {
    min-width: 220px;
  }

  .victory-title {
    font-size: 2.2rem;
  }
}

/* ── Reduced Motion ──────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .damage-number { animation: none; opacity: 1; }
  .victory-ornament { animation: none; }
  .victory-overlay { animation: none; }
  .enemy-hp-fill { transition: none; }
}
</style>
