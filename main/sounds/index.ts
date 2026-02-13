import { Sound } from '@rpgjs/client';

@Sound({
  sounds: {
    'bgm-overworld': require('./bgm-overworld.ogg'),
    'bgm-dungeon': require('./bgm-dungeon.ogg'),
  },
  loop: true,
  volume: 0.4,
})
export class BgmSounds {}

@Sound({
  sounds: {
    'sfx-attack': require('./sfx-attack.ogg'),
    'sfx-hit': require('./sfx-hit.ogg'),
    'sfx-item': require('./sfx-item.ogg'),
    'sfx-levelup': require('./sfx-levelup.ogg'),
    'sfx-victory': require('./sfx-victory.ogg'),
    'sfx-menu': require('./sfx-menu.ogg'),
  },
  loop: false,
  volume: 0.6,
})
export class SfxSounds {}
