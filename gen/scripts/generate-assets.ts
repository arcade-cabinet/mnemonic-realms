#!/usr/bin/env npx tsx
/**
 * GenAI Asset Generation CLI — Manifest-Driven
 *
 * Scans manifest.json files in gen/manifests/ and generates assets
 * via Google Gemini. Updates manifests with generation metadata.
 *
 * Key features:
 * - DocRef resolution: auto-loads bible sections as prompt context
 * - Prompt hashing: idempotent re-runs skip up-to-date assets
 * - Post-processing: downscale to pixel-perfect dimensions
 * - Rate limiting: 2s between API calls to respect Gemini quotas
 *
 * Usage:
 *   pnpm exec tsx gen/scripts/generate-assets.ts tilesets       # Generate tilesets
 *   pnpm exec tsx gen/scripts/generate-assets.ts sprites        # Generate sprites
 *   pnpm exec tsx gen/scripts/generate-assets.ts portraits      # Generate portraits
 *   pnpm exec tsx gen/scripts/generate-assets.ts items          # Generate item icons
 *   pnpm exec tsx gen/scripts/generate-assets.ts all            # Generate everything
 *   pnpm exec tsx gen/scripts/generate-assets.ts status         # Show generation status
 *   pnpm exec tsx gen/scripts/generate-assets.ts tilesets 0     # Generate first tileset only
 *   pnpm exec tsx gen/scripts/generate-assets.ts --dry-run all  # Show what would generate
 *
 * Environment:
 *   GOOGLE_API_KEY or GEMINI_API_KEY — required for generation
 */

import 'dotenv/config';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { GoogleGenAI } from '@google/genai';
import { assembleDocRefContext } from './markdown-loader';
import { hashPrompt, hashFile, needsRegeneration } from '../schemas/common';
import type {
  GenerationMetadata,
  TilesetManifest,
  SpritesheetManifest,
  PortraitManifest,
  ItemIconManifest,
  DocRef,
} from '../schemas/index';

// ============================================================================
// CONFIG
// ============================================================================

const PROJECT_ROOT = resolve(import.meta.dirname ?? process.cwd(), import.meta.dirname ? '../..' : '.');
const MANIFESTS_DIR = resolve(PROJECT_ROOT, 'gen/manifests');
const OUTPUT_DIR = resolve(PROJECT_ROOT, 'gen/output');

/**
 * Model selection per asset category:
 * - Gemini models use `generateContent` with responseModalities: ['image', 'text']
 * - Imagen models use `generateImages` (different API, no text reasoning)
 *
 * Gemini models are better for structured layouts (tileset grids, spritesheet frames)
 * because they reason about the prompt. Imagen 4 produces higher-fidelity standalone
 * images and is much cheaper for bulk generation.
 *
 * Available models (Feb 2026):
 *   gemini-2.5-flash-image      — fast, cheap, good prompt following
 *   gemini-3-pro-image-preview  — premium quality, complex prompts, 1K-4K
 *   imagen-4.0-generate-001     — high fidelity standalone images
 *   imagen-4.0-ultra-generate-001 — highest quality, 2K
 *   imagen-4.0-fast-generate-001  — bulk generation, $0.02/image
 */
const MODELS = {
  /** Gemini: good at structured grid layouts */
  gemini: 'gemini-2.5-flash-image',
  /** Gemini Pro: premium quality, complex prompts */
  geminiPro: 'gemini-3-pro-image-preview',
  /** Imagen 4: high-fidelity standalone images */
  imagen: 'imagen-4.0-generate-001',
  /** Imagen 4 Ultra: highest quality */
  imagenUltra: 'imagen-4.0-ultra-generate-001',
  /** Imagen 4 Fast: bulk generation, cheapest */
  imagenFast: 'imagen-4.0-fast-generate-001',
};

/**
 * Default model per asset category.
 *
 * All categories use Flash to minimize cost at scale (~215 assets in v2).
 * Gemini Pro was tested for portraits but the quality uplift doesn't justify
 * the cost multiplier across 24+ portrait assets.
 *
 * Gemini models produce far better results than Imagen for stylized pixel art
 * because they reason about art direction, grid layouts, and style constraints.
 */
