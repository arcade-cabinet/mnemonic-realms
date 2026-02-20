import { EventData, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';

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
  // --- Events ---
  map.createDynamicEvent([
    {
      x: 624,
      y: 528,
      event: makeEvent('door-shimmer-marsh-store', (p) => {
        p.changeMap('shimmer-marsh-store', { x: 0, y: 0 });
      }),
    },
    {
      x: 480,
      y: 672,
      event: makeEvent('door-shimmer-marsh-inn', (p) => {
        p.changeMap('shimmer-marsh-inn', { x: 0, y: 0 });
      }),
    },
    {
      x: 2784,
      y: 592,
      event: makeEvent('door-flickerveil-store', (p) => {
        p.changeMap('flickerveil-store', { x: 0, y: 0 });
      }),
    },
    {
      x: 2656,
      y: 768,
      event: makeEvent('door-flickerveil-inn', (p) => {
        p.changeMap('flickerveil-inn', { x: 0, y: 0 });
      }),
    },
    {
      x: 2448,
      y: 848,
      event: makeEvent('door-flickerveil-library', (p) => {
        p.changeMap('flickerveil-library', { x: 0, y: 0 });
      }),
    },
  ]);
}
