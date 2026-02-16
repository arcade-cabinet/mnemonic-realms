/**
 * Generators — Barrel Export
 *
 * Code generation, audio generation, prompt assembly, and model config.
 */

// Audio generation
export { AUDIO_MANIFEST_MAP, runAudioBatch } from './audio-batch-runner';
export type { AudioProcessResult } from './audio-gen';
export { processAmbientAsset, processBgmStem } from './audio-gen';
// Code generation
export { runCodeBatch } from './code-batch-runner';
export { CODE_MANIFEST_MAP } from './code-config';
export type { CodeProcessResult } from './code-processor';
export { processCodeEntry } from './code-processor';
export type { ManifestInfo } from './model-config';
export {
  loadManifest,
  MANIFESTS_DIR,
  OUTPUT_DIR,
  PROJECT_ROOT,
  RATE_LIMIT_MS,
  saveManifest,
} from './model-config';
export { assembleFullPrompt } from './prompt-assembly';
export { generateText } from './text-gen';
export type { AssetEntry, ProcessResult } from './types';
