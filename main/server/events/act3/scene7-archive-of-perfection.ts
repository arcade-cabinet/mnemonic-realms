import { EventData, RpgEvent, type RpgPlayer } from '@rpgjs/server';

@EventData({
  id: 'act3-scene7-archive-of-perfection',
  name: 'Floor 2 — The Archive of Perfection',
  hitbox: { width: 32, height: 32 },
})
export class Floor2ArchiveOfPerfectionEvent extends RpgEvent {
  onInit() {
    this.set({
      name: 'Archive Event Trigger',
      // This event is primarily triggered by map-enter, so it doesn't need a visible graphic
      // It will be handled by the map's onPlayerTouch or onPlayerEnter hook
      graphic: '',
      width: 1,
      height: 1,
      // The actual trigger will be handled by the map's onPlayerEnter hook
      // This event data is mainly for the scene's logic container
    });
  }

  async onPlayerEnter(player: RpgPlayer) {
    // Ensure this event only fires once per map load for the initial sequence
    if (player.getVariable('act3-scene7-archive-of-perfection_triggered')) {
      return;
    }
    player.setVariable('act3-scene7-archive-of-perfection_triggered', true);

    // 1. Check trigger conditions (map-enter on fortress-f2)
    // This is implicitly handled by the map's onPlayerEnter hook calling this event.
    // We can add a specific check if needed, but for a scene-level event, it's usually the entry point.
    if (player.map.id !== 'fortress-f2') {
      return;
    }

    console.log(`Player entered Floor 2: The Archive of Perfection. Initializing scene events.`);

    // 2. Spawns NPCs at appropriate positions using createDynamicEvent()
    // Hana's Insight (Room 4)
    const liraEvent = await player.map.createDynamicEvent({
      x: 8 * 32, // Example position for Hana in Room 4
      y: 10 * 32,
      id: 'EV-F2-LIRA-INSIGHT',
      graphic: 'npc_hana',
      name: 'Hana',
      width: 1,
      height: 1,
      onAction: async (p: RpgPlayer) => {
        await p.showText(
          'Hana (stopping at a window): I know what this feels like. From the inside.',
          { speaker: 'Hana' },
        );
        await p.showText(
          "Hana: When I was frozen, I was aware. Not of time passing — there was no time. But of... being held. Like being carried in someone's arms while you sleep. Safe. Still. Protected.",
          { speaker: 'Hana' },
        );
        await p.showText(
          "Hana: It wasn't terrible. That's the worst part. The Curator isn't lying when they say this is a kindness. For the frozen, it IS a kindness. They don't suffer. They don't fear. They don't lose.",
          { speaker: 'Hana' },
        );
        await p.showText(
          "Hana: But they don't choose, either. And that's what the Curator can't understand. A kindness you didn't choose isn't kindness. It's control.",
          { speaker: 'Hana' },
        );
        // Mark dialogue as complete to prevent repeat on action
        liraEvent.setVariable('dialogue_complete', true);
        liraEvent.setGraphic(''); // Hana disappears after dialogue, or moves
      },
    });
    liraEvent.setVariable('dialogue_complete', false); // Initialize variable

    // Artun (optional, if he's with the party and has something to say)
    // For this scene, Artun isn't explicitly mentioned in dialogue, but if he were,
    // you'd spawn him similarly. Let's assume he's just present, not interactive for this scene.
    const _callumEvent = await player.map.createDynamicEvent({
      x: 7 * 32, // Example position for Artun near Hana
      y: 10 * 32,
      id: 'EV-F2-CALLUM-PRESENT',
      graphic: 'npc_artun',
      name: 'Artun',
      width: 1,
      height: 1,
      // Artun might have a short, non-essential line if interacted with
      onAction: async (p: RpgPlayer) => {
        await p.showText(
          'Artun: This place... it feels like a tomb, but they call it an archive.',
          { speaker: 'Artun' },
        );
      },
    });

    // 3. Plays dialogue sequences via player.showText()
    // Hana's insight dialogue is triggered by player action on her event.
    // The moral puzzle system message is a direct player.showText().

    // Moral Puzzle Trigger (Room 2)
    const moralPuzzleTrigger = await player.map.createDynamicEvent({
      x: 10 * 32, // Central crystal lock position
      y: 5 * 32,
      id: 'EV-F2-MORAL-PUZZLE-TRIGGER',
      name: 'Central Crystal Lock',
      graphic: '',
      width: 1,
      height: 1,
      onAction: async (p: RpgPlayer) => {
        if (p.getVariable('moral_puzzle_solved')) {
          await p.showText('The central lock is open. The path forward is clear.', {
            speaker: 'System',
          });
          return;
        }
        await p.showText(
          'SYSTEM: A chamber with 3 frozen scenes arranged around a central crystal lock. The lock holds the exit sealed. To open it, you must disrupt 2 of the 3 scenes — not by broadcasting, but by physically breaking the crystal pedestals that hold them. Breaking a pedestal sends a shockwave that cracks the central lock.',
          { speaker: 'System' },
        );
        await p.showText(
          'SYSTEM: Break 2 of 3 crystal pedestals to open the exit. Each broken pedestal frees the frozen subjects but destroys the preserved moment. Choose which 2 to free — and which 1 to leave.',
          { speaker: 'System' },
        );

        // 4. Fires effects (GUI for moral choice)
        await p.gui('moral-choice').open({
          choices: [
            { id: 'free-musicians', text: 'Free The Musicians' },
            { id: 'free-reunion', text: 'Free The Reunion' },
            { id: 'free-painter', text: 'Free The Painter' },
          ],
          // This is a simplified example. A real GUI would handle the choice logic.
          // For now, let's simulate the choice and its effect.
          onSelect: async (playerGui: RpgPlayer, choiceId: string) => {
            let freedCount = playerGui.getVariable('freed_scenes_count') || 0;
            const freedScenes = playerGui.getVariable('freed_scenes') || new Set<string>();

            if (freedScenes.has(choiceId)) {
              await playerGui.showText('You have already freed this scene.', { speaker: 'System' });
              return;
            }

            freedCount++;
            freedScenes.add(choiceId);
            playerGui.setVariable('freed_scenes_count', freedCount);
            playerGui.setVariable('freed_scenes', freedScenes);

            await playerGui.showText(
              `You chose to ${choiceId.replace('free-', '').replace('-', ' ')}. One more disruption needed.`,
              { speaker: 'System' },
            );

            if (freedCount >= 2) {
              await playerGui.showText(
                'The central crystal lock shatters! The path forward is open.',
                { speaker: 'System' },
              );
              await playerGui.showText(
                "Hana (quietly): Two freed. One stays. That's the Curator's final lesson — you can't save everything. Not even you.",
                { speaker: 'Hana' },
              );
              playerGui.setVariable('moral_puzzle_solved', true);
              // Remove the GUI or close it
              playerGui.gui('moral-choice').close();
              // Optionally, change the graphic of the lock to 'broken_crystal_lock'
              moralPuzzleTrigger.setGraphic('broken_crystal_lock');
            }
          },
        });
      },
    });
    player.setVariable('moral_puzzle_solved', false);
    player.setVariable('freed_scenes_count', 0);
    player.setVariable('freed_scenes', new Set<string>());

    // Boss Encounter Trigger (Room 5)
    const bossTrigger = await player.map.createDynamicEvent({
      x: 15 * 32, // Position for Archive Keeper
      y: 17 * 32,
      id: 'EV-F2-BOSS-ARCHIVE-KEEPER',
      graphic: 'sprite-boss-b-03',
      name: 'The Archive Keeper',
      width: 1,
      height: 1,
      onAction: async (p: RpgPlayer) => {
        if (p.getVariable('archive_keeper_defeated')) {
          await p.showText('The shattered remains of the Archive Keeper lie here.', {
            speaker: 'System',
          });
          return;
        }
        await p.showText(
          'Archive Keeper (hovering, expressionless): You do not understand what you are destroying. Each frozen moment is irreplaceable. Each one is a universe of perfection, held in crystal, safe from entropy.',
          { speaker: 'Archive Keeper' },
        );
        await p.showText(
          'Archive Keeper: The Curator trusted me to protect these. I will not fail.',
          { speaker: 'Archive Keeper' },
        );

        // Trigger combat
        await p.battle('boss-archive-keeper', {
          enemies: ['B-04b'], // Assuming B-04b is the Archive Keeper
          onVictory: async (victoryPlayer: RpgPlayer) => {
            await victoryPlayer.showText(
              'The Archive shatters. All frozen scenes in the room crack. The Keeper whispers: "The Curator... will understand."',
              { speaker: 'System' },
            );
            victoryPlayer.setVariable('archive_keeper_defeated', true);
            // Apply party buff
            victoryPlayer.addEffect({
              id: 'fortress_buff_f2',
              name: 'Fortress F2 Buff',
              description: '+15% all stats for remainder of the Fortress',
              params: {
                atk: 0.15,
                def: 0.15,
                int: 0.15,
                agi: 0.15,
              },
              duration: -1, // Permanent for the remainder of the fortress
            });
            await victoryPlayer.showText(
              'Your party gains +15% to all stats for the remainder of the Fortress!',
              { speaker: 'System' },
            );
            // 5. Updates quest state
            victoryPlayer.setQuest('MQ-09', 'advance', { objective: 2 });
            bossTrigger.setGraphic('archive_keeper_defeated'); // Change graphic to defeated state
          },
          onDefeat: async (defeatPlayer: RpgPlayer) => {
            await defeatPlayer.showText('You were defeated by the Archive Keeper. Try again!', {
              speaker: 'System',
            });
            // Player respawns or retries
          },
        });
      },
    });
    player.setVariable('archive_keeper_defeated', false);

    // Random encounters (Preserver Archivists and Captains)
    // These would typically be handled by a separate parallel event or map-level encounter system,
    // but for demonstration, we can create a trigger for one.
    const randomEncounterTrigger = await player.map.createDynamicEvent({
      x: 12 * 32, // Example position for a random encounter
      y: 12 * 32,
      id: 'EV-F2-RANDOM-ENCOUNTER-1',
      name: 'Preserver Patrol',
      graphic: 'npc_preserver_agent',
      width: 1,
      height: 1,
      onPlayerTouch: async (p: RpgPlayer) => {
        if (!p.getVariable('f2_encounter_1_cleared')) {
          await p.showText('A Preserver patrol ambushes you!', { speaker: 'System' });
          await p.battle('preserver-patrol-f2', {
            enemies: ['E-PV-04', 'E-PV-03'], // Example enemies: Archivist and Captain
            onVictory: async (victoryPlayer: RpgPlayer) => {
              await victoryPlayer.showText('You defeated the Preserver patrol.', {
                speaker: 'System',
              });
              victoryPlayer.setVariable('f2_encounter_1_cleared', true);
              randomEncounterTrigger.setGraphic(''); // Make event invisible after defeat
            },
          });
        }
      },
    });
    player.setVariable('f2_encounter_1_cleared', false);

    // 5. Updates quest state (initial advance for MQ-09 objective 2)
    // This is done after the boss defeat, as per the prompt.
    // However, if there's an initial quest update upon entering the map, it would go here.
    // For now, the MQ-09 advance is tied to the boss defeat.
  }
}

export default function setup() {
  // This function is called when the map is loaded.
  // The main logic is within the Floor2ArchiveOfPerfectionEvent's onPlayerEnter.
  // We can also define map-level events here if needed.
  console.log('Floor 2 Archive of Perfection scene setup complete.');
}
