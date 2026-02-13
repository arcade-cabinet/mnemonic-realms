/** Spritesheet enums and animation set schemas. */

import { z } from 'zod/v4';

export const SpriteCategorySchema = z.enum([
  'player',
  'companion',
  'npc',
  'enemy',
  'boss',
  'preserver',
]);
export type SpriteCategory = z.infer<typeof SpriteCategorySchema>;

export const SpriteSizeSchema = z.enum(['32x32', '64x64', '96x96']);
export type SpriteSize = z.infer<typeof SpriteSizeSchema>;

export const AnimationSetSchema = z.object({
  walk: z.boolean().default(true),
  idle: z.boolean().default(false),
  attack: z.boolean().default(false),
  cast: z.boolean().default(false),
  hit: z.boolean().default(false),
  death: z.boolean().default(false),
});
export type AnimationSet = z.infer<typeof AnimationSetSchema>;
