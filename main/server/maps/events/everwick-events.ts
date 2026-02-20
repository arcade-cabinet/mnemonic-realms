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
      x: 672,
      y: 352,
      event: makeNpc('elders-house_artun', 'npc_callum', (p) => showDialogue(p, 'artun-intro')),
    },
    {
      x: 800,
      y: 512,
      event: makeNpc('inn-bright-hearth_nyro', 'npc_ren', (p) => showDialogue(p, 'nyro-inn')),
    },
    {
      x: 624,
      y: 656,
      event: makeNpc('general-shop_khali', 'npc_maren', (p) => showDialogue(p, 'khali-shop')),
    },
    {
      x: 816,
      y: 688,
      event: makeNpc('blacksmith_hark', 'npc_torvan', (p) => showDialogue(p, 'hark-forge')),
    },
    {
      x: 304,
      y: 720,
      event: makeNpc('workshop_hana', 'npc_lira', (p) => showDialogue(p, 'hana-workshop')),
    },
    {
      x: 448,
      y: 480,
      event: makeNpc('villager-a', 'npc_villager_m1', (p) => showDialogue(p, 'villager-gossip-1')),
    },
    {
      x: 512,
      y: 512,
      event: makeNpc('villager-b', 'npc_villager_f1', (p) => showDialogue(p, 'villager-gossip-2')),
    },
    {
      x: 320,
      y: 704,
      event: makeNpc('villager-c', 'npc_villager_m2', (p) => showDialogue(p, 'villager-gossip-3')),
    },
  ]);

  // --- Events ---
  map.createDynamicEvent([
    {
      x: 448,
      y: 896,
      event: makeEvent('south-gate', (p) => {
        p.changeMap('heartfield', { x: 480, y: 0 });
      }),
    },
    {
      x: 896,
      y: 432,
      event: makeEvent('east-gate', (p) => {
        p.changeMap('ambergrove', { x: 0, y: 640 });
      }),
    },
    {
      x: 48,
      y: 432,
      event: makeEvent('west-gate', (p) => {
        p.changeMap('millbrook', { x: 1248, y: 640 });
      }),
    },
    {
      x: 448,
      y: 48,
      event: makeEvent('north-gate', (p) => {
        p.changeMap('sunridge', { x: 640, y: 1248 });
      }),
    },
    {
      x: 448,
      y: 448,
      event: makeEvent('rs-ew-01', (p) => {
        p.showText('You examine the rs-ew-01.');
      }),
    },
    {
      x: 288,
      y: 512,
      event: makeEvent('rs-ew-02', (p) => {
        p.showText('You examine the rs-ew-02.');
      }),
    },
    {
      x: 320,
      y: 544,
      event: makeEvent('rs-ew-03', (p) => {
        p.showText('You examine the rs-ew-03.');
      }),
    },
    {
      x: 416,
      y: 96,
      event: makeEvent('ch-ew-01', (p) => {
        p.showText('You examine the ch-ew-01.');
      }),
    },
    {
      x: 288,
      y: 352,
      event: makeEvent('ch-ew-02', (p) => {
        p.showText('You examine the ch-ew-02.');
      }),
    },
    {
      x: 256,
      y: 448,
      event: makeEvent('quest-board', (p) => {
        p.showText('You examine the quest-board.');
      }),
    },
    {
      x: 416,
      y: 96,
      event: makeEvent('telescope', (p) => {
        p.showText('You examine the telescope.');
      }),
    },
    {
      x: 256,
      y: 544,
      event: makeEvent('depths-entrance', (p) => {
        p.changeMap('depths-l1', { x: 320, y: 0 });
      }),
    },
    {
      x: 0,
      y: 0,
      event: makeEvent('opening-cutscene', (p) => {
        p.showText('You examine the opening-cutscene.');
      }),
    },
  ]);
}
