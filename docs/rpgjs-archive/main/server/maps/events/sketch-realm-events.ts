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
      y: 640,
      event: makeNpc('preserver-archivist', 'npc_preserver-archivist', (p) => showDialogue(p, 'preserver-archivist')),
    },
    {
      x: 768,
      y: 624,
      event: makeNpc('solidified-village-npcs', 'npc_solidified-village-npcs', (p) => showDialogue(p, 'solidified-village-npcs')),
    },
    {
      x: 2352,
      y: 720,
      event: makeNpc('preserver-captain-a', 'npc_preserver-captain-a', (p) => showDialogue(p, 'preserver-captain-a')),
    },
    {
      x: 2352,
      y: 624,
      event: makeNpc('preserver-captain-b', 'npc_preserver-captain-b', (p) => showDialogue(p, 'preserver-captain-b')),
    },
  ]);

  // --- Events ---
  map.createDynamicEvent([
    {
      x: 2592,
      y: 768,
      event: makeEvent('door-preserver-fortress', (p) => {
        p.changeMap('preserver-fortress', { x: 0, y: 0 });
      }),
    },
  ]);
}
