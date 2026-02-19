import { type RpgClient, RpgModule, type RpgSceneMap, type RpgSceneMapHooks } from '@rpgjs/client';
import { SCALE_MODES, settings } from 'pixi.js';
import { registerServiceWorker } from '../../src/pwa/register.js';
import BattleUi from '../gui/battle-ui.vue';
import CreditsScreen from '../gui/credits.vue';
import DialogueBox from '../gui/dialogue-box.vue';
import GameOver from '../gui/game-over.vue';
import Hud from '../gui/hud.vue';
import InventoryScreen from '../gui/inventory.vue';
import MemoryAlbum from '../gui/memory-album.vue';
import PauseMenu from '../gui/pause-menu.vue';
import QuestLog from '../gui/quest-log.vue';
import ShopScreen from '../gui/shop.vue';
import TitleScreen from '../gui/title-screen.vue';
import { audioManager } from './audio';
import { aliasSprites } from './characters/aliases';
import { generatedSprites } from './characters/generated';
import {
  initCombatEventWiring,
  initMemoryEventWiring,
  initVibrancySystem,
  resetCombatEventWiring,
  resetMemoryEventWiring,
  resetParticles,
  resetVibrancy,
  resetZoneEffects,
} from './effects';

// Snap all sprite positions to integer pixels — eliminates tile seam gaps in pixel-art rendering.
settings.ROUND_PIXELS = true;
// Use nearest-neighbor scaling for crisp pixel art (no blurry interpolation).
settings.SCALE_MODE = SCALE_MODES.NEAREST;

/** Target number of tiles visible across the screen width — adjusts zoom for any screen. */
const TARGET_TILES_ACROSS = 14;

function applyResponsiveZoom(scene: RpgSceneMap) {
  // biome-ignore lint/suspicious/noExplicitAny: RPG-JS scene internals are untyped
  const viewport = (scene as any).viewport;
  if (!viewport) return;
  // biome-ignore lint/suspicious/noExplicitAny: RPG-JS scene internals are untyped
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
    resetMemoryEventWiring();
    resetCombatEventWiring();
    initVibrancySystem();
    initMemoryEventWiring();
    initCombatEventWiring();
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
  gui: [
    TitleScreen,
    DialogueBox,
    Hud,
    GameOver,
    CreditsScreen,
    BattleUi,
    InventoryScreen,
    QuestLog,
    MemoryAlbum,
    ShopScreen,
    PauseMenu,
  ],
  scenes: {
    map: sceneMap,
  },
})
export default class RpgClientModule {}

// Register service worker for PWA offline support
registerServiceWorker().catch((error) => {
  console.warn('Service worker registration failed:', error);
});
