import { EventData, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';
import { showDialogue } from '../../systems/npc-interaction';

/**
 * Factory: creates an @EventData-decorated RpgEvent class with graphic + onAction.
 * RPG-JS createDynamicEvent requires { x, y, event: EventClass }.
 */
function makeNpc(
  id: string,
  graphic: string,
  action: (player: RpgPlayer) => void | Promise<void>,
) {
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

function makeEvent(
  id: string,
  action: (player: RpgPlayer) => void | Promise<void>,
) {
  @EventData({ name: id, hitbox: { width: 16, height: 16 } })
  class Evt extends RpgEvent {
    async onAction(player: RpgPlayer) {
      await action(player);
    }
  }
  return Evt;
}

export function spawnMapEvents(player: RpgPlayer, map: RpgMap) {
  // --- NPCs (dialogue routed via npc-interaction system) ---

  map.createDynamicEvent([
    // Artun (Village Elder)
    { x: 19 * 32, y: 11 * 32, event: makeNpc('artun', 'npc_artun', (p) => showDialogue(p, 'artun')) },
    // Hana (Mentor)
    { x: 9 * 32, y: 19 * 32, event: makeNpc('hana', 'npc_hana', (p) => showDialogue(p, 'hana')) },
    // Khali (Shopkeeper — village-general)
    { x: 19 * 32, y: 17 * 32, event: makeNpc('khali', 'npc_khali', (p) => showDialogue(p, 'khali')) },
    // Hark (Blacksmith — village-weapons)
    { x: 19 * 32, y: 19 * 32, event: makeNpc('hark', 'npc_hark', (p) => showDialogue(p, 'hark')) },
    // Nyro (Innkeeper)
    { x: 21 * 32, y: 15 * 32, event: makeNpc('nyro', 'npc_nyro', (p) => showDialogue(p, 'nyro')) },

    // Generic villagers
    {
      x: 14 * 32,
      y: 15 * 32,
      event: makeNpc('villager-a', 'npc_villager_m1', (p) =>
        p.showText("The fountain brings such life to our village, doesn't it?"),
      ),
    },
    {
      x: 16 * 32,
      y: 16 * 32,
      event: makeNpc('villager-b', 'npc_villager_f1', (p) =>
        p.showText('I heard the Elder is worried about the whispers from the depths.'),
      ),
    },
    {
      x: 10 * 32,
      y: 22 * 32,
      event: makeNpc('villager-c', 'npc_villager_m2', (p) =>
        p.showText('The road to Heartfield is long, but beautiful this time of year.'),
      ),
    },
  ]);

  // --- Events ---

  map.createDynamicEvent([
    // EV-VH-003: Memorial Garden Resonance Stone [MQ-02]
    {
      x: 10 * 32,
      y: 17 * 32,
      event: makeEvent('EV-VH-003', (p) => {
        if (p.getVariable('MQ_02_STARTED') && !p.getVariable('MQ_02_COMPLETED')) {
          p.showText(
            'You touch the Memorial Garden Resonance Stone. A calm memory fragment resonates within you.',
          );
          p.setVariable('MQ_02_COMPLETED', true);
        } else {
          p.showText(
            'The Memorial Garden Resonance Stone stands peacefully. Its energy has already been received.',
          );
        }
      }),
    },
    // EV-VH-008: Quest Board
    {
      x: 8 * 32,
      y: 14 * 32,
      event: makeEvent('EV-VH-008', (p) => {
        if (p.getVariable('MQ_03_COMPLETED')) {
          p.showText('You examine the Quest Board. Several notices are pinned here.');
        } else {
          p.showText(
            'The Quest Board is empty for now. Perhaps more opportunities will appear as you progress.',
          );
        }
      }),
    },
    // EV-VH-009: South Gate transition -> Heartfield
    {
      x: 15 * 32,
      y: 25 * 32,
      event: makeEvent('EV-VH-009', (p) => {
        p.changeMap('heartfield', { x: 15 * 32, y: 0 });
      }),
    },
    // EV-VH-010: East Gate transition -> Ambergrove
    {
      x: 29 * 32,
      y: 14 * 32,
      event: makeEvent('EV-VH-010', (p) => {
        p.changeMap('ambergrove', { x: 0, y: 20 * 32 });
      }),
    },
    // EV-VH-011: West Gate transition -> Millbrook
    {
      x: 0,
      y: 14 * 32,
      event: makeEvent('EV-VH-011', (p) => {
        p.changeMap('millbrook', { x: 39 * 32, y: 20 * 32 });
      }),
    },
    // EV-VH-012: North Gate transition -> Sunridge (conditional)
    {
      x: 15 * 32,
      y: 0,
      event: makeEvent('EV-VH-012', (p) => {
        if (p.getVariable('MQ_04_COMPLETED')) {
          p.changeMap('sunridge', { x: 20 * 32, y: 39 * 32 });
        } else {
          p.showText(
            'The northern path is not yet open. You need to progress further before heading to Sunridge.',
          );
        }
      }),
    },
    // EV-VH-013: Telescope lookout
    {
      x: 12 * 32,
      y: 3 * 32,
      event: makeEvent('EV-VH-013', (p) => {
        p.showText(
          'You look through the telescope. The Settled Lands stretch out before you, a tapestry of fields and forests.',
        );
      }),
    },
    // EV-VH-014: Hidden Depths entrance (conditional)
    {
      x: 8 * 32,
      y: 17 * 32,
      event: makeEvent('EV-VH-014', (p) => {
        if (p.getVariable('MQ_05_COMPLETED')) {
          p.showText('You found a hidden passage! It leads into the depths below.');
          p.changeMap('depths-l1', { x: 10 * 32, y: 0 });
        } else {
          p.showText('There seems to be something hidden here, but you cannot access it yet.');
        }
      }),
    },
    // EV-VH-015: Fountain
    {
      x: 14 * 32,
      y: 15 * 32,
      event: makeEvent('EV-VH-015', (p) => {
        p.showText(
          'The fountain sparkles with vibrancy. Its gentle cascade brings life to the village square.',
        );
      }),
    },
    // EV-VH-016: Opening cutscene trigger [MQ-01]
    {
      x: 0,
      y: 0,
      event: makeEvent('EV-VH-016', (p) => {
        if (!p.getVariable('MQ_01_STARTED') && !p.getVariable('MQ_01_COMPLETED')) {
          p.showText('A new day dawns in the Village Hub. Your journey begins...');
          p.setVariable('MQ_01_STARTED', true);
        }
      }),
    },
  ]);
}
