/**
 * Auto-generated spritesheet bindings from GenAI pipeline.
 * DO NOT EDIT — regenerate with: pnpm exec tsx gen/scripts/integrate-assets.ts sprites
 */

import { Spritesheet, Presets } from '@rpgjs/client';
const { RMSpritesheet } = Presets;

@Spritesheet({
  id: 'sprite-player-warrior',
  image: require('./player-warrior-walk.webp'),
  ...RMSpritesheet(32, 32),
})
export class PlayerWarriorSprite {}

/** All generated sprite classes for RpgModule registration */
export const generatedSprites = [PlayerWarriorSprite];
