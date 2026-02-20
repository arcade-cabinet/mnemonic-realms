<template>
  <div class="quest-log" v-if="visible">
    <!-- Ornate frame corners -->
    <div class="frame-corner tl"></div>
    <div class="frame-corner tr"></div>
    <div class="frame-corner bl"></div>
    <div class="frame-corner br"></div>

    <div class="log-container">
      <!-- Header -->
      <div class="log-header">
        <div class="header-ornament">&#x2726;</div>
        <h1 class="log-title">Quest Log</h1>
        <div class="log-divider">
          <span class="divider-wing">&#x2500;&#x2500;&#x2500; &#x2666; &#x2500;&#x2500;&#x2500;</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tab-bar">
        <button
          class="tab"
          :class="{ active: activeTab === 'active' }"
          @click="activeTab = 'active'"
        >
          Active
          <span class="tab-count" v-if="activeQuests.length">({{ activeQuests.length }})</span>
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'completed' }"
          @click="activeTab = 'completed'"
        >
          Completed
          <span class="tab-count" v-if="completedQuests.length">({{ completedQuests.length }})</span>
        </button>
      </div>

      <!-- Quest list + detail split -->
      <div class="log-body">
        <!-- Quest list (scrollable) -->
        <div class="quest-list" ref="questList">
          <div v-if="currentQuests.length === 0" class="empty-state">
            <span class="empty-icon">&#x2726;</span>
            <p class="empty-text" v-if="activeTab === 'active'">No active quests</p>
            <p class="empty-text" v-else>No completed quests</p>
          </div>
          <button
            class="quest-item"
            :class="{
              selected: selectedQuestId === quest.id,
              'category-main': quest.category === 'main',
              'category-god': quest.category === 'god-recall',
              'category-side': quest.category === 'side',
            }"
            v-for="quest in currentQuests"
            :key="quest.id"
            @click="selectQuest(quest.id)"
          >
            <span class="quest-category-pip" :class="'pip-' + quest.category"></span>
            <div class="quest-item-info">
              <span class="quest-item-name">{{ quest.name }}</span>
              <span class="quest-item-progress" v-if="activeTab === 'active'">
                {{ quest.objectiveProgress }}/{{ quest.objectiveCount }}
              </span>
              <span class="quest-item-check" v-else>&#x2714;</span>
            </div>
          </button>
        </div>

        <!-- Quest detail pane -->
        <div class="quest-detail" v-if="selectedQuest">
          <div class="detail-header">
            <span class="detail-category" :class="'cat-' + selectedQuest.category">
              {{ categoryLabel(selectedQuest.category) }}
            </span>
            <h2 class="detail-name">{{ selectedQuest.name }}</h2>
          </div>

          <div class="detail-section">
            <h3 class="detail-section-title">Objectives</h3>
            <div class="objectives-list">
              <div
                class="objective-item"
                v-for="idx in selectedQuest.objectiveCount"
                :key="idx"
                :class="{
                  'obj-complete': idx <= selectedQuest.objectiveProgress,
                  'obj-current': idx === selectedQuest.objectiveProgress + 1 && activeTab === 'active',
                }"
              >
                <span class="obj-check" v-if="idx <= selectedQuest.objectiveProgress">&#x2714;</span>
                <span class="obj-bullet" v-else-if="idx === selectedQuest.objectiveProgress + 1 && activeTab === 'active'">&#x25B8;</span>
                <span class="obj-bullet" v-else>&#x25CB;</span>
                <span class="obj-text">Objective {{ idx }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section" v-if="hasRewards(selectedQuest)">
            <h3 class="detail-section-title">Rewards</h3>
            <div class="rewards-list">
              <div class="reward-item" v-if="selectedQuest.rewards.gold">
                <span class="reward-icon">&#x2742;</span>
                <span class="reward-text">{{ selectedQuest.rewards.gold }} Gold</span>
              </div>
              <div class="reward-item" v-if="selectedQuest.rewards.xp">
                <span class="reward-icon">&#x2605;</span>
                <span class="reward-text">{{ selectedQuest.rewards.xp }} XP</span>
              </div>
              <div class="reward-item" v-for="item in (selectedQuest.rewards.items || [])" :key="item.id">
                <span class="reward-icon">&#x25C8;</span>
                <span class="reward-text">{{ item.id }} x{{ item.qty }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="quest-detail empty-detail" v-else>
          <span class="empty-icon">&#x2726;</span>
          <p class="empty-text">Select a quest to view details</p>
        </div>
      </div>
    </div>

    <button class="close-btn" @click="close">
      <span>&#x2715;</span> Close
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed, onMounted, onUnmounted } from 'vue';

// ---------------------------------------------------------------------------
// Client-side quest registry — mirrors server QUEST_DEFS for display purposes
// ---------------------------------------------------------------------------

type QuestCategory = 'main' | 'god-recall' | 'side';

interface QuestReward {
  xp?: number;
  gold?: number;
  items?: { id: string; qty: number }[];
}

interface QuestDef {
  id: string;
  name: string;
  category: QuestCategory;
  objectiveCount: number;
  rewards: QuestReward;
}

const QUEST_DEFS: readonly QuestDef[] = [
  { id: 'MQ-01', name: "The Architect's Awakening", category: 'main', objectiveCount: 4, rewards: { gold: 50 } },
  { id: 'MQ-02', name: 'First Broadcast', category: 'main', objectiveCount: 4, rewards: { gold: 80 } },
  { id: 'MQ-03', name: 'The Settled Lands', category: 'main', objectiveCount: 5, rewards: { gold: 200 } },
  { id: 'MQ-04', name: 'The Stagnation', category: 'main', objectiveCount: 7, rewards: { gold: 150 } },
  { id: 'MQ-05', name: 'Into the Frontier', category: 'main', objectiveCount: 5, rewards: { gold: 300, items: [{ id: 'C-SC-04', qty: 3 }] } },
  { id: 'MQ-06', name: 'Recall the First God', category: 'main', objectiveCount: 4, rewards: {} },
  { id: 'MQ-07', name: "The Curator's Endgame", category: 'main', objectiveCount: 5, rewards: { gold: 500, items: [{ id: 'C-HP-03', qty: 5 }, { id: 'C-SP-03', qty: 3 }] } },
  { id: 'MQ-08', name: 'Through the Sketch', category: 'main', objectiveCount: 6, rewards: { gold: 400, items: [{ id: 'A-13', qty: 1 }] } },
  { id: 'MQ-09', name: 'The Preserver Fortress', category: 'main', objectiveCount: 5, rewards: { gold: 800 } },
  { id: 'MQ-10', name: 'The First Memory Remix', category: 'main', objectiveCount: 5, rewards: {} },
  { id: 'GQ-01', name: 'Recall Resonance', category: 'god-recall', objectiveCount: 5, rewards: {} },
  { id: 'GQ-02', name: 'Recall Verdance', category: 'god-recall', objectiveCount: 5, rewards: {} },
  { id: 'GQ-03', name: 'Recall Luminos', category: 'god-recall', objectiveCount: 5, rewards: {} },
  { id: 'GQ-04', name: 'Recall Kinesis', category: 'god-recall', objectiveCount: 5, rewards: {} },
  { id: 'SQ-01', name: 'The Memorial Garden', category: 'side', objectiveCount: 3, rewards: { gold: 120, items: [{ id: 'C-HP-01', qty: 5 }, { id: 'C-SP-01', qty: 3 }] } },
  { id: 'SQ-02', name: 'The Windmill Mystery', category: 'side', objectiveCount: 5, rewards: { gold: 100, items: [{ id: 'W-DG-03', qty: 1 }] } },
  { id: 'SQ-03', name: "The Woodcutter's Dilemma", category: 'side', objectiveCount: 5, rewards: { gold: 150, items: [{ id: 'A-05', qty: 1 }] } },
  { id: 'SQ-04', name: 'Upstream Secrets', category: 'side', objectiveCount: 6, rewards: { gold: 180, items: [{ id: 'W-ST-03', qty: 1 }] } },
  { id: 'SQ-05', name: "Aric's Doubt", category: 'side', objectiveCount: 5, rewards: { gold: 250, items: [{ id: 'C-SC-04', qty: 5 }] } },
  { id: 'SQ-06', name: "The Marsh Hermit's Request", category: 'side', objectiveCount: 5, rewards: { gold: 300, items: [{ id: 'A-07', qty: 1 }, { id: 'W-ST-05', qty: 1 }] } },
  { id: 'SQ-07', name: "Nel's Ridgewalkers", category: 'side', objectiveCount: 4, rewards: { gold: 350, items: [{ id: 'A-08', qty: 1 }] } },
  { id: 'SQ-08', name: "Solen's Light Studies", category: 'side', objectiveCount: 5, rewards: { gold: 300 } },
  { id: 'SQ-09', name: 'Harmonize the Path', category: 'side', objectiveCount: 3, rewards: { gold: 200 } },
  { id: 'SQ-10', name: 'The Depths Expedition', category: 'side', objectiveCount: 6, rewards: { gold: 400, items: [{ id: 'A-09', qty: 1 }] } },
  { id: 'SQ-11', name: "Hark's Masterwork", category: 'side', objectiveCount: 7, rewards: {} },
  { id: 'SQ-12', name: "Nyro's Dream Visions", category: 'side', objectiveCount: 5, rewards: { gold: 250, items: [{ id: 'C-BF-05', qty: 3 }] } },
  { id: 'SQ-13', name: "The Dissolved Choir's Instruments", category: 'side', objectiveCount: 4, rewards: { gold: 500, items: [{ id: 'C-SP-08', qty: 3 }] } },
  { id: 'SQ-14', name: 'The Stagnation Breaker', category: 'side', objectiveCount: 6, rewards: { gold: 500, items: [{ id: 'C-HP-04', qty: 2 }] } },
];

/**
 * Read a custom variable from the client-side player object.
 * Server variables are synced as an array of [key, value] pairs.
 */
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

interface QuestDisplay extends QuestDef {
  objectiveProgress: number;
}

export default defineComponent({
  name: 'quest-log',
  setup() {
    const rpgGuiClose = inject<(id: string, data?: any) => void>('rpgGuiClose');

    const visible = ref(true);
    const activeTab = ref<'active' | 'completed'>('active');
    const selectedQuestId = ref<string | null>(null);

    const activeQuests = ref<QuestDisplay[]>([]);
    const completedQuests = ref<QuestDisplay[]>([]);

    const rpgCurrentPlayer = inject<any>('rpgCurrentPlayer');
    let subscription: { unsubscribe(): void } | null = null;
    let keyHandler: ((e: KeyboardEvent) => void) | null = null;

    function refreshQuests(player: any) {
      const active: QuestDisplay[] = [];
      const completed: QuestDisplay[] = [];

      for (const def of QUEST_DEFS) {
        const status = readVar(player, `QUEST_${def.id}_STATUS`) as string | undefined;
        const objProgress = (readVar(player, `QUEST_${def.id}_OBJ`) as number) ?? 0;

        if (status === 'active') {
          active.push({ ...def, objectiveProgress: objProgress });
        } else if (status === 'completed') {
          completed.push({ ...def, objectiveProgress: def.objectiveCount });
        }
      }

      activeQuests.value = active;
      completedQuests.value = completed;

      // Auto-select first quest if current selection is no longer valid
      const current = currentQuests.value;
      if (selectedQuestId.value && !current.find((q) => q.id === selectedQuestId.value)) {
        selectedQuestId.value = current.length > 0 ? current[0].id : null;
      }
    }

    const currentQuests = computed(() =>
      activeTab.value === 'active' ? activeQuests.value : completedQuests.value,
    );

    const selectedQuest = computed(() =>
      currentQuests.value.find((q) => q.id === selectedQuestId.value) ?? null,
    );

    function selectQuest(id: string) {
      selectedQuestId.value = id;
    }

    function categoryLabel(cat: QuestCategory): string {
      switch (cat) {
        case 'main':
          return 'Main Quest';
        case 'god-recall':
          return 'God Recall';
        case 'side':
          return 'Side Quest';
      }
    }

    function hasRewards(quest: QuestDisplay): boolean {
      const r = quest.rewards;
      return !!(r.gold || r.xp || (r.items && r.items.length > 0));
    }

    function close() {
      visible.value = false;
      rpgGuiClose?.('quest-log');
    }

    onMounted(() => {
      if (rpgCurrentPlayer) {
        subscription = rpgCurrentPlayer.subscribe(({ object }: { object: any }) => {
          if (!object) return;
          refreshQuests(object);
        });
      }

      // Auto-select first quest on open
      const current = currentQuests.value;
      if (current.length > 0 && !selectedQuestId.value) {
        selectedQuestId.value = current[0].id;
      }

      const onKey = (e: KeyboardEvent) => {
        if (!visible.value) return;

        if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q' || e.key === 'j' || e.key === 'J') {
          e.preventDefault();
          close();
          return;
        }

        // Tab switching
        if (e.key === 'Tab') {
          e.preventDefault();
          activeTab.value = activeTab.value === 'active' ? 'completed' : 'active';
          const quests = currentQuests.value;
          selectedQuestId.value = quests.length > 0 ? quests[0].id : null;
          return;
        }

        // Navigate quest list
        const quests = currentQuests.value;
        if (quests.length === 0) return;
        const currentIdx = quests.findIndex((q) => q.id === selectedQuestId.value);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = (currentIdx + 1) % quests.length;
          selectedQuestId.value = quests[next].id;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = (currentIdx - 1 + quests.length) % quests.length;
          selectedQuestId.value = quests[prev].id;
        }
      };

      window.addEventListener('keydown', onKey);
      keyHandler = onKey;
    });

    onUnmounted(() => {
      subscription?.unsubscribe();
      if (keyHandler) {
        window.removeEventListener('keydown', keyHandler);
      }
    });

    return {
      visible,
      activeTab,
      selectedQuestId,
      activeQuests,
      completedQuests,
      currentQuests,
      selectedQuest,
      selectQuest,
      categoryLabel,
      hasRewards,
      close,
    };
  },
});
</script>

