<template>
  <div class="combat-screen" v-if="visible">
    <div class="combat-container">
      <!-- Enemy Info -->
      <div class="enemy-panel">
        <h2 class="enemy-name">{{ enemyName }}</h2>
        <div class="bar-row">
          <span class="bar-label">HP</span>
          <div class="bar-container">
            <div class="bar-fill enemy-hp" :style="{ width: enemyHpPercent + '%' }"></div>
          </div>
          <span class="bar-value">{{ enemyHp }}/{{ enemyMaxHp }}</span>
        </div>
      </div>

      <!-- Combat Log -->
      <div class="combat-log" ref="combatLog">
        <p v-for="(msg, i) in combatMessages" :key="i" class="log-msg">{{ msg }}</p>
      </div>

      <!-- Player Info -->
      <div class="player-panel">
        <div class="bar-row">
          <span class="bar-label">HP</span>
          <div class="bar-container">
            <div class="bar-fill player-hp" :style="{ width: playerHpPercent + '%' }"></div>
          </div>
          <span class="bar-value">{{ playerHp }}/{{ playerMaxHp }}</span>
        </div>
        <div class="bar-row">
          <span class="bar-label">SP</span>
          <div class="bar-container">
            <div class="bar-fill player-sp" :style="{ width: playerSpPercent + '%' }"></div>
          </div>
          <span class="bar-value">{{ playerSp }}/{{ playerMaxSp }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-panel" v-if="isPlayerTurn && !combatOver">
        <button class="btn btn-attack" @click="doAttack">Attack</button>
        <button class="btn btn-skill" @click="showSkills = !showSkills">Skill</button>
        <button class="btn btn-item" @click="showItems = !showItems">Item</button>
        <button class="btn btn-flee" @click="doFlee" :disabled="isBoss">Flee</button>
      </div>

      <!-- Skills Sub-menu -->
      <div class="sub-menu" v-if="showSkills && isPlayerTurn">
        <button
          v-for="skill in playerSkills"
          :key="skill.name"
          class="btn btn-sub"
          :disabled="playerSp < skill.spCost"
          @click="doSkill(skill)"
        >
          {{ skill.name }} ({{ skill.spCost }} SP)
        </button>
        <button class="btn btn-sub btn-back" @click="showSkills = false">Back</button>
      </div>

      <!-- Items Sub-menu -->
      <div class="sub-menu" v-if="showItems && isPlayerTurn">
        <button
          v-for="item in playerItems"
          :key="item.name"
          class="btn btn-sub"
          @click="doItem(item)"
        >
          {{ item.name }} x{{ item.qty }}
        </button>
        <button class="btn btn-sub btn-back" @click="showItems = false">Back</button>
      </div>

      <!-- Combat Over -->
      <div class="combat-result" v-if="combatOver">
        <p class="result-text">{{ resultText }}</p>
        <button class="btn btn-primary" @click="endCombat">Continue</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RpgGui } from '@rpgjs/client';

interface CombatData {
  enemyName: string;
  enemyMaxHp: number;
  enemyAtk: number;
  enemyDef: number;
  enemyAgi: number;
  isBoss: boolean;
  xpReward: number;
  goldReward: number;
  eventId: string;
}

