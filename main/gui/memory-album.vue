<template>
  <div class="memory-album" v-if="visible">
    <!-- Ornate frame corners -->
    <div class="frame-corner tl"></div>
    <div class="frame-corner tr"></div>
    <div class="frame-corner bl"></div>
    <div class="frame-corner br"></div>

    <div class="album-container">
      <!-- Header -->
      <div class="album-header">
        <div class="header-ornament">&#x2726;</div>
        <h1 class="album-title">Memory Album</h1>
        <div class="album-divider">
          <span class="divider-wing">&#x2500;&#x2500;&#x2500; &#x2666; &#x2500;&#x2500;&#x2500;</span>
        </div>
        <div class="progress-bar">
          <span class="progress-text">{{ collectedCount }} / {{ totalCount }} Fragments</span>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filter-bar">
        <button
          class="filter-btn"
          :class="{ active: activeFilter === 'all' }"
          @click="activeFilter = 'all'"
        >All</button>
        <button
          class="filter-btn emotion-joy"
          :class="{ active: activeFilter === 'joy' }"
          @click="activeFilter = 'joy'"
        >Joy</button>
        <button
          class="filter-btn emotion-fury"
          :class="{ active: activeFilter === 'fury' }"
          @click="activeFilter = 'fury'"
        >Fury</button>
        <button
          class="filter-btn emotion-sorrow"
          :class="{ active: activeFilter === 'sorrow' }"
          @click="activeFilter = 'sorrow'"
        >Sorrow</button>
        <button
          class="filter-btn emotion-awe"
          :class="{ active: activeFilter === 'awe' }"
          @click="activeFilter = 'awe'"
        >Awe</button>
        <button
          class="filter-btn emotion-calm"
          :class="{ active: activeFilter === 'calm' }"
          @click="activeFilter = 'calm'"
        >Calm</button>
      </div>

      <div class="filter-bar secondary-filters">
        <button
          class="filter-btn zone-filter"
          :class="{ active: zoneFilter === 'all' }"
          @click="zoneFilter = 'all'"
        >All Zones</button>
        <button
          class="filter-btn zone-filter"
          v-for="z in ZONE_LABELS"
          :key="z.id"
          :class="{ active: zoneFilter === z.id }"
          @click="zoneFilter = z.id"
        >{{ z.label }}</button>
      </div>

      <div class="filter-bar secondary-filters">
        <button
          class="filter-btn god-filter"
          :class="{ active: godFilter === 'all' }"
          @click="godFilter = 'all'"
        >All Gods</button>
        <button
          class="filter-btn god-filter"
          v-for="g in GOD_LABELS"
          :key="g.id"
          :class="{ active: godFilter === g.id }"
          @click="godFilter = g.id"
        >{{ g.label }}</button>
      </div>

      <!-- Album body: grid + detail -->
      <div class="album-body">
        <!-- Fragment grid -->
        <div class="fragment-grid">
          <div v-if="filteredFragments.length === 0" class="empty-state">
            <span class="empty-icon">&#x2726;</span>
            <p class="empty-text">No fragments match this filter</p>
          </div>
          <button
            class="fragment-cell"
            v-for="frag in filteredFragments"
            :key="frag.id"
            :class="{
              collected: frag.collected,
              undiscovered: !frag.collected,
              selected: selectedFragId === frag.id,
              ['emotion-' + frag.emotion]: frag.collected,
            }"
            @click="selectFragment(frag.id)"
          >
            <span class="frag-icon" v-if="frag.collected">&#x2726;</span>
            <span class="frag-icon undiscovered-icon" v-else>?</span>
            <span class="frag-potency" v-if="frag.collected">
              <span v-for="s in frag.potency" :key="s">&#x2605;</span>
            </span>
          </button>
        </div>

        <!-- Fragment detail pane -->
        <div class="fragment-detail" v-if="selectedFrag">
          <div class="detail-emotion-badge" :class="'badge-' + selectedFrag.emotion">
            {{ selectedFrag.emotion }}
          </div>
          <h2 class="detail-name">
            <span class="detail-icon">&#x2726;</span>
            {{ selectedFrag.name }}
          </h2>
          <div class="detail-fields">
            <div class="detail-row">
              <span class="detail-label">Emotional Resonance</span>
              <span class="detail-value" :class="'val-' + selectedFrag.emotion">
                {{ emotionLabel(selectedFrag.emotion) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Zone Found</span>
              <span class="detail-value">{{ zoneLabel(selectedFrag.zone) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Source</span>
              <span class="detail-value">{{ categoryLabel(selectedFrag.category) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Potency</span>
              <span class="detail-value potency-stars">
                <span class="star-filled" v-for="s in selectedFrag.potency" :key="'f' + s">&#x2605;</span>
                <span class="star-empty" v-for="s in (5 - selectedFrag.potency)" :key="'e' + s">&#x2606;</span>
              </span>
            </div>
          </div>
          <p class="detail-desc">{{ selectedFrag.description }}</p>
        </div>
        <div class="fragment-detail empty-detail" v-else-if="!selectedFrag">
          <span class="empty-icon">&#x2726;</span>
          <p class="empty-text">Select a fragment to view details</p>
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

// ── Types ─────────────────────────────────────────────────────────────────────

type Emotion = 'joy' | 'fury' | 'sorrow' | 'awe' | 'calm';

type Zone =
  | 'village-hub'
  | 'heartfield'
  | 'ambergrove'
  | 'millbrook'
  | 'sunridge'
  | 'shimmer-marsh'
  | 'flickerveil'
  | 'hollow-ridge'
  | 'resonance-fields'
  | 'luminous-wastes'
  | 'half-drawn-forest'
  | 'undrawn-peaks'
  | 'depths'
  | 'fortress';

type GodId = 'resonance' | 'verdance' | 'luminos' | 'kinesis';

interface FragmentDef {
  id: string;
  name: string;
  description: string;
  category: 'exploration' | 'npc' | 'combat' | 'quest' | 'dissolved';
  emotion: Emotion;
  zone: Zone;
  potency: number;
}

interface DisplayFragment extends FragmentDef {
  collected: boolean;
}

// ── Fragment Catalog (mirrors server memory.ts) ───────────────────────────────

const FRAGMENT_CATALOG: readonly FragmentDef[] = [
  // Village Hub (6)
  { id: 'frag-vh-01', name: 'Wildflower Offering', description: 'A warm memory of placing wildflowers at the village shrine, petals catching the morning light.', category: 'exploration', emotion: 'joy', zone: 'village-hub', potency: 1 },
  { id: 'frag-vh-02', name: 'Rainy Vigil', description: 'The quiet patience of watching rain fall over still rooftops, waiting for nothing in particular.', category: 'exploration', emotion: 'calm', zone: 'village-hub', potency: 1 },
  { id: 'frag-vh-03', name: 'Communal Song', description: 'Voices rising together in an old song whose words nobody quite remembers but everyone feels.', category: 'exploration', emotion: 'awe', zone: 'village-hub', potency: 2 },
  { id: 'frag-vh-04', name: "Artun's First Memory", description: "The architect's earliest recollection — a hand drawing shapes in soft earth, imagining worlds.", category: 'npc', emotion: 'joy', zone: 'village-hub', potency: 2 },
  { id: 'frag-vh-05', name: "Hana's Spark", description: 'The fierce determination that ignited when someone said the forge fires would never burn again.', category: 'npc', emotion: 'fury', zone: 'village-hub', potency: 2 },
  { id: 'frag-vh-06', name: "Elder Torin's Regret", description: 'A weight carried for years — the memory of a choice that silenced a friend forever.', category: 'npc', emotion: 'sorrow', zone: 'village-hub', potency: 2 },
  // Heartfield (5)
  { id: 'frag-hf-01', name: 'Meadow Lullaby', description: 'Tall grass swaying in rhythm with a half-remembered melody that soothes the restless mind.', category: 'exploration', emotion: 'calm', zone: 'heartfield', potency: 1 },
  { id: 'frag-hf-02', name: 'Harvest Dance', description: 'Bare feet on warm earth, spinning with strangers who feel like family under an amber sky.', category: 'exploration', emotion: 'joy', zone: 'heartfield', potency: 1 },
  { id: 'frag-hf-03', name: 'Meadow Sprite Echo', description: 'The lingering resonance of a sprite dissolving into golden motes, its last gift a flash of wonder.', category: 'combat', emotion: 'awe', zone: 'heartfield', potency: 2 },
  { id: 'frag-hf-04', name: "Farmer's Lost Hope", description: 'Cracked earth where crops once grew, and the heavy silence of someone who stopped believing in rain.', category: 'npc', emotion: 'sorrow', zone: 'heartfield', potency: 2 },
  { id: 'frag-hf-05', name: 'Serpent Fury', description: 'The white-hot clash of fangs and steel, adrenaline burning like venom through every vein.', category: 'combat', emotion: 'fury', zone: 'heartfield', potency: 2 },
  // Ambergrove (5)
  { id: 'frag-ag-01', name: 'Ancient Root Song', description: 'Deep vibrations rising through ancient roots — the forest remembering itself through sound.', category: 'exploration', emotion: 'awe', zone: 'ambergrove', potency: 2 },
  { id: 'frag-ag-02', name: 'Forest Wisp Glow', description: 'Soft luminescence drifting between trees, a calm presence watching without judgment.', category: 'combat', emotion: 'calm', zone: 'ambergrove', potency: 2 },
  { id: 'frag-ag-03', name: 'Burning Canopy', description: 'Red-orange flames licking at amber leaves — rage given form in a forest fire that was also a renewal.', category: 'exploration', emotion: 'fury', zone: 'ambergrove', potency: 2 },
  { id: 'frag-ag-04', name: 'Amber Tear', description: 'Tree sap hardened around an insect, preserving a tiny life in golden forever — beauty in loss.', category: 'npc', emotion: 'sorrow', zone: 'ambergrove', potency: 2 },
  { id: 'frag-ag-05', name: 'First Bloom', description: 'The impossible joy of the first flower breaking through winter soil, defying everything.', category: 'quest', emotion: 'joy', zone: 'ambergrove', potency: 3 },
  // Millbrook (4)
  { id: 'frag-mb-01', name: 'Mill Wheel Rhythm', description: 'The steady turning of the great wheel, water and wood in ancient partnership, grinding grain into sustenance.', category: 'exploration', emotion: 'calm', zone: 'millbrook', potency: 2 },
  { id: 'frag-mb-02', name: 'Bridge Laughter', description: 'Children racing across the old stone bridge, their laughter echoing off the water below like skipping stones.', category: 'exploration', emotion: 'joy', zone: 'millbrook', potency: 2 },
  { id: 'frag-mb-03', name: 'River Nymph Wrath', description: 'The river itself rising in fury, defending its depths against those who would dam its wild song.', category: 'combat', emotion: 'fury', zone: 'millbrook', potency: 2 },
  { id: 'frag-mb-04', name: 'Drowned Letter', description: 'Ink dissolving in current, words meant for someone who will never read them washing downstream.', category: 'npc', emotion: 'sorrow', zone: 'millbrook', potency: 2 },
  // Sunridge (4)
  { id: 'frag-sr-01', name: 'Sunrise Panorama', description: 'Standing at the ridge summit as dawn breaks, the entire world painted in gold and rose — infinite possibility.', category: 'exploration', emotion: 'awe', zone: 'sunridge', potency: 2 },
  { id: 'frag-sr-02', name: 'Highland Hawk Screech', description: 'A hawk diving with terrible purpose, talons outstretched — fury distilled into perfect predatory focus.', category: 'combat', emotion: 'fury', zone: 'sunridge', potency: 2 },
  { id: 'frag-sr-03', name: "Ridgewalker's Tale", description: "A weathered traveler sharing stories by firelight, joy found not in the destination but in the telling.", category: 'npc', emotion: 'joy', zone: 'sunridge', potency: 2 },
  { id: 'frag-sr-04', name: 'Lonely Summit', description: 'The peak reached, the view breathtaking, and no one there to share it with.', category: 'exploration', emotion: 'sorrow', zone: 'sunridge', potency: 2 },
  // Shimmer Marsh (3)
  { id: 'frag-sm-01', name: 'Marsh Lights', description: 'Ethereal lights drifting over dark water, each one a tiny miracle that vanishes when approached.', category: 'exploration', emotion: 'awe', zone: 'shimmer-marsh', potency: 2 },
  { id: 'frag-sm-02', name: 'Sunken Shrine', description: 'An altar half-swallowed by the marsh, offerings still placed by hands that remember what the mind forgot.', category: 'exploration', emotion: 'sorrow', zone: 'shimmer-marsh', potency: 3 },
  { id: 'frag-sm-03', name: "Hermit's Wisdom", description: 'Hard-won peace spoken in few words by someone who chose solitude and found it full of company.', category: 'npc', emotion: 'calm', zone: 'shimmer-marsh', potency: 3 },
  // Flickerveil (3)
  { id: 'frag-fv-01', name: 'Flickering Boundary', description: 'Reality itself trembling at the edge of something vast, the veil between worlds gossamer-thin.', category: 'exploration', emotion: 'awe', zone: 'flickerveil', potency: 3 },
  { id: 'frag-fv-02', name: 'Veil Warden Rage', description: 'A guardian entity striking with unstoppable force to seal a breach that should never have opened.', category: 'combat', emotion: 'fury', zone: 'flickerveil', potency: 3 },
  { id: 'frag-fv-03', name: "Scout's Sacrifice", description: 'The last message scratched into stone by someone who went ahead so others would not have to.', category: 'npc', emotion: 'sorrow', zone: 'flickerveil', potency: 3 },
  // Hollow Ridge (3)
  { id: 'frag-hr-01', name: 'Echo Chamber', description: 'A natural cave that holds every whisper ever spoken within it, playing them back in gentle overlapping waves.', category: 'exploration', emotion: 'calm', zone: 'hollow-ridge', potency: 3 },
  { id: 'frag-hr-02', name: 'Golem Triumph', description: 'The exhilaration of toppling a stone giant, its crystal heart shattering into a cascade of light.', category: 'combat', emotion: 'joy', zone: 'hollow-ridge', potency: 3 },
  { id: 'frag-hr-03', name: 'Collapsed Pass', description: 'The mountain itself striking in anger, sealing a path with tons of stone in a single devastating heartbeat.', category: 'exploration', emotion: 'fury', zone: 'hollow-ridge', potency: 3 },
  // Resonance Fields (3)
  { id: 'frag-rf-01', name: 'Resonance Harmonic', description: 'Standing stones humming in perfect harmony, the air thick with vibrations older than memory itself.', category: 'exploration', emotion: 'awe', zone: 'resonance-fields', potency: 3 },
  { id: 'frag-rf-02', name: 'God-Song Echo', description: 'A fragment of divine music caught in crystal — joy so pure it transcends mortal understanding.', category: 'quest', emotion: 'joy', zone: 'resonance-fields', potency: 4 },
  { id: 'frag-rf-03', name: 'Dissonant Cry', description: 'The anguished wail of a god-song broken, harmony shattered into discordant fragments of loss.', category: 'combat', emotion: 'sorrow', zone: 'resonance-fields', potency: 3 },
  // Luminous Wastes (2)
  { id: 'frag-lw-01', name: 'Blinding Revelation', description: 'Truth so bright it burns — the moment of understanding that changes everything and can never be unseen.', category: 'exploration', emotion: 'awe', zone: 'luminous-wastes', potency: 4 },
  { id: 'frag-lw-02', name: 'Scorched Joy', description: 'Happiness found in the aftermath of devastation — wildflowers growing in the cracks of scorched earth.', category: 'quest', emotion: 'joy', zone: 'luminous-wastes', potency: 4 },
  // Half-Drawn Forest (2)
  { id: 'frag-hd-01', name: 'Unfinished Melody', description: 'A song that trails off mid-phrase, beautiful precisely because it was never completed.', category: 'exploration', emotion: 'sorrow', zone: 'half-drawn-forest', potency: 3 },
  { id: 'frag-hd-02', name: 'Sketch-Born Wonder', description: 'The miraculous moment when a half-drawn tree suddenly remembers it is alive and begins to grow.', category: 'exploration', emotion: 'awe', zone: 'half-drawn-forest', potency: 4 },
  // Undrawn Peaks (2)
  { id: 'frag-up-01', name: 'Summit of Possibility', description: 'The peak above the clouds where nothing has been decided yet — pure potential waiting to become.', category: 'exploration', emotion: 'joy', zone: 'undrawn-peaks', potency: 4 },
  { id: 'frag-up-02', name: 'Void Gale', description: 'Wind with nothing to shape howling at the edge of existence, fury directed at the emptiness itself.', category: 'exploration', emotion: 'fury', zone: 'undrawn-peaks', potency: 4 },
  // The Depths (4)
  { id: 'frag-dp-01', name: 'Dissolved Civilization', description: 'Echoes of a city that existed before memory, its people and purpose faded to whispers in the dark.', category: 'dissolved', emotion: 'sorrow', zone: 'depths', potency: 3 },
  { id: 'frag-dp-02', name: 'Deepest Joy', description: 'Joy found at the bottom of everything — the stubborn ember that refused to go out even in total darkness.', category: 'dissolved', emotion: 'joy', zone: 'depths', potency: 4 },
  { id: 'frag-dp-03', name: 'Primordial Fury', description: 'The raw anger of creation itself, the explosive force that births stars and shatters worlds.', category: 'dissolved', emotion: 'fury', zone: 'depths', potency: 4 },
  { id: 'frag-dp-04', name: 'The Songline', description: 'The original melody from which all other songs descended — pure awe crystallized into amber light.', category: 'dissolved', emotion: 'awe', zone: 'depths', potency: 5 },
  // Fortress (2)
  { id: 'frag-ft-01', name: 'Frozen Moment', description: 'Time caught mid-breath in the heart of stagnation, perfectly preserved and perfectly still.', category: 'quest', emotion: 'calm', zone: 'fortress', potency: 4 },
  { id: 'frag-ft-02', name: 'The First Memory', description: 'The very first thing ever remembered — a light, a sound, the beginning of everything.', category: 'quest', emotion: 'awe', zone: 'fortress', potency: 5 },
];

const fragmentById = new Map(FRAGMENT_CATALOG.map((f) => [f.id, f]));

// ── Zone & God Labels ─────────────────────────────────────────────────────────

const ZONE_LABELS: readonly { id: Zone; label: string }[] = [
  { id: 'village-hub', label: 'Village Hub' },
  { id: 'heartfield', label: 'Heartfield' },
  { id: 'ambergrove', label: 'Ambergrove' },
  { id: 'millbrook', label: 'Millbrook' },
  { id: 'sunridge', label: 'Sunridge' },
  { id: 'shimmer-marsh', label: 'Shimmer Marsh' },
  { id: 'flickerveil', label: 'Flickerveil' },
  { id: 'hollow-ridge', label: 'Hollow Ridge' },
  { id: 'resonance-fields', label: 'Resonance Fields' },
  { id: 'luminous-wastes', label: 'Luminous Wastes' },
  { id: 'half-drawn-forest', label: 'Half-Drawn Forest' },
  { id: 'undrawn-peaks', label: 'Undrawn Peaks' },
  { id: 'depths', label: 'The Depths' },
  { id: 'fortress', label: 'Fortress' },
];

const GOD_LABELS: readonly { id: GodId; label: string }[] = [
  { id: 'resonance', label: 'Resonance' },
  { id: 'verdance', label: 'Verdance' },
  { id: 'luminos', label: 'Luminos' },
  { id: 'kinesis', label: 'Kinesis' },
];

const GOD_ZONES: Record<GodId, Zone> = {
  resonance: 'resonance-fields',
  verdance: 'shimmer-marsh',
  luminos: 'flickerveil',
  kinesis: 'hollow-ridge',
};

const ZONE_LABEL_MAP: Record<Zone, string> = Object.fromEntries(
  ZONE_LABELS.map((z) => [z.id, z.label]),
) as Record<Zone, string>;

// ── readVar helper ────────────────────────────────────────────────────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

export default defineComponent({
  name: 'memory-album',
  setup() {
    const rpgGuiClose = inject<(id: string, data?: any) => void>('rpgGuiClose');
    const rpgCurrentPlayer = inject<any>('rpgCurrentPlayer');

    const visible = ref(true);
    const activeFilter = ref<'all' | Emotion>('all');
    const zoneFilter = ref<'all' | Zone>('all');
    const godFilter = ref<'all' | GodId>('all');
    const selectedFragId = ref<string | null>(null);
    const collectedIds = ref<string[]>([]);

    let subscription: { unsubscribe(): void } | null = null;
    let keyHandler: ((e: KeyboardEvent) => void) | null = null;

    // ── Computed ──

    const totalCount = FRAGMENT_CATALOG.length;

    const collectedCount = computed(() => collectedIds.value.length);

    const progressPercent = computed(() =>
      totalCount > 0 ? Math.round((collectedCount.value / totalCount) * 100) : 0,
    );

    const allFragments = computed<DisplayFragment[]>(() => {
      const set = new Set(collectedIds.value);
      return FRAGMENT_CATALOG.map((f) => ({
        ...f,
        collected: set.has(f.id),
      }));
    });

    const filteredFragments = computed<DisplayFragment[]>(() => {
      let frags = allFragments.value;

      // Emotion filter
      if (activeFilter.value !== 'all') {
        frags = frags.filter((f) => f.emotion === activeFilter.value);
      }

      // Zone filter
      if (zoneFilter.value !== 'all') {
        frags = frags.filter((f) => f.zone === zoneFilter.value);
      }

      // God filter (maps god to zone)
      if (godFilter.value !== 'all') {
        const godZone = GOD_ZONES[godFilter.value];
        frags = frags.filter((f) => f.zone === godZone);
      }

      return frags;
    });

    const selectedFrag = computed<DisplayFragment | null>(() => {
      if (!selectedFragId.value) return null;
      const frag = allFragments.value.find((f) => f.id === selectedFragId.value);
      if (!frag || !frag.collected) return null;
      return frag;
    });

    // ── Methods ──

    function selectFragment(id: string) {
      const frag = allFragments.value.find((f) => f.id === id);
      if (frag?.collected) {
        selectedFragId.value = selectedFragId.value === id ? null : id;
      }
    }

    function emotionLabel(emotion: Emotion): string {
      return emotion.charAt(0).toUpperCase() + emotion.slice(1);
    }

    function zoneLabel(zone: Zone): string {
      return ZONE_LABEL_MAP[zone] ?? zone;
    }

    function categoryLabel(category: string): string {
      const labels: Record<string, string> = {
        exploration: 'Exploration',
        npc: 'NPC',
        combat: 'Combat',
        quest: 'Quest',
        dissolved: 'Dissolved',
      };
      return labels[category] ?? category;
    }

    function close() {
      visible.value = false;
      rpgGuiClose?.('memory-album');
    }

    // ── Lifecycle ──

    onMounted(() => {
      if (rpgCurrentPlayer) {
        subscription = rpgCurrentPlayer.subscribe(({ object }: { object: any }) => {
          if (!object) return;
          const frags = readVar(object, 'MEMORY_FRAGMENTS');
          collectedIds.value = Array.isArray(frags) ? frags : [];
        });
      }

      const onKey = (e: KeyboardEvent) => {
        if (!visible.value) return;
        if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
          e.preventDefault();
          close();
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
      activeFilter,
      zoneFilter,
      godFilter,
      selectedFragId,
      collectedCount,
      totalCount,
      progressPercent,
      filteredFragments,
      selectedFrag,
      selectFragment,
      emotionLabel,
      zoneLabel,
      categoryLabel,
      close,
      ZONE_LABELS,
      GOD_LABELS,
    };
  },
});
</script>

<style scoped>
/* ── Base ─────────────────────────────────────── */
.memory-album {
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
.album-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 720px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  box-sizing: border-box;
  overflow: hidden;
}

/* ── Header ───────────────────────────────────── */
.album-header {
  text-align: center;
  margin-bottom: 0.75rem;
  flex-shrink: 0;
}

.header-ornament {
  font-size: 1.2rem;
  color: var(--text-accent);
  margin-bottom: 0.3rem;
}

.album-title {
  font-size: 1.5rem;
  color: var(--border-primary);
  text-shadow: 0 0 30px rgba(139, 31, 31, 0.6), 0 0 60px rgba(139, 31, 31, 0.3), 0 2px 4px rgba(0, 0, 0, 0.8);
  margin: 0;
  letter-spacing: 0.12em;
}

.album-divider { margin-top: 0.3rem; }
.divider-wing {
  color: #5a3a3a;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
}

/* ── Progress Bar ─────────────────────────────── */
.progress-bar {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.progress-text {
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: var(--text-accent);
  text-shadow: 0 0 8px rgba(184, 134, 11, 0.3);
}

.progress-track {
  width: 200px;
  height: 6px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #5a2a2a;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--text-accent) 0%, #daa520 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* ── Filter Bars ─────────────────────────────── */
.filter-bar {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.4rem;
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: center;
}

.secondary-filters {
  margin-bottom: 0.3rem;
}

.filter-btn {
  padding: 0.3rem 0.6rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #3a1a1a;
  border-radius: 3px;
  color: var(--text-secondary);
  font-family: var(--font-heading);
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-btn:hover {
  color: var(--text-primary);
  border-color: #5a2a2a;
}

.filter-btn.active {
  color: var(--text-accent);
  border-color: var(--text-accent);
  background: rgba(184, 134, 11, 0.1);
  text-shadow: 0 0 8px rgba(184, 134, 11, 0.3);
}

/* Emotion-specific active colors */
.filter-btn.emotion-joy.active { color: #daa520; border-color: #daa520; background: rgba(218, 165, 32, 0.1); }
.filter-btn.emotion-fury.active { color: #cc3333; border-color: #cc3333; background: rgba(204, 51, 51, 0.1); }
.filter-btn.emotion-sorrow.active { color: #7b68ee; border-color: #7b68ee; background: rgba(123, 104, 238, 0.1); }
.filter-btn.emotion-awe.active { color: #3cb371; border-color: #3cb371; background: rgba(60, 179, 113, 0.1); }

/* ── Album Body: grid + detail ────────────────── */
.album-body {
  display: flex;
  gap: 0.75rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ── Fragment Grid ────────────────────────────── */
.fragment-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 0.4rem;
  overflow-y: auto;
  padding-right: 0.25rem;
  align-content: start;
  scrollbar-width: thin;
  scrollbar-color: #5a2a2a transparent;
}

.fragment-grid::-webkit-scrollbar { width: 4px; }
.fragment-grid::-webkit-scrollbar-track { background: transparent; }
.fragment-grid::-webkit-scrollbar-thumb { background: #5a2a2a; border-radius: 2px; }

.fragment-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #3a1a1a;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0.25rem;
}

.fragment-cell.collected:hover {
  border-color: #5a2a2a;
  background: rgba(139, 31, 31, 0.15);
}

.fragment-cell.selected {
  border-color: var(--text-accent);
  background: rgba(184, 134, 11, 0.15);
  box-shadow: 0 0 10px rgba(184, 134, 11, 0.2);
}

.fragment-cell.undiscovered {
  opacity: 0.35;
  cursor: default;
}

/* Emotion glow colors for collected fragments */
.fragment-cell.emotion-joy .frag-icon { color: #daa520; text-shadow: 0 0 8px rgba(218, 165, 32, 0.6); }
.fragment-cell.emotion-fury .frag-icon { color: #cc3333; text-shadow: 0 0 8px rgba(204, 51, 51, 0.6); }
.fragment-cell.emotion-sorrow .frag-icon { color: #7b68ee; text-shadow: 0 0 8px rgba(123, 104, 238, 0.6); }
.fragment-cell.emotion-awe .frag-icon { color: #3cb371; text-shadow: 0 0 8px rgba(60, 179, 113, 0.6); }
.fragment-cell.emotion-calm .frag-icon { color: #87ceeb; text-shadow: 0 0 8px rgba(135, 206, 235, 0.6); }

.frag-icon {
  font-size: 1.4rem;
}

.undiscovered-icon {
  color: #3a2222;
  font-size: 1.2rem;
  font-family: var(--font-heading);
}

.frag-potency {
  font-size: 0.45rem;
  color: var(--text-accent);
  letter-spacing: 1px;
}

/* ── Fragment Detail Pane ─────────────────────── */
.fragment-detail {
  width: 260px;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #5a2a2a;
  border-radius: 4px;
  padding: 1rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #5a2a2a transparent;
}

.fragment-detail::-webkit-scrollbar { width: 4px; }
.fragment-detail::-webkit-scrollbar-track { background: transparent; }
.fragment-detail::-webkit-scrollbar-thumb { background: #5a2a2a; border-radius: 2px; }

.empty-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.detail-emotion-badge {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: var(--font-body);
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
  display: inline-block;
  margin-bottom: 0.4rem;
}

.badge-joy { color: #daa520; background: rgba(218, 165, 32, 0.15); border: 1px solid rgba(218, 165, 32, 0.3); }
.badge-fury { color: #cc3333; background: rgba(204, 51, 51, 0.15); border: 1px solid rgba(204, 51, 51, 0.3); }
.badge-sorrow { color: #7b68ee; background: rgba(123, 104, 238, 0.15); border: 1px solid rgba(123, 104, 238, 0.3); }
.badge-awe { color: #3cb371; background: rgba(60, 179, 113, 0.15); border: 1px solid rgba(60, 179, 113, 0.3); }
.badge-calm { color: #87ceeb; background: rgba(135, 206, 235, 0.15); border: 1px solid rgba(135, 206, 235, 0.3); }

.detail-name {
  font-size: 1rem;
  color: var(--text-primary);
  margin: 0 0 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.detail-icon {
  color: var(--text-accent);
  text-shadow: 0 0 8px rgba(184, 134, 11, 0.5);
}

.detail-fields {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-body);
  font-size: 0.7rem;
}

.detail-label {
  color: var(--text-secondary);
}

.detail-value {
  color: var(--text-primary);
  font-weight: 600;
}

.val-joy { color: #daa520; }
.val-fury { color: #cc3333; }
.val-sorrow { color: #7b68ee; }
.val-awe { color: #3cb371; }
.val-calm { color: #87ceeb; }

.potency-stars {
  letter-spacing: 2px;
}

.star-filled {
  color: var(--text-accent);
  text-shadow: 0 0 4px rgba(184, 134, 11, 0.5);
}

.star-empty {
  color: #3a2222;
}

.detail-desc {
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  font-style: italic;
  border-top: 1px solid #3a1a1a;
  padding-top: 0.6rem;
}

/* ── Empty State ─────────────────────────────── */
.empty-state {
  grid-column: 1 / -1;
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

/* ── Close Button ────────────────────────────── */
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
  .album-title { font-size: 2rem; }
  .frame-corner { width: 80px; height: 80px; }
  .fragment-grid { grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); }
  .fragment-detail { width: 280px; }
}

/* ── Mobile: stack layout ────────────────────── */
@media (max-width: 599px) {
  .album-body {
    flex-direction: column;
  }
  .fragment-grid {
    max-height: 35vh;
    grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
  }
  .fragment-detail {
    width: 100%;
    flex: 1;
    min-height: 0;
  }
}

/* ── Reduced Motion ──────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .fragment-cell,
  .filter-btn,
  .close-btn,
  .progress-fill {
    transition: none;
  }
}
</style>
