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
      x: 0,
      y: 0,
      event: makeNpc('artun', 'npc_artun', (p) => showDialogue(p, 'dlg-artun-scene1')),
    },
    {
      x: 0,
      y: 0,
      event: makeNpc('hana', 'npc_hana', (p) => showDialogue(p, 'dlg-hana-scene3')),
    },
    {
      x: 0,
      y: 0,
      event: makeNpc('hana', 'npc_hana', (p) => showDialogue(p, 'dlg-hana-scene4')),
    },
    {
      x: 0,
      y: 0,
      event: makeNpc('hana', 'npc_hana', (p) => showDialogue(p, 'dlg-hana-scene11')),
    },
    {
      x: 0,
      y: 0,
      event: makeNpc('artun', 'npc_artun', (p) => showDialogue(p, 'dlg-artun-scene11')),
    },
    {
      x: 0,
      y: 0,
      event: makeNpc('grym', 'npc_grym', (p) => showDialogue(p, 'dlg-grym-scene11')),
    },
    {
      x: 0,
      y: 0,
      event: makeNpc('artun', 'npc_artun', (p) => showDialogue(p, 'dlg-artun-scene12')),
    },
    {
      x: 0,
      y: 0,
      event: makeNpc('artun', 'npc_artun', (p) => showDialogue(p, 'dlg-artun-scene17')),
    },
    {
      x: 0,
      y: 0,
      event: makeNpc('hana', 'npc_hana', (p) => showDialogue(p, 'dlg-hana-scene17')),
    },
    {
      x: 0,
      y: 0,
      event: makeNpc('grym', 'npc_grym', (p) => showDialogue(p, 'dlg-grym-scene17')),
    },
  ]);

  // --- Events ---
  map.createDynamicEvent([
    {
      x: 480,
      y: 800,
      event: makeEvent('transition-south-heartfield', (p) => {
        p.changeMap('heartfield', { x: 480, y: 0 });
      }),
    },
    {
      x: 928,
      y: 448,
      event: makeEvent('transition-east-ambergrove', (p) => {
        p.changeMap('ambergrove', { x: 0, y: 640 });
      }),
    },
    {
      x: 0,
      y: 448,
      event: makeEvent('transition-west-millbrook', (p) => {
        p.changeMap('millbrook', { x: 1248, y: 640 });
      }),
    },
    {
      x: 480,
      y: 0,
      event: makeEvent('transition-north-sunridge', (p) => {
        p.changeMap('sunridge', { x: 640, y: 1248 });
      }),
    },
    {
      x: 256,
      y: 544,
      event: makeEvent('transition-down-depths-l1', (p) => {
        p.changeMap('depths-l1', { x: 320, y: 0 });
      }),
    },
  ]);
}
