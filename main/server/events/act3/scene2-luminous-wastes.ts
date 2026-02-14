import {
  EventData,
  Move,
  RpgCommonPlayer,
  RpgEvent,
  type RpgMap,
  type RpgPlayer,
} from '@rpgjs/server';
import { addItem } from '../../systems/inventory';
import { advanceObjective, getQuestStatus, isQuestActive } from '../../systems/quests';

@EventData({
  id: 'act3-scene2-luminous-wastes',
  name: "Luminous Wastes — The World's Edge",
  map: 'luminous-wastes',
  // No specific hitbox, as this is a map-enter event
})
export class LuminousWastesSceneEvent extends RpgEvent {
  onInit() {
    this.onChanges(({ player, map }) => {
      if (!player || !map) return;

      // Trigger on map enter for 'luminous-wastes'
      if (
        map.id === 'luminous-wastes' &&
        !player.getVariable('ACT3_SCENE2_LUMINOUS_WASTES_TRIGGERED')
      ) {
        this.triggerScene(player);
        player.setVariable('ACT3_SCENE2_LUMINOUS_WASTES_TRIGGERED', true);
      }

      // NPC visibility based on quest state
      const mq08State = getQuestStatus(player, 'MQ-08');
      const isMq08Active = mq08State === 'active' || mq08State === 'completed';

      // Hana
      const liraEvent = map.getEvent('npc_hana_luminous_wastes');
      if (liraEvent) {
        liraEvent.event.setVisible(isMq08Active);
      }

      // Artun
      const callumEvent = map.getEvent('npc_artun_luminous_wastes');
      if (callumEvent) {
        callumEvent.event.setVisible(isMq08Active);
      }
    });
  }

  async triggerScene(player: RpgPlayer) {
    // Ensure this scene only triggers once
    if (player.getVariable('ACT3_SCENE2_LUMINOUS_WASTES_TRIGGERED')) {
      return;
    }

    // Check if MQ-08 is active or completed
    const mq08State = getQuestStatus(player, 'MQ-08');
    if (mq08State !== 'active' && mq08State !== 'completed') {
      return;
    }

    // 1. System Message Effect
    await player.showText("The world's absolute boundary. New lines still drawing themselves.", {
      system: true,
      time: 3000,
    });

    // 2. Spawn NPCs
    const map = player.map;
    if (!map) return;

    // Hana at (10, 20) for initial dialogue
    const hana = await map.createDynamicEvent({
      x: 10,
      y: 20,
      event: HanaLuminousWastesEvent,
      id: 'npc_hana_luminous_wastes',
      graphic: 'npc_hana',
      direction: 0, // Facing south
      visible: true, // Will be controlled by onChanges
    });

    // Artun at (12, 20) for initial dialogue
    const artun = await map.createDynamicEvent({
      x: 12,
      y: 20,
      event: ArtunLuminousWastesEvent,
      id: 'npc_artun_luminous_wastes',
      graphic: 'npc_artun',
      direction: 0, // Facing south
      visible: true, // Will be controlled by onChanges
    });

    // Wait for NPCs to be fully spawned and visible
    await player.nextTick();

    // 3. Play dialogue sequences
    await player.showText("Nothing. There's almost nothing here.", {
      speaker: 'Hana',
      dialogue: 'dlg-lira-luminous-wastes-intro',
    });

    await player.showText(
      "No — not nothing. Potential. Every tile of this wasteland is waiting for its first memory. The Dissolved never planned anything for this area. It's completely open.",
      {
        speaker: 'Artun',
        dialogue: 'dlg-callum-luminous-wastes-intro',
      },
    );

    // 4. Update quest state: MQ-08 advance (obj 2)
    advanceObjective(player, 'MQ-08');

    // Set flag to prevent re-triggering
    player.setVariable('ACT3_SCENE2_LUMINOUS_WASTES_TRIGGERED', true);
  }
}

@EventData({
  id: 'npc_hana_luminous_wastes',
  name: 'Hana',
  hitbox: { width: 32, height: 32 },
  // Graphic and position set by createDynamicEvent
})
export class HanaLuminousWastesEvent extends RpgEvent {
  onAction(player: RpgPlayer) {
    this.dialogue(player);
  }

