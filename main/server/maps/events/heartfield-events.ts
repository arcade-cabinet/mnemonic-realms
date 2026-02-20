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
      x: 496,
      y: 496,
      event: makeNpc('hamlet-house-1_farmer-gale', 'npc_farmer_m1', (p) => showDialogue(p, 'farmer-gale-windmill')),
    },
    {
      x: 672,
      y: 464,
      event: makeNpc('hamlet-house-2_farmer-suri', 'npc_farmer_f1', (p) => showDialogue(p, 'farmer-suri')),
    },
    {
      x: 448,
      y: 672,
      event: makeNpc('hamlet-house-3_farmer-edric', 'npc_farmer_m2', (p) => showDialogue(p, 'farmer-edric')),
    },
    {
      x: 640,
      y: 672,
      event: makeNpc('hamlet-house-4_hamlet-elder', 'npc_elder_f1', (p) => showDialogue(p, 'hamlet-elder')),
    },
    {
      x: 512,
      y: 480,
      event: makeNpc('child-npc', 'npc_child_01', (p) => showDialogue(p, 'hamlet-child')),
    },
    {
      x: 544,
      y: 448,
      event: makeNpc('traveling-merchant', 'npc_merchant', (p) => showDialogue(p, 'traveling-merchant')),
    },
  ]);

  // --- Events ---
  map.createDynamicEvent([
    {
      x: 992,
      y: 320,
      event: makeEvent('old-windmill_RS-HF-02', (p) => {
        p.showText('You examine the old-windmill_RS-HF-02.');
      }),
    },
    {
      x: 1024,
      y: 256,
      event: makeEvent('old-windmill_CH-HF-01', (p) => {
        p.showText('You examine the old-windmill_CH-HF-01.');
      }),
    },
    {
      x: 1104,
      y: 944,
      event: makeEvent('stagnation-clearing_RS-HF-03', (p) => {
        p.showText('You examine the stagnation-clearing_RS-HF-03.');
      }),
    },
    {
      x: 1024,
      y: 864,
      event: makeEvent('stagnation-clearing_EV-HF-003', (p) => {
        p.showText('You examine the stagnation-clearing_EV-HF-003.');
      }),
    },
    {
      x: 448,
      y: 0,
      event: makeEvent('north-gate', (p) => {
        p.changeMap('everwick', { x: 480, y: 896 });
      }),
    },
    {
      x: 1248,
      y: 608,
      event: makeEvent('east-gate', (p) => {
        p.changeMap('ambergrove', { x: 0, y: 640 });
      }),
    },
    {
      x: 608,
      y: 1248,
      event: makeEvent('south-gate', (p) => {
        p.changeMap('shimmer-marsh', { x: 640, y: 0 });
      }),
    },
    {
      x: 576,
      y: 448,
      event: makeEvent('RS-HF-01', (p) => {
        p.showText('You examine the RS-HF-01.');
      }),
    },
    {
      x: 256,
      y: 960,
      event: makeEvent('RS-HF-04', (p) => {
        p.showText('You examine the RS-HF-04.');
      }),
    },
    {
      x: 160,
      y: 320,
      event: makeEvent('CH-HF-02', (p) => {
        p.showText('You examine the CH-HF-02.');
      }),
    },
    {
      x: 1152,
      y: 800,
      event: makeEvent('CH-HF-03', (p) => {
        p.showText('You examine the CH-HF-03.');
      }),
    },
    {
      x: 480,
      y: 448,
      event: makeEvent('EV-HF-001', (p) => {
        p.showText('You examine the EV-HF-001.');
      }),
    },
    {
      x: 960,
      y: 256,
      event: makeEvent('EV-HF-002', (p) => {
        p.showText('You examine the EV-HF-002.');
      }),
    },
    {
      x: 1088,
      y: 928,
      event: makeEvent('EV-HF-009', (p) => {
        p.showText('You examine the EV-HF-009.');
      }),
    },
    {
      x: 448,
      y: 96,
      event: makeEvent('hana-heartfield-intro', (p) => {
        p.showText('You examine the hana-heartfield-intro.');
      }),
    },
  ]);
}
