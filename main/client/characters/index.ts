import { Presets, Spritesheet } from '@rpgjs/client';

const { RMSpritesheet } = Presets;

@Spritesheet({
  images: {
    // Hero class variants (color-remapped from base Kenney roguelike character)
    hero: require('./hero.png'),
    warrior: require('./warrior.png'),
    'warrior-dark': require('./warrior-dark.png'),
    mage: require('./mage.png'),
    'mage-dark': require('./mage-dark.png'),
    rogue: require('./rogue.png'),
    'rogue-dark': require('./rogue-dark.png'),
    cleric: require('./cleric.png'),
    'cleric-dark': require('./cleric-dark.png'),
    // NPC variants
    'npc-villager': require('./npc-villager.png'),
    'npc-merchant': require('./npc-merchant.png'),
    'npc-elder': require('./npc-elder.png'),
    // Enemy variants
    enemy: require('./enemy.png'),
    'enemy-strong': require('./enemy-strong.png'),
    boss: require('./boss.png'),
    // Objects
    chest: require('./chest.png'),
  },
  width: 96,
  height: 128,
  ...RMSpritesheet(3, 4),
})
export class Characters {}
