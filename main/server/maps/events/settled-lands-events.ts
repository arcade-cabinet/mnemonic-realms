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
      x: 832,
      y: 576,
      event: makeNpc('khali', 'npc_khali', (p) => showDialogue(p, 'khali')),
    },
    {
      x: 720,
      y: 768,
      event: makeNpc('hark', 'npc_hark', (p) => showDialogue(p, 'hark')),
    },
    {
      x: 512,
      y: 880,
      event: makeNpc('nyro', 'npc_nyro', (p) => showDialogue(p, 'nyro')),
    },
    {
      x: 288,
      y: 736,
      event: makeNpc('artun', 'npc_artun', (p) => showDialogue(p, 'artun')),
    },
    {
      x: 576,
      y: 512,
      event: makeNpc('solara', 'npc_solara', (p) => showDialogue(p, 'solara')),
    },
    {
      x: 1552,
      y: 512,
      event: makeNpc('farmer-gale', 'npc_farmer-gale', (p) => showDialogue(p, 'farmer-gale')),
    },
    {
      x: 1648,
      y: 512,
      event: makeNpc('farmer-suri', 'npc_farmer-suri', (p) => showDialogue(p, 'farmer-suri')),
    },
    {
      x: 1600,
      y: 432,
      event: makeNpc('farmer-edric', 'npc_farmer-edric', (p) => showDialogue(p, 'farmer-edric')),
    },
    {
      x: 1600,
      y: 432,
      event: makeNpc('hamlet-elder', 'npc_hamlet-elder', (p) => showDialogue(p, 'hamlet-elder')),
    },
    {
      x: 1648,
      y: 496,
      event: makeNpc('child-npc', 'npc_child-npc', (p) => showDialogue(p, 'child-npc')),
    },
  ]);

  // --- Events ---
  map.createDynamicEvent([
    {
      x: 816,
      y: 560,
      event: makeEvent('door-everwick-khali', (p) => {
        p.changeMap('unknown', { x: 0, y: 0 });
      }),
    },
    {
      x: 704,
      y: 752,
      event: makeEvent('door-everwick-hark', (p) => {
        p.changeMap('unknown', { x: 0, y: 0 });
      }),
    },
    {
      x: 496,
      y: 864,
      event: makeEvent('door-everwick-inn', (p) => {
        p.changeMap('unknown', { x: 0, y: 0 });
      }),
    },
    {
      x: 272,
      y: 720,
      event: makeEvent('door-everwick-artun', (p) => {
        p.changeMap('unknown', { x: 0, y: 0 });
      }),
    },
    {
      x: 2928,
      y: 1616,
      event: makeEvent('door-millbrook-provisions', (p) => {
        p.changeMap('unknown', { x: 0, y: 0 });
      }),
    },
    {
      x: 2800,
      y: 1856,
      event: makeEvent('door-millbrook-forge', (p) => {
        p.changeMap('unknown', { x: 0, y: 0 });
      }),
    },
    {
      x: 2576,
      y: 2000,
      event: makeEvent('door-millbrook-inn', (p) => {
        p.changeMap('unknown', { x: 0, y: 0 });
      }),
    },
    {
      x: 2352,
      y: 1904,
      event: makeEvent('door-millbrook-fish', (p) => {
        p.changeMap('unknown', { x: 0, y: 0 });
      }),
    },
  ]);
}
