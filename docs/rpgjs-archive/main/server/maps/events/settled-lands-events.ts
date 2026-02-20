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
      x: 800,
      y: 624,
      event: makeNpc('khali', 'npc_khali', (p) => showDialogue(p, 'khali')),
    },
    {
      x: 528,
      y: 928,
      event: makeNpc('hark', 'npc_hark', (p) => showDialogue(p, 'hark')),
    },
    {
      x: 272,
      y: 592,
      event: makeNpc('nyro', 'npc_nyro', (p) => showDialogue(p, 'nyro')),
    },
    {
      x: 528,
      y: 544,
      event: makeNpc('artun', 'npc_artun', (p) => showDialogue(p, 'artun')),
    },
    {
      x: 576,
      y: 544,
      event: makeNpc('hana', 'npc_hana', (p) => showDialogue(p, 'hana')),
    },
    {
      x: 480,
      y: 480,
      event: makeNpc('khali-shopkeeper', 'npc_khali-shopkeeper', (p) => showDialogue(p, 'khali-shopkeeper')),
    },
    {
      x: 576,
      y: 576,
      event: makeNpc('hark-blacksmith', 'npc_hark-blacksmith', (p) => showDialogue(p, 'hark-blacksmith')),
    },
    {
      x: 576,
      y: 528,
      event: makeNpc('nyro-innkeeper', 'npc_nyro-innkeeper', (p) => showDialogue(p, 'nyro-innkeeper')),
    },
    {
      x: 496,
      y: 528,
      event: makeNpc('villager-a', 'npc_villager-a', (p) => showDialogue(p, 'villager-a')),
    },
    {
      x: 496,
      y: 576,
      event: makeNpc('villager-b', 'npc_villager-b', (p) => showDialogue(p, 'villager-b')),
    },
    {
      x: 560,
      y: 496,
      event: makeNpc('villager-c', 'npc_villager-c', (p) => showDialogue(p, 'villager-c')),
    },
    {
      x: 1552,
      y: 624,
      event: makeNpc('farmer-gale', 'npc_farmer-gale', (p) => showDialogue(p, 'farmer-gale')),
    },
    {
      x: 1504,
      y: 672,
      event: makeNpc('farmer-suri', 'npc_farmer-suri', (p) => showDialogue(p, 'farmer-suri')),
    },
    {
      x: 1584,
      y: 704,
      event: makeNpc('farmer-edric', 'npc_farmer-edric', (p) => showDialogue(p, 'farmer-edric')),
    },
    {
      x: 1568,
      y: 656,
      event: makeNpc('hamlet-elder', 'npc_hamlet-elder', (p) => showDialogue(p, 'hamlet-elder')),
    },
    {
      x: 1568,
      y: 688,
      event: makeNpc('child-npc', 'npc_child-npc', (p) => showDialogue(p, 'child-npc')),
    },
    {
      x: 2560,
      y: 608,
      event: makeNpc('waystation-keeper', 'npc_waystation-keeper', (p) => showDialogue(p, 'waystation-keeper')),
    },
    {
      x: 2528,
      y: 512,
      event: makeNpc('traveling-merchant', 'npc_traveling-merchant', (p) => showDialogue(p, 'traveling-merchant')),
    },
    {
      x: 2496,
      y: 560,
      event: makeNpc('waystation-guard', 'npc_waystation-guard', (p) => showDialogue(p, 'waystation-guard')),
    },
    {
      x: 2480,
      y: 592,
      event: makeNpc('janik', 'npc_janik', (p) => showDialogue(p, 'janik')),
    },
    {
      x: 608,
      y: 2080,
      event: makeNpc('lead-woodcutter', 'npc_lead-woodcutter', (p) => showDialogue(p, 'lead-woodcutter')),
    },
    {
      x: 544,
      y: 2064,
      event: makeNpc('woodcutter-b', 'npc_woodcutter-b', (p) => showDialogue(p, 'woodcutter-b')),
    },
    {
      x: 528,
      y: 2064,
      event: makeNpc('woodcutter-c', 'npc_woodcutter-c', (p) => showDialogue(p, 'woodcutter-c')),
    },
    {
      x: 1936,
      y: 2656,
      event: makeNpc('theron', 'npc_theron', (p) => showDialogue(p, 'theron')),
    },
    {
      x: 1856,
      y: 2912,
      event: makeNpc('dalla', 'npc_dalla', (p) => showDialogue(p, 'dalla')),
    },
    {
      x: 1584,
      y: 2976,
      event: makeNpc('oram', 'npc_oram', (p) => showDialogue(p, 'oram')),
    },
    {
      x: 1360,
      y: 2944,
      event: makeNpc('lissa', 'npc_lissa', (p) => showDialogue(p, 'lissa')),
    },
    {
      x: 1600,
      y: 2608,
      event: makeNpc('fisher-tam', 'npc_fisher-tam', (p) => showDialogue(p, 'fisher-tam')),
    },
    {
      x: 1520,
      y: 2608,
      event: makeNpc('specialty-shopkeeper', 'npc_specialty-shopkeeper', (p) => showDialogue(p, 'specialty-shopkeeper')),
    },
    {
      x: 1568,
      y: 2544,
      event: makeNpc('millbrook-elder', 'npc_millbrook-elder', (p) => showDialogue(p, 'millbrook-elder')),
    },
    {
      x: 1536,
      y: 2512,
      event: makeNpc('bridge-guard', 'npc_bridge-guard', (p) => showDialogue(p, 'bridge-guard')),
    },
    {
      x: 1600,
      y: 2512,
      event: makeNpc('townsfolk-a', 'npc_townsfolk-a', (p) => showDialogue(p, 'townsfolk-a')),
    },
    {
      x: 1600,
      y: 2592,
      event: makeNpc('townsfolk-b', 'npc_townsfolk-b', (p) => showDialogue(p, 'townsfolk-b')),
    },
  ]);

  // --- Events ---
  map.createDynamicEvent([
    {
      x: 784,
      y: 608,
      event: makeEvent('door-everwick-khali', (p) => {
        p.changeMap('everwick-khali', { x: 0, y: 0 });
      }),
    },
    {
      x: 512,
      y: 912,
      event: makeEvent('door-everwick-hark', (p) => {
        p.changeMap('everwick-hark', { x: 0, y: 0 });
      }),
    },
    {
      x: 256,
      y: 576,
      event: makeEvent('door-everwick-inn', (p) => {
        p.changeMap('everwick-inn', { x: 0, y: 0 });
      }),
    },
    {
      x: 1920,
      y: 2640,
      event: makeEvent('door-millbrook-provisions', (p) => {
        p.changeMap('millbrook-provisions', { x: 0, y: 0 });
      }),
    },
    {
      x: 1840,
      y: 2896,
      event: makeEvent('door-millbrook-forge', (p) => {
        p.changeMap('millbrook-forge', { x: 0, y: 0 });
      }),
    },
    {
      x: 1568,
      y: 2960,
      event: makeEvent('door-millbrook-inn', (p) => {
        p.changeMap('millbrook-inn', { x: 0, y: 0 });
      }),
    },
    {
      x: 1344,
      y: 2928,
      event: makeEvent('door-millbrook-fish', (p) => {
        p.changeMap('millbrook-fish', { x: 0, y: 0 });
      }),
    },
  ]);
}