export default {
  name: 'combat-gui',
  inject: ['rpgCurrentPlayer'],
  data() {
    return {
      visible: false,
      enemyName: '',
      enemyHp: 0,
      enemyMaxHp: 0,
      enemyAtk: 0,
      enemyDef: 0,
      enemyAgi: 0,
      isBoss: false,
      xpReward: 0,
      goldReward: 0,
      eventId: '',
      combatMessages: [] as string[],
      isPlayerTurn: true,
      combatOver: false,
      resultText: '',
      showSkills: false,
      showItems: false,
      turnCount: 0,
    };
  },
  computed: {
    player(): any {
      return (this as any).rpgCurrentPlayer?.object;
    },
    playerHp(): number {
      return this.player?.hp ?? 0;
    },
    playerMaxHp(): number {
      return this.player?.param?.maxHp ?? 100;
    },
    playerSp(): number {
      return this.player?.sp ?? 0;
    },
    playerMaxSp(): number {
      return this.player?.param?.maxSp ?? 50;
    },
    playerHpPercent(): number {
      return this.playerMaxHp ? (this.playerHp / this.playerMaxHp) * 100 : 0;
    },
    playerSpPercent(): number {
      return this.playerMaxSp ? (this.playerSp / this.playerMaxSp) * 100 : 0;
    },
    enemyHpPercent(): number {
      return this.enemyMaxHp ? (this.enemyHp / this.enemyMaxHp) * 100 : 0;
    },
    playerSkills(): any[] {
      // Return skills the player has learned
      return [
        { name: 'Power Strike', spCost: 10, power: 1.8 },
        { name: 'Fireball', spCost: 15, power: 2.0 },
        { name: 'Heal', spCost: 8, power: 0, isHeal: true, healAmount: 60 },
        { name: 'Backstab', spCost: 12, power: 2.2 },
        { name: 'Ice Bolt', spCost: 10, power: 1.5 },
        { name: 'Berserk', spCost: 14, power: 0, isBuff: true },
      ];
    },
    playerItems(): any[] {
      return [
        { name: 'Potion', qty: 3, hpRestore: 50 },
        { name: 'Hi-Potion', qty: 1, hpRestore: 200 },
        { name: 'Mana Potion', qty: 1, spRestore: 50 },
      ];
    },
  },
  methods: {
    initCombat(data: CombatData) {
      this.visible = true;
      this.enemyName = data.enemyName;
      this.enemyHp = data.enemyMaxHp;
      this.enemyMaxHp = data.enemyMaxHp;
      this.enemyAtk = data.enemyAtk;
      this.enemyDef = data.enemyDef;
      this.enemyAgi = data.enemyAgi || 5;
      this.isBoss = data.isBoss;
      this.xpReward = data.xpReward;
      this.goldReward = data.goldReward;
      this.eventId = data.eventId;
      this.combatMessages = [`A wild ${data.enemyName} appears!`];
      this.isPlayerTurn = true;
      this.combatOver = false;
      this.resultText = '';
      this.showSkills = false;
      this.showItems = false;
      this.turnCount = 0;
    },
    addMessage(msg: string) {
      this.combatMessages.push(msg);
      this.$nextTick(() => {
        const log = this.$refs.combatLog as HTMLElement;
        if (log) log.scrollTop = log.scrollHeight;
      });
    },
    doAttack() {
      const playerStr = this.player?.param?.str || 10;
      const damage = Math.max(1, playerStr - this.enemyDef + Math.floor(Math.random() * 5));
      this.enemyHp = Math.max(0, this.enemyHp - damage);
      this.addMessage(`You attack for ${damage} damage!`);
      this.showSkills = false;
      this.showItems = false;
      this.checkCombatEnd();
    },
    doSkill(skill: any) {
      if (skill.isHeal) {
        const heal = skill.healAmount;
        RpgGui.emit('combat-action', { type: 'heal', amount: heal });
        this.addMessage(`You cast ${skill.name} and restore ${heal} HP!`);
        RpgGui.emit('combat-sp-cost', { cost: skill.spCost });
      } else if (skill.isBuff) {
        this.addMessage(`You use ${skill.name}! ATK increased!`);
        RpgGui.emit('combat-sp-cost', { cost: skill.spCost });
      } else {
        const playerStr = this.player?.param?.str || 10;
        const damage = Math.max(1, Math.floor(playerStr * skill.power) - this.enemyDef);
        this.enemyHp = Math.max(0, this.enemyHp - damage);
        this.addMessage(`You cast ${skill.name} for ${damage} damage!`);
        RpgGui.emit('combat-sp-cost', { cost: skill.spCost });
      }
      this.showSkills = false;
      this.checkCombatEnd();
    },
    doItem(item: any) {
      if (item.hpRestore) {
        RpgGui.emit('combat-action', { type: 'heal', amount: item.hpRestore });
        this.addMessage(`You use ${item.name} and restore ${item.hpRestore} HP!`);
        item.qty--;
      } else if (item.spRestore) {
        RpgGui.emit('combat-action', { type: 'sp-restore', amount: item.spRestore });
        this.addMessage(`You use ${item.name} and restore ${item.spRestore} SP!`);
        item.qty--;
      }
      if (item.qty <= 0) {
        const idx = this.playerItems.indexOf(item);
        if (idx >= 0) this.playerItems.splice(idx, 1);
      }
      this.showItems = false;
      this.checkCombatEnd();
    },
    doFlee() {
      const playerAgi = this.player?.param?.agi || 10;
      const fleeChance = Math.min(0.9, 0.4 + (playerAgi - this.enemyAgi) * 0.05);
      if (Math.random() < fleeChance) {
        this.addMessage('You fled successfully!');
        this.combatOver = true;
        this.resultText = 'Escaped!';
      } else {
        this.addMessage('Failed to flee!');
        this.enemyTurn();
      }
    },
    enemyTurn() {
      this.isPlayerTurn = false;
      this.turnCount++;

      setTimeout(() => {
        let damage = Math.max(1, this.enemyAtk - (this.player?.param?.dex || 5));

        // Boss special attack every 3 turns
        if (this.isBoss && this.turnCount % 3 === 0) {
          damage = Math.floor(damage * 2);
          this.addMessage(`${this.enemyName} unleashes a devastating attack for ${damage} damage!`);
        } else {
          this.addMessage(`${this.enemyName} attacks for ${damage} damage!`);
        }

        RpgGui.emit('combat-action', { type: 'damage', amount: damage });
        this.isPlayerTurn = true;
        this.checkCombatEnd();
      }, 500);
    },
    checkCombatEnd() {
      if (this.enemyHp <= 0) {
        this.combatOver = true;
        this.resultText = `Victory! +${this.xpReward} XP, +${this.goldReward} Gold`;
        RpgGui.emit('combat-result', {
          victory: true,
          xp: this.xpReward,
          gold: this.goldReward,
          eventId: this.eventId,
          isBoss: this.isBoss,
        });
        return;
      }
      if (this.playerHp <= 0) {
        this.combatOver = true;
        this.resultText = 'Defeated...';
        RpgGui.emit('combat-result', { victory: false });
        return;
      }
      if (!this.combatOver && !this.isPlayerTurn) return;
      if (!this.combatOver) this.enemyTurn();
    },
    endCombat() {
      this.visible = false;
      RpgGui.emit('combat-end', {});
    },
  },
  mounted() {
    RpgGui.on('combat-start', (data: CombatData) => {
      this.initCombat(data);
    });
  },
};
</script>

