/**
 * Audio Generation Processor
 *
 * Processes BGM and ambient manifest entries through the synthesis pipeline.
 * Follows the same idempotency pattern as asset-processor.ts and code-processor.ts:
 * checks status + hash, skips if already generated, writes WAV then converts to OGG.
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { AmbientAsset } from '../schemas/audio-ambient';
import type { BgmAsset } from '../schemas/audio-bgm';
import type { GenerationMetadata } from '../schemas/common-generation';
import { composeAmbientLoop, composeBgmStem } from './audio-composer';

export interface AudioProcessResult {
  status: 'skipped' | 'generated' | 'failed';
  metadata?: GenerationMetadata;
  error?: string;
}

/** Minimum valid OGG file size (bytes). */
const MIN_OGG_BYTES = 512;

/** Hash a string descriptor for idempotency. */
function hashDescriptor(desc: string): string {
  return createHash('sha256').update(desc).digest('hex').slice(0, 16);
}

/** Hash a file buffer. */
function hashBuffer(data: Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

/** Check if an asset needs regeneration. */
function needsAudioRegeneration(
  _status: string,
  metadata: GenerationMetadata | undefined,
  descriptorHash: string,
  filePath: string,
): boolean {
  // If we have metadata, use hash-based idempotency
  if (metadata) {
    if (!existsSync(filePath)) return true;
    const fileData = readFileSync(filePath);
    if (fileData.length < MIN_OGG_BYTES) return true;
    if (metadata.promptHash !== descriptorHash) return true;
    return false;
  }

  // No metadata: if a valid output file already exists, skip
  // This handles the case where generation completed but manifest wasn't saved
  if (existsSync(filePath)) {
    const fileData = readFileSync(filePath);
    if (fileData.length >= MIN_OGG_BYTES) return false;
  }

  return true;
}

/** Convert a WAV buffer to OGG using ffmpeg (no shell, safe argument passing). */
function wavToOgg(wavBuffer: Buffer, outputPath: string): void {
  const tmpWav = outputPath.replace(/\.ogg$/, '.tmp.wav');
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(tmpWav, wavBuffer);

  try {
    execFileSync(
      'ffmpeg',
      [
        '-y',
        '-i',
        tmpWav,
        '-c:a',
        'libopus',
        '-b:a',
        '96k',
        '-ar',
        '48000',
        '-application',
        'audio',
        outputPath,
      ],
      { timeout: 60_000, stdio: 'pipe' },
    );
  } finally {
    if (existsSync(tmpWav)) unlinkSync(tmpWav);
  }
}

/** Build a unique descriptor string for a BGM stem (used for hashing). */
function bgmStemDescriptor(bgm: BgmAsset, layerIdx: number): string {
  const stem = bgm.stems[layerIdx];
  return JSON.stringify({
    id: bgm.id,
    layer: stem.layer,
    tempo: bgm.tempo,
    key: bgm.key,
    timeSignature: bgm.timeSignature,
    mood: bgm.mood,
    durationSec: bgm.durationSec,
    instruments: stem.instruments,
    description: stem.description,
    // Version bump this to force regeneration
    synthVersion: '1.0.0',
  });
}

/** Build a unique descriptor string for an ambient asset. */
function ambientDescriptor(asset: AmbientAsset): string {
  return JSON.stringify({
    id: asset.id,
    biome: asset.biome,
    description: asset.description,
    synthVersion: '1.0.0',
  });
}

// ---------- Public API ----------

/** Process a single BGM stem. */
export function processBgmStem(
  bgm: BgmAsset,
  stemIdx: number,
  outputDir: string,
  dryRun: boolean,
): AudioProcessResult {
  const stem = bgm.stems[stemIdx];
  const outputPath = resolve(outputDir, stem.filename);
  const descriptor = bgmStemDescriptor(bgm, stemIdx);
  const descHash = hashDescriptor(descriptor);

  // Check existing metadata on the parent asset
  const meta = (bgm as { stemMetadata?: Record<number, GenerationMetadata> }).stemMetadata?.[
    stem.layer
  ];

  if (!needsAudioRegeneration(bgm.status, meta, descHash, outputPath)) {
    return { status: 'skipped' };
  }

  if (dryRun) {
    console.log(`  [DRY RUN] Would generate: ${bgm.id} stem ${stem.layer}`);
    return { status: 'skipped' };
  }

  const start = Date.now();

  try {
    console.log(`    Synthesizing: ${bgm.id} / ${stem.filename}`);
    const wavBuffer = composeBgmStem(bgm, stem);
    wavToOgg(wavBuffer, outputPath);

    const oggData = readFileSync(outputPath);
    const elapsed = Date.now() - start;
    console.log(`      Done (${elapsed}ms, ${(oggData.length / 1024).toFixed(1)}KB)`);

    return {
      status: 'generated',
      metadata: {
        promptHash: descHash,
        outputHash: hashBuffer(oggData),
        generatedAt: new Date().toISOString(),
        generationTimeMs: elapsed,
        fileSizeBytes: oggData.length,
        model: 'synth-v1',
      },
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`      Failed: ${error}`);
    return { status: 'failed', error };
  }
}

/** Process a single ambient asset. */
export function processAmbientAsset(
  asset: AmbientAsset,
  outputDir: string,
  dryRun: boolean,
): AudioProcessResult {
  const outputPath = resolve(outputDir, asset.filename);
  const descriptor = ambientDescriptor(asset);
  const descHash = hashDescriptor(descriptor);

  const meta = (asset as { metadata?: GenerationMetadata }).metadata;

  if (!needsAudioRegeneration(asset.status, meta, descHash, outputPath)) {
    return { status: 'skipped' };
  }

  if (dryRun) {
    console.log(`  [DRY RUN] Would generate: ${asset.id}`);
    return { status: 'skipped' };
  }

  const start = Date.now();

  try {
    console.log(`    Synthesizing: ${asset.id} / ${asset.filename}`);
    const wavBuffer = composeAmbientLoop(asset);
    wavToOgg(wavBuffer, outputPath);

    const oggData = readFileSync(outputPath);
    const elapsed = Date.now() - start;
    console.log(`      Done (${elapsed}ms, ${(oggData.length / 1024).toFixed(1)}KB)`);

    return {
      status: 'generated',
      metadata: {
        promptHash: descHash,
        outputHash: hashBuffer(oggData),
        generatedAt: new Date().toISOString(),
        generationTimeMs: elapsed,
        fileSizeBytes: oggData.length,
        model: 'synth-v1',
      },
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`      Failed: ${error}`);
    return { status: 'failed', error };
  }
}
