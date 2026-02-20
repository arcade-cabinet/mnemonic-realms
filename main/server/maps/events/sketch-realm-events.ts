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
      x: 864,
      y: 1920,
      event: makeEvent('door-half-drawn-store', (p) => {
        p.changeMap('half-drawn-store', { x: 0, y: 0 });
      }),
    },
  ]);
}
