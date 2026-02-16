/** Text generation via Gemini API (code/text output, no images). */

import type { GoogleGenAI } from '@google/genai';

/**
 * Generate text/code using Gemini with text-only output.
 * Used for code generation pipeline (TypeScript, Vue, etc.).
 *
 * @param maxOutputTokens - Override default token limit (default: 16384).
 *   TMX maps need 65536 for large tile data arrays.
 */
export async function generateText(
  ai: GoogleGenAI,
  systemPrompt: string,
  userPrompt: string,
  model: string,
  maxOutputTokens = 16384,
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.2,
      maxOutputTokens,
    },
  });

  // Check finish reason for diagnostics
  const candidate = response.candidates?.[0];
  const finishReason = candidate?.finishReason;
  if (finishReason && finishReason !== 'STOP' && finishReason !== 'MAX_TOKENS') {
    console.warn(`    Gemini finishReason: ${finishReason}`);
  }

  const text = response.text;
  if (!text) {
    const reason = finishReason || 'unknown';
    throw new Error(`No text content in Gemini response (finishReason: ${reason})`);
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