<style scoped>
/* ── Base ─────────────────────────────────────── */
.quest-log {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at 50% 30%, var(--bg-primary) 0%, var(--bg-secondary) 50%, #050202 100%);
  font-family: var(--font-heading);
  color: var(--text-primary);
  z-index: 500;
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

/* ── Container ────────────────────────────────── */
.log-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 680px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  box-sizing: border-box;
}

/* ── Header ───────────────────────────────────── */
.log-header {
  text-align: center;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.header-ornament {
  font-size: 1.2rem;
  color: var(--text-accent);
  margin-bottom: 0.3rem;
}

.log-title {
  font-size: 1.5rem;
  color: var(--border-primary);
  text-shadow: 0 0 30px rgba(139, 31, 31, 0.6), 0 0 60px rgba(139, 31, 31, 0.3), 0 2px 4px rgba(0, 0, 0, 0.8);
  margin: 0;
  letter-spacing: 0.12em;
}

.log-divider { margin-top: 0.5rem; }
.divider-wing {
  color: #5a3a3a;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
}

/* ── Tabs ─────────────────────────────────────── */
.tab-bar {
  display: flex;
  gap: 0;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #5a2a2a;
  flex-shrink: 0;
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

.tab-count {
  font-size: 0.65rem;
  opacity: 0.7;
}

/* ── Body: list + detail ─────────────────────── */
.log-body {
  display: flex;
  gap: 0.75rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ── Quest list ──────────────────────────────── */
.quest-list {
  width: 240px;
  flex-shrink: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-right: 0.25rem;
  scrollbar-width: thin;
  scrollbar-color: #5a2a2a transparent;
}

.quest-list::-webkit-scrollbar { width: 4px; }
.quest-list::-webkit-scrollbar-track { background: transparent; }
.quest-list::-webkit-scrollbar-thumb { background: #5a2a2a; border-radius: 2px; }

.quest-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.6rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #3a1a1a;
  border-radius: 3px;
  color: var(--text-primary);
  font-family: var(--font-heading);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.quest-item:hover {
  background: rgba(139, 31, 31, 0.15);
  border-color: #5a2a2a;
}

.quest-item.selected {
  background: rgba(139, 31, 31, 0.25);
  border-color: var(--border-primary);
  box-shadow: 0 0 10px rgba(139, 31, 31, 0.2);
}

/* Category pips */
.quest-category-pip {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.pip-main { background: #cc3333; box-shadow: 0 0 4px rgba(204, 51, 51, 0.5); }
.pip-god-recall { background: #daa520; box-shadow: 0 0 4px rgba(218, 165, 32, 0.5); }
.pip-side { background: #4488cc; box-shadow: 0 0 4px rgba(68, 136, 204, 0.5); }

.quest-item-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  min-width: 0;
}

.quest-item-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quest-item-progress {
  font-size: 0.6rem;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.quest-item-check {
  color: #40c540;
  font-size: 0.7rem;
  flex-shrink: 0;
}

/* ── Quest detail pane ───────────────────────── */
.quest-detail {
  flex: 1;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  padding: 1rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #5a2a2a transparent;
}

.quest-detail::-webkit-scrollbar { width: 4px; }
.quest-detail::-webkit-scrollbar-track { background: transparent; }
.quest-detail::-webkit-scrollbar-thumb { background: #5a2a2a; border-radius: 2px; }

.empty-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.detail-header {
  margin-bottom: 1rem;
}

.detail-category {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: var(--font-body);
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
  display: inline-block;
  margin-bottom: 0.4rem;
}

.cat-main { color: #cc3333; background: rgba(204, 51, 51, 0.15); border: 1px solid rgba(204, 51, 51, 0.3); }
.cat-god-recall { color: #daa520; background: rgba(218, 165, 32, 0.15); border: 1px solid rgba(218, 165, 32, 0.3); }
.cat-side { color: #4488cc; background: rgba(68, 136, 204, 0.15); border: 1px solid rgba(68, 136, 204, 0.3); }

.detail-name {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

/* ── Sections ────────────────────────────────── */
.detail-section {
  margin-bottom: 1rem;
}

.detail-section-title {
  font-size: 0.7rem;
  color: var(--text-accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 0.5rem;
  text-shadow: 0 0 8px rgba(184, 134, 11, 0.2);
}

/* ── Objectives ──────────────────────────────── */
.objectives-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.objective-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-secondary);
  padding: 0.25rem 0;
}

.objective-item.obj-complete {
  color: #6a8a6a;
}

.objective-item.obj-current {
  color: var(--text-primary);
}

.obj-check {
  color: #40c540;
  font-size: 0.7rem;
  width: 14px;
  text-align: center;
  flex-shrink: 0;
}

.obj-bullet {
  font-size: 0.6rem;
  width: 14px;
  text-align: center;
  flex-shrink: 0;
}

.obj-current .obj-bullet {
  color: var(--text-accent);
}

/* ── Rewards ─────────────────────────────────── */
.rewards-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.6rem;
  border-radius: 3px;
  border: 1px solid #3a1a1a;
}

.reward-icon {
  color: var(--text-accent);
  font-size: 0.8rem;
}

/* ── Empty state ─────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.empty-icon {
  font-size: 1.5rem;
  color: #3a2222;
  margin-bottom: 0.5rem;
}

.empty-text {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-style: italic;
  margin: 0;
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

/* ── Desktop ─────────────────────────────────── */
@media (min-width: 600px) {
  .log-title { font-size: 2rem; }
  .frame-corner { width: 80px; height: 80px; }
  .quest-list { width: 260px; }
}

/* ── Mobile: stack layout ────────────────────── */
@media (max-width: 599px) {
  .log-body {
    flex-direction: column;
  }
  .quest-list {
    width: 100%;
    max-height: 30vh;
  }
  .quest-detail {
    flex: 1;
    min-height: 0;
  }
}

/* ── Reduced Motion ──────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .quest-item,
  .tab,
  .close-btn {
    transition: none;
  }
}
</style>
