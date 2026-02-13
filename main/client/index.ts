import { type RpgClient, RpgModule } from '@rpgjs/client';
import { generatedSprites } from './characters/generated';

@RpgModule<RpgClient>({
  spritesheets: [...generatedSprites],
})
export default class RpgClientModule {}
