/** Processes a single asset: idempotency check, prompt assembly, generation. */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { GoogleGenAI } from '@google/genai';
import { hashFile, hashPrompt, needsRegeneration } from '../schemas/common';
import { type AspectRatio, generateImage } from './image-gen';
import { isImagenModel, MODELS } from './model-config';
import { assembleFullPrompt } from './prompt-assembly';
import type { AssetEntry, ProcessResult } from './types';

export type { AssetEntry, ProcessResult };

export async function processAsset(
  ai: GoogleGenAI,
  asset: AssetEntry,
  outputDir: string,
  styleGuide: string | undefined,
  dryRun: boolean,
  categoryModel?: string,
  dirtyIds?: Set<string>,
): Promise<ProcessResult> {
  const outputPath = resolve(outputDir, asset.filename);
  const fileExists = existsSync(outputPath);
  const fileData = fileExists ? readFileSync(outputPath) : undefined;
  const fullPrompt = assembleFullPrompt(asset.prompt, asset.docRefs, styleGuide);
  const currentHash = hashPrompt(fullPrompt);

  const forcedDirty = dirtyIds?.has(asset.id) ?? false;
  if (
    !forcedDirty &&
    !needsRegeneration(
      asset.status as 'pending' | 'generating' | 'generated' | 'failed',
      asset.metadata,
      currentHash,
      fileExists,
      fileData,
    )
  ) {
    return { status: 'skipped' };
  }

  if (dryRun) {
    console.log(`  [DRY RUN] Would generate: ${asset.id}`);
    return { status: 'skipped' };
  }

  const model = categoryModel || MODELS.gemini;
  console.log(`  Generating: ${asset.id} [${model}]...`);
  const start = Date.now();

  let aspectRatio: AspectRatio | undefined;
  if (isImagenModel(model)) {
    const { width, height } = asset.dimensions;
    const ratio = width / height;
    if (ratio > 1.5) aspectRatio = '16:9';
    else if (ratio > 1.1) aspectRatio = '4:3';
    else if (ratio < 0.67) aspectRatio = '9:16';
    else if (ratio < 0.9) aspectRatio = '3:4';
    else aspectRatio = '1:1';
  }

  try {
    const { imageData } = await generateImage(
      ai,
      fullPrompt,
      asset.negativePrompt,
      model,
      aspectRatio,
    );
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, imageData);

    const elapsed = Date.now() - start;
    console.log(`    Done (${elapsed}ms, ${(imageData.length / 1024).toFixed(1)}KB)`);
    return {
      status: 'generated',
      metadata: {
        promptHash: currentHash,
        outputHash: hashFile(imageData),
        generatedAt: new Date().toISOString(),
        generationTimeMs: elapsed,
        fileSizeBytes: imageData.length,
        model,
        postProcessing: [],
      },
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`    Failed: ${error}`);
    return { status: 'failed', error };
  }
}
