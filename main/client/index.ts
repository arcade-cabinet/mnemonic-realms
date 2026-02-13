import { type RpgClient, RpgModule } from '@rpgjs/client';
import combat from '../gui/combat.vue';
import gameOver from '../gui/game-over.vue';
import hud from '../gui/hud.vue';
import titleScreen from '../gui/title-screen.vue';
import victory from '../gui/victory.vue';
import { Characters } from './characters';

@RpgModule<RpgClient>({
  spritesheets: [Characters],
  sounds: [],
  gui: [titleScreen, hud, combat, gameOver, victory],
})
export default class RpgClientModule {}
