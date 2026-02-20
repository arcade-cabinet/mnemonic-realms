import { EventData, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';
import { addItem } from '../../systems/inventory';
import { completeQuest, getQuestStatus, startQuest } from '../../systems/quests';

// Define the event data for the scene
@EventData({
  id: 'act2-scene3-frontier-opens',
  name: 'The Frontier Opens',
  hitbox: { width: 1, height: 1 }, // This event is triggered by map-enter, so hitbox is minimal
})
export class TheFrontierOpensEvent extends RpgEvent {
  onInit() {
    this.set({
      graphic: '', // Invisible event
    });
  }

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: cutscene orchestration requires sequential branching
  async onPlayerTouch(player: RpgPlayer) {
    // This event is designed to trigger on map-enter for specific frontier zones
    // and only if the 'post-ridgewalker' condition (MQ-05 started/completed) is met.
    // We'll use onPlayerTouch as a proxy for map-enter, checking the map ID.

    const currentMap = player.map;
    const frontierMaps = ['shimmer_marsh', 'flickerveil', 'resonance_fields', 'hollow_ridge']; // Include Hollow Ridge as it's the gateway

    // Check if the player is in a frontier map and MQ-05 is active/completed
    if (frontierMaps.includes(currentMap.id) && getQuestStatus(player, 'MQ-05') !== 'inactive') {
      // Check if this scene has already been processed for this player to prevent re-triggering
      if (player.getVariable('ACT2_SCENE3_FRONTIER_OPENED')) {
        return;
      }

      // Mark the scene as processed for this player
      player.setVariable('ACT2_SCENE3_FRONTIER_OPENED', true);

      // --- 1. Artun's Letters (triggered on first entry to each zone) ---
      // These are handled by individual map-enter events for each zone,
      // but we can ensure Artun is present for the first one.
      // For this scene, we'll assume Artun is with the player.

      // --- 2. Spawns NPCs at appropriate positions using createDynamicEvent() ---
      // These NPCs are typically static and part of the map's initial setup,
      // but for dynamic placement, we can use createDynamicEvent.
      // For this scene, we'll assume they are already placed as per the map data,
      // but we'll simulate their "presence" by triggering their dialogue.

      // --- 3. Plays dialogue sequences via player.showText() ---

      // Dialogue for Shimmer Marsh (Vash) - EV-SM-001
      if (currentMap.id === 'shimmer_marsh' && !player.getVariable('SM_VASH_INTRO_DONE')) {
        player.setVariable('SM_VASH_INTRO_DONE', true);
        await player.showText('The air here feels heavy. Not with moisture — with memory.', {
          speaker: 'Artun',
        });
        await player.showText(
          "A visitor? Out here? Either you're lost or you're looking for something most people think is a fairy tale.",
          { speaker: 'Vash' },
        );
        await player.showText("We're looking for the dormant god in the hollow to the south.", {
          speaker: 'Artun',
        });
        await player.showText(
          "Verdance's Hollow. I've studied it for twenty years. The tree isn't dead — it's waiting. Roots pulse with green light, shoots sprout wherever they surface. But the path is blocked — dense root clusters choke the approach.",
          { speaker: 'Vash' },
        );
        await player.showText(
          "I could clear the way, but I'll need help first. The marsh creatures have been more aggressive lately. Something about the Preserver's crystallization is agitating them. Clear the Stagnation Bog's perimeter — drive back the Mire Crawlers — and I'll show you the safe route to the Hollow.",
          { speaker: 'Vash' },
        );
        startQuest(player, 'SQ-06'); // "The Hermit's Path"
      }

      // Dialogue for Flickerveil (Reza) - EV-FV-001
      if (currentMap.id === 'flickerveil' && !player.getVariable('FV_REZA_INTRO_DONE')) {
        player.setVariable('FV_REZA_INTRO_DONE', true);
        await player.showText(
          'Flickerveil. A vast forest where the trees flicker between fully rendered and sketch-like outlines. The Radiant Lens — astronomers and light-weavers — dissolved their memories into the light itself. Their dormant god, a prototype of light, sleeps in a clearing as a suspended prism of concentrated luminance. A frontier settlement exists here where the buildings shimmer between complete and outline. The residents broadcast memories into their homes daily just to keep them solid.',
          { speaker: 'Artun', type: 'read' },
        );
        await player.showText(
          "Welcome to the Flickering Village. Don't be alarmed when the walls go translucent — they always come back. We just have to remind them.",
          { speaker: 'Village Elder Reza' },
        );
        await player.showText(
          "You're an Architect? Good. We need one. The Preservers have been trying to \"stabilize\" our village by crystallizing it. We keep refusing. We'd rather live in a place that flickers than one that's frozen solid.",
          { speaker: 'Reza' },
        );
        await player.showText(
          "The grove to the west — Luminos Grove — has a column of light so bright you can't approach without shielding. I've spent my life studying it. I believe something sleeps within the light — something that could stabilize this entire forest without freezing it.",
          { speaker: 'Reza' },
        );
        await player.showText(
          'Take this. I polished it from grove crystal. It focuses scattered light into a coherent beam.',
          { speaker: 'Reza' },
        );
        addItem(player, 'K-04', 1); // Give Light Lens
        startQuest(player, 'SQ-08'); // "The Light in the Grove"
      }

      // Dialogue for Resonance Fields (Lead Audiomancer) - EV-RF-001
      if (
        currentMap.id === 'resonance_fields' &&
        !player.getVariable('RF_AUDIOMANCER_INTRO_DONE')
      ) {
        player.setVariable('RF_AUDIOMANCER_INTRO_DONE', true);
        await player.showText(
          'Resonance Fields. Vast open plains where the wind carries audible memory-sounds — fragments of conversations, distant music, laughter. The Choir of the First Dawn dissolved their memories into the soundscape itself. Their dormant god, a prototype of sound, hums at the center of an amphitheater of singing stones. The Preservers have built a cathedral here — a crystallized fortress that silences everything within ten tiles. It is the largest Preserver installation in the Frontier.',
          { speaker: 'Artun', type: 'read' },
        );
        await player.showText('Shh. Listen.', { speaker: 'Audiomancer Vess' });
        // Simulate faint singing sound
        await player.showText(
          "You can hear it? Most people can't. That's the Choir — the civilization that dissolved into the world's sound. They're still singing. Every breeze, every stone-hum, every rustle of grass — that's them.",
          { speaker: 'Vess' },
        );
        await player.showText(
          "The amphitheater at the center of the fields is where the singing is loudest. Something enormous hums there — a single note, A below middle C, that vibrates every Resonance Stone on the map. We've been trying to reach it, but the path is blocked by dissonant stones. The sound is painful. Overwhelming.",
          { speaker: 'Vess' },
        );
        await player.showText(
          "But you're an Architect. If you could harmonize three specific stones along the path — broadcast memories into them to tune them — the dissonance would resolve and the way would open.",
          { speaker: 'Vess' },
        );
        startQuest(player, 'SQ-09'); // "Harmonize the Path"
      }

      // --- 4. Fires effects (combat, GUI, screen effects, music) ---
      // Item give is handled in Reza's dialogue. No specific screen effects/music for this general scene.

      // --- 5. Updates quest state ---
      // Quests are activated during dialogue.
      // The main quest MQ-05 "The Frontier Opens" is completed once the player has explored all zones
      // and interacted with the key NPCs. This event marks the *start* of the open exploration.
      // We'll complete MQ-05 once all initial dialogues are triggered and the Light Lens is given.
      if (
        player.getVariable('SM_VASH_INTRO_DONE') &&
        player.getVariable('FV_REZA_INTRO_DONE') &&
        player.getVariable('RF_AUDIOMANCER_INTRO_DONE')
      ) {
        completeQuest(player, 'MQ-05');
      }
    }
  }
}

// Helper function to set up dynamic NPCs if needed, though for this scene,
// the NPCs are assumed to be static map elements.
export async function setupFrontierNPCs(_map: RpgMap) {
  // Example of creating Artun dynamically if he wasn't on the map
  // This is more for events that appear/disappear based on quest state.
  // For this scene, we assume Artun is a permanent fixture or handled by other events.
  /*
    if (map.id === 'shimmer_marsh') {
        map.createDynamicEvent({
            x: 12,
            y: 14,
            event: 'npc_artun', // Assuming 'npc_artun' is a registered RpgEvent class
            id: 'artun_shimmer_marsh'
        });
    }
    */
}

// Export the setup function as default
export default async function onReady(map: RpgMap) {
  // This function will be called when the map is ready.
  // We can use it to set up any initial dynamic events or conditions.
  // For this scene, the main logic is in TheFrontierOpensEvent, which is triggered by player movement.
  // We can ensure the event itself is present on the map.
  map.createDynamicEvent({
    x: 0, // Position doesn't matter much as it's triggered by map-enter logic
    y: 0,
    event: TheFrontierOpensEvent,
    id: 'act2-scene3-frontier-opens-trigger',
  });

  // If you need to dynamically place the NPCs for this scene, call the helper:
  // await setupFrontierNPCs(map);
}