const CATEGORY_MODELS: Record<string, string> = {
  tilesets: MODELS.gemini,      // needs layout reasoning for tile grids
  sprites: MODELS.gemini,       // needs RPG Maker format understanding
  portraits: MODELS.gemini,     // flash for cost — quality is sufficient for 128×128 pixel art
  items: MODELS.gemini,         // still needs pixel art style reasoning
};

function isImagenModel(model: string): boolean {
  return model.startsWith('imagen-');
}

const RATE_LIMIT_MS = 2000;

// ============================================================================
// MANIFEST LOADING
// ============================================================================

interface ManifestInfo {
  type: string;
  path: string;
  outputDir: string;
}

const MANIFEST_MAP: Record<string, ManifestInfo> = {
  tilesets: { type: 'tilesets', path: resolve(MANIFESTS_DIR, 'tilesets/manifest.json'), outputDir: resolve(OUTPUT_DIR, 'tilesets') },
  sprites: { type: 'sprites', path: resolve(MANIFESTS_DIR, 'sprites/manifest.json'), outputDir: resolve(OUTPUT_DIR, 'sprites') },
  portraits: { type: 'portraits', path: resolve(MANIFESTS_DIR, 'portraits/manifest.json'), outputDir: resolve(OUTPUT_DIR, 'portraits') },
  items: { type: 'items', path: resolve(MANIFESTS_DIR, 'items/manifest.json'), outputDir: resolve(OUTPUT_DIR, 'items') },
};

function loadManifest<T>(info: ManifestInfo): T {
  const content = readFileSync(info.path, 'utf-8');
  return JSON.parse(content);
}

function saveManifest(info: ManifestInfo, manifest: unknown): void {
  writeFileSync(info.path, JSON.stringify(manifest, null, 2));
}

// ============================================================================
// PROMPT ASSEMBLY
// ============================================================================

/**
 * Build the full prompt for an asset by combining:
 * 1. The asset's base prompt
 * 2. Resolved DocRef sections from the game bible
 * 3. The manifest's global style guide (if applicable)
 */
function assembleFullPrompt(
  basePrompt: string,
  docRefs: DocRef[],
  styleGuide?: string,
): string {
  const parts: string[] = [];

  if (styleGuide) {
    parts.push(`[GLOBAL STYLE GUIDE]\n${styleGuide}`);
  }

  parts.push(basePrompt);

  const docContext = assembleDocRefContext(docRefs);
  if (docContext) {
    parts.push(docContext);
  }

  return parts.join('\n\n');
}

// ============================================================================
// IMAGE GENERATION
// ============================================================================

/**
 * Generate an image using Gemini models (generateContent API).
 * Gemini reasons about the prompt, making it ideal for structured layouts.
 */
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
      // responseMediaType is valid at runtime but not in the SDK's type defs
      responseMediaType: 'image/png',
    } as Record<string, unknown>,
  });

  // Extract image from response
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

/**
 * Generate an image using Imagen 4 models (generateImages API).
 * Imagen produces higher-fidelity standalone images but doesn't reason about layout.
 */
