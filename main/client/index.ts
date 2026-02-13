import { type RpgClient, RpgModule } from '@rpgjs/client';
import titleScreen from '../gui/title-screen.vue';
import { Characters } from './characters';

@RpgModule<RpgClient>({
  spritesheets: [Characters],
  sounds: [],
  gui: [titleScreen],
})
export default class RpgClientModule {}