  async dialogue(player: RpgPlayer) {
    const mq08State = getQuestStatus(player, 'MQ-08');

    if (mq08State === 'active' && player.getVariable('QUEST_MQ-08_OBJ') === 2) {
      // Dialogue at The Edge
      if (player.x >= 4 && player.x <= 6 && player.y >= 19 && player.y <= 21) {
        // Approximate Edge location (5, 20)
        await player.showText('This is where the world ends. Right here.', {
          speaker: 'Hana',
          dialogue: 'dlg-lira-luminous-wastes-edge',
        });
      } else {
        // General dialogue for Hana in Luminous Wastes
        await player.showText("It's so... empty. Like a canvas waiting for a painter.", {
          speaker: 'Hana',
          dialogue: 'dlg-lira-luminous-wastes-general',
        });
      }
    } else {
      await player.showText("I'm not sure what to make of this place.", {
        speaker: 'Hana',
        dialogue: 'dlg-lira-luminous-wastes-fallback',
      });
    }
  }
}

@EventData({
  id: 'npc_artun_luminous_wastes',
  name: 'Artun',
  hitbox: { width: 32, height: 32 },
  // Graphic and position set by createDynamicEvent
})
export class ArtunLuminousWastesEvent extends RpgEvent {
  onAction(player: RpgPlayer) {
    this.dialogue(player);
  }

  async dialogue(player: RpgPlayer) {
    const mq08State = getQuestStatus(player, 'MQ-08');

    if (mq08State === 'active' && player.getVariable('QUEST_MQ-08_OBJ') === 2) {
      // Dialogue at The Edge
      if (player.x >= 4 && player.x <= 6 && player.y >= 19 && player.y <= 21) {
        // Approximate Edge location (5, 20)
        await player.showText('No. This is where the world is still beginning.', {
          speaker: 'Artun',
          dialogue: 'dlg-callum-luminous-wastes-edge-1',
        });
        await player.showText(
          'The Curator wants to freeze the First Memory to stop change forever. But change IS the world. Every new line out there is the world choosing to keep going. If the Curator succeeds... these lines stop. The drawing ends mid-stroke.',
          {
            speaker: 'Artun',
            dialogue: 'dlg-callum-luminous-wastes-edge-2',
          },
        );
      } else if (player.x >= 18 && player.x <= 22 && player.y >= 18 && player.y <= 22) {
        // Half-Built Village (20, 20)
        await player.showText(
          'A village that was planned but never remembered into existence. The civilization that designed it dissolved before they could finish. Look — you can see the layout. A central square, a market, homes along two roads. Everything a village needs except reality.',
          {
            speaker: 'Artun',
            dialogue: 'dlg-callum-luminous-wastes-village',
          },
        );
        await player.showText(
          'Broadcasting memory fragments into the Half-Built Village will solidify it, creating a new settlement. Solidifying the central square (5x5 area, requires potency 3+ fragment) reveals a rest point, a Resonance Stone, and 3 dissolved memory fragments embedded in the foundations.',
          {
            speaker: 'SYSTEM',
            dialogue: 'dlg-system-half-built-village-info',
            system: true,
          },
        );
      } else {
        // General dialogue for Artun in Luminous Wastes
        await player.showText('This is the frontier of creation. A place of pure potential.', {
          speaker: 'Artun',
          dialogue: 'dlg-callum-luminous-wastes-general',
        });
      }
    } else {
      await player.showText('The silence here is profound. It speaks of what could be.', {
        speaker: 'Artun',
        dialogue: 'dlg-callum-luminous-wastes-fallback',
      });
    }
  }
}

// Event for the Half-Built Village solidification
@EventData({
  id: 'EV-LW-001',
  name: 'Half-Built Village',
  map: 'luminous-wastes',
  hitbox: { width: 5 * 32, height: 5 * 32 }, // Central square 5x5 area
  x: 20,
  y: 20,
})
export class HalfBuiltVillageEvent extends RpgEvent {
  onAction(player: RpgPlayer) {
    this.solidifyVillage(player);
  }

