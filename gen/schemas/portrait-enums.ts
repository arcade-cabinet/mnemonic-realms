/** Portrait type and expression enums. */

import { z } from 'zod/v4';

export const PortraitTypeSchema = z.enum(['named', 'archetype', 'enemy', 'god']);
export type PortraitType = z.infer<typeof PortraitTypeSchema>;

export const ExpressionSchema = z.enum([
  'neutral',
  'happy',
  'sad',
  'angry',
  'surprised',
  'determined',
  'afraid',
  'thoughtful',
]);
export type Expression = z.infer<typeof ExpressionSchema>;
