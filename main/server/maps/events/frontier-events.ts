import { EventData, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';
import { showDialogue } from '../../systems/npc-interaction';

function makeNpc(id: string, graphic: string, action: (player: RpgPlayer) => void | Promise<void>) {
  @EventData({ name: id, hitbox: { width: 16, height: 16 } })
  class Npc extends RpgEvent {
    onInit() {
      this.setGraphic(graphic);
    }
    async onAction(player: RpgPlayer) {
      await action(player);
    }
  }
  return Npc;
}

function makeEvent(id: string, action: (player: RpgPlayer) => void | Promise<void>) {
  @EventData({ name: id, hitbox: { width: 16, height: 16 } })
  class Evt extends RpgEvent {
    onInit() {}
    async onAction(player: RpgPlayer) {
      await action(player);
    }
  }
  return Evt;
}

export function spawnMapEvents(_player: RpgPlayer, map: RpgMap) {
  // --- NPCs ---
  map.createDynamicEvent([
    {
      x: 1088,
      y: 784,
      event: makeNpc('vash-assistant', 'npc_vash-assistant', (p) => showDialogue(p, 'vash-assistant')),
    },
    {
      x: 672,
      y: 1008,
      event: makeNpc('marsh-keeper', 'npc_marsh-keeper', (p) => showDialogue(p, 'marsh-keeper')),
    },
    {
      x: 848,
      y: 736,
      event: makeNpc('vash-marsh-hermit', 'npc_vash-marsh-hermit', (p) => showDialogue(p, 'vash-marsh-hermit')),
    },
    {
      x: 800,
      y: 720,
      event: makeNpc('marsh-researcher', 'npc_marsh-researcher', (p) => showDialogue(p, 'marsh-researcher')),
    },
    {
      x: 848,
      y: 720,
      event: makeNpc('preserver-scout-a', 'npc_preserver-scout-a', (p) => showDialogue(p, 'preserver-scout-a')),
    },
    {
      x: 752,
      y: 656,
      event: makeNpc('preserver-scout-b', 'npc_preserver-scout-b', (p) => showDialogue(p, 'preserver-scout-b')),
    },
    {
      x: 2368,
      y: 800,
      event: makeNpc('nel', 'npc_nel', (p) => showDialogue(p, 'nel')),
    },
    {
      x: 2320,
      y: 720,
      event: makeNpc('ridgewalker-scout', 'npc_ridgewalker-scout', (p) => showDialogue(p, 'ridgewalker-scout')),
    },
    {
      x: 2320,
      y: 720,
      event: makeNpc('ridgewalker-merchant', 'npc_ridgewalker-merchant', (p) => showDialogue(p, 'ridgewalker-merchant')),
    },
    {
      x: 2368,
      y: 784,
      event: makeNpc('ridgewalker-elder', 'npc_ridgewalker-elder', (p) => showDialogue(p, 'ridgewalker-elder')),
    },
    {
      x: 2288,
      y: 784,
      event: makeNpc('ridgewalker-guard-a', 'npc_ridgewalker-guard-a', (p) => showDialogue(p, 'ridgewalker-guard-a')),
    },
    {
      x: 2320,
      y: 704,
      event: makeNpc('ridgewalker-guard-b', 'npc_ridgewalker-guard-b', (p) => showDialogue(p, 'ridgewalker-guard-b')),
    },
    {
      x: 1216,
      y: 2256,
      event: makeNpc('village-shopkeeper-fv', 'npc_village-shopkeeper-fv', (p) => showDialogue(p, 'village-shopkeeper-fv')),
    },
    {
      x: 752,
      y: 2608,
      event: makeNpc('village-innkeeper-fv', 'npc_village-innkeeper-fv', (p) => showDialogue(p, 'village-innkeeper-fv')),
    },
    {
      x: 496,
      y: 2192,
      event: makeNpc('archive-keeper', 'npc_archive-keeper', (p) => showDialogue(p, 'archive-keeper')),
    },
    {
      x: 816,
      y: 2192,
      event: makeNpc('reza-village-elder', 'npc_reza-village-elder', (p) => showDialogue(p, 'reza-village-elder')),
    },
    {
      x: 848,
      y: 2176,
      event: makeNpc('village-shopkeeper', 'npc_village-shopkeeper', (p) => showDialogue(p, 'village-shopkeeper')),
    },
    {
      x: 800,
      y: 2176,
      event: makeNpc('village-innkeeper', 'npc_village-innkeeper', (p) => showDialogue(p, 'village-innkeeper')),
    },
    {
      x: 832,
      y: 2176,
      event: makeNpc('flickering-guard-a', 'npc_flickering-guard-a', (p) => showDialogue(p, 'flickering-guard-a')),
    },
    {
      x: 848,
      y: 2208,
      event: makeNpc('preserver-agent-archive', 'npc_preserver-agent-archive', (p) => showDialogue(p, 'preserver-agent-archive')),
    },
    {
      x: 816,
      y: 2112,
      event: makeNpc('preserver-agent-b', 'npc_preserver-agent-b', (p) => showDialogue(p, 'preserver-agent-b')),
    },
    {
      x: 784,
      y: 2160,
      event: makeNpc('preserver-agent-c', 'npc_preserver-agent-c', (p) => showDialogue(p, 'preserver-agent-c')),
    },
    {
      x: 768,
      y: 2192,
      event: makeNpc('julz-preserver-defector', 'npc_julz-preserver-defector', (p) => showDialogue(p, 'julz-preserver-defector')),
    },
    {
      x: 2336,
      y: 2176,
      event: makeNpc('lead-audiomancer', 'npc_lead-audiomancer', (p) => showDialogue(p, 'lead-audiomancer')),
    },
    {
      x: 2272,
      y: 2160,
      event: makeNpc('audiomancer-b', 'npc_audiomancer-b', (p) => showDialogue(p, 'audiomancer-b')),
    },
    {
      x: 2256,
      y: 2160,
      event: makeNpc('audiomancer-c', 'npc_audiomancer-c', (p) => showDialogue(p, 'audiomancer-c')),
    },
    {
      x: 2288,
      y: 2240,
      event: makeNpc('audiomancer-d', 'npc_audiomancer-d', (p) => showDialogue(p, 'audiomancer-d')),
    },
    {
      x: 2352,
      y: 2160,
      event: makeNpc('preserver-captain', 'npc_preserver-captain', (p) => showDialogue(p, 'preserver-captain')),
    },
    {
      x: 2352,
      y: 2208,
      event: makeNpc('preserver-agent-a', 'npc_preserver-agent-a', (p) => showDialogue(p, 'preserver-agent-a')),
    },
  ]);

  // --- Events ---
  map.createDynamicEvent([
    {
      x: 1072,
      y: 768,
      event: makeEvent('door-shimmer-marsh-store', (p) => {
        p.changeMap('shimmer-marsh-store', { x: 0, y: 0 });
      }),
    },
    {
      x: 656,
      y: 992,
      event: makeEvent('door-shimmer-marsh-inn', (p) => {
        p.changeMap('shimmer-marsh-inn', { x: 0, y: 0 });
      }),
    },
    {
      x: 1200,
      y: 2240,
      event: makeEvent('door-flickerveil-store', (p) => {
        p.changeMap('flickerveil-store', { x: 0, y: 0 });
      }),
    },
    {
      x: 736,
      y: 2592,
      event: makeEvent('door-flickerveil-inn', (p) => {
        p.changeMap('flickerveil-inn', { x: 0, y: 0 });
      }),
    },
    {
      x: 480,
      y: 2176,
      event: makeEvent('door-flickerveil-library', (p) => {
        p.changeMap('flickerveil-library', { x: 0, y: 0 });
      }),
    },
  ]);
}
