import type { RpgMap, RpgPlayer } from '@rpgjs/server';
import { showDialogue } from '../../systems/npc-interaction';

export function spawnMapEvents(player: RpgPlayer) {
  const map = player.map as RpgMap;

  // --- NPCs (dialogue routed via npc-interaction system) ---

  // Artun (Village Elder)
  map.createDynamicEvent({
    x: 19,
    y: 11,
    name: 'artun',
    graphic: 'npc_artun',
    hitbox: { width: 16, height: 16 },
    async onAction(player: RpgPlayer) {
      await showDialogue(player, 'artun');
    },
  });

  // Hana (Mentor)
  map.createDynamicEvent({
    x: 9,
    y: 19,
    name: 'hana',
    graphic: 'npc_hana',
    hitbox: { width: 16, height: 16 },
    async onAction(player: RpgPlayer) {
      await showDialogue(player, 'hana');
    },
  });

  // Khali (Shopkeeper — village-general)
  map.createDynamicEvent({
    x: 19,
    y: 17,
    name: 'khali',
    graphic: 'npc_khali',
    hitbox: { width: 16, height: 16 },
    async onAction(player: RpgPlayer) {
      await showDialogue(player, 'khali');
    },
  });

  // Hark (Blacksmith — village-weapons)
  map.createDynamicEvent({
    x: 19,
    y: 19,
    name: 'hark',
    graphic: 'npc_hark',
    hitbox: { width: 16, height: 16 },
    async onAction(player: RpgPlayer) {
      await showDialogue(player, 'hark');
    },
  });

  // Nyro (Innkeeper)
  map.createDynamicEvent({
    x: 21,
    y: 15,
    name: 'nyro',
    graphic: 'npc_nyro',
    hitbox: { width: 16, height: 16 },
    async onAction(player: RpgPlayer) {
      await showDialogue(player, 'nyro');
    },
  });

  // Villager A (villager-a)
  map.createDynamicEvent({
    x: 14,
    y: 15,
    name: 'villager-a',
    graphic: 'npc_villager_m1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText("Villager: The fountain brings such life to our village, doesn't it?");
    },
  });

  // Villager B (villager-b)
  map.createDynamicEvent({
    x: 16,
    y: 16,
    name: 'villager-b',
    graphic: 'npc_villager_f1',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText('Villager: I heard the Elder is worried about the whispers from the depths.');
    },
  });

  // Villager C (villager-c)
  map.createDynamicEvent({
    x: 10,
    y: 22,
    name: 'villager-c',
    graphic: 'npc_villager_m2',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText('Villager: The road to Heartfield is long, but beautiful this time of year.');
    },
  });

  // --- Events ---

  // EV-VH-003: Memorial Garden Resonance Stone [MQ-02]
  map.createDynamicEvent({
    x: 10,
    y: 17,
    name: 'EV-VH-003',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_02_STARTED') && !player.getVariable('MQ_02_COMPLETED')) {
        player.showText(
          'You touch the Memorial Garden Resonance Stone. A calm memory fragment resonates within you.',
        );
        player.setVariable('MQ_02_COMPLETED', true);
      } else {
        player.showText(
          'The Memorial Garden Resonance Stone stands peacefully. Its energy has already been received.',
        );
      }
    },
  });

  // EV-VH-008: Quest Board
  map.createDynamicEvent({
    x: 8,
    y: 14,
    name: 'EV-VH-008',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_03_COMPLETED')) {
        player.showText('You examine the Quest Board. Several notices are pinned here.');
        // TODO: Implement quest board UI
      } else {
        player.showText(
          'The Quest Board is empty for now. Perhaps more opportunities will appear as you progress.',
        );
      }
    },
  });

  // EV-VH-009: South Gate transition -> Heartfield
  map.createDynamicEvent({
    x: 15,
    y: 25,
    name: 'EV-VH-009',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('heartfield', { x: 15, y: 0 });
    },
  });

  // EV-VH-010: East Gate transition -> Ambergrove
  map.createDynamicEvent({
    x: 29,
    y: 14,
    name: 'EV-VH-010',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('ambergrove', { x: 0, y: 20 });
    },
  });

  // EV-VH-011: West Gate transition -> Millbrook
  map.createDynamicEvent({
    x: 0,
    y: 14,
    name: 'EV-VH-011',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.changeMap('millbrook', { x: 39, y: 20 });
    },
  });

  // EV-VH-012: North Gate transition -> Sunridge (conditional MQ_04_COMPLETED)
  map.createDynamicEvent({
    x: 15,
    y: 0,
    name: 'EV-VH-012',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_04_COMPLETED')) {
        player.changeMap('sunridge', { x: 20, y: 39 });
      } else {
        player.showText(
          'The northern path is not yet open. You need to progress further before heading to Sunridge.',
        );
      }
    },
  });

  // EV-VH-013: Artun's telescope lookout
  map.createDynamicEvent({
    x: 12,
    y: 3,
    name: 'EV-VH-013',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'You look through the telescope. The Settled Lands stretch out before you, a tapestry of fields and forests.',
      );
    },
  });

  // EV-VH-014: Hidden Depths entrance (conditional MQ_05_COMPLETED)
  map.createDynamicEvent({
    x: 8,
    y: 17,
    name: 'EV-VH-014',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (player.getVariable('MQ_05_COMPLETED')) {
        player.showText('You found a hidden passage! It leads into the depths below.');
        player.changeMap('depths-l1', { x: 10, y: 0 });
      } else {
        player.showText('There seems to be something hidden here, but you cannot access it yet.');
      }
    },
  });

  // EV-VH-015: Fountain
  map.createDynamicEvent({
    x: 14,
    y: 15,
    name: 'EV-VH-015',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      player.showText(
        'The fountain sparkles with vibrancy. Its gentle cascade brings life to the village square.',
      );
      // TODO: Implement vibrancy-based visual effects (particle animations at high vibrancy)
    },
  });

  // EV-VH-016: Opening cutscene trigger [MQ-01]
  map.createDynamicEvent({
    x: 0,
    y: 0,
    name: 'EV-VH-016',
    hitbox: { width: 16, height: 16 },
    onAction(player: RpgPlayer) {
      if (!player.getVariable('MQ_01_STARTED') && !player.getVariable('MQ_01_COMPLETED')) {
        player.showText('A new day dawns in the Village Hub. Your journey begins...');
        player.setVariable('MQ_01_STARTED', true);
      }
    },
  });
}