<style scoped>
.combat-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  z-index: 900;
  font-family: 'Cinzel', 'Georgia', serif;
  color: #d4c4a0;
}

.combat-container {
  width: 90%;
  max-width: 600px;
  background: linear-gradient(180deg, #1a0a0a 0%, #2d1b1b 100%);
  border: 2px solid #8b1f1f;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 0 40px rgba(139, 31, 31, 0.4);
}

.enemy-panel, .player-panel {
  margin-bottom: 1rem;
}

.enemy-name {
  font-size: 1.3rem;
  color: #cc3333;
  margin: 0 0 0.5rem;
  text-shadow: 0 0 10px rgba(204, 51, 51, 0.5);
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.bar-label {
  color: #b8860b;
  font-size: 0.7rem;
  font-weight: bold;
  width: 24px;
  text-transform: uppercase;
}

.bar-container {
  flex: 1;
  height: 12px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid #555;
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.enemy-hp { background: linear-gradient(90deg, #cc3333, #ff4444); }
.player-hp { background: linear-gradient(90deg, #228b22, #33cc33); }
.player-sp { background: linear-gradient(90deg, #1a4d8b, #3388cc); }

.bar-value {
  font-size: 0.7rem;
  color: #999;
  width: 70px;
  text-align: right;
}

.combat-log {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #444;
  border-radius: 4px;
  padding: 0.5rem;
  height: 120px;
  overflow-y: auto;
  margin-bottom: 1rem;
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 0.75rem;
}

.log-msg {
  margin: 0.2rem 0;
  color: #aaa;
}

.action-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.sub-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.btn {
  padding: 0.6rem 1rem;
  font-family: 'Cinzel', 'Georgia', serif;
  font-size: 0.85rem;
  border: 1px solid;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-attack { background: #8b1f1f; border-color: #a33; color: #d4c4a0; }
.btn-skill { background: #1a4d8b; border-color: #2266aa; color: #d4c4a0; }
.btn-item { background: #228b22; border-color: #33aa33; color: #d4c4a0; }
.btn-flee { background: #555; border-color: #777; color: #d4c4a0; }
.btn-sub { background: rgba(0, 0, 0, 0.4); border-color: #666; color: #d4c4a0; font-size: 0.75rem; padding: 0.4rem 0.8rem; }
.btn-back { border-color: #b8860b; color: #b8860b; }
.btn-primary { background: #8b1f1f; border-color: #a33; color: #d4c4a0; width: 100%; margin-top: 0.5rem; }

.btn:hover:not(:disabled) { filter: brightness(1.2); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

.combat-result {
  text-align: center;
  padding: 1rem;
}

.result-text {
  font-size: 1.2rem;
  color: #b8860b;
  margin-bottom: 1rem;
}
</style>
