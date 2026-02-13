import { Presets, Spritesheet } from '@rpgjs/client';

const { RMSpritesheet } = Presets;

@Spritesheet({
  images: {
    hero: require('./hero.png'),
    female13: require('./female13.png'),
    male1_1: require('./male1_1.png'),
    male4_1: require('./male4_1.png'),
    enemy: require('./enemy.png'),
    boss: require('./boss.png'),
    chest: require('./chest.png'),
  },
  width: 96,
  height: 128,
  ...RMSpritesheet(3, 4),
})
export class Characters {}
