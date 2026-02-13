/** Image generation via Gemini and Imagen APIs. */

import type { GoogleGenAI } from '@google/genai';
import { isImagenModel } from './model-config';

/** Generate an image using Gemini (generateContent with image modality). */
async function generateImageGemini(
  ai: GoogleGenAI,
  prompt: string,
  negativePrompt: string | undefined,
  model: string,
): Promise<{ imageData: Buffer; mimeType: string }> {
  const fullPrompt = negativePrompt
    ? `${prompt}\n\nIMPORTANT: Do NOT include: ${negativePrompt}`
    : prompt;

  const response = await ai.models.generateContent({
    model,
    contents: fullPrompt,
    config: {
      responseModalities: ['image', 'text'],
      responseMediaType: 'image/png',
    } as Record<string, unknown>,
  });

  const part = response.candidates?.[0]?.content?.parts?.find(
    (p: { inlineData?: { mimeType: string } }) => p.inlineData?.mimeType?.startsWith('image/'),
  );

  if (!part?.inlineData?.data) {
    throw new Error('No image data in Gemini response');
  }

  return {
    imageData: Buffer.from(part.inlineData.data, 'base64'),
    mimeType: part.inlineData.mimeType,
  };
}

/** Generate an image using Imagen 4 (generateImages API). */
async function generateImageImagen(
  ai: GoogleGenAI,
  prompt: string,
  model: string,
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' = '1:1',
): Promise<{ imageData: Buffer; mimeType: string }> {
  const response = await ai.models.generateImages({
    model,
    prompt,
    config: { numberOfImages: 1, aspectRatio },
  });

  const image = response.generatedImages?.[0];
  if (!image?.image?.imageBytes) {
    throw new Error('No image data in Imagen response');
  }

  return {
    imageData: Buffer.from(image.image.imageBytes, 'base64'),
    mimeType: 'image/png',
  };
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

/** Unified image generation — dispatches to Gemini or Imagen based on model name. */
export async function generateImage(
  ai: GoogleGenAI,
  prompt: string,
  negativePrompt: string | undefined,
  model: string,
  aspectRatio?: AspectRatio,
): Promise<{ imageData: Buffer; mimeType: string }> {
  if (isImagenModel(model)) {
    return generateImageImagen(ai, prompt, model, aspectRatio);
  }
  return generateImageGemini(ai, prompt, negativePrompt, model);
}
