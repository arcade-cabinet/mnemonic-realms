import { type RpgClient, RpgModule, type RpgSceneMap, type RpgSceneMapHooks } from '@rpgjs/client';
import { SCALE_MODES, settings } from 'pixi.js';
import BattleUi from '../gui/battle-ui.vue';
import CreditsScreen from '../gui/credits.vue';
import DialogueBox from '../gui/dialogue-box.vue';
import GameOver from '../gui/game-over.vue';
import Hud from '../gui/hud.vue';
import TitleScreen from '../gui/title-screen.vue';
import { audioManager } from './audio';
import { aliasSprites } from './characters/aliases';
import { generatedSprites } from './characters/generated';
import { initVibrancySystem, resetParticles, resetVibrancy, resetZoneEffects } from './effects';

// Snap all sprite positions to integer pixels — eliminates tile seam gaps in pixel-art rendering.
settings.ROUND_PIXELS = true;
// Use nearest-neighbor scaling for crisp pixel art (no blurry interpolation).
settings.SCALE_MODE = SCALE_MODES.NEAREST;

/** Target number of tiles visible across the screen width — adjusts zoom for any screen. */
const TARGET_TILES_ACROSS = 14;

function applyResponsiveZoom(scene: RpgSceneMap) {
  const viewport = (scene as any).viewport;
  if (!viewport) return;
  const tileWidth = (scene as any).tileWidth || 32;
  const rawZoom = viewport.screenWidth / (TARGET_TILES_ACROSS * tileWidth);
  const zoom = Math.max(1, Math.round(rawZoom));
  viewport.setZoom(zoom, true);
}

const sceneMap: RpgSceneMapHooks = {
  onAfterLoading(scene: RpgSceneMap) {
    applyResponsiveZoom(scene);

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
  spritesheets: [...generatedSprites, ...aliasSprites],
  gui: [TitleScreen, DialogueBox, Hud, GameOver, CreditsScreen, BattleUi],
  scenes: {
    map: sceneMap,
  },
})
export default class RpgClientModule {}
