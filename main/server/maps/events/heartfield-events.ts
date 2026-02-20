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
      x: 480,
      y: 96,
      event: makeNpc('hana', 'npc_hana', (p) => showDialogue(p, 'dlg-hana-scene5')),
    },
    {
      x: 480,
      y: 448,
      event: makeNpc('farmer-gale', 'npc_farmer_m1', (p) => showDialogue(p, 'dlg-farmer-gale')),
    },
    {
      x: 544,
      y: 512,
      event: makeNpc('farmer-suri', 'npc_farmer_f1', (p) => showDialogue(p, 'dlg-farmer-suri')),
    },
    {
      x: 448,
      y: 576,
      event: makeNpc('farmer-edric', 'npc_farmer_m2', (p) => showDialogue(p, 'dlg-farmer-edric')),
    },
    {
      x: 576,
      y: 448,
      event: makeNpc('hamlet-elder', 'npc_elder_f1', (p) => showDialogue(p, 'dlg-hamlet-elder')),
    },
    {
      x: 544,
      y: 448,
      event: makeNpc('traveling-merchant', 'npc_merchant', (p) => showDialogue(p, 'dlg-traveling-merchant')),
    },
    {
      x: 1056,
      y: 832,
      event: makeNpc('hana', 'npc_hana', (p) => showDialogue(p, 'dlg-hana-scene6')),
    },
    {
      x: 1056,
      y: 832,
      event: makeNpc('hana', 'npc_hana', (p) => showDialogue(p, 'dlg-hana-scene10')),
    },
    {
      x: 0,
      y: 0,
      event: makeNpc('artun', 'npc_artun', (p) => showDialogue(p, 'dlg-artun-scene16')),
    },
    {
      x: 0,
      y: 0,
      event: makeNpc('hana', 'npc_hana', (p) => showDialogue(p, 'dlg-hana-scene16')),
    },
  ]);

  // --- Events ---
  map.createDynamicEvent([
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
      x: 1024,
      y: 864,
      event: makeEvent('EV-HF-003', (p) => {
        p.showText('You examine the EV-HF-003.');
      }),
    },
    {
      x: 1104,
      y: 944,
      event: makeEvent('EV-HF-010', (p) => {
        p.showText('You examine the EV-HF-010.');
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
      x: 992,
      y: 288,
      event: makeEvent('RS-HF-02', (p) => {
        p.showText('You examine the RS-HF-02.');
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
      x: 1104,
      y: 944,
      event: makeEvent('RS-HF-03', (p) => {
        p.showText('You examine the RS-HF-03.');
      }),
    },
    {
      x: 1024,
      y: 288,
      event: makeEvent('CH-HF-01', (p) => {
        p.showText('You examine the CH-HF-01.');
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
      y: 0,
      event: makeEvent('transition-north-everwick', (p) => {
        p.changeMap('everwick', { x: 480, y: 896 });
      }),
    },
    {
      x: 1248,
      y: 640,
      event: makeEvent('transition-east-ambergrove', (p) => {
        p.changeMap('ambergrove', { x: 0, y: 640 });
      }),
    },
    {
      x: 640,
      y: 1248,
      event: makeEvent('transition-south-shimmer-marsh', (p) => {
        p.changeMap('shimmer-marsh', { x: 640, y: 0 });
      }),
    },
  ]);
}
