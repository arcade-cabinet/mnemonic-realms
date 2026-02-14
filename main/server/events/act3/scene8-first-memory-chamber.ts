import {
  EventData,
  MapData,
  RpgCommonPlayer,
  RpgEvent,
  type RpgMap,
  type RpgPlayer,
  RpgScene,
} from '@rpgjs/server';
import { PreserverFortressF3Map } from '../maps/fortress-f3'; // Assuming map definition is here

@EventData({
  name: 'act3-scene8-first-memory-chamber',
  hitbox: { width: 32, height: 32 },
  // This event is triggered automatically upon map entry, so no specific position is needed for the main trigger.
  // However, we'll use a specific tile for the player's initial spawn to ensure the auto-trigger works.
})
export default class FirstMemoryChamberEvent extends RpgEvent {
  private hasTriggered: boolean = false;

  onInit() {
    this.set({
      name: 'act3-scene8-first-memory-chamber',
      graphic: '', // Invisible event
      hitbox: { width: 32, height: 32 },
      // This event is triggered automatically upon map entry, so no specific position is needed for the main trigger.
      // However, we'll use a specific tile for the player's initial spawn to ensure the auto-trigger works.
    });
  }

  async onPlayerTouch(player: RpgPlayer) {
    if (this.hasTriggered) {
      return;
    }

    // Check if the player is on the correct map and quest state
    if (player.map.id === 'fortress-f3' && player.getQuest('MQ-09')?.state === 'active') {
      this.hasTriggered = true;
      await this.startConfrontation(player);
    }
  }

  async onChanges(player: RpgPlayer) {
    // This is a fallback for map-enter if onPlayerTouch doesn't fire immediately on map load
    // or if the player spawns directly on the event tile.
    if (
      !this.hasTriggered &&
      player.map.id === 'fortress-f3' &&
      player.getQuest('MQ-09')?.state === 'active'
    ) {
      this.hasTriggered = true;
      await this.startConfrontation(player);
    }
  }

