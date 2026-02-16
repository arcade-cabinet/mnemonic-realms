import { EventData, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';
import { getQuestStatus, isQuestComplete, startQuest } from '../../systems/quests';

@EventData({
  id: 'act2-scene17-curator-endgame',
  name: "The Curator's Endgame",
  hitbox: { width: 32, height: 32 },
  // This event is auto-triggered when conditions are met, so no specific graphic or position is needed for the trigger itself.
  // NPCs will be dynamically spawned.
})
export class Act2Scene17CuratorEndgame extends RpgEvent {
  onInit() {
    this.set({
      name: 'act2-scene17-curator-endgame',
      // This event is a scene trigger, it doesn't have a physical presence on the map.
      // It's triggered by quest state and map entry.
      // We set its position to an arbitrary off-map location or a central point if it needs to be "present" for onInit.
      // For auto-triggering on map load with conditions, the position doesn't strictly matter for the trigger itself.
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      // The event itself is invisible, it just manages the scene.
      graphic: '',
      visible: false,
      priority: 0, // Lower priority so it doesn't block other events if placed on a visible tile
    });
  }

  async onChanges(player: RpgPlayer) {
    // Trigger condition: quest-state, map: village-hub, condition: lira-freed-and-SQ05-complete
    const isHanaFreed = isQuestComplete(player, 'MQ-04'); // Assuming MQ-04 is "Hana Freed"
    const isSQ05Complete = isQuestComplete(player, 'SQ-05'); // "Janik's Doubt"

    if (
      player.map.id === 'village-hub' &&
      isHanaFreed &&
      isSQ05Complete &&
      getQuestStatus(player, 'MQ-07') === 'inactive'
    ) {
      // Ensure this scene only plays once
      if (player.getVariable('ACT2_SCENE17_PLAYED')) {
        return;
      }
      player.setVariable('ACT2_SCENE17_PLAYED', true);

      // Prevent re-triggering if player moves
      this.removeEvent(player.map.id, this.id);

      // Pause player movement and interaction
      player.canMove = false;
      player.fixDirection = true;

      // --- 1. Spawns NPCs at appropriate positions using createDynamicEvent() ---
      // Assuming Elder's House is a specific room or area within Village Hub
      // These positions are illustrative; adjust based on actual map layout for Elder's House
      const callumX = 19; // Example position in Elder's House
      const callumY = 11;
      const liraX = 20; // Example position near Artun
      const liraY = 11;

      const map = player.map as RpgMap;

      // Create Artun
      const callumEvent = await map.createDynamicEvent({
        x: callumX,
        y: callumY,
        id: 'npc_artun_scene', // Unique ID for this scene's NPC
        graphic: 'npc_artun',
        name: 'Artun',
        speed: 1,
        direction: 2, // Facing down
        through: false,
        priority: 1,
        sync: true,
        // Add any specific event logic for Artun if needed, e.g., onAction
        onAction(_player: RpgPlayer) {
          // This NPC is part of a cutscene, so direct interaction might be limited
          // or lead to a "wait" message.
        },
      });

      // Create Hana
      const liraEvent = await map.createDynamicEvent({
        x: liraX,
        y: liraY,
        id: 'npc_hana_scene', // Unique ID for this scene's NPC
        graphic: 'npc_hana',
        name: 'Hana',
        speed: 1,
        direction: 2, // Facing down
        through: false,
        priority: 1,
        sync: true,
        onAction(_player: RpgPlayer) {
          // Similar to Artun, direct interaction might be limited
        },
      });

      // Make player face Artun
      await player.changeDirection(4); // Face left towards Artun if Artun is to the left

      // --- 3. Plays dialogue sequences via player.showText() ---
      await player.showText(
        'Artun: "Player, Hana, I\'ve gathered you here because the situation has become dire."',
      );
      await player.showText('Hana: "What is it, Artun? Your tone suggests something truly grave."');
      await player.showText('Artun: "The Curator... he has found it. The First Memory."');
      await player.showText('Player: "The First Memory? But I thought it was lost, a legend..."');
      await player.showText(
        'Artun: "He intends to crystallize it. To lock away the very essence of creation, to prevent any further ' +
          'dissolution. He believes it\'s the only way to achieve true, unchanging perfection."',
      );
      await player.showText(
        'Hana: "Crystallize the First Memory... that would be the end of everything. No new thoughts, no new emotions, just... stasis."',
      );
      await player.showText(
        'Artun: "Precisely. We must stop him. This is no longer about restoring memories, but about preserving the future itself."',
      );
      await player.showText('Player: "Where is he? Where is the First Memory?"');
      await player.showText(
        'Artun: "The Fortress. Deep within the Undrawn Peaks. It\'s heavily guarded, a place few have ever reached."',
      );
      await player.showText('Hana: "Then we must prepare. This will be our greatest challenge."');
      await player.showText(
        'Artun: "Indeed. The fate of Mnemonic Realms rests on your shoulders, Player."',
      );

      // --- 4. Fires effects (combat, GUI, screen effects, music) ---
      await player.showText('The Curator has found the First Memory.', {
        type: 'system',
      });

      // --- 5. Updates quest state ---
      startQuest(player, 'MQ-07'); // Activate Main Quest 07: "The Fortress Approach"

      // Clean up dynamic NPCs
      map.removeEvent(callumEvent.id);
      map.removeEvent(liraEvent.id);

      // Resume player movement and interaction
      player.canMove = true;
      player.fixDirection = false;
    }
  }
}

export default Act2Scene17CuratorEndgame;
