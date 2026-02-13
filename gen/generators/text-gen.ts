/** Text generation via Gemini API (code/text output, no images). */

import type { GoogleGenAI } from '@google/genai';

/**
 * Generate text/code using Gemini with text-only output.
 * Used for code generation pipeline (TypeScript, Vue, etc.).
 */
export async function generateText(
  ai: GoogleGenAI,
  systemPrompt: string,
  userPrompt: string,
  model: string,
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.2,
      maxOutputTokens: 4096,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('No text content in Gemini response');
  }

  return stripMarkdownFences(text);
}

/** Remove markdown code fences if the model wraps output in them. */
function stripMarkdownFences(text: string): string {
  let result = text.trim();
  if (result.startsWith('```typescript') || result.startsWith('```ts')) {
    result = result.replace(/^```(?:typescript|ts)\n?/, '');
  } else if (result.startsWith('```')) {
    result = result.replace(/^```\w*\n?/, '');
  }
  if (result.endsWith('```')) {
    result = result.replace(/\n?```$/, '');
  }
  return result.trim();
}