async function generateImageImagen(
  ai: GoogleGenAI,
  prompt: string,
  _negativePrompt: string | undefined,
  model: string,
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' = '1:1',
): Promise<{ imageData: Buffer; mimeType: string }> {
  const response = await ai.models.generateImages({
    model,
    prompt,
    config: {
      numberOfImages: 1,
      aspectRatio,
    },
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

/**
 * Unified image generation — dispatches to Gemini or Imagen based on model name.
 */
async function generateImage(
  ai: GoogleGenAI,
  prompt: string,
  negativePrompt: string | undefined,
  model: string,
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9',
): Promise<{ imageData: Buffer; mimeType: string }> {
  if (isImagenModel(model)) {
    return generateImageImagen(ai, prompt, negativePrompt, model, aspectRatio);
  }
  return generateImageGemini(ai, prompt, negativePrompt, model);
}

// ============================================================================
// ASSET PROCESSING
// ============================================================================

interface AssetEntry {
  id: string;
  prompt: string;
  negativePrompt?: string;
  docRefs: DocRef[];
  filename: string;
  status: string;
  metadata?: GenerationMetadata;
  dimensions: { width: number; height: number; genWidth: number; genHeight: number };
}

async function processAsset(
  ai: GoogleGenAI,
  asset: AssetEntry,
  outputDir: string,
  styleGuide: string | undefined,
  force: boolean,
  dryRun: boolean,
  categoryModel?: string,
): Promise<{ status: 'skipped' | 'generated' | 'failed'; metadata?: GenerationMetadata; error?: string }> {
  const outputPath = resolve(outputDir, asset.filename);
  const fileExists = existsSync(outputPath);
  const fileData = fileExists ? readFileSync(outputPath) : undefined;

  // Build full prompt
  const fullPrompt = assembleFullPrompt(asset.prompt, asset.docRefs, styleGuide);
  const currentHash = hashPrompt(fullPrompt);

  // Idempotency check: prompt hash + file existence + file integrity
  if (!force && !needsRegeneration(
    asset.status as 'pending' | 'generating' | 'generated' | 'failed',
    asset.metadata,
    currentHash,
    fileExists,
    fileData,
  )) {
    return { status: 'skipped' };
  }

  if (dryRun) {
    console.log(`  [DRY RUN] Would generate: ${asset.id}`);
    console.log(`    Prompt length: ${fullPrompt.length} chars`);
    console.log(`    Output: ${outputPath}`);
    console.log(`    Dimensions: ${asset.dimensions.genWidth}×${asset.dimensions.genHeight} → ${asset.dimensions.width}×${asset.dimensions.height}`);
    return { status: 'skipped' };
  }

  const model = categoryModel || MODELS.gemini;
  console.log(`  Generating: ${asset.id} [${model}]...`);
  const start = Date.now();

  // Determine aspect ratio for Imagen models based on asset dimensions
  let aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | undefined;
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
    const { imageData } = await generateImage(ai, fullPrompt, asset.negativePrompt, model, aspectRatio);

    // Write raw output (post-processing with sharp would be a separate step)
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, imageData);

    const elapsed = Date.now() - start;
    const metadata: GenerationMetadata = {
      promptHash: currentHash,
      outputHash: hashFile(imageData),
      generatedAt: new Date().toISOString(),
      generationTimeMs: elapsed,
      fileSizeBytes: imageData.length,
      model,
      postProcessing: [],
    };

    console.log(`    Done (${elapsed}ms, ${(imageData.length / 1024).toFixed(1)}KB)`);
    return { status: 'generated', metadata };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`    Failed: ${error}`);
    return { status: 'failed', error };
  }
}

// ============================================================================
// STATUS REPORT
// ============================================================================

