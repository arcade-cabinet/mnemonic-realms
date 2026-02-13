/** DocRef schema — links assets to markdown bible sections. */

import { z } from 'zod/v4';

export const DocRefPurposeSchema = z.enum(['style', 'content', 'constraints', 'palette']);
export type DocRefPurpose = z.infer<typeof DocRefPurposeSchema>;

export const DocRefSchema = z.object({
  path: z.string().describe('Relative path from project root'),
  heading: z
    .string()
    .describe('Markdown heading text to locate (case-insensitive, without # prefix)'),
  purpose: DocRefPurposeSchema,
});
export type DocRef = z.infer<typeof DocRefSchema>;
