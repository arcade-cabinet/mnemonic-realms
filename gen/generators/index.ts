/**
 * Generators — Barrel Export
 *
 * Image generation, code generation, prompt assembly, and asset processing.
 */

// Image generation
export { processAsset } from './asset-processor';
// Audio generation
export { AUDIO_MANIFEST_MAP, runAudioBatch } from './audio-batch-runner';
export type { AudioProcessResult } from './audio-gen';
export { processAmbientAsset, processBgmStem } from './audio-gen';
export { runBatch } from './batch-runner';
// Code generation
export { runCodeBatch } from './code-batch-runner';
export { CODE_MANIFEST_MAP } from './code-config';
export type { CodeProcessResult } from './code-processor';
export { processCodeEntry } from './code-processor';
export { generateImage } from './image-gen';
export type { ManifestInfo } from './model-config';
export {
  CATEGORY_MODELS,
  loadManifest,
  MANIFEST_MAP,
  MODELS,
  RATE_LIMIT_MS,
  saveManifest,
} from './model-config';
export { assembleFullPrompt } from './prompt-assembly';
export { showStatus } from './status-report';
export { generateText } from './text-gen';
export { runTrial } from './trial-runner';
export type { AssetEntry, ProcessResult } from './types';
