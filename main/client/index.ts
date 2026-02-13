import { type RpgClient, RpgModule, type RpgSceneMap, type RpgSceneMapHooks } from '@rpgjs/client';
import DialogueBox from '../gui/dialogue-box.vue';
import TitleScreen from '../gui/title-screen.vue';
import { audioManager } from './audio';
import { generatedSprites } from './characters/generated';
import { initVibrancySystem, resetParticles, resetVibrancy, resetZoneEffects } from './effects';

const sceneMap: RpgSceneMapHooks = {
  onAfterLoading(scene: RpgSceneMap) {
    resetParticles();
    resetVibrancy();
    resetZoneEffects();
    initVibrancySystem();
    // Trigger zone audio change based on current map
    audioManager.init().then(() => {
      const mapId = (scene as RpgSceneMap & { data?: { id?: string } })?.data?.id ?? '';
      if (mapId) {
        audioManager.changeZone(mapId).catch(() => {});
      }
    });
  },
};

@RpgModule<RpgClient>({
  spritesheets: [...generatedSprites],
  gui: [TitleScreen, DialogueBox],
  scenes: {
    map: sceneMap,
  },
})
export default class RpgClientModule {}
