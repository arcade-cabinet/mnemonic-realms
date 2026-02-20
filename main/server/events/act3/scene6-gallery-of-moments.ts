import { EventData, RpgEvent, type RpgMap, type RpgPlayer } from '@rpgjs/server';

@EventData({
  id: 'act3-scene6-gallery-of-moments',
  name: 'Floor 1 — The Gallery of Moments Events',
  map: 'fortress-f1',
})
export default class GalleryOfMomentsEvent extends RpgEvent {
  onInit() {
    // This event is a controller — no graphic needed.
  }

  async onPlayerEnter(player: RpgPlayer) {
    // Ensure this logic only runs once per map entry for the main narrative flow
    if (player.getVariable('MQ-09_GalleryEntered')) {
      return;
    }

    player.setVariable('MQ-09_GalleryEntered', true);

    const currentMap = player.map as RpgMap;
    if (!currentMap) return;

    // Spawn Hana
    const hanaEvent = await currentMap.createDynamicEvent({
      x: 5,
      y: 5,
      graphic: 'npc_hana',
    });

    // Spawn Artun
    const artunEvent = await currentMap.createDynamicEvent({
      x: 15,
      y: 10,
      graphic: 'npc_artun',
    });

    // Hana dialogue
    await player.showText(
      'Hana: More frozen people. The Curator has been collecting these for years.',
    );

    // Conditional dialogue based on Act II choice
    const preservedFestival = player.getVariable('ACT2_FROZEN_FESTIVAL_PRESERVED');
    if (preservedFestival === true) {
      await player.showText(
        'Artun: The one in Resonance Fields... that was a test. The Curator was deciding whether to add it to the Gallery.',
      );
    } else if (preservedFestival === false) {
      await player.showText(
        'A Preserver Archivist ambushes from the side, motivated by anger at your previous destruction!',
      );
    }

    // Artun dialogue
    await player.showText('Artun (stopping): This one... this one is hard.');
    await player.showText(
      "Artun: That child learned to walk. That parent was proud. And the Curator froze it because it was the most perfect moment of that child's life.",
    );
    await player.showText(
      'Artun: But the child never learned to run. Never learned to fall and get back up. Never grew into the person those first steps were leading toward.',
    );
    await player.showText(
      "Artun: Perfect moments aren't meant to last. They're meant to lead somewhere.",
    );

    // Clean up NPCs
    if (hanaEvent) hanaEvent.remove();
    if (artunEvent) artunEvent.remove();
  }
}