function showStatus(): void {
  console.log('Mnemonic Realms — Asset Generation Status\n');

  for (const [name, info] of Object.entries(MANIFEST_MAP)) {
    if (!existsSync(info.path)) {
      console.log(`${name}: no manifest found`);
      continue;
    }

    const manifest = loadManifest<{ assets: AssetEntry[] }>(info);
    const total = manifest.assets.length;
    const pending = manifest.assets.filter((a) => a.status === 'pending').length;
    const generated = manifest.assets.filter((a) => a.status === 'generated').length;
    const failed = manifest.assets.filter((a) => a.status === 'failed').length;
    const generating = manifest.assets.filter((a) => a.status === 'generating').length;

    console.log(`${name}: ${total} assets`);
    console.log(`  generated: ${generated}  pending: ${pending}  failed: ${failed}  in-progress: ${generating}`);

    if (failed > 0) {
      const failedAssets = manifest.assets.filter((a) => a.status === 'failed');
      for (const a of failedAssets) {
        console.log(`    FAILED: ${a.id} — ${(a as { lastError?: string }).lastError || 'unknown error'}`);
      }
    }
    console.log();
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  const modelFlagIdx = args.indexOf('--model');
  const modelOverride = modelFlagIdx >= 0 ? args[modelFlagIdx + 1] : undefined;
  const filteredArgs = args.filter((a, i) => !a.startsWith('--') && (modelFlagIdx < 0 || i !== modelFlagIdx + 1));

  if (filteredArgs.length === 0 || filteredArgs[0] === 'status') {
    showStatus();
    return;
  }

  const target = filteredArgs[0];
  const index = filteredArgs[1] !== undefined ? parseInt(filteredArgs[1], 10) : undefined;

  // Trial mode: generate one representative asset from each category
  if (target === 'trial') {
    const trialPicks: [string, number][] = [
      ['tilesets', 2],    // tileset-village-vivid — most detailed variant
      ['sprites', 0],     // sprite-player-warrior — the hero
      ['portraits', 1],   // portrait-protagonist-happy
      ['items', 6],       // MF-GENERIC — memory fragment icon
    ];

    console.log('Mnemonic Realms — Trial Generation (4 assets)\n');

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey && !dryRun) {
      console.error('Error: GOOGLE_API_KEY or GEMINI_API_KEY required');
      process.exit(1);
    }
    const trialAi = apiKey ? new GoogleGenAI({ apiKey }) : null;

    for (const [cat, idx] of trialPicks) {
      const info = MANIFEST_MAP[cat];
      if (!info || !existsSync(info.path)) continue;
      const manifest = loadManifest<{ assets: AssetEntry[]; styleGuide?: string }>(info);
      const asset = manifest.assets[idx];
      if (!asset) continue;

      const result = await processAsset(trialAi!, asset, info.outputDir, manifest.styleGuide, force, dryRun, CATEGORY_MODELS[cat]);

      const manifestAsset = manifest.assets[idx];
      if (result.status !== 'skipped') {
        manifestAsset.status = result.status;
        if (result.metadata) manifestAsset.metadata = result.metadata;
        if (result.error) (manifestAsset as { lastError?: string }).lastError = result.error;
        saveManifest(info, manifest);
      }

      console.log(`  ${asset.id}: ${result.status}`);
      if (result.status === 'generated' && trialAi) {
        await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
      }
    }

    console.log('\nTrial complete. Check gen/output/ for results.');
    return;
  }

  // Resolve API key
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey && !dryRun) {
    console.error('Error: GOOGLE_API_KEY or GEMINI_API_KEY environment variable required');
    console.error('Set it in .env or export it in your shell');
    process.exit(1);
  }

  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  console.log('Mnemonic Realms — Asset Generation\n');

  const targets = target === 'all' ? Object.keys(MANIFEST_MAP) : [target];

  for (const t of targets) {
    const info = MANIFEST_MAP[t];
    if (!info) {
      console.error(`Unknown target: ${t}`);
      console.error(`Available: ${Object.keys(MANIFEST_MAP).join(', ')}, all, status`);
      process.exit(1);
    }

    if (!existsSync(info.path)) {
      console.error(`Manifest not found: ${info.path}`);
      console.error('Run: pnpm exec tsx gen/scripts/build-manifests.ts');
      process.exit(1);
    }

    const manifest = loadManifest<{ assets: AssetEntry[]; styleGuide?: string }>(info);
    const assets = index !== undefined ? [manifest.assets[index]] : manifest.assets;

    if (index !== undefined && !manifest.assets[index]) {
      console.error(`Asset index ${index} out of range (0-${manifest.assets.length - 1})`);
      process.exit(1);
    }

    console.log(`Processing ${t}: ${assets.length} asset(s)\n`);

    let generated = 0;
    let skipped = 0;
    let failed = 0;

    for (const asset of assets) {
      if (!ai && !dryRun) break;

      const result = await processAsset(
        ai!,
        asset,
        info.outputDir,
        manifest.styleGuide,
        force,
        dryRun,
        modelOverride || CATEGORY_MODELS[t],
      );

      // Update asset status in manifest
      const manifestAsset = manifest.assets.find((a) => a.id === asset.id);
      if (manifestAsset && result.status !== 'skipped') {
        manifestAsset.status = result.status;
        if (result.metadata) {
          manifestAsset.metadata = result.metadata;
        }
        if (result.error) {
          (manifestAsset as { lastError?: string }).lastError = result.error;
        }
      }

      switch (result.status) {
        case 'generated': generated++; break;
        case 'skipped': skipped++; break;
        case 'failed': failed++; break;
      }

      // Rate limiting between API calls
      if (result.status === 'generated' && ai) {
        await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
      }
    }

    // Save updated manifest
    if (!dryRun && (generated > 0 || failed > 0)) {
      saveManifest(info, manifest);
      console.log(`  Manifest updated: ${info.path}`);
    }

    console.log(`\n${t} summary: ${generated} generated, ${skipped} skipped, ${failed} failed\n`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