  async solidifyVillage(player: RpgPlayer) {
    if (player.getVariable('HALF_BUILT_VILLAGE_SOLIDIFIED')) {
      await player.showText('The Half-Built Village has already been solidified.', {
        system: true,
      });
      return;
    }

    // Check for a potency 3+ fragment in inventory
    const hasPotentFragment = player
      .getInventory()
      .some((item) => item.item.type === 'fragment' && item.item.potency >= 3);

    if (!hasPotentFragment) {
      await player.showText(
        'You need a memory fragment of potency 3 or higher to solidify the central square.',
        { system: true },
      );
      return;
    }

    // Placeholder for GUI to select and broadcast fragment
    // For now, simulate a successful broadcast
    await player.showText('Broadcasting a potent memory fragment...', { system: true });
    // player.gui('broadcast-fragment-gui').open(); // Actual GUI call

    // Simulate fragment consumption and solidification
    // In a real game, this would involve player choice and fragment removal
    await player.showText(
      'The sketch-lines fill with color, texture, weight. Stone walls materialize. Thatched roofs appear. The central square solidifies around a fountain that begins to flow. The village is small but real — the first new settlement you have created from nothing.',
      { system: true },
    );

    player.setVariable('HALF_BUILT_VILLAGE_SOLIDIFIED', true);

    // Rewards
    addItem(player, 'Awe/Light/4★ Fragment', 1); // Placeholder item ID
    addItem(player, 'Mixed Emotion Fragment', 3); // Placeholder item ID for 3 foundation fragments

    await player.showText(
      "You found: Awe/Light/4★ Fragment (The architect's vision of what this village could have been. It is now.)",
      { system: true },
    );
    await player.showText('You found: 3 foundation fragments (mixed emotions, potency 2-3).', {
      system: true,
    });

    // Create a rest point and Resonance Stone dynamically
    const map = player.map;
    if (map) {
      await map.createDynamicEvent({
        x: 20,
        y: 20,
        event: RestPointEvent, // A generic rest point event
        id: 'half_built_village_rest_point',
        graphic: '',
        visible: true,
      });
      await map.createDynamicEvent({
        x: 21,
        y: 20,
        event: ResonanceStoneVillageEvent, // A generic Resonance Stone event
        id: 'half_built_village_resonance_stone',
        graphic: '',
        visible: true,
      });
    }

    await player.showText(
      'The Half-Built Village is now a new settlement, offering a rest point and a Resonance Stone!',
      { system: true },
    );
  }
}

// Generic Rest Point Event
@EventData({
  id: 'rest_point_event',
  name: 'Rest Point',
  hitbox: { width: 32, height: 32 },
})
export class RestPointEvent extends RpgEvent {
  onAction(player: RpgPlayer) {
    player.showText('You rest at the solidified fountain. Your HP and SP are fully restored.', {
      system: true,
    });
    player.hp = player.param.maxHp;
    player.sp = player.param.maxSp;
  }
}

// Generic Resonance Stone Event for the village
@EventData({
  id: 'resonance_stone_village_event',
  name: 'Resonance Stone',
  hitbox: { width: 32, height: 32 },
})
export class ResonanceStoneVillageEvent extends RpgEvent {
  onAction(player: RpgPlayer) {
    player.showText(
      'This Resonance Stone hums with the solidified memories of the Half-Built Village.',
      { system: true },
    );
    // Potentially offer a menu to view collected fragments or broadcast
  }
}

// Preserver Watchtower Combat Trigger
@EventData({
  id: 'EV-LW-WATCHTOWER',
  name: 'Preserver Watchtower',
  map: 'luminous-wastes',
  hitbox: { width: 3 * 32, height: 3 * 32 }, // Area around (35, 10)
  x: 35,
  y: 10,
})
export class PreserverWatchtowerEvent extends RpgEvent {
  onAction(player: RpgPlayer) {
    this.triggerCombat(player);
  }

  async triggerCombat(player: RpgPlayer) {
    if (player.getVariable('LUMINOUS_WASTES_WATCHTOWER_CLEARED')) {
      await player.showText('The Preserver Watchtower has already been cleared.', { system: true });
      return;
    }

    await player.showText(
      'You approach the fully crystallized Preserver Watchtower. Two Preserver Archivists emerge!',
      { system: true },
    );

    // Trigger combat encounter
    const success = await player.battle('Preserver Archivist', 'Preserver Archivist'); // Assuming these are enemy IDs

    if (success) {
      await player.showText(
        "The Preserver Watchtower is cleared! Luminous Wastes vibrancy +10. The tower's crystal crumbles, and the Sketch-lines near it begin to animate more freely.",
        { system: true },
      );
      player.setVariable('LUMINOUS_WASTES_WATCHTOWER_CLEARED', true);
      // Add vibrancy to the map (assuming a map vibrancy system)
      // player.map.addVibrancy(10); // Placeholder
      // Drop items from Archivists (handled by battle system usually)
    } else {
      await player.showText('You retreated from the Preserver Watchtower.', { system: true });
    }
  }
}

export default async function setupLuminousWastesEvents(map: RpgMap) {
  map.createEvent(LuminousWastesSceneEvent);
  map.createEvent(HalfBuiltVillageEvent);
  map.createEvent(PreserverWatchtowerEvent);

  // Dynamic events (Hana, Artun) are created by LuminousWastesSceneEvent
  // but their classes need to be registered for dynamic creation to work.
  map.registerEvent(HanaLuminousWastesEvent);
  map.registerEvent(ArtunLuminousWastesEvent);
  map.registerEvent(RestPointEvent);
  map.registerEvent(ResonanceStoneVillageEvent);
}