  private async startConfrontation(player: RpgPlayer) {
    // Ensure the player is at the intended starting position for the scene
    await player.teleport('fortress-f3', 10, 1); // Player enters from the top of the chamber

    // --- Effects: Cutscene and System Message ---
    await player.showText(
      "The final floor is a single vast chamber. No puzzles. No random encounters. Just the Curator, the First Memory, and the confrontation that determines the world's future.",
      { time: 5000 },
    );
    await player.showText(
      "The First Memory sits at the chamber's center: a sphere of warm amber light, roughly human-sized, suspended above a crystal pedestal. It pulses slowly — like breathing. Like a question being asked, over and over: *Why do things change?*",
      { time: 7000 },
    );
    await player.showText(
      'The Curator stands before it, hands folded, calm. They have been waiting.',
      { time: 4000 },
    );

    await player.callScene('cutscene-play', { cutsceneId: 'curator-confrontation' });
    await player.showText('The Curator awaits. This is not a combat encounter.', {
      type: 'system',
    });

    // --- NPC Spawns ---
    const map = player.map as RpgMap;

    const lira = await map.createDynamicEvent({
      name: 'npc_lira',
      x: 8,
      y: 10,
      graphic: 'npc_lira',
      direction: 2, // Facing right
      speed: 0, // Static
      // No onAction for Lira here, her dialogue is part of the main sequence
    });

    const callum = await map.createDynamicEvent({
      name: 'npc_callum',
      x: 12,
      y: 10,
      graphic: 'npc_callum',
      direction: 2, // Facing left
      speed: 0, // Static
      // No onAction for Callum here, his dialogue is part of the main sequence
    });

    const curator = await map.createDynamicEvent({
      name: 'npc_curator',
      x: 10,
      y: 5,
      graphic: 'npc_curator',
      direction: 0, // Facing down towards the party
      speed: 0, // Static
      // The Curator's dialogue is handled directly in the sequence
    });

    // --- Dialogue Sequence ---
    await player.showText("I was hoping you'd come.", {
      speaker: 'The Curator',
      graphic: 'npc_curator',
    });
    await player.showText(
      "That is the world's first thought. The first act of wonder. The question that started everything: 'Why do things change?'",
      { speaker: 'The Curator', graphic: 'npc_curator' },
    );
    await player.showText(
      'Every civilization since has tried to answer it. Every answer has dissolved into the world, adding another layer, another voice to the question. The Choir answered with song. The Rootwalkers answered with growth. The Radiant Lens answered with light. The Peregrine Road answered with motion.',
      { speaker: 'The Curator', graphic: 'npc_curator' },
    );
    await player.showText(
      "And each answer eventually destroyed the civilization that gave it. They dissolved. They're gone. Their answer became the world, and THEY became nothing.",
      { speaker: 'The Curator', graphic: 'npc_curator' },
    );
    await player.showText(
      "I've watched it happen. Not personally — I'm not that old. But through the crystal. Through the frozen memories I've collected. I've seen the pattern: ask, answer, dissolve. Ask, answer, dissolve. An endless cycle of civilizations creating beautiful things and then ceasing to exist.",
      { speaker: 'The Curator', graphic: 'npc_curator' },
    );
    await player.showText(
      'I want it to stop. Not the beauty — the loss. I want to crystallize the question so that no one has to answer it anymore. No more civilizations dissolving. No more loss. Just... peace.',
      { speaker: 'The Curator', graphic: 'npc_curator' },
    );

    // Callum's response
    await player.showText(
      "You want to silence the question. But the question IS the world. Without 'why do things change?' there's no reason for anything to exist.",
      { speaker: 'Callum', graphic: 'npc_callum' },
    );
    await player.showText(
      "The world exists WHETHER it asks questions or not. The mountains don't need to wonder why they erode. The rivers don't need to wonder why they flow. They just ARE. I want the world to just BE.",
      { speaker: 'The Curator', graphic: 'npc_curator' },
    );

    // Lira's response
    await player.showText(
      "I was frozen. I was inside the crystal, in the silence you're describing. It wasn't terrible. But it wasn't alive, either.",
      { speaker: 'Lira', graphic: 'npc_lira' },
    );
    await player.showText('Were you suffering?', {
      speaker: 'The Curator',
      graphic: 'npc_curator',
    });
    await player.showText('No.', { speaker: 'Lira', graphic: 'npc_lira' });
    await player.showText('Then what was wrong with it?', {
      speaker: 'The Curator',
      graphic: 'npc_curator',
    });
    await player.showText("I couldn't choose.", { speaker: 'Lira', graphic: 'npc_lira' });
    await player.showText('Choice is what leads to dissolution.', {
      speaker: 'The Curator',
      graphic: 'npc_curator',
    });

    // Curator turns to player
    await curator.setDirection(player.direction); // Curator faces the player
    await player.showText(
      "You've recalled four gods. Permanent choices, made with single emotions, reshaping deities that the Dissolved left unfinished. You've broken stagnation zones, freed frozen people, shattered my cathedral.",
      { speaker: 'The Curator', graphic: 'npc_curator' },
    );
    await player.showText('Why? What makes your vision of the world better than mine?', {
      speaker: 'The Curator',
      graphic: 'npc_curator',
    });

    // --- God Recall Responses Manifest ---
    await player.showText('Your journey speaks for itself. The recalled gods respond:', {
      type: 'system',
    });

    const recalledGods = player.getVariable('recalled_gods') || {}; // Assuming a player variable stores recalled gods and their emotions
    let allSameEmotion: string | null = null;
    let emotionCount = 0;

    for (const godId in recalledGods) {
      const emotion = recalledGods[godId];
      if (emotion) {
        emotionCount++;
        if (allSameEmotion === null) {
          allSameEmotion = emotion;
        } else if (allSameEmotion !== emotion) {
          allSameEmotion = 'mixed'; // Not all the same
        }

        switch (emotion) {
          case 'Joy':
            await player.showText(
              "A warm golden light fills the room. The Curator's hands, folded tight, relax slightly.",
              { type: 'system' },
            );
            // Add visual effect for Joy (e.g., screen tint, particle effect)
            await player.emit('add-effect', {
              type: 'screen-tint',
              color: '#FFD700',
              duration: 1000,
            });
            break;
          case 'Fury':
            await player.showText(
              "The crystal walls crack. The Curator flinches but doesn't retreat.",
              { type: 'system' },
            );
            // Add visual effect for Fury (e.g., screen shake, crack overlay)
            await player.emit('add-effect', { type: 'screen-shake', duration: 1000 });
            break;
          case 'Sorrow':
            await player.showText("A gentle hush falls. The Curator's eyes soften.", {
              type: 'system',
            });
            // Add visual effect for Sorrow (e.g., desaturation, soft light)
            await player.emit('add-effect', { type: 'screen-desaturate', duration: 1000 });
            break;
          case 'Awe':
            await player.showText(
              'The chamber resonates with a harmonic chord. The Curator closes their eyes to listen.',
              { type: 'system' },
            );
            // Add visual effect for Awe (e.g., subtle glow, sound effect)
            await player.emit('add-effect', {
              type: 'screen-glow',
              color: '#ADD8E6',
              duration: 1000,
            });
            break;
        }
        await player.wait(2000); // Pause between god responses
      }
    }

    if (emotionCount === 4 && allSameEmotion !== 'mixed' && allSameEmotion !== null) {
      await player.showText(
        "You're consistent. You chose one feeling and committed to it. Four times. I don't agree with your choice — but I respect the commitment. That's more than most people manage.",
        { speaker: 'The Curator', graphic: 'npc_curator' },
      );
    }

    // --- Player Action: Walk to the First Memory ---
    await player.showText('Approach the First Memory.', { type: 'system', position: 'center' });
    await player.setVariable('can_approach_first_memory', true); // Allow player movement towards the memory

    // Wait for player to move to the First Memory (e.g., tile 10, 3)
    await player.moveRoutes(
      [
        {
          command: 'walk',
          x: 10,
          y: 3,
          speed: 100,
          // This route will complete when the player reaches the target.
          // We might need a custom event listener or a loop to check player position
          // if the player can move freely. For simplicity, let's assume a direct path.
        },
      ],
      true,
    ); // true means wait for completion

    // --- Quest Changes ---
    player.setQuest('MQ-09', 'completed');
    player.setQuest('MQ-10', 'active');

    await player.showText("Quest 'The Curator's Stasis' completed!", { type: 'quest' });
    await player.showText("Quest 'The World's Bloom' activated!", { type: 'quest' });

    // Clean up dynamic NPCs
    await map.removeEvent(lira.id);
    await map.removeEvent(callum.id);
    await map.removeEvent(curator.id);

    // End of scene, potentially transition to next phase or map
    await player.showText('The confrontation concludes. The world awaits your final choice.', {
      type: 'system',
    });
    // The next event (EV-F3-012) for the endgame cinematic will trigger after MQ-10 is complete.
  }
}
